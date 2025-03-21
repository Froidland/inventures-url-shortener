<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	function submit(event: SubmitEvent) {
		event.preventDefault();
	}
</script>

<main class="flex h-screen items-center justify-center">
	<form
		onsubmit={submit}
		class="bg-dark-gray-400 border-dark-gray-600 flex min-w-[400px] flex-col gap-2 rounded border p-4"
	>
		<h1 class="text-center text-2xl text-white">Login</h1>
		<TextInput type="email" name="email" placeholder="Email" />
		<TextInput type="password" name="password" placeholder="Password" />
		<Button
			type="submit"
			class="border-green-700 bg-green-900 hover:border-green-500 hover:bg-green-700"
			>Sign in</Button
		>
		<div class="border-dark-gray-800 border-t border-solid"></div>
		<Button href="/register">Register</Button>
	</form>
</main>
