<template>
	<div id="app">
		<router-view v-if="isRouterAlive" />
	</div>
</template>

<script>
	export default {
		name: 'app',
		data() {
			return {
				isRouterAlive: true
			}
		},
		provide () {
			return {
				reload: this.reload                                              
			}
		},
		methods: {
			reload () {
				this.isRouterAlive = false;          
				this.$nextTick(function () {
					this.isRouterAlive = true;  
				}) 
			}
		}
	}
</script>

<style>
	body,html {
		overflow: auto;
	}
	body,html ,*{
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}
	ul {
		list-style: none;
	}
</style>
