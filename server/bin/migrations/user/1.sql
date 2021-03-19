/* STORAGE_ITEM_DESCRIPTION */

CREATE SEQUENCE _user_.storage_item_description_id_seq
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 1
    CACHE 1;

CREATE TABLE _user_.storage_item_description
(
    id int NOT NULL DEFAULT nextval('_user_.storage_item_description_id_seq'::regclass),
    description character varying(50) NOT NULL,
    CONSTRAINT storage_item_description_pkey PRIMARY KEY (id)
)
WITH (
    OIDS=FALSE
);

/* STORAGE_ITEM */

CREATE SEQUENCE _user_.storage_item_id_seq
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 1
    CACHE 1;

CREATE TABLE _user_.storage_item
(
    id int NOT NULL DEFAULT nextval('_user_.storage_item_id_seq'::regclass),
    product_id int NOT NULL,
    product_type_id int,
    description_id int,
    amount integer NOT NULL,
    cost_price integer NOT NULL,
    deleted boolean DEFAULT FALSE,
    CONSTRAINT storage_item_pkey PRIMARY KEY (id),
    CONSTRAINT fk_itemdescription_storage FOREIGN KEY (description_id)
        REFERENCES _user_.storage_item_description (id)
        ON DELETE NO ACTION,
    CONSTRAINT fk_product_storage FOREIGN KEY (product_id)
        REFERENCES public.products_product (id)
        ON DELETE NO ACTION,
    CONSTRAINT fk_producttype_storage FOREIGN KEY (product_type_id)
        REFERENCES public.products_product_type (id)
        ON DELETE NO ACTION
)
WITH (
    OIDS=FALSE
);