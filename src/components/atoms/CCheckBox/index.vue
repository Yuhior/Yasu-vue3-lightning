<script setup lang="ts">
defineOptions({
	name: 'CCheckBox'
})
type Props = {
	label?: string
	checkStatus?: number
	checkAble?: boolean
	modelValue: boolean
}
const props = withDefaults(defineProps<Props>(), {
	label: () => '',
	checkStatus: () => 0,
	checkAble: true,
	modelValue: false
})
const isLabelChecked = computed(() => {
	if (props.checkAble) {
		return props.modelValue
	} else {
		return props.checkStatus > 0
	}
})
const isChecked = computed(() => {
	if (props.checkAble) {
		return props.modelValue
	} else {
		return props.checkStatus > 1
	}
})
const emit = defineEmits(['update:modelValue'])
function toggleValue() {
	if (props.checkable) {
		emit('update:modelValue', !props.modelValue)
	}
}
</script>

<template>
	<div class="c-check-box" @click="toggleValue">
		<div class="circle" :class="{ checked: isChecked }">
			<i v-if="isChecked" class="i-mingcute:check-fill" />
		</div>
		<div class="label" :class="{ checked: isLabelChecked }">
			{{ label }}
		</div>
	</div>
</template>

<style scoped></style>
