import { WebAssemblyModule } from "./module"
export { fetchWebAssemblyModuleData } from "./module-fetch"
export { instantiateWebAssemblyModule } from "./module-init"
export type { ModuleData } from "./module-fetch"
export type { MemoryAddress } from "./memory-access"

export default WebAssemblyModule
