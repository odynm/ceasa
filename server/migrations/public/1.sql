/* USER_INFO */

CREATE SEQUENCE public.user_info_id_seq
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 1
    CACHE 1;
ALTER TABLE public.user_info_id_seq


CREATE TABLE public.user_info
(
    id int NOT NULL DEFAULT nextval('user_info_id_seq'::regclass),
    login character varying(50) NOT NULL,
    hash character varying(50) NOT NULL,
    refresh_token character varying(50),
    refresh_token_expiration timestamp,
    last_logged timestamp,
    active boolean,
    deleted_date timestamp,
    plan smallint,
    permissions int,
    CONSTRAINT user_info_pkey PRIMARY KEY (id)
)
WITH (
    OIDS=FALSE
);
ALTER TABLE public.user_info;

/* ADMIN_INFO */

CREATE SEQUENCE public.admin_info_id_seq
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 1
    CACHE 1;
ALTER TABLE public.admin_info_id_seq;

CREATE TABLE public.admin_info
(
    id int NOT NULL DEFAULT nextval('admin_info_id_seq'::regclass),
    login character varying(50) NOT NULL,
    hash character varying(50) NOT NULL,
    active boolean,
    deleted_date timestamp,
    plan smallint,
    CONSTRAINT admin_info_pkey PRIMARY KEY (id)
)
WITH (
    OIDS=FALSE
);
ALTER TABLE public.admin_info;

/* PRODUCTS_PRODUCT */

CREATE SEQUENCE public.products_product_id_seq
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 2
    CACHE 1;
ALTER TABLE public.products_product_id_seq;

CREATE TABLE public.products_product
(
    id int NOT NULL DEFAULT nextval('products_product_id_seq'::regclass),
    name character varying(50) NOT NULL,
    user_id int,
    CONSTRAINT products_product_pkey PRIMARY KEY (id),
    CONSTRAINT fk_user_product FOREIGN KEY (user_id)
        REFERENCES public.user_info (id)
        ON DELETE NO ACTION
)
WITH (
    OIDS=FALSE
);
ALTER TABLE public.products_product;

/* PRODUCTS_PRODUCT_TYPE */

CREATE SEQUENCE public.products_product_type_id_seq
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 2
    CACHE 1;
ALTER TABLE public.products_product_type_id_seq;

CREATE TABLE public.products_product_type
(
    id int NOT NULL DEFAULT nextval('products_product_type_id_seq'::regclass),
    name character varying(50) NOT NULL,
    product_id int NOT NULL,
    user_id int,
    CONSTRAINT products_product_type_pkey PRIMARY KEY (id),
    CONSTRAINT fk_producttype_product FOREIGN KEY (product_id)
        REFERENCES public.products_product (id)
        ON DELETE NO ACTION,
    CONSTRAINT fk_producttype_user FOREIGN KEY (user_id)
        REFERENCES public.user_info (id)
        ON DELETE NO ACTION
)
WITH (
    OIDS=FALSE
);
ALTER TABLE public.products_product_type;

/* MIGRATIONS */

CREATE SEQUENCE public.migration_id_seq
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 1
    CACHE 1;
    ALTER TABLE public.migration_id_seq;


CREATE TABLE public.migration
(
    id int NOT NULL DEFAULT nextval('migration_id_seq'::regclass),
    last_id_runned int,
    run_date timestamp,
    context smallint, /* 0 public, 1 users*/
    CONSTRAINT migration_pkey PRIMARY KEY (id)
)
WITH (
    OIDS=FALSE
);
ALTER TABLE public.migration;