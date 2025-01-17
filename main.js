import {
  getScheduleMatches,
  getLiveMatches,
  getFinishedMatches,
  getCompetitions,
  getLeagueStandings
} from "./api.js";

document.addEventListener('DOMContentLoaded', async function () {
  const selectedTeamNameElement = document.getElementById('selectedTeamName');
  const liveMatchInfoElement = document.getElementById('liveMatchInfo');
  const recentMatchesListElement = document.getElementById('recentMatchesList');
  const upcomingMatchesListElement = document.getElementById('upcomingMatchesList');
  const standingsBodyElement = document.getElementById('standingsBody');

  const { selectedTeam } = await chrome.storage.local.get('selectedTeam');
  if (!selectedTeam) {
    selectedTeamNameElement.textContent = 'No team selected';
    return;
  }

  console.log('Selected team:', selectedTeam);

  selectedTeamNameElement.textContent = selectedTeam.name;

  try {
    const [liveMatches, recentMatches, upcomingMatches] = await Promise.all([
      getLiveMatches(selectedTeam.id),
      getFinishedMatches(selectedTeam.id),
      getScheduleMatches(selectedTeam.id)
    ]);

    liveMatchInfoElement.innerHTML = renderLiveMatches(liveMatches.matches || []);

    recentMatchesListElement.innerHTML = renderMatches(recentMatches.matches || [], 5);
    upcomingMatchesListElement.innerHTML = renderMatches(upcomingMatches.matches || [], 5);

    if (!selectedTeam.runningCompetitions || selectedTeam.runningCompetitions.length === 0) {
      console.log('No running competitions for the selected team.');
      standingsBodyElement.innerHTML = '<tr><td colspan="7">No running competitions for the selected team.</td></tr>';
      return;
    }

    const competitions = await getCompetitions();

    const teamCompetition = selectedTeam.runningCompetitions.find(teamComp => {
      return competitions.competitions.some(apiComp => apiComp.id === teamComp.id);
    });

    if (teamCompetition) {
      console.log('Team competition found:', teamCompetition);
      const standings = await getLeagueStandings(teamCompetition.id);
      standingsBodyElement.innerHTML = renderStandings(standings.standings[0].table);
    } else {
      console.log('No matching competition found for the team.');
      standingsBodyElement.innerHTML = '<tr><td colspan="7">Competition not found.</td></tr>';
    }
  } catch (error) {
    console.error('Error fetching team data:', error);
  }
});


function renderLiveMatches(matches) {
  if (matches.length === 0) {
    return '<p>No live matches at the moment.</p>';
  }
  return matches.map(match => `
    <div class="match live">
      <p>${match.homeTeam.name} vs ${match.awayTeam.name}</p>
      <p>Score: ${match.score.fullTime.home} - ${match.score.fullTime.away}</p>
    </div>
  `).join('');
}

function renderMatches(matches, limit) {
  const limitedMatches = matches.slice(0, limit);

  return limitedMatches.map(match => `
    <li class="match">
      <p>${match.homeTeam.name} vs ${match.awayTeam.name}</p>
      <p>Date: ${new Date(match.utcDate).toLocaleDateString()}</p>
      ${match.status === 'FINISHED' ? `<p>Score: ${match.score.fullTime.home} - ${match.score.fullTime.away}</p>` : ''}
    </li>
  `).join('');
}

function renderStandings(standings) {
  return standings.map(team => `
    <tr>
      <td>${team.position}</td>
      <td>${team.team.name}</td>
      <td>${team.playedGames}</td>
      <td>${team.won}</td>
      <td>${team.draw}</td>
      <td>${team.lost}</td>
      <td>${team.goalDifference}</td>
    </tr>
  `).join('');
}
