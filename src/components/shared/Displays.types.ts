export interface DisplayClient {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  projects: number;
  status: string;
  city?: string;
  address?: string;
  postal_code?: string;
  company_name?: string;
  role: string;
}
