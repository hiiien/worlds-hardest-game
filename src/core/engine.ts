// engine.ts
import { Renderer } from "../render/renderer";
import { Map } from "../map/map";
import { Player } from "../entities/player";
import { Input } from "./input";
import { Enemy } from "../entities/enemies";

export class Engine {
	private renderer: Renderer;
	private map: Map;
	private player: Player;
	private enemies: Enemy;
	private inputManager: Input;
	private lastTime = 0;
	private running = false;
	private gamestate: string = "edit"

	constructor(private canvas: HTMLCanvasElement) {
		this.renderer = new Renderer(canvas);
		this.map = new Map();
		this.player = new Player(50, 50, [1, 0, 0, 1]);
		this.inputManager = new Input(canvas, this.map, this.player, this);
		this.enemies = new Enemy();
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

	getGameState(): string {
		return this.gamestate;
	}

	toggleGameState(): void {
		if (this.gamestate === "play") {
			this.gamestate = "edit";
		} else {
			this.gamestate = "play";
		}
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
			deltaTime,
			this.canvas.width,
			this.canvas.height,
			this.map.MapStructures
		);

		const enemies = this.enemies.getEnemies();
		console.log(enemies);

		if (this.gamestate === "play") {
			this.renderer.drawEntities([playerFrame, ...enemies]);
		} else {
			this.renderer.drawEntities([]);
		}
	}

	dispose(): void {
		this.stop();
		this.renderer.dispose();
	}
}
