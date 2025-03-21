<script lang="ts">
	type Props = {
		class?: string;
		value?: string;
		name?: string;
		placeholder?: string;
		type?: 'text' | 'email' | 'password';
		disabled?: boolean;
		oninput?: (event: Event) => void;
	};

	let { class: className, value = $bindable(''), ...props }: Props = $props();
</script>

<input
	bind:value
	{...props}
	class="border-dark-gray-700 bg-dark-gray-500 w-full rounded border px-2 py-2 text-white {className}"
/>
