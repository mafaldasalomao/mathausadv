from flask_restful import Resource, reqparse
from flask import request
from flask_jwt_extended import verify_jwt_in_request, create_access_token, create_refresh_token, get_jwt_identity, jwt_required

class RefreshToken(Resource):
    @jwt_required(refresh=True)
    def post(self):
        current_user = get_jwt_identity()
        # new_token = create_refresh_token(identity=current_user)

        # refresh_token_cookie = request.cookies.get('refresh_token_cookie')
        # refresh_token_cookie = request.headers.get('Authorization')
        # print(refresh_token_cookie)
        verify_jwt_in_request(refresh=True)
        # if refresh_token_cookie:
        new_access_token = create_access_token(identity=current_user, fresh=False)
        return {'access_token': new_access_token}

    
