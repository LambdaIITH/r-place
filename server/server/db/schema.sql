--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1
-- Dumped by pg_dump version 15.1

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: hostel_rooms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hostel_rooms (
    hostel character(1) NOT NULL,
    floor integer NOT NULL,
    room integer NOT NULL,
    user_email character varying(255) NOT NULL,
    quote text,
    form_response json
);


--
-- Name: pixel_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pixel_logs (
    x integer NOT NULL,
    y integer NOT NULL,
    color integer NOT NULL,
    email character varying(255) NOT NULL,
    id integer NOT NULL,
    time_stamp timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: pixel_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pixel_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pixel_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pixel_logs_id_seq OWNED BY public.pixel_logs.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL
);


--
-- Name: pixel_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pixel_logs ALTER COLUMN id SET DEFAULT nextval('public.pixel_logs_id_seq'::regclass);


--
-- Name: hostel_rooms hostel_rooms_hostel_floor_room_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_rooms
    ADD CONSTRAINT hostel_rooms_hostel_floor_room_key UNIQUE (hostel, floor, room);


--
-- Name: hostel_rooms hostel_rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_rooms
    ADD CONSTRAINT hostel_rooms_pkey PRIMARY KEY (user_email);


--
-- Name: pixel_logs pixel_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pixel_logs
    ADD CONSTRAINT pixel_logs_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (email);


--
-- Name: hostel_rooms hostel_rooms_user_email_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hostel_rooms
    ADD CONSTRAINT hostel_rooms_user_email_fkey FOREIGN KEY (user_email) REFERENCES public.users(email);


--
-- Name: pixel_logs pixel_logs_email_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pixel_logs
    ADD CONSTRAINT pixel_logs_email_fkey FOREIGN KEY (email) REFERENCES public.users(email);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

