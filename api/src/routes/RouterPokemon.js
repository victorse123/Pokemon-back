const { Router } = require("express");
const getPokemons = require("../controllers/getPokemons");
const getPokemonNameId = require("../controllers/getPokemonNameId");
const postPokemon = require("../controllers/postPokemon");
const {Type} = require("../db");

const router = Router();

// Ruta para buscar Pokémon por nombre o obtener todos los Pokémon
router.get("/", async (req, res) => {

    const {name} = req.query
    try {
        const pokemons = await getPokemons()
        if(name) {
            // Buscar Pokémon por nombre si se proporciona un nombre en la consulta
            const poke = await pokemons.filter(pok => pok.name.toLowerCase().startsWith(name.toLowerCase()))
            if( poke.length > 0 ) {
            res.status(200).json(poke) }
            else {
                res.status(404).json("not found")
            }

        } else {
            
            return res.json(pokemons)
        }
    } catch (error) {
        res.status(500).json({error: error.messaje})
    }
});

// Ruta para buscar Pokémon por ID
router.get("/:id", async (req, res) =>{
   
    const {id} = (req.params);
  
    try {
        // Buscar Pokémon por ID
        const pokeID = await getPokemonNameId(id)
        res.status(200).json(pokeID)
    } catch (error) {
        res.status(500).json({error: error.messaje})
    }
});

// Ruta para crear un nuevo Pokémon
router.post('/', async (req, res) => {
    console.log(req.body);
    try {      
        let newPok = req.body;        
        let pokCreated = await postPokemon(newPok, res); // Pasa res al controlador postPokemon

        // Busca los tipos en la base de datos (DB)
        let typesDb = await Type.findAll({ where: { name: newPok.type } });

        // Asocia el Pokémon a los tipos encontrados
        await pokCreated.addType(typesDb);

        res.status(201).send('Pokemon Creado');
        
    } catch (error) {
        res.status(500).json({error: error.message});
        console.log(error);
    }
});

module.exports = router;