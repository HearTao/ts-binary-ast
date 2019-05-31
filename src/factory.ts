import {
  AssertedBlockScope,
  NodeType,
  AssertedBoundNamesScope,
  AssertedParameterScope,
  AssertedVarScope,
  AssertedScriptGlobalScope
} from './types'

export function createAssertedBlockScope(): AssertedBlockScope {
  return {
    type: NodeType.AssertedBlockScope,
    declaredNames: [],
    hasDirectEval: false
  }
}

export function createAssertedVarScope(): AssertedVarScope {
  return {
    type: NodeType.AssertedVarScope,
    declaredNames: [],
    hasDirectEval: false
  }
}

export function createAssertedBoundNamesScope(): AssertedBoundNamesScope {
  return {
    type: NodeType.AssertedBoundNamesScope,
    boundNames: [],
    hasDirectEval: false
  }
}

export function createAssertedParameterScope(): AssertedParameterScope {
  return {
    type: NodeType.AssertedParameterScope,
    paramNames: [],
    hasDirectEval: false,
    isSimpleParameterList: false
  }
}

export function createAssertedScriptGlobalScope(): AssertedScriptGlobalScope {
  return {
    type: NodeType.AssertedScriptGlobalScope,
    declaredNames: [],
    hasDirectEval: false
  }
}
