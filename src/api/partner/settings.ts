const API_BASE = "/api/partner/settings";

// Profile types
export interface PartnerProfile {
  id: string;
  partner_id: string;
  user_id: string;
  siret?: string | null;
  company_name?: string | null;
  website?: string | null;
  bio?: string | null;
  partner?: {
    id: string;
    name: string;
    type: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    postal_code?: string | null;
    status: string;
  };
  user?: {
    id: string;
    full_name: string;
    email: string;
    phone?: string | null;
    avatar_url?: string | null;
  };
}

export interface UpdateProfileRequest {
  // Partners profile fields
  siret?: string;
  company_name?: string;
  website?: string;
  bio?: string;
  // Partners table fields
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  // Users table fields
  full_name?: string;
  user_phone?: string;
  avatar_url?: string;
}

// Portfolio Project types
export interface PortfolioProject {
  id: string;
  partner_id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  location?: string | null;
  year?: number | null;
  image_url?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  gallery?: PortfolioGalleryItem[];
}

export interface CreatePortfolioProjectRequest {
  name: string;
  description?: string;
  category?: string;
  location?: string;
  year?: string | number;
  image_url?: string;
  status?: string;
}

export interface UpdatePortfolioProjectRequest {
  name?: string;
  description?: string;
  category?: string;
  location?: string;
  year?: string | number;
  image_url?: string;
  status?: string;
}

// Gallery types
export interface PortfolioGalleryItem {
  id: string;
  partner_id: string;
  personal_project_id?: string | null;
  title?: string | null;
  description?: string | null;
  image_url: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface CreateGalleryItemRequest {
  image_url: string;
  title?: string;
  description?: string;
  personal_project_id?: string;
  order_index?: number;
}

export interface UpdateGalleryItemRequest {
  image_url?: string;
  title?: string;
  description?: string;
  order_index?: number;
}

// Testimonial types
export interface Testimonial {
  id: string;
  partner_id: string;
  client_name: string;
  project_name: string;
  text: string;
  rating: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTestimonialRequest {
  client_name: string;
  project_name: string;
  text: string;
  rating?: number;
  date?: string;
}

export interface UpdateTestimonialRequest {
  client_name?: string;
  project_name?: string;
  text?: string;
  rating?: number;
  date?: string;
}

// Certification types
export interface Certification {
  id: string;
  partner_id: string;
  name: string;
  number?: string | null;
  issuing_organization?: string | null;
  issue_date?: string | null;
  expiry_date?: string | null;
  certificate_url?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCertificationRequest {
  name: string;
  number?: string;
  issuing_organization?: string;
  issue_date?: string;
  expiry_date?: string;
  certificate_url?: string;
  status?: string;
}

export interface UpdateCertificationRequest {
  name?: string;
  number?: string;
  issuing_organization?: string;
  issue_date?: string;
  expiry_date?: string;
  certificate_url?: string;
  status?: string;
}

// API Functions
export const settings = {
  // Profile
  async getProfile(): Promise<{ profile: PartnerProfile }> {
    const response = await fetch(`${API_BASE}/profile`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch profile");
    }

    return response.json();
  },

  async updateProfile(
    data: UpdateProfileRequest
  ): Promise<{ profile: PartnerProfile }> {
    const response = await fetch(`${API_BASE}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update profile");
    }

    return response.json();
  },

  // Portfolio Projects
  async getPortfolioProjects(): Promise<{ projects: PortfolioProject[] }> {
    const response = await fetch(`${API_BASE}/portfolio/projects`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch projects");
    }

    return response.json();
  },

  async createPortfolioProject(
    data: CreatePortfolioProjectRequest
  ): Promise<{ project: PortfolioProject }> {
    const response = await fetch(`${API_BASE}/portfolio/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create project");
    }

    return response.json();
  },

  async updatePortfolioProject(
    id: string,
    data: UpdatePortfolioProjectRequest
  ): Promise<{ project: PortfolioProject }> {
    const response = await fetch(`${API_BASE}/portfolio/projects/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update project");
    }

    return response.json();
  },

  async deletePortfolioProject(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE}/portfolio/projects/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete project");
    }

    return response.json();
  },

  // Gallery
  async getGallery(): Promise<{ gallery: PortfolioGalleryItem[] }> {
    const response = await fetch(`${API_BASE}/portfolio/gallery`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch gallery");
    }

    return response.json();
  },

  async createGalleryItem(
    data: CreateGalleryItemRequest
  ): Promise<{ item: PortfolioGalleryItem }> {
    const response = await fetch(`${API_BASE}/portfolio/gallery`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create gallery item");
    }

    return response.json();
  },

  async updateGalleryItem(
    id: string,
    data: UpdateGalleryItemRequest
  ): Promise<{ item: PortfolioGalleryItem }> {
    const response = await fetch(`${API_BASE}/portfolio/gallery/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update gallery item");
    }

    return response.json();
  },

  async deleteGalleryItem(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE}/portfolio/gallery/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete gallery item");
    }

    return response.json();
  },

  // Testimonials
  async getTestimonials(): Promise<{ testimonials: Testimonial[] }> {
    const response = await fetch(`${API_BASE}/testimonials`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch testimonials");
    }

    return response.json();
  },

  async createTestimonial(
    data: CreateTestimonialRequest
  ): Promise<{ testimonial: Testimonial }> {
    const response = await fetch(`${API_BASE}/testimonials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create testimonial");
    }

    return response.json();
  },

  async updateTestimonial(
    id: string,
    data: UpdateTestimonialRequest
  ): Promise<{ testimonial: Testimonial }> {
    const response = await fetch(`${API_BASE}/testimonials/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update testimonial");
    }

    return response.json();
  },

  async deleteTestimonial(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE}/testimonials/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete testimonial");
    }

    return response.json();
  },

  // Certifications
  async getCertifications(): Promise<{ certifications: Certification[] }> {
    const response = await fetch(`${API_BASE}/certifications`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch certifications");
    }

    return response.json();
  },

  async createCertification(
    data: CreateCertificationRequest
  ): Promise<{ certification: Certification }> {
    const response = await fetch(`${API_BASE}/certifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create certification");
    }

    return response.json();
  },

  async updateCertification(
    id: string,
    data: UpdateCertificationRequest
  ): Promise<{ certification: Certification }> {
    const response = await fetch(`${API_BASE}/certifications/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update certification");
    }

    return response.json();
  },

  async deleteCertification(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE}/certifications/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete certification");
    }

    return response.json();
  },
};

