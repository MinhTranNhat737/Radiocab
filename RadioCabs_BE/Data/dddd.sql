--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-10-24 20:20:24

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 19092)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 5204 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 921 (class 1247 OID 18708)
-- Name: active_flag; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.active_flag AS ENUM (
    'ACTIVE',
    'INACTIVE'
);


ALTER TYPE public.active_flag OWNER TO postgres;

--
-- TOC entry 930 (class 1247 OID 18738)
-- Name: fuel_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.fuel_type_enum AS ENUM (
    'GASOLINE',
    'DIESEL',
    'EV',
    'HYBRID'
);


ALTER TYPE public.fuel_type_enum OWNER TO postgres;

--
-- TOC entry 924 (class 1247 OID 18714)
-- Name: order_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_status AS ENUM (
    'NEW',
    'ASSIGNED',
    'ONGOING',
    'DONE',
    'CANCELLED',
    'FAILED'
);


ALTER TYPE public.order_status OWNER TO postgres;

--
-- TOC entry 927 (class 1247 OID 18728)
-- Name: payment_method; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.payment_method AS ENUM (
    'CASH',
    'CARD',
    'WALLET',
    'BANK'
);


ALTER TYPE public.payment_method OWNER TO postgres;

--
-- TOC entry 987 (class 1247 OID 19140)
-- Name: revocation_reason; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.revocation_reason AS ENUM (
    'USER_LOGOUT',
    'ADMIN_FORCED',
    'ROTATION',
    'COMPROMISED',
    'EXPIRED',
    'OTHER'
);


ALTER TYPE public.revocation_reason OWNER TO postgres;

--
-- TOC entry 918 (class 1247 OID 18695)
-- Name: role_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.role_type AS ENUM (
    'ADMIN',
    'MANAGER',
    'ACCOUNTANT',
    'DISPATCHER',
    'DRIVER',
    'CUSTOMER'
);


ALTER TYPE public.role_type OWNER TO postgres;

--
-- TOC entry 990 (class 1247 OID 19251)
-- Name: shift_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.shift_status AS ENUM (
    'PLANNED',
    'ON',
    'OFF',
    'CANCELLED',
    'COMPLETED'
);


ALTER TYPE public.shift_status OWNER TO postgres;

--
-- TOC entry 933 (class 1247 OID 18748)
-- Name: vehicle_category_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.vehicle_category_enum AS ENUM (
    'HATCHBACK_5',
    'SEDAN_5',
    'SUV_5',
    'SUV_7',
    'MPV_7'
);


ALTER TYPE public.vehicle_category_enum OWNER TO postgres;

--
-- TOC entry 984 (class 1247 OID 19130)
-- Name: verification_purpose; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.verification_purpose AS ENUM (
    'SIGNUP',
    'PASSWORD_RESET',
    'EMAIL_CHANGE',
    'MFA'
);


ALTER TYPE public.verification_purpose OWNER TO postgres;

--
-- TOC entry 289 (class 1255 OID 19305)
-- Name: seed_driver_schedule_for_month(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.seed_driver_schedule_for_month(p_year integer, p_month integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
  d0 DATE := make_date(p_year, p_month, 1);                    -- ngày đầu tháng
  d1 DATE := (d0 + INTERVAL '1 month - 1 day')::date;          -- ngày cuối tháng
  inserted_count INTEGER;
BEGIN
  INSERT INTO driver_schedule (driver_account_id, work_date, start_time, end_time, vehicle_id, status, note)
  SELECT t.driver_account_id,
         dd::date AS work_date,
         t.start_time,
         t.end_time,
         t.vehicle_id,
         'PLANNED'::shift_status,
         'seeded from template'
  FROM generate_series(d0, d1, interval '1 day') AS dd
  JOIN driver_schedule_template t
    ON t.is_active = TRUE
   AND dd::date BETWEEN t.start_date AND t.end_date
   AND EXTRACT(DOW FROM dd)::int = t.weekday
  ON CONFLICT (driver_account_id, work_date, start_time, end_time) DO NOTHING;

  GET DIAGNOSTICS inserted_count = ROW_COUNT;
  RETURN inserted_count;
END;
$$;


ALTER FUNCTION public.seed_driver_schedule_for_month(p_year integer, p_month integer) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 225 (class 1259 OID 18795)
-- Name: account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account (
    account_id bigint NOT NULL,
    company_id bigint,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    full_name character varying(120) NOT NULL,
    phone character varying(20),
    email character varying(145),
    role public.role_type DEFAULT 'CUSTOMER'::public.role_type NOT NULL,
    status public.active_flag DEFAULT 'ACTIVE'::public.active_flag NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    email_verified_at timestamp with time zone
);


ALTER TABLE public.account OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 18794)
-- Name: account_account_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_account_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.account_account_id_seq OWNER TO postgres;

--
-- TOC entry 5205 (class 0 OID 0)
-- Dependencies: 224
-- Name: account_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_account_id_seq OWNED BY public.account.account_id;


--
-- TOC entry 252 (class 1259 OID 19324)
-- Name: auth_email_code; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_email_code (
    code_id bigint NOT NULL,
    account_id bigint,
    email character varying(145) NOT NULL,
    purpose character varying(30) NOT NULL,
    code_hash character varying(255) NOT NULL,
    sent_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    consumed_at timestamp with time zone,
    attempt_count integer DEFAULT 0 NOT NULL,
    max_attempts integer DEFAULT 5 NOT NULL
);


ALTER TABLE public.auth_email_code OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 19323)
-- Name: auth_email_code_code_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auth_email_code_code_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.auth_email_code_code_id_seq OWNER TO postgres;

--
-- TOC entry 5206 (class 0 OID 0)
-- Dependencies: 251
-- Name: auth_email_code_code_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auth_email_code_code_id_seq OWNED BY public.auth_email_code.code_id;


--
-- TOC entry 250 (class 1259 OID 19307)
-- Name: auth_refresh_session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_refresh_session (
    session_id uuid DEFAULT gen_random_uuid() NOT NULL,
    account_id bigint NOT NULL,
    token_hash character varying(255) NOT NULL,
    jti uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    revoked_at timestamp with time zone,
    replaced_by uuid,
    ip inet,
    user_agent text
);


ALTER TABLE public.auth_refresh_session OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 18783)
-- Name: company; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company (
    company_id bigint NOT NULL,
    name character varying(145) NOT NULL,
    hotline character varying(45) NOT NULL,
    email character varying(145) NOT NULL,
    address character varying(255) NOT NULL,
    tax_code character varying(50) NOT NULL,
    status public.active_flag DEFAULT 'ACTIVE'::public.active_flag NOT NULL,
    contact_account_id bigint,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    fax character varying NOT NULL
);


ALTER TABLE public.company OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 18782)
-- Name: company_company_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.company_company_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.company_company_id_seq OWNER TO postgres;

--
-- TOC entry 5207 (class 0 OID 0)
-- Dependencies: 222
-- Name: company_company_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.company_company_id_seq OWNED BY public.company.company_id;


--
-- TOC entry 249 (class 1259 OID 19284)
-- Name: driver_schedule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.driver_schedule (
    schedule_id bigint NOT NULL,
    driver_account_id bigint NOT NULL,
    work_date date NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    vehicle_id bigint,
    status public.shift_status DEFAULT 'PLANNED'::public.shift_status NOT NULL,
    note character varying(200),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    CONSTRAINT driver_schedule_check CHECK ((end_time > start_time))
);


ALTER TABLE public.driver_schedule OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 19283)
-- Name: driver_schedule_schedule_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.driver_schedule_schedule_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.driver_schedule_schedule_id_seq OWNER TO postgres;

--
-- TOC entry 5208 (class 0 OID 0)
-- Dependencies: 248
-- Name: driver_schedule_schedule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.driver_schedule_schedule_id_seq OWNED BY public.driver_schedule.schedule_id;


--
-- TOC entry 247 (class 1259 OID 19262)
-- Name: driver_schedule_template; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.driver_schedule_template (
    template_id bigint NOT NULL,
    driver_account_id bigint NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    weekday smallint NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    vehicle_id bigint,
    note character varying(200),
    is_active boolean DEFAULT true NOT NULL,
    CONSTRAINT driver_schedule_template_check CHECK ((end_date >= start_date)),
    CONSTRAINT driver_schedule_template_check1 CHECK ((end_time > start_time)),
    CONSTRAINT driver_schedule_template_weekday_check CHECK (((weekday >= 0) AND (weekday <= 6)))
);


ALTER TABLE public.driver_schedule_template OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 19261)
-- Name: driver_schedule_template_template_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.driver_schedule_template_template_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.driver_schedule_template_template_id_seq OWNER TO postgres;

--
-- TOC entry 5209 (class 0 OID 0)
-- Dependencies: 246
-- Name: driver_schedule_template_template_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.driver_schedule_template_template_id_seq OWNED BY public.driver_schedule_template.template_id;


--
-- TOC entry 235 (class 1259 OID 18902)
-- Name: driver_vehicle_assignment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.driver_vehicle_assignment (
    assignment_id bigint NOT NULL,
    driver_account_id bigint NOT NULL,
    vehicle_id bigint NOT NULL,
    start_at timestamp with time zone NOT NULL,
    end_at timestamp with time zone,
    CONSTRAINT chk_dva_time CHECK (((end_at IS NULL) OR (end_at > start_at)))
);


ALTER TABLE public.driver_vehicle_assignment OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 18901)
-- Name: driver_vehicle_assignment_assignment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.driver_vehicle_assignment_assignment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.driver_vehicle_assignment_assignment_id_seq OWNER TO postgres;

--
-- TOC entry 5210 (class 0 OID 0)
-- Dependencies: 234
-- Name: driver_vehicle_assignment_assignment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.driver_vehicle_assignment_assignment_id_seq OWNED BY public.driver_vehicle_assignment.assignment_id;


--
-- TOC entry 244 (class 1259 OID 19023)
-- Name: driving_order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.driving_order (
    order_id bigint NOT NULL,
    company_id bigint NOT NULL,
    customer_account_id bigint,
    vehicle_id bigint,
    driver_account_id bigint,
    model_id bigint NOT NULL,
    price_ref_id bigint,
    from_province_id bigint NOT NULL,
    to_province_id bigint NOT NULL,
    pickup_address character varying(255),
    dropoff_address character varying(255),
    pickup_time timestamp with time zone,
    dropoff_time timestamp with time zone,
    status public.order_status DEFAULT 'NEW'::public.order_status NOT NULL,
    total_km numeric(9,2) NOT NULL,
    inner_city_km numeric(9,2) DEFAULT 0 NOT NULL,
    intercity_km numeric(9,2) DEFAULT 0 NOT NULL,
    traffic_km numeric(9,2) DEFAULT 0 NOT NULL,
    is_raining boolean DEFAULT false NOT NULL,
    wait_minutes integer DEFAULT 0 NOT NULL,
    base_fare numeric(14,2) NOT NULL,
    traffic_unit_price numeric(12,2) DEFAULT 0 NOT NULL,
    traffic_fee numeric(14,2) DEFAULT 0 NOT NULL,
    rain_fee numeric(14,2) DEFAULT 0 NOT NULL,
    intercity_unit_price numeric(12,2) DEFAULT 0 NOT NULL,
    intercity_fee numeric(14,2) DEFAULT 0 NOT NULL,
    other_fee numeric(14,2) DEFAULT 0 NOT NULL,
    total_amount numeric(14,2) NOT NULL,
    fare_breakdown jsonb,
    payment_method public.payment_method,
    paid_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone
);


ALTER TABLE public.driving_order OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 19022)
-- Name: driving_order_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.driving_order_order_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.driving_order_order_id_seq OWNER TO postgres;

--
-- TOC entry 5211 (class 0 OID 0)
-- Dependencies: 243
-- Name: driving_order_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.driving_order_order_id_seq OWNED BY public.driving_order.order_id;


--
-- TOC entry 227 (class 1259 OID 18820)
-- Name: membership_order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.membership_order (
    membership_order_id bigint NOT NULL,
    company_id bigint NOT NULL,
    payer_account_id bigint NOT NULL,
    unit_months integer NOT NULL,
    unit_price numeric(12,2) NOT NULL,
    amount numeric(14,2) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    paid_at timestamp with time zone,
    payment_method public.payment_method,
    note character varying(300),
    CONSTRAINT membership_order_amount_check CHECK ((amount >= (0)::numeric)),
    CONSTRAINT membership_order_unit_months_check CHECK ((unit_months > 0)),
    CONSTRAINT membership_order_unit_price_check CHECK ((unit_price >= (0)::numeric))
);


ALTER TABLE public.membership_order OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 18819)
-- Name: membership_order_membership_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.membership_order_membership_order_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.membership_order_membership_order_id_seq OWNER TO postgres;

--
-- TOC entry 5212 (class 0 OID 0)
-- Dependencies: 226
-- Name: membership_order_membership_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.membership_order_membership_order_id_seq OWNED BY public.membership_order.membership_order_id;


--
-- TOC entry 242 (class 1259 OID 18991)
-- Name: model_price_province; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.model_price_province (
    model_price_id bigint NOT NULL,
    company_id bigint NOT NULL,
    province_id bigint NOT NULL,
    model_id bigint NOT NULL,
    opening_fare numeric(12,2) NOT NULL,
    rate_first20_km numeric(12,2) NOT NULL,
    rate_over20_km numeric(12,2) NOT NULL,
    traffic_add_per_km numeric(12,2) DEFAULT 0 NOT NULL,
    rain_add_per_trip numeric(12,2) DEFAULT 0 NOT NULL,
    intercity_rate_per_km numeric(12,2) DEFAULT 0 NOT NULL,
    time_start time without time zone,
    time_end time without time zone,
    parent_id bigint,
    date_start date NOT NULL,
    date_end date NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    note character varying(300)
);


ALTER TABLE public.model_price_province OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 18990)
-- Name: model_price_province_model_price_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.model_price_province_model_price_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.model_price_province_model_price_id_seq OWNER TO postgres;

--
-- TOC entry 5213 (class 0 OID 0)
-- Dependencies: 241
-- Name: model_price_province_model_price_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.model_price_province_model_price_id_seq OWNED BY public.model_price_province.model_price_id;


--
-- TOC entry 219 (class 1259 OID 18760)
-- Name: province; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.province (
    province_id bigint NOT NULL,
    code character varying(20),
    name character varying(120) NOT NULL
);


ALTER TABLE public.province OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 18759)
-- Name: province_province_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.province_province_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.province_province_id_seq OWNER TO postgres;

--
-- TOC entry 5214 (class 0 OID 0)
-- Dependencies: 218
-- Name: province_province_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.province_province_id_seq OWNED BY public.province.province_id;


--
-- TOC entry 233 (class 1259 OID 18880)
-- Name: vehicle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicle (
    vehicle_id bigint NOT NULL,
    company_id bigint NOT NULL,
    model_id bigint NOT NULL,
    plate_number character varying(20) NOT NULL,
    vin character varying(50),
    color character varying(30),
    year_manufactured smallint,
    in_service_from date NOT NULL,
    odometer_km integer DEFAULT 0 NOT NULL,
    status public.active_flag DEFAULT 'ACTIVE'::public.active_flag NOT NULL
);


ALTER TABLE public.vehicle OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 18923)
-- Name: vehicle_in_province; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicle_in_province (
    vehicle_id bigint NOT NULL,
    province_id bigint NOT NULL,
    allowed boolean DEFAULT true NOT NULL,
    since_date date
);


ALTER TABLE public.vehicle_in_province OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 18856)
-- Name: vehicle_model; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicle_model (
    model_id bigint NOT NULL,
    company_id bigint NOT NULL,
    segment_id bigint,
    brand character varying(60) NOT NULL,
    model_name character varying(100) NOT NULL,
    fuel_type public.fuel_type_enum DEFAULT 'GASOLINE'::public.fuel_type_enum NOT NULL,
    seat_category public.vehicle_category_enum DEFAULT 'SEDAN_5'::public.vehicle_category_enum NOT NULL,
    image_url character varying(255),
    description character varying(500),
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.vehicle_model OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 18855)
-- Name: vehicle_model_model_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vehicle_model_model_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vehicle_model_model_id_seq OWNER TO postgres;

--
-- TOC entry 5215 (class 0 OID 0)
-- Dependencies: 230
-- Name: vehicle_model_model_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vehicle_model_model_id_seq OWNED BY public.vehicle_model.model_id;


--
-- TOC entry 245 (class 1259 OID 19087)
-- Name: vehicle_model_with_seats; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vehicle_model_with_seats AS
 SELECT model_id,
    company_id,
    segment_id,
    brand,
    model_name,
    fuel_type,
    seat_category,
    image_url,
    description,
    is_active,
        CASE seat_category
            WHEN 'HATCHBACK_5'::public.vehicle_category_enum THEN 5
            WHEN 'SEDAN_5'::public.vehicle_category_enum THEN 5
            WHEN 'SUV_5'::public.vehicle_category_enum THEN 5
            WHEN 'SUV_7'::public.vehicle_category_enum THEN 7
            WHEN 'MPV_7'::public.vehicle_category_enum THEN 7
            ELSE NULL::integer
        END AS seats
   FROM public.vehicle_model vm;


ALTER VIEW public.vehicle_model_with_seats OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 18841)
-- Name: vehicle_segment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicle_segment (
    segment_id bigint NOT NULL,
    company_id bigint NOT NULL,
    code character varying(40) NOT NULL,
    name character varying(100) NOT NULL,
    description character varying(300),
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.vehicle_segment OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 18840)
-- Name: vehicle_segment_segment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vehicle_segment_segment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vehicle_segment_segment_id_seq OWNER TO postgres;

--
-- TOC entry 5216 (class 0 OID 0)
-- Dependencies: 228
-- Name: vehicle_segment_segment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vehicle_segment_segment_id_seq OWNED BY public.vehicle_segment.segment_id;


--
-- TOC entry 232 (class 1259 OID 18879)
-- Name: vehicle_vehicle_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vehicle_vehicle_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vehicle_vehicle_id_seq OWNER TO postgres;

--
-- TOC entry 5217 (class 0 OID 0)
-- Dependencies: 232
-- Name: vehicle_vehicle_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vehicle_vehicle_id_seq OWNED BY public.vehicle.vehicle_id;


--
-- TOC entry 240 (class 1259 OID 18974)
-- Name: vehicle_zone_preference; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicle_zone_preference (
    vehicle_id bigint NOT NULL,
    zone_id bigint NOT NULL,
    priority smallint DEFAULT 100 NOT NULL
);


ALTER TABLE public.vehicle_zone_preference OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 18769)
-- Name: ward; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ward (
    ward_id bigint NOT NULL,
    province_id bigint NOT NULL,
    code character varying(20),
    name character varying(120) NOT NULL
);


ALTER TABLE public.ward OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 18768)
-- Name: ward_ward_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ward_ward_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ward_ward_id_seq OWNER TO postgres;

--
-- TOC entry 5218 (class 0 OID 0)
-- Dependencies: 220
-- Name: ward_ward_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ward_ward_id_seq OWNED BY public.ward.ward_id;


--
-- TOC entry 238 (class 1259 OID 18940)
-- Name: zone; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.zone (
    zone_id bigint NOT NULL,
    company_id bigint NOT NULL,
    province_id bigint NOT NULL,
    code character varying(40) NOT NULL,
    name character varying(120) NOT NULL,
    description character varying(300),
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.zone OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 18959)
-- Name: zone_ward; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.zone_ward (
    zone_id bigint NOT NULL,
    ward_id bigint NOT NULL
);


ALTER TABLE public.zone_ward OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 18939)
-- Name: zone_zone_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.zone_zone_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.zone_zone_id_seq OWNER TO postgres;

--
-- TOC entry 5219 (class 0 OID 0)
-- Dependencies: 237
-- Name: zone_zone_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.zone_zone_id_seq OWNED BY public.zone.zone_id;


--
-- TOC entry 4855 (class 2604 OID 18798)
-- Name: account account_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account ALTER COLUMN account_id SET DEFAULT nextval('public.account_account_id_seq'::regclass);


--
-- TOC entry 4900 (class 2604 OID 19327)
-- Name: auth_email_code code_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_email_code ALTER COLUMN code_id SET DEFAULT nextval('public.auth_email_code_code_id_seq'::regclass);


--
-- TOC entry 4852 (class 2604 OID 18786)
-- Name: company company_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company ALTER COLUMN company_id SET DEFAULT nextval('public.company_company_id_seq'::regclass);


--
-- TOC entry 4895 (class 2604 OID 19287)
-- Name: driver_schedule schedule_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_schedule ALTER COLUMN schedule_id SET DEFAULT nextval('public.driver_schedule_schedule_id_seq'::regclass);


--
-- TOC entry 4893 (class 2604 OID 19265)
-- Name: driver_schedule_template template_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_schedule_template ALTER COLUMN template_id SET DEFAULT nextval('public.driver_schedule_template_template_id_seq'::regclass);


--
-- TOC entry 4869 (class 2604 OID 18905)
-- Name: driver_vehicle_assignment assignment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_vehicle_assignment ALTER COLUMN assignment_id SET DEFAULT nextval('public.driver_vehicle_assignment_assignment_id_seq'::regclass);


--
-- TOC entry 4879 (class 2604 OID 19026)
-- Name: driving_order order_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driving_order ALTER COLUMN order_id SET DEFAULT nextval('public.driving_order_order_id_seq'::regclass);


--
-- TOC entry 4859 (class 2604 OID 18823)
-- Name: membership_order membership_order_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membership_order ALTER COLUMN membership_order_id SET DEFAULT nextval('public.membership_order_membership_order_id_seq'::regclass);


--
-- TOC entry 4874 (class 2604 OID 18994)
-- Name: model_price_province model_price_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.model_price_province ALTER COLUMN model_price_id SET DEFAULT nextval('public.model_price_province_model_price_id_seq'::regclass);


--
-- TOC entry 4850 (class 2604 OID 18763)
-- Name: province province_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.province ALTER COLUMN province_id SET DEFAULT nextval('public.province_province_id_seq'::regclass);


--
-- TOC entry 4866 (class 2604 OID 18883)
-- Name: vehicle vehicle_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle ALTER COLUMN vehicle_id SET DEFAULT nextval('public.vehicle_vehicle_id_seq'::regclass);


--
-- TOC entry 4862 (class 2604 OID 18859)
-- Name: vehicle_model model_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_model ALTER COLUMN model_id SET DEFAULT nextval('public.vehicle_model_model_id_seq'::regclass);


--
-- TOC entry 4860 (class 2604 OID 18844)
-- Name: vehicle_segment segment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_segment ALTER COLUMN segment_id SET DEFAULT nextval('public.vehicle_segment_segment_id_seq'::regclass);


--
-- TOC entry 4851 (class 2604 OID 18772)
-- Name: ward ward_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ward ALTER COLUMN ward_id SET DEFAULT nextval('public.ward_ward_id_seq'::regclass);


--
-- TOC entry 4871 (class 2604 OID 18943)
-- Name: zone zone_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zone ALTER COLUMN zone_id SET DEFAULT nextval('public.zone_zone_id_seq'::regclass);


--
-- TOC entry 5172 (class 0 OID 18795)
-- Dependencies: 225
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account (account_id, company_id, username, password_hash, full_name, phone, email, role, status, created_at, updated_at, email_verified_at) FROM stdin;
1	1	admin.hn	$2a$10$hash1	Nguyễn Văn Admin HN	0901234567	admin.hn@radiocabs.com	ADMIN	ACTIVE	2025-10-22 14:03:47.956554+07	\N	2025-10-22 14:03:47.956554+07
2	2	admin.hcm	$2a$10$hash2	Trần Thị Admin HCM	0907654321	admin.hcm@radiocabs.com	ADMIN	ACTIVE	2025-10-22 14:03:47.956554+07	\N	2025-10-22 14:03:47.956554+07
3	3	admin.dn	$2a$10$hash3	Lê Văn Admin DN	0909876543	admin.dn@radiocabs.com	ADMIN	ACTIVE	2025-10-22 14:03:47.956554+07	\N	2025-10-22 14:03:47.956554+07
4	1	manager.hn	$2a$10$hash4	Phạm Thị Manager HN	0901111111	manager.hn@radiocabs.com	MANAGER	ACTIVE	2025-10-22 14:03:47.956554+07	\N	2025-10-22 14:03:47.956554+07
5	2	manager.hcm	$2a$10$hash5	Hoàng Văn Manager HCM	0902222222	manager.hcm@radiocabs.com	MANAGER	ACTIVE	2025-10-22 14:03:47.956554+07	\N	2025-10-22 14:03:47.956554+07
6	1	driver001.hn	$2a$10$hash6	Nguyễn Văn Tài Xế 1	0903333333	driver001.hn@radiocabs.com	DRIVER	ACTIVE	2025-10-22 14:03:47.956554+07	\N	2025-10-22 14:03:47.956554+07
7	1	driver002.hn	$2a$10$hash7	Trần Thị Tài Xế 2	0904444444	driver002.hn@radiocabs.com	DRIVER	ACTIVE	2025-10-22 14:03:47.956554+07	\N	2025-10-22 14:03:47.956554+07
8	2	driver001.hcm	$2a$10$hash8	Lê Văn Tài Xế 3	0905555555	driver001.hcm@radiocabs.com	DRIVER	ACTIVE	2025-10-22 14:03:47.956554+07	\N	2025-10-22 14:03:47.956554+07
9	2	driver002.hcm	$2a$10$hash9	Phạm Thị Tài Xế 4	0906666666	driver002.hcm@radiocabs.com	DRIVER	ACTIVE	2025-10-22 14:03:47.956554+07	\N	2025-10-22 14:03:47.956554+07
10	3	driver001.dn	$2a$10$hash10	Hoàng Văn Tài Xế 5	0907777777	driver001.dn@radiocabs.com	DRIVER	ACTIVE	2025-10-22 14:03:47.956554+07	\N	2025-10-22 14:03:47.956554+07
11	\N	customer001	$2a$10$hash11	Nguyễn Thị Khách Hàng 1	0908888888	customer001@gmail.com	CUSTOMER	ACTIVE	2025-10-22 14:03:47.956554+07	\N	2025-10-22 14:03:47.956554+07
12	\N	customer002	$2a$10$hash12	Trần Văn Khách Hàng 2	0909999999	customer002@gmail.com	CUSTOMER	ACTIVE	2025-10-22 14:03:47.956554+07	\N	2025-10-22 14:03:47.956554+07
13	\N	customer003	$2a$10$hash13	Lê Thị Khách Hàng 3	0910000000	customer003@gmail.com	CUSTOMER	ACTIVE	2025-10-22 14:03:47.956554+07	\N	2025-10-22 14:03:47.956554+07
15	1	testuser123	u+8LdNfyiw3CVGAHbuHnD8VmaR0JDfISDiLXjQMr+I4=	Nguyễn Văn Test	0123456789	test@example.com	CUSTOMER	ACTIVE	2025-10-22 19:04:49.633631+07	2025-10-22 19:06:15.882558+07	\N
16	1	1	a4ayc/80/OGda4BO/1o/V0etpOqiLx1JwB5S3beHW0s=	string	string	string	ADMIN	ACTIVE	2025-10-23 21:38:13.834925+07	\N	\N
17	4	2	$2a$11$l4McTioNp9VVNKFUIiGTHetLdhXeU1AZovPetkfY55SfIUod6xtuu	string	string	string	MANAGER	ACTIVE	2025-10-23 22:02:57.659396+07	\N	\N
18	4	3	$2a$11$G.5XBOOeNFVr7tV7NQVtLuIc2Pa7ErMDaqj6txfE/tUxjLo/S6YRG	string	string	string	DRIVER	ACTIVE	2025-10-23 22:05:31.404115+07	\N	\N
19	4	4	$2a$11$T6biOX3oT8EzD1cLBG1HeehKTTe.YVTJICoan1yrw7sRT5SJ1rp2W	string	string	string	DISPATCHER	ACTIVE	2025-10-23 22:06:55.479862+07	\N	\N
20	4	5	$2a$11$rkm0Pwg43p.21ZaX4Og6tOqXqUaSzB2plzeuWinOqpzW9B7ChNZq6	string	string	string	ACCOUNTANT	ACTIVE	2025-10-23 22:07:25.799809+07	\N	\N
22	3	22	$2a$11$1lnXJFX/LqzoymEol3XQq.koID41l9sMi4FOJx4gDFxrPKbA9e77e	string	string	string	MANAGER	ACTIVE	2025-10-23 22:36:47.523537+07	\N	\N
\.


--
-- TOC entry 5198 (class 0 OID 19324)
-- Dependencies: 252
-- Data for Name: auth_email_code; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_email_code (code_id, account_id, email, purpose, code_hash, sent_at, expires_at, consumed_at, attempt_count, max_attempts) FROM stdin;
1	11	customer001@gmail.com	SIGNUP	$2a$10$verification_hash_1	2024-01-15 10:00:00+07	2024-01-15 11:00:00+07	2024-01-15 10:05:00+07	1	5
2	12	customer002@gmail.com	PASSWORD_RESET	$2a$10$verification_hash_2	2024-01-15 14:00:00+07	2024-01-15 15:00:00+07	\N	0	5
3	13	customer003@gmail.com	EMAIL_CHANGE	$2a$10$verification_hash_3	2024-01-16 09:00:00+07	2024-01-16 10:00:00+07	\N	0	5
\.


--
-- TOC entry 5196 (class 0 OID 19307)
-- Dependencies: 250
-- Data for Name: auth_refresh_session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_refresh_session (session_id, account_id, token_hash, jti, created_at, expires_at, revoked_at, replaced_by, ip, user_agent) FROM stdin;
550e8400-e29b-41d4-a716-446655440001	11	$2a$10$refresh_hash_1	550e8400-e29b-41d4-a716-446655440011	2024-01-15 08:00:00+07	2024-01-22 08:00:00+07	\N	\N	192.168.1.100	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
550e8400-e29b-41d4-a716-446655440002	12	$2a$10$refresh_hash_2	550e8400-e29b-41d4-a716-446655440022	2024-01-15 09:00:00+07	2024-01-22 09:00:00+07	\N	\N	192.168.1.101	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
550e8400-e29b-41d4-a716-446655440003	13	$2a$10$refresh_hash_3	550e8400-e29b-41d4-a716-446655440033	2024-01-15 10:00:00+07	2024-01-22 10:00:00+07	\N	\N	192.168.1.102	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
f7efc641-8489-44b2-8f04-2cbd34749120	15	GtdfvlZp+aIF1ZKWtZOS824adKdISGJCb98dDGgU8Sw=	e6b787c0-72f0-46b8-961b-2dc336c58781	2025-10-22 19:05:11.515137+07	2025-10-29 19:05:11.515146+07	\N	\N	\N	\N
5cfa55c8-4705-46d9-be79-0d47ec273148	15	OGRdxprY8GfO5bp2Lddqtbgrh5fQ/ZS6oHsjmrVEnbo=	e9bd05bb-d93a-4727-9d46-5e19fada1913	2025-10-22 19:06:38.738534+07	2025-10-29 19:06:38.738535+07	\N	\N	\N	\N
f404caae-0afc-4f43-8c88-2e6a5cf3305a	16	$2a$11$aKSZzpoEzONpiCMOrqGzfu/SIRcZ98sR68z3ZFvWDCL1aXD2lhkeC	8276cd09-b98c-4315-a0e1-ac9c776930c0	2025-10-23 22:01:37.805203+07	2025-10-30 22:01:37.805239+07	\N	\N	\N	\N
d1085ea9-1604-475a-8de5-caca251636e9	17	$2a$11$ZwOwL4J4OwHV0v62UKG3p.LJqXIgUabrm3ZLwTqv0Md1vqVxkyDDW	4f99e562-bcbf-4c68-ae3e-d8c7142cd76a	2025-10-23 22:03:07.784969+07	2025-10-30 22:03:07.78497+07	\N	\N	\N	\N
785b62e9-8e4d-420e-843e-1ed77e356b1a	18	$2a$11$OCZEpvRNxT1AgMzhjG/l4OJmmntU5s6woZlrqGRlVfG1LzBrtHXhi	5b8b618c-3d4f-4c47-b0e1-4749d39524f1	2025-10-23 22:05:40.399569+07	2025-10-30 22:05:40.399569+07	\N	\N	\N	\N
de4dea2c-c714-473d-9a43-8e481a9b54ca	19	$2a$11$Enu64fQfiqm.xiEpy1KKDuxbVYLbGo2kSREBnHYGqSK9b62k2pE4O	470f3fc7-4ab1-47f6-8b0d-9b58b199cfea	2025-10-23 22:07:02.458144+07	2025-10-30 22:07:02.458144+07	\N	\N	\N	\N
46d49733-6ddf-4f93-82dd-82b4c1f51069	20	$2a$11$DiNJZ6og.d34SmeO.6vc6usW/Xd81SKji1yScTqMAOsOhhElOx6ky	4cc7b161-1d52-45de-8f93-841f153e4e12	2025-10-23 22:07:35.620111+07	2025-10-30 22:07:35.620112+07	\N	\N	\N	\N
6ff1982b-b441-4b5d-992a-e2ec9066fa91	17	$2a$11$w01M4F3Ova5UwixEtCLGd.wf84IVAOVPEXG.xYQC88eSojUSxV6G2	c204c428-f54d-4e53-afab-c088ae60b461	2025-10-23 22:08:44.582443+07	2025-10-30 22:08:44.582443+07	\N	\N	\N	\N
81d9f4af-57d7-4e51-b9ea-c7c1eb24a95c	18	$2a$11$a/DhGXvKpM3DNE0XQazPceqP5CYypEYncBh7xv1/JnLdFGvV551Mq	bc29eb3f-a280-4b11-a8c0-55561283cfca	2025-10-23 22:16:37.802222+07	2025-10-30 22:16:37.802223+07	\N	\N	\N	\N
32e17007-3a59-4cb2-b7e1-f7aa79752cff	16	$2a$11$wUqa.qZzUrDKWHX8pMt3LepCYJRW1ux/ZszCIdK49u6Tq3o9uGrgq	30970918-4780-4082-a58f-5d939f8263df	2025-10-23 22:17:32.479525+07	2025-10-30 22:17:32.479526+07	\N	\N	\N	\N
4f67ee80-3525-4f2e-a2f6-5c37b854bfd4	18	$2a$11$WhRWkldQIxIR6WP4uLbOTe5B.RMkBj3Px0RzL35EGRmCJYiQ5vtlq	02e11875-aec2-4971-98f9-44e523d420bb	2025-10-23 22:18:17.753581+07	2025-10-30 22:18:17.753581+07	\N	\N	\N	\N
2189f5eb-aa2e-4b6f-a170-220b0354a8b9	16	$2a$11$LEjzEye096JawVbe3c84.u1v/Kr7jY2Qdp6PPMFfCjnIPSpMxaDWm	94b8fbd4-82f8-47e7-bb0a-8bc0b36ffc4c	2025-10-23 22:19:15.908868+07	2025-10-30 22:19:15.908869+07	\N	\N	\N	\N
6c0a8fb2-5d4e-4cf0-805b-6d2c5492017a	17	$2a$11$NCWIA.sadeDwkDP6ccqOce1vd01MTmtHCVJ2wVp1Z6ZipSsLzlhgC	0cbc1a64-8f17-474c-98e2-22aeca79e5ea	2025-10-23 22:22:04.166799+07	2025-10-30 22:22:04.1668+07	\N	\N	\N	\N
aa046859-1982-4801-9768-4e68d0270ec5	22	$2a$11$nYbWK/luqS9bEIIORQEgxeqHbuB/iceXSubtyXUa5lJJYnxgP.LnG	8c5290cb-e005-4638-bc24-4b6475abf331	2025-10-23 22:36:54.774976+07	2025-10-30 22:36:54.774976+07	\N	\N	\N	\N
f3ca988a-9267-4617-a4db-d5e21aa2bd2b	16	$2a$11$2R88gGHe2eR33jE3/GKb6.Jj3IzuueTV7iLeAsu.kzp1r/c5OeYK6	8ef3f654-7237-40e1-bd26-ac2e6bf25136	2025-10-23 23:02:13.391642+07	2025-10-30 23:02:13.391642+07	\N	\N	\N	\N
e516188b-d5ef-40d2-8d4a-ed8d69e56da9	22	$2a$11$fcIi9E3xJ4iJ5y5ZATL42u7XblmOD1EjiPm2NUFQ5eAJ5PiDN0MaO	4a67b285-f7b9-49f0-8163-b10e9f15cec5	2025-10-23 23:05:38.672294+07	2025-10-30 23:05:38.672294+07	\N	\N	\N	\N
1c9173f5-e4e7-452f-916d-8df3600e7449	16	$2a$11$MfrmCyNhdJ5inheLOxUycen3DYlmFiTE6RUUhk6fKfNPqDFeHg.m6	f0a8c8f5-a708-41b9-8e15-ee0998412f12	2025-10-23 23:07:52.740439+07	2025-10-30 23:07:52.74044+07	\N	\N	\N	\N
ee6aaf91-cec4-4820-be0d-398e8f9034e3	22	$2a$11$osx936YCGxKjMiRqtCR6cuKv13qJMNV8v9LRyNqrMXdJ6GWgMBBHq	5f13f1e7-f060-4c53-b032-b123c95ad5a3	2025-10-23 23:09:20.81966+07	2025-10-30 23:09:20.819661+07	\N	\N	\N	\N
9d7ecb4a-442c-4914-be7d-2160f237fe2d	22	$2a$11$a8Dt9UhEJHX5.cuoX1EPpekOq9.lfuZD6MX09iUEL.87CuhPzAkAS	2182f68f-af63-44ce-b5d1-3fce2d68d0c0	2025-10-24 14:33:35.532282+07	2025-10-31 14:33:35.532294+07	\N	\N	\N	\N
636e8226-8f31-430b-a9f2-a5ca78906a69	22	$2a$11$aedTbHbhZWykmIPVg2.4COmCddlP0f80df7NOY2lN.rLlRsDDR3Ua	bbeb7acb-64d9-4b4f-bf15-acce9c682c95	2025-10-24 14:57:06.285923+07	2025-10-31 14:57:06.285937+07	\N	\N	\N	\N
a3aee2d9-7546-4fa7-ac40-436a59184528	22	$2a$11$25z6MgzGwgaAQ6QdYC.y5.TWl5a3lX/dGmchCsieBUvpGs49C7nZy	1967cead-14c9-4471-be78-dc2ea3011058	2025-10-24 15:07:21.330997+07	2025-10-31 15:07:21.330998+07	\N	\N	\N	\N
a242e8a9-7e48-4832-ab40-5cdb36798b20	22	$2a$11$2E68bACxGNXJWGhmArUP3OoiTgy9mORePVVj1Wqp25UR.gQ50BHn6	fdeff763-9845-46ef-8516-9d647be9bbb2	2025-10-24 15:11:10.057925+07	2025-10-31 15:11:10.057926+07	\N	\N	\N	\N
63505dd4-4f45-4573-afab-e4abe1ff022d	22	$2a$11$hfocs5AxWCqL.PpJTOinQu2nMSIQVE82aZxaEKW1loDQVjoScVFWy	7f4cb37a-ec6c-432c-ac91-8cf0abb7fe78	2025-10-24 15:43:16.056448+07	2025-10-31 15:43:16.05646+07	\N	\N	\N	\N
848f734b-24e8-4fe1-af84-e1fc0c9b497a	22	$2a$11$hVJWdnmlo8snTzi84MROWeGggShTpxzyIU9HOG26zcQBWGscDQ9iS	5a6618cd-968a-4662-a4fd-72b3da3a8719	2025-10-24 16:12:51.557797+07	2025-10-31 16:12:51.557807+07	\N	\N	\N	\N
ba372f51-fa9a-42ee-910f-e4c5f870db27	22	$2a$11$kPY6SQMWFOGVTlusZ0PnGOWNerTvbjzY620GqLXdAFk8QGf710pSe	032004ec-75c1-4b57-833b-97b918ff206d	2025-10-24 16:33:21.830255+07	2025-10-31 16:33:21.830281+07	\N	\N	\N	\N
212df8fe-5a78-454c-8bc1-96c5bb7199d8	22	$2a$11$yKEtKeSddlhpd7JYS84JrO2W91PnZvES994y7sQc7GJxgbhREJpmW	daefaa68-15da-46de-92ff-a3e460d67ee0	2025-10-24 16:53:31.634673+07	2025-10-31 16:53:31.634673+07	\N	\N	\N	\N
f310190a-d175-49e3-b2a5-e19adf16072c	22	$2a$11$EP2CaSFPaoDTrecc66Fatu.xxL4v3Ha8HRDXTOi6oaa6UkwflMQtC	0c51affd-e7dc-4e10-841b-5d5c677d6e24	2025-10-24 19:51:04.156034+07	2025-10-31 19:51:04.156202+07	\N	\N	\N	\N
8368295c-c558-4951-849a-a75cfb534062	22	$2a$11$zfq1FW7XWFF5meFwTJypVuixNJoEhGEdrNscZrOclJl3.S42/Bqgu	dfdf0bd2-b838-4b8e-86a6-d85c07158dcf	2025-10-24 20:12:36.342669+07	2025-10-31 20:12:36.34267+07	\N	\N	\N	\N
ea685677-aeca-481d-98e7-c9f6f8bdd595	22	$2a$11$j39kvkjqLd1nUOUh3I0/z.ZDGktRzA795O5BZgAXw.z.Uov36lu7S	a79353dc-9469-4678-bd8e-dacdf15a2172	2025-10-24 20:12:36.331937+07	2025-10-31 20:12:36.331982+07	\N	\N	\N	\N
\.


--
-- TOC entry 5170 (class 0 OID 18783)
-- Dependencies: 223
-- Data for Name: company; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company (company_id, name, hotline, email, address, tax_code, status, contact_account_id, created_at, updated_at, fax) FROM stdin;
4	RadioCabs TP.HCM	1900-5678	contact@radiocabs-hcm.com	456 Nguyễn Huệ, Quận 1, TP.HCM	0987654321	ACTIVE	\N	2025-10-22 14:03:47.956554+07	\N	028-9876543
1	RadioCabs Hà Nội	1900-1234	contact@radiocabs-hn.com	123 Lê Lợi, Hoàn Kiếm, Hà Nội	0123456789	ACTIVE	1	2025-10-22 14:03:47.956554+07	\N	024-1234567
2	Acme Taxi	1900-1234	contact@acme.taxi	123 Main St	0101234567	ACTIVE	2	-infinity	\N	
3	RadioCabs Đà Nẵng	1900-9999	contact@radiocabs-dn.com	789 Lê Duẩn, Hải Châu, Đà Nẵng	0555666777	ACTIVE	3	2025-10-22 14:03:47.956554+07	\N	0236-123456
\.


--
-- TOC entry 5195 (class 0 OID 19284)
-- Dependencies: 249
-- Data for Name: driver_schedule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.driver_schedule (schedule_id, driver_account_id, work_date, start_time, end_time, vehicle_id, status, note, created_at, updated_at) FROM stdin;
1	6	2024-01-15	06:00:00	18:00:00	1	PLANNED	Ca ngày thứ 2	2025-10-22 14:03:47.956554+07	\N
2	6	2024-01-16	06:00:00	18:00:00	1	PLANNED	Ca ngày thứ 3	2025-10-22 14:03:47.956554+07	\N
3	6	2024-01-17	06:00:00	18:00:00	1	ON	Ca ngày thứ 4 - Đang làm việc	2025-10-22 14:03:47.956554+07	\N
4	6	2024-01-18	06:00:00	18:00:00	1	PLANNED	Ca ngày thứ 5	2025-10-22 14:03:47.956554+07	\N
5	6	2024-01-19	06:00:00	18:00:00	1	PLANNED	Ca ngày thứ 6	2025-10-22 14:03:47.956554+07	\N
6	7	2024-01-13	08:00:00	20:00:00	2	COMPLETED	Ca cuối tuần thứ 7	2025-10-22 14:03:47.956554+07	\N
7	7	2024-01-14	08:00:00	20:00:00	2	COMPLETED	Ca cuối tuần chủ nhật	2025-10-22 14:03:47.956554+07	\N
8	7	2024-01-20	08:00:00	20:00:00	2	PLANNED	Ca cuối tuần thứ 7	2025-10-22 14:03:47.956554+07	\N
9	7	2024-01-21	08:00:00	20:00:00	2	PLANNED	Ca cuối tuần chủ nhật	2025-10-22 14:03:47.956554+07	\N
10	8	2024-01-15	07:00:00	19:00:00	6	PLANNED	Ca ngày thứ 2	2025-10-22 14:03:47.956554+07	\N
11	8	2024-01-16	07:00:00	19:00:00	6	PLANNED	Ca ngày thứ 3	2025-10-22 14:03:47.956554+07	\N
12	8	2024-01-17	07:00:00	19:00:00	6	ON	Ca ngày thứ 4 - Đang làm việc	2025-10-22 14:03:47.956554+07	\N
13	8	2024-01-18	07:00:00	19:00:00	6	PLANNED	Ca ngày thứ 5	2025-10-22 14:03:47.956554+07	\N
14	8	2024-01-19	07:00:00	19:00:00	6	PLANNED	Ca ngày thứ 6	2025-10-22 14:03:47.956554+07	\N
15	9	2024-01-13	09:00:00	21:00:00	7	COMPLETED	Ca cuối tuần thứ 7	2025-10-22 14:03:47.956554+07	\N
16	9	2024-01-14	09:00:00	21:00:00	7	COMPLETED	Ca cuối tuần chủ nhật	2025-10-22 14:03:47.956554+07	\N
17	9	2024-01-20	09:00:00	21:00:00	7	PLANNED	Ca cuối tuần thứ 7	2025-10-22 14:03:47.956554+07	\N
18	9	2024-01-21	09:00:00	21:00:00	7	PLANNED	Ca cuối tuần chủ nhật	2025-10-22 14:03:47.956554+07	\N
19	10	2024-01-15	06:30:00	18:30:00	10	PLANNED	Ca ngày thứ 2	2025-10-22 14:03:47.956554+07	\N
20	10	2024-01-16	06:30:00	18:30:00	10	PLANNED	Ca ngày thứ 3	2025-10-22 14:03:47.956554+07	\N
21	10	2024-01-17	06:30:00	18:30:00	10	ON	Ca ngày thứ 4 - Đang làm việc	2025-10-22 14:03:47.956554+07	\N
22	10	2024-01-18	06:30:00	18:30:00	10	PLANNED	Ca ngày thứ 5	2025-10-22 14:03:47.956554+07	\N
23	10	2024-01-19	06:30:00	18:30:00	10	PLANNED	Ca ngày thứ 6	2025-10-22 14:03:47.956554+07	\N
\.


--
-- TOC entry 5193 (class 0 OID 19262)
-- Dependencies: 247
-- Data for Name: driver_schedule_template; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.driver_schedule_template (template_id, driver_account_id, start_date, end_date, weekday, start_time, end_time, vehicle_id, note, is_active) FROM stdin;
1	6	2024-01-01	2024-12-31	1	06:00:00	18:00:00	1	Ca ngày thứ 2-6	t
2	6	2024-01-01	2024-12-31	2	06:00:00	18:00:00	1	Ca ngày thứ 2-6	t
3	6	2024-01-01	2024-12-31	3	06:00:00	18:00:00	1	Ca ngày thứ 2-6	t
4	6	2024-01-01	2024-12-31	4	06:00:00	18:00:00	1	Ca ngày thứ 2-6	t
5	6	2024-01-01	2024-12-31	5	06:00:00	18:00:00	1	Ca ngày thứ 2-6	t
6	7	2024-01-01	2024-12-31	0	08:00:00	20:00:00	2	Ca cuối tuần	t
7	7	2024-01-01	2024-12-31	6	08:00:00	20:00:00	2	Ca cuối tuần	t
8	8	2024-01-01	2024-12-31	1	07:00:00	19:00:00	6	Ca ngày thứ 2-6	t
9	8	2024-01-01	2024-12-31	2	07:00:00	19:00:00	6	Ca ngày thứ 2-6	t
10	8	2024-01-01	2024-12-31	3	07:00:00	19:00:00	6	Ca ngày thứ 2-6	t
11	8	2024-01-01	2024-12-31	4	07:00:00	19:00:00	6	Ca ngày thứ 2-6	t
12	8	2024-01-01	2024-12-31	5	07:00:00	19:00:00	6	Ca ngày thứ 2-6	t
13	9	2024-01-01	2024-12-31	0	09:00:00	21:00:00	7	Ca cuối tuần	t
14	9	2024-01-01	2024-12-31	6	09:00:00	21:00:00	7	Ca cuối tuần	t
15	10	2024-01-01	2024-12-31	1	06:30:00	18:30:00	10	Ca ngày thứ 2-6	t
16	10	2024-01-01	2024-12-31	2	06:30:00	18:30:00	10	Ca ngày thứ 2-6	t
17	10	2024-01-01	2024-12-31	3	06:30:00	18:30:00	10	Ca ngày thứ 2-6	t
18	10	2024-01-01	2024-12-31	4	06:30:00	18:30:00	10	Ca ngày thứ 2-6	t
19	10	2024-01-01	2024-12-31	5	06:30:00	18:30:00	10	Ca ngày thứ 2-6	t
\.


--
-- TOC entry 5182 (class 0 OID 18902)
-- Dependencies: 235
-- Data for Name: driver_vehicle_assignment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.driver_vehicle_assignment (assignment_id, driver_account_id, vehicle_id, start_at, end_at) FROM stdin;
1	6	1	2024-01-01 06:00:00+07	\N
2	7	2	2024-01-01 06:00:00+07	\N
3	8	6	2024-01-01 06:00:00+07	\N
4	9	7	2024-01-01 06:00:00+07	\N
5	10	10	2024-01-01 06:00:00+07	\N
6	6	3	2023-12-01 06:00:00+07	2023-12-31 18:00:00+07
7	7	4	2023-12-01 06:00:00+07	2023-12-31 18:00:00+07
\.


--
-- TOC entry 5191 (class 0 OID 19023)
-- Dependencies: 244
-- Data for Name: driving_order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.driving_order (order_id, company_id, customer_account_id, vehicle_id, driver_account_id, model_id, price_ref_id, from_province_id, to_province_id, pickup_address, dropoff_address, pickup_time, dropoff_time, status, total_km, inner_city_km, intercity_km, traffic_km, is_raining, wait_minutes, base_fare, traffic_unit_price, traffic_fee, rain_fee, intercity_unit_price, intercity_fee, other_fee, total_amount, fare_breakdown, payment_method, paid_at, created_at, updated_at) FROM stdin;
1	1	11	1	6	1	1	1	1	123 Lê Lợi, Hoàn Kiếm, Hà Nội	456 Nguyễn Huệ, Hai Bà Trưng, Hà Nội	2024-01-15 08:00:00+07	2024-01-15 08:30:00+07	DONE	8.50	8.50	0.00	2.00	f	5	15000.00	2000.00	4000.00	0.00	15000.00	0.00	0.00	19000.00	{"base_fare": 15000, "traffic_fee": 4000}	CASH	2024-01-15 08:35:00+07	2024-01-15 07:45:00+07	\N
2	1	12	2	7	2	3	1	1	789 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội	321 Cầu Giấy, Cầu Giấy, Hà Nội	2024-01-15 14:00:00+07	2024-01-15 14:45:00+07	ONGOING	15.20	15.20	0.00	3.50	t	0	18000.00	2500.00	8750.00	5000.00	16000.00	0.00	0.00	31750.00	{"rain_fee": 5000, "base_fare": 18000, "traffic_fee": 8750}	\N	\N	2024-01-15 13:30:00+07	\N
3	2	13	6	8	5	6	2	2	111 Nguyễn Huệ, Quận 1, TP.HCM	222 Lê Văn Việt, Quận 9, TP.HCM	2024-01-16 09:00:00+07	\N	ASSIGNED	25.80	25.80	0.00	5.20	f	0	16000.00	2200.00	11440.00	0.00	16000.00	0.00	0.00	27440.00	{"base_fare": 16000, "traffic_fee": 11440}	\N	\N	2024-01-16 08:30:00+07	\N
4	2	11	7	9	6	8	2	2	333 Điện Biên Phủ, Bình Thạnh, TP.HCM	444 Nguyễn Thị Thập, Quận 7, TP.HCM	2024-01-16 16:00:00+07	2024-01-16 16:50:00+07	DONE	18.70	18.70	0.00	4.10	f	10	19000.00	2700.00	11070.00	0.00	17000.00	0.00	0.00	30070.00	{"base_fare": 19000, "traffic_fee": 11070}	CARD	2024-01-16 17:00:00+07	2024-01-16 15:30:00+07	\N
5	3	12	10	10	8	10	3	3	555 Lê Duẩn, Hải Châu, Đà Nẵng	666 Ngũ Hành Sơn, Ngũ Hành Sơn, Đà Nẵng	2024-01-17 10:00:00+07	\N	NEW	12.30	12.30	0.00	2.80	f	0	14000.00	1800.00	5040.00	0.00	14000.00	0.00	0.00	19040.00	{"base_fare": 14000, "traffic_fee": 5040}	\N	\N	2024-01-17 09:30:00+07	\N
6	1	2	\N	\N	5	\N	1	2	updated	456 Đường XYZ, Quận 2, TP.HCM	2024-01-15 15:00:00+07	2025-10-22 19:40:15.666542+07	CANCELLED	12334.00	123132.00	233.00	2323.00	t	23	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	\N	CASH	\N	2025-10-22 19:34:42.642924+07	2025-10-22 19:41:43.771671+07
\.


--
-- TOC entry 5174 (class 0 OID 18820)
-- Dependencies: 227
-- Data for Name: membership_order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.membership_order (membership_order_id, company_id, payer_account_id, unit_months, unit_price, amount, start_date, end_date, paid_at, payment_method, note) FROM stdin;
1	1	11	12	500000.00	6000000.00	2024-01-01	2024-12-31	2024-01-01 10:00:00+07	BANK	Gói thành viên năm 2024
2	2	12	6	550000.00	3300000.00	2024-01-01	2024-06-30	2024-01-01 11:00:00+07	CARD	Gói thành viên 6 tháng
3	1	13	3	600000.00	1800000.00	2024-01-01	2024-03-31	2024-01-01 12:00:00+07	WALLET	Gói thành viên 3 tháng
4	3	11	1	700000.00	700000.00	2024-01-01	2024-01-31	2024-01-01 13:00:00+07	CASH	Gói thành viên tháng
5	2	12	12	480000.00	5760000.00	2024-01-01	2024-12-31	\N	\N	Gói thành viên năm - chưa thanh toán
\.


--
-- TOC entry 5189 (class 0 OID 18991)
-- Dependencies: 242
-- Data for Name: model_price_province; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.model_price_province (model_price_id, company_id, province_id, model_id, opening_fare, rate_first20_km, rate_over20_km, traffic_add_per_km, rain_add_per_trip, intercity_rate_per_km, time_start, time_end, parent_id, date_start, date_end, is_active, note) FROM stdin;
1	1	1	1	15000.00	12000.00	10000.00	2000.00	5000.00	15000.00	06:00:00	22:00:00	\N	2024-01-01	2024-12-31	t	Giá ban ngày
2	1	1	1	20000.00	15000.00	12000.00	3000.00	5000.00	18000.00	22:00:00	06:00:00	1	2024-01-01	2024-12-31	t	Giá ban đêm
3	1	1	2	18000.00	14000.00	11000.00	2500.00	5000.00	16000.00	06:00:00	22:00:00	\N	2024-01-01	2024-12-31	t	Giá Honda City
4	1	1	3	25000.00	18000.00	15000.00	3000.00	8000.00	20000.00	06:00:00	22:00:00	\N	2024-01-01	2024-12-31	t	Giá Camry
5	1	1	4	30000.00	20000.00	18000.00	3500.00	10000.00	25000.00	06:00:00	22:00:00	\N	2024-01-01	2024-12-31	t	Giá Innova
6	2	2	5	16000.00	13000.00	11000.00	2200.00	6000.00	16000.00	06:00:00	22:00:00	\N	2024-01-01	2024-12-31	t	Giá ban ngày
7	2	2	5	22000.00	16000.00	13000.00	3200.00	6000.00	19000.00	22:00:00	06:00:00	6	2024-01-01	2024-12-31	t	Giá ban đêm
8	2	2	6	19000.00	15000.00	12000.00	2700.00	6000.00	17000.00	06:00:00	22:00:00	\N	2024-01-01	2024-12-31	t	Giá Honda City
9	2	2	7	26000.00	19000.00	16000.00	3200.00	9000.00	21000.00	06:00:00	22:00:00	\N	2024-01-01	2024-12-31	t	Giá Camry
10	3	3	8	14000.00	11000.00	9000.00	1800.00	4000.00	14000.00	06:00:00	22:00:00	\N	2024-01-01	2024-12-31	t	Giá ban ngày
11	3	3	8	19000.00	14000.00	11000.00	2800.00	4000.00	17000.00	22:00:00	06:00:00	10	2024-01-01	2024-12-31	t	Giá ban đêm
12	3	3	9	17000.00	13000.00	10000.00	2300.00	4000.00	15000.00	06:00:00	22:00:00	\N	2024-01-01	2024-12-31	t	Giá Honda City
\.


--
-- TOC entry 5166 (class 0 OID 18760)
-- Dependencies: 219
-- Data for Name: province; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.province (province_id, code, name) FROM stdin;
1	HN	Hà Nội
2	HCM	Thành phố Hồ Chí Minh
3	DN	Đà Nẵng
4	HP	Hải Phòng
5	BD	Bình Dương
\.


--
-- TOC entry 5180 (class 0 OID 18880)
-- Dependencies: 233
-- Data for Name: vehicle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehicle (vehicle_id, company_id, model_id, plate_number, vin, color, year_manufactured, in_service_from, odometer_km, status) FROM stdin;
1	1	1	29A-12345	VIN1234567890	Trắng	2023	2023-01-01	15000	ACTIVE
2	1	1	29A-12346	VIN1234567891	Đen	2023	2023-01-15	12000	ACTIVE
3	1	2	29A-12347	VIN1234567892	Bạc	2023	2023-02-01	18000	ACTIVE
4	1	3	29A-12348	VIN1234567893	Trắng	2023	2023-02-15	10000	ACTIVE
5	1	4	29A-12349	VIN1234567894	Đen	2023	2023-03-01	8000	ACTIVE
6	2	5	51A-56789	VIN5678901234	Trắng	2023	2023-01-01	20000	ACTIVE
7	2	5	51A-56790	VIN5678901235	Đỏ	2023	2023-01-15	16000	ACTIVE
8	2	6	51A-56791	VIN5678901236	Bạc	2023	2023-02-01	14000	ACTIVE
9	2	7	51A-56792	VIN5678901237	Trắng	2023	2023-02-15	11000	ACTIVE
11	3	9	43A-99998	VIN9999999998	Đen	2023	2023-01-15	7500	ACTIVE
12	1	5	51A-67890	1HGBH41JXMN109186	Đen	2024	2024-01-01	1000	INACTIVE
10	3	8	43A-99999	VIN9999999999	Trắng	2023	2023-01-01	6969	ACTIVE
\.


--
-- TOC entry 5183 (class 0 OID 18923)
-- Dependencies: 236
-- Data for Name: vehicle_in_province; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehicle_in_province (vehicle_id, province_id, allowed, since_date) FROM stdin;
1	1	t	2023-01-01
2	1	t	2023-01-15
3	1	t	2023-02-01
4	1	t	2023-02-15
5	1	t	2023-03-01
6	2	t	2023-01-01
7	2	t	2023-01-15
8	2	t	2023-02-01
9	2	t	2023-02-15
10	3	t	2023-01-01
11	3	t	2023-01-15
\.


--
-- TOC entry 5178 (class 0 OID 18856)
-- Dependencies: 231
-- Data for Name: vehicle_model; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehicle_model (model_id, company_id, segment_id, brand, model_name, fuel_type, seat_category, image_url, description, is_active) FROM stdin;
1	1	1	Toyota	Vios	GASOLINE	SEDAN_5	https://example.com/vios.jpg	Xe sedan 4 chỗ, tiết kiệm nhiên liệu	t
2	1	1	Honda	City	GASOLINE	SEDAN_5	https://example.com/city.jpg	Xe sedan 4 chỗ, động cơ 1.5L	t
3	1	2	Toyota	Camry	GASOLINE	SEDAN_5	https://example.com/camry.jpg	Xe sedan cao cấp, động cơ 2.0L	t
4	1	3	Toyota	Innova	DIESEL	MPV_7	https://example.com/innova.jpg	Xe MPV 7 chỗ, phù hợp gia đình	t
5	2	4	Toyota	Vios	GASOLINE	SEDAN_5	https://example.com/vios.jpg	Xe sedan 4 chỗ, tiết kiệm nhiên liệu	t
6	2	4	Honda	City	GASOLINE	SEDAN_5	https://example.com/city.jpg	Xe sedan 4 chỗ, động cơ 1.5L	t
7	2	5	Toyota	Camry	GASOLINE	SEDAN_5	https://example.com/camry.jpg	Xe sedan cao cấp, động cơ 2.0L	t
8	3	6	Toyota	Vios	GASOLINE	SEDAN_5	https://example.com/vios.jpg	Xe sedan 4 chỗ, tiết kiệm nhiên liệu	t
9	3	6	Honda	City	GASOLINE	SEDAN_5	https://example.com/city.jpg	Xe sedan 4 chỗ, động cơ 1.5L	t
\.


--
-- TOC entry 5176 (class 0 OID 18841)
-- Dependencies: 229
-- Data for Name: vehicle_segment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehicle_segment (segment_id, company_id, code, name, description, is_active) FROM stdin;
1	1	ECONOMY	Hạng Phổ Thông	Xe 4-5 chỗ, tiết kiệm nhiên liệu	t
2	1	COMFORT	Hạng Tiện Nghi	Xe 4-5 chỗ, tiện nghi cao	t
3	1	PREMIUM	Hạng Cao Cấp	Xe 5-7 chỗ, cao cấp	t
4	2	ECONOMY	Hạng Phổ Thông	Xe 4-5 chỗ, tiết kiệm nhiên liệu	t
5	2	COMFORT	Hạng Tiện Nghi	Xe 4-5 chỗ, tiện nghi cao	t
6	3	ECONOMY	Hạng Phổ Thông	Xe 4-5 chỗ, tiết kiệm nhiên liệu	t
\.


--
-- TOC entry 5187 (class 0 OID 18974)
-- Dependencies: 240
-- Data for Name: vehicle_zone_preference; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehicle_zone_preference (vehicle_id, zone_id, priority) FROM stdin;
1	1	10
1	2	20
2	1	10
2	3	20
3	1	10
3	2	15
4	1	10
4	3	20
5	2	10
5	1	20
6	4	10
6	5	20
7	4	10
7	6	20
8	4	10
8	5	15
9	4	10
9	6	20
10	7	10
10	8	20
11	7	10
11	8	15
\.


--
-- TOC entry 5168 (class 0 OID 18769)
-- Dependencies: 221
-- Data for Name: ward; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ward (ward_id, province_id, code, name) FROM stdin;
1	1	001	Phường Phúc Xá
2	1	002	Phường Trúc Bạch
3	1	003	Phường Vĩnh Phú
4	1	004	Phường Cống Vị
5	1	005	Phường Liễu Giai
6	2	001	Phường Bến Nghé
7	2	002	Phường Bến Thành
8	2	003	Phường Cầu Kho
9	2	004	Phường Cầu Ông Lãnh
10	2	005	Phường Cô Giang
11	3	001	Phường An Hải Bắc
12	3	002	Phường An Hải Đông
13	3	003	Phường An Hải Tây
14	3	004	Phường Hòa Cường Bắc
15	3	005	Phường Hòa Cường Nam
\.


--
-- TOC entry 5185 (class 0 OID 18940)
-- Dependencies: 238
-- Data for Name: zone; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.zone (zone_id, company_id, province_id, code, name, description, is_active) FROM stdin;
1	1	1	HN_CENTER	Trung Tâm Hà Nội	Khu vực trung tâm thành phố	t
2	1	1	HN_AIRPORT	Sân Bay Nội Bài	Khu vực sân bay Nội Bài	t
3	1	1	HN_WEST	Tây Hà Nội	Khu vực phía Tây thành phố	t
4	2	2	HCM_CENTER	Trung Tâm TP.HCM	Khu vực trung tâm thành phố	t
5	2	2	HCM_AIRPORT	Sân Bay Tân Sơn Nhất	Khu vực sân bay Tân Sơn Nhất	t
6	2	2	HCM_EAST	Đông TP.HCM	Khu vực phía Đông thành phố	t
7	3	3	DN_CENTER	Trung Tâm Đà Nẵng	Khu vực trung tâm thành phố	t
8	3	3	DN_AIRPORT	Sân Bay Đà Nẵng	Khu vực sân bay Đà Nẵng	t
\.


--
-- TOC entry 5186 (class 0 OID 18959)
-- Dependencies: 239
-- Data for Name: zone_ward; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.zone_ward (zone_id, ward_id) FROM stdin;
1	1
1	2
1	3
2	4
2	5
3	1
3	3
4	6
4	7
4	8
5	9
5	10
6	6
6	8
7	11
7	12
7	13
8	14
8	15
\.


--
-- TOC entry 5220 (class 0 OID 0)
-- Dependencies: 224
-- Name: account_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.account_account_id_seq', 22, true);


--
-- TOC entry 5221 (class 0 OID 0)
-- Dependencies: 251
-- Name: auth_email_code_code_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_email_code_code_id_seq', 3, true);


--
-- TOC entry 5222 (class 0 OID 0)
-- Dependencies: 222
-- Name: company_company_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.company_company_id_seq', 5, true);


--
-- TOC entry 5223 (class 0 OID 0)
-- Dependencies: 248
-- Name: driver_schedule_schedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.driver_schedule_schedule_id_seq', 23, true);


--
-- TOC entry 5224 (class 0 OID 0)
-- Dependencies: 246
-- Name: driver_schedule_template_template_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.driver_schedule_template_template_id_seq', 19, true);


--
-- TOC entry 5225 (class 0 OID 0)
-- Dependencies: 234
-- Name: driver_vehicle_assignment_assignment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.driver_vehicle_assignment_assignment_id_seq', 7, true);


--
-- TOC entry 5226 (class 0 OID 0)
-- Dependencies: 243
-- Name: driving_order_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.driving_order_order_id_seq', 7, true);


--
-- TOC entry 5227 (class 0 OID 0)
-- Dependencies: 226
-- Name: membership_order_membership_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.membership_order_membership_order_id_seq', 5, true);


--
-- TOC entry 5228 (class 0 OID 0)
-- Dependencies: 241
-- Name: model_price_province_model_price_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.model_price_province_model_price_id_seq', 12, true);


--
-- TOC entry 5229 (class 0 OID 0)
-- Dependencies: 218
-- Name: province_province_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.province_province_id_seq', 5, true);


--
-- TOC entry 5230 (class 0 OID 0)
-- Dependencies: 230
-- Name: vehicle_model_model_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vehicle_model_model_id_seq', 13, true);


--
-- TOC entry 5231 (class 0 OID 0)
-- Dependencies: 228
-- Name: vehicle_segment_segment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vehicle_segment_segment_id_seq', 11, true);


--
-- TOC entry 5232 (class 0 OID 0)
-- Dependencies: 232
-- Name: vehicle_vehicle_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vehicle_vehicle_id_seq', 14, true);


--
-- TOC entry 5233 (class 0 OID 0)
-- Dependencies: 220
-- Name: ward_ward_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ward_ward_id_seq', 15, true);


--
-- TOC entry 5234 (class 0 OID 0)
-- Dependencies: 237
-- Name: zone_zone_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.zone_zone_id_seq', 8, true);


--
-- TOC entry 4924 (class 2606 OID 18805)
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (account_id);


--
-- TOC entry 4926 (class 2606 OID 18807)
-- Name: account account_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_username_key UNIQUE (username);


--
-- TOC entry 4979 (class 2606 OID 19332)
-- Name: auth_email_code auth_email_code_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_email_code
    ADD CONSTRAINT auth_email_code_pkey PRIMARY KEY (code_id);


--
-- TOC entry 4975 (class 2606 OID 19317)
-- Name: auth_refresh_session auth_refresh_session_jti_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_refresh_session
    ADD CONSTRAINT auth_refresh_session_jti_key UNIQUE (jti);


--
-- TOC entry 4977 (class 2606 OID 19315)
-- Name: auth_refresh_session auth_refresh_session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_refresh_session
    ADD CONSTRAINT auth_refresh_session_pkey PRIMARY KEY (session_id);


--
-- TOC entry 4921 (class 2606 OID 18792)
-- Name: company company_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT company_pkey PRIMARY KEY (company_id);


--
-- TOC entry 4971 (class 2606 OID 19292)
-- Name: driver_schedule driver_schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_schedule
    ADD CONSTRAINT driver_schedule_pkey PRIMARY KEY (schedule_id);


--
-- TOC entry 4968 (class 2606 OID 19271)
-- Name: driver_schedule_template driver_schedule_template_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_schedule_template
    ADD CONSTRAINT driver_schedule_template_pkey PRIMARY KEY (template_id);


--
-- TOC entry 4945 (class 2606 OID 18909)
-- Name: driver_vehicle_assignment driver_vehicle_assignment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_vehicle_assignment
    ADD CONSTRAINT driver_vehicle_assignment_pkey PRIMARY KEY (assignment_id);


--
-- TOC entry 4963 (class 2606 OID 19043)
-- Name: driving_order driving_order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driving_order
    ADD CONSTRAINT driving_order_pkey PRIMARY KEY (order_id);


--
-- TOC entry 4930 (class 2606 OID 18828)
-- Name: membership_order membership_order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membership_order
    ADD CONSTRAINT membership_order_pkey PRIMARY KEY (membership_order_id);


--
-- TOC entry 4961 (class 2606 OID 19000)
-- Name: model_price_province model_price_province_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.model_price_province
    ADD CONSTRAINT model_price_province_pkey PRIMARY KEY (model_price_id);


--
-- TOC entry 4913 (class 2606 OID 18767)
-- Name: province province_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.province
    ADD CONSTRAINT province_code_key UNIQUE (code);


--
-- TOC entry 4915 (class 2606 OID 18765)
-- Name: province province_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.province
    ADD CONSTRAINT province_pkey PRIMARY KEY (province_id);


--
-- TOC entry 4950 (class 2606 OID 18928)
-- Name: vehicle_in_province vehicle_in_province_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_in_province
    ADD CONSTRAINT vehicle_in_province_pkey PRIMARY KEY (vehicle_id, province_id);


--
-- TOC entry 4936 (class 2606 OID 18868)
-- Name: vehicle_model vehicle_model_company_id_brand_model_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_model
    ADD CONSTRAINT vehicle_model_company_id_brand_model_name_key UNIQUE (company_id, brand, model_name);


--
-- TOC entry 4938 (class 2606 OID 18866)
-- Name: vehicle_model vehicle_model_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_model
    ADD CONSTRAINT vehicle_model_pkey PRIMARY KEY (model_id);


--
-- TOC entry 4941 (class 2606 OID 18887)
-- Name: vehicle vehicle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle
    ADD CONSTRAINT vehicle_pkey PRIMARY KEY (vehicle_id);


--
-- TOC entry 4943 (class 2606 OID 18889)
-- Name: vehicle vehicle_plate_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle
    ADD CONSTRAINT vehicle_plate_number_key UNIQUE (plate_number);


--
-- TOC entry 4932 (class 2606 OID 18849)
-- Name: vehicle_segment vehicle_segment_company_id_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_segment
    ADD CONSTRAINT vehicle_segment_company_id_code_key UNIQUE (company_id, code);


--
-- TOC entry 4934 (class 2606 OID 18847)
-- Name: vehicle_segment vehicle_segment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_segment
    ADD CONSTRAINT vehicle_segment_pkey PRIMARY KEY (segment_id);


--
-- TOC entry 4958 (class 2606 OID 18979)
-- Name: vehicle_zone_preference vehicle_zone_preference_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_zone_preference
    ADD CONSTRAINT vehicle_zone_preference_pkey PRIMARY KEY (vehicle_id, zone_id);


--
-- TOC entry 4917 (class 2606 OID 18774)
-- Name: ward ward_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ward
    ADD CONSTRAINT ward_pkey PRIMARY KEY (ward_id);


--
-- TOC entry 4919 (class 2606 OID 18776)
-- Name: ward ward_province_id_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ward
    ADD CONSTRAINT ward_province_id_name_key UNIQUE (province_id, name);


--
-- TOC entry 4952 (class 2606 OID 18948)
-- Name: zone zone_company_id_province_id_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zone
    ADD CONSTRAINT zone_company_id_province_id_code_key UNIQUE (company_id, province_id, code);


--
-- TOC entry 4954 (class 2606 OID 18946)
-- Name: zone zone_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zone
    ADD CONSTRAINT zone_pkey PRIMARY KEY (zone_id);


--
-- TOC entry 4956 (class 2606 OID 18963)
-- Name: zone_ward zone_ward_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zone_ward
    ADD CONSTRAINT zone_ward_pkey PRIMARY KEY (zone_id, ward_id);


--
-- TOC entry 4927 (class 1259 OID 18813)
-- Name: ix_account_company_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_account_company_role ON public.account USING btree (company_id, role);


--
-- TOC entry 4922 (class 1259 OID 18793)
-- Name: ix_company_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_company_status ON public.company USING btree (status);


--
-- TOC entry 4972 (class 1259 OID 19304)
-- Name: ix_driver_schedule_lookup; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_driver_schedule_lookup ON public.driver_schedule USING btree (work_date, status, driver_account_id);


--
-- TOC entry 4969 (class 1259 OID 19282)
-- Name: ix_dst_driver_weekday; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_dst_driver_weekday ON public.driver_schedule_template USING btree (driver_account_id, weekday) WHERE (is_active = true);


--
-- TOC entry 4946 (class 1259 OID 18920)
-- Name: ix_dva_driver_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_dva_driver_time ON public.driver_vehicle_assignment USING btree (driver_account_id, start_at);


--
-- TOC entry 4947 (class 1259 OID 18921)
-- Name: ix_dva_vehicle_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_dva_vehicle_time ON public.driver_vehicle_assignment USING btree (vehicle_id, start_at);


--
-- TOC entry 4928 (class 1259 OID 18839)
-- Name: ix_membership_company; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_membership_company ON public.membership_order USING btree (company_id, start_date);


--
-- TOC entry 4959 (class 1259 OID 19021)
-- Name: ix_mpp_lookup; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_mpp_lookup ON public.model_price_province USING btree (company_id, province_id, model_id, is_active, date_start);


--
-- TOC entry 4964 (class 1259 OID 19084)
-- Name: ix_order_company_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_order_company_status ON public.driving_order USING btree (company_id, status, created_at);


--
-- TOC entry 4965 (class 1259 OID 19085)
-- Name: ix_order_driver_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_order_driver_time ON public.driving_order USING btree (driver_account_id, pickup_time);


--
-- TOC entry 4966 (class 1259 OID 19086)
-- Name: ix_order_route; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_order_route ON public.driving_order USING btree (from_province_id, to_province_id);


--
-- TOC entry 4939 (class 1259 OID 18900)
-- Name: ix_vehicle_company; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_vehicle_company ON public.vehicle USING btree (company_id);


--
-- TOC entry 4973 (class 1259 OID 19303)
-- Name: uq_driver_schedule_uni; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_driver_schedule_uni ON public.driver_schedule USING btree (driver_account_id, work_date, start_time, end_time);


--
-- TOC entry 4948 (class 1259 OID 18922)
-- Name: uq_dva_vehicle_open; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_dva_vehicle_open ON public.driver_vehicle_assignment USING btree (vehicle_id) WHERE (end_at IS NULL);


--
-- TOC entry 4980 (class 1259 OID 19338)
-- Name: uq_email_code_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_email_code_active ON public.auth_email_code USING btree (email, purpose) WHERE (consumed_at IS NULL);


--
-- TOC entry 4983 (class 2606 OID 18808)
-- Name: account account_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(company_id) ON DELETE SET NULL;


--
-- TOC entry 5018 (class 2606 OID 19333)
-- Name: auth_email_code auth_email_code_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_email_code
    ADD CONSTRAINT auth_email_code_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account(account_id) ON DELETE SET NULL;


--
-- TOC entry 5017 (class 2606 OID 19318)
-- Name: auth_refresh_session auth_refresh_session_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_refresh_session
    ADD CONSTRAINT auth_refresh_session_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account(account_id) ON DELETE CASCADE;


--
-- TOC entry 5015 (class 2606 OID 19293)
-- Name: driver_schedule driver_schedule_driver_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_schedule
    ADD CONSTRAINT driver_schedule_driver_account_id_fkey FOREIGN KEY (driver_account_id) REFERENCES public.account(account_id) ON DELETE CASCADE;


--
-- TOC entry 5013 (class 2606 OID 19272)
-- Name: driver_schedule_template driver_schedule_template_driver_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_schedule_template
    ADD CONSTRAINT driver_schedule_template_driver_account_id_fkey FOREIGN KEY (driver_account_id) REFERENCES public.account(account_id) ON DELETE CASCADE;


--
-- TOC entry 5014 (class 2606 OID 19277)
-- Name: driver_schedule_template driver_schedule_template_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_schedule_template
    ADD CONSTRAINT driver_schedule_template_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicle(vehicle_id) ON DELETE SET NULL;


--
-- TOC entry 5016 (class 2606 OID 19298)
-- Name: driver_schedule driver_schedule_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_schedule
    ADD CONSTRAINT driver_schedule_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicle(vehicle_id) ON DELETE SET NULL;


--
-- TOC entry 4991 (class 2606 OID 18910)
-- Name: driver_vehicle_assignment driver_vehicle_assignment_driver_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_vehicle_assignment
    ADD CONSTRAINT driver_vehicle_assignment_driver_account_id_fkey FOREIGN KEY (driver_account_id) REFERENCES public.account(account_id) ON DELETE CASCADE;


--
-- TOC entry 4992 (class 2606 OID 18915)
-- Name: driver_vehicle_assignment driver_vehicle_assignment_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_vehicle_assignment
    ADD CONSTRAINT driver_vehicle_assignment_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicle(vehicle_id) ON DELETE CASCADE;


--
-- TOC entry 5005 (class 2606 OID 19044)
-- Name: driving_order driving_order_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driving_order
    ADD CONSTRAINT driving_order_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(company_id) ON DELETE CASCADE;


--
-- TOC entry 5006 (class 2606 OID 19049)
-- Name: driving_order driving_order_customer_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driving_order
    ADD CONSTRAINT driving_order_customer_account_id_fkey FOREIGN KEY (customer_account_id) REFERENCES public.account(account_id) ON DELETE SET NULL;


--
-- TOC entry 5007 (class 2606 OID 19059)
-- Name: driving_order driving_order_driver_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driving_order
    ADD CONSTRAINT driving_order_driver_account_id_fkey FOREIGN KEY (driver_account_id) REFERENCES public.account(account_id) ON DELETE SET NULL;


--
-- TOC entry 5008 (class 2606 OID 19074)
-- Name: driving_order driving_order_from_province_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driving_order
    ADD CONSTRAINT driving_order_from_province_id_fkey FOREIGN KEY (from_province_id) REFERENCES public.province(province_id) ON DELETE RESTRICT;


--
-- TOC entry 5009 (class 2606 OID 19064)
-- Name: driving_order driving_order_model_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driving_order
    ADD CONSTRAINT driving_order_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.vehicle_model(model_id) ON DELETE RESTRICT;


--
-- TOC entry 5010 (class 2606 OID 19069)
-- Name: driving_order driving_order_price_ref_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driving_order
    ADD CONSTRAINT driving_order_price_ref_id_fkey FOREIGN KEY (price_ref_id) REFERENCES public.model_price_province(model_price_id) ON DELETE SET NULL;


--
-- TOC entry 5011 (class 2606 OID 19079)
-- Name: driving_order driving_order_to_province_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driving_order
    ADD CONSTRAINT driving_order_to_province_id_fkey FOREIGN KEY (to_province_id) REFERENCES public.province(province_id) ON DELETE RESTRICT;


--
-- TOC entry 5012 (class 2606 OID 19054)
-- Name: driving_order driving_order_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driving_order
    ADD CONSTRAINT driving_order_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicle(vehicle_id) ON DELETE SET NULL;


--
-- TOC entry 4982 (class 2606 OID 18814)
-- Name: company fk_company_contact_account; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT fk_company_contact_account FOREIGN KEY (contact_account_id) REFERENCES public.account(account_id) ON DELETE SET NULL;


--
-- TOC entry 4984 (class 2606 OID 18829)
-- Name: membership_order membership_order_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membership_order
    ADD CONSTRAINT membership_order_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(company_id) ON DELETE CASCADE;


--
-- TOC entry 4985 (class 2606 OID 18834)
-- Name: membership_order membership_order_payer_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membership_order
    ADD CONSTRAINT membership_order_payer_account_id_fkey FOREIGN KEY (payer_account_id) REFERENCES public.account(account_id) ON DELETE RESTRICT;


--
-- TOC entry 5001 (class 2606 OID 19001)
-- Name: model_price_province model_price_province_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.model_price_province
    ADD CONSTRAINT model_price_province_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(company_id) ON DELETE CASCADE;


--
-- TOC entry 5002 (class 2606 OID 19011)
-- Name: model_price_province model_price_province_model_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.model_price_province
    ADD CONSTRAINT model_price_province_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.vehicle_model(model_id) ON DELETE CASCADE;


--
-- TOC entry 5003 (class 2606 OID 19016)
-- Name: model_price_province model_price_province_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.model_price_province
    ADD CONSTRAINT model_price_province_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.model_price_province(model_price_id) ON DELETE SET NULL;


--
-- TOC entry 5004 (class 2606 OID 19006)
-- Name: model_price_province model_price_province_province_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.model_price_province
    ADD CONSTRAINT model_price_province_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.province(province_id) ON DELETE RESTRICT;


--
-- TOC entry 4989 (class 2606 OID 18890)
-- Name: vehicle vehicle_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle
    ADD CONSTRAINT vehicle_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(company_id) ON DELETE CASCADE;


--
-- TOC entry 4993 (class 2606 OID 18934)
-- Name: vehicle_in_province vehicle_in_province_province_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_in_province
    ADD CONSTRAINT vehicle_in_province_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.province(province_id) ON DELETE CASCADE;


--
-- TOC entry 4994 (class 2606 OID 18929)
-- Name: vehicle_in_province vehicle_in_province_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_in_province
    ADD CONSTRAINT vehicle_in_province_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicle(vehicle_id) ON DELETE CASCADE;


--
-- TOC entry 4987 (class 2606 OID 18869)
-- Name: vehicle_model vehicle_model_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_model
    ADD CONSTRAINT vehicle_model_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(company_id) ON DELETE CASCADE;


--
-- TOC entry 4990 (class 2606 OID 18895)
-- Name: vehicle vehicle_model_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle
    ADD CONSTRAINT vehicle_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.vehicle_model(model_id) ON DELETE RESTRICT;


--
-- TOC entry 4988 (class 2606 OID 18874)
-- Name: vehicle_model vehicle_model_segment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_model
    ADD CONSTRAINT vehicle_model_segment_id_fkey FOREIGN KEY (segment_id) REFERENCES public.vehicle_segment(segment_id) ON DELETE SET NULL;


--
-- TOC entry 4986 (class 2606 OID 18850)
-- Name: vehicle_segment vehicle_segment_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_segment
    ADD CONSTRAINT vehicle_segment_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(company_id) ON DELETE CASCADE;


--
-- TOC entry 4999 (class 2606 OID 18980)
-- Name: vehicle_zone_preference vehicle_zone_preference_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_zone_preference
    ADD CONSTRAINT vehicle_zone_preference_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicle(vehicle_id) ON DELETE CASCADE;


--
-- TOC entry 5000 (class 2606 OID 18985)
-- Name: vehicle_zone_preference vehicle_zone_preference_zone_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_zone_preference
    ADD CONSTRAINT vehicle_zone_preference_zone_id_fkey FOREIGN KEY (zone_id) REFERENCES public.zone(zone_id) ON DELETE CASCADE;


--
-- TOC entry 4981 (class 2606 OID 18777)
-- Name: ward ward_province_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ward
    ADD CONSTRAINT ward_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.province(province_id) ON DELETE RESTRICT;


--
-- TOC entry 4995 (class 2606 OID 18949)
-- Name: zone zone_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zone
    ADD CONSTRAINT zone_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(company_id) ON DELETE CASCADE;


--
-- TOC entry 4996 (class 2606 OID 18954)
-- Name: zone zone_province_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zone
    ADD CONSTRAINT zone_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.province(province_id) ON DELETE RESTRICT;


--
-- TOC entry 4997 (class 2606 OID 18969)
-- Name: zone_ward zone_ward_ward_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zone_ward
    ADD CONSTRAINT zone_ward_ward_id_fkey FOREIGN KEY (ward_id) REFERENCES public.ward(ward_id) ON DELETE CASCADE;


--
-- TOC entry 4998 (class 2606 OID 18964)
-- Name: zone_ward zone_ward_zone_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zone_ward
    ADD CONSTRAINT zone_ward_zone_id_fkey FOREIGN KEY (zone_id) REFERENCES public.zone(zone_id) ON DELETE CASCADE;


-- Completed on 2025-10-24 20:20:24

--
-- PostgreSQL database dump complete
--

