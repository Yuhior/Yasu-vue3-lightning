<script setup lang="ts">
import VerifyPoints from './components/VerifyPoints.vue'
import VerifySlide from './components/VerifySlide.vue'
defineOptions({
	name: 'RobotCaptch'
})
const props = defineProps({
	captchaType: {
		type: String,
		required: true
	},
	figure: {
		type: Number
	},
	arith: {
		type: Number
	},
	mode: {
		type: String,
		default: 'pop'
	},
	vSpace: {
		type: Number
	},
	explain: {
		type: String
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
	blockSize: {
		type: Object
	},
	barSize: {
		type: Object
	}
})
const { captchaType, figure, arith, mode, vSpace, explain, imgSize, blockSize, barSize } = toRefs(props)
const clickShow = ref(false)
const verifyType = ref(undefined)
const componentType = shallowRef(undefined)
const instance = ref({})
const showBox = computed(() => {
	if (mode.value === 'pop') {
		return clickShow.value
	} else {
		return true
	}
})
const refresh = () => {
	if (instance.value.refresh) {
		instance.value.refresh()
	}
}
const closeBox = () => {
	clickShow.value = false
}
const show = () => {
	if (mode.value === 'pop') {
		clickShow.value = true
	}
}
watchEffect(() => {
	switch (captchaType.value) {
		case 'blockPuzzle':
			verifyType.value = '2'
			componentType.value = VerifySlide
			break
		case 'clickWord':
			verifyType.value = ''
			componentType.value = VerifyPoints
			break
		default:
			componentType.value = ''
			break
	}

})
defineExpose({
	show,
	closeBox,
})
</script>
<template>
	<div :class="mode == 'pop' ? 'mask' : ''" v-show="showBox">
		<div
			:class="mode == 'pop' ? 'verifybox' : ''"
			:style="{ 'max-width': parseInt(imgSize.width) + 30 + 'px' }"
		>
			<div class="verifybox-top" v-if="mode == 'pop'">
				请完成安全验证
				<div class="verifybox-close" @click="closeBox();refresh()">
					<i class="i-pajamas:close"></i>
				</div>
			</div>
			<div class="verifybox-bottom" :style="{ padding: mode == 'pop' ? '15px' : '0' }">
				<!-- 验证码容器 -->
				<component
					v-if="componentType"
					:is="componentType"
					:captchaType="captchaType"
					:type="verifyType"
					:figure="figure"
					:arith="arith"
					:mode="mode"
					:vSpace="vSpace"
					:explain="explain"
					:imgSize="imgSize"
					:blockSize="blockSize"
					:barSize="barSize"
					ref="instance"
				>
				</component>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.verifybox {
	position: relative;
	box-sizing: border-box;
	border-radius: 2px;
	border: 1px solid #e4e7eb;
	background-color: #fff;
	box-shadow: 0 0 10px rgba(0, 0, 0, .3);
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}
.verifybox-top {
	padding: 0 15px;
	height: 50px;
	line-height: 50px;
	text-align: left;
	font-size: 16px;
	color: #45494c;
	border-bottom: 1px solid #e4e7eb;
	box-sizing: border-box;
}

.verifybox-bottom {
	padding: 15px;
	box-sizing: border-box;
}
.verifybox-close {
	color: #333;
	display: flex;
	align-items: center;
	position: absolute;
	top: 13px;
	right: 9px;
	width: 24px;
	height: 24px;
	text-align: center;
	cursor: pointer;
}

.mask {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1001;
	width: 100%;
	height: 100vh;
	background: rgba(0, 0, 0, .3);
	/* display: none; */
	transition: all .5s;
}
</style>
