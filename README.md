# Pokédex – Backend

Midtvejsprojekt, ITA26. Deadline: 2 November at 09:00.

Frontend: https://github.com/olde1000/midtvejsprojekt-front

## Who does what

| Part | Branch | Owner | Must have |
|---|---|---|---|
| Database | `database` | Thomas | At least one new table (used in the app); ER diagram; DDL scripts; test data; primary and foreign keys |
| Pokémon endpoints | `api-pokemon` | William | GET Pokémon with at least 3 filters as query parameters (e.g. type, min attack, name search) |
| Trainer endpoints | `api-trainers` | Sebastian | GET trainers and a trainer's Pokémon; POST new trainer; POST Pokémon to a trainer |
| Statistics endpoints | `api-stats` | Olivier | Statistics for the dashboard, calculated with SQL |

The database comes first – the other endpoints depend on it.

## How we work

- Work only on your own branch.
- Test your endpoints in Insomnia.
- When your part is done, open a pull request into `main` on GitHub.
- The server runs on `http://localhost:3000`.
