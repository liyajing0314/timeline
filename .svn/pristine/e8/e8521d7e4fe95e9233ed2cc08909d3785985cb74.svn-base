//base64图片转为文件格式
export function dataURLtoFile(base64, filename,contentType) {
	let arr = base64.split(',')  //去掉base64格式图片的头部
	let bstr = atob(arr[1])   //atob()方法将数据解码
	let leng = bstr.length
	let u8arr = new Uint8Array(leng)
	while(leng--){
		u8arr[leng] =  bstr.charCodeAt(leng) //返回指定位置的字符的 Unicode 编码
	}
	return new File([u8arr],filename,{type:contentType}) 
}
