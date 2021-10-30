<template>
	<div 
		id="item" 
		ref="_item" 
		:style="`transform: translateY(${ itemTransformComputed }px)`" 
		:class="{ 'is-animated': itemIsAnimated }">

		<div id="item__drag-handle" ref="_itemDragHandle"></div>

		<div style="flex-shrink: 0">
			<Button buttonType="secondary" @click="emit('close')">
				Close Modal
			</Button>
		</div>

		<div class="scroll-wrap" v-scroll-lock="true">
			<div>Blabla</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
	import { Button } from '@/components/ui'

	const props = defineProps({
		isOpened: { type: Boolean, required: true },
	})

	const emit = defineEmits([ 'close' ])

	const spaceTop = 40
	const transformOnModalClosed = window.innerHeight - spaceTop

	const _item = ref(null),
				_itemDragHandle = ref(null)

	const itemTransform = ref(0),
				itemIsAnimated = ref(true)


	watch(()=> props.isOpened, ( newVal, oldVal ) => {
		// If modal was closed and no opens, set it to 0
		if (!oldVal && newVal)
			itemTransform.value = 0
	})

	const itemTransformComputed = computed(() => {
		if (props.isOpened)
			return itemTransform.value
		else 
			return transformOnModalClosed
	})

	

	var active = false,
			currentY,
			initialY

	function handleOpenModal() {
		itemTransform.value = 0
		itemIsAnimated.value = true
	}

	function dragStart(e) {
		console.log('onDragStart')
		itemIsAnimated.value = false
		
		active = true

		if (e.type === "touchstart") 
			initialY = e.touches[0].clientY - itemTransform.value
		else 
			initialY = e.clientY - itemTransform.value
	}

	function drag(e) {
		if (!active)
			return 
		
		e.preventDefault()

		if (e.type === "touchmove")
			currentY = e.touches[0].clientY - initialY;
		else 
			currentY = e.clientY - initialY;

		itemTransform.value = currentY

		// if currentY is lower than 0, slower down the transform effect
		if (currentY < 0) {
			itemTransform.value = 0
			let newY = currentY / 10
			itemTransform.value = newY
		}
	}

	function dragEnd(e) {
		if (!active)
			return
		
		console.log('onDragEnd')
		
		initialY = currentY

		active = false
		itemIsAnimated.value = true

		// After releasing the drag handle, decide to either go back to full open, or full close.
		if (currentY < (_item.value.offsetHeight / 4)) {
			itemTransform.value = 0
		} else {
			itemTransform.value = transformOnModalClosed
			emit('close')
		}
	}

	

	onMounted(() => {
		_itemDragHandle.value.addEventListener("touchstart", dragStart, false)
		window.addEventListener("touchend", dragEnd)
		window.addEventListener("touchmove", drag)

		_itemDragHandle.value.addEventListener("mousedown", dragStart, false)
		window.addEventListener("mouseup", dragEnd)
		window.addEventListener("mousemove", drag)
	})

	onUnmounted(() => {
		// remove all event listeners!!
	})
</script>

<style lang="postcss" scoped>
	#item {
		--space-top: 40px;
		--space-overSwiping-bottom: 100px;
		width: 100%;
		margin-top: 40px;
		height: calc(100% - var(--space-top) + var(--space-overSwiping-bottom));
		padding-bottom: var(--space-overSwiping-bottom); /* offset when over-swiping to the top. */
		background-color: #2c2c2c;
		touch-action: none;
		user-select: none;
		border-top-left-radius: 1rem;
		border-top-right-radius: 1rem;
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		z-index: 9999;
		flex-flow: column;
	
		&.is-animated {
			transition: transform .4s ease;
		}
		
		.scroll-wrap {
			overflow-y: scroll;
			margin-top: 60px;
			
			> div {
				background: linear-gradient(to bottom, deepskyblue, red);
				height: 2000px;
			}
		}
		
		#item__drag-handle {
			height: 32px;
			width: 100%;
			flex-shrink: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			
			&::after {
				content: '';
				height: .25rem;
				width: 4rem;
				background: grey;
				border-radius: 1rem;
				left: calc(50% - 2rem);
			}
		}
	}
</style>