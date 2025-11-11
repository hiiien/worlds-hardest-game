import { Entity } from "../types/types";
import { Transform } from "./transform";
import { Movement } from "./movement";
import { Renderable } from "./renderable";
import { Collider } from "./collider";
import { createCircle } from "../map/geometry";

export class Enemy {
	private enemies: Entity[] = [];
	private editSelectedEnemy: Entity | null = null;
	private transform: Transform;
	private movement: Movement;
	private renderable: Renderable;
	private collider: Collider;
	private enemyPath: Map<number, [number, number]> = new Map();
	private enemyIndexes: Map<number, [number, number][]> = new Map();
	enemyCount = 0;
	private readonly size = 15;
	private readonly speed = 200;
	private readonly color: [number, number, number, number] = [0, 0, 1, 1];
	constructor() {
		this.transform = new Transform(0, 0);
		this.movement = new Movement(this.speed);
		this.collider = new Collider(this.size, this.size);
		this.renderable = new Renderable(createCircle(this.size / 2), this.color);
		this.addEnemy(60, 60);
	}
	addEnemy(x: number, y: number) {
		const enemy: Entity = {
			x: x,
			y: y,
			entityType: "enemy",
			shape: this.renderable.shape,
			color: this.renderable.color,
			vertexCount: this.renderable.vertexCount
		}
		this.enemyCount++;
		this.enemyPath.set(this.enemyCount, [x, y]);
		this.enemies.push(enemy);
	}
	getEnemies() {
		return this.enemies;
	}
	getEnemySize() {
		return this.size;
	}
	getEditSelectedEnemy() {
		return this.editSelectedEnemy;
	}
	addEnemyPath(id: number, x: number, y: number) {
		const path = this.enemyPath.get(id);
		if (!path) {
			console.error(false, "No path found for this enemy");
			return;
		}
		path.push([x, y]);
		if (path.length > 1) {
			this.enemyIndexes.set(id, [0, 1]);
		}
		this.enemyPath.set(id, path);
	}
	updatePos(deltaTime: number, canvasWidth: number, canvasHeight: number): void {

	}

}
