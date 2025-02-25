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
	name: "water" | "carrot" | "empty_water";
};

export default class Pickup extends GameObjectClass {
	spriteSheet: SpriteSheet;
	sprite: Sprite;

	name: string;
	scene: MainScene;

	constructor(props: Props) {
		super(props);

		this.scene = props.scene;
		this.name = props.name;

		this.spriteSheet = SpriteSheet({
			image: imageAssets["sprites"],
			frameWidth: 16,
			frameHeight: 16,

			animations: {
				empty_water: {
					frames: 0,
					loop: false,
				},
				water: {
					frames: [0, 6, 1],
					frameRate: 2,
					loop: false,
				},
				carrot_plant: {
					frames: [2, 3, 4],
					loop: false,
					frameRate: 1,
				},
				carrot: {
					frames: 5,
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

		this.sprite.playAnimation(this.name);
	}

	hide() {
		this.sprite.opacity = 0;
	}

	show() {
		this.sprite.opacity = 1;
		this.sprite.playAnimation(this.name);
	}

	canBePickedUp() {
		if (this.name === "carrot_plant") {
			return false;
		}

		if (this.sprite.opacity === 0) {
			return false;
		}

		if (this.scene.player.heldPickup === this) {
			return false;
		}

		return true;
	}

	destroy() {
		this.scene.pickups = this.scene.pickups.filter((pickup) => {
			return pickup !== this;
		});
	}

	update(delta: number) {
		this.advance(delta);
		this.sprite.update(delta);
	}

	draw() {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		this.sprite.render();
	}
}
