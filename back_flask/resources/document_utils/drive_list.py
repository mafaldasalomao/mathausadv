
from __future__ import print_function
import os.path
import os
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "mathausadv-documentos-d71d906e524e.json"



from google.oauth2 import service_account
from googleapiclient.discovery import build

SERVICE_ACCOUNT_FILE = 'mathausadv-documentos-d71d906e524e.json'
# Autenticação com a conta de serviço
creds = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE,
    scopes=['https://www.googleapis.com/auth/drive.metadata.readonly'],
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

if __name__ == '__main__':
    list_files()