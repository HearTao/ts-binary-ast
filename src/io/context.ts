import { NodeType, Variant } from "../types";

export interface Context {
  grammarTable: NodeType[]
  stringsTable: string[]
  variantTable: Map<number, Variant>
}