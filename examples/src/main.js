import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify/lib/framework';
import VueI18n from "vue-i18n";

Vue.config.productionTip = false
Vue.use(Vuetify);
Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: "ES",
  fallbackLocale: "ES",
});

new Vue({
  vuetify: new Vuetify({
    lang: {
      t: (key, ...params) => i18n.t(key, params),
    },
  }),
  render: function (h) { return h(App) }
}).$mount('#app')