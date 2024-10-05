# Especifica la imagen base para el contenedor, en este caso, la versión 16 de Node.js
FROM node:16

# Establece el directorio de trabajo en el contenedor, donde se ejecutarán los comandos posteriores
WORKDIR /usr/src/app

# Copia los archivos package.json y package-lock.json al directorio de trabajo del contenedor
# Esto permite que las dependencias se instalen sin necesidad de copiar todo el código fuente primero
COPY package*.json ./

# Instala las dependencias definidas en package.json
# RUN se usa para ejecutar comandos en el momento de construir la imagen
RUN npm install

# Copia el resto de los archivos de la aplicación al directorio de trabajo en el contenedor
COPY . .

# Expone el puerto 1337, lo que permite que las conexiones entrantes se dirijan a este puerto
EXPOSE 1337

# Especifica el comando por defecto que se ejecutará al iniciar el contenedor
# En este caso, se ejecuta el script "dev" definido en el package.json
CMD ["npm", "run", "dev"]