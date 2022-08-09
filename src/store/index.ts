import { createStore } from 'vuex';
import { accountStore } from './modules/account-store';
 
const store = createStore({
    modules:{
        accountStore
    }
});
 
export default store;