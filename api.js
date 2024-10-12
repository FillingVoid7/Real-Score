const API_KEY = '325167f3444f4b8dad4ee1be5399a440';
const BASE_URL = 'https://api.football-data.org/v4';

async function fetchFromAPI(endpoint) {
    try {
        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            headers: {
                'X-Auth-Token': API_KEY
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch data from API: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching data from API:', error);
        throw error;
    }
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

export async function searchTeams(searchTerm) {
    const response = await fetchFromAPI(`teams?search=${encodeURIComponent(searchTerm)}`);
    return response.teams || [];
}

export async function getLiveMatches() {
    const response = await fetchFromAPI('matches?status=LIVE');
    return response.matches || [];
}