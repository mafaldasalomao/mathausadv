import mammoth

def convert_docx_to_html(docx_path, output_html_path):
    with open(docx_path, "rb") as docx_file:
        # Converte o .docx para HTML
        result = mammoth.convert_to_html(docx_file)
        html_content = result.value  # O HTML gerado
        messages = result.messages  # Mensagens de advertência, se houver

    # Salva o conteúdo HTML em um arquivo
    with open(output_html_path, "w", encoding="utf-8") as f:
        f.write(html_content)

    print(f"Conversão concluída! O HTML foi salvo como '{output_html_path}'.")
    if messages:
        print("Mensagens:")
        for message in messages:
            print("-", message)
# Caminho do documento .docx
docx_path = "CPSJ-PARTESEMREPRESENTANTE V1.0.docx"  # Altere para o caminho do seu arquivo
output_html_path = "output.html"   # Caminho do arquivo HTML de saída

convert_docx_to_html(docx_path, output_html_path)

# Salva o conteúdo HTML em um arquivo
with open("CPSJ-PARTESEMREPRESENTANTE V1.0.html", "w", encoding="utf-8") as f:
    f.write(output_html_path)

print("Conversão concluída! O HTML foi salvo como 'output.html'.")