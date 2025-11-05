import { MapStructure, TILE, WALL } from "../types/types";
import { createRectangle, createSquare } from "./shared";


export class Map {
	private borderMargin: number;
	private tileSize: number;
	private floorSet: Set<string> = new Set();
	private _structures: MapStructure[];
	private walls: MapStructure[];
	private wallLongSide: number;
	private wallShortSide: number;
	constructor() {
		this.borderMargin = 50
		this.tileSize = 25
		this._structures = []
		this.walls = []
		this.wallLongSide = this.tileSize
		this.wallShortSide = 5


	}
	get MapStructures(): MapStructure[] {
		return [...this._structures, ...this.walls]
	}

	set MapStructures(value: MapStructure[]) {
		this._structures = value
	}

	handleClick(x: number, y: number, cWidth: number, cHeight: number) {
		if (x < this.borderMargin || x >= cWidth - this.borderMargin) {
			return;
		}
		if (y < this.borderMargin || y >= cHeight - this.borderMargin) {
			return;
		}
		const xTiles: number = Math.floor(x / this.tileSize)
		const yTiles: number = Math.floor(y / this.tileSize)
		if (this.floorSet.has(this.floorKey(xTiles, yTiles))) {
			return
		} else {
			this.floorSet.add(this.floorKey(xTiles, yTiles))
		}

		const isEven = (xTiles + yTiles) % 2 === 0;
		const color: [number, number, number, number] = isEven
			? [0.9725, 0.9686, 1.0, 1.0]   // light tile
			: [0.8588, 0.8353, 0.9725, 1.0]; // dark tile

		const structure: MapStructure = {
			x: xTiles * this.tileSize,
			y: yTiles * this.tileSize,
			shape: createSquare(this.tileSize),
			color: color,
			solid: false,
			type: TILE
		}

		this._structures.push(structure)
		this.checkWall()
		return
	}
	handleCtrlDown(x: number, y: number) {
		for (const s of this.floorSet) {
			const [numX, numY] = this.splitFloorKey(s)
			const floorX = numX * this.tileSize
			const floorY = numY * this.tileSize
			if (floorX <= x && x < floorX + this.tileSize && floorY <= y && y < floorY + this.tileSize) {
				this.floorSet.delete(s)
				this._structures = this._structures.filter((structure) =>
					!(
						structure.x === floorX &&
						structure.y === floorY &&
						structure.type === TILE
					)
				)
				this.checkWall()
			}
		}
	}
	floorKey(x: number, y: number): string {
		return `${x},${y}`
	}
	splitFloorKey(key: string): [number, number] {
		const [fx, fy] = key.split(",").map(Number)
		return [fx, fy]
	}
	checkWall() {
		const walls: MapStructure[] = []
		const DIR4 = [
			{ x: 0, y: -1, dir: "N" },
			{ x: 1, y: 0, dir: "E" },
			{ x: 0, y: 1, dir: "S" },
			{ x: -1, y: 0, dir: "W" },
		];
		for (const s of this.floorSet) {
			const [fx, fy] = this.splitFloorKey(s)
			for (const dir of DIR4) {
				if (!this.floorSet.has(this.floorKey(fx + dir.x, fy + dir.y))) {
					const wall = this.buildWall(fx, fy, dir.dir)
					if (wall) {
						walls.push(wall)
					}
				}
			}
		}
		this.walls = walls
	}
	//builds a wall based on the fx, fy, and wall direction)
	buildWall(fx: number, fy: number, dir: string): MapStructure | null {
		let wall: MapStructure
		if (dir === "N") {
			wall = {
				x: fx * this.tileSize,
				y: (fy * this.tileSize) - this.wallShortSide,
				shape: createRectangle(this.wallLongSide, this.wallShortSide),
				color: [0, 0, 0, 1],
				solid: true,
				type: WALL,
			}
			return wall
		}
		if (dir === "E") {
			wall = {
				x: (fx * this.tileSize) + this.tileSize,
				y: (fy * this.tileSize),
				shape: createRectangle(this.wallShortSide, this.wallLongSide),
				color: [0, 0, 0, 1],
				solid: true,
				type: WALL,
			}
			return wall
		}
		if (dir === "S") {
			wall = {
				x: fx * this.tileSize,
				y: (fy * this.tileSize) + this.wallLongSide,
				shape: createRectangle(this.wallLongSide, this.wallShortSide),
				color: [0, 0, 0, 1],
				solid: true,
				type: WALL,
			}
			return wall
		}
		if (dir === "W") {
			wall = {
				x: (fx * this.tileSize) - this.wallShortSide,
				y: (fy * this.tileSize),
				shape: createRectangle(this.wallShortSide, this.wallLongSide),
				color: [0, 0, 0, 1],
				solid: true,
				type: WALL,
			}
			return wall
		}
		return null
	}



}
