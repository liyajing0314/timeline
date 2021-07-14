<template>
	<a-spin :spinning="spinning">
		<div class="container" ref="container">
			<header>
				<span class="title">{{title}}</span>
				<span>
					<a-button type="primary" @click="save()">保存</a-button>
					<a-button type="primary" style="margin-left: 10px;" @click="toImg">生成图片</a-button>
					<a-button type="primary" ghost @click="toList" style="margin-left: 10px;">退出</a-button>
				</span>
			</header>
			<div class="content" id="content" ref="content">
				<div class="time-legend">
					<a-checkbox-group v-model="selOrgan" @change="onChange">
						<a-checkbox style="display:block;font-size: 18px;" :style="{'color':colors[index]}" :value="item.id" 
						v-for="(item,index) in dataJson.organ" :key="item.id" >{{item.name}}
							<span v-if="operType === 'edit'" style="position: relative;">
							   <img src="@/assets/images/icon_minus.png" class="icon-date-minus" @click="minusLegend(index)"/>
							   <img src="@/assets/images/icon_edit.png" class="icon-date-edit" @click="editLegend(index)"/>
							</span>
						</a-checkbox>
					</a-checkbox-group>
					<ul>
						<li class="legend-list" v-if="operType === 'edit' ">
							<span @click="addLegend">
								<img src="@/assets/images/icon_add.png" class="icon-add-legend" />
								<span>添加部门</span>
							</span>
						</li>
					</ul>
				</div>
				
				<div class="time-box" v-if="JSON.stringify(timeline) != '{}'">
					<ul style="display: flex;min-height: 400px;">
						<li v-for="(item,index) in timeline" :key="index" class="box-list" :class="{'box-list-down':index%2 != 0}">
							<div class="item">
								<span class="date">{{item.date.substring(item.date.indexOf('.')+1,item.date.length)}}</span>
								<span v-if="operType === 'edit'" class="date-edit">
									<img src="@/assets/images/icon_minus.png" class="icon-date-minus" @click="minusDate(index)"/>
									<img src="@/assets/images/icon_edit.png" class="icon-date-edit" @click="editDate(index)"/>
								</span>
							</div>
							<ul class="item-content" :class="{'item-content-down':index%2 != 0}">
								<li v-if="index%2 != 0 &&operType === 'edit'" style="text-align: center;">
									<img src="@/assets/images/icon_add.png" class="icon-item-add" @click="addContent(index)" />
								</li>
								<!-- :style="{borderColor:timeContent.color,color:timeContent.color}" -->
								<li v-for="(timeContent,key) in item.timeContent" :key="key" class="time-box-list" 
								:style="{borderColor:showColor(timeContent.organ),color:showColor(timeContent.organ)}" v-if="selOrgan.includes(timeContent.organ)">
									<div>{{timeContent.content}}</div>
									<span v-if="operType === 'edit'">
										<img src="@/assets/images/icon_minus.png" class="icon-item-minus" @click="minusContent(index,key)"/>
										<img src="@/assets/images/icon_edit.png" class="icon-item-edit" @click="editContent(index,key)"/>
									</span>
								</li>
								<li v-if="index%2 == 0 && operType === 'edit'" style="text-align: center;">
									<img src="@/assets/images/icon_add.png" class="icon-item-add" @click="addContent(index)" />
								</li>
							</ul>
						</li>
					</ul>
					<div class="box-line">
						<img src="@/assets/images/icon_add.png" class="icon-add" @click="addDate" v-if="operType === 'edit'"/>
					</div>
					
					<!-- <div class="time-arrow">
						<img src="@/assets/images/icon_add.png" class="icon-add" @click="addDate" v-if="operType === 'edit'"/>
					</div>-->
				</div>
			</div>
			<modal ref="modal" @changeData="changeData" :organOption="dataJson.organ" :lastDate="lastDate"></modal>
		</div>
	</a-spin>
</template>

<script>
	import {dataURLtoFile} from '@/utils/util'
	import html2canvas from 'html2canvas'
	import {sequenceAdd,sequenceQueryById,sequenceEdit,uploadFile} from '@/api/api'
	import Modal from '@/components/modal'
	export default {
		components:{Modal},
		data() {
			return {
				spinning:false,
				operType: 'edit',
				dataJson: {
					type: 'timeline',
					organ:[],
					timeline: []
				},
				organ: [],
				selOrgan:[],
				color:'',
				selIndex:0,
				selContentKey:0,
				timeline:{},
				// colors: ['#a72020', '#41a720', '#1532bd', '#530ca0', '#cebc41', '#a74618','#6A6AFF','#80FFFF','#FF5151','#921AFF','#EA7500','#4F9D9D','#984B4B','#949449','#CA8EC2','#D94600','#9AFF02','#000079','#003E3E','#600030'],
				colors:['#E8692F','#43A047','#1E88E5','#C0CA33','#00897B','#E83A30','#E72F8C','#5E35B1','#3949AB','#039BE5','#F4511E','#00ACC1','#7CB342','#FDD835','#6D4C41','#FFB300','#FB8C00','#757575','#546E7A','#DD2C00'],
				id:"",
				title:''
			}
		},
		mounted() {
			let id = this.$route.query.id
			if(id){
				this.id = id
				this.getData()
			}else{
				this.init()
			}
		},
		computed:{
			lastDate(){
				let timeline = this.timeline
				return timeline.length >0 ? timeline[timeline.length - 1].date : ''
			}
		},
		methods: {
			showColor(organ){
				let index = this.dataJson.organ.findIndex(item=>{
					return item.id === organ
				})
				return this.colors[index]
			},
			getData(){
				this.spinning = true
				let id = this.id
				sequenceQueryById({id:id}).then(res=>{
					if(res.code === 200){
						let data = res.result.content
						this.dataJson = JSON.parse(data)
						this.title = res.result.title
						this.init()
					}
					this.spinning = false
				})
			},
			init(){
				let timeline = this.dataJson.timeline
				this.timeline = timeline
				let organ = this.dataJson.organ
				this.selOrgan = organ.map(item=>{
					if(item.isCheck){
						return item.id
					}
				})
			},
			onChange(){
				
				let timeline = this.timeline
				let organ = this.dataJson.organ
				organ.map(item=>{
					if(this.selOrgan.includes(item.id)){
						item.isCheck = true
					}
				})
			},
			addLegend() { //添加图例
				this.$refs.modal.modalTitle = '添加图例'
				this.$refs.modal.show(1,'add')
			},
			minusLegend(index){ //删除图例
				let organ = this.dataJson.organ[index].id
				this.dataJson.organ.splice(index,1)
				//TODO图例对应的内容一起删除
				let timeline = this.timeline
				
				for(let i=0;i<=timeline.length-1 ;i++){
					let timeContent = timeline[i].timeContent
					for(let j=0;j<=timeContent.length-1;j++){
						let or = timeContent[j].organ
						if(or === organ){
							console.info('j',j,'===>',or)
							timeContent.splice(j,1)
							j--;
						}
					}
				}
			},
			editLegend(index){
				this.selIndex = index
				let organ = this.dataJson.organ[index]
				this.$refs.modal.modalTitle = '编辑图例'
				this.$refs.modal.show(1,'edit',organ)
			},
			addDate() { //添加时间
				this.$refs.modal.modalTitle = '添加时间'
				this.$refs.modal.show(2,'add')
			},
			minusDate(index){ //删除时间点
				this.timeline.splice(index,1)
			},
			editDate(index){ //修改时间点
				this.selIndex = index
				let timeline = this.timeline[index]
				let date = timeline.date
				let lastDate = index >0 ? this.timeline[index-1].date : ''
				let data = {
					name:date,
					lastDate:lastDate
				}
				this.$refs.modal.modalTitle = '编辑内容'
				this.$refs.modal.show(2,'edit',data)
			},
			addContent(index) { //添加内容
				console.info('add')
				this.selIndex = index
				this.$refs.modal.modalTitle = '添加内容'
				this.$refs.modal.show(3,'add')
			},
			minusContent(index,key){ //删减内容
				this.selIndex = index
				let timeContent = this.timeline[index].timeContent
				timeContent.splice(key,1)
			},
			editContent(index,key){ //编辑内容
				this.selIndex = index
				this.selContentKey = key
				let timeline = this.timeline[index]
				let timeContent = timeline.timeContent[key]
				let data = {
					organ :timeContent.organ,
					name:timeContent.content
				}
				this.$refs.modal.modalTitle = '编辑内容'
				this.$refs.modal.show(3,'edit',data)
			},
			changeData(data,type,operType){
				let name = data.name
				if(type === 1){ //添加图例
					if(operType === 'add'){
						let data = {
							id:new Date().getTime(),
							name:name,
							isCheck:true
						}
						this.selOrgan.push(data.id)
						this.dataJson.organ.push(data)
					}else{
						let id = data.id
						let organList = this.dataJson.organ
						let organ = organList.find(item=>{
							return id === item.id
						})
						organ.name = name
					}
				}else if(type === 2){ //添加时间点
					if(operType === 'add'){
						let tIndex = this.timeline.findIndex(item=>{
							return item.date === name
						})
						if(tIndex > -1){
							this.$message.error('已有此时间点')
							return
						}
						let data = {
							date:name,
							timeContent:[]
						}
						this.timeline.push(data)
						this.timeline.sort((a, b) => {
							let aa = new Date(a.date).getTime()
							let bb = new Date(b.date).getTime()
							return aa - bb
						});
						
					}else{
						let timeline = this.timeline[this.selIndex]
						timeline.date = name
					}
					
				}else if(type === 3){ //添加内容
					let organ = data.organ
					let index = this.selIndex
					let timeline = this.timeline[index]
					if(operType === 'add'){
						let organList = this.dataJson.organ
						let or = organList.find(item=>{
							return item.id === organ
						})
						let data = {
							organ:organ,
							content:name,
							color:or.color
						}
						timeline.timeContent.push(data)
					}else{
						let timeline = this.timeline[this.selIndex]
						let timeContent = timeline.timeContent
						let organ = data.organ
						let content = timeContent.find((item)=>{
							return item.organ == organ
						})
						content.content = name
					}
				}else if(type === 4){
					this.title = name
					this.save()
				}
			},
			addTitle(){
				this.$refs.modal.modalTitle = '编辑名称'				this.$refs.modal.show(4,'add')
			},
			toImg(){ //生成图片
				this.operType = 'preview'
				let content = this.$refs.content
				let scrollHeight = content.scrollHeight
				let scrollWidth = content.scrollWidth
				this.$nextTick(()=>{
					// document.body.scrollHeight
					html2canvas(content,{
						scale: window.devicePixelRatio*2,
						useCORS: true ,
						width:scrollWidth,
						height:scrollHeight,
						windowWidth:scrollWidth,
						windowHeight:scrollHeight,
						x:0,
						y:window.pageYOffset
					}).then((canvas) => {
						this.operType = 'edit'
						let dataURL = canvas.toDataURL("image/jpg");
						let link = document.createElement("a");    
						link.href = dataURL;
						let filename = `${new Date().getTime()}.jpg`;  //文件名称
						link.setAttribute("download", filename);
						link.style.display = "none"; //a标签隐藏
						document.body.appendChild(link);
						link.click();
					})
				})
			},
			save(){
				if(this.id === '' && this.title === ''){
					this.addTitle()
					return
				}
				let param = {
					title:this.title,
					content:JSON.stringify(this.dataJson),
					coverUrl:''
				}
				this.operType = 'preview'
				this.$nextTick(()=>{
					html2canvas(this.$refs.content,{
						scale: window.devicePixelRatio*2,
						useCORS: true ,
						width:content.scrollWidth,
						height:content.scrollHeight,
						windowWidth:content.scrollWidth,
						windowHeight:content.scrollHeight,
						x:0,
						y:window.pageYOffset
					}).then((canvas) => {
						let dataURL = canvas.toDataURL("image/png");
						this.operType = 'edit'
						let filename = `${new Date().getTime()}.png`;
						let file_url = dataURLtoFile(dataURL, filename,"image/png"); //将文件转换成file的格式，就可以使用file_url传递给服务端了
						
						let formData = new FormData()
						formData.append('file',file_url)
						uploadFile(formData).then(res=>{
							if(res.code === 200){
								let file = res.result.file
								param.coverUrl = file
							}
							
							if(this.id){
								param.id = this.id
								sequenceEdit(param).then(res=>{
									if(res.code === 200){
										
									}else{
										this.$message.error(res.message || '保存失败')
									}
								})
							}else{
								sequenceAdd(param).then(res=>{
									if(res.code === 200){
										let id = res.result
										this.id = id
										this.$router.push('/edit?id='+id)
									}else{
										this.$message.error(res.message || '保存失败')
									}
								})
							}
						})
					});
				})
				
			},
			toList(){
				this.$router.push('/list')
			}
		}
	}
</script>

<style scoped>
	.container {
		min-height: 100vh;
		position: relative;
	}
	header {
		height:60px;
		line-height: 60px;
		padding: 0 50px;
		background-color: #00193A;
		text-align: right;
		display: flex;
		justify-content: space-between;
	}
	header>.title {
		color:#FFFFFF;
		font-size: 24px;
	}
	.content {
		height: calc(100vh - 60px);
		position: relative;
		width: 100%;
		overflow: auto;
		display: flex;
		padding: 20px;
	}
	.time-legend {
		left:30px;
		top: 50px;
		min-width: 200px;
		min-height: 100px;
		border-radius: 4px;
		padding: 10px 30px 10px 10px;
	}

	.time-legend .legend-list {
		cursor: pointer;
		margin-bottom: 6px;
		font-size: 16px;
	}

	.time-legend .legend-radio {
		margin-right: 6px;
	}

	.time-legend .icon-add-legend {
		width: 16px;
		vertical-align: middle;
		margin-right: 12px;
		margin-top: -4px;
	}

	.time-box {
		width:auto;
		height:auto;
		position: relative;
		padding-right: 150px;
	}
	.box-list {
		width: 180px;
		min-width:180px;
	}
	.box-list .item{
		position: relative;
		top: 100%;
		width: 100%;
		text-align: center;
	}
	.box-list .item:before {
		position: absolute;
		top:6px;
		left: 50%;
		width: 20px;
		height: 20px;
		overflow: hidden;
		margin-left: -10px;
		-webkit-border-radius: 100%;
		-moz-border-radius: 100%;
		border-radius: 100%;
		background-color: #333;
		content: '';
	}
	.box-list .item .date {
		top: 28px;
		display: inline-block;
		font-size: 18px;
		font-weight: 600;
		position: relative;
	}
	.box-list .item .date-edit {
		position: relative;
		top: 28px;
	}
	
	.box-list-down>ul{
		position: relative;
		top:100%;
	}
	.box-list-down .item .date,
	.box-list-down .item .date-edit {
		top: -20px;
	}
	
	.item-content {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		position: relative;
		bottom: 28px;
	}
	.item-content-down {
		justify-content: flex-start;
	}
	.item-content .icon-item-add {
		width: 22px;
		cursor: pointer;
		margin-top: 10px;
	}
	
	.time-box-list {
		margin-top: 10px;
		border: 2px solid #333;
		padding: 10px;
		border-radius: 4px;
		position: relative;
		text-align: center;
	}
	
	.box-line {
		border-top:4px solid #333333;
		position: relative;
		width: 100%;
		min-width: 1000px;
	}
	.box-line:before {
		content:'';
		position: absolute;
		right:-25px;
		top: -25px;
		width: 0;
		height: 0;
		border-top:25px solid transparent;
		border-left: 25px solid #333333;
		border-bottom:25px solid transparent;
	}
	
	.box-line .icon-add {
		width: 30px;
		position: absolute;
		right:-64px;
		top:-15px;
		cursor: pointer;
	}
	

	.icon-item-minus,
	.icon-item-edit {
		width: 22px;
		cursor: pointer;
		position: absolute;
		right: -30px;
		top:50%;
		transform: translateY(-50%);
		z-index: 2;
	}
	
	.icon-item-edit {
		right: -56px;
	}
	.icon-date-minus,
	.icon-date-edit{
		width:14px;
		position: absolute;
		top:50%;
		margin-left:6px;
		transform: translateY(-50%);
		cursor: pointer;
	}
	.icon-date-edit {
		margin-left:26px;
	}

	/deep/.ant-checkbox-wrapper + .ant-checkbox-wrapper {
		margin-left: 0;
	}
</style>
