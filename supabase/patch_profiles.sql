INSERT INTO public.profiles (id, first_name, last_name, phone)
SELECT id, raw_user_meta_data->>'first_name', raw_user_meta_data->>'last_name', raw_user_meta_data->>'whatsapp' 
FROM auth.users
ON CONFLICT (id) DO NOTHING;
