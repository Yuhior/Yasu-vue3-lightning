<script setup lang="ts">
import CAudioPlayerModal from '@/components/atoms/CAudioPlayerModal/index.vue'

const props = defineProps({
	item: {
		type: Object,
		default: () => {
			return null
		}
	}
})
const isShowAudioPlayer = ref(false)

function onPlay() {
	if (props.item && props.item.url) {
		isShowAudioPlayer.value = true
	}
}
const url = computed(()=>{
	return props.item.url
})
const title = computed(()=>{
	return props.item.title
})
</script>

<template>
	<div class="m-audio-link">
		<div @click="onPlay">
			<slot  />
		</div>
		<CAudioPlayerModal v-model="isShowAudioPlayer" :url="url" :title="title" />
	</div>
</template>

<style scoped></style>
