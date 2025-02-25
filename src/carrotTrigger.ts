import { GameObject, GameObjectClass, collides } from "kontra";
import MainScene from "./main";

type Props = Parameters<typeof GameObject>[0] & {
	scene: MainScene;
};

export default class CarrotTrigger extends GameObjectClass {
	scene: MainScene;

	constructor(props: Props) {
		super(props);

		this.scene = props.scene;
	}

	update() {
		const water = this.scene.getNearestPickup(
			this.position,
			Math.max(this.width, this.height),
			"water",
		);

		if (water !== null && collides(water, this)) {
			water.hide();

			this.scene.pickups.forEach((pickup) => {
				if (pickup.name === "carrot_plant") {
					pickup.show();
					pickup.sprite.playAnimation("carrot_plant");
				}
			});

			setTimeout(() => {
				this.scene.pickups.forEach((pickup) => {
					if (pickup.name === "carrot") {
						pickup.show();
					}
				});
			}, 3000);
		}
	}

	draw() {
		this.context.strokeStyle = "red";
		this.context.strokeRect(0, 0, this.width, this.height);
	}
}
