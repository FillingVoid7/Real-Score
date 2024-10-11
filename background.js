import { getLiveMatches } from './api.js';

chrome.runtime.onInstalled.addListener(function() {
    console.log('Live Soccer Scorer extension installed');
});

function checkLiveMatches() {
    chrome.storage.local.get('selectedTeam', function(data) {
        if (data.selectedTeam) {
            getLiveMatches()
                .then(matchesData => {
                    const teamMatch = matchesData.matches.find(match => 
                        match.homeTeam.id === data.selectedTeam.id || match.awayTeam.id === data.selectedTeam.id
                    );
                    if (teamMatch) {
                        chrome.notifications.create({
                            type: 'basic',
                            iconUrl: 'images/icon128.png',
                            title: 'Live Match Update!',
                            message: `${teamMatch.homeTeam.name} ${teamMatch.score.fullTime.home} - ${teamMatch.score.fullTime.away} ${teamMatch.awayTeam.name}`,
                            priority: 2
                        });
                    }
                })
                .catch(error => console.error('Error checking live matches:', error));
        }
    });
}

// Check for updates every 5 minutes
setInterval(checkLiveMatches, 5 * 60 * 1000);