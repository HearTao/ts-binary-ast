import { NodeType, Variant } from "../types";

export interface Context {
  grammarTable: NodeType[]
  stringsTable: string[]
  variantTable: Map<number, Variant>
}

export interface WritterContext {
  grammarTable: NodeType[]
  stringsTable: string[]
  stringsTableToIndex: Map<string, number>
  variantTableToIndex: Map<Variant, number>
}