<template>
	<Game />
</template>

<script>
	import Game from './components/Game.vue';

	export default {
		components: { Game },
	};
</script>

<style>
	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		font-family: inherit;
	}

	html,
	body {
		height: 100%;
	}

	html {
		overflow: clip;
	}

	body {
		min-height: 100dvh;
		font-family: 'Balsamiq Sans', sans-serif;
		font-size: 1rem;
		font-weight: 400;
		line-height: 1.5;
	}
</style>