import { StructureTypeConstants } from "../constants";
export type TileType = StructureTypeConstants.FLOOR_TILE | StructureTypeConstants.SAVE_TILE | StructureTypeConstants.FINISH_TILE
export interface MapStructure {
	x: number;
	y: number;
	shape: number[];
	type: string | null;
	solid: boolean;
	color?: [number, number, number, number]
}


export interface Entity {
	x: number;
	y: number;
	shape: number[];
	color?: [number, number, number, number];
	vertexCount?: number;
}
