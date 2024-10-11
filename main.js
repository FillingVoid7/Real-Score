const API_KEY = '325167f3444f4b8dad4ee1be5399a440';
const BASE_URL = 'https://api.football-data.org/v4';

document.addEventListener('DOMContentLoaded', function() {
    const selectedTeamName = document.getElementById('selectedTeamName');
    const upcomingMatchesList = document.getElementById('upcomingMatchesList');
    const recentMatchesList = document.getElementById('recentMatchesList');
    const liveMatchInfo = document.getElementById('liveMatchInfo');
    const playerStatsList = document.getElementById('playerStatsList');
    const standingsBody = document.getElementById('standingsBody');

    // Load selected team from Chrome storage
    chrome.storage.local.get('selectedTeam', (data) => {
        if (data.selectedTeam) {
            const { id, name } = data.selectedTeam;
            selectedTeamName.textContent = name;
            loadTeamData(id);
        }
    });

    const loadTeamData = async (teamId) => {
        try {
            const matchesData = await getTeamMatches(teamId);
            const now = new Date();

            const upcomingMatches = matchesData.matches.filter(match => new Date(match.utcDate) > now);
            const recentMatches = matchesData.matches.filter(match => new Date(match.utcDate) <= now);
            const liveMatch = matchesData.matches.find(match => match.status === 'LIVE');

            // Display upcoming matches
            upcomingMatchesList.innerHTML = upcomingMatches.map(match => `
                <li>${match.homeTeam.name} vs ${match.awayTeam.name} - 
                Date: ${new Date(match.utcDate).toLocaleDateString()}, 
                Time: ${new Date(match.utcDate).toLocaleTimeString()}</li>
            `).join('');

            // Display recent matches
            recentMatchesList.innerHTML = recentMatches.map(match => `
                <li>${match.homeTeam.name} ${match.score.fullTime.home} - 
                ${match.score.fullTime.away} ${match.awayTeam.name} - 
                Date: ${new Date(match.utcDate).toLocaleDateString()}</li>
            `).join('');

            // Display live match
            if (liveMatch) {
                liveMatchInfo.innerHTML = `
                    <h3>${liveMatch.homeTeam.name} vs ${liveMatch.awayTeam.name}</h3>
                    <p>Score: ${liveMatch.score.fullTime.home} - ${liveMatch.score.fullTime.away}</p>
                    <p>Time: ${liveMatch.minute}'</p>
                `;
            } else {
                liveMatchInfo.innerHTML = '<p>No live matches at the moment.</p>';
            }

            // Load player stats
            const playersData = await getTeamPlayers(teamId);
            playerStatsList.innerHTML = playersData.squad.map(player => `
                <li>${player.name} - Position: ${player.position || 'N/A'}</li>
            `).join('');

            // Load standings
            const standingsData = await getLeagueStandings(2021); // Assuming Premier League
            standingsBody.innerHTML = standingsData.standings[0].table.map(team => `
                <tr>
                    <td>${team.position}</td>
                    <td>${team.team.name}</td>
                    <td>${team.points}</td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error loading team data:', error);
        }
    };

    const fetchFromAPI = async (endpoint) => {
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
    };

    const getTeamMatches = async (teamId) => {
        return fetchFromAPI(`teams/${teamId}/matches?status=SCHEDULED,LIVE,FINISHED&limit=10`);
    };

    const getTeamPlayers = async (teamId) => {
        return fetchFromAPI(`teams/${teamId}`);
    };

    const getLeagueStandings = async (competitionId) => {
        return fetchFromAPI(`/competitions/${competitionId}/standings`);
    };
});
