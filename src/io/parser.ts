import MultipartReader from "./reader";
import { Context } from "./context";
import { Program, NodeType, Script, FrozenArray, Directive, Statement, AssertedScriptGlobalScope, AssertedDeclaredName, AssertedDeclaredKind, Variant, Block, AssertedBlockScope, BreakStatement, ContinueStatement, ClassDeclaration, BindingIdentifier, ClassElement, Expression, MethodDefinition, DebuggerStatement, EmptyStatement, ExpressionStatement, EagerFunctionDeclaration, LazyFunctionDeclaration, IfStatement, DoWhileStatement, VariableDeclaration, VariableDeclarator, VariableDeclarationKind, Binding, ForInStatement, ForInOfBinding, AssignmentTarget, ForOfStatement, ForStatement, WhileStatement, LabelledStatement, ReturnStatement, SwitchStatement, SwitchCase, SwitchDefault, SwitchStatementWithDefault, ThrowStatement, TryCatchStatement, CatchClause, AssertedBoundNamesScope, AssertedBoundName, TryFinallyStatement, WithStatement, BindingPattern, ObjectBinding, ArrayBinding, BindingProperty, BindingPropertyIdentifier, BindingPropertyProperty, BindingWithInitializer, ComputedPropertyName, LiteralPropertyName, PropertyName, AssignmentTargetPattern, SimpleAssignmentTarget, AssignmentTargetProperty, ObjectAssignmentTarget, AssignmentTargetPropertyIdentifier, AssignmentTargetPropertyProperty, AssignmentTargetIdentifier, AssignmentTargetWithInitializer, ArrayAssignmentTarget, StaticMemberAssignmentTarget, ComputedMemberAssignmentTarget, Super, Getter, Setter, Method, EagerMethod, LazyMethod, EagerGetter, LazyGetter, GetterContents, AssertedVarScope, FunctionBody, EagerSetter, LazySetter, SetterContents, AssertedParameterScope, AssertedMaybePositionalParameterName, Parameter, FunctionOrMethodContents, FormalParameters, AssertedPositionalParameterName, AssertedRestParameterName, AssertedParameterName } from "../types";

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

  readHeader() {
    return this.reader.readHeader()
  }

  readVarnum() {
    return this.reader.readVarnum()
  }

  readBoolean() {
    return this.reader.readBoolean()
  }

  readIdentifierName() {
    return this.reader.readIdentifierName()
  }

  readVariant() {
    return this.reader.readVariant()
  }

  readAtom() {
    return this.reader.readAtom()
  }

  enterTaggedTuple() {
    return this.reader.enterTaggedTuple()
  }

  lookAhead<T>(cb: () => T): T {
    return this.reader.lookAhead(cb)
  }

  parse() {
    this.readHeader()
    return this.parseProgram()
  }

  parseList<T>(cb: () => T): FrozenArray<T> {
    const result: T[] = []
    const length = this.readVarnum()
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

  parseKind<T extends NodeType>(expectedKind: T): T {
    const kind = this.enterTaggedTuple()
    if (kind !== expectedKind) {
      throw new Error("Invalid Kind: " + expectedKind)
    }
    return expectedKind
  }

  parseProgram(): Program {
    const kind = this.peekTaggedTuple()
    switch (kind) {
      case NodeType.Script:
        return this.parseScript()
      case NodeType.Module:
      default:
        throw new Error("Invalid Kind: " + kind)
    }
  }

  parseScript(): Script {
    const type = this.parseKind(NodeType.Script)

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
    const type = this.parseKind(NodeType.AssertedScriptGlobalScope)

    const declaredNames = this.parseAssertedDeclaredNameList()
    const hasDirectEval = this.readBoolean()
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
    const type = this.parseKind(NodeType.AssertedDeclaredName)

    const name = this.readIdentifierName()
    const kind = this.parseAssertedDeclaredKind()
    if (kind === AssertedDeclaredKind.ConstLexical || kind === AssertedDeclaredKind.NonConstLexical) {
      throw new Error("Let Or Const is not supported")
    }

    const isCaptured = this.readBoolean()
    return {
      type,
      name,
      kind,
      isCaptured
    }
  }

  parseAssertedDeclaredKind(): AssertedDeclaredKind {
    const kind = this.readVariant()
    switch (kind) {
      case Variant.AssertedDeclaredKindOrVariableDeclarationKindVar:
        return AssertedDeclaredKind.Var
      case Variant.ConstLexical:
        return AssertedDeclaredKind.ConstLexical
      case Variant.NonConstLexical:
        return AssertedDeclaredKind.NonConstLexical
      default:
        throw new Error('Invalid AssertedDeclaredKind Variant: ' + kind)
    }
  }

  parseDirectiveList() {
    return this.parseList(() => this.parseDirective())
  }

  parseDirective(): Directive {
    const type = this.parseKind(NodeType.Directive)

    const rawValue = this.readAtom()
    return {
      type,
      rawValue
    }
  }

  parseStatementList() {
    return this.parseList(() => this.parseStatement())
  }

  parseStatement(): Statement {
    const kind = this.peekTaggedTuple()
    switch (kind) {
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
        throw new Error("Unexpected Statement" + kind)
    }
  }

  parseExpression(): Expression {
    const kind = this.peekTaggedTuple()
    switch (kind) {
      case NodeType.LiteralBooleanExpression:
      case NodeType.LiteralInfinityExpression:
      case NodeType.LiteralNullExpression:
      case NodeType.LiteralNumericExpression:
      case NodeType.LiteralStringExpression:
      case NodeType.LiteralRegExpExpression:
      case NodeType.ArrayExpression:
      case NodeType.EagerArrowExpressionWithFunctionBody:
      case NodeType.LazyArrowExpressionWithFunctionBody:
      case NodeType.EagerArrowExpressionWithExpression:
      case NodeType.LazyArrowExpressionWithExpression:
      case NodeType.AssignmentExpression:
      case NodeType.BinaryExpression:
      case NodeType.CallExpression:
      case NodeType.CompoundAssignmentExpression:
      case NodeType.ComputedMemberExpression:
      case NodeType.ConditionalExpression:
      case NodeType.ClassExpression:
      case NodeType.EagerFunctionExpression:
      case NodeType.LazyFunctionExpression:
      case NodeType.IdentifierExpression:
      case NodeType.NewExpression:
      case NodeType.NewTargetExpression:
      case NodeType.ObjectExpression:
      case NodeType.UnaryExpression:
      case NodeType.StaticMemberExpression:
      case NodeType.TemplateExpression:
      case NodeType.ThisExpression:
      case NodeType.UpdateExpression:
      case NodeType.YieldExpression:
      case NodeType.YieldStarExpression:
      case NodeType.AwaitExpression:
      default:
        throw new Error("Unexpected Expression: " + kind)
    }
  }

  parseBlock(): Block {
    const type = this.parseKind(NodeType.Block)

    const scope = this.parseAssertedBlockScope()
    const statements = this.parseStatementList()
    return {
      type,
      scope,
      statements
    }
  }

  parseAssertedBlockScope(): AssertedBlockScope {
    const type = this.parseKind(NodeType.AssertedBlockScope)

    const declaredNames = this.parseAssertedDeclaredNameList()
    const hasDirectEval = this.readBoolean()

    return {
      type,
      declaredNames,
      hasDirectEval
    }
  }

  parseBreakStatement(): BreakStatement {
    const type = this.parseKind(NodeType.BreakStatement)

    const label = this.parseOptional(() => this.readAtom())
    return {
      type,
      label
    }
  }

  parseContinueStatement(): ContinueStatement {
    const type = this.parseKind(NodeType.ContinueStatement)

    const label = this.parseOptional(() => this.readAtom())
    return {
      type,
      label
    }
  }

  parseClassDeclaration(): ClassDeclaration {
    const type = this.parseKind(NodeType.ClassDeclaration)

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
    const type = this.parseKind(NodeType.ClassElement)

    const isStatic = this.readBoolean()
    const method = this.parseMethodDefinition()
    return {
      type,
      isStatic,
      method
    }
  }

  parseMethodDefinition(): MethodDefinition {
    const kind = this.peekTaggedTuple()
    switch (kind) {
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
        throw new Error("Unexpected method definition")
    }
  }

  parseMethod(): Method {
    const kind = this.peekTaggedTuple()
    switch (kind) {
      case NodeType.EagerMethod:
        return this.parseEagerMethod()
      case NodeType.LazyMethod:
        return this.parseLazyMethod()
      default:
        throw new Error("Unexpected kind: " + kind)
    }
  }

  parseEagerMethod(): EagerMethod {
    const type = this.parseKind(NodeType.EagerMethod)

    const isAsync = this.readBoolean()
    const isGenerator = this.readBoolean()
    const name = this.parsePropertyName()
    const length = this.readVarnum()
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
    const type = this.parseKind(NodeType.LazyMethod)

    const isAsync = this.readBoolean()
    const isGenerator = this.readBoolean()
    const name = this.parsePropertyName()
    const length = this.readVarnum()
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
    const type = this.parseKind(NodeType.FunctionOrMethodContents)

    const isThisCaptured = this.readBoolean()
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
    const type = this.parseKind(NodeType.FormalParameters)

    const items = this.parseParameterList()
    const rest = this.parseOptional(() => this.parseBinding())
    return {
      type,
      items,
      rest
    }
  }

  parseGetter(): Getter {
    const kind = this.peekTaggedTuple()
    switch (kind) {
      case NodeType.EagerGetter:
        return this.parseEagerGetter()
      case NodeType.LazyGetter:
        return this.parseLazyGetter()
      default:
        throw new Error("Unexpected kind: " + kind)
    }
  }

  parseEagerGetter(): EagerGetter {
    const type = this.parseKind(NodeType.EagerGetter)

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
    const type = this.parseKind(NodeType.LazyGetter)

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
    const type = this.parseKind(NodeType.GetterContents)

    const isThisCaptured = this.readBoolean()
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
    const type = this.parseKind(NodeType.AssertedVarScope)

    const declaredNames = this.parseAssertedDeclaredNameList()
    const hasDirectEval = this.readBoolean()
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
    const kind = this.peekTaggedTuple()
    switch (kind) {
      case NodeType.EagerSetter:
        return this.parseEagerSetter()
      case NodeType.LazySetter:
        return this.parseLazySetter()
      default:
        throw new Error("Unexpected kind: " + kind)
    }
  }

  parseEagerSetter(): EagerSetter {
    const type = this.parseKind(NodeType.EagerSetter)

    const name = this.parsePropertyName()
    const length = this.readVarnum()
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
    const type = this.parseKind(NodeType.LazySetter)

    const name = this.parsePropertyName()
    const length = this.readVarnum()
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
    const type = this.parseKind(NodeType.SetterContents)
    
    const isThisCaptured = this.readBoolean()
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
    const type = this.parseKind(NodeType.AssertedParameterScope)

    const paramNames = this.parseAssertedMaybePositionalParameterNameList()
    const hasDirectEval = this.readBoolean()
    const isSimpleParameterList = this.readBoolean()
    return {
      type,
      paramNames,
      hasDirectEval,
      isSimpleParameterList
    }
  }

  parseAssertedMaybePositionalParameterNameList(): FrozenArray<AssertedMaybePositionalParameterName> {
    return this.parseList(() => this.parseAssertedMaybePositionalParameterName())
  }

  parseAssertedMaybePositionalParameterName(): AssertedMaybePositionalParameterName {
    const kind = this.peekTaggedTuple()
    switch (kind) {
      case NodeType.AssertedPositionalParameterName:
        return this.parseAssertedPositionalParameterName()
      case NodeType.AssertedRestParameterName:
        return this.parseAssertedRestParameterName()
      case NodeType.AssertedParameterName:
        return this.parseAssertedParameterName()
      default:
        throw new Error("Unexpected kind: " + kind)
    }
  }

  parseAssertedPositionalParameterName(): AssertedPositionalParameterName {
    const type = this.parseKind(NodeType.AssertedPositionalParameterName)

    const index = this.readVarnum()
    const name = this.readIdentifierName()
    const isCaptured = this.readBoolean()
    return {
      type,
      index,
      name,
      isCaptured
    }
  }

  parseAssertedRestParameterName(): AssertedRestParameterName {
    const type = this.parseKind(NodeType.AssertedRestParameterName)

    const name = this.readIdentifierName()
    const isCaptured = this.readBoolean()
    return {
      type,
      name,
      isCaptured
    }
  }

  parseAssertedParameterName(): AssertedParameterName {
    const type = this.parseKind(NodeType.AssertedParameterName)

    const name = this.readIdentifierName()
    const isCaptured = this.readBoolean()
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
    const type = this.parseKind(NodeType.BindingIdentifier)

    const name = this.readIdentifierName()
    return {
      type,
      name
    }
  }

  parseDebuggerStatement(): DebuggerStatement {
    const type = this.parseKind(NodeType.DebuggerStatement)

    return {
      type
    }
  }

  parseEmptyStatement(): EmptyStatement {
    const type = this.parseKind(NodeType.EmptyStatement)

    return {
      type
    }
  }

  parseExpressionStatement(): ExpressionStatement {
    const type = this.parseKind(NodeType.ExpressionStatement)

    const expression = this.parseExpression()
    return {
      type,
      expression
    }
  }

  parseEagerFunctionDeclaration(): EagerFunctionDeclaration {
    const type = this.parseKind(NodeType.EagerFunctionDeclaration)

    throw new Error("Not implements EagerFunctionDeclaration")
  }

  parseLazyFunctionDeclaration(): LazyFunctionDeclaration {
    const type = this.parseKind(NodeType.LazyFunctionDeclaration)

    throw new Error("Not implements LazyFunctionDeclaration")
  }

  parseIfStatement(): IfStatement {
    const type = this.parseKind(NodeType.IfStatement)

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
    const type = this.parseKind(NodeType.DoWhileStatement)

    const test = this.parseExpression()
    const body = this.parseStatement()
    return {
      type,
      test,
      body
    }
  }

  parseVariableDeclaration(): VariableDeclaration {
    const type = this.parseKind(NodeType.VariableDeclaration)

    const kind = this.parseVariableDeclarationKind()
    const declarators = this.parseVariableDeclaratorList()
    return {
      type,
      kind,
      declarators
    }
  }

  parseVariableDeclarationKind(): VariableDeclarationKind {
    const variant = this.readVariant()
    switch (variant) {
      case Variant.Let:
        return VariableDeclarationKind.Let
      case Variant.Const:
        return VariableDeclarationKind.Const
      case Variant.AssertedDeclaredKindOrVariableDeclarationKindVar:
        return VariableDeclarationKind.Var
      default:
        throw new Error("Unexpected Variant: " + variant)
    }
  }

  parseVariableDeclaratorList(): FrozenArray<VariableDeclarator> {
    return this.parseList(() => this.parseVariableDeclarator())
  }

  parseVariableDeclarator(): VariableDeclarator {
    const type = this.parseKind(NodeType.VariableDeclarator)

    const binding = this.parseBinding()
    const init = this.parseOptional(() => this.parseExpression())
    return {
      type,
      binding,
      init
    }
  }

  parseBinding(): Binding {
    const kind = this.peekTaggedTuple()
    switch (kind) {
      case NodeType.ObjectBinding:
      case NodeType.ArrayBinding:
        return this.parseBindingPattern()
      case NodeType.BindingIdentifier:
        return this.parseBindingIdentifier()
      default:
        throw new Error("Unexpected kind: " + kind)
    }
  }

  parseBindingPattern(): BindingPattern {
    const kind = this.peekTaggedTuple()
    switch (kind) {
      case NodeType.ObjectBinding:
        return this.parseObjectBinding()
      case NodeType.ArrayBinding:
        return this.parseArrayBinding()
      default:
        throw new Error("Unexpected kind: " + kind)
    }
  }

  parseObjectBinding(): ObjectBinding {
    const type = this.parseKind(NodeType.ObjectBinding)

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
    const kind = this.peekTaggedTuple()

    switch (kind) {
      case NodeType.BindingPropertyIdentifier:
        return this.parseBindingPropertyIdentifier()
      case NodeType.BindingPropertyProperty:
        return this.parseBindingPropertyProperty()
      default:
        throw new Error("Unexpected kind: " + kind)
    }
  }

  parseBindingPropertyIdentifier(): BindingPropertyIdentifier {
    const type = this.parseKind(NodeType.BindingPropertyIdentifier)

    const binding = this.parseBindingIdentifier()
    const init = this.parseOptional(() => this.parseExpression())
    return {
      type,
      binding,
      init
    }
  }

  parseBindingPropertyProperty(): BindingPropertyProperty {
    const type = this.parseKind(NodeType.BindingPropertyProperty)

    const name = this.parsePropertyName()
    const binding = this.parseBindingOrBindingWithInitializer()
    return {
      type,
      name,
      binding
    }
  }

  parsePropertyName(): PropertyName {
    const kind = this.peekTaggedTuple()
    switch (kind) {
      case NodeType.ComputedPropertyName:
        return this.parseComputedPropertyName()
      case NodeType.LiteralPropertyName:
        return this.parseLiteralPropertyName()
      default:
        throw new Error("Unexpected kind: " + kind)
    }
  }

  parseComputedPropertyName(): ComputedPropertyName {
    const type = this.parseKind(NodeType.ComputedPropertyName)

    const expression = this.parseExpression()
    return {
      type,
      expression
    }
  }

  parseLiteralPropertyName(): LiteralPropertyName {
    const type = this.parseKind(NodeType.LiteralPropertyName)

    const value = this.readAtom()
    return {
      type,
      value
    }
  }

  parseBindingOrBindingWithInitializerList(): FrozenArray<Binding | BindingWithInitializer> {
    return this.parseList(() => this.parseBindingOrBindingWithInitializer())
  }

  parseBindingOrBindingWithInitializer(): Binding | BindingWithInitializer {
    const kind = this.peekTaggedTuple()

    switch (kind) {
      case NodeType.BindingWithInitializer:
        return this.parseBindingWithInitializer()
      default:
        return this.parseBinding()
    }
  }

  parseBindingWithInitializer(): BindingWithInitializer {
    const type = this.parseKind(NodeType.BindingWithInitializer)
    const binding = this.parseBinding()
    const init = this.parseExpression()

    return {
      type,
      binding,
      init
    }
  }

  parseArrayBinding(): ArrayBinding {
    const type = this.parseKind(NodeType.ArrayBinding)

    const elements = this.parseBindingOrBindingWithInitializerList()
    const rest = this.parseOptional(() => this.parseBinding())
    return {
      type,
      elements,
      rest
    }
  }

  parseForInStatement(): ForInStatement {
    const type = this.parseKind(NodeType.ForInStatement)

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
    const type = this.parseKind(NodeType.ForOfStatement)

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
    const type = this.parseKind(NodeType.ForStatement)

    const init = this.parseOptional(() => this.parseVariableDeclarationOrExpression())
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
    const kind = this.peekTaggedTuple()
    switch (kind) {
      case NodeType.VariableDeclaration:
        return this.parseVariableDeclaration()
      default:
        return this.parseExpression()
    }
  }

  parseForInOfBindingOrAssignmentTarget(): ForInOfBinding | AssignmentTarget {
    const kind = this.peekTaggedTuple()
    switch (kind) {
      case NodeType.ForInOfBinding:
        return this.parseForInOfBinding()
      case NodeType.ObjectAssignmentTarget:
      case NodeType.ArrayAssignmentTarget:
      case NodeType.AssignmentTargetIdentifier:
      case NodeType.ComputedMemberAssignmentTarget:
      case NodeType.StaticMemberAssignmentTarget:
        return this.parseAssignmentTarget()
      default:
        throw new Error("Unexpected kind: " + kind)
    }
  }

  parseAssignmentTarget(): AssignmentTarget {
    const kind = this.peekTaggedTuple()
    switch (kind) {
      case NodeType.ObjectAssignmentTarget:
      case NodeType.ArrayAssignmentTarget:
        return this.parseAssignmentTargetPattern()
      case NodeType.AssignmentTargetIdentifier:
      case NodeType.ComputedMemberAssignmentTarget:
      case NodeType.StaticMemberAssignmentTarget:
        return this.parseSimpleAssignmentTarget()
      default:
        throw new Error("Unexpected kind: " + kind)
    }
  }

  parseAssignmentTargetPattern(): AssignmentTargetPattern {
    const kind = this.peekTaggedTuple()
    switch (kind) {
      case NodeType.ObjectAssignmentTarget:
        return this.parseObjectAssignmentTarget()
      case NodeType.ArrayAssignmentTarget:
        return this.parseArrayAssignmentTarget()
      default:
        throw new Error("Unexpected kind: " + kind)
    }
  }

  parseObjectAssignmentTarget(): ObjectAssignmentTarget {
    const type = this.parseKind(NodeType.ObjectAssignmentTarget)

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
    const kind = this.peekTaggedTuple()
    switch (kind) {
      case NodeType.AssignmentTargetPropertyIdentifier:
        return this.parseAssignmentTargetPropertyIdentifier()
      case NodeType.AssignmentTargetPropertyProperty:
        return this.parseAssignmentTargetPropertyProperty()
      default:
        throw new Error("Unexpected kind: " + kind)
    }
  }

  parseAssignmentTargetPropertyIdentifier(): AssignmentTargetPropertyIdentifier {
    const type = this.parseKind(NodeType.AssignmentTargetPropertyIdentifier)

    const binding = this.parseAssignmentTargetIdentifier()
    const init = this.parseOptional(() => this.parseExpression())
    return {
      type,
      binding,
      init
    }
  }

  parseAssignmentTargetIdentifier(): AssignmentTargetIdentifier {
    const type = this.parseKind(NodeType.AssignmentTargetIdentifier)

    const name = this.readIdentifierName()
    return {
      type,
      name
    }
  }

  parseAssignmentTargetOrAssignmentTargetWithInitializerList(): FrozenArray<AssignmentTarget | AssignmentTargetWithInitializer> {
    return this.parseList(() => this.parseAssignmentTargetOrAssignmentTargetWithInitializer())
  }

  parseAssignmentTargetOrAssignmentTargetWithInitializer(): AssignmentTarget | AssignmentTargetWithInitializer {
    const kind = this.peekTaggedTuple()
    switch (kind) {
      case NodeType.AssignmentTargetWithInitializer:
        return this.parseAssignmentTargetWithInitializer()
      default:
        return this.parseAssignmentTarget()
    }
  }

  parseAssignmentTargetWithInitializer(): AssignmentTargetWithInitializer {
    const type = this.parseKind(NodeType.AssignmentTargetWithInitializer)

    const binding = this.parseAssignmentTarget()
    const init = this.parseExpression()
    return {
      type,
      binding,
      init
    }
  }

  parseAssignmentTargetPropertyProperty(): AssignmentTargetPropertyProperty {
    const type = this.parseKind(NodeType.AssignmentTargetPropertyProperty)

    const name = this.parsePropertyName()
    const binding = this.parseAssignmentTargetOrAssignmentTargetWithInitializer()
    return {
      type,
      name,
      binding
    }
  }

  parseArrayAssignmentTarget(): ArrayAssignmentTarget {
    const type = this.parseKind(NodeType.ArrayAssignmentTarget)

    const elements = this.parseAssignmentTargetOrAssignmentTargetWithInitializerList()
    const rest = this.parseOptional(() => this.parseAssignmentTarget())
    return {
      type,
      elements,
      rest
    }
  }

  parseSimpleAssignmentTarget(): SimpleAssignmentTarget {
    const kind = this.peekTaggedTuple()
    switch (kind) {
      case NodeType.AssignmentTargetIdentifier:
        return this.parseAssignmentTargetIdentifier()
      case NodeType.ComputedMemberAssignmentTarget:
        return this.parseComputedMemberAssignmentTarget()
      case NodeType.StaticMemberAssignmentTarget:
        return this.parseStaticMemberAssignmentTarget()
      default:
        throw new Error("Unexpected kind: " + kind)
    }
  }

  parseComputedMemberAssignmentTarget(): ComputedMemberAssignmentTarget {
    const type = this.parseKind(NodeType.ComputedMemberAssignmentTarget)

    const _object = this.parseExpressionOrSuper()
    const expression = this.parseExpression()
    return {
      type,
      _object,
      expression
    }
  }

  parseStaticMemberAssignmentTarget(): StaticMemberAssignmentTarget {
    const type = this.parseKind(NodeType.StaticMemberAssignmentTarget)

    const _object = this.parseExpressionOrSuper()
    const property = this.readIdentifierName()
    return {
      type,
      _object,
      property
    }
  }

  parseExpressionOrSuper(): Expression | Super {
    const kind = this.peekTaggedTuple()
    switch (kind) {
      case NodeType.Super:
        return this.parseSuper()
      default:
        return this.parseExpression()
    }
  }

  parseSuper(): Super {
    const type = this.parseKind(NodeType.Super)

    return {
      type
    }
  }

  parseForInOfBinding(): ForInOfBinding {
    const type = this.parseKind(NodeType.ForInOfBinding)

    const kind = this.parseVariableDeclarationKind()
    const binding = this.parseBinding()
    return {
      type,
      kind,
      binding
    }
  }

  parseWhileStatement(): WhileStatement {
    const type = this.parseKind(NodeType.WhileStatement)

    const test = this.parseExpression()
    const body = this.parseStatement()
    return {
      type,
      test,
      body
    }
  }

  parseLabelledStatement(): LabelledStatement {
    const type = this.parseKind(NodeType.LabelledStatement)

    const label = this.readAtom()
    const body = this.parseStatement()
    return {
      type,
      label,
      body
    }
  }

  parseReturnStatement(): ReturnStatement {
    const type = this.parseKind(NodeType.ReturnStatement)

    const expression = this.parseOptional(() => this.parseExpression())
    return {
      type,
      expression
    }
  }

  parseSwitchStatement(): SwitchStatement {
    const type = this.parseKind(NodeType.SwitchStatement)

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
    const type = this.parseKind(NodeType.SwitchCase)

    const test = this.parseExpression()
    const consequent = this.parseStatementList()
    return {
      type,
      test,
      consequent
    }
  }

  parseSwitchStatementWithDefault(): SwitchStatementWithDefault {
    const type = this.parseKind(NodeType.SwitchStatementWithDefault)

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
    const type = this.parseKind(NodeType.SwitchDefault)

    const consequent = this.parseStatementList()
    return {
      type,
      consequent
    }
  }

  parseThrowStatement(): ThrowStatement {
    const type = this.parseKind(NodeType.ThrowStatement)

    const expression = this.parseExpression()
    return {
      type,
      expression
    }
  }

  parseTryCatchStatement(): TryCatchStatement {
    const type = this.parseKind(NodeType.TryCatchStatement)

    const body = this.parseBlock()
    const catchClause = this.parseCatchClause()
    return {
      type,
      body,
      catchClause
    }
  }

  parseCatchClause(): CatchClause {
    const type = this.parseKind(NodeType.CatchClause)

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
    const type = this.parseKind(NodeType.AssertedBoundNamesScope)

    const boundNames = this.parseAssertedBoundNameList()
    const hasDirectEval = this.readBoolean()
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
    const type = this.parseKind(NodeType.AssertedBoundName)

    const name = this.readIdentifierName()
    const isCaptured = this.readBoolean()
    return {
      type,
      name,
      isCaptured
    }
  }

  parseTryFinallyStatement(): TryFinallyStatement {
    const type = this.parseKind(NodeType.TryFinallyStatement)

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
    const type = this.parseKind(NodeType.WithStatement)

    const _object = this.parseExpression()
    const body = this.parseStatement()
    return {
      type,
      _object,
      body
    }
  }
}