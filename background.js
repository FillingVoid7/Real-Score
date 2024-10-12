import { getTeamMatches } from './api.js';

chrome.alarms.create('checkLiveMatches', { periodInMinutes: 5 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkLiveMatches') {
    checkLiveMatches();
  }
});

async function checkLiveMatches() {
  try {
    const { selectedTeam } = await chrome.storage.local.get('selectedTeam');
    if (!selectedTeam) return;

    const matchesData = await getTeamMatches(selectedTeam.id);
    const liveMatch = matchesData.matches.find(match => match.status === 'LIVE');

    if (liveMatch) {
      const notificationOptions = {
        type: 'basic',
        iconUrl: 'images/icon-128.png',
        title: 'Live Match Update',
        message: `${liveMatch.homeTeam.name} ${liveMatch.score.fullTime.home} - ${liveMatch.score.fullTime.away} ${liveMatch.awayTeam.name}`
      };

      chrome.notifications.create('liveMatchUpdate', notificationOptions);
    }
  } catch (error) {
    console.error('Error checking live matches:', error);
  }
}

// Initial check when the extension is loaded
checkLiveMatches();