<script lang="ts">
	import { api } from '$lib/api/client';
	import type { TCreateUrlData } from '$lib/api/types';
	import Button from '$lib/components/ui/Button.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import type { PageData } from './$types';
	import { page } from '$app/state';
	import { SvelteMap } from 'svelte/reactivity';
	import { toast } from 'svelte-french-toast';
	import { HTTPError } from 'ky';

	type Props = {
		data: PageData;
	};

	const slugRegex = /^[a-zA-Z0-9]+$/;

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		errors.clear();

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		const destination = formData.get('destination') as string;
		const slug = formData.get('slug') as string | null;

		try {
			new URL(destination);
		} catch {
			errors.set('destination', 'Invalid URL');
		}

		if (slug) {
			if (slug.length > 32) {
				errors.set('slug', 'Slug must be 32 characters or less');
			}

			if (slug.length > 0 && !slugRegex.test(slug)) {
				errors.set('slug', 'Slug can only contain alphanumeric characters');
			}
		}

		if (errors.size > 0) {
			return;
		}

		loading = true;
		try {
			url = await api.createUrl(destination, slug || undefined);
		} catch (err) {
			if (err instanceof HTTPError && err.response.status === 409) {
				errors.set('slug', 'URL with this slug already exists');
				return;
			}

			toast.error('Unable to create URL, please try again');
		} finally {
			loading = false;
		}

		errors.clear();
		form.reset();
	}

	function getSlugUrl(slug: string) {
		return `${page.url.protocol}//${page.url.host}/r/${slug}`;
	}

	function copyUrl(slug?: string) {
		if (!slug) return;
		navigator.clipboard.writeText(getSlugUrl(slug));
		toast.success('Copied URL to clipboard');
	}

	const { data }: Props = $props();
	let url = $state<TCreateUrlData>();
	let loading = $state(false);
	let errors = $state(new SvelteMap<string, string>());
</script>

<main class="flex h-screen items-center justify-center">
	<form
		onsubmit={submit}
		class="bg-dark-gray-400 border-dark-gray-600 flex min-w-[400px] flex-col gap-2 rounded border p-4"
	>
		<h1 class="mb-4 text-center text-2xl text-white">URL Shortener</h1>
		<TextInput type="text" name="destination" placeholder="Destination" />
		{#if errors.has('destination')}
			<p class="text-red-500">{errors.get('destination')}</p>
		{/if}
		{#if data.user}
			<TextInput type="text" name="slug" placeholder="Slug" />
			{#if errors.has('slug')}
				<p class="text-red-500">{errors.get('slug')}</p>
			{/if}
		{:else}
			<Button href="/login">Login to use a custom slug</Button>
		{/if}
		{#if url}
			<button
				type="button"
				onclick={() => copyUrl(url?.slug)}
				class="bg-dark-gray-600 hover:bg-dark-gray-700 flex h-12 cursor-pointer items-center justify-center rounded p-4 transition-colors"
			>
				<span class="text-lg text-blue-300">{getSlugUrl(url.slug)}</span>
			</button>
		{/if}
		<Button
			type="submit"
			disabled={loading}
			class="border-green-700 bg-green-900 hover:border-green-500 hover:bg-green-700">Create</Button
		>
		{#if data.user}
			<div class="text-center">
				<a class="text-light-gray-800 hover:text-light-gray-300 underline" href="/dashboard"
					>Go to my URLs</a
				>
			</div>
		{/if}
	</form>
</main>
