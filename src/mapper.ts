import { NodeTypeNameToTypeMap } from "./types";

export function nameToNodeKindMapper (name: string) {
  if (name in NodeTypeNameToTypeMap) {
    return NodeTypeNameToTypeMap[name as keyof typeof NodeTypeNameToTypeMap]
  }
  return undefined
}