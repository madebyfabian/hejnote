<template>
  <a v-if="isExternal" :href="computedTo" rel="noopener"><slot/></a>
  <router-link v-else v-bind="{ ...$props, to: computedTo }"><slot/></router-link>
</template>

<script setup>
	import { computed } from 'vue'
	import { RouterLink } from 'vue-router'
	import useIsHiddenMode from '@/hooks/useIsHiddenMode'

	const props = defineProps({
		...RouterLink.props
	})

	const isExternal = computed(() => {
		return typeof props.to === 'string' && props.to.startsWith('http')
	})

	const computedTo = computed(() => {
		const isHiddenMode = useIsHiddenMode()

		if (isExternal.value) 
			return props.to

		const params = (isHiddenMode.value) 
			? Object.assign({}, { ...props?.params, isHiddenMode: 'hidden' })
			: Object.assign({}, { ...props?.params })

		return {
			...props,
			to: {
				...props.to,
				params
			}
		}
	})
</script>