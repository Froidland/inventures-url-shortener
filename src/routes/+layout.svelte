<script lang="ts">
	import { Toaster } from 'svelte-french-toast';
	import '../app.css';
	let { children } = $props();
</script>

<Toaster
	position="top-center"
	toastOptions={{ style: 'background-color: #282828; color: white; border: 1px solid #3e3e3e;' }}
/>
{@render children()}
