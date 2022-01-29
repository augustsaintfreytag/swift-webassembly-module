import { WebAssemblyModule } from "./module"
import { ModuleEnvironmentError } from "./module-error"
import { ModuleData } from "./module-fetch"

export async function instantiateWebAssemblyModule(data: ModuleData): Promise<WebAssemblyModule> {
	if (typeof WebAssembly === "undefined") {
		throw new ModuleEnvironmentError(`WebAssembly API is not supported in this environment.`)
	}

	const module = new WebAssemblyModule()
	await module.load(data)

	return module
}
