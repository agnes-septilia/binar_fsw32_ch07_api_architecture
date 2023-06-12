CREATE TABLE user_games (
    id UUID DEFAULT uuid_generate_v4(),
    username VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL ,
    "password" TEXT NOT NULL,
    avatar TEXT,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL ,
	CONSTRAINT user_games_pk PRIMARY KEY (id)
);


CREATE TABLE user_game_logins (
    id UUID DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    token TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    deactivated_at TIMESTAMPTZ,
    expired_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT user_game_logins_pk PRIMARY KEY (id),
    CONSTRAINT user_game_logins_fk FOREIGN KEY (user_id) references public.user_games(id) on delete no action on update cascade 
);


CREATE TABLE user_game_biodatas (
    id UUID DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    gender VARCHAR,
    country VARCHAR,
    occupation VARCHAR,
    date_of_birth DATE,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
	CONSTRAINT user_game_biodatas_pk PRIMARY KEY (id),
    CONSTRAINT user_game_biodatas_fk foreign key (user_id) references public.user_games(id) on delete no action on update cascade 
);


CREATE TABLE user_game_rooms (
    id UUID DEFAULT uuid_generate_v4(),
    user_id_one UUID NOT NULL,
    user_id_two UUID,
    created_at TIMESTAMPTZ NOT NULL,
    closed_at TIMESTAMPTZ, 
    deactivated_at TIMESTAMPTZ,
    CONSTRAINT user_game_rooms_pk PRIMARY KEY (id),
    CONSTRAINT user_game_rooms_fk_1 foreign key (user_id_one) references public.user_games(id) on delete no action on update cascade,
    CONSTRAINT user_game_rooms_fk_2 foreign key (user_id_two) references public.user_games(id) on delete no action on update cascade 
);


CREATE TABLE user_game_histories (
    id UUID DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL,
    user_id UUID NOT NULL,
    round INTEGER,
    weapon VARCHAR,
    result VARCHAR,
    score INTEGER,
    created_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT user_game_histories_pk PRIMARY KEY (id),
    CONSTRAINT user_game_histories_fk_1 FOREIGN KEY (room_id) references public.user_game_rooms(id) on delete no action on update cascade,
    CONSTRAINT user_game_histories_fk_2 FOREIGN KEY (user_id) references public.user_games(id) on delete no action on update cascade
);

