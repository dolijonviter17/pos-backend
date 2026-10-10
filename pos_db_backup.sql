--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 16.1

-- Started on 2026-10-10 19:54:22 WIB

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- TOC entry 2 (class 3079 OID 86102)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 3889 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 210 (class 1259 OID 86139)
-- Name: m_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.m_categories (
    id integer NOT NULL,
    category_name character varying,
    type_of_product character varying,
    merchant_id integer
);


--
-- TOC entry 211 (class 1259 OID 86144)
-- Name: m_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.m_categories ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.m_categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 212 (class 1259 OID 86145)
-- Name: m_customer_addresses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.m_customer_addresses (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    name character varying NOT NULL,
    address text,
    detail text,
    longitude text,
    latitude text,
    deleted boolean DEFAULT false,
    delete_at timestamp without time zone,
    create_at timestamp without time zone DEFAULT now(),
    update_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 213 (class 1259 OID 86153)
-- Name: m_customer_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.m_customer_addresses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3890 (class 0 OID 0)
-- Dependencies: 213
-- Name: m_customer_addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.m_customer_addresses_id_seq OWNED BY public.m_customer_addresses.id;


--
-- TOC entry 214 (class 1259 OID 86154)
-- Name: m_customers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.m_customers (
    id integer NOT NULL,
    fullname character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    phone_number character varying NOT NULL,
    photo character varying,
    is_active boolean DEFAULT true,
    salt character varying
);


--
-- TOC entry 215 (class 1259 OID 86160)
-- Name: m_customers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.m_customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3891 (class 0 OID 0)
-- Dependencies: 215
-- Name: m_customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.m_customers_id_seq OWNED BY public.m_customers.id;


--
-- TOC entry 241 (class 1259 OID 86369)
-- Name: m_districts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.m_districts (
    id bigint NOT NULL,
    code character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    regency_id bigint NOT NULL
);


--
-- TOC entry 240 (class 1259 OID 86368)
-- Name: m_districts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.m_districts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3892 (class 0 OID 0)
-- Dependencies: 240
-- Name: m_districts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.m_districts_id_seq OWNED BY public.m_districts.id;


--
-- TOC entry 216 (class 1259 OID 86161)
-- Name: m_features; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.m_features (
    id integer NOT NULL,
    name character varying,
    deleted boolean,
    url character varying
);


--
-- TOC entry 217 (class 1259 OID 86166)
-- Name: m_features_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.m_features ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.m_features_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 218 (class 1259 OID 86167)
-- Name: m_merchant_banks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.m_merchant_banks (
    id integer NOT NULL,
    merchant_id integer,
    bank_name character varying,
    bank_no character varying,
    is_active boolean,
    created_by integer,
    updated_by integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    bank_account character varying
);


--
-- TOC entry 219 (class 1259 OID 86172)
-- Name: m_merchant_banks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.m_merchant_banks ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.m_merchant_banks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 245 (class 1259 OID 86392)
-- Name: m_merchant_branch; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.m_merchant_branch (
    id bigint NOT NULL,
    merchant_id bigint NOT NULL,
    province_id bigint NOT NULL,
    regency_id bigint NOT NULL,
    district_id bigint NOT NULL,
    village_id bigint NOT NULL,
    name character varying(100) NOT NULL,
    address character varying(100) NOT NULL,
    created_at timestamp(0) with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone,
    name_of_person_branch character varying(100)
);


--
-- TOC entry 244 (class 1259 OID 86391)
-- Name: m_merchant_branch_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.m_merchant_branch_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3893 (class 0 OID 0)
-- Dependencies: 244
-- Name: m_merchant_branch_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.m_merchant_branch_id_seq OWNED BY public.m_merchant_branch.id;


--
-- TOC entry 220 (class 1259 OID 86173)
-- Name: m_merchant_setting; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.m_merchant_setting (
    merchant_id integer NOT NULL,
    tax double precision,
    admin double precision
);


--
-- TOC entry 221 (class 1259 OID 86176)
-- Name: m_merchants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.m_merchants (
    id integer NOT NULL,
    code character varying,
    name character varying,
    email character varying,
    address text,
    logo character varying,
    is_active boolean,
    created_by integer,
    updated_by integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- TOC entry 222 (class 1259 OID 86181)
-- Name: m_merchants_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.m_merchants ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.m_merchants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 223 (class 1259 OID 86182)
-- Name: m_order_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.m_order_types (
    id integer NOT NULL,
    name character varying,
    is_active boolean DEFAULT true
);


--
-- TOC entry 224 (class 1259 OID 86188)
-- Name: m_order_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.m_order_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3894 (class 0 OID 0)
-- Dependencies: 224
-- Name: m_order_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.m_order_types_id_seq OWNED BY public.m_order_types.id;


--
-- TOC entry 225 (class 1259 OID 86189)
-- Name: m_products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.m_products (
    id integer NOT NULL,
    merchant_id integer,
    category_id integer,
    product_name character varying,
    description character varying,
    spesification character varying,
    photo character varying,
    price double precision,
    is_discount boolean,
    price_discount double precision,
    percent_discount double precision
);


--
-- TOC entry 226 (class 1259 OID 86194)
-- Name: m_products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.m_products ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.m_products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 237 (class 1259 OID 86351)
-- Name: m_provinces; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.m_provinces (
    id bigint NOT NULL,
    code character varying(255) NOT NULL,
    name character varying(255) NOT NULL
);


--
-- TOC entry 236 (class 1259 OID 86350)
-- Name: m_provinces_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.m_provinces_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3895 (class 0 OID 0)
-- Dependencies: 236
-- Name: m_provinces_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.m_provinces_id_seq OWNED BY public.m_provinces.id;


--
-- TOC entry 239 (class 1259 OID 86360)
-- Name: m_regencies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.m_regencies (
    id bigint NOT NULL,
    code character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    province_id bigint NOT NULL
);


--
-- TOC entry 238 (class 1259 OID 86359)
-- Name: m_regencies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.m_regencies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3896 (class 0 OID 0)
-- Dependencies: 238
-- Name: m_regencies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.m_regencies_id_seq OWNED BY public.m_regencies.id;


--
-- TOC entry 227 (class 1259 OID 86195)
-- Name: m_useraccess; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.m_useraccess (
    user_id integer,
    feature_id integer,
    is_access boolean
);


--
-- TOC entry 228 (class 1259 OID 86198)
-- Name: m_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.m_users (
    id integer NOT NULL,
    merchant_id integer,
    email character varying,
    password character varying,
    role character varying,
    is_active boolean,
    salt character varying(255) DEFAULT NULL::character varying,
    fullname character varying(100),
    photo character varying(100),
    phone character varying(100)
);


--
-- TOC entry 229 (class 1259 OID 86204)
-- Name: m_users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.m_users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.m_users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 243 (class 1259 OID 86378)
-- Name: m_villages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.m_villages (
    id bigint NOT NULL,
    code character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    district_id bigint NOT NULL
);


--
-- TOC entry 242 (class 1259 OID 86377)
-- Name: m_villages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.m_villages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3897 (class 0 OID 0)
-- Dependencies: 242
-- Name: m_villages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.m_villages_id_seq OWNED BY public.m_villages.id;


--
-- TOC entry 246 (class 1259 OID 86441)
-- Name: user_merchantbranch; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_merchantbranch (
    user_id bigint NOT NULL,
    merchant_branch_id bigint NOT NULL
);


--
-- TOC entry 247 (class 1259 OID 86465)
-- Name: merchantbranch_v; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.merchantbranch_v AS
 SELECT m_merchant_branch.id AS merchant_branch_id,
    m_merchant_branch.name AS merchant_branch_name,
    m_merchant_branch.address,
    m_merchant_branch.merchant_id,
    user_merchantbranch.user_id,
    m_provinces.name AS province_name,
    m_regencies.name AS regency_name,
    m_districts.name AS district_name,
    m_villages.name AS village_name,
    m_provinces.id AS province_id,
    m_regencies.id AS regency_id,
    m_districts.id AS district_id,
    m_villages.id AS village_id,
    m_merchant_branch.created_at,
    m_merchant_branch.updated_at
   FROM (((((public.m_merchant_branch
     JOIN public.user_merchantbranch ON ((m_merchant_branch.id = user_merchantbranch.merchant_branch_id)))
     JOIN public.m_provinces ON ((m_merchant_branch.province_id = m_provinces.id)))
     JOIN public.m_regencies ON ((m_merchant_branch.regency_id = m_regencies.id)))
     JOIN public.m_districts ON ((m_merchant_branch.district_id = m_districts.id)))
     JOIN public.m_villages ON ((m_merchant_branch.village_id = m_villages.id)));


--
-- TOC entry 230 (class 1259 OID 86205)
-- Name: t_orderdetails; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.t_orderdetails (
    id integer NOT NULL,
    order_id integer,
    product_id integer,
    quantity integer,
    price_at_order character varying,
    subtotal_at_order double precision DEFAULT 0
);


--
-- TOC entry 231 (class 1259 OID 86211)
-- Name: t_orderdetails_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.t_orderdetails ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.t_orderdetails_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 232 (class 1259 OID 86212)
-- Name: t_orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.t_orders (
    id integer NOT NULL,
    merchant_id integer,
    order_date timestamp without time zone,
    order_code character varying,
    customer_name character varying,
    customer_no character varying,
    table_no character varying,
    status character varying,
    subtotal double precision,
    grand_total double precision,
    uuid character varying NOT NULL,
    tax double precision DEFAULT 0,
    admin double precision DEFAULT 0,
    delivery double precision DEFAULT 0,
    order_type integer DEFAULT 1,
    customer_id integer
);


--
-- TOC entry 233 (class 1259 OID 86221)
-- Name: t_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.t_orders ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.t_orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 234 (class 1259 OID 86222)
-- Name: t_payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.t_payments (
    id integer NOT NULL,
    order_id integer,
    payment_date timestamp without time zone,
    status character varying,
    token text,
    redirect_url text
);


--
-- TOC entry 235 (class 1259 OID 86227)
-- Name: t_payments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.t_payments ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.t_payments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 3631 (class 2604 OID 86228)
-- Name: m_customer_addresses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_customer_addresses ALTER COLUMN id SET DEFAULT nextval('public.m_customer_addresses_id_seq'::regclass);


--
-- TOC entry 3635 (class 2604 OID 86229)
-- Name: m_customers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_customers ALTER COLUMN id SET DEFAULT nextval('public.m_customers_id_seq'::regclass);


--
-- TOC entry 3647 (class 2604 OID 86372)
-- Name: m_districts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_districts ALTER COLUMN id SET DEFAULT nextval('public.m_districts_id_seq'::regclass);


--
-- TOC entry 3649 (class 2604 OID 86395)
-- Name: m_merchant_branch id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_merchant_branch ALTER COLUMN id SET DEFAULT nextval('public.m_merchant_branch_id_seq'::regclass);


--
-- TOC entry 3637 (class 2604 OID 86230)
-- Name: m_order_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_order_types ALTER COLUMN id SET DEFAULT nextval('public.m_order_types_id_seq'::regclass);


--
-- TOC entry 3645 (class 2604 OID 86354)
-- Name: m_provinces id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_provinces ALTER COLUMN id SET DEFAULT nextval('public.m_provinces_id_seq'::regclass);


--
-- TOC entry 3646 (class 2604 OID 86363)
-- Name: m_regencies id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_regencies ALTER COLUMN id SET DEFAULT nextval('public.m_regencies_id_seq'::regclass);


--
-- TOC entry 3648 (class 2604 OID 86381)
-- Name: m_villages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_villages ALTER COLUMN id SET DEFAULT nextval('public.m_villages_id_seq'::regclass);


--
-- TOC entry 3847 (class 0 OID 86139)
-- Dependencies: 210
-- Data for Name: m_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.m_categories (id, category_name, type_of_product, merchant_id) FROM stdin;
1	Coffee	coffee	1
2	Non Coffee	non-coffee	1
3	Meal	meal	1
4	Snack	snack	1
5	Coffee	coffee	2
6	Non Coffee	non-coffee	2
7	Meal	meal	2
8	Snack	snack	2
9	Coffee	coffee	3
10	Non Coffee	non-coffee	3
11	Meal	meal	3
12	Snack	snack	3
13	Coffee	coffee	4
14	Non Coffee	non-coffee	4
15	Meal	meal	4
16	Snack	snack	4
17	Menu Diet Cepat	menu-diet-cepat	6
\.


--
-- TOC entry 3849 (class 0 OID 86145)
-- Dependencies: 212
-- Data for Name: m_customer_addresses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.m_customer_addresses (id, customer_id, name, address, detail, longitude, latitude, deleted, delete_at, create_at, update_at) FROM stdin;
1	1	Rumah Utama	Jl. Buah Batu No.123, Bandung	Dekat Alfamart, rumah warna biru	107.625931	-6.948003	f	\N	2025-05-18 14:37:18.286061	2025-05-18 14:37:18.286061
2	1	Kantor	Jl. Terusan Buah Batu No.45, Bandung	Gedung 3 lantai, lantai 2	107.634500	-6.951200	f	\N	2025-05-18 14:37:18.286061	2025-05-18 14:37:18.286061
3	1	Alamat Orang Tua	Jl. Ciwastra No.88, Bandung	Gang kecil samping masjid	107.647891	-6.958300	f	\N	2025-05-18 14:37:18.286061	2025-05-18 14:37:18.286061
\.


--
-- TOC entry 3851 (class 0 OID 86154)
-- Dependencies: 214
-- Data for Name: m_customers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.m_customers (id, fullname, email, password, phone_number, photo, is_active, salt) FROM stdin;
2	Adi Rosadi	adirosadi17@gmail.com	cb4a63d89c10b75e0b22885ea73d7661a897add517c8d500df658be123d9c399	6289799711897	customers.png	t	As+CS+UKHMDkc7hHhNDFVOIR8OhKBOSOgJQ8GIizoec5WL/tBLjkNcBLS2qs/zyo1iy3YQWeGKgsQq5dxBOzpA==
1	Jonviter Sbl	dolijonviter17@gmail.com	0c8d41d3a14b1f7aac3280023e04d32d16bca98ff3b79090a5728339aa49c121	6289799721833	john.png	t	5UlJpUI3D5Ee1/0OLEacCwHCG3quIgG1qArYPoUYZy80UMO4Tk5ThdNjUvhfSfyI7SicirC2IvmlG3oNiysoUw==
\.


--
-- TOC entry 3878 (class 0 OID 86369)
-- Dependencies: 241
-- Data for Name: m_districts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.m_districts (id, code, name, regency_id) FROM stdin;
1	31.01.01	Kepulauan Seribu Utara	1
2	31.01.02	Kepulauan Seribu Selatan	1
3	31.74.01	Tebet	5
4	31.74.02	Setiabudi	5
5	31.74.03	Mampang Prapatan	5
6	31.74.04	Pasar Minggu	5
7	31.74.05	Kebayoran Lama	5
8	31.74.06	Cilandak	5
9	31.74.07	Kebayoran Baru	5
10	31.74.08	Pancoran	5
11	31.74.09	Jagakarsa	5
12	31.74.10	Pesanggrahan	5
13	12.11.01	Sidikalang	83
14	12.11.02	Sumbul	83
15	12.11.03	Tigalingga	83
16	12.11.04	Siempat Nempu	83
17	12.11.05	Silima Pungga Pungga	83
18	12.11.06	Tanah Pinem	83
19	12.11.07	Siempat Nempu Hulu	83
20	12.11.08	Siempat Nempu Hilir	83
21	12.11.09	Pegagan Hilir	83
22	12.11.10	Parbuluan	83
23	12.11.11	Lae Parira	83
24	12.11.12	Gunung Sitember	83
25	12.11.13	Berampu	83
26	12.11.14	Silahisabungan	83
27	12.11.15	Sitinjo	83
28	12.11.01	Sidikalang	116
29	12.11.02	Sumbul	116
30	12.11.03	Tigalingga	116
31	12.11.04	Siempat Nempu	116
32	12.11.05	Silima Pungga Pungga	116
33	12.11.06	Tanah Pinem	116
34	12.11.07	Siempat Nempu Hulu	116
35	12.11.08	Siempat Nempu Hilir	116
36	12.11.09	Pegagan Hilir	116
37	12.11.10	Parbuluan	116
38	12.11.11	Lae Parira	116
39	12.11.12	Gunung Sitember	116
40	12.11.13	Berampu	116
41	12.11.14	Silahisabungan	116
42	12.11.15	Sitinjo	116
43	12.11.01	Sidikalang	116
44	12.11.02	Sumbul	116
45	12.11.03	Tigalingga	116
46	12.11.04	Siempat Nempu	116
47	12.11.05	Silima Pungga Pungga	116
48	12.11.06	Tanah Pinem	116
49	12.11.07	Siempat Nempu Hulu	116
50	12.11.08	Siempat Nempu Hilir	116
51	12.11.09	Pegagan Hilir	116
52	12.11.10	Parbuluan	116
53	12.11.11	Lae Parira	116
54	12.11.12	Gunung Sitember	116
55	12.11.13	Berampu	116
56	12.11.14	Silahisabungan	116
57	12.11.15	Sitinjo	116
58	16.06.01	Sekayu	155
59	16.06.02	Lais	155
60	16.06.03	Sungai Keruh	155
61	16.06.04	Batang Hari Leko	155
62	16.06.05	Sanga Desa	155
63	16.06.06	Babat Toman	155
64	16.06.07	Sungai Lilin	155
65	16.06.08	Keluang	155
66	16.06.09	Bayung Lencir	155
67	16.06.10	Plakat Tinggi	155
68	16.06.11	Lalan	155
69	16.06.12	Tungkal Jaya	155
70	16.06.13	Lawan Wetan	155
71	16.06.14	Babat Supat	155
72	16.06.15	Jirak Jaya	155
73	14.03.01	Bengkalis	169
74	14.03.02	Bantan	169
75	14.03.03	Bukit Batu	169
76	14.03.09	Mandau	169
77	14.03.10	Rupat	169
78	14.03.11	Rupat Utara	169
79	14.03.12	Siak Kecil	169
80	14.03.13	Pinggir	169
81	14.03.14	Bandar Laksamana	169
82	14.03.15	Talang Muandau	169
83	14.03.16	Bathin Solapan	169
84	17.04.01	Kinal	182
85	17.04.02	Tanjung Kemuning	182
86	17.04.03	Kaur Utara	182
87	17.04.04	Kaur Tengah	182
88	17.04.05	Kaur Selatan	182
89	17.04.06	Maje	182
90	17.04.07	Nasal	182
91	17.04.08	Semidang Gumay	182
92	17.04.09	Kelam Tengah	182
93	17.04.10	Luas	182
94	17.04.11	Muara Sahung	182
95	17.04.12	Tetap	182
96	17.04.13	Lungkang Kule	182
97	17.04.14	Padang Guci Hilir	182
98	17.04.15	Padang Guci Hulu	182
99	21.03.04	Midai	191
100	21.03.05	Bunguran Barat	191
101	21.03.06	Serasan	191
102	21.03.07	Bunguran Timur	191
103	21.03.08	Bunguran Utara	191
104	21.03.09	Subi	191
105	21.03.10	Pulau Laut	191
106	21.03.11	Pulau Tiga	191
107	21.03.15	Bunguran Timur Laut	191
108	21.03.16	Bunguran Tengah	191
109	21.03.18	Bunguran Selatan	191
110	21.03.19	Serasan Timur	191
111	21.03.20	Bunguran Batubi	191
112	21.03.21	Pulau Tiga Barat	191
113	21.03.22	Suak Midai	191
114	21.03.23	Pulau Panjang	191
115	21.03.24	Pulau Seluan	191
116	64.09.01	Penajam	210
117	64.09.02	Waru	210
118	64.09.03	Babulu	210
119	64.09.04	Sepaku	210
120	18.01.04	Natar	215
121	18.01.05	Tanjung Bintang	215
122	18.01.06	Kalianda	215
123	18.01.07	Sidomulyo	215
124	18.01.08	Katibung	215
125	18.01.09	Penengahan	215
126	18.01.10	Palas	215
127	18.01.13	Jati Agung	215
128	18.01.14	Ketapang	215
129	18.01.15	Sragi	215
130	18.01.16	Raja Basa	215
131	18.01.17	Candipuro	215
132	18.01.18	Merbau Mataram	215
133	18.01.21	Bakauheni	215
134	18.01.22	Tanjung Sari	215
135	18.01.23	Way Sulan	215
136	18.01.24	Way Panji	215
\.


--
-- TOC entry 3853 (class 0 OID 86161)
-- Dependencies: 216
-- Data for Name: m_features; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.m_features (id, name, deleted, url) FROM stdin;
\.


--
-- TOC entry 3855 (class 0 OID 86167)
-- Dependencies: 218
-- Data for Name: m_merchant_banks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.m_merchant_banks (id, merchant_id, bank_name, bank_no, is_active, created_by, updated_by, created_at, updated_at, bank_account) FROM stdin;
2	6	BCA	5564938204838	t	3	3	2025-05-12 18:03:24	2025-05-12 18:03:24	\N
3	7	Jonviter Simbolon	000938272	t	4	4	2025-06-07 20:14:55	2025-06-07 20:14:55	\N
4	8	BCA	12343245342	t	8	8	2026-08-29 14:49:41	2026-08-29 14:49:41	\N
5	9	BCA	12343245342	t	9	9	2026-08-29 18:03:19	2026-08-29 18:03:19	\N
6	10	BCA	12343245342	t	10	10	2026-08-29 18:05:23	2026-08-29 18:05:23	\N
7	11	BCA	12343245342	t	11	11	2026-08-29 19:22:37	2026-08-29 19:22:37	\N
8	12	BCA	12343245342	t	12	12	2026-08-29 19:24:35	2026-08-29 19:24:35	\N
9	13	BCA	12343245342	t	13	13	2026-08-29 19:31:13	2026-08-29 19:31:13	\N
\.


--
-- TOC entry 3882 (class 0 OID 86392)
-- Dependencies: 245
-- Data for Name: m_merchant_branch; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.m_merchant_branch (id, merchant_id, province_id, regency_id, district_id, village_id, name, address, created_at, updated_at, name_of_person_branch) FROM stdin;
1	12	2	116	43	70	Warkop I	Jln burger no 2	2026-08-29 19:24:35+07	\N	John
2	13	2	116	43	70	Warkop II	Jln burger no 2	2026-08-29 19:31:13+07	\N	Jansen
3	13	2	116	43	70	Warkop II - Cabang Bali	Jln burger no 2	2026-09-12 12:38:48+07	\N	\N
4	13	2	116	43	70	Warkop II - Cabang Bali	Jln burger no 2	2026-09-12 12:40:12+07	\N	\N
5	13	8	215	121	122	Warkop II - Cabang Lampung	Jalan Soekarno Hatta bandung	2026-09-12 15:33:42+07	\N	\N
\.


--
-- TOC entry 3857 (class 0 OID 86173)
-- Dependencies: 220
-- Data for Name: m_merchant_setting; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.m_merchant_setting (merchant_id, tax, admin) FROM stdin;
1	10	3
6	10	3
\.


--
-- TOC entry 3858 (class 0 OID 86176)
-- Dependencies: 221
-- Data for Name: m_merchants; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.m_merchants (id, code, name, email, address, logo, is_active, created_by, updated_by, created_at, updated_at) FROM stdin;
1	20250510001	Bagi Kopi Metro	bagikopimetro@example.com	Jl. Sudirman No. 123, Bandung	bagimetro_logo.png	t	1	1	2023-01-15 09:00:00	2023-01-15 09:00:00
2	20250510002	Tedja Coffe Margahayu	tedjamargahayu@example.com	Jl. Thamrin No. 45, Bandung	tedja_logo.png	t	1	1	2023-02-20 10:30:00	2023-05-10 14:20:00
3	20250510003	Surjoy	surjoy@example.com	Jl. Gatot Subroto No. 67, Bandung	surjoy_logo.jpg	t	2	2	2023-03-10 08:15:00	2023-06-25 11:45:00
4	20250510004	Warkop 2 Lantai	warkop2lantai@example.com	Jl. Pemuda No. 89, Bandung	warkop_logo.png	f	2	3	2023-04-05 13:20:00	2023-07-30 16:10:00
6	coffe-sidikalang-6	Coffe Sidikalang	dolijonviter17@gmail.com	Jl. Nilam No. 89, Sidkalang	logo.png	t	3	3	2025-05-12 18:03:24	2025-05-12 18:03:24
7	coffe-jonviter-bandung-7	Coffe Jonviter Bandung	jonvitercoffe@yopmail.com	Bandung	logo.png	t	4	4	2025-06-07 20:14:55	2025-06-07 20:14:55
8	warkop-bandung-8	Warkop Bandung	merchantwarkop1@gmail.com	Bandung raya	\N	t	8	8	2026-08-29 14:49:41	2026-08-29 14:49:41
9	20260829009	Warkop Jakarta	merchantwarkop12@gmail.com	Jakarta raya	\N	t	9	9	2026-08-29 18:03:19	2026-08-29 18:03:19
10	20260829010	Warkop Aceh	merchantwarkop10@gmail.com	Aceh	\N	t	10	10	2026-08-29 18:05:23	2026-08-29 18:05:23
11	20260829011	Warkop I	merchantwarkop101@gmail.com	Jln burger no 2	\N	t	11	11	2026-08-29 19:22:37	2026-08-29 19:22:37
12	20260829012	Warkop I	merchantwarkop121@gmail.com	Jln burger no 2	\N	t	12	12	2026-08-29 19:24:35	2026-08-29 19:24:35
13	20260829013	Warkop II	merchantwarkop133@gmail.com	Jln burger no 2	\N	t	13	13	2026-08-29 19:31:13	2026-08-29 19:31:13
\.


--
-- TOC entry 3860 (class 0 OID 86182)
-- Dependencies: 223
-- Data for Name: m_order_types; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.m_order_types (id, name, is_active) FROM stdin;
1	Take Away	t
2	Delivery	t
3	Dine In	t
\.


--
-- TOC entry 3862 (class 0 OID 86189)
-- Dependencies: 225
-- Data for Name: m_products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.m_products (id, merchant_id, category_id, product_name, description, spesification, photo, price, is_discount, price_discount, percent_discount) FROM stdin;
152	6	1	Coffe Letto Kampung	Lorem Ipsum dolor sume	Size 60ml	product.png	35000	f	0	0
153	6	3	Sop Kampung	Lorem Ipsum dolor sume	Size 60ml	product.png	90000	f	0	0
1	1	1	Bagi Kopi Blangkon	Espresso klasik dengan aroma kuat	Size: 30ml	espresso_bagi.jpg	18000	f	0	0
2	1	1	Bagi Kopi Kesayangan	Latte dengan susu creamy	Size: 250ml	latte_bagi.jpg	25000	t	22500	10
3	1	1	Bagi Kopi Kepastian	Kopi hitam dengan rasa smooth	Size: 200ml	americano_bagi.jpg	20000	f	0	0
4	1	2	Matcha Latte	Matcha premium dengan susu	Size: 250ml	matcha_bagi.jpg	28000	f	0	0
5	1	2	Chocolate Velvet	Coklat lembut dengan tekstur velvet	Size: 250ml	choco_bagi.jpg	27000	t	24300	10
6	1	2	Red Velvet	Minuman signature dengan rasa unik	Size: 250ml	redvelvet_bagi.jpg	30000	f	0	0
7	1	3	Chicken Katsu	Ayam katsu dengan nasi	Porsi: 1 set	katsu_bagi.jpg	35000	f	0	0
8	1	3	Carbonara	Pasta carbonara creamy	Porsi: 1 set	carbonara_bagi.jpg	40000	t	36000	10
9	1	3	Beef Burger	Burger dengan daging sapi	Porsi: 1 set	burger_bagi.jpg	45000	f	0	0
10	1	4	Croissant	Croissant buttery	Size: regular	croissant_bagi.jpg	20000	f	0	0
11	1	4	Banana Bread	Roti pisang lembut	Size: 1 potong	bananabread_bagi.jpg	15000	t	13500	10
12	1	4	Donut	Donut dengan berbagai topping	Size: regular	donut_bagi.jpg	12000	f	0	0
13	2	5	V60 Pour Over	Kopi manual brew dengan teknik V60	Size: 200ml	v60_tedja.jpg	30000	f	0	0
14	2	5	Cold Brew	Cold brew smooth dengan rasa buah	Size: 250ml	coldbrew_tedja.jpg	35000	t	31500	10
15	2	5	Cappuccino	Cappuccino klasik dengan foam tebal	Size: 200ml	cappuccino_tedja.jpg	28000	f	0	0
16	2	6	Taro Latte	Minuman taro dengan susu	Size: 250ml	taro_tedja.jpg	32000	f	0	0
17	2	6	Strawberry Yogurt	Yogurt dengan strawberry segar	Size: 250ml	yogurt_tedja.jpg	30000	t	27000	10
18	2	6	Mango Smoothie	Smoothie mangga segar	Size: 300ml	mango_tedja.jpg	35000	f	0	0
19	2	7	Chicken Teriyaki	Ayam teriyaki dengan nasi	Porsi: 1 set	teriyaki_tedja.jpg	38000	f	0	0
20	2	7	Aglio Olio	Pasta aglio olio pedas	Porsi: 1 set	aglio_tedja.jpg	42000	t	37800	10
21	2	7	Fish & Chips	Ikan goreng dengan kentang	Porsi: 1 set	fishchips_tedja.jpg	45000	f	0	0
22	2	8	Cinnamon Roll	Roti kayu manis lembut	Size: regular	cinnamon_tedja.jpg	22000	f	0	0
23	2	8	Cheesecake	Cheesecake creamy	Size: 1 potong	cheesecake_tedja.jpg	28000	t	25200	10
24	2	8	Macarons	Macarons dengan berbagai rasa	3 pcs	macaron_tedja.jpg	35000	f	0	0
25	3	9	Piccolo Latte	Latte kecil dengan rasa intens	Size: 150ml	piccolo_surjoy.jpg	25000	f	0	0
26	3	9	Mocha	Mocha dengan coklat premium	Size: 200ml	mocha_surjoy.jpg	30000	t	27000	10
27	3	9	Affogato	Es krim dengan espresso	Size: 1 scoop	affogato_surjoy.jpg	35000	f	0	0
28	3	10	Hazelnut Latte	Latte dengan rasa hazelnut	Size: 250ml	hazelnut_surjoy.jpg	32000	f	0	0
29	3	10	Berry Smoothie	Smoothie mixed berry	Size: 300ml	berry_surjoy.jpg	35000	t	31500	10
30	3	10	Thai Tea	Teh thai authentic	Size: 250ml	thaitea_surjoy.jpg	28000	f	0	0
31	3	11	Beef Steak	Steak daging sapi dengan kentang	Porsi: 1 set	steak_surjoy.jpg	65000	f	0	0
32	3	11	Truffle Pasta	Pasta dengan saus truffle	Porsi: 1 set	truffle_surjoy.jpg	55000	t	49500	10
33	3	11	Salmon Rice Bowl	Bowl dengan salmon dan sayuran	Porsi: 1 set	salmon_surjoy.jpg	60000	f	0	0
34	3	12	Tiramisu	Tiramisu klasik	Size: 1 potong	tiramisu_surjoy.jpg	35000	f	0	0
35	3	12	Chocolate Lava	Lava cake dengan coklat leleh	Size: 1 porsi	lava_surjoy.jpg	40000	t	36000	10
36	3	12	Pancake Stack	Pancake dengan maple syrup	3 lapis	pancake_surjoy.jpg	45000	f	0	0
37	4	13	Piccolo Latte	Latte kecil dengan rasa intens	Size: 150ml	piccolo_surjoy.jpg	25000	f	0	0
38	4	13	Mocha	Mocha dengan coklat premium	Size: 200ml	mocha_surjoy.jpg	30000	t	27000	10
39	4	13	Affogato	Es krim dengan espresso	Size: 1 scoop	affogato_surjoy.jpg	35000	f	0	0
40	4	14	Hazelnut Latte	Latte dengan rasa hazelnut	Size: 250ml	hazelnut_surjoy.jpg	32000	f	0	0
41	4	14	Berry Smoothie	Smoothie mixed berry	Size: 300ml	berry_surjoy.jpg	35000	t	31500	10
42	4	14	Thai Tea	Teh thai authentic	Size: 250ml	thaitea_surjoy.jpg	28000	f	0	0
43	4	15	Beef Steak	Steak daging sapi dengan kentang	Porsi: 1 set	steak_surjoy.jpg	65000	f	0	0
44	4	15	Truffle Pasta	Pasta dengan saus truffle	Porsi: 1 set	truffle_surjoy.jpg	55000	t	49500	10
45	4	15	Salmon Rice Bowl	Bowl dengan salmon dan sayuran	Porsi: 1 set	salmon_surjoy.jpg	60000	f	0	0
46	4	16	Tiramisu	Tiramisu klasik	Size: 1 potong	tiramisu_surjoy.jpg	35000	f	0	0
47	4	16	Chocolate Lava	Lava cake dengan coklat leleh	Size: 1 porsi	lava_surjoy.jpg	40000	t	36000	10
48	4	16	Pancake Stack	Pancake dengan maple syrup	3 lapis	pancake_surjoy.jpg	45000	f	0	0
151	6	1	Coffe Latte Kampung	Lorem Ipsum dolor sume	Size 30ml	product.png	30000	f	\N	\N
154	13	3	Nasi Goreng Pedas	Lorem Ipsum dolor sume	\N	product.png	\N	\N	\N	\N
155	13	3	Nasi Goreng Sedang	Lorem Ipsum dolor sume	\N	product.png	\N	\N	\N	\N
\.


--
-- TOC entry 3874 (class 0 OID 86351)
-- Dependencies: 237
-- Data for Name: m_provinces; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.m_provinces (id, code, name) FROM stdin;
1	11	Aceh
2	12	Sumatera Utara
3	13	Sumatera Barat
4	14	Riau
5	15	Jambi
6	16	Sumatera Selatan
7	17	Bengkulu
8	18	Lampung
9	19	Kepulauan Bangka Belitung
10	21	Kepulauan Riau
11	31	DKI Jakarta
12	32	Jawa Barat
13	33	Jawa Tengah
14	34	Daerah Istimewa Yogyakarta
15	35	Jawa Timur
16	36	Banten
17	51	Bali
18	52	Nusa Tenggara Barat
19	53	Nusa Tenggara Timur
20	61	Kalimantan Barat
21	62	Kalimantan Tengah
22	63	Kalimantan Selatan
23	64	Kalimantan Timur
24	65	Kalimantan Utara
25	71	Sulawesi Utara
26	72	Sulawesi Tengah
27	73	Sulawesi Selatan
28	74	Sulawesi Tenggara
29	75	Gorontalo
30	76	Sulawesi Barat
31	81	Maluku
32	82	Maluku Utara
33	91	Papua
34	92	Papua Barat
35	93	Papua Selatan
36	94	Papua Tengah
37	95	Papua Pegunungan
38	96	Papua Barat Daya
\.


--
-- TOC entry 3876 (class 0 OID 86360)
-- Dependencies: 239
-- Data for Name: m_regencies; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.m_regencies (id, code, name, province_id) FROM stdin;
1	31.01	Kabupaten Administrasi Kepulauan Seribu	11
2	31.71	Kota Administrasi Jakarta Pusat	11
3	31.72	Kota Administrasi Jakarta Utara 	11
4	31.73	Kota Administrasi Jakarta Barat	11
5	31.74	Kota Administrasi Jakarta Selatan	11
6	31.75	Kota Administrasi Jakarta Timur	11
7	12.01	Kabupaten Tapanuli Tengah	2
8	12.02	Kabupaten Tapanuli Utara	2
9	12.03	Kabupaten Tapanuli Selatan	2
10	12.04	Kabupaten Nias	2
11	12.05	Kabupaten Langkat	2
12	12.06	Kabupaten Karo	2
13	12.07	Kabupaten Deli Serdang	2
14	12.08	Kabupaten Simalungun	2
15	12.09	Kabupaten Asahan	2
16	12.10	Kabupaten Labuhanbatu	2
17	12.11	Kabupaten Dairi	2
18	12.12	Kabupaten Toba	2
19	12.13	Kabupaten Mandailing Natal	2
20	12.14	Kabupaten Nias Selatan	2
21	12.15	Kabupaten Pakpak Bharat	2
22	12.16	Kabupaten Humbang Hasundutan	2
23	12.17	Kabupaten Samosir	2
24	12.18	Kabupaten Serdang Bedagai	2
25	12.19	Kabupaten Batu Bara	2
26	12.20	Kabupaten Padang Lawas Utara	2
27	12.21	Kabupaten Padang Lawas	2
28	12.22	Kabupaten Labuhanbatu Selatan	2
29	12.23	Kabupaten Labuhanbatu Utara	2
30	12.24	Kabupaten Nias Utara	2
31	12.25	Kabupaten Nias Barat	2
32	12.71	Kota Medan	2
33	12.72	Kota Pematangsiantar	2
34	12.73	Kota Sibolga	2
35	12.74	Kota Tanjungbalai	2
36	12.75	Kota Binjai	2
37	12.76	Kota Tebing Tinggi	2
38	12.77	Kota Padangsidimpuan	2
39	12.78	Kota Gunungsitoli	2
40	12.01	Kabupaten Tapanuli Tengah	2
41	12.02	Kabupaten Tapanuli Utara	2
42	12.03	Kabupaten Tapanuli Selatan	2
43	12.04	Kabupaten Nias	2
44	12.05	Kabupaten Langkat	2
45	12.06	Kabupaten Karo	2
46	12.07	Kabupaten Deli Serdang	2
47	12.08	Kabupaten Simalungun	2
48	12.09	Kabupaten Asahan	2
49	12.10	Kabupaten Labuhanbatu	2
50	12.11	Kabupaten Dairi	2
51	12.12	Kabupaten Toba	2
52	12.13	Kabupaten Mandailing Natal	2
53	12.14	Kabupaten Nias Selatan	2
54	12.15	Kabupaten Pakpak Bharat	2
55	12.16	Kabupaten Humbang Hasundutan	2
56	12.17	Kabupaten Samosir	2
57	12.18	Kabupaten Serdang Bedagai	2
58	12.19	Kabupaten Batu Bara	2
59	12.20	Kabupaten Padang Lawas Utara	2
60	12.21	Kabupaten Padang Lawas	2
61	12.22	Kabupaten Labuhanbatu Selatan	2
62	12.23	Kabupaten Labuhanbatu Utara	2
63	12.24	Kabupaten Nias Utara	2
64	12.25	Kabupaten Nias Barat	2
65	12.71	Kota Medan	2
66	12.72	Kota Pematangsiantar	2
67	12.73	Kota Sibolga	2
68	12.74	Kota Tanjungbalai	2
69	12.75	Kota Binjai	2
70	12.76	Kota Tebing Tinggi	2
71	12.77	Kota Padangsidimpuan	2
72	12.78	Kota Gunungsitoli	2
73	12.01	Kabupaten Tapanuli Tengah	2
74	12.02	Kabupaten Tapanuli Utara	2
75	12.03	Kabupaten Tapanuli Selatan	2
76	12.04	Kabupaten Nias	2
77	12.05	Kabupaten Langkat	2
78	12.06	Kabupaten Karo	2
79	12.07	Kabupaten Deli Serdang	2
80	12.08	Kabupaten Simalungun	2
81	12.09	Kabupaten Asahan	2
82	12.10	Kabupaten Labuhanbatu	2
83	12.11	Kabupaten Dairi	2
84	12.12	Kabupaten Toba	2
85	12.13	Kabupaten Mandailing Natal	2
86	12.14	Kabupaten Nias Selatan	2
87	12.15	Kabupaten Pakpak Bharat	2
88	12.16	Kabupaten Humbang Hasundutan	2
89	12.17	Kabupaten Samosir	2
90	12.18	Kabupaten Serdang Bedagai	2
91	12.19	Kabupaten Batu Bara	2
92	12.20	Kabupaten Padang Lawas Utara	2
93	12.21	Kabupaten Padang Lawas	2
94	12.22	Kabupaten Labuhanbatu Selatan	2
95	12.23	Kabupaten Labuhanbatu Utara	2
96	12.24	Kabupaten Nias Utara	2
97	12.25	Kabupaten Nias Barat	2
98	12.71	Kota Medan	2
99	12.72	Kota Pematangsiantar	2
100	12.73	Kota Sibolga	2
101	12.74	Kota Tanjungbalai	2
102	12.75	Kota Binjai	2
103	12.76	Kota Tebing Tinggi	2
104	12.77	Kota Padangsidimpuan	2
105	12.78	Kota Gunungsitoli	2
106	12.01	Kabupaten Tapanuli Tengah	2
107	12.02	Kabupaten Tapanuli Utara	2
108	12.03	Kabupaten Tapanuli Selatan	2
109	12.04	Kabupaten Nias	2
110	12.05	Kabupaten Langkat	2
111	12.06	Kabupaten Karo	2
112	12.07	Kabupaten Deli Serdang	2
113	12.08	Kabupaten Simalungun	2
114	12.09	Kabupaten Asahan	2
115	12.10	Kabupaten Labuhanbatu	2
116	12.11	Kabupaten Dairi	2
117	12.12	Kabupaten Toba	2
118	12.13	Kabupaten Mandailing Natal	2
119	12.14	Kabupaten Nias Selatan	2
120	12.15	Kabupaten Pakpak Bharat	2
121	12.16	Kabupaten Humbang Hasundutan	2
122	12.17	Kabupaten Samosir	2
123	12.18	Kabupaten Serdang Bedagai	2
124	12.19	Kabupaten Batu Bara	2
125	12.20	Kabupaten Padang Lawas Utara	2
126	12.21	Kabupaten Padang Lawas	2
127	12.22	Kabupaten Labuhanbatu Selatan	2
128	12.23	Kabupaten Labuhanbatu Utara	2
129	12.24	Kabupaten Nias Utara	2
130	12.25	Kabupaten Nias Barat	2
131	12.71	Kota Medan	2
132	12.72	Kota Pematangsiantar	2
133	12.73	Kota Sibolga	2
134	12.74	Kota Tanjungbalai	2
135	12.75	Kota Binjai	2
136	12.76	Kota Tebing Tinggi	2
137	12.77	Kota Padangsidimpuan	2
138	12.78	Kota Gunungsitoli	2
139	15.01	Kabupaten Kerinci	5
140	15.02	Kabupaten Merangin	5
141	15.03	Kabupaten Sarolangun	5
142	15.04	Kabupaten Batanghari	5
143	15.05	Kabupaten Muaro Jambi	5
144	15.06	Kabupaten Tanjung Jabung Barat	5
145	15.07	Kabupaten Tanjung Jabung Timur	5
146	15.08	Kabupaten Bungo	5
147	15.09	Kabupaten Tebo	5
148	15.71	Kota Jambi	5
149	15.72	Kota Sungai Penuh	5
150	16.01	Kabupaten Ogan Komering Ulu	6
151	16.02	Kabupaten Ogan Komering Ilir	6
152	16.03	Kabupaten Muara Enim	6
153	16.04	Kabupaten Lahat	6
154	16.05	Kabupaten Musi Rawas	6
155	16.06	Kabupaten Musi Banyuasin	6
156	16.07	Kabupaten Banyuasin	6
157	16.08	Kabupaten Ogan Komering Ulu Timur	6
158	16.09	Kabupaten Ogan Komering Ulu Selatan	6
159	16.10	Kabupaten Ogan Ilir	6
160	16.11	Kabupaten Empat Lawang	6
161	16.12	Kabupaten Penukal Abab Lematang Ilir	6
162	16.13	Kabupaten Musi Rawas Utara	6
163	16.71	Kota Palembang	6
164	16.72	Kota Pagar Alam	6
165	16.73	Kota Lubuk Linggau	6
166	16.74	Kota Prabumulih	6
167	14.01	Kabupaten Kampar	4
168	14.02	Kabupaten Indragiri Hulu	4
169	14.03	Kabupaten Bengkalis	4
170	14.04	Kabupaten Indragiri Hilir	4
171	14.05	Kabupaten Pelalawan	4
172	14.06	Kabupaten Rokan Hulu	4
173	14.07	Kabupaten Rokan Hilir	4
174	14.08	Kabupaten Siak	4
175	14.09	Kabupaten Kuantan Singingi	4
176	14.10	Kabupaten Kepulauan Meranti	4
177	14.71	Kota Pekanbaru	4
178	14.72	Kota Dumai	4
179	17.01	Kabupaten Bengkulu Selatan	7
180	17.02	Kabupaten Rejang Lebong	7
181	17.03	Kabupaten Bengkulu Utara	7
182	17.04	Kabupaten Kaur	7
183	17.05	Kabupaten Seluma	7
184	17.06	Kabupaten Mukomuko	7
185	17.07	Kabupaten Lebong	7
186	17.08	Kabupaten Kepahiang	7
187	17.09	Kabupaten Bengkulu Tengah	7
188	17.71	Kota Bengkulu	7
189	21.01	Kabupaten Bintan	10
190	21.02	Kabupaten Karimun	10
191	21.03	Kabupaten Natuna	10
192	21.04	Kabupaten Lingga	10
193	21.05	Kabupaten Kepulauan Anambas	10
194	21.71	Kota Batam	10
195	21.72	Kota Tanjung Pinang	10
196	51.01	Kabupaten Jembrana	17
197	51.02	Kabupaten Tabanan	17
198	51.03	Kabupaten Badung	17
199	51.04	Kabupaten Gianyar	17
200	51.05	Kabupaten Klungkung	17
201	51.06	Kabupaten Bangli	17
202	51.07	Kabupaten Karangasem	17
203	51.08	Kabupaten Buleleng	17
204	51.71	Kota Denpasar	17
205	64.01	Kabupaten Paser	23
206	64.02	Kabupaten Kutai Kartanegara	23
207	64.03	Kabupaten Berau	23
208	64.07	Kabupaten Kutai Barat	23
209	64.08	Kabupaten Kutai Timur	23
210	64.09	Kabupaten Penajam Paser Utara	23
211	64.11	Kabupaten Mahakam Ulu	23
212	64.71	Kota Balikpapan	23
213	64.72	Kota Samarinda	23
214	64.74	Kota Bontang	23
215	18.01	Kabupaten Lampung Selatan	8
216	18.02	Kabupaten Lampung Tengah	8
217	18.03	Kabupaten Lampung Utara	8
218	18.04	Kabupaten Lampung Barat	8
219	18.05	Kabupaten Tulang Bawang	8
220	18.06	Kabupaten Tanggamus	8
221	18.07	Kabupaten Lampung Timur	8
222	18.08	Kabupaten Way Kanan	8
223	18.09	Kabupaten Pesawaran	8
224	18.10	Kabupaten Pringsewu	8
225	18.11	Kabupaten Mesuji	8
226	18.12	Kabupaten Tulang Bawang Barat	8
227	18.13	Kabupaten Pesisir Barat	8
228	18.71	Kota Bandar Lampung	8
229	18.72	Kota Metro	8
\.


--
-- TOC entry 3864 (class 0 OID 86195)
-- Dependencies: 227
-- Data for Name: m_useraccess; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.m_useraccess (user_id, feature_id, is_access) FROM stdin;
\.


--
-- TOC entry 3865 (class 0 OID 86198)
-- Dependencies: 228
-- Data for Name: m_users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.m_users (id, merchant_id, email, password, role, is_active, salt, fullname, photo, phone) FROM stdin;
3	6	dolijonviter17@gmail.com	c4d86a7603e4f8d39e5d17f72f2e4b43761da59f4817a0ddbb2cfb35d8624522	Admin	t	0EyIpUEPDNw/p/zv7KwwEgOxwOVQRgJmFHy/1vZQernnAOS1wzfPO1JdAL0paH+ixznCd8O53+8yMV+wt6e/bA==	John Doe	\N	\N
4	7	jonvitermerchant@yopmail.com	85e1139550db525faf02e54e553e7ba5a25f68872626bb9fb4b304e96a315b0f	Admin	t	sw2tMSTWMO7TpZdUoh1OokJvHLzN+NEJnS2qEM3wvvt03RuCC6GPAzBab7E91GhQD5510XcjKaVOLg4wVP4cDg==	John Doe	\N	\N
5	6	jonviter17@yopmail.com	d62574549e156ac5b519a28af8c757f45b1233c39dd536e3b90a756cb5272d1b	Admin	t	B5Bl/qHx3z1UF4pP5/ARYrDCKTzcNQfDbmTfk1M4NOBKuA6kD1/29DcN34NrXqFMoe4yIcKOqSTl53VwL9nMBg==	John Doe	\N	\N
6	6	jonvitersim@yopmail.com	f64ff5f68ec372a8b5a16f3cd9a2d12f60d3bd9c16afc7609ac7128b29ddb656	Admin	t	oeelAFvee2Pw0OaicRMmeLqhHZiTwf/x7VnKqiRzrXMijS1UK52wGzQsv1S4sMGez1pihBNdahKdbOPtKAiFhw==	John Doe	\N	\N
7	6	newuser@example.com	8b5a949fc6cae593ce9a527aa9ca45425686d123c2b46f67fc661a221afeb9fd	Admin	t	wKi1CCUr/mPlaLSh7ud5Qs+VWARqsUjOqOjhv0hD44lFCA9zoThl+1JUKppTlT2k933zCwrnENtsh+irZ3m2Jg==	John Doe	\N	\N
8	8	merchantwarkop1@gmail.com	369226ec2fa27c2d7e75fa5eb7ba5e5d86516cf2cbded317bf2e77fd565c3b51	Superadmin	t	duJgElEQcJYvAApd5RpCpbqtGPaumI+KgFwslMTIxidmSSjy/SVn3wB2l+FbjSN0A9iGRtuAIpzvAZ/0+cJFEg==	John Doe	\N	\N
9	9	merchantwarkop12@gmail.com	ef83a1af231c05902d92c31359d2a3224ce4e9d8762c43c840fd771ff3a2a12e	Owner	t	JR+ZVQaUHopjPYdR6QNUC4qpZuPKSA8lc1UC81m9QMIHbCsEKhZCrovMdDTb13cV9nG2L4v62NhIS2TGlXtxmA==	John Doe	\N	\N
10	10	merchantwarkop10@gmail.com	3bbdeb3210d391afe3dece01dac8454d49a15930a0000fcf9a08d4620e5188e7	Owner	t	G15P5PhhsFdlBR8HZU/4IB7aTOFqSWbGj0pkGdjpcZnujWI3iiagLk7ndelaMw5kaZdXH4APS7tPMEWQaWJdSw==	John Doe	\N	\N
11	11	merchantwarkop101@gmail.com	48b3d7a3ec8a9b8d9f509750ba0ec41b4b602d9b6abefa193946ada68e34dbfc	Owner	t	fJPC45KTORiedUzVNPNbVMEsbFqOLWRKqRwsLpZnoFc0xXTfvhzDl4gguJLgL8Zfjnjoc4mL7+vwkE3DEXf1dQ==	John Doe	\N	\N
12	12	merchantwarkop121@gmail.com	c3391e2e05af8bfc415847bf39a7c4935207a9d19ea6813f9710339b02982e78	Owner	t	1VJ+SWlySrTNNdUPEYEPd5WqKb/Dyrkj6bmcLceuNCLjOnjuPwxZd+LzjDBpnxpJMng1qQNaqh0C8KArv6Lg9A==	John Doe	\N	\N
13	13	merchantwarkop133@gmail.com	ba44fe3af727842c2539d566dc26c433b9d0c633aa100e37a10a4d920c06b2d5	Owner	t	a+zHl3YtoEL0MxKRNrJOVrSG5TDmlXaer7uSRJCi20wdXbdNJ4RZ3GFjhrus1lo3QqbHWu+mlppxsp1AM+aSFg==	John Doe	\N	\N
14	13	merchantwarkop132@gmail.com	d66538052a87c82b7a39ae1e25f1793dbfbdace8037bcd335b2f5157be3125d0	Admin	t	8X4R4K3Ux8dUi/g88ld8o9qsD6dfV9PitQQaHUoKWJBmZA2Pyi6l7LgaVkqQ7hAzzWsdD6NPyjLRdcIRBAX6Kg==	Jesron Marudut	\N	089799766785
15	13	merchantwarkop352@gmail.com	9837f2b51aeccccdee1d3076dd35f727c78ac00ea0cf0ebae5413408e1e32227	Admin	t	ASvbM/fBkF7BghZZKvok5DYlBSpKThm1qyF9AHV4xtZbsL+4C12P7TYSV2o0UqS8BeeNQ2jnSLrRu1q1AVA66w==	Jansen S	\N	089799766782
16	13	marcusrasford@gmail.com	9c7badf9b117086d01d7f8cc56e438931b2a2ee8373d8f8ff8c4eee59603be88	Admin	t	d7g+6UCwwXoi+PTxDPlmNjMWhqH9hXw6BMtsdNSU1TD9/mQKwV5LjztaL5gSu0wGOHSr8lMpWuIvKPoopilr1A==	Marcus Rasford	\N	6289665453321
\.


--
-- TOC entry 3880 (class 0 OID 86378)
-- Dependencies: 243
-- Data for Name: m_villages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.m_villages (id, code, name, district_id) FROM stdin;
1	12.11.01.1005	Kuta Gambir	13
2	12.11.01.1007	Sidiangkat	13
3	12.11.01.1009	Batang Beruh	13
4	12.11.01.1010	Sidikalang	13
5	12.11.01.1015	Bintang Hulu	13
6	12.11.01.2008	Belang Malum	13
7	12.11.01.2011	Huta Rakyat	13
8	12.11.01.2012	Kalang	13
9	12.11.01.2013	Bintang	13
10	12.11.01.2014	Kalang Simbara	13
11	12.11.01.2017	Bintang Mersada	13
12	12.11.01.1005	Kuta Gambir	13
13	12.11.01.1007	Sidiangkat	13
14	12.11.01.1009	Batang Beruh	13
15	12.11.01.1010	Sidikalang	13
16	12.11.01.1015	Bintang Hulu	13
17	12.11.01.2008	Belang Malum	13
18	12.11.01.2011	Huta Rakyat	13
19	12.11.01.2012	Kalang	13
20	12.11.01.2013	Bintang	13
21	12.11.01.2014	Kalang Simbara	13
22	12.11.01.2017	Bintang Mersada	13
23	12.11.02.1007	Pegagan Julu I	14
24	12.11.02.2001	Pegagan Julu X	14
25	12.11.02.2002	Pegagan Julu IX	14
26	12.11.02.2003	Pegagan Julu VIII	14
27	12.11.02.2004	Pegagan Julu VII	14
28	12.11.02.2005	Pegagan Julu VI	14
29	12.11.02.2006	Pegagan Julu V	14
30	12.11.02.2008	Pegagan Julu IV	14
31	12.11.02.2009	Pegagan Julu III	14
32	12.11.02.2010	Pegagan Julu II	14
33	12.11.02.2014	Tanjung Beringin	14
34	12.11.02.2015	Dolok Tolong	14
35	12.11.02.2017	Pargambiran	14
36	12.11.02.2018	Perjuangan	14
37	12.11.02.2020	Kuta Gugung	14
38	12.11.02.2024	Sileuh-leuh Parsaoran	14
39	12.11.02.2025	Barisan Nauli	14
40	12.11.02.2026	Pangguruan	14
41	12.11.02.2027	Tanjung Beringin I	14
42	12.11.14.2001	Silalahi II	26
43	12.11.14.2002	Silalahi I	26
44	12.11.14.2003	Paropo	26
45	12.11.14.2004	Silalahi III	26
46	12.11.14.2005	Paropo I	26
47	12.11.01.1005	Kuta Gambir	28
48	12.11.01.1007	Sidiangkat	28
49	12.11.01.1009	Batang Beruh	28
50	12.11.01.1010	Sidikalang	28
51	12.11.01.1015	Bintang Hulu	28
52	12.11.01.2008	Belang Malum	28
53	12.11.01.2011	Huta Rakyat	28
54	12.11.01.2012	Kalang	28
55	12.11.01.2013	Bintang	28
56	12.11.01.2014	Kalang Simbara	28
57	12.11.01.2017	Bintang Mersada	28
58	12.11.01.1005	Kuta Gambir	28
59	12.11.01.1007	Sidiangkat	28
60	12.11.01.1009	Batang Beruh	28
61	12.11.01.1010	Sidikalang	28
62	12.11.01.1015	Bintang Hulu	28
63	12.11.01.2008	Belang Malum	28
64	12.11.01.2011	Huta Rakyat	28
65	12.11.01.2012	Kalang	28
66	12.11.01.2013	Bintang	28
67	12.11.01.2014	Kalang Simbara	28
68	12.11.01.2017	Bintang Mersada	28
69	12.11.01.1005	Kuta Gambir	43
70	12.11.01.1007	Sidiangkat	43
71	12.11.01.1009	Batang Beruh	43
72	12.11.01.1010	Sidikalang	43
73	12.11.01.1015	Bintang Hulu	43
74	12.11.01.2008	Belang Malum	43
75	12.11.01.2011	Huta Rakyat	43
76	12.11.01.2012	Kalang	43
77	12.11.01.2013	Bintang	43
78	12.11.01.2014	Kalang Simbara	43
79	12.11.01.2017	Bintang Mersada	43
80	14.03.10.1001	Batu Panjang	77
81	14.03.10.1002	Pergam	77
82	14.03.10.1003	Terkul	77
83	14.03.10.1004	Tanjung Kapal	77
84	14.03.10.2005	Sungai Cingam	77
85	14.03.10.2006	Teluk Lecah	77
86	14.03.10.2007	Makeruh	77
87	14.03.10.2008	Hutan Panjang	77
88	14.03.10.2009	Pangkalan Nyirih	77
89	14.03.10.2010	Sukarjo Mesim	77
90	14.03.10.2011	Darul Aman	77
91	14.03.10.2012	Parit Kebumen	77
92	14.03.10.2013	Sri Tanjung	77
93	14.03.10.2014	Pancur Jaya	77
94	14.03.10.2015	Pangkalan Pinang	77
95	14.03.10.2016	Dungun Baru	77
96	14.03.15.2001	Tasik Serai	82
97	14.03.15.2002	Tasik Serai Barat	82
98	14.03.15.2003	Kualo Penaso	82
99	14.03.15.2004	Beringin	82
100	14.03.15.2005	Koto Pait Beringin	82
101	14.03.15.2006	Melibur	82
102	14.03.15.2007	Tasik Serai Timur	82
103	14.03.15.2008	Tasik Tebing Serai	82
104	14.03.15.2009	Serai Wangi	82
105	21.03.08.2001	Kelarik Utara	103
106	21.03.08.2002	Kelarik	103
107	21.03.08.2004	Kelarik Air Mali	103
108	21.03.08.2005	Teluk Buton	103
109	21.03.08.2006	Belakang Gunung	103
110	21.03.08.2008	Gunung Durian	103
111	12.11.08.2001	Lae Itam	35
112	12.11.08.2002	Lae Luhung	35
113	12.11.08.2003	Pardomuan	35
114	12.11.08.2004	Lae Markelang	35
115	12.11.08.2005	Jambur Indonesia	35
116	12.11.08.2006	Simungun	35
117	12.11.08.2007	Janji	35
118	12.11.08.2008	Sopo Butar	35
119	12.11.08.2009	Lae Sering	35
120	12.11.08.2010	Lae Haporas	35
121	18.01.05.2001	Kaliasin	121
122	18.01.05.2003	Lematang	121
123	18.01.05.2004	Sukanegara	121
124	18.01.05.2005	Serdang	121
125	18.01.05.2006	Sinar Ogan	121
126	18.01.05.2007	Jati Baru	121
127	18.01.05.2008	Sabah Balau	121
128	18.01.05.2009	Budi Lestari	121
129	18.01.05.2010	Trimulyo	121
130	18.01.05.2011	Jati Indah	121
131	18.01.05.2012	Way Galih	121
132	18.01.05.2013	Sindang Sari	121
133	18.01.05.2015	Purwodadi Simpang	121
134	18.01.05.2021	Galih Lunik	121
135	18.01.05.2022	Rejomulyo	121
136	18.01.05.2023	Sri Katon	121
\.


--
-- TOC entry 3867 (class 0 OID 86205)
-- Dependencies: 230
-- Data for Name: t_orderdetails; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.t_orderdetails (id, order_id, product_id, quantity, price_at_order, subtotal_at_order) FROM stdin;
1	14	1	2	18000	36000
2	14	2	2	25000	50000
3	14	3	1	20000	20000
4	15	1	5	18000	90000
5	15	2	3	25000	75000
6	15	3	4	20000	80000
7	17	2	2	25000	50000
8	17	8	2	40000	80000
9	18	2	2	25000	50000
10	18	8	2	40000	80000
11	19	2	2	25000	50000
12	19	8	2	40000	80000
13	20	2	2	25000	50000
14	20	8	2	40000	80000
15	21	2	2	25000	50000
16	21	8	2	40000	80000
17	22	2	2	25000	50000
18	22	8	2	40000	80000
\.


--
-- TOC entry 3869 (class 0 OID 86212)
-- Dependencies: 232
-- Data for Name: t_orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.t_orders (id, merchant_id, order_date, order_code, customer_name, customer_no, table_no, status, subtotal, grand_total, uuid, tax, admin, delivery, order_type, customer_id) FROM stdin;
14	1	2025-05-12 00:10:59	PO20250512001059	Jonviter	08979971180	7	Waiting	5	106000	7c08ee74-8758-47e9-9417-34872a27bce5	0	0	0	1	\N
15	1	2025-05-12 02:10:25	PO20250512021025	Dynno Ottu	08978971443	7	Waiting	12	245000	9ca625b3-821a-4301-9435-b418a98399a5	0	0	0	1	\N
17	1	2025-05-17 16:42:58	PO20250517164258	Jonviter	628979971180	1	Waiting	4	130000	7c08ee74-8758-47e9-9417-34872a27bce1	13000	3	0	1	1
18	1	2025-05-19 20:03:21	PO20250519200321	Jonviter	628979971180	1	Waiting	4	130000	a9K3pkmxb7ij4vdSGX7sPq9QzS4W/D+vGHDuJtPRiXg=	13000	3	0	1	1
19	1	2025-05-19 20:16:56	PO20250519201656	Jonviter	628979971180	1	Waiting	4	130000	7pYB2n8cB3zGFJ4LUIfX9S+Ft8r5sSk20rbMnOut488=	13000	3	0	1	1
20	1	2025-05-19 20:20:35	PO20250519202035	Jonviter	628979971180	1	Waiting	4	130000	co4VuZJfcrH0dFkpscHsY8ScB1xXqFalUZqRf+fwnbM=	13000	3	0	1	1
21	1	2025-05-19 20:21:21	PO20250519202121	Jonviter	628979971180	1	Waiting	4	130000	2zgsIZDzL+W280McRblD//3R4IgfWQHj7k8lmdXgABw=	13000	3	0	1	1
22	1	2025-05-19 20:28:19	PO20250519202819	Jonviter	628979971180	1	Waiting	4	130000	z2WcaNY0czjUxRrcI1mi37zWst1bpJsnSbjQ5tN+Mk8=	13000	3	0	1	1
23	1	2025-05-23 19:45:42	PO20250523194542	Jonviter	628979971180	1	Waiting	0	0	PkrXGiSnV9xzpx555ke2M2zB3IHontq3QaoJ2zJSw7o=	0	3	0	1	1
\.


--
-- TOC entry 3871 (class 0 OID 86222)
-- Dependencies: 234
-- Data for Name: t_payments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.t_payments (id, order_id, payment_date, status, token, redirect_url) FROM stdin;
1	14	2025-05-12 00:11:00	Waiting	\N	\N
2	15	2025-05-12 02:10:25	Waiting	\N	\N
3	17	2025-05-17 16:42:58	Waiting	\N	\N
4	18	2025-05-19 20:03:21	Waiting	\N	\N
5	19	2025-05-19 20:16:56	Waiting	\N	\N
6	20	2025-05-19 20:20:35	Waiting	\N	\N
7	21	2025-05-19 20:21:21	Waiting	\N	\N
8	22	2025-05-19 20:28:19	Waiting	\N	\N
\.


--
-- TOC entry 3883 (class 0 OID 86441)
-- Dependencies: 246
-- Data for Name: user_merchantbranch; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_merchantbranch (user_id, merchant_branch_id) FROM stdin;
13	2
14	3
15	4
16	5
\.


--
-- TOC entry 3898 (class 0 OID 0)
-- Dependencies: 211
-- Name: m_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.m_categories_id_seq', 17, true);


--
-- TOC entry 3899 (class 0 OID 0)
-- Dependencies: 213
-- Name: m_customer_addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.m_customer_addresses_id_seq', 3, true);


--
-- TOC entry 3900 (class 0 OID 0)
-- Dependencies: 215
-- Name: m_customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.m_customers_id_seq', 2, true);


--
-- TOC entry 3901 (class 0 OID 0)
-- Dependencies: 240
-- Name: m_districts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.m_districts_id_seq', 136, true);


--
-- TOC entry 3902 (class 0 OID 0)
-- Dependencies: 217
-- Name: m_features_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.m_features_id_seq', 1, false);


--
-- TOC entry 3903 (class 0 OID 0)
-- Dependencies: 219
-- Name: m_merchant_banks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.m_merchant_banks_id_seq', 9, true);


--
-- TOC entry 3904 (class 0 OID 0)
-- Dependencies: 244
-- Name: m_merchant_branch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.m_merchant_branch_id_seq', 5, true);


--
-- TOC entry 3905 (class 0 OID 0)
-- Dependencies: 222
-- Name: m_merchants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.m_merchants_id_seq', 13, true);


--
-- TOC entry 3906 (class 0 OID 0)
-- Dependencies: 224
-- Name: m_order_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.m_order_types_id_seq', 3, true);


--
-- TOC entry 3907 (class 0 OID 0)
-- Dependencies: 226
-- Name: m_products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.m_products_id_seq', 155, true);


--
-- TOC entry 3908 (class 0 OID 0)
-- Dependencies: 236
-- Name: m_provinces_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.m_provinces_id_seq', 38, true);


--
-- TOC entry 3909 (class 0 OID 0)
-- Dependencies: 238
-- Name: m_regencies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.m_regencies_id_seq', 229, true);


--
-- TOC entry 3910 (class 0 OID 0)
-- Dependencies: 229
-- Name: m_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.m_users_id_seq', 16, true);


--
-- TOC entry 3911 (class 0 OID 0)
-- Dependencies: 242
-- Name: m_villages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.m_villages_id_seq', 136, true);


--
-- TOC entry 3912 (class 0 OID 0)
-- Dependencies: 231
-- Name: t_orderdetails_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.t_orderdetails_id_seq', 18, true);


--
-- TOC entry 3913 (class 0 OID 0)
-- Dependencies: 233
-- Name: t_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.t_orders_id_seq', 23, true);


--
-- TOC entry 3914 (class 0 OID 0)
-- Dependencies: 235
-- Name: t_payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.t_payments_id_seq', 8, true);


--
-- TOC entry 3652 (class 2606 OID 86232)
-- Name: m_categories m_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_categories
    ADD CONSTRAINT m_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3654 (class 2606 OID 86234)
-- Name: m_customer_addresses m_customer_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_customer_addresses
    ADD CONSTRAINT m_customer_addresses_pkey PRIMARY KEY (id);


--
-- TOC entry 3656 (class 2606 OID 86236)
-- Name: m_customers m_customers_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_customers
    ADD CONSTRAINT m_customers_email_key UNIQUE (email);


--
-- TOC entry 3658 (class 2606 OID 86238)
-- Name: m_customers m_customers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_customers
    ADD CONSTRAINT m_customers_pkey PRIMARY KEY (id);


--
-- TOC entry 3684 (class 2606 OID 86376)
-- Name: m_districts m_districts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_districts
    ADD CONSTRAINT m_districts_pkey PRIMARY KEY (id);


--
-- TOC entry 3660 (class 2606 OID 86240)
-- Name: m_features m_features_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_features
    ADD CONSTRAINT m_features_pkey PRIMARY KEY (id);


--
-- TOC entry 3662 (class 2606 OID 86242)
-- Name: m_merchant_banks m_merchant_banks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_merchant_banks
    ADD CONSTRAINT m_merchant_banks_pkey PRIMARY KEY (id);


--
-- TOC entry 3688 (class 2606 OID 86398)
-- Name: m_merchant_branch m_merchant_branch_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_merchant_branch
    ADD CONSTRAINT m_merchant_branch_pkey PRIMARY KEY (id);


--
-- TOC entry 3664 (class 2606 OID 86244)
-- Name: m_merchants m_merchants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_merchants
    ADD CONSTRAINT m_merchants_pkey PRIMARY KEY (id);


--
-- TOC entry 3668 (class 2606 OID 86246)
-- Name: m_products m_products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_products
    ADD CONSTRAINT m_products_pkey PRIMARY KEY (id);


--
-- TOC entry 3680 (class 2606 OID 86358)
-- Name: m_provinces m_provinces_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_provinces
    ADD CONSTRAINT m_provinces_pkey PRIMARY KEY (id);


--
-- TOC entry 3682 (class 2606 OID 86367)
-- Name: m_regencies m_regencies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_regencies
    ADD CONSTRAINT m_regencies_pkey PRIMARY KEY (id);


--
-- TOC entry 3670 (class 2606 OID 86248)
-- Name: m_users m_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_users
    ADD CONSTRAINT m_users_pkey PRIMARY KEY (id);


--
-- TOC entry 3686 (class 2606 OID 86385)
-- Name: m_villages m_villages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_villages
    ADD CONSTRAINT m_villages_pkey PRIMARY KEY (id);


--
-- TOC entry 3666 (class 2606 OID 86250)
-- Name: m_order_types pk_m_order_types; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_order_types
    ADD CONSTRAINT pk_m_order_types PRIMARY KEY (id);


--
-- TOC entry 3672 (class 2606 OID 86252)
-- Name: t_orderdetails t_orderdetails_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.t_orderdetails
    ADD CONSTRAINT t_orderdetails_pkey PRIMARY KEY (id);


--
-- TOC entry 3674 (class 2606 OID 86254)
-- Name: t_orders t_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.t_orders
    ADD CONSTRAINT t_orders_pkey PRIMARY KEY (id);


--
-- TOC entry 3678 (class 2606 OID 86256)
-- Name: t_payments t_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.t_payments
    ADD CONSTRAINT t_payments_pkey PRIMARY KEY (id);


--
-- TOC entry 3676 (class 2606 OID 86258)
-- Name: t_orders uq_t_orders_uuid; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.t_orders
    ADD CONSTRAINT uq_t_orders_uuid UNIQUE (uuid);


--
-- TOC entry 3689 (class 2606 OID 86259)
-- Name: m_categories fk_category_merchant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_categories
    ADD CONSTRAINT fk_category_merchant FOREIGN KEY (merchant_id) REFERENCES public.m_merchants(id);


--
-- TOC entry 3690 (class 2606 OID 86264)
-- Name: m_customer_addresses fk_customer; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_customer_addresses
    ADD CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES public.m_customers(id) ON DELETE CASCADE;


--
-- TOC entry 3702 (class 2606 OID 86269)
-- Name: t_orders fk_order_type; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.t_orders
    ADD CONSTRAINT fk_order_type FOREIGN KEY (order_type) REFERENCES public.m_order_types(id);


--
-- TOC entry 3691 (class 2606 OID 86274)
-- Name: m_merchant_banks m_merchant_banks_merchant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_merchant_banks
    ADD CONSTRAINT m_merchant_banks_merchant_id_fkey FOREIGN KEY (merchant_id) REFERENCES public.m_merchants(id);


--
-- TOC entry 3692 (class 2606 OID 86279)
-- Name: m_products m_products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_products
    ADD CONSTRAINT m_products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.m_categories(id);


--
-- TOC entry 3693 (class 2606 OID 86284)
-- Name: m_products m_products_category_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_products
    ADD CONSTRAINT m_products_category_id_fkey1 FOREIGN KEY (category_id) REFERENCES public.m_categories(id);


--
-- TOC entry 3694 (class 2606 OID 86289)
-- Name: m_products m_products_merchant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_products
    ADD CONSTRAINT m_products_merchant_id_fkey FOREIGN KEY (merchant_id) REFERENCES public.m_merchants(id);


--
-- TOC entry 3695 (class 2606 OID 86294)
-- Name: m_products m_products_merchant_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_products
    ADD CONSTRAINT m_products_merchant_id_fkey1 FOREIGN KEY (merchant_id) REFERENCES public.m_merchants(id);


--
-- TOC entry 3696 (class 2606 OID 86299)
-- Name: m_useraccess m_useraccess_feature_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_useraccess
    ADD CONSTRAINT m_useraccess_feature_id_fkey FOREIGN KEY (feature_id) REFERENCES public.m_features(id);


--
-- TOC entry 3697 (class 2606 OID 86304)
-- Name: m_users m_users_merchant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.m_users
    ADD CONSTRAINT m_users_merchant_id_fkey FOREIGN KEY (merchant_id) REFERENCES public.m_merchants(id);


--
-- TOC entry 3698 (class 2606 OID 86309)
-- Name: t_orderdetails t_orderdetails_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.t_orderdetails
    ADD CONSTRAINT t_orderdetails_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.t_orders(id);


--
-- TOC entry 3699 (class 2606 OID 86314)
-- Name: t_orderdetails t_orderdetails_order_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.t_orderdetails
    ADD CONSTRAINT t_orderdetails_order_id_fkey1 FOREIGN KEY (order_id) REFERENCES public.t_orders(id);


--
-- TOC entry 3700 (class 2606 OID 86319)
-- Name: t_orderdetails t_orderdetails_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.t_orderdetails
    ADD CONSTRAINT t_orderdetails_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.m_products(id);


--
-- TOC entry 3701 (class 2606 OID 86324)
-- Name: t_orderdetails t_orderdetails_product_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.t_orderdetails
    ADD CONSTRAINT t_orderdetails_product_id_fkey1 FOREIGN KEY (product_id) REFERENCES public.m_products(id);


--
-- TOC entry 3703 (class 2606 OID 86329)
-- Name: t_orders t_orders_merchant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.t_orders
    ADD CONSTRAINT t_orders_merchant_id_fkey FOREIGN KEY (merchant_id) REFERENCES public.m_merchants(id);


--
-- TOC entry 3704 (class 2606 OID 86334)
-- Name: t_orders t_orders_merchant_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.t_orders
    ADD CONSTRAINT t_orders_merchant_id_fkey1 FOREIGN KEY (merchant_id) REFERENCES public.m_merchants(id);


--
-- TOC entry 3705 (class 2606 OID 86339)
-- Name: t_payments t_payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.t_payments
    ADD CONSTRAINT t_payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.t_orders(id);


--
-- TOC entry 3706 (class 2606 OID 86344)
-- Name: t_payments t_payments_order_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.t_payments
    ADD CONSTRAINT t_payments_order_id_fkey1 FOREIGN KEY (order_id) REFERENCES public.t_orders(id);


-- Completed on 2026-10-10 19:54:22 WIB

--
-- PostgreSQL database dump complete
--

