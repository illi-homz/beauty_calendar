import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VueTextAreaAutoSize from 'vue-textarea-autosize';
import firebase from 'firebase/app';
import 'firebase/firestore';

Vue.config.productionTip = false;

firebase.initializeApp({
  apiKey: "AIzaSyDAAjbu-6Q9Ns8-pZQce0lJ8jzokWBrslo",
    authDomain: "beauty-calendar-d37e2.firebaseapp.com",
    databaseURL: "https://beauty-calendar-d37e2.firebaseio.com",
    projectId: "beauty-calendar-d37e2",
    storageBucket: "beauty-calendar-d37e2.appspot.com",
    messagingSenderId: "409302803932",
    appId: "1:409302803932:web:b626fe1ba273cbddccdb19"
});

export const db = firebase.firestore();

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
