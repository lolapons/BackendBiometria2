# BackendBiometria2


# Descripción del Proyecto

Este proyecto se estructura en varios archivos clave que permiten el funcionamiento de una aplicación de servidor Node.js conectada a una base de datos PostgreSQL, todo orquestado mediante contenedores Docker.

## Archivos y Funcionalidades

### `db.js`
Este archivo configura la conexión a la base de datos PostgreSQL. Utiliza los parámetros de conexión como el host, puerto, usuario, contraseña y nombre de la base de datos para establecer dicha conexión. La implementación se realiza a través de un pool de conexiones para optimizar el uso de la base de datos.

### `docker-compose.yaml`
Este archivo define y configura múltiples contenedores Docker que son parte de la aplicación. En este caso, se configuran dos contenedores: uno para la base de datos (PostgreSQL) y otro para el servidor de la aplicación, denominado "servidor". Es ideal para gestionar entornos que dependen de varios servicios de manera coordinada.

### `Dockerfile`
Este archivo se utiliza para crear una imagen Docker de tu aplicación Node.js. Al construir la imagen, se instalan automáticamente todas las dependencias necesarias y se configura el entorno para que el servidor esté listo para recibir solicitudes en el puerto 1337.

### `server.js`
Este archivo es el núcleo de la aplicación. Gestiona la lógica principal de la API RESTful, permitiendo la creación de tablas, la inserción de datos sobre niveles de ozono y la recuperación de dichos datos. Es el punto de interacción entre el cliente y la base de datos, manejando todas las operaciones a través de peticiones HTTP.

---

* Lola Pons Bargues*
