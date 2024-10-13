const BASE_URL = 'http://localhost:3000/api';

async function fetchFromAPI(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching data from API:', error);
    throw error;
  }
}

export async function searchTeams(searchTerm) {
  const response = await fetchFromAPI(`teams?search=${encodeURIComponent(searchTerm)}`);
  return response.teams || [];
}

export async function getTeamMatches(teamId) {
  return fetchFromAPI(`teams/${teamId}/matches?status=SCHEDULED,LIVE,FINISHED&limit=10`);
}

export async function getTeamPlayers(teamId) {
  return fetchFromAPI(`teams/${teamId}`);
}

export async function getLeagueStandings(competitionId) {
  return fetchFromAPI(`competitions/${competitionId}/standings`);
}

export async function getLiveMatches() {
  const response = await fetchFromAPI('matches?status=LIVE');
  return response.matches || [];
}

export async function getCompetitions() {
  return fetchFromAPI('competitions');
}