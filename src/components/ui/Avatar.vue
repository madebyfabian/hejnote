<template>
	<div class="Avatar" :class="{ isSmall, isActive }" :aria-label="name" role="img">
		<img v-if="src" :src="src" aria-hidden="true" />
		<span v-else :class="{ 'scale-60 origin-center': isSmall }" v-text="computedNameAbbr" aria-hidden="true" />
	</div>
</template>

<script>
	import { computed } from 'vue'

	export default {
		props: {
			src: 			{ type: String },
			name: 		{ type: String, required: true },
			isSmall: 	{ type: Boolean, default: false },
			isActive: { type: Boolean, default: false },
		},

		setup( props ) {
			const computedNameAbbr = computed(() => {
				const DEFAULT = '-'
        let name = props.name?.trim() || DEFAULT
				let isEmail = name.includes('@')
				if (isEmail)
					name = name.split('@')[0] // Get only value before @

				let splitter = isEmail ? /\-|\.|_/ : ' '

				let allLetters = name.split(splitter)
          .map(str => str.substr(0, 1))
          .join('')

				let str = allLetters[0]
				if (allLetters.length > 1)
					str += allLetters[allLetters.length - 1]

        return str?.toUpperCase() || DEFAULT
      })

			return {
				computedNameAbbr
			}
		}	
	}
</script>

<style lang="postcss" scoped>
	.Avatar {
		@apply relative h-9 w-9 rounded-full bg-green-900 text-green-400;
		@apply flex justify-center items-center shrink-0 select-none;
		@apply font-bold;
		@apply transition-shadow;

		&.isActive {
			@apply ring ring-offset-2 ring-green-700 ring-offset-gray-800;
		}

		/*
		&::after {
			@apply content absolute -top-1 -left-1 border border-green-400 rounded-full;
			@apply w-11 h-11;
			@apply transition opacity-0 transform-gpu scale-90;
		}

		&.isActive {
			&::after {
				@apply opacity-100 scale-100;
			}
		}*/

		&.isSmall {
			@apply h-5 w-5;

			&::after {
				@apply w-7 h-7;
			}
		}

		img {
			@apply w-full h-full block;
		}
	}
</style>