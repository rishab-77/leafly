"""Train the Leafly disease classifier from a VS Code-friendly Python script.

Usage:
    python leafly_train.py --data-dir ./data --output-dir ./saved_models

This script replicates the notebook preprocessing and training flow:
  - HSV leaf segmentation
  - CLAHE in LAB L-channel
  - Resize / normalize
  - Train/val/test loaders
  - EfficientNet-B3 transfer learning
"""

import argparse
import json
import os
from pathlib import Path

import cv2
import matplotlib.pyplot as plt
import numpy as np
import timm
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms
from PIL import Image


class LeafSegmentation:
    """Segment leaf from background using HSV and contour filtering."""

    def __call__(self, img: Image.Image) -> Image.Image:
        img_cv = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
        hsv = cv2.cvtColor(img_cv, cv2.COLOR_BGR2HSV)

        lower_green1 = np.array([25, 30, 30])
        upper_green1 = np.array([95, 255, 255])
        mask = cv2.inRange(hsv, lower_green1, upper_green1)

        kernel_close = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))
        kernel_open = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))

        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel_close, iterations=3)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel_open, iterations=1)

        mask = self._keep_largest_contour(mask)
        mask = self._fill_holes(mask)

        mask_blur = cv2.GaussianBlur(mask, (7, 7), 0)
        _, mask_clean = cv2.threshold(mask_blur, 127, 255, cv2.THRESH_BINARY)

        result = img_cv.copy()
        result[mask_clean == 0] = [255, 255, 255]
        return Image.fromarray(cv2.cvtColor(result, cv2.COLOR_BGR2RGB))

    @staticmethod
    def _keep_largest_contour(mask: np.ndarray) -> np.ndarray:
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if not contours:
            return mask
        new_mask = np.zeros_like(mask)
        largest = max(contours, key=cv2.contourArea)
        cv2.drawContours(new_mask, [largest], -1, 255, thickness=cv2.FILLED)
        return new_mask

    @staticmethod
    def _fill_holes(mask: np.ndarray) -> np.ndarray:
        flood = mask.copy()
        h, w = flood.shape
        flood_mask = np.zeros((h + 2, w + 2), dtype=np.uint8)
        cv2.floodFill(flood, flood_mask, (0, 0), 255)
        holes = cv2.bitwise_not(flood)
        return cv2.bitwise_or(mask, holes)


class CLAHETransform:
    """Apply CLAHE only to the L channel in LAB space."""

    def __init__(self, clip_limit: float = 2.0, tile_grid_size: tuple = (8, 8)):
        self.clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=tile_grid_size)

    def __call__(self, img: Image.Image) -> Image.Image:
        img_bgr = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
        img_lab = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB)

        l, a, b = cv2.split(img_lab)
        l_clahe = self.clahe.apply(l)

        img_lab_clahe = cv2.merge((l_clahe, a, b))
        img_bgr_clahe = cv2.cvtColor(img_lab_clahe, cv2.COLOR_LAB2BGR)
        img_rgb_clahe = cv2.cvtColor(img_bgr_clahe, cv2.COLOR_BGR2RGB)

        return Image.fromarray(img_rgb_clahe)


def get_transforms(img_size: int = 224, training: bool = True):
    steps = [
        LeafSegmentation(),
        transforms.Resize((img_size, img_size)),
        CLAHETransform(),
    ]

    if training:
        steps += [
            transforms.RandomHorizontalFlip(),
            transforms.RandomRotation(15),
            transforms.ColorJitter(brightness=0.3, contrast=0.3),
        ]

    steps += [
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
    ]
    return transforms.Compose(steps)


def build_model(num_classes: int, freeze_base: bool = True, device: torch.device = torch.device('cpu')) -> torch.nn.Module:
    model = timm.create_model('efficientnet_b3', pretrained=True)
    if freeze_base:
        for param in model.parameters():
            param.requires_grad = False

    in_features = model.classifier.in_features
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.3),
        nn.Linear(in_features, 256),
        nn.ReLU(),
        nn.Dropout(p=0.2),
        nn.Linear(256, num_classes),
    )
    return model.to(device)


def train_epoch(model, loader, criterion, optimizer, device):
    model.train()
    total_loss = 0.0
    correct = 0
    total = 0

    for images, labels in loader:
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        total_loss += loss.item()
        _, predicted = outputs.max(1)
        correct += predicted.eq(labels).sum().item()
        total += labels.size(0)

    return total_loss / len(loader), 100.0 * correct / total


def val_epoch(model, loader, criterion, device):
    model.eval()
    total_loss = 0.0
    correct = 0
    total = 0

    with torch.no_grad():
        for images, labels in loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)

            total_loss += loss.item()
            _, predicted = outputs.max(1)
            correct += predicted.eq(labels).sum().item()
            total += labels.size(0)

    return total_loss / len(loader), 100.0 * correct / total


def parse_args():
    parser = argparse.ArgumentParser(description='Leafly training script')
    parser.add_argument('--data-dir', type=str, default='data', help='Base dataset directory')
    parser.add_argument('--output-dir', type=str, default='saved_models', help='Model output directory')
    parser.add_argument('--batch-size', type=int, default=32, help='Batch size')
    parser.add_argument('--epochs-head', type=int, default=10, help='Epochs for head training')
    parser.add_argument('--epochs-fine', type=int, default=10, help='Epochs for fine-tuning')
    parser.add_argument('--lr-head', type=float, default=1e-3, help='Learning rate for head')
    parser.add_argument('--lr-fine', type=float, default=1e-4, help='Learning rate for fine-tuning')
    parser.add_argument('--img-size', type=int, default=224, help='Input image size')
    return parser.parse_args()


def main():
    args = parse_args()
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    train_dir = Path(args.data_dir) / 'train'
    val_dir = Path(args.data_dir) / 'val'
    test_dir = Path(args.data_dir) / 'test'
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f'Using device: {device}')
    print(f'Training on: {train_dir}')
    print(f'Validation on: {val_dir}')
    print(f'Test on: {test_dir}')

    train_dataset = datasets.ImageFolder(train_dir, transform=get_transforms(args.img_size, training=True))
    val_dataset = datasets.ImageFolder(val_dir, transform=get_transforms(args.img_size, training=False))
    test_dataset = datasets.ImageFolder(test_dir, transform=get_transforms(args.img_size, training=False))

    train_loader = DataLoader(train_dataset, batch_size=args.batch_size, shuffle=True, num_workers=os.cpu_count() or 2)
    val_loader = DataLoader(val_dataset, batch_size=args.batch_size, shuffle=False, num_workers=os.cpu_count() or 2)
    test_loader = DataLoader(test_dataset, batch_size=args.batch_size, shuffle=False, num_workers=os.cpu_count() or 2)

    class_names = train_dataset.classes
    print(f'Classes ({len(class_names)}): {class_names}')
    print(f'Train: {len(train_dataset)} | Val: {len(val_dataset)} | Test: {len(test_dataset)}')

    model = build_model(len(class_names), freeze_base=True, device=device)
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(filter(lambda p: p.requires_grad, model.parameters()), lr=args.lr_head)

    best_val_acc = 0.0
    history = {'train_loss': [], 'val_loss': [], 'train_acc': [], 'val_acc': []}

    print('\n🔥 Phase 1: Training classification head...')
    for epoch in range(args.epochs_head):
        train_loss, train_acc = train_epoch(model, train_loader, criterion, optimizer, device)
        val_loss, val_acc = val_epoch(model, val_loader, criterion, device)

        history['train_loss'].append(train_loss)
        history['val_loss'].append(val_loss)
        history['train_acc'].append(train_acc)
        history['val_acc'].append(val_acc)

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), output_dir / 'leafly_model.pth')
            print(f'Epoch {epoch+1}/{args.epochs_head} | Train {train_acc:.2f}% | Val {val_acc:.2f}% ✅ saved')
        else:
            print(f'Epoch {epoch+1}/{args.epochs_head} | Train {train_acc:.2f}% | Val {val_acc:.2f}%')

    for param in model.parameters():
        param.requires_grad = True
    optimizer = torch.optim.Adam(model.parameters(), lr=args.lr_fine)

    print('\n🔥 Phase 2: Fine-tuning full model...')
    for epoch in range(args.epochs_fine):
        train_loss, train_acc = train_epoch(model, train_loader, criterion, optimizer, device)
        val_loss, val_acc = val_epoch(model, val_loader, criterion, device)

        history['train_loss'].append(train_loss)
        history['val_loss'].append(val_loss)
        history['train_acc'].append(train_acc)
        history['val_acc'].append(val_acc)

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), output_dir / 'leafly_model.pth')
            print(f'Epoch {epoch+1}/{args.epochs_fine} | Train {train_acc:.2f}% | Val {val_acc:.2f}% ✅ saved')
        else:
            print(f'Epoch {epoch+1}/{args.epochs_fine} | Train {train_acc:.2f}% | Val {val_acc:.2f}%')

    test_loss, test_acc = val_epoch(model, test_loader, criterion, device)
    print(f'\n🎯 Final Test Accuracy: {test_acc:.2f}%')

    with open(output_dir / 'class_names.json', 'w') as f:
        json.dump(class_names, f)

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
    epochs_range = range(1, len(history['train_loss']) + 1)
    ax1.plot(epochs_range, history['train_loss'], label='Train Loss')
    ax1.plot(epochs_range, history['val_loss'], label='Val Loss')
    ax1.set_title('Loss')
    ax1.legend()

    ax2.plot(epochs_range, history['train_acc'], label='Train Acc')
    ax2.plot(epochs_range, history['val_acc'], label='Val Acc')
    ax2.set_title('Accuracy (%)')
    ax2.legend()

    plt.tight_layout()
    plt.savefig(output_dir / 'training_curves.png')
    print(f'Model and curves saved to {output_dir}')


if __name__ == '__main__':
    main()
