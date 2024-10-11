import json
from flask import Flask, jsonify
from flask_restful import  Api
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                              unset_jwt_cookies, jwt_required, JWTManager

from datetime import datetime, timedelta, timezone
from blacklist import BLACKLIST
from routes import create_routes
from flask_cors import CORS
from flask.helpers import send_from_directory
import json
import os
from config_json import *
from config import DevConfig, ProdConfig


app = Flask(__name__)
if os.getenv('FLASK_ENV') == 'production':
    app.config.from_object(ProdConfig)
else:
    app.config.from_object(DevConfig)


CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://postgres:apocalipse1007@104.248.32.80:5432/db_mathausadv'
# app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DATABASE}'

api = Api(app)

jwt = JWTManager(app)


@jwt.token_in_blocklist_loader
def verify_blacklist(self, token):
   return token['jti'] in BLACKLIST

@jwt.revoked_token_loader
def token_access_invalid(jwt_header, jwt_payload):
   return jsonify({'message': 'You have been logged out. Please log in again.'}), 401 

#@app.route('/')
#def serve():
#    return send_from_directory(app.static_folder, 'index.html')
if __name__ == '__main__':
   from sql_alchemy import db
   db.init_app(app)
   with app.app_context():
      db.create_all()
   create_routes(api)
   app.run(host='0.0.0.0', debug=True)