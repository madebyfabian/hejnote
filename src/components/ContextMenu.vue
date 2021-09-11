<template>
	<div class="ContextMenu w-min relative">
		<Button 
			@click.passive="emit('toggleIsOpened', !isOpened)" 
			aria-haspopup="true" 
			:aria-controls="id" 
			:aria-expanded="isOpened"
			v-bind="buttonProps">
			
			<slot name="button"/>
		</Button>

		<div class="relative">
			<transition name="transition-contextMenu">
				<ContextMenu-Content 
					v-if="isOpened" 
					v-click-outside="clickOutsideConfig" 
					v-bind="{ isOpened, id }" 
					@toggleIsOpened="v => emit('toggleIsOpened', v)">

					<slot />
				</ContextMenu-Content>
			</transition>
		</div>
	</div>
</template>

<script setup>
	import ContextMenuContent from '@/components/ContextMenu-Content.vue'
	import Button from '@/components/ui/Button.vue'
	import generateRandomId from '@/utils/generateRandomId'

	const emit = defineEmits([ 'toggleIsOpened' ])
	const props = defineProps({
		isOpened: 		{ type: Boolean, required: true },
		buttonProps: 	{ type: Object, default: () => ({}) },
	})

	const id = generateRandomId()

	// Setup click outside
	const clickOutsideConfig = {
		events: [ 'mouseup' ],
		handler: () => {
			if (props.isOpened) 
				emit('toggleIsOpened', false)
		},
	}
</script>

