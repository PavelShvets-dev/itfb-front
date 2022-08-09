import { createApp, reactive } from 'vue';
import App from './App.vue';
import router from './router';
import AccountService from './services/account.service';
import store from './store/index';

const accountService = new AccountService();

createApp(App)
    .use(router)
    .use(store)
    .provide(
        'accountService', reactive(accountService),
    )
    .mount('#app')
