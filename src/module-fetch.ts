export type ModuleData = Uint8Array

export async function fetchWebAssemblyModuleData(path: string): Promise<ModuleData> {
	if (typeof fetch === "undefined") {
		throw new TypeError(`Fetch API is not supported in this environment.`)
	}

	const response = await fetch(path)
	const bytes = new Uint8Array(await response.arrayBuffer())

	return bytes
}
