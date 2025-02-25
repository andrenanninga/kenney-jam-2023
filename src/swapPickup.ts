import { GameObject, GameObjectClass, collides } from "kontra";
import MainScene from "./main";

type Props = Parameters<typeof GameObject>[0] & {
	scene: MainScene;
	in: string;
	out: string;
};

export default class SwapPickup extends GameObjectClass {
	scene: MainScene;

	in: string;
	out: string;

	constructor(props: Props) {
		super(props);

		this.scene = props.scene;

		this.in = props.in;
		this.out = props.out;
	}

	update() {
		const nearestIn = this.scene.getNearestPickup(
			this.position,
			Math.max(this.width, this.height),
			this.in,
		);

		if (nearestIn !== null && collides(nearestIn, this)) {
			nearestIn.hide();

			this.scene.pickups
				.find((pickup) => {
					return pickup.name === this.out && collides(pickup, this);
				})
				?.show();
		}
	}

	draw() {
		this.context.strokeStyle = "red";
		this.context.strokeRect(0, 0, this.width, this.height);
	}
}
