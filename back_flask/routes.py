from resources.user import User, UserRegister, UserLogin, UserLogout
from resources.refresh_token import RefreshToken

def create_routes(api):    

    api.add_resource(User, '/api/users/<int:user_id>')
    api.add_resource(UserRegister, '/api/v1/user/signup')
    api.add_resource(UserLogin, '/api/v1/user/login')
    api.add_resource(UserLogout, '/api/v1/user/logout')
    api.add_resource(RefreshToken, '/api/v1/user/token/refresh')

