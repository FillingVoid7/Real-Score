const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 3000;
app.use(cors());
const API_KEY = '325167f3444f4b8dad4ee1be5399a440';
const BASE_URL = 'https://api.football-data.org/v4';

const COMPETITION_IDS = ['PL', 'BL1', 'SA', 'PD', 'FL1'];

let cachedTeams = null;
const cacheTimeout = 24 * 60 * 60 * 1000; // 24 hours

async function fetchAndCacheTeams() {
  console.log('Fetching teams for all specified competitions...');
  
  try {
    const teamsPromises = COMPETITION_IDS.map(async (competitionId) => {
      const url = `${BASE_URL}/competitions/${competitionId}/teams`;
      console.log(`Fetching teams from: ${url}`);
      const response = await axios.get(url, {
        headers: { 'X-Auth-Token': API_KEY }
      });
      return response.data.teams;
    });

    const allTeams = await Promise.all(teamsPromises);
    cachedTeams = allTeams.flat();
    console.log(`Cached ${cachedTeams.length} teams from ${COMPETITION_IDS.length} competitions`);
    setTimeout(() => { cachedTeams = null; }, cacheTimeout);
  } catch (error) {
    console.error('Error fetching teams:', error.message);
    throw error;
  }
}

app.get('/api/teams', async (req, res) => {
  try {
    if (!cachedTeams) {
      await fetchAndCacheTeams();
    }
    
    let teams = cachedTeams;
    const { search } = req.query;
    
    if (search) {
      teams = teams.filter(team => 
        team.name.toLowerCase().includes(search.toLowerCase()) ||
        team.shortName.toLowerCase().includes(search.toLowerCase()) ||
        team.tla.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    res.json({ count: teams.length, teams: teams });
  } catch (error) {
    res.status(500).send('Error fetching teams');
  }
});

app.get('/api/teams/:teamId/*', async (req, res) => {
  const { teamId } = req.params;
  const restOfUrl = req.params[0];
  const url = `${BASE_URL}/teams/${teamId}/${restOfUrl}`;
  
  const queryParams = new URLSearchParams(req.query).toString();
  const fullUrl = queryParams ? `${url}?${queryParams}` : url;

  console.log(`Requesting: ${fullUrl}`);

  try {
    const response = await axios.get(fullUrl, {
      headers: { 'X-Auth-Token': API_KEY }
    });
    console.log('API Response:', JSON.stringify(response.data, null, 2));
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from API:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).send('Error fetching data from API');
  }
});

app.get('/api/:endpoint', async (req, res) => {
  const { endpoint } = req.params;
  let url = `${BASE_URL}/${endpoint}`;

  const queryParams = new URLSearchParams(req.query).toString();
  if (queryParams) {
    url += `?${queryParams}`;
  }

  console.log(`Requesting: ${url}`);

  try {
    const response = await axios.get(url, {
      headers: { 'X-Auth-Token': API_KEY }
    });
    console.log('API Response:', JSON.stringify(response.data, null, 2));
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from API:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).send('Error fetching data from API');
  }
});

app.get('/api/teams/:teamId', async (req, res) => {
  const { teamId } = req.params;
  const url = `${BASE_URL}/teams/${teamId}`;
  
  console.log(`Requesting: ${url}`);
  
  try {
    const response = await axios.get(url, {
      headers: { 'X-Auth-Token': API_KEY }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from API:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).send('Error fetching data from API');
  }
});

app.get('/api/competitions/:competitionId/standings', async (req, res) => {
  const { competitionId } = req.params;
  const url = `${BASE_URL}/competitions/${competitionId}/standings`;
  
  console.log(`Requesting: ${url}`);
  
  try {
    const response = await axios.get(url, {
      headers: { 'X-Auth-Token': API_KEY }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching standings from API:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).send('Error fetching standings from API');
  }
});



app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});