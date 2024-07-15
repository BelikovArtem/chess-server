CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
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

CREATE TYPE RESULT AS ENUM ('white', 'black', 'draw', 'continues');
CREATE TYPE TIME_CONTROL AS ENUM ('blitz', 'bullet', 'rapid');
CREATE TYPE BONUS AS ENUM ('00:00:01', '00:00:02', '00:00:10', '00:00:00');

CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  control TIME_CONTROL NOT NULL,
  white_id INT NOT NULL,
  black_id INT NOT NULL,
  game_result RESULT NOT NULL DEFAULT 'continues',
  FOREIGN KEY (white_id) REFERENCES users(id),
  FOREIGN KEY (black_id) REFERENCES users(id)
);

CREATE TABLE games_info (
  game_id INT NOT NULL UNIQUE,
  bonus_time BONUS NOT NULL,
  moves JSONB,
  FOREIGN KEY (game_id) REFERENCES games(id)
);
