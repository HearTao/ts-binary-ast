import { NodeTypeNameToTypeMap, Variant, VariantValueToTypeMap, VariantTypeToNameMap } from "./types";

export function nameToNodeKindMapper (name: string) {
  if (name in NodeTypeNameToTypeMap) {
    return NodeTypeNameToTypeMap[name as keyof typeof NodeTypeNameToTypeMap]
  }
  return undefined
}

export function nameToVariantMapper (name: string) {
  console.log(name === "var", name.split(','))
  if (name in VariantValueToTypeMap) {
    return Variant[VariantValueToTypeMap[name as keyof typeof VariantValueToTypeMap]]
  }
  return undefined
}
