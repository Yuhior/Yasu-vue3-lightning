<script setup lang="ts">
import { FileHelper } from '@/utils'
import { FileStatusEnum, ResourceModuleEnum, ResourceRulesEnum } from '@/enums'

defineOptions({
	name: 'FileUploaderView'
})
type Props = {
	api?: Object<{ request: Function; data: Object }>
	accept?: string | null
	initialFiles?: Array<File>
	limit?: number
}
const props = withDefaults(defineProps<Props>(), {
	api: () => {},
	accept: null,
	initialFiles: [] as File[],
	limit: 0
})
const failureFiles = ref([])
const successFiles = ref([])
const readyAndProgressFiles = ref([])
const allFileAccepts = ref([])
const apiData = props.api

const mergedItem = computed(() => {
	return [...failureFiles.value, ...readyAndProgressFiles.value]
})
const acceptFileTypeString = computed(() => {
	if (props.accept) {
		return props.accept
	}
	return FileHelper.flattenAndJoinComma(
		[
			ResourceRulesEnum.IMAGE_FILE_ACCEPTS,
			ResourceRulesEnum.VIDEO_FILE_ACCEPTS,
			ResourceRulesEnum.AUDIO_FILE_ACCEPTS,
			ResourceRulesEnum.DOCUMENT_FILE_ACCEPTS
		].map((item) => {
			return FileHelper.fileTypeLimitVar(item, ResourceModuleEnum.WORK)
		})
	)
})
const isShowUploadButton = computed(() => {
	const readyFile = readyAndProgressFiles.value.find(
		(x) => x.status == FileStatusEnum.READY || x.status == FileStatusEnum.UPLOADING
	)
	return props.api && readyFile && true
})
const isUploading = computed(() => {
	const uploadingFile = readyAndProgressFiles.value.find((x) => x.status == 'uploading')
	return uploadingFile && true
})
const enContinue = computed(() => {
	return Number(props.limit) !== 0 && props.limit <= mergedItem.value.length
})
watch(
	() => props.initialFiles,
	() => {
		addInitialFilesToUploadList()
	}
)
const uploader = ref(null)
onMounted(() => {
	addInitialFilesToUploadList()
})

function addInitialFilesToUploadList() {
	if (uploader.value) {
		props.initialFiles.forEach((file) => {
			uploader.value.handleStart(file.raw)
		})
	}
}

const emit = defineEmits(['on-success', 'on-complete'])

function onChange(file, fileList) {
	readyAndProgressFiles.value = fileList
}

function onRemove(row) {
	let failFileIndex = failureFiles.value.findIndex((e) => e.uid === row.uid)
	if (failFileIndex >= 0) {
		failureFiles.value.splice(failFileIndex, 1)
	}
	let successFileIndex = successFiles.value.findIndex((e) => e.uid === row.uid)
	if (successFileIndex >= 0) {
		successFiles.value.splice(successFileIndex, 1)
	}
	uploader.value.handleRemove(row)
}

function uploaderOnRemove(file, fileList) {
	readyAndProgressFiles.value = fileList
}

function startUpload() {
	uploader.value.submit()
}

async function httpRequsetSubmit({
	file,
	onProgress,
	onSuccess,
	onError
}: {
	file: File
	onProgress: Function
	onSuccess: Function
	onError: Function
	onException?: Function
}) {
	return apiData.request(file, { ...apiData.data, onUploadProgress: onProgress })

}

function sizeformatter(row) {
	return FileHelper.formatSizeUnits(row.size / 1000)
}

function statusFormatter(row) {
	const status = row.status
	const responseResult = row.response ? row.response.result : 200
	// 状态和响应结果映射表
	const statusMessages = {
		[FileStatusEnum.READY]: '等待上传',
		[FileStatusEnum.UPLOADING]: '上传中',
		[FileStatusEnum.SUCCESS]: responseResult === 200 ? '上传成功' : null,
		[FileStatusEnum.FAIL]:
			responseResult === 100 || status === 'fail' ? '上传失败' : row.response?.message
	}
	// 返回对应状态的消息
	return statusMessages[status] || statusMessages.success || statusMessages.fail
}

function onClear() {
	uploader.value.clearFiles()
	readyAndProgressFiles.value = []
	successFiles.value = []
	failureFiles.value = []
}

function progressFilter(row) {
	if (row.status == FileStatusEnum.FAIL) return 0
	return row.percentage
}
function uploadFileOnSuccess(response, file, fileList) {
	successFiles.value.push(response.data)
	emit('on-success', file)
}
function uploadFileOnError(err, file, fileList) {
	file.status = 'fail'
	failureFiles.value.push(file)
}
function onComplete() {
	emit('on-complete', successFiles.value)
}
function uploadFileExceed(files, fileList) {
	ElMessage.warning(`当前限制选择 ${props.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
}
defineExpose({
	onClear
})
</script>

<template>
	<div class="file-upload-view">
		<div class="upload-status-container">
			<el-table :data="mergedItem" style="width: 100%" max-height="700px">
				<el-table-column prop="name" label="文件名称" width="300" />
				<el-table-column prop="size" label="文件大小" :formatter="sizeformatter" />
				<el-table-column prop="status" label="上传状态" :formatter="statusFormatter" />
				<el-table-column prop="percentage" label="上传进度">
					<template #default="scope">
						<el-progress
							v-if="
								scope.row.status == 'ready' ||
								scope.row.status == 'fail' ||
								scope.row.status == 'uploading'
							"
							:show-text="false"
							:stroke-width="5"
							:percentage="progressFilter(scope.row)"
						/>
						<span v-else class="text-primary text-15">完成</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="100px">
					<template #default="scope">
						<div
							v-if="scope.row.status != 'success'"
							class="flex-center cursor-pointer"
							@click="onRemove(scope.row)"
						>
							<i class="i-material-symbols:scan-delete text-20"></i>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="mt-20">
			<el-upload
				ref="uploader"
				class="flex-center gap-20"
				action=""
				multiple
				:http-request="httpRequsetSubmit"
				:auto-upload="false"
				:show-file-list="false"
				:disabled="isUploading"
				:on-remove="uploaderOnRemove"
				:accept="acceptFileTypeString"
				:on-change="onChange"
				:limit="limit"
				:on-success="uploadFileOnSuccess"
				:on-error="uploadFileOnError"
				:on-exceed="uploadFileExceed"
			>
				<template #trigger>
					<el-button class="select-files" :disabled="isUploading || enContinue">
						继续添加
					</el-button>
				</template>
				<el-button
					v-if="isShowUploadButton"
					class="bg-primary text-white"
					:disabled="isUploading"
					@click="startUpload"
				>
					开始上传
				</el-button>
				<el-button v-else class="bg-primary text-white" :disabled="isUploading" @click="onComplete">
					完成
				</el-button>
			</el-upload>
		</div>
	</div>
</template>

<style scoped lang="scss">
:deep(.el-table td.el-table__cell div) {
	font-size: 15px;
}
</style>
