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
    const teams = response.teams || [];

    if (teams.length > 0) {
        const selectedTeam = teams[0];

        const teamDetailsResponse = await fetchFromAPI(`teams/${selectedTeam.id}`);

        selectedTeam.runningCompetitions = teamDetailsResponse.runningCompetitions || [];

        await chrome.storage.local.set({ selectedTeam });

        console.log('Selected team with running competitions saved:', selectedTeam);
    }

    return teams;
}


export async function getScheduleMatches(teamId) {
    return fetchFromAPI(`teams/${teamId}/matches?status=SCHEDULED&limit=10`);
}

export async function getLiveMatches(teamId) {
    return fetchFromAPI(`teams/${teamId}/matches?status=LIVE&limit=10`);
}

export async function getFinishedMatches(teamId) {
    return fetchFromAPI(`teams/${teamId}/matches?status=FINISHED&limit=10`);
}

export async function getTeamPlayers(teamId) {
    return fetchFromAPI(`teams/${teamId}`);
}

export async function getLeagueStandings(competitionId) {
    return fetchFromAPI(`competitions/${competitionId}/standings`);
}

export async function getCompetitions() {
    return fetchFromAPI('competitions');
}


