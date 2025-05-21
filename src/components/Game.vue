<template>
	<div id="game-container" ref="gameContainer">
		<div :class="['settings-overlay', { show: showSettings }]">
			<div class="settings-panel">
				<h2>{{ translations[selectedLanguage].settings }}</h2>
				<div class="language-section">
					<label for="language">{{ translations[selectedLanguage].language }}</label>
					<div class="language-buttons">
						<button v-for="lang in languages" :key="lang.value" @click="changeLanguage(lang.value)" :class="{ active: selectedLanguage === lang.value, disabled: selectedLanguage === lang.value }" :disabled="selectedLanguage === lang.value">
							<flag :iso="lang.countryCode" />
							<span>{{ lang.nativeName }}</span>
						</button>
					</div>
				</div>
				<button @click="showSettings = false">{{ translations[selectedLanguage].close }}</button>
			</div>
		</div>
	</div>
</template>

<script>
	import Phaser from 'phaser';
	import skyImage from '@/assets/sky.jpg';
	import settingsIcon from '@/assets/settings-icon.png';
	import WebFont from 'webfontloader';
	import enTranslations from '@/lang/en.json';
	import ruTranslations from '@/lang/ru.json';

	export default {
		name: 'Game',
		data() {
			return {
				game: null,
				showSettings: false,
				selectedLanguage: localStorage.getItem('language') || navigator.language.split('-')[0] || 'en',
				translations: {
					en: enTranslations,
					ru: ruTranslations
				},
				languages: [
					{ value: 'en', countryCode: 'us', nativeName: 'English' }, // Используем 'gb' для флага Великобритании
					{ value: 'ru', countryCode: 'ru', nativeName: 'Русский' }
				]
			};
		},
		mounted() {
			WebFont.load({
				custom: {
					families: ['Rubik Dirt'],
					urls: ['/styles/webfonts.css'],
				},
				active: () => {
					this.startGame();
				},
				inactive: () => {
					console.error('Failed to load Rubik Dirt font');
					this.startGame();
				},
			});
		},
		methods: {
			startGame() {
				const vueComponent = this;

				const config = {
					type: Phaser.AUTO,
					parent: this.$refs.gameContainer,
					scale: {
						mode: Phaser.Scale.RESIZE,
						autoCenter: Phaser.Scale.CENTER_BOTH,
						width: window.innerWidth,
						height: window.innerHeight,
					},
					scene: {
						preload: function () {
							this.load.image('sky', skyImage);
							this.load.image('settings-icon', settingsIcon);
						},
						create: function () {
							vueComponent.currentScene = this;

							const sky = this.add.image(0, 0, 'sky').setOrigin(0.5, 0.5);
							sky.setScale(
								Math.max(
									window.innerWidth / sky.width,
									window.innerHeight / sky.height
								)
							);
							sky.setPosition(window.innerWidth / 2, window.innerHeight / 2);

							const settingsButton = this.add.image(
								window.innerWidth - 40,
								40,
								'settings-icon'
							).setOrigin(0.5, 0.5).setInteractive();
							settingsButton.setScale(0.5);
							settingsButton.on('pointerdown', () => {
								vueComponent.showSettings = !vueComponent.showSettings;
							});

							vueComponent.createTitle();

							this.scale.on('resize', (gameSize) => {
								const newWidth = gameSize.width;
								const newHeight = gameSize.height;

								const title = vueComponent.currentScene.children.getByName('title');
								if (title) {
									title.setPosition(newWidth / 2, newHeight / 2);
								}

								sky.setScale(
									Math.max(newWidth / sky.width, newHeight / sky.height)
								);
								sky.setPosition(newWidth / 2, newHeight / 2);

								settingsButton.setPosition(newWidth - 40, 40);

								const minFontSize = 32;
								const maxFontSize = 128;
								const baseWindowSize = 1280;
								const baseFontSize = 64;

								const currentSize = Math.min(newWidth, newHeight);
								let newFontSize = (currentSize / baseWindowSize) * baseFontSize;
								newFontSize = Math.max(minFontSize, Math.min(maxFontSize, newFontSize));
								if (title) {
									title.setFontSize(newFontSize);
								}
							});
						},
					},
				};
				this.game = new Phaser.Game(config);
			},
			createTitle() {
				if (!this.currentScene) return;

				const oldTitle = this.currentScene.children.getByName('title');
				if (oldTitle) {
					oldTitle.destroy();
				}

				const title = this.currentScene.add.text(
					window.innerWidth / 2,
					window.innerHeight / 2,
					this.translations[this.selectedLanguage].gameTitle,
					{
						fontSize: '64px',
						fill: '#000000',
						fontFamily: 'Rubik Dirt, sans-serif',
						align: 'center',
					}
				).setOrigin(0.5, 0.5).setName('title');
				title.setAlpha(0);

				setTimeout(() => {
					if (title) {
						title.setFontFamily('Rubik Dirt');
					}
				}, 100);

				this.currentScene.time.delayedCall(
					200,
					() => {
						this.currentScene.tweens.add({
							targets: title,
							alpha: { from: 0, to: 1 },
							duration: 2000,
							ease: 'Power2',
						});
					},
					[],
					this.currentScene
				);
			},
			changeLanguage(lang) {
				this.selectedLanguage = lang;
				localStorage.setItem('language', this.selectedLanguage);
				this.createTitle();
			},
		},
		beforeUnmount() {
			if (this.game) {
				this.game.destroy(true);
			}
		},
	};
</script>

<style>
	#game-container {
		margin: 0;
		padding: 0;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		position: relative;
	}

	.settings-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		transition: opacity 0.3s;
		opacity: 0;
	}

	.settings-overlay.show {
		opacity: 1;
	}

	.settings-panel {
		background: white;
		padding: 20px;
		border-radius: 10px;
		width: 300px;
	}

	.language-section {
		margin: 10px 0;
	}

	.language-section label {
		display: block;
		margin-bottom: 5px;
	}

	.language-buttons {
		display: flex;
		gap: 10px;
	}

	.language-buttons button {
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 5px 10px;
		background: #ddd;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	.language-buttons button.active {
		background: #bbb;
	}

	.language-buttons button:hover {
		background: #ccc;
	}

	.language-buttons button.disabled {
		background: #bbb;
		cursor: not-allowed;
	}

	.settings-panel button:not(.language-buttons button) {
		margin-top: 10px;
		padding: 5px 10px;
		background: #ddd;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	.settings-panel button:not(.language-buttons button):hover {
		background: #ccc;
	}
</style>