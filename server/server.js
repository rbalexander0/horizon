const express = require('express');
require('dotenv').config(); // Load environment variables from .env

const app = express();
const cors = require('cors');

// Remove this by specifying the allowed origins & proxy in package.json
app.use(cors());

// Proxy Route for Current Weather API
app.get('/api/weather', async (req, res) => {
    try {
        const api = req.query.city ?
            `https://api.openweathermap.org/data/2.5/weather?q=${req.query.city}&units=${req.query.units}&lang=${req.query.lang}&appid=${process.env.OPEN_WEATHER_MAP_API_KEY}` :
            `https://api.openweathermap.org/data/2.5/weather?lat=${req.query.lat}&lon=${req.query.lon}&units=${req.query.units}&lang=${req.query.lang}&appid=${process.env.OPEN_WEATHER_MAP_API_KEY}`;

        const apiResponse = await fetch(api);
        const data = await apiResponse.json();
        res.json(data);

    } catch (error) {
        console.error("Error calling external API:", error);
        res.status(500).json({ error: 'An error occurred' }); // Send an error response
    }
});

// Proxy Route for Forecast API
app.get('/api/forecast', async (req, res) => {
    try {
        const api = req.query.query ?
            `https://api.openweathermap.org/data/2.5/forecast?q=${req.query.query}&units=${req.query.units}&lang=${req.query.lang}&appid=${process.env.OPEN_WEATHER_MAP_API_KEY}` :
            `https://api.openweathermap.org/data/2.5/forecast?lat=${req.query.lat}&lon=${req.query.lon}&units=${req.query.units}&lang=${req.query.lang}&appid=${process.env.OPEN_WEATHER_MAP_API_KEY}`;

        const apiResponse = await fetch(api);
        const data = await apiResponse.json();
        res.json(data);

    } catch (error) {
        console.error("Error calling external API:", error);
        res.status(500).json({ error: 'An error occurred' }); // Send an error response
    }
});

// Google Maps API Key Proxy Route
app.get('/api/google-maps-api-key', async (req, res) => {
    try {
        // TODO: Figure out how to hide API key (this one looks trickier)
        res.json({ key: process.env.GOOGLE_MAPS_API_KEY }); // Send the data back to the frontend
    } catch (error) {
        console.error("Error calling external API:", error);
        res.status(500).json({ error: 'An error occurred' }); // Send an error response
    }
});


// Start the server
const port = process.env.PORT || 5000; // Use environment variable for port or default to 5000
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});