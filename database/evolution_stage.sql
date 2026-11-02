USE pokemon;

CREATE TABLE IF NOT EXISTS evolution_stage (
  evolution_stage_id INT NOT NULL,
  rarity VARCHAR(20) NOT NULL,
  PRIMARY KEY (evolution_stage_id)
);

INSERT IGNORE INTO evolution_stage (evolution_stage_id, rarity) VALUES
  (1, 'Common'),
  (2, 'Rare'),
  (3, 'Epic');

SET @has_column = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'pokemon' AND COLUMN_NAME = 'evolution_stage_id'
);
SET @add_column = IF(@has_column = 0,
  'ALTER TABLE pokemon
     ADD COLUMN evolution_stage_id INT NULL DEFAULT 1,
     ADD FOREIGN KEY (evolution_stage_id) REFERENCES evolution_stage (evolution_stage_id)',
  'DO 0');
PREPARE add_column FROM @add_column;
EXECUTE add_column;
DEALLOCATE PREPARE add_column;

UPDATE pokemon SET evolution_stage_id = 2
WHERE pokedex_number IN (
  2, 5, 8, 11, 14, 17, 20, 22, 24, 26, 28, 30, 33, 36, 38, 40, 42, 44, 47, 49,
  51, 53, 55, 57, 59, 61, 64, 67, 70, 73, 75, 78, 80, 82, 85, 87, 89, 91, 93, 97,
  99, 101, 103, 105, 110, 112, 117, 119, 121, 130, 134, 135, 136, 139, 141, 148
);

UPDATE pokemon SET evolution_stage_id = 3
WHERE pokedex_number IN (
  3, 6, 9, 12, 15, 18, 31, 34, 45, 62, 65, 68, 71, 76, 94, 149
);

UPDATE pokemon SET evolution_stage_id = NULL
WHERE pokedex_number IN (
  83, 95, 106, 107, 108, 113, 114, 115, 122, 123, 124, 125, 126, 127, 128, 131,
  132, 137, 142, 143, 144, 145, 146, 150, 151
);

SELECT e.rarity, COUNT(*) AS pokemon_count
FROM pokemon p
LEFT JOIN evolution_stage e ON e.evolution_stage_id = p.evolution_stage_id
GROUP BY e.evolution_stage_id, e.rarity
ORDER BY e.evolution_stage_id;
