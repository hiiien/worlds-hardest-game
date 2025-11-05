import { Transform } from "./transform";
export class Collider {
	constructor(
		public width: number,
		public height: number,
		solid: boolean = true
	) { }
	intersects(other: Collider, thisTransform: Transform, otherTransform: Transform): boolean {
		return (
			thisTransform.x + this.width > otherTransform.x &&
			otherTransform.x + other.width > thisTransform.x &&
			thisTransform.y + this.height > otherTransform.y &&
			otherTransform.y + other.height > thisTransform.y

		)
	}
	clampToBounds(
		transform: Transform,
		canvasWidth: number,
		canvasHeight: number
	): void {
		transform.x = Math.max(0, Math.min(transform.x, canvasWidth - this.width))
		transform.y = Math.max(0, Math.min(transform.y, canvasHeight - this.height))
	}
}
