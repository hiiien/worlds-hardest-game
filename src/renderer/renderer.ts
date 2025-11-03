import vertexShaderSource from "../shader/vertex.glsl";
import fragmentShaderSource from "../shader/fragment.glsl";
import { MapStructure } from "../types/types";
export class Renderer {
	private canvas: HTMLCanvasElement;
	private gl: WebGL2RenderingContext | null = null;
	private program: WebGLProgram | null = null;
	private vao: WebGLVertexArrayObject | null = null;
	private positionBuffer: WebGLBuffer | null = null;
	private staticPositionBuffer: WebGLBuffer | null = null;
	private locations: {
		position?: number;
		resolution?: WebGLUniformLocation | null;
		color?: WebGLUniformLocation | null;
	} = {};

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
	}

	async initialize(): Promise<void> {
		this.gl = this.canvas.getContext("webgl2");
		if (!this.gl) throw new Error("WebGL2 not supported");

		const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
		const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
		if (!vertexShader || !fragmentShader) throw new Error("Shader creation failed.");

		this.program = this.createProgram(vertexShader, fragmentShader);
		if (!this.program) throw new Error("Program linking failed.");

		this.locations.position = this.gl.getAttribLocation(this.program, "a_position");
		this.locations.resolution = this.gl.getUniformLocation(this.program, "u_resolution");
		this.locations.color = this.gl.getUniformLocation(this.program, "u_color");
		this.setupVertexArray();
	}

	private setupVertexArray(): void {
		const gl = this.gl!;
		this.vao = gl.createVertexArray();
		gl.bindVertexArray(this.vao);

		this.staticPositionBuffer = gl.createBuffer();
		this.positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		if (this.locations.position !== undefined && this.locations.position >= 0) {
			gl.enableVertexAttribArray(this.locations.position);
			gl.vertexAttribPointer(this.locations.position, 2, gl.FLOAT, false, 0, 0);
		}

		gl.bindVertexArray(null);
	}

	private createShader(type: number, source: string): WebGLShader | null {
		const gl = this.gl!;
		const shader = gl.createShader(type);
		if (!shader) return null;

		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return null;
		}
		return shader;
	}

	private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
		const gl = this.gl!;
		const program = gl.createProgram();
		if (!program) return null;

		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error("Program linking error:", gl.getProgramInfoLog(program));
			gl.deleteProgram(program);
			return null;
		}
		return program;
	}


	clear(r = 0, g = 0, b = 0, a = 1): void {
		const gl = this.gl!;
		this.resizeCanvasToDisplaySize();

		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		gl.clearColor(r, g, b, a);
		gl.clear(gl.COLOR_BUFFER_BIT);
	}

	private startFrame(): void {
		const gl = this.gl!;
		gl.useProgram(this.program);
		gl.uniform2f(this.locations.resolution!, gl.canvas.width, gl.canvas.height);
		gl.bindVertexArray(this.vao);
	}

	drawEntity(entity: {
		x: number;
		y: number;
		shape: number[];
		color?: [number, number, number, number];
		vertexCount?: number;
	}): void {
		const gl = this.gl!;
		const vertices = this.getTransformedVertices(entity);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		if (this.locations.position !== undefined && this.locations.position >= 0) {
			gl.vertexAttribPointer(this.locations.position, 2, gl.FLOAT, false, 0, 0);
		}
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

		const color = entity.color ?? [1.0, 0.0, 0.0, 1.0];
		gl.uniform4fv(this.locations.color!, color);

		const vertexCount = entity.vertexCount ?? vertices.length / 2;
		gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
	}

	drawEntities(entities: {
		x: number;
		y: number;
		shape: number[];
		color?: [number, number, number, number];
		vertexCount?: number;
	}[]): void {
		this.startFrame();
		for (const entity of entities) this.drawEntity(entity);
	}
	drawStructures(structures: MapStructure[]) {
		this.startFrame();
		for (const structure of Object.values(structures)) {
			const gl = this.gl!;
			const vertices = this.getTransformedVertices(structure)

			gl.bindBuffer(gl.ARRAY_BUFFER, this.staticPositionBuffer)
			if (this.locations.position !== undefined && this.locations.position >= 0) {
				gl.vertexAttribPointer(this.locations.position, 2, gl.FLOAT, false, 0, 0);
			}
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

			const color = structure.color ?? [1, 0, 0, 1]
			gl.uniform4fv(this.locations.color!, color);

			const vertexCount = vertices.length / 2
			gl.drawArrays(gl.TRIANGLES, 0, vertexCount)
		}
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
		const canvas = this.canvas;
		const displayWidth = canvas.clientWidth;
		const displayHeight = canvas.clientHeight;
		const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;
		if (needResize) {
			canvas.width = displayWidth;
			canvas.height = displayHeight;
		}
		return needResize;
	}

	dispose(): void {
		const gl = this.gl!;
		if (this.program) gl.deleteProgram(this.program);
		if (this.positionBuffer) gl.deleteBuffer(this.positionBuffer);
		if (this.vao) gl.deleteVertexArray(this.vao);
	}
}
