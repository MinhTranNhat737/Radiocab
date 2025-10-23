--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-10-13 23:12:44

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
-- TOC entry 5170 (class 0 OID 0)
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
-- TOC entry 5171 (class 0 OID 0)
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
-- TOC entry 5172 (class 0 OID 0)
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
    contact_account_id bigint NOT NULL,
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
-- TOC entry 5173 (class 0 OID 0)
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
-- TOC entry 5174 (class 0 OID 0)
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
-- TOC entry 5175 (class 0 OID 0)
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
-- TOC entry 5176 (class 0 OID 0)
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
-- TOC entry 5177 (class 0 OID 0)
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
-- TOC entry 5178 (class 0 OID 0)
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
-- TOC entry 5179 (class 0 OID 0)
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
-- TOC entry 5180 (class 0 OID 0)
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
-- TOC entry 5181 (class 0 OID 0)
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
-- TOC entry 5182 (class 0 OID 0)
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
-- TOC entry 5183 (class 0 OID 0)
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
-- TOC entry 5184 (class 0 OID 0)
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
-- TOC entry 5185 (class 0 OID 0)
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


-- Completed on 2025-10-13 23:12:44

--
-- PostgreSQL database dump complete
--

