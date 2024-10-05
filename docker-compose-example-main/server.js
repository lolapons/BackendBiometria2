// Importamos la librería express para crear el servidor.
const express = require('express');

// Importamos el pool de conexiones a la base de datos desde el archivo db.js.
const pool = require('./db');

// Definimos el puerto en el que el servidor escuchará las solicitudes.
const port = 3000;

// Creamos una instancia de una aplicación express.
const app = express();

// Usamos el middleware express.json() para que la aplicación pueda interpretar cuerpos de solicitudes en formato JSON.
app.use(express.json());

// Rutas

// Ruta para configurar la base de datos y crear la tabla de datos del sensor de ozono.
app.get('/setup', async (req, res) => {
    try {
        // Ejecutamos una consulta para crear la tabla ozone_sensor_data con las columnas requeridas.
        await pool.query(`
            CREATE TABLE ozone_sensor_data (
                id SERIAL PRIMARY KEY,              // Columna id como clave primaria y autoincremental.
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, // Columna para almacenar la fecha y hora de la medición.
                ozone_level DECIMAL(5,2) NOT NULL, // Columna para el nivel de ozono, debe tener 2 decimales y no puede ser nulo.
                location VARCHAR(100)               // Columna para almacenar la ubicación, con un máximo de 100 caracteres.
            )
        `);
        // Enviamos una respuesta exitosa si la tabla se crea correctamente.
        res.status(200).send({ message: "Successfully created ozone sensor table" });
    } catch (err) {
        // En caso de error, lo registramos en la consola y enviamos un estado 500 (error interno del servidor).
        console.log(err);
        res.sendStatus(500);
    }
});

// Ruta para insertar datos del sensor de ozono en la base de datos.
app.post('/ozone', async (req, res) => {
    // Extraemos los valores de ozone_level y location del cuerpo de la solicitud.
    const { ozone_level, location } = req.body;
    try {
        // Ejecutamos una consulta para insertar los datos del sensor en la tabla ozone_sensor_data.
        await pool.query(
            'INSERT INTO ozone_sensor_data (ozone_level, location) VALUES ($1, $2)', 
            [ozone_level, location] // Usamos parámetros para prevenir inyecciones SQL.
        );
        // Enviamos una respuesta exitosa al cliente indicando que los datos se han agregado.
        res.status(200).send({ message: "Successfully added ozone data" });
    } catch (err) {
        // En caso de error, lo registramos en la consola y enviamos un estado 500.
        console.log(err);
        res.sendStatus(500);
    }
});

// Ruta para obtener todos los datos de la tabla de sensores de ozono.
app.get('/ozone', async (req, res) => {
    try {
        // Ejecutamos una consulta para seleccionar todos los registros de la tabla ozone_sensor_data.
        const data = await pool.query('SELECT * FROM ozone_sensor_data');
        // Enviamos los datos como respuesta en formato JSON.
        res.status(200).send(data.rows);
    } catch (err) {
        // En caso de error, lo registramos en la consola y enviamos un estado 500.
        console.log(err);
        res.sendStatus(500);
    }
});

// Hacemos que el servidor escuche en el puerto definido y registramos un mensaje en la consola.
app.listen(port, () => console.log(`Server has started on port: ${port}`));
