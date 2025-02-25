import { GameLoop, GameObject, Scene, SceneClass, Vector } from "kontra";

import Player from "./player";
import Hand from "./hand";
import Pickup from "./pickup";
import Farmer from "./farmer";
import World from "./world";
import Bubble from "./bubble";

type Props = Parameters<typeof Scene>[0];

export default class MainScene extends SceneClass {
	player: Player;
	hand: Hand;
	bubble: Bubble;
	world: World;

	pickups: Array<Pickup> = [];
	npcs: Array<GameObject> = [];
	triggers: Array<GameObject> = [];

	constructor(props: Props = { id: "main" }) {
		super(props);
		console.log(this);

		this.player = new Player({ x: -100, y: -100, scene: this });
		this.hand = new Hand({ x: -100, y: -100, scene: this });
		this.hand.target = this.player;

		this.bubble = new Bubble({ x: -100, y: -100, scene: this });
		this.bubble.target = this.player;

		this.world = new World({ scene: this });
	}

	getNearestPickup(position: Vector, maxDistance?: number, name?: string) {
		const nearestPickup = this.pickups
			.filter((pickup) => {
				if (!pickup.canBePickedUp()) {
					return false;
				}

				if (name && pickup.name !== name) {
					return false;
				}

				if (maxDistance) {
					const distance = position.distance(pickup.position);

					return distance <= maxDistance;
				}

				return true;
			})
			.sort((a, b) => {
				const distanceA = position.distance(a.position);
				const distanceB = position.distance(b.position);

				return distanceA - distanceB;
			})[0];

		return nearestPickup ?? null;
	}

	getNearestNpc(position: Vector, maxDistance?: number, name?: string) {
		const nearestNpc = this.npcs
			.filter((npc) => {
				if (name && npc.name !== name) {
					return false;
				}

				if (maxDistance) {
					const distance = position.distance(npc.position);

					return distance <= maxDistance;
				}

				return true;
			})
			.sort((a, b) => {
				const distanceA = position.distance(a.position);
				const distanceB = position.distance(b.position);

				return distanceA - distanceB;
			})[0];

		return nearestNpc ?? null;
	}

	update(delta: number) {
		this.world.update();
		this.pickups.forEach((pickup) => pickup.update(delta));
		this.npcs.forEach((npc) => npc.update(delta));
		this.triggers.forEach((trigger) => trigger.update(delta));
		this.player.update(delta);
		this.hand.update(delta);
		this.bubble.update(delta);
	}

	render() {
		this.context.translate(
			Math.round(480 / 2 - this.player.x),
			Math.round(320 / 2 - this.player.y),
		);
		this.world.render();

		this.npcs.forEach((npc) => npc.render());
		this.player.render();
		this.pickups.forEach((pickup) => pickup.render());
		this.hand.render();
		this.bubble.render();

		// this.triggers.forEach((trigger) => trigger.render());

		this.context.resetTransform();
	}
}

const scene = new MainScene();

let loop = GameLoop({
	// create the main game loop
	update: function (delta) {
		scene.update(delta);
	},
	render: function () {
		scene.render();
	},
});

loop.start();
