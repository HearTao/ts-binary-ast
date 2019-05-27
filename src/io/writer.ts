import { WriterContext } from "./context";
import { Variant, NodeType } from "../types";
import { variantToValueMapper, nodeKindToNameMapper } from "../mapper";
import { Magic, Section, Compression } from "./constants";

export default class MultipartWriter {
    private size: number = 0
    private buffer: ArrayBuffer = new ArrayBuffer(4096)
    private view: DataView = new DataView(this.buffer)

    constructor (private context: WriterContext) {
    }

    public getBuffer () {
        return this.buffer.slice(0, this.size)
    }

    writeBuffer(buffer: ArrayBuffer) {
        if (this.size + buffer.byteLength >= this.buffer.byteLength) {
            const oldBuffer = new Uint8Array(this.buffer)
            const targetBuffer = new Uint8Array(buffer)
            const newBuffer = new Uint8Array(new ArrayBuffer(Math.ceil(this.buffer.byteLength + buffer.byteLength)))
            newBuffer.set(oldBuffer)
            newBuffer.set(targetBuffer, oldBuffer.length)
            this.buffer = newBuffer.buffer
            this.view = new DataView(this.buffer)
        } else {
            const oldBuffer = new Uint8Array(this.buffer)
            const targetBuffer = new Uint8Array(buffer)
            oldBuffer.set(targetBuffer, this.size)
            this.buffer = oldBuffer.buffer
            this.view = new DataView(this.buffer)
        }
        this.size += buffer.byteLength
    }

    writeByte(value: number) {
        if (this.size >= this.buffer.byteLength) {
            const oldBuffer = new Uint8Array(this.buffer)
            const newBuffer = new Uint8Array(new ArrayBuffer(Math.ceil(this.buffer.byteLength * 1.5)))
            newBuffer.set(oldBuffer)
            this.buffer = newBuffer.buffer
            this.view = new DataView(this.buffer)
        }

        this.view.setUint8(this.size++, value)
        return 1
    }

    writeDouble(value: number) {
        this.view.setFloat64(this.size, value, true)
        this.size += 8
        return 8
    }

    writeGrammar (value: string) {
        let result = this.writeVarnum(value.length)
        for (let i = 0; i < value.length; ++i) {
            result += this.writeByte(value.charCodeAt(i))
        }
        return result
    }

    writeString (value: string) {
        const enc = new TextEncoder()
        const str = enc.encode(value)
        let result = this.writeVarnum(str.length)
        str.forEach(x => result += this.writeByte(x))
        return result
    }

    writeEmptyString () {
        let result = this.writeVarnum(2)
        result += this.writeByte(0xFF)
        result += this.writeByte(0x00)
        return result
    }

    writeConst (value: string) {
        let result = 0
        for (let i = 0; i < value.length; ++i) {
            result += this.writeByte(value.charCodeAt(i))
        }
        return result
    }

    writeAtom (value: string) {
        if (this.context.stringsTableToIndex.has(value)) {
            return this.writeVarnum(this.context.stringsTableToIndex.get(value)!)
        } else {
            const index = this.context.stringsTable.length
            this.context.stringsTable.push(value)
            this.context.stringsTableToIndex.set(value, index)
            return this.writeVarnum(index)
        }
    }

    writeBoolean (value: boolean) {
        switch (value) {
            case true:
                return this.writeByte(1)
            case false:
                return this.writeByte(0)
            default:
                throw new Error("Invalid boolean value")
        }
    }

    writeVariant (value: Variant) {
        if (this.context.variantTableToIndex.has(value)) {
            return this.writeVarnum(this.context.variantTableToIndex.get(value)!)
        } else {
            const name = variantToValueMapper(value)
            if (!name) {
                throw new Error("Invalid entry in variant table: " + name)
            }

            let index: number
            if (this.context.stringsTableToIndex.has(name)) {
                index = this.context.stringsTableToIndex.get(name)!
            } else {
                index = this.context.stringsTable.length
                this.context.stringsTable.push(name)
                this.context.stringsTableToIndex.set(name, index)
                this.context.variantTableToIndex.set(value, index)
            }
            return this.writeVarnum(index)
        }
    }

    writeIdentifierName(value: string) {
        return this.writeAtom(value)
    }

    writeVarnum(value: number) {
        const bytes: number[] = []
        while (true) {
            let byte = (value & 0x7F) << 1
            if (value > 0x7F) {
                byte |= 1
            }
            bytes.push(byte)
            value >>= 7
            if (!value) {
                break
            }
        }
        bytes.forEach(x => this.writeByte(x))
        return bytes.length
    }

    writeKind(value: NodeType) {
        if (this.context.grammarTableToIndex.has(value)) {
            return this.writeVarnum(this.context.grammarTableToIndex.get(value)!)
        } else {
            const index = this.context.grammarTable.length
            this.context.grammarTable.push(value)
            this.context.grammarTableToIndex.set(value, index)
            return this.writeVarnum(index)
        }
    }

    writeInContext <T>(cb: () => T): [T, ArrayBuffer] {
        const savedBuffer = this.buffer
        const savedSize = this.size
        const savedView = this.view
        this.buffer = new ArrayBuffer(4096)
        this.view = new DataView(this.buffer)
        this.size = 0
        const result = [cb(), this.buffer.slice(0, this.size)] as [T, ArrayBuffer]
        this.buffer = savedBuffer
        this.size = savedSize
        this.view = savedView
        return result
    }

    writeHeader () {
        this.writeConst(Magic.Header)
        this.writeVarnum(Magic.Version)

        this.writeConst(Section.Grammar)
        this.writeConst(Compression.Identity)

        const [, grammarBuffer ] = this.writeInContext(() => {
            this.writeVarnum(this.context.grammarTable.length)
            this.context.grammarTable.forEach(kind => {
                const name = nodeKindToNameMapper(kind)
                if (name === undefined || name === null) {
                    throw new Error("Invalid entry in grammar table")
                }
                this.writeGrammar(name)
            })
        })

        this.writeVarnum(grammarBuffer.byteLength)
        this.writeBuffer(grammarBuffer)

        this.writeConst(Section.Strings)
        this.writeConst(Compression.Identity)

        const [, stringsBuffer ] = this.writeInContext(() => {
            this.writeVarnum(this.context.stringsTable.length)
            this.context.stringsTable.forEach(str => {
                if (!str) {
                    this.writeEmptyString()
                } else {
                    this.writeString(str)
                }
            })
        })
        this.writeVarnum(stringsBuffer.byteLength)
        this.writeBuffer(stringsBuffer)
    }
}