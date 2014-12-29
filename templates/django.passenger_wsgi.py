import sys, os

sys.path.append("/home/pacs/{{pac}}/users/{{user}}/mypro")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mypro.settings")

from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()
