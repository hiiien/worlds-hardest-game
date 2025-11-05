import { MapStructure, WALL } from "../types/types";
import { createRectangle, createSquare } from "./geometry";
import { TileManager } from "./tileManager";

export class WallBuilder {
	private readonly directions = [
		{ x: 0, y: -1, dir: "N" },
		{ x: 1, y: 0, dir: "E" },
		{ x: 0, y: 1, dir: "S" },
		{ x: -1, y: 0, dir: "W" },
	]
	constructor(
		public readonly wallLongSide: number,
		public readonly wallShortSide: number,
	) { }
	buildWalls(tileManager: TileManager): MapStructure[] {
		const walls: MapStructure[] = []
		for (const [fx, fy] of tileManager.getAllTile()) {
			for (const dir of this.directions) {
				if (!tileManager.hasTile(fx + dir.x, fy + dir.y)) {
					const wall = this.buildWall(tileManager.tileSize, fx, fy, dir.dir);
					if (wall) walls.push(wall)
				}
			}
		}
		return walls
	}
	private buildWall(tileSize: number, fx: number, fy: number, dir: string): MapStructure | null {
		const wallConfigs: Record<string, Partial<MapStructure>> = {
			N: {
				x: fx * tileSize,
				y: (fy * tileSize) - this.wallShortSide,
				shape: createRectangle(this.wallLongSide, this.wallShortSide),
			},
			E: {
				x: (fx * tileSize) + tileSize,
				y: (fy * tileSize),
				shape: createRectangle(this.wallShortSide, this.wallLongSide),
			},
			S: {
				x: fx * tileSize,
				y: (fy * tileSize) + this.wallLongSide,
				shape: createRectangle(this.wallLongSide, this.wallShortSide),
			},
			W: {
				x: (fx * tileSize) - this.wallShortSide,
				y: (fy * tileSize),
				shape: createRectangle(this.wallShortSide, this.wallLongSide),
			}
		}
		const config = wallConfigs[dir];
		if (!config) return null
		return {
			...config,
			color: [0, 0, 0, 1],
			solid: true,
			type: WALL,
		} as MapStructure
	}
}
