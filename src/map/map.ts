import { MapStructure } from "../types/types";
import { StructureTypeConstants } from "../constants";
import { createSquare } from "./geometry";
import { TileManager } from "./tileManager";
import { WallBuilder } from "./wallBuilder";

export class Map {
	private tileManager: TileManager;
	private wallBuilder: WallBuilder;
	private _structures: MapStructure[] = [];

	constructor(
		private readonly borderMargin: number = 50,
		tileSize: number = 25
	) {
		this.tileManager = new TileManager(tileSize);
		this.wallBuilder = new WallBuilder(tileSize, 5);
	}

	get MapStructures(): MapStructure[] {
		return this._structures;
	}

	handleClick(x: number, y: number, cWidth: number, cHeight: number): void {
		if (
			x < this.borderMargin ||
			x >= cWidth - this.borderMargin ||
			y < this.borderMargin ||
			y >= cHeight - this.borderMargin
		) {
			return;
		}

		const tileX = Math.floor(x / this.tileManager.tileSize);
		const tileY = Math.floor(y / this.tileManager.tileSize);

		if (this.tileManager.addTile(tileX, tileY)) {
			this.regenerateStructures();
		}
	}

	handleCtrlDown(x: number, y: number): void {
		const tile = this.tileManager.getTileAt(x, y);
		if (tile) {
			const [tileX, tileY] = tile;
			if (this.tileManager.removeTile(tileX, tileY)) {
				this.regenerateStructures();
			}
		}
	}
	handleEditorChange(tileType: string): void {
		if (tileType === StructureTypeConstants.SAVE_TILE) {
			this.tileManager.setTileEditorType(StructureTypeConstants.SAVE_TILE);
		} else if (tileType === StructureTypeConstants.FINISH_TILE) {
			this.tileManager.setTileEditorType(StructureTypeConstants.FINISH_TILE);
		} else if (tileType === StructureTypeConstants.FLOOR_TILE) {
			this.tileManager.setTileEditorType(StructureTypeConstants.FLOOR_TILE);
		} else if (tileType === StructureTypeConstants.START_TILE) {
			this.tileManager.setTileEditorType(StructureTypeConstants.START_TILE);
		}
	}

	private regenerateStructures(): void {
		const tiles = this.generateTiles();
		const walls = this.wallBuilder.buildWalls(this.tileManager);
		this._structures = [...tiles, ...walls];
	}

	private generateTiles(): MapStructure[] {
		const tiles: MapStructure[] = [];

		for (const [x, y] of this.tileManager.getAllTile()) {
			const isEven = (x + y) % 2 === 0;
			const tileType = this.tileManager.getTileWithType(x, y);

			// Handle null case - provide default values if tile type not found
			const type = tileType ? tileType[2] : StructureTypeConstants.FLOOR_TILE;

			let color: [number, number, number, number];
			if (type === StructureTypeConstants.SAVE_TILE || type === StructureTypeConstants.FINISH_TILE || type === StructureTypeConstants.START_TILE) {
				color = [0.6196, 0.9490, 0.6078, 1];
			} else {
				color = isEven
					? [0.9725, 0.9686, 1.0, 1.0]
					: [0.8588, 0.8353, 0.9725, 1.0];
			}

			tiles.push({
				x: x * this.tileManager.tileSize,
				y: y * this.tileManager.tileSize,
				shape: createSquare(this.tileManager.tileSize),
				color,
				solid: false,
				type: type
			});
		}

		return tiles;
	}
}
