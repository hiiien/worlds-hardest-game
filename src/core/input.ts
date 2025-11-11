import { Map } from "../map/map";
import { Player } from "../entities/player";
import { Engine } from "../core/engine";

export class Input {
	private mouseDown = false;
	private ctrlDown = false;

	constructor(
		private canvas: HTMLCanvasElement,
		private map: Map,
		private player: Player,
		private engine: Engine
	) {
		this.setupHandlers();
	}

	private setupHandlers(): void {
		window.addEventListener("mousedown", (e) => this.handleMouseDown(e));
		window.addEventListener("mousemove", (e) => this.handleMouseMove(e));
		window.addEventListener("mouseup", () => this.handleMouseUp());
		window.addEventListener("keydown", (e) => this.handleKeyDown(e));
		window.addEventListener("keyup", (e) => this.handleKeyUp(e));

		const dropdown = document.querySelector<HTMLSelectElement>('#myDropdown');
		if (dropdown) {
			dropdown.addEventListener('change', (e) => {
				const select = e.currentTarget as HTMLSelectElement; // typed, non-null
				console.log(select.value)
				this.map.handleEditorChange(select.value);
			});
		}
		const toggleButton = document.querySelector('#toggle-mode');
		if (toggleButton) {
			toggleButton.addEventListener('click', () => {
				this.player.findStartingPosition(this.map.MapStructures);
				this.engine.toggleGameState();

			});
		}
		const resetButton = document.querySelector('#reset');
		if (resetButton) {
			resetButton.addEventListener('click', () => {
				this.player.repawnPlayer();
			});
		}
	}

	private handleMouseDown(e: MouseEvent): void {
		if (this.engine.getGameState() !== "edit") {
			return;
		}
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
		if (this.engine.getGameState() !== "edit") {
			return;
		}

		const { x, y } = this.getCanvasCoordinates(e);

		if (this.ctrlDown) {
			this.map.handleCtrlDown(x, y);
		} else {
			this.map.handleClick(x, y, this.canvas.width, this.canvas.height);
		}
	}

	private handleMouseUp(): void {
		if (this.engine.getGameState() !== "edit") {
			return;
		}
		this.mouseDown = false;
	}

	private handleKeyDown(e: KeyboardEvent): void {
		if (e.key === "Control") {
			this.ctrlDown = true;
		}
		if (this.engine.getGameState() !== "play") {
			return;
		}
		const key = e.key.toLowerCase();
		this.player.setDirection(key, true);
	}

	private handleKeyUp(e: KeyboardEvent): void {
		if (e.key === "Control") {
			this.ctrlDown = false;
		}
		if (this.engine.getGameState() !== "play") {
			return;
		}
		const key = e.key.toLowerCase();
		this.player.setDirection(key, false);

	}

	private getCanvasCoordinates(e: MouseEvent): { x: number; y: number } {
		const rect = this.canvas.getBoundingClientRect();
		return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		};
	}
}
