import { Map } from "../map/map";

export class Input {
	private mouseDown = false;
	private ctrlDown = false;
	constructor(private canvas: HTMLCanvasElement, private map: Map) {
		this.setupHandlers();
	}
	private setupHandlers(): void {
		window.addEventListener("mousedown", (e) => this.handleMouseDown(e));
		window.addEventListener("mousemove", (e) => this.handleMouseMove(e));
		window.addEventListener("mouseup", () => this.handleMouseUp());
		window.addEventListener("keydown", (e) => this.handleKeyDown(e));
		window.addEventListener("keyup", (e) => this.handleKeyUp(e));
	}
	private handleMouseDown(e: MouseEvent): void {
		this.mouseDown = true;
		const { x, y } = this.getCanvasCoordinates(e);
		if (this.ctrlDown) {
			this.map.handleCtrlDown(x, y);
		} else {
			this.map.handleClick(x, y, this.canvas.width, this.canvas.height);
		}
	}
	private handleMouseMove(e: MouseEvent): void {
		if (!this.mouseDown) return;
		const { x, y } = this.getCanvasCoordinates(e);
		if (this.ctrlDown) {
			this.map.handleCtrlDown(x, y);
		} else {
			this.map.handleClick(x, y, this.canvas.width, this.canvas.height);
		}
	}
	handleMouseUp(): void {
		this.mouseDown = false;
	}
	handleKeyDown(e: KeyboardEvent): void {
		const key = e.key.toLowerCase();
		if (e.key === "Control") {
			this.ctrlDown = true;
		}
	}
	handleKeyUp(e: KeyboardEvent): void {
		const key = e.key.toLowerCase();
		if (e.key === "Control") {
			this.ctrlDown = false;
		}
	}


	private getCanvasCoordinates(e: MouseEvent): { x: number, y: number } {
		const rect = this.canvas.getBoundingClientRect();
		return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		}
	}

}
