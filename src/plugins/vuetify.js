import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";
import { zhHans } from "vuetify/locale";

export const vuetify = createVuetify({
  components,
  directives,
  locale: {
    locale: 'zhHans',
    fallback: 'en',
    messages: { zhHans }
  },
  theme: {
     defaultTheme: "light",
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: { mdi },
  },
});
