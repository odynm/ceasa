/* ORDER_CLIENT */

CREATE SEQUENCE _user_.order_client_id_seq
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 1
    CACHE 1;
ALTER TABLE _user_.order_client_id_seq
    OWNER TO postgres;

CREATE TABLE _user_.order_client
(
    id int NOT NULL DEFAULT nextval('_user_.order_client_id_seq'::regclass),
    key character varying(50) NOT NULL,
    place character varying(50),
    vehicle character varying(50),
    CONSTRAINT order_client_pkey PRIMARY KEY (id)
)
WITH (
    OIDS=FALSE
);
ALTER TABLE _user_.order_client
    OWNER TO postgres;

/* ORDER_ORDER */

CREATE SEQUENCE _user_.order_order_id_seq
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 1
    CACHE 1;
ALTER TABLE _user_.order_order_id_seq
    OWNER TO postgres;

CREATE TABLE _user_.order_order
(
    id int NOT NULL DEFAULT nextval('_user_.order_order_id_seq'::regclass),
    client_id int NOT NULL,
    loader_id int,
    urgent boolean NOT NULL,
    status smallint NOT NULL,
    created_at timestamp,
    released_at timestamp,
    CONSTRAINT order_order_pkey PRIMARY KEY (id),
    CONSTRAINT fk_client_order FOREIGN KEY (client_id)
        REFERENCES _user_.order_client (id)
        ON DELETE NO ACTION,
    CONSTRAINT fk_loader_order FOREIGN KEY (loader_id)
        REFERENCES public.loader_info (id)
        ON DELETE NO ACTION
)
WITH (
    OIDS=FALSE
);
ALTER TABLE _user_.order_order
    OWNER TO postgres;

/* ORDER_PRODUCT */

CREATE SEQUENCE _user_.order_product_id_seq
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 1
    CACHE 1;
ALTER TABLE _user_.order_product_id_seq
    OWNER TO postgres;

CREATE TABLE _user_.order_product
(
    id int NOT NULL DEFAULT nextval('_user_.order_product_id_seq'::regclass),
    unity_price int NOT NULL,
    quantity int,   
    order_id int NOT NULL,
    product_id int NOT NULL,
    product_type_id int,
    description_id int,
    CONSTRAINT order_product_pkey PRIMARY KEY (id),
    CONSTRAINT fk_product_order FOREIGN KEY (order_id)
        REFERENCES _user_.order_order (id)
        ON DELETE NO ACTION,
    CONSTRAINT fk_product_product FOREIGN KEY (product_id)
        REFERENCES public.products_product (id)
        ON DELETE NO ACTION,
    CONSTRAINT fk_product_product_type FOREIGN KEY (product_type_id)
        REFERENCES public.products_product_type (id)
        ON DELETE NO ACTION,
    CONSTRAINT fk_product_description FOREIGN KEY (description_id)
        REFERENCES _user_.storage_item_description (id)
        ON DELETE NO ACTION
)
WITH (
    OIDS=FALSE
);
ALTER TABLE _user_.order_product
    OWNER TO postgres;