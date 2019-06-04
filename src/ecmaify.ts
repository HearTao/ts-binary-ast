import {
  Statement,
  Node,
  NodeType,
  FrozenArray,
  Expression,
  VariableDeclaration,
  VariableDeclarator,
  SpreadElement,
  Block,
  BreakStatement,
  ClassDeclaration,
  ContinueStatement,
  ExpressionStatement,
  EagerFunctionDeclaration,
  LazyFunctionDeclaration,
  DoWhileStatement,
  IfStatement,
  EmptyStatement,
  DebuggerStatement,
  ForOfStatement,
  ForStatement,
  WhileStatement,
  LabelledStatement,
  ReturnStatement,
  SwitchStatement,
  SwitchStatementWithDefault,
  TryCatchStatement,
  TryFinallyStatement,
  WithStatement,
  ForInStatement,
  ThrowStatement,
  AssertedBoundName,
  AssertedBlockScope,
  AssertedScriptGlobalScope,
  AssertedVarScope,
  AssertedParameterScope,
  AssertedBoundNamesScope,
  AssertedDeclaredName,
  AssertedPositionalParameterName,
  AssertedRestParameterName,
  AssertedParameterName,
  BindingIdentifier,
  BindingWithInitializer,
  AssignmentTargetIdentifier,
  ComputedMemberAssignmentTarget,
  StaticMemberAssignmentTarget,
  ArrayBinding,
  BindingPropertyIdentifier,
  BindingPropertyProperty,
  ObjectBinding,
  AssignmentTargetWithInitializer,
  ArrayAssignmentTarget,
  AssignmentTargetPropertyIdentifier,
  AssignmentTargetPropertyProperty,
  ObjectAssignmentTarget,
  Module,
  Import,
  ImportNamespace,
  ExportAllFrom,
  ExportFrom,
  ExportLocals,
  Export,
  ExportDefault,
  ExportFromSpecifier,
  ExportLocalSpecifier,
  EagerMethod,
  LazyMethod,
  EagerGetter,
  LazyGetter,
  GetterContents,
  EagerSetter,
  LazySetter,
  SetterContents,
  DataProperty,
  ShorthandProperty,
  LiteralPropertyName,
  LiteralBooleanExpression,
  LiteralInfinityExpression,
  LiteralNullExpression,
  LiteralNumericExpression,
  LiteralRegExpExpression,
  LiteralStringExpression,
  ArrayExpression,
  EagerArrowExpressionWithFunctionBody,
  LazyArrowExpressionWithFunctionBody,
  EagerArrowExpressionWithExpression,
  LazyArrowExpressionWithExpression,
  ArrowExpressionContentsWithFunctionBody,
  ArrowExpressionContentsWithExpression,
  CompoundAssignmentExpression,
  ComputedMemberExpression,
  EagerFunctionExpression,
  LazyFunctionExpression,
  FunctionExpressionContents,
  IdentifierExpression,
  NewTargetExpression,
  ObjectExpression,
  StaticMemberExpression,
  YieldStarExpression,
  ForInOfBinding,
  Directive,
  FormalParameters,
  FunctionOrMethodContents,
  Script,
  Super,
  SwitchCase,
  SwitchDefault,
  TemplateElement,
  ClassExpression,
  ClassElement,
  ImportSpecifier,
  ComputedPropertyName,
  AssignmentExpression,
  BinaryExpression,
  CallExpression,
  ConditionalExpression,
  NewExpression,
  UnaryExpression,
  TemplateExpression,
  ThisExpression,
  UpdateExpression,
  YieldExpression,
  AwaitExpression,
  CatchClause,
  AssignmentTarget,
  AssignmentTargetPattern,
  SimpleAssignmentTarget,
  Arguments,
  CompoundAssignmentOperator,
  BinaryOperator,
  ObjectProperty,
  MethodDefinition,
  PropertyName,
  Method,
  Getter,
  Setter,
  UpdateOperator,
  UnaryOperator,
  Binding,
  BindingPattern,
  BindingProperty,
  Parameter,
  FunctionDeclaration,
  FunctionExpression,
  AssignmentTargetProperty,
  IdentifierName,
  ImportDeclaration,
  ExportDeclaration
} from './types'
import * as ts from 'typescript'
import { isSwitchCase, isSpreadElement, append, addModifiers } from './utils'

export default class Ecmaify {
  EcmaifyOption<T, U>(v: T | undefined, cb: (v: T) => U): U | undefined {
    if (v === null || v === undefined) return undefined
    return cb.call(this, v)
  }

  EcmaifyList<T, U>(v: ReadonlyArray<T>, cb: (v: T) => U): U[] {
    return v.map(cb.bind(this))
  }

  Ecmaify(node: Node): ts.Node | ts.Node[] {
    switch (node.type) {
      case NodeType.AssertedBoundName:
        return this.AssertedBoundNameEcmaify(node as AssertedBoundName)
      case NodeType.AssertedBlockScope:
        return this.AssertedBlockScopeEcmaify(node as AssertedBlockScope)
      case NodeType.AssertedScriptGlobalScope:
        return this.AssertedScriptGlobalScopeEcmaify(
          node as AssertedScriptGlobalScope
        )
      case NodeType.AssertedVarScope:
        return this.AssertedVarScopeEcmaify(node as AssertedVarScope)
      case NodeType.AssertedParameterScope:
        return this.AssertedParameterScopeEcmaify(
          node as AssertedParameterScope
        )
      case NodeType.AssertedBoundNamesScope:
        return this.AssertedBoundNamesScopeEcmaify(
          node as AssertedBoundNamesScope
        )
      case NodeType.AssertedDeclaredName:
        return this.AssertedDeclaredNameEcmaify(node as AssertedDeclaredName)
      case NodeType.AssertedPositionalParameterName:
        return this.AssertedPositionalParameterNameEcmaify(
          node as AssertedPositionalParameterName
        )
      case NodeType.AssertedRestParameterName:
        return this.AssertedRestParameterNameEcmaify(
          node as AssertedRestParameterName
        )
      case NodeType.AssertedParameterName:
        return this.AssertedParameterNameEcmaify(node as AssertedParameterName)
      case NodeType.BindingIdentifier:
        return this.BindingIdentifierEcmaify(node as BindingIdentifier)
      case NodeType.BindingWithInitializer:
        return this.BindingWithInitializerEcmaify(
          node as BindingWithInitializer
        )
      case NodeType.AssignmentTargetIdentifier:
        return this.AssignmentTargetIdentifierEcmaify(
          node as AssignmentTargetIdentifier
        )
      case NodeType.ComputedMemberAssignmentTarget:
        return this.ComputedMemberAssignmentTargetEcmaify(
          node as ComputedMemberAssignmentTarget
        )
      case NodeType.StaticMemberAssignmentTarget:
        return this.StaticMemberAssignmentTargetEcmaify(
          node as StaticMemberAssignmentTarget
        )
      case NodeType.ArrayBinding:
        return this.ArrayBindingEcmaify(node as ArrayBinding)
      case NodeType.BindingPropertyIdentifier:
        return this.BindingPropertyIdentifierEcmaify(
          node as BindingPropertyIdentifier
        )
      case NodeType.BindingPropertyProperty:
        return this.BindingPropertyPropertyEcmaify(
          node as BindingPropertyProperty
        )
      case NodeType.ObjectBinding:
        return this.ObjectBindingEcmaify(node as ObjectBinding)
      case NodeType.AssignmentTargetWithInitializer:
        return this.AssignmentTargetWithInitializerEcmaify(
          node as AssignmentTargetWithInitializer
        )
      case NodeType.ArrayAssignmentTarget:
        return this.ArrayAssignmentTargetEcmaify(node as ArrayAssignmentTarget)
      case NodeType.AssignmentTargetPropertyIdentifier:
        return this.AssignmentTargetPropertyIdentifierEcmaify(
          node as AssignmentTargetPropertyIdentifier
        )
      case NodeType.AssignmentTargetPropertyProperty:
        return this.AssignmentTargetPropertyPropertyEcmaify(
          node as AssignmentTargetPropertyProperty
        )
      case NodeType.ObjectAssignmentTarget:
        return this.ObjectAssignmentTargetEcmaify(
          node as ObjectAssignmentTarget
        )
      case NodeType.ClassExpression:
        return this.ClassExpressionEcmaify(node as ClassExpression)
      case NodeType.ClassDeclaration:
        return this.ClassDeclarationEcmaify(node as ClassDeclaration)
      case NodeType.ClassElement:
        return this.ClassElementEcmaify(node as ClassElement)
      case NodeType.Module:
        return this.ModuleEcmaify(node as Module)
      case NodeType.Import:
        return this.ImportEcmaify(node as Import)
      case NodeType.ImportNamespace:
        return this.ImportNamespaceEcmaify(node as ImportNamespace)
      case NodeType.ImportSpecifier:
        return this.ImportSpecifierEcmaify(node as ImportSpecifier)
      case NodeType.ExportAllFrom:
        return this.ExportAllFromEcmaify(node as ExportAllFrom)
      case NodeType.ExportFrom:
        return this.ExportFromEcmaify(node as ExportFrom)
      case NodeType.ExportLocals:
        return this.ExportLocalsEcmaify(node as ExportLocals)
      case NodeType.Export:
        return this.ExportEcmaify(node as Export)
      case NodeType.ExportDefault:
        return this.ExportDefaultEcmaify(node as ExportDefault)
      case NodeType.ExportFromSpecifier:
        return this.ExportFromSpecifierEcmaify(node as ExportFromSpecifier)
      case NodeType.ExportLocalSpecifier:
        return this.ExportLocalSpecifierEcmaify(node as ExportLocalSpecifier)
      case NodeType.EagerMethod:
        return this.EagerMethodEcmaify(node as EagerMethod)
      case NodeType.LazyMethod:
        return this.LazyMethodEcmaify(node as LazyMethod)
      case NodeType.EagerGetter:
        return this.EagerGetterEcmaify(node as EagerGetter)
      case NodeType.LazyGetter:
        return this.LazyGetterEcmaify(node as LazyGetter)
      case NodeType.GetterContents:
        return this.GetterContentsEcmaify(node as GetterContents)
      case NodeType.EagerSetter:
        return this.EagerSetterEcmaify(node as EagerSetter)
      case NodeType.LazySetter:
        return this.LazySetterEcmaify(node as LazySetter)
      case NodeType.SetterContents:
        return this.SetterContentsEcmaify(node as SetterContents)
      case NodeType.DataProperty:
        return this.DataPropertyEcmaify(node as DataProperty)
      case NodeType.ShorthandProperty:
        return this.ShorthandPropertyEcmaify(node as ShorthandProperty)
      case NodeType.ComputedPropertyName:
        return this.ComputedPropertyNameEcmaify(node as ComputedPropertyName)
      case NodeType.LiteralPropertyName:
        return this.LiteralPropertyNameEcmaify(node as LiteralPropertyName)
      case NodeType.LiteralBooleanExpression:
        return this.LiteralBooleanExpressionEcmaify(
          node as LiteralBooleanExpression
        )
      case NodeType.LiteralInfinityExpression:
        return this.LiteralInfinityExpressionEcmaify(
          node as LiteralInfinityExpression
        )
      case NodeType.LiteralNullExpression:
        return this.LiteralNullExpressionEcmaify(node as LiteralNullExpression)
      case NodeType.LiteralNumericExpression:
        return this.LiteralNumericExpressionEcmaify(
          node as LiteralNumericExpression
        )
      case NodeType.LiteralRegExpExpression:
        return this.LiteralRegExpExpressionEcmaify(
          node as LiteralRegExpExpression
        )
      case NodeType.LiteralStringExpression:
        return this.LiteralStringExpressionEcmaify(
          node as LiteralStringExpression
        )
      case NodeType.ArrayExpression:
        return this.ArrayExpressionEcmaify(node as ArrayExpression)
      case NodeType.EagerArrowExpressionWithFunctionBody:
        return this.EagerArrowExpressionWithFunctionBodyEcmaify(
          node as EagerArrowExpressionWithFunctionBody
        )
      case NodeType.LazyArrowExpressionWithFunctionBody:
        return this.LazyArrowExpressionWithFunctionBodyEcmaify(
          node as LazyArrowExpressionWithFunctionBody
        )
      case NodeType.EagerArrowExpressionWithExpression:
        return this.EagerArrowExpressionWithExpressionEcmaify(
          node as EagerArrowExpressionWithExpression
        )
      case NodeType.LazyArrowExpressionWithExpression:
        return this.LazyArrowExpressionWithExpressionEcmaify(
          node as LazyArrowExpressionWithExpression
        )
      case NodeType.ArrowExpressionContentsWithFunctionBody:
        return this.ArrowExpressionContentsWithFunctionBodyEcmaify(
          node as ArrowExpressionContentsWithFunctionBody
        )
      case NodeType.ArrowExpressionContentsWithExpression:
        return this.ArrowExpressionContentsWithExpressionEcmaify(
          node as ArrowExpressionContentsWithExpression
        )
      case NodeType.AssignmentExpression:
        return this.AssignmentExpressionEcmaify(node as AssignmentExpression)
      case NodeType.BinaryExpression:
        return this.BinaryExpressionEcmaify(node as BinaryExpression)
      case NodeType.CallExpression:
        return this.CallExpressionEcmaify(node as CallExpression)
      case NodeType.CompoundAssignmentExpression:
        return this.CompoundAssignmentExpressionEcmaify(
          node as CompoundAssignmentExpression
        )
      case NodeType.ComputedMemberExpression:
        return this.ComputedMemberExpressionEcmaify(
          node as ComputedMemberExpression
        )
      case NodeType.ConditionalExpression:
        return this.ConditionalExpressionEcmaify(node as ConditionalExpression)
      case NodeType.EagerFunctionExpression:
        return this.EagerFunctionExpressionEcmaify(
          node as EagerFunctionExpression
        )
      case NodeType.LazyFunctionExpression:
        return this.LazyFunctionExpressionEcmaify(
          node as LazyFunctionExpression
        )
      case NodeType.FunctionExpressionContents:
        return this.FunctionExpressionContentsEcmaify(
          node as FunctionExpressionContents
        )
      case NodeType.IdentifierExpression:
        return this.IdentifierExpressionEcmaify(node as IdentifierExpression)
      case NodeType.NewExpression:
        return this.NewExpressionEcmaify(node as NewExpression)
      case NodeType.NewTargetExpression:
        return this.NewTargetExpressionEcmaify(node as NewTargetExpression)
      case NodeType.ObjectExpression:
        return this.ObjectExpressionEcmaify(node as ObjectExpression)
      case NodeType.UnaryExpression:
        return this.UnaryExpressionEcmaify(node as UnaryExpression)
      case NodeType.StaticMemberExpression:
        return this.StaticMemberExpressionEcmaify(
          node as StaticMemberExpression
        )
      case NodeType.TemplateExpression:
        return this.TemplateExpressionEcmaify(node as TemplateExpression)
      case NodeType.ThisExpression:
        return this.ThisExpressionEcmaify(node as ThisExpression)
      case NodeType.UpdateExpression:
        return this.UpdateExpressionEcmaify(node as UpdateExpression)
      case NodeType.YieldExpression:
        return this.YieldExpressionEcmaify(node as YieldExpression)
      case NodeType.YieldStarExpression:
        return this.YieldStarExpressionEcmaify(node as YieldStarExpression)
      case NodeType.AwaitExpression:
        return this.AwaitExpressionEcmaify(node as AwaitExpression)
      case NodeType.BreakStatement:
        return this.BreakStatementEcmaify(node as BreakStatement)
      case NodeType.ContinueStatement:
        return this.ContinueStatementEcmaify(node as ContinueStatement)
      case NodeType.DebuggerStatement:
        return this.DebuggerStatementEcmaify(node as DebuggerStatement)
      case NodeType.DoWhileStatement:
        return this.DoWhileStatementEcmaify(node as DoWhileStatement)
      case NodeType.EmptyStatement:
        return this.EmptyStatementEcmaify(node as EmptyStatement)
      case NodeType.ExpressionStatement:
        return this.ExpressionStatementEcmaify(node as ExpressionStatement)
      case NodeType.ForInOfBinding:
        return this.ForInOfBindingEcmaify(node as ForInOfBinding)
      case NodeType.ForInStatement:
        return this.ForInStatementEcmaify(node as ForInStatement)
      case NodeType.ForOfStatement:
        return this.ForOfStatementEcmaify(node as ForOfStatement)
      case NodeType.ForStatement:
        return this.ForStatementEcmaify(node as ForStatement)
      case NodeType.IfStatement:
        return this.IfStatementEcmaify(node as IfStatement)
      case NodeType.LabelledStatement:
        return this.LabelledStatementEcmaify(node as LabelledStatement)
      case NodeType.ReturnStatement:
        return this.ReturnStatementEcmaify(node as ReturnStatement)
      case NodeType.SwitchStatement:
        return this.SwitchStatementEcmaify(node as SwitchStatement)
      case NodeType.SwitchStatementWithDefault:
        return this.SwitchStatementWithDefaultEcmaify(
          node as SwitchStatementWithDefault
        )
      case NodeType.ThrowStatement:
        return this.ThrowStatementEcmaify(node as ThrowStatement)
      case NodeType.TryCatchStatement:
        return this.TryCatchStatementEcmaify(node as TryCatchStatement)
      case NodeType.TryFinallyStatement:
        return this.TryFinallyStatementEcmaify(node as TryFinallyStatement)
      case NodeType.WhileStatement:
        return this.WhileStatementEcmaify(node as WhileStatement)
      case NodeType.WithStatement:
        return this.WithStatementEcmaify(node as WithStatement)
      case NodeType.Block:
        return this.BlockEcmaify(node as Block)
      case NodeType.CatchClause:
        return this.CatchClauseEcmaify(node as CatchClause)
      case NodeType.Directive:
        return this.DirectiveEcmaify(node as Directive)
      case NodeType.FormalParameters:
        return this.FormalParametersEcmaify(node as FormalParameters)
      case NodeType.EagerFunctionDeclaration:
        return this.EagerFunctionDeclarationEcmaify(
          node as EagerFunctionDeclaration
        )
      case NodeType.LazyFunctionDeclaration:
        return this.LazyFunctionDeclarationEcmaify(
          node as LazyFunctionDeclaration
        )
      case NodeType.FunctionOrMethodContents:
        return this.FunctionOrMethodContentsEcmaify(
          node as FunctionOrMethodContents
        )
      case NodeType.Script:
        return this.ScriptEcmaify(node as Script)
      case NodeType.SpreadElement:
        return this.SpreadElementEcmaify(node as SpreadElement)
      case NodeType.Super:
        return this.SuperEcmaify(node as Super)
      case NodeType.SwitchCase:
        return this.SwitchCaseEcmaify(node as SwitchCase)
      case NodeType.SwitchDefault:
        return this.SwitchDefaultEcmaify(node as SwitchDefault)
      case NodeType.TemplateElement:
        return this.TemplateElementEcmaify(node as TemplateElement)
      case NodeType.VariableDeclaration:
        return this.VariableDeclarationEcmaify(node as VariableDeclaration)
      case NodeType.VariableDeclarator:
        return this.VariableDeclaratorEcmaify(node as VariableDeclarator)
      default:
        throw new Error('Unexpected type')
    }
  }

  StatementEcmaify(stmt: Statement): ts.Statement {
    switch (stmt.type) {
      case NodeType.Block:
        return this.BlockEcmaify(stmt)
      case NodeType.BreakStatement:
        return this.BreakStatementEcmaify(stmt)
      case NodeType.ContinueStatement:
        return this.ContinueStatementEcmaify(stmt)
      case NodeType.ClassDeclaration:
        return this.ClassDeclarationEcmaify(stmt)
      case NodeType.DebuggerStatement:
        return this.DebuggerStatementEcmaify(stmt)
      case NodeType.EmptyStatement:
        return this.EmptyStatementEcmaify(stmt)
      case NodeType.ExpressionStatement:
        return this.ExpressionStatementEcmaify(stmt)
      case NodeType.EagerFunctionDeclaration:
        return this.EagerFunctionDeclarationEcmaify(stmt)
      case NodeType.LazyFunctionDeclaration:
        return this.LazyFunctionDeclarationEcmaify(stmt)
      case NodeType.IfStatement:
        return this.IfStatementEcmaify(stmt)
      case NodeType.DoWhileStatement:
        return this.DoWhileStatementEcmaify(stmt)
      case NodeType.ForInStatement:
        return this.ForInStatementEcmaify(stmt)
      case NodeType.ForOfStatement:
        return this.ForOfStatementEcmaify(stmt)
      case NodeType.ForStatement:
        return this.ForStatementEcmaify(stmt)
      case NodeType.WhileStatement:
        return this.WhileStatementEcmaify(stmt)
      case NodeType.LabelledStatement:
        return this.LabelledStatementEcmaify(stmt)
      case NodeType.ReturnStatement:
        return this.ReturnStatementEcmaify(stmt)
      case NodeType.SwitchStatement:
        return this.SwitchStatementEcmaify(stmt)
      case NodeType.SwitchStatementWithDefault:
        return this.SwitchStatementWithDefaultEcmaify(stmt)
      case NodeType.ThrowStatement:
        return this.ThrowStatementEcmaify(stmt)
      case NodeType.TryCatchStatement:
        return this.TryCatchStatementEcmaify(stmt)
      case NodeType.TryFinallyStatement:
        return this.TryFinallyStatementEcmaify(stmt)
      case NodeType.VariableDeclaration:
        return this.VariableDeclarationEcmaify(stmt)
      case NodeType.WithStatement:
        return this.WithStatementEcmaify(stmt)
    }
  }

  ExpressionEcmaify(node: Expression): ts.Expression {
    switch (node.type) {
      case NodeType.LiteralBooleanExpression:
        return this.LiteralBooleanExpressionEcmaify(node)
      case NodeType.LiteralInfinityExpression:
        return this.LiteralInfinityExpressionEcmaify(node)
      case NodeType.LiteralNullExpression:
        return this.LiteralNullExpressionEcmaify(node)
      case NodeType.LiteralNumericExpression:
        return this.LiteralNumericExpressionEcmaify(node)
      case NodeType.LiteralRegExpExpression:
        return this.LiteralRegExpExpressionEcmaify(node)
      case NodeType.LiteralStringExpression:
        return this.LiteralStringExpressionEcmaify(node)
      case NodeType.ArrayExpression:
        return this.ArrayExpressionEcmaify(node)
      case NodeType.EagerArrowExpressionWithFunctionBody:
        return this.EagerArrowExpressionWithFunctionBodyEcmaify(node)
      case NodeType.LazyArrowExpressionWithFunctionBody:
        return this.LazyArrowExpressionWithFunctionBodyEcmaify(node)
      case NodeType.EagerArrowExpressionWithExpression:
        return this.EagerArrowExpressionWithExpressionEcmaify(node)
      case NodeType.LazyArrowExpressionWithExpression:
        return this.LazyArrowExpressionWithExpressionEcmaify(node)
      case NodeType.AssignmentExpression:
        return this.AssignmentExpressionEcmaify(node)
      case NodeType.BinaryExpression:
        return this.BinaryExpressionEcmaify(node)
      case NodeType.CallExpression:
        return this.CallExpressionEcmaify(node)
      case NodeType.CompoundAssignmentExpression:
        return this.CompoundAssignmentExpressionEcmaify(node)
      case NodeType.ComputedMemberExpression:
        return this.ComputedMemberExpressionEcmaify(node)
      case NodeType.ConditionalExpression:
        return this.ConditionalExpressionEcmaify(node)
      case NodeType.ClassExpression:
        return this.ClassExpressionEcmaify(node)
      case NodeType.EagerFunctionExpression:
        return this.EagerFunctionExpressionEcmaify(node)
      case NodeType.LazyFunctionExpression:
        return this.LazyFunctionExpressionEcmaify(node)
      case NodeType.IdentifierExpression:
        return this.IdentifierExpressionEcmaify(node)
      case NodeType.NewExpression:
        return this.NewExpressionEcmaify(node)
      case NodeType.NewTargetExpression:
        return this.NewTargetExpressionEcmaify(node)
      case NodeType.ObjectExpression:
        return this.ObjectExpressionEcmaify(node)
      case NodeType.UnaryExpression:
        return this.UnaryExpressionEcmaify(node)
      case NodeType.StaticMemberExpression:
        return this.StaticMemberExpressionEcmaify(node)
      case NodeType.TemplateExpression:
        return this.TemplateExpressionEcmaify(node)
      case NodeType.ThisExpression:
        return this.ThisExpressionEcmaify(node)
      case NodeType.UpdateExpression:
        return this.UpdateExpressionEcmaify(node)
      case NodeType.YieldExpression:
        return this.YieldExpressionEcmaify(node)
      case NodeType.YieldStarExpression:
        return this.YieldStarExpressionEcmaify(node)
      case NodeType.AwaitExpression:
        return this.AwaitExpressionEcmaify(node)
    }
  }

  AssertedBoundNameEcmaify(node: AssertedBoundName): any {
    throw new Error('Not Implemented')
  }
  AssertedBlockScopeEcmaify(node: AssertedBlockScope): any {
    throw new Error('Not Implemented')
  }
  AssertedScriptGlobalScopeEcmaify(node: AssertedScriptGlobalScope): any {
    throw new Error('Not Implemented')
  }
  AssertedVarScopeEcmaify(node: AssertedVarScope): any {
    throw new Error('Not Implemented')
  }
  AssertedParameterScopeEcmaify(node: AssertedParameterScope): any {
    throw new Error('Not Implemented')
  }
  AssertedBoundNamesScopeEcmaify(node: AssertedBoundNamesScope): any {
    throw new Error('Not Implemented')
  }
  AssertedDeclaredNameEcmaify(node: AssertedDeclaredName): any {
    throw new Error('Not Implemented')
  }
  AssertedPositionalParameterNameEcmaify(
    node: AssertedPositionalParameterName
  ): any {
    throw new Error('Not Implemented')
  }
  AssertedRestParameterNameEcmaify(node: AssertedRestParameterName): any {
    throw new Error('Not Implemented')
  }
  AssertedParameterNameEcmaify(node: AssertedParameterName): any {
    throw new Error('Not Implemented')
  }

  BindingIdentifierEcmaify(node: BindingIdentifier): ts.Identifier {
    return ts.createIdentifier(node.name)
  }

  BindingWithInitializerEcmaify(
    node: BindingWithInitializer
  ): ts.BindingElement {
    return ts.createBindingElement(
      undefined,
      undefined,
      this.BindingEcmaify(node.binding),
      this.ExpressionEcmaify(node.init)
    )
  }

  AssignmentTargetIdentifierEcmaify(
    node: AssignmentTargetIdentifier
  ): ts.Identifier {
    return ts.createIdentifier(node.name)
  }

  ComputedMemberAssignmentTargetEcmaify(
    node: ComputedMemberAssignmentTarget
  ): ts.ElementAccessExpression {
    return ts.createElementAccess(
      this.ExpressionOrSuperEcmaify(node._object),
      this.ExpressionEcmaify(node.expression)
    )
  }

  StaticMemberAssignmentTargetEcmaify(
    node: StaticMemberAssignmentTarget
  ): ts.PropertyAccessExpression {
    return ts.createPropertyAccess(
      this.ExpressionOrSuperEcmaify(node._object),
      ts.createIdentifier(node.property)
    )
  }

  BindingOrBindingWithInitializerListEcmaify(
    nodes: FrozenArray<Binding | BindingWithInitializer>
  ) {
    return this.EcmaifyList(nodes, this.BindingOrBindingWithInitializerEcmaify)
  }

  BindingOrBindingWithInitializerEcmaify(
    node: Binding | BindingWithInitializer
  ): ts.BindingElement {
    switch (node.type) {
      case NodeType.BindingWithInitializer:
        return this.BindingWithInitializerEcmaify(node)
      default:
        return ts.createBindingElement(
          undefined,
          undefined,
          this.BindingEcmaify(node)
        )
    }
  }

  ArrayBindingEcmaify(node: ArrayBinding): ts.ArrayBindingPattern {
    return ts.createArrayBindingPattern(
      this.BindingOrBindingWithInitializerListEcmaify(node.elements).concat([
        this.BindingOrBindingWithInitializerEcmaify(node.rest!)
      ])
    )
  }

  BindingPropertyIdentifierEcmaify(
    node: BindingPropertyIdentifier
  ): ts.BindingElement {
    return ts.createBindingElement(
      undefined,
      undefined,
      this.BindingEcmaify(node.binding),
      this.EcmaifyOption(node.init, this.ExpressionEcmaify)
    )
  }
  BindingPropertyPropertyEcmaify(
    node: BindingPropertyProperty
  ): ts.BindingElement {
    const element = this.BindingOrBindingWithInitializerEcmaify(node.binding)
    element.propertyName = this.PropertyNameEcmaify(node.name)
    return element
  }

  BindingPropertyListEcmaify(
    nodes: FrozenArray<BindingProperty>
  ): ts.BindingElement[] {
    return this.EcmaifyList(nodes, node => {
      switch (node.type) {
        case NodeType.BindingPropertyIdentifier:
          return this.BindingPropertyIdentifierEcmaify(node)
        case NodeType.BindingPropertyProperty:
          return this.BindingPropertyPropertyEcmaify(node)
      }
    })
  }

  ObjectBindingEcmaify(node: ObjectBinding): ts.ObjectBindingPattern {
    return ts.createObjectBindingPattern(
      this.BindingPropertyListEcmaify(node.properties)
    )
  }

  AssignmentTargetWithInitializerEcmaify(
    node: AssignmentTargetWithInitializer
  ): ts.BinaryExpression {
    return ts.createAssignment(
      this.AssignmentTargetEcmaify(node.binding),
      this.ExpressionEcmaify(node.init)
    )
  }

  AssignmentTargetOrAssignmentTargetWithInitializerEcmaify(
    node: AssignmentTarget | AssignmentTargetWithInitializer
  ): ts.Expression {
    switch (node.type) {
      case NodeType.AssignmentTargetWithInitializer:
        return this.AssignmentTargetWithInitializerEcmaify(node)
      default:
        return this.AssignmentTargetEcmaify(node)
    }
  }

  ArrayAssignmentTargetEcmaify(
    node: ArrayAssignmentTarget
  ): ts.ArrayLiteralExpression {
    const rest = this.EcmaifyOption(node.rest, this.AssignmentTargetEcmaify)
    return ts.createArrayLiteral(
      append<ts.Expression>(
        this.EcmaifyList(
          node.elements,
          this.AssignmentTargetOrAssignmentTargetWithInitializerEcmaify
        ),
        rest && ts.createSpread(rest)
      )
    )
  }
  AssignmentTargetPropertyIdentifierEcmaify(
    node: AssignmentTargetPropertyIdentifier
  ): ts.ShorthandPropertyAssignment {
    return ts.createShorthandPropertyAssignment(
      this.AssignmentTargetIdentifierEcmaify(node.binding),
      this.EcmaifyOption(node.init, this.ExpressionEcmaify)
    )
  }

  AssignmentTargetPropertyPropertyEcmaify(
    node: AssignmentTargetPropertyProperty
  ): ts.PropertyAssignment {
    return ts.createPropertyAssignment(
      this.PropertyNameEcmaify(node.name),
      this.AssignmentTargetOrAssignmentTargetWithInitializerEcmaify(
        node.binding
      )
    )
  }

  AssignmentTargetPropertyEcmaify(node: AssignmentTargetProperty) {
    switch (node.type) {
      case NodeType.AssignmentTargetPropertyIdentifier:
        return this.AssignmentTargetPropertyIdentifierEcmaify(node)
      case NodeType.AssignmentTargetPropertyProperty:
        return this.AssignmentTargetPropertyPropertyEcmaify(node)
    }
  }

  ObjectAssignmentTargetEcmaify(
    node: ObjectAssignmentTarget
  ): ts.ObjectLiteralExpression {
    return ts.createObjectLiteral(
      this.EcmaifyList(node.properties, this.AssignmentTargetPropertyEcmaify)
    )
  }

  HeritageClauseEcmaify(node: Expression): ts.HeritageClause {
    return ts.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
      ts.createExpressionWithTypeArguments(
        undefined,
        this.ExpressionEcmaify(node)
      )
    ])
  }

  ClassExpressionEcmaify(node: ClassExpression): ts.ClassExpression {
    return ts.createClassExpression(
      undefined,
      this.EcmaifyOption(node.name, this.BindingIdentifierEcmaify),
      undefined,
      this.EcmaifyOption(node.super, node => [
        this.HeritageClauseEcmaify(node)
      ]),
      this.EcmaifyList(node.elements, this.ClassElementEcmaify)
    )
  }

  ClassDeclarationEcmaify(node: ClassDeclaration): ts.ClassDeclaration {
    return ts.createClassDeclaration(
      undefined,
      undefined,
      this.BindingIdentifierEcmaify(node.name),
      undefined,
      this.EcmaifyOption(node.super, node => [
        this.HeritageClauseEcmaify(node)
      ]),
      this.EcmaifyList(node.elements, this.ClassElementEcmaify)
    )
  }

  ClassElementEcmaify(node: ClassElement): ts.ClassElement {
    const method = this.MethodDefinitionEcmaify(node.method)
    addModifiers(
      method,
      node.isStatic ? ts.ModifierFlags.Static : ts.ModifierFlags.None
    )
    return method
  }

  ImportDeclarationOrExportDeclarationOrStatementEcmaify(
    node: ImportDeclaration | ExportDeclaration | Statement
  ) {
    switch (node.type) {
      case NodeType.Import:
      case NodeType.ImportNamespace:
        return this.ImportDeclarationEcmaify(node)
      case NodeType.ExportAllFrom:
      case NodeType.ExportFrom:
      case NodeType.ExportLocals:
      case NodeType.ExportDefault:
      case NodeType.Export:
        return this.ExportDeclarationEcmaify(node)
      default:
        return this.StatementEcmaify(node)
    }
  }

  ModuleEcmaify(node: Module) {
    return this.EcmaifyList(
      node.items,
      this.ImportDeclarationOrExportDeclarationOrStatementEcmaify
    )
  }

  NamedImportBindingsEcmaify(
    nodes: ReadonlyArray<ImportSpecifier>
  ): ts.NamedImports {
    return ts.createNamedImports(
      this.EcmaifyList(nodes, this.ImportSpecifierEcmaify)
    )
  }

  ImportClauseImportEcmaify(node: Import): ts.ImportClause {
    return ts.createImportClause(
      this.EcmaifyOption(node.defaultBinding, this.BindingIdentifierEcmaify),
      this.EcmaifyOption(node.namedImports, this.NamedImportBindingsEcmaify)
    )
  }

  ImportClauseImportNamespaceEcmaify(node: ImportNamespace): ts.ImportClause {
    return ts.createImportClause(
      this.EcmaifyOption(node.defaultBinding, this.BindingIdentifierEcmaify),
      ts.createNamespaceImport(
        this.BindingIdentifierEcmaify(node.namespaceBinding)
      )
    )
  }

  ImportClauseEcmaify(node: Import | ImportNamespace): ts.ImportClause {
    switch (node.type) {
      case NodeType.Import:
        return this.ImportClauseImportEcmaify(node)
      case NodeType.ImportNamespace:
        return this.ImportClauseImportNamespaceEcmaify(node)
    }
  }

  ImportEcmaify(node: Import): ts.ImportDeclaration {
    return ts.createImportDeclaration(
      undefined,
      undefined,
      this.ImportClauseEcmaify(node),
      ts.createStringLiteral(node.moduleSpecifier)
    )
  }

  ImportNamespaceEcmaify(node: ImportNamespace): ts.ImportDeclaration {
    return ts.createImportDeclaration(
      undefined,
      undefined,
      this.ImportClauseEcmaify(node),
      ts.createStringLiteral(node.moduleSpecifier)
    )
  }

  ImportDeclarationEcmaify(node: ImportDeclaration) {
    switch (node.type) {
      case NodeType.Import:
        return this.ImportEcmaify(node)
      case NodeType.ImportNamespace:
        return this.ImportNamespaceEcmaify(node)
    }
  }

  IdentifierNameEcmaify(node: IdentifierName): ts.Identifier {
    return ts.createIdentifier(node)
  }

  ImportSpecifierEcmaify(node: ImportSpecifier): ts.ImportSpecifier {
    return ts.createImportSpecifier(
      this.IdentifierNameEcmaify(node.name),
      this.BindingIdentifierEcmaify(node.binding)
    )
  }

  ExportAllFromEcmaify(node: ExportAllFrom): ts.ExportDeclaration {
    return ts.createExportDeclaration(
      undefined,
      undefined,
      undefined,
      ts.createStringLiteral(node.moduleSpecifier)
    )
  }

  NamedExportsEcmaify(
    nodes: ReadonlyArray<ExportFromSpecifier | ExportLocalSpecifier>
  ): ts.NamedExports {
    return ts.createNamedExports(
      this.EcmaifyList(nodes, this.ExportSpecifierEcmaify)
    )
  }

  ExportFromEcmaify(node: ExportFrom): ts.ExportDeclaration {
    return ts.createExportDeclaration(
      undefined,
      undefined,
      this.NamedExportsEcmaify(node.namedExports),
      ts.createIdentifier(node.moduleSpecifier)
    )
  }

  ExportLocalsEcmaify(node: ExportLocals): ts.ExportDeclaration {
    return ts.createExportDeclaration(
      undefined,
      undefined,
      this.NamedExportsEcmaify(node.namedExports),
      undefined
    )
  }

  ExportEcmaify(
    node: Export
  ): ts.FunctionDeclaration | ts.ClassDeclaration | ts.VariableStatement {
    return addModifiers<
      ts.FunctionDeclaration | ts.ClassDeclaration | ts.VariableStatement
    >(
      this.FunctionDeclarationOrClassDeclarationOrVariableDeclarationEcmaify(
        node.declaration
      ),
      ts.ModifierFlags.Export
    )
  }

  FunctionDeclarationOrClassDeclarationEcmaify(
    node: FunctionDeclaration | ClassDeclaration
  ): ts.FunctionDeclaration | ts.ClassDeclaration {
    switch (node.type) {
      case NodeType.ClassDeclaration:
        return this.ClassDeclarationEcmaify(node)
      default:
        return this.FunctionDeclarationEcmaify(node)
    }
  }

  FunctionDeclarationOrClassDeclarationOrVariableDeclarationEcmaify(
    node: FunctionDeclaration | ClassDeclaration | VariableDeclaration
  ): ts.FunctionDeclaration | ts.ClassDeclaration | ts.VariableStatement {
    switch (node.type) {
      case NodeType.VariableDeclaration:
        return this.VariableDeclarationEcmaify(node)
      default:
        return this.FunctionDeclarationOrClassDeclarationEcmaify(node)
    }
  }

  ExportDefaultFunctionDeclarationOrClassDeclarationEcmaify(
    node: FunctionDeclaration | ClassDeclaration
  ): ts.FunctionDeclaration | ts.ClassDeclaration {
    return addModifiers(
      this.FunctionDeclarationOrClassDeclarationEcmaify(node),
      ts.ModifierFlags.ExportDefault
    )
  }

  ExportDefaultEcmaify(
    node: ExportDefault
  ): ts.FunctionDeclaration | ts.ClassDeclaration | ts.ExportAssignment {
    switch (node.body.type) {
      case NodeType.EagerFunctionDeclaration:
      case NodeType.LazyFunctionDeclaration:
      case NodeType.ClassDeclaration:
        return this.ExportDefaultFunctionDeclarationOrClassDeclarationEcmaify(
          node.body
        )
      default:
        return ts.createExportAssignment(
          undefined,
          undefined,
          undefined,
          this.ExpressionEcmaify(node.body)
        )
    }
  }

  ExportFromSpecifierEcmaify(node: ExportFromSpecifier): ts.ExportSpecifier {
    return ts.createExportSpecifier(node.exportedName, node.name)
  }

  ExportLocalSpecifierEcmaify(node: ExportLocalSpecifier): ts.ExportSpecifier {
    return ts.createExportSpecifier(
      node.exportedName,
      this.IdentifierExpressionEcmaify(node.name)
    )
  }

  ExportSpecifierEcmaify(node: ExportFromSpecifier | ExportLocalSpecifier) {
    switch (node.type) {
      case NodeType.ExportFromSpecifier:
        return this.ExportFromSpecifierEcmaify(node)
      case NodeType.ExportLocalSpecifier:
        return this.ExportLocalSpecifierEcmaify(node)
    }
  }

  ExportDeclarationEcmaify(node: ExportDeclaration) {
    switch (node.type) {
      case NodeType.ExportAllFrom:
        return this.ExportAllFromEcmaify(node)
      case NodeType.ExportFrom:
        return this.ExportFromEcmaify(node)
      case NodeType.ExportLocals:
        return this.ExportLocalsEcmaify(node)
      case NodeType.ExportDefault:
        return this.ExportDefaultEcmaify(node)
      case NodeType.Export:
        return this.ExportEcmaify(node)
    }
  }

  uniformMethodEcmaify(node: EagerMethod | LazyMethod): ts.MethodDeclaration {
    const contents = this.MethodContentsEcmaify(node.contents)
    addModifiers(
      contents,
      node.isAsync ? ts.ModifierFlags.Async : ts.ModifierFlags.None
    )
    contents.name = this.PropertyNameEcmaify(node.name)
    contents.asteriskToken = node.isGenerator
      ? ts.createToken(ts.SyntaxKind.AsteriskToken)
      : undefined
    return contents
  }

  EagerMethodEcmaify(node: EagerMethod): ts.MethodDeclaration {
    return this.uniformMethodEcmaify(node)
  }

  LazyMethodEcmaify(node: LazyMethod): ts.MethodDeclaration {
    return this.uniformMethodEcmaify(node)
  }

  uniformGetterEcmaify(node: Getter): ts.GetAccessorDeclaration {
    const contents = this.GetterContentsEcmaify(node.contents)
    contents.name = this.PropertyNameEcmaify(node.name)
    return contents
  }

  EagerGetterEcmaify(node: EagerGetter): ts.GetAccessorDeclaration {
    return this.uniformGetterEcmaify(node)
  }

  LazyGetterEcmaify(node: LazyGetter): ts.GetAccessorDeclaration {
    return this.uniformGetterEcmaify(node)
  }

  GetterContentsEcmaify(node: GetterContents): ts.GetAccessorDeclaration {
    return ts.createGetAccessor(
      undefined,
      undefined,
      '',
      [],
      undefined,
      ts.createBlock(this.StatementListEcmaify(node.body))
    )
  }

  uniformSetterEcmaify(node: Setter): ts.SetAccessorDeclaration {
    const contents = this.SetterContentsEcmaify(node.contents)
    contents.name = this.PropertyNameEcmaify(node.name)

    return contents
  }

  EagerSetterEcmaify(node: EagerSetter): ts.SetAccessorDeclaration {
    return this.uniformSetterEcmaify(node)
  }

  LazySetterEcmaify(node: LazySetter): ts.SetAccessorDeclaration {
    return this.uniformSetterEcmaify(node)
  }

  SetterContentsEcmaify(node: SetterContents): ts.SetAccessorDeclaration {
    return ts.createSetAccessor(
      undefined,
      undefined,
      '',
      [this.ParameterEcmaify(node.param)],
      ts.createBlock(this.StatementListEcmaify(node.body))
    )
  }

  PropertyNameEcmaify(node: PropertyName): ts.PropertyName {
    switch (node.type) {
      case NodeType.ComputedPropertyName:
        return this.ComputedPropertyNameEcmaify(node)
      case NodeType.LiteralPropertyName:
        return this.LiteralPropertyNameEcmaify(node)
    }
  }

  DataPropertyEcmaify(node: DataProperty): ts.PropertyAssignment {
    return ts.createPropertyAssignment(
      this.PropertyNameEcmaify(node.name),
      this.ExpressionEcmaify(node.expression)
    )
  }
  ShorthandPropertyEcmaify(
    node: ShorthandProperty
  ): ts.ShorthandPropertyAssignment {
    return ts.createShorthandPropertyAssignment(
      this.IdentifierExpressionEcmaify(node.name)
    )
  }

  ComputedPropertyNameEcmaify(
    node: ComputedPropertyName
  ): ts.ComputedPropertyName {
    return ts.createComputedPropertyName(
      this.ExpressionEcmaify(node.expression)
    )
  }

  LiteralPropertyNameEcmaify(node: LiteralPropertyName): ts.Identifier {
    return ts.createIdentifier(node.value)
  }

  LiteralBooleanExpressionEcmaify(
    node: LiteralBooleanExpression
  ): ts.BooleanLiteral {
    return ts.createLiteral(node.value)
  }

  LiteralInfinityExpressionEcmaify(
    node: LiteralInfinityExpression
  ): ts.NumericLiteral {
    return ts.createLiteral(Infinity)
  }

  LiteralNullExpressionEcmaify(node: LiteralNullExpression): ts.NullLiteral {
    return ts.createNull()
  }

  LiteralNumericExpressionEcmaify(
    node: LiteralNumericExpression
  ): ts.NumericLiteral {
    return ts.createLiteral(node.value)
  }

  LiteralRegExpExpressionEcmaify(
    node: LiteralRegExpExpression
  ): ts.RegularExpressionLiteral {
    return ts.createRegularExpressionLiteral((new RegExp(node.pattern, node.flags)).toString())
  }

  LiteralStringExpressionEcmaify(
    node: LiteralStringExpression
  ): ts.StringLiteral {
    return ts.createStringLiteral(node.value)
  }

  SpreadElementOrExpressionListEcmaify(
    nodes: FrozenArray<SpreadElement | Expression>
  ): ts.Expression[] {
    return this.EcmaifyList(nodes, node => {
      if (isSpreadElement(node)) {
        return ts.createSpread(this.ExpressionEcmaify(node.expression))
      } else {
        return this.ExpressionEcmaify(node)
      }
    })
  }

  ArrayExpressionEcmaify(node: ArrayExpression): ts.ArrayLiteralExpression {
    return ts.createArrayLiteral(
      this.SpreadElementOrExpressionListEcmaify(node.elements)
    )
  }

  uniformArrowExpressionWithFunctionBodyEcmaify(
    node:
      | EagerArrowExpressionWithFunctionBody
      | LazyArrowExpressionWithFunctionBody
  ): ts.ArrowFunction {
    const contents = this.ArrowExpressionContentsWithFunctionBodyEcmaify(
      node.contents
    )
    contents.asteriskToken = node.isAsync
      ? ts.createToken(ts.SyntaxKind.AsteriskToken)
      : undefined
    return contents
  }

  EagerArrowExpressionWithFunctionBodyEcmaify(
    node: EagerArrowExpressionWithFunctionBody
  ): ts.ArrowFunction {
    return this.uniformArrowExpressionWithFunctionBodyEcmaify(node)
  }

  LazyArrowExpressionWithFunctionBodyEcmaify(
    node: LazyArrowExpressionWithFunctionBody
  ): ts.ArrowFunction {
    return this.uniformArrowExpressionWithFunctionBodyEcmaify(node)
  }

  uniformArrowExpressionWithExpressionEcmaify(
    node: EagerArrowExpressionWithExpression | LazyArrowExpressionWithExpression
  ): ts.ArrowFunction {
    const contents = this.ArrowExpressionContentsWithExpressionEcmaify(
      node.contents
    )
    contents.asteriskToken = node.isAsync
      ? ts.createToken(ts.SyntaxKind.AsteriskToken)
      : undefined
    return contents
  }

  EagerArrowExpressionWithExpressionEcmaify(
    node: EagerArrowExpressionWithExpression
  ): ts.ArrowFunction {
    return this.uniformArrowExpressionWithExpressionEcmaify(node)
  }

  LazyArrowExpressionWithExpressionEcmaify(
    node: LazyArrowExpressionWithExpression
  ): ts.ArrowFunction {
    return this.uniformArrowExpressionWithExpressionEcmaify(node)
  }

  ArrowExpressionContentsWithFunctionBodyEcmaify(
    node: ArrowExpressionContentsWithFunctionBody
  ): ts.ArrowFunction {
    return ts.createArrowFunction(
      undefined,
      undefined,
      this.FormalParametersEcmaify(node.params),
      undefined,
      ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
      ts.createBlock(this.StatementListEcmaify(node.body))
    )
  }

  ArrowExpressionContentsWithExpressionEcmaify(
    node: ArrowExpressionContentsWithExpression
  ): ts.ArrowFunction {
    return ts.createArrowFunction(
      undefined,
      undefined,
      this.FormalParametersEcmaify(node.params),
      undefined,
      ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
      this.ExpressionEcmaify(node.body)
    )
  }

  AssignmentExpressionEcmaify(node: AssignmentExpression): ts.BinaryExpression {
    return ts.createAssignment(
      this.AssignmentTargetEcmaify(node.binding),
      this.ExpressionEcmaify(node.expression)
    )
  }

  BinaryOperatorEcmaify(node: BinaryOperator): ts.BinaryOperator {
    switch (node) {
      case BinaryOperator.Comma:
        return ts.SyntaxKind.CommaToken
      case BinaryOperator.Or:
        return ts.SyntaxKind.BarBarToken
      case BinaryOperator.And:
        return ts.SyntaxKind.AmpersandAmpersandToken
      case BinaryOperator.LogicOr:
        return ts.SyntaxKind.BarToken
      case BinaryOperator.LogicXor:
        return ts.SyntaxKind.CaretToken
      case BinaryOperator.LogicAnd:
        return ts.SyntaxKind.BarToken
      case BinaryOperator.EqualEqual:
        return ts.SyntaxKind.EqualsEqualsToken
      case BinaryOperator.NotEqual:
        return ts.SyntaxKind.ExclamationEqualsToken
      case BinaryOperator.EqualEqualEqual:
        return ts.SyntaxKind.EqualsEqualsToken
      case BinaryOperator.NotEqualEqual:
        return ts.SyntaxKind.ExclamationEqualsEqualsToken
      case BinaryOperator.LessThan:
        return ts.SyntaxKind.LessThanToken
      case BinaryOperator.LessThanEqual:
        return ts.SyntaxKind.LessThanEqualsToken
      case BinaryOperator.GreaterThan:
        return ts.SyntaxKind.GreaterThanToken
      case BinaryOperator.GreaterThanEqual:
        return ts.SyntaxKind.GreaterThanEqualsToken
      case BinaryOperator.In:
        return ts.SyntaxKind.InKeyword
      case BinaryOperator.InstanceOf:
        return ts.SyntaxKind.InstanceOfKeyword
      case BinaryOperator.LessThanLessThan:
        return ts.SyntaxKind.LessThanLessThanToken
      case BinaryOperator.GreaterThanGreaterThan:
        return ts.SyntaxKind.GreaterThanGreaterThanToken
      case BinaryOperator.GreaterThanGreaterThanGreaterThan:
        return ts.SyntaxKind.GreaterThanGreaterThanGreaterThanToken
      case BinaryOperator.Plus:
        return ts.SyntaxKind.PlusToken
      case BinaryOperator.Minus:
        return ts.SyntaxKind.MinusToken
      case BinaryOperator.Star:
        return ts.SyntaxKind.AsteriskToken
      case BinaryOperator.Div:
        return ts.SyntaxKind.SlashToken
      case BinaryOperator.Mod:
        return ts.SyntaxKind.PercentToken
      case BinaryOperator.StarStar:
        return ts.SyntaxKind.AsteriskAsteriskToken
    }
  }

  BinaryExpressionEcmaify(node: BinaryExpression): ts.BinaryExpression {
    return ts.createBinary(
      this.ExpressionEcmaify(node.left),
      this.BinaryOperatorEcmaify(node.operator),
      this.ExpressionEcmaify(node.right)
    )
  }

  ArgumentsEcmaify(node: Arguments) {
    return this.SpreadElementOrExpressionListEcmaify(node)
  }

  ExpressionOrSuperEcmaify(
    node: Expression | Super
  ): ts.Expression | ts.SuperExpression {
    switch (node.type) {
      case NodeType.Super:
        return this.SuperEcmaify(node)
      default:
        return this.ExpressionEcmaify(node)
    }
  }

  CallExpressionEcmaify(
    node: CallExpression
  ): ts.CallExpression | ts.SuperCall {
    return ts.createCall(
      this.ExpressionOrSuperEcmaify(node.callee),
      undefined,
      this.ArgumentsEcmaify(node.arguments)
    )
  }

  CompoundAssignmentOperatorEcmaify(
    node: CompoundAssignmentOperator
  ): ts.CompoundAssignmentOperator {
    switch (node) {
      case CompoundAssignmentOperator.PlusEqual:
        return ts.SyntaxKind.PlusEqualsToken
      case CompoundAssignmentOperator.MinusEqual:
        return ts.SyntaxKind.MinusEqualsToken
      case CompoundAssignmentOperator.StarEqual:
        return ts.SyntaxKind.AsteriskEqualsToken
      case CompoundAssignmentOperator.DivEuqal:
        return ts.SyntaxKind.SlashEqualsToken
      case CompoundAssignmentOperator.ModEqual:
        return ts.SyntaxKind.PercentEqualsToken
      case CompoundAssignmentOperator.StarStarEqual:
        return ts.SyntaxKind.AsteriskAsteriskEqualsToken
      case CompoundAssignmentOperator.LessThanLessThanEqual:
        return ts.SyntaxKind.LessThanLessThanEqualsToken
      case CompoundAssignmentOperator.GreaterThanGreaterThanEequal:
        return ts.SyntaxKind.GreaterThanGreaterThanEqualsToken
      case CompoundAssignmentOperator.GreaterThanGreaterThanGreaterThanEequal:
        return ts.SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken
      case CompoundAssignmentOperator.LoginOrEqual:
        return ts.SyntaxKind.BarEqualsToken
      case CompoundAssignmentOperator.LogicAndEuqal:
        return ts.SyntaxKind.AmpersandEqualsToken
      case CompoundAssignmentOperator.LogicXorEqual:
        return ts.SyntaxKind.CaretEqualsToken
    }
  }

  CompoundAssignmentExpressionEcmaify(
    node: CompoundAssignmentExpression
  ): ts.BinaryExpression {
    return ts.createBinary(
      this.SimpleAssignmentTargetEcmaify(node.binding),
      this.CompoundAssignmentOperatorEcmaify(node.operator),
      this.ExpressionEcmaify(node.expression)
    )
  }

  ComputedMemberExpressionEcmaify(
    node: ComputedMemberExpression
  ): ts.ElementAccessExpression {
    return ts.createElementAccess(
      this.ExpressionOrSuperEcmaify(node._object),
      this.ExpressionEcmaify(node.expression)
    )
  }

  ConditionalExpressionEcmaify(
    node: ConditionalExpression
  ): ts.ConditionalExpression {
    return ts.createConditional(
      this.ExpressionEcmaify(node.test),
      this.ExpressionEcmaify(node.consequent),
      this.ExpressionEcmaify(node.alternate)
    )
  }

  uniformFunctionExpressionEcmaify(
    node: FunctionExpression
  ): ts.FunctionExpression {
    const contents = this.FunctionExpressionContentsEcmaify(node.contents)
    addModifiers(
      contents,
      node.isAsync ? ts.ModifierFlags.Async : ts.ModifierFlags.None
    )
    contents.asteriskToken = node.isGenerator
      ? ts.createToken(ts.SyntaxKind.AsteriskToken)
      : undefined
    contents.name = this.EcmaifyOption(node.name, this.BindingIdentifierEcmaify)
    return contents
  }

  EagerFunctionExpressionEcmaify(
    node: EagerFunctionExpression
  ): ts.FunctionExpression {
    return this.uniformFunctionExpressionEcmaify(node)
  }

  LazyFunctionExpressionEcmaify(
    node: LazyFunctionExpression
  ): ts.FunctionExpression {
    return this.uniformFunctionExpressionEcmaify(node)
  }

  FunctionExpressionContentsEcmaify(
    node: FunctionExpressionContents
  ): ts.FunctionExpression {
    return ts.createFunctionExpression(
      undefined,
      undefined,
      undefined,
      undefined,
      this.FormalParametersEcmaify(node.params),
      undefined,
      ts.createBlock(this.StatementListEcmaify(node.body))
    )
  }

  IdentifierExpressionEcmaify(node: IdentifierExpression): ts.Identifier {
    return ts.createIdentifier(node.name)
  }

  NewExpressionEcmaify(node: NewExpression): ts.NewExpression {
    return ts.createNew(
      this.ExpressionEcmaify(node.callee),
      undefined,
      this.ArgumentsEcmaify(node.arguments)
    )
  }

  NewTargetExpressionEcmaify(node: NewTargetExpression): ts.MetaProperty {
    return ts.createMetaProperty(
      ts.SyntaxKind.NewKeyword,
      ts.createIdentifier('target')
    )
  }

  MethodContentsEcmaify(node: FunctionOrMethodContents): ts.MethodDeclaration {
    return ts.createMethod(
      undefined,
      undefined,
      undefined,
      '',
      undefined,
      undefined,
      this.FormalParametersEcmaify(node.params),
      undefined,
      ts.createBlock(this.StatementListEcmaify(node.body))
    )
  }

  MethodEcmaify(node: Method): ts.MethodDeclaration {
    switch (node.type) {
      case NodeType.EagerMethod:
        return this.EagerMethodEcmaify(node)
      case NodeType.LazyMethod:
        return this.LazyMethodEcmaify(node)
    }
  }

  GetterEcmaify(node: Getter): ts.GetAccessorDeclaration {
    switch (node.type) {
      case NodeType.EagerGetter:
        return this.EagerGetterEcmaify(node)
      case NodeType.LazyGetter:
        return this.LazyGetterEcmaify(node)
    }
  }

  SetterEcmaify(node: Setter): ts.SetAccessorDeclaration {
    switch (node.type) {
      case NodeType.EagerSetter:
        return this.EagerSetterEcmaify(node)
      case NodeType.LazySetter:
        return this.LazySetterEcmaify(node)
    }
  }

  MethodDefinitionEcmaify(
    node: MethodDefinition
  ): ts.MethodDeclaration | ts.AccessorDeclaration {
    switch (node.type) {
      case NodeType.EagerMethod:
      case NodeType.LazyMethod:
        return this.MethodEcmaify(node)
      case NodeType.EagerGetter:
      case NodeType.LazyGetter:
        return this.GetterEcmaify(node)
      case NodeType.EagerSetter:
      case NodeType.LazySetter:
        return this.SetterEcmaify(node)
    }
  }

  ObjectPropertyListEcmaify(
    nodes: FrozenArray<ObjectProperty>
  ): ts.ObjectLiteralElementLike[] {
    return this.EcmaifyList(nodes, node => {
      switch (node.type) {
        case NodeType.DataProperty:
          return this.DataPropertyEcmaify(node)
        case NodeType.ShorthandProperty:
          return this.ShorthandPropertyEcmaify(node)
        case NodeType.EagerMethod:
        case NodeType.LazyMethod:
        case NodeType.EagerGetter:
        case NodeType.LazyGetter:
        case NodeType.EagerSetter:
        case NodeType.LazySetter:
          return this.MethodDefinitionEcmaify(node)
      }
    })
  }

  ObjectExpressionEcmaify(node: ObjectExpression): ts.ObjectLiteralExpression {
    return ts.createObjectLiteral(
      this.ObjectPropertyListEcmaify(node.properties)
    )
  }

  UnaryOperatorEcmaify(
    node:
      | UnaryOperator.Plus
      | UnaryOperator.Minus
      | UnaryOperator.Not
      | UnaryOperator.LogicNot
  ): ts.PrefixUnaryOperator {
    switch (node) {
      case UnaryOperator.Plus:
        return ts.SyntaxKind.PlusToken
      case UnaryOperator.Minus:
        return ts.SyntaxKind.MinusToken
      case UnaryOperator.Not:
        return ts.SyntaxKind.ExclamationToken
      case UnaryOperator.LogicNot:
        return ts.SyntaxKind.TildeToken
    }
  }

  UnaryExpressionEcmaify(node: UnaryExpression): ts.UnaryExpression {
    switch (node.operator) {
      case UnaryOperator.TypeOf:
        return ts.createTypeOf(this.ExpressionEcmaify(node.operand))
      case UnaryOperator.Void:
        return ts.createVoid(this.ExpressionEcmaify(node.operand))
      case UnaryOperator.Delete:
        return ts.createDelete(this.ExpressionEcmaify(node.operand))
      default:
        return ts.createPrefix(
          this.UnaryOperatorEcmaify(node.operator),
          this.ExpressionEcmaify(node.operand)
        )
    }
  }

  StaticMemberExpressionEcmaify(
    node: StaticMemberExpression
  ): ts.PropertyAccessExpression {
    return ts.createPropertyAccess(
      this.ExpressionOrSuperEcmaify(node._object),
      ts.createIdentifier(node.property)
    )
  }

  TemplateExpressionEcmaify(
    node: TemplateExpression
  ): ts.TemplateExpression | ts.TaggedTemplateExpression {
    throw new Error('Not Implemented')
  }

  ThisExpressionEcmaify(node: ThisExpression): ts.ThisExpression {
    return ts.createThis()
  }

  UpdateOperatorEcmaify(node: UpdateOperator): ts.PostfixUnaryOperator {
    switch (node) {
      case UpdateOperator.PlusPlus:
        return ts.SyntaxKind.PlusPlusToken
      case UpdateOperator.MinusMinus:
        return ts.SyntaxKind.MinusMinusToken
    }
  }

  UpdateExpressionEcmaify(node: UpdateExpression): ts.UpdateExpression {
    if (node.isPrefix) {
      return ts.createPrefix(
        this.UpdateOperatorEcmaify(node.operator),
        this.SimpleAssignmentTargetEcmaify(node.operand)
      )
    } else {
      return ts.createPostfix(
        this.SimpleAssignmentTargetEcmaify(node.operand),
        this.UpdateOperatorEcmaify(node.operator)
      )
    }
  }

  YieldExpressionEcmaify(node: YieldExpression): ts.YieldExpression {
    return ts.createYield(
      this.EcmaifyOption(node.expression, this.ExpressionEcmaify)
    )
  }

  YieldStarExpressionEcmaify(node: YieldStarExpression): ts.YieldExpression {
    return ts.createYield(
      ts.createToken(ts.SyntaxKind.AsteriskToken),
      this.ExpressionEcmaify(node.expression)
    )
  }

  AwaitExpressionEcmaify(node: AwaitExpression): ts.AwaitExpression {
    return ts.createAwait(this.ExpressionEcmaify(node.expression))
  }

  BreakStatementEcmaify(node: BreakStatement): ts.BreakStatement {
    return ts.createBreak(node.label)
  }

  ContinueStatementEcmaify(node: ContinueStatement): ts.ContinueStatement {
    return ts.createContinue(node.label)
  }

  DebuggerStatementEcmaify(node: DebuggerStatement): ts.DebuggerStatement {
    return ts.createDebuggerStatement()
  }

  DoWhileStatementEcmaify(node: DoWhileStatement): ts.DoStatement {
    return ts.createDo(
      this.StatementEcmaify(node.body),
      this.ExpressionEcmaify(node.test)
    )
  }
  EmptyStatementEcmaify(node: EmptyStatement): ts.EmptyStatement {
    return ts.createEmptyStatement()
  }

  ExpressionStatementEcmaify(
    node: ExpressionStatement
  ): ts.ExpressionStatement {
    return ts.createExpressionStatement(this.ExpressionEcmaify(node.expression))
  }

  BindingPatternEcmaify(node: BindingPattern): ts.BindingPattern {
    switch (node.type) {
      case NodeType.ObjectBinding:
        return this.ObjectBindingEcmaify(node)
      case NodeType.ArrayBinding:
        return this.ArrayBindingEcmaify(node)
    }
  }

  BindingEcmaify(node: Binding): ts.BindingPattern | ts.Identifier {
    switch (node.type) {
      case NodeType.ObjectBinding:
      case NodeType.ArrayBinding:
        return this.BindingPatternEcmaify(node)
      case NodeType.BindingIdentifier:
        return this.BindingIdentifierEcmaify(node)
    }
  }

  ForInOfBindingEcmaify(node: ForInOfBinding): ts.ForInitializer {
    return ts.createVariableDeclarationList([
      ts.createVariableDeclaration(this.BindingEcmaify(node.binding))
    ])
  }

  AssignmentTargetPatternEcmaify(
    node: AssignmentTargetPattern
  ): ts.ObjectLiteralExpression | ts.ArrayLiteralExpression {
    switch (node.type) {
      case NodeType.ObjectAssignmentTarget:
        return this.ObjectAssignmentTargetEcmaify(node)
      case NodeType.ArrayAssignmentTarget:
        return this.ArrayAssignmentTargetEcmaify(node)
    }
  }

  SimpleAssignmentTargetEcmaify(node: SimpleAssignmentTarget) {
    switch (node.type) {
      case NodeType.AssignmentTargetIdentifier:
        return this.AssignmentTargetIdentifierEcmaify(node)
      case NodeType.ComputedMemberAssignmentTarget:
        return this.ComputedMemberAssignmentTargetEcmaify(node)
      case NodeType.StaticMemberAssignmentTarget:
        return this.StaticMemberAssignmentTargetEcmaify(node)
    }
  }

  AssignmentTargetEcmaify(node: AssignmentTarget) {
    switch (node.type) {
      case NodeType.ObjectAssignmentTarget:
      case NodeType.ArrayAssignmentTarget:
        return this.AssignmentTargetPatternEcmaify(node)
      case NodeType.AssignmentTargetIdentifier:
      case NodeType.ComputedMemberAssignmentTarget:
      case NodeType.StaticMemberAssignmentTarget:
        return this.SimpleAssignmentTargetEcmaify(node)
    }
  }

  ForInOfBindingOrAssignmentTargetEcmaify(
    node: ForInOfBinding | AssignmentTarget
  ): ts.ForInitializer {
    switch (node.type) {
      case NodeType.ForInOfBinding:
        return this.ForInOfBindingEcmaify(node)
      default:
        return this.AssignmentTargetEcmaify(node)
    }
  }

  ForInStatementEcmaify(node: ForInStatement): ts.ForInStatement {
    return ts.createForIn(
      this.ForInOfBindingOrAssignmentTargetEcmaify(node.left),
      this.ExpressionEcmaify(node.right),
      this.StatementEcmaify(node.body)
    )
  }

  ForOfStatementEcmaify(node: ForOfStatement): ts.ForOfStatement {
    return ts.createForOf(
      undefined,
      this.ForInOfBindingOrAssignmentTargetEcmaify(node.left),
      this.ExpressionEcmaify(node.right),
      this.StatementEcmaify(node.body)
    )
  }

  VariableDeclarationOrExpressionEcmaify(
    node: VariableDeclaration | Expression
  ): ts.ForInitializer {
    switch (node.type) {
      case NodeType.VariableDeclaration:
        return this.VariableDeclarationListEcmaify(node)
      default:
        return this.ExpressionEcmaify(node)
    }
  }

  ForStatementEcmaify(node: ForStatement): ts.ForStatement {
    return ts.createFor(
      this.EcmaifyOption(
        node.init,
        this.VariableDeclarationOrExpressionEcmaify
      ),
      this.EcmaifyOption(node.test, this.ExpressionEcmaify),
      this.EcmaifyOption(node.update, this.ExpressionEcmaify),
      this.StatementEcmaify(node.body)
    )
  }

  IfStatementEcmaify(node: IfStatement): ts.IfStatement {
    return ts.createIf(
      this.ExpressionEcmaify(node.test),
      this.StatementEcmaify(node.consequent),
      this.EcmaifyOption(node.alternate, this.StatementEcmaify)
    )
  }

  LabelledStatementEcmaify(node: LabelledStatement): ts.LabeledStatement {
    return ts.createLabel(node.label, this.StatementEcmaify(node.body))
  }

  ReturnStatementEcmaify(node: ReturnStatement): ts.ReturnStatement {
    return ts.createReturn(
      this.EcmaifyOption(node.expression, this.ExpressionEcmaify)
    )
  }

  SwitchCaseListEcmaify(
    nodes: FrozenArray<SwitchCase | SwitchDefault>
  ): ts.CaseBlock {
    return ts.createCaseBlock(
      this.EcmaifyList(nodes, node =>
        isSwitchCase(node)
          ? ts.createCaseClause(
              this.ExpressionEcmaify(node.test),
              this.StatementListEcmaify(node.consequent)
            )
          : ts.createDefaultClause(this.StatementListEcmaify(node.consequent))
      )
    )
  }

  SwitchStatementEcmaify(node: SwitchStatement): ts.SwitchStatement {
    return ts.createSwitch(
      this.ExpressionEcmaify(node.discriminant),
      this.SwitchCaseListEcmaify(node.cases)
    )
  }

  SwitchStatementWithDefaultEcmaify(
    node: SwitchStatementWithDefault
  ): ts.SwitchStatement {
    return ts.createSwitch(
      this.ExpressionEcmaify(node.discriminant),
      this.SwitchCaseListEcmaify(
        (node.preDefaultCases as (SwitchCase | SwitchDefault)[])
          .concat([node.defaultCase])
          .concat(node.postDefaultCases)
      )
    )
  }

  ThrowStatementEcmaify(node: ThrowStatement): ts.ThrowStatement {
    return ts.createThrow(this.ExpressionEcmaify(node.expression))
  }

  TryCatchStatementEcmaify(node: TryCatchStatement): ts.TryStatement {
    return ts.createTry(
      this.BlockEcmaify(node.body),
      this.CatchClauseEcmaify(node.catchClause),
      undefined
    )
  }

  TryFinallyStatementEcmaify(node: TryFinallyStatement): ts.TryStatement {
    return ts.createTry(
      this.BlockEcmaify(node.body),
      this.EcmaifyOption(node.catchClause, this.CatchClauseEcmaify),
      this.BlockEcmaify(node.finalizer)
    )
  }

  WhileStatementEcmaify(node: WhileStatement): ts.WhileStatement {
    return ts.createWhile(
      this.ExpressionEcmaify(node.test),
      this.StatementEcmaify(node.body)
    )
  }

  WithStatementEcmaify(node: WithStatement): ts.WithStatement {
    return ts.createWith(
      this.ExpressionEcmaify(node._object),
      this.StatementEcmaify(node.body)
    )
  }

  StatementListEcmaify(nodes: FrozenArray<Statement>) {
    return this.EcmaifyList(nodes, this.StatementEcmaify)
  }

  BlockEcmaify(node: Block): ts.Block {
    return ts.createBlock(this.StatementListEcmaify(node.statements))
  }

  CatchClauseEcmaify(node: CatchClause): ts.CatchClause {
    return ts.createCatchClause(
      ts.createVariableDeclaration(this.BindingEcmaify(node.binding)),
      this.BlockEcmaify(node.body)
    )
  }

  DirectiveEcmaify(node: Directive): ts.StringLiteral {
    return ts.createStringLiteral(node.rawValue)
  }

  ParameterListEcmaify(nodes: FrozenArray<Parameter>) {
    return this.EcmaifyList(nodes, this.ParameterEcmaify)
  }

  ParameterEcmaify(node: Parameter): ts.ParameterDeclaration {
    const element = this.BindingOrBindingWithInitializerEcmaify(node)
    return ts.createParameter(
      undefined,
      undefined,
      undefined,
      element.name,
      undefined,
      undefined,
      element.initializer
    )
  }

  FormalParametersEcmaify(node: FormalParameters): ts.ParameterDeclaration[] {
    return this.ParameterListEcmaify(node.items)
  }

  uniformFunctionDeclarationEcmaify(
    node: FunctionDeclaration
  ): ts.FunctionDeclaration {
    const contents = this.FunctionContentsEcmaify(node.contents)
    addModifiers(
      contents,
      node.isAsync ? ts.ModifierFlags.Async : ts.ModifierFlags.None
    )
    contents.asteriskToken = node.isGenerator
      ? ts.createToken(ts.SyntaxKind.AsteriskToken)
      : undefined
    contents.name = this.BindingIdentifierEcmaify(node.name)
    return contents
  }

  EagerFunctionDeclarationEcmaify(
    node: EagerFunctionDeclaration
  ): ts.FunctionDeclaration {
    return this.uniformFunctionDeclarationEcmaify(node)
  }

  LazyFunctionDeclarationEcmaify(
    node: LazyFunctionDeclaration
  ): ts.FunctionDeclaration {
    return this.uniformFunctionDeclarationEcmaify(node)
  }

  FunctionDeclarationEcmaify(node: FunctionDeclaration) {
    switch (node.type) {
      case NodeType.EagerFunctionDeclaration:
        return this.EagerFunctionDeclarationEcmaify(node)
      case NodeType.LazyFunctionDeclaration:
        return this.LazyFunctionDeclarationEcmaify(node)
    }
  }

  FunctionOrMethodContentsEcmaify(
    node: FunctionOrMethodContents
  ): ts.FunctionDeclaration {
    throw new Error('Not Implemented')
  }

  FunctionContentsEcmaify(
    node: FunctionOrMethodContents
  ): ts.FunctionDeclaration {
    return ts.createFunctionDeclaration(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      this.FormalParametersEcmaify(node.params),
      undefined,
      ts.createBlock(this.StatementListEcmaify(node.body))
    )
  }

  ScriptEcmaify(node: Script): ts.SourceFile {
    return ts.updateSourceFileNode(
      ts.createSourceFile('', '', ts.ScriptTarget.Latest),
      this.StatementListEcmaify(node.statements)
    )
  }

  SpreadElementEcmaify(node: SpreadElement): ts.SpreadElement {
    return ts.createSpread(this.ExpressionEcmaify(node.expression))
  }

  SuperEcmaify(node: Super): ts.SuperExpression {
    return ts.createSuper()
  }

  SwitchCaseEcmaify(node: SwitchCase): ts.CaseClause {
    return ts.createCaseClause(
      this.ExpressionEcmaify(node.test),
      this.StatementListEcmaify(node.consequent)
    )
  }

  SwitchDefaultEcmaify(node: SwitchDefault): ts.DefaultClause {
    return ts.createDefaultClause(this.StatementListEcmaify(node.consequent))
  }

  TemplateElementEcmaify(node: TemplateElement): ts.TemplateSpan {
    throw new Error('Not Implemented')
  }

  VariableDeclarationListEcmaify(
    node: VariableDeclaration
  ): ts.VariableDeclarationList {
    return ts.createVariableDeclarationList(
      this.EcmaifyList(node.declarators, this.VariableDeclaratorEcmaify)
    )
  }

  VariableDeclarationEcmaify(node: VariableDeclaration): ts.VariableStatement {
    return ts.createVariableStatement(
      undefined,
      this.VariableDeclarationListEcmaify(node)
    )
  }

  VariableDeclaratorEcmaify(node: VariableDeclarator): ts.VariableDeclaration {
    const element = this.BindingEcmaify(node.binding)
    return ts.createVariableDeclaration(
      element,
      undefined,
      this.EcmaifyOption(node.init, this.ExpressionEcmaify)
    )
  }
}
