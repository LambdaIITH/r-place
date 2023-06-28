--
-- PostgreSQL database dump
--

-- Dumped from database version 14.8 (Ubuntu 14.8-0ubuntu0.22.10.1)
-- Dumped by pg_dump version 14.8 (Ubuntu 14.8-0ubuntu0.22.10.1)

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
-- Name: hostel_rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hostel_rooms (
    hostel character(1) NOT NULL,
    floor integer NOT NULL,
    room integer NOT NULL,
    user_email character varying(255) NOT NULL,
    quote text,
    form_response text
);


ALTER TABLE public.hostel_rooms OWNER TO postgres;

--
-- Name: pixel_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pixel_logs (
    x integer NOT NULL,
    y integer NOT NULL,
    color integer NOT NULL,
    email character varying(255) NOT NULL,
    id integer NOT NULL,
    time_stamp timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.pixel_logs OWNER TO postgres;

--
-- Name: pixel_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pixel_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pixel_logs_id_seq OWNER TO postgres;

--
-- Name: pixel_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pixel_logs_id_seq OWNED BY public.pixel_logs.id;


--
-- Name: user_comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_comments (
    from_user character varying(255) NOT NULL,
    to_user character varying(255) NOT NULL,
    comment character varying(1024)
);


ALTER TABLE public.user_comments OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: pixel_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pixel_logs ALTER COLUMN id SET DEFAULT nextval('public.pixel_logs_id_seq'::regclass);


--
-- Name: hostel_rooms hostel_rooms_hostel_floor_room_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hostel_rooms
    ADD CONSTRAINT hostel_rooms_hostel_floor_room_key UNIQUE (hostel, floor, room);


--
-- Name: hostel_rooms hostel_rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hostel_rooms
    ADD CONSTRAINT hostel_rooms_pkey PRIMARY KEY (user_email);


--
-- Name: pixel_logs pixel_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pixel_logs
    ADD CONSTRAINT pixel_logs_pkey PRIMARY KEY (id);


--
-- Name: user_comments user_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_comments
    ADD CONSTRAINT user_comments_pkey PRIMARY KEY (from_user, to_user);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (email);


--
-- Name: hostel_rooms hostel_rooms_user_email_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hostel_rooms
    ADD CONSTRAINT hostel_rooms_user_email_fkey FOREIGN KEY (user_email) REFERENCES public.users(email);


--
-- Name: pixel_logs pixel_logs_email_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pixel_logs
    ADD CONSTRAINT pixel_logs_email_fkey FOREIGN KEY (email) REFERENCES public.users(email);


--
-- Name: user_comments user_comments_to_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_comments
    ADD CONSTRAINT user_comments_to_user_fkey FOREIGN KEY (to_user) REFERENCES public.users(email);


--
-- PostgreSQL database dump complete
--

