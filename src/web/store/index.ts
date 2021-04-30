import Vue from 'vue';
import Vuex, { createLogger, StoreOptions } from 'vuex';
import RootState from './state';
import ProfileModule from './modules/profile';

Vue.use(Vuex);

const options: StoreOptions<RootState> = {
  state: {},
  getters: {},
  actions: {},
  mutations: {},
  modules: {
    ProfileModule,
  },
  plugins: [
    createLogger(),
  ],
  strict: true,
  devtools: true,
};

const Store = new Vuex.Store<RootState>(options);
export default Store;
