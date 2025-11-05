export class Transform {
	constructor(
		public x: number,
		public y: number,
	) { }
	setPosition(x: number, y: number) {
		this.x = x
		this.y = y
	}
	translate(x: number, y: number) {
		this.x += x
		this.y += y
	}
}
