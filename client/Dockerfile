# Stage 1: Build
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production      # Solo deps de producción

COPY . .
RUN npm run build                 # Genera build estático

# Stage 2: Serve
FROM nginx:alpine               

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]