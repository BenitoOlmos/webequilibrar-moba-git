# Etapa 1: Construcción (Builder)
FROM node:18-alpine as builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY server/package*.json ./server/

# Instalar dependencias (Front y Back)
RUN npm install
RUN cd server && npm install

# Copiar todo el código fuente
COPY . .

# Construir Frontend (Vite -> /dist)
RUN npm run build

# Construir Backend (TSC -> /server/dist)
RUN cd server && npm run build

# Etapa 2: Ejecución (Runner - Imagen ligera)
FROM node:18-alpine

WORKDIR /app

# Copiar dependencias de producción del backend
COPY server/package*.json ./
RUN npm install --production

# Copiar los "artefactos" construidos desde la etapa builder
# Estructura final esperada en contenedor:
# /app/dist (Frontend estático)
# /app/server/dist (Backend compilado)
# /app/node_modules (Deps de producción)

COPY --from=builder /app/dist ./dist
# Tenemos que crear la carpeta server antes o copiarla asi:
COPY --from=builder /app/server/dist ./server/dist

# Si usas imagenes locales en mock.ts o similares, asegurate de que se copien si no fueron embebidas.
# En este caso, mock.ts está compilado dentro de server/dist, pero si hay assets estáticos back-side:
# COPY --from=builder /app/server/src/assets ./server/src/assets

# Variables de entorno por defecto
ENV PORT=8080
ENV NODE_ENV=production

# Exponer puerto para Cloud Run / Docker
EXPOSE 8080

# Comando de inicio
# Nota: index.js busca ../../dist, por lo que debe ejecutarse desde una ruta que respete esa relativa
# Si estamos en /app, y ejecutamos node server/dist/index.js
# __dirname será /app/server/dist
# ../../dist será /app/dist -> CORRECTO.
CMD ["node", "server/dist/index.js"]
