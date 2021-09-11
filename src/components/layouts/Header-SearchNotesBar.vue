<template>
	<div 
		class="Header-SearchNotesBar" 
		role="button"
		tabindex="0"
		aria-label="Search"
		:class="{ isFocussed: props.isSearchFocussed }"
		:style="{ width: `${ default_inputWrapWidth }px` }"
		@click="navigateToSearch"
		@keypress.enter="navigateToSearch">

		<div class="inputWrap" ref="inputWrapEl" :style="{ 
			'transform': `translateX(${ inputWrapTransformX }px)`,
			'width': `${ inputWrapWidth }px`
		}">
			<input 
				:disabled="!props.isSearchFocussed"
				v-model="searchNotesString"
				ref="inputFieldEl"
				placeholder="Search for something"
				spellcheck="false"
			/>

			<div class="absolute left-4 top-3 pointer-events-none">
				<IconSearch />
			</div>
		</div>
	</div>
</template>

<script setup>
	import { computed, nextTick, onMounted, ref, watch } from 'vue'
	import { IconSearch } from '@/assets/icons'
	import { useRouter, useRoute } from 'vue-router'

	const route = useRoute()
	const router = useRouter()

	const props = defineProps({
		isSearchFocussed: { type: Boolean, required: true },
	})

	const default_inputWrapWidth = 202

	const inputFieldEl = ref(null),
				inputWrapEl = ref(null),
				inputWrapTransformX = ref(0),
				inputWrapWidth = ref(default_inputWrapWidth)

	const searchNotesString = computed({
		get() 			{ return route.query?.q || '' },
		set(newVal)	{ router.push({ query: { q: newVal } }) }
	})

	const updateTransformX = () => {
		if (!props.isSearchFocussed) {
			inputWrapTransformX.value = 0
			inputWrapWidth.value = default_inputWrapWidth
			return 
		}

		const elWidth = 480,
					elLeft = inputWrapEl.value.offsetLeft,
					windowWidth = window.innerWidth

		// First, calc goal left pos
		const goalLeftPos = (windowWidth - elWidth) / 2

		// Then, calc how much to move
		inputWrapTransformX.value = (elLeft - goalLeftPos) * -1
		inputWrapWidth.value = elWidth
	}

	const handleUpdate = () => {
		updateTransformX()
		if (props.isSearchFocussed) 
			inputFieldEl.value?.focus()
	}

	watch(() => props.isSearchFocussed, () => nextTick(handleUpdate))
	onMounted(handleUpdate)

	const navigateToSearch = () => {
		router.push({ name: 'App-Search' })
	}
</script>

<style lang="postcss" scoped>
	.Header-SearchNotesBar {
		.inputWrap {
			@apply transition duration-300 relative;
			transition-property: width, transform;
		}

		input {
			@apply inline-flex w-full bg-transparent h-11 pl-11 rounded-xl border border-gray-700 text-100 cursor-pointer;
			@apply absolute;
			@apply transition duration-300;
			@apply ring-0;
		}

		input::placeholder, 
		:deep(svg) {
			@apply text-gray-300 font-bold;
			transition: font-weight 300ms ease, color 300ms ease;
		}

		&.isFocussed {
			input {
				@apply cursor-auto bg-gray-800;
			}

			input::placeholder, 
			:deep(svg) {
				@apply text-gray-500 font-normal;
			}
		}
	}
</style>