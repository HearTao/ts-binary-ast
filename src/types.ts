// Type aliases and enums.

export type FrozenArray<T> = ReadonlyArray<T>

export type Arguments = FrozenArray<SpreadElement | Expression>

//  Identifier:: IdentifierName but not ReservedWord
export type Identifier = string
export type IdentifierName = string
export type Label = string

export enum VariableDeclarationKind {
  Var = "var",
  Let = 'let',
  Const = 'const'
}

export enum CompoundAssignmentOperator {
  PlusEqual = "+=",
  MinusEqual = "-=",
  StarEqual = "*=",
  DivEuqal = "/=",
  ModEqual = "%=",
  StarStarEqual = "**=",
  LessThanLessThanEqual = "<<=",
  GreaterThanGreaterThanEequal = ">>=",
  GreaterThanGreaterThanGreaterThanEequal = ">>>=",
  LoginOrEqual = "|=",
  LogicAndEuqal = "&=",
  LogicXorEqual = "^=",
}

export enum BinaryOperator {
  Comma = ",",
  Or = "||",
  And = "&&",
  LogicOr = "|",
  LogicXor = "^",
  LogicAnd = "&",
  EqualEqual = "==",
  NotEqual = "!=",
  EqualEqualEqual = "===",
  NotEqualEqual = "!==",
  LessThan = "<",
  LessThanEqual = "<=",
  GreaterThan = ">",
  GreaterThanEqual = ">=",
  In = "in",
  InstanceOf = "instanceof",
  LessThanLessThan = "<<",
  GreaterThanGreaterThan = ">>",
  GreaterThanGreaterThanGreaterThan = ">>>",
  Plus = "+",
  Minus = "-",
  Star = "*",
  Div = "/",
  Mod = "%",
  StarStar = "**"
}

export enum UnaryOperator {
  Plus = "+",
  Minus = "-",
  Not = "!",
  LogicNot = "~",
  TypeOf = "typeof",
  Void = "void",
  Delete = "delete"
}

export enum UpdateOperator {
  PlusPlus = "++",
  MinusMinus = "--"
}

export enum AssertedDeclaredKind {
  Var = "var",
  NonConstLexical = "non-const lexical",
  ConstLexical = "const lexical"
}

// deferred assertions
export interface AssertedDeclaredName {
  name: IdentifierName
  kind: AssertedDeclaredKind
  isCaptured: boolean
}

export interface AssertedPositionalParameterName {
  index: number
  name: IdentifierName
  isCaptured: boolean
}

export interface AssertedRestParameterName {
  name: IdentifierName
  isCaptured: boolean
}

export interface AssertedParameterName {
  name: IdentifierName
  isCaptured: boolean
}

export type AssertedMaybePositionalParameterName = AssertedPositionalParameterName | AssertedRestParameterName | AssertedParameterName

export interface AssertedBoundName {
  name: IdentifierName
  isCaptured: boolean
}

export interface AssertedBlockScope {
  declaredNames: FrozenArray<AssertedDeclaredName>
  hasDirectEval: boolean
}

export interface AssertedScriptGlobalScope {
  declaredNames: FrozenArray<AssertedDeclaredName>
  hasDirectEval: boolean
}

export interface AssertedVarScope {
  declaredNames: FrozenArray<AssertedDeclaredName>
  hasDirectEval: boolean
}

export interface AssertedParameterScope {
  paramNames: FrozenArray<AssertedMaybePositionalParameterName>
  hasDirectEval: boolean
  isSimpleParameterList: boolean
}

export interface AssertedBoundNamesScope {
  boundNames: FrozenArray<AssertedBoundName>
  hasDirectEval: boolean
}

export enum NodeType {
  BindingIdentifier = "BindingIdentifier",
  BindingWithInitializer = "BindingWithInitializer",
  AssignmentTargetIdentifier = "AssignmentTargetIdentifier",
  ComputedMemberAssignmentTarget = "ComputedMemberAssignmentTarget",
  StaticMemberAssignmentTarget = "StaticMemberAssignmentTarget",
  ArrayBinding = "ArrayBinding",
  BindingPropertyIdentifier = "BindingPropertyIdentifier",
  BindingPropertyProperty = "BindingPropertyProperty",
  ObjectBinding = "ObjectBinding",
  AssignmentTargetWithInitializer = "AssignmentTargetWithInitializer",
  ArrayAssignmentTarget = "ArrayAssignmentTarget",
  AssignmentTargetPropertyIdentifier = "AssignmentTargetPropertyIdentifier",
  AssignmentTargetPropertyProperty = "AssignmentTargetPropertyProperty",
  ObjectAssignmentTarget = "ObjectAssignmentTarget",
  ClassExpression = "ClassExpression",
  ClassDeclaration = "ClassDeclaration",
  ClassElement = "ClassElement",
  Module = "Module",
  Import = "Import",
  ImportNamespace = "ImportNamespace",
  ImportSpecifier = "ImportSpecifier",
  ExportAllFrom = "ExportAllFrom",
  ExportFrom = "ExportFrom",
  ExportLocals = "ExportLocals",
  Export = "Export",
  ExportDefault = "ExportDefault",
  ExportFromSpecifier = "ExportFromSpecifier",
  ExportLocalSpecifier = "ExportLocalSpecifier",
  EagerMethod = "EagerMethod",
  LazyMethod = "LazyMethod",
  EagerGetter = "EagerGetter",
  LazyGetter = "LazyGetter",
  GetterContents = "GetterContents",
  EagerSetter = "EagerSetter",
  LazySetter = "LazySetter",
  SetterContents = "SetterContents",
  DataProperty = "DataProperty",
  ShorthandProperty = "ShorthandProperty",
  ComputedPropertyName = "ComputedPropertyName",
  LiteralPropertyName = "LiteralPropertyName",
  LiteralBooleanExpression = "LiteralBooleanExpression",
  LiteralInfinityExpression = "LiteralInfinityExpression",
  LiteralNullExpression = "LiteralNullExpression",
  LiteralNumericExpression = "LiteralNumericExpression",
  LiteralRegExpExpression = "LiteralRegExpExpression",
  LiteralStringExpression = "LiteralStringExpression",
  ArrayExpression = "ArrayExpression",
  EagerArrowExpressionWithFunctionBody = "EagerArrowExpressionWithFunctionBody",
  LazyArrowExpressionWithFunctionBody = "LazyArrowExpressionWithFunctionBody",
  EagerArrowExpressionWithExpression = "EagerArrowExpressionWithExpression",
  LazyArrowExpressionWithExpression = "LazyArrowExpressionWithExpression",
  ArrowExpressionContentsWithFunctionBody = "ArrowExpressionContentsWithFunctionBody",
  ArrowExpressionContentsWithExpression = "ArrowExpressionContentsWithExpression",
  AssignmentExpression = "AssignmentExpression",
  BinaryExpression = "BinaryExpression",
  CallExpression = "CallExpression",
  CompoundAssignmentExpression = "CompoundAssignmentExpression",
  ComputedMemberExpression = "ComputedMemberExpression",
  ConditionalExpression = "ConditionalExpression",
  EagerFunctionExpression = "EagerFunctionExpression",
  LazyFunctionExpression = "LazyFunctionExpression",
  FunctionExpressionContents = "FunctionExpressionContents",
  IdentifierExpression = "IdentifierExpression",
  NewExpression = "NewExpression",
  NewTargetExpression = "NewTargetExpression",
  ObjectExpression = "ObjectExpression",
  UnaryExpression = "UnaryExpression",
  StaticMemberExpression = "StaticMemberExpression",
  TemplateExpression = "TemplateExpression",
  ThisExpression = "ThisExpression",
  UpdateExpression = "UpdateExpression",
  YieldExpression = "YieldExpression",
  YieldStarExpression = "YieldStarExpression",
  AwaitExpression = "AwaitExpression",
  BreakStatement = "BreakStatement",
  ContinueStatement = "ContinueStatement",
  DebuggerStatement = "DebuggerStatement",
  DoWhileStatement = "DoWhileStatement",
  EmptyStatement = "EmptyStatement",
  ExpressionStatement = "ExpressionStatement",
  ForInOfBinding = "ForInOfBinding",
  ForInStatement = "ForInStatement",
  ForOfStatement = "ForOfStatement",
  ForStatement = "ForStatement",
  IfStatement = "IfStatement",
  LabelledStatement = "LabelledStatement",
  ReturnStatement = "ReturnStatement",
  SwitchStatement = "SwitchStatement",
  SwitchStatementWithDefault = "SwitchStatementWithDefault",
  ThrowStatement = "ThrowStatement",
  TryCatchStatement = "TryCatchStatement",
  TryFinallyStatement = "TryFinallyStatement",
  WhileStatement = "WhileStatement",
  WithStatement = "WithStatement",
  Block = "Block",
  CatchClause = "CatchClause",
  Directive = "Directive",
  FormalParameters = "FormalParameters",
  EagerFunctionDeclaration = "EagerFunctionDeclaration",
  LazyFunctionDeclaration = "LazyFunctionDeclaration",
  FunctionOrMethodContents = "FunctionOrMethodContents",
  Script = "Script",
  SpreadElement = "SpreadElement",
  Super = "Super",
  SwitchCase = "SwitchCase",
  SwitchDefault = "SwitchDefault",
  TemplateElement = "TemplateElement",
  VariableDeclaration = "VariableDeclaration",
  VariableDeclarator = "VariableDeclarator"
}

// nodes

export interface Node {
  readonly type: NodeType
}

export type Program = Script | Module

export type IterationStatement = DoWhileStatement | ForInStatement | ForOfStatement | ForStatement | WhileStatement

export type Statement = Block | BreakStatement | ContinueStatement | ClassDeclaration | DebuggerStatement | EmptyStatement | ExpressionStatement | FunctionDeclaration | IfStatement | IterationStatement | LabelledStatement | ReturnStatement | SwitchStatement | SwitchStatementWithDefault | ThrowStatement | TryCatchStatement | TryFinallyStatement | VariableDeclaration | WithStatement

export type Literal = LiteralBooleanExpression | LiteralInfinityExpression | LiteralNullExpression | LiteralNumericExpression | LiteralStringExpression

export type Expression = Literal | LiteralRegExpExpression | ArrayExpression | ArrowExpression | AssignmentExpression | BinaryExpression | CallExpression | CompoundAssignmentExpression | ComputedMemberExpression | ConditionalExpression | ClassExpression | FunctionExpression | IdentifierExpression | NewExpression | NewTargetExpression | ObjectExpression | UnaryExpression | StaticMemberExpression | TemplateExpression | ThisExpression | UpdateExpression | YieldExpression | YieldStarExpression | AwaitExpression

export type PropertyName = ComputedPropertyName | LiteralPropertyName

export type MethodDefinition = Method | Getter | Setter

export type ObjectProperty = MethodDefinition | DataProperty | ShorthandProperty

export type ExportDeclaration = ExportAllFrom | ExportFrom | ExportLocals | ExportDefault | Export

export type ImportDeclaration = ImportNamespace | Import

export type FunctionDeclaration = EagerFunctionDeclaration | LazyFunctionDeclaration

export type FunctionExpression = EagerFunctionExpression | LazyFunctionExpression

export type Method = EagerMethod | LazyMethod

export type Getter = EagerGetter | LazyGetter

export type Setter = EagerSetter | LazySetter

export type ArrowExpression = EagerArrowExpressionWithFunctionBody | LazyArrowExpressionWithFunctionBody | EagerArrowExpressionWithExpression | LazyArrowExpressionWithExpression

// bindings

export interface BindingIdentifier extends Node {
  type: NodeType.BindingIdentifier
  name: Identifier
}

export type BindingPattern = ObjectBinding | ArrayBinding

export type Binding = BindingPattern | BindingIdentifier

export type SimpleAssignmentTarget = AssignmentTargetIdentifier | ComputedMemberAssignmentTarget | StaticMemberAssignmentTarget

export type AssignmentTargetPattern = ObjectAssignmentTarget | ArrayAssignmentTarget

export type AssignmentTarget = AssignmentTargetPattern | SimpleAssignmentTarget

export type Parameter = Binding | BindingWithInitializer

export interface BindingWithInitializer extends Node {
  type: NodeType.BindingWithInitializer
  binding: Binding
  init: Expression
}

export interface AssignmentTargetIdentifier extends Node {
  type: NodeType.AssignmentTargetIdentifier
  name: Identifier
}

export interface ComputedMemberAssignmentTarget extends Node {
  type: NodeType.ComputedMemberAssignmentTarget
  _object: Expression | Super
  expression: Expression
}

export interface StaticMemberAssignmentTarget extends Node {
  type: NodeType.StaticMemberAssignmentTarget
  _object: Expression | Super
  property: IdentifierName
}

export interface ArrayBinding extends Node {
  type: NodeType.ArrayBinding
  elements: FrozenArray<Binding | BindingWithInitializer>
  rest?: Binding
}

export interface BindingPropertyIdentifier extends Node {
  type: NodeType.BindingPropertyIdentifier
  binding: BindingIdentifier
  init?: Expression
}

export interface BindingPropertyProperty extends Node {
  type: NodeType.BindingPropertyProperty
  name: PropertyName
  binding: Binding | BindingWithInitializer
}

export type BindingProperty = BindingPropertyIdentifier | BindingPropertyProperty

export interface ObjectBinding extends Node {
  type: NodeType.ObjectBinding
  properties: FrozenArray<BindingProperty>
}

export interface AssignmentTargetWithInitializer extends Node {
  type: NodeType.AssignmentTargetWithInitializer
  binding: AssignmentTarget
  init: Expression
}

export interface ArrayAssignmentTarget extends Node {
  type: NodeType.ArrayAssignmentTarget
  elements: FrozenArray<AssignmentTarget | AssignmentTargetWithInitializer>
  rest?: AssignmentTarget
}

export interface AssignmentTargetPropertyIdentifier extends Node {
  type: NodeType.AssignmentTargetPropertyIdentifier
  binding: AssignmentTargetIdentifier
  init?: Expression
}

export interface AssignmentTargetPropertyProperty extends Node {
  type: NodeType.AssignmentTargetPropertyProperty
  name: PropertyName
  binding: AssignmentTarget | AssignmentTargetWithInitializer
}

export type AssignmentTargetProperty = AssignmentTargetPropertyIdentifier | AssignmentTargetPropertyProperty

export interface ObjectAssignmentTarget extends Node {
  type: NodeType.ObjectAssignmentTarget
  properties: FrozenArray<AssignmentTargetProperty>
}

// classes

export interface ClassExpression extends Node {
  type: NodeType.ClassExpression
  name?: BindingIdentifier
  super?: Expression
  elements: FrozenArray<ClassElement>
}

export interface ClassDeclaration extends Node {
  type: NodeType.ClassDeclaration
  name: BindingIdentifier
  super?: Expression
  elements: FrozenArray<ClassElement>
}

export interface ClassElement extends Node {
  type: NodeType.ClassElement
  isStatic: boolean
  method: MethodDefinition
}

// modules

export interface Module extends Node {
  type: NodeType.Module
  scope: AssertedVarScope
  directives: FrozenArray<Directive>
  items: FrozenArray<ImportDeclaration | ExportDeclaration | Statement>
}

export interface Import extends Node {
  type: NodeType.Import
  moduleSpecifier: string
  defaultBinding?: BindingIdentifier
  namedImports: FrozenArray<ImportSpecifier>
}

export interface ImportNamespace extends Node {
  type: NodeType.ImportNamespace
  moduleSpecifier: string
  defaultBinding?: BindingIdentifier
  namespaceBinding: BindingIdentifier
}

export interface ImportSpecifier extends Node {
  type: NodeType.ImportSpecifier
  name: IdentifierName
  binding: BindingIdentifier
}

export interface ExportAllFrom extends Node {
  type: NodeType.ExportAllFrom
  moduleSpecifier: string
}

export interface ExportFrom extends Node {
  type: NodeType.ExportFrom
  namedExports: FrozenArray<ExportFromSpecifier>
  moduleSpecifier: string
}

export interface ExportLocals extends Node {
  type: NodeType.ExportLocals
  namedExports: FrozenArray<ExportLocalSpecifier>
}

export interface Export extends Node {
  type: NodeType.Export
  declaration: FunctionDeclaration | ClassDeclaration | FunctionDeclaration
}

export interface ExportDefault extends Node {
  type: NodeType.ExportDefault
  body: FunctionDeclaration | ClassDeclaration | Expression
}

export interface ExportFromSpecifier extends Node {
  type: NodeType.ExportFromSpecifier
  name: IdentifierName
  exportedName?: IdentifierName
}

export interface ExportLocalSpecifier extends Node {
  type: NodeType.ExportLocalSpecifier
  name: IdentifierExpression
  exportedName?: IdentifierName
}

// property definition

export interface EagerMethod extends Node {
  type: NodeType.EagerMethod
  isAsync: boolean
  isGenerator: boolean
  name: PropertyName
  length: number
  directives: FrozenArray<Directive>
  contents: FunctionOrMethodContents
}

export interface LazyMethod extends Node {
  type: NodeType.LazyMethod
  isAsync: boolean
  isGenerator: boolean
  name: PropertyName
  length: number
  directives: FrozenArray<Directive>
  contents: FunctionOrMethodContents
}

export interface EagerGetter extends Node {
  type: NodeType.EagerGetter
  name: PropertyName
  directives: FrozenArray<Directive>
  contents: GetterContents
}

export interface LazyGetter extends Node {
  type: NodeType.LazyGetter
  name: PropertyName
  directives: FrozenArray<Directive>
  contents: GetterContents
}

export interface GetterContents extends Node {
  type: NodeType.GetterContents
  isThisCaptured: boolean
  bodyScope: AssertedVarScope
  body: FunctionBody
}

export interface EagerSetter extends Node {
  type: NodeType.EagerSetter
  name: PropertyName
  length: number
  directives: FrozenArray<Directive>
  contents: SetterContents
}

export interface LazySetter extends Node {
  type: NodeType.LazySetter
  name: PropertyName
  length: number
  directives: FrozenArray<Directive>
  contents: SetterContents
}

export interface SetterContents extends Node {
  type: NodeType.SetterContents
  isThisCaptured: boolean
  parameterScope: AssertedParameterScope
  param: Parameter
  bodyScope: AssertedVarScope
  body: FunctionBody
}

export interface DataProperty extends Node {
  type: NodeType.DataProperty
  name: PropertyName
  expression: Expression
}

export interface ShorthandProperty extends Node {
  type: NodeType.ShorthandProperty
  name: IdentifierExpression
}

export interface ComputedPropertyName extends Node {
  type: NodeType.ComputedPropertyName
  expression: Expression
}

export interface LiteralPropertyName extends Node {
  type: NodeType.LiteralPropertyName
  value: string
}

// literals

export interface LiteralBooleanExpression extends Node {
  type: NodeType.LiteralBooleanExpression
  value: boolean
}

export interface LiteralInfinityExpression extends Node {
  type: NodeType.LiteralInfinityExpression
}

export interface LiteralNullExpression extends Node {
  type: NodeType.LiteralNullExpression
}

export interface LiteralNumericExpression extends Node {
  type: NodeType.LiteralNumericExpression
  value: number
}

export interface LiteralRegExpExpression extends Node {
  type: NodeType.LiteralRegExpExpression
  pattern: string
  flags: string
}

export interface LiteralStringExpression extends Node {
  type: NodeType.LiteralStringExpression
  value: string
}

// other expressions

export interface ArrayExpression extends Node {
  type: NodeType.ArrayExpression
  elements: FrozenArray<SpreadElement | Expression>
}

export interface EagerArrowExpressionWithFunctionBody extends Node {
  type: NodeType.EagerArrowExpressionWithFunctionBody
  isAsync: boolean
  length: number
  directives: FrozenArray<Directive>
  contents: ArrowExpressionContentsWithFunctionBody
}

export interface LazyArrowExpressionWithFunctionBody extends Node {
  type: NodeType.LazyArrowExpressionWithFunctionBody
  isAsync: boolean
  length: number
  directives: FrozenArray<Directive>
  contents: ArrowExpressionContentsWithFunctionBody
}

export interface EagerArrowExpressionWithExpression extends Node {
  type: NodeType.EagerArrowExpressionWithExpression
  isAsync: boolean
  length: number
  contents: ArrowExpressionContentsWithExpression
}

export interface LazyArrowExpressionWithExpression extends Node {
  type: NodeType.LazyArrowExpressionWithExpression
  isAsync: boolean
  length: number
  contents: ArrowExpressionContentsWithExpression
}

export interface ArrowExpressionContentsWithFunctionBody extends Node {
  type: NodeType.ArrowExpressionContentsWithFunctionBody
  parameterScope: AssertedParameterScope
  params: FormalParameters
  bodyScope: AssertedVarScope
  body: FunctionBody
}

export interface ArrowExpressionContentsWithExpression extends Node {
  type: NodeType.ArrowExpressionContentsWithExpression
  parameterScope: AssertedParameterScope
  params: FormalParameters
  bodyScope: AssertedVarScope
  body: Expression
}

export interface AssignmentExpression extends Node {
  type: NodeType.AssignmentExpression
  binding: AssignmentTarget
  expression: Expression
}

export interface BinaryExpression extends Node {
  type: NodeType.BinaryExpression
  operator: BinaryOperator
  left: Expression
  right: Expression
}

export interface CallExpression extends Node {
  type: NodeType.CallExpression
  callee: Expression | Super
  arguments: Arguments
}

export interface CompoundAssignmentExpression extends Node {
  type: NodeType.CompoundAssignmentExpression
  operator: CompoundAssignmentOperator
  binding: SimpleAssignmentTarget
  expression: Expression
}

export interface ComputedMemberExpression extends Node {
  type: NodeType.ComputedMemberExpression
  _object: Expression | Super
  expression: Expression
}

export interface ConditionalExpression extends Node {
  type: NodeType.ConditionalExpression
  test: Expression
  consequent: Expression
  alternate: Expression
}

export interface EagerFunctionExpression extends Node {
  type: NodeType.EagerFunctionExpression
  isAsync: boolean
  isGenerator: boolean
  name?: BindingIdentifier
  length: number
  directives: FrozenArray<Directive>
  contents: FunctionExpressionContents
}

export interface LazyFunctionExpression extends Node {
  type: NodeType.LazyFunctionExpression
  isAsync: boolean
  isGenerator: boolean
  name?: BindingIdentifier
  length: number
  directives: FrozenArray<Directive>
  contents: FunctionExpressionContents
}

export interface FunctionExpressionContents extends Node {
  type: NodeType.FunctionExpressionContents
  isFunctionNameCaptured: boolean
  isThisCaptured: boolean
  parameterScope: AssertedParameterScope
  params: FormalParameters
  bodyScope: AssertedVarScope
  body: FunctionBody
}

export interface IdentifierExpression extends Node {
  type: NodeType.IdentifierExpression
  name: Identifier
}

export interface NewExpression extends Node {
  type: NodeType.NewExpression
  callee: Expression
  arguments: Arguments
}

export interface NewTargetExpression extends Node {
  type: NodeType.NewTargetExpression

}

export interface ObjectExpression extends Node {
  type: NodeType.ObjectExpression
  properties: FrozenArray<ObjectProperty>
}

export interface UnaryExpression extends Node {
  type: NodeType.UnaryExpression
  operator: UnaryOperator
  operand: Expression
}

export interface StaticMemberExpression extends Node {
  type: NodeType.StaticMemberExpression
  _object: Expression | Super
  property: IdentifierName
}

export interface TemplateExpression extends Node {
  type: NodeType.TemplateExpression
  tag?: Expression
  elements: FrozenArray<Expression | TemplateElement>
}

export interface ThisExpression extends Node {
  type: NodeType.ThisExpression

}

export interface UpdateExpression extends Node {
  type: NodeType.UpdateExpression
  isPrefix: boolean
  operator: UpdateOperator
  operand: SimpleAssignmentTarget
}

export interface YieldExpression extends Node {
  type: NodeType.YieldExpression
  expression?: Expression
}

export interface YieldStarExpression extends Node {
  type: NodeType.YieldStarExpression
  expression: Expression
}

export interface AwaitExpression extends Node {
  type: NodeType.AwaitExpression
  expression: Expression
}

// other statements

export interface BreakStatement extends Node {
  type: NodeType.BreakStatement
  label?: Label
}

export interface ContinueStatement extends Node {
  type: NodeType.ContinueStatement
  label?: Label
}

export interface DebuggerStatement extends Node {
  type: NodeType.DebuggerStatement

}

export interface DoWhileStatement extends Node {
  type: NodeType.DoWhileStatement
  test: Expression
  body: Statement
}

export interface EmptyStatement extends Node { }
type: NodeType.EmptyStatement

export interface ExpressionStatement extends Node {
  type: NodeType.ExpressionStatement
  expression: Expression
}

export interface ForInOfBinding extends Node {
  type: NodeType.ForInOfBinding
  kind: VariableDeclarationKind
  binding: Binding
}

export interface ForInStatement extends Node {
  type: NodeType.ForInStatement
  left: ForInOfBinding | AssignmentTarget
  right: Expression
  bod: Statement
}

export interface ForOfStatement extends Node {
  type: NodeType.ForOfStatement
  left: ForInOfBinding | AssignmentTarget
  right: Expression
  bod: Statement
}

export interface ForStatement extends Node {
  type: NodeType.ForStatement
  init?: VariableDeclaration | Expression
  test?: Expression
  update?: Expression
  body: Statement
}

export interface IfStatement extends Node {
  type: NodeType.IfStatement
  test: Expression
  consequent: Statement
  alternate?: Statement
}

export interface LabelledStatement extends Node {
  type: NodeType.LabelledStatement
  label: Label
  body: Statement
}

export interface ReturnStatement extends Node {
  type: NodeType.ReturnStatement
  expression?: Expression
}

export interface SwitchStatement extends Node {
  type: NodeType.SwitchStatement
  discriminant: Expression
  cases: FrozenArray<SwitchCase>
}

export interface SwitchStatementWithDefault extends Node {
  type: NodeType.SwitchStatementWithDefault
  discriminant: Expression
  preDefaultCases: FrozenArray<SwitchCase>
  defaultCase: SwitchDefault
  postDefaultCases: FrozenArray<SwitchCase>
}

export interface ThrowStatement extends Node {
  type: NodeType.ThrowStatement
  expression: Expression
}

export interface TryCatchStatement extends Node {
  type: NodeType.TryCatchStatement
  body: Block
  catchClause: CatchClause
}

export interface TryFinallyStatement extends Node {
  type: NodeType.TryFinallyStatement
  body: Block
  catchClause?: CatchClause
  finalizer: Block
}

export interface WhileStatement extends Node {
  type: NodeType.WhileStatement
  test: Expression
  body: Statement
}

export interface WithStatement extends Node {
  type: NodeType.WithStatement
  _object: Expression
  body: Statement
}

// other nodes

export interface Block extends Node {
  type: NodeType.Block
  scope: AssertedBlockScope
  statements: FrozenArray<Statement>
}

export interface CatchClause extends Node {
  type: NodeType.CatchClause
  bindingScope: AssertedBoundNamesScope
  binding: Binding
  body: Block
}

export interface Directive extends Node {
  type: NodeType.Directive
  rawValue: string
}

export interface FormalParameters extends Node {
  type: NodeType.FormalParameters
  items: FrozenArray<Parameter>
  rest?: Binding
}

export type FunctionBody = FrozenArray<Statement>

export interface EagerFunctionDeclaration extends Node {
  type: NodeType.EagerFunctionDeclaration
  isAsync: boolean
  isGenerator: boolean
  name: BindingIdentifier
  length: number
  directives: FrozenArray<Directive>
  contents: FunctionOrMethodContents
}

export interface LazyFunctionDeclaration extends Node {
  type: NodeType.LazyFunctionDeclaration
  isAsync: boolean
  isGenerator: boolean
  name: BindingIdentifier
  length: number
  directives: FrozenArray<Directive>
  contents: FunctionOrMethodContents
}

export interface FunctionOrMethodContents extends Node {
  type: NodeType.FunctionOrMethodContents
  isThisCaptured: boolean
  parameterScope: AssertedParameterScope
  params: FormalParameters
  bodyScope: AssertedVarScope
  body: FunctionBody
}

export interface Script extends Node {
  type: NodeType.Script
  scope: AssertedScriptGlobalScope
  directives: FrozenArray<Directive>
  statements: FrozenArray<Statement>
}

export interface SpreadElement extends Node {
  type: NodeType.SpreadElement
  expression: Expression
}

export interface Super extends Node {
  type: NodeType.Super
}


export interface SwitchCase extends Node {
  type: NodeType.SwitchCase
  test: Expression
  consequent: FrozenArray<Statement>
}

export interface SwitchDefault extends Node {
  type: NodeType.SwitchDefault
  consequent: FrozenArray<Statement>
}

export interface TemplateElement extends Node {
  type: NodeType.TemplateElement
  rawValue: string
}

export interface VariableDeclaration extends Node {
  type: NodeType.VariableDeclaration
  kind: VariableDeclarationKind
  declarators: FrozenArray<VariableDeclarator>
}

export interface VariableDeclarator extends Node {
  type: NodeType.VariableDeclarator
  binding: Binding
  init?: Expression
}
