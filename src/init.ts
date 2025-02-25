import { load, init, setDataPath, setImagePath, initKeys } from "kontra";
import * as Kontra from "kontra";
console.log(Kontra);

const { canvas } = init();
initKeys();

setDataPath("/assets/");
setImagePath("/assets/");

canvas.width = 480;
canvas.height = 320;
canvas.style.transform = "scale(2)";
// canvas.style.width = `960px`;
// canvas.style.height = `640px`;
canvas.style.imageRendering = "pixelated";

const assets = [
	"colored-transparent_packed.png",
	"colored_packed.png",
	"colored-transparent.png",
	"inputs_black.png",
	"inputs_black_packed.png",
	"inputs_white_packed.png",
	"sprites.png",
	"world.tmj",
];

load(...assets).then(() => import("./main"));
