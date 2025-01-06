# setting_config.py
from django.conf import settings
from django.core.files.storage import default_storage
import json
import os
from copy import deepcopy
from Restaurant.custom_storage import MediaStorage

class RestaurantSettings:
    _instance = None
    _file_path = os.path.join(settings.BASE_DIR, 'Config', 'restaurant_configs.json')
    _storage = MediaStorage()

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
    def upload_file(self, file, path_prefix='restaurant-config'):
        """
        Upload file lên S3 và trả về đường dẫn
        
        Args:
            file: File từ request.FILES
            path_prefix: Prefix cho đường dẫn lưu trữ
            
        Returns:
            str: Đường dẫn đầy đủ của file trên S3
        """
        if not file:
            return None

        # Tạo đường dẫn lưu trữ
        file_extension = os.path.splitext(file.name)[1].lower()
        storage_path = f'{settings.AWS_MEDIA_LOCATION}/{path_prefix}/{file.name}{file_extension}'
        
        # Upload file
        storage_path = self._storage.save(storage_path, file)
        
        # Trả về URL đầy đủ
        return default_storage.url(storage_path)

    def update_with_files(self, data, files):
        """
        Cập nhật settings với file upload
        
        Args:
            data (dict): Data thông thường
            files (dict): Files từ request.FILES
        """
        # Xử lý các file upload trước
        updated_data = data.copy()
        
        for key, file in files.items():
            if file:
                # Upload file và lấy URL
                file_url = self.upload_file(file)
                # Cập nhật URL vào data
                updated_data[key] = file_url
        
        # Cập nhật settings với data đã xử lý
        self.update(updated_data)
