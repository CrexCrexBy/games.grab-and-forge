import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'; // Импортируем path для работы с путями

const SUB_FOLDER = '/games.grab-and-forge/';
const BASE_FOLDER = process.env.NODE_ENV === 'production' ? SUB_FOLDER : '/';

// https://vite.dev/config/
export default defineConfig({
	base: BASE_FOLDER,
	optimizeDeps: {
		include: ['phaser'],
	},
	plugins: [vue()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'), // Настраиваем @ как алиас для src
		},
	},
});