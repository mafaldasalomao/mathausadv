import json
import os
# if os.getenv('FLASK_ENV') == 'production':
with open('credentials_prod.json') as config_file:
    config = json.load(config_file)
# else:
#     with open('credentials_dev.json') as config_file:
#         config = json.load(config_file)


USER = config.get('USER')
PASSWORD = config.get('PASSWORD')
DATABASE = config.get('DATABASE')
HOST = config.get('HOST')
PORT = 5432
# JWT_SECRET = config.get('JWT_SECRET')
