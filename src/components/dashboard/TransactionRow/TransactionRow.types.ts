import type { Transaction } from "@/types";
import type { HTMLMotionProps } from "framer-motion";

export interface TransactionRowProps extends HTMLMotionProps<"tr"> {
  transaction: Transaction;
  className?: string;
  "data-testid"?: string;
}
