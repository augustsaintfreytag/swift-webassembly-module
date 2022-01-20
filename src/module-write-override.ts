type FsWriteSyncBlock = (
	fd: number,
	buffer: Buffer | Uint8Array,
	offset?: number | undefined,
	length?: number | undefined,
	position?: number | undefined
) => number

type OutputBlock = (output: string) => void

export function bindWriteSyncOverride(passthrough: FsWriteSyncBlock, outputBlock: OutputBlock, errorBlock: OutputBlock): FsWriteSyncBlock {
	const textDecoder = new TextDecoder()

	const override: FsWriteSyncBlock = (identifier, buffer, offset, length, position) => {
		const returnPassthrough = () => passthrough(identifier, buffer as any, offset, length, position)
		const contents = textDecoder.decode(buffer)

		if (contents === "\n") {
			return returnPassthrough()
		}

		switch (identifier) {
			case 1:
				outputBlock(contents)
				break
			default:
				errorBlock(contents)
				break
		}

		return returnPassthrough()
	}

	return override
}
