<template>
	<component 
		class="Cell" 
		:is="isClickable ? AppLink : 'div'"
		:to="navigateTo"
		:class="{ isClickable, isSelected, isFocused, dividerInset }"
		:data-size="size">

		<span v-if="isIconSlotVisible" class="Cell-icon isLeft">
			<slot name="icon" />
		</span>

		<span class="Cell-content">
			<div class="Cell-content-inner"><slot /></div>

			<div v-if="isContentRightSlotVisible" class="Cell-content-innerRight">
				<slot name="contentRight" />
			</div>

			<span 
				v-if="isIconRightSlotVisible || isSelected || displayAsSelectable || isTypeNavigation" 
				class="Cell-icon isRight">

				<slot v-if="isIconRightSlotVisible" name="iconRight" />
				<template v-else>
					<IconChevronRight v-if="isTypeNavigation && !isSelected" />
					<IconCheck v-if="isSelected" />
				</template>
			</span>
		</span>
	</component>
</template>

<script setup>
	import { computed, useSlots } from 'vue'
	import { AppLink } from '@/components/ui'
	import { IconCheck, IconChevronRight } from '@/assets/icons'

	const props = defineProps({
		isTypeNavigation: { type: Boolean, default: false },
		navigateTo: 			{ type: [ Object, String, null, undefined ], default: undefined },
		isSelected: 			{ type: Boolean, default: undefined },
		isFocused: 				{ type: Boolean, default: false },
		dividerInset: 		{ type: Boolean, default: false },
		size: 						{ type: String, default: '100', validator: v => [ '100', '200' ].includes(v) },
	})

	const isClickable = computed(() => props.navigateTo)
	const displayAsSelectable = computed(() => props.isSelected !== undefined)

	const slots = useSlots()
	const isIconSlotVisible = computed(() => slots.icon?.())
	const isIconRightSlotVisible = computed(() => slots.iconRight?.())
	const isContentRightSlotVisible = computed(() => slots.contentRight?.())
</script>

<style lang="postcss" scoped>
	.Cell {
		@apply pl-4 flex w-full appearance-none text-left;
		@apply transition duration-150;


		/**
		 * Icon
		 */
		&-icon {
			@apply mr-3 h-5 w-5;
			@apply my-2.5 desktop:my-1.5;

			&.isRight {
				@apply m-0 ml-3;
			}
		}


	  /**
		 * Content
		 */
		&-content {
			@apply flex-1 flex;
			@apply py-2.5 desktop:py-1.5;
			@apply border-b border-transparent;

			&-inner {
				@apply flex-1 text-100;
			}

			&-innerRight {
				@apply ml-3;
			}
		}

		&[data-size="200"] .Cell-content {
			@apply py-4 desktop:py-3;
		}

		&:not(:last-child) &-content {
			@apply border-gray-700 desktop:border-transparent;
		}

		&:not(.dividerInset) &-content {
			@apply pr-4;
		}


		/**
		 * Other props
		 */
		&.isClickable:hover {
			@apply mouse-only:bg-gray-700;
		}

		&.isSelected {
			@apply text-green-400;
		}

		&.isFocused {
			@apply bg-gray-700 bg-opacity-50;
		}

		&.dividerInset {
			@apply pr-4;
		}
	}
</style>