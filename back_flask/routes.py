from resources.user import User, UserRegister, UserLogin, UserLogout
from resources.refresh_token import RefreshToken
from resources.contract import Contracts, Contract, SendToSigner, CheckStatusSignature
from resources.document import Documents, Document
from resources.client import Clients, Client, AllClients,  Responsable
def create_routes(api):    

    api.add_resource(User, '/api/users/<int:user_id>')
    api.add_resource(UserRegister, '/api/v1/user/signup')
    api.add_resource(UserLogin, '/api/v1/user/login')
    api.add_resource(UserLogout, '/api/v1/user/logout')
    api.add_resource(RefreshToken, '/api/v1/user/token/refresh')

    api.add_resource(Contract , '/api/v1/user/contract/<int:contract_id>')
    api.add_resource(Contracts, '/api/v1/user/contracts')

    api.add_resource(SendToSigner, '/api/v1/user/contract/<int:contract_id>/sendtosigner')
    api.add_resource(CheckStatusSignature, '/api/v1/user/contracts/checkstatussignatures')

    api.add_resource(Documents, '/api/v1/user/documents')
    api.add_resource(Document, '/api/v1/user/document/<int:document_id>')

    api.add_resource(Client, '/api/v1/user/client/<int:client_id>')
    api.add_resource(Clients, '/api/v1/user/contract/<int:contract_id>/clients')
    api.add_resource(AllClients, '/api/v1/user/allclients')
    api.add_resource(Responsable, '/api/v1/user/contract/<int:contract_id>/client/<int:client_id>/responsable')

