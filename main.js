import { getTeamMatches, getTeamPlayers, getLeagueStandings, getLiveMatches } from './api.js';

document.addEventListener('DOMContentLoaded', async function() {
    const teamNameElement = document.getElementById('teamName');
    const matchesElement = document.getElementById('matches');
    const standingsElement = document.getElementById('standings');
    const playersElement = document.getElementById('players');

    const { selectedTeam } = await chrome.storage.local.get('selectedTeam');
    if (!selectedTeam) {
        teamNameElement.textContent = 'No team selected';
        return;
    }

    teamNameElement.textContent = selectedTeam.name;

    try {
        const matches = await getTeamMatches(selectedTeam.id);
        matchesElement.innerHTML = renderMatches(matches);

        const players = await getTeamPlayers(selectedTeam.id);
        playersElement.innerHTML = renderPlayers(players);

        const standings = await getLeagueStandings('some_competition_id');  // Pass competition ID here
        standingsElement.innerHTML = renderStandings(standings);
    } catch (error) {
        console.error('Error fetching team data:', error);
    }
});

function renderMatches(matches) {
    return matches.map(match => `
        <div class="match">
            <p>${match.homeTeam.name} vs ${match.awayTeam.name}</p>
            <p>Score: ${match.score.fullTime.home} - ${match.score.fullTime.away}</p>
        </div>
    `).join('');
}

function renderPlayers(players) {
    return players.map(player => `
        <div class="player">
            <p>${player.name} (${player.position})</p>
        </div>
    `).join('');
}

function renderStandings(standings) {
    return standings.map(team => `
        <div class="standing">
            <p>${team.position}. ${team.team.name} - ${team.points} points</p>
        </div>
    `).join('');
}
