import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify'
import VueGapi from 'vue-gapi'
import moment from 'moment'

Vue.prototype.moment = moment
Vue.config.productionTip = false

Vue.use(VueGapi, {
  apiKey: 'AIzaSyBtALxqy0fusAShU5n7ecYoCQwcrNUxKwY',
  clientId: '642199378747-62svnibd4medlgj1ptd685ol8vf5l322.apps.googleusercontent.com',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  scope: 'https://www.googleapis.com/auth/calendar',
})

new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')


