const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


const connection = mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBDATABASE
});

//----- Pokémon endpoints (William) -----
// SEARCH: Find Pokemon by name
app.get('/pokemon/search', (req, res) => {
    const name = req.query.name;

    if (!name || !name.trim()) {
        return res.status(400).json({
            error: 'Please enter a Pokemon name'
        });
    }

    connection.query(
        'SELECT * FROM pokemon WHERE name LIKE ?',
        [`%${name.trim()}%`],
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    error: 'Database error'
                });
            }

            res.json(results);
        }
    );
});


// FILTER: Get Pokemon by type
app.get('/pokemon/type/:type', (req, res) => {
    const type = req.params.type;

    connection.query(
        `SELECT * FROM pokemon
         WHERE primary_type = ?
            OR secondary_type = ?`,
        [type, type],
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    error: 'Database error'
                });
            }

            res.json(results);
        }
    );
});

// GET: Get all Pokemon
app.get('/pokemon', (req, res) => {
    connection.query(
        'SELECT * FROM pokemon',
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    error: 'Database error'
                });
            }

            res.json(results);
        }
    );
});

// GET: Get one Pokemon by Pokedex number
app.get('/pokemon/:id', (req, res) => {
    const id = req.params.id;

    connection.query(
        'SELECT * FROM pokemon WHERE pokedex_number = ?',
        [id],
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    error: 'Database error'
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    error: 'Pokemon not found'
                });
            }

            res.json(results[0]);
        }
    );
});

// POST: Add a new Pokemon
app.post('/pokemon', (req, res) => {
    const {
        pokedex_number,
        name,
        speed,
        special_defence,
        special_attack,
        defence,
        attack,
        hp,
        primary_type,
        secondary_type,
        body_shape_id,
        evolution_stage_id
    } = req.body;

    if (pokedex_number == null || !name || !primary_type) {
        return res.status(400).json({
            error: 'Pokedex number, name and primary type are required'
        });
    }

    const sql = `
        INSERT INTO pokemon (
            pokedex_number,
            name,
            speed,
            special_defence,
            special_attack,
            defence,
            attack,
            hp,
            primary_type,
            secondary_type,
            body_shape_id,
            evolution_stage_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        pokedex_number,
        name,
        speed,
        special_defence,
        special_attack,
        defence,
        attack,
        hp,
        primary_type,
        secondary_type,
        body_shape_id,
        evolution_stage_id
    ];

    connection.query(sql, values, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({
                error: 'Could not add Pokemon'
            });
        }

        res.status(201).json({
            message: 'Pokemon added successfully',
            pokedex_number: pokedex_number
        });
    });
});

// PUT: Update a Pokemon
app.put('/pokemon/:id', (req, res) => {
    const id = req.params.id;

    const {
        name,
        speed,
        special_defence,
        special_attack,
        defence,
        attack,
        hp,
        primary_type,
        secondary_type,
        body_shape_id,
        evolution_stage_id
    } = req.body;

    if (!name || !primary_type) {
        return res.status(400).json({
            error: 'Name and primary type are required'
        });
    }

    const sql = `
        UPDATE pokemon
        SET name = ?,
            speed = ?,
            special_defence = ?,
            special_attack = ?,
            defence = ?,
            attack = ?,
            hp = ?,
            primary_type = ?,
            secondary_type = ?,
            body_shape_id = ?,
            evolution_stage_id = ?
        WHERE pokedex_number = ?
    `;

    const values = [
        name,
        speed,
        special_defence,
        special_attack,
        defence,
        attack,
        hp,
        primary_type,
        secondary_type,
        body_shape_id,
        evolution_stage_id,
        id
    ];

    connection.query(sql, values, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({
                error: 'Could not update Pokemon'
            });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                error: 'Pokemon not found'
            });
        }

        res.json({
            message: 'Pokemon updated',
            pokedex_number: Number(id)
        });
    });
});

// DELETE: Delete a Pokemon
app.delete('/pokemon/:id', (req, res) => {
    const id = req.params.id;

    connection.query(
        'DELETE FROM pokemon WHERE pokedex_number = ?',
        [id],
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    error: 'Could not delete Pokemon'
                });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    error: 'Pokemon not found'
                });
            }

            res.json({
                message: 'Pokemon deleted',
                pokedex_number: Number(id)
            });
        }
    );
});

//----- Trainer endpoints (Sebastian) -----
// Se en liste over alle trainers.

app.get("/showAllTrainers", (req, res) =>{

    const requestParameter = req.query.name;

    connection.query(
        "SELECT * FROM trainer",
        [requestParameter],
        (error, results) => {
            res.send(results);
        }
    );
});

// Se hvilke Pokémon en bestemt træner har fanget.

app.get("/trainerOwnsPokemon", (req, res) =>{

    const requestParameter = req.query.trainer_name;

    connection.query(
        "SELECT * FROM pokemon JOIN trainer_pokemon ON trainer_pokemon.pokedex_number = pokemon.pokedex_number JOIN trainer on trainer.trainer_id = trainer_pokemon.trainer_id WHERE trainer.trainer_name = ?",
        [requestParameter],
        (error, results) => {
            res.send(results);
        }
    );
});





// Opretter en ny trainer.

app.post("/createNewTrainer",(req,res) =>{
    const name = req.body.trainer_name;
    const hometown = req.body.hometown;
    const age = req.body.age;

    connection.query(
        "INSERT INTO trainer (trainer_name, hometown, age) VALUES (?, ?, ?)",
        [name, hometown, age],
        (error, result)=> {
            res.send("Trainer was created");
        }
    )
})




// Tilføjer en pokemon

app.post("/trainerCaughtPokemon",(req,res) =>{
    const trainer_id = req.body.trainer_id;
    const pokedex_number = req.body.pokedex_number;

    connection.query(
        "INSERT INTO trainer_pokemon (trainer_id, pokedex_number) VALUES (?, ?)",
        [trainer_id, pokedex_number],
        (error, result)=> {
            res.send("The Pokemon was caught!");
        }
    )
})


//----- Statistics endpoints (Olivier) -----

app.get("/stats/types", (req, res) => {
    connection.query(
        "SELECT primary_type, COUNT(*) AS amount FROM pokemon GROUP BY primary_type",
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: "Database error" });
            }
            res.json(results);
        }
    );
});

app.get("/stats/hometowns", (req, res) => {
    connection.query(
        "SELECT hometown, COUNT(*) AS amount FROM trainer GROUP BY hometown",
        (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: "Database error" });
            }
            res.json(results);
        }
    );
});


//----- Battle endpoints (Thomas) -----


app.listen(port, () =>{
    console.log(`Application is now running on port ${port}`);
});