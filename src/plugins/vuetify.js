import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    themes: {
      light: {
        backgroundGradientDark: '#D32F2F',
        backgroundGradientLight: '#E57373',
        primary: '#E57373',
        // secondary: colors.red,
        // success: '#58c46c',
        // danger: '#ee4b5a',
        // warning: 'e88e3e',
        // accent: '#7290d5',
        // info: '#34cde9',
        // pink: '#e859aa',

        // primaryO: '#aa58c499',
        // successO: '#58c46c99',
        // dangerO: '#ee4b5a99',
        // warningO: 'e88e3e99',
        // accentO: '#7290d599',
        // infoO: '#34cde999',
        // pinkO: '#e859aa99'
      },
      dark: {
        primary: colors.red.lighten2,
      },
    },
  },
});
