import {
	GameObjectClass,
	Sprite,
	SpriteSheet,
	imageAssets,
	keyPressed,
	GameObject,
	onKey,
	lerp,
	randInt,
} from "kontra";
import MainScene from "./main";
import Pickup from "./pickup";

type Props = Parameters<typeof GameObject>[0] & {
	scene: MainScene;
};

export default class Player extends GameObjectClass {
	spriteSheet: SpriteSheet;
	sprite: Sprite;

	speed = 128;
	scene: MainScene;

	time = 0;

	pickupDistance = 32;
	heldPickup: Pickup | null = null;

	constructor(props: Props) {
		super(props);

		this.scene = props.scene;

		this.spriteSheet = SpriteSheet({
			image: imageAssets["colored-transparent_packed"],
			frameWidth: 16,
			frameHeight: 16,

			animations: {
				idle: {
					frames: 410,
					loop: true,
				},
				walk: {
					frames: [411, 412],
					loop: true,
					frameRate: 10,
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

		onKey("space", this.grabPickup.bind(this));
	}

	move(delta: number) {
		let dx = 0;
		let dy = 0;

		if (keyPressed("arrowleft")) {
			dx -= this.speed * delta;
		} else if (keyPressed("arrowright")) {
			dx += this.speed * delta;
		}

		if (keyPressed("arrowup")) {
			dy -= this.speed * delta;
		} else if (keyPressed("arrowdown")) {
			dy += this.speed * delta;
		}

		if (dx === 0 && dy === 0) {
			this.sprite.playAnimation("idle");
		} else {
			this.sprite.playAnimation("walk");

			const ox = dx > 0 ? 4 : -4;
			if (dx !== 0 && this.scene.world.isWalkable(this.x + dx + ox, this.y)) {
				this.scaleX = ox > this.scaleX ? 1 : -1;
				this.x += dx;
			}

			const oy = dy > 0 ? 8 : 0;
			if (dy !== 0 && this.scene.world.isWalkable(this.x, this.y + dy + oy)) {
				this.y += dy;
			}
		}

		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
	}

	checkPickups() {
		if (!this.heldPickup) {
			const nearestNpc = this.scene.getNearestNpc(this.position, 32);

			if (nearestNpc) {
				this.scene.bubble.target = nearestNpc;
				this.scene.hand.target = this;
			} else {
				this.scene.bubble.target = this;

				const nearestPickup = this.scene.getNearestPickup(
					this.position,
					this.pickupDistance,
				);

				if (nearestPickup) {
					this.scene.hand.target = nearestPickup;
				} else {
					this.scene.hand.target = this;
				}
			}
		}
	}

	grabPickup() {
		if (this.heldPickup) {
			this.heldPickup = null;
		} else {
			const nearestPickup = this.scene.getNearestPickup(
				this.position,
				this.pickupDistance,
			);

			this.heldPickup = nearestPickup;
			this.scene.hand.target = this;
		}
	}

	movePickup(delta: number) {
		if (this.heldPickup) {
			this.heldPickup.x = lerp(this.heldPickup.x, this.x, 20 * delta);
			this.heldPickup.y = lerp(this.heldPickup.y, this.y - 5, 10 * delta);
		}
	}

	update(delta: number) {
		this.time += delta;

		this.sprite.update(delta);

		this.move(delta);
		this.checkPickups();
		this.movePickup(delta);
	}

	draw() {
		this.sprite.render();
	}
}
