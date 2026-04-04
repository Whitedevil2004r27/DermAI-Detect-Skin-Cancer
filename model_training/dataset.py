import os
import pandas as pd
from PIL import Image
from torch.utils.data import Dataset
from typing import Callable, Tuple

class HAM10000Dataset(Dataset):
    """
    HAM10000 Skin Lesion Dataset.
    Images are split across two directories: HAM10000_images_part_1 and HAM10000_images_part_2.
    """
    def __init__(self, df: pd.DataFrame, data_dir: str, transform: Callable = None):
        self.df = df
        self.data_dir = data_dir
        self.transform = transform
        
        # Determine image paths once for efficiency
        # Images are often extracted into a single folder or split. 
        # Here we look in both part1 and part2 directories.
        self.image_paths = []
        for img_id in self.df['image_id']:
            # Try both possible image folders
            p1 = os.path.join(data_dir, "HAM10000_images_part_1", f"{img_id}.jpg")
            p2 = os.path.join(data_dir, "HAM10000_images_part_2", f"{img_id}.jpg")
            # Also common for users to just put all images in one "images" folder
            p3 = os.path.join(data_dir, "images", f"{img_id}.jpg")
            
            if os.path.exists(p1):
                self.image_paths.append(p1)
            elif os.path.exists(p2):
                self.image_paths.append(p2)
            elif os.path.exists(p3):
                self.image_paths.append(p3)
            else:
                # Placeholder: assume images folder if structure is unknown
                self.image_paths.append(os.path.join(data_dir, f"{img_id}.jpg"))

        # Map labels to integers
        self.label_map = {
            'akiec': 0, 'bcc': 1, 'bkl': 2, 'df': 3, 'mel': 4, 'nv': 5, 'vasc': 6
        }

    def __len__(self) -> int:
        return len(self.df)

    def __getitem__(self, idx: int) -> Tuple:
        image_id = self.df.iloc[idx]['image_id']
        
        # Try finding the image in the current directory or subfolders
        image_path = None
        search_paths = [
            os.path.join(self.data_dir, f"{image_id}.jpg"),
            os.path.join(self.data_dir, "HAM10000_images_part_1", f"{image_id}.jpg"),
            os.path.join(self.data_dir, "HAM10000_images_part_2", f"{image_id}.jpg"),
            os.path.join(self.data_dir, "images", f"{image_id}.jpg"),
        ]
        
        for p in search_paths:
            if os.path.exists(p):
                image_path = p
                break
        
        if image_path is None:
            # Fallback for unexpected structure
            image_path = os.path.join(self.data_dir, f"{image_id}.jpg")

        image = Image.open(image_path).convert('RGB')
        
        label_name = self.df.iloc[idx]['dx']
        label = self.label_map[label_name]
        
        if self.transform:
            image_tensor = self.transform(image)
        else:
            from torchvision import transforms
            image_tensor = transforms.ToTensor()(image)
            
        return image_tensor, label
