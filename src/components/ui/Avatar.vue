<template>
	<div class="Avatar" :aria-label="name" role="img">
		<img v-if="src" :src="src" aria-hidden="true" />
		<span v-else v-text="computedNameAbbr" aria-hidden="true" />
	</div>
</template>

<script>
	import { computed } from 'vue'

	export default {
		props: {
			src: { type: String },
			name: { type: String, required: true }
		},

		setup( props ) {
			const computedNameAbbr = computed(() => {
        let name = props.name.trim(),
            splitter = name.includes('.') ? '.' : ' '

        return name.split(splitter)
          .map(str => str.substr(0, 1))
          .join('')
          .substr(0, 2)
      })

			return {
				computedNameAbbr
			}
		}	
	}
</script>

<style lang="postcss" scoped>
	.Avatar {
		@apply h-9 w-9 rounded-full bg-green-900 text-green-400;
		@apply flex justify-center items-center flex-shrink-0 select-none;
		@apply font-bold;

		img {
			@apply w-full h-full block;
		}

		span {
			@apply uppercase;
		}
	}
</style>