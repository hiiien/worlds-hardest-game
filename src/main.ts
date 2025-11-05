import { createSquare } from "./map/shared"
import { Renderer } from "./renderer/renderer";
import { Map } from "./map/map";
import { MapStructure } from "./types/types";
import { Player } from "./entities/player";

let renderer: Renderer | null = null;
let canvas: HTMLCanvasElement | null = null;
let lastTime = 0;
let map: Map | null = null
let deltaTime: number = 0
let player: Player
window.onload = async (): Promise<void> => {
	canvas = document.getElementById("c") as HTMLCanvasElement;
	canvas.width = 700;
	canvas.height = 500;

	renderer = new Renderer(canvas);
	player = new Player(50, 50, [1, 0, 0, 1])
	map = new Map();
	await renderer.initialize();
	setupInputHandlers()


	lastTime = performance.now();
	render();
};


let mouseDown: boolean = false
let ctrlDown: boolean = false
function setupInputHandlers() {
	window.addEventListener("mousedown", (e) => {
		mouseDown = true
		const rect = canvas!.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		if (ctrlDown) {
			map!.handleCtrlDown(x, y)
		} else {
			map!.handleClick(x, y, canvas!.width, canvas!.height);
		}
	})

	window.addEventListener("mousemove", (e) => {
		const rect = canvas!.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		if (mouseDown && !ctrlDown) {
			map!.handleClick(x, y, canvas!.width, canvas!.height);
		} else if (mouseDown && ctrlDown) {
			map!.handleCtrlDown(x, y)
		}
	});

	window.addEventListener("mouseup", () => {
		mouseDown = false
	})
	window.addEventListener("keydown", (e) => {
		const key = e.key.toLowerCase();
		if (key in player.directionMap) {
			player.directionMap[key] = true;
		}
		if (e.key === "Control") ctrlDown = true;
	});

	window.addEventListener("keyup", (e) => {
		const key = e.key.toLowerCase();
		if (key in player.directionMap) {
			player.directionMap[key] = false;
		}
		if (e.key === "Control") ctrlDown = false;
	});
}

async function render(): Promise<void> {
	if (!renderer) return;

	const currentTime = performance.now();
	deltaTime = (currentTime - lastTime) / 1000;
	lastTime = currentTime;
	renderer.clear(1, 1, 1, 1);
	const mapStructures = map?.MapStructures
	if (mapStructures && mapStructures.length > 0) {
		renderer.drawStructures(mapStructures)
	}
	const playerFrame = player.updatePos(deltaTime, canvas!.height, canvas!.width, map!.MapStructures)
	renderer.drawEntities([playerFrame]);

	requestAnimationFrame(() => render());
}


