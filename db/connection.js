const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const query = (text, params) => {
    return pool.query(text, params);
};

// Función para obtener actividades filtradas por semana
async function getActivitiesByWeek(week) {
    const queryText = `
        SELECT actividad, responsable, stopper, indicador
        FROM actividades
        WHERE semana = $1
    `;
    const { rows } = await pool.query(queryText, [week]);
    return rows;
}

// Función para obtener semanas únicas
async function getUniqueWeeks() {
    const queryText = `
        SELECT DISTINCT semana
        FROM actividades
        ORDER BY semana
    `;
    const { rows } = await pool.query(queryText);
    return rows.map(row => row.semana); // Retorna solo los nombres de las semanas
}

// Función para obtener el Top de Actividades (indicador = 1) por semana
async function getTopActivitiesByWeek(week) {
    console.log(`Fetching top activities for week: ${week}`); // Depuración
    const queryText = `
        SELECT actividad
        FROM actividades
        WHERE semana = $1 AND indicador = 1
    `;
    const { rows } = await pool.query(queryText, [week]);
    console.log(rows); // Depuración
    return rows;
}

module.exports = {
    query,
    getActivitiesByWeek,
    getUniqueWeeks,
    getTopActivitiesByWeek, // Exportamos la nueva función
};