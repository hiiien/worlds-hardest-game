// movement.ts
import { Transform } from "./transform";

export class Movement {
	public velocity = { x: 0, y: 0 };
	public directionMap: Record<string, boolean> = {
		"w": false,
		"a": false,
		"s": false,
		"d": false,
	};

	constructor(public speed: number) { }

	// New method: Calculate velocity without applying it
	calculateVelocity(deltaTime: number): { x: number; y: number } {
		this.velocity.x = 0;
		this.velocity.y = 0;

		if (this.directionMap["w"]) this.velocity.y -= 1;
		if (this.directionMap["s"]) this.velocity.y += 1;
		if (this.directionMap["a"]) this.velocity.x -= 1;
		if (this.directionMap["d"]) this.velocity.x += 1;

		return {
			x: this.velocity.x * this.speed * deltaTime,
			y: this.velocity.y * this.speed * deltaTime
		};
	}

	// Keep the old method for compatibility if needed elsewhere
	update(transform: Transform, deltaTime: number): void {
		const vel = this.calculateVelocity(deltaTime);
		transform.translate(vel.x, vel.y);
	}

	setDirection(key: string, pressed: boolean): void {
		if (key in this.directionMap) {
			this.directionMap[key] = pressed;
		}
	}
}
