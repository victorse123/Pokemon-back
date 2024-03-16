const { Router } = require("express");
const getTypePokemon = require("../controllers/getTypePokemon");

const router = Router();
router.get("/", async (req,res) => {
    const types = await getTypePokemon();
    res.send(types);
});

module.exports = router; 
