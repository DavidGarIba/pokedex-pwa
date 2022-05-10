let elements = {
    navigator: null,
    pokemonRow: null,
};

const changePage = (page, data) => {
    elements.navigator.pushPage(page, {data});
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


document.addEventListener('init', (e) => {
    if (e.target.id === 'home') {
        elements = {
            navigator: document.querySelector('#navigator'),
        }
    
        ons.preload(['views/pokemon.html']);
    
        const fetchPokemon = () => {
        
            const promises = [];
            for (let i = 1; i <= 151; i++) {
                var url = `https://pokeapi.co/api/v2/pokemon/${i}`;
                promises.push(fetch(url).then((res) => res.json()));
            }
            Promise.all(promises).then((results) => {
                const pokemon = results.map((result) => ({
                    name: result.name,
                    image: result.sprites['front_default'],
                    type: result.types.map((type) => type.type.name).join(', '),
                    id: result.id
                }));
                pokemon.forEach((pokemon) => {
                    var newItem = document.createElement('ons-list-item');;
                    newItem.innerHTML = "No" + pokemon.id + " " + capitalizeFirstLetter(pokemon.name);
                    newItem.setAttribute("modifier","chevron");
                    newItem.setAttribute("tappable", "");
                    newItem.setAttribute("id", pokemon.id);
                    newItem.addEventListener('click', () => changePage('views/pokemon.html', {id: pokemon.id}));
                    document.getElementById('pokemonList').appendChild(newItem);
                });
            });
        };
        fetchPokemon();
    }

    if (e.target.id === 'pokemon') {
        elements = {
            navigator: document.querySelector('#navigator'),
            pokemonTitle: document.querySelector('#pokemonTitle'),
            pokemonImage: document.querySelector('#pokemonImage'),
            pokemonName: document.querySelector('#pokemonName'),
            pokemonTypes: document.querySelector('#pokemonTypes'),
            pokemonStats: document.querySelector('#pokemonStats'),
        }

        const fetchPokemon2 = async () => {

            var pokemonID = e.target.data.id;
            var url2 = `https://pokeapi.co/api/v2/pokemon/${pokemonID}`;

            const response = await fetch(url2);
            const json = await response.json();
            const name = json.name;
            const image = json.sprites['front_default'];
            const type = json.types;
            const stat = json.stats;
            const move = json.moves;

            
            var newImage = document.createElement('img');
            newImage.setAttribute("src", image);
            newImage.setAttribute("style", "width: 100%");
            document.getElementById('pokemonImage').appendChild(newImage);
            
            pokemonTitle.innerHTML = capitalizeFirstLetter(name);
            
            pokemonName.innerHTML = pokemonID + "# " + capitalizeFirstLetter(name);

            type.forEach((type) => {
                var newItem = document.createElement('ons-list-item');;
                newItem.innerHTML = type.type.name;
                document.getElementById('pokemonTypes').appendChild(newItem);
            });

            stat.forEach((stat) => {
                var newItem = document.createElement('ons-list-item');;
                newItem.innerHTML = capitalizeFirstLetter(stat.stat.name) + " " + stat.base_stat;
                document.getElementById('pokemonStats').appendChild(newItem);
            });

            move.forEach((move) => {
                var newItem = document.createElement('ons-list-item');;
                newItem.innerHTML = move.move.name;
                document.getElementById('pokemonMoves').appendChild(newItem);
            });


        };
        fetchPokemon2();
    }
});

const popPage = () => elements.navigator.popPage();
// Padd the history with an extra page so that we don't exit right away
window.addEventListener('load', () => window.history.pushState({ }, ''));
// When the browser goes back a page, if our navigator has more than one page we pop the page and prevent the back event by adding a new page
// Otherwise we trigger a second back event, because we padded the history we need to go back twice to exit the app.
window.addEventListener('popstate', () => {
  const { pages } = elements.navigator;
  if (pages && pages.length > 1) {
    popPage();
    window.history.pushState({ }, '');
  } else {
    window.history.back();
  }
});