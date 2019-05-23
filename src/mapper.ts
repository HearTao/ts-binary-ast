import { NodeTypeNameToTypeMap } from "./types";

export function nameToNodeKindMapper (name: string) {
  console.log(name, (NodeTypeNameToTypeMap as any)[name as any])
  if (name in NodeTypeNameToTypeMap) {
    return NodeTypeNameToTypeMap[name as keyof typeof NodeTypeNameToTypeMap]
  }
  return undefined
}