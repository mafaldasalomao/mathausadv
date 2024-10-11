from flask import make_response, jsonify
from flask_restful import Resource, reqparse
from models.user import UserModel
from flask_bcrypt import Bcrypt

# Crie uma instância do Bcrypt
bcrypt = Bcrypt()
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required, get_jwt,
    # jwt_refresh_token_required,
    get_jwt_identity, set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies
)
from secrets import compare_digest
from blacklist import BLACKLIST

parser = reqparse.RequestParser()
parser.add_argument('username', type=str, required=True, help="The field 'username' cannot be left blank")
parser.add_argument('password', type=str, required=True, help="The field 'password' cannot be left blank")



class User(Resource):
    def get(self, user_id):
        user = UserModel.find_user(user_id)
        if user:
            return user.json()
        return {'message': 'User not found'}, 404
    @jwt_required()
    def delete(self, user_id):
        user = UserModel.find_user(user_id)
        if user:
            user.delete_user()
            return {'message': 'User deleted'}
        return {'message': 'User not found'}, 404

class UserRegister(Resource):
    #/signup
    def post(self):
        
        data = parser.parse_args()

        if UserModel.find_by_username(data['username']):
            return {"message": "The username '{}' already exists.".format(data['username'])}, 400
        
        # Hash a senha antes de salvar no banco de dados
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        
        user = UserModel(username=data['username'], password=hashed_password)
        # user = UserModel(**data)
        user.save_user()
        return {'message': 'User created successfully!'}, 201
    
class UserLogin(Resource):
    @classmethod
    def post(cls):
        data = parser.parse_args()

        user = UserModel.find_by_username(data['username'])

        if user and bcrypt.check_password_hash(user.password, data['password']):
            access_token = create_access_token(identity=user.user_id, fresh=True)
            refresh_token = create_refresh_token(user.user_id)

            response = make_response(jsonify({'access_token': access_token}), 200)

            # Configurar o cookie de refresh token
            response.set_cookie('refresh_token_cookie', refresh_token, httponly=True, secure=False, max_age=24 * 60 * 60)
            return response
        
        return {'message': 'Invalid credentials'}, 401

class UserLogout(Resource):
    @jwt_required()
    def post(self):
        jti = get_jwt()['jti']
        BLACKLIST.add(jti)
        return {'message': 'Successfully logged out'}