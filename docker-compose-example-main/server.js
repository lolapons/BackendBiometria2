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

// Ruta para configurar la base de datos y crear la tabla de mediciones.
app.get('/setup', async (req, res) => {
    try {
        // Ejecutamos una consulta para crear la tabla measurements con las columnas requeridas.
        await pool.query(`
            CREATE TABLE IF NOT EXISTS measurements (
                id SERIAL PRIMARY KEY,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                sensor_type INTEGER NOT NULL,    -- Columna para el tipo de sensor, donde 1 es "ozono" y 2 es "temperatura".
                value DECIMAL(5,2) NOT NULL      -- Columna para almacenar el valor medido por el sensor.
            )
        `);
        res.status(200).send({ message: "Successfully created measurements table" });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.post('/measurements', async (req, res) => {
    // Extraemos los valores de sensor_type y value del cuerpo de la solicitud.
    const { sensor_type, value } = req.body;
    
    console.log(`Received sensor_type: ${sensor_type}, value: ${value}`); // Agregado para depuración

    // Validación para asegurar que sensor_type sea 1 o 2.
    if (sensor_type !== 1 && sensor_type !== 2) {
        return res.status(400).send({ message: "Invalid sensor type. Must be 1 (ozono) or 2 (temperatura)." });
    }

    // Validación para asegurar que el valor no sea nulo y sea un número válido.
    if (value == null || isNaN(Number(value))) {
        return res.status(400).send({ message: "Invalid value" });
    }

    try {
        // Primero, eliminamos la medición existente (si hay alguna).
        await pool.query('DELETE FROM measurements');

        // Luego, insertamos los nuevos datos de medición.
        await pool.query(
            'INSERT INTO measurements (sensor_type, value) VALUES ($1, $2)', 
            [sensor_type, value] // Pasamos los valores como parámetros para prevenir inyecciones SQL.
        );

        // Enviamos una respuesta exitosa al cliente indicando que los datos se han agregado.
        res.status(200).send({ message: "Successfully added measurement data" });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});


// Ruta para obtener todos los datos de la tabla de mediciones.
app.get('/measurements', async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM measurements');
        res.status(200).send(data.rows);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// Ruta para eliminar todos los registros de la tabla de mediciones.
app.delete('/measurements', async (req, res) => {
    try {
        await pool.query('DELETE FROM measurements');
        res.status(200).send({ message: "All measurement data successfully deleted" });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// Hacemos que el servidor escuche en el puerto definido y registramos un mensaje en la consola.
app.listen(port, () => console.log(`Server has started on port: ${port}`));
