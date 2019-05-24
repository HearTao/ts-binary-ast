import MultipartReader from "./reader";
import { Context } from "./context";
import { Program, NodeType, Script, FrozenArray, Directive, Statement, AssertedScriptGlobalScope, AssertedDeclaredName, AssertedDeclaredKind, Variant, Block, AssertedBlockScope, BreakStatement, ContinueStatement, ClassDeclaration, BindingIdentifier, ClassElement, Expression, MethodDefinition, DebuggerStatement, EmptyStatement, ExpressionStatement, EagerFunctionDeclaration, LazyFunctionDeclaration, IfStatement, DoWhileStatement, VariableDeclaration, VariableDeclarator, VariableDeclarationKind, Binding, ForInStatement, ForInOfBinding, AssignmentTarget, ForOfStatement, ForStatement, WhileStatement, LabelledStatement, ReturnStatement, SwitchStatement, SwitchCase, SwitchDefault, SwitchStatementWithDefault, ThrowStatement, TryCatchStatement, CatchClause, AssertedBoundNamesScope, AssertedBoundName, TryFinallyStatement, WithStatement } from "../types";

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

  parse() {
    this.reader.readHeader()
    return this.parseProgram()
  }

  parseList<T>(cb: () => T): FrozenArray<T> {
    const result: T[] = []
    const length = this.reader.readVarnum()
    for (let i = 0; i < length; ++i) {
      result.push(cb())
    }
    return result
  }

  peekTaggedTuple(): NodeType {
    return this.reader.lookAhead(() => this.reader.enterTaggedTuple())
  }

  parseKind<T extends NodeType>(expectedKind: T): T {
    const kind = this.reader.enterTaggedTuple()
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
    this.parseKind(NodeType.Script)

    const scope = this.parseAssertedScriptGlobalScope()
    const directives = this.parseDirectiveList()
    const statements = this.parseStatementList()

    return {
      type: NodeType.Script,
      scope,
      directives,
      statements
    }
  }

  parseAssertedScriptGlobalScope(): AssertedScriptGlobalScope {
    this.parseKind(NodeType.AssertedScriptGlobalScope)

    const declaredNames = this.parseAssertedDeclaredNameList()
    const hasDirectEval = this.reader.readBoolean()
    return {
      type: NodeType.AssertedScriptGlobalScope,
      declaredNames,
      hasDirectEval
    }
  }

  parseAssertedDeclaredNameList() {
    return this.parseList(() => this.parseAssertedDeclaredName())
  }

  parseAssertedDeclaredName(): AssertedDeclaredName {
    this.parseKind(NodeType.AssertedDeclaredName)

    const name = this.reader.readIdentifierName()
    const kind = this.parseAssertedDeclaredKind()
    if (kind === AssertedDeclaredKind.ConstLexical || kind === AssertedDeclaredKind.NonConstLexical) {
      throw new Error("Let Or Const is not supported")
    }

    const isCaptured = this.reader.readBoolean()
    return {
      type: NodeType.AssertedDeclaredName,
      name,
      kind,
      isCaptured
    }
  }

  parseAssertedDeclaredKind(): AssertedDeclaredKind {
    const kind = this.reader.readVariant()
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
    this.parseKind(NodeType.Directive)

    const rawValue = this.reader.readAtom()
    return {
      type: NodeType.Directive,
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
    this.parseKind(NodeType.Block)

    const scope = this.parseAssertedBlockScope()
    const statements = this.parseStatementList()
    return {
      type: NodeType.Block,
      scope,
      statements
    }
  }

  parseAssertedBlockScope(): AssertedBlockScope {
    this.parseKind(NodeType.AssertedBlockScope)

    const declaredNames = this.parseAssertedDeclaredNameList()
    const hasDirectEval = this.reader.readBoolean()

    return {
      type: NodeType.AssertedBlockScope,
      declaredNames,
      hasDirectEval
    }
  }

  parseBreakStatement(): BreakStatement {
    this.parseKind(NodeType.BreakStatement)

    const label = this.reader.readAtom()
    return {
      type: NodeType.BreakStatement,
      label
    }
  }

  parseContinueStatement(): ContinueStatement {
    this.parseKind(NodeType.ContinueStatement)

    const label = this.reader.readAtom()
    return {
      type: NodeType.ContinueStatement,
      label
    }
  }

  parseClassDeclaration(): ClassDeclaration {
    this.parseKind(NodeType.ClassDeclaration)

    const name = this.parseBindingIdentifier()
    const superExpr = this.parseExpression()
    const elements = this.parseClassElementList()
    return {
      type: NodeType.ClassDeclaration,
      name,
      super: superExpr,
      elements
    }
  }

  parseClassElementList(): FrozenArray<ClassElement> {
    return this.parseList(() => this.parseClassElement())
  }

  parseClassElement(): ClassElement {
    this.parseKind(NodeType.ClassElement)

    const isStatic = this.reader.readBoolean()
    const method = this.parseMethodDefinition()
    return {
      type: NodeType.ClassElement,
      isStatic,
      method
    }
  }

  parseMethodDefinition(): MethodDefinition {
    const kind = this.peekTaggedTuple()
    switch (kind) {
      case NodeType.EagerMethod:
      case NodeType.LazyMethod:
      case NodeType.EagerGetter:
      case NodeType.LazyGetter:
      case NodeType.EagerSetter:
      case NodeType.LazySetter:
      default:
        throw new Error("Unexpected method definition")
    }
  }

  parseBindingIdentifier(): BindingIdentifier {
    this.parseKind(NodeType.BindingIdentifier)

    const name = this.reader.readIdentifierName()
    return {
      type: NodeType.BindingIdentifier,
      name
    }
  }

  parseDebuggerStatement(): DebuggerStatement {
    this.parseKind(NodeType.DebuggerStatement)

    return {
      type: NodeType.DebuggerStatement,
    }
  }

  parseEmptyStatement(): EmptyStatement {
    this.parseKind(NodeType.EmptyStatement)

    return {
      type: NodeType.EmptyStatement
    }
  }

  parseExpressionStatement(): ExpressionStatement {
    this.parseKind(NodeType.ExpressionStatement)

    const expression = this.parseExpression()
    return {
      type: NodeType.ExpressionStatement,
      expression
    }
  }

  parseEagerFunctionDeclaration(): EagerFunctionDeclaration {
    this.parseKind(NodeType.EagerFunctionDeclaration)

    throw new Error("Not implements EagerFunctionDeclaration")
  }

  parseLazyFunctionDeclaration(): LazyFunctionDeclaration {
    this.parseKind(NodeType.LazyFunctionDeclaration)

    throw new Error("Not implements LazyFunctionDeclaration")
  }

  parseIfStatement(): IfStatement {
    this.parseKind(NodeType.IfStatement)

    const test = this.parseExpression()
    const consequent = this.parseStatement()
    const alternate = this.parseStatement()
    return {
      type: NodeType.IfStatement,
      test,
      consequent,
      alternate
    }
  }

  parseDoWhileStatement(): DoWhileStatement {
    this.parseKind(NodeType.DoWhileStatement)

    const test = this.parseExpression()
    const body = this.parseStatement()
    return {
      type: NodeType.DoWhileStatement,
      test,
      body
    }
  }

  parseVariableDeclaration(): VariableDeclaration {
    this.parseKind(NodeType.VariableDeclaration)
    
    const kind = this.parseVariableDeclarationKind()
    const declarators = this.parseVariableDeclaratorList()
    return {
      type: NodeType.VariableDeclaration,
      kind,
      declarators
    }
  }

  parseVariableDeclarationKind(): VariableDeclarationKind {
    const variant = this.reader.readVariant()
    switch (variant) {
      case Variant.Let:
        return VariableDeclarationKind.Let
      case Variant.Const:
        return VariableDeclarationKind.Const
      case Variant.AssertedDeclaredKindOrVariableDeclarationKindVar:
          return VariableDeclarationKind.Var
      default:
        throw new Error("Invalid Variant: " + variant)
    }
  }

  parseVariableDeclaratorList(): FrozenArray<VariableDeclarator> {
    return this.parseList(() => this.parseVariableDeclarator())
  }

  parseVariableDeclarator(): VariableDeclarator {
    this.parseKind(NodeType.VariableDeclarator)

    const binding = this.parseBinding()
    const init = this.parseExpression()
    return {
      type: NodeType.VariableDeclarator,
      binding,
      init
    }
  }

  parseBinding(): Binding {
    const kind = this.peekTaggedTuple()
    switch (kind) {
      case NodeType.ObjectBinding:
      case NodeType.ArrayBinding:
      case NodeType.BindingIdentifier:
      default:
        throw new Error("Not implements Binding")
    }
  }

  parseForInStatement(): ForInStatement {
    this.parseKind(NodeType.ForInStatement)

    const left = this.parseForInOfBindingOrAssignmentTarget()
    const right = this.parseExpression()
    const body = this.parseStatement()
    return {
      type: NodeType.ForInStatement,
      left,
      right,
      body
    }
  }

  parseForOfStatement(): ForOfStatement {
    this.parseKind(NodeType.ForOfStatement)

    const left = this.parseForInOfBindingOrAssignmentTarget()
    const right = this.parseExpression()
    const body = this.parseStatement()
    return {
      type: NodeType.ForOfStatement,
      left,
      right,
      body
    }
  }

  parseForStatement(): ForStatement {
    this.parseKind(NodeType.ForStatement)

    const init = this.parseVariableDeclarationOrExpression()
    const test = this.parseExpression()
    const update = this.parseExpression()
    const body = this.parseStatement()
    return {
      type: NodeType.ForStatement,
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
        throw new Error("Not implements parseVariableDeclarationOrExpression")
    }
  }

  parseForInOfBindingOrAssignmentTarget(): ForInOfBinding | AssignmentTarget {
    const kind = this.peekTaggedTuple()
    switch (kind) {
      case NodeType.ForInOfBinding:
      case NodeType.ObjectAssignmentTarget:
      case NodeType.ArrayAssignmentTarget:
      case NodeType.AssignmentTargetIdentifier:
      case NodeType.ComputedMemberAssignmentTarget:
      case NodeType.StaticMemberAssignmentTarget:
      default:
          throw new Error("Not implements parseForInOfBindingOrAssignmentTarget")
    }
  }

  parseWhileStatement(): WhileStatement {
    this.parseKind(NodeType.WhileStatement)

    const test = this.parseExpression()
    const body = this.parseStatement()
    return {
      type: NodeType.WhileStatement,
      test,
      body
    }
  }

  parseLabelledStatement(): LabelledStatement {
    this.parseKind(NodeType.LabelledStatement)

    const label = this.reader.readAtom()
    const body = this.parseStatement()
    return {
      type: NodeType.LabelledStatement,
      label,
      body
    }
  }

  parseReturnStatement(): ReturnStatement {
    const type = this.parseKind(NodeType.ReturnStatement)

    const expression = this.parseExpression()
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
    const hasDirectEval = this.reader.readBoolean()
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

    const name = this.reader.readIdentifierName()
    const isCaptured = this.reader.readBoolean()
    return {
      type,
      name,
      isCaptured
    }
  }

  parseTryFinallyStatement(): TryFinallyStatement {
    const type = this.parseKind(NodeType.TryFinallyStatement)

    const body = this.parseBlock()
    const catchClause = this.parseCatchClause()
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