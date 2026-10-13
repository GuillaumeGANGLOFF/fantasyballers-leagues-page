<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { popupConfig } from '$lib/utils/popupConfig.js';

	const storageKey = `fb_announcement_dismissed_${popupConfig.id}`;
	const titleId = 'announcement-popup-title';

	let open = $state(false);

	function dismiss() {
		if (browser) {
			localStorage.setItem(storageKey, '1');
		}
		open = false;
	}

	function handleKeydown(event) {
		if (open && event.key === 'Escape') {
			dismiss();
		}
	}

	onMount(() => {
		if (!popupConfig.enabled) return;
		const dismissed = localStorage.getItem(storageKey);
		if (!dismissed) {
			open = true;
		}
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<div class="announcement-overlay" transition:fade={{ duration: 200 }}>
		<div class="announcement-backdrop" aria-hidden="true"></div>
		<div
			class="announcement-dialog"
			role="dialog"
			aria-modal="true"
			aria-labelledby={titleId}
		>
			<h2 id={titleId} class="announcement-title">{popupConfig.title}</h2>
			<div class="announcement-message">
				{@html popupConfig.message}
			</div>
			<button type="button" class="announcement-ok" onclick={dismiss}>
				{popupConfig.okLabel}
			</button>
		</div>
	</div>
{/if}

<style>
	.announcement-overlay {
		position: fixed;
		inset: 0;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		box-sizing: border-box;
	}

	.announcement-backdrop {
		position: absolute;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.45);
	}

	.announcement-dialog {
		position: relative;
		z-index: 1;
		width: min(100%, 28rem);
		max-height: min(90vh, 32rem);
		overflow-y: auto;
		padding: 1.75rem 1.5rem 1.5rem;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
		text-align: center;
	}

	.announcement-title {
		margin: 0 0 1rem;
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--blueOne, #352a7e);
	}

	.announcement-message {
		margin: 0 0 1.5rem;
		font-size: 1rem;
		line-height: 1.5;
		color: #333;
	}

	.announcement-message :global(p) {
		margin: 0 0 0.75rem;
	}

	.announcement-message :global(p:last-child) {
		margin-bottom: 0;
	}

	.announcement-message :global(a) {
		color: var(--blueOne, #352a7e);
		font-weight: 500;
	}

	.announcement-message :global(strong) {
		font-weight: 700;
	}

	.announcement-ok {
		display: inline-block;
		min-width: 6rem;
		padding: 0.65rem 1.5rem;
		font-size: 1rem;
		font-weight: 500;
		color: #fff;
		background-color: var(--blueOne, #352a7e);
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	.announcement-ok:hover {
		background-color: #271d5e;
	}

	.announcement-ok:focus-visible {
		outline: 2px solid var(--blueOne, #352a7e);
		outline-offset: 3px;
	}

	@media (max-width: 480px) {
		.announcement-dialog {
			padding: 1.5rem 1.15rem 1.25rem;
		}

		.announcement-title {
			font-size: 1.25rem;
		}
	}
</style>
