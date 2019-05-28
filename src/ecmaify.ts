import { Statement, Node, NodeType, FrozenArray, Expression, VariableDeclaration, VariableDeclarator, SpreadElement, Block, BreakStatement, ClassDeclaration, ContinueStatement, ExpressionStatement, EagerFunctionDeclaration, LazyFunctionDeclaration, DoWhileStatement, IfStatement, EmptyStatement, DebuggerStatement, ForOfStatement, ForStatement, WhileStatement, LabelledStatement, ReturnStatement, SwitchStatement, SwitchStatementWithDefault, TryCatchStatement, TryFinallyStatement, WithStatement, ForInStatement, ThrowStatement, AssertedBoundName, AssertedBlockScope, AssertedScriptGlobalScope, AssertedVarScope, AssertedParameterScope, AssertedBoundNamesScope, AssertedDeclaredName, AssertedPositionalParameterName, AssertedRestParameterName, AssertedParameterName, BindingIdentifier, BindingWithInitializer, AssignmentTargetIdentifier, ComputedMemberAssignmentTarget, StaticMemberAssignmentTarget, ArrayBinding, BindingPropertyIdentifier, BindingPropertyProperty, ObjectBinding, AssignmentTargetWithInitializer, ArrayAssignmentTarget, AssignmentTargetPropertyIdentifier, AssignmentTargetPropertyProperty, ObjectAssignmentTarget, Module, Import, ImportNamespace, ExportAllFrom, ExportFrom, ExportLocals, Export, ExportDefault, ExportFromSpecifier, ExportLocalSpecifier, EagerMethod, LazyMethod, EagerGetter, LazyGetter, GetterContents, EagerSetter, LazySetter, SetterContents, DataProperty, ShorthandProperty, LiteralPropertyName, LiteralBooleanExpression, LiteralInfinityExpression, LiteralNullExpression, LiteralNumericExpression, LiteralRegExpExpression, LiteralStringExpression, ArrayExpression, EagerArrowExpressionWithFunctionBody, LazyArrowExpressionWithFunctionBody, EagerArrowExpressionWithExpression, LazyArrowExpressionWithExpression, ArrowExpressionContentsWithFunctionBody, ArrowExpressionContentsWithExpression, CompoundAssignmentExpression, ComputedMemberExpression, EagerFunctionExpression, LazyFunctionExpression, FunctionExpressionContents, IdentifierExpression, NewTargetExpression, ObjectExpression, StaticMemberExpression, YieldStarExpression, ForInOfBinding, Directive, FormalParameters, FunctionOrMethodContents, Script, Super, SwitchCase, SwitchDefault, TemplateElement, ClassExpression, ClassElement, ImportSpecifier, ComputedPropertyName, AssignmentExpression, BinaryExpression, CallExpression, ConditionalExpression, NewExpression, UnaryExpression, TemplateExpression, ThisExpression, UpdateExpression, YieldExpression, AwaitExpression, CatchClause } from "./types";
import * as ts from 'typescript'

export namespace Ecmaify {
  export function Ecmaify(node: Node): ts.Node {
    switch (node.type) {
      case NodeType.AssertedBoundName:
        return AssertedBoundNameEcmaify(node as AssertedBoundName)
      case NodeType.AssertedBlockScope:
        return AssertedBlockScopeEcmaify(node as AssertedBlockScope)
      case NodeType.AssertedScriptGlobalScope:
        return AssertedScriptGlobalScopeEcmaify(node as AssertedScriptGlobalScope)
      case NodeType.AssertedVarScope:
        return AssertedVarScopeEcmaify(node as AssertedVarScope)
      case NodeType.AssertedParameterScope:
        return AssertedParameterScopeEcmaify(node as AssertedParameterScope)
      case NodeType.AssertedBoundNamesScope:
        return AssertedBoundNamesScopeEcmaify(node as AssertedBoundNamesScope)
      case NodeType.AssertedDeclaredName:
        return AssertedDeclaredNameEcmaify(node as AssertedDeclaredName)
      case NodeType.AssertedPositionalParameterName:
        return AssertedPositionalParameterNameEcmaify(node as AssertedPositionalParameterName)
      case NodeType.AssertedRestParameterName:
        return AssertedRestParameterNameEcmaify(node as AssertedRestParameterName)
      case NodeType.AssertedParameterName:
        return AssertedParameterNameEcmaify(node as AssertedParameterName)
      case NodeType.BindingIdentifier:
        return BindingIdentifierEcmaify(node as BindingIdentifier)
      case NodeType.BindingWithInitializer:
        return BindingWithInitializerEcmaify(node as BindingWithInitializer)
      case NodeType.AssignmentTargetIdentifier:
        return AssignmentTargetIdentifierEcmaify(node as AssignmentTargetIdentifier)
      case NodeType.ComputedMemberAssignmentTarget:
        return ComputedMemberAssignmentTargetEcmaify(node as ComputedMemberAssignmentTarget)
      case NodeType.StaticMemberAssignmentTarget:
        return StaticMemberAssignmentTargetEcmaify(node as StaticMemberAssignmentTarget)
      case NodeType.ArrayBinding:
        return ArrayBindingEcmaify(node as ArrayBinding)
      case NodeType.BindingPropertyIdentifier:
        return BindingPropertyIdentifierEcmaify(node as BindingPropertyIdentifier)
      case NodeType.BindingPropertyProperty:
        return BindingPropertyPropertyEcmaify(node as BindingPropertyProperty)
      case NodeType.ObjectBinding:
        return ObjectBindingEcmaify(node as ObjectBinding)
      case NodeType.AssignmentTargetWithInitializer:
        return AssignmentTargetWithInitializerEcmaify(node as AssignmentTargetWithInitializer)
      case NodeType.ArrayAssignmentTarget:
        return ArrayAssignmentTargetEcmaify(node as ArrayAssignmentTarget)
      case NodeType.AssignmentTargetPropertyIdentifier:
        return AssignmentTargetPropertyIdentifierEcmaify(node as AssignmentTargetPropertyIdentifier)
      case NodeType.AssignmentTargetPropertyProperty:
        return AssignmentTargetPropertyPropertyEcmaify(node as AssignmentTargetPropertyProperty)
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
        return LiteralInfinityExpressionEcmaify(node as LiteralInfinityExpression)
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
        return EagerArrowExpressionWithFunctionBodyEcmaify(node as EagerArrowExpressionWithFunctionBody)
      case NodeType.LazyArrowExpressionWithFunctionBody:
        return LazyArrowExpressionWithFunctionBodyEcmaify(node as LazyArrowExpressionWithFunctionBody)
      case NodeType.EagerArrowExpressionWithExpression:
        return EagerArrowExpressionWithExpressionEcmaify(node as EagerArrowExpressionWithExpression)
      case NodeType.LazyArrowExpressionWithExpression:
        return LazyArrowExpressionWithExpressionEcmaify(node as LazyArrowExpressionWithExpression)
      case NodeType.ArrowExpressionContentsWithFunctionBody:
        return ArrowExpressionContentsWithFunctionBodyEcmaify(node as ArrowExpressionContentsWithFunctionBody)
      case NodeType.ArrowExpressionContentsWithExpression:
        return ArrowExpressionContentsWithExpressionEcmaify(node as ArrowExpressionContentsWithExpression)
      case NodeType.AssignmentExpression:
        return AssignmentExpressionEcmaify(node as AssignmentExpression)
      case NodeType.BinaryExpression:
        return BinaryExpressionEcmaify(node as BinaryExpression)
      case NodeType.CallExpression:
        return CallExpressionEcmaify(node as CallExpression)
      case NodeType.CompoundAssignmentExpression:
        return CompoundAssignmentExpressionEcmaify(node as CompoundAssignmentExpression)
      case NodeType.ComputedMemberExpression:
        return ComputedMemberExpressionEcmaify(node as ComputedMemberExpression)
      case NodeType.ConditionalExpression:
        return ConditionalExpressionEcmaify(node as ConditionalExpression)
      case NodeType.EagerFunctionExpression:
        return EagerFunctionExpressionEcmaify(node as EagerFunctionExpression)
      case NodeType.LazyFunctionExpression:
        return LazyFunctionExpressionEcmaify(node as LazyFunctionExpression)
      case NodeType.FunctionExpressionContents:
        return FunctionExpressionContentsEcmaify(node as FunctionExpressionContents)
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
        return SwitchStatementWithDefaultEcmaify(node as SwitchStatementWithDefault)
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

  export function ExpressionEcmaify(e: Expression): ts.Expression {
    throw new Error("Not Implemented")
  }

  export function AssertedBoundNameEcmaify(node: AssertedBoundName): any {
    throw new Error("Not Implemented")
  }
  export function AssertedBlockScopeEcmaify(node: AssertedBlockScope): any {
    throw new Error("Not Implemented")
  }
  export function AssertedScriptGlobalScopeEcmaify(node: AssertedScriptGlobalScope): any {
    throw new Error("Not Implemented")
  }
  export function AssertedVarScopeEcmaify(node: AssertedVarScope): any {
    throw new Error("Not Implemented")
  }
  export function AssertedParameterScopeEcmaify(node: AssertedParameterScope): any {
    throw new Error("Not Implemented")
  }
  export function AssertedBoundNamesScopeEcmaify(node: AssertedBoundNamesScope): any {
    throw new Error("Not Implemented")
  }
  export function AssertedDeclaredNameEcmaify(node: AssertedDeclaredName): any {
    throw new Error("Not Implemented")
  }
  export function AssertedPositionalParameterNameEcmaify(node: AssertedPositionalParameterName): any {
    throw new Error("Not Implemented")
  }
  export function AssertedRestParameterNameEcmaify(node: AssertedRestParameterName): any {
    throw new Error("Not Implemented")
  }
  export function AssertedParameterNameEcmaify(node: AssertedParameterName): any {
    throw new Error("Not Implemented")
  }
  export function BindingIdentifierEcmaify(node: BindingIdentifier): any {
    throw new Error("Not Implemented")
  }
  export function BindingWithInitializerEcmaify(node: BindingWithInitializer): any {
    throw new Error("Not Implemented")
  }
  export function AssignmentTargetIdentifierEcmaify(node: AssignmentTargetIdentifier): any {
    throw new Error("Not Implemented")
  }
  export function ComputedMemberAssignmentTargetEcmaify(node: ComputedMemberAssignmentTarget): any {
    throw new Error("Not Implemented")
  }
  export function StaticMemberAssignmentTargetEcmaify(node: StaticMemberAssignmentTarget): any {
    throw new Error("Not Implemented")
  }
  export function ArrayBindingEcmaify(node: ArrayBinding): ts.ArrayBindingPattern {
    throw new Error("Not Implemented")
  }
  export function BindingPropertyIdentifierEcmaify(node: BindingPropertyIdentifier): any {
    throw new Error("Not Implemented")
  }
  export function BindingPropertyPropertyEcmaify(node: BindingPropertyProperty): any {
    throw new Error("Not Implemented")
  }
  export function ObjectBindingEcmaify(node: ObjectBinding): ts.ObjectBindingPattern {
    throw new Error("Not Implemented")
  }
  export function AssignmentTargetWithInitializerEcmaify(node: AssignmentTargetWithInitializer): any {
    throw new Error("Not Implemented")
  }
  export function ArrayAssignmentTargetEcmaify(node: ArrayAssignmentTarget): any {
    throw new Error("Not Implemented")
  }
  export function AssignmentTargetPropertyIdentifierEcmaify(node: AssignmentTargetPropertyIdentifier): any {
    throw new Error("Not Implemented")
  }
  export function AssignmentTargetPropertyPropertyEcmaify(node: AssignmentTargetPropertyProperty): any {
    throw new Error("Not Implemented")
  }
  export function ObjectAssignmentTargetEcmaify(node: ObjectAssignmentTarget): any {
    throw new Error("Not Implemented")
  }
  export function ClassExpressionEcmaify(node: ClassExpression): ts.ClassExpression {
    throw new Error("Not Implemented")
  }
  export function ClassDeclarationEcmaify(node: ClassDeclaration): ts.ClassDeclaration {
    throw new Error("Not Implemented")
  }
  export function ClassElementEcmaify(node: ClassElement): ts.ClassElement {
    throw new Error("Not Implemented")
  }
  export function ModuleEcmaify(node: Module): any {
    throw new Error("Not Implemented")
  }
  export function ImportEcmaify(node: Import): any {
    throw new Error("Not Implemented")
  }
  export function ImportNamespaceEcmaify(node: ImportNamespace): any {
    throw new Error("Not Implemented")
  }
  export function ImportSpecifierEcmaify(node: ImportSpecifier): ts.ImportSpecifier {
    throw new Error("Not Implemented")
  }
  export function ExportAllFromEcmaify(node: ExportAllFrom): any {
    throw new Error("Not Implemented")
  }
  export function ExportFromEcmaify(node: ExportFrom): any {
    throw new Error("Not Implemented")
  }
  export function ExportLocalsEcmaify(node: ExportLocals): any {
    throw new Error("Not Implemented")
  }
  export function ExportEcmaify(node: Export): any {
    throw new Error("Not Implemented")
  }
  export function ExportDefaultEcmaify(node: ExportDefault): any {
    throw new Error("Not Implemented")
  }
  export function ExportFromSpecifierEcmaify(node: ExportFromSpecifier): any {
    throw new Error("Not Implemented")
  }
  export function ExportLocalSpecifierEcmaify(node: ExportLocalSpecifier): any {
    throw new Error("Not Implemented")
  }
  export function EagerMethodEcmaify(node: EagerMethod): ts.MethodDeclaration {
    throw new Error("Not Implemented")
  }
  export function LazyMethodEcmaify(node: LazyMethod): ts.MethodDeclaration {
    throw new Error("Not Implemented")
  }
  export function EagerGetterEcmaify(node: EagerGetter): ts.GetAccessorDeclaration {
    throw new Error("Not Implemented")
  }
  export function LazyGetterEcmaify(node: LazyGetter): ts.GetAccessorDeclaration {
    throw new Error("Not Implemented")
  }
  export function GetterContentsEcmaify(node: GetterContents): any {
    throw new Error("Not Implemented")
  }
  export function EagerSetterEcmaify(node: EagerSetter): ts.SetAccessorDeclaration {
    throw new Error("Not Implemented")
  }
  export function LazySetterEcmaify(node: LazySetter): ts.SetAccessorDeclaration {
    throw new Error("Not Implemented")
  }
  export function SetterContentsEcmaify(node: SetterContents): any {
    throw new Error("Not Implemented")
  }
  export function DataPropertyEcmaify(node: DataProperty): any {
    throw new Error("Not Implemented")
  }
  export function ShorthandPropertyEcmaify(node: ShorthandProperty): ts.ShorthandPropertyAssignment {
    throw new Error("Not Implemented")
  }
  export function ComputedPropertyNameEcmaify(node: ComputedPropertyName): ts.ComputedPropertyName {
    throw new Error("Not Implemented")
  }
  export function LiteralPropertyNameEcmaify(node: LiteralPropertyName): any {
    throw new Error("Not Implemented")
  }
  export function LiteralBooleanExpressionEcmaify(node: LiteralBooleanExpression): ts.BooleanLiteral {
    throw new Error("Not Implemented")
  }
  export function LiteralInfinityExpressionEcmaify(node: LiteralInfinityExpression): any {
    throw new Error("Not Implemented")
  }
  export function LiteralNullExpressionEcmaify(node: LiteralNullExpression): ts.NullLiteral {
    throw new Error("Not Implemented")
  }
  export function LiteralNumericExpressionEcmaify(node: LiteralNumericExpression): ts.NumericLiteral {
    throw new Error("Not Implemented")
  }
  export function LiteralRegExpExpressionEcmaify(node: LiteralRegExpExpression): ts.RegularExpressionLiteral {
    throw new Error("Not Implemented")
  }
  export function LiteralStringExpressionEcmaify(node: LiteralStringExpression): ts.StringLiteral {
    throw new Error("Not Implemented")
  }
  export function ArrayExpressionEcmaify(node: ArrayExpression): ts.ArrayLiteralExpression {
    throw new Error("Not Implemented")
  }
  export function EagerArrowExpressionWithFunctionBodyEcmaify(node: EagerArrowExpressionWithFunctionBody): ts.ArrowFunction {
    throw new Error("Not Implemented")
  }
  export function LazyArrowExpressionWithFunctionBodyEcmaify(node: LazyArrowExpressionWithFunctionBody): ts.ArrowFunction {
    throw new Error("Not Implemented")
  }
  export function EagerArrowExpressionWithExpressionEcmaify(node: EagerArrowExpressionWithExpression): ts.ArrowFunction {
    throw new Error("Not Implemented")
  }
  export function LazyArrowExpressionWithExpressionEcmaify(node: LazyArrowExpressionWithExpression): ts.ArrowFunction {
    throw new Error("Not Implemented")
  }
  export function ArrowExpressionContentsWithFunctionBodyEcmaify(node: ArrowExpressionContentsWithFunctionBody): any {
    throw new Error("Not Implemented")
  }
  export function ArrowExpressionContentsWithExpressionEcmaify(node: ArrowExpressionContentsWithExpression): any {
    throw new Error("Not Implemented")
  }
  export function AssignmentExpressionEcmaify(node: AssignmentExpression): ts.AssignmentExpression<ts.AssignmentOperatorToken> {
    throw new Error("Not Implemented")
  }
  export function BinaryExpressionEcmaify(node: BinaryExpression): ts.BinaryExpression {
    throw new Error("Not Implemented")
  }
  export function CallExpressionEcmaify(node: CallExpression): ts.CallExpression {
    throw new Error("Not Implemented")
  }
  export function CompoundAssignmentExpressionEcmaify(node: CompoundAssignmentExpression): any {
    throw new Error("Not Implemented")
  }
  export function ComputedMemberExpressionEcmaify(node: ComputedMemberExpression): any {
    throw new Error("Not Implemented")
  }
  export function ConditionalExpressionEcmaify(node: ConditionalExpression): ts.ConditionalExpression {
    throw new Error("Not Implemented")
  }
  export function EagerFunctionExpressionEcmaify(node: EagerFunctionExpression): ts.FunctionExpression {
    throw new Error("Not Implemented")
  }
  export function LazyFunctionExpressionEcmaify(node: LazyFunctionExpression): ts.FunctionExpression {
    throw new Error("Not Implemented")
  }
  export function FunctionExpressionContentsEcmaify(node: FunctionExpressionContents): any {
    throw new Error("Not Implemented")
  }
  export function IdentifierExpressionEcmaify(node: IdentifierExpression): ts.Identifier {
    throw new Error("Not Implemented")
  }
  export function NewExpressionEcmaify(node: NewExpression): ts.NewExpression {
    throw new Error("Not Implemented")
  }
  export function NewTargetExpressionEcmaify(node: NewTargetExpression): any {
    throw new Error("Not Implemented")
  }
  export function ObjectExpressionEcmaify(node: ObjectExpression): ts.ObjectLiteralExpression {
    throw new Error("Not Implemented")
  }
  export function UnaryExpressionEcmaify(node: UnaryExpression): ts.UnaryExpression {
    throw new Error("Not Implemented")
  }
  export function StaticMemberExpressionEcmaify(node: StaticMemberExpression): any {
    throw new Error("Not Implemented")
  }
  export function TemplateExpressionEcmaify(node: TemplateExpression): ts.TemplateExpression {
    throw new Error("Not Implemented")
  }
  export function ThisExpressionEcmaify(node: ThisExpression): ts.ThisExpression {
    throw new Error("Not Implemented")
  }
  export function UpdateExpressionEcmaify(node: UpdateExpression): ts.UpdateExpression {
    throw new Error("Not Implemented")
  }
  export function YieldExpressionEcmaify(node: YieldExpression): ts.YieldExpression {
    throw new Error("Not Implemented")
  }
  export function YieldStarExpressionEcmaify(node: YieldStarExpression): ts.YieldExpression {
    throw new Error("Not Implemented")
  }
  export function AwaitExpressionEcmaify(node: AwaitExpression): ts.AwaitExpression {
    throw new Error("Not Implemented")
  }
  export function BreakStatementEcmaify(node: BreakStatement): ts.BreakStatement {
    throw new Error("Not Implemented")
  }
  export function ContinueStatementEcmaify(node: ContinueStatement): ts.ContinueStatement {
    throw new Error("Not Implemented")
  }
  export function DebuggerStatementEcmaify(node: DebuggerStatement): ts.DebuggerStatement {
    throw new Error("Not Implemented")
  }
  export function DoWhileStatementEcmaify(node: DoWhileStatement): ts.DoStatement {
    throw new Error("Not Implemented")
  }
  export function EmptyStatementEcmaify(node: EmptyStatement): ts.EmptyStatement {
    throw new Error("Not Implemented")
  }
  export function ExpressionStatementEcmaify(node: ExpressionStatement): ts.ExpressionStatement {
    throw new Error("Not Implemented")
  }
  export function ForInOfBindingEcmaify(node: ForInOfBinding): any {
    throw new Error("Not Implemented")
  }
  export function ForInStatementEcmaify(node: ForInStatement): ts.ForInStatement {
    throw new Error("Not Implemented")
  }
  export function ForOfStatementEcmaify(node: ForOfStatement): ts.ForOfStatement {
    throw new Error("Not Implemented")
  }
  export function ForStatementEcmaify(node: ForStatement): ts.ForStatement {
    throw new Error("Not Implemented")
  }
  export function IfStatementEcmaify(node: IfStatement): ts.IfStatement {
    throw new Error("Not Implemented")
  }
  export function LabelledStatementEcmaify(node: LabelledStatement): ts.LabeledStatement {
    throw new Error("Not Implemented")
  }
  export function ReturnStatementEcmaify(node: ReturnStatement): ts.ReturnStatement {
    throw new Error("Not Implemented")
  }
  export function SwitchStatementEcmaify(node: SwitchStatement): ts.SwitchStatement {
    throw new Error("Not Implemented")
  }
  export function SwitchStatementWithDefaultEcmaify(node: SwitchStatementWithDefault): ts.SwitchStatement {
    throw new Error("Not Implemented")
  }
  export function ThrowStatementEcmaify(node: ThrowStatement): ts.ThrowStatement {
    throw new Error("Not Implemented")
  }
  export function TryCatchStatementEcmaify(node: TryCatchStatement): ts.TryStatement {
    throw new Error("Not Implemented")
  }
  export function TryFinallyStatementEcmaify(node: TryFinallyStatement): ts.TryStatement {
    throw new Error("Not Implemented")
  }
  export function WhileStatementEcmaify(node: WhileStatement): ts.WhileStatement {
    throw new Error("Not Implemented")
  }
  export function WithStatementEcmaify(node: WithStatement): ts.WithStatement {
    throw new Error("Not Implemented")
  }
  export function BlockEcmaify(node: Block): ts.Block {
    throw new Error("Not Implemented")
  }
  export function CatchClauseEcmaify(node: CatchClause): ts.CatchClause {
    throw new Error("Not Implemented")
  }
  export function DirectiveEcmaify(node: Directive): ts.StringLiteral {
    throw new Error("Not Implemented")
  }
  export function FormalParametersEcmaify(node: FormalParameters): any {
    throw new Error("Not Implemented")
  }
  export function EagerFunctionDeclarationEcmaify(node: EagerFunctionDeclaration): ts.FunctionDeclaration {
    throw new Error("Not Implemented")
  }
  export function LazyFunctionDeclarationEcmaify(node: LazyFunctionDeclaration): ts.FunctionDeclaration {
    throw new Error("Not Implemented")
  }
  export function FunctionOrMethodContentsEcmaify(node: FunctionOrMethodContents): any {
    throw new Error("Not Implemented")
  }
  export function ScriptEcmaify(node: Script): any {
    throw new Error("Not Implemented")
  }
  export function SpreadElementEcmaify(node: SpreadElement): ts.SpreadElement {
    throw new Error("Not Implemented")
  }
  export function SuperEcmaify(node: Super): any {
    throw new Error("Not Implemented")
  }
  export function SwitchCaseEcmaify(node: SwitchCase): ts.CaseClause {
    throw new Error("Not Implemented")
  }
  export function SwitchDefaultEcmaify(node: SwitchDefault): ts.DefaultClause {
    throw new Error("Not Implemented")
  }
  export function TemplateElementEcmaify(node: TemplateElement): ts.TemplateSpan {
    throw new Error("Not Implemented")
  }
  export function VariableDeclarationEcmaify(node: VariableDeclaration): ts.VariableStatement {
    throw new Error("Not Implemented")
  }
  export function VariableDeclaratorEcmaify(node: VariableDeclarator): ts.VariableDeclaration {
    throw new Error("Not Implemented")
  }
}