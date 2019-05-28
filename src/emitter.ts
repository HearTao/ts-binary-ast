import MultipartWritter from "./io/writer";
import { WriterContext } from "./io/context";
import { Program, NodeType, Script, FrozenArray, Directive, Statement, AssertedScriptGlobalScope, AssertedDeclaredName, AssertedDeclaredKind, Variant, Block, AssertedBlockScope, BreakStatement, ContinueStatement, ClassDeclaration, BindingIdentifier, ClassElement, Expression, MethodDefinition, DebuggerStatement, EmptyStatement, ExpressionStatement, EagerFunctionDeclaration, LazyFunctionDeclaration, IfStatement, DoWhileStatement, VariableDeclaration, VariableDeclarator, VariableDeclarationKind, Binding, ForInStatement, ForInOfBinding, AssignmentTarget, ForOfStatement, ForStatement, WhileStatement, LabelledStatement, ReturnStatement, SwitchStatement, SwitchCase, SwitchDefault, SwitchStatementWithDefault, ThrowStatement, TryCatchStatement, CatchClause, AssertedBoundNamesScope, AssertedBoundName, TryFinallyStatement, WithStatement, ObjectBinding, ArrayBinding, BindingPattern, BindingProperty, BindingPropertyIdentifier, BindingPropertyProperty, BindingWithInitializer, PropertyName, ComputedPropertyName, LiteralPropertyName, ObjectAssignmentTarget, ArrayAssignmentTarget, AssignmentTargetIdentifier, ComputedMemberAssignmentTarget, StaticMemberAssignmentTarget, AssignmentTargetPattern, SimpleAssignmentTarget, AssignmentTargetProperty, AssignmentTargetPropertyIdentifier, AssignmentTargetPropertyProperty, AssignmentTargetWithInitializer, Identifier, Super, LiteralBooleanExpression, LiteralInfinityExpression, LiteralNullExpression, LiteralNumericExpression, LiteralStringExpression, LiteralRegExpExpression, ArrayExpression, EagerArrowExpressionWithFunctionBody, LazyArrowExpressionWithFunctionBody, EagerArrowExpressionWithExpression, LazyArrowExpressionWithExpression, AssignmentExpression, BinaryExpression, CallExpression, CompoundAssignmentExpression, ComputedMemberExpression, ConditionalExpression, ClassExpression, EagerFunctionExpression, LazyFunctionExpression, IdentifierExpression, NewExpression, NewTargetExpression, ObjectExpression, UnaryExpression, StaticMemberExpression, TemplateExpression, ThisExpression, UpdateExpression, YieldExpression, YieldStarExpression, AwaitExpression, SpreadElement, BinaryOperator, Arguments, CompoundAssignmentOperator, ObjectProperty, DataProperty, ShorthandProperty, UnaryOperator, TemplateElement, UpdateOperator, Method, Setter, Getter, EagerMethod, LazyMethod, FunctionOrMethodContents, FunctionBody, AssertedParameterScope, FormalParameters, AssertedVarScope, AssertedMaybePositionalParameterName, AssertedPositionalParameterName, AssertedParameterName, AssertedRestParameterName, Parameter, EagerGetter, LazyGetter, GetterContents, LazySetter, EagerSetter, SetterContents, ArrowExpressionContentsWithFunctionBody, ArrowExpressionContentsWithExpression, FunctionExpressionContents } from "./types";
import { Section, Compression } from "./io/constants";

export default class Emitter {
    context: WriterContext
    writer: MultipartWritter

    constructor() {
        this.context = {
            stringsTable: [],
            grammarTable: [],
            variantTableToIndex: new Map(),
            stringsTableToIndex: new Map(),
            grammarTableToIndex: new Map()
        }
        this.writer = new MultipartWritter(this.context)
    }

    emitHeader() {
        return this.writer.writeHeader()
    }

    emitConst(value: string) {
        return this.writer.writeConst(value)
    }

    emitVarnum(value: number) {
        return this.writer.writeVarnum(value)
    }

    emitBoolean(value: boolean) {
        return this.writer.writeBoolean(value)
    }

    emitDouble(value: number) {
        return this.writer.writeDouble(value)
    }

    emitIdentifierName(value: string) {
        return this.writer.writeIdentifierName(value)
    }

    emitVariant(value: Variant) {
        return this.writer.writeVariant(value)
    }

    emitAtom(value: string) {
        return this.writer.writeAtom(value)
    }

    emitBuffer(buffer: ArrayBuffer) {
        return this.writer.writeBuffer(buffer)
    }

    emitInContext<T>(cb: () => T): [T, ArrayBuffer] {
        return this.writer.writeInContext(cb)
    }

    emitType(type: NodeType) {
        return this.writer.writeType(type)
    }

    emit(value: Program) {
        const [, treeBuffer] = this.emitInContext(() => {
            this.emitProgram(value)
        })
        this.emitHeader()

        this.emitConst(Section.Tree)
        this.emitConst(Compression.Identity)

        this.emitVarnum(treeBuffer.byteLength)
        this.emitBuffer(treeBuffer)

        return this.writer.getBuffer()
    }

    emitList<T>(list: FrozenArray<T>, cb: (v: T) => void) {
        this.emitVarnum(list.length)
        list.forEach(x => cb(x))
    }

    emitOptional<T>(node: T | null | undefined, cb: (v: T) => void) {
        if (node === null || node === undefined) {
            this.emitType(NodeType.Null)
        } else {
            cb(node)
        }
    }

    emitProgram(node: Program) {
        switch (node.type) {
            case NodeType.Script:
                return this.emitScript(node)
            case NodeType.Module:
                throw new Error("Not Implements")
        }
    }

    emitScript(node: Script) {
        this.emitType(node.type)
        this.emitAssertedScriptGlobalScope(node.scope)
        this.emitDirectiveList(node.directives)
        this.emitStatementList(node.statements)
    }

    emitAssertedScriptGlobalScope(node: AssertedScriptGlobalScope) {
        this.emitType(node.type)
        this.emitAssertedDeclaredNameList(node.declaredNames)
        this.emitBoolean(node.hasDirectEval)
    }

    emitAssertedDeclaredNameList(nodes: FrozenArray<AssertedDeclaredName>) {
        this.emitList(nodes, this.emitAssertedDeclaredName.bind(this))
    }

    emitAssertedDeclaredName(node: AssertedDeclaredName) {
        this.emitType(node.type)
        this.emitIdentifierName(node.name)
        this.emitAssertedDeclaredKind(node.kind)
        this.emitBoolean(node.isCaptured)
    }

    emitAssertedDeclaredKind(kind: AssertedDeclaredKind) {
        switch (kind) {
            case AssertedDeclaredKind.Var:
                return this.emitVariant(Variant.AssertedDeclaredKindOrVariableDeclarationKindVar)
            case AssertedDeclaredKind.ConstLexical:
                return this.emitVariant(Variant.ConstLexical)
            case AssertedDeclaredKind.NonConstLexical:
                return this.emitVariant(Variant.NonConstLexical)
        }
    }

    emitDirectiveList(nodes: FrozenArray<Directive>) {
        this.emitList(nodes, this.emitDirective.bind(this))
    }

    emitDirective(node: Directive) {
        this.emitType(node.type)
        this.emitAtom(node.rawValue)
    }

    emitStatementList(nodes: FrozenArray<Statement>) {
        this.emitList(nodes, this.emitStatement.bind(this))
    }

    emitIdentifier(node: Identifier) {
        this.emitIdentifierName(node)
    }

    emitStatement(node: Statement) {
        switch (node.type) {
            case NodeType.Block:
                return this.emitBlock(node)
            case NodeType.BreakStatement:
                return this.emitBreakStatement(node)
            case NodeType.ContinueStatement:
                return this.emitContinueStatement(node)
            case NodeType.ClassDeclaration:
                return this.emitClassDeclaration(node)
            case NodeType.DebuggerStatement:
                return this.emitDebuggerStatement(node)
            case NodeType.EmptyStatement:
                return this.emitEmptyStatement(node)
            case NodeType.ExpressionStatement:
                return this.emitExpressionStatement(node)
            case NodeType.EagerFunctionDeclaration:
                return this.emitEagerFunctionDeclaration(node)
            case NodeType.LazyFunctionDeclaration:
                return this.emitLazyFunctionDeclaration(node)
            case NodeType.IfStatement:
                return this.emitIfStatement(node)
            case NodeType.DoWhileStatement:
                return this.emitDoWhileStatement(node)
            case NodeType.ForInStatement:
                return this.emitForInStatement(node)
            case NodeType.ForOfStatement:
                return this.emitForOfStatement(node)
            case NodeType.ForStatement:
                return this.emitForStatement(node)
            case NodeType.WhileStatement:
                return this.emitWhileStatement(node)
            case NodeType.LabelledStatement:
                return this.emitLabelledStatement(node)
            case NodeType.ReturnStatement:
                return this.emitReturnStatement(node)
            case NodeType.SwitchStatement:
                return this.emitSwitchStatement(node)
            case NodeType.SwitchStatementWithDefault:
                return this.emitSwitchStatementWithDefault(node)
            case NodeType.ThrowStatement:
                return this.emitThrowStatement(node)
            case NodeType.TryCatchStatement:
                return this.emitTryCatchStatement(node)
            case NodeType.TryFinallyStatement:
                return this.emitTryFinallyStatement(node)
            case NodeType.VariableDeclaration:
                return this.emitVariableDeclaration(node)
            case NodeType.WithStatement:
                return this.emitWithStatement(node)
        }
    }
    emitBlock(node: Block) {
        this.emitType(node.type)
        this.emitAssertedBlockScope(node.scope)
        this.emitStatementList(node.statements)
    }

    emitAssertedBlockScope(node: AssertedBlockScope) {
        this.emitType(node.type)
        this.emitAssertedDeclaredNameList(node.declaredNames)
        this.emitBoolean(node.hasDirectEval)
    }

    emitBreakStatement(node: BreakStatement) {
        this.emitType(node.type)
        this.emitOptional(node.label, this.emitAtom.bind(this))
    }

    emitContinueStatement(node: ContinueStatement) {
        this.emitType(node.type)
        this.emitOptional(node.label, this.emitAtom.bind(this))
    }
    emitClassDeclaration(node: ClassDeclaration) {
        this.emitType(node.type)
        this.emitBindingIdentifier(node.name)
        this.emitOptional(node.super, this.emitExpression.bind(this))
        this.emitClassElementList(node.elements)
    }

    emitClassElementList(nodes: FrozenArray<ClassElement>) {
        return this.emitList(nodes, this.emitClassElement.bind(this))
    }

    emitClassElement(node: ClassElement) {
        this.emitType(node.type)
        this.emitBoolean(node.isStatic)
        this.emitMethodDefinition(node.method)
    }

    emitMethodDefinition(node: MethodDefinition) {
        switch (node.type) {
            case NodeType.EagerMethod:
            case NodeType.LazyMethod:
                return this.emitMethod(node)
            case NodeType.EagerGetter:
            case NodeType.LazyGetter:
                return this.emitGetter(node)
            case NodeType.EagerSetter:
            case NodeType.LazySetter:
                return this.emitSetter(node)
        }
    }

    emitMethod(node: Method) {
        switch (node.type) {
            case NodeType.EagerMethod:
                return this.emitEagerMethod(node)
            case NodeType.LazyMethod:
                return this.emitLazyMethod(node)
        }
    }

    emitEagerMethod(node: EagerMethod) {
        this.emitType(node.type)
        this.emitBoolean(node.isAsync)
        this.emitBoolean(node.isGenerator)
        this.emitPropertyName(node.name)
        this.emitVarnum(node.length)
        this.emitDirectiveList(node.directives)
        this.emitFunctionOrMethodContents(node.contents)
    }

    emitLazyMethod(node: LazyMethod) {
        this.emitType(node.type)
        this.emitBoolean(node.isAsync)
        this.emitBoolean(node.isGenerator)
        this.emitPropertyName(node.name)
        this.emitVarnum(node.length)
        this.emitDirectiveList(node.directives)
        this.emitFunctionOrMethodContents(node.contents)
    }

    emitFunctionOrMethodContents(node: FunctionOrMethodContents) {
        this.emitType(node.type)
        this.emitBoolean(node.isThisCaptured)
        this.emitAssertedParameterScope(node.parameterScope)
        this.emitFormalParameters(node.params)
        this.emitAssertedVarScope(node.bodyScope)
        this.emitFunctionBody(node.body)
    }

    emitAssertedParameterScope(node: AssertedParameterScope) {
        this.emitType(node.type)
        this.emitAssertedMaybePositionalParameterNameList(node.paramNames)
        this.emitBoolean(node.hasDirectEval)
        this.emitBoolean(node.isSimpleParameterList)
    }

    emitAssertedMaybePositionalParameterNameList(nodes: FrozenArray<AssertedMaybePositionalParameterName>) {
        this.emitList(nodes, this.emitAssertedMaybePositionalParameterName.bind(this))
    }

    emitAssertedMaybePositionalParameterName(node: AssertedMaybePositionalParameterName) {
        switch (node.type) {
            case NodeType.AssertedPositionalParameterName:
                return this.emitAssertedPositionalParameterName(node)
            case NodeType.AssertedRestParameterName:
                return this.emitAssertedRestParameterName(node)
            case NodeType.AssertedParameterName:
                return this.emitAssertedParameterName(node)
        }
    }

    emitAssertedPositionalParameterName(node: AssertedPositionalParameterName) {
        this.emitType(node.type)
        this.emitVarnum(node.index)
        this.emitIdentifierName(node.name)
        this.emitBoolean(node.isCaptured)
    }

    emitAssertedRestParameterName(node: AssertedRestParameterName) {
        this.emitType(node.type)
        this.emitIdentifierName(node.name)
        this.emitBoolean(node.isCaptured)
    }

    emitAssertedParameterName(node: AssertedParameterName) {
        this.emitType(node.type)
        this.emitIdentifierName(node.name)
        this.emitBoolean(node.isCaptured)
    }

    emitFormalParameters(node: FormalParameters) {
        this.emitType(node.type)
        this.emitParameterList(node.items)
        this.emitOptional(node.rest, this.emitBinding.bind(this))
    }

    emitParameterList(nodes: FrozenArray<Parameter>) {
        this.emitList(nodes, this.emitParameter.bind(this))
    }

    emitParameter(node: Parameter) {
        switch (node.type) {
            case NodeType.BindingWithInitializer:
                return this.emitBindingWithInitializer(node)
            default:
                return this.emitBinding(node)
        }
    }

    emitAssertedVarScope(node: AssertedVarScope) {
        this.emitType(node.type)
        this.emitAssertedDeclaredNameList(node.declaredNames)
        this.emitBoolean(node.hasDirectEval)
    }

    emitFunctionBody(node: FunctionBody) {
        this.emitStatementList(node)
    }

    emitGetter(node: Getter) {
        switch (node.type) {
            case NodeType.EagerGetter:
                return this.emitEagerGetter(node)
            case NodeType.LazyGetter:
        }
    }

    emitEagerGetter(node: EagerGetter) {
        this.emitType(node.type)
        this.emitPropertyName(node.name)
        this.emitDirectiveList(node.directives)
        this.emitGetterContents(node.contents)
    }

    emitLazyGetter(node: LazyGetter) {
        this.emitType(node.type)
        this.emitPropertyName(node.name)
        this.emitDirectiveList(node.directives)
        this.emitGetterContents(node.contents)
    }

    emitGetterContents(node: GetterContents) {
        this.emitType(node.type)
        this.emitBoolean(node.isThisCaptured)
        this.emitAssertedVarScope(node.bodyScope)
        this.emitFunctionBody(node.body)
    }

    emitSetter(node: Setter) {
        switch (node.type) {
            case NodeType.EagerSetter:
                return this.emitEagerSetter(node)
            case NodeType.LazySetter:
                return this.emitLazySetter(node)
        }
    }

    emitEagerSetter(node: EagerSetter) {
        this.emitType(node.type)
        this.emitPropertyName(node.name)
        this.emitVarnum(node.length)
        this.emitDirectiveList(node.directives)
        this.emitSetterContents(node.contents)
    }

    emitLazySetter(node: LazySetter) {
        this.emitType(node.type)
        this.emitPropertyName(node.name)
        this.emitVarnum(node.length)
        this.emitDirectiveList(node.directives)
        this.emitSetterContents(node.contents)
    }

    emitSetterContents(node: SetterContents) {
        this.emitType(node.type)
        this.emitBoolean(node.isThisCaptured)
        this.emitAssertedParameterScope(node.parameterScope)
        this.emitParameter(node.param)
        this.emitAssertedVarScope(node.bodyScope)
        this.emitFunctionBody(node.body)
    }

    emitBindingIdentifier(node: BindingIdentifier) {
        this.emitType(node.type)
        this.emitIdentifierName(node.name)
    }

    emitDebuggerStatement(node: DebuggerStatement) {
        this.emitType(node.type)
    }

    emitEmptyStatement(node: EmptyStatement) {
        this.emitType(node.type)
    }

    emitExpressionStatement(node: ExpressionStatement) {
        this.emitType(node.type)
        this.emitExpression(node.expression)
    }

    emitEagerFunctionDeclaration(node: EagerFunctionDeclaration) {
        this.emitType(node.type)
        this.emitBoolean(node.isAsync)
        this.emitBoolean(node.isGenerator)
        this.emitBindingIdentifier(node.name)
        this.emitVarnum(node.length)
        this.emitDirectiveList(node.directives)
        this.emitFunctionOrMethodContents(node.contents)
    }

    emitLazyFunctionDeclaration(node: LazyFunctionDeclaration) {
        this.emitType(node.type)
        this.emitBoolean(node.isAsync)
        this.emitBoolean(node.isGenerator)
        this.emitBindingIdentifier(node.name)
        this.emitVarnum(node.length)
        this.emitDirectiveList(node.directives)
        this.emitFunctionOrMethodContents(node.contents)
    }

    emitIfStatement(node: IfStatement) {
        this.emitType(node.type)
        this.emitExpression(node.test)
        this.emitStatement(node.consequent)
        this.emitOptional(node.alternate, this.emitStatement.bind(this))
    }

    emitDoWhileStatement(node: DoWhileStatement) {
        this.emitType(node.type)
        this.emitExpression(node.test)
        this.emitStatement(node.body)
    }

    emitForInStatement(node: ForInStatement) {
        this.emitType(node.type)
        this.emitForInOfBindingOrAssignmentTarget(node.left)
        this.emitExpression(node.right)
        this.emitStatement(node.body)
    }

    emitForOfStatement(node: ForOfStatement) {
        this.emitType(node.type)
        this.emitForInOfBindingOrAssignmentTarget(node.left)
        this.emitExpression(node.right)
        this.emitStatement(node.body)
    }

    emitForStatement(node: ForStatement) {
        this.emitType(node.type)
        this.emitOptional(node.init, this.emitVariableDeclarationOrExpression.bind(this))
        this.emitOptional(node.test, this.emitExpression.bind(this))
        this.emitOptional(node.update, this.emitExpression.bind(this))
        this.emitStatement(node.body)
    }

    emitVariableDeclarationOrExpression(node: VariableDeclaration | Expression) {
        switch (node.type) {
            case NodeType.VariableDeclaration:
                return this.emitVariableDeclaration(node)
            default:
                return this.emitExpression(node)
        }
    }

    emitForInOfBindingOrAssignmentTarget(node: ForInOfBinding | AssignmentTarget) {
        switch (node.type) {
            case NodeType.ForInOfBinding:
                return this.emitForInOfBinding(node)
            case NodeType.ObjectAssignmentTarget:
            case NodeType.ArrayAssignmentTarget:
            case NodeType.AssignmentTargetIdentifier:
            case NodeType.ComputedMemberAssignmentTarget:
            case NodeType.StaticMemberAssignmentTarget:
                return this.emitAssignmentTarget(node)
        }
    }

    emitAssignmentTarget(node: AssignmentTarget) {
        switch (node.type) {
            case NodeType.ObjectAssignmentTarget:
            case NodeType.ArrayAssignmentTarget:
                return this.emitAssignmentTargetPattern(node)
            case NodeType.AssignmentTargetIdentifier:
            case NodeType.ComputedMemberAssignmentTarget:
            case NodeType.StaticMemberAssignmentTarget:
                return this.emitSimpleAssignmentTarget(node)
        }
    }

    emitAssignmentTargetPattern(node: AssignmentTargetPattern) {
        switch (node.type) {
            case NodeType.ObjectAssignmentTarget:
                return this.emitObjectAssignmentTarget(node)
            case NodeType.ArrayAssignmentTarget:
                return this.emitArrayAssignmentTarget(node)
        }
    }

    emitObjectAssignmentTarget(node: ObjectAssignmentTarget) {
        this.emitType(node.type)
        this.emitAssignmentTargetPropertyList(node.properties)
    }

    emitAssignmentTargetPropertyList(nodes: FrozenArray<AssignmentTargetProperty>) {
        this.emitList(nodes, this.emitAssignmentTargetProperty.bind(this))
    }

    emitAssignmentTargetProperty(node: AssignmentTargetProperty) {
        switch (node.type) {
            case NodeType.AssignmentTargetPropertyIdentifier:
                return this.emitAssignmentTargetPropertyIdentifier(node)
            case NodeType.AssignmentTargetPropertyProperty:
                return this.emitAssignmentTargetPropertyProperty(node)
        }
    }

    emitAssignmentTargetPropertyIdentifier(node: AssignmentTargetPropertyIdentifier) {
        this.emitType(node.type)
        this.emitAssignmentTargetIdentifier(node.binding)
        this.emitOptional(node.init, this.emitExpression.bind(this))
    }

    emitAssignmentTargetPropertyProperty(node: AssignmentTargetPropertyProperty) {
        this.emitType(node.type)
        this.emitPropertyName(node.name)
        this.emitAssignmentTargetOrAssignmentTargetWithInitializer(node.binding)
    }

    emitAssignmentTargetOrAssignmentTargetWithInitializerList(nodes: FrozenArray<AssignmentTarget | AssignmentTargetWithInitializer>) {
        this.emitList(nodes, this.emitAssignmentTargetOrAssignmentTargetWithInitializer.bind(this))
    }

    emitAssignmentTargetOrAssignmentTargetWithInitializer(node: AssignmentTarget | AssignmentTargetWithInitializer) {
        switch (node.type) {
            case NodeType.AssignmentTargetWithInitializer:
                return this.emitAssignmentTargetWithInitializer(node)
            default:
                return this.emitAssignmentTarget(node)
        }
    }

    emitAssignmentTargetWithInitializer(node: AssignmentTargetWithInitializer) {
        this.emitType(node.type)
        this.emitAssignmentTarget(node.binding)
        this.emitExpression(node.init)
    }

    emitArrayAssignmentTarget(node: ArrayAssignmentTarget) {
        this.emitType(node.type)
        this.emitAssignmentTargetOrAssignmentTargetWithInitializerList(node.elements)
        this.emitOptional(node.rest, this.emitAssignmentTarget.bind(this))
    }

    emitSimpleAssignmentTarget(node: SimpleAssignmentTarget) {
        switch (node.type) {
            case NodeType.AssignmentTargetIdentifier:
                return this.emitAssignmentTargetIdentifier(node)
            case NodeType.ComputedMemberAssignmentTarget:
                return this.emitComputedMemberAssignmentTarget(node)
            case NodeType.StaticMemberAssignmentTarget:
                return this.emitStaticMemberAssignmentTarget(node)
        }
    }

    emitAssignmentTargetIdentifier(node: AssignmentTargetIdentifier) {
        this.emitType(node.type)
        this.emitIdentifier(node.name)
    }

    emitComputedMemberAssignmentTarget(node: ComputedMemberAssignmentTarget) {
        this.emitType(node.type)
        this.emitExpressionOrSuper(node._object)
        this.emitExpression(node.expression)
    }

    emitStaticMemberAssignmentTarget(node: StaticMemberAssignmentTarget) {
        this.emitType(node.type)
        this.emitExpressionOrSuper(node._object)
        this.emitIdentifierName(node.property)
    }

    emitExpressionOrSuper(node: Expression | Super) {
        switch (node.type) {
            case NodeType.Super:
                return this.emitSuper(node)
            default:
                return this.emitExpression(node)
        }
    }

    emitSuper(node: Super) {
        this.emitType(node.type)
    }

    emitForInOfBinding(node: ForInOfBinding) {
        this.emitType(node.type)
        this.emitVariableDeclarationKind(node.kind)
        this.emitBinding(node.binding)
    }

    emitWhileStatement(node: WhileStatement) {
        this.emitType(node.type)
        this.emitExpression(node.test)
        this.emitStatement(node.body)
    }

    emitLabelledStatement(node: LabelledStatement) {
        this.emitType(node.type)
        this.emitAtom(node.label)
        this.emitStatement(node.body)
    }

    emitReturnStatement(node: ReturnStatement) {
        this.emitType(node.type)
        this.emitOptional(node.expression, this.emitExpression.bind(this))
    }

    emitSwitchStatement(node: SwitchStatement) {
        this.emitType(node.type)
        this.emitExpression(node.discriminant)
        this.emitSwitchCaseList(node.cases)
    }

    emitSwitchCaseList(nodes: FrozenArray<SwitchCase>) {
        this.emitList(nodes, this.emitSwitchCase.bind(this))
    }

    emitSwitchCase(node: SwitchCase) {
        this.emitType(node.type)
        this.emitExpression(node.test)
        this.emitStatementList(node.consequent)
    }

    emitSwitchStatementWithDefault(node: SwitchStatementWithDefault) {
        this.emitType(node.type)
        this.emitExpression(node.discriminant)
        this.emitSwitchCaseList(node.preDefaultCases)
        this.emitSwitchDefault(node.defaultCase)
        this.emitSwitchCaseList(node.postDefaultCases)
    }

    emitSwitchDefault(node: SwitchDefault) {
        this.emitType(node.type)
        this.emitStatementList(node.consequent)
    }

    emitThrowStatement(node: ThrowStatement) {
        this.emitType(node.type)
        this.emitExpression(node.expression)
    }

    emitTryCatchStatement(node: TryCatchStatement) {
        this.emitType(node.type)
        this.emitBlock(node.body)
        this.emitCatchClause(node.catchClause)
    }

    emitCatchClause(node: CatchClause) {
        this.emitType(node.type)
        this.emitAssertedBoundNamesScope(node.bindingScope)
        this.emitBinding(node.binding)
        this.emitBlock(node.body)
    }

    emitAssertedBoundNamesScope(node: AssertedBoundNamesScope) {
        this.emitType(node.type)
        this.emitAssertedBoundNameList(node.boundNames)
        this.emitBoolean(node.hasDirectEval)
    }

    emitAssertedBoundNameList(nodes: FrozenArray<AssertedBoundName>) {
        this.emitList(nodes, this.emitAssertedBoundName.bind(this))
    }

    emitAssertedBoundName(node: AssertedBoundName) {
        this.emitType(node.type)
        this.emitIdentifierName(node.name)
        this.emitBoolean(node.isCaptured)
    }

    emitBinding(node: Binding) {
        switch (node.type) {
            case NodeType.ObjectBinding:
            case NodeType.ArrayBinding:
                return this.emitBindingPattern(node)
            case NodeType.BindingIdentifier:
                return this.emitBindingIdentifier(node)
        }
    }

    emitBindingPattern(node: BindingPattern) {
        switch (node.type) {
            case NodeType.ObjectBinding:
                return this.emitObjectBinding(node)
            case NodeType.ArrayBinding:
                return this.emitArrayBinding(node)
        }
    }

    emitObjectBinding(node: ObjectBinding) {
        this.emitType(node.type)
        this.emitBindingPropertyList(node.properties)
    }

    emitBindingPropertyList(nodes: FrozenArray<BindingProperty>) {
        this.emitList(nodes, this.emitBindingProperty.bind(this))
    }

    emitBindingProperty(node: BindingProperty) {
        switch (node.type) {
            case NodeType.BindingPropertyIdentifier:
                return this.emitBindingPropertyIdentifier(node)
            case NodeType.BindingPropertyProperty:
                return this.emitBindingPropertyProperty(node)
        }
    }

    emitBindingPropertyIdentifier(node: BindingPropertyIdentifier) {
        this.emitType(node.type)
        this.emitBindingIdentifier(node.binding)
        this.emitOptional(node.init, this.emitExpression.bind(this))
    }

    emitBindingPropertyProperty(node: BindingPropertyProperty) {
        this.emitType(node.type)
        this.emitPropertyName(node.name)
        this.emitBindingOrBindingWithInitializer(node.binding)
    }

    emitPropertyName(node: PropertyName) {
        switch (node.type) {
            case NodeType.ComputedPropertyName:
                return this.emitComputedPropertyName(node)
            case NodeType.LiteralPropertyName:
                return this.emitLiteralPropertyName(node)
        }
    }

    emitComputedPropertyName(node: ComputedPropertyName) {
        this.emitType(node.type)
        this.emitExpression(node.expression)
    }

    emitLiteralPropertyName(node: LiteralPropertyName) {
        this.emitType(node.type)
        this.emitAtom(node.value)
    }

    emitBindingOrBindingWithInitializerList(nodes: FrozenArray<Binding | BindingWithInitializer>) {
        this.emitList(nodes, this.emitBindingOrBindingWithInitializer.bind(this))
    }

    emitBindingOrBindingWithInitializer(node: Binding | BindingWithInitializer) {
        switch (node.type) {
            case NodeType.BindingWithInitializer:
                return this.emitBindingWithInitializer(node)
            default:
                return this.emitBinding(node)
        }
    }

    emitBindingWithInitializer(node: BindingWithInitializer) {
        this.emitType(node.type)
        this.emitBinding(node.binding)
        this.emitExpression(node.init)
    }

    emitArrayBinding(node: ArrayBinding) {
        this.emitType(node.type)
        this.emitBindingOrBindingWithInitializerList(node.elements)
        this.emitOptional(node.rest, this.emitBinding.bind(this))
    }

    emitTryFinallyStatement(node: TryFinallyStatement) {
        this.emitType(node.type)
        this.emitBlock(node.body)
        this.emitOptional(node.catchClause, this.emitCatchClause.bind(this))
        this.emitBlock(node.finalizer)
    }

    emitVariableDeclaration(node: VariableDeclaration) {
        this.emitType(node.type)
        this.emitVariableDeclarationKind(node.kind)
        this.emitVariableDeclaratorList(node.declarators)
    }

    emitVariableDeclaratorList(nodes: FrozenArray<VariableDeclarator>) {
        this.emitList(nodes, this.emitVariableDeclarator.bind(this))
    }

    emitVariableDeclarator(node: VariableDeclarator) {
        this.emitType(node.type)
        this.emitBinding(node.binding)
        this.emitOptional(node.init, this.emitExpression.bind(this))
    }

    emitVariableDeclarationKind(kind: VariableDeclarationKind) {
        switch (kind) {
            case VariableDeclarationKind.Let:
                return this.emitVariant(Variant.Let)
            case VariableDeclarationKind.Const:
                return this.emitVariant(Variant.Const)
            case VariableDeclarationKind.Var:
                return this.emitVariant(Variant.AssertedDeclaredKindOrVariableDeclarationKindVar)
        }
    }

    emitWithStatement(node: WithStatement) {
        this.emitType(node.type)
        this.emitExpression(node._object)
        this.emitStatement(node.body)
    }

    emitExpression(node: Expression) {
        switch (node.type) {
            case NodeType.LiteralBooleanExpression:
                return this.emitLiteralBooleanExpression(node)
            case NodeType.LiteralInfinityExpression:
                return this.emitLiteralInfinityExpression(node)
            case NodeType.LiteralNullExpression:
                return this.emitLiteralNullExpression(node)
            case NodeType.LiteralNumericExpression:
                return this.emitLiteralNumericExpression(node)
            case NodeType.LiteralStringExpression:
                return this.emitLiteralStringExpression(node)
            case NodeType.LiteralRegExpExpression:
                return this.emitLiteralRegExpExpression(node)
            case NodeType.ArrayExpression:
                return this.emitArrayExpression(node)
            case NodeType.EagerArrowExpressionWithFunctionBody:
                return this.emitEagerArrowExpressionWithFunctionBody(node)
            case NodeType.LazyArrowExpressionWithFunctionBody:
                return this.emitLazyArrowExpressionWithFunctionBody(node)
            case NodeType.EagerArrowExpressionWithExpression:
                return this.emitEagerArrowExpressionWithExpression(node)
            case NodeType.LazyArrowExpressionWithExpression:
                return this.emitLazyArrowExpressionWithExpression(node)
            case NodeType.AssignmentExpression:
                return this.emitAssignmentExpression(node)
            case NodeType.BinaryExpression:
                return this.emitBinaryExpression(node)
            case NodeType.CallExpression:
                return this.emitCallExpression(node)
            case NodeType.CompoundAssignmentExpression:
                return this.emitCompoundAssignmentExpression(node)
            case NodeType.ComputedMemberExpression:
                return this.emitComputedMemberExpression(node)
            case NodeType.ConditionalExpression:
                return this.emitConditionalExpression(node)
            case NodeType.ClassExpression:
                return this.emitClassExpression(node)
            case NodeType.EagerFunctionExpression:
                return this.emitEagerFunctionExpression(node)
            case NodeType.LazyFunctionExpression:
                return this.emitLazyFunctionExpression(node)
            case NodeType.IdentifierExpression:
                return this.emitIdentifierExpression(node)
            case NodeType.NewExpression:
                return this.emitNewExpression(node)
            case NodeType.NewTargetExpression:
                return this.emitNewTargetExpression(node)
            case NodeType.ObjectExpression:
                return this.emitObjectExpression(node)
            case NodeType.UnaryExpression:
                return this.emitUnaryExpression(node)
            case NodeType.StaticMemberExpression:
                return this.emitStaticMemberExpression(node)
            case NodeType.TemplateExpression:
                return this.emitTemplateExpression(node)
            case NodeType.ThisExpression:
                return this.emitThisExpression(node)
            case NodeType.UpdateExpression:
                return this.emitUpdateExpression(node)
            case NodeType.YieldExpression:
                return this.emitYieldExpression(node)
            case NodeType.YieldStarExpression:
                return this.emitYieldStarExpression(node)
            case NodeType.AwaitExpression:
                return this.emitAwaitExpression(node)
        }
    }

    emitLiteralBooleanExpression(node: LiteralBooleanExpression) {
        this.emitType(node.type)
        this.emitBoolean(node.value)
    }

    emitLiteralInfinityExpression(node: LiteralInfinityExpression) {
        throw new Error("Method not implemented.");
    }

    emitLiteralNullExpression(node: LiteralNullExpression) {
        this.emitType(node.type)
    }

    emitLiteralNumericExpression(node: LiteralNumericExpression) {
        this.emitType(node.type)
        this.emitDouble(node.value)
    }

    emitLiteralStringExpression(node: LiteralStringExpression) {
        this.emitType(node.type)
        this.emitAtom(node.value)
    }

    emitLiteralRegExpExpression(node: LiteralRegExpExpression) {
        this.emitType(node.type)
        this.emitAtom(node.pattern)
        this.emitAtom(node.flags)
    }

    emitArrayExpression(node: ArrayExpression) {
        this.emitType(node.type)
        this.emitSpreadElementOrExpressionList(node.elements)
    }

    emitSpreadElementOrExpressionList(nodes: FrozenArray<SpreadElement | Expression>) {
        this.emitList(nodes, this.emitSpreadElementOrExpression.bind(this))
    }

    emitSpreadElementOrExpression(node: SpreadElement | Expression) {
        switch (node.type) {
            case NodeType.SpreadElement:
                return this.emitSpreadElement(node)
            default:
                return this.emitExpression(node)
        }
    }

    emitSpreadElement(node: SpreadElement) {
        this.emitType(node.type)
        this.emitExpression(node.expression)
    }

    emitEagerArrowExpressionWithFunctionBody(node: EagerArrowExpressionWithFunctionBody) {
        this.emitType(node.type)
        this.emitBoolean(node.isAsync)
        this.emitVarnum(node.length)
        this.emitDirectiveList(node.directives)
        this.emitArrowExpressionContentsWithFunctionBody(node.contents)
    }

    emitLazyArrowExpressionWithFunctionBody(node: LazyArrowExpressionWithFunctionBody) {
        this.emitType(node.type)
        this.emitBoolean(node.isAsync)
        this.emitVarnum(node.length)
        this.emitDirectiveList(node.directives)
        this.emitArrowExpressionContentsWithFunctionBody(node.contents)
    }

    emitArrowExpressionContentsWithFunctionBody(node: ArrowExpressionContentsWithFunctionBody) {
        this.emitType(node.type)
        this.emitAssertedParameterScope(node.parameterScope)
        this.emitFormalParameters(node.params)
        this.emitAssertedVarScope(node.bodyScope)
        this.emitFunctionBody(node.body)
    }

    emitEagerArrowExpressionWithExpression(node: EagerArrowExpressionWithExpression) {
        this.emitType(node.type)
        this.emitBoolean(node.isAsync)
        this.emitVarnum(node.length)
        this.emitArrowExpressionContentsWithExpression(node.contents)
    }

    emitLazyArrowExpressionWithExpression(node: LazyArrowExpressionWithExpression) {
        this.emitType(node.type)
        this.emitBoolean(node.isAsync)
        this.emitVarnum(node.length)
        this.emitArrowExpressionContentsWithExpression(node.contents)
    }

    emitArrowExpressionContentsWithExpression(node: ArrowExpressionContentsWithExpression) {
        this.emitType(node.type)
        this.emitAssertedParameterScope(node.parameterScope)
        this.emitFormalParameters(node.params)
        this.emitAssertedVarScope(node.bodyScope)
        this.emitExpression(node.body)
    }

    emitAssignmentExpression(node: AssignmentExpression) {
        this.emitType(node.type)
        this.emitAssignmentTarget(node.binding)
        this.emitExpression(node.expression)
    }

    emitBinaryExpression(node: BinaryExpression) {
        this.emitType(node.type)
        this.emitBinaryOperator(node.operator)
        this.emitExpression(node.left)
        this.emitExpression(node.right)
    }

    emitBinaryOperator(variant: BinaryOperator) {
        switch (variant) {
            case BinaryOperator.Comma:
                return this.emitVariant(Variant.Comma)
            case BinaryOperator.Or:
                return this.emitVariant(Variant.Or)
            case BinaryOperator.And:
                return this.emitVariant(Variant.And)
            case BinaryOperator.LogicOr:
                return this.emitVariant(Variant.LogicOr)
            case BinaryOperator.LogicXor:
                return this.emitVariant(Variant.LogicXor)
            case BinaryOperator.LogicAnd:
                return this.emitVariant(Variant.LogicAnd)
            case BinaryOperator.EqualEqual:
                return this.emitVariant(Variant.EqualEqual)
            case BinaryOperator.NotEqual:
                return this.emitVariant(Variant.NotEqual)
            case BinaryOperator.EqualEqualEqual:
                return this.emitVariant(Variant.EqualEqualEqual)
            case BinaryOperator.NotEqualEqual:
                return this.emitVariant(Variant.NotEqualEqual)
            case BinaryOperator.LessThan:
                return this.emitVariant(Variant.LessThan)
            case BinaryOperator.LessThanEqual:
                return this.emitVariant(Variant.LessThanEqual)
            case BinaryOperator.GreaterThan:
                return this.emitVariant(Variant.GreaterThan)
            case BinaryOperator.GreaterThanEqual:
                return this.emitVariant(Variant.GreaterThanEqual)
            case BinaryOperator.In:
                return this.emitVariant(Variant.In)
            case BinaryOperator.InstanceOf:
                return this.emitVariant(Variant.InstanceOf)
            case BinaryOperator.LessThanLessThan:
                return this.emitVariant(Variant.LessThanLessThan)
            case BinaryOperator.GreaterThanGreaterThan:
                return this.emitVariant(Variant.GreaterThanGreaterThan)
            case BinaryOperator.GreaterThanGreaterThanGreaterThan:
                return this.emitVariant(Variant.GreaterThanGreaterThanGreaterThan)
            case BinaryOperator.Plus:
                return this.emitVariant(Variant.BinaryOperatorOrUnaryOperatorPlus)
            case BinaryOperator.Minus:
                return this.emitVariant(Variant.BinaryOperatorOrUnaryOperatorMinus)
            case BinaryOperator.Star:
                return this.emitVariant(Variant.Star)
            case BinaryOperator.Div:
                return this.emitVariant(Variant.Div)
            case BinaryOperator.Mod:
                return this.emitVariant(Variant.Mod)
            case BinaryOperator.StarStar:
                return this.emitVariant(Variant.StarStar)
        }
    }

    emitCallExpression(node: CallExpression) {
        this.emitType(node.type)
        this.emitExpressionOrSuper(node.callee)
        this.emitArguments(node.arguments)
    }

    emitArguments(node: Arguments) {
        this.emitSpreadElementOrExpressionList(node)
    }

    emitCompoundAssignmentExpression(node: CompoundAssignmentExpression) {
        this.emitType(node.type)
        this.emitCompoundAssignmentOperator(node.operator)
        this.emitSimpleAssignmentTarget(node.binding)
        this.emitExpression(node.expression)
    }

    emitCompoundAssignmentOperator(node: CompoundAssignmentOperator) {
        switch (node) {
            case CompoundAssignmentOperator.PlusEqual:
                return this.emitVariant(Variant.PlusEqual)
            case CompoundAssignmentOperator.MinusEqual:
                return this.emitVariant(Variant.MinusEqual)
            case CompoundAssignmentOperator.StarEqual:
                return this.emitVariant(Variant.StarEqual)
            case CompoundAssignmentOperator.DivEuqal:
                return this.emitVariant(Variant.DivEuqal)
            case CompoundAssignmentOperator.ModEqual:
                return this.emitVariant(Variant.ModEqual)
            case CompoundAssignmentOperator.StarStarEqual:
                return this.emitVariant(Variant.StarStarEqual)
            case CompoundAssignmentOperator.LessThanLessThanEqual:
                return this.emitVariant(Variant.LessThanLessThanEqual)
            case CompoundAssignmentOperator.GreaterThanGreaterThanEequal:
                return this.emitVariant(Variant.GreaterThanGreaterThanEequal)
            case CompoundAssignmentOperator.GreaterThanGreaterThanGreaterThanEequal:
                return this.emitVariant(Variant.GreaterThanGreaterThanGreaterThanEequal)
            case CompoundAssignmentOperator.LoginOrEqual:
                return this.emitVariant(Variant.LoginOrEqual)
            case CompoundAssignmentOperator.LogicAndEuqal:
                return this.emitVariant(Variant.LogicAndEuqal)
            case CompoundAssignmentOperator.LogicXorEqual:
                return this.emitVariant(Variant.LogicXorEqual)
        }
    }

    emitComputedMemberExpression(node: ComputedMemberExpression) {
        this.emitType(node.type)
        this.emitExpressionOrSuper(node._object)
        this.emitExpression(node.expression)
    }

    emitConditionalExpression(node: ConditionalExpression) {
        this.emitType(node.type)
        this.emitExpression(node.test)
        this.emitExpression(node.consequent)
        this.emitExpression(node.alternate)
    }

    emitClassExpression(node: ClassExpression) {
        this.emitType(node.type)
        this.emitOptional(node.name, this.emitBindingIdentifier.bind(this))
        this.emitOptional(node.super, this.emitExpression.bind(this))
        this.emitClassElementList(node.elements)
    }

    emitEagerFunctionExpression(node: EagerFunctionExpression) {
        this.emitType(node.type)
        this.emitBoolean(node.isAsync)
        this.emitBoolean(node.isGenerator)
        this.emitOptional(node.name, this.emitBindingIdentifier.bind(this))
        this.emitVarnum(node.length)
        this.emitDirectiveList(node.directives)
        this.emitFunctionExpressionContents(node.contents)
    }

    emitLazyFunctionExpression(node: LazyFunctionExpression) {
        this.emitType(node.type)
        this.emitBoolean(node.isAsync)
        this.emitBoolean(node.isGenerator)
        this.emitOptional(node.name, this.emitBindingIdentifier.bind(this))
        this.emitVarnum(node.length)
        this.emitDirectiveList(node.directives)
        this.emitFunctionExpressionContents(node.contents)
    }

    emitFunctionExpressionContents(node: FunctionExpressionContents) {
        this.emitType(node.type)
        this.emitBoolean(node.isFunctionNameCaptured)
        this.emitBoolean(node.isThisCaptured)
        this.emitAssertedParameterScope(node.parameterScope)
        this.emitFormalParameters(node.params)
        this.emitAssertedVarScope(node.bodyScope)
        this.emitFunctionBody(node.body)
    }

    emitIdentifierExpression(node: IdentifierExpression) {
        this.emitType(node.type)
        this.emitIdentifierName(node.name)
    }

    emitNewExpression(node: NewExpression) {
        this.emitType(node.type)
        this.emitExpression(node.callee)
        this.emitArguments(node.arguments)
    }

    emitNewTargetExpression(node: NewTargetExpression) {
        this.emitType(node.type)
    }

    emitObjectExpression(node: ObjectExpression) {
        this.emitType(node.type)
        this.emitObjectPropertyList(node.properties)
    }

    emitObjectPropertyList(nodes: FrozenArray<ObjectProperty>) {
        this.emitList(nodes, this.emitObjectProperty.bind(this))
    }

    emitObjectProperty(node: ObjectProperty) {
        switch (node.type) {
            case NodeType.EagerMethod:
            case NodeType.LazyMethod:
            case NodeType.EagerGetter:
            case NodeType.LazyGetter:
            case NodeType.EagerSetter:
            case NodeType.LazySetter:
                return this.emitMethodDefinition(node)
            case NodeType.DataProperty:
                return this.emitDataProperty(node)
            case NodeType.ShorthandProperty:
                return this.emitShorthandProperty(node)
        }
    }

    emitDataProperty(node: DataProperty) {
        this.emitType(node.type)
        this.emitPropertyName(node.name)
        this.emitExpression(node.expression)
    }

    emitShorthandProperty(node: ShorthandProperty) {
        this.emitType(node.type)
        this.emitIdentifierExpression(node.name)
    }

    emitUnaryExpression(node: UnaryExpression) {
        this.emitType(node.type)
        this.emitUnaryOperator(node.operator)
        this.emitExpression(node.operand)
    }

    emitUnaryOperator(node: UnaryOperator) {
        switch (node) {
            case UnaryOperator.Plus:
                return this.emitVariant(Variant.BinaryOperatorOrUnaryOperatorPlus)
            case UnaryOperator.Minus:
                return this.emitVariant(Variant.BinaryOperatorOrUnaryOperatorMinus)
            case UnaryOperator.Not:
                return this.emitVariant(Variant.Not)
            case UnaryOperator.LogicNot:
                return this.emitVariant(Variant.LogicNot)
            case UnaryOperator.TypeOf:
                return this.emitVariant(Variant.TypeOf)
            case UnaryOperator.Void:
                return this.emitVariant(Variant.Void)
            case UnaryOperator.Delete:
                return this.emitVariant(Variant.Delete)
        }
    }

    emitStaticMemberExpression(node: StaticMemberExpression) {
        this.emitType(node.type)
        this.emitExpressionOrSuper(node._object)
        this.emitIdentifierName(node.property)
    }

    emitTemplateExpression(node: TemplateExpression) {
        this.emitType(node.type)
        this.emitOptional(node.tag, this.emitExpression.bind(this))
        this.emitExpressionOrTemplateElement
    }

    emitExpressionOrTemplateElementList(nodes: FrozenArray<Expression | TemplateElement>) {
        return this.emitList(nodes, this.emitExpressionOrTemplateElement.bind(this))
    }

    emitExpressionOrTemplateElement(node: Expression | TemplateElement) {
        switch (node.type) {
            case NodeType.TemplateElement:
                return this.emitTemplateElement(node)
            default:
                return this.emitExpression(node)
        }
    }

    emitTemplateElement(node: TemplateElement) {
        throw new Error("Method not implemented.");
    }

    emitThisExpression(node: ThisExpression) {
        this.emitType(node.type)
    }

    emitUpdateExpression(node: UpdateExpression) {
        this.emitType(node.type)
        this.emitBoolean(node.isPrefix)
        this.emitUpdateOperator(node.operator)
        this.emitSimpleAssignmentTarget(node.operand)
    }

    emitUpdateOperator(node: UpdateOperator) {
        switch (node) {
            case UpdateOperator.PlusPlus:
                return this.emitVariant(Variant.PlusPlus)
            case UpdateOperator.MinusMinus:
                return this.emitVariant(Variant.MinusMinus)
        }
    }

    emitYieldExpression(node: YieldExpression) {
        this.emitType(node.type)
        this.emitOptional(node.expression, this.emitExpression.bind(this))
    }

    emitYieldStarExpression(node: YieldStarExpression) {
        this.emitType(node.type)
        this.emitExpression(node.expression)
    }

    emitAwaitExpression(node: AwaitExpression) {
        this.emitType(node.type)
        this.emitExpression(node.expression)
    }
}