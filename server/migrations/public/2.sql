/* LOADER_INFO */

CREATE SEQUENCE public.loader_info_id_seq
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 1
    CACHE 1;
ALTER TABLE public.loader_info_id_seq
    OWNER TO postgres;

CREATE TABLE public.loader_info
(
    id int NOT NULL DEFAULT nextval('public.loader_info_id_seq'::regclass),
    name character varying(50) NOT NULL,
    active boolean NOT NULL,
    CONSTRAINT loader_info_pkey PRIMARY KEY (id)
)
WITH (
    OIDS=FALSE
);
ALTER TABLE public.loader_info
    OWNER TO postgres;