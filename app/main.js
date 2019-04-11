import Vue from 'nativescript-vue'
import App from './components/App'
import VueDevtools from 'nativescript-vue-devtools'

if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools, { host: 'localhost' })
}
// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

Vue.registerElement('NumericKeyboardView', ()=> require('nativescript-numeric-keyboard').NumericKeyboardView)

new Vue({
  render: h => h('frame', [h(App)])
}).$start()
