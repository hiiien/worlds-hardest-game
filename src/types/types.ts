
export const TILE = 'tile'
export const WALL = 'wall'

export interface MapStructure {
	x: number;
	y: number;
	shape: number[];
	//solid is for whether you can go through the object or not
	//i.e is it a wall or floor
	type: string;
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
