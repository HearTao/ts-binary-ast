import { NodeTypeLimit, NodeType, Variant } from "../types";
import { nameToNodeKindMapper, nameToVariantMapper } from "../mapper";
import { Context } from "./context";
import { Magic, Section, Compression } from './constants'

const MAX_STRING_COUNT = 0xffff

function IsIdentifier(): boolean {
  return true
}

export default class MultipartReader {
  private view: DataView
  private curr: number = 0

  constructor(private context: Context, private buffer: ArrayBufferLike) {
    this.view = new DataView(buffer)
  }

  lookAhead <T>(cb: () => T): T {
    const savedCurr = this.curr
    const result = cb()
    this.curr = savedCurr
    return result
  }

  readByte (): number {
    if (this.curr >= this.view.byteLength) {
      throw new Error("Read byte failed: out of range")
    }
    return this.view.getUint8(this.curr++)
  }

  readGrammar (length: number): string {
    const result: string[] = []
    for (let i = 0; i < length; ++i) {
      result.push(String.fromCharCode(this.readByte()))
    }
    return result.join('')
  }

  readString (length: number) {
    const dec = new TextDecoder("utf-8")
    const result = new Uint8Array(this.buffer.slice(this.curr, this.curr + length))
    this.curr += length
    return dec.decode(result)
  }

  readConst (str: string): boolean {
    if (this.readGrammar(str.length) === str) {
      return true
    }

    throw new Error("Unexpected constant value: " + str)
  }

  enterTaggedTuple () {
    const index = this.readVarnum()
    if (index >= this.context.grammarTable.length) {
      throw new Error("Invalid index to grammar table: " + index + this.context.grammarTable.length)
    }

    return this.context.grammarTable[index]
  }

  readAtom () {
    const index = this.readVarnum()
    if (index >= this.context.stringsTable.length) {
      throw new Error("Invalid index to strings table")
    }
    return this.context.stringsTable[index]
  }

  readBoolean () {
    const result = this.readByte()
    switch (result) {
      case 0:
        return false
      case 1:
        return true
      case 2:
        throw new Error("Nullable boolean not supported")
      default:
        throw new Error("Invalid boolean value")
    }
  }

  readVariant () {
    const index = this.readVarnum()
    if (index >= this.context.stringsTable.length) {
      throw new Error("Invalid index to strings table")
    }

    if (this.context.variantTable.has(index)) {
      return this.context.variantTable.get(index)!
    }

    const name = this.context.stringsTable[index]
    const variant = nameToVariantMapper(name)
    if (!variant) {
      throw new Error("Invalid entry in variant table: " + name)
    }
    this.context.variantTable.set(index, variant)
    return variant
  }

  readIdentifierName() {
    const result = this.readAtom()
    if (!IsIdentifier()) {
      throw new Error("Invalid identifier")
    }
    return result
  }

  readHeader () {
    this.readConst(Magic.Header)

    const version = this.readVarnum()
    if (version !== Magic.Version) {
      throw new Error("Unexpected version")
    }

    this.readConst(Section.Grammar)
    this.readConst(Compression.Identity)

    const grammarByteLen = this.readVarnum()
    const posBeforeGrammar = this.curr

    if (this.curr + grammarByteLen > this.view.byteLength) {
      throw new Error("Invalid byte length in grammar table")
    }

    const grammarNumberOfEntries = this.readVarnum()
    if (grammarNumberOfEntries > NodeTypeLimit) {
      throw new Error("Invalid number of entries in grammar table")
    }

    const grammarTable: NodeType[] = []
    for (let i = 0; i < grammarNumberOfEntries; ++i) {
      const byteLength = this.readVarnum()
      if (this.curr + byteLength > this.view.byteLength) {
        throw new Error("Invalid byte length in grammar table")
      }

      const name = this.readGrammar(byteLength)
      const kind = nameToNodeKindMapper(name)
      if (kind === undefined) {
        throw new Error("Invalid entry in grammar table")
      }

      grammarTable.push(kind)
    }
    if (this.curr !== posBeforeGrammar + grammarByteLen) {
      throw new Error("The length of the grammar table didn't match its contents")
    }

    this.readConst(Section.Strings)
    this.readConst(Compression.Identity)
    const stringsByteLen = this.readVarnum()
    const posBeforeStrings = this.curr

    if (this.curr + stringsByteLen > this.view.byteLength) {
      throw new Error("Invalid byte length in strings table1")
    }

    const stringsNumberOfEntries = this.readVarnum()
    if (stringsNumberOfEntries > MAX_STRING_COUNT) {
      throw new Error("Too many entries in strings table")
    }

    const stringsTable: string[] = []
    for (let i = 0 ; i< stringsNumberOfEntries; ++i) {
      const byteLength = this.readVarnum()
      if (this.curr + byteLength > this.view.byteLength) {
        throw new Error("Invalid byte length in strings table2: " + this.curr + " " + byteLength + " " +  this.view.byteLength)
      }
      if (byteLength === 2 && this.lookAhead(() => this.readByte() === 0xFF && this.readByte() === 0x00)) {
        this.curr += 2
        stringsTable.push("")
      } else {
        stringsTable.push(this.readString(byteLength))
      }
    }
    if (this.curr !== posBeforeStrings + stringsByteLen) {
      throw new Error("The length of the strings table didn't match its contents")
    }

    this.readConst(Section.Tree)
    this.readConst(Compression.Identity)
    const posBeforeTree = this.curr

    const treeByteLen = this.readVarnum()
    if (posBeforeTree + treeByteLen > this.buffer.byteLength) {
      throw new Error("Invalid byte length in tree table")
    }

    this.context.grammarTable = grammarTable
    this.context.stringsTable = stringsTable
  }

  readVarnum () {
    let result = 0
    let shift = 0
    while (true) {
      const byte = this.readByte()
      const newResult = result | ((byte >> 1) << shift)

      if (newResult < result) {
        throw new Error("Overflow on readVarnum result")
      }

      result = newResult
      shift += 7

      if ((byte & 1) === 0) {
        return result
      }

      if (shift >= 32) {
        throw new Error("Overflow on readVarnum shift")
      }
    }
  }
}
