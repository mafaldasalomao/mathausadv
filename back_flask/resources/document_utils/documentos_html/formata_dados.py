

def gerar_div_partes(partes):
    div_html = ''
    for i, parte in enumerate(partes):
        # Abre uma nova div a cada duas partes
        if i % 2 == 0:
            div_html += '<div class="two-columns">'
        
        # Adiciona uma seção com os dados da parte atual
        label = "CNPJ" if len(parte.cpf_cnpj) > 11 else "CPF"
        div_html += f'''
            <section>
                <p style="font-size: 12pt; margin-bottom: -10px;">{parte.type}</p>
                <span style="font-size: 8pt;">{label}: {parte.cpf_cnpj}</span>
                <p><strong>{parte.name}</strong></p>
                <p>{parte.address}</p>
            </section>
        '''
        
        # Fecha a div após cada duas partes
        if i % 2 == 1 or i == len(partes) - 1:
            div_html += '</div>'

    return div_html

def gerar_div_assinaturas(assinaturas):
    div_html = ''
    assinatura_daniel = '''
            <section class="signature" style="width: 50%; margin: auto; text-align: center">
            <img class="signature-image"  style="width: 200px;" src="https://cid-tec-bucket1-dev.s3.sa-east-1.amazonaws.com/signature_daniel.png" alt="Logo do Escritório">
            <div class="line" style="margin-top: -30px;"></div>
            <p>Assin. Daniel Mathaus Costa de Macêdo</p>
            <p>OAB/AC 4.355</p>
        </section>'''
    

    for i, assinatura in enumerate(assinaturas):
        # Abre uma nova div a cada duas assinaturas
        if i % 2 == 0:
            div_html += '<div class="two-columns">'
        
        # Adiciona a seção de assinatura
        div_html += f'''
            <section class="signature">
                <div class="line"></div> <!-- Linha visual para a assinatura -->
                <p>Assin. {assinatura.name}</p>
            </section>
        '''
        
        # Fecha a div após cada duas assinaturas
        if i % 2 == 1 or i == len(assinaturas) - 1:
            div_html += '</div>'

    return div_html


def gerar_lista_contatos(partes):
    lista_contatos_html = ''
    for parte in partes:

        # Gera a linha de contato
        lista_contatos_html += f'''
            <li style="font-size: 12px;">Contratante {parte.name.split()[0]}: Email: {parte.email} - Telefone: {parte.phone}</li>
        '''
    
    return lista_contatos_html