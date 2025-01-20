import { defineConfig } from "vite";

export default defineConfig(({ command }) => {
	const config = {
		base: "/",
		server: {
			force: true,
		},
		build: {
			trailingSlash: true,
		},
		// Base config here
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
