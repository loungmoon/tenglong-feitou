import { createApp } from 'vue'
import '@/assets/styles/tailwind.css'
import App from './App.vue'
import { vuetify } from './plugins/vuetify'
import { createPinia } from 'pinia'
import router from './router'
import FieldsetBox from '@/components/common/FieldsetBox.vue'

const app = createApp(App)

app.use(vuetify)
app.use(createPinia())
app.use(router)
app.component('FieldSetBox', FieldsetBox)
app.mount('#app')
