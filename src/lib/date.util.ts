export const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("fr-FR");
};

export const formatDateForInput = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch {
    return "";
  }
};
