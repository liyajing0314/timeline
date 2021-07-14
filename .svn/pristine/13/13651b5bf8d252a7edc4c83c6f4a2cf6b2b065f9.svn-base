import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

import { Modal ,FormModel,Input,Button,Radio,Checkbox ,message,Spin,Select,DatePicker } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

Vue.use(Modal);
Vue.use(FormModel);
Vue.use(Input);
Vue.use(Button);
Vue.use(Radio);
Vue.use(Checkbox);
Vue.use(Spin);
Vue.use(Select);
Vue.use(DatePicker);

Vue.prototype.$message = message;
Vue.prototype.$confirm = Modal.confirm;

new Vue({
	router,
	render: h => h(App),
}).$mount('#app')
