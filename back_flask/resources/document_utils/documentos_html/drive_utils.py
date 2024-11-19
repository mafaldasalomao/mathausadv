
from __future__ import print_function
import os.path
import os
import json
import requests
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "mathausadv-documentos-d71d906e524e.json"



from google.oauth2 import service_account
from googleapiclient.http import MediaFileUpload
from googleapiclient.discovery import build

SERVICE_ACCOUNT_FILE = 'resources/document_utils/documentos_html/mathausadv-documentos-d71d906e524e.json'
SCOPES = ['https://www.googleapis.com/auth/drive.file']
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
def upload_to_google_drive(file_path, document_type, parent_folder_id):
    # Autenticação com as credenciais da conta de serviço
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    service = build('drive', 'v3', credentials=creds)
    
    # Metadados do arquivo
    file_metadata = {
        'name': f"{document_type}.pdf",
        'parents': [parent_folder_id]  # Coloque o ID da pasta de destino
    }
    media = MediaFileUpload(file_path, mimetype='application/pdf')
    
    # Envio do arquivo
    file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
    print(f"Arquivo enviado ao Google Drive com ID: {file.get('id')}")
    return file.get('id')


def delete_document_google_drive(file_id):
    # Autenticação com as credenciais da conta de serviço
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    service = build('drive', 'v3', credentials=creds)
    
    try:
        # Deletar o arquivo pelo ID
        service.files().delete(fileId=file_id).execute()
        print(f"Documento com ID {file_id} deletado com sucesso.")
    except Exception as e:
        print(f"Erro ao deletar o documento: {e}")


def upload_to_assine_online(file_path, document_type, token="4dd9e8b1722d864d09e254e288e498d307ca58eb"):
    url = "https://api.assine.online/v1/file"
    
    # Abre o arquivo e define os parâmetros para envio
    with open(file_path, 'rb') as file:
        files = {
            'file': (f"{document_type.lower()}.pdf", file, 'application/pdf')
        }
        headers = {
            'Accept': 'application/json',
            'Authorization': f'Bearer {token}'
        }
        payload = {
            'decription': f"{document_type.lower()}.pdf"
        }
        
        try:
            # Envia o arquivo para a API
            response = requests.post(url, headers=headers, files=files, data=payload)
            response.raise_for_status()  # Lança uma exceção para status de erro HTTP
            
            # Retorna o ID do arquivo, assumindo que a resposta inclui um campo 'file_id'
            return response.json().get("id", "ID not found in response")
        
        except requests.exceptions.RequestException as e:
            print(f"An error occurred: {e}")
            return None


def create_workflow_assine_online(data, token="4dd9e8b1722d864d09e254e288e498d307ca58eb"):
    url = "https://api.assine.online/v1/workflow"
    
    headers = {
        'Accept': 'application/json',
        "Content-Type": "application/json",
        'Authorization': f'Bearer {token}'
    }
    payload = json.dumps(data)
        
    try:
        # Envia o arquivo para a API
        response = requests.post(url, headers=headers, data=payload)
        response.raise_for_status()  # Lança uma exceção para status de erro HTTP

        return response.json().get("id", "ID not found in response")
        
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None
    

def get_status_workflow_assine_online(workflow_id, token="4dd9e8b1722d864d09e254e288e498d307ca58eb"):
    url = f"https://api.assine.online/v1/workflow/{workflow_id}"
    
    headers = {
        'Accept': 'application/json',
        "Content-Type": "application/json",
        'Authorization': f'Bearer {token}'
    }

        
    try:
        # Envia o arquivo para a API
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Lança uma exceção para status de erro HTTP

        return response.json().get("status", "Status not found in response")
        
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None