export class ShaderManager {
	public program: WebGLProgram;
	public locations: {
		position: number;
		resolution: WebGLUniformLocation;
		color: WebGLUniformLocation;
	};

	constructor(
		private gl: WebGL2RenderingContext,
		vertexSource: string,
		fragmentSource: string
	) {
		const vertexShader = this.compileShader(gl.VERTEX_SHADER, vertexSource);
		const fragmentShader = this.compileShader(gl.FRAGMENT_SHADER, fragmentSource);
		this.program = this.linkProgram(vertexShader, fragmentShader);

		this.locations = {
			position: gl.getAttribLocation(this.program, "a_position"),
			resolution: gl.getUniformLocation(this.program, "u_resolution")!,
			color: gl.getUniformLocation(this.program, "u_color")!
		};
	}

	private compileShader(type: number, source: string): WebGLShader {
		const shader = this.gl.createShader(type)!;
		this.gl.shaderSource(shader, source);
		this.gl.compileShader(shader);

		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			const info = this.gl.getShaderInfoLog(shader);
			this.gl.deleteShader(shader);
			throw new Error(`Shader compilation failed: ${info}`);
		}

		return shader;
	}

	private linkProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
		const program = this.gl.createProgram()!;
		this.gl.attachShader(program, vertexShader);
		this.gl.attachShader(program, fragmentShader);
		this.gl.linkProgram(program);

		if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
			const info = this.gl.getProgramInfoLog(program);
			this.gl.deleteProgram(program);
			throw new Error(`Program linking failed: ${info}`);
		}

		return program;
	}

	use(): void {
		this.gl.useProgram(this.program);
	}

	setResolution(width: number, height: number): void {
		this.gl.uniform2f(this.locations.resolution, width, height);
	}

	setColor(color: [number, number, number, number]): void {
		this.gl.uniform4fv(this.locations.color, color);
	}

	dispose(): void {
		this.gl.deleteProgram(this.program);
	}
}
