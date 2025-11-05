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
	update(transform: Transform, deltaTime: number): void {
		this.velocity.x = 0;
		this.velocity.y = 0;
		if (this.directionMap["w"]) this.velocity.x -= 1;
		if (this.directionMap["a"]) this.velocity.x += 1;
		if (this.directionMap["s"]) this.velocity.y -= 1;
		if (this.directionMap["d"]) this.velocity.y += 1;

		transform.translate(
			this.velocity.x * this.speed * deltaTime,
			this.velocity.y * this.speed * deltaTime
		)
	}

	setDirection(key: string, pressed: boolean): void {
		if (key in this.directionMap) {
			this.directionMap[key] = pressed;
		}
	}
}
