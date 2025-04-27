<script setup lang="ts">
type Props = {
	items: Array
	isHorizontal?: boolean
	isSingle?: boolean
	columns?: number
}
const props = withDefaults(defineProps<Props>(), {
	items: () => [],
	isHorizontal: true,
	isSingle: false,
	columns: 5
})
const selectedItems = defineModel()

function checkItemSelected(item) {
	return selectedItems.value.find((x) => x.id === item.id) && true
}

function deselectItem(item) {
	const newSelectedItem = []
	for (let i = 0; i < selectedItems.value.length; i++) {
		if (selectedItems.value[i].id !== item.id) {
			newSelectedItem.push(selectedItems.value[i])
		}
	}
	selectedItems.value = newSelectedItem
}

function touchItem(item) {
	if (item.classId == 0) {
		if (selectedItems.value.length === props.items.length - 1) {
			selectedItems.value = []
		} else {
			let filterSelectedItems = props.items.filter((x) => x.classId !== 0)
			selectedItems.value = filterSelectedItems
		}
	} else {
		if (checkItemSelected(item)) {
			deselectItem(item)
		} else {
			if (props.isSingle && props.selectedItems.length > 0) {
				selectedItems.value = []
			}
			selectedItems.value.push(item)
		}
	}
}
</script>

<template>
	<div class="c-check-list">
		<el-row v-if="isHorizontal" class="gap-10">
			<div
				v-for="(item, index) in items"
				:style="{ width: `calc((100% - ${(columns - 1) * 10}px) / ${columns})` }"
				:key="index"
			>
				<slot
					name="itemRenderer"
					:checkItem="item"
					:checkItemSelected="checkItemSelected"
					:touchItem="touchItem"
				>
					<CCheckBox :label="item.name" :model-value="item" @click="touchItem(item)" />
				</slot>
			</div>
		</el-row>
		<div v-if="!isHorizontal">
			<div v-for="(item, index) in items" :key="index">
				<slot
					name="itemRenderer"
					:checkItem="item"
					:checkItemSelected="checkItemSelected"
					:touchItem="touchItem"
				>
					<CCheckBox
						:label="item.name"
						:model-value="checkItemSelected(item)"
						@click="touchItem(item)"
					/>
				</slot>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
