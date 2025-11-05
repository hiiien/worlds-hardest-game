import vertexShaderSource from "./shaders/vertex.glsl";
import fragmentShaderSource from "./shaders/fragment.glsl";
import { MapStructure } from "../types/types";
import { ShaderManager } from "./shaderManager";
import { BufferManager } from "./bufferManager";

export class Renderer {
	private gl: WebGL2RenderingContext;
	private shaderManager: ShaderManager;
	private bufferManager: BufferManager;

	constructor(private canvas: HTMLCanvasElement) {
		this.gl = canvas.getContext("webgl2")!;
		if (!this.gl) throw new Error("WebGL2 not supported");

		this.shaderManager = new ShaderManager(
			this.gl,
			vertexShaderSource,
			fragmentShaderSource
		);

		this.bufferManager = new BufferManager(
			this.gl,
			this.shaderManager.locations.position
		);
	}

	async initialize(): Promise<void> {
		// Any async initialization can go here
		return Promise.resolve();
	}

	clear(r = 0, g = 0, b = 0, a = 1): void {
		this.resizeCanvasToDisplaySize();
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
		this.gl.clearColor(r, g, b, a);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	}

	drawEntities(entities: Array<{
		x: number;
		y: number;
		shape: number[];
		color?: [number, number, number, number];
		vertexCount?: number;
	}>): void {
		this.startFrame();

		for (const entity of entities) {
			this.drawEntity(entity);
		}
	}

	drawStructures(structures: MapStructure[]): void {
		this.startFrame();

		for (const structure of structures) {
			this.drawStructure(structure);
		}
	}

	private drawStructure(structure: MapStructure): void {
		const vertices = this.getTransformedVertices(structure);

		// Use dynamic buffer instead of static buffer
		this.bufferManager.updateDynamicBuffer(new Float32Array(vertices));

		const color = structure.color ?? [1, 0, 0, 1];
		this.shaderManager.setColor(color);

		const vertexCount = vertices.length / 2;
		this.gl.drawArrays(this.gl.TRIANGLES, 0, vertexCount);
	}

	private startFrame(): void {
		this.shaderManager.use();
		this.shaderManager.setResolution(this.gl.canvas.width, this.gl.canvas.height);
		this.bufferManager.bind();
	}

	private drawEntity(entity: {
		x: number;
		y: number;
		shape: number[];
		color?: [number, number, number, number];
		vertexCount?: number;
	}): void {
		const vertices = this.getTransformedVertices(entity);
		this.bufferManager.updateDynamicBuffer(new Float32Array(vertices));

		const color = entity.color ?? [1.0, 0.0, 0.0, 1.0];
		this.shaderManager.setColor(color);

		const vertexCount = entity.vertexCount ?? vertices.length / 2;
		this.gl.drawArrays(this.gl.TRIANGLES, 0, vertexCount);
	}


	private getTransformedVertices(entity: { x: number; y: number; shape: number[] }): number[] {
		const transformed: number[] = [];
		for (let i = 0; i < entity.shape.length; i += 2) {
			transformed.push(entity.shape[i] + entity.x);
			transformed.push(entity.shape[i + 1] + entity.y);
		}
		return transformed;
	}

	private resizeCanvasToDisplaySize(): boolean {
		const displayWidth = this.canvas.clientWidth;
		const displayHeight = this.canvas.clientHeight;
		const needResize = this.canvas.width !== displayWidth || this.canvas.height !== displayHeight;

		if (needResize) {
			this.canvas.width = displayWidth;
			this.canvas.height = displayHeight;
		}

		return needResize;
	}

	dispose(): void {
		this.shaderManager.dispose();
		this.bufferManager.dispose();
	}
}
