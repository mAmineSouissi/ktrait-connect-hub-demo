/**
 * Expense category enum
 */
export enum ExpenseCategory {
  FONDATIONS = "fondations",
  GROS_OEUVRE = "gros_œuvre",
  SECOND_OEUVRE = "second_œuvre",
  FINITIONS = "finitions",
  MAIN_D_OEUVRE = "main_d_œuvre",
  MATERIAUX = "matériaux",
  EQUIPEMENTS = "équipements",
  AUTRES = "autres",
}

export type ExpenseCategoryType =
  | ExpenseCategory.FONDATIONS
  | ExpenseCategory.GROS_OEUVRE
  | ExpenseCategory.SECOND_OEUVRE
  | ExpenseCategory.FINITIONS
  | ExpenseCategory.MAIN_D_OEUVRE
  | ExpenseCategory.MATERIAUX
  | ExpenseCategory.EQUIPEMENTS
  | ExpenseCategory.AUTRES;
