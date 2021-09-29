import { computed, ref } from 'vue'


// Helpers
const _ls_getItem = ({ key, defaultValue }) => {
	const val = localStorage.getItem(key)
	if (val === null) {
		_ls_setItem({ key, value: defaultValue })
		return defaultValue
	}

	try {
		return JSON.parse(val)
	} catch (error) {
		return localStorage.getItem(key)
	}
}

const _ls_setItem = ({ key, value }) => {
	let newVal 

	try {
		newVal = JSON.stringify(value)
	} catch (_) {}

	localStorage.setItem(key, newVal)
}



/**
 * @returns {import('vue').WritableComputedRef<any>}
 */
export default function useLocalStorage({ 
	key,
	defaultValue = null,
	validator = () => true,
}) {
	if (!key)
		return console.error('You must define a key for useLocalStorage.')
		
	const _lsValue = _ls_getItem({ key, defaultValue })
	const _ref = ref(_lsValue)

	const val = computed({
		get: () => _ref.value,
		set: (value) => {
			console.log({ value, validator })
			if (!validator(value)) 
				return console.error('Invalid validator value for useLocalStorage:', { value, validator })

			_ls_setItem({ key, value })
			_ref.value = value
		}
	})

	return val
}



