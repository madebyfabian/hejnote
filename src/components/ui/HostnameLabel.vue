<template>
	<div class="HostnameLabel block line-clamp-1 text-050 text-gray-500 break-all">
		{{ label }}
	</div>
</template>

<script setup>
	import { computed } from 'vue'
	import useGetUrlHost from '@/hooks/useGetUrlHost'

	const props = defineProps({
		url: { type: String, default: '-' },
	})

	const label = computed(() => useGetUrlHost(props.url) || '-')
</script>