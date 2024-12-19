FROM node:lts-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copiar el archivo package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Instalar Typescript globalmente why not
RUN npm i -g typescript

# Copia el fantástico pero modesto código fuente
COPY . .

# Estoy escuchandoooo
EXPOSE 5000

# Ejecuta el script del package.json que usa ts-node-dev
CMD ["npm", "run", "dev"]