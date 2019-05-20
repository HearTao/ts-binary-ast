// Type aliases and enums.

type FrozenArray<T> = ReadonlyArray<T>

type Arguments = FrozenArray<SpreadElement | Expression>

//  Identifier:: IdentifierName but not ReservedWord
type Identifier = string
type IdentifierName = string
type Label = string

enum VariableDeclarationKind {
  Var = "var",
  Let = 'let',
  Const = 'const'
}

enum CompoundAssignmentOperator {
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

enum BinaryOperator {
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

enum UnaryOperator {
  Plus = "+",
  Minus = "-",
  Not = "!",
  LogicNot = "~",
  TypeOf = "typeof",
  Void = "void",
  Delete = "delete"
}

enum UpdateOperator {
  PlusPlus = "++",
  MinusMinus = "--"
}

enum AssertedDeclaredKind {
  Var = "var",
  NonConstLexical = "non-const lexical",
  ConstLexical = "const lexical"
}

// deferred assertions
interface AssertedDeclaredName {
  name: IdentifierName
  kind: AssertedDeclaredKind
  isCaptured: boolean
}

interface AssertedPositionalParameterName {
  index: number
  name: IdentifierName
  isCaptured: boolean
}

interface AssertedRestParameterName {
  name: IdentifierName
  isCaptured: boolean
}

interface AssertedParameterName {
  name: IdentifierName
  isCaptured: boolean
}

type AssertedMaybePositionalParameterName = AssertedPositionalParameterName | AssertedRestParameterName | AssertedParameterName

interface AssertedBoundName {
  name: IdentifierName
  isCaptured: boolean
}

interface AssertedBlockScope {
  declaredNames: FrozenArray<AssertedDeclaredName>
  hasDirectEval: boolean
}

interface AssertedScriptGlobalScope {
  declaredNames: FrozenArray<AssertedDeclaredName>
  hasDirectEval: boolean
}

interface AssertedVarScope {
  declaredNames: FrozenArray<AssertedDeclaredName>
  hasDirectEval: boolean
}

interface AssertedParameterScope {
  paramNames: FrozenArray<AssertedMaybePositionalParameterName>
  hasDirectEval: boolean
  isSimpleParameterList: boolean
}

interface AssertedBoundNamesScope {
  boundNames: FrozenArray<AssertedBoundName>
  hasDirectEval: boolean
}

// nodes

interface Node {
  readonly type: any
}

// bindings

interface BindingIdentifier extends Node {
  name: Identifier
}

type Expression = unknown

type BindingPattern = ObjectBinding | ArrayBinding

type Binding = BindingPattern | BindingIdentifier

type SimpleAssignmentTarget = AssignmentTargetIdentifier | ComputedMemberAssignmentTarget | StaticMemberAssignmentTarget

type AssignmentTargetPattern = ObjectAssignmentTarget | ArrayAssignmentTarget

type AssignmentTarget = AssignmentTargetPattern | SimpleAssignmentTarget

interface BindingWithInitializer extends Node {
  binding: Binding
  init: Expression
}

interface AssignmentTargetIdentifier extends Node {
  name: Identifier
}

interface ComputedMemberAssignmentTarget extends Node {
  _object: Expression | Node
  expression: Expression
}

interface StaticMemberAssignmentTarget extends Node {
  _object: Expression | Node
  property: IdentifierName
}

interface ArrayBinding extends Node {
  elements: FrozenArray<Binding | BindingWithInitializer>
  rest?: Binding
}

interface BindingPropertyIdentifier extends Node {
  binding: BindingIdentifier
  init?: Expression
}


type PropertyName = unknown
interface BindingPropertyProperty extends Node {
  name: PropertyName
  binding: Binding | BindingWithInitializer
}

type BindingProperty = BindingPropertyIdentifier | BindingPropertyProperty

interface ObjectBinding extends Node {
  properties: FrozenArray<BindingProperty>
}

interface AssignmentTargetWithInitializer extends Node {
  binding: AssignmentTarget
  init: Expression
}

interface ArrayAssignmentTarget extends Node {
  elements: FrozenArray<AssignmentTarget | AssignmentTargetWithInitializer>
  rest?: AssignmentTarget
}

interface AssignmentTargetPropertyIdentifier extends Node {
  binding: AssignmentTargetIdentifier
  init?: Expression
}

interface AssignmentTargetPropertyProperty extends Node {
  name: PropertyName
  binding: AssignmentTarget | AssignmentTargetWithInitializer
}

type AssignmentTargetProperty = AssignmentTargetPropertyIdentifier | AssignmentTargetPropertyProperty

interface ObjectAssignmentTarget extends Node {
  properties: FrozenArray<AssignmentTargetProperty>
}

// classes

interface SpreadElement {

}
