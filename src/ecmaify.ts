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
  Parameter
} from './types'
import * as ts from 'typescript'
import {
  isSuper,
  isSwitchCase,
  isSpreadElement,
  isBindingWithInitializer
} from './utils'

namespace Ecmaify {
  export function EcmaifyOption<T, U>(
    v: T | undefined,
    cb: (v: T) => U
  ): U | undefined {
    if (v === null || v === undefined) return undefined
    return cb(v)
  }

  export function Ecmaify(node: Node): ts.Node | ts.Node[] {
    switch (node.type) {
      case NodeType.AssertedBoundName:
        return AssertedBoundNameEcmaify(node as AssertedBoundName)
      case NodeType.AssertedBlockScope:
        return AssertedBlockScopeEcmaify(node as AssertedBlockScope)
      case NodeType.AssertedScriptGlobalScope:
        return AssertedScriptGlobalScopeEcmaify(
          node as AssertedScriptGlobalScope
        )
      case NodeType.AssertedVarScope:
        return AssertedVarScopeEcmaify(node as AssertedVarScope)
      case NodeType.AssertedParameterScope:
        return AssertedParameterScopeEcmaify(node as AssertedParameterScope)
      case NodeType.AssertedBoundNamesScope:
        return AssertedBoundNamesScopeEcmaify(node as AssertedBoundNamesScope)
      case NodeType.AssertedDeclaredName:
        return AssertedDeclaredNameEcmaify(node as AssertedDeclaredName)
      case NodeType.AssertedPositionalParameterName:
        return AssertedPositionalParameterNameEcmaify(
          node as AssertedPositionalParameterName
        )
      case NodeType.AssertedRestParameterName:
        return AssertedRestParameterNameEcmaify(
          node as AssertedRestParameterName
        )
      case NodeType.AssertedParameterName:
        return AssertedParameterNameEcmaify(node as AssertedParameterName)
      case NodeType.BindingIdentifier:
        return BindingIdentifierEcmaify(node as BindingIdentifier)
      case NodeType.BindingWithInitializer:
        return BindingWithInitializerEcmaify(node as BindingWithInitializer)
      case NodeType.AssignmentTargetIdentifier:
        return AssignmentTargetIdentifierEcmaify(
          node as AssignmentTargetIdentifier
        )
      case NodeType.ComputedMemberAssignmentTarget:
        return ComputedMemberAssignmentTargetEcmaify(
          node as ComputedMemberAssignmentTarget
        )
      case NodeType.StaticMemberAssignmentTarget:
        return StaticMemberAssignmentTargetEcmaify(
          node as StaticMemberAssignmentTarget
        )
      case NodeType.ArrayBinding:
        return ArrayBindingEcmaify(node as ArrayBinding)
      case NodeType.BindingPropertyIdentifier:
        return BindingPropertyIdentifierEcmaify(
          node as BindingPropertyIdentifier
        )
      case NodeType.BindingPropertyProperty:
        return BindingPropertyPropertyEcmaify(node as BindingPropertyProperty)
      case NodeType.ObjectBinding:
        return ObjectBindingEcmaify(node as ObjectBinding)
      case NodeType.AssignmentTargetWithInitializer:
        return AssignmentTargetWithInitializerEcmaify(
          node as AssignmentTargetWithInitializer
        )
      case NodeType.ArrayAssignmentTarget:
        return ArrayAssignmentTargetEcmaify(node as ArrayAssignmentTarget)
      case NodeType.AssignmentTargetPropertyIdentifier:
        return AssignmentTargetPropertyIdentifierEcmaify(
          node as AssignmentTargetPropertyIdentifier
        )
      case NodeType.AssignmentTargetPropertyProperty:
        return AssignmentTargetPropertyPropertyEcmaify(
          node as AssignmentTargetPropertyProperty
        )
      case NodeType.ObjectAssignmentTarget:
        return ObjectAssignmentTargetEcmaify(node as ObjectAssignmentTarget)
      case NodeType.ClassExpression:
        return ClassExpressionEcmaify(node as ClassExpression)
      case NodeType.ClassDeclaration:
        return ClassDeclarationEcmaify(node as ClassDeclaration)
      case NodeType.ClassElement:
        return ClassElementEcmaify(node as ClassElement)
      case NodeType.Module:
        return ModuleEcmaify(node as Module)
      case NodeType.Import:
        return ImportEcmaify(node as Import)
      case NodeType.ImportNamespace:
        return ImportNamespaceEcmaify(node as ImportNamespace)
      case NodeType.ImportSpecifier:
        return ImportSpecifierEcmaify(node as ImportSpecifier)
      case NodeType.ExportAllFrom:
        return ExportAllFromEcmaify(node as ExportAllFrom)
      case NodeType.ExportFrom:
        return ExportFromEcmaify(node as ExportFrom)
      case NodeType.ExportLocals:
        return ExportLocalsEcmaify(node as ExportLocals)
      case NodeType.Export:
        return ExportEcmaify(node as Export)
      case NodeType.ExportDefault:
        return ExportDefaultEcmaify(node as ExportDefault)
      case NodeType.ExportFromSpecifier:
        return ExportFromSpecifierEcmaify(node as ExportFromSpecifier)
      case NodeType.ExportLocalSpecifier:
        return ExportLocalSpecifierEcmaify(node as ExportLocalSpecifier)
      case NodeType.EagerMethod:
        return EagerMethodEcmaify(node as EagerMethod)
      case NodeType.LazyMethod:
        return LazyMethodEcmaify(node as LazyMethod)
      case NodeType.EagerGetter:
        return EagerGetterEcmaify(node as EagerGetter)
      case NodeType.LazyGetter:
        return LazyGetterEcmaify(node as LazyGetter)
      case NodeType.GetterContents:
        return GetterContentsEcmaify(node as GetterContents)
      case NodeType.EagerSetter:
        return EagerSetterEcmaify(node as EagerSetter)
      case NodeType.LazySetter:
        return LazySetterEcmaify(node as LazySetter)
      case NodeType.SetterContents:
        return SetterContentsEcmaify(node as SetterContents)
      case NodeType.DataProperty:
        return DataPropertyEcmaify(node as DataProperty)
      case NodeType.ShorthandProperty:
        return ShorthandPropertyEcmaify(node as ShorthandProperty)
      case NodeType.ComputedPropertyName:
        return ComputedPropertyNameEcmaify(node as ComputedPropertyName)
      case NodeType.LiteralPropertyName:
        return LiteralPropertyNameEcmaify(node as LiteralPropertyName)
      case NodeType.LiteralBooleanExpression:
        return LiteralBooleanExpressionEcmaify(node as LiteralBooleanExpression)
      case NodeType.LiteralInfinityExpression:
        return LiteralInfinityExpressionEcmaify(
          node as LiteralInfinityExpression
        )
      case NodeType.LiteralNullExpression:
        return LiteralNullExpressionEcmaify(node as LiteralNullExpression)
      case NodeType.LiteralNumericExpression:
        return LiteralNumericExpressionEcmaify(node as LiteralNumericExpression)
      case NodeType.LiteralRegExpExpression:
        return LiteralRegExpExpressionEcmaify(node as LiteralRegExpExpression)
      case NodeType.LiteralStringExpression:
        return LiteralStringExpressionEcmaify(node as LiteralStringExpression)
      case NodeType.ArrayExpression:
        return ArrayExpressionEcmaify(node as ArrayExpression)
      case NodeType.EagerArrowExpressionWithFunctionBody:
        return EagerArrowExpressionWithFunctionBodyEcmaify(
          node as EagerArrowExpressionWithFunctionBody
        )
      case NodeType.LazyArrowExpressionWithFunctionBody:
        return LazyArrowExpressionWithFunctionBodyEcmaify(
          node as LazyArrowExpressionWithFunctionBody
        )
      case NodeType.EagerArrowExpressionWithExpression:
        return EagerArrowExpressionWithExpressionEcmaify(
          node as EagerArrowExpressionWithExpression
        )
      case NodeType.LazyArrowExpressionWithExpression:
        return LazyArrowExpressionWithExpressionEcmaify(
          node as LazyArrowExpressionWithExpression
        )
      case NodeType.ArrowExpressionContentsWithFunctionBody:
        return ArrowExpressionContentsWithFunctionBodyEcmaify(
          node as ArrowExpressionContentsWithFunctionBody
        )
      case NodeType.ArrowExpressionContentsWithExpression:
        return ArrowExpressionContentsWithExpressionEcmaify(
          node as ArrowExpressionContentsWithExpression
        )
      case NodeType.AssignmentExpression:
        return AssignmentExpressionEcmaify(node as AssignmentExpression)
      case NodeType.BinaryExpression:
        return BinaryExpressionEcmaify(node as BinaryExpression)
      case NodeType.CallExpression:
        return CallExpressionEcmaify(node as CallExpression)
      case NodeType.CompoundAssignmentExpression:
        return CompoundAssignmentExpressionEcmaify(
          node as CompoundAssignmentExpression
        )
      case NodeType.ComputedMemberExpression:
        return ComputedMemberExpressionEcmaify(node as ComputedMemberExpression)
      case NodeType.ConditionalExpression:
        return ConditionalExpressionEcmaify(node as ConditionalExpression)
      case NodeType.EagerFunctionExpression:
        return EagerFunctionExpressionEcmaify(node as EagerFunctionExpression)
      case NodeType.LazyFunctionExpression:
        return LazyFunctionExpressionEcmaify(node as LazyFunctionExpression)
      case NodeType.FunctionExpressionContents:
        return FunctionExpressionContentsEcmaify(
          node as FunctionExpressionContents
        )
      case NodeType.IdentifierExpression:
        return IdentifierExpressionEcmaify(node as IdentifierExpression)
      case NodeType.NewExpression:
        return NewExpressionEcmaify(node as NewExpression)
      case NodeType.NewTargetExpression:
        return NewTargetExpressionEcmaify(node as NewTargetExpression)
      case NodeType.ObjectExpression:
        return ObjectExpressionEcmaify(node as ObjectExpression)
      case NodeType.UnaryExpression:
        return UnaryExpressionEcmaify(node as UnaryExpression)
      case NodeType.StaticMemberExpression:
        return StaticMemberExpressionEcmaify(node as StaticMemberExpression)
      case NodeType.TemplateExpression:
        return TemplateExpressionEcmaify(node as TemplateExpression)
      case NodeType.ThisExpression:
        return ThisExpressionEcmaify(node as ThisExpression)
      case NodeType.UpdateExpression:
        return UpdateExpressionEcmaify(node as UpdateExpression)
      case NodeType.YieldExpression:
        return YieldExpressionEcmaify(node as YieldExpression)
      case NodeType.YieldStarExpression:
        return YieldStarExpressionEcmaify(node as YieldStarExpression)
      case NodeType.AwaitExpression:
        return AwaitExpressionEcmaify(node as AwaitExpression)
      case NodeType.BreakStatement:
        return BreakStatementEcmaify(node as BreakStatement)
      case NodeType.ContinueStatement:
        return ContinueStatementEcmaify(node as ContinueStatement)
      case NodeType.DebuggerStatement:
        return DebuggerStatementEcmaify(node as DebuggerStatement)
      case NodeType.DoWhileStatement:
        return DoWhileStatementEcmaify(node as DoWhileStatement)
      case NodeType.EmptyStatement:
        return EmptyStatementEcmaify(node as EmptyStatement)
      case NodeType.ExpressionStatement:
        return ExpressionStatementEcmaify(node as ExpressionStatement)
      case NodeType.ForInOfBinding:
        return ForInOfBindingEcmaify(node as ForInOfBinding)
      case NodeType.ForInStatement:
        return ForInStatementEcmaify(node as ForInStatement)
      case NodeType.ForOfStatement:
        return ForOfStatementEcmaify(node as ForOfStatement)
      case NodeType.ForStatement:
        return ForStatementEcmaify(node as ForStatement)
      case NodeType.IfStatement:
        return IfStatementEcmaify(node as IfStatement)
      case NodeType.LabelledStatement:
        return LabelledStatementEcmaify(node as LabelledStatement)
      case NodeType.ReturnStatement:
        return ReturnStatementEcmaify(node as ReturnStatement)
      case NodeType.SwitchStatement:
        return SwitchStatementEcmaify(node as SwitchStatement)
      case NodeType.SwitchStatementWithDefault:
        return SwitchStatementWithDefaultEcmaify(
          node as SwitchStatementWithDefault
        )
      case NodeType.ThrowStatement:
        return ThrowStatementEcmaify(node as ThrowStatement)
      case NodeType.TryCatchStatement:
        return TryCatchStatementEcmaify(node as TryCatchStatement)
      case NodeType.TryFinallyStatement:
        return TryFinallyStatementEcmaify(node as TryFinallyStatement)
      case NodeType.WhileStatement:
        return WhileStatementEcmaify(node as WhileStatement)
      case NodeType.WithStatement:
        return WithStatementEcmaify(node as WithStatement)
      case NodeType.Block:
        return BlockEcmaify(node as Block)
      case NodeType.CatchClause:
        return CatchClauseEcmaify(node as CatchClause)
      case NodeType.Directive:
        return DirectiveEcmaify(node as Directive)
      case NodeType.FormalParameters:
        return FormalParametersEcmaify(node as FormalParameters)
      case NodeType.EagerFunctionDeclaration:
        return EagerFunctionDeclarationEcmaify(node as EagerFunctionDeclaration)
      case NodeType.LazyFunctionDeclaration:
        return LazyFunctionDeclarationEcmaify(node as LazyFunctionDeclaration)
      case NodeType.FunctionOrMethodContents:
        return FunctionOrMethodContentsEcmaify(node as FunctionOrMethodContents)
      case NodeType.Script:
        return ScriptEcmaify(node as Script)
      case NodeType.SpreadElement:
        return SpreadElementEcmaify(node as SpreadElement)
      case NodeType.Super:
        return SuperEcmaify(node as Super)
      case NodeType.SwitchCase:
        return SwitchCaseEcmaify(node as SwitchCase)
      case NodeType.SwitchDefault:
        return SwitchDefaultEcmaify(node as SwitchDefault)
      case NodeType.TemplateElement:
        return TemplateElementEcmaify(node as TemplateElement)
      case NodeType.VariableDeclaration:
        return VariableDeclarationEcmaify(node as VariableDeclaration)
      case NodeType.VariableDeclarator:
        return VariableDeclaratorEcmaify(node as VariableDeclarator)
      default:
        throw new Error('Unexpected type')
    }
  }

  export function StatementEcmaify(stmt: Statement): ts.Statement {
    switch (stmt.type) {
      case NodeType.Block:
        return BlockEcmaify(stmt)
      case NodeType.BreakStatement:
        return BreakStatementEcmaify(stmt)
      case NodeType.ContinueStatement:
        return ContinueStatementEcmaify(stmt)
      case NodeType.ClassDeclaration:
        return ClassDeclarationEcmaify(stmt)
      case NodeType.DebuggerStatement:
        return DebuggerStatementEcmaify(stmt)
      case NodeType.EmptyStatement:
        return EmptyStatementEcmaify(stmt)
      case NodeType.ExpressionStatement:
        return ExpressionStatementEcmaify(stmt)
      case NodeType.EagerFunctionDeclaration:
        return EagerFunctionDeclarationEcmaify(stmt)
      case NodeType.LazyFunctionDeclaration:
        return LazyFunctionDeclarationEcmaify(stmt)
      case NodeType.IfStatement:
        return IfStatementEcmaify(stmt)
      case NodeType.DoWhileStatement:
        return DoWhileStatementEcmaify(stmt)
      case NodeType.ForInStatement:
        return ForInStatementEcmaify(stmt)
      case NodeType.ForOfStatement:
        return ForOfStatementEcmaify(stmt)
      case NodeType.ForStatement:
        return ForStatementEcmaify(stmt)
      case NodeType.WhileStatement:
        return WhileStatementEcmaify(stmt)
      case NodeType.LabelledStatement:
        return LabelledStatementEcmaify(stmt)
      case NodeType.ReturnStatement:
        return ReturnStatementEcmaify(stmt)
      case NodeType.SwitchStatement:
        return SwitchStatementEcmaify(stmt)
      case NodeType.SwitchStatementWithDefault:
        return SwitchStatementWithDefaultEcmaify(stmt)
      case NodeType.ThrowStatement:
        return ThrowStatementEcmaify(stmt)
      case NodeType.TryCatchStatement:
        return TryCatchStatementEcmaify(stmt)
      case NodeType.TryFinallyStatement:
        return TryFinallyStatementEcmaify(stmt)
      case NodeType.VariableDeclaration:
        return VariableDeclarationEcmaify(stmt)
      case NodeType.WithStatement:
        return WithStatementEcmaify(stmt)
    }
  }

  export function ExpressionEcmaify(node: Expression): ts.Expression {
    switch (node.type) {
      case NodeType.LiteralBooleanExpression:
        return LiteralBooleanExpressionEcmaify(node)
      case NodeType.LiteralInfinityExpression:
        return LiteralInfinityExpressionEcmaify(node)
      case NodeType.LiteralNullExpression:
        return LiteralNullExpressionEcmaify(node)
      case NodeType.LiteralNumericExpression:
        return LiteralNumericExpressionEcmaify(node)
      case NodeType.LiteralRegExpExpression:
        return LiteralRegExpExpressionEcmaify(node)
      case NodeType.LiteralStringExpression:
        return LiteralStringExpressionEcmaify(node)
      case NodeType.ArrayExpression:
        return ArrayExpressionEcmaify(node)
      case NodeType.EagerArrowExpressionWithFunctionBody:
        return EagerArrowExpressionWithFunctionBodyEcmaify(node)
      case NodeType.LazyArrowExpressionWithFunctionBody:
        return LazyArrowExpressionWithFunctionBodyEcmaify(node)
      case NodeType.EagerArrowExpressionWithExpression:
        return EagerArrowExpressionWithExpressionEcmaify(node)
      case NodeType.LazyArrowExpressionWithExpression:
        return LazyArrowExpressionWithExpressionEcmaify(node)
      case NodeType.AssignmentExpression:
        return AssignmentExpressionEcmaify(node)
      case NodeType.BinaryExpression:
        return BinaryExpressionEcmaify(node)
      case NodeType.CallExpression:
        return CallExpressionEcmaify(node)
      case NodeType.CompoundAssignmentExpression:
        return CompoundAssignmentExpressionEcmaify(node)
      case NodeType.ComputedMemberExpression:
        return ComputedMemberExpressionEcmaify(node)
      case NodeType.ConditionalExpression:
        return ConditionalExpressionEcmaify(node)
      case NodeType.ClassExpression:
        return ClassExpressionEcmaify(node)
      case NodeType.EagerFunctionExpression:
        return EagerFunctionExpressionEcmaify(node)
      case NodeType.LazyFunctionExpression:
        return LazyFunctionExpressionEcmaify(node)
      case NodeType.IdentifierExpression:
        return IdentifierExpressionEcmaify(node)
      case NodeType.NewExpression:
        return NewExpressionEcmaify(node)
      case NodeType.NewTargetExpression:
        return NewTargetExpressionEcmaify(node)
      case NodeType.ObjectExpression:
        return ObjectExpressionEcmaify(node)
      case NodeType.UnaryExpression:
        return UnaryExpressionEcmaify(node)
      case NodeType.StaticMemberExpression:
        return StaticMemberExpressionEcmaify(node)
      case NodeType.TemplateExpression:
        return TemplateExpressionEcmaify(node)
      case NodeType.ThisExpression:
        return ThisExpressionEcmaify(node)
      case NodeType.UpdateExpression:
        return UpdateExpressionEcmaify(node)
      case NodeType.YieldExpression:
        return YieldExpressionEcmaify(node)
      case NodeType.YieldStarExpression:
        return YieldStarExpressionEcmaify(node)
      case NodeType.AwaitExpression:
        return AwaitExpressionEcmaify(node)
    }
  }

  export function AssertedBoundNameEcmaify(node: AssertedBoundName): any {
    throw new Error('Not Implemented')
  }
  export function AssertedBlockScopeEcmaify(node: AssertedBlockScope): any {
    throw new Error('Not Implemented')
  }
  export function AssertedScriptGlobalScopeEcmaify(
    node: AssertedScriptGlobalScope
  ): any {
    throw new Error('Not Implemented')
  }
  export function AssertedVarScopeEcmaify(node: AssertedVarScope): any {
    throw new Error('Not Implemented')
  }
  export function AssertedParameterScopeEcmaify(
    node: AssertedParameterScope
  ): any {
    throw new Error('Not Implemented')
  }
  export function AssertedBoundNamesScopeEcmaify(
    node: AssertedBoundNamesScope
  ): any {
    throw new Error('Not Implemented')
  }
  export function AssertedDeclaredNameEcmaify(node: AssertedDeclaredName): any {
    throw new Error('Not Implemented')
  }
  export function AssertedPositionalParameterNameEcmaify(
    node: AssertedPositionalParameterName
  ): any {
    throw new Error('Not Implemented')
  }
  export function AssertedRestParameterNameEcmaify(
    node: AssertedRestParameterName
  ): any {
    throw new Error('Not Implemented')
  }
  export function AssertedParameterNameEcmaify(
    node: AssertedParameterName
  ): any {
    throw new Error('Not Implemented')
  }

  export function BindingIdentifierEcmaify(
    node: BindingIdentifier
  ): ts.Identifier {
    return ts.createIdentifier(node.name)
  }

  export function BindingWithInitializerEcmaify(
    node: BindingWithInitializer
  ): ts.BindingElement {
    return ts.createBindingElement(
      undefined,
      undefined,
      BindingEcmaify(node.binding),
      ExpressionEcmaify(node.init)
    )
  }

  export function AssignmentTargetIdentifierEcmaify(
    node: AssignmentTargetIdentifier
  ): ts.Identifier {
    return ts.createIdentifier(node.name)
  }

  export function ComputedMemberAssignmentTargetEcmaify(
    node: ComputedMemberAssignmentTarget
  ): ts.ElementAccessExpression {
    return ts.createElementAccess(
      ExpressionOrSuperEcmaify(node._object),
      ExpressionEcmaify(node.expression)
    )
  }

  export function StaticMemberAssignmentTargetEcmaify(
    node: StaticMemberAssignmentTarget
  ): ts.PropertyAccessExpression {
    return ts.createPropertyAccess(
      ExpressionOrSuperEcmaify(node._object),
      ts.createIdentifier(node.property)
    )
  }

  export function BindingOrBindingWithInitializerListEcmaify(
    nodes: FrozenArray<Binding | BindingWithInitializer>
  ) {
    return nodes.map(BindingOrBindingWithInitializerEcmaify)
  }

  export function BindingOrBindingWithInitializerEcmaify(
    node: Binding | BindingWithInitializer
  ): ts.BindingElement {
    switch (node.type) {
      case NodeType.BindingWithInitializer:
        return BindingWithInitializerEcmaify(node)
      default:
        return ts.createBindingElement(
          undefined,
          undefined,
          BindingEcmaify(node)
        )
    }
  }

  export function ArrayBindingEcmaify(
    node: ArrayBinding
  ): ts.ArrayBindingPattern {
    return ts.createArrayBindingPattern(
      BindingOrBindingWithInitializerListEcmaify(node.elements).concat([
        BindingOrBindingWithInitializerEcmaify(node.rest!)
      ])
    )
  }

  export function BindingPropertyIdentifierEcmaify(
    node: BindingPropertyIdentifier
  ): ts.BindingElement {
    return ts.createBindingElement(
      undefined,
      undefined,
      BindingEcmaify(node.binding),
      EcmaifyOption(node.init, ExpressionEcmaify)
    )
  }
  export function BindingPropertyPropertyEcmaify(
    node: BindingPropertyProperty
  ): ts.BindingElement {
    const element = BindingOrBindingWithInitializerEcmaify(node.binding)
    element.propertyName = PropertyNameEcmaify(node.name)
    return element
  }

  export function BindingPropertyListEcmaify(
    nodes: FrozenArray<BindingProperty>
  ): ts.BindingElement[] {
    return nodes.map(node => {
      switch (node.type) {
        case NodeType.BindingPropertyIdentifier:
          return BindingPropertyIdentifierEcmaify(node)
        case NodeType.BindingPropertyProperty:
          return BindingPropertyPropertyEcmaify(node)
      }
    })
  }

  export function ObjectBindingEcmaify(
    node: ObjectBinding
  ): ts.ObjectBindingPattern {
    return ts.createObjectBindingPattern(
      BindingPropertyListEcmaify(node.properties)
    )
  }

  export function AssignmentTargetWithInitializerEcmaify(
    node: AssignmentTargetWithInitializer
  ): any {
    throw new Error('Not Implemented')
  }
  export function ArrayAssignmentTargetEcmaify(
    node: ArrayAssignmentTarget
  ): any {
    throw new Error('Not Implemented')
  }
  export function AssignmentTargetPropertyIdentifierEcmaify(
    node: AssignmentTargetPropertyIdentifier
  ): any {
    throw new Error('Not Implemented')
  }
  export function AssignmentTargetPropertyPropertyEcmaify(
    node: AssignmentTargetPropertyProperty
  ): any {
    throw new Error('Not Implemented')
  }
  export function ObjectAssignmentTargetEcmaify(
    node: ObjectAssignmentTarget
  ): any {
    throw new Error('Not Implemented')
  }
  export function ClassExpressionEcmaify(
    node: ClassExpression
  ): ts.ClassExpression {
    throw new Error('Not Implemented')
  }
  export function ClassDeclarationEcmaify(
    node: ClassDeclaration
  ): ts.ClassDeclaration {
    throw new Error('Not Implemented')
  }
  export function ClassElementEcmaify(node: ClassElement): ts.ClassElement {
    throw new Error('Not Implemented')
  }
  export function ModuleEcmaify(node: Module): any {
    throw new Error('Not Implemented')
  }
  export function ImportEcmaify(node: Import): any {
    throw new Error('Not Implemented')
  }
  export function ImportNamespaceEcmaify(node: ImportNamespace): any {
    throw new Error('Not Implemented')
  }
  export function ImportSpecifierEcmaify(
    node: ImportSpecifier
  ): ts.ImportSpecifier {
    throw new Error('Not Implemented')
  }
  export function ExportAllFromEcmaify(node: ExportAllFrom): any {
    throw new Error('Not Implemented')
  }
  export function ExportFromEcmaify(node: ExportFrom): any {
    throw new Error('Not Implemented')
  }
  export function ExportLocalsEcmaify(node: ExportLocals): any {
    throw new Error('Not Implemented')
  }
  export function ExportEcmaify(node: Export): any {
    throw new Error('Not Implemented')
  }
  export function ExportDefaultEcmaify(node: ExportDefault): any {
    throw new Error('Not Implemented')
  }
  export function ExportFromSpecifierEcmaify(node: ExportFromSpecifier): any {
    throw new Error('Not Implemented')
  }
  export function ExportLocalSpecifierEcmaify(node: ExportLocalSpecifier): any {
    throw new Error('Not Implemented')
  }
  export function EagerMethodEcmaify(node: EagerMethod): ts.MethodDeclaration {
    throw new Error('Not Implemented')
  }
  export function LazyMethodEcmaify(node: LazyMethod): ts.MethodDeclaration {
    throw new Error('Not Implemented')
  }
  export function EagerGetterEcmaify(
    node: EagerGetter
  ): ts.GetAccessorDeclaration {
    throw new Error('Not Implemented')
  }
  export function LazyGetterEcmaify(
    node: LazyGetter
  ): ts.GetAccessorDeclaration {
    throw new Error('Not Implemented')
  }
  export function GetterContentsEcmaify(node: GetterContents): any {
    throw new Error('Not Implemented')
  }
  export function EagerSetterEcmaify(
    node: EagerSetter
  ): ts.SetAccessorDeclaration {
    throw new Error('Not Implemented')
  }
  export function LazySetterEcmaify(
    node: LazySetter
  ): ts.SetAccessorDeclaration {
    throw new Error('Not Implemented')
  }
  export function SetterContentsEcmaify(node: SetterContents): any {
    throw new Error('Not Implemented')
  }

  export function PropertyNameEcmaify(node: PropertyName): ts.PropertyName {
    switch (node.type) {
      case NodeType.ComputedPropertyName:
        return ComputedPropertyNameEcmaify(node)
      case NodeType.LiteralPropertyName:
        return LiteralPropertyNameEcmaify(node)
    }
  }

  export function DataPropertyEcmaify(
    node: DataProperty
  ): ts.PropertyAssignment {
    return ts.createPropertyAssignment(
      PropertyNameEcmaify(node.name),
      ExpressionEcmaify(node.expression)
    )
  }
  export function ShorthandPropertyEcmaify(
    node: ShorthandProperty
  ): ts.ShorthandPropertyAssignment {
    return ts.createShorthandPropertyAssignment(
      IdentifierExpressionEcmaify(node.name)
    )
  }

  export function ComputedPropertyNameEcmaify(
    node: ComputedPropertyName
  ): ts.ComputedPropertyName {
    return ts.createComputedPropertyName(ExpressionEcmaify(node.expression))
  }

  export function LiteralPropertyNameEcmaify(
    node: LiteralPropertyName
  ): ts.Identifier {
    return ts.createIdentifier(node.value)
  }

  export function LiteralBooleanExpressionEcmaify(
    node: LiteralBooleanExpression
  ): ts.BooleanLiteral {
    return ts.createLiteral(node.value)
  }

  export function LiteralInfinityExpressionEcmaify(
    node: LiteralInfinityExpression
  ): ts.NumericLiteral {
    return ts.createLiteral(Infinity)
  }

  export function LiteralNullExpressionEcmaify(
    node: LiteralNullExpression
  ): ts.NullLiteral {
    return ts.createNull()
  }

  export function LiteralNumericExpressionEcmaify(
    node: LiteralNumericExpression
  ): ts.NumericLiteral {
    return ts.createLiteral(node.value)
  }

  export function LiteralRegExpExpressionEcmaify(
    node: LiteralRegExpExpression
  ): ts.RegularExpressionLiteral {
    return ts.createRegularExpressionLiteral(node.pattern)
  }

  export function LiteralStringExpressionEcmaify(
    node: LiteralStringExpression
  ): ts.StringLiteral {
    return ts.createStringLiteral(node.value)
  }

  export function SpreadElementOrExpressionListEcmaify(
    nodes: FrozenArray<SpreadElement | Expression>
  ): ts.Expression[] {
    return nodes.map(node => {
      if (isSpreadElement(node)) {
        return ts.createSpread(ExpressionEcmaify(node.expression))
      } else {
        return ExpressionEcmaify(node)
      }
    })
  }

  export function ArrayExpressionEcmaify(
    node: ArrayExpression
  ): ts.ArrayLiteralExpression {
    return ts.createArrayLiteral(
      SpreadElementOrExpressionListEcmaify(node.elements)
    )
  }

  export function EagerArrowExpressionWithFunctionBodyEcmaify(
    node: EagerArrowExpressionWithFunctionBody
  ): ts.ArrowFunction {
    throw new Error('Not Implemented')
  }

  export function LazyArrowExpressionWithFunctionBodyEcmaify(
    node: LazyArrowExpressionWithFunctionBody
  ): ts.ArrowFunction {
    throw new Error('Not Implemented')
  }

  export function EagerArrowExpressionWithExpressionEcmaify(
    node: EagerArrowExpressionWithExpression
  ): ts.ArrowFunction {
    throw new Error('Not Implemented')
  }

  export function LazyArrowExpressionWithExpressionEcmaify(
    node: LazyArrowExpressionWithExpression
  ): ts.ArrowFunction {
    throw new Error('Not Implemented')
  }

  export function ArrowExpressionContentsWithFunctionBodyEcmaify(
    node: ArrowExpressionContentsWithFunctionBody
  ): any {
    throw new Error('Not Implemented')
  }

  export function ArrowExpressionContentsWithExpressionEcmaify(
    node: ArrowExpressionContentsWithExpression
  ): any {
    throw new Error('Not Implemented')
  }

  export function AssignmentExpressionEcmaify(
    node: AssignmentExpression
  ): ts.BinaryExpression {
    return ts.createAssignment(
      AssignmentTargetEcmaify(node.binding),
      ExpressionEcmaify(node.expression)
    )
  }

  export function BinaryOperatorEcmaify(
    node: BinaryOperator
  ): ts.BinaryOperator {
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

  export function BinaryExpressionEcmaify(
    node: BinaryExpression
  ): ts.BinaryExpression {
    return ts.createBinary(
      ExpressionEcmaify(node.left),
      BinaryOperatorEcmaify(node.operator),
      ExpressionEcmaify(node.right)
    )
  }

  export function ArgumentsEcmaify(node: Arguments) {
    return SpreadElementOrExpressionListEcmaify(node)
  }

  export function ExpressionOrSuperEcmaify(
    node: Expression | Super
  ): ts.Expression | ts.SuperExpression {
    switch (node.type) {
      case NodeType.Super:
        return SuperEcmaify(node)
      default:
        return ExpressionEcmaify(node)
    }
  }

  export function CallExpressionEcmaify(
    node: CallExpression
  ): ts.CallExpression | ts.SuperCall {
    return ts.createCall(
      ExpressionOrSuperEcmaify(node.callee),
      undefined,
      ArgumentsEcmaify(node.arguments)
    )
  }

  export function CompoundAssignmentOperatorEcmaify(
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

  export function CompoundAssignmentExpressionEcmaify(
    node: CompoundAssignmentExpression
  ): ts.BinaryExpression {
    return ts.createBinary(
      SimpleAssignmentTargetEcmaify(node.binding),
      CompoundAssignmentOperatorEcmaify(node.operator),
      ExpressionEcmaify(node.expression)
    )
  }

  export function ComputedMemberExpressionEcmaify(
    node: ComputedMemberExpression
  ): ts.ElementAccessExpression {
    return ts.createElementAccess(
      ExpressionOrSuperEcmaify(node._object),
      ExpressionEcmaify(node.expression)
    )
  }
  
  export function ConditionalExpressionEcmaify(
    node: ConditionalExpression
  ): ts.ConditionalExpression {
    return ts.createConditional(
      ExpressionEcmaify(node.test),
      ExpressionEcmaify(node.consequent),
      ExpressionEcmaify(node.alternate)
    )
  }

  export function EagerFunctionExpressionEcmaify(
    node: EagerFunctionExpression
  ): ts.FunctionExpression {
    throw new Error('Not Implemented')
  }

  export function LazyFunctionExpressionEcmaify(
    node: LazyFunctionExpression
  ): ts.FunctionExpression {
    throw new Error('Not Implemented')
  }

  export function FunctionExpressionContentsEcmaify(
    node: FunctionExpressionContents
  ): any {
    throw new Error('Not Implemented')
  }

  export function IdentifierExpressionEcmaify(
    node: IdentifierExpression
  ): ts.Identifier {
    return ts.createIdentifier(node.name)
  }

  export function NewExpressionEcmaify(node: NewExpression): ts.NewExpression {
    return ts.createNew(
      ExpressionEcmaify(node.callee),
      undefined,
      ArgumentsEcmaify(node.arguments)
    )
  }

  export function NewTargetExpressionEcmaify(
    node: NewTargetExpression
  ): ts.MetaProperty {
    return ts.createMetaProperty(
      ts.SyntaxKind.NewKeyword,
      ts.createIdentifier('target')
    )
  }

  export function MethodEcmaify(node: Method): ts.MethodDeclaration {
    throw new Error('Not Implemented')
  }

  export function GetterEcmaify(node: Getter): ts.GetAccessorDeclaration {
    throw new Error('Not Implemented')
  }

  export function SetterEcmaify(node: Setter): ts.SetAccessorDeclaration {
    throw new Error('Not Implemented')
  }

  export function MethodDefinitionEcmaify(
    node: MethodDefinition
  ): ts.MethodDeclaration | ts.AccessorDeclaration {
    switch (node.type) {
      case NodeType.EagerMethod:
      case NodeType.LazyMethod:
        return MethodEcmaify(node)
      case NodeType.EagerGetter:
      case NodeType.LazyGetter:
        return GetterEcmaify(node)
      case NodeType.EagerSetter:
      case NodeType.LazySetter:
        return SetterEcmaify(node)
    }
  }

  export function ObjectPropertyListEcmaify(
    nodes: FrozenArray<ObjectProperty>
  ): ts.ObjectLiteralElementLike[] {
    return nodes.map(node => {
      switch (node.type) {
        case NodeType.DataProperty:
          return DataPropertyEcmaify(node)
        case NodeType.ShorthandProperty:
          return ShorthandPropertyEcmaify(node)
        case NodeType.EagerMethod:
        case NodeType.LazyMethod:
        case NodeType.EagerGetter:
        case NodeType.LazyGetter:
        case NodeType.EagerSetter:
        case NodeType.LazySetter:
          return MethodDefinitionEcmaify(node)
      }
    })
  }

  export function ObjectExpressionEcmaify(
    node: ObjectExpression
  ): ts.ObjectLiteralExpression {
    return ts.createObjectLiteral(ObjectPropertyListEcmaify(node.properties))
  }

  export function UnaryOperatorEcmaify(
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

  export function UnaryExpressionEcmaify(
    node: UnaryExpression
  ): ts.UnaryExpression {
    switch (node.operator) {
      case UnaryOperator.TypeOf:
        return ts.createTypeOf(ExpressionEcmaify(node.operand))
      case UnaryOperator.Void:
        return ts.createVoid(ExpressionEcmaify(node.operand))
      case UnaryOperator.Delete:
        return ts.createDelete(ExpressionEcmaify(node.operand))
      default:
        return ts.createPrefix(
          UnaryOperatorEcmaify(node.operator),
          ExpressionEcmaify(node.operand)
        )
    }
  }

  export function StaticMemberExpressionEcmaify(
    node: StaticMemberExpression
  ): ts.PropertyAccessExpression {
    return ts.createPropertyAccess(
      ExpressionOrSuperEcmaify(node._object),
      ts.createIdentifier(node.property)
    )
  }

  export function TemplateExpressionEcmaify(
    node: TemplateExpression
  ): ts.TemplateExpression | ts.TaggedTemplateExpression {
    throw new Error('Not Implemented')
  }

  export function ThisExpressionEcmaify(
    node: ThisExpression
  ): ts.ThisExpression {
    return ts.createThis()
  }

  export function UpdateOperatorEcmaify(
    node: UpdateOperator
  ): ts.PostfixUnaryOperator {
    switch (node) {
      case UpdateOperator.PlusPlus:
        return ts.SyntaxKind.PlusPlusToken
      case UpdateOperator.MinusMinus:
        return ts.SyntaxKind.MinusMinusToken
    }
  }

  export function UpdateExpressionEcmaify(
    node: UpdateExpression
  ): ts.UpdateExpression {
    if (node.isPrefix) {
      return ts.createPrefix(
        UpdateOperatorEcmaify(node.operator),
        SimpleAssignmentTargetEcmaify(node.operand)
      )
    } else {
      return ts.createPostfix(
        SimpleAssignmentTargetEcmaify(node.operand),
        UpdateOperatorEcmaify(node.operator)
      )
    }
  }

  export function YieldExpressionEcmaify(
    node: YieldExpression
  ): ts.YieldExpression {
    return ts.createYield(EcmaifyOption(node.expression, ExpressionEcmaify))
  }

  export function YieldStarExpressionEcmaify(
    node: YieldStarExpression
  ): ts.YieldExpression {
    return ts.createYield(
      ts.createToken(ts.SyntaxKind.AsteriskToken),
      ExpressionEcmaify(node.expression)
    )
  }

  export function AwaitExpressionEcmaify(
    node: AwaitExpression
  ): ts.AwaitExpression {
    return ts.createAwait(ExpressionEcmaify(node.expression))
  }

  export function BreakStatementEcmaify(
    node: BreakStatement
  ): ts.BreakStatement {
    return ts.createBreak(node.label)
  }

  export function ContinueStatementEcmaify(
    node: ContinueStatement
  ): ts.ContinueStatement {
    return ts.createContinue(node.label)
  }

  export function DebuggerStatementEcmaify(
    node: DebuggerStatement
  ): ts.DebuggerStatement {
    return ts.createDebuggerStatement()
  }

  export function DoWhileStatementEcmaify(
    node: DoWhileStatement
  ): ts.DoStatement {
    return ts.createDo(
      StatementEcmaify(node.body),
      ExpressionEcmaify(node.test)
    )
  }
  export function EmptyStatementEcmaify(
    node: EmptyStatement
  ): ts.EmptyStatement {
    return ts.createEmptyStatement()
  }

  export function ExpressionStatementEcmaify(
    node: ExpressionStatement
  ): ts.ExpressionStatement {
    return ts.createExpressionStatement(ExpressionEcmaify(node.expression))
  }

  export function BindingPatternEcmaify(
    node: BindingPattern
  ): ts.BindingPattern {
    switch (node.type) {
      case NodeType.ObjectBinding:
        return ObjectBindingEcmaify(node)
      case NodeType.ArrayBinding:
        return ArrayBindingEcmaify(node)
    }
  }

  export function BindingEcmaify(
    node: Binding
  ): ts.BindingPattern | ts.Identifier {
    switch (node.type) {
      case NodeType.ObjectBinding:
      case NodeType.ArrayBinding:
        return BindingPatternEcmaify(node)
      case NodeType.BindingIdentifier:
        return BindingIdentifierEcmaify(node)
    }
  }

  export function ForInOfBindingEcmaify(
    node: ForInOfBinding
  ): ts.ForInitializer {
    return ts.createVariableDeclarationList([
      ts.createVariableDeclaration(BindingEcmaify(node.binding))
    ])
  }

  export function AssignmentTargetPatternEcmaify(
    node: AssignmentTargetPattern
  ): ts.Expression {
    switch (node.type) {
      case NodeType.ObjectAssignmentTarget:
        return ObjectAssignmentTargetEcmaify(node)
      case NodeType.ArrayAssignmentTarget:
        return ArrayAssignmentTargetEcmaify(node)
    }
  }

  export function SimpleAssignmentTargetEcmaify(
    node: SimpleAssignmentTarget
  ): ts.Expression {
    switch (node.type) {
      case NodeType.AssignmentTargetIdentifier:
        return AssignmentTargetIdentifierEcmaify(node)
      case NodeType.ComputedMemberAssignmentTarget:
        return ComputedMemberAssignmentTargetEcmaify(node)
      case NodeType.StaticMemberAssignmentTarget:
        return StaticMemberAssignmentTargetEcmaify(node)
    }
  }

  export function AssignmentTargetEcmaify(
    node: AssignmentTarget
  ): ts.Expression {
    switch (node.type) {
      case NodeType.ObjectAssignmentTarget:
      case NodeType.ArrayAssignmentTarget:
        return AssignmentTargetPatternEcmaify(node)
      case NodeType.AssignmentTargetIdentifier:
      case NodeType.ComputedMemberAssignmentTarget:
      case NodeType.StaticMemberAssignmentTarget:
        return SimpleAssignmentTargetEcmaify(node)
    }
  }

  export function ForInOfBindingOrAssignmentTargetEcmaify(
    node: ForInOfBinding | AssignmentTarget
  ): ts.ForInitializer {
    switch (node.type) {
      case NodeType.ForInOfBinding:
        return ForInOfBindingEcmaify(node)
      default:
        return AssignmentTargetEcmaify(node)
    }
  }

  export function ForInStatementEcmaify(
    node: ForInStatement
  ): ts.ForInStatement {
    return ts.createForIn(
      ForInOfBindingOrAssignmentTargetEcmaify(node.left),
      ExpressionEcmaify(node.right),
      StatementEcmaify(node.body)
    )
  }

  export function ForOfStatementEcmaify(
    node: ForOfStatement
  ): ts.ForOfStatement {
    return ts.createForOf(
      undefined,
      ForInOfBindingOrAssignmentTargetEcmaify(node.left),
      ExpressionEcmaify(node.right),
      StatementEcmaify(node.body)
    )
  }

  export function VariableDeclarationOrExpressionEcmaify(
    node: VariableDeclaration | Expression
  ): ts.ForInitializer {
    switch (node.type) {
      case NodeType.VariableDeclaration:
        return VariableDeclarationListEcmaify(node)
      default:
        return ExpressionEcmaify(node)
    }
  }

  export function ForStatementEcmaify(node: ForStatement): ts.ForStatement {
    return ts.createFor(
      EcmaifyOption(node.init, VariableDeclarationOrExpressionEcmaify),
      EcmaifyOption(node.test, ExpressionEcmaify),
      EcmaifyOption(node.update, ExpressionEcmaify),
      StatementEcmaify(node.body)
    )
  }

  export function IfStatementEcmaify(node: IfStatement): ts.IfStatement {
    return ts.createIf(
      ExpressionEcmaify(node.test),
      StatementEcmaify(node.consequent),
      EcmaifyOption(node.alternate, StatementEcmaify)
    )
  }

  export function LabelledStatementEcmaify(
    node: LabelledStatement
  ): ts.LabeledStatement {
    return ts.createLabel(node.label, StatementEcmaify(node.body))
  }

  export function ReturnStatementEcmaify(
    node: ReturnStatement
  ): ts.ReturnStatement {
    return ts.createReturn(EcmaifyOption(node.expression, ExpressionEcmaify))
  }

  export function SwitchCaseListEcmaify(
    nodes: FrozenArray<SwitchCase | SwitchDefault>
  ): ts.CaseBlock {
    return ts.createCaseBlock(
      nodes.map(node =>
        isSwitchCase(node)
          ? ts.createCaseClause(
              ExpressionEcmaify(node.test),
              StatementListEcmaify(node.consequent)
            )
          : ts.createDefaultClause(StatementListEcmaify(node.consequent))
      )
    )
  }

  export function SwitchStatementEcmaify(
    node: SwitchStatement
  ): ts.SwitchStatement {
    return ts.createSwitch(
      ExpressionEcmaify(node.discriminant),
      SwitchCaseListEcmaify(node.cases)
    )
  }

  export function SwitchStatementWithDefaultEcmaify(
    node: SwitchStatementWithDefault
  ): ts.SwitchStatement {
    return ts.createSwitch(
      ExpressionEcmaify(node.discriminant),
      SwitchCaseListEcmaify(
        (node.preDefaultCases as (SwitchCase | SwitchDefault)[])
          .concat([node.defaultCase])
          .concat(node.postDefaultCases)
      )
    )
  }

  export function ThrowStatementEcmaify(
    node: ThrowStatement
  ): ts.ThrowStatement {
    return ts.createThrow(ExpressionEcmaify(node.expression))
  }

  export function TryCatchStatementEcmaify(
    node: TryCatchStatement
  ): ts.TryStatement {
    return ts.createTry(
      BlockEcmaify(node.body),
      CatchClauseEcmaify(node.catchClause),
      undefined
    )
  }

  export function TryFinallyStatementEcmaify(
    node: TryFinallyStatement
  ): ts.TryStatement {
    return ts.createTry(
      BlockEcmaify(node.body),
      EcmaifyOption(node.catchClause, CatchClauseEcmaify),
      BlockEcmaify(node.finalizer)
    )
  }

  export function WhileStatementEcmaify(
    node: WhileStatement
  ): ts.WhileStatement {
    return ts.createWhile(
      ExpressionEcmaify(node.test),
      StatementEcmaify(node.body)
    )
  }

  export function WithStatementEcmaify(node: WithStatement): ts.WithStatement {
    return ts.createWith(
      ExpressionEcmaify(node._object),
      StatementEcmaify(node.body)
    )
  }

  export function StatementListEcmaify(nodes: FrozenArray<Statement>) {
    return nodes.map(stmt => StatementEcmaify(stmt))
  }

  export function BlockEcmaify(node: Block): ts.Block {
    return ts.createBlock(StatementListEcmaify(node.statements))
  }

  export function CatchClauseEcmaify(node: CatchClause): ts.CatchClause {
    return ts.createCatchClause(
      ts.createVariableDeclaration(BindingEcmaify(node.binding)),
      BlockEcmaify(node.body)
    )
  }

  export function DirectiveEcmaify(node: Directive): ts.StringLiteral {
    return ts.createStringLiteral(node.rawValue)
  }

  export function FormalParametersEcmaify(
    nodes: FormalParameters
  ): ts.ParameterDeclaration[] {
    return nodes.items.map(node => {
      const element = BindingOrBindingWithInitializerEcmaify(node)
      return ts.createParameter(
        undefined,
        undefined,
        undefined,
        element.name,
        undefined,
        undefined,
        element.initializer
      )
    })
  }

  export function EagerFunctionDeclarationEcmaify(
    node: EagerFunctionDeclaration
  ): ts.FunctionDeclaration {
    const contents = FunctionOrMethodContentsEcmaify(node.contents)
    contents.modifiers = node.isAsync ? ts.createNodeArray([ts.createModifier(ts.SyntaxKind.AsyncKeyword)]) : undefined
    contents.asteriskToken = node.isGenerator ? ts.createToken(ts.SyntaxKind.AsteriskToken) : undefined
    contents.name = BindingIdentifierEcmaify(node.name)
    return contents
  }

  export function LazyFunctionDeclarationEcmaify(
    node: LazyFunctionDeclaration
  ): ts.FunctionDeclaration {
    const contents = FunctionOrMethodContentsEcmaify(node.contents)
    contents.modifiers = node.isAsync ? ts.createNodeArray([ts.createModifier(ts.SyntaxKind.AsyncKeyword)]) : undefined
    contents.asteriskToken = node.isGenerator ? ts.createToken(ts.SyntaxKind.AsteriskToken) : undefined
    contents.name = BindingIdentifierEcmaify(node.name)
    return contents
  }

  export function FunctionOrMethodContentsEcmaify(
    node: FunctionOrMethodContents
  ): ts.FunctionDeclaration {
    return ts.createFunctionDeclaration(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      FormalParametersEcmaify(node.params),
      undefined,
      ts.createBlock(
        StatementListEcmaify(node.body)
      )
    )
  }

  export function ScriptEcmaify(node: Script): ts.SourceFile {
    return ts.updateSourceFileNode(
      ts.createSourceFile('', '', ts.ScriptTarget.Latest),
      StatementListEcmaify(node.statements)
    )
  }

  export function SpreadElementEcmaify(node: SpreadElement): ts.SpreadElement {
    return ts.createSpread(ExpressionEcmaify(node.expression))
  }

  export function SuperEcmaify(node: Super): ts.SuperExpression {
    return ts.createSuper()
  }

  export function SwitchCaseEcmaify(node: SwitchCase): ts.CaseClause {
    return ts.createCaseClause(
      ExpressionEcmaify(node.test),
      StatementListEcmaify(node.consequent)
    )
  }

  export function SwitchDefaultEcmaify(node: SwitchDefault): ts.DefaultClause {
    return ts.createDefaultClause(StatementListEcmaify(node.consequent))
  }

  export function TemplateElementEcmaify(
    node: TemplateElement
  ): ts.TemplateSpan {
    throw new Error('Not Implemented')
  }

  export function VariableDeclarationListEcmaify(
    node: VariableDeclaration
  ): ts.VariableDeclarationList {
    return ts.createVariableDeclarationList(
      node.declarators.map(VariableDeclaratorEcmaify)
    )
  }

  export function VariableDeclarationEcmaify(
    node: VariableDeclaration
  ): ts.VariableStatement {
    return ts.createVariableStatement(
      undefined,
      VariableDeclarationListEcmaify(node)
    )
  }

  export function VariableDeclaratorEcmaify(
    node: VariableDeclarator
  ): ts.VariableDeclaration {
    const element = BindingOrBindingWithInitializerEcmaify(node.binding)
    return ts.createVariableDeclaration(
      element.name,
      undefined,
      element.initializer
    )
  }
}

export = Ecmaify