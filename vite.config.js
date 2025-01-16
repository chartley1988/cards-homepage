import { defineConfig } from "vite";

export default defineConfig({
	server: {
		proxy: {
			"^/docs$": {
				target: "http://localhost:5174",
				changeOrigin: true,
				rewrite: () => "/",
			},
			"^/docs/": {
				target: "http://localhost:5174",
				changeOrigin: true,
				// rewrite: (path) => path.replace(/^\/docs/, ""),
			},
		},
	},
});
