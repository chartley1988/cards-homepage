import { defineConfig } from "vite";
import { resolve } from "path";
import fs from "fs";
import path from "path";

function pagesPlugin() {
  return {
		name: "pages-plugin",
		configureServer(server) {
			// For dev server, add custom routes
			server.middlewares.use((req, res, next) => {
				const url = req.url;
				// If accessing /card, serve the content from /pages/card
				if (url?.startsWith("/card")) {
					req.url = `/pages${url}`;
				}
				next();
			});
		},
		closeBundle: async () => {
			const pagesDir = path.join("dist", "pages");

			if (fs.existsSync(pagesDir)) {
				const dirs = fs.readdirSync(pagesDir);

				dirs.forEach((dir) => {
					if (dir !== "docs") {
						const oldPath = path.join(pagesDir, dir);
						const newPath = path.join("dist", dir);

						if (!fs.existsSync(newPath)) {
							fs.mkdirSync(newPath, { recursive: true });
						}

						const files = fs.readdirSync(oldPath);
						files.forEach((file) => {
							const oldFilePath = path.join(oldPath, file);
							const newFilePath = path.join(newPath, file);
							fs.renameSync(oldFilePath, newFilePath);
						});

						fs.rmdirSync(oldPath);
					}
				});

				if (
					fs.existsSync(pagesDir) &&
					fs.readdirSync(pagesDir).length === 0
				) {
					fs.rmdirSync(pagesDir);
				}
			}
		},
  };
}

function getPages() {
	const pagesDir = resolve(__dirname, "pages");
	const pages = {};

	try {
		const dirs = fs.readdirSync(pagesDir);

		dirs.forEach((dir) => {
			const fullPath = path.join(pagesDir, dir, "index.html");

			if (fs.existsSync(fullPath) && dir !== "docs") {
				pages[dir] = resolve(__dirname, `pages/${dir}/index.html`);
			}
		});

		if (fs.existsSync(resolve(__dirname, "index.html"))) {
			pages.main = resolve(__dirname, "index.html");
		}
	} catch (error) {
		console.error("Error scanning directories:", error);
	}

	return pages;
}

export default defineConfig(({ command }) => {
	const config = {
		build: {
			outDir: "dist",
			rollupOptions: {
				input: getPages(),
			},
		},
		plugins: [pagesPlugin()],
	};

	if (command === "serve") {
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
			fs: {
				strict: false,
				allow: ["."], // Allow serving files from project root
			},
		};
	}

	return config;
});
