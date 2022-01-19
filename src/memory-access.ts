import { callModuleFunction, callModuleFunctionWithArgument } from "./module-functions"

export type MemoryAddress = number

export function instanceMemory(instance: WebAssembly.Instance): WebAssembly.Memory {
	return instance.exports.memory as WebAssembly.Memory
}

export async function initializeUInt32InMemory(instance: WebAssembly.Instance, value: number): Promise<MemoryAddress> {
	const address = await callModuleFunction<MemoryAddress>(instance, "allocateMemoryForUInt32")
	const { buffer } = instanceMemory(instance)
	const view = new Uint8Array(buffer)

	view.set(new Uint8Array(new Uint32Array([value]).buffer), address)

	return address
}

export async function deinitializeUInt32InMemory(instance: WebAssembly.Instance, address: MemoryAddress) {
	await callModuleFunctionWithArgument<void, MemoryAddress>(instance, "deallocateMemoryForUInt32", address)
}

export async function initializeStringInMemory(instance: WebAssembly.Instance, value: string): Promise<MemoryAddress> {
	const textEncoder = new TextEncoder()
	const encodedValue = textEncoder.encode(value)
	const encodedSize = encodedValue.length + 1

	const address = await callModuleFunctionWithArgument<MemoryAddress, number>(instance, "allocateMemoryForString", encodedSize)
	const { buffer } = instanceMemory(instance)
	const view = new Uint8Array(buffer)

	view.set(new Uint8Array(encodedValue), address)

	return address
}

export async function deinitializeStringInMemory(instance: WebAssembly.Instance, address: MemoryAddress) {
	await callModuleFunctionWithArgument<void, MemoryAddress>(instance, "deallocateMemoryForString", address)
}
