FROM node:18-alpine

WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto de la aplicación
COPY . .

# Instalar ts-node globalmente para desarrollo
RUN npm install -g ts-node

# Exponer el puerto
EXPOSE 5000

# Comando para desarrollo
CMD ["npm", "run", "dev"]