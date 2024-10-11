# Usar a imagem base do Node.js
FROM node:18

# Criar um diretório de trabalho /app
WORKDIR /app

# Copiar o package.json e o package-lock.json
COPY front_react/package*.json /app

# Instalar as dependências
RUN npm install

# Copiar todos os arquivos do diretório atual para /app no container
COPY front_react/ /app

# Construir a aplicação React
RUN npm run build

# Expor a porta 3000
EXPOSE 3000

# Comando padrão para iniciar a aplicação React
CMD ["npm", "start"]