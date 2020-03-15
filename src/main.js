import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import './registerServiceWorker'
import vuetify from './plugins/vuetify';
import {initialize} from './helpers/general';
import axios from 'axios'
import VueNativeNotification from 'vue-native-notification'
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/map'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'

Vue.component('chart', ECharts)
window.echarts = require('vue-echarts')
Vue.use(VueNativeNotification, {
  // Automatic permission request before
  // showing notification (default: true)
  requestOnNotify: true
})
Vue.config.productionTip = false

const API_ORIGIN_ENDPOINT = 'appcon2020-env.gwphp3mwkp.ap-southeast-1.elasticbeanstalk.com'
//const API_ORIGIN_ENDPOINT = 'blood-bank-backend.test'

axios.defaults.baseURL = `http://${API_ORIGIN_ENDPOINT}/`

initialize(store, router, axios);

import Echo from 'laravel-echo'

window.Pusher = require('pusher-js');

window.Echo = new Echo({
  authEndpoint: `http://${API_ORIGIN_ENDPOINT}/broadcasting/auth`,
  broadcaster: 'pusher',
  key: 'bloodbankpusheridkey',
  cluster: 'mt1',
  //encrypted: false,
  wsHost: API_ORIGIN_ENDPOINT,
  wsPort: 6001,
  disableStats: true,
  //enabledTransports: ['ws']
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
