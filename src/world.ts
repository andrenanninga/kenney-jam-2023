import {
	GameObject,
	GameObjectClass,
	TileEngine,
	Vector,
	dataAssets,
	getCanvas,
} from "kontra";

import Farmer from "./farmer";
import MainScene from "./main";
import Pickup from "./pickup";
import SwapPickup from "./swapPickup";
import CarrotTrigger from "./carrotTrigger";

type Props = Parameters<typeof GameObject>[0] & {
	scene: MainScene;
};

export default class World extends GameObjectClass {
	tileEngine: TileEngine;

	scene: MainScene;

	collisionLayer;

	pickupables = ["empty_water", "water", "carrot_plant", "carrot"];

	constructor(props: Props) {
		super(props);

		this.scene = props.scene;

		this.tileEngine = TileEngine(dataAssets["world"]);

		this.setupEntities();
	}

	setupEntities() {
		function setPosition(entity, definition) {
			entity.x = definition.x + entity.sprite.anchor.x * 16;
			entity.y = definition.y - entity.sprite.anchor.y * 16;
		}

		function getProperty(definition, name) {
			return definition.properties?.find((prop) => prop.name === name)?.value;
		}

		const entities: any = this.tileEngine.layers.find(
			(layer: any) => layer.name === "entities",
		);

		entities.objects.forEach(async (definition: any) => {
			if (definition.name === "player") {
				setPosition(this.scene.player, definition);
			}

			if (definition.name === "farmer") {
				const npc = new Farmer({ scene: this.scene });
				setPosition(npc, definition);

				this.scene.npcs.push(npc);
			}

			if (definition.name === "swap_pickup") {
				const swapPickup = new SwapPickup({
					scene: this.scene,
					in: getProperty(definition, "in"),
					out: getProperty(definition, "out"),
					x: definition.x,
					y: definition.y,
					width: definition.width,
					height: definition.height,
				});

				this.scene.triggers.push(swapPickup);
			}

			if (definition.name === "carrot_trigger") {
				this.scene.triggers.push(
					new CarrotTrigger({
						scene: this.scene,
						x: definition.x,
						y: definition.y,
						width: definition.width,
						height: definition.height,
					}),
				);
			}

			if (this.pickupables.includes(definition.name)) {
				const pickup = new Pickup({ scene: this.scene, name: definition.name });
				setPosition(pickup, definition);

				if (getProperty(definition, "hidden")) {
					pickup.hide();
				}

				this.scene.pickups.push(pickup);
			}

			console.log(definition);
		});
	}

	isWalkable(x: number, y: number) {
		return this.tileEngine.tileAtLayer("collision", { x, y }) === 0;
	}

	update() {
		// this.tileEngine.x -= this.scene.player.x;
		// this.tileEngine.render =
	}

	draw() {}

	render() {
		let { width, height } = getCanvas();

		this.context.drawImage(
			this.tileEngine._c,
			this.scene.player.x - width / 2,
			this.scene.player.y - height / 2,
			width,
			height,
			this.scene.player.x - width / 2,
			this.scene.player.y - height / 2,
			width,
			height,
		);
	}
}
