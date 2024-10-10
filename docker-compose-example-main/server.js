// Importamos la librería express para crear el servidor.
const express = require('express');

// Importamos el pool de conexiones a la base de datos desde el archivo db.js.
const pool = require('./db');

const cors = require('cors'); // Asegúrate de que esta línea esté aquí

// Definimos el puerto en el que el servidor escuchará las solicitudes.
const port = 3000;

// Creamos una instancia de una aplicación express.
const app = express();

// Usamos el middleware express.json() para que la aplicación pueda interpretar cuerpos de solicitudes en formato JSON.
app.use(express.json());

// Habilitamos CORS para todas las rutas
app.use(cors());


// Rutas

// Ruta para configurar la base de datos y crear la tabla de mediciones.
app.get('/setup', async (req, res) => {
    try {
        // Ejecutamos una consulta para crear la tabla medida con las columnas requeridas.
        await pool.query(`
            CREATE TABLE IF NOT EXISTS medida (
                idmedida SERIAL PRIMARY KEY,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                valorOzono DECIMAL(5,2) NOT NULL,      -- Columna para almacenar el valor de ozono
                valorTemperatura DECIMAL(5,2) NOT NULL  -- Columna para almacenar el valor de temperatura
            )
        `);
        res.status(200).send({ message: "Successfully created medida table" });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// Endpoint para insertar datos de mediciones
app.post('/medida', async (req, res) => {
    // Extraemos los valores de ozono y temperatura del cuerpo de la solicitud.
    const { valorOzono, valorTemperatura } = req.body;

    // Validación para asegurar que ambos valores no sean nulos y sean números válidos.
    if (valorOzono == null || isNaN(Number(valorOzono)) || valorTemperatura == null || isNaN(Number(valorTemperatura))) {
        return res.status(400).send({ message: "Invalid ozone value or temperature" });
    }

    try {
        // Insertamos los nuevos datos de medición.
        await pool.query(
            'INSERT INTO medida (valorOzono, valorTemperatura) VALUES ($1, $2)', 
            [valorOzono, valorTemperatura] // Pasamos los valores como parámetros para prevenir inyecciones SQL.
        );

        // Enviamos una respuesta exitosa al cliente indicando que los datos se han agregado.
        res.status(200).send({ message: "Successfully added measurement data" });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// Ruta para obtener todos los datos de la tabla de medidas.
app.get('/medida', async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM medida');
        res.status(200).send(data.rows);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// Ruta para eliminar todos los registros de la tabla de medidas.
app.delete('/medida', async (req, res) => {
    try {
        await pool.query('DELETE FROM medida');
        res.status(200).send({ message: "All measurement data successfully deleted" });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// Hacemos que el servidor escuche en el puerto definido y registramos un mensaje en la consola.
app.listen(port, () => console.log(`Server has started on port: ${port}`));
