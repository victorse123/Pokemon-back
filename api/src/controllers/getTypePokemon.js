const axios = require("axios");
const { Type } = require("../db");

const getTypePokemon = async () => {
    try {
        const { data } = await axios.get("https://pokeapi.co/api/v2/type");
        const typesAll = await Promise.all(data.results.map(async (data) => {
            let resp = await axios.get(data.url);
            const typeAdd = {
                id: resp.data.id,
                name: resp.data.name
            };
            
            const [type, created] = await Type.findOrCreate({
                where: { name: resp.data.name },
            });

            // la información de created se imprime un mensaje si el tipo fue creado o encontrado
            if (created) {
                console.log(`Nuevo tipo creado: ${type.name}`);
            } else {
                console.log(`Tipo existente encontrado: ${type.name}`);
            }

            return typeAdd;
        }));
        return typesAll;
    } catch (error) {
        
        res.status(400).json({ error: error.message });
    }
};

module.exports = getTypePokemon;