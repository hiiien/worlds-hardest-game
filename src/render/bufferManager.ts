export class BufferManager {
	public vao: WebGLVertexArrayObject;
	public positionBuffer: WebGLBuffer;
	public staticPositionBuffer: WebGLBuffer;

	constructor(
		private gl: WebGL2RenderingContext,
		positionLocation: number
	) {
		this.vao = gl.createVertexArray()!;
		gl.bindVertexArray(this.vao);

		this.positionBuffer = gl.createBuffer()!;
		this.staticPositionBuffer = gl.createBuffer()!;

		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		gl.enableVertexAttribArray(positionLocation);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

		gl.bindVertexArray(null);
	}

	bind(): void {
		this.gl.bindVertexArray(this.vao);
	}

	updateDynamicBuffer(data: Float32Array): void {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.DYNAMIC_DRAW);
	}

	updateStaticBuffer(data: Float32Array): void {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.staticPositionBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
	}

	bindStaticBuffer(): void {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.staticPositionBuffer);
	}

	dispose(): void {
		this.gl.deleteBuffer(this.positionBuffer);
		this.gl.deleteBuffer(this.staticPositionBuffer);
		this.gl.deleteVertexArray(this.vao);
	}
}
