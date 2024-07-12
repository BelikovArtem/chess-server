CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT password_length CHECK (
    LENGTH(password) > 7
  )
);

CREATE TABLE users_info (
	user_id INT NOT NULL UNIQUE,
	blitz_rating INT DEFAULT 400,
	rapid_rating INT DEFAULT 400,
	bullet_rating INT DEFAULT 400,
	games_count INT DEFAULT 0, 
	CONSTRAINT positive_rating CHECK (
		blitz_rating > 0 AND
		rapid_rating > 0 AND
		bullet_rating > 0 
	),
  	FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TYPE RESULT AS ENUM ('white', 'black', 'draw');

CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  game_result RESULT NOT NULL,
  white_player_id INT NOT NULL,
  black_player_id INT NOT NULL,
  played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE games_info (
  game_id INT,
  white_player_id INT NOT NULL,
  black_player_id INT NOT NULL,
  moves text[] NOT NULL,
  FOREIGN KEY (white_player_id) REFERENCES users(id),
  FOREIGN KEY (black_player_id) REFERENCES users(id),
  FOREIGN KEY (game_id) REFERENCES games(id)
);
