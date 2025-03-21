<script lang="ts">
	import { page } from '$app/state';
	import type { PageData } from './$types';
	import toast from 'svelte-french-toast';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	dayjs.extend(relativeTime);

	type Props = {
		data: PageData;
	};

	function pluralizeClicks(count: number) {
		if (count > 1 || count === 0) {
			return 'clicks';
		}

		return 'click';
	}

	function getSlugUrl(slug: string) {
		return `${page.url.protocol}//${page.url.host}/r/${slug}`;
	}

	function copySlugUrl(slug?: string) {
		if (!slug) return;
		navigator.clipboard.writeText(getSlugUrl(slug));
		toast.success('Copied URL to clipboard');
	}

	function getExpiredText(expiresAt: Date) {
		if (expiresAt > new Date()) {
			return `Expires ${dayjs(expiresAt).fromNow()}`;
		}
		return `Expired ${dayjs().to(expiresAt)}`;
	}

	let { data }: Props = $props();
</script>

<main class="flex h-screen items-center justify-center">
	<div
		class="bg-dark-gray-400 border-dark-gray-600 flex w-[600px] flex-col gap-2 rounded border p-4"
	>
		<h1 class="mb-4 text-center text-2xl text-white">My URLs</h1>
		{#if data.urls.length === 0}
			<p class="text-light-gray-400 text-center text-lg">You haven't created any URLs yet</p>
		{:else}
			<ul
				class="flex max-h-[400px] flex-col gap-2 overflow-y-auto [scrollbar-color:#343434_#282828] [scrollbar-width:thin]"
			>
				{#each data.urls as url}
					<li class="bg-dark-gray-600 rounded px-3 py-1 text-white">
						<p>
							<button
								onclick={() => copySlugUrl(url.slug)}
								class="cursor-pointer text-blue-400 hover:text-blue-300">{url.slug}</button
							>
							• {url.clicks}
							{pluralizeClicks(url.clicks)} •
							<span class={url.expiresAt < new Date() ? 'text-red-400' : ''}
								>{getExpiredText(url.expiresAt)}</span
							>
						</p>
						<!-- TODO: consider doing some overflow wrapping on the url text, it looks kinda ugly -->
						<a
							class="text-light-gray-900 hover:text-light-gray-800 [overflow-wrap:anywhere]"
							href={url.destination}>{url.destination}</a
						>
					</li>
				{/each}
			</ul>
		{/if}
		<div class="text-center">
			<div>
				<a href="/" class="text-light-gray-800 hover:text-light-gray-300 underline">Create a URL</a>
			</div>
			<div>
				<a href="/api/auth/logout" class="text-light-gray-800 hover:text-light-gray-300 underline"
					>Logout</a
				>
			</div>
		</div>
	</div>
</main>
