<template>
	<a-modal v-model="visible" :title="modalTitle" @ok="handleOk" @cancel="handleCancel" cancelText="取消" okText="确认" :centered="true">
		<a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
			
			<a-form-model-item label="选择部门" prop="selOrgan" v-if="type === 3">
				<a-select style="width: 100%;" v-model="form.selOrgan">
				    <a-select-option :value="item.id" v-for="item in organOption" :key="item.id">
				        {{item.name}}
				    </a-select-option>
				</a-select>
			</a-form-model-item>
			<a-form-model-item ref="name" :label="switchLabel(type)" prop="name"  >
				<a-input v-model="form.name" @blur="
					() => {
					  $refs.name.onFieldBlur();
					}
				  " v-if="type !== 3 && type !== 2" />
				<a-textarea
					v-model="form.name" @blur="
						() => {
						  $refs.name.onFieldBlur();
						}
					  " 
					:auto-size="{ minRows:5, maxRows: 8 }" v-if="type === 3"
				/>
				<a-date-picker v-model="form.name" placeholder="选择时间" @blur="
					() => {
					  $refs.name.onFieldBlur();
					}
				  " v-if="type === 2" />
			</a-form-model-item>
		</a-form-model>
	</a-modal>
</template>

<script>
	import moment from 'moment'
	export default {
		props:['organOption','lastDate'],
		data(){
			return {
				modalTitle:'添加',
				visible:false,
				form:{
					name:'',
					selOrgan:''
				},
				rules: {
					name: [
						{ required: true, message: '请填写', trigger: 'change' },
					],
					selOrgan: [
						{ required: true, message: '请选择部门', trigger: 'change' },
					],
				},
				labelCol: { span: 4 },
				wrapperCol: { span: 14 },
				type:1, //1 部门 2时间
				operType:'add',
				data:{}
			}
		},
		methods:{
			show(type,operType,data){
				this.form.name = ''
				this.type = type
				this.operType = operType
				this.visible = true
				this.$nextTick(()=>{
					this.resetForm()
					if(operType == 'edit' && data){
						this.form.name = data.name
						this.data = data
						if(data.organ){
							this.form.selOrgan = data.organ
						}
					}
				})
			},
			handleOk(){
				this.$refs.ruleForm.validate(valid => {
					if (valid) {
						let name = this.form.name
						let data = {
							name:name,
							organ:this.form.selOrgan
						}
						if(this.type === 1){
							data.id = this.data.id
						}else if (this.type === 2){
							data.name = moment(name).format('YYYY.MM.DD')
							// if(this.operType === 'edit'){
							// 	let lastDate = this.data.lastDate
							// 	if(data.name <= lastDate){
							// 		this.$message.error('选择日期不可比上一个日期早')
							// 		return
							// 	}
							// }else{
							// 	if(data.name <= this.lastDate){
							// 		this.$message.error('选择日期不可比上一个日期早')
							// 		return
							// 	}
							// }
						}
						this.$emit('changeData',data,this.type,this.operType)
						
						this.resetForm()
						this.visible = false
					} else {
					  return false;
					}
				});
			},
			handleCancel(){
				this.resetForm()
				this.visible = false
			},
			resetForm() {
			  this.$refs.ruleForm.resetFields();
			},
			switchLabel(type){
				let label = ''
				switch (type){
					case 1:
						label = '部门'
						break;
					case 2:
						label = '时间点'
						break;
					case 3:
						label = '内容'
						break;
					case 4:
						label = '名称'
						break;
					default:
						label = '名称'
						break;
				}
				return label
			},
		}
	}
</script>

<style>
</style>
