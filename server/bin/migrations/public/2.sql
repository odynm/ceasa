/* DEVICE */

CREATE SEQUENCE public.device_id_seq
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 1
    CACHE 1;

CREATE TABLE public.device
(
    id int NOT NULL DEFAULT nextval('public.device_id_seq'::regclass),
    hash character varying(50) NOT NULL,
    CONSTRAINT device_pkey PRIMARY KEY (id)
)
WITH (
    OIDS=FALSE
);

/* LOADER_INFO */

CREATE SEQUENCE public.loader_info_id_seq
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 1
    CACHE 1;

CREATE TABLE public.loader_info
(
    id int NOT NULL DEFAULT nextval('public.loader_info_id_seq'::regclass),
    name character varying(50) NOT NULL,
    active boolean NOT NULL,
    device_id int NOT NULL,
    CONSTRAINT loader_info_pkey PRIMARY KEY (id),
    CONSTRAINT fk_loader_device FOREIGN KEY (device_id)
        REFERENCES public.device (id)
        ON DELETE NO ACTION
)
WITH (
    OIDS=FALSE
);

/* TEAMS */

CREATE SEQUENCE public.team_info_id_seq
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 1
    CACHE 1;

CREATE TABLE public.team_info
(
    id int NOT NULL DEFAULT nextval('public.team_info_id_seq'::regclass),
    user_id int NOT NULL,
    loader_id int NOT NULL,
    CONSTRAINT team_info_pkey PRIMARY KEY (id),
    CONSTRAINT fk_team_user FOREIGN KEY (user_id)
        REFERENCES public.user_info (id)
        ON DELETE NO ACTION,
    CONSTRAINT fk_team_loader FOREIGN KEY (loader_id)
        REFERENCES public.loader_info (id)
        ON DELETE NO ACTION
)
WITH (
    OIDS=FALSE
);