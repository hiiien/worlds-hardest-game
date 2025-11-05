// entities/Player.ts
import { Transform } from './transform';
import { Movement } from './movement';
import { Renderable } from './renderable';
import { Collider } from './collider';
import { createSquare } from '../map/geometry';
import { MapStructure } from '../types/types';

export class Player {
	private transform: Transform;
	private movement: Movement;
	private renderable: Renderable;
	private collider: Collider;
	private readonly size = 20;
	private readonly speed = 200;

	constructor(x: number, y: number, color: [number, number, number, number]) {
		this.transform = new Transform(x, y);
		this.movement = new Movement(this.speed); // 200 units per second
		this.renderable = new Renderable(createSquare(this.size), color);
		this.collider = new Collider(this.size, this.size);
	}

	get directionMap() {
		return this.movement.directionMap;
	}

	updatePos(
		deltaTime: number,
		canvasHeight: number,
		canvasWidth: number,
		structures: MapStructure[]
	) {
		const oldX = this.transform.x;
		const oldY = this.transform.y;
		const velocity = this.movement.calculateVelocity(deltaTime);

		this.transform.x += velocity.x;

		let xCollision = false;
		for (const structure of structures) {
			if (structure.solid && this.checkCollisionWithStructure(structure)) {
				xCollision = true;
				break;
			}
		}

		if (xCollision) {
			this.transform.x = oldX; // Revert X movement only
		}

		// Try Y movement
		this.transform.y += velocity.y;

		// Check Y-axis collision
		let yCollision = false;
		for (const structure of structures) {
			if (structure.solid && this.checkCollisionWithStructure(structure)) {
				yCollision = true;
				break;
			}
		}

		if (yCollision) {
			this.transform.y = oldY; // Revert Y movement only
		}

		// Clamp to canvas bounds
		this.collider.clampToBounds(this.transform, canvasWidth, canvasHeight);

		// Return renderable data
		return {
			x: this.transform.x,
			y: this.transform.y,
			shape: this.renderable.shape,
			color: this.renderable.color,
			vertexCount: this.renderable.vertexCount
		};
	}

	setDirection(key: string, pressed: boolean): void {
		this.movement.setDirection(key, pressed);
	}

	private checkCollisionWithStructure(structure: MapStructure): boolean {
		const structureWidth = this.getStructureWidth(structure.shape);
		const structureHeight = this.getStructureHeight(structure.shape);

		const structureCollider = new Collider(structureWidth, structureHeight, structure.solid);
		const structureTransform = new Transform(structure.x, structure.y);

		return this.collider.intersects(structureCollider, this.transform, structureTransform);
	}

	private getStructureWidth(shape: number[]): number {
		let maxX = -Infinity;
		for (let i = 0; i < shape.length; i += 2) {
			maxX = Math.max(maxX, shape[i]);
		}
		return maxX;
	}

	private getStructureHeight(shape: number[]): number {
		let maxY = -Infinity;
		for (let i = 1; i < shape.length; i += 2) {
			maxY = Math.max(maxY, shape[i]);
		}
		return maxY;
	}
}
