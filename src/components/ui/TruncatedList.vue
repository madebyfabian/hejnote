<template>
	<component
		:is="wrapperIs"
		:id="listId"
		role="region"
		class="TruncatedList"> 

		<component 
			:is="itemIs"
			v-for="(item, key) in computedItems" 
			:key="key">

			<slot name="item" v-bind="{ item }" />
		</component>

		<component v-if="!defaultSlotIsEmpty" :is="itemIs">
			<slot />
		</component>

		<component v-if="overflowAmount > 0 && !props.disableTruncation" :is="itemIs">
			<button 
				:aria-expanded="!props.isTruncated" 
				:aria-controls="listId"
				@click="$emit('truncatedChange', !props.isTruncated)"
				class="block w-full">
				
				<slot name="expandButton" v-bind="{ overflowAmount }" />
			</button>
		</component>
	</component>
</template>

<script setup>
	import { computed, ref, useSlots } from 'vue'
	import generateRandomId from '@/utils/generateRandomId'
	import useSlotIsEmpty from '@/hooks/useSlotIsEmpty'

	defineEmits([ 'truncatedChange' ])

	const props = defineProps({
		wrapperIs: 					{ type: String, default: 'div' },
		itemIs: 						{ type: String, default: 'div' },		
		items: 							{ type: Array, default: () => [] },
		isTruncated: 				{ type: Boolean, required: true },
		truncateAmount: 		{ type: Number, default: 3 },
		disableTruncation: 	{ type: Boolean, default: false },
	})

	const computedItems = computed(() => {
		return props.isTruncated && !props.disableTruncation
			? props.items.slice(0, props.truncateAmount)
			: props.items
	})

	const listId = ref(generateRandomId())

	const overflowAmount = computed(() => {
		return props.items.length - props.truncateAmount
	})

	const defaultSlotIsEmpty = useSlotIsEmpty({ name: 'default' })
</script>