import { createApp } from 'vue';
import App from './App.vue';
import FlagIcon from 'vue-flag-icon'; // Импорт плагина

const app = createApp(App);
app.use(FlagIcon); // Регистрация плагина
app.mount('#app');