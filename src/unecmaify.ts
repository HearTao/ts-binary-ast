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
  Node
} from './types'

namespace Unecmaify {
  export function Unecmaify(node: ts.Node): Node {
    switch (node.kind) {
      case ts.SyntaxKind.Identifier:
      case ts.SyntaxKind.BindingElement:
      case ts.SyntaxKind.ElementAccessExpression:
      case ts.SyntaxKind.PropertyAccessExpression:
      case ts.SyntaxKind.ArrayBindingPattern:
      case ts.SyntaxKind.ObjectBindingPattern:
      case ts.SyntaxKind.BinaryExpression:
      case ts.SyntaxKind.ArrayLiteralExpression:
      case ts.SyntaxKind.ShorthandPropertyAssignment:
      case ts.SyntaxKind.PropertyAssignment:
      case ts.SyntaxKind.ObjectLiteralExpression:
      case ts.SyntaxKind.HeritageClause:
      case ts.SyntaxKind.ClassExpression:
      case ts.SyntaxKind.ClassDeclaration:
      case ts.SyntaxKind.NamedImports:
      case ts.SyntaxKind.ImportClause:
      case ts.SyntaxKind.ImportDeclaration:
      case ts.SyntaxKind.ImportSpecifier:
      case ts.SyntaxKind.ExportDeclaration:
      case ts.SyntaxKind.NamedExports:
      case ts.SyntaxKind.FunctionDeclaration:
      case ts.SyntaxKind.ExportSpecifier:
      case ts.SyntaxKind.MethodDeclaration:
      case ts.SyntaxKind.GetAccessor:
      case ts.SyntaxKind.SetAccessor:
      case ts.SyntaxKind.ComputedPropertyName:
      case ts.SyntaxKind.TrueKeyword:
      case ts.SyntaxKind.FalseKeyword:
      case ts.SyntaxKind.NumericLiteral:
      case ts.SyntaxKind.NullKeyword:
      case ts.SyntaxKind.RegularExpressionLiteral:
      case ts.SyntaxKind.StringLiteral:
      case ts.SyntaxKind.ArrowFunction:
      case ts.SyntaxKind.CallExpression:
      case ts.SyntaxKind.ConditionalExpression:
      case ts.SyntaxKind.FunctionExpression:
      case ts.SyntaxKind.NewExpression:
      case ts.SyntaxKind.MetaProperty:
      case ts.SyntaxKind.PrefixUnaryExpression:
      case ts.SyntaxKind.PostfixUnaryExpression:
      case ts.SyntaxKind.TemplateExpression:
      case ts.SyntaxKind.ThisKeyword:
      case ts.SyntaxKind.YieldExpression:
      case ts.SyntaxKind.AwaitExpression:
      case ts.SyntaxKind.BreakStatement:
      case ts.SyntaxKind.ContinueStatement:
      case ts.SyntaxKind.DebuggerStatement:
      case ts.SyntaxKind.DoStatement:
      case ts.SyntaxKind.EmptyStatement:
      case ts.SyntaxKind.ExpressionStatement:
      case ts.SyntaxKind.ForInStatement:
      case ts.SyntaxKind.ForOfStatement:
      case ts.SyntaxKind.ForStatement:
      case ts.SyntaxKind.IfStatement:
      case ts.SyntaxKind.LabeledStatement:
      case ts.SyntaxKind.ReturnStatement:
      case ts.SyntaxKind.CaseBlock:
      case ts.SyntaxKind.DefaultClause:
      case ts.SyntaxKind.SwitchStatement:
      case ts.SyntaxKind.ThrowStatement:
      case ts.SyntaxKind.TryStatement:
      case ts.SyntaxKind.WhileStatement:
      case ts.SyntaxKind.WithStatement:
      case ts.SyntaxKind.Block:
      case ts.SyntaxKind.CatchClause:
      case ts.SyntaxKind.Parameter:
      case ts.SyntaxKind.SourceFile:
      case ts.SyntaxKind.SpreadElement:
      case ts.SyntaxKind.SuperKeyword:
      case ts.SyntaxKind.CaseClause:
      case ts.SyntaxKind.DefaultClause:
      case ts.SyntaxKind.TemplateSpan:
      case ts.SyntaxKind.VariableDeclarationList:
      case ts.SyntaxKind.VariableStatement:
      case ts.SyntaxKind.VariableDeclaration:
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
      case ts.SyntaxKind.VariableDeclaration:
        return VariableStatementUnecmaify(stmt as ts.VariableStatement)
      case ts.SyntaxKind.WithStatement:
        return WithStatementUnecmaify(stmt as ts.WithStatement)
      default:
        throw new Error('Unexpected kind')
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
      case ts.SyntaxKind.PostfixUnaryExpression:
        return UnaryExpressionUnecmaify(node as
          | ts.PrefixUnaryExpression
          | ts.PostfixUnaryExpression)
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
      default:
        throw new Error('Unexpected expression')
    }
  }

  export function BooleanLiteralUnecmaify(
    node: ts.BooleanLiteral
  ): LiteralBooleanExpression {
    throw new Error('Not implemented')
  }

  export function NullLiteralUnecmaify(
    node: ts.NullLiteral
  ): LiteralNullExpression {
    throw new Error('Not implemented')
  }

  export function NumericLiteralUnecmaify(
    node: ts.NumericLiteral
  ): LiteralNullExpression {
    throw new Error('Not implemented')
  }

  export function RegularExpressionLiteralUnecmaify(
    node: ts.RegularExpressionLiteral
  ): LiteralRegExpExpression {
    throw new Error('Not implemented')
  }

  export function StringLiteralUnecmaify(
    node: ts.StringLiteral
  ): LiteralStringExpression {
    throw new Error('Not implemented')
  }

  export function ArrayLiteralExpressionUnecmaify(
    node: ts.ArrayLiteralExpression
  ): ArrayExpression {
    throw new Error('Not implemented')
  }

  export function ArrowFunctionUnecmaify(
    node: ts.ArrowFunction
  ): ArrowExpression {
    throw new Error('Not implemented')
  }

  export function BinaryExpressionUnecmaify(
    node: ts.BinaryExpression
  ): BinaryExpression {
    throw new Error('Not implemented')
  }

  export function CallExpressionUnecmaify(
    node: ts.CallExpression
  ): CallExpression {
    throw new Error('Not implemented')
  }

  export function ElementAccessExpressionUnecmaify(
    node: ts.ElementAccessExpression
  ): any {
    throw new Error('Not implemented')
  }

  export function ConditionalExpressionUnecmaify(
    node: ts.ConditionalExpression
  ): any {
    throw new Error('Not implemented')
  }

  export function ClassExpressionUnecmaify(node: ts.ClassExpression): any {
    throw new Error('Not implemented')
  }

  export function FunctionExpressionUnecmaify(
    node: ts.FunctionExpression
  ): any {
    throw new Error('Not implemented')
  }

  export function IdentifierUnecmaify(node: ts.Identifier): any {
    throw new Error('Not implemented')
  }

  export function NewExpressionUnecmaify(
    node: ts.NewExpression
  ): NewExpression {
    throw new Error('Not implemented')
  }

  export function MetaPropertyUnecmaify(
    node: ts.MetaProperty
  ): NewTargetExpression {
    throw new Error('Not implemented')
  }

  export function ObjectLiteralExpressionUnecmaify(
    node: ts.ObjectLiteralExpression
  ): any {
    throw new Error('Not implemented')
  }

  export function UnaryExpressionUnecmaify(
    node: ts.PrefixUnaryExpression | ts.PostfixUnaryExpression
  ): any {
    throw new Error('Not implemented')
  }

  export function PropertyAccessExpressionUnecmaify(
    node: ts.PropertyAccessExpression
  ): any {
    throw new Error('Not implemented')
  }

  export function TemplateExpressionUnecmaify(
    node: ts.TaggedTemplateExpression | ts.TemplateExpression
  ): TemplateExpression {
    throw new Error('Not implemented')
  }

  export function ThisExpressionUnecmaify(
    node: ts.ThisExpression
  ): ThisExpression {
    throw new Error('Not implemented')
  }

  export function YieldExpressionUnecmaify(
    node: ts.YieldExpression
  ): YieldExpression {
    throw new Error('Not implemented')
  }

  export function AwaitExpressionUnecmaify(
    node: ts.AwaitExpression
  ): AwaitExpression {
    throw new Error('Not implemented')
  }

  export function BlockUnecmaify(node: ts.Block): Block {
    throw new Error('Not implemented')
  }

  export function BreakStatementUnecmaify(
    node: ts.BreakStatement
  ): BreakStatement {
    throw new Error('Not implemented')
  }

  export function ContinueStatementUnecmaify(
    node: ts.ContinueStatement
  ): ContinueStatement {
    throw new Error('Not implemented')
  }

  export function ClassDeclarationUnecmaify(
    node: ts.ClassDeclaration
  ): ClassDeclaration {
    throw new Error('Not implemented')
  }

  export function DebuggerStatementUnecmaify(
    node: ts.DebuggerStatement
  ): DebuggerStatement {
    throw new Error('Not implemented')
  }

  export function EmptyStatementUnecmaify(
    node: ts.EmptyStatement
  ): EmptyStatement {
    throw new Error('Not implemented')
  }

  export function ExpressionStatementUnecmaify(
    node: ts.ExpressionStatement
  ): ExpressionStatement {
    throw new Error('Not implemented')
  }

  export function FunctionDeclarationUnecmaify(
    node: ts.FunctionDeclaration
  ): EagerFunctionDeclaration {
    throw new Error('Not implemented')
  }

  export function IfStatementUnecmaify(node: ts.IfStatement): IfStatement {
    throw new Error('Not implemented')
  }

  export function DoStatementUnecmaify(node: ts.DoStatement): DoWhileStatement {
    throw new Error('Not implemented')
  }

  export function ForInStatementUnecmaify(
    node: ts.ForInStatement
  ): ForInStatement {
    throw new Error('Not implemented')
  }

  export function ForOfStatementUnecmaify(
    node: ts.ForOfStatement
  ): ForOfStatement {
    throw new Error('Not implemented')
  }

  export function ForStatementUnecmaify(node: ts.ForStatement): ForStatement {
    throw new Error('Not implemented')
  }

  export function WhileStatementUnecmaify(
    node: ts.WhileStatement
  ): WhileStatement {
    throw new Error('Not implemented')
  }

  export function LabeledStatementUnecmaify(
    node: ts.LabeledStatement
  ): LabelledStatement {
    throw new Error('Not implemented')
  }

  export function ReturnStatementUnecmaify(
    node: ts.ReturnStatement
  ): ReturnStatement {
    throw new Error('Not implemented')
  }

  export function SwitchStatementUnecmaify(
    node: ts.SwitchStatement
  ): SwitchStatement {
    throw new Error('Not implemented')
  }

  export function ThrowStatementUnecmaify(
    node: ts.ThrowStatement
  ): ThrowStatement {
    throw new Error('Not implemented')
  }

  export function TryStatementUnecmaify(
    node: ts.TryStatement
  ): TryCatchStatement {
    throw new Error('Not implemented')
  }

  export function VariableStatementUnecmaify(
    node: ts.VariableStatement
  ): VariableDeclaration {
    throw new Error('Not implemented')
  }

  export function WithStatementUnecmaify(
    node: ts.WithStatement
  ): WithStatement {
    throw new Error('Not implemented')
  }
}

export = Unecmaify
