
from __future__ import print_function
import os.path
import os
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "mathausadv-documentos-d71d906e524e.json"



from google.oauth2 import service_account
from googleapiclient.discovery import build

SERVICE_ACCOUNT_FILE = 'resources/document_utils/mathausadv-documentos-d71d906e524e.json'
# Autenticação com a conta de serviço
creds = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE,
    scopes=['https://www.googleapis.com/auth/drive'],
)

# Construa o serviço
service = build('drive', 'v3', credentials=creds)

def list_files():
    # Faz a requisição para listar arquivos
    results = service.files().list(
        pageSize=10,  # Número de arquivos a serem retornados
        fields="nextPageToken, files(id, name)"
    ).execute()
    
    items = results.get('files', [])

    if not items:
        print('No files found.')
    else:
        print('Files:')
        for item in items:
            print(f"{item['name']} ({item['id']})")


def create_folder(folder_name, parent_folder_id):
    """Cria uma pasta no Google Drive e retorna o ID dela"""
    file_metadata = {
        'name': folder_name,
        'mimeType': 'application/vnd.google-apps.folder',
        'parents': [parent_folder_id]
    }
    
    # Chama a API para criar a pasta
    folder = service.files().create(body=file_metadata, fields='id').execute()
    
    # Retorna o ID da pasta criada
    print(f'Pasta "{folder_name}" criada com ID: {folder.get("id")}')
    return folder.get('id')

