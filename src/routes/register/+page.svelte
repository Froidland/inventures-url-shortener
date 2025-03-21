<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '$lib/api/client';
	import Button from '$lib/components/ui/Button.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import { HTTPError } from 'ky';

	async function submit(event: SubmitEvent) {
		event.preventDefault();

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const password2 = formData.get('password2') as string;

		if (password !== password2) {
			alert('Passwords do not match');
			return;
		}

		loading = true;
		try {
			await api.register(email, password);
			goto('/');
		} catch (err) {
			if (err instanceof HTTPError) {
				const message = await err.response.json<{ error: string }>();

				alert(message.error);
			}
		} finally {
			loading = false;
		}
	}

	let loading = $state(false);
</script>

<main class="flex h-screen items-center justify-center">
	<form
		onsubmit={submit}
		class="bg-dark-gray-400 border-dark-gray-600 flex min-w-[400px] flex-col gap-2 rounded border p-4"
	>
		<h1 class="mb-4 text-center text-2xl text-white">Register</h1>
		<TextInput type="email" name="email" placeholder="Email" />
		<TextInput type="password" name="password" placeholder="Password" />
		<TextInput type="password" name="password2" placeholder="Repeat password" />
		<Button
			disabled={loading}
			type="submit"
			class="border-green-700 bg-green-900 hover:border-green-500 hover:bg-green-700"
			>Register</Button
		>
		<div class="border-dark-gray-800 border-t border-solid"></div>
		<Button href="/login">Login</Button>
	</form>
</main>
