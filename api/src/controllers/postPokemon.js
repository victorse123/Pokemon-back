const {Pokemon} = require("../db");

const postPokemon = async (newPok, res) => { // Agrega res como un parámetro
    try {
        let { name, life, stroke, defending, speed, height, weight, imageDefault, type } = newPok;

        // Carga el Pokemon creado a la database (DB)
        let pokeCreated = await Pokemon.create({
            name,
            life,
            stroke,
            defending,
            speed,
            height,
            weight,
            imageDefault,
            type
        });

        return pokeCreated; // Devuelve el Pokémon creado
    } catch (error) {
        res.status(500).json({ error: error.message }); // Envía una respuesta de error al cliente
        console.log(error);
    }
}

module.exports = postPokemon;