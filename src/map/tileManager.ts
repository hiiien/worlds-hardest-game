import { TileType } from "../types/types";
import { StructureTypeConstants } from "../constants";
export class TileManager {
	private tiles = new Set<string>()
	private tileTypeMap = new Map<string, string>()
	private tileEditorType: TileType = StructureTypeConstants.FLOOR_TILE
	constructor(public readonly tileSize: number) { }

	setTileEditorType(type: TileType): void {
		this.tileEditorType = type
	}

	addTile(x: number, y: number): boolean {
		const key = this.getKey(x, y)
		if (this.tiles.has(key)) {
			return false
		}
		this.tileTypeMap.set(key, this.tileEditorType)
		this.tiles.add(key)
		return true
	}

	removeTile(x: number, y: number): boolean {
		const key = this.getKey(x, y)
		if (!this.tiles.has(key)) {
			return false
		}
		this.tileTypeMap.delete(key)
		return this.tiles.delete(key)
	}

	hasTile(x: number, y: number): boolean {
		const key = this.getKey(x, y)
		return this.tiles.has(key)
	}

	getTileAt(x: number, y: number): [number, number] | null {
		const tileX = Math.floor(x / this.tileSize);
		const tileY = Math.floor(y / this.tileSize);
		if (this.hasTile(tileX, tileY)) {
			return [tileX, tileY]
		}
		return null
	}
	getTileWithType(x: number, y: number): [number, number, string] | null {
		const key = this.getKey(x, y);
		if (!this.tiles.has(key)) return null;

		const type = this.tileTypeMap.get(key);
		return type ? [x, y, type] : null;
	}

	getAllTile(): Array<[number, number]> {
		return Array.from(this.tiles).map((key) => this.splitKey(key))
	}

	getAllTileWithType(): Array<[number, number, string]> {
		return this.getAllTile()
			.map(([x, y]) => this.getTileWithType(x, y))
			.filter((t): t is [number, number, string] => t !== null);
	}

	private getKey(x: number, y: number): string {
		return `${x},${y}`;
	}

	private splitKey(key: string): [number, number] {
		const [fx, fy] = key.split(",").map(Number)
		return [fx, fy]
	}


	clear(): void {
		this.tiles.clear()
	}
}
