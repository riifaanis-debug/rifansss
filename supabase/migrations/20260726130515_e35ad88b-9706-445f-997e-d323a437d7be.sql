
CREATE TYPE public.app_role AS ENUM ('admin','staff');
CREATE TYPE public.request_status AS ENUM ('new','under_review','needs_info','awaiting_payment','in_progress','following_up','completed','cancelled','failed');
CREATE TYPE public.client_type AS ENUM ('individual','establishment','company');

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'FileText',
  price numeric(10,2),
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can read active services" ON public.services FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "admins manage services" ON public.services FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  access_code text NOT NULL,
  full_name text NOT NULL,
  national_id text NOT NULL,
  phone text NOT NULL,
  email text,
  city text NOT NULL,
  client_type public.client_type NOT NULL DEFAULT 'individual',
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  service_title text NOT NULL,
  entity_name text,
  transaction_number text,
  details text,
  preferred_contact text NOT NULL DEFAULT 'phone',
  status public.request_status NOT NULL DEFAULT 'new',
  admin_notes text,
  required_documents text,
  assigned_to text,
  invoice_amount numeric(10,2),
  invoice_paid boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_requests TO authenticated;
GRANT ALL ON public.service_requests TO service_role;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage requests" ON public.service_requests FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER service_requests_updated_at BEFORE UPDATE ON public.service_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.request_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.request_documents TO authenticated;
GRANT ALL ON public.request_documents TO service_role;
ALTER TABLE public.request_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage request documents" ON public.request_documents FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  subject text,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage messages" ON public.contact_messages FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

INSERT INTO public.services (title, description, icon, sort_order) VALUES
('خدمات السجلات التجارية','متابعة إجراءات إصدار وتعديل وتجديد السجلات التجارية وفق متطلبات الجهات المختصة.','FileText',1),
('خدمات المنشآت','متابعة المعاملات والإجراءات المرتبطة بالمنشآت والأنشطة التجارية.','Building2',2),
('خدمات التراخيص','المساعدة في تجهيز ومتابعة طلبات التراخيص والموافقات المطلوبة.','BadgeCheck',3),
('خدمات المنصات الحكومية','متابعة الإجراءات والطلبات المقدمة عبر المنصات الإلكترونية الرسمية.','Landmark',4),
('خدمات المعاملات الإلكترونية','تجهيز ومراجعة البيانات والمستندات اللازمة لتقديم المعاملات إلكترونيًا.','Laptop',5),
('خدمات المتابعة والتعقيب','متابعة حالة المعاملة وإبلاغ العميل بالمستجدات والمتطلبات حتى اكتمالها.','Activity',6);
