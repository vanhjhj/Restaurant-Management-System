# setting_config.py
from django.conf import settings
import json
import os
from copy import deepcopy

class RestaurantSettings:
    _instance = None
    _file_path = os.path.join(settings.BASE_DIR, 'Config', 'restaurant_configs.json')

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        self.load_settings()

    def load_settings(self):
        if os.path.exists(self._file_path):
            with open(self._file_path, 'r', encoding='utf-8') as f:
                self._settings = json.load(f)
        else:
            self._settings = {}

    def save_settings(self):
        os.makedirs(os.path.dirname(self._file_path), exist_ok=True)
        with open(self._file_path, 'w', encoding='utf-8') as f:
            json.dump(self._settings, f, ensure_ascii=False, indent=4)

    def get_all(self):
        return deepcopy(self._settings)

    def update(self, data, partial=False):
        """
        Cập nhật settings với hỗ trợ nested dict
        
        Args:
            data (dict): Data cần update
            partial (bool): True nếu là partial update (PATCH)
        """
        if partial:
            self._update_nested(self._settings, data)
        else:
            self._settings.update(data)
        self.save_settings()

    def _update_nested(self, current_dict, update_dict):
        """
        Đệ quy cập nhật nested dictionary
        """
        for key, value in update_dict.items():
            if isinstance(value, dict) and key in current_dict and isinstance(current_dict[key], dict):
                self._update_nested(current_dict[key], value)
            else:
                current_dict[key] = value

    def get(self, key, default=None):
        return self._settings.get(key, default)
