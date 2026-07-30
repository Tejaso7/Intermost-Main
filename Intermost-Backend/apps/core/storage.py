from storages.backends.s3boto3 import S3Boto3Storage


class PublicMediaS3Storage(S3Boto3Storage):
    """Custom S3 storage that strips legacy ACL parameters for modern AWS S3 buckets."""
    default_acl = None
    file_overwrite = False
    querystring_auth = False

    def _get_write_parameters(self, name, content=None):
        params = super()._get_write_parameters(name, content=content)
        params.pop('ACL', None)
        return params
