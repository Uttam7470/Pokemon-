
let offset = 0;
const limit = 40;
let allPokemons = [];

function loadMorePokemons() {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`) // Fetching Pokémon with offset
    .then(response => response.json())
    .then(data => {
        const pokemonlist = data.results;
        const pokemonDisplay = document.getElementById("pokemon-display");

        pokemonlist.forEach(item => {
            createPokemonCard(item, pokemonDisplay);
            allPokemons.push(item);
        });

        offset += limit; // Increment the offset for the next batch of Pokémon
    })
    .catch(error => console.error('Error fetching Pokémon list:', error));
}

function createPokemonCard(pokemonData, parentElement) {
    const displayflip = document.createElement("div");
    displayflip.classList.add("displayflip");
    const pokemonType = pokemonData.name;
    const pokemonName = pokemonData.name;

    displayflip.setAttribute("data-type", pokemonType);
    displayflip.setAttribute("data-name", pokemonName);

    const displayCardInner = document.createElement("div")
    displayCardInner.classList.add("displayCardInner");

    const displayfront = document.createElement("div");
    displayfront.classList.add("displayfrontCard");

    const displayBackFront = document.createElement("div")
    displayBackFront.classList.add("displayBackFrontCard");

    const name = document.createElement("h3");
    name.innerText = pokemonData.name.toUpperCase();

    const id = document.createElement("h3");
    id.classList.add("pokemon-id");
    id.innerText = ""; 

    const pokemonUrl = pokemonData.url;
    const pokemonImage = document.createElement('img');
    const pokemonImageBack = document.createElement('img');

    const type = document.createElement("p");
    type.classList.add("pokemon-type");
    const height = document.createElement("p");
    const weight = document.createElement("p");

    fetch(pokemonUrl)
        .then(response => response.json())
        .then(pokemonData => {
            const imageUrl = pokemonData.sprites.other.dream_world.front_default;
            const imageUrl2 = pokemonData.sprites.front_default;
            const idText = "#" + pokemonData.id; 
            id.innerText = idText; 
            pokemonImage.src = imageUrl;
            pokemonImageBack.src = imageUrl2;
            type.innerHTML = pokemonData.types[0].type.name;
            height.innerHTML = "<strong>Height:</strong> " + pokemonData.height + " cm";
            weight.innerHTML = "<strong>Weight:</strong> " + pokemonData.weight + " kg";

            displayBackFront.append(pokemonImageBack, height, weight);

            pokemonData.stats.forEach((stat) => {
                const para = document.createElement("p");
                para.classList.add("stat");
                para.innerHTML = "<strong>" + stat.stat.name.toUpperCase() + ":</strong> " + stat.base_stat;
                displayBackFront.append(para);
            });

            const typeColors = {
                'grass': '#9ccc65',
                'fire': '#ffcc80',
                'water': '#80d8ff',
                'electric': '#ffd54f',
                'bug': '#c5e1a5',
                'normal': '#eeeeee',
                'poison': 'lightgreen',
                'ground': 'brown',
                'ghost':'red',
                'normal': 'aqua',
            };
            const pokemonType = pokemonData.types[0].type.name.toLowerCase();
            displayCardInner.style.backgroundColor = typeColors[pokemonType] || '#e0e0e0';
        })
        .catch(error => console.error('Error fetching Pokémon data:', error));

    displayfront.append(id, pokemonImage, name, type);

    parentElement.append(displayflip);
    displayflip.append(displayCardInner);
    displayCardInner.append(displayfront);
    displayCardInner.append(displayBackFront);
}

async function searchPokemonsByType() {
    const pokemonDisplay = document.getElementById("pokemon-display");
    pokemonDisplay.innerHTML = ""; // Clear the display

    const selectedType = document.getElementById("carddata").value;

    const filteredPokemons = await Promise.all(allPokemons.map(async pokemon => {
        const response = await fetch(pokemon.url);
        const data = await response.json();
        return { pokemon: pokemon, type: data.types[0].type.name.toLowerCase() };
    }));

    filteredPokemons.forEach(item => {
        if (item.type === selectedType.toLowerCase()) {
            createPokemonCard(item.pokemon, pokemonDisplay);
        }
    });
}

loadMorePokemons(); // Load the initial 40 Pokémon
function searchPokemonsByName() {
    const pokemonNameInput = document.getElementById("pokemon-name-input").value.toLowerCase();
    const pokemonDisplay = document.getElementById("pokemon-display");
    pokemonDisplay.innerHTML = ""; // Clear the display

    allPokemons.forEach(pokemon => {
        if (pokemon.name.includes(pokemonNameInput)) {
            createPokemonCard(pokemon, pokemonDisplay);
        }
    });
}

function resetSearch() {
    document.getElementById("pokemon-name-input").value = ""; // Clear the input field
    document.getElementById("carddata").selectedIndex = 0; // Reset the type selection
    document.getElementById("pokemon-display").innerHTML = ""; // Clear the search results
    setTimeout(function() {
        window.location.reload();
    }, 500);
}


