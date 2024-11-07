import fitz  # PyMuPDF
import re

def localizar_assinaturas(pdf_path, assinantes):
    # Abra o PDF
    doc = fitz.open(pdf_path)
    
    # Padrão para detectar a palavra "Assin." seguida pelo nome do assinante
    signature_pattern = r"Assin\.\s*({})"

    assinaturas_encontradas = []

    # Loop através das páginas do PDF
    for page_num in range(doc.page_count):
        page = doc.load_page(page_num)
        
        # Procurar pela palavra "Assin." em todas as instâncias na página
        text_instances = page.search_for("Assin.")

        for inst in text_instances:
            x0, y0, x1, y1 = inst  # Coordenadas onde "Assin." foi encontrado
            
            # Extrair o texto ao redor de "Assin." para capturar o nome completo
            text_nearby = page.get_text("text", clip=(x0, y0 - 20, x1 + 200, y1 + 20))
            
            # Verificar se algum assinante está próximo da palavra "Assin."
            for assinante in assinantes:
                # Criar um padrão para o nome do assinante específico
                pattern = signature_pattern.format(re.escape(assinante))
                match = re.search(pattern, text_nearby, re.IGNORECASE)
                
                if match:
                    # Adicionar as informações encontradas à lista
                    width = str(x1 - x0)
                    height = str(y1 - y0)
                    x = str(x0)
                    y = str(y0)
                    assinaturas_encontradas.append({
                        "client": assinante,
                        "page": page_num + 1,
                        "type": 8,
                        "action": 0,
                        "signature_type": "8",
                        "x": x,
                        "y": y,
                        "width": width,
                        "height": height
                    })
                    print(f"Assinatura encontrada na página {page_num + 1} para {assinante}:")
                    print(f"Localização: (x0: {x0}, y0: {y0}), (x1: {x1}, y1: {y1})")
                    # Opcional: parar a busca deste assinante se já encontrou o nome dele na página atual
                    break

    return assinaturas_encontradas

pdf_document = "contrato-1.pdf"
assinantes = ["Salomao Machado Mafalda", "Joao da Silca"]

resultado = localizar_assinaturas(pdf_document, assinantes)

# Exibir todos os resultados encontrados
for assinatura in resultado:
    print(assinatura)