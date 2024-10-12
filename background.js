import { getLiveMatches } from './api.js';

chrome.alarms.create('checkLiveMatches', { periodInMinutes: 5 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkLiveMatches') {
    checkLiveMatches();
  }
});

async function checkLiveMatches() {
  try {
    const liveMatches = await getLiveMatches();
    liveMatches.forEach(match => {
      const notificationOptions = {
        type: 'basic',
        iconUrl: 'images/icon-128.png',
        title: 'Live Match Update',
        message: `${match.homeTeam.name} ${match.score.fullTime.home} - ${match.score.fullTime.away} ${match.awayTeam.name}`
      };
      chrome.notifications.create('liveMatchUpdate', notificationOptions);
    });
  } catch (error) {
    console.error('Error fetching live matches:', error);
  }
}
