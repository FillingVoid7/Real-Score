import {searchTeams} from '.api/js';

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('teamSearch');
    const searchResults = document.getElementById('searchResults');
    const openFullPageButton = document.getElementById('openFullPage');

    let debounceTimer ; 

    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(()=>{
            const searchTeam = this.value ; 
            if (searchTeam.length >2){
                searchTeams(searchTeam).then(data => {
                    searchResults.innerHTML = '';
                    data.items.forEarch(team=>{
                        const li = document.createElement('li');
                        li.textContent = team.name;
                        li.addEventListener('click', function(){
                            chrome.storage.local.set({selectedTeam : {id: team.id , name:team.name}}, function(){
                                console.log('Team saved:', team.name);
                    });
                    searchInput.value = team.name ; 
                    searchResults.innerHTML = '';
                });
                searchResults.appendChild(li);
            });
        })
        .catch(error =>{
            console.error('Error fetching teams:', error);
            searchResults.innerHTML = '<li>Failed to fetch teams</li>';
        });
    }
    else{
        searchResults.innerHTML = '';
    }
    },300);
});    


openFullPageButton.addEventListener('click', function(){
    chrome.tabs.create({url: 'main.html'});
});

});