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

export default class Hand extends GameObjectClass {
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
				grab: {
					frames: [8, 9],
					frameRate: 2,
					loop: true,
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
			const xOffset = this.scene.player.x > this.target.x ? 4 : -4;
			const yOffset = this.scene.player.y > this.target.y ? 4 : -4;

			this.x = lerp(this.x, this.target.x + xOffset, 10 * delta);
			this.y = lerp(this.y, this.target.y + yOffset, 10 * delta);
		}

		if (this.target !== this.scene.player) {
			this.sprite.opacity = lerp(this.sprite.opacity, 1, 10 * delta);
		} else {
			this.sprite.opacity = lerp(this.sprite.opacity, 0, 20 * delta);
		}
	}

	draw() {
		this.sprite.render();
	}
}
