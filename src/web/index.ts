import axios from 'axios';
import Vue from 'vue';
import Vuetify from 'vuetify';
import VueAxios from 'vue-axios';
import App from './App.vue';
import Store from './store';

Vue.use(Vuetify);
Vue.use(VueAxios, axios);

new Vue({
  store: Store,
  vuetify: new Vuetify({}),
  render: (h) => h(App),
}).$mount('#container');
