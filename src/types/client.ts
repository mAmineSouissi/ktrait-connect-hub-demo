export type ClientProject = {
  id: number;
  name: string;
  status: string;
  progress: number;
  budget: string;
};

export type ClientDocument = {
  id: number;
  name: string;
  type: string;
  date: string;
};

export type ClientPayment = {
  id: number;
  date: string;
  amount: string;
  status: string;
  description: string;
};

export type Client = {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  projects: number;
  status: string;
  city: string;
  address?: string;
  notes?: string;
  createdAt?: string;
  projectDetails?: ClientProject[];
  documents?: ClientDocument[];
  payments?: ClientPayment[];
};
