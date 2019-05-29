import {
  Super,
  Expression,
  NodeType,
  SwitchCase,
  SwitchDefault,
  SpreadElement,
  Binding,
  BindingWithInitializer,
  AssignmentTarget,
  AssignmentTargetPattern
} from './types'
import * as ts from 'typescript'

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

export function isAssignmentTargetPattern(
  node: AssignmentTarget
): node is AssignmentTargetPattern {
  return (
    node.type === NodeType.ObjectAssignmentTarget ||
    node.type === NodeType.ArrayAssignmentTarget
  )
}

export function append<T>(to: T[], item?: T) {
  if (!item) return to
  to.push(item)
  return to
}

export function addModifiers<T extends ts.Declaration | ts.VariableStatement>(
  decl: T,
  flags?: ts.ModifierFlags
) {
  if (!flags) return decl

  const modifiers = ts.getCombinedModifierFlags(decl as ts.Declaration)
  decl.modifiers = ts.createNodeArray(
    ts.createModifiersFromModifierFlags(modifiers & flags)
  )
  return decl
}
