import { WebAssemblyModule } from "./module"
import { ModuleData } from "./module-fetch"

export async function instantiateWebAssemblyModule(data: ModuleData): Promise<WebAssemblyModule> {
	if (typeof WebAssembly === "undefined") {
		throw new TypeError(`WebAssembly API is not supported in this environment.`)
	}

	const module = new WebAssemblyModule()
	await module.load(data)

	return module
}
