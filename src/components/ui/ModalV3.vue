<template>
	<div 
		class="ModalV3" 
		v-if="isOpened"
		v-scroll-lock="true"
		ref="modalEl">

		<div 
			v-if="isOpened"
			ref="modalScrollPlaceholderEl"
			style="scroll-snap-align: end;"
			:style="`height: ${ windowHeight }px`"></div>

		<div 
			class="element" 
			ref="modalElementEl" 
			:style="`height: ${ windowHeight }px`">

			<h1>Hallo Welt.</h1>
			<p>hallo.</p>

			<div style="height: 60vh; overflow-y: scroll">
				<div style="height: 2000px; background: linear-gradient(to bottom, green, blue)"></div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted, onUnmounted, watch, nextTick, inject } from 'vue'
	import { Button } from '@/components/ui'
	const smoothScroll = inject('smoothScroll')

	// Props
	const props = defineProps({
		isOpened: { type: Boolean, required: true },
	})

	watch(() => props.isOpened, async ( newVal, oldVal ) => {
		if (!oldVal && newVal) {
			await nextTick()
			
			/*smoothScroll({
				container: modalEl.value,
				scrollTo: modalElementEl.value,
				updateHistory: false
			})*/

			modalElementEl.value.scrollIntoView({
				behavior: 'smooth',
			})

			setTimeout(() => {
				modalEl.value.style.scrollSnapType = 'y mandatory'
			}, 500)
		}
	})

	// Emits
	const emit = defineEmits([ 'close' ])

	// Data
	const windowHeight = computed(() => window.innerHeight)
	const modalEl = ref(null)
	const modalElementEl = ref(null)
	const modalScrollPlaceholderEl = ref(null)

	onMounted(() => {
		window.addEventListener('touchend', handleTouchend)
	})

	onUnmounted(() => {
		window.removeEventListener('touchend', handleTouchend)
	})

	const timeoutPromise = ms => new Promise(resolve => setTimeout(resolve, ms))

	// Methods
	const handleTouchend = async () => {
		/*
		const maxAllowedScroll = windowHeight.value - windowHeight.value / 4
		const currentScroll = modalEl.value.scrollTop

		console.log({ maxAllowedScroll, currentScroll });

		if (currentScroll < maxAllowedScroll) {
			console.log('back up dude!')
			//scrollTo(modalScrollPlaceholderEl.value)
		} else {
			console.log('close')
			//scrollTo(modalElementEl.value)
		}*/

		if (!modalEl.value)
			return

		let firstScrollPos = modalEl.value.scrollTop
		await timeoutPromise(50)
		let secondScrollPos = modalEl.value.scrollTop

		if (firstScrollPos > secondScrollPos) {
			emit('close')
		}
	}
</script>

<style lang="postcss" scoped>
	.ModalV3 {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		z-index: 1000;
		overflow-y: scroll;
		/*scroll-snap-type: y mandatory;*/
		-webkit-overflow-scrolling: touch;

		&::-webkit-scrollbar {
			display: none; 
		}

		> div {
			scroll-snap-align: start;
		}
	}

	.ModalV3 .element {
		background: black;
		padding: 20px;
		border-radius: 5px;
	}
</style>