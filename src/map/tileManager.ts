export class TileManager {
	private tiles = new Set<string>()
	constructor(public readonly tileSize: number) { }

	addTile(x: number, y: number): boolean {
		const key = this.getKey(x, y)
		if (this.tiles.has(key)) {
			return false
		}
		this.tiles.add(key)
		return true
	}
	removeTile(x: number, y: number): boolean {
		const key = this.getKey(x, y)
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
	getAllTile(): Array<[number, number]> {
		return Array.from(this.tiles).map((key) => this.splitKey(key))
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
