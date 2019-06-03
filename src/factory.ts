import {
  AssertedBlockScope,
  NodeType,
  AssertedBoundNamesScope,
  AssertedParameterScope,
  AssertedVarScope,
  AssertedScriptGlobalScope,
  AssertedMaybePositionalParameterName,
  AssertedDeclaredKind
} from './types'
import * as ts from 'typescript'
import { AssertCast, isDef } from './utils'

export function createAssertedBlockScope(): AssertedBlockScope {
  return {
    type: NodeType.AssertedBlockScope,
    declaredNames: [],
    hasDirectEval: false
  }
}

export function findDeclarations(stmts: ReadonlyArray<ts.Statement>): string[] {
  const variables = stmts
    .filter(ts.isVariableStatement)
    .map(x => x.declarationList)
    .flatMap(x => x.declarations)
    .map(x => x.name)
    .filter(ts.isIdentifier)
    .map(x => x.text)
  const functions = stmts
    .filter(ts.isFunctionDeclaration)
    .map(x => x.name)
    .filter(isDef)
    .map(x => x.text)
  const classes = stmts
    .filter(ts.isClassDeclaration)
    .map(x => x.name)
    .filter(isDef)
    .map(x => x.text)
  return Array.from(new Set([...variables, ...functions, ...classes])).sort(
    (a, b) => a.localeCompare(b)
  )
}

export function createAssertedVarScope(
  stmts: ReadonlyArray<ts.Statement>
): AssertedVarScope {
  return {
    type: NodeType.AssertedVarScope,
    declaredNames: findDeclarations(stmts).map(name => ({
      type: NodeType.AssertedDeclaredName,
      name,
      kind: AssertedDeclaredKind.Var,
      isCaptured: false
    })),
    hasDirectEval: false
  }
}

export function createAssertedBoundNamesScope(): AssertedBoundNamesScope {
  return {
    type: NodeType.AssertedBoundNamesScope,
    boundNames: [],
    hasDirectEval: false
  }
}

export function AssertedMaybePositionalParameterNameUnecmaify(
  params: ReadonlyArray<ts.ParameterDeclaration>
): AssertedMaybePositionalParameterName[] {
  return params.map((param, index) => {
    const name = AssertCast(param.name, ts.isIdentifier).text
    if (param.dotDotDotToken) {
      return {
        type: NodeType.AssertedRestParameterName,
        name,
        isCaptured: false
      }
    } else {
      return {
        type: NodeType.AssertedPositionalParameterName,
        name,
        index,
        isCaptured: false
      }
    }
  })
}

export function createAssertedParameterScope(
  params: ReadonlyArray<ts.ParameterDeclaration>
): AssertedParameterScope {
  return {
    type: NodeType.AssertedParameterScope,
    paramNames: AssertedMaybePositionalParameterNameUnecmaify(params),
    hasDirectEval: false,
    isSimpleParameterList: !params.some(
      param =>
        ts.isArrayBindingPattern(param.name) ||
        ts.isObjectBindingPattern(param.name)
    )
  }
}

export function createAssertedScriptGlobalScope(
  stmts: ReadonlyArray<ts.Statement>
): AssertedScriptGlobalScope {
  return {
    type: NodeType.AssertedScriptGlobalScope,
    declaredNames: findDeclarations(stmts).map(name => ({
      type: NodeType.AssertedDeclaredName,
      name,
      kind: AssertedDeclaredKind.Var,
      isCaptured: false
    })),
    hasDirectEval: false
  }
}
