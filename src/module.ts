import { WASI } from "@wasmer/wasi"
import { WasmFs } from "@wasmer/wasmfs"
import { bindWriteSyncOverride } from "~/module-write-override"
import { assertMemoryFunctions, deinitializeUInt32InMemory, initializeStringInMemory, initializeUInt32InMemory, MemoryAddress } from "./memory-access"
import { callModuleFunction, callModuleFunctionWithArgument } from "./module-functions"

const Memory = WebAssembly.Memory

type Instance = WebAssembly.Instance
type MemoryDescriptor = WebAssembly.MemoryDescriptor

export class WebAssemblyModule {
	private static get defaultMemorySize(): number {
		return 128
	}

	private static get defaultMemoryDescriptor(): MemoryDescriptor {
		return { initial: this.defaultMemorySize, maximum: this.defaultMemorySize }
	}

	private wasi: WASI
	private wasmFs: WasmFs
	private outputBuffer: string[] = []

	public instance: Instance | undefined

	// Init

	constructor(memory: MemoryDescriptor = WebAssemblyModule.defaultMemoryDescriptor) {
		this.wasmFs = new WasmFs()
		this.wasi = new WASI({
			args: [],
			env: {},
			bindings: {
				...WASI.defaultBindings,
				fs: this.wasmFs.fs
			}
		})

		this.wasi.memory = new Memory(memory)
		this.initOutputRedirect()
	}

	private initOutputRedirect(): void {
		this.wasmFs.fs.writeSync = bindWriteSyncOverride(
			this.wasmFs.fs.writeSync,
			output => {
				this.outputBuffer.push(output)
			},
			error => {
				console.error(`Non-standard output: ${error}`)
			}
		) as typeof this.wasmFs.fs.writeSync
	}

	// Load

	async load(data: Uint8Array) {
		const { instance } = await WebAssembly.instantiate(data, {
			wasi_snapshot_preview1: this.wasi.wasiImport
		})

		this.wasi.start(instance)
		this.instance = instance
	}

	// Calls

	async callFunction<ReturnType>(name: string): Promise<ReturnType> {
		return this.withInstance(instance => callModuleFunction<ReturnType>(instance, name))
	}

	async callFunctionWithArgument<ReturnType, ArgumentType>(name: string, argument: ArgumentType): Promise<ReturnType> {
		return this.withInstance(instance => callModuleFunctionWithArgument<ReturnType, ArgumentType>(instance, name, argument))
	}

	async callStreamingFunction<ReturnType>(name: string): Promise<string | undefined> {
		return this.withInstance(async instance => {
			this.clearOutput()
			await callModuleFunction<ReturnType>(instance, name)

			return this.readOutput()
		})
	}

	async callStreamingFunctionWithArgument<ReturnType, ArgumentType>(name: string, argument: ArgumentType): Promise<string | undefined> {
		return this.withInstance(async instance => {
			this.clearOutput()
			await callModuleFunctionWithArgument<ReturnType, ArgumentType>(instance, name, argument)

			return this.readOutput()
		})
	}

	// Output

	clearOutput() {
		this.outputBuffer = []
	}

	readOutput(): string {
		const contents = this.outputBuffer.join("")
		this.clearOutput()

		return contents
	}

	// Memory

	assertMemory() {
		this.withInstance(instance => assertMemoryFunctions(instance))
	}

	async initializeNumericalValue(value: number): Promise<MemoryAddress> {
		return this.withInstance(async instance => initializeUInt32InMemory(instance, value))
	}

	async deinitializeNumericalValue(address: MemoryAddress) {
		this.withInstance(async instance => deinitializeUInt32InMemory(instance, address))
	}

	async initializeStringValue(value: string): Promise<MemoryAddress> {
		return this.withInstance(async instance => initializeStringInMemory(instance, value))
	}

	async deinitializeStringValue(address: MemoryAddress) {
		this.withInstance(async instance => deinitializeUInt32InMemory(instance, address))
	}

	// Utility

	withInstance<ReturnType>(block: (instance: Instance) => ReturnType): ReturnType {
		if (!this.instance) {
			throw new ModuleStateError(`Can not provide WebAssembly module, missing loaded instance.`)
		}

		return block(this.instance)
	}
}
