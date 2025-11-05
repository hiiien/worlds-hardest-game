// main.ts
import { Engine } from "./core/engine";

window.onload = async (): Promise<void> => {
	const canvas = document.getElementById("c") as HTMLCanvasElement;
	canvas.width = 700;
	canvas.height = 500;

	const engine = new Engine(canvas);
	await engine.initialize();
	engine.start();
};
