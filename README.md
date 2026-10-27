# Pokédex – Backend

Midtvejsprojekt, ITA26. Deadline: 2 November at 09:00.

Frontend: https://github.com/olde1000/midtvejsprojekt-front

## Who does what

| Part | Where you work | Owner | Must have |
|---|---|---|---|
| Database | SQL files and ER diagram | Thomas | At least one new table (used in the app); ER diagram; DDL scripts; test data; primary and foreign keys |
| Pokémon endpoints | Pokémon section in `main.js` | William | GET Pokémon with at least 3 filters as query parameters (e.g. type, min attack, name search) |
| Trainer endpoints | Trainer section in `main.js` | Sebastian | GET trainers and a trainer's Pokémon; POST new trainer; POST Pokémon to a trainer |
| Statistics endpoints | Statistics section in `main.js` | Olivier | Statistics for the dashboard, calculated with SQL |

The database comes first – the other endpoints depend on it.

## How we work

- Everyone works on `main`. Only change your own section of `main.js`.
- Commit → pull → push. Always commit before you pull.
- Start the server and check that it runs before you push.
- Test your endpoints in Insomnia.

## Running the server

1. `npm install`
2. Create a `.env` file (never pushed) with `DBHOST`, `DBUSER`, `DBPASSWORD` and `DBDATABASE`.
3. `node --env-file=.env main.js` – the server runs on `http://localhost:3000`.
