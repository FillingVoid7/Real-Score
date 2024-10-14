import { searchTeams } from './api.js';

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('teamSearch');
    const searchResults = document.getElementById('searchResults');
    const openFullPageButton = document.getElementById('openFullPage');
    let debounceTimer;

    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const searchTerm = this.value;
            if (searchTerm.length > 2) {
                searchTeams(searchTerm).then(data => {
                    searchResults.innerHTML = '';
                    data.forEach(team => {
                        const li = document.createElement('li');
                        li.textContent = team.name;
                        li.addEventListener('click', async function() {
                            // Fetch team details including runningCompetitions
                            const teamDetails = await searchTeams(team.name);
                            const selectedTeamDetails = teamDetails.find(t => t.id === team.id);

                            chrome.storage.local.set({
                                selectedTeam: {
                                    id: team.id,
                                    name: team.name,
                                    runningCompetitions: selectedTeamDetails.runningCompetitions
                                }
                            }, function() {
                                console.log('Team saved with running competitions:', team.name, selectedTeamDetails.runningCompetitions);
                            });

                            searchInput.value = team.name;
                            searchResults.innerHTML = '';
                        });
                        searchResults.appendChild(li);
                    });
                })
                .catch(error => {
                    console.error('Error fetching teams:', error);
                    searchResults.innerHTML = '<li>Failed to fetch teams</li>';
                });
            } else {
                searchResults.innerHTML = '';
            }
        }, 300);
    });

    openFullPageButton.addEventListener('click', function() {
        chrome.tabs.create({url: 'main.html'});
    });
});
