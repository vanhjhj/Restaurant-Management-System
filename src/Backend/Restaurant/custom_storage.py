# custom_storage.py
from storages.backends.s3boto3 import S3Boto3Storage

class StaticStorage(S3Boto3Storage):
    location = 'staticfiles'
    default_acl = None
    file_overwrite = False

class MediaStorage(S3Boto3Storage):
    location = 'media'
    default_acl = None
    file_overwrite = False