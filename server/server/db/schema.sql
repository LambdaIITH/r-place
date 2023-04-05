--
-- PostgreSQL database dump
--

-- Dumped from database version 14.7 (Homebrew)
-- Dumped by pg_dump version 14.7 (Homebrew)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

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
-- Name: pixel_logs pixel_logs_email_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pixel_logs
    ADD CONSTRAINT pixel_logs_email_fkey FOREIGN KEY (email) REFERENCES public.users(email);


--
-- PostgreSQL database dump complete
--

