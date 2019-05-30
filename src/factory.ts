import { AssertedBlockScope, NodeType, AssertedBoundNamesScope } from './types'

export function createAssertedBlockScope(): AssertedBlockScope {
  return {
    type: NodeType.AssertedBlockScope,
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
