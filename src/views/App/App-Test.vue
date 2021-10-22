<template>
	<button @click="useSnackbar().createSnackbar({ message: 'This is some very long snackbar content though that will last long', timeout: 9999999, buttonText: 'haha', onButtonClick })">open snackbar</button>
	<br><br>
	<button @click="useConfirm().doConfirm({ question: 'hello' })">confirm</button>
</template>

<script setup>
	import useSnackbar from '@/hooks/useSnackbar'
	import useConfirm from '@/hooks/useConfirm'

	const onButtonClick = () => {
		console.log('clicked');
	}
</script>