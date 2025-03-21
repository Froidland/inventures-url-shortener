<script lang="ts">
	import { Button, type ButtonRootProps } from 'bits-ui';

	type Props = ButtonRootProps;

	let { children, class: className, ...props }: Props = $props();
</script>

<Button.Root
	class="border-dark-gray-700 bg-dark-gray-500 text-light-gray-400 hover:border-dark-gray-800 hover:bg-dark-gray-600 inline-flex cursor-pointer items-center justify-center gap-1 rounded-md border-[1px] px-4 py-2 transition-colors select-none disabled:cursor-auto disabled:opacity-50 {className}"
	{...props}
>
	{@render children?.()}
</Button.Root>
