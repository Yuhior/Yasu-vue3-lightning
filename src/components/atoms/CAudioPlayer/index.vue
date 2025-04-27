<script setup lang="ts">
import { useSound } from '@vueuse/sound'
import _, { throttle } from 'lodash'

const props = defineProps({
	url: {
		type: String,
		default: ''
	}
})
let requestId: number | null = null
const { sound, isPlaying, play, pause, duration } = useSound(props.url)
const currentTime = ref(0)

function togglePlay() {
	if (!isPlaying.value) {
		play()
		startUpdatingTime()
	} else {
		pause()
		stopUpdatingTime()
	}
}

let lastUpdateTime = 0
const updateInterval = 100 // 每 100ms 更新一次

function startUpdatingTime() {
	const update = () => {
		if (sound.value && isPlaying.value) {
			const now = Date.now()
			// 如果距上次更新时间已经过了指定的间隔
			if (now - lastUpdateTime >= updateInterval) {
				currentTime.value = sound.value!.seek()
				lastUpdateTime = now // 记录上次更新时间
			}
			requestId = requestAnimationFrame(update)
		}
	}
	requestId = requestAnimationFrame(update)
}

function stopUpdatingTime() {
	if (requestId) {
		cancelAnimationFrame(requestId)
		requestId = null
	}
}



// 格式化时间为 mm:ss
const formatTime = (time: number = 0, unit: 'seconds' | 'milliseconds' = 'seconds') => {
	let roundedTime
	if (unit === 'seconds') {
		roundedTime = Math.round(time) // 转换为毫秒
	} else {
		roundedTime = Math.round(time / 1000)
	}

	const minutes = Math.floor(roundedTime / 60) // 计算分钟
	const seconds = roundedTime % 60 // 计算秒数

	// 使用 padStart 格式化分钟和秒
	return `${_.padStart(String(minutes), 2, '0')}:${_.padStart(String(seconds), 2, '0')}`
}

// 自动更新进度条和时间
watchEffect(() => {
	if (isPlaying.value && currentTime && currentTime.value >= duration.value) {
		pause() // 如果音频播放完毕，自动暂停
	}
})

// 监听 slider input，表示用户正在拖动进度条
function onSliderInput() {
	pause()
}

// 监听 slider change，表示用户已完成拖动
function onSliderChange() {
	seek() // 根据拖动的进度更新音频播放时间
}
// 跳转到特定的播放位置
function seek() {
	if (sound.value) {
		sound.value.seek(currentTime.value)
		play()
		startUpdatingTime()
	}
}
onUnmounted(()=>{
	if (sound.value) {
		sound.value.unload();
	}
})
</script>

<template>
	<div id="c-audio-player" class="c-audio-player flex justify-between w-full h-100">
		<div class="play-stop flex-center mr-10" @click="togglePlay">
			<i
				v-if="!isPlaying"
				class="i-material-symbols:motion-play-rounded text-primary text-30 cursor-pointer"
			></i>
			<i v-if="isPlaying" class="i-gravity-ui:circle-stop text-primary text-30 cursor-pointer"></i>
		</div>
		<p class="current-time flex-center mr-10">
			{{ formatTime(currentTime, 'seconds') }}
		</p>
		<div class="flex-1 flex-center overflow-hidden p-x-20">
			<el-slider
				:show-tooltip="false"
				@input="onSliderInput"
				@change="onSliderChange"
				v-model="currentTime"
				:max="Math.round(duration / 1000)"
				:min="0"
			/>
		</div>

		<span class="text-14 flex-center ml-10"> {{ formatTime(duration, 'milliseconds') }}</span>
	</div>
</template>

<style scoped></style>
