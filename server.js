const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.post('/getWeather', async (req, res) => {
  try {
    const { cities } = req.body;
    const weatherData = {};
    await Promise.all(
      cities.map(async (city) => {
        try {
          const url = process.env.WEATHER_API_URL + '?key=' + process.env.API_KEY+ '&q='+ city;
          console.log(url);
          const response = await axios.get(url);
          const temperature = response.data.current.temp_c + "C";
          weatherData[city] = temperature;
        } catch (error) {
          console.error(`Error fetching weather data for ${city}: ${error}`);
        }
      })
    );
    res.json({ weather: weatherData });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});
const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
