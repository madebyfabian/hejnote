<template>
	<li>
		<AppLink :to="to" class="Sidebar-Item h-9">
			<div class="Sidebar-Item_content flex items-center h-full">
				<span class="block">
					<slot />
				</span>
			</div>
		</AppLink>
	</li>
</template>

<script setup>
	import { AppLink } from '@/components/ui'

	defineProps({
		to: { required: true }
	})
</script>

<style lang="postcss" scoped>
	.Sidebar-Item { 
		@apply block pl-5 font-normal relative text-gray-400;
		transition: font-weight 150ms ease, color 150ms ease;

		&:hover {
			@apply text-green-400;
		}

		&.router-link-active {
			@apply text-green-400 font-bold;
		}

		&_content::after {
			content: '';
			transition: transform 250ms ease 75ms;

			@apply absolute top-0 left-0 w-1 h-full rounded-r-full;
			@apply -translate-x-1 opacity-0;
			@apply bg-green-400;
		}

		&.router-link-active  &_content::after {
			@apply -translate-x-0 opacity-100;
		}
	}
</style>