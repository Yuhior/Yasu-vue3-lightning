<script setup lang="ts">
const props = defineProps({
	row: {
		type: Number,
		default: 3
	},
	maxLength: {
		type: Number,
		default: 512
	},
	customClass: {
		type: String,
		default: ''
	}
})
const attrs = useAttrs()
const mergedProps = computed(() => {
	return {
		...attrs,
		...props,
		customClass: null // 排除 customClass，因为它已经作为独立 prop 处理
	}
})
</script>

<template>
	<div class="c-searchbar" :class="customClass">
		<el-input  v-bind="mergedProps">
			<template #suffix>
				<i class="i-hugeicons:search-01"></i>
			</template>
		</el-input>
	</div>
</template>

<style scoped></style>
