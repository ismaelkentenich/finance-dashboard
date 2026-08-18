import { TransactionCategory } from "@/types";

export const CATEGORY_LABELS: Record<TransactionCategory, string> = {
  housing: "Housing",
  food: "Food & Groceries",
  transportation: "Transportation",
  utilities: "Utilities & Bills",
  entertainment: "Entertainment",
  healthcare: "Healthcare",
  education: "Education",
  shopping: "Shopping",
  services: "Services",
  salary: "Salary",
  freelance: "Freelance",
  investment: "Investments",
  other: "Other",
};

export const ALL_CATEGORIES = [
  "housing",
  "food",
  "transportation",
  "utilities",
  "entertainment",
  "healthcare",
  "education",
  "shopping",
  "services",
  "salary",
  "freelance",
  "investment",
  "other",
] as const;
