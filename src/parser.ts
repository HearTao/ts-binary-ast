import MultipartReader from './io/reader'
import { Context } from './io/context'
import {
  Program,
  NodeType,
  Script,
  FrozenArray,
  Directive,
  Statement,
  AssertedScriptGlobalScope,
  AssertedDeclaredName,
  AssertedDeclaredKind,
  Variant,
  Block,
  AssertedBlockScope,
  BreakStatement,
  ContinueStatement,
  ClassDeclaration,
  BindingIdentifier,
  ClassElement,
  Expression,
  MethodDefinition,
  DebuggerStatement,
  EmptyStatement,
  ExpressionStatement,
  EagerFunctionDeclaration,
  LazyFunctionDeclaration,
  IfStatement,
  DoWhileStatement,
  VariableDeclaration,
  VariableDeclarator,
  VariableDeclarationKind,
  Binding,
  ForInStatement,
  ForInOfBinding,
  AssignmentTarget,
  ForOfStatement,
  ForStatement,
  WhileStatement,
  LabelledStatement,
  ReturnStatement,
  SwitchStatement,
  SwitchCase,
  SwitchDefault,
  SwitchStatementWithDefault,
  ThrowStatement,
  TryCatchStatement,
  CatchClause,
  AssertedBoundNamesScope,
  AssertedBoundName,
  TryFinallyStatement,
  WithStatement,
  BindingPattern,
  ObjectBinding,
  ArrayBinding,
  BindingProperty,
  BindingPropertyIdentifier,
  BindingPropertyProperty,
  BindingWithInitializer,
  ComputedPropertyName,
  LiteralPropertyName,
  PropertyName,
  AssignmentTargetPattern,
  SimpleAssignmentTarget,
  AssignmentTargetProperty,
  ObjectAssignmentTarget,
  AssignmentTargetPropertyIdentifier,
  AssignmentTargetPropertyProperty,
  AssignmentTargetIdentifier,
  AssignmentTargetWithInitializer,
  ArrayAssignmentTarget,
  StaticMemberAssignmentTarget,
  ComputedMemberAssignmentTarget,
  Super,
  Getter,
  Setter,
  Method,
  EagerMethod,
  LazyMethod,
  EagerGetter,
  LazyGetter,
  GetterContents,
  AssertedVarScope,
  FunctionBody,
  EagerSetter,
  LazySetter,
  SetterContents,
  AssertedParameterScope,
  AssertedMaybePositionalParameterName,
  Parameter,
  FunctionOrMethodContents,
  FormalParameters,
  AssertedPositionalParameterName,
  AssertedRestParameterName,
  AssertedParameterName,
  LiteralBooleanExpression,
  LiteralInfinityExpression,
  LiteralNullExpression,
  LiteralNumericExpression,
  LiteralStringExpression,
  LiteralRegExpExpression,
  ArrayExpression,
  EagerArrowExpressionWithFunctionBody,
  LazyArrowExpressionWithFunctionBody,
  EagerArrowExpressionWithExpression,
  LazyArrowExpressionWithExpression,
  AssignmentExpression,
  BinaryExpression,
  CallExpression,
  CompoundAssignmentExpression,
  ComputedMemberExpression,
  ConditionalExpression,
  ClassExpression,
  EagerFunctionExpression,
  LazyFunctionExpression,
  IdentifierExpression,
  NewExpression,
  NewTargetExpression,
  ObjectExpression,
  UnaryExpression,
  StaticMemberExpression,
  TemplateExpression,
  ThisExpression,
  UpdateExpression,
  YieldExpression,
  YieldStarExpression,
  AwaitExpression,
  UpdateOperator,
  TemplateElement,
  UnaryOperator,
  ObjectProperty,
  ShorthandProperty,
  DataProperty,
  Arguments,
  SpreadElement,
  CompoundAssignmentOperator,
  BinaryOperator,
  ArrowExpressionContentsWithExpression,
  ArrowExpressionContentsWithFunctionBody
} from './types'

export default class Parser {
  context: Context
  reader: MultipartReader

  constructor(buffer: ArrayBuffer) {
    this.context = {
      grammarTable: [],
      stringsTable: [],
      variantTable: new Map()
    }
    this.reader = new MultipartReader(this.context, buffer)
  }

  parseHeader() {
    return this.reader.readHeader()
  }

  parseVarnum() {
    return this.reader.readVarnum()
  }

  parseBoolean() {
    return this.reader.readBoolean()
  }

  parseIdentifierName() {
    return this.reader.readIdentifierName()
  }

  parseVariant() {
    return this.reader.readVariant()
  }

  parseAtom() {
    return this.reader.readAtom()
  }

  parseMaybeAtom() {
    return this.reader.readMaybeAtom()
  }

  parseDouble() {
    return this.reader.readDouble()
  }

  enterTaggedTuple() {
    return this.reader.enterTaggedTuple()
  }

  lookAhead<T>(cb: () => T): T {
    return this.reader.lookAhead(cb)
  }

  parse() {
    this.parseHeader()
    return this.parseProgram()
  }

  parseList<T>(cb: () => T): FrozenArray<T> {
    const result: T[] = []
    const length = this.parseVarnum()
    for (let i = 0; i < length; ++i) {
      result.push(cb())
    }
    return result
  }

  parseOptional<T>(cb: () => T): T | undefined {
    if (this.peekTaggedTuple() === NodeType.Null) {
      this.reader.enterTaggedTuple()
      return undefined
    }
    return cb()
  }

  peekTaggedTuple(): NodeType {
    return this.lookAhead(() => this.enterTaggedTuple())
  }

  parseType<T extends NodeType>(expectedType: T): T {
    const type = this.enterTaggedTuple()
    if (type !== expectedType) {
      throw new Error('Invalid Kind: ' + expectedType)
    }
    return expectedType
  }

  parseProgram(): Program {
    const type = this.peekTaggedTuple()
    switch (type) {
      case NodeType.Script:
        return this.parseScript()
      case NodeType.Module:
      default:
        throw new Error('Invalid Kind: ' + type)
    }
  }

  parseScript(): Script {
    const type = this.parseType(NodeType.Script)

    const scope = this.parseAssertedScriptGlobalScope()
    const directives = this.parseDirectiveList()
    const statements = this.parseStatementList()

    return {
      type,
      scope,
      directives,
      statements
    }
  }

  parseAssertedScriptGlobalScope(): AssertedScriptGlobalScope {
    const type = this.parseType(NodeType.AssertedScriptGlobalScope)

    const declaredNames = this.parseAssertedDeclaredNameList()
    const hasDirectEval = this.parseBoolean()
    return {
      type,
      declaredNames,
      hasDirectEval
    }
  }

  parseAssertedDeclaredNameList() {
    return this.parseList(() => this.parseAssertedDeclaredName())
  }

  parseAssertedDeclaredName(): AssertedDeclaredName {
    const type = this.parseType(NodeType.AssertedDeclaredName)

    const name = this.parseIdentifierName()
    const kind = this.parseAssertedDeclaredKind()
    if (
      kind === AssertedDeclaredKind.ConstLexical ||
      kind === AssertedDeclaredKind.NonConstLexical
    ) {
      throw new Error('Let Or Const is not supported')
    }

    const isCaptured = this.parseBoolean()
    return {
      type,
      name,
      kind,
      isCaptured
    }
  }

  parseAssertedDeclaredKind(): AssertedDeclaredKind {
    const variant = this.parseVariant()
    switch (variant) {
      case Variant.AssertedDeclaredKindOrVariableDeclarationKindVar:
        return AssertedDeclaredKind.Var
      case Variant.ConstLexical:
        return AssertedDeclaredKind.ConstLexical
      case Variant.NonConstLexical:
        return AssertedDeclaredKind.NonConstLexical
      default:
        throw new Error('Invalid AssertedDeclaredKind Variant: ' + variant)
    }
  }

  parseDirectiveList() {
    return this.parseList(() => this.parseDirective())
  }

  parseDirective(): Directive {
    const type = this.parseType(NodeType.Directive)

    const rawValue = this.parseAtom()
    return {
      type,
      rawValue
    }
  }

  parseStatementList() {
    return this.parseList(() => this.parseStatement())
  }

  parseStatement(): Statement {
    const type = this.peekTaggedTuple()
    switch (type) {
      case NodeType.Block:
        return this.parseBlock()
      case NodeType.BreakStatement:
        return this.parseBreakStatement()
      case NodeType.ContinueStatement:
        return this.parseContinueStatement()
      case NodeType.ClassDeclaration:
        return this.parseClassDeclaration()
      case NodeType.DebuggerStatement:
        return this.parseDebuggerStatement()
      case NodeType.EmptyStatement:
        return this.parseEmptyStatement()
      case NodeType.ExpressionStatement:
        return this.parseExpressionStatement()
      case NodeType.EagerFunctionDeclaration:
        return this.parseEagerFunctionDeclaration()
      case NodeType.LazyFunctionDeclaration:
        return this.parseLazyFunctionDeclaration()
      case NodeType.IfStatement:
        return this.parseIfStatement()
      case NodeType.DoWhileStatement:
        return this.parseDoWhileStatement()
      case NodeType.ForInStatement:
        return this.parseForInStatement()
      case NodeType.ForOfStatement:
        return this.parseForOfStatement()
      case NodeType.ForStatement:
        return this.parseForStatement()
      case NodeType.WhileStatement:
        return this.parseWhileStatement()
      case NodeType.LabelledStatement:
        return this.parseLabelledStatement()
      case NodeType.ReturnStatement:
        return this.parseReturnStatement()
      case NodeType.SwitchStatement:
        return this.parseSwitchStatement()
      case NodeType.SwitchStatementWithDefault:
        return this.parseSwitchStatementWithDefault()
      case NodeType.ThrowStatement:
        return this.parseThrowStatement()
      case NodeType.TryCatchStatement:
        return this.parseTryCatchStatement()
      case NodeType.TryFinallyStatement:
        return this.parseTryFinallyStatement()
      case NodeType.VariableDeclaration:
        return this.parseVariableDeclaration()
      case NodeType.WithStatement:
        return this.parseWithStatement()
      default:
        throw new Error('Unexpected Statement' + type)
    }
  }

  parseExpression(): Expression {
    const type = this.peekTaggedTuple()
    switch (type) {
      case NodeType.LiteralBooleanExpression:
        return this.parseLiteralBooleanExpression()
      case NodeType.LiteralInfinityExpression:
        return this.parseLiteralInfinityExpression()
      case NodeType.LiteralNullExpression:
        return this.parseLiteralNullExpression()
      case NodeType.LiteralNumericExpression:
        return this.parseLiteralNumericExpression()
      case NodeType.LiteralStringExpression:
        return this.parseLiteralStringExpression()
      case NodeType.LiteralRegExpExpression:
        return this.parseLiteralRegExpExpression()
      case NodeType.ArrayExpression:
        return this.parseArrayExpression()
      case NodeType.EagerArrowExpressionWithFunctionBody:
        return this.parseEagerArrowExpressionWithFunctionBody()
      case NodeType.LazyArrowExpressionWithFunctionBody:
        return this.parseLazyArrowExpressionWithFunctionBody()
      case NodeType.EagerArrowExpressionWithExpression:
        return this.parseEagerArrowExpressionWithExpression()
      case NodeType.LazyArrowExpressionWithExpression:
        return this.parseLazyArrowExpressionWithExpression()
      case NodeType.AssignmentExpression:
        return this.parseAssignmentExpression()
      case NodeType.BinaryExpression:
        return this.parseBinaryExpression()
      case NodeType.CallExpression:
        return this.parseCallExpression()
      case NodeType.CompoundAssignmentExpression:
        return this.parseCompoundAssignmentExpression()
      case NodeType.ComputedMemberExpression:
        return this.parseComputedMemberExpression()
      case NodeType.ConditionalExpression:
        return this.parseConditionalExpression()
      case NodeType.ClassExpression:
        return this.parseClassExpression()
      case NodeType.EagerFunctionExpression:
        return this.parseEagerFunctionExpression()
      case NodeType.LazyFunctionExpression:
        return this.parseLazyFunctionExpression()
      case NodeType.IdentifierExpression:
        return this.parseIdentifierExpression()
      case NodeType.NewExpression:
        return this.parseNewExpression()
      case NodeType.NewTargetExpression:
        return this.parseNewTargetExpression()
      case NodeType.ObjectExpression:
        return this.parseObjectExpression()
      case NodeType.UnaryExpression:
        return this.parseUnaryExpression()
      case NodeType.StaticMemberExpression:
        return this.parseStaticMemberExpression()
      case NodeType.TemplateExpression:
        return this.parseTemplateExpression()
      case NodeType.ThisExpression:
        return this.parseThisExpression()
      case NodeType.UpdateExpression:
        return this.parseUpdateExpression()
      case NodeType.YieldExpression:
        return this.parseYieldExpression()
      case NodeType.YieldStarExpression:
        return this.parseYieldStarExpression()
      case NodeType.AwaitExpression:
        return this.parseAwaitExpression()
      default:
        throw new Error('Unexpected Expression: ' + type)
    }
  }

  parseLiteralBooleanExpression(): LiteralBooleanExpression {
    const type = this.parseType(NodeType.LiteralBooleanExpression)

    const value = this.parseBoolean()
    return {
      type,
      value
    }
  }

  parseLiteralInfinityExpression(): LiteralInfinityExpression {
    throw new Error('Method not implemented.')
  }

  parseLiteralNullExpression(): LiteralNullExpression {
    const type = this.parseType(NodeType.LiteralNullExpression)

    return {
      type
    }
  }

  parseLiteralNumericExpression(): LiteralNumericExpression {
    const type = this.parseType(NodeType.LiteralNumericExpression)

    const value = this.parseDouble()
    return {
      type,
      value
    }
  }

  parseLiteralStringExpression(): LiteralStringExpression {
    const type = this.parseType(NodeType.LiteralStringExpression)

    const value = this.parseAtom()
    return {
      type,
      value
    }
  }

  parseLiteralRegExpExpression(): LiteralRegExpExpression {
    const type = this.parseType(NodeType.LiteralRegExpExpression)

    const pattern = this.parseAtom()
    const flags = this.parseAtom()
    return {
      type,
      pattern,
      flags
    }
  }

  parseArrayExpression(): ArrayExpression {
    const type = this.parseType(NodeType.ArrayExpression)

    const elements = this.parseSpreadOrExpressionList()
    return {
      type,
      elements
    }
  }

  parseEagerArrowExpressionWithFunctionBody(): EagerArrowExpressionWithFunctionBody {
    const type = this.parseType(NodeType.EagerArrowExpressionWithFunctionBody)

    const isAsync = this.parseBoolean()
    const length = this.parseVarnum()
    const directives = this.parseDirectiveList()
    const contents = this.parseArrowExpressionContentsWithFunctionBody()
    return {
      type,
      isAsync,
      length,
      directives,
      contents
    }
  }

  parseLazyArrowExpressionWithFunctionBody(): LazyArrowExpressionWithFunctionBody {
    const type = this.parseType(NodeType.LazyArrowExpressionWithFunctionBody)

    const isAsync = this.parseBoolean()
    const length = this.parseVarnum()
    const directives = this.parseDirectiveList()
    const contents = this.parseArrowExpressionContentsWithFunctionBody()
    return {
      type,
      isAsync,
      length,
      directives,
      contents
    }
  }

  parseArrowExpressionContentsWithFunctionBody(): ArrowExpressionContentsWithFunctionBody {
    const type = this.parseType(
      NodeType.ArrowExpressionContentsWithFunctionBody
    )

    const parameterScope = this.parseAssertedParameterScope()
    const params = this.parseFormalParameters()
    const bodyScope = this.parseAssertedVarScope()
    const body = this.parseFunctionBody()
    return {
      type,
      parameterScope,
      params,
      bodyScope,
      body
    }
  }

  parseEagerArrowExpressionWithExpression(): EagerArrowExpressionWithExpression {
    const type = this.parseType(NodeType.EagerArrowExpressionWithExpression)

    const isAsync = this.parseBoolean()
    const length = this.parseVarnum()
    const contents = this.parseArrowExpressionContentsWithExpression()
    return {
      type,
      isAsync,
      length,
      contents
    }
  }

  parseLazyArrowExpressionWithExpression(): LazyArrowExpressionWithExpression {
    const type = this.parseType(NodeType.LazyArrowExpressionWithExpression)

    const isAsync = this.parseBoolean()
    const length = this.parseVarnum()
    const contents = this.parseArrowExpressionContentsWithExpression()
    return {
      type,
      isAsync,
      length,
      contents
    }
  }

  parseArrowExpressionContentsWithExpression(): ArrowExpressionContentsWithExpression {
    const type = this.parseType(NodeType.ArrowExpressionContentsWithExpression)

    const parameterScope = this.parseAssertedParameterScope()
    const params = this.parseFormalParameters()
    const bodyScope = this.parseAssertedVarScope()
    const body = this.parseExpression()
    return {
      type,
      parameterScope,
      params,
      bodyScope,
      body
    }
  }

  parseAssignmentExpression(): AssignmentExpression {
    const type = this.parseType(NodeType.AssignmentExpression)

    const binding = this.parseAssignmentTarget()
    const expression = this.parseExpression()
    return {
      type,
      binding,
      expression
    }
  }

  parseBinaryExpression(): BinaryExpression {
    const type = this.parseType(NodeType.BinaryExpression)

    const operator = this.parseBinaryOperator()
    const left = this.parseExpression()
    const right = this.parseExpression()
    return {
      type,
      operator,
      left,
      right
    }
  }

  parseBinaryOperator(): BinaryOperator {
    const variant = this.parseVariant()
    switch (variant) {
      case Variant.Comma:
        return BinaryOperator.Comma
      case Variant.Or:
        return BinaryOperator.Or
      case Variant.And:
        return BinaryOperator.And
      case Variant.LogicOr:
        return BinaryOperator.LogicOr
      case Variant.LogicXor:
        return BinaryOperator.LogicXor
      case Variant.LogicAnd:
        return BinaryOperator.LogicAnd
      case Variant.EqualEqual:
        return BinaryOperator.EqualEqual
      case Variant.NotEqual:
        return BinaryOperator.NotEqual
      case Variant.EqualEqualEqual:
        return BinaryOperator.EqualEqualEqual
      case Variant.NotEqualEqual:
        return BinaryOperator.NotEqualEqual
      case Variant.LessThan:
        return BinaryOperator.LessThan
      case Variant.LessThanEqual:
        return BinaryOperator.LessThanEqual
      case Variant.GreaterThan:
        return BinaryOperator.GreaterThan
      case Variant.GreaterThanEqual:
        return BinaryOperator.GreaterThanEqual
      case Variant.In:
        return BinaryOperator.In
      case Variant.InstanceOf:
        return BinaryOperator.InstanceOf
      case Variant.LessThanLessThan:
        return BinaryOperator.LessThanLessThan
      case Variant.GreaterThanGreaterThan:
        return BinaryOperator.GreaterThanGreaterThan
      case Variant.GreaterThanGreaterThanGreaterThan:
        return BinaryOperator.GreaterThanGreaterThanGreaterThan
      case Variant.BinaryOperatorOrUnaryOperatorPlus:
        return BinaryOperator.Plus
      case Variant.BinaryOperatorOrUnaryOperatorMinus:
        return BinaryOperator.Minus
      case Variant.Star:
        return BinaryOperator.Star
      case Variant.Div:
        return BinaryOperator.Div
      case Variant.Mod:
        return BinaryOperator.Mod
      case Variant.StarStar:
        return BinaryOperator.StarStar
      default:
        throw new Error('Unexpected variant')
    }
  }

  parseCallExpression(): CallExpression {
    const type = this.parseType(NodeType.CallExpression)

    const callee = this.parseExpressionOrSuper()
    const argumentsList = this.parseArguments()
    return {
      type,
      callee,
      arguments: argumentsList
    }
  }

  parseCompoundAssignmentExpression(): CompoundAssignmentExpression {
    const type = this.parseType(NodeType.CompoundAssignmentExpression)

    const operator = this.parseCompoundAssignmentOperator()
    const binding = this.parseSimpleAssignmentTarget()
    const expression = this.parseExpression()
    return {
      type,
      operator,
      binding,
      expression
    }
  }

  parseCompoundAssignmentOperator(): CompoundAssignmentOperator {
    const variant = this.parseVariant()
    switch (variant) {
      case Variant.PlusEqual:
        return CompoundAssignmentOperator.PlusEqual
      case Variant.MinusEqual:
        return CompoundAssignmentOperator.MinusEqual
      case Variant.StarEqual:
        return CompoundAssignmentOperator.StarEqual
      case Variant.DivEuqal:
        return CompoundAssignmentOperator.DivEuqal
      case Variant.ModEqual:
        return CompoundAssignmentOperator.ModEqual
      case Variant.StarStarEqual:
        return CompoundAssignmentOperator.StarStarEqual
      case Variant.LessThanLessThanEqual:
        return CompoundAssignmentOperator.LessThanLessThanEqual
      case Variant.GreaterThanGreaterThanEequal:
        return CompoundAssignmentOperator.GreaterThanGreaterThanEequal
      case Variant.GreaterThanGreaterThanGreaterThanEequal:
        return CompoundAssignmentOperator.GreaterThanGreaterThanGreaterThanEequal
      case Variant.LoginOrEqual:
        return CompoundAssignmentOperator.LoginOrEqual
      case Variant.LogicAndEuqal:
        return CompoundAssignmentOperator.LogicAndEuqal
      case Variant.LogicXorEqual:
        return CompoundAssignmentOperator.LogicXorEqual
      default:
        throw new Error('Unexpected variant: ' + variant)
    }
  }

  parseComputedMemberExpression(): ComputedMemberExpression {
    const type = this.parseType(NodeType.ComputedMemberExpression)

    const _object = this.parseExpressionOrSuper()
    const expression = this.parseExpression()
    return {
      type,
      _object,
      expression
    }
  }

  parseConditionalExpression(): ConditionalExpression {
    const type = this.parseType(NodeType.ConditionalExpression)

    const test = this.parseExpression()
    const consequent = this.parseExpression()
    const alternate = this.parseExpression()
    return {
      type,
      test,
      consequent,
      alternate
    }
  }

  parseClassExpression(): ClassExpression {
    const type = this.parseType(NodeType.ClassExpression)

    const name = this.parseOptional(() => this.parseBindingIdentifier())
    const superExpr = this.parseOptional(() => this.parseExpression())
    const elements = this.parseClassElementList()
    return {
      type,
      name,
      super: superExpr,
      elements
    }
  }

  parseEagerFunctionExpression(): EagerFunctionExpression {
    throw new Error('Method not implemented.')
  }

  parseLazyFunctionExpression(): LazyFunctionExpression {
    throw new Error('Method not implemented.')
  }

  parseIdentifierExpression(): IdentifierExpression {
    const type = this.parseType(NodeType.IdentifierExpression)

    const name = this.parseIdentifierName()
    return {
      type,
      name
    }
  }

  parseNewExpression(): NewExpression {
    const type = this.parseType(NodeType.NewExpression)

    const callee = this.parseExpression()
    const argumentsList = this.parseArguments()
    return {
      type,
      callee,
      arguments: argumentsList
    }
  }

  parseArguments(): Arguments {
    return this.parseSpreadOrExpressionList()
  }

  parseSpreadOrExpressionList(): FrozenArray<SpreadElement | Expression> {
    return this.parseList(() => this.parseSpreadOrExpressopm())
  }

  parseSpreadOrExpressopm(): SpreadElement | Expression {
    const type = this.peekTaggedTuple()
    switch (type) {
      case NodeType.SpreadElement:
        return this.parseSpreadElement()
      default:
        return this.parseExpression()
    }
  }

  parseSpreadElement(): SpreadElement {
    const type = this.parseType(NodeType.SpreadElement)

    const expression = this.parseExpression()
    return {
      type,
      expression
    }
  }

  parseNewTargetExpression(): NewTargetExpression {
    const type = this.parseType(NodeType.NewTargetExpression)

    return {
      type
    }
  }

  parseObjectExpression(): ObjectExpression {
    const type = this.parseType(NodeType.ObjectExpression)

    const properties = this.parseObjectPropertyList()
    return {
      type,
      properties
    }
  }

  parseObjectPropertyList(): FrozenArray<ObjectProperty> {
    return this.parseList(() => this.parseObjectProperty())
  }

  parseObjectProperty(): ObjectProperty {
    const type = this.peekTaggedTuple()
    switch (type) {
      case NodeType.DataProperty:
        return this.parseDataProperty()
      case NodeType.ShorthandProperty:
        return this.parseShorthandProperty()
      case NodeType.EagerMethod:
      case NodeType.LazyMethod:
      case NodeType.EagerGetter:
      case NodeType.LazyGetter:
      case NodeType.EagerSetter:
      case NodeType.LazySetter:
        return this.parseMethodDefinition()
      default:
        throw new Error('Unexpected kind: ' + type)
    }
  }

  parseDataProperty(): DataProperty {
    const type = this.parseType(NodeType.DataProperty)

    const name = this.parsePropertyName()
    const expression = this.parseExpression()
    return {
      type,
      name,
      expression
    }
  }

  parseShorthandProperty(): ShorthandProperty {
    const type = this.parseType(NodeType.ShorthandProperty)

    const name = this.parseIdentifierExpression()
    return {
      type,
      name
    }
  }

  parseUnaryExpression(): UnaryExpression {
    const type = this.parseType(NodeType.UnaryExpression)

    const operator = this.parseUnaryOperator()
    const operand = this.parseExpression()
    return {
      type,
      operator,
      operand
    }
  }

  parseUnaryOperator(): UnaryOperator {
    const variant = this.parseVariant()
    switch (variant) {
      case Variant.BinaryOperatorOrUnaryOperatorPlus:
        return UnaryOperator.Plus
      case Variant.BinaryOperatorOrUnaryOperatorMinus:
        return UnaryOperator.Minus
      case Variant.Not:
        return UnaryOperator.Not
      case Variant.LogicNot:
        return UnaryOperator.LogicNot
      case Variant.TypeOf:
        return UnaryOperator.TypeOf
      case Variant.Void:
        return UnaryOperator.Void
      case Variant.Delete:
        return UnaryOperator.Delete
      default:
        throw new Error('Unexpected variant: ' + variant)
    }
  }

  parseStaticMemberExpression(): StaticMemberExpression {
    const type = this.parseType(NodeType.StaticMemberExpression)

    const _object = this.parseExpressionOrSuper()
    const property = this.parseIdentifierName()
    return {
      type,
      _object,
      property
    }
  }

  parseTemplateExpression(): TemplateExpression {
    const type = this.parseType(NodeType.TemplateExpression)

    const tag = this.parseOptional(() => this.parseExpression())
    const elements = this.parseExpressionOrTemplateElementList()
    return {
      type,
      tag,
      elements
    }
  }

  parseExpressionOrTemplateElementList(): FrozenArray<
    Expression | TemplateElement
  > {
    return this.parseList(() => this.parseExpressionOrTemplateElement())
  }

  parseExpressionOrTemplateElement(): Expression | TemplateElement {
    const type = this.peekTaggedTuple()
    switch (type) {
      case NodeType.TemplateElement:
        return this.parseTemplateElement()
      default:
        return this.parseExpression()
    }
  }

  parseTemplateElement(): TemplateElement {
    const type = this.parseType(NodeType.TemplateElement)
    throw new Error('Method not implemented.')
  }

  parseThisExpression(): ThisExpression {
    const type = this.parseType(NodeType.ThisExpression)

    return {
      type
    }
  }

  parseUpdateExpression(): UpdateExpression {
    const type = this.parseType(NodeType.UpdateExpression)

    const isPrefix = this.parseBoolean()
    const operator = this.parseUpdateOperator()
    const operand = this.parseSimpleAssignmentTarget()
    return {
      type,
      isPrefix,
      operator,
      operand
    }
  }

  parseUpdateOperator(): UpdateOperator {
    const variant = this.parseVariant()
    switch (variant) {
      case Variant.PlusPlus:
        return UpdateOperator.PlusPlus
      case Variant.MinusMinus:
        return UpdateOperator.MinusMinus
      default:
        throw new Error('Unexpected variant: ' + variant)
    }
  }

  parseYieldExpression(): YieldExpression {
    const type = this.parseType(NodeType.YieldExpression)

    const expression = this.parseOptional(() => this.parseExpression())
    return {
      type,
      expression
    }
  }

  parseYieldStarExpression(): YieldStarExpression {
    const type = this.parseType(NodeType.YieldStarExpression)

    const expression = this.parseExpression()
    return {
      type,
      expression
    }
  }

  parseAwaitExpression(): AwaitExpression {
    const type = this.parseType(NodeType.AwaitExpression)

    const expression = this.parseExpression()
    return {
      type,
      expression
    }
  }

  parseBlock(): Block {
    const type = this.parseType(NodeType.Block)

    const scope = this.parseAssertedBlockScope()
    const statements = this.parseStatementList()
    return {
      type,
      scope,
      statements
    }
  }

  parseAssertedBlockScope(): AssertedBlockScope {
    const type = this.parseType(NodeType.AssertedBlockScope)

    const declaredNames = this.parseAssertedDeclaredNameList()
    const hasDirectEval = this.parseBoolean()

    return {
      type,
      declaredNames,
      hasDirectEval
    }
  }

  parseBreakStatement(): BreakStatement {
    const type = this.parseType(NodeType.BreakStatement)

    const label = this.parseMaybeAtom()
    return {
      type,
      label
    }
  }

  parseContinueStatement(): ContinueStatement {
    const type = this.parseType(NodeType.ContinueStatement)

    const label = this.parseMaybeAtom()
    return {
      type,
      label
    }
  }

  parseClassDeclaration(): ClassDeclaration {
    const type = this.parseType(NodeType.ClassDeclaration)

    const name = this.parseBindingIdentifier()
    const superExpr = this.parseExpression()
    const elements = this.parseClassElementList()
    return {
      type,
      name,
      super: superExpr,
      elements
    }
  }

  parseClassElementList(): FrozenArray<ClassElement> {
    return this.parseList(() => this.parseClassElement())
  }

  parseClassElement(): ClassElement {
    const type = this.parseType(NodeType.ClassElement)

    const isStatic = this.parseBoolean()
    const method = this.parseMethodDefinition()
    return {
      type,
      isStatic,
      method
    }
  }

  parseMethodDefinition(): MethodDefinition {
    const type = this.peekTaggedTuple()
    switch (type) {
      case NodeType.EagerMethod:
      case NodeType.LazyMethod:
        return this.parseMethod()
      case NodeType.EagerGetter:
      case NodeType.LazyGetter:
        return this.parseGetter()
      case NodeType.EagerSetter:
      case NodeType.LazySetter:
        return this.parseSetter()
      default:
        throw new Error('Unexpected kind: ' + type)
    }
  }

  parseMethod(): Method {
    const type = this.peekTaggedTuple()
    switch (type) {
      case NodeType.EagerMethod:
        return this.parseEagerMethod()
      case NodeType.LazyMethod:
        return this.parseLazyMethod()
      default:
        throw new Error('Unexpected kind: ' + type)
    }
  }

  parseEagerMethod(): EagerMethod {
    const type = this.parseType(NodeType.EagerMethod)

    const isAsync = this.parseBoolean()
    const isGenerator = this.parseBoolean()
    const name = this.parsePropertyName()
    const length = this.parseVarnum()
    const directives = this.parseDirectiveList()
    const contents = this.parseFunctionOrMethodContents()
    return {
      type,
      isAsync,
      isGenerator,
      name,
      length,
      directives,
      contents
    }
  }

  parseLazyMethod(): LazyMethod {
    const type = this.parseType(NodeType.LazyMethod)

    const isAsync = this.parseBoolean()
    const isGenerator = this.parseBoolean()
    const name = this.parsePropertyName()
    const length = this.parseVarnum()
    const directives = this.parseDirectiveList()
    const contents = this.parseFunctionOrMethodContents()
    return {
      type,
      isAsync,
      isGenerator,
      name,
      length,
      directives,
      contents
    }
  }

  parseFunctionOrMethodContents(): FunctionOrMethodContents {
    const type = this.parseType(NodeType.FunctionOrMethodContents)

    const isThisCaptured = this.parseBoolean()
    const parameterScope = this.parseAssertedParameterScope()
    const params = this.parseFormalParameters()
    const bodyScope = this.parseAssertedVarScope()
    const body = this.parseFunctionBody()
    return {
      type,
      isThisCaptured,
      parameterScope,
      params,
      bodyScope,
      body
    }
  }

  parseFormalParameters(): FormalParameters {
    const type = this.parseType(NodeType.FormalParameters)

    const items = this.parseParameterList()
    const rest = this.parseOptional(() => this.parseBinding())
    return {
      type,
      items,
      rest
    }
  }

  parseGetter(): Getter {
    const type = this.peekTaggedTuple()
    switch (type) {
      case NodeType.EagerGetter:
        return this.parseEagerGetter()
      case NodeType.LazyGetter:
        return this.parseLazyGetter()
      default:
        throw new Error('Unexpected kind: ' + type)
    }
  }

  parseEagerGetter(): EagerGetter {
    const type = this.parseType(NodeType.EagerGetter)

    const name = this.parsePropertyName()
    const directives = this.parseDirectiveList()
    const contents = this.parseGetterContents()
    return {
      type,
      name,
      directives,
      contents
    }
  }

  parseLazyGetter(): LazyGetter {
    const type = this.parseType(NodeType.LazyGetter)

    const name = this.parsePropertyName()
    const directives = this.parseDirectiveList()
    const contents = this.parseGetterContents()
    return {
      type,
      name,
      directives,
      contents
    }
  }

  parseGetterContents(): GetterContents {
    const type = this.parseType(NodeType.GetterContents)

    const isThisCaptured = this.parseBoolean()
    const bodyScope = this.parseAssertedVarScope()
    const body = this.parseFunctionBody()
    return {
      type,
      isThisCaptured,
      bodyScope,
      body
    }
  }

  parseAssertedVarScope(): AssertedVarScope {
    const type = this.parseType(NodeType.AssertedVarScope)

    const declaredNames = this.parseAssertedDeclaredNameList()
    const hasDirectEval = this.parseBoolean()
    return {
      type,
      declaredNames,
      hasDirectEval
    }
  }

  parseFunctionBody(): FunctionBody {
    return this.parseStatementList()
  }

  parseSetter(): Setter {
    const type = this.peekTaggedTuple()
    switch (type) {
      case NodeType.EagerSetter:
        return this.parseEagerSetter()
      case NodeType.LazySetter:
        return this.parseLazySetter()
      default:
        throw new Error('Unexpected kind: ' + type)
    }
  }

  parseEagerSetter(): EagerSetter {
    const type = this.parseType(NodeType.EagerSetter)

    const name = this.parsePropertyName()
    const length = this.parseVarnum()
    const directives = this.parseDirectiveList()
    const contents = this.parseSetterContents()

    return {
      type,
      name,
      length,
      directives,
      contents
    }
  }

  parseLazySetter(): LazySetter {
    const type = this.parseType(NodeType.LazySetter)

    const name = this.parsePropertyName()
    const length = this.parseVarnum()
    const directives = this.parseDirectiveList()
    const contents = this.parseSetterContents()

    return {
      type,
      name,
      length,
      directives,
      contents
    }
  }

  parseSetterContents(): SetterContents {
    const type = this.parseType(NodeType.SetterContents)

    const isThisCaptured = this.parseBoolean()
    const parameterScope = this.parseAssertedParameterScope()
    const param = this.parseParameter()
    const bodyScope = this.parseAssertedVarScope()
    const body = this.parseFunctionBody()
    return {
      type,
      isThisCaptured,
      parameterScope,
      param,
      bodyScope,
      body
    }
  }

  parseAssertedParameterScope(): AssertedParameterScope {
    const type = this.parseType(NodeType.AssertedParameterScope)

    const paramNames = this.parseAssertedMaybePositionalParameterNameList()
    const hasDirectEval = this.parseBoolean()
    const isSimpleParameterList = this.parseBoolean()
    return {
      type,
      paramNames,
      hasDirectEval,
      isSimpleParameterList
    }
  }

  parseAssertedMaybePositionalParameterNameList(): FrozenArray<
    AssertedMaybePositionalParameterName
  > {
    return this.parseList(() =>
      this.parseAssertedMaybePositionalParameterName()
    )
  }

  parseAssertedMaybePositionalParameterName(): AssertedMaybePositionalParameterName {
    const type = this.peekTaggedTuple()
    switch (type) {
      case NodeType.AssertedPositionalParameterName:
        return this.parseAssertedPositionalParameterName()
      case NodeType.AssertedRestParameterName:
        return this.parseAssertedRestParameterName()
      case NodeType.AssertedParameterName:
        return this.parseAssertedParameterName()
      default:
        throw new Error('Unexpected kind: ' + type)
    }
  }

  parseAssertedPositionalParameterName(): AssertedPositionalParameterName {
    const type = this.parseType(NodeType.AssertedPositionalParameterName)

    const index = this.parseVarnum()
    const name = this.parseIdentifierName()
    const isCaptured = this.parseBoolean()
    return {
      type,
      index,
      name,
      isCaptured
    }
  }

  parseAssertedRestParameterName(): AssertedRestParameterName {
    const type = this.parseType(NodeType.AssertedRestParameterName)

    const name = this.parseIdentifierName()
    const isCaptured = this.parseBoolean()
    return {
      type,
      name,
      isCaptured
    }
  }

  parseAssertedParameterName(): AssertedParameterName {
    const type = this.parseType(NodeType.AssertedParameterName)

    const name = this.parseIdentifierName()
    const isCaptured = this.parseBoolean()
    return {
      type,
      name,
      isCaptured
    }
  }

  parseParameterList(): FrozenArray<Parameter> {
    return this.parseList(() => this.parseParameter())
  }

  parseParameter(): Parameter {
    return this.parseBindingOrBindingWithInitializer()
  }

  parseBindingIdentifier(): BindingIdentifier {
    const type = this.parseType(NodeType.BindingIdentifier)

    const name = this.parseIdentifierName()
    return {
      type,
      name
    }
  }

  parseDebuggerStatement(): DebuggerStatement {
    const type = this.parseType(NodeType.DebuggerStatement)

    return {
      type
    }
  }

  parseEmptyStatement(): EmptyStatement {
    const type = this.parseType(NodeType.EmptyStatement)

    return {
      type
    }
  }

  parseExpressionStatement(): ExpressionStatement {
    const type = this.parseType(NodeType.ExpressionStatement)

    const expression = this.parseExpression()
    return {
      type,
      expression
    }
  }

  parseEagerFunctionDeclaration(): EagerFunctionDeclaration {
    const type = this.parseType(NodeType.EagerFunctionDeclaration)

    const isAsync = this.parseBoolean()
    const isGenerator = this.parseBoolean()
    const name = this.parseBindingIdentifier()
    const length = this.parseVarnum()
    const directives = this.parseDirectiveList()
    const contents = this.parseFunctionOrMethodContents()
    return {
      type,
      isAsync,
      isGenerator,
      name,
      length,
      directives,
      contents
    }
  }

  parseLazyFunctionDeclaration(): LazyFunctionDeclaration {
    const type = this.parseType(NodeType.LazyFunctionDeclaration)

    const isAsync = this.parseBoolean()
    const isGenerator = this.parseBoolean()
    const name = this.parseBindingIdentifier()
    const length = this.parseVarnum()
    const directives = this.parseDirectiveList()
    const contents = this.parseFunctionOrMethodContents()
    return {
      type,
      isAsync,
      isGenerator,
      name,
      length,
      directives,
      contents
    }
  }

  parseIfStatement(): IfStatement {
    const type = this.parseType(NodeType.IfStatement)

    const test = this.parseExpression()
    const consequent = this.parseStatement()
    const alternate = this.parseOptional(() => this.parseStatement())
    return {
      type,
      test,
      consequent,
      alternate
    }
  }

  parseDoWhileStatement(): DoWhileStatement {
    const type = this.parseType(NodeType.DoWhileStatement)

    const test = this.parseExpression()
    const body = this.parseStatement()
    return {
      type,
      test,
      body
    }
  }

  parseVariableDeclaration(): VariableDeclaration {
    const type = this.parseType(NodeType.VariableDeclaration)

    const kind = this.parseVariableDeclarationKind()
    const declarators = this.parseVariableDeclaratorList()
    return {
      type,
      kind,
      declarators
    }
  }

  parseVariableDeclarationKind(): VariableDeclarationKind {
    const variant = this.parseVariant()
    switch (variant) {
      case Variant.Let:
        return VariableDeclarationKind.Let
      case Variant.Const:
        return VariableDeclarationKind.Const
      case Variant.AssertedDeclaredKindOrVariableDeclarationKindVar:
        return VariableDeclarationKind.Var
      default:
        throw new Error('Unexpected Variant: ' + variant)
    }
  }

  parseVariableDeclaratorList(): FrozenArray<VariableDeclarator> {
    return this.parseList(() => this.parseVariableDeclarator())
  }

  parseVariableDeclarator(): VariableDeclarator {
    const type = this.parseType(NodeType.VariableDeclarator)

    const binding = this.parseBinding()
    const init = this.parseOptional(() => this.parseExpression())
    return {
      type,
      binding,
      init
    }
  }

  parseBinding(): Binding {
    const type = this.peekTaggedTuple()
    switch (type) {
      case NodeType.ObjectBinding:
      case NodeType.ArrayBinding:
        return this.parseBindingPattern()
      case NodeType.BindingIdentifier:
        return this.parseBindingIdentifier()
      default:
        throw new Error('Unexpected kind: ' + type)
    }
  }

  parseBindingPattern(): BindingPattern {
    const type = this.peekTaggedTuple()
    switch (type) {
      case NodeType.ObjectBinding:
        return this.parseObjectBinding()
      case NodeType.ArrayBinding:
        return this.parseArrayBinding()
      default:
        throw new Error('Unexpected kind: ' + type)
    }
  }

  parseObjectBinding(): ObjectBinding {
    const type = this.parseType(NodeType.ObjectBinding)

    const properties = this.parseBindingPropertyList()
    return {
      type,
      properties
    }
  }

  parseBindingPropertyList(): FrozenArray<BindingProperty> {
    return this.parseList(() => this.parseBindingProperty())
  }

  parseBindingProperty(): BindingProperty {
    const type = this.peekTaggedTuple()

    switch (type) {
      case NodeType.BindingPropertyIdentifier:
        return this.parseBindingPropertyIdentifier()
      case NodeType.BindingPropertyProperty:
        return this.parseBindingPropertyProperty()
      default:
        throw new Error('Unexpected kind: ' + type)
    }
  }

  parseBindingPropertyIdentifier(): BindingPropertyIdentifier {
    const type = this.parseType(NodeType.BindingPropertyIdentifier)

    const binding = this.parseBindingIdentifier()
    const init = this.parseOptional(() => this.parseExpression())
    return {
      type,
      binding,
      init
    }
  }

  parseBindingPropertyProperty(): BindingPropertyProperty {
    const type = this.parseType(NodeType.BindingPropertyProperty)

    const name = this.parsePropertyName()
    const binding = this.parseBindingOrBindingWithInitializer()
    return {
      type,
      name,
      binding
    }
  }

  parsePropertyName(): PropertyName {
    const type = this.peekTaggedTuple()
    switch (type) {
      case NodeType.ComputedPropertyName:
        return this.parseComputedPropertyName()
      case NodeType.LiteralPropertyName:
        return this.parseLiteralPropertyName()
      default:
        throw new Error('Unexpected kind: ' + type)
    }
  }

  parseComputedPropertyName(): ComputedPropertyName {
    const type = this.parseType(NodeType.ComputedPropertyName)

    const expression = this.parseExpression()
    return {
      type,
      expression
    }
  }

  parseLiteralPropertyName(): LiteralPropertyName {
    const type = this.parseType(NodeType.LiteralPropertyName)

    const value = this.parseAtom()
    return {
      type,
      value
    }
  }

  parseBindingOrBindingWithInitializerList(): FrozenArray<
    Binding | BindingWithInitializer
  > {
    return this.parseList(() => this.parseBindingOrBindingWithInitializer())
  }

  parseBindingOrBindingWithInitializer(): Binding | BindingWithInitializer {
    const type = this.peekTaggedTuple()

    switch (type) {
      case NodeType.BindingWithInitializer:
        return this.parseBindingWithInitializer()
      default:
        return this.parseBinding()
    }
  }

  parseBindingWithInitializer(): BindingWithInitializer {
    const type = this.parseType(NodeType.BindingWithInitializer)
    const binding = this.parseBinding()
    const init = this.parseExpression()

    return {
      type,
      binding,
      init
    }
  }

  parseArrayBinding(): ArrayBinding {
    const type = this.parseType(NodeType.ArrayBinding)

    const elements = this.parseBindingOrBindingWithInitializerList()
    const rest = this.parseOptional(() => this.parseBinding())
    return {
      type,
      elements,
      rest
    }
  }

  parseForInStatement(): ForInStatement {
    const type = this.parseType(NodeType.ForInStatement)

    const left = this.parseForInOfBindingOrAssignmentTarget()
    const right = this.parseExpression()
    const body = this.parseStatement()
    return {
      type,
      left,
      right,
      body
    }
  }

  parseForOfStatement(): ForOfStatement {
    const type = this.parseType(NodeType.ForOfStatement)

    const left = this.parseForInOfBindingOrAssignmentTarget()
    const right = this.parseExpression()
    const body = this.parseStatement()
    return {
      type,
      left,
      right,
      body
    }
  }

  parseForStatement(): ForStatement {
    const type = this.parseType(NodeType.ForStatement)

    const init = this.parseOptional(() =>
      this.parseVariableDeclarationOrExpression()
    )
    const test = this.parseOptional(() => this.parseExpression())
    const update = this.parseOptional(() => this.parseExpression())
    const body = this.parseStatement()
    return {
      type,
      init,
      test,
      update,
      body
    }
  }

  parseVariableDeclarationOrExpression(): VariableDeclaration | Expression {
    const type = this.peekTaggedTuple()
    switch (type) {
      case NodeType.VariableDeclaration:
        return this.parseVariableDeclaration()
      default:
        return this.parseExpression()
    }
  }

  parseForInOfBindingOrAssignmentTarget(): ForInOfBinding | AssignmentTarget {
    const type = this.peekTaggedTuple()
    switch (type) {
      case NodeType.ForInOfBinding:
        return this.parseForInOfBinding()
      case NodeType.ObjectAssignmentTarget:
      case NodeType.ArrayAssignmentTarget:
      case NodeType.AssignmentTargetIdentifier:
      case NodeType.ComputedMemberAssignmentTarget:
      case NodeType.StaticMemberAssignmentTarget:
        return this.parseAssignmentTarget()
      default:
        throw new Error('Unexpected kind: ' + type)
    }
  }

  parseAssignmentTarget(): AssignmentTarget {
    const type = this.peekTaggedTuple()
    switch (type) {
      case NodeType.ObjectAssignmentTarget:
      case NodeType.ArrayAssignmentTarget:
        return this.parseAssignmentTargetPattern()
      case NodeType.AssignmentTargetIdentifier:
      case NodeType.ComputedMemberAssignmentTarget:
      case NodeType.StaticMemberAssignmentTarget:
        return this.parseSimpleAssignmentTarget()
      default:
        throw new Error('Unexpected kind: ' + type)
    }
  }

  parseAssignmentTargetPattern(): AssignmentTargetPattern {
    const type = this.peekTaggedTuple()
    switch (type) {
      case NodeType.ObjectAssignmentTarget:
        return this.parseObjectAssignmentTarget()
      case NodeType.ArrayAssignmentTarget:
        return this.parseArrayAssignmentTarget()
      default:
        throw new Error('Unexpected kind: ' + type)
    }
  }

  parseObjectAssignmentTarget(): ObjectAssignmentTarget {
    const type = this.parseType(NodeType.ObjectAssignmentTarget)

    const properties = this.parseAssignmentTargetPropertyList()
    return {
      type,
      properties
    }
  }

  parseAssignmentTargetPropertyList(): FrozenArray<AssignmentTargetProperty> {
    return this.parseList(() => this.parseAssignmentTargetProperty())
  }

  parseAssignmentTargetProperty(): AssignmentTargetProperty {
    const type = this.peekTaggedTuple()
    switch (type) {
      case NodeType.AssignmentTargetPropertyIdentifier:
        return this.parseAssignmentTargetPropertyIdentifier()
      case NodeType.AssignmentTargetPropertyProperty:
        return this.parseAssignmentTargetPropertyProperty()
      default:
        throw new Error('Unexpected kind: ' + type)
    }
  }

  parseAssignmentTargetPropertyIdentifier(): AssignmentTargetPropertyIdentifier {
    const type = this.parseType(NodeType.AssignmentTargetPropertyIdentifier)

    const binding = this.parseAssignmentTargetIdentifier()
    const init = this.parseOptional(() => this.parseExpression())
    return {
      type,
      binding,
      init
    }
  }

  parseAssignmentTargetIdentifier(): AssignmentTargetIdentifier {
    const type = this.parseType(NodeType.AssignmentTargetIdentifier)

    const name = this.parseIdentifierName()
    return {
      type,
      name
    }
  }

  parseAssignmentTargetOrAssignmentTargetWithInitializerList(): FrozenArray<
    AssignmentTarget | AssignmentTargetWithInitializer
  > {
    return this.parseList(() =>
      this.parseAssignmentTargetOrAssignmentTargetWithInitializer()
    )
  }

  parseAssignmentTargetOrAssignmentTargetWithInitializer():
    | AssignmentTarget
    | AssignmentTargetWithInitializer {
    const type = this.peekTaggedTuple()
    switch (type) {
      case NodeType.AssignmentTargetWithInitializer:
        return this.parseAssignmentTargetWithInitializer()
      default:
        return this.parseAssignmentTarget()
    }
  }

  parseAssignmentTargetWithInitializer(): AssignmentTargetWithInitializer {
    const type = this.parseType(NodeType.AssignmentTargetWithInitializer)

    const binding = this.parseAssignmentTarget()
    const init = this.parseExpression()
    return {
      type,
      binding,
      init
    }
  }

  parseAssignmentTargetPropertyProperty(): AssignmentTargetPropertyProperty {
    const type = this.parseType(NodeType.AssignmentTargetPropertyProperty)

    const name = this.parsePropertyName()
    const binding = this.parseAssignmentTargetOrAssignmentTargetWithInitializer()
    return {
      type,
      name,
      binding
    }
  }

  parseArrayAssignmentTarget(): ArrayAssignmentTarget {
    const type = this.parseType(NodeType.ArrayAssignmentTarget)

    const elements = this.parseAssignmentTargetOrAssignmentTargetWithInitializerList()
    const rest = this.parseOptional(() => this.parseAssignmentTarget())
    return {
      type,
      elements,
      rest
    }
  }

  parseSimpleAssignmentTarget(): SimpleAssignmentTarget {
    const type = this.peekTaggedTuple()
    switch (type) {
      case NodeType.AssignmentTargetIdentifier:
        return this.parseAssignmentTargetIdentifier()
      case NodeType.ComputedMemberAssignmentTarget:
        return this.parseComputedMemberAssignmentTarget()
      case NodeType.StaticMemberAssignmentTarget:
        return this.parseStaticMemberAssignmentTarget()
      default:
        throw new Error('Unexpected kind: ' + type)
    }
  }

  parseComputedMemberAssignmentTarget(): ComputedMemberAssignmentTarget {
    const type = this.parseType(NodeType.ComputedMemberAssignmentTarget)

    const _object = this.parseExpressionOrSuper()
    const expression = this.parseExpression()
    return {
      type,
      _object,
      expression
    }
  }

  parseStaticMemberAssignmentTarget(): StaticMemberAssignmentTarget {
    const type = this.parseType(NodeType.StaticMemberAssignmentTarget)

    const _object = this.parseExpressionOrSuper()
    const property = this.parseIdentifierName()
    return {
      type,
      _object,
      property
    }
  }

  parseExpressionOrSuper(): Expression | Super {
    const type = this.peekTaggedTuple()
    switch (type) {
      case NodeType.Super:
        return this.parseSuper()
      default:
        return this.parseExpression()
    }
  }

  parseSuper(): Super {
    const type = this.parseType(NodeType.Super)

    return {
      type
    }
  }

  parseForInOfBinding(): ForInOfBinding {
    const type = this.parseType(NodeType.ForInOfBinding)

    const kind = this.parseVariableDeclarationKind()
    const binding = this.parseBinding()
    return {
      type,
      kind,
      binding
    }
  }

  parseWhileStatement(): WhileStatement {
    const type = this.parseType(NodeType.WhileStatement)

    const test = this.parseExpression()
    const body = this.parseStatement()
    return {
      type,
      test,
      body
    }
  }

  parseLabelledStatement(): LabelledStatement {
    const type = this.parseType(NodeType.LabelledStatement)

    const label = this.parseAtom()
    const body = this.parseStatement()
    return {
      type,
      label,
      body
    }
  }

  parseReturnStatement(): ReturnStatement {
    const type = this.parseType(NodeType.ReturnStatement)

    const expression = this.parseOptional(() => this.parseExpression())
    return {
      type,
      expression
    }
  }

  parseSwitchStatement(): SwitchStatement {
    const type = this.parseType(NodeType.SwitchStatement)

    const discriminant = this.parseExpression()
    const cases = this.parseSwitchCaseList()
    return {
      type,
      discriminant,
      cases
    }
  }

  parseSwitchCaseList(): FrozenArray<SwitchCase> {
    return this.parseList(() => this.parseSwitchCase())
  }

  parseSwitchCase(): SwitchCase {
    const type = this.parseType(NodeType.SwitchCase)

    const test = this.parseExpression()
    const consequent = this.parseStatementList()
    return {
      type,
      test,
      consequent
    }
  }

  parseSwitchStatementWithDefault(): SwitchStatementWithDefault {
    const type = this.parseType(NodeType.SwitchStatementWithDefault)

    const discriminant = this.parseExpression()
    const preDefaultCases = this.parseSwitchCaseList()
    const defaultCase = this.parseSwitchDefault()
    const postDefaultCases = this.parseSwitchCaseList()
    return {
      type,
      discriminant,
      preDefaultCases,
      defaultCase,
      postDefaultCases
    }
  }

  parseSwitchDefault(): SwitchDefault {
    const type = this.parseType(NodeType.SwitchDefault)

    const consequent = this.parseStatementList()
    return {
      type,
      consequent
    }
  }

  parseThrowStatement(): ThrowStatement {
    const type = this.parseType(NodeType.ThrowStatement)

    const expression = this.parseExpression()
    return {
      type,
      expression
    }
  }

  parseTryCatchStatement(): TryCatchStatement {
    const type = this.parseType(NodeType.TryCatchStatement)

    const body = this.parseBlock()
    const catchClause = this.parseCatchClause()
    return {
      type,
      body,
      catchClause
    }
  }

  parseCatchClause(): CatchClause {
    const type = this.parseType(NodeType.CatchClause)

    const bindingScope = this.parseAssertedBoundNamesScope()
    const binding = this.parseBinding()
    const body = this.parseBlock()
    return {
      type,
      bindingScope,
      binding,
      body
    }
  }

  parseAssertedBoundNamesScope(): AssertedBoundNamesScope {
    const type = this.parseType(NodeType.AssertedBoundNamesScope)

    const boundNames = this.parseAssertedBoundNameList()
    const hasDirectEval = this.parseBoolean()
    return {
      type,
      boundNames,
      hasDirectEval
    }
  }

  parseAssertedBoundNameList(): FrozenArray<AssertedBoundName> {
    return this.parseList(() => this.parseAssertedBoundName())
  }

  parseAssertedBoundName(): AssertedBoundName {
    const type = this.parseType(NodeType.AssertedBoundName)

    const name = this.parseIdentifierName()
    const isCaptured = this.parseBoolean()
    return {
      type,
      name,
      isCaptured
    }
  }

  parseTryFinallyStatement(): TryFinallyStatement {
    const type = this.parseType(NodeType.TryFinallyStatement)

    const body = this.parseBlock()
    const catchClause = this.parseOptional(() => this.parseCatchClause())
    const finalizer = this.parseBlock()
    return {
      type,
      body,
      catchClause,
      finalizer
    }
  }

  parseWithStatement(): WithStatement {
    const type = this.parseType(NodeType.WithStatement)

    const _object = this.parseExpression()
    const body = this.parseStatement()
    return {
      type,
      _object,
      body
    }
  }
}
