--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-10-31 21:37:57

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
-- TOC entry 5226 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 923 (class 1247 OID 18708)
-- Name: active_flag; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.active_flag AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'NEW',
    'REFUSED'
);


ALTER TYPE public.active_flag OWNER TO postgres;

--
-- TOC entry 932 (class 1247 OID 18738)
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
-- TOC entry 926 (class 1247 OID 18714)
-- Name: order_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_status AS ENUM (
    'NEW',
    'ASSIGNED',
    'ACCEPTED',
    'ONGOING',
    'DONE',
    'CANCELLED',
    'FAILED'
);


ALTER TYPE public.order_status OWNER TO postgres;

--
-- TOC entry 929 (class 1247 OID 18728)
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
-- TOC entry 989 (class 1247 OID 19140)
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
-- TOC entry 920 (class 1247 OID 18695)
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
-- TOC entry 992 (class 1247 OID 19251)
-- Name: shift_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.shift_status AS ENUM (
    'PLANNED',
    'ON',
    'WORKING',
    'OFF',
    'CANCELLED',
    'COMPLETED'
);


ALTER TYPE public.shift_status OWNER TO postgres;

--
-- TOC entry 935 (class 1247 OID 18748)
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
-- TOC entry 986 (class 1247 OID 19130)
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
-- TOC entry 291 (class 1255 OID 19305)
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
-- TOC entry 5227 (class 0 OID 0)
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
-- TOC entry 5228 (class 0 OID 0)
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
    fax character varying NOT NULL,
    url_page character varying
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
-- TOC entry 5229 (class 0 OID 0)
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
-- TOC entry 5230 (class 0 OID 0)
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
-- TOC entry 5231 (class 0 OID 0)
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
-- TOC entry 5232 (class 0 OID 0)
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
    price_ref_id bigint NOT NULL,
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
    updated_at timestamp with time zone,
    driver_schedule_id bigint
);


ALTER TABLE public.driving_order OWNER TO postgres;

--
-- TOC entry 5233 (class 0 OID 0)
-- Dependencies: 244
-- Name: COLUMN driving_order.price_ref_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.driving_order.price_ref_id IS 'Tham chiếu đến bảng model_price_province để lấy thông tin giá cước';


--
-- TOC entry 5234 (class 0 OID 0)
-- Dependencies: 244
-- Name: COLUMN driving_order.driver_schedule_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.driving_order.driver_schedule_id IS 'Tham chiếu đến bảng driver_schedule để liên kết đơn hàng với ca làm việc của tài xế';


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
-- TOC entry 5235 (class 0 OID 0)
-- Dependencies: 243
-- Name: driving_order_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.driving_order_order_id_seq OWNED BY public.driving_order.order_id;


--
-- TOC entry 253 (class 1259 OID 19363)
-- Name: membership; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.membership (
    membership_id bigint NOT NULL,
    company_id bigint NOT NULL,
    name character varying(100) NOT NULL,
    code character varying(50) NOT NULL,
    unit_price numeric(12,2) NOT NULL,
    description character varying(500),
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    status boolean DEFAULT true NOT NULL,
    CONSTRAINT membership_unit_price_check CHECK ((unit_price >= (0)::numeric))
);


ALTER TABLE public.membership OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 19371)
-- Name: membership_membership_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.membership_membership_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.membership_membership_id_seq OWNER TO postgres;

--
-- TOC entry 5236 (class 0 OID 0)
-- Dependencies: 254
-- Name: membership_membership_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.membership_membership_id_seq OWNED BY public.membership.membership_id;


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
    membership_id bigint,
    payment_code character varying(50),
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
-- TOC entry 5237 (class 0 OID 0)
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
-- TOC entry 5238 (class 0 OID 0)
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
-- TOC entry 5239 (class 0 OID 0)
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
-- TOC entry 5240 (class 0 OID 0)
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
-- TOC entry 5241 (class 0 OID 0)
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
-- TOC entry 5242 (class 0 OID 0)
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
-- TOC entry 5243 (class 0 OID 0)
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
-- TOC entry 5244 (class 0 OID 0)
-- Dependencies: 237
-- Name: zone_zone_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.zone_zone_id_seq OWNED BY public.zone.zone_id;


--
-- TOC entry 4860 (class 2604 OID 18798)
-- Name: account account_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account ALTER COLUMN account_id SET DEFAULT nextval('public.account_account_id_seq'::regclass);


--
-- TOC entry 4905 (class 2604 OID 19327)
-- Name: auth_email_code code_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_email_code ALTER COLUMN code_id SET DEFAULT nextval('public.auth_email_code_code_id_seq'::regclass);


--
-- TOC entry 4857 (class 2604 OID 18786)
-- Name: company company_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company ALTER COLUMN company_id SET DEFAULT nextval('public.company_company_id_seq'::regclass);


--
-- TOC entry 4900 (class 2604 OID 19287)
-- Name: driver_schedule schedule_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_schedule ALTER COLUMN schedule_id SET DEFAULT nextval('public.driver_schedule_schedule_id_seq'::regclass);


--
-- TOC entry 4898 (class 2604 OID 19265)
-- Name: driver_schedule_template template_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_schedule_template ALTER COLUMN template_id SET DEFAULT nextval('public.driver_schedule_template_template_id_seq'::regclass);


--
-- TOC entry 4874 (class 2604 OID 18905)
-- Name: driver_vehicle_assignment assignment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_vehicle_assignment ALTER COLUMN assignment_id SET DEFAULT nextval('public.driver_vehicle_assignment_assignment_id_seq'::regclass);


--
-- TOC entry 4884 (class 2604 OID 19026)
-- Name: driving_order order_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driving_order ALTER COLUMN order_id SET DEFAULT nextval('public.driving_order_order_id_seq'::regclass);


--
-- TOC entry 4909 (class 2604 OID 19372)
-- Name: membership membership_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membership ALTER COLUMN membership_id SET DEFAULT nextval('public.membership_membership_id_seq'::regclass);


--
-- TOC entry 4864 (class 2604 OID 18823)
-- Name: membership_order membership_order_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membership_order ALTER COLUMN membership_order_id SET DEFAULT nextval('public.membership_order_membership_order_id_seq'::regclass);


--
-- TOC entry 4879 (class 2604 OID 18994)
-- Name: model_price_province model_price_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.model_price_province ALTER COLUMN model_price_id SET DEFAULT nextval('public.model_price_province_model_price_id_seq'::regclass);


--
-- TOC entry 4855 (class 2604 OID 18763)
-- Name: province province_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.province ALTER COLUMN province_id SET DEFAULT nextval('public.province_province_id_seq'::regclass);


--
-- TOC entry 4871 (class 2604 OID 18883)
-- Name: vehicle vehicle_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle ALTER COLUMN vehicle_id SET DEFAULT nextval('public.vehicle_vehicle_id_seq'::regclass);


--
-- TOC entry 4867 (class 2604 OID 18859)
-- Name: vehicle_model model_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_model ALTER COLUMN model_id SET DEFAULT nextval('public.vehicle_model_model_id_seq'::regclass);


--
-- TOC entry 4865 (class 2604 OID 18844)
-- Name: vehicle_segment segment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_segment ALTER COLUMN segment_id SET DEFAULT nextval('public.vehicle_segment_segment_id_seq'::regclass);


--
-- TOC entry 4856 (class 2604 OID 18772)
-- Name: ward ward_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ward ALTER COLUMN ward_id SET DEFAULT nextval('public.ward_ward_id_seq'::regclass);


--
-- TOC entry 4876 (class 2604 OID 18943)
-- Name: zone zone_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zone ALTER COLUMN zone_id SET DEFAULT nextval('public.zone_zone_id_seq'::regclass);


--
-- TOC entry 5192 (class 0 OID 18795)
-- Dependencies: 225
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account (account_id, company_id, username, password_hash, full_name, phone, email, role, status, created_at, updated_at, email_verified_at) FROM stdin;
1	1	admin.hn	$2a$10$hash1	Nguyễn Văn Admin HN	0901234567	admin.hn@radiocabs.com	ADMIN	ACTIVE	2025-10-22 14:03:47.956554+07	\N	2025-10-22 14:03:47.956554+07
2	2	admin.hcm	$2a$10$hash2	Trần Thị Admin HCM	0907654321	admin.hcm@radiocabs.com	ADMIN	ACTIVE	2025-10-22 14:03:47.956554+07	\N	2025-10-22 14:03:47.956554+07
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
22	3	22	$2a$11$1lnXJFX/LqzoymEol3XQq.koID41l9sMi4FOJx4gDFxrPKbA9e77e	string	string	string	MANAGER	ACTIVE	2025-10-23 22:36:47.523537+07	\N	\N
23	3	driver006	$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	Nguyen Van F	0967890123	driver006@radiocabs-hn.com	DRIVER	ACTIVE	2025-10-24 20:23:59.550485+07	\N	2025-10-24 20:23:59.550485+07
24	3	driver007	$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	Tran Thi G	0978901234	driver007@radiocabs-hn.com	DRIVER	ACTIVE	2025-10-24 20:23:59.550485+07	\N	2025-10-24 20:23:59.550485+07
25	3	driver008	$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	Le Van H	0989012345	driver008@radiocabs-hcm.com	DRIVER	ACTIVE	2025-10-24 20:23:59.550485+07	\N	2025-10-24 20:23:59.550485+07
3	3	admin.dn	$2a$10$hash3	Lê Văn Admin DN	0909876543	admin.dn@radiocabs.com	DISPATCHER	INACTIVE	2025-10-22 14:03:47.956554+07	2025-10-26 12:45:46.163343+07	2025-10-22 14:03:47.956554+07
26	3	aa	$2a$11$1n/8HILgrThkSMKXBNHHBOZR6ofea5.2VPjNssM5wpEuYgLoZVw12	aa	090876558	aa@gmail.com	DISPATCHER	INACTIVE	2025-10-26 13:37:38.572908+07	2025-10-26 13:38:08.427254+07	\N
27	3	cc	$2a$11$HwQQwtw/ghGr/LtenjPt6uBqZ6mUtUXmMV0u0NJmpp44k5thdzAeu	cc	0987645378	cc@gmail.com	DRIVER	ACTIVE	2025-10-27 14:40:10.116802+07	\N	\N
28	3	12	$2a$11$bxr52ZbpsVXmehyJ1b0couizJ83k5n3ayMSSBJpx73hX35p9dkUiG	12	098765930	12@gmail.com	DISPATCHER	ACTIVE	2025-10-27 14:56:03.418732+07	\N	\N
29	3	21	$2a$11$jyKU/yOfvtrnKZ18V7Oase70q0c2P6g2G.R2roL7AxvxOa5HuyqdK	21	0934857223	21@gmail.com	ACCOUNTANT	ACTIVE	2025-10-27 14:59:26.654718+07	\N	\N
17	\N	2	$2a$11$l4McTioNp9VVNKFUIiGTHetLdhXeU1AZovPetkfY55SfIUod6xtuu	string	string	string	MANAGER	ACTIVE	2025-10-23 22:02:57.659396+07	\N	\N
20	\N	5	$2a$11$rkm0Pwg43p.21ZaX4Og6tOqXqUaSzB2plzeuWinOqpzW9B7ChNZq6	string	string	string	ACCOUNTANT	ACTIVE	2025-10-23 22:07:25.799809+07	\N	\N
19	\N	4	$2a$11$T6biOX3oT8EzD1cLBG1HeehKTTe.YVTJICoan1yrw7sRT5SJ1rp2W	string	string	string	DISPATCHER	ACTIVE	2025-10-23 22:06:55.479862+07	\N	\N
18	\N	3	$2a$11$G.5XBOOeNFVr7tV7NQVtLuIc2Pa7ErMDaqj6txfE/tUxjLo/S6YRG	string	string	string	DRIVER	ACTIVE	2025-10-23 22:05:31.404115+07	\N	\N
30	11	23	$2a$11$Xq1vqc3CGxktRXNN/joAReXug6NrreW8Vi8SB6HNskOfDeSEZnQ72	23	0923465782	23@gmail.com	MANAGER	ACTIVE	2025-10-27 15:10:18.511771+07	2025-10-31 20:14:17.576633+07	\N
31	\N	33	$2a$11$Nb1XcT/k/lTpDWua.X/HT.l9UvICvvuyvSnLm330ZNnMX2F0Smx62	33	0987685904	33@gmail.com	CUSTOMER	ACTIVE	2025-10-31 20:33:26.133729+07	\N	\N
\.


--
-- TOC entry 5218 (class 0 OID 19324)
-- Dependencies: 252
-- Data for Name: auth_email_code; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_email_code (code_id, account_id, email, purpose, code_hash, sent_at, expires_at, consumed_at, attempt_count, max_attempts) FROM stdin;
1	11	customer001@gmail.com	SIGNUP	$2a$10$verification_hash_1	2024-01-15 10:00:00+07	2024-01-15 11:00:00+07	2024-01-15 10:05:00+07	1	5
2	12	customer002@gmail.com	PASSWORD_RESET	$2a$10$verification_hash_2	2024-01-15 14:00:00+07	2024-01-15 15:00:00+07	\N	0	5
3	13	customer003@gmail.com	EMAIL_CHANGE	$2a$10$verification_hash_3	2024-01-16 09:00:00+07	2024-01-16 10:00:00+07	\N	0	5
\.


--
-- TOC entry 5216 (class 0 OID 19307)
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
43541267-0a2a-4746-9eda-9224fe58a6c9	22	$2a$11$sqn9fjPlIh20lwiujfKbHu0CqLbpjatAxiSYATxONlIiFmBTaqGDe	b5dfeb56-624c-4d41-a72f-a71f0b3b0c62	2025-10-24 21:02:25.465571+07	2025-10-31 21:02:25.465584+07	\N	\N	\N	\N
62348dbb-df27-4372-9a3b-1109bfedd8e4	22	$2a$11$J8bct6gUMymZoRWmKGN1AuzphVWqIHfcjyRG64BZPsL/1ltK9Lu3C	87040c14-439d-4f96-a151-8628563847d9	2025-10-25 20:23:07.867931+07	2025-11-01 20:23:07.867943+07	\N	\N	\N	\N
265bb1ed-2687-4a4f-872a-ec592ef9199c	18	$2a$11$yuqWIdDdUb4tC8ns/tVoZeQlXIyLfXHn87QEY0gRQILY7.gBkfBTC	fd0aa865-d62f-4f76-8741-2e92631d75c9	2025-10-27 13:01:07.812184+07	2025-11-03 13:01:07.812199+07	\N	\N	\N	\N
2112a936-57a0-4395-b35d-cc6167d6c419	22	$2a$11$h4MjKNEy9UqE4sa6Zrds/.NNIonGplOI53kzyXwGW.3OFbgCjHGXq	2a34b851-f703-400c-a3bd-b99c1655ac55	2025-10-27 13:26:19.794679+07	2025-11-03 13:26:19.794691+07	\N	\N	\N	\N
56d20163-719f-47d1-9f25-11ba2a322940	22	$2a$11$16pKEAAlGi6sPcPFrn2uZOJSbJucz8zYtrcodEIIPr384AA1qDF9G	4a39db33-4b2c-4ccf-916a-c2deb8607937	2025-10-27 14:39:18.302685+07	2025-11-03 14:39:18.302699+07	\N	\N	\N	\N
84e29c5b-b1f6-41e0-b36a-4a0368586256	22	$2a$11$Z/feOqZdz/h1A39yOo1ZT.i.spWb6poGA5JJWrRVm3Qo330U4gkei	a655d81e-daa2-4207-832d-0886478853e9	2025-10-27 14:39:45.527581+07	2025-11-03 14:39:45.527581+07	\N	\N	\N	\N
4557e229-b4ed-456a-a924-2c8492cf9cf0	27	$2a$11$9fa8gFRYdr.D8LSp7s62tOrEbzMJhDuodNAWx3L0OWhw372zEIjjS	27d83fbc-54ed-42d8-a62c-e9265a41dd7f	2025-10-27 14:42:06.466086+07	2025-11-03 14:42:06.466087+07	\N	\N	\N	\N
ccf48a14-e45e-4b4f-b336-2b0130661b8d	27	$2a$11$EHWbjHPzpJF5NmYDj/QnWOUzxdYqWAg4bR2CxGekzMNuwceVYGoQm	cdc2e6e2-d51a-4685-9738-e5db1775a9da	2025-10-27 14:42:07.037813+07	2025-11-03 14:42:07.037814+07	\N	\N	\N	\N
382fefdc-0cc7-495a-a3a8-efdcc55351f5	22	$2a$11$DlUIVZ7W2/e0OWd9w4s35OjKVtA8HsPmBZYq2anXzm3E/mb02SURm	fc4008ce-d491-4fd3-baa2-cd7c61a21605	2025-10-27 14:48:26.963884+07	2025-11-03 14:48:26.963885+07	\N	\N	\N	\N
95efa66a-91c0-4ea2-a84d-dd04dc359c82	28	$2a$11$Kwvhh2VPL0iiDeB4NyMZ2OpmwDMmGqmgcLNcVhvUK0oOBIT/9ShQ2	2f26b233-f1bd-4fb6-bcc8-c0d1128b681a	2025-10-27 14:56:11.180283+07	2025-11-03 14:56:11.180283+07	\N	\N	\N	\N
fabb31d7-043b-4c0e-8ccf-074df7405edf	22	$2a$11$QdYsVeJ8OjT64KZchjjJKe55kO4smzZa0aQ9CuaPP9XnWjhA5CfOm	a1537a53-6b90-4e96-a04a-ee153a2a790f	2025-10-27 14:59:03.441353+07	2025-11-03 14:59:03.441354+07	\N	\N	\N	\N
17ac1beb-2e6b-42b9-8934-2b545232f9a4	29	$2a$11$r9lGtgMOj2LWrgI1oSeiEuys4GdVfYCaU5GbN007Xcw3LzuTMwFee	3f93f926-a2b6-4184-bfb6-bc0137466419	2025-10-27 14:59:33.939789+07	2025-11-03 14:59:33.93979+07	\N	\N	\N	\N
afa06c86-817c-45f9-93d3-961cbb2c00de	22	$2a$11$zuegq7TDZxX40MOsfVrrLuKJZVEqm87oHlG6tu2wika8Iwn0xpHJO	13d17a06-f1ab-4c88-a7f7-2eb2827621c7	2025-10-27 15:04:39.582572+07	2025-11-03 15:04:39.582573+07	\N	\N	\N	\N
c6758d21-f67d-4ed8-bff1-06cb91c815f2	30	$2a$11$cEFWM3bprQjY2VOUMzbhku3lMiMeMwCPtiJWqh0u7rQcAvN4D7H0e	f99dafda-a387-414b-a609-140ca9cd13bc	2025-10-27 15:10:23.866459+07	2025-11-03 15:10:23.86646+07	\N	\N	\N	\N
f82a618e-d821-4164-8ac3-8e7652a2abfc	22	$2a$11$GptZuTiGjY.ZhxuBzxzvLebh7J4XeCML27.d761Ny/RqGTeGuJmq.	93d24f86-327d-46e3-af44-ec6e9f32536c	2025-10-27 15:37:27.144176+07	2025-11-03 15:37:27.144205+07	\N	\N	\N	\N
55e6b882-5939-4397-bd16-87570ce57003	22	$2a$11$xCv9EjH4ceUPUiVYd/nkp.tqGFZlhQLCkhe.1.zq2h5gyAMDaRTRS	b133858b-91c7-41ee-bb8a-a0d5c1ac146e	2025-10-27 15:38:00.452919+07	2025-11-03 15:38:00.452919+07	\N	\N	\N	\N
ba112f7a-7f31-4d4b-a5a2-eb2ce27a7f4f	22	$2a$11$c3V/ngG1xzZwv5c/qvkQ1.0.S2tGGtnB7uDVwChSJC.jCJQcphfMW	fbef3acf-b43a-435c-b1ba-4c33f390f3bc	2025-10-27 15:43:58.238063+07	2025-11-03 15:43:58.238079+07	\N	\N	\N	\N
8e51c4eb-abff-49cb-9f31-5914b7af9fc1	22	$2a$11$mknSf98CN/PtQcnvy7Sf3u188dWt9F7LjJs5S49JXOeCu6Dg3IEMq	19a5388e-76a4-46ce-808a-16439e11fd77	2025-10-27 17:42:06.400632+07	2025-11-03 17:42:06.400662+07	\N	\N	\N	\N
9ddde2f6-358b-453e-a4a5-9472dfdc76be	30	$2a$11$sAtlrOwnIXv/rezTL0CAyuCCBE2JRuA3RDLmk3FdXwZ4UP.5yQexe	8f3cbc39-9773-4761-8cf0-723221e6b77f	2025-10-27 17:48:41.453769+07	2025-11-03 17:48:41.453769+07	\N	\N	\N	\N
642704f7-530e-4755-a060-ee89d826a0d9	16	$2a$11$7So8jZrhNQtoAnehNnsLX.SJTqPLeuFFHzSrujRQ05AVJbZYo1Oxa	26185ee3-29fd-47e7-9c69-b1ee75694aca	2025-10-27 18:05:41.973777+07	2025-11-03 18:05:41.973778+07	\N	\N	\N	\N
dfaf4310-7fbd-433e-989a-cbd6fbf77ad4	30	$2a$11$yT8LcpjerYr3wRFTl07DNe/ot8pYLE8X6hGbU85MCKX5BrS8o0hWS	7398e63d-34e5-4ed7-9fc0-bff70063d8b5	2025-10-27 18:46:03.213929+07	2025-11-03 18:46:03.213967+07	\N	\N	\N	\N
7d98ff52-7e41-4c72-9c7b-baeec4c15426	16	$2a$11$theQFk0fmUjPEyrQA3vsNu0wswt2UFEYrlEjXLlFQbRFmUe8/9HJm	6719f5c5-a1a8-4914-9016-c9039a6c9b52	2025-10-27 18:47:43.202904+07	2025-11-03 18:47:43.202904+07	\N	\N	\N	\N
eff45789-7355-4fe8-a620-3c2f266f329d	30	$2a$11$HgoxpqugYLhntzgU9w7gpeTCd8qU4GpF8ZgYEnopSrWZ29P0Wjf.2	5557de7a-eab4-4690-8429-aabeae1e05b0	2025-10-29 21:48:00.682252+07	2025-11-05 21:48:00.682265+07	\N	\N	\N	\N
0e6eec6d-7db3-4133-be35-32d910bd59fe	22	$2a$11$p7mky26d03NUojfDDC.69OWil4OLJgyh7ulP16uEDNm3mIcEJ78TK	0750338f-dc40-4513-b018-9e0973567c54	2025-10-29 21:59:52.650897+07	2025-11-05 21:59:52.650897+07	\N	\N	\N	\N
2da962b5-0911-4d56-90fe-c24ca5feb377	27	$2a$11$4duGRwNaazM5okkeqCuct.ay9bXy9798LyN1FAYdedT3XAE0lbgzO	5c2e8dfa-e3b8-4160-b74c-e7e4a71146d8	2025-10-29 22:05:24.298608+07	2025-11-05 22:05:24.298608+07	\N	\N	\N	\N
37a80b79-cb38-4849-b50c-2fb3a7b0a3de	22	$2a$11$N/glcvJkRyGoT0ML9X32t.FEo602fKjXtCQ1.M7WfX/8JAbRvopyC	49899057-4f05-4531-8b3b-3fcb4fba00b1	2025-10-30 14:20:12.093565+07	2025-11-06 14:20:12.093589+07	\N	\N	\N	\N
a0553bce-fdaf-47d8-90ea-f4c1aee85f41	27	$2a$11$POUT4w3JwAI0TDM/iDa2/ekOQtBsZGsBN7whZ/bRya3KISpu.iNqG	606e945a-0617-4fbd-9855-4d749b7943a0	2025-10-30 14:21:33.3552+07	2025-11-06 14:21:33.3552+07	\N	\N	\N	\N
033192d7-6b16-4119-bad7-bd76b1764606	22	$2a$11$9NMnA9Vq66zaPed4uZ7AO.3irlWxSaLqtTGe58htnJ.fbn4G4rL2q	6af20acc-bec9-4e90-9bfa-d8d4c01f3211	2025-10-30 14:33:15.479604+07	2025-11-06 14:33:15.479633+07	\N	\N	\N	\N
894d7d56-fa23-4e97-99da-c04146e7e5b8	27	$2a$11$T0Nm2MDVEvFNJIDqwMQ5ducLfAkjnHC8/FBXbU5lTYqFQ.EJzyIsy	67d98508-b70c-41d0-aaec-2d43043a7a14	2025-10-30 14:34:54.790786+07	2025-11-06 14:34:54.790787+07	\N	\N	\N	\N
e627c72d-1ef4-4d6d-a794-16f2bbfc1318	22	$2a$11$L0OBr6cEZOGhfO.gDi4IWOlLV6N.qd4DTJNWhnAlRhHzrhwzHYdV2	cbbb60a0-725d-4622-874e-cc2390442fa7	2025-10-30 14:40:18.356067+07	2025-11-06 14:40:18.356084+07	\N	\N	\N	\N
8a742529-0c72-4c90-a236-d8f3f212b6f6	27	$2a$11$bm9.lMLXJElmC4zYEyAtv.vrdsfjAOZ04zu46F2ucQ4vrRFkh/hIi	bf2f95ac-1bcb-48ce-b828-440bbba71e93	2025-10-30 14:41:07.08375+07	2025-11-06 14:41:07.083751+07	\N	\N	\N	\N
6c628d2a-bd43-4e9c-a18f-d5badbcf226d	27	$2a$11$rzL/C9SM1IJxDD1RF7NaJOkSFP8Prdw3KPXRsodZKXPzVPDb4AUJy	4bd9fb2a-61bc-44d0-99d9-2d597c7ad95f	2025-10-30 14:43:52.6948+07	2025-11-06 14:43:52.694828+07	\N	\N	\N	\N
510aedaa-c608-4bc7-af23-8321da502751	22	$2a$11$dV62BP2kafrNXrer3r/PYub/2ezMX3jfXD3an/Xd1gKNzxfVGB4ee	8907c769-d4dd-4fd3-82a1-f2105f4b6326	2025-10-30 14:44:00.875114+07	2025-11-06 14:44:00.875115+07	\N	\N	\N	\N
780f6c1b-a1d2-4d63-a23c-c7d79f0898b6	27	$2a$11$SoznDcsoLcIoDI/a2bqqY.BI/YCLv5ooy6TrpJwIDndOhe2GAg7oa	acf1c894-9c93-4350-bbd8-54b72d07ea47	2025-10-30 14:44:42.26132+07	2025-11-06 14:44:42.261321+07	\N	\N	\N	\N
e32b92c7-3076-4e6c-a7c6-13f41c91e033	22	$2a$11$W675Mo6m0BLIVi0TgKX2heFeqMGoY3JI4ns44jga9UiNj34lHETk2	b1b7f89c-a40a-4145-a42e-fe898aba70be	2025-10-30 14:45:01.216673+07	2025-11-06 14:45:01.216674+07	\N	\N	\N	\N
05a951b5-5d1b-443b-95bc-4a58b9f03468	27	$2a$11$yZ8IwkfONOlZi4ydvYngfeeE1wK.Mu6evz38WokyoJTH8ldqeoijS	ab0ce377-11fa-4388-970f-4fb367dc1110	2025-10-30 14:46:06.737312+07	2025-11-06 14:46:06.737313+07	\N	\N	\N	\N
8472804b-ec4d-4507-ba01-4272b688aaea	16	$2a$11$jBC61ky0ho1X2aqgX5fO/uZHJRR2ikaaJHH33EXkk6ntu1y7lp5Uq	9e85a367-ac9e-4ade-9aeb-d91ac704f31f	2025-10-30 15:00:09.716183+07	2025-11-06 15:00:09.716195+07	\N	\N	\N	\N
02c49138-19b0-448a-9e4e-911418b017bc	16	$2a$11$Y5PiqyQaTZkmSCLAV8fT2uRPLWc0bUkiC6YiTcnBNN.dn.j1JLEXG	939096d6-340f-48ed-9433-2fd440435498	2025-10-30 15:15:28.859953+07	2025-11-06 15:15:28.859954+07	\N	\N	\N	\N
24ba331e-b0ac-461f-9574-17ad09a169c3	30	$2a$11$9jjpgFCGoJH7sFZ6A2L67OGKisN7eI8HqeMjTB91IPciebENHnzZm	9ad5b287-e8c8-43c0-8e36-25bcb9549784	2025-10-30 15:53:16.245696+07	2025-11-06 15:53:16.245717+07	\N	\N	\N	\N
6ebc4b44-e175-4a34-af60-b8d59ef4d3f1	30	$2a$11$MS6.Hzo3xtczyCVRkKaIEephAnfgulBfIWpdJiQlpp3kI4zX2oAL.	c18c357c-e87a-42be-809c-7892f42caa13	2025-10-30 15:53:16.577934+07	2025-11-06 15:53:16.577934+07	\N	\N	\N	\N
6e13cc9a-6de3-4650-a4ec-6f475d8b15c3	22	$2a$11$ZnToR7JWNCgNfQxzSPYUMexrJuXHA9d3et.Rl/EJL5q.P.D5RuBQ.	555a27a5-ad4a-40c8-832b-d95e3617a579	2025-10-30 15:53:59.940174+07	2025-11-06 15:53:59.940174+07	\N	\N	\N	\N
a7f8c6db-9c96-459a-bfbf-1e4e7d89e1c3	27	$2a$11$M3RUam1Tcvd37wnvYSbc..CP3w2dG4gaw3Sj.y5rOYIX.ayQB7Ura	7c97f597-4d36-422a-9889-22a0884b8efd	2025-10-30 15:54:11.936955+07	2025-11-06 15:54:11.936955+07	\N	\N	\N	\N
db05fbd2-63bd-4dbe-b44c-25e8951cf88a	16	$2a$11$tIIvjXnQXYFWC3dDcJmeTO4FJjylRUhDAl/Zncezir7w9ELzqvz16	9d972d79-ea5a-4b41-9e71-c1c2796b4545	2025-10-30 15:54:56.339017+07	2025-11-06 15:54:56.339018+07	\N	\N	\N	\N
345047cd-8ca6-4dd8-b37b-1f5cdd08cc79	30	$2a$11$SrrwKIvIgfXTKCh2Hd3Ji.xzc0jXzAjGVmRVF7F.wXvBXHxgnMYWS	79d6befe-8e49-41cc-8641-ddec3dbfffb2	2025-10-31 15:23:47.952145+07	2025-11-07 15:23:47.952176+07	\N	\N	\N	\N
f74e5d9a-7051-40d0-b58c-0f899b646887	30	$2a$11$zebZfBlZkL4K4OUXu29i7uw4omnNz7rBBdxqlx9H9kJ4W663hHmDG	52a30618-dd9b-4dc2-a2ae-5af9c6b6cc3d	2025-10-31 15:24:56.001277+07	2025-11-07 15:24:56.001277+07	\N	\N	\N	\N
f81a5f0e-d8ae-43f6-a64d-a8fc59bc65f9	22	$2a$11$60z.z3vZFAMjdow5EwF31OauKnyKLYRSoc.jQ5jwGmYZHL5J5sDyW	92bf8cff-f5a0-43ca-854d-ad27db40cd61	2025-10-31 15:25:04.105813+07	2025-11-07 15:25:04.105813+07	\N	\N	\N	\N
a2807dac-6604-4a79-8fd0-133b562a4adf	27	$2a$11$q0QYsQGpa2LGJ7L/uz9mbefxUczl1UpN16Vacb3yYBLwoIbvqVh.6	a0bf7c62-898b-4e13-933f-a86e215b085e	2025-10-31 15:25:55.892391+07	2025-11-07 15:25:55.892392+07	\N	\N	\N	\N
fd067286-24cb-415a-914d-d6c05b7c7f63	22	$2a$11$nFWvfiP.SqLi8ihx7697Y.J417cFDjP6FtSLoidqHEUX0mlMtMoH.	0a05edd6-33c0-4088-9cc6-b7f4f1539f44	2025-10-31 15:26:48.714357+07	2025-11-07 15:26:48.714357+07	\N	\N	\N	\N
11be78ab-9e01-4c4b-82b3-26a3a9445344	27	$2a$11$ljAoiaeUPR99UGFiZCGDdufG/iMUHLNe8VGsMntVqh12dLWfBXfxC	3d4373a9-969a-41fc-a924-392776d209e2	2025-10-31 16:08:25.778446+07	2025-11-07 16:08:25.778446+07	\N	\N	\N	\N
b664ba41-e36b-4b79-87ed-b4548d823ff9	22	$2a$11$jNFWJAyVVBDKFIWafvLh6O3x4bKz7fw3NK1C95zH4D.AVnCiAxRBG	7d3f233e-931b-4352-b292-780bfb824c41	2025-10-31 16:21:06.691097+07	2025-11-07 16:21:06.691097+07	\N	\N	\N	\N
37c351d7-6021-429d-85e4-41b1d075dfed	27	$2a$11$2vqKVwQQuvo5uJmD/QRJke9/Vu4/dxK8YyPuikgm4xNf4fHYa78FK	8b436020-d8b8-4a47-b2d1-263554a8df65	2025-10-31 16:21:20.110497+07	2025-11-07 16:21:20.110497+07	\N	\N	\N	\N
60d885c4-e725-4555-bd3b-b00b7b3d282d	22	$2a$11$T6Gq1xUQlvMwd3Jbv4xRJObZp9yatQIg/uuaFLl8L6MGVgUgUHWqa	945f9201-39c9-430f-bd32-8e013c017653	2025-10-31 17:02:18.043263+07	2025-11-07 17:02:18.043263+07	\N	\N	\N	\N
c8613cf6-90b1-45bd-a12b-bee4fa806acf	27	$2a$11$6hbT9i9/Twi7IPiuWaO2t.HNczM994AgUbFXUjnTtVIIEOZXtRoue	dccd72e3-8588-4966-a0da-e45167819134	2025-10-31 17:02:38.213235+07	2025-11-07 17:02:38.213236+07	\N	\N	\N	\N
86928870-a022-4438-8029-673fbd079fa4	16	$2a$11$q568pvxEzNPMg25eKI37ruvzHueuU3kT7VfZSLiF9H2RXWfrbaJFa	cb8685ad-14c0-4c23-8b78-e9212142479c	2025-10-31 17:03:22.727913+07	2025-11-07 17:03:22.727913+07	\N	\N	\N	\N
cae94ed7-1921-44bf-ac84-b2d0174cab79	22	$2a$11$EosLnr.s1MLbhVJ.TqchaeQRo4W8MLhUU0zzwzix16rFTa4U2gtNG	afed6ad5-42c7-4671-9e51-9eed8957986f	2025-10-31 17:09:26.816366+07	2025-11-07 17:09:26.816366+07	\N	\N	\N	\N
dfcfd679-d932-46b0-a66f-be8b5b67c375	27	$2a$11$Q1wsnvmyBVNuasn.DAP7Se7tgfw.LmnDKxMhWjxQpQG.FI5aNgEV2	d4eba644-2af4-4960-9cf6-03ec2687e4bc	2025-10-31 17:10:12.017661+07	2025-11-07 17:10:12.017662+07	\N	\N	\N	\N
577e898d-72b0-4003-a96c-72db2918649b	16	$2a$11$EnWvKHbMpgPmdDIKX8xF/ep0p3WykKMtbclxGcrL.yl4pu0jdtcwK	e29f7a90-08d8-43b8-9919-b073391cccb8	2025-10-31 17:10:31.344112+07	2025-11-07 17:10:31.344112+07	\N	\N	\N	\N
781eff39-ebda-4d16-a521-49083fc61f84	16	$2a$11$m8u8EkXUdQbteVR.kZSmF.9a32TjTeLLQi6jnFUm6D071K2/rR7I.	5e20037f-ea06-409b-958d-b60b5f910dc2	2025-10-31 18:24:42.909774+07	2025-11-07 18:24:42.909799+07	\N	\N	\N	\N
7767490b-15db-491f-86ca-b7d902af58a3	30	$2a$11$Po1DvtVGxu.H.yHVMhEfzuBhJAdESXlryEFFBesWtIwstZ3CNJPqi	df7b7f12-4b07-4a05-9154-80b8e976b7d9	2025-10-31 18:49:16.157198+07	2025-11-07 18:49:16.157209+07	\N	\N	\N	\N
1f55f2c3-fb4d-48ac-8c9d-cca0bbaed4f3	16	$2a$11$yAY/y4bNs3/A7Fh.xm.squ52nzjJH9jcU5TNMrSY6OipjFPnvjAAu	a8c35bf2-041e-41c6-a603-ad4f7e7e9666	2025-10-31 19:49:44.461318+07	2025-11-07 19:49:44.461319+07	\N	\N	\N	\N
7653380e-0d49-408a-b56d-940adfd9de57	16	$2a$11$a1UNMq53cgoCbHMQA4pRbe/u5Aa9QT0UHoElaoufAJjdJI4ter23a	97c4fd20-ff6e-40f8-a4e1-1e08a855442b	2025-10-31 20:08:03.750262+07	2025-11-07 20:08:03.750274+07	\N	\N	\N	\N
a0ed0a26-4515-44a5-86f0-b2dd533ae729	30	$2a$11$lhbxaXLeOleGDQGtfvQO.uMUo.H.LqQdJq.qEq.24aTni.FNmnChK	393b5771-3997-45fb-b071-f5c19da53af9	2025-10-31 20:14:35.341097+07	2025-11-07 20:14:35.341108+07	\N	\N	\N	\N
9ba5d8df-d204-4d8c-bd9f-0df9d2d412ae	22	$2a$11$rNtPAf2HtfBsaFhqCrKGq.zE9Vnc53S3MMP1KE7hxtiAGBcNvxwVy	726a8da0-0e85-4192-b63e-01956923e87b	2025-10-31 20:25:14.127963+07	2025-11-07 20:25:14.127963+07	\N	\N	\N	\N
14f36561-8f0d-446f-b08b-a473fa39e8b3	31	$2a$11$BOHY06TcOcV3R1xeh8VobOQzv0YcuO6N9mhe0p3MdmmBHZZ1jsxcO	8a1e1379-b510-4400-a0dd-cf0d0812f097	2025-10-31 20:33:31.221854+07	2025-11-07 20:33:31.221879+07	\N	\N	\N	\N
a33fec9a-ccd2-4649-8815-ae003ace91d6	22	$2a$11$kku7scJYPrqKPVLQdLpO..5amOL/8PvZfB.K9FCazWPHHhtJi0pNa	222e6a5c-1afb-480a-ac82-9070ba9507c7	2025-10-31 20:35:25.782386+07	2025-11-07 20:35:25.782386+07	\N	\N	\N	\N
48e1e91f-40ac-48b7-85cc-08c500789d5a	16	$2a$11$ncT1fVGaFjyQiZJqI2khFOMpDCpv/x71Ap7DfUOF7eMHjw4BqfIeW	10ddc638-0755-4c55-a006-33b79acdeeca	2025-10-31 21:35:06.035366+07	2025-11-07 21:35:06.035367+07	\N	\N	\N	\N
\.


--
-- TOC entry 5190 (class 0 OID 18783)
-- Dependencies: 223
-- Data for Name: company; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company (company_id, name, hotline, email, address, tax_code, status, contact_account_id, created_at, updated_at, fax, url_page) FROM stdin;
1	RadioCabs Hà Nội	1900-1234	contact@radiocabs-hn.com	123 Lê Lợi, Hoàn Kiếm, Hà Nội	0123456789	ACTIVE	1	2025-10-22 14:03:47.956554+07	\N	024-1234567	\N
2	Acme Taxi	1900-1234	contact@acme.taxi	123 Main St	0101234567	ACTIVE	2	-infinity	\N		\N
3	RadioCabs Đà Nẵngd	1900-9999	contact@radiocabs-dn.com	789 Lê Duẩn, Hải Châu, Đà Nẵng	0555666776	ACTIVE	3	2025-10-22 14:03:47.956554+07	2025-10-26 23:16:16.945048+07	0236-123457	\N
11	ád	0985784567	bkdcdzvkl0@gmail.com	ádf	123213	ACTIVE	30	2025-10-31 19:49:28.851423+07	2025-10-31 20:14:17.539172+07	124123432413	\N
\.


--
-- TOC entry 5215 (class 0 OID 19284)
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
24	23	2024-12-02	06:00:00	14:00:00	3	PLANNED	Ca sáng thứ 2	2025-10-24 20:23:59.550485+07	\N
25	23	2024-12-03	06:00:00	14:00:00	3	PLANNED	Ca sáng thứ 3	2025-10-24 20:23:59.550485+07	\N
26	23	2024-12-04	06:00:00	14:00:00	3	ON	Ca sáng thứ 4 - Đang làm việc	2025-10-24 20:23:59.550485+07	\N
27	23	2024-12-05	06:00:00	14:00:00	3	PLANNED	Ca sáng thứ 5	2025-10-24 20:23:59.550485+07	\N
28	23	2024-12-06	06:00:00	14:00:00	3	PLANNED	Ca sáng thứ 6	2025-10-24 20:23:59.550485+07	\N
29	24	2024-12-02	14:00:00	22:00:00	4	COMPLETED	Ca chiều thứ 2 - Đã hoàn thành	2025-10-24 20:23:59.550485+07	\N
30	24	2024-12-03	14:00:00	22:00:00	4	COMPLETED	Ca chiều thứ 3 - Đã hoàn thành	2025-10-24 20:23:59.550485+07	\N
31	24	2024-12-04	14:00:00	22:00:00	4	ON	Ca chiều thứ 4 - Đang làm việc	2025-10-24 20:23:59.550485+07	\N
32	24	2024-12-05	14:00:00	22:00:00	4	PLANNED	Ca chiều thứ 5	2025-10-24 20:23:59.550485+07	\N
33	24	2024-12-06	14:00:00	22:00:00	4	PLANNED	Ca chiều thứ 6	2025-10-24 20:23:59.550485+07	\N
34	25	2024-12-02	08:00:00	16:00:00	5	COMPLETED	Ca ngày thứ 2 - Đã hoàn thành	2025-10-24 20:23:59.550485+07	\N
35	25	2024-12-03	08:00:00	16:00:00	5	COMPLETED	Ca ngày thứ 3 - Đã hoàn thành	2025-10-24 20:23:59.550485+07	\N
36	25	2024-12-04	08:00:00	16:00:00	5	ON	Ca ngày thứ 4 - Đang làm việc	2025-10-24 20:23:59.550485+07	\N
37	25	2024-12-05	08:00:00	16:00:00	5	PLANNED	Ca ngày thứ 5	2025-10-24 20:23:59.550485+07	\N
38	25	2024-12-06	08:00:00	16:00:00	5	PLANNED	Ca ngày thứ 6	2025-10-24 20:23:59.550485+07	\N
40	23	2026-01-07	06:00:00	14:00:00	3	PLANNED	Ca sáng thứ 3	2025-10-24 20:27:06.283911+07	\N
41	23	2026-01-08	06:00:00	14:00:00	3	ON	Ca sáng thứ 4 - Đang làm việc	2025-10-24 20:27:06.283911+07	\N
42	23	2026-01-09	06:00:00	14:00:00	3	PLANNED	Ca sáng thứ 5	2025-10-24 20:27:06.283911+07	\N
43	23	2026-01-10	06:00:00	14:00:00	3	PLANNED	Ca sáng thứ 6	2025-10-24 20:27:06.283911+07	\N
44	24	2026-01-06	14:00:00	22:00:00	4	COMPLETED	Ca chiều thứ 2 - Đã hoàn thành	2025-10-24 20:27:06.283911+07	\N
45	24	2026-01-07	14:00:00	22:00:00	4	COMPLETED	Ca chiều thứ 3 - Đã hoàn thành	2025-10-24 20:27:06.283911+07	\N
46	24	2026-01-08	14:00:00	22:00:00	4	ON	Ca chiều thứ 4 - Đang làm việc	2025-10-24 20:27:06.283911+07	\N
47	24	2026-01-09	14:00:00	22:00:00	4	PLANNED	Ca chiều thứ 5	2025-10-24 20:27:06.283911+07	\N
48	24	2026-01-10	14:00:00	22:00:00	4	PLANNED	Ca chiều thứ 6	2025-10-24 20:27:06.283911+07	\N
50	25	2026-01-07	08:00:00	16:00:00	5	COMPLETED	Ca ngày thứ 3 - Đã hoàn thành	2025-10-24 20:27:06.283911+07	\N
51	25	2026-01-08	08:00:00	16:00:00	5	ON	Ca ngày thứ 4 - Đang làm việc	2025-10-24 20:27:06.283911+07	\N
52	25	2026-01-09	08:00:00	16:00:00	5	PLANNED	Ca ngày thứ 5	2025-10-24 20:27:06.283911+07	\N
53	25	2026-01-10	08:00:00	16:00:00	5	PLANNED	Ca ngày thứ 6	2025-10-24 20:27:06.283911+07	\N
54	23	2026-01-13	06:00:00	14:00:00	3	PLANNED	Ca sáng thứ 2	2025-10-24 20:27:06.283911+07	\N
55	23	2026-01-14	06:00:00	14:00:00	3	PLANNED	Ca sáng thứ 3	2025-10-24 20:27:06.283911+07	\N
56	23	2026-01-15	06:00:00	14:00:00	3	PLANNED	Ca sáng thứ 4	2025-10-24 20:27:06.283911+07	\N
57	23	2026-01-16	06:00:00	14:00:00	3	PLANNED	Ca sáng thứ 5	2025-10-24 20:27:06.283911+07	\N
58	23	2026-01-17	06:00:00	14:00:00	3	PLANNED	Ca sáng thứ 6	2025-10-24 20:27:06.283911+07	\N
59	24	2026-01-13	14:00:00	22:00:00	4	PLANNED	Ca chiều thứ 2	2025-10-24 20:27:06.283911+07	\N
60	24	2026-01-14	14:00:00	22:00:00	4	PLANNED	Ca chiều thứ 3	2025-10-24 20:27:06.283911+07	\N
61	24	2026-01-15	14:00:00	22:00:00	4	PLANNED	Ca chiều thứ 4	2025-10-24 20:27:06.283911+07	\N
62	24	2026-01-16	14:00:00	22:00:00	4	PLANNED	Ca chiều thứ 5	2025-10-24 20:27:06.283911+07	\N
63	24	2026-01-17	14:00:00	22:00:00	4	PLANNED	Ca chiều thứ 6	2025-10-24 20:27:06.283911+07	\N
64	25	2026-01-13	08:00:00	16:00:00	5	PLANNED	Ca ngày thứ 2	2025-10-24 20:27:06.283911+07	\N
65	25	2026-01-14	08:00:00	16:00:00	5	PLANNED	Ca ngày thứ 3	2025-10-24 20:27:06.283911+07	\N
66	25	2026-01-15	08:00:00	16:00:00	5	PLANNED	Ca ngày thứ 4	2025-10-24 20:27:06.283911+07	\N
67	25	2026-01-16	08:00:00	16:00:00	5	PLANNED	Ca ngày thứ 5	2025-10-24 20:27:06.283911+07	\N
68	25	2026-01-17	08:00:00	16:00:00	5	PLANNED	Ca ngày thứ 6	2025-10-24 20:27:06.283911+07	\N
49	25	2025-12-19	08:00:00	16:00:00	5	COMPLETED	Ca ngày thứ 2 - Đã hoàn thành	2025-10-24 20:27:06.283911+07	2025-10-26 21:07:05.262505+07
71	23	2025-10-27	05:47:00	18:47:00	11	PLANNED	\N	2025-10-27 13:48:01.922261+07	2025-10-27 13:51:42.125496+07
72	24	2025-10-27	02:08:00	17:08:00	17	ON	\N	2025-10-27 14:08:18.134098+07	\N
73	10	2025-10-27	02:08:00	17:08:00	18	PLANNED	\N	2025-10-27 14:08:42.638544+07	\N
75	23	2025-10-29	00:03:00	12:03:00	11	ON	\N	2025-10-29 22:03:40.190225+07	\N
76	27	2025-10-29	17:04:00	23:04:00	11	ON	\N	2025-10-29 22:05:04.269898+07	\N
74	27	2025-10-27	08:41:00	20:41:00	10	ON	\N	2025-10-27 14:41:13.466902+07	2025-10-27 14:41:53.876631+07
77	27	2025-10-30	02:21:00	16:21:00	11	ON	\N	2025-10-30 14:21:19.467577+07	\N
79	23	2025-10-31	03:53:00	17:53:00	16	ON	\N	2025-10-31 15:53:28.081206+07	\N
78	27	2025-10-31	15:25:00	17:25:00	10	ON	\N	2025-10-31 15:25:39.671505+07	\N
\.


--
-- TOC entry 5213 (class 0 OID 19262)
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
21	23	2024-12-01	2024-12-31	2	06:00:00	14:00:00	3	Ca sáng thứ 3	t
23	24	2024-12-01	2024-12-31	1	14:00:00	22:00:00	4	Ca chiều thứ 2	t
24	24	2024-12-01	2024-12-31	2	14:00:00	22:00:00	4	Ca chiều thứ 3	t
25	24	2024-12-01	2024-12-31	3	14:00:00	22:00:00	4	Ca chiều thứ 4	t
26	25	2024-12-01	2024-12-31	1	08:00:00	16:00:00	5	Ca ngày thứ 2	t
27	25	2024-12-01	2024-12-31	2	08:00:00	16:00:00	5	Ca ngày thứ 3	t
28	25	2024-12-01	2024-12-31	3	08:00:00	16:00:00	5	Ca ngày thứ 4	t
31	24	2026-01-01	2026-12-31	4	14:00:00	22:00:00	4	Ca chiều thứ 5	t
32	24	2026-01-01	2026-12-31	5	14:00:00	22:00:00	4	Ca chiều thứ 6	t
33	25	2026-01-01	2026-12-31	4	08:00:00	16:00:00	5	Ca ngày thứ 5	t
34	25	2026-01-01	2026-12-31	5	08:00:00	16:00:00	5	Ca ngày thứ 6	t
36	10	2025-10-02	2025-10-24	6	15:05:00	17:05:00	11	\N	t
20	23	2024-12-01	2024-12-31	1	06:00:00	20:00:00	18	Ca sáng thứ 2	t
30	23	2026-01-01	2026-12-31	5	06:00:00	20:00:00	16	Ca sáng thứ 6	t
29	23	2026-01-01	2026-12-31	4	06:00:00	21:00:00	10	Ca sáng thứ 5	t
22	23	2024-12-01	2024-12-31	3	06:00:00	14:00:00	16	Ca sáng thứ 4	t
\.


--
-- TOC entry 5202 (class 0 OID 18902)
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
8	23	3	2025-10-24 20:23:59.550485+07	\N
9	24	4	2025-10-24 20:23:59.550485+07	\N
10	25	5	2025-10-24 20:23:59.550485+07	\N
12	23	11	2025-10-09 07:00:00+07	2025-10-25 07:00:00+07
13	24	17	2025-10-20 07:00:00+07	2025-12-27 07:00:00+07
14	10	18	2025-10-14 07:00:00+07	2026-01-09 07:00:00+07
15	27	10	2025-10-08 07:00:00+07	2025-10-31 07:00:00+07
16	27	11	2025-10-15 07:00:00+07	2025-10-31 07:00:00+07
17	23	16	2025-10-02 07:00:00+07	2025-11-01 07:00:00+07
\.


--
-- TOC entry 5211 (class 0 OID 19023)
-- Dependencies: 244
-- Data for Name: driving_order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.driving_order (order_id, company_id, customer_account_id, vehicle_id, driver_account_id, model_id, price_ref_id, from_province_id, to_province_id, pickup_address, dropoff_address, pickup_time, dropoff_time, status, total_km, inner_city_km, intercity_km, traffic_km, is_raining, wait_minutes, base_fare, traffic_unit_price, traffic_fee, rain_fee, intercity_unit_price, intercity_fee, other_fee, total_amount, fare_breakdown, payment_method, paid_at, created_at, updated_at, driver_schedule_id) FROM stdin;
29	3	22	10	27	8	10	3	3	Ga Hà Nội	Hồ Gươm	2025-10-31 16:17:06.286+07	2025-10-31 16:20:37.653621+07	DONE	1.70	1.70	0.00	0.00	f	0	14000.00	0.00	0.00	0.00	14000.00	0.00	0.00	32700.00	\N	CARD	\N	2025-10-31 15:45:32.801236+07	2025-10-31 16:20:37.661949+07	78
19	3	22	11	27	9	12	3	3	Chợ Đồng Xuân	Vincom Center	2025-10-30 14:24:45.174+07	2025-10-30 14:24:59.274916+07	DONE	3.90	3.90	0.00	0.00	f	0	170000.00	0.00	0.00	0.00	150000.00	0.00	0.00	0.00	\N	CASH	\N	2025-10-30 14:20:54.514248+07	2025-10-30 14:24:59.301457+07	77
30	3	27	10	27	8	11	3	3	Hồ Gươm	Chợ Đồng Xuân	\N	\N	ASSIGNED	1.50	1.50	0.00	0.00	f	0	19000.00	0.00	0.00	0.00	17000.00	0.00	0.00	52360.00	\N	\N	\N	2025-10-31 16:20:55.641499+07	2025-10-31 16:21:13.906586+07	78
1	3	11	1	6	1	1	1	1	123 Lê Lợi, Hoàn Kiếm, Hà Nội	456 Nguyễn Huệ, Hai Bà Trưng, Hà Nội	2024-01-15 08:00:00+07	2024-01-15 08:30:00+07	DONE	8.50	8.50	0.00	2.00	f	5	15000.00	2000.00	4000.00	0.00	15000.00	0.00	0.00	19000.00	{"base_fare": 15000, "traffic_fee": 4000}	CASH	2024-01-15 08:35:00+07	2024-01-15 07:45:00+07	\N	\N
2	3	12	2	7	2	3	1	1	789 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội	321 Cầu Giấy, Cầu Giấy, Hà Nội	2024-01-15 14:00:00+07	2024-01-15 14:45:00+07	ONGOING	15.20	15.20	0.00	3.50	t	0	18000.00	2500.00	8750.00	5000.00	16000.00	0.00	0.00	31750.00	{"rain_fee": 5000, "base_fare": 18000, "traffic_fee": 8750}	\N	\N	2024-01-15 13:30:00+07	\N	\N
3	3	13	6	8	5	6	2	2	111 Nguyễn Huệ, Quận 1, TP.HCM	222 Lê Văn Việt, Quận 9, TP.HCM	2024-01-16 09:00:00+07	\N	ASSIGNED	25.80	25.80	0.00	5.20	f	0	16000.00	2200.00	11440.00	0.00	16000.00	0.00	0.00	27440.00	{"base_fare": 16000, "traffic_fee": 11440}	\N	\N	2024-01-16 08:30:00+07	\N	\N
4	3	11	7	9	6	8	2	2	333 Điện Biên Phủ, Bình Thạnh, TP.HCM	444 Nguyễn Thị Thập, Quận 7, TP.HCM	2024-01-16 16:00:00+07	2024-01-16 16:50:00+07	DONE	18.70	18.70	0.00	4.10	f	10	19000.00	2700.00	11070.00	0.00	17000.00	0.00	0.00	30070.00	{"base_fare": 19000, "traffic_fee": 11070}	CARD	2024-01-16 17:00:00+07	2024-01-16 15:30:00+07	\N	23
5	3	12	10	10	8	10	3	3	555 Lê Duẩn, Hải Châu, Đà Nẵng	666 Ngũ Hành Sơn, Ngũ Hành Sơn, Đà Nẵng	2024-01-17 10:00:00+07	\N	NEW	12.30	12.30	0.00	2.80	f	0	14000.00	1800.00	5040.00	0.00	14000.00	0.00	0.00	19040.00	{"base_fare": 14000, "traffic_fee": 5040}	\N	\N	2024-01-17 09:30:00+07	\N	25
6	3	2	\N	\N	5	9	1	2	updated	456 Đường XYZ, Quận 2, TP.HCM	2024-01-15 15:00:00+07	2025-10-22 19:40:15.666542+07	CANCELLED	12334.00	123132.00	233.00	2323.00	t	23	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	\N	CASH	\N	2025-10-22 19:34:42.642924+07	2025-10-22 19:41:43.771671+07	24
11	3	\N	17	24	15	15	3	3	abc	xyz	\N	\N	CANCELLED	3.00	3.00	0.00	0.00	f	0	62000.00	0.00	0.00	0.00	25000.00	0.00	0.00	62000.00	\N	\N	\N	2025-10-27 14:21:29.066375+07	2025-10-27 14:38:20.782297+07	72
12	3	30	10	27	8	10	3	3	abc	xyz	\N	2025-10-27 14:47:50.22956+07	DONE	4.00	0.00	0.00	0.00	f	0	58000.00	0.00	0.00	0.00	14000.00	0.00	0.00	14000.00	\N	CASH	\N	2025-10-27 14:41:34.415061+07	2025-10-27 14:47:50.272023+07	74
14	1	\N	\N	\N	4	5	1	1	Vị trí hiện tại	Phố Hàng Chiếu, Đồng Xuân, Hoàn Kiếm, Hà Nội, Hà Nội, 11009	\N	\N	NEW	2.80	2.80	0.00	0.00	f	0	30000.00	0.00	0.00	0.00	25000.00	0.00	0.00	102610.00	\N	\N	\N	2025-10-27 17:48:54.10764+07	\N	\N
15	1	\N	\N	\N	4	5	1	1	Vị trí hiện tại	Phố Hàng Chiếu, Đồng Xuân, Hoàn Kiếm, Hà Nội, Hà Nội, 11009	\N	\N	NEW	2.80	2.80	0.00	0.00	f	0	30000.00	0.00	0.00	0.00	25000.00	0.00	0.00	102610.00	\N	\N	\N	2025-10-27 18:03:12.716106+07	\N	\N
16	1	30	\N	\N	4	5	1	1	Vị trí hiện tại	Phố Hàng Chiếu, Đồng Xuân, Hoàn Kiếm, Hà Nội, Hà Nội, 11009	\N	\N	NEW	2.80	2.80	0.00	0.00	f	0	30000.00	0.00	0.00	0.00	25000.00	0.00	0.00	101630.00	\N	\N	\N	2025-10-27 18:05:01.677601+07	\N	\N
17	1	22	\N	\N	4	5	1	1	Hồ Gươm	Chợ Đồng Xuân	\N	\N	NEW	1.50	1.50	0.00	0.00	f	0	30000.00	0.00	0.00	0.00	25000.00	0.00	0.00	73725.00	\N	\N	\N	2025-10-29 22:00:48.531029+07	\N	\N
18	3	22	11	27	9	12	3	3	Chợ Đồng Xuân	Vincom Center	\N	2025-10-29 22:05:59.59541+07	DONE	3.90	3.90	0.00	0.00	f	0	170000.00	0.00	0.00	0.00	150000.00	0.00	0.00	0.00	\N	CASH	\N	2025-10-29 22:01:35.948411+07	2025-10-29 22:05:59.620727+07	76
21	3	22	11	27	9	12	3	3	Chợ Đồng Xuân	Vincom Center	2025-10-30 14:30:28.916+07	2025-10-30 14:30:31.922669+07	DONE	8.50	0.00	0.00	0.00	f	0	9000.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	\N	CASH	2025-10-30 14:30:31.931+07	2025-10-30 14:30:20.890788+07	2025-10-30 14:30:31.934666+07	77
22	3	22	11	27	9	12	3	3	Hồ Gươm	Chợ Đồng Xuân	2025-10-30 14:35:01.71+07	2025-10-30 14:35:05.65986+07	DONE	1.50	1.50	0.00	0.00	f	0	170000.00	0.00	0.00	0.00	150000.00	0.00	0.00	365000.00	\N	CARD	\N	2025-10-30 14:33:35.714739+07	2025-10-30 14:35:05.691321+07	77
23	3	27	11	27	9	12	3	3	Vincom Center	Bệnh viện Bạch Mai	2025-10-30 14:43:19.956+07	2025-10-30 14:43:24.449851+07	DONE	4.10	4.10	0.00	0.00	f	0	170000.00	0.00	0.00	0.00	150000.00	0.00	0.00	703000.00	\N	CASH	2025-10-30 14:43:24.592+07	2025-10-30 14:40:04.626168+07	2025-10-30 14:43:24.597169+07	77
25	3	22	\N	\N	9	12	3	3	Ga Hà Nội	Hồ Gươm	\N	\N	NEW	1.70	1.70	0.00	0.00	f	0	170000.00	0.00	0.00	0.00	150000.00	0.00	0.00	478025.00	\N	\N	\N	2025-10-30 14:45:29.546078+07	\N	\N
24	3	27	11	27	9	12	3	3	Hồ Gươm	Chợ Đồng Xuân	2025-10-30 14:46:08.613+07	2025-10-30 14:46:10.94573+07	DONE	1.50	1.50	0.00	0.00	f	0	170000.00	0.00	0.00	0.00	150000.00	0.00	0.00	365000.00	\N	CASH	2025-10-30 14:46:10.952+07	2025-10-30 14:43:43.959562+07	2025-10-30 14:46:10.955313+07	77
13	3	30	10	27	8	10	3	3	abc	xyz	\N	2025-10-30 14:47:26.747033+07	DONE	3.00	0.00	0.00	0.00	f	0	47000.00	0.00	0.00	0.00	14000.00	0.00	0.00	14000.00	\N	CASH	2025-10-30 14:47:26.753+07	2025-10-27 14:56:28.918391+07	2025-10-30 14:47:26.757379+07	74
26	3	30	11	27	9	12	3	3	Bệnh viện Bạch Mai	Chợ Đồng Xuân	2025-10-30 15:54:17.07+07	2025-10-30 15:54:19.427462+07	DONE	4.80	4.80	0.00	0.00	f	0	170000.00	0.00	0.00	0.00	150000.00	0.00	0.00	794000.00	\N	CASH	2025-10-30 15:54:19.456+07	2025-10-30 15:53:49.374577+07	2025-10-30 15:54:19.461397+07	77
27	3	30	10	27	8	10	3	3	Số 13, Phố Lê Thanh Nghị, Bạch Mai, Hai Bà Trưng, Hà Nội, Hà Nội, 11618	Chợ Đồng Xuân	2025-10-31 15:26:00.525+07	2025-10-31 15:26:02.886665+07	DONE	5.80	5.80	0.00	0.00	f	0	14000.00	0.00	0.00	0.00	14000.00	0.00	0.00	77800.00	\N	CASH	2025-10-31 15:26:02.904+07	2025-10-31 15:24:49.26246+07	2025-10-31 15:26:02.909049+07	78
28	3	22	10	27	8	10	3	3	Số 13, Phố Lê Thanh Nghị, Bạch Mai, Hai Bà Trưng, Hà Nội, Hà Nội, 11618	Chợ Đồng Xuân	\N	\N	CANCELLED	5.80	5.80	0.00	0.00	f	0	14000.00	0.00	0.00	0.00	14000.00	0.00	0.00	0.00	\N	\N	\N	2025-10-31 15:36:24.261728+07	2025-10-31 15:45:15.441675+07	78
\.


--
-- TOC entry 5219 (class 0 OID 19363)
-- Dependencies: 253
-- Data for Name: membership; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.membership (membership_id, company_id, name, code, unit_price, description, is_active, created_at, updated_at, status) FROM stdin;
1	1	Gói 2022	2022	500000.00	2022	f	2025-10-26 23:53:38.59452+07	\N	t
2	1	Gói 2023	2023	800000.00	2023	f	2025-10-26 23:53:38.59452+07	2025-10-31 18:49:04.183127+07	t
3	1	Gói 2024	2024	1200000.00	2024	t	2025-10-26 23:53:38.59452+07	2025-10-31 18:49:05.206163+07	t
\.


--
-- TOC entry 5194 (class 0 OID 18820)
-- Dependencies: 227
-- Data for Name: membership_order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.membership_order (membership_order_id, company_id, payer_account_id, unit_months, unit_price, amount, start_date, end_date, paid_at, payment_method, note, membership_id, payment_code) FROM stdin;
1	1	11	12	500000.00	6000000.00	2024-01-01	2024-12-31	2024-01-01 10:00:00+07	BANK	Gói thành viên năm 2024	1	\N
2	3	12	6	550000.00	3300000.00	2024-01-01	2024-06-30	2024-01-01 11:00:00+07	CARD	Gói thành viên 6 tháng	2	\N
3	3	13	3	600000.00	1800000.00	2024-01-01	2024-03-31	2024-01-01 12:00:00+07	WALLET	Gói thành viên 3 tháng	3	\N
12	3	1	12	800000.00	9600000.00	2024-01-01	20255-12-31	2025-01-01 07:00:00+07	BANK	Nâng cấp lên gói cao cấp	2	TXN202401010003
13	3	5	6	600000.00	3600000.00	2024-02-01	20255-07-31	2025-02-02 07:00:00+07	CARD	Đăng ký gói tiêu chuẩn	2	CC202402010001
14	3	8	6	450000.00	2700000.00	2024-03-01	2024-08-31	2025-02-03 07:00:00+07	CARD	Chờ thanh toán gói cơ bản	2	CC2099402010001
\.


--
-- TOC entry 5209 (class 0 OID 18991)
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
12	3	3	9	170000.00	130000.00	10000.00	23000.00	40000.00	150000.00	06:00:00	22:00:00	\N	2024-01-01	2024-12-31	f	Giá Honda City
11	3	3	8	19000.00	14000.00	11000.00	2800.00	4000.00	17000.00	22:00:00	06:00:00	10	2024-01-01	2024-12-31	f	Giá ban đêm
15	3	3	15	2000.00	20000.00	200000.00	20000.00	2000.00	25000.00	\N	\N	\N	2025-10-20	2026-10-27	t	\N
\.


--
-- TOC entry 5186 (class 0 OID 18760)
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
-- TOC entry 5200 (class 0 OID 18880)
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
12	1	5	51A-67890	1HGBH41JXMN109186	Đen	2024	2024-01-01	1000	INACTIVE
10	3	8	43A-99999	VIN9999999999	Trắng	2022	-infinity	696922	ACTIVE
11	3	9	34A-99998	dIN9999999998	Đen	2023	-infinity	7500	ACTIVE
16	3	8	29K2-03701	1HCADSLSL1HCAD	Đen	2222	-infinity	2	ACTIVE
17	3	15	43A-99988	43A-99988	Trắng	2009	-infinity	200	ACTIVE
18	3	16	29K2-03733	29K2-03733	Đen	2030	-infinity	2000	ACTIVE
\.


--
-- TOC entry 5203 (class 0 OID 18923)
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
-- TOC entry 5198 (class 0 OID 18856)
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
15	3	6	VinFest	VKL7	EV	SEDAN_5			t
16	3	6	Xel	xel	GASOLINE	SUV_7			t
9	3	6	Honda	City	GASOLINE	HATCHBACK_5	model_9_638975143219576303.png	Xe sedan 4 chỗ, động cơ 1.5L	t
\.


--
-- TOC entry 5196 (class 0 OID 18841)
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
20	3	ssAAA	AA	ssAA	t
\.


--
-- TOC entry 5207 (class 0 OID 18974)
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
18	8	100
17	8	100
\.


--
-- TOC entry 5188 (class 0 OID 18769)
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
-- TOC entry 5205 (class 0 OID 18940)
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
8	3	3	DN_AIRPORT	Sân Bay Đà Nẵng	Khu vực sân bay Đà Nẵng	t
7	3	3	DN_CENTER	Trung Tâm Đà Nẵng	Khu vực trung tâm thành phố dn	t
13	3	3	sdg	sdfg	dsg	t
\.


--
-- TOC entry 5206 (class 0 OID 18959)
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
7	12
7	13
8	14
8	15
7	11
\.


--
-- TOC entry 5245 (class 0 OID 0)
-- Dependencies: 224
-- Name: account_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.account_account_id_seq', 31, true);


--
-- TOC entry 5246 (class 0 OID 0)
-- Dependencies: 251
-- Name: auth_email_code_code_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.auth_email_code_code_id_seq', 3, true);


--
-- TOC entry 5247 (class 0 OID 0)
-- Dependencies: 222
-- Name: company_company_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.company_company_id_seq', 11, true);


--
-- TOC entry 5248 (class 0 OID 0)
-- Dependencies: 248
-- Name: driver_schedule_schedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.driver_schedule_schedule_id_seq', 79, true);


--
-- TOC entry 5249 (class 0 OID 0)
-- Dependencies: 246
-- Name: driver_schedule_template_template_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.driver_schedule_template_template_id_seq', 36, true);


--
-- TOC entry 5250 (class 0 OID 0)
-- Dependencies: 234
-- Name: driver_vehicle_assignment_assignment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.driver_vehicle_assignment_assignment_id_seq', 17, true);


--
-- TOC entry 5251 (class 0 OID 0)
-- Dependencies: 243
-- Name: driving_order_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.driving_order_order_id_seq', 30, true);


--
-- TOC entry 5252 (class 0 OID 0)
-- Dependencies: 254
-- Name: membership_membership_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.membership_membership_id_seq', 4, true);


--
-- TOC entry 5253 (class 0 OID 0)
-- Dependencies: 226
-- Name: membership_order_membership_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.membership_order_membership_order_id_seq', 14, true);


--
-- TOC entry 5254 (class 0 OID 0)
-- Dependencies: 241
-- Name: model_price_province_model_price_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.model_price_province_model_price_id_seq', 15, true);


--
-- TOC entry 5255 (class 0 OID 0)
-- Dependencies: 218
-- Name: province_province_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.province_province_id_seq', 5, true);


--
-- TOC entry 5256 (class 0 OID 0)
-- Dependencies: 230
-- Name: vehicle_model_model_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vehicle_model_model_id_seq', 16, true);


--
-- TOC entry 5257 (class 0 OID 0)
-- Dependencies: 228
-- Name: vehicle_segment_segment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vehicle_segment_segment_id_seq', 20, true);


--
-- TOC entry 5258 (class 0 OID 0)
-- Dependencies: 232
-- Name: vehicle_vehicle_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vehicle_vehicle_id_seq', 18, true);


--
-- TOC entry 5259 (class 0 OID 0)
-- Dependencies: 220
-- Name: ward_ward_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ward_ward_id_seq', 15, true);


--
-- TOC entry 5260 (class 0 OID 0)
-- Dependencies: 237
-- Name: zone_zone_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.zone_zone_id_seq', 13, true);


--
-- TOC entry 4934 (class 2606 OID 18805)
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (account_id);


--
-- TOC entry 4936 (class 2606 OID 18807)
-- Name: account account_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_username_key UNIQUE (username);


--
-- TOC entry 4991 (class 2606 OID 19332)
-- Name: auth_email_code auth_email_code_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_email_code
    ADD CONSTRAINT auth_email_code_pkey PRIMARY KEY (code_id);


--
-- TOC entry 4987 (class 2606 OID 19317)
-- Name: auth_refresh_session auth_refresh_session_jti_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_refresh_session
    ADD CONSTRAINT auth_refresh_session_jti_key UNIQUE (jti);


--
-- TOC entry 4989 (class 2606 OID 19315)
-- Name: auth_refresh_session auth_refresh_session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_refresh_session
    ADD CONSTRAINT auth_refresh_session_pkey PRIMARY KEY (session_id);


--
-- TOC entry 4931 (class 2606 OID 18792)
-- Name: company company_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT company_pkey PRIMARY KEY (company_id);


--
-- TOC entry 4983 (class 2606 OID 19292)
-- Name: driver_schedule driver_schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_schedule
    ADD CONSTRAINT driver_schedule_pkey PRIMARY KEY (schedule_id);


--
-- TOC entry 4980 (class 2606 OID 19271)
-- Name: driver_schedule_template driver_schedule_template_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_schedule_template
    ADD CONSTRAINT driver_schedule_template_pkey PRIMARY KEY (template_id);


--
-- TOC entry 4955 (class 2606 OID 18909)
-- Name: driver_vehicle_assignment driver_vehicle_assignment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_vehicle_assignment
    ADD CONSTRAINT driver_vehicle_assignment_pkey PRIMARY KEY (assignment_id);


--
-- TOC entry 4973 (class 2606 OID 19043)
-- Name: driving_order driving_order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driving_order
    ADD CONSTRAINT driving_order_pkey PRIMARY KEY (order_id);


--
-- TOC entry 4995 (class 2606 OID 19376)
-- Name: membership membership_company_id_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membership
    ADD CONSTRAINT membership_company_id_code_key UNIQUE (company_id, code);


--
-- TOC entry 4940 (class 2606 OID 18828)
-- Name: membership_order membership_order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membership_order
    ADD CONSTRAINT membership_order_pkey PRIMARY KEY (membership_order_id);


--
-- TOC entry 4997 (class 2606 OID 19374)
-- Name: membership membership_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membership
    ADD CONSTRAINT membership_pkey PRIMARY KEY (membership_id);


--
-- TOC entry 4971 (class 2606 OID 19000)
-- Name: model_price_province model_price_province_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.model_price_province
    ADD CONSTRAINT model_price_province_pkey PRIMARY KEY (model_price_id);


--
-- TOC entry 4923 (class 2606 OID 18767)
-- Name: province province_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.province
    ADD CONSTRAINT province_code_key UNIQUE (code);


--
-- TOC entry 4925 (class 2606 OID 18765)
-- Name: province province_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.province
    ADD CONSTRAINT province_pkey PRIMARY KEY (province_id);


--
-- TOC entry 4960 (class 2606 OID 18928)
-- Name: vehicle_in_province vehicle_in_province_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_in_province
    ADD CONSTRAINT vehicle_in_province_pkey PRIMARY KEY (vehicle_id, province_id);


--
-- TOC entry 4946 (class 2606 OID 18868)
-- Name: vehicle_model vehicle_model_company_id_brand_model_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_model
    ADD CONSTRAINT vehicle_model_company_id_brand_model_name_key UNIQUE (company_id, brand, model_name);


--
-- TOC entry 4948 (class 2606 OID 18866)
-- Name: vehicle_model vehicle_model_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_model
    ADD CONSTRAINT vehicle_model_pkey PRIMARY KEY (model_id);


--
-- TOC entry 4951 (class 2606 OID 18887)
-- Name: vehicle vehicle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle
    ADD CONSTRAINT vehicle_pkey PRIMARY KEY (vehicle_id);


--
-- TOC entry 4953 (class 2606 OID 18889)
-- Name: vehicle vehicle_plate_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle
    ADD CONSTRAINT vehicle_plate_number_key UNIQUE (plate_number);


--
-- TOC entry 4942 (class 2606 OID 18849)
-- Name: vehicle_segment vehicle_segment_company_id_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_segment
    ADD CONSTRAINT vehicle_segment_company_id_code_key UNIQUE (company_id, code);


--
-- TOC entry 4944 (class 2606 OID 18847)
-- Name: vehicle_segment vehicle_segment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_segment
    ADD CONSTRAINT vehicle_segment_pkey PRIMARY KEY (segment_id);


--
-- TOC entry 4968 (class 2606 OID 18979)
-- Name: vehicle_zone_preference vehicle_zone_preference_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_zone_preference
    ADD CONSTRAINT vehicle_zone_preference_pkey PRIMARY KEY (vehicle_id, zone_id);


--
-- TOC entry 4927 (class 2606 OID 18774)
-- Name: ward ward_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ward
    ADD CONSTRAINT ward_pkey PRIMARY KEY (ward_id);


--
-- TOC entry 4929 (class 2606 OID 18776)
-- Name: ward ward_province_id_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ward
    ADD CONSTRAINT ward_province_id_name_key UNIQUE (province_id, name);


--
-- TOC entry 4962 (class 2606 OID 18948)
-- Name: zone zone_company_id_province_id_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zone
    ADD CONSTRAINT zone_company_id_province_id_code_key UNIQUE (company_id, province_id, code);


--
-- TOC entry 4964 (class 2606 OID 18946)
-- Name: zone zone_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zone
    ADD CONSTRAINT zone_pkey PRIMARY KEY (zone_id);


--
-- TOC entry 4966 (class 2606 OID 18963)
-- Name: zone_ward zone_ward_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zone_ward
    ADD CONSTRAINT zone_ward_pkey PRIMARY KEY (zone_id, ward_id);


--
-- TOC entry 4974 (class 1259 OID 19395)
-- Name: idx_driving_order_driver_schedule_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_driving_order_driver_schedule_id ON public.driving_order USING btree (driver_schedule_id);


--
-- TOC entry 4975 (class 1259 OID 19389)
-- Name: idx_driving_order_price_ref_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_driving_order_price_ref_id ON public.driving_order USING btree (price_ref_id);


--
-- TOC entry 4937 (class 1259 OID 18813)
-- Name: ix_account_company_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_account_company_role ON public.account USING btree (company_id, role);


--
-- TOC entry 4932 (class 1259 OID 18793)
-- Name: ix_company_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_company_status ON public.company USING btree (status);


--
-- TOC entry 4984 (class 1259 OID 19304)
-- Name: ix_driver_schedule_lookup; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_driver_schedule_lookup ON public.driver_schedule USING btree (work_date, status, driver_account_id);


--
-- TOC entry 4981 (class 1259 OID 19282)
-- Name: ix_dst_driver_weekday; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_dst_driver_weekday ON public.driver_schedule_template USING btree (driver_account_id, weekday) WHERE (is_active = true);


--
-- TOC entry 4956 (class 1259 OID 18920)
-- Name: ix_dva_driver_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_dva_driver_time ON public.driver_vehicle_assignment USING btree (driver_account_id, start_at);


--
-- TOC entry 4957 (class 1259 OID 18921)
-- Name: ix_dva_vehicle_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_dva_vehicle_time ON public.driver_vehicle_assignment USING btree (vehicle_id, start_at);


--
-- TOC entry 4993 (class 1259 OID 19387)
-- Name: ix_membership_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_membership_active ON public.membership USING btree (is_active);


--
-- TOC entry 4938 (class 1259 OID 18839)
-- Name: ix_membership_company; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_membership_company ON public.membership_order USING btree (company_id, start_date);


--
-- TOC entry 4969 (class 1259 OID 19021)
-- Name: ix_mpp_lookup; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_mpp_lookup ON public.model_price_province USING btree (company_id, province_id, model_id, is_active, date_start);


--
-- TOC entry 4976 (class 1259 OID 19084)
-- Name: ix_order_company_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_order_company_status ON public.driving_order USING btree (company_id, status, created_at);


--
-- TOC entry 4977 (class 1259 OID 19085)
-- Name: ix_order_driver_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_order_driver_time ON public.driving_order USING btree (driver_account_id, pickup_time);


--
-- TOC entry 4978 (class 1259 OID 19086)
-- Name: ix_order_route; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_order_route ON public.driving_order USING btree (from_province_id, to_province_id);


--
-- TOC entry 4949 (class 1259 OID 18900)
-- Name: ix_vehicle_company; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_vehicle_company ON public.vehicle USING btree (company_id);


--
-- TOC entry 4985 (class 1259 OID 19303)
-- Name: uq_driver_schedule_uni; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_driver_schedule_uni ON public.driver_schedule USING btree (driver_account_id, work_date, start_time, end_time);


--
-- TOC entry 4958 (class 1259 OID 18922)
-- Name: uq_dva_vehicle_open; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_dva_vehicle_open ON public.driver_vehicle_assignment USING btree (vehicle_id) WHERE (end_at IS NULL);


--
-- TOC entry 4992 (class 1259 OID 19338)
-- Name: uq_email_code_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_email_code_active ON public.auth_email_code USING btree (email, purpose) WHERE (consumed_at IS NULL);


--
-- TOC entry 5000 (class 2606 OID 18808)
-- Name: account account_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(company_id) ON DELETE SET NULL;


--
-- TOC entry 5037 (class 2606 OID 19333)
-- Name: auth_email_code auth_email_code_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_email_code
    ADD CONSTRAINT auth_email_code_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account(account_id) ON DELETE SET NULL;


--
-- TOC entry 5036 (class 2606 OID 19318)
-- Name: auth_refresh_session auth_refresh_session_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_refresh_session
    ADD CONSTRAINT auth_refresh_session_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account(account_id) ON DELETE CASCADE;


--
-- TOC entry 5034 (class 2606 OID 19293)
-- Name: driver_schedule driver_schedule_driver_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_schedule
    ADD CONSTRAINT driver_schedule_driver_account_id_fkey FOREIGN KEY (driver_account_id) REFERENCES public.account(account_id) ON DELETE CASCADE;


--
-- TOC entry 5032 (class 2606 OID 19272)
-- Name: driver_schedule_template driver_schedule_template_driver_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_schedule_template
    ADD CONSTRAINT driver_schedule_template_driver_account_id_fkey FOREIGN KEY (driver_account_id) REFERENCES public.account(account_id) ON DELETE CASCADE;


--
-- TOC entry 5033 (class 2606 OID 19277)
-- Name: driver_schedule_template driver_schedule_template_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_schedule_template
    ADD CONSTRAINT driver_schedule_template_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicle(vehicle_id) ON DELETE SET NULL;


--
-- TOC entry 5035 (class 2606 OID 19298)
-- Name: driver_schedule driver_schedule_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_schedule
    ADD CONSTRAINT driver_schedule_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicle(vehicle_id) ON DELETE SET NULL;


--
-- TOC entry 5009 (class 2606 OID 18910)
-- Name: driver_vehicle_assignment driver_vehicle_assignment_driver_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_vehicle_assignment
    ADD CONSTRAINT driver_vehicle_assignment_driver_account_id_fkey FOREIGN KEY (driver_account_id) REFERENCES public.account(account_id) ON DELETE CASCADE;


--
-- TOC entry 5010 (class 2606 OID 18915)
-- Name: driver_vehicle_assignment driver_vehicle_assignment_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driver_vehicle_assignment
    ADD CONSTRAINT driver_vehicle_assignment_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicle(vehicle_id) ON DELETE CASCADE;


--
-- TOC entry 5023 (class 2606 OID 19044)
-- Name: driving_order driving_order_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driving_order
    ADD CONSTRAINT driving_order_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(company_id) ON DELETE CASCADE;


--
-- TOC entry 5024 (class 2606 OID 19049)
-- Name: driving_order driving_order_customer_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driving_order
    ADD CONSTRAINT driving_order_customer_account_id_fkey FOREIGN KEY (customer_account_id) REFERENCES public.account(account_id) ON DELETE SET NULL;


--
-- TOC entry 5025 (class 2606 OID 19059)
-- Name: driving_order driving_order_driver_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driving_order
    ADD CONSTRAINT driving_order_driver_account_id_fkey FOREIGN KEY (driver_account_id) REFERENCES public.account(account_id) ON DELETE SET NULL;


--
-- TOC entry 5026 (class 2606 OID 19390)
-- Name: driving_order driving_order_driver_schedule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driving_order
    ADD CONSTRAINT driving_order_driver_schedule_id_fkey FOREIGN KEY (driver_schedule_id) REFERENCES public.driver_schedule(schedule_id) ON DELETE SET NULL;


--
-- TOC entry 5027 (class 2606 OID 19074)
-- Name: driving_order driving_order_from_province_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driving_order
    ADD CONSTRAINT driving_order_from_province_id_fkey FOREIGN KEY (from_province_id) REFERENCES public.province(province_id) ON DELETE RESTRICT;


--
-- TOC entry 5028 (class 2606 OID 19064)
-- Name: driving_order driving_order_model_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driving_order
    ADD CONSTRAINT driving_order_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.vehicle_model(model_id) ON DELETE RESTRICT;


--
-- TOC entry 5029 (class 2606 OID 19069)
-- Name: driving_order driving_order_price_ref_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driving_order
    ADD CONSTRAINT driving_order_price_ref_id_fkey FOREIGN KEY (price_ref_id) REFERENCES public.model_price_province(model_price_id) ON DELETE SET NULL;


--
-- TOC entry 5030 (class 2606 OID 19079)
-- Name: driving_order driving_order_to_province_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driving_order
    ADD CONSTRAINT driving_order_to_province_id_fkey FOREIGN KEY (to_province_id) REFERENCES public.province(province_id) ON DELETE RESTRICT;


--
-- TOC entry 5031 (class 2606 OID 19054)
-- Name: driving_order driving_order_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.driving_order
    ADD CONSTRAINT driving_order_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicle(vehicle_id) ON DELETE SET NULL;


--
-- TOC entry 4999 (class 2606 OID 18814)
-- Name: company fk_company_contact_account; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT fk_company_contact_account FOREIGN KEY (contact_account_id) REFERENCES public.account(account_id) ON DELETE SET NULL;


--
-- TOC entry 5038 (class 2606 OID 19377)
-- Name: membership membership_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membership
    ADD CONSTRAINT membership_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(company_id) ON DELETE CASCADE;


--
-- TOC entry 5001 (class 2606 OID 18829)
-- Name: membership_order membership_order_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membership_order
    ADD CONSTRAINT membership_order_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(company_id) ON DELETE CASCADE;


--
-- TOC entry 5002 (class 2606 OID 19382)
-- Name: membership_order membership_order_membership_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membership_order
    ADD CONSTRAINT membership_order_membership_id_fkey FOREIGN KEY (membership_id) REFERENCES public.membership(membership_id) ON DELETE RESTRICT;


--
-- TOC entry 5003 (class 2606 OID 18834)
-- Name: membership_order membership_order_payer_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.membership_order
    ADD CONSTRAINT membership_order_payer_account_id_fkey FOREIGN KEY (payer_account_id) REFERENCES public.account(account_id) ON DELETE RESTRICT;


--
-- TOC entry 5019 (class 2606 OID 19001)
-- Name: model_price_province model_price_province_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.model_price_province
    ADD CONSTRAINT model_price_province_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(company_id) ON DELETE CASCADE;


--
-- TOC entry 5020 (class 2606 OID 19011)
-- Name: model_price_province model_price_province_model_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.model_price_province
    ADD CONSTRAINT model_price_province_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.vehicle_model(model_id) ON DELETE CASCADE;


--
-- TOC entry 5021 (class 2606 OID 19016)
-- Name: model_price_province model_price_province_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.model_price_province
    ADD CONSTRAINT model_price_province_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.model_price_province(model_price_id) ON DELETE SET NULL;


--
-- TOC entry 5022 (class 2606 OID 19006)
-- Name: model_price_province model_price_province_province_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.model_price_province
    ADD CONSTRAINT model_price_province_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.province(province_id) ON DELETE RESTRICT;


--
-- TOC entry 5007 (class 2606 OID 18890)
-- Name: vehicle vehicle_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle
    ADD CONSTRAINT vehicle_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(company_id) ON DELETE CASCADE;


--
-- TOC entry 5011 (class 2606 OID 18934)
-- Name: vehicle_in_province vehicle_in_province_province_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_in_province
    ADD CONSTRAINT vehicle_in_province_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.province(province_id) ON DELETE CASCADE;


--
-- TOC entry 5012 (class 2606 OID 18929)
-- Name: vehicle_in_province vehicle_in_province_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_in_province
    ADD CONSTRAINT vehicle_in_province_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicle(vehicle_id) ON DELETE CASCADE;


--
-- TOC entry 5005 (class 2606 OID 18869)
-- Name: vehicle_model vehicle_model_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_model
    ADD CONSTRAINT vehicle_model_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(company_id) ON DELETE CASCADE;


--
-- TOC entry 5008 (class 2606 OID 18895)
-- Name: vehicle vehicle_model_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle
    ADD CONSTRAINT vehicle_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.vehicle_model(model_id) ON DELETE RESTRICT;


--
-- TOC entry 5006 (class 2606 OID 18874)
-- Name: vehicle_model vehicle_model_segment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_model
    ADD CONSTRAINT vehicle_model_segment_id_fkey FOREIGN KEY (segment_id) REFERENCES public.vehicle_segment(segment_id) ON DELETE SET NULL;


--
-- TOC entry 5004 (class 2606 OID 18850)
-- Name: vehicle_segment vehicle_segment_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_segment
    ADD CONSTRAINT vehicle_segment_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(company_id) ON DELETE CASCADE;


--
-- TOC entry 5017 (class 2606 OID 18980)
-- Name: vehicle_zone_preference vehicle_zone_preference_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_zone_preference
    ADD CONSTRAINT vehicle_zone_preference_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicle(vehicle_id) ON DELETE CASCADE;


--
-- TOC entry 5018 (class 2606 OID 18985)
-- Name: vehicle_zone_preference vehicle_zone_preference_zone_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_zone_preference
    ADD CONSTRAINT vehicle_zone_preference_zone_id_fkey FOREIGN KEY (zone_id) REFERENCES public.zone(zone_id) ON DELETE CASCADE;


--
-- TOC entry 4998 (class 2606 OID 18777)
-- Name: ward ward_province_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ward
    ADD CONSTRAINT ward_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.province(province_id) ON DELETE RESTRICT;


--
-- TOC entry 5013 (class 2606 OID 18949)
-- Name: zone zone_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zone
    ADD CONSTRAINT zone_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company(company_id) ON DELETE CASCADE;


--
-- TOC entry 5014 (class 2606 OID 18954)
-- Name: zone zone_province_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zone
    ADD CONSTRAINT zone_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.province(province_id) ON DELETE RESTRICT;


--
-- TOC entry 5015 (class 2606 OID 18969)
-- Name: zone_ward zone_ward_ward_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zone_ward
    ADD CONSTRAINT zone_ward_ward_id_fkey FOREIGN KEY (ward_id) REFERENCES public.ward(ward_id) ON DELETE CASCADE;


--
-- TOC entry 5016 (class 2606 OID 18964)
-- Name: zone_ward zone_ward_zone_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zone_ward
    ADD CONSTRAINT zone_ward_zone_id_fkey FOREIGN KEY (zone_id) REFERENCES public.zone(zone_id) ON DELETE CASCADE;


-- Completed on 2025-10-31 21:37:58

--
-- PostgreSQL database dump complete
--

