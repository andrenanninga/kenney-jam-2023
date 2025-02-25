import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
	assetsInclude: ['**/*.png', '**/*.tmj'],
	resolve: {
		alias: {
			'~': path.resolve(__dirname)
		}
	}
})
