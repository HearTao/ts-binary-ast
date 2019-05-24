import { NodeTypeLimit, NodeType, NodeTypeNameToTypeMap } from "../types";
import { nameToNodeKindMapper } from "../mapper";

const MAGIC_HEADER = "BINJS"
const MAGIC_VERSION = 1
const SECTION_GRAMMAR = "[GRAMMAR]"
const SECTION_STRING = "[STRINGS]"
const COMPRESSION_IDENTIFIER = "identity;"

const MAX_STRING_COUNT = 0xffff

export default class MultipartReader {
  private view: DataView
  private curr: number = 0

  constructor(private buffer: ArrayBufferLike) {
    this.buffer = buffer
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

  readString (length: number): string {
    const result: string[] = []
    for (let i = 0; i < length; ++i) {
      result.push(String.fromCharCode(this.readByte()))
    }
    return result.join('')
  }

  readWString (length: number) {
    const dec = new TextDecoder("utf-8")
    const result = new Uint8Array(this.buffer.slice(this.curr, this.curr + length + 1))
    this.curr += length
    return dec.decode(result)
  }

  readConst (str: string): boolean {
    if(str.split('').every(c => c === String.fromCharCode(this.readByte()))) {
      return true
    }

    throw new Error("Unexpected constant value")
  }

  readHeader () {
    this.readConst(MAGIC_HEADER)

    const version = this.readVarnum()
    if (version !== MAGIC_VERSION) {
      throw new Error("Unexpected version")
    }

    this.readConst(SECTION_GRAMMAR)
    this.readConst(COMPRESSION_IDENTIFIER)

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

      const name = this.readString(byteLength)
      const kind = nameToNodeKindMapper(name)
      if (kind === undefined) {
        throw new Error("Invalid entry in grammar table")
      }

      grammarTable.push(kind)
    }
    if (this.curr !== posBeforeGrammar + grammarByteLen) {
      throw new Error("The length of the grammar table didn't match its contents")
    }

    this.readConst(SECTION_STRING)
    this.readConst(COMPRESSION_IDENTIFIER)
    const stringsByteLen = this.readVarnum()
    const posBeforeStrings = this.curr

    if (this.curr + stringsByteLen > this.view.byteLength) {
      throw new Error("Invalid byte length in strings table")
    }

    const stringsNumberOfEntries = this.readVarnum()
    if (stringsNumberOfEntries > MAX_STRING_COUNT) {
      throw new Error("Too many entries in strings table")
    }

    const stringsTable: string[] = []
    for (let i = 0 ; i< stringsNumberOfEntries; ++i) {
      const byteLength = this.readVarnum()
      if (this.curr + byteLength > this.view.byteLength) {
        throw new Error("Invalid byte length in strings table")
      }
      if (byteLength === 2 && this.lookAhead(() => this.readByte() === 0xFF && this.readByte() === 0x00)) {
        stringsTable.push("")
      } else {
        stringsTable.push(this.readWString(byteLength))
      }

    }
    if (this.curr !== posBeforeStrings + stringsByteLen) {
      throw new Error("The length of the strings table didn't match its contents")
    }

    console.log(grammarTable)
    console.log(stringsTable)


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
