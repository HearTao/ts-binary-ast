import * as ts from 'typescript'
import {
  Block,
  BreakStatement,
  ContinueStatement,
  ForOfStatement,
  ForStatement,
  IfStatement,
  ForInStatement,
  ClassDeclaration,
  EagerFunctionDeclaration,
  DoWhileStatement,
  LabelledStatement,
  TryCatchStatement,
  VariableDeclaration,
  WithStatement,
  ReturnStatement,
  SwitchStatement,
  ThrowStatement,
  WhileStatement,
  ExpressionStatement,
  EmptyStatement,
  DebuggerStatement,
  Expression,
  LiteralBooleanExpression,
  LiteralNullExpression,
  LiteralRegExpExpression,
  LiteralStringExpression,
  ArrayExpression,
  ArrowExpression,
  BinaryExpression,
  CallExpression,
  ThisExpression,
  Identifier,
  NewExpression,
  NewTargetExpression,
  TemplateExpression,
  YieldExpression,
  AwaitExpression,
  Node,
  IdentifierExpression,
  NodeType,
  ObjectExpression,
  ObjectProperty,
  SpreadElement,
  YieldStarExpression,
  ForInOfBinding,
  AssignmentTarget,
  CatchClause,
  TryFinallyStatement,
  VariableDeclarationKind,
  FrozenArray,
  VariableDeclarator,
  BindingPattern,
  Binding,
  SwitchCase,
  BindingIdentifier,
  SwitchDefault,
  AssignmentTargetPattern,
  SimpleAssignmentTarget,
  ObjectAssignmentTarget,
  AssignmentTargetIdentifier,
  ComputedMemberAssignmentTarget,
  StaticMemberAssignmentTarget,
  AssignmentTargetPropertyIdentifier,
  AssignmentTargetPropertyProperty,
  AssignmentTargetProperty,
  PropertyName,
  AssignmentTargetWithInitializer,
  ArrayAssignmentTarget,
  ComputedPropertyName,
  LiteralPropertyName,
  LiteralNumericExpression,
  StaticMemberExpression,
  ComputedMemberExpression,
  Arguments,
  ConditionalExpression,
  Super,
  Parameter,
  BinaryOperator,
  CompoundAssignmentOperator,
  AssignmentExpression,
  CompoundAssignmentExpression,
  UnaryExpression,
  UpdateExpression,
  UnaryOperator,
  UpdateOperator,
  BindingWithInitializer,
  BindingProperty,
  ObjectBinding,
  ArrayBinding,
  DataProperty,
  ShorthandProperty,
  SwitchStatementWithDefault,
  Method,
  FunctionDeclaration,
  FunctionOrMethodContents,
  FormalParameters,
  Getter,
  Setter,
  GetterContents,
  SetterContents,
  ArrowExpressionContentsWithFunctionBody,
  ArrowExpressionContentsWithExpression,
  FunctionExpression,
  FunctionExpressionContents,
  MethodDefinition,
  ClassElement,
  ClassExpression,
  Script,
  AssertedParameterScope,
  AssertedScriptGlobalScope,
  AssertedDeclaredKind,
  AssertedMaybePositionalParameterName,
  AssertedBoundNamesScope,
  AssertedVarScope,
  AssertedBlockScope,
  AssertedDeclaredName
} from './types'
import {
  mapIfDef,
  Assert,
  AssertDef,
  isDef,
  first,
  AssertCast,
  isArrowFunctionBodyExpression,
  compose,
  last,
  isIdentifierExpression,
  safeCompileRegex,
  lastOrUndefined,
  compareString
} from './utils'

type UpdateExpressionOperator =
  | ts.SyntaxKind.PlusPlusToken
  | ts.SyntaxKind.MinusMinusToken

export type AssignmentTargetPatternEcmaifyType =
  | ts.ObjectLiteralExpression
  | ts.ArrayLiteralExpression
export type SimpleAssignmentTargetEcmaifyType =
  | ts.Identifier
  | ts.ElementAccessExpression
  | ts.PropertyAccessExpression
export type AssignmentTargetEcmaifyType =
  | AssignmentTargetPatternEcmaifyType
  | SimpleAssignmentTargetEcmaifyType

export interface Context {
  declarations: string[]
  declarationsSet: Set<string>
  blockDeclarations: string[]
  blockDeclarationsSet: Set<string>
  captureSet: Set<string>
  hasDirectEval: boolean
}

export interface ContextData {
  declarations: string[]
  blockDeclarations: string[]
  captureSet: Set<string>
  hasDirectEval: boolean
}

export default class Unecmaify {
  context: Context[]

  constructor() {
    this.context = []
  }

  get currentContext() {
    return last(this.context)
  }

  pushContext() {
    this.context.push({
      declarations: [],
      declarationsSet: new Set(),
      captureSet: new Set(),
      blockDeclarations: [],
      blockDeclarationsSet: new Set(),
      hasDirectEval: false
    })
  }

  pushBlockContext() {
    const currentContext = this.currentContext

    this.context.push({
      declarations: currentContext.declarations,
      declarationsSet: currentContext.declarationsSet,
      captureSet: currentContext.captureSet,
      blockDeclarations: [],
      blockDeclarationsSet: new Set(),
      hasDirectEval: false
    })
  }

  popContext() {
    return AssertDef(this.context.pop())
  }

  processContext(context: Context): ContextData {
    return {
      declarations: Array.from(new Set(context.declarations)),
      blockDeclarations: Array.from(new Set(context.blockDeclarations)),
      captureSet: context.captureSet,
      hasDirectEval: context.hasDirectEval
    }
  }

  runInContext<T>(cb: () => T): [T, ContextData] {
    this.pushContext()
    const result = cb()
    const context = this.processContext(this.popContext())
    return [result, context]
  }

  runInBlockContext<T>(cb: () => T): [T, ContextData] {
    this.pushBlockContext()
    const result = cb()
    const context = this.processContext(this.popContext())
    return [result, context]
  }

  markCapture(id: string) {
    for (let i = this.context.length - 1; i >= 0; --i) {
      const ctx = this.context[i]
      if (ctx.declarationsSet.has(id)) {
        if (ctx !== this.currentContext) {
          ctx.captureSet.add(id)
        }
        return
      }
    }
  }

  UnecmaifyOptional<T, U>(v: T | undefined, cb: (v: T) => U): U | undefined {
    return isDef(v) ? cb.call(this, v) : undefined
  }

  UnecmaifyList<T, U>(v: ReadonlyArray<T>, cb: (v: T) => U): U[] {
    return v.map(cb.bind(this))
  }

  Unecmaify(node: ts.Node): Node | Node[] {
    switch (node.kind) {
      case ts.SyntaxKind.Identifier:
        return this.IdentifierUnecmaify(node as ts.Identifier)
      case ts.SyntaxKind.BindingElement:
        return this.BindingElementUnecmaify(node as ts.BindingElement)
      case ts.SyntaxKind.ElementAccessExpression:
        return this.ElementAccessExpressionUnecmaify(
          node as ts.ElementAccessExpression
        )
      case ts.SyntaxKind.PropertyAccessExpression:
        return this.PropertyAccessExpressionUnecmaify(
          node as ts.PropertyAccessExpression
        )
      case ts.SyntaxKind.ArrayBindingPattern:
        return this.ArrayBindingPatternUnecmaify(node as ts.ArrayBindingPattern)
      case ts.SyntaxKind.ObjectBindingPattern:
        return this.ObjectBindingPatternUnecmaify(
          node as ts.ObjectBindingPattern
        )
      case ts.SyntaxKind.BinaryExpression:
        return this.BinaryExpressionUnecmaify(node as ts.BinaryExpression)
      case ts.SyntaxKind.ArrayLiteralExpression:
        return this.ArrayLiteralExpressionUnecmaify(
          node as ts.ArrayLiteralExpression
        )
      case ts.SyntaxKind.ShorthandPropertyAssignment:
        return this.ShorthandPropertyAssignmentUnecmaify(
          node as ts.ShorthandPropertyAssignment
        )
      case ts.SyntaxKind.PropertyAssignment:
        return this.PropertyAssignmentUnecmaify(node as ts.PropertyAssignment)
      case ts.SyntaxKind.ObjectLiteralExpression:
        return this.ObjectLiteralExpressionUnecmaify(
          node as ts.ObjectLiteralExpression
        )
      case ts.SyntaxKind.HeritageClause:
        return this.HeritageClauseUnecmaify(node as ts.HeritageClause)
      case ts.SyntaxKind.ClassExpression:
        return this.ClassExpressionUnecmaify(node as ts.ClassExpression)
      case ts.SyntaxKind.ClassDeclaration:
        return this.ClassDeclarationUnecmaify(node as ts.ClassDeclaration)
      case ts.SyntaxKind.NamedImports:
        return this.NamedImportsUnecmaify(node as ts.NamedImports)
      case ts.SyntaxKind.ImportClause:
        return this.ImportClauseUnecmaify(node as ts.ImportClause)
      case ts.SyntaxKind.ImportDeclaration:
        return this.ImportDeclarationUnecmaify(node as ts.ImportDeclaration)
      case ts.SyntaxKind.ImportSpecifier:
        return this.ImportSpecifierUnecmaify(node as ts.ImportSpecifier)
      case ts.SyntaxKind.ExportDeclaration:
        return this.ExportDeclarationUnecmaify(node as ts.ExportDeclaration)
      case ts.SyntaxKind.NamedExports:
        return this.NamedExportsUnecmaify(node as ts.NamedExports)
      case ts.SyntaxKind.FunctionDeclaration:
        return this.FunctionDeclarationUnecmaify(node as ts.FunctionDeclaration)
      case ts.SyntaxKind.ExportSpecifier:
        return this.ExportSpecifierUnecmaify(node as ts.ExportSpecifier)
      case ts.SyntaxKind.MethodDeclaration:
        return this.MethodDeclarationUnecmaify(node as ts.MethodDeclaration)
      case ts.SyntaxKind.GetAccessor:
        return this.GetAccessorDeclarationUnecmaify(
          node as ts.GetAccessorDeclaration
        )
      case ts.SyntaxKind.SetAccessor:
        return this.SetAccessorDeclarationUnecmaify(
          node as ts.SetAccessorDeclaration
        )
      case ts.SyntaxKind.ComputedPropertyName:
        return this.ComputedPropertyNameUnecmaify(
          node as ts.ComputedPropertyName
        )
      case ts.SyntaxKind.TrueKeyword:
      case ts.SyntaxKind.FalseKeyword:
        return this.BooleanLiteralUnecmaify(node as ts.BooleanLiteral)
      case ts.SyntaxKind.NumericLiteral:
        return this.NumericLiteralUnecmaify(node as ts.NumericLiteral)
      case ts.SyntaxKind.NullKeyword:
        return this.NullLiteralUnecmaify(node as ts.NullLiteral)
      case ts.SyntaxKind.RegularExpressionLiteral:
        return this.RegularExpressionLiteralUnecmaify(
          node as ts.RegularExpressionLiteral
        )
      case ts.SyntaxKind.StringLiteral:
        return this.StringLiteralUnecmaify(node as ts.StringLiteral)
      case ts.SyntaxKind.ArrowFunction:
        return this.ArrowFunctionUnecmaify(node as ts.ArrowFunction)
      case ts.SyntaxKind.CallExpression:
        return this.CallExpressionUnecmaify(node as ts.CallExpression)
      case ts.SyntaxKind.ConditionalExpression:
        return this.ConditionalExpressionUnecmaify(
          node as ts.ConditionalExpression
        )
      case ts.SyntaxKind.FunctionExpression:
        return this.FunctionExpressionUnecmaify(node as ts.FunctionExpression)
      case ts.SyntaxKind.NewExpression:
        return this.NewExpressionUnecmaify(node as ts.NewExpression)
      case ts.SyntaxKind.MetaProperty:
        return this.MetaPropertyUnecmaify(node as ts.MetaProperty)
      case ts.SyntaxKind.PrefixUnaryExpression:
        return this.PrefixUnaryExpressionUnecmaify(
          node as ts.PrefixUnaryExpression
        )
      case ts.SyntaxKind.PostfixUnaryExpression:
        return this.PostfixUnaryExpressionUnecmaify(
          node as ts.PostfixUnaryExpression
        )
      case ts.SyntaxKind.TemplateExpression:
        return this.TemplateExpressionUnecmaify(node as ts.TemplateExpression)
      case ts.SyntaxKind.ThisKeyword:
        return this.ThisExpressionUnecmaify(node as ts.ThisExpression)
      case ts.SyntaxKind.YieldExpression:
        return this.YieldExpressionUnecmaify(node as ts.YieldExpression)
      case ts.SyntaxKind.AwaitExpression:
        return this.AwaitExpressionUnecmaify(node as ts.AwaitExpression)
      case ts.SyntaxKind.BreakStatement:
        return this.BreakStatementUnecmaify(node as ts.BreakStatement)
      case ts.SyntaxKind.ContinueStatement:
        return this.ContinueStatementUnecmaify(node as ts.ContinueStatement)
      case ts.SyntaxKind.DebuggerStatement:
        return this.DebuggerStatementUnecmaify(node as ts.DebuggerStatement)
      case ts.SyntaxKind.DoStatement:
        return this.DoStatementUnecmaify(node as ts.DoStatement)
      case ts.SyntaxKind.EmptyStatement:
        return this.EmptyStatementUnecmaify(node as ts.EmptyStatement)
      case ts.SyntaxKind.ExpressionStatement:
        return this.ExpressionStatementUnecmaify(node as ts.ExpressionStatement)
      case ts.SyntaxKind.ForInStatement:
        return this.ForInStatementUnecmaify(node as ts.ForInStatement)
      case ts.SyntaxKind.ForOfStatement:
        return this.ForOfStatementUnecmaify(node as ts.ForOfStatement)
      case ts.SyntaxKind.ForStatement:
        return this.ForStatementUnecmaify(node as ts.ForStatement)
      case ts.SyntaxKind.IfStatement:
        return this.IfStatementUnecmaify(node as ts.IfStatement)
      case ts.SyntaxKind.LabeledStatement:
        return this.LabeledStatementUnecmaify(node as ts.LabeledStatement)
      case ts.SyntaxKind.ReturnStatement:
        return this.ReturnStatementUnecmaify(node as ts.ReturnStatement)
      case ts.SyntaxKind.CaseBlock:
        return this.CaseBlockUnecmaify(node as ts.CaseBlock)
      case ts.SyntaxKind.DefaultClause:
        return this.DefaultClauseUnecmaify(node as ts.DefaultClause)
      case ts.SyntaxKind.SwitchStatement:
        return this.SwitchStatementUnecmaify(node as ts.SwitchStatement)
      case ts.SyntaxKind.ThrowStatement:
        return this.ThrowStatementUnecmaify(node as ts.ThrowStatement)
      case ts.SyntaxKind.TryStatement:
        return this.TryStatementUnecmaify(node as ts.TryStatement)
      case ts.SyntaxKind.WhileStatement:
        return this.WhileStatementUnecmaify(node as ts.WhileStatement)
      case ts.SyntaxKind.WithStatement:
        return this.WithStatementUnecmaify(node as ts.WithStatement)
      case ts.SyntaxKind.Block:
        return this.BlockUnecmaify(node as ts.Block)
      case ts.SyntaxKind.CatchClause:
        return this.CatchClauseUnecmaify(node as ts.CatchClause)
      case ts.SyntaxKind.Parameter:
        return this.ParameterDeclarationUnecmaify(
          node as ts.ParameterDeclaration
        )
      case ts.SyntaxKind.SourceFile:
        return this.SourceFileUnecmaify(node as ts.SourceFile)
      case ts.SyntaxKind.SpreadElement:
        return this.SpreadElementUnecmaify(node as ts.SpreadElement)
      case ts.SyntaxKind.SuperKeyword:
        return this.SuperExpressionUnecmaify(node as ts.SuperExpression)
      case ts.SyntaxKind.CaseClause:
        return this.CaseClauseUnecmaify(node as ts.CaseClause)
      case ts.SyntaxKind.DefaultClause:
        return this.DefaultClauseUnecmaify(node as ts.DefaultClause)
      case ts.SyntaxKind.TemplateSpan:
        return this.TemplateSpanUnecmaify(node as ts.TemplateSpan)
      case ts.SyntaxKind.VariableDeclarationList:
        return this.VariableDeclarationListUnecmaify(
          node as ts.VariableDeclarationList
        )
      case ts.SyntaxKind.VariableStatement:
        return this.VariableStatementUnecmaify(node as ts.VariableStatement)
      case ts.SyntaxKind.VariableDeclaration:
        return this.VariableDeclarationUnecmaify(node as ts.VariableDeclaration)
      case ts.SyntaxKind.DeleteExpression:
        return this.DeleteExpressionUnecmaify(node as ts.DeleteExpression)
      case ts.SyntaxKind.TypeOfExpression:
        return this.TypeOfExpressionUnecmaify(node as ts.TypeOfExpression)
      case ts.SyntaxKind.VoidExpression:
        return this.VoidExpressionUnecmaify(node as ts.VoidExpression)
      default:
        throw new Error('Unexpected kind')
    }
  }

  StatementUnecmaify(stmt: ts.Statement) {
    switch (stmt.kind) {
      case ts.SyntaxKind.Block:
        return this.BlockUnecmaify(stmt as ts.Block)
      case ts.SyntaxKind.BreakStatement:
        return this.BreakStatementUnecmaify(stmt as ts.BreakStatement)
      case ts.SyntaxKind.ContinueStatement:
        return this.ContinueStatementUnecmaify(stmt as ts.ContinueStatement)
      case ts.SyntaxKind.ClassDeclaration:
        return this.ClassDeclarationUnecmaify(stmt as ts.ClassDeclaration)
      case ts.SyntaxKind.DebuggerStatement:
        return this.DebuggerStatementUnecmaify(stmt as ts.DebuggerStatement)
      case ts.SyntaxKind.EmptyStatement:
        return this.EmptyStatementUnecmaify(stmt as ts.EmptyStatement)
      case ts.SyntaxKind.ExpressionStatement:
        return this.ExpressionStatementUnecmaify(stmt as ts.ExpressionStatement)
      case ts.SyntaxKind.FunctionDeclaration:
        return this.FunctionDeclarationUnecmaify(stmt as ts.FunctionDeclaration)
      case ts.SyntaxKind.IfStatement:
        return this.IfStatementUnecmaify(stmt as ts.IfStatement)
      case ts.SyntaxKind.DoStatement:
        return this.DoStatementUnecmaify(stmt as ts.DoStatement)
      case ts.SyntaxKind.ForInStatement:
        return this.ForInStatementUnecmaify(stmt as ts.ForInStatement)
      case ts.SyntaxKind.ForOfStatement:
        return this.ForOfStatementUnecmaify(stmt as ts.ForOfStatement)
      case ts.SyntaxKind.ForStatement:
        return this.ForStatementUnecmaify(stmt as ts.ForStatement)
      case ts.SyntaxKind.WhileStatement:
        return this.WhileStatementUnecmaify(stmt as ts.WhileStatement)
      case ts.SyntaxKind.LabeledStatement:
        return this.LabeledStatementUnecmaify(stmt as ts.LabeledStatement)
      case ts.SyntaxKind.ReturnStatement:
        return this.ReturnStatementUnecmaify(stmt as ts.ReturnStatement)
      case ts.SyntaxKind.SwitchStatement:
        return this.SwitchStatementUnecmaify(stmt as ts.SwitchStatement)
      case ts.SyntaxKind.ThrowStatement:
        return this.ThrowStatementUnecmaify(stmt as ts.ThrowStatement)
      case ts.SyntaxKind.TryStatement:
        return this.TryStatementUnecmaify(stmt as ts.TryStatement)
      case ts.SyntaxKind.VariableStatement:
        return this.VariableStatementUnecmaify(stmt as ts.VariableStatement)
      case ts.SyntaxKind.WithStatement:
        return this.WithStatementUnecmaify(stmt as ts.WithStatement)
      default:
        throw new Error('Unexpected kind: ' + stmt.kind)
    }
  }

  ExpressionUnecmaify(node: ts.Expression): Expression {
    switch (node.kind) {
      case ts.SyntaxKind.TrueKeyword:
      case ts.SyntaxKind.FalseKeyword:
        return this.BooleanLiteralUnecmaify(node as ts.BooleanLiteral)
      case ts.SyntaxKind.NullKeyword:
        return this.NullLiteralUnecmaify(node as ts.NullLiteral)
      case ts.SyntaxKind.NumericLiteral:
        return this.NumericLiteralUnecmaify(node as ts.NumericLiteral)
      case ts.SyntaxKind.RegularExpressionLiteral:
        return this.RegularExpressionLiteralUnecmaify(
          node as ts.RegularExpressionLiteral
        )
      case ts.SyntaxKind.StringLiteral:
        return this.StringLiteralUnecmaify(node as ts.StringLiteral)
      case ts.SyntaxKind.ArrayLiteralExpression:
        return this.ArrayLiteralExpressionUnecmaify(
          node as ts.ArrayLiteralExpression
        )
      case ts.SyntaxKind.ArrowFunction:
        return this.ArrowFunctionUnecmaify(node as ts.ArrowFunction)
      case ts.SyntaxKind.BinaryExpression:
        return this.BinaryExpressionUnecmaify(node as ts.BinaryExpression)
      case ts.SyntaxKind.CallExpression:
        return this.CallExpressionUnecmaify(node as ts.CallExpression)
      case ts.SyntaxKind.ElementAccessExpression:
        return this.ElementAccessExpressionUnecmaify(
          node as ts.ElementAccessExpression
        )
      case ts.SyntaxKind.ConditionalExpression:
        return this.ConditionalExpressionUnecmaify(
          node as ts.ConditionalExpression
        )
      case ts.SyntaxKind.ClassExpression:
        return this.ClassExpressionUnecmaify(node as ts.ClassExpression)
      case ts.SyntaxKind.FunctionExpression:
        return this.FunctionExpressionUnecmaify(node as ts.FunctionExpression)
      case ts.SyntaxKind.Identifier:
        return this.IdentifierUnecmaify(node as ts.Identifier)
      case ts.SyntaxKind.NewExpression:
        return this.NewExpressionUnecmaify(node as ts.NewExpression)
      case ts.SyntaxKind.MetaProperty:
        return this.MetaPropertyUnecmaify(node as ts.MetaProperty)
      case ts.SyntaxKind.ObjectLiteralExpression:
        return this.ObjectLiteralExpressionUnecmaify(
          node as ts.ObjectLiteralExpression
        )
      case ts.SyntaxKind.PrefixUnaryExpression:
        return this.PrefixUnaryExpressionUnecmaify(
          node as ts.PrefixUnaryExpression
        )
      case ts.SyntaxKind.PostfixUnaryExpression:
        return this.PostfixUnaryExpressionUnecmaify(
          node as ts.PostfixUnaryExpression
        )
      case ts.SyntaxKind.PropertyAccessExpression:
        return this.PropertyAccessExpressionUnecmaify(
          node as ts.PropertyAccessExpression
        )
      case ts.SyntaxKind.TaggedTemplateExpression:
      case ts.SyntaxKind.TemplateExpression:
        return this.TemplateExpressionUnecmaify(node as
          | ts.TaggedTemplateExpression
          | ts.TemplateExpression)
      case ts.SyntaxKind.ThisKeyword:
        return this.ThisExpressionUnecmaify(node as ts.ThisExpression)
      case ts.SyntaxKind.YieldExpression:
        return this.YieldExpressionUnecmaify(node as ts.YieldExpression)
      case ts.SyntaxKind.AwaitExpression:
        return this.AwaitExpressionUnecmaify(node as ts.AwaitExpression)
      case ts.SyntaxKind.DeleteExpression:
        return this.DeleteExpressionUnecmaify(node as ts.DeleteExpression)
      case ts.SyntaxKind.TypeOfExpression:
        return this.TypeOfExpressionUnecmaify(node as ts.TypeOfExpression)
      case ts.SyntaxKind.VoidExpression:
        return this.VoidExpressionUnecmaify(node as ts.VoidExpression)
      case ts.SyntaxKind.ParenthesizedExpression:
        return this.ParenthesizedExpressionUnecmaify(node as ts.ParenthesizedExpression)
      default:
        throw new Error('Unexpected expression: ' + node.kind)
    }
  }

  ParenthesizedExpressionUnecmaify(node: ts.ParenthesizedExpression) {
    return this.ExpressionUnecmaify(node.expression)
  }

  createAssertedBlockScope(context: ContextData): AssertedBlockScope {
    return {
      type: NodeType.AssertedBlockScope,
      declaredNames: context.blockDeclarations.sort(compareString).map(name => ({
        type: NodeType.AssertedDeclaredName,
        name,
        isCaptured: context.captureSet.has(name) ,
        kind: AssertedDeclaredKind.Var
      })),
      hasDirectEval: context.hasDirectEval
    }
  }

  createAssertedVarScope(context: ContextData): AssertedVarScope {
    return {
      type: NodeType.AssertedVarScope,
      declaredNames: context.declarations.sort(compareString).map(name => ({
        type: NodeType.AssertedDeclaredName,
        name,
        kind: AssertedDeclaredKind.Var,
        isCaptured: context.captureSet.has(name)
      })),
      hasDirectEval: context.hasDirectEval
    }
  }

  createAssertedBoundNamesScope(context: ContextData): AssertedBoundNamesScope {
    return {
      type: NodeType.AssertedBoundNamesScope,
      boundNames: context.declarations.sort(compareString).map(name => ({
        type: NodeType.AssertedBoundName,
        name,
        isCaptured: context.captureSet.has(name)
      })),
      hasDirectEval: context.hasDirectEval
    }
  }

  AssertedMaybePositionalParameterNameUnecmaify(
    params: ReadonlyArray<ts.ParameterDeclaration>,
    context: ContextData
  ): AssertedMaybePositionalParameterName[] {
    return params.map((param, index) => {
      const name = context.declarations[index]
      const isCaptured = context.captureSet.has(name)
      if (param.dotDotDotToken) {
        return {
          type: NodeType.AssertedRestParameterName,
          name,
          isCaptured
        }
      } else {
        return {
          type: NodeType.AssertedPositionalParameterName,
          name,
          index,
          isCaptured
        }
      }
    })
  }

  createAssertedParameterScope(
    params: ReadonlyArray<ts.ParameterDeclaration>,
    context: ContextData
  ): AssertedParameterScope {
    return {
      type: NodeType.AssertedParameterScope,
      paramNames: this.AssertedMaybePositionalParameterNameUnecmaify(params, context),
      hasDirectEval: context.hasDirectEval,
      isSimpleParameterList: !params.some(
        param =>
          ts.isArrayBindingPattern(param.name) ||
          ts.isObjectBindingPattern(param.name)
      )
    }
  }

  createAssertedScriptGlobalScope(context: ContextData): AssertedScriptGlobalScope {
    return {
      type: NodeType.AssertedScriptGlobalScope,
      declaredNames: context.declarations.sort(compareString).map(name => ({
        type: NodeType.AssertedDeclaredName,
        name,
        kind: AssertedDeclaredKind.Var,
        isCaptured: context.captureSet.has(name)
      })),
      hasDirectEval: context.hasDirectEval
    }
  }

  ExpressionListUnecmaify(nodes: ReadonlyArray<ts.Expression>) {
    return this.UnecmaifyList(nodes, this.ExpressionUnecmaify)
  }

  StatementListUnecmaify(nodes: ReadonlyArray<ts.Statement>) {
    return this.UnecmaifyList(nodes, this.StatementUnecmaify)
  }

  ArgumentsUnecmaify(args: ReadonlyArray<ts.Expression>): Arguments {
    return this.UnecmaifyList(args, this.SpreadElementOrExpressionUnecmaify)
  }

  SpreadElementOrExpressionListUnecmaify(
    nodes: ReadonlyArray<ts.Expression>
  ): FrozenArray<SpreadElement | Expression> {
    return this.UnecmaifyList(nodes, this.SpreadElementOrExpressionUnecmaify)
  }

  SpreadElementOrExpressionUnecmaify(
    node: ts.Expression
  ): SpreadElement | Expression {
    switch (node.kind) {
      case ts.SyntaxKind.SpreadElement:
        return this.SpreadElementUnecmaify(node as ts.SpreadElement)
      default:
        return this.ExpressionUnecmaify(node)
    }
  }

  BindingElementListUnecmaify(nodes: ReadonlyArray<ts.BindingElement>) {
    return this.UnecmaifyList(nodes, this.BindingElementUnecmaify)
  }

  BindingElementUnecmaify(
    node: ts.BindingElement
  ): Binding | BindingWithInitializer {
    if (node.initializer) {
      return {
        type: NodeType.BindingWithInitializer,
        binding: this.BindingNameUnecmaify(node.name),
        init: this.ExpressionUnecmaify(node.initializer)
      }
    }
    return this.BindingNameUnecmaify(node.name)
  }

  BindingNameToBindingOrBindingWithInitializer(
    node: ts.BindingName
  ): Binding | BindingWithInitializer {
    switch (node.kind) {
      case ts.SyntaxKind.Identifier:
        return this.IdentifierToBindingIdentifierUnecmaify(node)
      case ts.SyntaxKind.ArrayBindingPattern:
      case ts.SyntaxKind.ObjectBindingPattern:
        return this.BindingPatternUnecmaify(node)
    }
  }

  BindingPropertyUnecmaify(node: ts.BindingElement): BindingProperty {
    if (node.initializer) {
      return {
        type: NodeType.BindingPropertyIdentifier,
        binding: this.IdentifierToBindingIdentifierUnecmaify(
          AssertCast(node.name, ts.isIdentifier)
        ),
        init: this.ExpressionUnecmaify(node.initializer)
      }
    }
    return {
      type: NodeType.BindingPropertyProperty,
      binding: this.BindingNameToBindingOrBindingWithInitializer(node.name),
      name: this.PropertyNameUnecmaify(AssertDef(node.propertyName))
    }
  }

  ArrayBindingElementListUnecmaify(
    nodes: ReadonlyArray<ts.ArrayBindingElement>
  ): FrozenArray<Binding | BindingWithInitializer> {
    return this.UnecmaifyList(nodes, this.ArrayBindingElementUnecmaify)
  }

  ArrayBindingElementUnecmaify(node: ts.ArrayBindingElement) {
    switch (node.kind) {
      case ts.SyntaxKind.OmittedExpression:
        throw new Error('Unexpected omitted')
      case ts.SyntaxKind.BindingElement:
        return this.BindingElementUnecmaify(node)
    }
  }

  BindingPropertyListUnecmaify(
    nodes: ReadonlyArray<ts.BindingElement>
  ): FrozenArray<BindingProperty> {
    return this.UnecmaifyList(nodes, this.BindingPropertyUnecmaify)
  }

  ArrayBindingPatternUnecmaify(node: ts.ArrayBindingPattern): ArrayBinding {
    return {
      type: NodeType.ArrayBinding,
      elements: this.ArrayBindingElementListUnecmaify(node.elements),
      rest: undefined
    }
  }

  ObjectBindingPatternUnecmaify(node: ts.ObjectBindingPattern): ObjectBinding {
    return {
      type: NodeType.ObjectBinding,
      properties: this.BindingPropertyListUnecmaify(node.elements)
    }
  }
  ShorthandPropertyAssignmentUnecmaify(
    node: ts.ShorthandPropertyAssignment
  ): ShorthandProperty {
    return {
      type: NodeType.ShorthandProperty,
      name: this.IdentifierToIdentifierExpressionUnecmaify(node.name)
    }
  }

  PropertyAssignmentUnecmaify(node: ts.PropertyAssignment): DataProperty {
    return {
      type: NodeType.DataProperty,
      name: this.PropertyNameUnecmaify(node.name),
      expression: this.ExpressionUnecmaify(node.initializer)
    }
  }

  HeritageClauseSuperUnecmaify(
    node: ReadonlyArray<ts.HeritageClause>
  ): Expression {
    return this.HeritageClauseUnecmaify(first(node))
  }

  HeritageClauseUnecmaify(node: ts.HeritageClause): Expression {
    return this.ExpressionUnecmaify(first(node.types).expression)
  }

  NamedImportsUnecmaify(node: ts.NamedImports): any { }

  ImportClauseUnecmaify(node: ts.ImportClause): any { }

  ImportDeclarationUnecmaify(node: ts.ImportDeclaration): any { }

  ImportSpecifierUnecmaify(node: ts.ImportSpecifier): any { }

  ExportDeclarationUnecmaify(node: ts.ExportDeclaration): any { }

  NamedExportsUnecmaify(node: ts.NamedExports): any { }

  ExportSpecifierUnecmaify(node: ts.ExportSpecifier): any { }

  MethodDeclarationUnecmaify(node: ts.MethodDeclaration): Method {
    return {
      type: NodeType.EagerMethod,
      name: this.PropertyNameUnecmaify(node.name),
      isAsync: !!(ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Async),
      isGenerator: !!node.asteriskToken,
      contents: this.FunctionOrMethodContentsUnecmaify(node),
      directives: [],
      length: node.parameters.length
    }
  }

  DeleteExpressionUnecmaify(node: ts.DeleteExpression): UnaryExpression {
    return {
      type: NodeType.UnaryExpression,
      operator: UnaryOperator.Delete,
      operand: this.ExpressionUnecmaify(node.expression)
    }
  }

  TypeOfExpressionUnecmaify(node: ts.TypeOfExpression): UnaryExpression {
    return {
      type: NodeType.UnaryExpression,
      operator: UnaryOperator.TypeOf,
      operand: this.ExpressionUnecmaify(node.expression)
    }
  }

  VoidExpressionUnecmaify(node: ts.VoidExpression): UnaryExpression {
    return {
      type: NodeType.UnaryExpression,
      operator: UnaryOperator.Void,
      operand: this.ExpressionUnecmaify(node.expression)
    }
  }

  GetterContentsUnecmaify(node: ts.GetAccessorDeclaration): GetterContents {
    const stmts = AssertDef(node.body).statements
    const [body, context] = this.runInContext(() => this.StatementListUnecmaify(stmts))

    return {
      type: NodeType.GetterContents,
      body,
      bodyScope: this.createAssertedVarScope(context),
      isThisCaptured: false
    }
  }

  GetAccessorDeclarationUnecmaify(node: ts.GetAccessorDeclaration): Getter {
    return {
      type: NodeType.EagerGetter,
      name: this.PropertyNameUnecmaify(node.name),
      directives: [],
      contents: this.GetterContentsUnecmaify(node)
    }
  }

  SetterContentsUnecmaify(node: ts.SetAccessorDeclaration): SetterContents {
    const stmts = AssertDef(node.body).statements
    const [body, context] = this.runInContext(() => this.StatementListUnecmaify(stmts))
    const [param, paramContext] = this.runInContext(() => this.ParameterDeclarationUnecmaify(first(node.parameters)))
    const paramSet = new Set(paramContext.declarations)
    context.declarations = context.declarations.filter(x => !paramSet.has(x))

    return {
      type: NodeType.SetterContents,
      param,
      parameterScope: this.createAssertedParameterScope(node.parameters, paramContext),
      body,
      bodyScope: this.createAssertedVarScope(context),
      isThisCaptured: false
    }
  }

  SetAccessorDeclarationUnecmaify(node: ts.SetAccessorDeclaration): Setter {
    return {
      type: NodeType.EagerSetter,
      name: this.PropertyNameUnecmaify(node.name),
      length: node.parameters.length,
      directives: [],
      contents: this.SetterContentsUnecmaify(node)
    }
  }

  UpdateOperatorUnecmaify(node: UpdateExpressionOperator): UpdateOperator {
    switch (node) {
      case ts.SyntaxKind.PlusPlusToken:
        return UpdateOperator.PlusPlus
      case ts.SyntaxKind.MinusMinusToken:
        return UpdateOperator.MinusMinus
    }
  }

  UpdateExpressionUnecmaify(
    node: ts.PostfixUnaryExpression | ts.PrefixUnaryExpression,
    isPrefix: boolean
  ): UpdateExpression {
    switch (node.operator) {
      case ts.SyntaxKind.PlusPlusToken:
      case ts.SyntaxKind.MinusMinusToken:
        return {
          type: NodeType.UpdateExpression,
          isPrefix,
          operator: this.UpdateOperatorUnecmaify(node.operator),
          operand: this.ExpressionToSimpleAssignmentTargetUnecmaify(
            node.operand
          )
        }
      default:
        throw new Error('Unecpected operator')
    }
  }

  PrefixUnaryOperatorUnecmaify(
    node: Exclude<ts.PrefixUnaryOperator, UpdateExpressionOperator>
  ): UnaryOperator {
    switch (node) {
      case ts.SyntaxKind.PlusToken:
        return UnaryOperator.Plus
      case ts.SyntaxKind.MinusToken:
        return UnaryOperator.Minus
      case ts.SyntaxKind.TildeToken:
        return UnaryOperator.Not
      case ts.SyntaxKind.ExclamationToken:
        return UnaryOperator.Not
    }
  }

  UnaryExpressionUnecmaify(node: ts.PrefixUnaryExpression): UnaryExpression {
    switch (node.operator) {
      case ts.SyntaxKind.PlusPlusToken:
      case ts.SyntaxKind.MinusMinusToken:
        throw new Error('Unecpected operator')
      default:
        return {
          type: NodeType.UnaryExpression,
          operator: this.PrefixUnaryOperatorUnecmaify(node.operator),
          operand: this.ExpressionUnecmaify(node.operand)
        }
    }
  }

  PrefixUnaryExpressionUnecmaify(
    node: ts.PrefixUnaryExpression
  ): UnaryExpression | UpdateExpression {
    switch (node.operator) {
      case ts.SyntaxKind.PlusPlusToken:
      case ts.SyntaxKind.MinusMinusToken:
        return this.UpdateExpressionUnecmaify(node, true)
      default:
        return this.UnaryExpressionUnecmaify(node)
    }
  }

  PostfixUnaryExpressionUnecmaify(
    node: ts.PostfixUnaryExpression
  ): UpdateExpression {
    return this.UpdateExpressionUnecmaify(node, false)
  }

  CaseOrDefaultClauseUnecmaify(
    node: ts.CaseOrDefaultClause
  ): SwitchCase | SwitchDefault {
    switch (node.kind) {
      case ts.SyntaxKind.CaseClause:
        return this.CaseClauseUnecmaify(node)
      case ts.SyntaxKind.DefaultClause:
        return this.DefaultClauseUnecmaify(node)
    }
  }

  CaseBlockUnecmaify(node: ts.CaseBlock): Array<SwitchCase | SwitchDefault> {
    return this.UnecmaifyList(node.clauses, this.CaseOrDefaultClauseUnecmaify)
  }

  CatchClauseUnecmaify(node: ts.CatchClause): CatchClause {
    const declaration = AssertDef(node.variableDeclaration)
    const [ binding, context ] = this.runInContext(() => this.BindingNameUnecmaify(declaration.name))
    return {
      type: NodeType.CatchClause,
      binding,
      bindingScope: this.createAssertedBoundNamesScope(context),
      body: this.BlockUnecmaify(node.block)
    }
  }

  ParameterDeclarationListUnecmaify(
    nodes: ReadonlyArray<ts.ParameterDeclaration>
  ) {
    return this.UnecmaifyList(nodes, this.ParameterDeclarationUnecmaify)
  }

  ParameterDeclarationUnecmaify(node: ts.ParameterDeclaration): Parameter {
    if (node.initializer) {
      return {
        type: NodeType.BindingWithInitializer,
        binding: this.BindingNameUnecmaify(node.name),
        init: this.ExpressionUnecmaify(node.initializer)
      }
    } else {
      return this.BindingNameUnecmaify(node.name)
    }
  }

  SourceFileUnecmaify(node: ts.SourceFile): Script {
    const [statements, context] = this.runInContext(() => this.StatementListUnecmaify(node.statements))
    return {
      type: NodeType.Script,
      directives: [],
      scope: this.createAssertedScriptGlobalScope(context),
      statements
    }
  }

  SpreadElementUnecmaify(node: ts.SpreadElement): SpreadElement {
    return {
      type: NodeType.SpreadElement,
      expression: this.ExpressionUnecmaify(node.expression)
    }
  }
  SuperExpressionUnecmaify(node: ts.SuperExpression): Super {
    return {
      type: NodeType.Super
    }
  }

  CaseClauseUnecmaify(node: ts.CaseClause): SwitchCase {
    return {
      type: NodeType.SwitchCase,
      test: this.ExpressionUnecmaify(node.expression),
      consequent: this.StatementListUnecmaify(node.statements)
    }
  }

  DefaultClauseUnecmaify(node: ts.DefaultClause): SwitchDefault {
    return {
      type: NodeType.SwitchDefault,
      consequent: this.StatementListUnecmaify(node.statements)
    }
  }

  TemplateSpanUnecmaify(node: ts.TemplateSpan): any { }

  BooleanLiteralUnecmaify(node: ts.BooleanLiteral): LiteralBooleanExpression {
    return {
      type: NodeType.LiteralBooleanExpression,
      value: node.kind === ts.SyntaxKind.TrueKeyword
    }
  }

  NullLiteralUnecmaify(node: ts.NullLiteral): LiteralNullExpression {
    return {
      type: NodeType.LiteralNullExpression
    }
  }

  NumericLiteralUnecmaify(node: ts.NumericLiteral): LiteralNumericExpression {
    return {
      type: NodeType.LiteralNumericExpression,
      value: +node.text
    }
  }

  RegularExpressionLiteralUnecmaify(
    node: ts.RegularExpressionLiteral
  ): LiteralRegExpExpression {
    const [ pattern, flags ] = safeCompileRegex(node.text)
    return {
      type: NodeType.LiteralRegExpExpression,
      pattern,
      flags
    }
  }

  StringLiteralUnecmaify(node: ts.StringLiteral): LiteralStringExpression {
    return {
      type: NodeType.LiteralStringExpression,
      value: node.text
    }
  }

  ArrayLiteralExpressionUnecmaify(
    node: ts.ArrayLiteralExpression
  ): ArrayExpression {
    return {
      type: NodeType.ArrayExpression,
      elements: this.SpreadElementOrExpressionListUnecmaify(node.elements)
    }
  }

  ArrowExpressionContentsWithFunctionBodyUnecmaify(
    node: ts.ArrowFunction
  ): ArrowExpressionContentsWithFunctionBody {
    const stmts = AssertCast(AssertDef(node.body), ts.isBlock).statements
    const [body, context] = this.runInContext(() => this.StatementListUnecmaify(stmts))
    const [params, paramsContext] = this.runInContext(() => this.FormalParametersUnecmaify(node.parameters))
    const paramsSet = new Set(paramsContext.declarations)
    context.declarations = context.declarations.filter(x => !paramsSet.has(x))

    return {
      type: NodeType.ArrowExpressionContentsWithFunctionBody,
      params,
      body,
      bodyScope: this.createAssertedVarScope(context),
      parameterScope: this.createAssertedParameterScope(node.parameters, paramsContext)
    }
  }

  ArrowExpressionContentsWithExpressionUnecmaify(
    node: ts.ArrowFunction
  ): ArrowExpressionContentsWithExpression {
    const [body, context] = this.runInContext(() => this.ExpressionUnecmaify(
      AssertCast(AssertDef(node.body), isArrowFunctionBodyExpression)
    ))
    const [params, paramsContext] = this.runInContext(() => this.FormalParametersUnecmaify(node.parameters))
    const paramsSet = new Set(paramsContext.declarations)
    context.declarations = context.declarations.filter(x => !paramsSet.has(x))

    return {
      type: NodeType.ArrowExpressionContentsWithExpression,
      params,
      body,
      bodyScope: this.createAssertedVarScope(context),
      parameterScope: this.createAssertedParameterScope(node.parameters, paramsContext)
    }
  }

  ArrowFunctionUnecmaify(node: ts.ArrowFunction): ArrowExpression {
    if (ts.isBlock(node.body)) {
      return {
        type: NodeType.EagerArrowExpressionWithFunctionBody,
        isAsync: !!(ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Async),
        contents: this.ArrowExpressionContentsWithFunctionBodyUnecmaify(node),
        length: node.parameters.length,
        directives: []
      }
    }
    return {
      type: NodeType.EagerArrowExpressionWithExpression,
      isAsync: !!(ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Async),
      contents: this.ArrowExpressionContentsWithExpressionUnecmaify(node),
      length: node.parameters.length
    }
  }

  BinaryOperatorUnecmaify(
    node: ts.CompoundAssignmentOperator
  ): CompoundAssignmentOperator
  BinaryOperatorUnecmaify(
    node: Exclude<
      ts.BinaryOperator,
      ts.CompoundAssignmentOperator | ts.SyntaxKind.EqualsToken
    >
  ): BinaryOperator
  BinaryOperatorUnecmaify(
    node: Exclude<ts.BinaryOperator, ts.SyntaxKind.EqualsToken>
  ): BinaryOperator | CompoundAssignmentOperator {
    switch (node) {
      case ts.SyntaxKind.CommaToken:
        return BinaryOperator.Comma
      case ts.SyntaxKind.BarBarToken:
        return BinaryOperator.Or
      case ts.SyntaxKind.AmpersandAmpersandToken:
        return BinaryOperator.And
      case ts.SyntaxKind.BarToken:
        return BinaryOperator.LogicOr
      case ts.SyntaxKind.CaretToken:
        return BinaryOperator.LogicXor
      case ts.SyntaxKind.AmpersandToken:
        return BinaryOperator.LogicAnd
      case ts.SyntaxKind.EqualsEqualsToken:
        return BinaryOperator.EqualEqual
      case ts.SyntaxKind.ExclamationEqualsToken:
        return BinaryOperator.NotEqual
      case ts.SyntaxKind.EqualsEqualsEqualsToken:
        return BinaryOperator.EqualEqualEqual
      case ts.SyntaxKind.ExclamationEqualsEqualsToken:
        return BinaryOperator.NotEqualEqual
      case ts.SyntaxKind.LessThanToken:
        return BinaryOperator.LessThan
      case ts.SyntaxKind.LessThanEqualsToken:
        return BinaryOperator.LessThanEqual
      case ts.SyntaxKind.GreaterThanToken:
        return BinaryOperator.GreaterThan
      case ts.SyntaxKind.GreaterThanEqualsToken:
        return BinaryOperator.GreaterThanEqual
      case ts.SyntaxKind.InKeyword:
        return BinaryOperator.In
      case ts.SyntaxKind.InstanceOfKeyword:
        return BinaryOperator.InstanceOf
      case ts.SyntaxKind.LessThanLessThanToken:
        return BinaryOperator.LessThanLessThan
      case ts.SyntaxKind.GreaterThanGreaterThanToken:
        return BinaryOperator.GreaterThanGreaterThan
      case ts.SyntaxKind.GreaterThanGreaterThanGreaterThanToken:
        return BinaryOperator.GreaterThanGreaterThanGreaterThan
      case ts.SyntaxKind.PlusToken:
        return BinaryOperator.Plus
      case ts.SyntaxKind.MinusToken:
        return BinaryOperator.Minus
      case ts.SyntaxKind.AsteriskToken:
        return BinaryOperator.Star
      case ts.SyntaxKind.SlashToken:
        return BinaryOperator.Div
      case ts.SyntaxKind.PercentToken:
        return BinaryOperator.Mod
      case ts.SyntaxKind.AsteriskAsteriskToken:
        return BinaryOperator.StarStar
      case ts.SyntaxKind.PlusEqualsToken:
        return CompoundAssignmentOperator.PlusEqual
      case ts.SyntaxKind.MinusEqualsToken:
        return CompoundAssignmentOperator.MinusEqual
      case ts.SyntaxKind.AsteriskEqualsToken:
        return CompoundAssignmentOperator.StarEqual
      case ts.SyntaxKind.SlashEqualsToken:
        return CompoundAssignmentOperator.DivEuqal
      case ts.SyntaxKind.PercentEqualsToken:
        return CompoundAssignmentOperator.ModEqual
      case ts.SyntaxKind.AsteriskAsteriskEqualsToken:
        return CompoundAssignmentOperator.StarStarEqual
      case ts.SyntaxKind.LessThanLessThanEqualsToken:
        return CompoundAssignmentOperator.LessThanLessThanEqual
      case ts.SyntaxKind.GreaterThanGreaterThanEqualsToken:
        return CompoundAssignmentOperator.GreaterThanGreaterThanEequal
      case ts.SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken:
        return CompoundAssignmentOperator.GreaterThanGreaterThanGreaterThanEequal
      case ts.SyntaxKind.BarEqualsToken:
        return CompoundAssignmentOperator.LoginOrEqual
      case ts.SyntaxKind.AmpersandEqualsToken:
        return CompoundAssignmentOperator.LogicAndEuqal
      case ts.SyntaxKind.CaretEqualsToken:
        return CompoundAssignmentOperator.LogicXorEqual
    }
  }

  BinaryExpressionUnecmaify(
    node: ts.BinaryExpression
  ): BinaryExpression | AssignmentExpression | CompoundAssignmentExpression {
    switch (node.operatorToken.kind) {
      case ts.SyntaxKind.EqualsToken:
        return {
          type: NodeType.AssignmentExpression,
          binding: this.ExpressionToAssignmentTargetUnecmaify(node.left),
          expression: this.ExpressionUnecmaify(node.right)
        }

      case ts.SyntaxKind.PlusEqualsToken:
      case ts.SyntaxKind.MinusEqualsToken:
      case ts.SyntaxKind.AsteriskEqualsToken:
      case ts.SyntaxKind.SlashEqualsToken:
      case ts.SyntaxKind.PercentEqualsToken:
      case ts.SyntaxKind.AsteriskAsteriskEqualsToken:
      case ts.SyntaxKind.LessThanLessThanEqualsToken:
      case ts.SyntaxKind.GreaterThanGreaterThanEqualsToken:
      case ts.SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken:
      case ts.SyntaxKind.BarEqualsToken:
      case ts.SyntaxKind.AmpersandEqualsToken:
      case ts.SyntaxKind.CaretEqualsToken:
        return {
          type: NodeType.CompoundAssignmentExpression,
          binding: this.ExpressionToSimpleAssignmentTargetUnecmaify(node.left),
          operator: this.BinaryOperatorUnecmaify(node.operatorToken.kind),
          expression: this.ExpressionUnecmaify(node.right)
        }
      default:
        return {
          type: NodeType.BinaryExpression,
          left: this.ExpressionUnecmaify(node.left),
          operator: this.BinaryOperatorUnecmaify(node.operatorToken.kind),
          right: this.ExpressionUnecmaify(node.right)
        }
    }
  }

  CallExpressionUnecmaify(node: ts.CallExpression): CallExpression {
    const callee = this.ExpressionUnecmaify(node.expression)
    if (isIdentifierExpression(callee) && callee.name === "eval") {
      this.currentContext.hasDirectEval = true
    }

    return {
      type: NodeType.CallExpression,
      callee,
      arguments: this.ExpressionListUnecmaify(node.arguments)
    }
  }

  ElementAccessExpressionUnecmaify(
    node: ts.ElementAccessExpression
  ): ComputedMemberExpression {
    return {
      type: NodeType.ComputedMemberExpression,
      _object: this.ExpressionUnecmaify(node.expression),
      expression: this.ExpressionUnecmaify(node.argumentExpression)
    }
  }

  ConditionalExpressionUnecmaify(
    node: ts.ConditionalExpression
  ): ConditionalExpression {
    return {
      type: NodeType.ConditionalExpression,
      test: this.ExpressionUnecmaify(node.condition),
      consequent: this.ExpressionUnecmaify(node.whenTrue),
      alternate: this.ExpressionUnecmaify(node.whenFalse)
    }
  }

  ClassExpressionUnecmaify(node: ts.ClassExpression): ClassExpression {
    const [name] = this.runInContext(() => this.UnecmaifyOptional(node.name, this.IdentifierToBindingIdentifierUnecmaify))

    return {
      type: NodeType.ClassExpression,
      name,
      super: this.UnecmaifyOptional(
        node.heritageClauses,
        this.HeritageClauseSuperUnecmaify
      ),
      elements: this.MethodDefinitionListUnecmaify(node.members)
    }
  }

  FunctionExpressionContentsUnecmaify(
    node: ts.FunctionExpression
  ): FunctionExpressionContents {
    const stmts = AssertDef(node.body).statements
    const [body, context] = this.runInContext(() => this.StatementListUnecmaify(stmts))
    const [params, paramsContext] = this.runInContext(() => this.FormalParametersUnecmaify(node.parameters))
    const paramsSet = new Set(paramsContext.declarations)
    context.declarations = context.declarations.filter(x => !paramsSet.has(x))

    return {
      type: NodeType.FunctionExpressionContents,
      params,
      body,
      isThisCaptured: false,
      bodyScope: this.createAssertedVarScope(context),
      parameterScope: this.createAssertedParameterScope(node.parameters, paramsContext),
      isFunctionNameCaptured: false
    }
  }

  FunctionExpressionUnecmaify(node: ts.FunctionExpression): FunctionExpression {
    const [name] = this.runInContext(() => this.UnecmaifyOptional(node.name, this.IdentifierToBindingIdentifierUnecmaify))

    return {
      type: NodeType.EagerFunctionExpression,
      name,
      isAsync: !!(ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Async),
      isGenerator: !!node.asteriskToken,
      contents: this.FunctionExpressionContentsUnecmaify(node),
      directives: [],
      length: node.parameters.length
    }
  }

  IdentifierUnecmaify(node: ts.Identifier): IdentifierExpression {
    this.markCapture(node.text)

    return {
      type: NodeType.IdentifierExpression,
      name: node.text
    }
  }

  NewExpressionUnecmaify(node: ts.NewExpression): NewExpression {
    return {
      type: NodeType.NewExpression,
      callee: this.ExpressionUnecmaify(node.expression),
      arguments: node.arguments
        ? this.UnecmaifyList(node.arguments, this.ExpressionUnecmaify)
        : []
    }
  }

  MetaPropertyUnecmaify(node: ts.MetaProperty): NewTargetExpression {
    Assert(
      node.keywordToken === ts.SyntaxKind.NewKeyword &&
      node.name.text === 'target'
    )
    return {
      type: NodeType.NewTargetExpression
    }
  }

  SpreadAssignmentUnecmaify(node: ts.SpreadAssignment): any {
    throw new Error('Not implemented')
  }

  ObjectLiteralElementLikeUnecmaify(
    node: ts.ObjectLiteralElementLike
  ): ObjectProperty {
    switch (node.kind) {
      case ts.SyntaxKind.PropertyAssignment:
        return this.PropertyAssignmentUnecmaify(node)
      case ts.SyntaxKind.ShorthandPropertyAssignment:
        return this.ShorthandPropertyAssignmentUnecmaify(node)
      case ts.SyntaxKind.SpreadAssignment:
        return this.SpreadAssignmentUnecmaify(node)
      case ts.SyntaxKind.MethodDeclaration:
        return this.MethodDeclarationUnecmaify(node)
      case ts.SyntaxKind.GetAccessor:
        return this.GetAccessorDeclarationUnecmaify(node)
      case ts.SyntaxKind.SetAccessor:
        return this.SetAccessorDeclarationUnecmaify(node)
    }
  }

  ObjectLiteralExpressionUnecmaify(
    node: ts.ObjectLiteralExpression
  ): ObjectExpression {
    return {
      type: NodeType.ObjectExpression,
      properties: this.UnecmaifyList(
        node.properties,
        this.ObjectLiteralElementLikeUnecmaify
      )
    }
  }

  PropertyAccessExpressionToStaticMemberAssignmentTargetUnecmaify(
    node: ts.PropertyAccessExpression
  ): StaticMemberAssignmentTarget {
    return {
      type: NodeType.StaticMemberAssignmentTarget,
      _object: this.ExpressionUnecmaify(node.expression),
      property: node.name.text
    }
  }

  PropertyAccessExpressionUnecmaify(
    node: ts.PropertyAccessExpression
  ): StaticMemberExpression {
    return {
      type: NodeType.StaticMemberExpression,
      _object: this.ExpressionUnecmaify(node.expression),
      property: node.name.text
    }
  }

  TemplateExpressionUnecmaify(
    node: ts.TaggedTemplateExpression | ts.TemplateExpression
  ): TemplateExpression {
    throw new Error('Not implemented')
  }

  ThisExpressionUnecmaify(node: ts.ThisExpression): ThisExpression {
    return {
      type: NodeType.ThisExpression
    }
  }

  YieldExpressionUnecmaify(
    node: ts.YieldExpression
  ): YieldExpression | YieldStarExpression {
    if (node.asteriskToken) {
      return {
        type: NodeType.YieldStarExpression,
        expression: this.ExpressionUnecmaify(AssertDef(node.expression))
      }
    } else {
      return {
        type: NodeType.YieldExpression
      }
    }
  }

  AwaitExpressionUnecmaify(node: ts.AwaitExpression): AwaitExpression {
    return {
      type: NodeType.AwaitExpression,
      expression: this.ExpressionUnecmaify(node.expression)
    }
  }

  BlockUnecmaify(node: ts.Block): Block {
    const [ statements, context ] = this.runInBlockContext(() => this.UnecmaifyList(node.statements, this.StatementUnecmaify))
    return {
      type: NodeType.Block,
      statements,
      scope: this.createAssertedBlockScope(context)
    }
  }

  BreakStatementUnecmaify(node: ts.BreakStatement): BreakStatement {
    return {
      type: NodeType.BreakStatement,
      label: this.UnecmaifyOptional(node.label, x => x.text)
    }
  }

  ContinueStatementUnecmaify(node: ts.ContinueStatement): ContinueStatement {
    return {
      type: NodeType.ContinueStatement,
      label: this.UnecmaifyOptional(node.label, x => x.text)
    }
  }

  MethodDefinitionListUnecmaify(
    nodes: ReadonlyArray<ts.ClassElement>
  ): FrozenArray<ClassElement> {
    return this.UnecmaifyList(nodes, node =>
      this.ClassElementUnecmaify(node, this.MethodDefinitionUnecmaify(node))
    )
  }

  ClassElementUnecmaify(
    node: ts.ClassElement,
    method: MethodDefinition
  ): ClassElement {
    return {
      type: NodeType.ClassElement,
      isStatic: !!(ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Static),
      method
    }
  }

  MethodDefinitionUnecmaify(node: ts.ClassElement): MethodDefinition {
    switch (node.kind) {
      case ts.SyntaxKind.MethodDeclaration:
        return this.MethodDeclarationUnecmaify(node as ts.MethodDeclaration)
      case ts.SyntaxKind.GetAccessor:
      case ts.SyntaxKind.SetAccessor:
      default:
        throw new Error('Unecpected kind')
    }
  }

  ClassDeclarationUnecmaify(node: ts.ClassDeclaration): ClassDeclaration {
    const name = AssertDef(node.name)
    if (!this.currentContext.declarationsSet.has(name.text)) {
      this.currentContext.declarationsSet.add(name.text)
      this.currentContext.declarations.push(name.text)
    }

    return {
      type: NodeType.ClassDeclaration,
      name: this.IdentifierToBindingIdentifierUnecmaify(name),
      super: this.UnecmaifyOptional(
        node.heritageClauses,
        this.HeritageClauseSuperUnecmaify
      ),
      elements: this.MethodDefinitionListUnecmaify(node.members)
    }
  }

  DebuggerStatementUnecmaify(node: ts.DebuggerStatement): DebuggerStatement {
    return {
      type: NodeType.DebuggerStatement
    }
  }

  EmptyStatementUnecmaify(node: ts.EmptyStatement): EmptyStatement {
    return {
      type: NodeType.EmptyStatement
    }
  }

  ExpressionStatementUnecmaify(
    node: ts.ExpressionStatement
  ): ExpressionStatement {
    return {
      type: NodeType.ExpressionStatement,
      expression: this.ExpressionUnecmaify(node.expression)
    }
  }

  FormalParametersUnecmaify(
    nodes: ReadonlyArray<ts.ParameterDeclaration>
  ): FormalParameters {
    let rest: Binding | undefined = undefined
    const lastParam = lastOrUndefined(nodes)
    if (lastParam && lastParam.dotDotDotToken) {
      nodes = nodes.slice(0, nodes.length - 1)
      rest = this.BindingNameUnecmaify(lastParam.name)
    }

    return {
      type: NodeType.FormalParameters,
      items: this.ParameterDeclarationListUnecmaify(nodes),
      rest
    }
  }

  FunctionOrMethodContentsUnecmaify(
    node: ts.FunctionDeclaration | ts.MethodDeclaration
  ): FunctionOrMethodContents {
    const stmts = AssertDef(node.body).statements
    const [params, paramsContext] = this.runInContext(() => this.FormalParametersUnecmaify(node.parameters))
    const [body, context] = this.runInContext(() => this.StatementListUnecmaify(stmts))
    const paramsSet = new Set(paramsContext.declarations)
    context.declarations = context.declarations.filter(x => !paramsSet.has(x))

    return {
      type: NodeType.FunctionOrMethodContents,
      params,
      body,
      isThisCaptured: false,
      bodyScope: this.createAssertedVarScope(context),
      parameterScope: this.createAssertedParameterScope(node.parameters, paramsContext)
    }
  }

  FunctionDeclarationUnecmaify(
    node: ts.FunctionDeclaration
  ): FunctionDeclaration {
    return {
      type: NodeType.EagerFunctionDeclaration,
      name: this.IdentifierToBindingIdentifierUnecmaify(AssertDef(node.name)),
      isAsync: !!(ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Async),
      isGenerator: !!node.asteriskToken,
      contents: this.FunctionOrMethodContentsUnecmaify(node),
      directives: [],
      length: node.parameters.length
    }
  }

  IfStatementUnecmaify(node: ts.IfStatement): IfStatement {
    return {
      type: NodeType.IfStatement,
      test: this.ExpressionUnecmaify(node.expression),
      consequent: this.StatementUnecmaify(node.thenStatement),
      alternate: this.UnecmaifyOptional(
        node.elseStatement,
        this.StatementUnecmaify
      )
    }
  }

  DoStatementUnecmaify(node: ts.DoStatement): DoWhileStatement {
    return {
      type: NodeType.DoWhileStatement,
      test: this.ExpressionUnecmaify(node.expression),
      body: this.StatementUnecmaify(node.statement)
    }
  }

  AssignmentTargetPropertyListUnecmaify(
    nodes: ReadonlyArray<ts.ObjectLiteralElementLike>
  ) {
    return this.UnecmaifyList(
      nodes,
      this.ObjectLiteralElementLikeToAssignmentTargetPropertyUnecmaify
    )
  }

  AssignmentTargetPropertyIdentifierUnecmaify(
    node: ts.ShorthandPropertyAssignment
  ): AssignmentTargetPropertyIdentifier {
    return {
      type: NodeType.AssignmentTargetPropertyIdentifier,
      binding: this.IdentifierToAssignmentTargetIdentifierUnecmaify(node.name),
      init: this.UnecmaifyOptional(
        node.objectAssignmentInitializer,
        this.ExpressionUnecmaify
      )
    }
  }

  LiteralPropertyNameUnecmaify(
    node: ts.Identifier | ts.StringLiteral | ts.NumericLiteral
  ): LiteralPropertyName {
    return {
      type: NodeType.LiteralPropertyName,
      value: node.text
    }
  }

  ComputedPropertyNameUnecmaify(
    node: ts.ComputedPropertyName
  ): ComputedPropertyName {
    return {
      type: NodeType.ComputedPropertyName,
      expression: this.ExpressionUnecmaify(node.expression)
    }
  }

  PropertyNameUnecmaify(node: ts.PropertyName): PropertyName {
    switch (node.kind) {
      case ts.SyntaxKind.Identifier:
      case ts.SyntaxKind.StringLiteral:
      case ts.SyntaxKind.NumericLiteral:
        return this.LiteralPropertyNameUnecmaify(node)
      case ts.SyntaxKind.ComputedPropertyName:
        return this.ComputedPropertyNameUnecmaify(node)
    }
  }

  AssignmentExpressionToAssignmentTargetWithInitializer(
    node: ts.AssignmentExpression<ts.EqualsToken>
  ): AssignmentTargetWithInitializer {
    return {
      type: NodeType.AssignmentTargetWithInitializer,
      binding: this.ExpressionToAssignmentTargetUnecmaify(node.left),
      init: this.ExpressionUnecmaify(node.right)
    }
  }

  BinaryExpressionToAssignmentTargetWithInitializerEcmaify(
    node: ts.BinaryExpression
  ): AssignmentTargetWithInitializer {
    switch (node.operatorToken.kind) {
      case ts.SyntaxKind.EqualsToken:
        return this.AssignmentExpressionToAssignmentTargetWithInitializer(
          node as ts.AssignmentExpression<ts.EqualsToken>
        )
      default:
        throw new Error('Unecpected operator')
    }
  }

  ExpressionToAssignmentTargetOrAssignmentTargetWithInitializerListUnecmaify(
    nodes: ReadonlyArray<ts.Expression>
  ): FrozenArray<AssignmentTarget | AssignmentTargetWithInitializer> {
    return this.UnecmaifyList(
      nodes,
      this
        .ExpressionToAssignmentTargetOrAssignmentTargetWithInitializerUnecmaify
    )
  }

  ExpressionToAssignmentTargetUnecmaify(node: ts.Expression): AssignmentTarget {
    switch (node.kind) {
      case ts.SyntaxKind.ObjectLiteralExpression:
      case ts.SyntaxKind.ArrayLiteralExpression:
      case ts.SyntaxKind.Identifier:
      case ts.SyntaxKind.ElementAccessExpression:
      case ts.SyntaxKind.PropertyAccessExpression:
        return this.AssignmentTargetUnecmaify(
          node as AssignmentTargetEcmaifyType
        )
      default:
        throw new Error('Unecpected kind')
    }
  }

  ExpressionToAssignmentTargetOrAssignmentTargetWithInitializerUnecmaify(
    node: ts.Expression
  ): AssignmentTarget | AssignmentTargetWithInitializer {
    switch (node.kind) {
      case ts.SyntaxKind.BinaryExpression:
        return this.BinaryExpressionToAssignmentTargetWithInitializerEcmaify(
          node as ts.BinaryExpression
        )
      case ts.SyntaxKind.ObjectLiteralExpression:
      case ts.SyntaxKind.ArrayLiteralExpression:
      case ts.SyntaxKind.Identifier:
      case ts.SyntaxKind.ElementAccessExpression:
      case ts.SyntaxKind.PropertyAccessExpression:
        return this.AssignmentTargetUnecmaify(
          node as AssignmentTargetEcmaifyType
        )
      default:
        throw new Error('Unecpected kind')
    }
  }

  AssignmentTargetPropertyPropertyUnecmaify(
    node: ts.PropertyAssignment
  ): AssignmentTargetPropertyProperty {
    return {
      type: NodeType.AssignmentTargetPropertyProperty,
      name: this.PropertyNameUnecmaify(node.name),
      binding: this.ExpressionToAssignmentTargetOrAssignmentTargetWithInitializerUnecmaify(
        node.initializer
      )
    }
  }

  AssignmentTargetPropertyUnecmaify(
    node: ts.ShorthandPropertyAssignment | ts.PropertyAssignment
  ): AssignmentTargetProperty {
    switch (node.kind) {
      case ts.SyntaxKind.ShorthandPropertyAssignment:
        return this.AssignmentTargetPropertyIdentifierUnecmaify(node)
      case ts.SyntaxKind.PropertyAssignment:
        return this.AssignmentTargetPropertyPropertyUnecmaify(node)
    }
  }

  ObjectLiteralElementLikeToAssignmentTargetPropertyUnecmaify(
    node: ts.ObjectLiteralElementLike
  ) {
    switch (node.kind) {
      case ts.SyntaxKind.ShorthandPropertyAssignment:
      case ts.SyntaxKind.PropertyAssignment:
        return this.AssignmentTargetPropertyUnecmaify(node)
      default:
        throw new Error('Unexpected kind')
    }
  }

  ObjectLiteralExpressionToObjectAssignmentTargetUnecmaify(
    node: ts.ObjectLiteralExpression
  ): ObjectAssignmentTarget {
    return {
      type: NodeType.ObjectAssignmentTarget,
      properties: this.AssignmentTargetPropertyListUnecmaify(node.properties)
    }
  }

  ArrayLiteralExpressionToObjectAssignmentTargetUnecmaify(
    node: ts.ArrayLiteralExpression
  ): ArrayAssignmentTarget {
    return {
      type: NodeType.ArrayAssignmentTarget,
      elements: this.ExpressionToAssignmentTargetOrAssignmentTargetWithInitializerListUnecmaify(
        node.elements
      )
    }
  }

  AssignmentTargetPatternUnecmaify(
    node: AssignmentTargetPatternEcmaifyType
  ): AssignmentTargetPattern {
    switch (node.kind) {
      case ts.SyntaxKind.ObjectLiteralExpression:
        return this.ObjectLiteralExpressionToObjectAssignmentTargetUnecmaify(
          node
        )
      case ts.SyntaxKind.ArrayLiteralExpression:
        return this.ArrayLiteralExpressionToObjectAssignmentTargetUnecmaify(
          node
        )
    }
  }

  IdentifierToAssignmentTargetIdentifierUnecmaify(
    node: ts.Identifier
  ): AssignmentTargetIdentifier {
    return {
      type: NodeType.AssignmentTargetIdentifier,
      name: node.text
    }
  }

  IdentifierToIdentifierExpressionUnecmaify(
    node: ts.Identifier
  ): IdentifierExpression {
    return {
      type: NodeType.IdentifierExpression,
      name: node.text
    }
  }

  ElementAccessExpressionToComputedMemberAssignmentTargetUnecmaify(
    node: ts.ElementAccessExpression
  ): ComputedMemberAssignmentTarget {
    return {
      type: NodeType.ComputedMemberAssignmentTarget,
      _object: this.ExpressionUnecmaify(node.expression),
      expression: this.ExpressionUnecmaify(node.argumentExpression)
    }
  }

  SimpleAssignmentTargetUnecmaify(
    node: SimpleAssignmentTargetEcmaifyType
  ): SimpleAssignmentTarget {
    switch (node.kind) {
      case ts.SyntaxKind.Identifier:
        return this.IdentifierToAssignmentTargetIdentifierUnecmaify(node)
      case ts.SyntaxKind.ElementAccessExpression:
        return this.ElementAccessExpressionToComputedMemberAssignmentTargetUnecmaify(
          node
        )
      case ts.SyntaxKind.PropertyAccessExpression:
        return this.PropertyAccessExpressionToStaticMemberAssignmentTargetUnecmaify(
          node
        )
    }
  }

  ExpressionToSimpleAssignmentTargetUnecmaify(
    node: ts.Expression
  ): SimpleAssignmentTarget {
    switch (node.kind) {
      case ts.SyntaxKind.Identifier:
      case ts.SyntaxKind.ElementAccessExpression:
      case ts.SyntaxKind.PropertyAccessExpression:
        return this.SimpleAssignmentTargetUnecmaify(
          node as SimpleAssignmentTargetEcmaifyType
        )
      default:
        throw new Error('Unexpected kind')
    }
  }

  AssignmentTargetUnecmaify(
    node: AssignmentTargetEcmaifyType
  ): AssignmentTarget {
    switch (node.kind) {
      case ts.SyntaxKind.ObjectLiteralExpression:
      case ts.SyntaxKind.ArrayLiteralExpression:
        return this.AssignmentTargetPatternUnecmaify(
          node as AssignmentTargetPatternEcmaifyType
        )
      case ts.SyntaxKind.Identifier:
      case ts.SyntaxKind.ElementAccessExpression:
      case ts.SyntaxKind.PropertyAccessExpression:
        return this.SimpleAssignmentTargetUnecmaify(
          node as SimpleAssignmentTargetEcmaifyType
        )
    }
  }

  ForInitializerUnecmaify(
    node: ts.ForInitializer
  ): ForInOfBinding | AssignmentTarget {
    switch (node.kind) {
      case ts.SyntaxKind.VariableDeclarationList:
        const declarationList = AssertCast(node, ts.isVariableDeclarationList)
        return {
          type: NodeType.ForInOfBinding,
          kind: VariableDeclarationKind.Var,
          binding: this.BindingNameUnecmaify(
            first(declarationList.declarations).name
          )
        }
      case ts.SyntaxKind.ObjectLiteralExpression:
      case ts.SyntaxKind.ArrayLiteralExpression:
      case ts.SyntaxKind.Identifier:
      case ts.SyntaxKind.ElementAccessExpression:
      case ts.SyntaxKind.PropertyAccessExpression:
        return this.AssignmentTargetUnecmaify(
          node as AssignmentTargetEcmaifyType
        )
      default:
        throw new Error('Unexpected kind')
    }
  }

  ForInitializerToVariableDeclarationOrExpression(
    node: ts.ForInitializer
  ): VariableDeclaration | Expression {
    switch (node.kind) {
      case ts.SyntaxKind.VariableDeclarationList:
        return {
          type: NodeType.VariableDeclaration,
          kind: VariableDeclarationKind.Var,
          declarators: this.VariableDeclarationListUnecmaify(
            node as ts.VariableDeclarationList
          )
        }
      default:
        return this.ExpressionUnecmaify(node)
    }
  }

  ForInStatementUnecmaify(node: ts.ForInStatement): ForInStatement {
    return {
      type: NodeType.ForInStatement,
      left: this.ForInitializerUnecmaify(node.initializer),
      right: this.ExpressionUnecmaify(node.expression),
      body: this.StatementUnecmaify(node.statement)
    }
  }

  ForOfStatementUnecmaify(node: ts.ForOfStatement): ForOfStatement {
    return {
      type: NodeType.ForOfStatement,
      left: this.ForInitializerUnecmaify(node.initializer),
      right: this.ExpressionUnecmaify(node.expression),
      body: this.StatementUnecmaify(node.statement)
    }
  }

  ForStatementUnecmaify(node: ts.ForStatement): ForStatement {
    return {
      type: NodeType.ForStatement,
      init: this.UnecmaifyOptional(
        node.initializer,
        this.ForInitializerToVariableDeclarationOrExpression
      ),
      test: this.UnecmaifyOptional(node.condition, this.ExpressionUnecmaify),
      update: this.UnecmaifyOptional(
        node.incrementor,
        this.ExpressionUnecmaify
      ),
      body: this.StatementUnecmaify(node.statement)
    }
  }

  WhileStatementUnecmaify(node: ts.WhileStatement): WhileStatement {
    return {
      type: NodeType.WhileStatement,
      test: this.ExpressionUnecmaify(node.expression),
      body: this.StatementUnecmaify(node.statement)
    }
  }

  LabeledStatementUnecmaify(node: ts.LabeledStatement): LabelledStatement {
    return {
      type: NodeType.LabelledStatement,
      label: node.label.text,
      body: this.StatementUnecmaify(node.statement)
    }
  }

  ReturnStatementUnecmaify(node: ts.ReturnStatement): ReturnStatement {
    return {
      type: NodeType.ReturnStatement,
      expression: this.UnecmaifyOptional(
        node.expression,
        this.ExpressionUnecmaify
      )
    }
  }

  CaseClauseListUnecmaify(
    nodes: ReadonlyArray<ts.CaseOrDefaultClause>
  ): FrozenArray<SwitchCase> {
    return this.UnecmaifyList(nodes, clause =>
      this.CaseClauseUnecmaify(AssertCast(clause, ts.isCaseClause))
    )
  }

  SwitchStatementUnecmaify(
    node: ts.SwitchStatement
  ): SwitchStatement | SwitchStatementWithDefault {
    const defaultClauseIndex = node.caseBlock.clauses.findIndex(
      ts.isDefaultClause
    )
    if (defaultClauseIndex >= 0) {
      return {
        type: NodeType.SwitchStatementWithDefault,
        discriminant: this.ExpressionUnecmaify(node.expression),
        defaultCase: this.DefaultClauseUnecmaify(
          AssertCast(
            node.caseBlock.clauses[defaultClauseIndex],
            ts.isDefaultClause
          )
        ),
        preDefaultCases: this.CaseClauseListUnecmaify(
          node.caseBlock.clauses.slice(0, defaultClauseIndex)
        ),
        postDefaultCases: this.CaseClauseListUnecmaify(
          node.caseBlock.clauses.slice(defaultClauseIndex + 1)
        )
      }
    } else {
      return {
        type: NodeType.SwitchStatement,
        discriminant: this.ExpressionUnecmaify(node.expression),
        cases: this.UnecmaifyList(node.caseBlock.clauses, clause =>
          this.CaseClauseUnecmaify(AssertCast(clause, ts.isCaseClause))
        )
      }
    }
  }

  ThrowStatementUnecmaify(node: ts.ThrowStatement): ThrowStatement {
    return {
      type: NodeType.ThrowStatement,
      expression: this.ExpressionUnecmaify(AssertDef(node.expression))
    }
  }

  TryStatementUnecmaify(
    node: ts.TryStatement
  ): TryCatchStatement | TryFinallyStatement {
    if (node.finallyBlock) {
      return {
        type: NodeType.TryFinallyStatement,
        body: this.BlockUnecmaify(node.tryBlock),
        catchClause: this.UnecmaifyOptional(
          node.catchClause,
          this.CatchClauseUnecmaify
        ),
        finalizer: this.BlockUnecmaify(AssertDef(node.finallyBlock))
      }
    } else {
      return {
        type: NodeType.TryCatchStatement,
        body: this.BlockUnecmaify(node.tryBlock),
        catchClause: this.CatchClauseUnecmaify(AssertDef(node.catchClause))
      }
    }
  }

  VariableStatementUnecmaify(node: ts.VariableStatement): VariableDeclaration {
    return {
      type: NodeType.VariableDeclaration,
      kind: VariableDeclarationKind.Var,
      declarators: this.VariableDeclarationListUnecmaify(node.declarationList)
    }
  }

  VariableDeclarationListUnecmaify(
    node: ts.VariableDeclarationList
  ): Array<VariableDeclarator> {
    return this.UnecmaifyList(
      node.declarations,
      this.VariableDeclarationUnecmaify
    )
  }

  IdentifierToBindingIdentifierUnecmaify(
    name: ts.Identifier
  ): BindingIdentifier {
    if (!this.currentContext.declarationsSet.has(name.text)) {
      this.currentContext.declarationsSet.add(name.text)
      this.currentContext.declarations.push(name.text)
    }

    return {
      type: NodeType.BindingIdentifier,
      name: name.text
    }
  }

  BindingPatternUnecmaify(node: ts.BindingPattern): BindingPattern {
    switch (node.kind) {
      case ts.SyntaxKind.ObjectBindingPattern:
        return this.ObjectBindingPatternUnecmaify(node)
      case ts.SyntaxKind.ArrayBindingPattern:
        return this.ArrayBindingPatternUnecmaify(node)
    }
  }

  BindingNameUnecmaify(node: ts.BindingName): Binding {
    switch (node.kind) {
      case ts.SyntaxKind.Identifier:
        return this.IdentifierToBindingIdentifierUnecmaify(node)
      case ts.SyntaxKind.ObjectBindingPattern:
      case ts.SyntaxKind.ArrayBindingPattern:
        return this.BindingPatternUnecmaify(node)
    }
  }

  VariableDeclarationUnecmaify(
    node: ts.VariableDeclaration
  ): VariableDeclarator {
    const name = AssertCast(node.name, ts.isIdentifier)
    if (!this.currentContext.declarationsSet.has(name.text)) {
      this.currentContext.declarationsSet.add(name.text)
      this.currentContext.declarations.push(name.text)
    }

    return {
      type: NodeType.VariableDeclarator,
      binding: this.BindingNameUnecmaify(node.name),
      init: this.UnecmaifyOptional(node.initializer, this.ExpressionUnecmaify)
    }
  }

  WithStatementUnecmaify(node: ts.WithStatement): WithStatement {
    return {
      type: NodeType.WithStatement,
      _object: this.ExpressionUnecmaify(node.expression),
      body: this.StatementUnecmaify(node.statement)
    }
  }
}
