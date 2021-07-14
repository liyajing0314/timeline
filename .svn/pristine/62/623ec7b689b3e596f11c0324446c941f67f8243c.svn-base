import Vue from 'vue'
import Router from 'vue-router'


try {
	const originalPush = Router.prototype.push
	Router.prototype.push = function push(location) {
		return originalPush.call(this, location).catch(err => err)
	}
} catch (e) {
	console.log(e)
}
Vue.use(Router)

//基础路由
const constantRouterMap = [
	{
		path: '/',
		name: 'index',
		component: () => import('@/views/index.vue'),
		redirect: '/list',
		children: [
			{
				path: '/list',
				name: 'List',
				meta: {
					title: '首页',
				},
				component: () => import('@/views/list.vue'),
			},
			{
				path: '/edit',
				name: 'Edit',
				meta: {
					title: '编辑',
				},
				component: () => import('@/views/edit.vue'),
			},
		]
	}
]

export default new Router({
	mode: 'history',
	scrollBehavior(to,form,savedPosition){
		if(savedPosition){
			return savedPosition
		}else{
			return {
				x:0,
				y:0 
			}
		}
	},
	routes: constantRouterMap
})


