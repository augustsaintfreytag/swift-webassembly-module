import { instanceMemory, MemoryAddress } from "./memory-access"

// Configuration

const terminationCharacter = "\0"

// String Decoding

export function decodedNullTerminatedStringFromMemory(instance: WebAssembly.Instance, address: MemoryAddress): string {
	const textDecoder = new TextDecoder()
	const { buffer } = instanceMemory(instance)
	let bufferSlice = textDecoder.decode(buffer.slice(address))
	let endIndex = indexOfStringTermination(bufferSlice)

	console.log(`Decoding string from memory at address '${address}', end index until '${endIndex}'.`)

	if (!endIndex || endIndex < 2) {
		console.warn(`Unexpected short buffer, printing remaining buffer data.`)
		console.log(bufferSlice)

		return ""
	}

	return bufferSlice.slice(0, endIndex)
}

function indexOfStringTermination(value: string): number | undefined {
	const index = value.indexOf(terminationCharacter)

	if (index === -1) {
		return undefined
	}

	return index
}
