<template>
	<div>
		<input type="text" v-model="text">
	</div>
</template>

<script setup>
	import { ref, watch } from 'vue'

	const text = ref('')
	const changeHandler = () => {
		console.log('change. newVal:', text.value)
	}



	/** 
	 * Solution 1, 
	 * ✅ Debounces at the very first time immediately.
	 * 🚫 debounces not at the most current value. 
	 * ✅ executes the script always, and doesn't wait until user stops inputting.
	 * */
	/*import debounce from 'just-debounce'

	const changeHandlerDebounced = debounce(changeHandler, 1000, true)

	watch(text, ( newVal, oldVal ) => {
		changeHandlerDebounced(newVal) // debounced
	})*/



	/**
	 * Solution 2
	 * ✅ Debounces at the very first time immediately.
	 * ✅ debounces at the most current value. 
	 * 🚫 executes the script only on start and stop of user input.
	 */
	/*import debounce from 'lodash.debounce'

	watch(text, debounce(changeHandler, 300, { leading: true, trailing: true }))*/



	/**
	 * Solution 3
	 * ✅ Debounces at the very first time immediately.
	 * 🚫 debounces not at the most current value.
	 * 🚫 executes the script only on stop of user input.
	 */
	/*import { debounce } from 'throttle-debounce'

	watch(text, debounce(300, true, changeHandler))*/


	/**
	 * Solution 4 🥳
	 * ✅ Debounces at the very first time immediately.
	 * ✅ debounces at the most current value. 
	 * ✅ executes the script always, and doesn't wait until user stops inputting.
	 */
	/*import { throttle } from 'throttle-debounce'

	watch(text, throttle(1000, false, changeHandler))*/
</script>