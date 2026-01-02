import { users } from "./users";
import { projects } from "./projects";
import { documents } from "./documents";
import { payments } from "./payments";
import { expenses } from "./expenses";
import { phases } from "./phases";
import { gallery } from "./gallery";
import { projectPartners } from "./project-partners";
import { partners } from "./partners";
import { clients } from "./clients";
import { invoices } from "./invoices";
import { invoiceTemplates } from "./invoice-templates";
import { tasks } from "./tasks";
import * as chantiersModule from "./chantiers";

// Export chantiers as an object with all functions
export const chantiers = {
  getChantiers: chantiersModule.getChantiers,
  getChantier: chantiersModule.getChantier,
  createChantier: chantiersModule.createChantier,
  updateChantier: chantiersModule.updateChantier,
  deleteChantier: chantiersModule.deleteChantier,
  // Team
  getTeamMembers: chantiersModule.getTeamMembers,
  createTeamMember: chantiersModule.createTeamMember,
  updateTeamMember: chantiersModule.updateTeamMember,
  deleteTeamMember: chantiersModule.deleteTeamMember,
  // Planning
  getPlanningTasks: chantiersModule.getPlanningTasks,
  createPlanningTask: chantiersModule.createPlanningTask,
  updatePlanningTask: chantiersModule.updatePlanningTask,
  deletePlanningTask: chantiersModule.deletePlanningTask,
  // Gallery
  getGalleryItems: chantiersModule.getGalleryItems,
  createGalleryItem: chantiersModule.createGalleryItem,
  updateGalleryItem: chantiersModule.updateGalleryItem,
  deleteGalleryItem: chantiersModule.deleteGalleryItem,
  // Notes
  getNotes: chantiersModule.getNotes,
  createNote: chantiersModule.createNote,
  updateNote: chantiersModule.updateNote,
  deleteNote: chantiersModule.deleteNote,
};

export const admin = {
  users,
  clients,
  projects,
  documents,
  payments,
  expenses,
  phases,
  gallery,
  projectPartners,
  partners,
  chantiers,
  invoices,
  invoiceTemplates,
  tasks,
};
