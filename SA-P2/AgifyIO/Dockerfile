# Usamos una imagen base de Node.js
FROM node:latest

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
