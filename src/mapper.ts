import { NodeTypeNameToTypeMap, Variant, VariantValueToTypeMap, VariantTypeToNameMap, VariantTypeToValueMap, NodeType, NodeTypeToNameMap } from "./types";

export function nameToNodeKindMapper (name: string) {
  if (name in NodeTypeNameToTypeMap) {
    return NodeTypeNameToTypeMap[name as keyof typeof NodeTypeNameToTypeMap]
  }
  return undefined
}

export function nodeKindToNameMapper(kind: NodeType) {
  if (kind in NodeTypeToNameMap) {
    return NodeTypeToNameMap[kind]
  }
  return undefined
}

export function nameToVariantMapper (name: string) {
  if (name in VariantValueToTypeMap) {
    return Variant[VariantValueToTypeMap[name as keyof typeof VariantValueToTypeMap]]
  }
  return undefined
}

export function variantToValueMapper (variant: Variant) {
  if (variant in VariantTypeToValueMap) {
    return VariantTypeToValueMap[variant]
  }
  return undefined
}
