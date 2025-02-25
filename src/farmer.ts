import {
	GameObject,
	GameObjectClass,
	Sprite,
	SpriteSheet,
	imageAssets,
} from "kontra";
import MainScene from "./main";

type Props = Parameters<typeof GameObject>[0] & {
	scene: MainScene;
};

export default class Farmer extends GameObjectClass {
	spriteSheet: SpriteSheet;
	sprite: Sprite;

	scene: MainScene;

	wants = "carrot";

	constructor(props: Props) {
		super(props);

		this.scene = props.scene;

		this.spriteSheet = SpriteSheet({
			image: imageAssets["colored-transparent_packed"],
			frameWidth: 16,
			frameHeight: 16,

			animations: {
				farmer: {
					frames: 74,
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

		this.sprite.playAnimation("farmer");
	}

	checkPickups() {
		const nearestWantedPickup = this.scene.getNearestPickup(
			this.position,
			24,
			this.wants,
		);

		if (nearestWantedPickup?.isHeldByPlayer === false) {
			nearestWantedPickup.destroy();
		}
	}

	update(delta: number) {
		this.checkPickups();
		this.sprite.update(delta);
	}

	draw() {
		this.sprite.render();
	}
}
