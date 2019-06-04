import { NodeType, Variant } from '../types'

export interface Context {
  grammarTable: NodeType[]
  stringsTable: (string | undefined)[]
  variantTable: Map<number, Variant>
}

export interface WriterContext {
  grammarTable: NodeType[]
  grammarTableToIndex: Map<NodeType, number>
  stringsTable: (string | undefined)[]
  stringsTableToIndex: Map<string | undefined, number>
  variantTableToIndex: Map<Variant | undefined, number>
}
