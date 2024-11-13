class PokemonFinder {
    constructor() {
        this.allPokemon = [];
        this.baseURL = 'https://pokeapi.co/api/v2';
    }

    async getAllPokemon() {
        try {
            const response = await axios.get(`${this.baseURL}/pokemon?limit=2000`);
            this.allPokemon = response.data.results;
            return this.allPokemon;
        } catch (e) {
            console.error("Error fetching all pokemon:", e);
        }
    }

    getRandomPokemon(count = 3) {
        const randomPokemon = [];
        for (let i = 0; i < count; i++) {
            const randomIdx = Math.floor(Math.random() * this.allPokemon.length);
            randomPokemon.push(this.allPokemon[randomIdx]);
        }
        return randomPokemon;
    }

    async getPokemonData(pokemon) {
        try {
            // Get basic pokemon data
            const pokemonRes = await axios.get(pokemon.url);
            // Get species data
            const speciesRes = await axios.get(pokemonRes.data.species.url);
            
            // Find English description
            const englishDescription = speciesRes.data.flavor_text_entries.find(
                entry => entry.language.name === "en"
            );

            return {
                name: pokemon.name,
                image: pokemonRes.data.sprites.front_default,
                description: englishDescription ? englishDescription.flavor_text : "No description available"
            };
        } catch (e) {
            console.error(`Error fetching data for ${pokemon.name}:`, e);
        }
    }

    async getThreeRandomPokemonWithData() {
        const randomPokemon = this.getRandomPokemon(3);
        const pokemonDataPromises = randomPokemon.map(p => this.getPokemonData(p));
        return await Promise.all(pokemonDataPromises);
    }

    displayPokemon(pokemonData) {
        const pokemonArea = document.getElementById('pokemon-area');
        pokemonArea.innerHTML = ''; // Clear existing pokemon

        pokemonData.forEach(pokemon => {
            const pokemonCard = document.createElement('div');
            pokemonCard.classList.add('pokemon-card');
            
            pokemonCard.innerHTML = `
                <h2>${pokemon.name}</h2>
                <img src="${pokemon.image}" alt="${pokemon.name}">
                <p>${pokemon.description}</p>
            `;
            
            pokemonArea.appendChild(pokemonCard);
        });
    }
}

// Initialize and set up event listeners
window.addEventListener('DOMContentLoaded', async () => {
    const finder = new PokemonFinder();
    await finder.getAllPokemon();

    document.getElementById('get-pokemon').addEventListener('click', async () => {
        const pokemonData = await finder.getThreeRandomPokemonWithData();
        finder.displayPokemon(pokemonData);
    });
});