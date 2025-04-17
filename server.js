const express = require('express');
const cors = require('cors');
const { getActivitiesByWeek, getUniqueWeeks, getTopActivitiesByWeek } = require('./db/connection');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3011;

app.use(cors());
app.use(express.static('public'));

app.get('/api/activities', async (req, res) => {
    const { week } = req.query;
    try {
        const activities = await getActivitiesByWeek(week);
        res.json(activities);
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Nueva ruta para obtener las semanas únicas
app.get('/api/weeks', async (req, res) => {
    try {
        const weeks = await getUniqueWeeks();
        res.json(weeks);
    } catch (error) {
        console.error('Error fetching weeks:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/top-activities', async (req, res) => {
    const { week } = req.query;
    console.log(`Week received: ${week}`); // Depuración
    try {
        const activities = await getTopActivitiesByWeek(week);
        console.log(activities); // Depuración
        res.json(activities);
    } catch (error) {
        console.error('Error fetching top activities:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});