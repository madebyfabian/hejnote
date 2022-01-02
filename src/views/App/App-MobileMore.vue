<template>
	<div class="-mx-4">
		<h1 class="mx-4 mb-8">More</h1>
		<section>
			<h2 class="mx-4 mb-2">Others</h2>

			<Cell isTypeNavigation :navigateTo="{ name: 'App-Search' }" dividerInset>
				<template #icon>
					<IconSearch />
				</template>
				Search
			</Cell>

			<Cell isTypeNavigation :navigateTo="{ name: 'App-Archive' }" dividerInset>
				<template #icon>
					<IconArchive />
				</template>
				Archive
			</Cell>

			<Cell isTypeNavigation :navigateTo="{ name: 'App-Deleted' }" dividerInset>
				<template #icon>
					<IconTrash />
				</template>
				Trash
			</Cell>
		</section>

		<section>
			<h2 class="mx-4 mt-8 mb-1.5">Settings</h2>
			<div class="mx-1">
				<SwitchHiddenMode />
			</div>
		</section>
	</div>
	
</template>

<script lang="ts" setup>
	import { Cell } from '@/components/ui'
	import { SwitchHiddenMode } from '@/components/layouts'
	import { IconArchive, IconTrash, IconMoreSolid, IconSearch } from '@/assets/icons'
</script>