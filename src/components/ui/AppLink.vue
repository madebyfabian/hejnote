<template>
  <a v-if="isExternal" :href="computedTo" rel="noopener"><slot/></a>
  <router-link v-else v-bind="{ ...$props, to: computedTo }"><slot/></router-link>
</template>

<script setup>
	import { computed } from 'vue'
	import { RouterLink } from 'vue-router'
	import useGenerateRouterLink from '@/hooks/useGenerateRouterLink'

	const { generateRouterLink } = useGenerateRouterLink()

	const props = defineProps({
		...RouterLink.props,
		ignoreHiddenMode: { type: Boolean, default: false },
	})

	const isExternal = computed(() => {
		return typeof props.to === 'string' && props.to.startsWith('http')
	})

	const computedTo = computed(() => {
		if (props.ignoreHiddenMode || isExternal.value) 
			return props.to

		return generateRouterLink(props.to)?.value
	})
</script>