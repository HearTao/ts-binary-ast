import MultipartWritter from "./writer";
import { WriterContext } from "./context";
import { Program, NodeType, Script, FrozenArray, Directive, Statement, AssertedScriptGlobalScope, AssertedDeclaredName, AssertedDeclaredKind, Variant, Block, AssertedBlockScope, BreakStatement, ContinueStatement, ClassDeclaration, BindingIdentifier, ClassElement, Expression, MethodDefinition, DebuggerStatement, EmptyStatement, ExpressionStatement, EagerFunctionDeclaration, LazyFunctionDeclaration, IfStatement, DoWhileStatement, VariableDeclaration, VariableDeclarator, VariableDeclarationKind, Binding, ForInStatement, ForInOfBinding, AssignmentTarget, ForOfStatement, ForStatement, WhileStatement, LabelledStatement, ReturnStatement, SwitchStatement, SwitchCase, SwitchDefault, SwitchStatementWithDefault, ThrowStatement, TryCatchStatement, CatchClause, AssertedBoundNamesScope, AssertedBoundName, TryFinallyStatement, WithStatement, ObjectBinding, ArrayBinding, BindingPattern, BindingProperty, BindingPropertyIdentifier, BindingPropertyProperty, BindingWithInitializer, PropertyName, ComputedPropertyName, LiteralPropertyName, ObjectAssignmentTarget, ArrayAssignmentTarget, AssignmentTargetIdentifier, ComputedMemberAssignmentTarget, StaticMemberAssignmentTarget, AssignmentTargetPattern, SimpleAssignmentTarget, AssignmentTargetProperty, AssignmentTargetPropertyIdentifier, AssignmentTargetPropertyProperty, AssignmentTargetWithInitializer, Identifier, Super, LiteralBooleanExpression, LiteralInfinityExpression, LiteralNullExpression, LiteralNumericExpression, LiteralStringExpression, LiteralRegExpExpression, ArrayExpression, EagerArrowExpressionWithFunctionBody, LazyArrowExpressionWithFunctionBody, EagerArrowExpressionWithExpression, LazyArrowExpressionWithExpression, AssignmentExpression, BinaryExpression, CallExpression, CompoundAssignmentExpression, ComputedMemberExpression, ConditionalExpression, ClassExpression, EagerFunctionExpression, LazyFunctionExpression, IdentifierExpression, NewExpression, NewTargetExpression, ObjectExpression, UnaryExpression, StaticMemberExpression, TemplateExpression, ThisExpression, UpdateExpression, YieldExpression, YieldStarExpression, AwaitExpression, SpreadElement, BinaryOperator, Arguments, CompoundAssignmentOperator, ObjectProperty, DataProperty, ShorthandProperty, UnaryOperator, TemplateElement, UpdateOperator, Method, Setter, Getter, EagerMethod, LazyMethod, FunctionOrMethodContents, FunctionBody, AssertedParameterScope, FormalParameters, AssertedVarScope, AssertedMaybePositionalParameterName, AssertedPositionalParameterName, AssertedParameterName, AssertedRestParameterName, Parameter, EagerGetter, LazyGetter, GetterContents, LazySetter, EagerSetter, SetterContents, ArrowExpressionContentsWithFunctionBody, ArrowExpressionContentsWithExpression, FunctionExpressionContents } from "../types";
import { Section, Compression } from "./constants";

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

    writeHeader() {
        return this.writer.writeHeader()
    }

    writeConst(value: string) {
        return this.writer.writeConst(value)
    }

    writeVarnum(value: number) {
        return this.writer.writeVarnum(value)
    }

    writeBoolean(value: boolean) {
        return this.writer.writeBoolean(value)
    }

    writeDouble(value: number) {
        return this.writer.writeDouble(value)
    }

    writeIdentifierName(value: string) {
        return this.writer.writeIdentifierName(value)
    }

    writeVariant(value: Variant) {
        return this.writer.writeVariant(value)
    }

    writeAtom(value: string) {
        return this.writer.writeAtom(value)
    }

    writeBuffer(buffer: ArrayBuffer) {
        return this.writer.writeBuffer(buffer)
    }

    writeInContext<T>(cb: () => T): [T, ArrayBuffer] {
        return this.writer.writeInContext(cb)
    }

    writeKind(kind: NodeType) {
        return this.writer.writeKind(kind)
    }

    emit(value: Program) {
        const [, treeBuffer] = this.writeInContext(() => {
            this.emitProgram(value)
        })
        this.writeHeader()

        this.writeConst(Section.Tree)
        this.writeConst(Compression.Identity)

        this.writeVarnum(treeBuffer.byteLength)
        this.writeBuffer(treeBuffer)

        return this.writer.getBuffer()
    }

    emitList<T>(list: FrozenArray<T>, cb: (v: T) => void) {
        this.writeVarnum(list.length)
        list.forEach(x => cb(x))
    }

    emitOptional<T>(node: T | null | undefined, cb: (v: T) => void) {
        if (node === null || node === undefined) {
            this.writeKind(NodeType.Null)
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
        this.writeKind(node.type)
        this.emitAssertedScriptGlobalScope(node.scope)
        this.emitDirectiveList(node.directives)
        this.emitStatementList(node.statements)
    }

    emitAssertedScriptGlobalScope(node: AssertedScriptGlobalScope) {
        this.writeKind(node.type)
        this.emitAssertedDeclaredNameList(node.declaredNames)
        this.writeBoolean(node.hasDirectEval)
    }

    emitAssertedDeclaredNameList(nodes: FrozenArray<AssertedDeclaredName>) {
        this.emitList(nodes, this.emitAssertedDeclaredName.bind(this))
    }

    emitAssertedDeclaredName(node: AssertedDeclaredName) {
        this.writeKind(node.type)
        this.writeIdentifierName(node.name)
        this.emitAssertedDeclaredKind(node.kind)
        this.writeBoolean(node.isCaptured)
    }

    emitAssertedDeclaredKind(kind: AssertedDeclaredKind) {
        switch (kind) {
            case AssertedDeclaredKind.Var:
                return this.writeVariant(Variant.AssertedDeclaredKindOrVariableDeclarationKindVar)
            case AssertedDeclaredKind.ConstLexical:
                return this.writeVariant(Variant.ConstLexical)
            case AssertedDeclaredKind.NonConstLexical:
                return this.writeVariant(Variant.NonConstLexical)
        }
    }

    emitDirectiveList(nodes: FrozenArray<Directive>) {
        this.emitList(nodes, this.emitDirective.bind(this))
    }

    emitDirective(node: Directive) {
        this.writeKind(node.type)
        this.writeAtom(node.rawValue)
    }

    emitStatementList(nodes: FrozenArray<Statement>) {
        this.emitList(nodes, this.emitStatement.bind(this))
    }

    emitIdentifier(node: Identifier) {
        this.writeIdentifierName(node)
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
        this.writeKind(node.type)
        this.emitAssertedBlockScope(node.scope)
        this.emitStatementList(node.statements)
    }

    emitAssertedBlockScope(node: AssertedBlockScope) {
        this.writeKind(node.type)
        this.emitAssertedDeclaredNameList(node.declaredNames)
        this.writeBoolean(node.hasDirectEval)
    }

    emitBreakStatement(node: BreakStatement) {
        this.writeKind(node.type)
        this.emitOptional(node.label, this.writeAtom.bind(this))
    }

    emitContinueStatement(node: ContinueStatement) {
        this.writeKind(node.type)
        this.emitOptional(node.label, this.writeAtom.bind(this))
    }
    emitClassDeclaration(node: ClassDeclaration) {
        this.writeKind(node.type)
        this.emitBindingIdentifier(node.name)
        this.emitOptional(node.super, this.emitExpression.bind(this))
        this.emitClassElementList(node.elements)
    }

    emitClassElementList(nodes: FrozenArray<ClassElement>) {
        return this.emitList(nodes, this.emitClassElement.bind(this))
    }

    emitClassElement(node: ClassElement) {
        this.writeKind(node.type)
        this.writeBoolean(node.isStatic)
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
        this.writeKind(node.type)
        this.writeBoolean(node.isAsync)
        this.writeBoolean(node.isGenerator)
        this.emitPropertyName(node.name)
        this.writeVarnum(node.length)
        this.emitDirectiveList(node.directives)
        this.emitFunctionOrMethodContents(node.contents)
    }

    emitLazyMethod(node: LazyMethod) {
        this.writeKind(node.type)
        this.writeBoolean(node.isAsync)
        this.writeBoolean(node.isGenerator)
        this.emitPropertyName(node.name)
        this.writeVarnum(node.length)
        this.emitDirectiveList(node.directives)
        this.emitFunctionOrMethodContents(node.contents)
    }

    emitFunctionOrMethodContents(node: FunctionOrMethodContents) {
        this.writeKind(node.type)
        this.writeBoolean(node.isThisCaptured)
        this.emitAssertedParameterScope(node.parameterScope)
        this.emitFormalParameters(node.params)
        this.emitAssertedVarScope(node.bodyScope)
        this.emitFunctionBody(node.body)
    }

    emitAssertedParameterScope(node: AssertedParameterScope) {
        this.writeKind(node.type)
        this.emitAssertedMaybePositionalParameterNameList(node.paramNames)
        this.writeBoolean(node.hasDirectEval)
        this.writeBoolean(node.isSimpleParameterList)
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
        this.writeKind(node.type)
        this.writeVarnum(node.index)
        this.writeIdentifierName(node.name)
        this.writeBoolean(node.isCaptured)
    }

    emitAssertedRestParameterName(node: AssertedRestParameterName) {
        this.writeKind(node.type)
        this.writeIdentifierName(node.name)
        this.writeBoolean(node.isCaptured)
    }

    emitAssertedParameterName(node: AssertedParameterName) {
        this.writeKind(node.type)
        this.writeIdentifierName(node.name)
        this.writeBoolean(node.isCaptured)
    }

    emitFormalParameters(node: FormalParameters) {
        this.writeKind(node.type)
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
        this.writeKind(node.type)
        this.emitAssertedDeclaredNameList(node.declaredNames)
        this.writeBoolean(node.hasDirectEval)
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
        this.writeKind(node.type)
        this.emitPropertyName(node.name)
        this.emitDirectiveList(node.directives)
        this.emitGetterContents(node.contents)
    }

    emitLazyGetter(node: LazyGetter) {
        this.writeKind(node.type)
        this.emitPropertyName(node.name)
        this.emitDirectiveList(node.directives)
        this.emitGetterContents(node.contents)
    }

    emitGetterContents(node: GetterContents) {
        this.writeKind(node.type)
        this.writeBoolean(node.isThisCaptured)
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
        this.writeKind(node.type)
        this.emitPropertyName(node.name)
        this.writeVarnum(node.length)
        this.emitDirectiveList(node.directives)
        this.emitSetterContents(node.contents)
    }

    emitLazySetter(node: LazySetter) {
        this.writeKind(node.type)
        this.emitPropertyName(node.name)
        this.writeVarnum(node.length)
        this.emitDirectiveList(node.directives)
        this.emitSetterContents(node.contents)
    }

    emitSetterContents(node: SetterContents) {
        this.writeKind(node.type)
        this.writeBoolean(node.isThisCaptured)
        this.emitAssertedParameterScope(node.parameterScope)
        this.emitParameter(node.param)
        this.emitAssertedVarScope(node.bodyScope)
        this.emitFunctionBody(node.body)
    }

    emitBindingIdentifier(node: BindingIdentifier) {
        this.writeKind(node.type)
        this.writeIdentifierName(node.name)
    }

    emitDebuggerStatement(node: DebuggerStatement) {
        this.writeKind(node.type)
    }

    emitEmptyStatement(node: EmptyStatement) {
        this.writeKind(node.type)
    }

    emitExpressionStatement(node: ExpressionStatement) {
        this.writeKind(node.type)
        this.emitExpression(node.expression)
    }

    emitEagerFunctionDeclaration(node: EagerFunctionDeclaration) {
        this.writeKind(node.type)
        this.writeBoolean(node.isAsync)
        this.writeBoolean(node.isGenerator)
        this.emitBindingIdentifier(node.name)
        this.writeVarnum(node.length)
        this.emitDirectiveList(node.directives)
        this.emitFunctionOrMethodContents(node.contents)
    }

    emitLazyFunctionDeclaration(node: LazyFunctionDeclaration) {
        this.writeKind(node.type)
        this.writeBoolean(node.isAsync)
        this.writeBoolean(node.isGenerator)
        this.emitBindingIdentifier(node.name)
        this.writeVarnum(node.length)
        this.emitDirectiveList(node.directives)
        this.emitFunctionOrMethodContents(node.contents)
    }

    emitIfStatement(node: IfStatement) {
        this.writeKind(node.type)
        this.emitExpression(node.test)
        this.emitStatement(node.consequent)
        this.emitOptional(node.alternate, this.emitStatement.bind(this))
    }

    emitDoWhileStatement(node: DoWhileStatement) {
        this.writeKind(node.type)
        this.emitExpression(node.test)
        this.emitStatement(node.body)
    }

    emitForInStatement(node: ForInStatement) {
        this.writeKind(node.type)
        this.emitForInOfBindingOrAssignmentTarget(node.left)
        this.emitExpression(node.right)
        this.emitStatement(node.body)
    }

    emitForOfStatement(node: ForOfStatement) {
        this.writeKind(node.type)
        this.emitForInOfBindingOrAssignmentTarget(node.left)
        this.emitExpression(node.right)
        this.emitStatement(node.body)
    }

    emitForStatement(node: ForStatement) {
        this.writeKind(node.type)
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
        this.writeKind(node.type)
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
        this.writeKind(node.type)
        this.emitAssignmentTargetIdentifier(node.binding)
        this.emitOptional(node.init, this.emitExpression.bind(this))
    }

    emitAssignmentTargetPropertyProperty(node: AssignmentTargetPropertyProperty) {
        this.writeKind(node.type)
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
        this.writeKind(node.type)
        this.emitAssignmentTarget(node.binding)
        this.emitExpression(node.init)
    }

    emitArrayAssignmentTarget(node: ArrayAssignmentTarget) {
        this.writeKind(node.type)
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
        this.writeKind(node.type)
        this.emitIdentifier(node.name)
    }

    emitComputedMemberAssignmentTarget(node: ComputedMemberAssignmentTarget) {
        this.writeKind(node.type)
        this.emitExpressionOrSuper(node._object)
        this.emitExpression(node.expression)
    }

    emitStaticMemberAssignmentTarget(node: StaticMemberAssignmentTarget) {
        this.writeKind(node.type)
        this.emitExpressionOrSuper(node._object)
        this.writeIdentifierName(node.property)
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
        this.writeKind(node.type)
    }

    emitForInOfBinding(node: ForInOfBinding) {
        this.writeKind(node.type)
        this.emitVariableDeclarationKind(node.kind)
        this.emitBinding(node.binding)
    }

    emitWhileStatement(node: WhileStatement) {
        this.writeKind(node.type)
        this.emitExpression(node.test)
        this.emitStatement(node.body)
    }

    emitLabelledStatement(node: LabelledStatement) {
        this.writeKind(node.type)
        this.writeAtom(node.label)
        this.emitStatement(node.body)
    }

    emitReturnStatement(node: ReturnStatement) {
        this.writeKind(node.type)
        this.emitOptional(node.expression, this.emitExpression.bind(this))
    }

    emitSwitchStatement(node: SwitchStatement) {
        this.writeKind(node.type)
        this.emitExpression(node.discriminant)
        this.emitSwitchCaseList(node.cases)
    }

    emitSwitchCaseList(nodes: FrozenArray<SwitchCase>) {
        this.emitList(nodes, this.emitSwitchCase.bind(this))
    }

    emitSwitchCase(node: SwitchCase) {
        this.writeKind(node.type)
        this.emitExpression(node.test)
        this.emitStatementList(node.consequent)
    }

    emitSwitchStatementWithDefault(node: SwitchStatementWithDefault) {
        this.writeKind(node.type)
        this.emitExpression(node.discriminant)
        this.emitSwitchCaseList(node.preDefaultCases)
        this.emitSwitchDefault(node.defaultCase)
        this.emitSwitchCaseList(node.postDefaultCases)
    }

    emitSwitchDefault(node: SwitchDefault) {
        this.writeKind(node.type)
        this.emitStatementList(node.consequent)
    }

    emitThrowStatement(node: ThrowStatement) {
        this.writeKind(node.type)
        this.emitExpression(node.expression)
    }

    emitTryCatchStatement(node: TryCatchStatement) {
        this.writeKind(node.type)
        this.emitBlock(node.body)
        this.emitCatchClause(node.catchClause)
    }

    emitCatchClause(node: CatchClause) {
        this.writeKind(node.type)
        this.emitAssertedBoundNamesScope(node.bindingScope)
        this.emitBinding(node.binding)
        this.emitBlock(node.body)
    }

    emitAssertedBoundNamesScope(node: AssertedBoundNamesScope) {
        this.writeKind(node.type)
        this.emitAssertedBoundNameList(node.boundNames)
        this.writeBoolean(node.hasDirectEval)
    }

    emitAssertedBoundNameList(nodes: FrozenArray<AssertedBoundName>) {
        this.emitList(nodes, this.emitAssertedBoundName.bind(this))
    }

    emitAssertedBoundName(node: AssertedBoundName) {
        this.writeKind(node.type)
        this.writeIdentifierName(node.name)
        this.writeBoolean(node.isCaptured)
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
        this.writeKind(node.type)
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
        this.writeKind(node.type)
        this.emitBindingIdentifier(node.binding)
        this.emitOptional(node.init, this.emitExpression.bind(this))
    }

    emitBindingPropertyProperty(node: BindingPropertyProperty) {
        this.writeKind(node.type)
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
        this.writeKind(node.type)
        this.emitExpression(node.expression)
    }

    emitLiteralPropertyName(node: LiteralPropertyName) {
        this.writeKind(node.type)
        this.writeAtom(node.value)
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
        this.writeKind(node.type)
        this.emitBinding(node.binding)
        this.emitExpression(node.init)
    }

    emitArrayBinding(node: ArrayBinding) {
        this.writeKind(node.type)
        this.emitBindingOrBindingWithInitializerList(node.elements)
        this.emitOptional(node.rest, this.emitBinding.bind(this))
    }

    emitTryFinallyStatement(node: TryFinallyStatement) {
        this.writeKind(node.type)
        this.emitBlock(node.body)
        this.emitOptional(node.catchClause, this.emitCatchClause.bind(this))
        this.emitBlock(node.finalizer)
    }

    emitVariableDeclaration(node: VariableDeclaration) {
        this.writeKind(node.type)
        this.emitVariableDeclarationKind(node.kind)
        this.emitVariableDeclaratorList(node.declarators)
    }

    emitVariableDeclaratorList(nodes: FrozenArray<VariableDeclarator>) {
        this.emitList(nodes, this.emitVariableDeclarator.bind(this))
    }

    emitVariableDeclarator(node: VariableDeclarator) {
        this.writeKind(node.type)
        this.emitBinding(node.binding)
        this.emitOptional(node.init, this.emitExpression.bind(this))
    }

    emitVariableDeclarationKind(kind: VariableDeclarationKind) {
        switch (kind) {
            case VariableDeclarationKind.Let:
                return this.writeVariant(Variant.Let)
            case VariableDeclarationKind.Const:
                return this.writeVariant(Variant.Const)
            case VariableDeclarationKind.Var:
                return this.writeVariant(Variant.AssertedDeclaredKindOrVariableDeclarationKindVar)
        }
    }

    emitWithStatement(node: WithStatement) {
        this.writeKind(node.type)
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
        this.writeKind(node.type)
        this.writeBoolean(node.value)
    }

    emitLiteralInfinityExpression(node: LiteralInfinityExpression) {
        throw new Error("Method not implemented.");
    }

    emitLiteralNullExpression(node: LiteralNullExpression) {
        this.writeKind(node.type)
    }

    emitLiteralNumericExpression(node: LiteralNumericExpression) {
        this.writeKind(node.type)
        this.writeDouble(node.value)
    }

    emitLiteralStringExpression(node: LiteralStringExpression) {
        this.writeKind(node.type)
        this.writeAtom(node.value)
    }

    emitLiteralRegExpExpression(node: LiteralRegExpExpression) {
        this.writeKind(node.type)
        this.writeAtom(node.pattern)
        this.writeAtom(node.flags)
    }

    emitArrayExpression(node: ArrayExpression) {
        this.writeKind(node.type)
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
        this.writeKind(node.type)
        this.emitExpression(node.expression)
    }

    emitEagerArrowExpressionWithFunctionBody(node: EagerArrowExpressionWithFunctionBody) {
        this.writeKind(node.type)
        this.writeBoolean(node.isAsync)
        this.writeVarnum(node.length)
        this.emitDirectiveList(node.directives)
        this.emitArrowExpressionContentsWithFunctionBody(node.contents)
    }

    emitLazyArrowExpressionWithFunctionBody(node: LazyArrowExpressionWithFunctionBody) {
        this.writeKind(node.type)
        this.writeBoolean(node.isAsync)
        this.writeVarnum(node.length)
        this.emitDirectiveList(node.directives)
        this.emitArrowExpressionContentsWithFunctionBody(node.contents)
    }

    emitArrowExpressionContentsWithFunctionBody(node: ArrowExpressionContentsWithFunctionBody) {
        this.writeKind(node.type)
        this.emitAssertedParameterScope(node.parameterScope)
        this.emitFormalParameters(node.params)
        this.emitAssertedVarScope(node.bodyScope)
        this.emitFunctionBody(node.body)
    }

    emitEagerArrowExpressionWithExpression(node: EagerArrowExpressionWithExpression) {
        this.writeKind(node.type)
        this.writeBoolean(node.isAsync)
        this.writeVarnum(node.length)
        this.emitArrowExpressionContentsWithExpression(node.contents)
    }

    emitLazyArrowExpressionWithExpression(node: LazyArrowExpressionWithExpression) {
        this.writeKind(node.type)
        this.writeBoolean(node.isAsync)
        this.writeVarnum(node.length)
        this.emitArrowExpressionContentsWithExpression(node.contents)
    }

    emitArrowExpressionContentsWithExpression(node: ArrowExpressionContentsWithExpression) {
        this.writeKind(node.type)
        this.emitAssertedParameterScope(node.parameterScope)
        this.emitFormalParameters(node.params)
        this.emitAssertedVarScope(node.bodyScope)
        this.emitExpression(node.body)
    }

    emitAssignmentExpression(node: AssignmentExpression) {
        this.writeKind(node.type)
        this.emitAssignmentTarget(node.binding)
        this.emitExpression(node.expression)
    }

    emitBinaryExpression(node: BinaryExpression) {
        this.writeKind(node.type)
        this.emitBinaryOperator(node.operator)
        this.emitExpression(node.left)
        this.emitExpression(node.right)
    }

    emitBinaryOperator(variant: BinaryOperator) {
        switch (variant) {
            case BinaryOperator.Comma:
                return this.writeVariant(Variant.Comma)
            case BinaryOperator.Or:
                return this.writeVariant(Variant.Or)
            case BinaryOperator.And:
                return this.writeVariant(Variant.And)
            case BinaryOperator.LogicOr:
                return this.writeVariant(Variant.LogicOr)
            case BinaryOperator.LogicXor:
                return this.writeVariant(Variant.LogicXor)
            case BinaryOperator.LogicAnd:
                return this.writeVariant(Variant.LogicAnd)
            case BinaryOperator.EqualEqual:
                return this.writeVariant(Variant.EqualEqual)
            case BinaryOperator.NotEqual:
                return this.writeVariant(Variant.NotEqual)
            case BinaryOperator.EqualEqualEqual:
                return this.writeVariant(Variant.EqualEqualEqual)
            case BinaryOperator.NotEqualEqual:
                return this.writeVariant(Variant.NotEqualEqual)
            case BinaryOperator.LessThan:
                return this.writeVariant(Variant.LessThan)
            case BinaryOperator.LessThanEqual:
                return this.writeVariant(Variant.LessThanEqual)
            case BinaryOperator.GreaterThan:
                return this.writeVariant(Variant.GreaterThan)
            case BinaryOperator.GreaterThanEqual:
                return this.writeVariant(Variant.GreaterThanEqual)
            case BinaryOperator.In:
                return this.writeVariant(Variant.In)
            case BinaryOperator.InstanceOf:
                return this.writeVariant(Variant.InstanceOf)
            case BinaryOperator.LessThanLessThan:
                return this.writeVariant(Variant.LessThanLessThan)
            case BinaryOperator.GreaterThanGreaterThan:
                return this.writeVariant(Variant.GreaterThanGreaterThan)
            case BinaryOperator.GreaterThanGreaterThanGreaterThan:
                return this.writeVariant(Variant.GreaterThanGreaterThanGreaterThan)
            case BinaryOperator.Plus:
                return this.writeVariant(Variant.BinaryOperatorOrUnaryOperatorPlus)
            case BinaryOperator.Minus:
                return this.writeVariant(Variant.BinaryOperatorOrUnaryOperatorMinus)
            case BinaryOperator.Star:
                return this.writeVariant(Variant.Star)
            case BinaryOperator.Div:
                return this.writeVariant(Variant.Div)
            case BinaryOperator.Mod:
                return this.writeVariant(Variant.Mod)
            case BinaryOperator.StarStar:
                return this.writeVariant(Variant.StarStar)
        }
    }

    emitCallExpression(node: CallExpression) {
        this.writeKind(node.type)
        this.emitExpressionOrSuper(node.callee)
        this.emitArguments(node.arguments)
    }

    emitArguments(node: Arguments) {
        this.emitSpreadElementOrExpressionList(node)
    }

    emitCompoundAssignmentExpression(node: CompoundAssignmentExpression) {
        this.writeKind(node.type)
        this.emitCompoundAssignmentOperator(node.operator)
        this.emitSimpleAssignmentTarget(node.binding)
        this.emitExpression(node.expression)
    }

    emitCompoundAssignmentOperator(node: CompoundAssignmentOperator) {
        switch (node) {
            case CompoundAssignmentOperator.PlusEqual:
                return this.writeVariant(Variant.PlusEqual)
            case CompoundAssignmentOperator.MinusEqual:
                return this.writeVariant(Variant.MinusEqual)
            case CompoundAssignmentOperator.StarEqual:
                return this.writeVariant(Variant.StarEqual)
            case CompoundAssignmentOperator.DivEuqal:
                return this.writeVariant(Variant.DivEuqal)
            case CompoundAssignmentOperator.ModEqual:
                return this.writeVariant(Variant.ModEqual)
            case CompoundAssignmentOperator.StarStarEqual:
                return this.writeVariant(Variant.StarStarEqual)
            case CompoundAssignmentOperator.LessThanLessThanEqual:
                return this.writeVariant(Variant.LessThanLessThanEqual)
            case CompoundAssignmentOperator.GreaterThanGreaterThanEequal:
                return this.writeVariant(Variant.GreaterThanGreaterThanEequal)
            case CompoundAssignmentOperator.GreaterThanGreaterThanGreaterThanEequal:
                return this.writeVariant(Variant.GreaterThanGreaterThanGreaterThanEequal)
            case CompoundAssignmentOperator.LoginOrEqual:
                return this.writeVariant(Variant.LoginOrEqual)
            case CompoundAssignmentOperator.LogicAndEuqal:
                return this.writeVariant(Variant.LogicAndEuqal)
            case CompoundAssignmentOperator.LogicXorEqual:
                return this.writeVariant(Variant.LogicXorEqual)
        }
    }

    emitComputedMemberExpression(node: ComputedMemberExpression) {
        this.writeKind(node.type)
        this.emitExpressionOrSuper(node._object)
        this.emitExpression(node.expression)
    }

    emitConditionalExpression(node: ConditionalExpression) {
        this.writeKind(node.type)
        this.emitExpression(node.test)
        this.emitExpression(node.consequent)
        this.emitExpression(node.alternate)
    }

    emitClassExpression(node: ClassExpression) {
        this.writeKind(node.type)
        this.emitOptional(node.name, this.emitBindingIdentifier.bind(this))
        this.emitOptional(node.super, this.emitExpression.bind(this))
        this.emitClassElementList(node.elements)
    }

    emitEagerFunctionExpression(node: EagerFunctionExpression) {
        this.writeKind(node.type)
        this.writeBoolean(node.isAsync)
        this.writeBoolean(node.isGenerator)
        this.emitOptional(node.name, this.emitBindingIdentifier.bind(this))
        this.writeVarnum(node.length)
        this.emitDirectiveList(node.directives)
        this.emitFunctionExpressionContents(node.contents)
    }

    emitLazyFunctionExpression(node: LazyFunctionExpression) {
        this.writeKind(node.type)
        this.writeBoolean(node.isAsync)
        this.writeBoolean(node.isGenerator)
        this.emitOptional(node.name, this.emitBindingIdentifier.bind(this))
        this.writeVarnum(node.length)
        this.emitDirectiveList(node.directives)
        this.emitFunctionExpressionContents(node.contents)
    }

    emitFunctionExpressionContents(node: FunctionExpressionContents) {
        this.writeKind(node.type)
        this.writeBoolean(node.isFunctionNameCaptured)
        this.writeBoolean(node.isThisCaptured)
        this.emitAssertedParameterScope(node.parameterScope)
        this.emitFormalParameters(node.params)
        this.emitAssertedVarScope(node.bodyScope)
        this.emitFunctionBody(node.body)
    }

    emitIdentifierExpression(node: IdentifierExpression) {
        this.writeKind(node.type)
        this.writeIdentifierName(node.name)
    }

    emitNewExpression(node: NewExpression) {
        this.writeKind(node.type)
        this.emitExpression(node.callee)
        this.emitArguments(node.arguments)
    }

    emitNewTargetExpression(node: NewTargetExpression) {
        this.writeKind(node.type)
    }

    emitObjectExpression(node: ObjectExpression) {
        this.writeKind(node.type)
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
        this.writeKind(node.type)
        this.emitPropertyName(node.name)
        this.emitExpression(node.expression)
    }

    emitShorthandProperty(node: ShorthandProperty) {
        this.writeKind(node.type)
        this.emitIdentifierExpression(node.name)
    }

    emitUnaryExpression(node: UnaryExpression) {
        this.writeKind(node.type)
        this.emitUnaryOperator(node.operator)
        this.emitExpression(node.operand)
    }

    emitUnaryOperator(node: UnaryOperator) {
        switch (node) {
            case UnaryOperator.Plus:
                return this.writeVariant(Variant.BinaryOperatorOrUnaryOperatorPlus)
            case UnaryOperator.Minus:
                return this.writeVariant(Variant.BinaryOperatorOrUnaryOperatorMinus)
            case UnaryOperator.Not:
                return this.writeVariant(Variant.Not)
            case UnaryOperator.LogicNot:
                return this.writeVariant(Variant.LogicNot)
            case UnaryOperator.TypeOf:
                return this.writeVariant(Variant.TypeOf)
            case UnaryOperator.Void:
                return this.writeVariant(Variant.Void)
            case UnaryOperator.Delete:
                return this.writeVariant(Variant.Delete)
        }
    }

    emitStaticMemberExpression(node: StaticMemberExpression) {
        this.writeKind(node.type)
        this.emitExpressionOrSuper(node._object)
        this.writeIdentifierName(node.property)
    }

    emitTemplateExpression(node: TemplateExpression) {
        this.writeKind(node.type)
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
        this.writeKind(node.type)
    }

    emitUpdateExpression(node: UpdateExpression) {
        this.writeKind(node.type)
        this.writeBoolean(node.isPrefix)
        this.emitUpdateOperator(node.operator)
        this.emitSimpleAssignmentTarget(node.operand)
    }

    emitUpdateOperator(node: UpdateOperator) {
        switch (node) {
            case UpdateOperator.PlusPlus:
                return this.writeVariant(Variant.PlusPlus)
            case UpdateOperator.MinusMinus:
                return this.writeVariant(Variant.MinusMinus)
        }
    }

    emitYieldExpression(node: YieldExpression) {
        this.writeKind(node.type)
        this.emitOptional(node.expression, this.emitExpression.bind(this))
    }

    emitYieldStarExpression(node: YieldStarExpression) {
        this.writeKind(node.type)
        this.emitExpression(node.expression)
    }

    emitAwaitExpression(node: AwaitExpression) {
        this.writeKind(node.type)
        this.emitExpression(node.expression)
    }
}