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

export function createCircle(radius: number, segments = 36): number[] {
	const vertices: number[] = [];

	// center
	vertices.push(0, 0);

	// perimeter
	for (let i = 0; i <= segments; i++) {
		const angle = (i / segments) * 2 * Math.PI;
		const x = radius * Math.cos(angle);
		const y = radius * Math.sin(angle);
		vertices.push(x, y);
	}

	return vertices;
}
