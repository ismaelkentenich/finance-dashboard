import type { NormalizedTransaction } from "@/types";
import type { HTMLMotionProps } from "framer-motion";

export interface TransactionRowProps extends HTMLMotionProps<"tr"> {
  transaction: NormalizedTransaction;
  className?: string;
  "data-testid"?: string;
}
