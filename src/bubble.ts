import {
	GameObject,
	GameObjectClass,
	Sprite,
	SpriteSheet,
	imageAssets,
	lerp,
} from "kontra";
import MainScene from "./main";

type Props = Parameters<typeof GameObject>[0] & {
	scene: MainScene;
};

export default class Bubble extends GameObjectClass {
	spriteSheet: SpriteSheet;
	sprite: Sprite;

	speed = 4;
	target: GameObject | null = null;

	scene: MainScene;

	constructor(props: Props) {
		super(props);

		this.scene = props.scene;

		this.spriteSheet = SpriteSheet({
			image: imageAssets["sprites"],
			frameWidth: 16,
			frameHeight: 16,

			animations: {
				bubble: {
					frames: 7,
					loop: false,
				},
			},
		});

		this.sprite = Sprite({
			x: 0,
			y: 0,

			anchor: {
				x: 0.5,
				y: 0.5,
			},

			animations: this.spriteSheet.animations,
		});
	}

	update(delta: number) {
		this.sprite.update(delta);

		if (this.target !== null) {
			const xOffset = 0;
			const yOffset = -14;

			this.x = lerp(this.x, this.target.x + xOffset, 10 * delta);
			this.y = lerp(this.y, this.target.y + yOffset, 10 * delta);
		} else {
			this.sprite.opacity = 0;
		}

		if (this.target !== this.scene.player) {
			this.sprite.opacity = lerp(this.sprite.opacity, 1, 10 * delta);
		} else {
			this.sprite.opacity = lerp(this.sprite.opacity, 0, 40 * delta);
		}
	}

	draw() {
		this.sprite.render();
	}
}
