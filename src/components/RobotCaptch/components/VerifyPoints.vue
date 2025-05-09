<script setup lang="ts">
import api from '@/api'
import { resetSize } from '@/components/RobotCaptch/core/reset'
import { aesEncrypt } from '@/components/RobotCaptch/core/ase'
const props =defineProps({
	//弹出式pop，固定fixed
	mode: {
		type: String,
		default: 'fixed'
	},
	captchaType: {
		type: String,
	},
	//间隔
	vSpace: {
		type: Number,
		default: 5
	},
	imgSize: {
		type: Object,
		default() {
			return {
				width: '310px',
				height: '155px'
			}
		}
	},
	barSize: {
		type: Object,
		default() {
			return {
				width: '310px',
				height: '40px'
			}
		}
	}
})
const {mode, captchaType, vSpace, imgSize, barSize} = toRefs(props)
const {proxy} = getCurrentInstance();
let secretKey = ref(''),           //后端返回的ase加密秘钥
	checkNum = ref(4),             //默认需要点击的字数
	fontPos = reactive([]),            //选中的坐标信息
	checkPosArr = reactive([]),        //用户点击的坐标
	num = ref(1),                 //点击的记数
	pointBackImgBase = ref(''),    //后端获取到的背景图片
	poinTextList = reactive([]),        //后端返回的点击字体顺序
	backToken = ref(''),           //后端返回的token值
	setSize = reactive({
		imgHeight: 0,
		imgWidth: 0,
		barHeight: 0,
		barWidth: 0
	}),
	tempPoints = reactive([]),
	text = ref(''),
	barAreaColor = ref(undefined),
	barAreaBorderColor = ref(undefined),
	showRefresh = ref(true),
	bindingClick = ref(true)


const init = () => {
	//加载页面
	fontPos.splice(0, fontPos.length)
	checkPosArr.splice(0, checkPosArr.length)
	num.value = 1
	getPictrue();
	nextTick(() => {
		let {imgHeight, imgWidth, barHeight, barWidth} = resetSize(proxy)
		setSize.imgHeight = imgHeight
		setSize.imgWidth = imgWidth
		setSize.barHeight = barHeight
		setSize.barWidth = barWidth
		proxy.$parent.$emit('ready', proxy)
	})
}
onMounted(() => {
	// 禁止拖拽
	init()
	proxy.$el.onselectstart = function () {
		return false
	}
})
const canvas = ref(null)
const canvasClick = (e) => {
	checkPosArr.push(getMousePos(canvas, e));
	if (num.value == checkNum.value) {
		num.value = createPoint(getMousePos(canvas, e));
		//按比例转换坐标值
		let arr = pointTransfrom(checkPosArr, setSize)
		checkPosArr.length = 0
		checkPosArr.push(...arr);
		//等创建坐标执行完
		setTimeout(() => {
			const captchaVerification = secretKey.value ? aesEncrypt(backToken.value + '---' + JSON.stringify(checkPosArr), secretKey.value) : backToken.value + '---' + JSON.stringify(checkPosArr)
			const params = {
				"pointJson": secretKey.value ? aesEncrypt(JSON.stringify(checkPosArr), secretKey.value) : JSON.stringify(checkPosArr),
				"captchaToken": backToken.value
			}
			api.checkRobotVerify(params).then((res) => {
				barAreaColor.value = '#4cae4c'
				barAreaBorderColor.value = '#5cb85c'
				text.value = '验证成功'
				bindingClick.value = false
				if (mode.value == 'pop') {
					setTimeout(() => {
						proxy.$parent.clickShow = false;
					}, 1500)
				}
				proxy.$parent.$emit('success', {captchaVerification, secretKey: secretKey.value})
			}).catch((error) => {
				proxy.$parent.$emit('error', proxy)
				barAreaColor.value = '#d9534f'
				barAreaBorderColor.value = '#d9534f'
				text.value = '验证失败'
				setTimeout(() => {
					refresh();
				}, 700);
			})

		}, 400);
	}
	if (num.value < checkNum.value) {
		num.value = createPoint(getMousePos(canvas, e));
	}
}
//获取坐标
const getMousePos = function (obj, e) {
	var x = e.offsetX
	var y = e.offsetY
	return {x, y}
}
//创建坐标点
const createPoint = function (pos) {
	tempPoints.push(Object.assign({}, pos))
	return num.value + 1;
}
const refresh = function () {
	tempPoints.splice(0, tempPoints.length)
	barAreaColor.value = '#000'
	barAreaBorderColor.value = '#ddd'
	bindingClick.value = true
	fontPos.splice(0, fontPos.length)
	checkPosArr.splice(0, checkPosArr.length)
	num.value = 1
	getPictrue();
	text.value = '验证失败'
	showRefresh.value = true
}

// 请求背景图片和验证图片
function getPictrue() {
	api.getRobotVerify({}).then((result) => {
		pointBackImgBase.value = result.data.originalImageBase64
		backToken.value = result.data.token
		secretKey.value = result.data.secretKey
		poinTextList.value = result.data.wordList
		text.value = '请依次点击【' + poinTextList.value.join(",") + '】'
	}).catch((error) => {
		if (error && error.message) {
			console.log(error.message)
		}
	})
}

//坐标转换函数
const pointTransfrom = function (pointArr, imgSize) {
	var newPointArr = pointArr.map(p => {
		let x = Math.round(310 * p.x / parseInt(imgSize.imgWidth))
		let y = Math.round(155 * p.y / parseInt(imgSize.imgHeight))
		return {x, y}
	})
	return newPointArr
}
</script>

<template>
	<div class="relative">
		<div class="verify-img-out">
			<div class="verify-img-panel m-0 box-content rd-3 relative"
				 :style="{
					 'width': setSize.imgWidth,
					 'height': setSize.imgHeight,
					 'background-size' : setSize.imgWidth + ' '+ setSize.imgHeight,
					 'margin-bottom': vSpace + 'px',
					 'border-top':pointBackImgBase?'1px solid #ddd':'',
					 'border-bottom':pointBackImgBase?'1px solid #ddd':''
				 }"
			>
				<div class="verify-refresh w-25 h-25 text-center p-5 cursor-pointer absolute top-0 right-0 z-2" style="z-index:3" @click="refresh" v-show="showRefresh">
					<i class="i-mynaui:refresh-solid"></i>
				</div>
				<img v-if="pointBackImgBase" :src="'data:image/png;base64,'+pointBackImgBase"
					 ref="canvas"
					 alt=""
					 class="block w-full h-full"
					 @click="bindingClick?canvasClick($event):undefined">
				<div v-else  class="flex-center w-full h-full" >
					<i class="i-line-md:loading-twotone-loop h-40 w-40"  ></i>
				</div>
				<div v-for="(tempPoint, index) in tempPoints" :key="index" class="point-area"
					 :style="{
                        'background-color':'#1abd6c',
                        color:'#fff',
                        'z-index':9999,
                        width:'20px',
                        height:'20px',
                        'text-align':'center',
                        'line-height':'20px',
                        'border-radius': '50%',
                        position:'absolute',
                        top:parseInt(tempPoint.y-10) + 'px',
                        left:parseInt(tempPoint.x-10) + 'px'
                     }">
					{{ index + 1 }}
				</div>
			</div>
		</div>
		<!-- 'height': this.barSize.height, -->
		<div class="verify-bar-area"
			 :style="{'width': setSize.imgWidth,
                      'color': barAreaColor,
                      'border-color': barAreaBorderColor,
                      'line-height':barSize.height}">
			<span class="verify-msg">{{ text }}</span>
		</div>
	</div>
</template>

<style scoped lang="scss">
</style>
