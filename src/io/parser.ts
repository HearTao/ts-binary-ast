import MultipartReader from "./reader";
import { Context } from "./context";
import { Program, NodeType, Script, FrozenArray, Directive, Statement, AssertedScriptGlobalScope, AssertedDeclaredName, AssertedDeclaredKind, Variant } from "../types";

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

  parse () {
    this.reader.readHeader()
    this.parseProgram()
  }

  parseList<T> (cb: () => T): FrozenArray<T> {
    const result: T[] = []
    const length = this.reader.readVarnum()
    for (let i = 0; i < length; ++i) {
      result.push(cb())
    }
    return result
  }

  parseKind (expectedKind: NodeType) {
    const kind = this.reader.enterTaggedTuple()
    if (kind !== expectedKind) {
      throw new Error("Invalid Kind: " + expectedKind)
    }
  }

  parseProgram(): Program {
    const kind = this.reader.enterTaggedTuple()
    switch (kind) {
      case NodeType.Script:
        return this.parseScript()
      case NodeType.Module:
      default:
        throw new Error("Invalid Kind: " + kind)
    }
  }

  parseScript (): Script {
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
    const kind = this.reader.enterTaggedTuple()
    console.log(kind)
    return {} as any
  }
}