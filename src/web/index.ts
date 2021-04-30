import axios from 'axios';
import Vue from 'vue';
import VueAxios from 'vue-axios';
import Vuex from 'vuex';
import App from './App.vue';
import Store from './store';

Vue.use(VueAxios, axios);

new Vue({
  store: Store,
  render: (h) => h(App),
}).$mount('#container');
