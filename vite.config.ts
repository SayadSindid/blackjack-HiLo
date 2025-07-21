import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	base: "/blackjack-card-counter/",
	plugins: [tailwindcss()],
});
