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

export enum Variant {
  Let,
  Const,
  PlusEqual,
  MinusEqual,
  StarEqual,
  DivEuqal,
  ModEqual,
  StarStarEqual,
  LessThanLessThanEqual,
  GreaterThanGreaterThanEequal,
  GreaterThanGreaterThanGreaterThanEequal,
  LoginOrEqual,
  LogicAndEuqal,
  LogicXorEqual,
  Comma,
  Or,
  And,
  LogicOr,
  LogicXor,
  LogicAnd,
  EqualEqual,
  NotEqual,
  EqualEqualEqual,
  NotEqualEqual,
  LessThan,
  LessThanEqual,
  GreaterThan,
  GreaterThanEqual,
  In,
  InstanceOf,
  LessThanLessThan,
  GreaterThanGreaterThan,
  GreaterThanGreaterThanGreaterThan,
  BinaryOperatorOrUnaryOperatorPlus,
  BinaryOperatorOrUnaryOperatorMinus,
  Star,
  Div,
  Mod,
  StarStar,
  Not,
  LogicNot,
  TypeOf,
  Void,
  Delete,
  PlusPlus,
  MinusMinus,
  AssertedDeclaredKindOrVariableDeclarationKindVar,
  NonConstLexical,
  ConstLexical
}

export const VariantTypeToValueMap = {
  [Variant.Let]: 'let',
  [Variant.Const]: 'const',
  [Variant.PlusEqual]: "+=",
  [Variant.MinusEqual]: "-=",
  [Variant.StarEqual]: "*=",
  [Variant.DivEuqal]: "/=",
  [Variant.ModEqual]: "%=",
  [Variant.StarStarEqual]: "**=",
  [Variant.LessThanLessThanEqual]: "<<=",
  [Variant.GreaterThanGreaterThanEequal]: ">>=",
  [Variant.GreaterThanGreaterThanGreaterThanEequal]: ">>>=",
  [Variant.LoginOrEqual]: "|=",
  [Variant.LogicAndEuqal]: "&=",
  [Variant.LogicXorEqual]: "^=",
  [Variant.Comma]: ",",
  [Variant.Or]: "||",
  [Variant.And]: "&&",
  [Variant.LogicOr]: "|",
  [Variant.LogicXor]: "^",
  [Variant.LogicAnd]: "&",
  [Variant.EqualEqual]: "==",
  [Variant.NotEqual]: "!=",
  [Variant.EqualEqualEqual]: "===",
  [Variant.NotEqualEqual]: "!==",
  [Variant.LessThan]: "<",
  [Variant.LessThanEqual]: "<=",
  [Variant.GreaterThan]: ">",
  [Variant.GreaterThanEqual]: ">=",
  [Variant.In]: "in",
  [Variant.InstanceOf]: "instanceof",
  [Variant.LessThanLessThan]: "<<",
  [Variant.GreaterThanGreaterThan]: ">>",
  [Variant.GreaterThanGreaterThanGreaterThan]: ">>>",
  [Variant.BinaryOperatorOrUnaryOperatorPlus]: "+",
  [Variant.BinaryOperatorOrUnaryOperatorMinus]: "-",
  [Variant.Star]: "*",
  [Variant.Div]: "/",
  [Variant.Mod]: "%",
  [Variant.StarStar]: "**",
  [Variant.Not]: "!",
  [Variant.LogicNot]: "~",
  [Variant.TypeOf]: "typeof",
  [Variant.Void]: "void",
  [Variant.Delete]: "delete",
  [Variant.PlusPlus]: "++",
  [Variant.MinusMinus]: "--",
  [Variant.AssertedDeclaredKindOrVariableDeclarationKindVar]: "var",
  [Variant.NonConstLexical]: "non-const lexical",
  [Variant.ConstLexical]: "const lexical"
} as const

export const VariantTypeToNameMap = {
  [Variant.Let]: "Let",
  [Variant.Const]: "Const",
  [Variant.PlusEqual]: "PlusEqual",
  [Variant.MinusEqual]: "MinusEqual",
  [Variant.StarEqual]: "StarEqual",
  [Variant.DivEuqal]: "DivEuqal",
  [Variant.ModEqual]: "ModEqual",
  [Variant.StarStarEqual]: "StarStarEqual",
  [Variant.LessThanLessThanEqual]: "LessThanLessThanEqual",
  [Variant.GreaterThanGreaterThanEequal]: "GreaterThanGreaterThanEequal",
  [Variant.GreaterThanGreaterThanGreaterThanEequal]: "GreaterThanGreaterThanGreaterThanEequal",
  [Variant.LoginOrEqual]: "LoginOrEqual",
  [Variant.LogicAndEuqal]: "LogicAndEuqal",
  [Variant.LogicXorEqual]: "LogicXorEqual",
  [Variant.Comma]: "Comma",
  [Variant.Or]: "Or",
  [Variant.And]: "And",
  [Variant.LogicOr]: "LogicOr",
  [Variant.LogicXor]: "LogicXor",
  [Variant.LogicAnd]: "LogicAnd",
  [Variant.EqualEqual]: "EqualEqual",
  [Variant.NotEqual]: "NotEqual",
  [Variant.EqualEqualEqual]: "EqualEqualEqual",
  [Variant.NotEqualEqual]: "NotEqualEqual",
  [Variant.LessThan]: "LessThan",
  [Variant.LessThanEqual]: "LessThanEqual",
  [Variant.GreaterThan]: "GreaterThan",
  [Variant.GreaterThanEqual]: "GreaterThanEqual",
  [Variant.In]: "In",
  [Variant.InstanceOf]: "InstanceOf",
  [Variant.LessThanLessThan]: "LessThanLessThan",
  [Variant.GreaterThanGreaterThan]: "GreaterThanGreaterThan",
  [Variant.GreaterThanGreaterThanGreaterThan]: "GreaterThanGreaterThanGreaterThan",
  [Variant.BinaryOperatorOrUnaryOperatorPlus]: "BinaryOperatorOrUnaryOperatorPlus",
  [Variant.BinaryOperatorOrUnaryOperatorMinus]: "BinaryOperatorOrUnaryOperatorMinus",
  [Variant.Star]: "Star",
  [Variant.Div]: "Div",
  [Variant.Mod]: "Mod",
  [Variant.StarStar]: "StarStar",
  [Variant.Not]: "Not",
  [Variant.LogicNot]: "LogicNot",
  [Variant.TypeOf]: "TypeOf",
  [Variant.Void]: "Void",
  [Variant.Delete]: "Delete",
  [Variant.PlusPlus]: "PlusPlus",
  [Variant.MinusMinus]: "MinusMinus",
  [Variant.AssertedDeclaredKindOrVariableDeclarationKindVar]: "AssertedDeclaredKindOrVariableDeclarationKindVar",
  [Variant.NonConstLexical]: "NonConstLexical",
  [Variant.ConstLexical]: "ConstLexical",
} as const

export const VariantValueToTypeMap = {
  [VariantTypeToValueMap[Variant.Let]]: VariantTypeToNameMap[Variant.Let],
  [VariantTypeToValueMap[Variant.Const]]: VariantTypeToNameMap[Variant.Const],
  [VariantTypeToValueMap[Variant.PlusEqual]]: VariantTypeToNameMap[Variant.PlusEqual],
  [VariantTypeToValueMap[Variant.MinusEqual]]: VariantTypeToNameMap[Variant.MinusEqual],
  [VariantTypeToValueMap[Variant.StarEqual]]: VariantTypeToNameMap[Variant.StarEqual],
  [VariantTypeToValueMap[Variant.DivEuqal]]: VariantTypeToNameMap[Variant.DivEuqal],
  [VariantTypeToValueMap[Variant.ModEqual]]: VariantTypeToNameMap[Variant.ModEqual],
  [VariantTypeToValueMap[Variant.StarStarEqual]]: VariantTypeToNameMap[Variant.StarStarEqual],
  [VariantTypeToValueMap[Variant.LessThanLessThanEqual]]: VariantTypeToNameMap[Variant.LessThanLessThanEqual],
  [VariantTypeToValueMap[Variant.GreaterThanGreaterThanEequal]]: VariantTypeToNameMap[Variant.GreaterThanGreaterThanEequal],
  [VariantTypeToValueMap[Variant.GreaterThanGreaterThanGreaterThanEequal]]: VariantTypeToNameMap[Variant.GreaterThanGreaterThanGreaterThanEequal],
  [VariantTypeToValueMap[Variant.LoginOrEqual]]: VariantTypeToNameMap[Variant.LoginOrEqual],
  [VariantTypeToValueMap[Variant.LogicAndEuqal]]: VariantTypeToNameMap[Variant.LogicAndEuqal],
  [VariantTypeToValueMap[Variant.LogicXorEqual]]: VariantTypeToNameMap[Variant.LogicXorEqual],
  [VariantTypeToValueMap[Variant.Comma]]: VariantTypeToNameMap[Variant.Comma],
  [VariantTypeToValueMap[Variant.Or]]: VariantTypeToNameMap[Variant.Or],
  [VariantTypeToValueMap[Variant.And]]: VariantTypeToNameMap[Variant.And],
  [VariantTypeToValueMap[Variant.LogicOr]]: VariantTypeToNameMap[Variant.LogicOr],
  [VariantTypeToValueMap[Variant.LogicXor]]: VariantTypeToNameMap[Variant.LogicXor],
  [VariantTypeToValueMap[Variant.LogicAnd]]: VariantTypeToNameMap[Variant.LogicAnd],
  [VariantTypeToValueMap[Variant.EqualEqual]]: VariantTypeToNameMap[Variant.EqualEqual],
  [VariantTypeToValueMap[Variant.NotEqual]]: VariantTypeToNameMap[Variant.NotEqual],
  [VariantTypeToValueMap[Variant.EqualEqualEqual]]: VariantTypeToNameMap[Variant.EqualEqualEqual],
  [VariantTypeToValueMap[Variant.NotEqualEqual]]: VariantTypeToNameMap[Variant.NotEqualEqual],
  [VariantTypeToValueMap[Variant.LessThan]]: VariantTypeToNameMap[Variant.LessThan],
  [VariantTypeToValueMap[Variant.LessThanEqual]]: VariantTypeToNameMap[Variant.LessThanEqual],
  [VariantTypeToValueMap[Variant.GreaterThan]]: VariantTypeToNameMap[Variant.GreaterThan],
  [VariantTypeToValueMap[Variant.GreaterThanEqual]]: VariantTypeToNameMap[Variant.GreaterThanEqual],
  [VariantTypeToValueMap[Variant.In]]: VariantTypeToNameMap[Variant.In],
  [VariantTypeToValueMap[Variant.InstanceOf]]: VariantTypeToNameMap[Variant.InstanceOf],
  [VariantTypeToValueMap[Variant.LessThanLessThan]]: VariantTypeToNameMap[Variant.LessThanLessThan],
  [VariantTypeToValueMap[Variant.GreaterThanGreaterThan]]: VariantTypeToNameMap[Variant.GreaterThanGreaterThan],
  [VariantTypeToValueMap[Variant.GreaterThanGreaterThanGreaterThan]]: VariantTypeToNameMap[Variant.GreaterThanGreaterThanGreaterThan],
  [VariantTypeToValueMap[Variant.BinaryOperatorOrUnaryOperatorPlus]]: VariantTypeToNameMap[Variant.BinaryOperatorOrUnaryOperatorPlus],
  [VariantTypeToValueMap[Variant.BinaryOperatorOrUnaryOperatorMinus]]: VariantTypeToNameMap[Variant.BinaryOperatorOrUnaryOperatorMinus],
  [VariantTypeToValueMap[Variant.Star]]: VariantTypeToNameMap[Variant.Star],
  [VariantTypeToValueMap[Variant.Div]]: VariantTypeToNameMap[Variant.Div],
  [VariantTypeToValueMap[Variant.Mod]]: VariantTypeToNameMap[Variant.Mod],
  [VariantTypeToValueMap[Variant.StarStar]]: VariantTypeToNameMap[Variant.StarStar],
  [VariantTypeToValueMap[Variant.Not]]: VariantTypeToNameMap[Variant.Not],
  [VariantTypeToValueMap[Variant.LogicNot]]: VariantTypeToNameMap[Variant.LogicNot],
  [VariantTypeToValueMap[Variant.TypeOf]]: VariantTypeToNameMap[Variant.TypeOf],
  [VariantTypeToValueMap[Variant.Void]]: VariantTypeToNameMap[Variant.Void],
  [VariantTypeToValueMap[Variant.Delete]]: VariantTypeToNameMap[Variant.Delete],
  [VariantTypeToValueMap[Variant.PlusPlus]]: VariantTypeToNameMap[Variant.PlusPlus],
  [VariantTypeToValueMap[Variant.MinusMinus]]: VariantTypeToNameMap[Variant.MinusMinus],
  [VariantTypeToValueMap[Variant.AssertedDeclaredKindOrVariableDeclarationKindVar]]: VariantTypeToNameMap[Variant.AssertedDeclaredKindOrVariableDeclarationKindVar],
  [VariantTypeToValueMap[Variant.NonConstLexical]]: VariantTypeToNameMap[Variant.NonConstLexical],
  [VariantTypeToValueMap[Variant.ConstLexical]]: VariantTypeToNameMap[Variant.ConstLexical]
} as const

// deferred assertions
export interface AssertedDeclaredName {
  type: NodeType.AssertedDeclaredName
  name: IdentifierName
  kind: AssertedDeclaredKind
  isCaptured: boolean
}

export interface AssertedPositionalParameterName {
  type: NodeType.AssertedPositionalParameterName
  index: number
  name: IdentifierName
  isCaptured: boolean
}

export interface AssertedRestParameterName {
  type: NodeType.AssertedRestParameterName
  name: IdentifierName
  isCaptured: boolean
}

export interface AssertedParameterName {
  type: NodeType.AssertedParameterName
  name: IdentifierName
  isCaptured: boolean
}

export type AssertedMaybePositionalParameterName = AssertedPositionalParameterName | AssertedRestParameterName | AssertedParameterName

export interface AssertedBoundName {
  type: NodeType.AssertedBoundName
  name: IdentifierName
  isCaptured: boolean
}

export interface AssertedBlockScope {
  type: NodeType.AssertedBlockScope
  declaredNames: FrozenArray<AssertedDeclaredName>
  hasDirectEval: boolean
}

export interface AssertedScriptGlobalScope {
  type: NodeType.AssertedScriptGlobalScope
  declaredNames: FrozenArray<AssertedDeclaredName>
  hasDirectEval: boolean
}

export interface AssertedVarScope {
  type: NodeType.AssertedVarScope
  declaredNames: FrozenArray<AssertedDeclaredName>
  hasDirectEval: boolean
}

export interface AssertedParameterScope {
  type: NodeType.AssertedParameterScope
  paramNames: FrozenArray<AssertedMaybePositionalParameterName>
  hasDirectEval: boolean
  isSimpleParameterList: boolean
}

export interface AssertedBoundNamesScope {
  type: NodeType.AssertedBoundNamesScope
  boundNames: FrozenArray<AssertedBoundName>
  hasDirectEval: boolean
}

export enum NodeType {
  Null,
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
  ClassExpression,
  ClassDeclaration,
  ClassElement,
  Module,
  Import,
  ImportNamespace,
  ImportSpecifier,
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
  ComputedPropertyName,
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
  AssignmentExpression,
  BinaryExpression,
  CallExpression,
  CompoundAssignmentExpression,
  ComputedMemberExpression,
  ConditionalExpression,
  EagerFunctionExpression,
  LazyFunctionExpression,
  FunctionExpressionContents,
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
  BreakStatement,
  ContinueStatement,
  DebuggerStatement,
  DoWhileStatement,
  EmptyStatement,
  ExpressionStatement,
  ForInOfBinding,
  ForInStatement,
  ForOfStatement,
  ForStatement,
  IfStatement,
  LabelledStatement,
  ReturnStatement,
  SwitchStatement,
  SwitchStatementWithDefault,
  ThrowStatement,
  TryCatchStatement,
  TryFinallyStatement,
  WhileStatement,
  WithStatement,
  Block,
  CatchClause,
  Directive,
  FormalParameters,
  EagerFunctionDeclaration,
  LazyFunctionDeclaration,
  FunctionOrMethodContents,
  Script,
  SpreadElement,
  Super,
  SwitchCase,
  SwitchDefault,
  TemplateElement,
  VariableDeclaration,
  VariableDeclarator
}

export const NodeTypeToNameMap = {
  [NodeType.Null]: "",
  [NodeType.AssertedBoundName]: "AssertedBoundName",
  [NodeType.AssertedBlockScope]: "AssertedBlockScope",
  [NodeType.AssertedScriptGlobalScope]: "AssertedScriptGlobalScope",
  [NodeType.AssertedVarScope]: "AssertedVarScope",
  [NodeType.AssertedParameterScope]: "AssertedParameterScope",
  [NodeType.AssertedBoundNamesScope]: "AssertedBoundNamesScope",
  [NodeType.AssertedDeclaredName]: "AssertedDeclaredName",
  [NodeType.AssertedPositionalParameterName]: "AssertedPositionalParameterName",
  [NodeType.AssertedRestParameterName]: "AssertedRestParameterName",
  [NodeType.AssertedParameterName]: "AssertedParameterName",
  [NodeType.BindingIdentifier]: "BindingIdentifier",
  [NodeType.BindingWithInitializer]: "BindingWithInitializer",
  [NodeType.AssignmentTargetIdentifier]: "AssignmentTargetIdentifier",
  [NodeType.ComputedMemberAssignmentTarget]: "ComputedMemberAssignmentTarget",
  [NodeType.StaticMemberAssignmentTarget]: "StaticMemberAssignmentTarget",
  [NodeType.ArrayBinding]: "ArrayBinding",
  [NodeType.BindingPropertyIdentifier]: "BindingPropertyIdentifier",
  [NodeType.BindingPropertyProperty]: "BindingPropertyProperty",
  [NodeType.ObjectBinding]: "ObjectBinding",
  [NodeType.AssignmentTargetWithInitializer]: "AssignmentTargetWithInitializer",
  [NodeType.ArrayAssignmentTarget]: "ArrayAssignmentTarget",
  [NodeType.AssignmentTargetPropertyIdentifier]: "AssignmentTargetPropertyIdentifier",
  [NodeType.AssignmentTargetPropertyProperty]: "AssignmentTargetPropertyProperty",
  [NodeType.ObjectAssignmentTarget]: "ObjectAssignmentTarget",
  [NodeType.ClassExpression]: "ClassExpression",
  [NodeType.ClassDeclaration]: "ClassDeclaration",
  [NodeType.ClassElement]: "ClassElement",
  [NodeType.Module]: "Module",
  [NodeType.Import]: "Import",
  [NodeType.ImportNamespace]: "ImportNamespace",
  [NodeType.ImportSpecifier]: "ImportSpecifier",
  [NodeType.ExportAllFrom]: "ExportAllFrom",
  [NodeType.ExportFrom]: "ExportFrom",
  [NodeType.ExportLocals]: "ExportLocals",
  [NodeType.Export]: "Export",
  [NodeType.ExportDefault]: "ExportDefault",
  [NodeType.ExportFromSpecifier]: "ExportFromSpecifier",
  [NodeType.ExportLocalSpecifier]: "ExportLocalSpecifier",
  [NodeType.EagerMethod]: "EagerMethod",
  [NodeType.LazyMethod]: "LazyMethod",
  [NodeType.EagerGetter]: "EagerGetter",
  [NodeType.LazyGetter]: "LazyGetter",
  [NodeType.GetterContents]: "GetterContents",
  [NodeType.EagerSetter]: "EagerSetter",
  [NodeType.LazySetter]: "LazySetter",
  [NodeType.SetterContents]: "SetterContents",
  [NodeType.DataProperty]: "DataProperty",
  [NodeType.ShorthandProperty]: "ShorthandProperty",
  [NodeType.ComputedPropertyName]: "ComputedPropertyName",
  [NodeType.LiteralPropertyName]: "LiteralPropertyName",
  [NodeType.LiteralBooleanExpression]: "LiteralBooleanExpression",
  [NodeType.LiteralInfinityExpression]: "LiteralInfinityExpression",
  [NodeType.LiteralNullExpression]: "LiteralNullExpression",
  [NodeType.LiteralNumericExpression]: "LiteralNumericExpression",
  [NodeType.LiteralRegExpExpression]: "LiteralRegExpExpression",
  [NodeType.LiteralStringExpression]: "LiteralStringExpression",
  [NodeType.ArrayExpression]: "ArrayExpression",
  [NodeType.EagerArrowExpressionWithFunctionBody]: "EagerArrowExpressionWithFunctionBody",
  [NodeType.LazyArrowExpressionWithFunctionBody]: "LazyArrowExpressionWithFunctionBody",
  [NodeType.EagerArrowExpressionWithExpression]: "EagerArrowExpressionWithExpression",
  [NodeType.LazyArrowExpressionWithExpression]: "LazyArrowExpressionWithExpression",
  [NodeType.ArrowExpressionContentsWithFunctionBody]: "ArrowExpressionContentsWithFunctionBody",
  [NodeType.ArrowExpressionContentsWithExpression]: "ArrowExpressionContentsWithExpression",
  [NodeType.AssignmentExpression]: "AssignmentExpression",
  [NodeType.BinaryExpression]: "BinaryExpression",
  [NodeType.CallExpression]: "CallExpression",
  [NodeType.CompoundAssignmentExpression]: "CompoundAssignmentExpression",
  [NodeType.ComputedMemberExpression]: "ComputedMemberExpression",
  [NodeType.ConditionalExpression]: "ConditionalExpression",
  [NodeType.EagerFunctionExpression]: "EagerFunctionExpression",
  [NodeType.LazyFunctionExpression]: "LazyFunctionExpression",
  [NodeType.FunctionExpressionContents]: "FunctionExpressionContents",
  [NodeType.IdentifierExpression]: "IdentifierExpression",
  [NodeType.NewExpression]: "NewExpression",
  [NodeType.NewTargetExpression]: "NewTargetExpression",
  [NodeType.ObjectExpression]: "ObjectExpression",
  [NodeType.UnaryExpression]: "UnaryExpression",
  [NodeType.StaticMemberExpression]: "StaticMemberExpression",
  [NodeType.TemplateExpression]: "TemplateExpression",
  [NodeType.ThisExpression]: "ThisExpression",
  [NodeType.UpdateExpression]: "UpdateExpression",
  [NodeType.YieldExpression]: "YieldExpression",
  [NodeType.YieldStarExpression]: "YieldStarExpression",
  [NodeType.AwaitExpression]: "AwaitExpression",
  [NodeType.BreakStatement]: "BreakStatement",
  [NodeType.ContinueStatement]: "ContinueStatement",
  [NodeType.DebuggerStatement]: "DebuggerStatement",
  [NodeType.DoWhileStatement]: "DoWhileStatement",
  [NodeType.EmptyStatement]: "EmptyStatement",
  [NodeType.ExpressionStatement]: "ExpressionStatement",
  [NodeType.ForInOfBinding]: "ForInOfBinding",
  [NodeType.ForInStatement]: "ForInStatement",
  [NodeType.ForOfStatement]: "ForOfStatement",
  [NodeType.ForStatement]: "ForStatement",
  [NodeType.IfStatement]: "IfStatement",
  [NodeType.LabelledStatement]: "LabelledStatement",
  [NodeType.ReturnStatement]: "ReturnStatement",
  [NodeType.SwitchStatement]: "SwitchStatement",
  [NodeType.SwitchStatementWithDefault]: "SwitchStatementWithDefault",
  [NodeType.ThrowStatement]: "ThrowStatement",
  [NodeType.TryCatchStatement]: "TryCatchStatement",
  [NodeType.TryFinallyStatement]: "TryFinallyStatement",
  [NodeType.WhileStatement]: "WhileStatement",
  [NodeType.WithStatement]: "WithStatement",
  [NodeType.Block]: "Block",
  [NodeType.CatchClause]: "CatchClause",
  [NodeType.Directive]: "Directive",
  [NodeType.FormalParameters]: "FormalParameters",
  [NodeType.EagerFunctionDeclaration]: "EagerFunctionDeclaration",
  [NodeType.LazyFunctionDeclaration]: "LazyFunctionDeclaration",
  [NodeType.FunctionOrMethodContents]: "FunctionOrMethodContents",
  [NodeType.Script]: "Script",
  [NodeType.SpreadElement]: "SpreadElement",
  [NodeType.Super]: "Super",
  [NodeType.SwitchCase]: "SwitchCase",
  [NodeType.SwitchDefault]: "SwitchDefault",
  [NodeType.TemplateElement]: "TemplateElement",
  [NodeType.VariableDeclaration]: "VariableDeclaration",
  [NodeType.VariableDeclarator]: "VariableDeclarator"
} as const

export const NodeTypeNameToTypeMap = {
  [""]: NodeType.Null,
  AssertedBoundName: NodeType.AssertedBoundName,
  AssertedBlockScope: NodeType.AssertedBlockScope,
  AssertedScriptGlobalScope: NodeType.AssertedScriptGlobalScope,
  AssertedVarScope: NodeType.AssertedVarScope,
  AssertedParameterScope: NodeType.AssertedParameterScope,
  AssertedBoundNamesScope: NodeType.AssertedBoundNamesScope,
  AssertedDeclaredName: NodeType.AssertedDeclaredName,
  AssertedPositionalParameterName: NodeType.AssertedPositionalParameterName,
  AssertedRestParameterName: NodeType.AssertedRestParameterName,
  AssertedParameterName: NodeType.AssertedParameterName,
  BindingIdentifier: NodeType.BindingIdentifier,
  BindingWithInitializer: NodeType.BindingWithInitializer,
  AssignmentTargetIdentifier: NodeType.AssignmentTargetIdentifier,
  ComputedMemberAssignmentTarget: NodeType.ComputedMemberAssignmentTarget,
  StaticMemberAssignmentTarget: NodeType.StaticMemberAssignmentTarget,
  ArrayBinding: NodeType.ArrayBinding,
  BindingPropertyIdentifier: NodeType.BindingPropertyIdentifier,
  BindingPropertyProperty: NodeType.BindingPropertyProperty,
  ObjectBinding: NodeType.ObjectBinding,
  AssignmentTargetWithInitializer: NodeType.AssignmentTargetWithInitializer,
  ArrayAssignmentTarget: NodeType.ArrayAssignmentTarget,
  AssignmentTargetPropertyIdentifier: NodeType.AssignmentTargetPropertyIdentifier,
  AssignmentTargetPropertyProperty: NodeType.AssignmentTargetPropertyProperty,
  ObjectAssignmentTarget: NodeType.ObjectAssignmentTarget,
  ClassExpression: NodeType.ClassExpression,
  ClassDeclaration: NodeType.ClassDeclaration,
  ClassElement: NodeType.ClassElement,
  Module: NodeType.Module,
  Import: NodeType.Import,
  ImportNamespace: NodeType.ImportNamespace,
  ImportSpecifier: NodeType.ImportSpecifier,
  ExportAllFrom: NodeType.ExportAllFrom,
  ExportFrom: NodeType.ExportFrom,
  ExportLocals: NodeType.ExportLocals,
  Export: NodeType.Export,
  ExportDefault: NodeType.ExportDefault,
  ExportFromSpecifier: NodeType.ExportFromSpecifier,
  ExportLocalSpecifier: NodeType.ExportLocalSpecifier,
  EagerMethod: NodeType.EagerMethod,
  LazyMethod: NodeType.LazyMethod,
  EagerGetter: NodeType.EagerGetter,
  LazyGetter: NodeType.LazyGetter,
  GetterContents: NodeType.GetterContents,
  EagerSetter: NodeType.EagerSetter,
  LazySetter: NodeType.LazySetter,
  SetterContents: NodeType.SetterContents,
  DataProperty: NodeType.DataProperty,
  ShorthandProperty: NodeType.ShorthandProperty,
  ComputedPropertyName: NodeType.ComputedPropertyName,
  LiteralPropertyName: NodeType.LiteralPropertyName,
  LiteralBooleanExpression: NodeType.LiteralBooleanExpression,
  LiteralInfinityExpression: NodeType.LiteralInfinityExpression,
  LiteralNullExpression: NodeType.LiteralNullExpression,
  LiteralNumericExpression: NodeType.LiteralNumericExpression,
  LiteralRegExpExpression: NodeType.LiteralRegExpExpression,
  LiteralStringExpression: NodeType.LiteralStringExpression,
  ArrayExpression: NodeType.ArrayExpression,
  EagerArrowExpressionWithFunctionBody: NodeType.EagerArrowExpressionWithFunctionBody,
  LazyArrowExpressionWithFunctionBody: NodeType.LazyArrowExpressionWithFunctionBody,
  EagerArrowExpressionWithExpression: NodeType.EagerArrowExpressionWithExpression,
  LazyArrowExpressionWithExpression: NodeType.LazyArrowExpressionWithExpression,
  ArrowExpressionContentsWithFunctionBody: NodeType.ArrowExpressionContentsWithFunctionBody,
  ArrowExpressionContentsWithExpression: NodeType.ArrowExpressionContentsWithExpression,
  AssignmentExpression: NodeType.AssignmentExpression,
  BinaryExpression: NodeType.BinaryExpression,
  CallExpression: NodeType.CallExpression,
  CompoundAssignmentExpression: NodeType.CompoundAssignmentExpression,
  ComputedMemberExpression: NodeType.ComputedMemberExpression,
  ConditionalExpression: NodeType.ConditionalExpression,
  EagerFunctionExpression: NodeType.EagerFunctionExpression,
  LazyFunctionExpression: NodeType.LazyFunctionExpression,
  FunctionExpressionContents: NodeType.FunctionExpressionContents,
  IdentifierExpression: NodeType.IdentifierExpression,
  NewExpression: NodeType.NewExpression,
  NewTargetExpression: NodeType.NewTargetExpression,
  ObjectExpression: NodeType.ObjectExpression,
  UnaryExpression: NodeType.UnaryExpression,
  StaticMemberExpression: NodeType.StaticMemberExpression,
  TemplateExpression: NodeType.TemplateExpression,
  ThisExpression: NodeType.ThisExpression,
  UpdateExpression: NodeType.UpdateExpression,
  YieldExpression: NodeType.YieldExpression,
  YieldStarExpression: NodeType.YieldStarExpression,
  AwaitExpression: NodeType.AwaitExpression,
  BreakStatement: NodeType.BreakStatement,
  ContinueStatement: NodeType.ContinueStatement,
  DebuggerStatement: NodeType.DebuggerStatement,
  DoWhileStatement: NodeType.DoWhileStatement,
  EmptyStatement: NodeType.EmptyStatement,
  ExpressionStatement: NodeType.ExpressionStatement,
  ForInOfBinding: NodeType.ForInOfBinding,
  ForInStatement: NodeType.ForInStatement,
  ForOfStatement: NodeType.ForOfStatement,
  ForStatement: NodeType.ForStatement,
  IfStatement: NodeType.IfStatement,
  LabelledStatement: NodeType.LabelledStatement,
  ReturnStatement: NodeType.ReturnStatement,
  SwitchStatement: NodeType.SwitchStatement,
  SwitchStatementWithDefault: NodeType.SwitchStatementWithDefault,
  ThrowStatement: NodeType.ThrowStatement,
  TryCatchStatement: NodeType.TryCatchStatement,
  TryFinallyStatement: NodeType.TryFinallyStatement,
  WhileStatement: NodeType.WhileStatement,
  WithStatement: NodeType.WithStatement,
  Block: NodeType.Block,
  CatchClause: NodeType.CatchClause,
  Directive: NodeType.Directive,
  FormalParameters: NodeType.FormalParameters,
  EagerFunctionDeclaration: NodeType.EagerFunctionDeclaration,
  LazyFunctionDeclaration: NodeType.LazyFunctionDeclaration,
  FunctionOrMethodContents: NodeType.FunctionOrMethodContents,
  Script: NodeType.Script,
  SpreadElement: NodeType.SpreadElement,
  Super: NodeType.Super,
  SwitchCase: NodeType.SwitchCase,
  SwitchDefault: NodeType.SwitchDefault,
  TemplateElement: NodeType.TemplateElement,
  VariableDeclaration: NodeType.VariableDeclaration,
  VariableDeclarator: NodeType.VariableDeclarator
} as const

export const NodeTypeLimit = Object.keys(NodeType).length

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

export interface EmptyStatement extends Node {
  type: NodeType.EmptyStatement
}

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
  body: Statement
}

export interface ForOfStatement extends Node {
  type: NodeType.ForOfStatement
  left: ForInOfBinding | AssignmentTarget
  right: Expression
  body: Statement
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
