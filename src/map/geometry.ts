export function createSquare(size: number): number[] {
	return [
		0, 0,
		size, 0,
		size, size,
		0, 0,
		size, size,
		0, size
	];
}

export function createRectangle(width: number, height: number): number[] {
	return [
		0, 0,
		width, 0,
		width, height,

		0, 0,
		width, height,
		0, height,
	];
}
