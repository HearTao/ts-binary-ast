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
  BindingPropertyProperty,
  BindingPropertyIdentifier,
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
} from './types'
import {
  mapIfDef,
  Assert,
  AssertDef,
  isDef,
  first,
  AssertCast,
  isArrowFunctionBodyExpression,
  compose
} from './utils'
import {
  createAssertedBlockScope,
  createAssertedBoundNamesScope,
  createAssertedVarScope,
  createAssertedParameterScope,
  createAssertedScriptGlobalScope
} from './factory'

namespace Unecmaify {
  export function UnecmaifyOptional<T, U>(
    v: T | undefined,
    cb: (v: T) => U
  ): U | undefined {
    return isDef(v) ? cb(v) : undefined
  }

  export function UnecmaifyList<T, U>(
    v: ReadonlyArray<T>,
    cb: (v: T) => U
  ): U[] {
    return v.map(cb)
  }

  export function Unecmaify(node: ts.Node): Node | Node[] {
    switch (node.kind) {
      case ts.SyntaxKind.Identifier:
        return IdentifierUnecmaify(node as ts.Identifier)
      case ts.SyntaxKind.BindingElement:
        return BindingElementUnecmaify(node as ts.BindingElement)
      case ts.SyntaxKind.ElementAccessExpression:
        return ElementAccessExpressionUnecmaify(
          node as ts.ElementAccessExpression
        )
      case ts.SyntaxKind.PropertyAccessExpression:
        return PropertyAccessExpressionUnecmaify(
          node as ts.PropertyAccessExpression
        )
      case ts.SyntaxKind.ArrayBindingPattern:
        return ArrayBindingPatternUnecmaify(node as ts.ArrayBindingPattern)
      case ts.SyntaxKind.ObjectBindingPattern:
        return ObjectBindingPatternUnecmaify(node as ts.ObjectBindingPattern)
      case ts.SyntaxKind.BinaryExpression:
        return BinaryExpressionUnecmaify(node as ts.BinaryExpression)
      case ts.SyntaxKind.ArrayLiteralExpression:
        return ArrayLiteralExpressionUnecmaify(
          node as ts.ArrayLiteralExpression
        )
      case ts.SyntaxKind.ShorthandPropertyAssignment:
        return ShorthandPropertyAssignmentUnecmaify(
          node as ts.ShorthandPropertyAssignment
        )
      case ts.SyntaxKind.PropertyAssignment:
        return PropertyAssignmentUnecmaify(node as ts.PropertyAssignment)
      case ts.SyntaxKind.ObjectLiteralExpression:
        return ObjectLiteralExpressionUnecmaify(
          node as ts.ObjectLiteralExpression
        )
      case ts.SyntaxKind.HeritageClause:
        return HeritageClauseUnecmaify(node as ts.HeritageClause)
      case ts.SyntaxKind.ClassExpression:
        return ClassExpressionUnecmaify(node as ts.ClassExpression)
      case ts.SyntaxKind.ClassDeclaration:
        return ClassDeclarationUnecmaify(node as ts.ClassDeclaration)
      case ts.SyntaxKind.NamedImports:
        return NamedImportsUnecmaify(node as ts.NamedImports)
      case ts.SyntaxKind.ImportClause:
        return ImportClauseUnecmaify(node as ts.ImportClause)
      case ts.SyntaxKind.ImportDeclaration:
        return ImportDeclarationUnecmaify(node as ts.ImportDeclaration)
      case ts.SyntaxKind.ImportSpecifier:
        return ImportSpecifierUnecmaify(node as ts.ImportSpecifier)
      case ts.SyntaxKind.ExportDeclaration:
        return ExportDeclarationUnecmaify(node as ts.ExportDeclaration)
      case ts.SyntaxKind.NamedExports:
        return NamedExportsUnecmaify(node as ts.NamedExports)
      case ts.SyntaxKind.FunctionDeclaration:
        return FunctionDeclarationUnecmaify(node as ts.FunctionDeclaration)
      case ts.SyntaxKind.ExportSpecifier:
        return ExportSpecifierUnecmaify(node as ts.ExportSpecifier)
      case ts.SyntaxKind.MethodDeclaration:
        return MethodDeclarationUnecmaify(node as ts.MethodDeclaration)
      case ts.SyntaxKind.GetAccessor:
        return GetAccessorDeclarationUnecmaify(
          node as ts.GetAccessorDeclaration
        )
      case ts.SyntaxKind.SetAccessor:
        return SetAccessorDeclarationUnecmaify(
          node as ts.SetAccessorDeclaration
        )
      case ts.SyntaxKind.ComputedPropertyName:
        return ComputedPropertyNameUnecmaify(node as ts.ComputedPropertyName)
      case ts.SyntaxKind.TrueKeyword:
      case ts.SyntaxKind.FalseKeyword:
        return BooleanLiteralUnecmaify(node as ts.BooleanLiteral)
      case ts.SyntaxKind.NumericLiteral:
        return NumericLiteralUnecmaify(node as ts.NumericLiteral)
      case ts.SyntaxKind.NullKeyword:
        return NullLiteralUnecmaify(node as ts.NullLiteral)
      case ts.SyntaxKind.RegularExpressionLiteral:
        return RegularExpressionLiteralUnecmaify(
          node as ts.RegularExpressionLiteral
        )
      case ts.SyntaxKind.StringLiteral:
        return StringLiteralUnecmaify(node as ts.StringLiteral)
      case ts.SyntaxKind.ArrowFunction:
        return ArrowFunctionUnecmaify(node as ts.ArrowFunction)
      case ts.SyntaxKind.CallExpression:
        return CallExpressionUnecmaify(node as ts.CallExpression)
      case ts.SyntaxKind.ConditionalExpression:
        return ConditionalExpressionUnecmaify(node as ts.ConditionalExpression)
      case ts.SyntaxKind.FunctionExpression:
        return FunctionExpressionUnecmaify(node as ts.FunctionExpression)
      case ts.SyntaxKind.NewExpression:
        return NewExpressionUnecmaify(node as ts.NewExpression)
      case ts.SyntaxKind.MetaProperty:
        return MetaPropertyUnecmaify(node as ts.MetaProperty)
      case ts.SyntaxKind.PrefixUnaryExpression:
        return PrefixUnaryExpressionUnecmaify(node as ts.PrefixUnaryExpression)
      case ts.SyntaxKind.PostfixUnaryExpression:
        return PostfixUnaryExpressionUnecmaify(
          node as ts.PostfixUnaryExpression
        )
      case ts.SyntaxKind.TemplateExpression:
        return TemplateExpressionUnecmaify(node as ts.TemplateExpression)
      case ts.SyntaxKind.ThisKeyword:
        return ThisExpressionUnecmaify(node as ts.ThisExpression)
      case ts.SyntaxKind.YieldExpression:
        return YieldExpressionUnecmaify(node as ts.YieldExpression)
      case ts.SyntaxKind.AwaitExpression:
        return AwaitExpressionUnecmaify(node as ts.AwaitExpression)
      case ts.SyntaxKind.BreakStatement:
        return BreakStatementUnecmaify(node as ts.BreakStatement)
      case ts.SyntaxKind.ContinueStatement:
        return ContinueStatementUnecmaify(node as ts.ContinueStatement)
      case ts.SyntaxKind.DebuggerStatement:
        return DebuggerStatementUnecmaify(node as ts.DebuggerStatement)
      case ts.SyntaxKind.DoStatement:
        return DoStatementUnecmaify(node as ts.DoStatement)
      case ts.SyntaxKind.EmptyStatement:
        return EmptyStatementUnecmaify(node as ts.EmptyStatement)
      case ts.SyntaxKind.ExpressionStatement:
        return ExpressionStatementUnecmaify(node as ts.ExpressionStatement)
      case ts.SyntaxKind.ForInStatement:
        return ForInStatementUnecmaify(node as ts.ForInStatement)
      case ts.SyntaxKind.ForOfStatement:
        return ForOfStatementUnecmaify(node as ts.ForOfStatement)
      case ts.SyntaxKind.ForStatement:
        return ForStatementUnecmaify(node as ts.ForStatement)
      case ts.SyntaxKind.IfStatement:
        return IfStatementUnecmaify(node as ts.IfStatement)
      case ts.SyntaxKind.LabeledStatement:
        return LabeledStatementUnecmaify(node as ts.LabeledStatement)
      case ts.SyntaxKind.ReturnStatement:
        return ReturnStatementUnecmaify(node as ts.ReturnStatement)
      case ts.SyntaxKind.CaseBlock:
        return CaseBlockUnecmaify(node as ts.CaseBlock)
      case ts.SyntaxKind.DefaultClause:
        return DefaultClauseUnecmaify(node as ts.DefaultClause)
      case ts.SyntaxKind.SwitchStatement:
        return SwitchStatementUnecmaify(node as ts.SwitchStatement)
      case ts.SyntaxKind.ThrowStatement:
        return ThrowStatementUnecmaify(node as ts.ThrowStatement)
      case ts.SyntaxKind.TryStatement:
        return TryStatementUnecmaify(node as ts.TryStatement)
      case ts.SyntaxKind.WhileStatement:
        return WhileStatementUnecmaify(node as ts.WhileStatement)
      case ts.SyntaxKind.WithStatement:
        return WithStatementUnecmaify(node as ts.WithStatement)
      case ts.SyntaxKind.Block:
        return BlockUnecmaify(node as ts.Block)
      case ts.SyntaxKind.CatchClause:
        return CatchClauseUnecmaify(node as ts.CatchClause)
      case ts.SyntaxKind.Parameter:
        return ParameterDeclarationUnecmaify(node as ts.ParameterDeclaration)
      case ts.SyntaxKind.SourceFile:
        return SourceFileUnecmaify(node as ts.SourceFile)
      case ts.SyntaxKind.SpreadElement:
        return SpreadElementUnecmaify(node as ts.SpreadElement)
      case ts.SyntaxKind.SuperKeyword:
        return SuperExpressionUnecmaify(node as ts.SuperExpression)
      case ts.SyntaxKind.CaseClause:
        return CaseClauseUnecmaify(node as ts.CaseClause)
      case ts.SyntaxKind.DefaultClause:
        return DefaultClauseUnecmaify(node as ts.DefaultClause)
      case ts.SyntaxKind.TemplateSpan:
        return TemplateSpanUnecmaify(node as ts.TemplateSpan)
      case ts.SyntaxKind.VariableDeclarationList:
        return VariableDeclarationListUnecmaify(
          node as ts.VariableDeclarationList
        )
      case ts.SyntaxKind.VariableStatement:
        return VariableStatementUnecmaify(node as ts.VariableStatement)
      case ts.SyntaxKind.VariableDeclaration:
        return VariableDeclarationUnecmaify(node as ts.VariableDeclaration)
      case ts.SyntaxKind.DeleteExpression:
        return DeleteExpressionUnecmaify(node as ts.DeleteExpression)
      case ts.SyntaxKind.TypeOfExpression:
        return TypeOfExpressionUnecmaify(node as ts.TypeOfExpression)
      case ts.SyntaxKind.VoidExpression:
        return VoidExpressionUnecmaify(node as ts.VoidExpression)
      default:
        throw new Error('Unexpected kind')
    }
  }

  export function StatementUnecmaify(stmt: ts.Statement) {
    switch (stmt.kind) {
      case ts.SyntaxKind.Block:
        return BlockUnecmaify(stmt as ts.Block)
      case ts.SyntaxKind.BreakStatement:
        return BreakStatementUnecmaify(stmt as ts.BreakStatement)
      case ts.SyntaxKind.ContinueStatement:
        return ContinueStatementUnecmaify(stmt as ts.ContinueStatement)
      case ts.SyntaxKind.ClassDeclaration:
        return ClassDeclarationUnecmaify(stmt as ts.ClassDeclaration)
      case ts.SyntaxKind.DebuggerStatement:
        return DebuggerStatementUnecmaify(stmt as ts.DebuggerStatement)
      case ts.SyntaxKind.EmptyStatement:
        return EmptyStatementUnecmaify(stmt as ts.EmptyStatement)
      case ts.SyntaxKind.ExpressionStatement:
        return ExpressionStatementUnecmaify(stmt as ts.ExpressionStatement)
      case ts.SyntaxKind.FunctionDeclaration:
        return FunctionDeclarationUnecmaify(stmt as ts.FunctionDeclaration)
      case ts.SyntaxKind.IfStatement:
        return IfStatementUnecmaify(stmt as ts.IfStatement)
      case ts.SyntaxKind.DoStatement:
        return DoStatementUnecmaify(stmt as ts.DoStatement)
      case ts.SyntaxKind.ForInStatement:
        return ForInStatementUnecmaify(stmt as ts.ForInStatement)
      case ts.SyntaxKind.ForOfStatement:
        return ForOfStatementUnecmaify(stmt as ts.ForOfStatement)
      case ts.SyntaxKind.ForStatement:
        return ForStatementUnecmaify(stmt as ts.ForStatement)
      case ts.SyntaxKind.WhileStatement:
        return WhileStatementUnecmaify(stmt as ts.WhileStatement)
      case ts.SyntaxKind.LabeledStatement:
        return LabeledStatementUnecmaify(stmt as ts.LabeledStatement)
      case ts.SyntaxKind.ReturnStatement:
        return ReturnStatementUnecmaify(stmt as ts.ReturnStatement)
      case ts.SyntaxKind.SwitchStatement:
        return SwitchStatementUnecmaify(stmt as ts.SwitchStatement)
      case ts.SyntaxKind.ThrowStatement:
        return ThrowStatementUnecmaify(stmt as ts.ThrowStatement)
      case ts.SyntaxKind.TryStatement:
        return TryStatementUnecmaify(stmt as ts.TryStatement)
      case ts.SyntaxKind.VariableStatement:
        return VariableStatementUnecmaify(stmt as ts.VariableStatement)
      case ts.SyntaxKind.WithStatement:
        return WithStatementUnecmaify(stmt as ts.WithStatement)
      default:
        throw new Error('Unexpected kind: ' + stmt.kind)
    }
  }

  export function ExpressionUnecmaify(node: ts.Expression): Expression {
    switch (node.kind) {
      case ts.SyntaxKind.TrueKeyword:
      case ts.SyntaxKind.FalseKeyword:
        return BooleanLiteralUnecmaify(node as ts.BooleanLiteral)
      case ts.SyntaxKind.NullKeyword:
        return NullLiteralUnecmaify(node as ts.NullLiteral)
      case ts.SyntaxKind.NumericLiteral:
        return NumericLiteralUnecmaify(node as ts.NumericLiteral)
      case ts.SyntaxKind.RegularExpressionLiteral:
        return RegularExpressionLiteralUnecmaify(
          node as ts.RegularExpressionLiteral
        )
      case ts.SyntaxKind.StringLiteral:
        return StringLiteralUnecmaify(node as ts.StringLiteral)
      case ts.SyntaxKind.ArrayLiteralExpression:
        return ArrayLiteralExpressionUnecmaify(
          node as ts.ArrayLiteralExpression
        )
      case ts.SyntaxKind.ArrowFunction:
        return ArrowFunctionUnecmaify(node as ts.ArrowFunction)
      case ts.SyntaxKind.BinaryExpression:
        return BinaryExpressionUnecmaify(node as ts.BinaryExpression)
      case ts.SyntaxKind.CallExpression:
        return CallExpressionUnecmaify(node as ts.CallExpression)
      case ts.SyntaxKind.ElementAccessExpression:
        return ElementAccessExpressionUnecmaify(
          node as ts.ElementAccessExpression
        )
      case ts.SyntaxKind.ConditionalExpression:
        return ConditionalExpressionUnecmaify(node as ts.ConditionalExpression)
      case ts.SyntaxKind.ClassExpression:
        return ClassExpressionUnecmaify(node as ts.ClassExpression)
      case ts.SyntaxKind.FunctionExpression:
        return FunctionExpressionUnecmaify(node as ts.FunctionExpression)
      case ts.SyntaxKind.Identifier:
        return IdentifierUnecmaify(node as ts.Identifier)
      case ts.SyntaxKind.NewExpression:
        return NewExpressionUnecmaify(node as ts.NewExpression)
      case ts.SyntaxKind.MetaProperty:
        return MetaPropertyUnecmaify(node as ts.MetaProperty)
      case ts.SyntaxKind.ObjectLiteralExpression:
        return ObjectLiteralExpressionUnecmaify(
          node as ts.ObjectLiteralExpression
        )
      case ts.SyntaxKind.PrefixUnaryExpression:
        return PrefixUnaryExpressionUnecmaify(node as ts.PrefixUnaryExpression)
      case ts.SyntaxKind.PostfixUnaryExpression:
        return PostfixUnaryExpressionUnecmaify(
          node as ts.PostfixUnaryExpression
        )
      case ts.SyntaxKind.PropertyAccessExpression:
        return PropertyAccessExpressionUnecmaify(
          node as ts.PropertyAccessExpression
        )
      case ts.SyntaxKind.TaggedTemplateExpression:
      case ts.SyntaxKind.TemplateExpression:
        return TemplateExpressionUnecmaify(node as
          | ts.TaggedTemplateExpression
          | ts.TemplateExpression)
      case ts.SyntaxKind.ThisKeyword:
        return ThisExpressionUnecmaify(node as ts.ThisExpression)
      case ts.SyntaxKind.YieldExpression:
        return YieldExpressionUnecmaify(node as ts.YieldExpression)
      case ts.SyntaxKind.AwaitExpression:
        return AwaitExpressionUnecmaify(node as ts.AwaitExpression)
      case ts.SyntaxKind.DeleteExpression:
        return DeleteExpressionUnecmaify(node as ts.DeleteExpression)
      case ts.SyntaxKind.TypeOfExpression:
        return TypeOfExpressionUnecmaify(node as ts.TypeOfExpression)
      case ts.SyntaxKind.VoidExpression:
        return VoidExpressionUnecmaify(node as ts.VoidExpression)
      default:
        throw new Error('Unexpected expression')
    }
  }

  export function ExpressionListUnecmaify(nodes: ReadonlyArray<ts.Expression>) {
    return nodes.map(ExpressionUnecmaify)
  }

  export function StatementListUnecmaify(nodes: ReadonlyArray<ts.Statement>) {
    return nodes.map(StatementUnecmaify)
  }

  export function ArgumentsUnecmaify(
    args: ReadonlyArray<ts.Expression>
  ): Arguments {
    return args.map(SpreadElementOrExpressionUnecmaify)
  }

  export function SpreadElementOrExpressionListUnecmaify(
    nodes: ReadonlyArray<ts.Expression>
  ): FrozenArray<SpreadElement | Expression> {
    return nodes.map(SpreadElementOrExpressionUnecmaify)
  }

  export function SpreadElementOrExpressionUnecmaify(
    node: ts.Expression
  ): SpreadElement | Expression {
    switch (node.kind) {
      case ts.SyntaxKind.SpreadElement:
        return SpreadElementUnecmaify(node as ts.SpreadElement)
      default:
        return ExpressionUnecmaify(node)
    }
  }

  export function BindingElementListUnecmaify(
    nodes: ReadonlyArray<ts.BindingElement>
  ) {
    return nodes.map(BindingElementUnecmaify)
  }

  export function BindingElementUnecmaify(
    node: ts.BindingElement
  ): Binding | BindingWithInitializer {
    if (node.initializer) {
      return {
        type: NodeType.BindingWithInitializer,
        binding: BindingNameUnecmaify(node.name),
        init: ExpressionUnecmaify(node.initializer)
      }
    }
    return BindingNameUnecmaify(node.name)
  }

  export function BindingNameToBindingOrBindingWithInitializer(
    node: ts.BindingName
  ): Binding | BindingWithInitializer {
    switch (node.kind) {
      case ts.SyntaxKind.Identifier:
        return IdentifierToBindingIdentifierUnecmaify(node)
      case ts.SyntaxKind.ArrayBindingPattern:
      case ts.SyntaxKind.ObjectBindingPattern:
        return BindingPatternUnecmaify(node)
    }
  }

  export function BindingPropertyUnecmaify(
    node: ts.BindingElement
  ): BindingProperty {
    if (node.initializer) {
      return {
        type: NodeType.BindingPropertyIdentifier,
        binding: IdentifierToBindingIdentifierUnecmaify(
          AssertCast(node.name, ts.isIdentifier)
        ),
        init: ExpressionUnecmaify(node.initializer)
      }
    }
    return {
      type: NodeType.BindingPropertyProperty,
      binding: BindingNameToBindingOrBindingWithInitializer(node.name),
      name: PropertyNameUnecmaify(AssertDef(node.propertyName))
    }
  }

  export function ArrayBindingElementListUnecmaify(
    nodes: ReadonlyArray<ts.ArrayBindingElement>
  ): FrozenArray<Binding | BindingWithInitializer> {
    return nodes.map(ArrayBindingElementUnecmaify)
  }

  export function ArrayBindingElementUnecmaify(node: ts.ArrayBindingElement) {
    switch (node.kind) {
      case ts.SyntaxKind.OmittedExpression:
        throw new Error('Unexpected omitted')
      case ts.SyntaxKind.BindingElement:
        return BindingElementUnecmaify(node)
    }
  }

  export function BindingPropertyListUnecmaify(
    nodes: ReadonlyArray<ts.BindingElement>
  ): FrozenArray<BindingProperty> {
    return nodes.map(BindingPropertyUnecmaify)
  }

  export function ArrayBindingPatternUnecmaify(
    node: ts.ArrayBindingPattern
  ): ArrayBinding {
    return {
      type: NodeType.ArrayBinding,
      elements: ArrayBindingElementListUnecmaify(node.elements),
      rest: undefined
    }
  }

  export function ObjectBindingPatternUnecmaify(
    node: ts.ObjectBindingPattern
  ): ObjectBinding {
    return {
      type: NodeType.ObjectBinding,
      properties: BindingPropertyListUnecmaify(node.elements)
    }
  }
  export function ShorthandPropertyAssignmentUnecmaify(
    node: ts.ShorthandPropertyAssignment
  ): ShorthandProperty {
    return {
      type: NodeType.ShorthandProperty,
      name: IdentifierToIdentifierExpressionUnecmaify(node.name)
    }
  }

  export function PropertyAssignmentUnecmaify(
    node: ts.PropertyAssignment
  ): DataProperty {
    return {
      type: NodeType.DataProperty,
      name: PropertyNameUnecmaify(node.name),
      expression: ExpressionUnecmaify(node.initializer)
    }
  }

  export function HeritageClauseSuperUnecmaify(
    node: ReadonlyArray<ts.HeritageClause>
  ): Expression {
    return HeritageClauseUnecmaify(first(node))
  }

  export function HeritageClauseUnecmaify(node: ts.HeritageClause): Expression {
    return ExpressionUnecmaify(first(node.types).expression)
  }

  export function NamedImportsUnecmaify(node: ts.NamedImports): any {}

  export function ImportClauseUnecmaify(node: ts.ImportClause): any {}

  export function ImportDeclarationUnecmaify(node: ts.ImportDeclaration): any {}

  export function ImportSpecifierUnecmaify(node: ts.ImportSpecifier): any {}

  export function ExportDeclarationUnecmaify(node: ts.ExportDeclaration): any {}

  export function NamedExportsUnecmaify(node: ts.NamedExports): any {}

  export function ExportSpecifierUnecmaify(node: ts.ExportSpecifier): any {}

  export function MethodDeclarationUnecmaify(
    node: ts.MethodDeclaration
  ): Method {
    return {
      type: NodeType.EagerMethod,
      name: PropertyNameUnecmaify(node.name),
      isAsync: !!(ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Async),
      isGenerator: !!node.asteriskToken,
      contents: FunctionOrMethodContentsUnecmaify(node),
      directives: [],
      length: node.parameters.length
    }
  }

  export function DeleteExpressionUnecmaify(
    node: ts.DeleteExpression
  ): UnaryExpression {
    return {
      type: NodeType.UnaryExpression,
      operator: UnaryOperator.Delete,
      operand: ExpressionUnecmaify(node.expression)
    }
  }

  export function TypeOfExpressionUnecmaify(
    node: ts.TypeOfExpression
  ): UnaryExpression {
    return {
      type: NodeType.UnaryExpression,
      operator: UnaryOperator.TypeOf,
      operand: ExpressionUnecmaify(node.expression)
    }
  }

  export function VoidExpressionUnecmaify(
    node: ts.VoidExpression
  ): UnaryExpression {
    return {
      type: NodeType.UnaryExpression,
      operator: UnaryOperator.Void,
      operand: ExpressionUnecmaify(node.expression)
    }
  }

  export function GetterContentsUnecmaify(
    node: ts.GetAccessorDeclaration
  ): GetterContents {
    const stmts = AssertDef(node.body).statements
    return {
      type: NodeType.GetterContents,
      body: StatementListUnecmaify(stmts),
      bodyScope: createAssertedVarScope(stmts),
      isThisCaptured: false
    }
  }

  export function GetAccessorDeclarationUnecmaify(
    node: ts.GetAccessorDeclaration
  ): Getter {
    return {
      type: NodeType.EagerGetter,
      name: PropertyNameUnecmaify(node.name),
      directives: [],
      contents: GetterContentsUnecmaify(node)
    }
  }

  export function SetterContentsUnecmaify(
    node: ts.SetAccessorDeclaration
  ): SetterContents {
    const stmts = AssertDef(node.body).statements
    return {
      type: NodeType.SetterContents,
      param: ParameterDeclarationUnecmaify(first(node.parameters)),
      parameterScope: createAssertedParameterScope(node.parameters),
      body: StatementListUnecmaify(stmts),
      bodyScope: createAssertedVarScope(stmts),
      isThisCaptured: false
    }
  }

  export function SetAccessorDeclarationUnecmaify(
    node: ts.SetAccessorDeclaration
  ): Setter {
    return {
      type: NodeType.EagerSetter,
      name: PropertyNameUnecmaify(node.name),
      length: node.parameters.length,
      directives: [],
      contents: SetterContentsUnecmaify(node)
    }
  }

  type UpdateExpressionOperator =
    | ts.SyntaxKind.PlusPlusToken
    | ts.SyntaxKind.MinusMinusToken

  export function UpdateOperatorUnecmaify(
    node: UpdateExpressionOperator
  ): UpdateOperator {
    switch (node) {
      case ts.SyntaxKind.PlusPlusToken:
        return UpdateOperator.PlusPlus
      case ts.SyntaxKind.MinusMinusToken:
        return UpdateOperator.MinusMinus
    }
  }

  export function UpdateExpressionUnecmaify(
    node: ts.PostfixUnaryExpression | ts.PrefixUnaryExpression,
    isPrefix: boolean
  ): UpdateExpression {
    switch (node.operator) {
      case ts.SyntaxKind.PlusPlusToken:
      case ts.SyntaxKind.MinusMinusToken:
        return {
          type: NodeType.UpdateExpression,
          isPrefix,
          operator: UpdateOperatorUnecmaify(node.operator),
          operand: ExpressionToSimpleAssignmentTargetUnecmaify(node.operand)
        }
      default:
        throw new Error('Unecpected operator')
    }
  }

  export function PrefixUnaryOperatorUnecmaify(
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

  export function UnaryExpressionUnecmaify(
    node: ts.PrefixUnaryExpression
  ): UnaryExpression {
    switch (node.operator) {
      case ts.SyntaxKind.PlusPlusToken:
      case ts.SyntaxKind.MinusMinusToken:
        throw new Error('Unecpected operator')
      default:
        return {
          type: NodeType.UnaryExpression,
          operator: PrefixUnaryOperatorUnecmaify(node.operator),
          operand: ExpressionUnecmaify(node.operand)
        }
    }
  }

  export function PrefixUnaryExpressionUnecmaify(
    node: ts.PrefixUnaryExpression
  ): UnaryExpression | UpdateExpression {
    switch (node.operator) {
      case ts.SyntaxKind.PlusPlusToken:
      case ts.SyntaxKind.MinusMinusToken:
        return UpdateExpressionUnecmaify(node, true)
      default:
        return UnaryExpressionUnecmaify(node)
    }
  }

  export function PostfixUnaryExpressionUnecmaify(
    node: ts.PostfixUnaryExpression
  ): UpdateExpression {
    return UpdateExpressionUnecmaify(node, false)
  }

  export function CaseOrDefaultClauseUnecmaify(
    node: ts.CaseOrDefaultClause
  ): SwitchCase | SwitchDefault {
    switch (node.kind) {
      case ts.SyntaxKind.CaseClause:
        return CaseClauseUnecmaify(node)
      case ts.SyntaxKind.DefaultClause:
        return DefaultClauseUnecmaify(node)
    }
  }

  export function CaseBlockUnecmaify(
    node: ts.CaseBlock
  ): Array<SwitchCase | SwitchDefault> {
    return UnecmaifyList(node.clauses, CaseOrDefaultClauseUnecmaify)
  }

  export function CatchClauseUnecmaify(node: ts.CatchClause): CatchClause {
    const declaration = AssertDef(node.variableDeclaration)
    return {
      type: NodeType.CatchClause,
      binding: BindingNameUnecmaify(declaration.name),
      bindingScope: createAssertedBoundNamesScope(),
      body: BlockUnecmaify(node.block)
    }
  }

  export function ParameterDeclarationListUnecmaify(
    nodes: ReadonlyArray<ts.ParameterDeclaration>
  ) {
    return nodes.map(ParameterDeclarationUnecmaify)
  }

  export function ParameterDeclarationUnecmaify(
    node: ts.ParameterDeclaration
  ): Parameter {
    if (node.initializer) {
      return {
        type: NodeType.BindingWithInitializer,
        binding: BindingNameUnecmaify(node.name),
        init: ExpressionUnecmaify(node.initializer)
      }
    } else {
      return BindingNameUnecmaify(node.name)
    }
  }

  export function SourceFileUnecmaify(node: ts.SourceFile): Script {
    const stmts = node.statements
    return {
      type: NodeType.Script,
      directives: [],
      scope: createAssertedScriptGlobalScope(stmts),
      statements: StatementListUnecmaify(stmts)
    }
  }

  export function SpreadElementUnecmaify(
    node: ts.SpreadElement
  ): SpreadElement {
    return {
      type: NodeType.SpreadElement,
      expression: ExpressionUnecmaify(node.expression)
    }
  }
  export function SuperExpressionUnecmaify(node: ts.SuperExpression): Super {
    return {
      type: NodeType.Super
    }
  }

  export function CaseClauseUnecmaify(node: ts.CaseClause): SwitchCase {
    return {
      type: NodeType.SwitchCase,
      test: ExpressionUnecmaify(node.expression),
      consequent: StatementListUnecmaify(node.statements)
    }
  }

  export function DefaultClauseUnecmaify(
    node: ts.DefaultClause
  ): SwitchDefault {
    return {
      type: NodeType.SwitchDefault,
      consequent: StatementListUnecmaify(node.statements)
    }
  }

  export function TemplateSpanUnecmaify(node: ts.TemplateSpan): any {}

  export function BooleanLiteralUnecmaify(
    node: ts.BooleanLiteral
  ): LiteralBooleanExpression {
    return {
      type: NodeType.LiteralBooleanExpression,
      value: node.kind === ts.SyntaxKind.TrueKeyword
    }
  }

  export function NullLiteralUnecmaify(
    node: ts.NullLiteral
  ): LiteralNullExpression {
    return {
      type: NodeType.LiteralNullExpression
    }
  }

  export function NumericLiteralUnecmaify(
    node: ts.NumericLiteral
  ): LiteralNumericExpression {
    return {
      type: NodeType.LiteralNumericExpression,
      value: +node.text
    }
  }

  export function RegularExpressionLiteralUnecmaify(
    node: ts.RegularExpressionLiteral
  ): LiteralRegExpExpression {
    return {
      type: NodeType.LiteralRegExpExpression,
      pattern: node.text,
      flags: ''
    }
  }

  export function StringLiteralUnecmaify(
    node: ts.StringLiteral
  ): LiteralStringExpression {
    return {
      type: NodeType.LiteralStringExpression,
      value: node.text
    }
  }

  export function ArrayLiteralExpressionUnecmaify(
    node: ts.ArrayLiteralExpression
  ): ArrayExpression {
    return {
      type: NodeType.ArrayExpression,
      elements: SpreadElementOrExpressionListUnecmaify(node.elements)
    }
  }

  export function ArrowExpressionContentsWithFunctionBodyUnecmaify(
    node: ts.ArrowFunction
  ): ArrowExpressionContentsWithFunctionBody {
    const stmts = AssertCast(AssertDef(node.body), ts.isBlock).statements
    return {
      type: NodeType.ArrowExpressionContentsWithFunctionBody,
      params: FormalParametersUnecmaify(node.parameters),
      body: StatementListUnecmaify(stmts),
      bodyScope: createAssertedVarScope(stmts),
      parameterScope: createAssertedParameterScope(node.parameters)
    }
  }

  export function ArrowExpressionContentsWithExpressionUnecmaify(
    node: ts.ArrowFunction
  ): ArrowExpressionContentsWithExpression {
    return {
      type: NodeType.ArrowExpressionContentsWithExpression,
      params: FormalParametersUnecmaify(node.parameters),
      body: ExpressionUnecmaify(
        AssertCast(AssertDef(node.body), isArrowFunctionBodyExpression)
      ),
      bodyScope: createAssertedVarScope([]),
      parameterScope: createAssertedParameterScope(node.parameters)
    }
  }

  export function ArrowFunctionUnecmaify(
    node: ts.ArrowFunction
  ): ArrowExpression {
    if (ts.isBlock(node.body)) {
      return {
        type: NodeType.EagerArrowExpressionWithFunctionBody,
        isAsync: !!(ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Async),
        contents: ArrowExpressionContentsWithFunctionBodyUnecmaify(node),
        length: node.parameters.length,
        directives: []
      }
    }
    return {
      type: NodeType.EagerArrowExpressionWithExpression,
      isAsync: !!(ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Async),
      contents: ArrowExpressionContentsWithExpressionUnecmaify(node),
      length: node.parameters.length
    }
  }

  export function BinaryOperatorUnecmaify(
    node: ts.CompoundAssignmentOperator
  ): CompoundAssignmentOperator
  export function BinaryOperatorUnecmaify(
    node: Exclude<
      ts.BinaryOperator,
      ts.CompoundAssignmentOperator | ts.SyntaxKind.EqualsToken
    >
  ): BinaryOperator
  export function BinaryOperatorUnecmaify(
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

  export function BinaryExpressionUnecmaify(
    node: ts.BinaryExpression
  ): BinaryExpression | AssignmentExpression | CompoundAssignmentExpression {
    switch (node.operatorToken.kind) {
      case ts.SyntaxKind.EqualsToken:
        return {
          type: NodeType.AssignmentExpression,
          binding: ExpressionToAssignmentTargetUnecmaify(node.left),
          expression: ExpressionUnecmaify(node.right)
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
          binding: ExpressionToSimpleAssignmentTargetUnecmaify(node.left),
          operator: BinaryOperatorUnecmaify(node.operatorToken.kind),
          expression: ExpressionUnecmaify(node.right)
        }
      default:
        return {
          type: NodeType.BinaryExpression,
          left: ExpressionUnecmaify(node.left),
          operator: BinaryOperatorUnecmaify(node.operatorToken.kind),
          right: ExpressionUnecmaify(node.right)
        }
    }
  }

  export function CallExpressionUnecmaify(
    node: ts.CallExpression
  ): CallExpression {
    return {
      type: NodeType.CallExpression,
      callee: ExpressionUnecmaify(node.expression),
      arguments: ExpressionListUnecmaify(node.arguments)
    }
  }

  export function ElementAccessExpressionUnecmaify(
    node: ts.ElementAccessExpression
  ): ComputedMemberExpression {
    return {
      type: NodeType.ComputedMemberExpression,
      _object: ExpressionUnecmaify(node.expression),
      expression: ExpressionUnecmaify(node.argumentExpression)
    }
  }

  export function ConditionalExpressionUnecmaify(
    node: ts.ConditionalExpression
  ): ConditionalExpression {
    return {
      type: NodeType.ConditionalExpression,
      test: ExpressionUnecmaify(node.condition),
      consequent: ExpressionUnecmaify(node.whenTrue),
      alternate: ExpressionUnecmaify(node.whenFalse)
    }
  }

  export function ClassExpressionUnecmaify(
    node: ts.ClassExpression
  ): ClassExpression {
    return {
      type: NodeType.ClassExpression,
      name: UnecmaifyOptional(
        node.name,
        IdentifierToBindingIdentifierUnecmaify
      ),
      super: UnecmaifyOptional(
        node.heritageClauses,
        HeritageClauseSuperUnecmaify
      ),
      elements: MethodDefinitionListUnecmaify(node.members)
    }
  }

  export function FunctionExpressionContentsUnecmaify(
    node: ts.FunctionExpression
  ): FunctionExpressionContents {
    const stmts = AssertDef(node.body).statements
    return {
      type: NodeType.FunctionExpressionContents,
      params: FormalParametersUnecmaify(node.parameters),
      body: StatementListUnecmaify(stmts),
      isThisCaptured: false,
      bodyScope: createAssertedVarScope(stmts),
      parameterScope: createAssertedParameterScope(node.parameters),
      isFunctionNameCaptured: false
    }
  }

  export function FunctionExpressionUnecmaify(
    node: ts.FunctionExpression
  ): FunctionExpression {
    return {
      type: NodeType.EagerFunctionExpression,
      name: UnecmaifyOptional(
        node.name,
        IdentifierToBindingIdentifierUnecmaify
      ),
      isAsync: !!(ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Async),
      isGenerator: !!node.asteriskToken,
      contents: FunctionExpressionContentsUnecmaify(node),
      directives: [],
      length: node.parameters.length
    }
  }

  export function IdentifierUnecmaify(
    node: ts.Identifier
  ): IdentifierExpression {
    return {
      type: NodeType.IdentifierExpression,
      name: node.text
    }
  }

  export function NewExpressionUnecmaify(
    node: ts.NewExpression
  ): NewExpression {
    return {
      type: NodeType.NewExpression,
      callee: ExpressionUnecmaify(node.expression),
      arguments: mapIfDef(node.arguments, ExpressionUnecmaify)
    }
  }

  export function MetaPropertyUnecmaify(
    node: ts.MetaProperty
  ): NewTargetExpression {
    Assert(
      node.keywordToken === ts.SyntaxKind.NewKeyword &&
        node.name.text === 'target'
    )
    return {
      type: NodeType.NewTargetExpression
    }
  }

  export function SpreadAssignmentUnecmaify(node: ts.SpreadAssignment): any {
    throw new Error('Not implemented')
  }

  export function ObjectLiteralElementLikeUnecmaify(
    node: ts.ObjectLiteralElementLike
  ): ObjectProperty {
    switch (node.kind) {
      case ts.SyntaxKind.PropertyAssignment:
        return PropertyAssignmentUnecmaify(node)
      case ts.SyntaxKind.ShorthandPropertyAssignment:
        return ShorthandPropertyAssignmentUnecmaify(node)
      case ts.SyntaxKind.SpreadAssignment:
        return SpreadAssignmentUnecmaify(node)
      case ts.SyntaxKind.MethodDeclaration:
        return MethodDeclarationUnecmaify(node)
      case ts.SyntaxKind.GetAccessor:
        return GetAccessorDeclarationUnecmaify(node)
      case ts.SyntaxKind.SetAccessor:
        return SetAccessorDeclarationUnecmaify(node)
    }
  }

  export function ObjectLiteralExpressionUnecmaify(
    node: ts.ObjectLiteralExpression
  ): ObjectExpression {
    return {
      type: NodeType.ObjectExpression,
      properties: node.properties.map(ObjectLiteralElementLikeUnecmaify)
    }
  }

  export function PropertyAccessExpressionToStaticMemberAssignmentTargetUnecmaify(
    node: ts.PropertyAccessExpression
  ): StaticMemberAssignmentTarget {
    return {
      type: NodeType.StaticMemberAssignmentTarget,
      _object: ExpressionUnecmaify(node.expression),
      property: node.name.text
    }
  }

  export function PropertyAccessExpressionUnecmaify(
    node: ts.PropertyAccessExpression
  ): StaticMemberExpression {
    return {
      type: NodeType.StaticMemberExpression,
      _object: ExpressionUnecmaify(node.expression),
      property: node.name.text
    }
  }

  export function TemplateExpressionUnecmaify(
    node: ts.TaggedTemplateExpression | ts.TemplateExpression
  ): TemplateExpression {
    throw new Error('Not implemented')
  }

  export function ThisExpressionUnecmaify(
    node: ts.ThisExpression
  ): ThisExpression {
    return {
      type: NodeType.ThisExpression
    }
  }

  export function YieldExpressionUnecmaify(
    node: ts.YieldExpression
  ): YieldExpression | YieldStarExpression {
    if (node.asteriskToken) {
      return {
        type: NodeType.YieldStarExpression,
        expression: ExpressionUnecmaify(AssertDef(node.expression))
      }
    } else {
      return {
        type: NodeType.YieldExpression
      }
    }
  }

  export function AwaitExpressionUnecmaify(
    node: ts.AwaitExpression
  ): AwaitExpression {
    return {
      type: NodeType.AwaitExpression,
      expression: ExpressionUnecmaify(node.expression)
    }
  }

  export function BlockUnecmaify(node: ts.Block): Block {
    return {
      type: NodeType.Block,
      statements: UnecmaifyList(node.statements, StatementUnecmaify),
      scope: createAssertedBlockScope()
    }
  }

  export function BreakStatementUnecmaify(
    node: ts.BreakStatement
  ): BreakStatement {
    return {
      type: NodeType.BreakStatement,
      label: UnecmaifyOptional(node.label, x => x.text)
    }
  }

  export function ContinueStatementUnecmaify(
    node: ts.ContinueStatement
  ): ContinueStatement {
    return {
      type: NodeType.ContinueStatement,
      label: UnecmaifyOptional(node.label, x => x.text)
    }
  }

  export function MethodDefinitionListUnecmaify(
    nodes: ReadonlyArray<ts.ClassElement>
  ): FrozenArray<ClassElement> {
    return nodes.map(node =>
      ClassElementUnecmaify(node, MethodDefinitionUnecmaify(node))
    )
  }

  export function ClassElementUnecmaify(
    node: ts.ClassElement,
    method: MethodDefinition
  ): ClassElement {
    return {
      type: NodeType.ClassElement,
      isStatic: !!(ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Static),
      method
    }
  }

  export function MethodDefinitionUnecmaify(
    node: ts.ClassElement
  ): MethodDefinition {
    switch (node.kind) {
      case ts.SyntaxKind.MethodDeclaration:
        return MethodDeclarationUnecmaify(node as ts.MethodDeclaration)
      case ts.SyntaxKind.GetAccessor:
      case ts.SyntaxKind.SetAccessor:
      default:
        throw new Error('Unecpected kind')
    }
  }

  export function ClassDeclarationUnecmaify(
    node: ts.ClassDeclaration
  ): ClassDeclaration {
    return {
      type: NodeType.ClassDeclaration,
      name: IdentifierToBindingIdentifierUnecmaify(AssertDef(node.name)),
      super: UnecmaifyOptional(
        node.heritageClauses,
        HeritageClauseSuperUnecmaify
      ),
      elements: MethodDefinitionListUnecmaify(node.members)
    }
  }

  export function DebuggerStatementUnecmaify(
    node: ts.DebuggerStatement
  ): DebuggerStatement {
    return {
      type: NodeType.DebuggerStatement
    }
  }

  export function EmptyStatementUnecmaify(
    node: ts.EmptyStatement
  ): EmptyStatement {
    return {
      type: NodeType.EmptyStatement
    }
  }

  export function ExpressionStatementUnecmaify(
    node: ts.ExpressionStatement
  ): ExpressionStatement {
    return {
      type: NodeType.ExpressionStatement,
      expression: ExpressionUnecmaify(node.expression)
    }
  }

  export function FormalParametersUnecmaify(
    nodes: ReadonlyArray<ts.ParameterDeclaration>
  ): FormalParameters {
    return {
      type: NodeType.FormalParameters,
      items: ParameterDeclarationListUnecmaify(nodes)
    }
  }

  export function FunctionOrMethodContentsUnecmaify(
    node: ts.FunctionDeclaration | ts.MethodDeclaration
  ): FunctionOrMethodContents {
    const stmts = AssertDef(node.body).statements
    return {
      type: NodeType.FunctionOrMethodContents,
      params: FormalParametersUnecmaify(node.parameters),
      body: StatementListUnecmaify(stmts),
      isThisCaptured: false,
      bodyScope: createAssertedVarScope(stmts),
      parameterScope: createAssertedParameterScope(node.parameters)
    }
  }

  export function FunctionDeclarationUnecmaify(
    node: ts.FunctionDeclaration
  ): FunctionDeclaration {
    return {
      type: NodeType.EagerFunctionDeclaration,
      name: IdentifierToBindingIdentifierUnecmaify(AssertDef(node.name)),
      isAsync: !!(ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Async),
      isGenerator: !!node.asteriskToken,
      contents: FunctionOrMethodContentsUnecmaify(node),
      directives: [],
      length: node.parameters.length
    }
  }

  export function IfStatementUnecmaify(node: ts.IfStatement): IfStatement {
    return {
      type: NodeType.IfStatement,
      test: ExpressionUnecmaify(node.expression),
      consequent: StatementUnecmaify(node.thenStatement),
      alternate: UnecmaifyOptional(node.elseStatement, StatementUnecmaify)
    }
  }

  export function DoStatementUnecmaify(node: ts.DoStatement): DoWhileStatement {
    return {
      type: NodeType.DoWhileStatement,
      test: ExpressionUnecmaify(node.expression),
      body: StatementUnecmaify(node.statement)
    }
  }

  export function AssignmentTargetPropertyListUnecmaify(
    nodes: ReadonlyArray<ts.ObjectLiteralElementLike>
  ) {
    return UnecmaifyList(
      nodes,
      ObjectLiteralElementLikeToAssignmentTargetPropertyUnecmaify
    )
  }

  export function AssignmentTargetPropertyIdentifierUnecmaify(
    node: ts.ShorthandPropertyAssignment
  ): AssignmentTargetPropertyIdentifier {
    return {
      type: NodeType.AssignmentTargetPropertyIdentifier,
      binding: IdentifierToAssignmentTargetIdentifierUnecmaify(node.name),
      init: UnecmaifyOptional(
        node.objectAssignmentInitializer,
        ExpressionUnecmaify
      )
    }
  }

  export function LiteralPropertyNameUnecmaify(
    node: ts.Identifier | ts.StringLiteral | ts.NumericLiteral
  ): LiteralPropertyName {
    return {
      type: NodeType.LiteralPropertyName,
      value: node.text
    }
  }

  export function ComputedPropertyNameUnecmaify(
    node: ts.ComputedPropertyName
  ): ComputedPropertyName {
    return {
      type: NodeType.ComputedPropertyName,
      expression: ExpressionUnecmaify(node.expression)
    }
  }

  export function PropertyNameUnecmaify(node: ts.PropertyName): PropertyName {
    switch (node.kind) {
      case ts.SyntaxKind.Identifier:
      case ts.SyntaxKind.StringLiteral:
      case ts.SyntaxKind.NumericLiteral:
        return LiteralPropertyNameUnecmaify(node)
      case ts.SyntaxKind.ComputedPropertyName:
        return ComputedPropertyNameUnecmaify(node)
    }
  }

  export function AssignmentExpressionToAssignmentTargetWithInitializer(
    node: ts.AssignmentExpression<ts.EqualsToken>
  ): AssignmentTargetWithInitializer {
    return {
      type: NodeType.AssignmentTargetWithInitializer,
      binding: ExpressionToAssignmentTargetUnecmaify(node.left),
      init: ExpressionUnecmaify(node.right)
    }
  }

  export function BinaryExpressionToAssignmentTargetWithInitializerEcmaify(
    node: ts.BinaryExpression
  ): AssignmentTargetWithInitializer {
    switch (node.operatorToken.kind) {
      case ts.SyntaxKind.EqualsToken:
        return AssignmentExpressionToAssignmentTargetWithInitializer(
          node as ts.AssignmentExpression<ts.EqualsToken>
        )
      default:
        throw new Error('Unecpected operator')
    }
  }

  export function ExpressionToAssignmentTargetOrAssignmentTargetWithInitializerListUnecmaify(
    nodes: ReadonlyArray<ts.Expression>
  ): FrozenArray<AssignmentTarget | AssignmentTargetWithInitializer> {
    return nodes.map(
      ExpressionToAssignmentTargetOrAssignmentTargetWithInitializerUnecmaify
    )
  }

  export function ExpressionToAssignmentTargetUnecmaify(
    node: ts.Expression
  ): AssignmentTarget {
    switch (node.kind) {
      case ts.SyntaxKind.ObjectLiteralExpression:
      case ts.SyntaxKind.ArrayLiteralExpression:
      case ts.SyntaxKind.Identifier:
      case ts.SyntaxKind.ElementAccessExpression:
      case ts.SyntaxKind.PropertyAccessExpression:
        return AssignmentTargetUnecmaify(node as AssignmentTargetEcmaifyType)
      default:
        throw new Error('Unecpected kind')
    }
  }

  export function ExpressionToAssignmentTargetOrAssignmentTargetWithInitializerUnecmaify(
    node: ts.Expression
  ): AssignmentTarget | AssignmentTargetWithInitializer {
    switch (node.kind) {
      case ts.SyntaxKind.BinaryExpression:
        return BinaryExpressionToAssignmentTargetWithInitializerEcmaify(
          node as ts.BinaryExpression
        )
      case ts.SyntaxKind.ObjectLiteralExpression:
      case ts.SyntaxKind.ArrayLiteralExpression:
      case ts.SyntaxKind.Identifier:
      case ts.SyntaxKind.ElementAccessExpression:
      case ts.SyntaxKind.PropertyAccessExpression:
        return AssignmentTargetUnecmaify(node as AssignmentTargetEcmaifyType)
      default:
        throw new Error('Unecpected kind')
    }
  }

  export function AssignmentTargetPropertyPropertyUnecmaify(
    node: ts.PropertyAssignment
  ): AssignmentTargetPropertyProperty {
    return {
      type: NodeType.AssignmentTargetPropertyProperty,
      name: PropertyNameUnecmaify(node.name),
      binding: ExpressionToAssignmentTargetOrAssignmentTargetWithInitializerUnecmaify(
        node.initializer
      )
    }
  }

  export function AssignmentTargetPropertyUnecmaify(
    node: ts.ShorthandPropertyAssignment | ts.PropertyAssignment
  ): AssignmentTargetProperty {
    switch (node.kind) {
      case ts.SyntaxKind.ShorthandPropertyAssignment:
        return AssignmentTargetPropertyIdentifierUnecmaify(node)
      case ts.SyntaxKind.PropertyAssignment:
        return AssignmentTargetPropertyPropertyUnecmaify(node)
    }
  }

  export function ObjectLiteralElementLikeToAssignmentTargetPropertyUnecmaify(
    node: ts.ObjectLiteralElementLike
  ) {
    switch (node.kind) {
      case ts.SyntaxKind.ShorthandPropertyAssignment:
      case ts.SyntaxKind.PropertyAssignment:
        return AssignmentTargetPropertyUnecmaify(node)
      default:
        throw new Error('Unexpected kind')
    }
  }

  export function ObjectLiteralExpressionToObjectAssignmentTargetUnecmaify(
    node: ts.ObjectLiteralExpression
  ): ObjectAssignmentTarget {
    return {
      type: NodeType.ObjectAssignmentTarget,
      properties: AssignmentTargetPropertyListUnecmaify(node.properties)
    }
  }

  export function ArrayLiteralExpressionToObjectAssignmentTargetUnecmaify(
    node: ts.ArrayLiteralExpression
  ): ArrayAssignmentTarget {
    return {
      type: NodeType.ArrayAssignmentTarget,
      elements: ExpressionToAssignmentTargetOrAssignmentTargetWithInitializerListUnecmaify(
        node.elements
      )
    }
  }

  export function AssignmentTargetPatternUnecmaify(
    node: AssignmentTargetPatternEcmaifyType
  ): AssignmentTargetPattern {
    switch (node.kind) {
      case ts.SyntaxKind.ObjectLiteralExpression:
        return ObjectLiteralExpressionToObjectAssignmentTargetUnecmaify(node)
      case ts.SyntaxKind.ArrayLiteralExpression:
        return ArrayLiteralExpressionToObjectAssignmentTargetUnecmaify(node)
    }
  }

  export function IdentifierToAssignmentTargetIdentifierUnecmaify(
    node: ts.Identifier
  ): AssignmentTargetIdentifier {
    return {
      type: NodeType.AssignmentTargetIdentifier,
      name: node.text
    }
  }

  export function IdentifierToIdentifierExpressionUnecmaify(
    node: ts.Identifier
  ): IdentifierExpression {
    return {
      type: NodeType.IdentifierExpression,
      name: node.text
    }
  }

  export function ElementAccessExpressionToComputedMemberAssignmentTargetUnecmaify(
    node: ts.ElementAccessExpression
  ): ComputedMemberAssignmentTarget {
    return {
      type: NodeType.ComputedMemberAssignmentTarget,
      _object: ExpressionUnecmaify(node.expression),
      expression: ExpressionUnecmaify(node.argumentExpression)
    }
  }

  export function SimpleAssignmentTargetUnecmaify(
    node: SimpleAssignmentTargetEcmaifyType
  ): SimpleAssignmentTarget {
    switch (node.kind) {
      case ts.SyntaxKind.Identifier:
        return IdentifierToAssignmentTargetIdentifierUnecmaify(node)
      case ts.SyntaxKind.ElementAccessExpression:
        return ElementAccessExpressionToComputedMemberAssignmentTargetUnecmaify(
          node
        )
      case ts.SyntaxKind.PropertyAccessExpression:
        return PropertyAccessExpressionToStaticMemberAssignmentTargetUnecmaify(
          node
        )
    }
  }

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

  export function ExpressionToSimpleAssignmentTargetUnecmaify(
    node: ts.Expression
  ): SimpleAssignmentTarget {
    switch (node.kind) {
      case ts.SyntaxKind.Identifier:
      case ts.SyntaxKind.ElementAccessExpression:
      case ts.SyntaxKind.PropertyAccessExpression:
        return SimpleAssignmentTargetUnecmaify(
          node as SimpleAssignmentTargetEcmaifyType
        )
      default:
        throw new Error('Unexpected kind')
    }
  }

  export function AssignmentTargetUnecmaify(
    node: AssignmentTargetEcmaifyType
  ): AssignmentTarget {
    switch (node.kind) {
      case ts.SyntaxKind.ObjectLiteralExpression:
      case ts.SyntaxKind.ArrayLiteralExpression:
        return AssignmentTargetPatternUnecmaify(
          node as AssignmentTargetPatternEcmaifyType
        )
      case ts.SyntaxKind.Identifier:
      case ts.SyntaxKind.ElementAccessExpression:
      case ts.SyntaxKind.PropertyAccessExpression:
        return SimpleAssignmentTargetUnecmaify(
          node as SimpleAssignmentTargetEcmaifyType
        )
    }
  }

  export function ForInitializerUnecmaify(
    node: ts.ForInitializer
  ): ForInOfBinding | AssignmentTarget {
    switch (node.kind) {
      case ts.SyntaxKind.VariableDeclarationList:
        const declarationList = AssertCast(node, ts.isVariableDeclarationList)
        return {
          type: NodeType.ForInOfBinding,
          kind: VariableDeclarationKind.Var,
          binding: BindingNameUnecmaify(
            first(declarationList.declarations).name
          )
        }
      case ts.SyntaxKind.ObjectLiteralExpression:
      case ts.SyntaxKind.ArrayLiteralExpression:
      case ts.SyntaxKind.Identifier:
      case ts.SyntaxKind.ElementAccessExpression:
      case ts.SyntaxKind.PropertyAccessExpression:
        return AssignmentTargetUnecmaify(node as AssignmentTargetEcmaifyType)
      default:
        throw new Error('Unexpected kind')
    }
  }

  export function ForInitializerToVariableDeclarationOrExpression(
    node: ts.ForInitializer
  ): VariableDeclaration | Expression {
    switch (node.kind) {
      case ts.SyntaxKind.VariableDeclarationList:
        return {
          type: NodeType.VariableDeclaration,
          kind: VariableDeclarationKind.Var,
          declarators: VariableDeclarationListUnecmaify(
            node as ts.VariableDeclarationList
          )
        }
      default:
        return ExpressionUnecmaify(node)
    }
  }

  export function ForInStatementUnecmaify(
    node: ts.ForInStatement
  ): ForInStatement {
    return {
      type: NodeType.ForInStatement,
      left: ForInitializerUnecmaify(node.initializer),
      right: ExpressionUnecmaify(node.expression),
      body: StatementUnecmaify(node.statement)
    }
  }

  export function ForOfStatementUnecmaify(
    node: ts.ForOfStatement
  ): ForOfStatement {
    return {
      type: NodeType.ForOfStatement,
      left: ForInitializerUnecmaify(node.initializer),
      right: ExpressionUnecmaify(node.expression),
      body: StatementUnecmaify(node.statement)
    }
  }

  export function ForStatementUnecmaify(node: ts.ForStatement): ForStatement {
    return {
      type: NodeType.ForStatement,
      init: UnecmaifyOptional(
        node.initializer,
        ForInitializerToVariableDeclarationOrExpression
      ),
      test: UnecmaifyOptional(node.condition, ExpressionUnecmaify),
      update: UnecmaifyOptional(node.incrementor, ExpressionUnecmaify),
      body: StatementUnecmaify(node.statement)
    }
  }

  export function WhileStatementUnecmaify(
    node: ts.WhileStatement
  ): WhileStatement {
    return {
      type: NodeType.WhileStatement,
      test: ExpressionUnecmaify(node.expression),
      body: StatementUnecmaify(node.statement)
    }
  }

  export function LabeledStatementUnecmaify(
    node: ts.LabeledStatement
  ): LabelledStatement {
    return {
      type: NodeType.LabelledStatement,
      label: node.label.text,
      body: StatementUnecmaify(node.statement)
    }
  }

  export function ReturnStatementUnecmaify(
    node: ts.ReturnStatement
  ): ReturnStatement {
    return {
      type: NodeType.ReturnStatement,
      expression: UnecmaifyOptional(node.expression, ExpressionUnecmaify)
    }
  }

  export function CaseClauseListUnecmaify(
    nodes: ReadonlyArray<ts.CaseOrDefaultClause>
  ): FrozenArray<SwitchCase> {
    return nodes.map(clause =>
      CaseClauseUnecmaify(AssertCast(clause, ts.isCaseClause))
    )
  }

  export function SwitchStatementUnecmaify(
    node: ts.SwitchStatement
  ): SwitchStatement | SwitchStatementWithDefault {
    const defaultClauseIndex = node.caseBlock.clauses.findIndex(
      ts.isDefaultClause
    )
    if (defaultClauseIndex >= 0) {
      return {
        type: NodeType.SwitchStatementWithDefault,
        discriminant: ExpressionUnecmaify(node.expression),
        defaultCase: DefaultClauseUnecmaify(
          AssertCast(
            node.caseBlock.clauses[defaultClauseIndex],
            ts.isDefaultClause
          )
        ),
        preDefaultCases: CaseClauseListUnecmaify(
          node.caseBlock.clauses.slice(0, defaultClauseIndex)
        ),
        postDefaultCases: CaseClauseListUnecmaify(
          node.caseBlock.clauses.slice(defaultClauseIndex + 1)
        )
      }
    } else {
      return {
        type: NodeType.SwitchStatement,
        discriminant: ExpressionUnecmaify(node.expression),
        cases: node.caseBlock.clauses.map(clause =>
          CaseClauseUnecmaify(AssertCast(clause, ts.isCaseClause))
        )
      }
    }
  }

  export function ThrowStatementUnecmaify(
    node: ts.ThrowStatement
  ): ThrowStatement {
    return {
      type: NodeType.ThrowStatement,
      expression: ExpressionUnecmaify(AssertDef(node.expression))
    }
  }

  export function TryStatementUnecmaify(
    node: ts.TryStatement
  ): TryCatchStatement | TryFinallyStatement {
    if (node.finallyBlock) {
      return {
        type: NodeType.TryFinallyStatement,
        body: BlockUnecmaify(node.tryBlock),
        catchClause: UnecmaifyOptional(node.catchClause, CatchClauseUnecmaify),
        finalizer: BlockUnecmaify(AssertDef(node.finallyBlock))
      }
    } else {
      return {
        type: NodeType.TryCatchStatement,
        body: BlockUnecmaify(node.tryBlock),
        catchClause: CatchClauseUnecmaify(AssertDef(node.catchClause))
      }
    }
  }

  export function VariableStatementUnecmaify(
    node: ts.VariableStatement
  ): VariableDeclaration {
    return {
      type: NodeType.VariableDeclaration,
      kind: VariableDeclarationKind.Var,
      declarators: VariableDeclarationListUnecmaify(node.declarationList)
    }
  }

  export function VariableDeclarationListUnecmaify(
    node: ts.VariableDeclarationList
  ): Array<VariableDeclarator> {
    return node.declarations.map(VariableDeclarationUnecmaify)
  }

  export function IdentifierToBindingIdentifierUnecmaify(
    node: ts.Identifier
  ): BindingIdentifier {
    return {
      type: NodeType.BindingIdentifier,
      name: node.text
    }
  }

  export function BindingPatternUnecmaify(
    node: ts.BindingPattern
  ): BindingPattern {
    switch (node.kind) {
      case ts.SyntaxKind.ObjectBindingPattern:
        return ObjectBindingPatternUnecmaify(node)
      case ts.SyntaxKind.ArrayBindingPattern:
        return ArrayBindingPatternUnecmaify(node)
    }
  }

  export function BindingNameUnecmaify(node: ts.BindingName): Binding {
    switch (node.kind) {
      case ts.SyntaxKind.Identifier:
        return IdentifierToBindingIdentifierUnecmaify(node)
      case ts.SyntaxKind.ObjectBindingPattern:
      case ts.SyntaxKind.ArrayBindingPattern:
        return BindingPatternUnecmaify(node)
    }
  }

  export function VariableDeclarationUnecmaify(
    node: ts.VariableDeclaration
  ): VariableDeclarator {
    return {
      type: NodeType.VariableDeclarator,
      binding: BindingNameUnecmaify(node.name),
      init: UnecmaifyOptional(node.initializer, ExpressionUnecmaify)
    }
  }

  export function WithStatementUnecmaify(
    node: ts.WithStatement
  ): WithStatement {
    return {
      type: NodeType.WithStatement,
      _object: ExpressionUnecmaify(node.expression),
      body: StatementUnecmaify(node.statement)
    }
  }
}

export = Unecmaify
