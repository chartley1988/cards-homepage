import { defineConfig } from "vite";

export default defineConfig({
	server: {
		proxy: {
			"/docs": {
				target: "http://localhost:5174", // Default Vitepress port
				changeOrigin: true,
			},
		},
	},
});
