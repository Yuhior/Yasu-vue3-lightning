<!--
 * @Author: Yuhior
 * @Date: 2024/11/14
 * @LastEditors: author
 * @Description: desc
-->
<template>
	<Waterfall :list="list"
			   :row-key="options.rowKey"
			   :gutter="options.gutter"
			   :has-around-gutter="options.hasAroundGutter"
			   :width="options.width"
			   :breakpoints="options.breakpoints"
			   :img-selector="options.imgSelector"
			   :background-color="options.backgroundColor"
			   :animation-effect="options.animationEffect"
			   :animation-duration="options.animationDuration"
			   :animation-delay="options.animationDelay"
			   :animation-cancel="options.animationCancel"
			   :lazyload="options.lazyload"
			   :load-props="options.loadProps"
			   :cross-origin="options.crossOrigin"
			   :align="options.align"
			   @afterRender="afterRender"
	>
		<!-- v2.6.0之前版本插槽数据获取 -->
		<!-- <template #item="{ item, url, index }"> -->
		<!-- 新版插槽数据获取 -->
		<template #default="{ item }">
			<div class="card" @click="waterfallItemClick(item)">
				<LazyImg :url="item.goodsType===GoodsNumEnum.sound ? soundIcon : item[imgSrc]" />
				<p class="text p-x-4 truncate">{{ item[title] }}</p>
			</div>
		</template>
	</Waterfall>
</template>

<script setup lang="ts">
import error from '@/assets/icons/image_error.jpg'
import loading from '@/assets/icons/image_error.jpg'

const props = defineProps({
	list: {
		type: Array,
		default: () => []
	},
	rowKey: {
		type: String,
		default: () => 'id'
	},
	imgSrc: {
		type: String,
		default: () => 'src'
	},
	title: {
		type: String,
		default: () => 'title'
	}
})

const options = reactive({
	// 唯一key值
	rowKey: props.rowKey,
	// 卡片之间的间隙
	gutter: 10,
	// 是否有周围的gutter
	hasAroundGutter: true,
	// 卡片在PC上的宽度
	width: 320,
	// 自定义行显示个数，主要用于对移动端的适配
	breakpoints: {
		1200: {
			// 当屏幕宽度小于等于1200
			rowPerView: 4
		},
		800: {
			// 当屏幕宽度小于等于800
			rowPerView: 3
		},
		500: {
			// 当屏幕宽度小于等于500
			rowPerView: 2
		}
	},
	// 动画效果
	animationEffect: 'animate__fadeInUp',
	// 动画时间
	animationDuration: 1000,
	// 动画延迟
	animationDelay: 300,
	animationCancel: false,
	// 背景色
	backgroundColor: '#fff',
	// imgSelector
	imgSelector: props.imgSrc,
	// 加载配置
	loadProps: {
		loading: loading,
		error
	},
	// 是否懒加载
	lazyload: true,
	align: 'center',
	crossOrigin: false
})
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
import { GoodsNumEnum } from '@/enums'
import soundIcon from '@/assets/icons/audioVideo/ic_sound.png'

const emit = defineEmits(['handle-render', 'item-click'])

function afterRender() {
	emit('handle-render')
}

function waterfallItemClick(item) {
	emit('item-click', item)
}
</script>

<style scoped lang="scss">

:deep(.lazy__img[lazy=loaded]) {
	border-radius: 6px;
}
</style>
