import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify/lib/framework';
import VueI18n from "vue-i18n";

Vue.config.productionTip = false
Vue.use(Vuetify);
Vue.use(VueI18n);

const messages = {
  ES: {},
  EN: {}
};

const localeEn = require.context("./locale/en", true, /\.json$/);

const localeEs = require.context("./locale/es", true, /\.json$/);

localeEs.keys().forEach((filename) => {
  Object.keys(localeEs(filename)).forEach((key) => {
    messages.ES[key] = localeEs(filename)[key];
  });
});

localeEn.keys().forEach((filename) => {
  Object.keys(localeEn(filename)).forEach((key) => {
    messages.EN[key] = localeEn(filename)[key];
  });
});

const i18n = new VueI18n({
  locale: "ES",
  fallbackLocale: "ES",
  silentTranslationWarn: true,
  messages
});

const vuetify = new Vuetify({
  lang: {
    t: (key, ...params) => i18n.t(key, params),
  },
  icons: {
    iconfont: "mdi",
  },
});

new Vue({
  vuetify: vuetify,
  i18n: i18n,
  render: function (h) { return h(App) }
}).$mount('#app')