const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();  
const PORT = 3000;

app.use(cors());

const API_KEY = '325167f3444f4b8dad4ee1be5399a440';
const BASE_URL = 'https://api.football-data.org/v4';

app.get('/api/:endpoint', async (req, res) => {
    const { endpoint } = req.params;
    try {
        const response = await axios.get(`${BASE_URL}/${endpoint}`, {
            headers: {
                'X-Auth-Token': API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data from API:', error);
        res.status(500).send('Error fetching data from API');
    }
});


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});