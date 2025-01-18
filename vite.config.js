import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig(({ command }) => {
	const config = {
		build: {
			rollupOptions: {
				input: {
					main: resolve(__dirname, "index.html"),
					card: resolve(__dirname, "card/index.html"),
				},
			},
		},
	};

	if (command === "serve") {
		// Only add proxy during development ('serve')
		config.server = {
			proxy: {
				"^/docs$": {
					target: "http://localhost:5174",
					changeOrigin: true,
					rewrite: () => "/",
				},
				"^/docs/": {
					target: "http://localhost:5174",
					changeOrigin: true,
				},
			},
		};
	}

	return config;
});
