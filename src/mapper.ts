import { Variant, NodeType } from './types'

const NodeTypeToNameMap = {
  [NodeType.Null]: '',
  [NodeType.AssertedBoundName]: 'AssertedBoundName',
  [NodeType.AssertedBlockScope]: 'AssertedBlockScope',
  [NodeType.AssertedScriptGlobalScope]: 'AssertedScriptGlobalScope',
  [NodeType.AssertedVarScope]: 'AssertedVarScope',
  [NodeType.AssertedParameterScope]: 'AssertedParameterScope',
  [NodeType.AssertedBoundNamesScope]: 'AssertedBoundNamesScope',
  [NodeType.AssertedDeclaredName]: 'AssertedDeclaredName',
  [NodeType.AssertedPositionalParameterName]: 'AssertedPositionalParameterName',
  [NodeType.AssertedRestParameterName]: 'AssertedRestParameterName',
  [NodeType.AssertedParameterName]: 'AssertedParameterName',
  [NodeType.BindingIdentifier]: 'BindingIdentifier',
  [NodeType.BindingWithInitializer]: 'BindingWithInitializer',
  [NodeType.AssignmentTargetIdentifier]: 'AssignmentTargetIdentifier',
  [NodeType.ComputedMemberAssignmentTarget]: 'ComputedMemberAssignmentTarget',
  [NodeType.StaticMemberAssignmentTarget]: 'StaticMemberAssignmentTarget',
  [NodeType.ArrayBinding]: 'ArrayBinding',
  [NodeType.BindingPropertyIdentifier]: 'BindingPropertyIdentifier',
  [NodeType.BindingPropertyProperty]: 'BindingPropertyProperty',
  [NodeType.ObjectBinding]: 'ObjectBinding',
  [NodeType.AssignmentTargetWithInitializer]: 'AssignmentTargetWithInitializer',
  [NodeType.ArrayAssignmentTarget]: 'ArrayAssignmentTarget',
  [NodeType.AssignmentTargetPropertyIdentifier]:
    'AssignmentTargetPropertyIdentifier',
  [NodeType.AssignmentTargetPropertyProperty]:
    'AssignmentTargetPropertyProperty',
  [NodeType.ObjectAssignmentTarget]: 'ObjectAssignmentTarget',
  [NodeType.ClassExpression]: 'ClassExpression',
  [NodeType.ClassDeclaration]: 'ClassDeclaration',
  [NodeType.ClassElement]: 'ClassElement',
  [NodeType.Module]: 'Module',
  [NodeType.Import]: 'Import',
  [NodeType.ImportNamespace]: 'ImportNamespace',
  [NodeType.ImportSpecifier]: 'ImportSpecifier',
  [NodeType.ExportAllFrom]: 'ExportAllFrom',
  [NodeType.ExportFrom]: 'ExportFrom',
  [NodeType.ExportLocals]: 'ExportLocals',
  [NodeType.Export]: 'Export',
  [NodeType.ExportDefault]: 'ExportDefault',
  [NodeType.ExportFromSpecifier]: 'ExportFromSpecifier',
  [NodeType.ExportLocalSpecifier]: 'ExportLocalSpecifier',
  [NodeType.EagerMethod]: 'EagerMethod',
  [NodeType.LazyMethod]: 'LazyMethod',
  [NodeType.EagerGetter]: 'EagerGetter',
  [NodeType.LazyGetter]: 'LazyGetter',
  [NodeType.GetterContents]: 'GetterContents',
  [NodeType.EagerSetter]: 'EagerSetter',
  [NodeType.LazySetter]: 'LazySetter',
  [NodeType.SetterContents]: 'SetterContents',
  [NodeType.DataProperty]: 'DataProperty',
  [NodeType.ShorthandProperty]: 'ShorthandProperty',
  [NodeType.ComputedPropertyName]: 'ComputedPropertyName',
  [NodeType.LiteralPropertyName]: 'LiteralPropertyName',
  [NodeType.LiteralBooleanExpression]: 'LiteralBooleanExpression',
  [NodeType.LiteralInfinityExpression]: 'LiteralInfinityExpression',
  [NodeType.LiteralNullExpression]: 'LiteralNullExpression',
  [NodeType.LiteralNumericExpression]: 'LiteralNumericExpression',
  [NodeType.LiteralRegExpExpression]: 'LiteralRegExpExpression',
  [NodeType.LiteralStringExpression]: 'LiteralStringExpression',
  [NodeType.ArrayExpression]: 'ArrayExpression',
  [NodeType.EagerArrowExpressionWithFunctionBody]:
    'EagerArrowExpressionWithFunctionBody',
  [NodeType.LazyArrowExpressionWithFunctionBody]:
    'LazyArrowExpressionWithFunctionBody',
  [NodeType.EagerArrowExpressionWithExpression]:
    'EagerArrowExpressionWithExpression',
  [NodeType.LazyArrowExpressionWithExpression]:
    'LazyArrowExpressionWithExpression',
  [NodeType.ArrowExpressionContentsWithFunctionBody]:
    'ArrowExpressionContentsWithFunctionBody',
  [NodeType.ArrowExpressionContentsWithExpression]:
    'ArrowExpressionContentsWithExpression',
  [NodeType.AssignmentExpression]: 'AssignmentExpression',
  [NodeType.BinaryExpression]: 'BinaryExpression',
  [NodeType.CallExpression]: 'CallExpression',
  [NodeType.CompoundAssignmentExpression]: 'CompoundAssignmentExpression',
  [NodeType.ComputedMemberExpression]: 'ComputedMemberExpression',
  [NodeType.ConditionalExpression]: 'ConditionalExpression',
  [NodeType.EagerFunctionExpression]: 'EagerFunctionExpression',
  [NodeType.LazyFunctionExpression]: 'LazyFunctionExpression',
  [NodeType.FunctionExpressionContents]: 'FunctionExpressionContents',
  [NodeType.IdentifierExpression]: 'IdentifierExpression',
  [NodeType.NewExpression]: 'NewExpression',
  [NodeType.NewTargetExpression]: 'NewTargetExpression',
  [NodeType.ObjectExpression]: 'ObjectExpression',
  [NodeType.UnaryExpression]: 'UnaryExpression',
  [NodeType.StaticMemberExpression]: 'StaticMemberExpression',
  [NodeType.TemplateExpression]: 'TemplateExpression',
  [NodeType.ThisExpression]: 'ThisExpression',
  [NodeType.UpdateExpression]: 'UpdateExpression',
  [NodeType.YieldExpression]: 'YieldExpression',
  [NodeType.YieldStarExpression]: 'YieldStarExpression',
  [NodeType.AwaitExpression]: 'AwaitExpression',
  [NodeType.BreakStatement]: 'BreakStatement',
  [NodeType.ContinueStatement]: 'ContinueStatement',
  [NodeType.DebuggerStatement]: 'DebuggerStatement',
  [NodeType.DoWhileStatement]: 'DoWhileStatement',
  [NodeType.EmptyStatement]: 'EmptyStatement',
  [NodeType.ExpressionStatement]: 'ExpressionStatement',
  [NodeType.ForInOfBinding]: 'ForInOfBinding',
  [NodeType.ForInStatement]: 'ForInStatement',
  [NodeType.ForOfStatement]: 'ForOfStatement',
  [NodeType.ForStatement]: 'ForStatement',
  [NodeType.IfStatement]: 'IfStatement',
  [NodeType.LabelledStatement]: 'LabelledStatement',
  [NodeType.ReturnStatement]: 'ReturnStatement',
  [NodeType.SwitchStatement]: 'SwitchStatement',
  [NodeType.SwitchStatementWithDefault]: 'SwitchStatementWithDefault',
  [NodeType.ThrowStatement]: 'ThrowStatement',
  [NodeType.TryCatchStatement]: 'TryCatchStatement',
  [NodeType.TryFinallyStatement]: 'TryFinallyStatement',
  [NodeType.WhileStatement]: 'WhileStatement',
  [NodeType.WithStatement]: 'WithStatement',
  [NodeType.Block]: 'Block',
  [NodeType.CatchClause]: 'CatchClause',
  [NodeType.Directive]: 'Directive',
  [NodeType.FormalParameters]: 'FormalParameters',
  [NodeType.EagerFunctionDeclaration]: 'EagerFunctionDeclaration',
  [NodeType.LazyFunctionDeclaration]: 'LazyFunctionDeclaration',
  [NodeType.FunctionOrMethodContents]: 'FunctionOrMethodContents',
  [NodeType.Script]: 'Script',
  [NodeType.SpreadElement]: 'SpreadElement',
  [NodeType.Super]: 'Super',
  [NodeType.SwitchCase]: 'SwitchCase',
  [NodeType.SwitchDefault]: 'SwitchDefault',
  [NodeType.TemplateElement]: 'TemplateElement',
  [NodeType.VariableDeclaration]: 'VariableDeclaration',
  [NodeType.VariableDeclarator]: 'VariableDeclarator'
} as const

const NodeTypeNameToTypeMap = {
  ['']: NodeType.Null,
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
  AssignmentTargetPropertyIdentifier:
    NodeType.AssignmentTargetPropertyIdentifier,
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
  EagerArrowExpressionWithFunctionBody:
    NodeType.EagerArrowExpressionWithFunctionBody,
  LazyArrowExpressionWithFunctionBody:
    NodeType.LazyArrowExpressionWithFunctionBody,
  EagerArrowExpressionWithExpression:
    NodeType.EagerArrowExpressionWithExpression,
  LazyArrowExpressionWithExpression: NodeType.LazyArrowExpressionWithExpression,
  ArrowExpressionContentsWithFunctionBody:
    NodeType.ArrowExpressionContentsWithFunctionBody,
  ArrowExpressionContentsWithExpression:
    NodeType.ArrowExpressionContentsWithExpression,
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

const VariantTypeToValueMap = {
  [Variant.Let]: 'let',
  [Variant.Const]: 'const',
  [Variant.PlusEqual]: '+=',
  [Variant.MinusEqual]: '-=',
  [Variant.StarEqual]: '*=',
  [Variant.DivEuqal]: '/=',
  [Variant.ModEqual]: '%=',
  [Variant.StarStarEqual]: '**=',
  [Variant.LessThanLessThanEqual]: '<<=',
  [Variant.GreaterThanGreaterThanEequal]: '>>=',
  [Variant.GreaterThanGreaterThanGreaterThanEequal]: '>>>=',
  [Variant.LoginOrEqual]: '|=',
  [Variant.LogicAndEuqal]: '&=',
  [Variant.LogicXorEqual]: '^=',
  [Variant.Comma]: ',',
  [Variant.Or]: '||',
  [Variant.And]: '&&',
  [Variant.LogicOr]: '|',
  [Variant.LogicXor]: '^',
  [Variant.LogicAnd]: '&',
  [Variant.EqualEqual]: '==',
  [Variant.NotEqual]: '!=',
  [Variant.EqualEqualEqual]: '===',
  [Variant.NotEqualEqual]: '!==',
  [Variant.LessThan]: '<',
  [Variant.LessThanEqual]: '<=',
  [Variant.GreaterThan]: '>',
  [Variant.GreaterThanEqual]: '>=',
  [Variant.In]: 'in',
  [Variant.InstanceOf]: 'instanceof',
  [Variant.LessThanLessThan]: '<<',
  [Variant.GreaterThanGreaterThan]: '>>',
  [Variant.GreaterThanGreaterThanGreaterThan]: '>>>',
  [Variant.BinaryOperatorOrUnaryOperatorPlus]: '+',
  [Variant.BinaryOperatorOrUnaryOperatorMinus]: '-',
  [Variant.Star]: '*',
  [Variant.Div]: '/',
  [Variant.Mod]: '%',
  [Variant.StarStar]: '**',
  [Variant.Not]: '!',
  [Variant.LogicNot]: '~',
  [Variant.TypeOf]: 'typeof',
  [Variant.Void]: 'void',
  [Variant.Delete]: 'delete',
  [Variant.PlusPlus]: '++',
  [Variant.MinusMinus]: '--',
  [Variant.AssertedDeclaredKindOrVariableDeclarationKindVar]: 'var',
  [Variant.NonConstLexical]: 'non-const lexical',
  [Variant.ConstLexical]: 'const lexical'
} as const

const VariantTypeToNameMap = {
  [Variant.Let]: 'Let',
  [Variant.Const]: 'Const',
  [Variant.PlusEqual]: 'PlusEqual',
  [Variant.MinusEqual]: 'MinusEqual',
  [Variant.StarEqual]: 'StarEqual',
  [Variant.DivEuqal]: 'DivEuqal',
  [Variant.ModEqual]: 'ModEqual',
  [Variant.StarStarEqual]: 'StarStarEqual',
  [Variant.LessThanLessThanEqual]: 'LessThanLessThanEqual',
  [Variant.GreaterThanGreaterThanEequal]: 'GreaterThanGreaterThanEequal',
  [Variant.GreaterThanGreaterThanGreaterThanEequal]:
    'GreaterThanGreaterThanGreaterThanEequal',
  [Variant.LoginOrEqual]: 'LoginOrEqual',
  [Variant.LogicAndEuqal]: 'LogicAndEuqal',
  [Variant.LogicXorEqual]: 'LogicXorEqual',
  [Variant.Comma]: 'Comma',
  [Variant.Or]: 'Or',
  [Variant.And]: 'And',
  [Variant.LogicOr]: 'LogicOr',
  [Variant.LogicXor]: 'LogicXor',
  [Variant.LogicAnd]: 'LogicAnd',
  [Variant.EqualEqual]: 'EqualEqual',
  [Variant.NotEqual]: 'NotEqual',
  [Variant.EqualEqualEqual]: 'EqualEqualEqual',
  [Variant.NotEqualEqual]: 'NotEqualEqual',
  [Variant.LessThan]: 'LessThan',
  [Variant.LessThanEqual]: 'LessThanEqual',
  [Variant.GreaterThan]: 'GreaterThan',
  [Variant.GreaterThanEqual]: 'GreaterThanEqual',
  [Variant.In]: 'In',
  [Variant.InstanceOf]: 'InstanceOf',
  [Variant.LessThanLessThan]: 'LessThanLessThan',
  [Variant.GreaterThanGreaterThan]: 'GreaterThanGreaterThan',
  [Variant.GreaterThanGreaterThanGreaterThan]:
    'GreaterThanGreaterThanGreaterThan',
  [Variant.BinaryOperatorOrUnaryOperatorPlus]:
    'BinaryOperatorOrUnaryOperatorPlus',
  [Variant.BinaryOperatorOrUnaryOperatorMinus]:
    'BinaryOperatorOrUnaryOperatorMinus',
  [Variant.Star]: 'Star',
  [Variant.Div]: 'Div',
  [Variant.Mod]: 'Mod',
  [Variant.StarStar]: 'StarStar',
  [Variant.Not]: 'Not',
  [Variant.LogicNot]: 'LogicNot',
  [Variant.TypeOf]: 'TypeOf',
  [Variant.Void]: 'Void',
  [Variant.Delete]: 'Delete',
  [Variant.PlusPlus]: 'PlusPlus',
  [Variant.MinusMinus]: 'MinusMinus',
  [Variant.AssertedDeclaredKindOrVariableDeclarationKindVar]:
    'AssertedDeclaredKindOrVariableDeclarationKindVar',
  [Variant.NonConstLexical]: 'NonConstLexical',
  [Variant.ConstLexical]: 'ConstLexical'
} as const

const VariantValueToTypeMap = {
  [VariantTypeToValueMap[Variant.Let]]: VariantTypeToNameMap[Variant.Let],
  [VariantTypeToValueMap[Variant.Const]]: VariantTypeToNameMap[Variant.Const],
  [VariantTypeToValueMap[Variant.PlusEqual]]:
    VariantTypeToNameMap[Variant.PlusEqual],
  [VariantTypeToValueMap[Variant.MinusEqual]]:
    VariantTypeToNameMap[Variant.MinusEqual],
  [VariantTypeToValueMap[Variant.StarEqual]]:
    VariantTypeToNameMap[Variant.StarEqual],
  [VariantTypeToValueMap[Variant.DivEuqal]]:
    VariantTypeToNameMap[Variant.DivEuqal],
  [VariantTypeToValueMap[Variant.ModEqual]]:
    VariantTypeToNameMap[Variant.ModEqual],
  [VariantTypeToValueMap[Variant.StarStarEqual]]:
    VariantTypeToNameMap[Variant.StarStarEqual],
  [VariantTypeToValueMap[Variant.LessThanLessThanEqual]]:
    VariantTypeToNameMap[Variant.LessThanLessThanEqual],
  [VariantTypeToValueMap[Variant.GreaterThanGreaterThanEequal]]:
    VariantTypeToNameMap[Variant.GreaterThanGreaterThanEequal],
  [VariantTypeToValueMap[Variant.GreaterThanGreaterThanGreaterThanEequal]]:
    VariantTypeToNameMap[Variant.GreaterThanGreaterThanGreaterThanEequal],
  [VariantTypeToValueMap[Variant.LoginOrEqual]]:
    VariantTypeToNameMap[Variant.LoginOrEqual],
  [VariantTypeToValueMap[Variant.LogicAndEuqal]]:
    VariantTypeToNameMap[Variant.LogicAndEuqal],
  [VariantTypeToValueMap[Variant.LogicXorEqual]]:
    VariantTypeToNameMap[Variant.LogicXorEqual],
  [VariantTypeToValueMap[Variant.Comma]]: VariantTypeToNameMap[Variant.Comma],
  [VariantTypeToValueMap[Variant.Or]]: VariantTypeToNameMap[Variant.Or],
  [VariantTypeToValueMap[Variant.And]]: VariantTypeToNameMap[Variant.And],
  [VariantTypeToValueMap[Variant.LogicOr]]:
    VariantTypeToNameMap[Variant.LogicOr],
  [VariantTypeToValueMap[Variant.LogicXor]]:
    VariantTypeToNameMap[Variant.LogicXor],
  [VariantTypeToValueMap[Variant.LogicAnd]]:
    VariantTypeToNameMap[Variant.LogicAnd],
  [VariantTypeToValueMap[Variant.EqualEqual]]:
    VariantTypeToNameMap[Variant.EqualEqual],
  [VariantTypeToValueMap[Variant.NotEqual]]:
    VariantTypeToNameMap[Variant.NotEqual],
  [VariantTypeToValueMap[Variant.EqualEqualEqual]]:
    VariantTypeToNameMap[Variant.EqualEqualEqual],
  [VariantTypeToValueMap[Variant.NotEqualEqual]]:
    VariantTypeToNameMap[Variant.NotEqualEqual],
  [VariantTypeToValueMap[Variant.LessThan]]:
    VariantTypeToNameMap[Variant.LessThan],
  [VariantTypeToValueMap[Variant.LessThanEqual]]:
    VariantTypeToNameMap[Variant.LessThanEqual],
  [VariantTypeToValueMap[Variant.GreaterThan]]:
    VariantTypeToNameMap[Variant.GreaterThan],
  [VariantTypeToValueMap[Variant.GreaterThanEqual]]:
    VariantTypeToNameMap[Variant.GreaterThanEqual],
  [VariantTypeToValueMap[Variant.In]]: VariantTypeToNameMap[Variant.In],
  [VariantTypeToValueMap[Variant.InstanceOf]]:
    VariantTypeToNameMap[Variant.InstanceOf],
  [VariantTypeToValueMap[Variant.LessThanLessThan]]:
    VariantTypeToNameMap[Variant.LessThanLessThan],
  [VariantTypeToValueMap[Variant.GreaterThanGreaterThan]]:
    VariantTypeToNameMap[Variant.GreaterThanGreaterThan],
  [VariantTypeToValueMap[Variant.GreaterThanGreaterThanGreaterThan]]:
    VariantTypeToNameMap[Variant.GreaterThanGreaterThanGreaterThan],
  [VariantTypeToValueMap[Variant.BinaryOperatorOrUnaryOperatorPlus]]:
    VariantTypeToNameMap[Variant.BinaryOperatorOrUnaryOperatorPlus],
  [VariantTypeToValueMap[Variant.BinaryOperatorOrUnaryOperatorMinus]]:
    VariantTypeToNameMap[Variant.BinaryOperatorOrUnaryOperatorMinus],
  [VariantTypeToValueMap[Variant.Star]]: VariantTypeToNameMap[Variant.Star],
  [VariantTypeToValueMap[Variant.Div]]: VariantTypeToNameMap[Variant.Div],
  [VariantTypeToValueMap[Variant.Mod]]: VariantTypeToNameMap[Variant.Mod],
  [VariantTypeToValueMap[Variant.StarStar]]:
    VariantTypeToNameMap[Variant.StarStar],
  [VariantTypeToValueMap[Variant.Not]]: VariantTypeToNameMap[Variant.Not],
  [VariantTypeToValueMap[Variant.LogicNot]]:
    VariantTypeToNameMap[Variant.LogicNot],
  [VariantTypeToValueMap[Variant.TypeOf]]: VariantTypeToNameMap[Variant.TypeOf],
  [VariantTypeToValueMap[Variant.Void]]: VariantTypeToNameMap[Variant.Void],
  [VariantTypeToValueMap[Variant.Delete]]: VariantTypeToNameMap[Variant.Delete],
  [VariantTypeToValueMap[Variant.PlusPlus]]:
    VariantTypeToNameMap[Variant.PlusPlus],
  [VariantTypeToValueMap[Variant.MinusMinus]]:
    VariantTypeToNameMap[Variant.MinusMinus],
  [VariantTypeToValueMap[
    Variant.AssertedDeclaredKindOrVariableDeclarationKindVar
  ]]:
    VariantTypeToNameMap[
      Variant.AssertedDeclaredKindOrVariableDeclarationKindVar
    ],
  [VariantTypeToValueMap[Variant.NonConstLexical]]:
    VariantTypeToNameMap[Variant.NonConstLexical],
  [VariantTypeToValueMap[Variant.ConstLexical]]:
    VariantTypeToNameMap[Variant.ConstLexical]
} as const

export const NodeTypeLimit = Object.keys(NodeType).length

export function nameToNodeTypeMapper(name: string) {
  if (name in NodeTypeNameToTypeMap) {
    return NodeTypeNameToTypeMap[name as keyof typeof NodeTypeNameToTypeMap]
  }
  return undefined
}

export function nodeTypeToNameMapper(type: NodeType) {
  if (type in NodeTypeToNameMap) {
    return NodeTypeToNameMap[type]
  }
  return undefined
}

export function nameToVariantMapper(name: string) {
  if (name in VariantValueToTypeMap) {
    return Variant[
      VariantValueToTypeMap[name as keyof typeof VariantValueToTypeMap]
    ]
  }
  return undefined
}

export function variantToValueMapper(variant: Variant) {
  if (variant in VariantTypeToValueMap) {
    return VariantTypeToValueMap[variant]
  }
  return undefined
}
