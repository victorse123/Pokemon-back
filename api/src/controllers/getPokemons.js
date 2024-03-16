const axios = require("axios");
const { Pokemon, Type } = require("../db");

const getPokemons = async (req, res) => {
    try {
       
        const pokApi = await getPokemonApi();
        const pokDb = await getPokemonDB();
       
        return pokApi.concat(pokDb);
    } catch (error) {
       
        res.status(400).json({ error: error.message });
    }
};

const getPokemonDB = async (req, res) => {
    try {
        const pokemonesDB = await Pokemon.findAll({
            include: {
                model: Type,
                attributes: ["name"],
                through: { attributes: [] },
            },
        });

        const filterPoke = pokemonesDB.map((e) => {
            return {
                id: e.id,
                name: (e.name).charAt(0).toUpperCase() + (e.name).slice(1),
                life: e.life,
                stroke: e.stroke,
                defending: e.defending,
                speed: e.speed,
                height: e.height,
                weight: e.weight,
                imageDefault: e.imageDefault, 
                types: e.types.map((t) => t.name),
                createdDB: e.createdDB,
            };
        });

       
        return filterPoke;
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getPokemonApi = async (req, res) => {
    try {
        const { data } = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=800"); 
        const { results } = data;
        const pokePromis = results.map((e) => e.url);
        const allPoke = await Promise.all(pokePromis.map((url) => axios.get(url)));
      
        const pokemonsApi = allPoke.map((obj) => {
            let e = obj.data;
            let pokemon = {
                id: e.id,
                name: (e.name).charAt(0).toUpperCase() + (e.name).slice(1),
                life: e.stats[0].base_stat,
                stroke: e.stats[1].base_stat,
                defending: e.stats[2].base_stat,
                speed: e.stats[5].base_stat,
                height: e.height,
                weight: e.weight,
                imageDefault: e.sprites.other.dream_world.front_default,
                types: e.types.map((t) => t.type.name),
                createdDB: false,
            };
            return pokemon;
        });
        return pokemonsApi;
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = getPokemons;