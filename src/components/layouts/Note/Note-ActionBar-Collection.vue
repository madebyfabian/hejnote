<template>
	<Badge v-if="collection" class="Note-ActionBar-Collection" :class="{ isReadonly }">
		<span class="max-w-24 text-overflow-ellipsis">
			{{ collection.title }}
		</span>

		<!-- Exeption: I didn't used <Button> here, but it's okay -->
		<button v-if="!isReadonly" class="Note-ActionBar-Collection-badgeButton" @click="emit('removeCollection')">
			<span class="relative">
				<IconClose />
			</span>
		</button>
	</Badge>
</template>

<script setup>
	import { IconClose } from '@/assets/icons'
	import { Badge } from '@/components/ui'

	const emit = defineEmits([ 'removeCollection' ])

	const props = defineProps({
		collection: { required: true },
		isReadonly: { required: true, default: false },
	})
</script>

<style lang="postcss" scoped>
	.Note-ActionBar-Collection {
		@apply relative;
		--mask-optical-size: 36px;

		&:not(.isReadonly) {
			span {
				--gradient: linear-gradient(to left, transparent 0px, black var(--mask-optical-size));
				--size: calc(100% + var(--mask-optical-size)) 100%;
				-webkit-mask-image: var(--gradient);
				-webkit-mask-size: var(--size);
				mask-image: var(--gradient);
				mask-size: var(--size);
			}

			&:hover,
			&:focus-within {
				span {
					animation: clip-fade 150ms ease forwards;

					@keyframes clip-fade {
						100% {
							-webkit-mask-position: right;
							mask-position: right;
						}
					}
				}
			}
		}

		&-badgeButton {
			@apply absolute right-1 transition opacity-0 rounded;
		}

		&:hover,
		&:focus-within {
			^&-badgeButton {
				@apply opacity-100;
			}
		}
	}
</style>