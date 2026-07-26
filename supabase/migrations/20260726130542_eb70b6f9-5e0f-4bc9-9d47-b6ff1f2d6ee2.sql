
CREATE POLICY "anyone can upload request documents" ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'request-documents');
CREATE POLICY "admins read request documents" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'request-documents' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete request documents" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'request-documents' AND public.has_role(auth.uid(),'admin'));
