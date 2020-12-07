import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import dateFilter from '@/filters/date.filter'
import currencyFilter from '@/filters/currency.filter'
import DelDialog from '@/components/del-dialog.vue'


Vue.filter('date', dateFilter)
Vue.filter('currency', currencyFilter)
Vue.component('DelDialog', DelDialog)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
