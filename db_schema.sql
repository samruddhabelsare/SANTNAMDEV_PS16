-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.bulletin_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text,
  content text,
  level text CHECK (level = ANY (ARRAY['class'::text, 'department'::text, 'college'::text])),
  reference_id uuid,
  posted_by uuid,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT bulletin_posts_pkey PRIMARY KEY (id),
  CONSTRAINT bulletin_posts_posted_by_fkey FOREIGN KEY (posted_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.classroom_members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  classroom_id uuid,
  user_id uuid,
  role text CHECK (role = ANY (ARRAY['student'::text, 'teacher'::text])),
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT classroom_members_pkey PRIMARY KEY (id),
  CONSTRAINT classroom_members_classroom_id_fkey FOREIGN KEY (classroom_id) REFERENCES public.classrooms(id),
  CONSTRAINT classroom_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.classroom_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  classroom_id uuid,
  user_id uuid,
  content text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT classroom_posts_pkey PRIMARY KEY (id),
  CONSTRAINT classroom_posts_classroom_id_fkey FOREIGN KEY (classroom_id) REFERENCES public.classrooms(id),
  CONSTRAINT classroom_posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.classrooms (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text,
  type text CHECK (type = ANY (ARRAY['official'::text, 'unofficial'::text])),
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT classrooms_pkey PRIMARY KEY (id)
);
CREATE TABLE public.connections (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  sender_id uuid,
  receiver_id uuid,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'accepted'::text, 'rejected'::text])),
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT connections_pkey PRIMARY KEY (id),
  CONSTRAINT connections_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id),
  CONSTRAINT connections_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  sender_id uuid,
  receiver_id uuid,
  message text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id),
  CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  content text,
  media_url text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT posts_pkey PRIMARY KEY (id),
  CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  name text,
  email text UNIQUE,
  role text DEFAULT 'student'::text CHECK (role = ANY (ARRAY['student'::text, 'teacher'::text, 'alumni'::text, 'admin'::text])),
  verification_status text DEFAULT 'pending'::text CHECK (verification_status = ANY (ARRAY['pending'::text, 'verified'::text, 'rejected'::text])),
  created_at timestamp without time zone DEFAULT now(),
  trust_score integer DEFAULT 100,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
