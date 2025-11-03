import { createSquare } from "../map/shared";
import { Entity } from "../types/types";

export class Player {
	private shape: number[] = []
	private x: number
	private y: number
	private size: number
	private color: [number, number, number, number]
	private speed: number
	public directionMap: Record<string, boolean>
	constructor(x: number, y: number, size: number, color: [number, number, number, number]) {
		this.x = x
		this.y = y
		this.size = size
		this.shape = createSquare(size)
		this.color = color
		this.speed = 100
		this.directionMap = {
			"w": false,
			"a": false,
			"s": false,
			"d": false,
		}
	}
	transformVertices(): number[] {
		const transformed: number[] = []
		for (let i = 0; i < this.shape.length; i += 2) {
			transformed.push(this.shape[i] + this.x)
			transformed.push(this.shape[i + 1] + this.y)
		}
		return transformed

	}
	updatePos(deltaTime: number): Entity {
		let inputX = 0
		let inputY = 0

		if (this.directionMap["a"]) inputX -= 1;
		if (this.directionMap["d"]) inputX += 1;
		if (this.directionMap["w"]) inputY -= 1;
		if (this.directionMap["s"]) inputY += 1;

		this.x = this.x + (inputX * this.speed * deltaTime)
		this.y = this.y + (inputY * this.speed * deltaTime)

		const shape = this.transformVertices()

		return {
			x: this.x,
			y: this.y,
			color: this.color,
			shape: shape,
		} satisfies Entity


	}
}
