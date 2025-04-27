<script setup lang="ts">
defineOptions({ name: 'CAudioPlayerModal' })
defineProps({
	url: {
		type: String,
		default: ''
	},
	title: {
		type: String,
		default: ''
	}
})
const isShowModal = defineModel()
const emit = defineEmits(['update:modelValue'])

function handleClose() {
	isShowModal.value = false
	emit('update:modelValue', false);
}
</script>

<template>
	<div class="m-audio-player-modal">
		<el-dialog v-model="isShowModal" class="!p-x-0" align-center :before-close="handleClose" :title="title" width="512px">
			<div class="p-x-20">
				<CAudioPlayer :url="url" v-if="isShowModal" />
			</div>
		</el-dialog>
	</div>
</template>

<style scoped lang="scss">
:deep(.el-dialog__header) {
	padding: 1px 20px;
	border-bottom: 1px solid #f5f5f5;
}
</style>
