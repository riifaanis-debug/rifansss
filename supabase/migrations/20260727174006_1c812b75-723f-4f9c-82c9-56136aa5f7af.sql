-- 1) Remove open storage upload policy (uploads now go through validated server function using service role)
DROP POLICY IF EXISTS "anyone can upload request documents" ON storage.objects;

-- 2) Replace has_role() usage in policies with direct user_roles lookups (RLS on user_roles limits rows to own)
DROP POLICY IF EXISTS "admins read request documents" ON storage.objects;
DROP POLICY IF EXISTS "admins delete request documents" ON storage.objects;
CREATE POLICY "admins read request documents" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'request-documents' AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));
CREATE POLICY "admins delete request documents" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'request-documents' AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

DROP POLICY IF EXISTS "admins manage messages" ON public.contact_messages;
CREATE POLICY "admins manage messages" ON public.contact_messages FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

DROP POLICY IF EXISTS "admins manage request documents" ON public.request_documents;
CREATE POLICY "admins manage request documents" ON public.request_documents FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

DROP POLICY IF EXISTS "admins manage requests" ON public.service_requests;
CREATE POLICY "admins manage requests" ON public.service_requests FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

DROP POLICY IF EXISTS "admins manage services" ON public.services;
CREATE POLICY "admins manage services" ON public.services FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'));

-- 3) Signed-in users can no longer execute SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated, anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.grant_first_admin() FROM authenticated, anon, PUBLIC;