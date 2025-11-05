export class Renderable {
	constructor(
		public shape: number[],
		public color: [number, number, number, number],
		public vertexCount?: number
	) { }
	setColor(color: [number, number, number, number]): void {
		this.color = color
	}
	setShape(shape: number[]): void {
		this.shape = shape
	}
}
