export type VarKind = "bool" | "number" | "string" | "object" | "array" | "unknown";

export interface WorkflowVar {
  name: string;
  kind: VarKind;
  source?: "input" | "step";
  stepId?: number;
}
