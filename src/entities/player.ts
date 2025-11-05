import { createSquare } from "../map/shared";
import { Entity, MapStructure } from "../types/types";

export class Player {
	private shape: number[] = []
	x: number
	y: number
	private size: number
	private color: [number, number, number, number]
	private speed: number
	public directionMap: Record<string, boolean>

	constructor(x: number, y: number, color: [number, number, number, number]) {
		this.x = x
		this.y = y
		this.size = 20
		this.shape = createSquare(this.size)
		this.color = color
		this.speed = 200
		this.directionMap = {
			"w": false,
			"a": false,
			"s": false,
			"d": false,
		}
	}

	updatePos(deltaTime: number, canvasHeight: number, canvasWidth: number, walls: MapStructure[]): Entity {
		let inputX = 0
		let inputY = 0

		if (this.directionMap["a"]) inputX -= 1;
		if (this.directionMap["d"]) inputX += 1;
		if (this.directionMap["w"]) inputY -= 1;
		if (this.directionMap["s"]) inputY += 1;

		const newX = this.x + (inputX * this.speed * deltaTime)
		const newY = this.y + (inputY * this.speed * deltaTime)
		const xCollided = this.wouldCollide(newX, this.y, canvasWidth, canvasHeight, walls)
		const yCollided = this.wouldCollide(this.x, newY, canvasWidth, canvasHeight, walls)
		if (!xCollided) {
			this.x = newX
		}
		if (!yCollided) {
			this.y = newY
		}

		return {
			x: this.x,
			y: this.y,
			color: this.color,
			shape: this.shape,
		} satisfies Entity
	}

	private wouldCollide(newX: number, newY: number, canvasWidth: number, canvasHeight: number, walls: MapStructure[]): boolean {
		const playerLeft = newX
		const playerRight = newX + this.size
		const playerTop = newY
		const playerBottom = newY + this.size

		if (playerRight > canvasWidth || playerLeft < 0 || playerBottom > canvasHeight || playerTop < 0) {
			return true
		}

		for (const wall of walls) {
			if (!wall.solid) continue;

			const wallWidth = this.getShapeWidth(wall.shape)
			const wallHeight = this.getShapeHeight(wall.shape)

			const wallLeft = wall.x
			const wallRight = wall.x + wallWidth
			const wallTop = wall.y
			const wallBottom = wall.y + wallHeight

			if (playerRight > wallLeft &&
				playerLeft < wallRight &&
				playerBottom > wallTop &&
				playerTop < wallBottom) {
				return true
			}
		}
		return false
	}

	private getShapeWidth(shape: number[]): number {
		let minX = Infinity, maxX = -Infinity
		for (let i = 0; i < shape.length; i += 2) {
			minX = Math.min(minX, shape[i])
			maxX = Math.max(maxX, shape[i])
		}
		return maxX - minX
	}

	private getShapeHeight(shape: number[]): number {
		let minY = Infinity, maxY = -Infinity
		for (let i = 1; i < shape.length; i += 2) {
			minY = Math.min(minY, shape[i])
			maxY = Math.max(maxY, shape[i])
		}
		return maxY - minY
	}
}
