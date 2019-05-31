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

export function isArrowFunctionBodyExpression(
  body: ts.ConciseBody
): body is ts.Expression {
  return !ts.isBlock(body)
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

export function mapIfDef<T, U>(
  items: ReadonlyArray<T> | undefined,
  cb: (v: T) => U
): U[] {
  if (isDef(items)) {
    return items.map(cb)
  }
  return []
}

export function Assert(expr: boolean, message?: string) {
  if (!expr) {
    throw new Error(message)
  }
}

export function AssertDef<T>(v: T | undefined | null): T {
  if (!isDef(v)) {
    throw new Error('must be defined')
  }
  return v
}

export function first<T>(items: ReadonlyArray<T>): T {
  if (!items.length) {
    throw new Error('must have more than one item')
  }
  return items[0]
}

export function AssertCast<U, T extends U>(v: U, cb: (v: U) => v is T): T {
  if (!cb(v)) {
    throw new Error('cast failed')
  }
  return v
}

export function compose<A, B, C>(
  f: (arg: A) => B,
  g: (arg: B) => C
): (arg: A) => C {
  return x => g(f(x))
}
