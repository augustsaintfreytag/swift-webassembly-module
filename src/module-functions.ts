// Library

import { ModuleError, ModuleInterfaceError } from "./module-error"

export type FunctionType<ReturnType> = () => ReturnType
export type FunctionTypeWithArgument<ReturnType, ArgumentType> = (argument: ArgumentType) => ReturnType

// Function Calling

export function exportedFunctionFromModule<FunctionType extends Function>(instance: WebAssembly.Instance, name: string): FunctionType {
	const exportedFunction = instance.exports[name]

	if (typeof exportedFunction !== "function") {
		throw new ModuleInterfaceError(`WASM module does not export function named '${name}'.`)
	}

	return exportedFunction as FunctionType
}

export async function callModuleFunction<ReturnType>(instance: WebAssembly.Instance, name: string): Promise<ReturnType> {
	try {
		const exportedFunction = exportedFunctionFromModule<FunctionType<ReturnType>>(instance, name)
		return exportedFunction()
	} catch (error) {
		throw new ModuleInterfaceError(`Could not run exported function '${name}' in WASM module. ${error}`)
	}
}

export async function callModuleFunctionWithArgument<ReturnType, ArgumentType>(
	instance: WebAssembly.Instance,
	name: string,
	argument: ArgumentType
): Promise<ReturnType> {
	try {
		const exportedFunction = exportedFunctionFromModule<FunctionTypeWithArgument<ReturnType, ArgumentType>>(instance, name)
		return exportedFunction(argument)
	} catch (error) {
		throw new ModuleInterfaceError(`Could not run exported function '${name}' in WASM module. ${error}`)
	}
}
