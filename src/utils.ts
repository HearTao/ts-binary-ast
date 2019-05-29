import {
  Super,
  Expression,
  NodeType,
  SwitchCase,
  SwitchDefault,
  SpreadElement,
  Binding,
  BindingWithInitializer
} from './types'

export function isDef<T>(v: T | null | undefined): v is T {
  return v !== null && v !== undefined
}

export function arrayify<T>(v: T | T[]): T[] {
  return Array.isArray(v) ? v : [v]
}

export function isSuper(node: Super | Expression): node is Super {
  return node.type === NodeType.Super
}

export function isSwitchCase(
  node: SwitchCase | SwitchDefault
): node is SwitchCase {
  return node.type === NodeType.SwitchCase
}

export function isSpreadElement(
  node: SpreadElement | Expression
): node is SpreadElement {
  return node.type === NodeType.SpreadElement
}

export function isBindingWithInitializer(
  node: Binding | BindingWithInitializer
): node is BindingWithInitializer {
  return node.type === NodeType.BindingWithInitializer
}