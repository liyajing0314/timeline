<template>
	<a-spin :spinning="spinning">
		<div class="container">
			<header>

			</header>
			<div class="content">
				<div class="box add-box" @click="toEdit()">
					<img src="@/assets/images/add.png" class="icon-add">
				</div>
				<div class="box" v-for="(item,index) in list" :key="item.id" @click="toEdit(item.id)">
					<img :src="item.coverUrl" class="cover">
					<div class="box-name">
						{{item.title}}
						<img src="@/assets/images/edit.png" class="icon-edit" @click.stop="editName(item)"/>
					</div>
					<img src="@/assets/images/icon_delete.png" class="icon-delete" @click.stop="toDelete(item.id)" />
				</div>
			</div>
			<modal ref="modal" @changeData="changeData"></modal>
		</div>
	</a-spin>
</template>

<script>
	import Modal from '@/components/modal'
	import {sequenceList,sequenceDelete,sequenceEdit} from '@/api/api'
	export default {
		components:{Modal},
		data() {
			return {
				spinning:false,
				list: [],
				timeline:{}
			}
		},
		mounted() {
			this.getList()
		},
		methods: {
			getList() {
				this.spinning = true
				sequenceList().then(res => {
					if (res.code === 200) {
						this.list = res.result.records
					} else {
						this.list = []
					}
					this.spinning = false
				})
			},
			toEdit(id) {
				if (id) {
					this.$router.push('/edit?id=' + id)
				} else {
					this.$router.push('/edit')
				}
			},
			toDelete(id) {
				let _this = this
				this.$confirm({
					title: '确认要删除吗?',
					cancelText:'取消',
					okText:'确定',
					centered:true,
					onOk() {
						sequenceDelete({
							id: id
						}).then(res => {
							if(res.code === 200){
								_this.$message.info('操作成功');
								_this.getList()
							}else{
								_this.$message.error(res.message|| '删除失败');
							}
						})
					},
				});
			},
			editName(item){
				this.timeline = item
				let name = item.title
				this.$refs.modal.modalTitle = '编辑名称'
				this.$refs.modal.show(4,'edit',{name:name})
			},
			changeData(data){
				this.timeline.title = data.name
				sequenceEdit(this.timeline).then(res=>{
					if(res.code === 200){
						this.getList()
					}else{
						this.$message.error(res.message || '操作失败')
					}
				})
			}
		}
	}
</script>

<style scoped>
	.container {
		min-height: 100vh;
		background-color: #fdfdfd;
	}

	header {
		height: 60px;
		background-color: #00193A;
	}

	.content {
		padding: 20px;
	}

	.box {
		border: 1px solid #999;
		border-radius: 2px;
		margin: 0 10px 10px;
		display: inline-block;
		width: 140px;
		height: 140px;
		cursor: pointer;
		vertical-align: middle;
		position: relative;
	}

	.box:hover {
		background-color: rgba(0, 0, 0, 0.8);
	}
	.box .cover {
		width:100%;
		height:100%;
	}
	.box:hover .cover {
		opacity: 0.3;
	}

	.add-box {
		display: inline-flex;
		align-items: center;
		text-align: center;
		justify-content: center;
	}

	.icon-add {
		width: 90px;
	}

	.box-name {
		position: absolute;
		bottom: 0;
		height: 30px;
		line-height: 30px;
		width: 100%;
		text-align: center;
		background-color: rgba(0, 0, 0, 0.4);
		color: #ffffff;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		padding: 0 14px;
	}

	.icon-delete {
		width: 28px;
		position: absolute;
		z-index: 2;
		right: 10px;
		margin: 0 auto;
		top:20px;
		transform: translateY(-50%);
	}
	.icon-edit {
		width:12px;
		position: absolute;
		right: 6px;
		top:50%;
		transform: translateY(-50%);
	}
</style>
