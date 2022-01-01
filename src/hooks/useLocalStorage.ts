import { computed, ref } from 'vue'


// Helpers
const _ls_getItem = ({ key, defaultValue }: { key: string, defaultValue: any }) => {
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

const _ls_setItem = ({ key, value }: { key: string, value: any }) => {
	let newVal = ''

	try {
		newVal = JSON.stringify(value)
	} catch (_) {}

	localStorage.setItem(key, newVal)
}


export default function useLocalStorage({ 
	key,
	defaultValue = null,
	validator = () => true,
}: {
	key: string,
	defaultValue?: any,
	validator?: (value: any) => boolean,
}) {
	if (!key)
		throw new TypeError('You must define a key for useLocalStorage.')
		
	const _lsValue = _ls_getItem({ key, defaultValue })
	const _ref = ref(_lsValue)

	const val = computed({
		get: () => _ref.value,
		set: (value) => {
			if (!validator(value)) 
				return console.error('Invalid validator value for useLocalStorage:', { value, validator })

			_ls_setItem({ key, value })
			_ref.value = value
		}
	})

	return val
}



