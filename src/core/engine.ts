// engine.ts
import { Renderer } from "../renderer/renderer";
import { Map } from "../map/map";
import { Player } from "../entities/player";
import { Input } from "./input";

export class Engine {
	private renderer: Renderer;
	private map: Map;
	private player: Player;
	private inputManager: Input;
	private lastTime = 0;
	private running = false;

	constructor(private canvas: HTMLCanvasElement) {
		this.renderer = new Renderer(canvas);
		this.map = new Map();
		this.player = new Player(50, 50, [1, 0, 0, 1]);
		this.inputManager = new Input(canvas, this.map, this.player);
	}

	async initialize(): Promise<void> {
		await this.renderer.initialize();
	}

	start(): void {
		if (this.running) return;

		this.running = true;
		this.lastTime = performance.now();
		this.gameLoop();
	}

	stop(): void {
		this.running = false;
	}

	private gameLoop(): void {
		if (!this.running) return;

		const currentTime = performance.now();
		const deltaTime = (currentTime - this.lastTime) / 1000;
		this.lastTime = currentTime;

		this.update(deltaTime);
		this.render(deltaTime);  // Pass deltaTime to render

		requestAnimationFrame(() => this.gameLoop());
	}

	private update(deltaTime: number): void {
		// Update game logic here if needed
	}

	private render(deltaTime: number): void {  // Accept deltaTime parameter
		this.renderer.clear(1, 1, 1, 1);

		const mapStructures = this.map.MapStructures;
		if (mapStructures.length > 0) {
			this.renderer.drawStructures(mapStructures);
		}

		const playerFrame = this.player.updatePos(
			deltaTime,  // ✅ CORRECT - Use deltaTime instead of this.lastTime
			this.canvas.height,
			this.canvas.width,
			this.map.MapStructures
		);

		this.renderer.drawEntities([playerFrame]);
	}

	dispose(): void {
		this.stop();
		this.renderer.dispose();
	}
}
