import { Sprite, SpriteSheet, imageAssets } from "kontra";

const spriteSheet = SpriteSheet({
	image: imageAssets["colored_packed"],
	frameWidth: 16,
	frameHeight: 16,

	animations: {
		patch: {
			frames: 306,
			loop: false,
		},
	},
});

const patch = Sprite({
	x: 0,
	y: 0,

	anchor: {
		x: 0.5,
		y: 0.5,
	},

	animations: spriteSheet.animations,
});

patch.playAnimation("patch");

export { patch };
