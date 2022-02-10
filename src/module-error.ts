export class ModuleError extends Error {
	constructor(message: string) {
		super(message)
		this.name = this.constructor.name
	}
}

export class ModuleEnvironmentError extends ModuleError {}

export class ModuleStateError extends ModuleError {}

export class ModuleInterfaceError extends ModuleError {}
