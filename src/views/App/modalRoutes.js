import { onMounted, computed, readonly, ref, watchEffect, toRefs, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { historyState, showUserModal, closeUserModal } from '@/utils/modal'

const users = readonly([
	{ name: 'John' },
	{ name: 'Jessica' },
	{ name: 'James' },
])

export const Home = defineComponent({
	template: `<div class="Home">
		<h1>Home</h1>
		<p>Select a user</p>
		<ul>
			<li v-for="(user, id) in users">
				<b>{{ user.name }}</b>
				- <button @click="showUserModal(id, router)">Details</button>
			</li>
		</ul>
		<dialog ref="modal" id="dialog">
			<div>
				<div v-if="userId">
					<p>
					User #{{ userId }}
					<br>
					Name: {{ users[userId].name }}
					</p>
					<router-link :to="{ name: 'App-Test' }">Go somewhere else</router-link>
					<br>
					<button @click="closeUserModal">Close</button>
				</div>
			</div>
		</dialog>
	</div>`,

	setup() {
		const modal = ref()
		const route = useRoute()
		const router = useRouter()
		// const historyState = computed(() => route.fullPath && window.history.state)

		const userId = computed(() => route.params.id)

		watchEffect(
			() => {
				const el = modal.value
				if (!el) return

				const show = historyState.value.backgroundView
				if (show) {
					if ('show' in el) el.show()
					else el.setAttribute('open', '')
				} else {
					if ('close' in el) el.close()
					else el.removeAttribute('open')
				}
			},
			{ flush: 'post' }
		)

		return {
			modal,
			historyState,
			showUserModal,
			closeUserModal,
			userId,
			users,
			router,
		}
	},
})

export const UserDetails = defineComponent({
	template: `<div class="UserDetails">
		<h1>User #{{ id }}</h1>
		<p>
			Name: {{ users[id].name }}
		</p>
		<router-link to="/">Back home</router-link>
	</div>`,
	props: {
		id: {
			type: String,
			required: true,
		},
	},
	data: () => ({ users }),
})