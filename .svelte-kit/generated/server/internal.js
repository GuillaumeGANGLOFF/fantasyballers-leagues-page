
import root from '../root.svelte';
import { set_building } from '__sveltekit/environment';
import { set_assets } from '__sveltekit/paths';
import { set_private_env, set_public_env } from '../../../node_modules/@sveltejs/kit/src/runtime/shared-server.js';

export const options = {
	app_template_contains_nonce: false,
	csp: {"mode":"auto","directives":{"upgrade-insecure-requests":false,"block-all-mixed-content":false},"reportOnly":{"upgrade-insecure-requests":false,"block-all-mixed-content":false}},
	csrf_check_origin: true,
	track_server_fetches: false,
	embedded: false,
	env_public_prefix: 'PUBLIC_',
	env_private_prefix: '',
	hooks: null, // added lazily, via `get_hooks`
	preload_strategy: "modulepreload",
	root,
	service_worker: false,
	templates: {
		app: ({ head, body, assets, nonce, env }) => "<!DOCTYPE html>\n<html lang=\"en\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n\t\t<meta name=\"apple-mobile-web-app-capable\" content=\"yes\">\n\n\t\t<!-- favicons -->\n\t\t<link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"/favicons/apple-touch-icon.png\">\n\t\t<link rel=\"icon\" type=\"image/png\" sizes=\"32x32\" href=\"/favicons/favicon-32x32.png\">\n\t\t<link rel=\"icon\" type=\"image/png\" sizes=\"16x16\" href=\"/favicons/favicon-16x16.png\">\n\t\t<link rel=\"mask-icon\" href=\"/favicons/safari-pinned-tab.svg\" color=\"#352A7E\">\n\t\t<link rel=\"shortcut icon\" href=\"/favicons/favicon.ico\">\n\t\t<meta name=\"apple-mobile-web-app-title\" content=\"League Page\">\n\t\t<meta name=\"application-name\" content=\"League Page\">\n\t\t<meta name=\"msapplication-TileColor\" content=\"#505051\">\n\t\t<meta name=\"msapplication-config\" content=\"/favicons/browserconfig.xml\">\n\t\t<meta name=\"theme-color\" content=\"#ffffff\">\n\n\t\t<!-- PWA -->\n\t\t<link rel=\"manifest\" href=\"/manifest.json\">\n\t\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-2048-2732.jpg\" media=\"(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)\">\n\t\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-2732-2048.jpg\" media=\"(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)\">\n\t\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-1668-2388.jpg\" media=\"(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)\">\n\t\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-2388-1668.jpg\" media=\"(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)\">\n\t\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-1536-2048.jpg\" media=\"(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)\">\n\t\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-2048-1536.jpg\" media=\"(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)\">\n\t\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-1668-2224.jpg\" media=\"(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)\">\n\t\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-2224-1668.jpg\" media=\"(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)\">\n\t\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-1620-2160.jpg\" media=\"(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)\">\n\t\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-2160-1620.jpg\" media=\"(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)\">\n\t\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-1284-2778.jpg\" media=\"(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)\">\n\t\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-2778-1284.jpg\" media=\"(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)\">\n\t\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-1170-2532.jpg\" media=\"(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)\">\n\t\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-2532-1170.jpg\" media=\"(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)\">\n\t\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-1125-2436.jpg\" media=\"(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)\">\n\t\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-2436-1125.jpg\" media=\"(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)\">\n\t\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-1242-2688.jpg\" media=\"(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)\">\n\t\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-2688-1242.jpg\" media=\"(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)\">\n\t\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-828-1792.jpg\" media=\"(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)\">\n\t\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-1792-828.jpg\" media=\"(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)\">\n\t\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-1242-2208.jpg\" media=\"(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)\">\n\t\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-2208-1242.jpg\" media=\"(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)\">\n\t\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-750-1334.jpg\" media=\"(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)\">\n\t\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-1334-750.jpg\" media=\"(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)\">\n\t\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-640-1136.jpg\" media=\"(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)\">\n\t\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-1136-640.jpg\" media=\"(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)\">\n\n\t\t<!-- Fonts and CSS -->\n\t\t<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/icon?family=Material+Icons&display=swap\" />\n\t\t<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700&display=swap\" />\n\t\t<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap\" />\n\n\t\t<!-- SMUI Styles -->\n\t\t<link rel=\"stylesheet\" href=\"/smui.css\" media=\"(prefers-color-scheme: light)\" />\n\t\t<link rel=\"stylesheet\" href=\"/smui-dark.css\" media=\"screen and (prefers-color-scheme: dark)\" />\n\t\t" + head + "\n\t</head>\n\t<body>\n\t\t<div id=\"svelte\">" + body + "</div>\n\t</body>\n</html>\n",
		error: ({ status, message }) => "<!doctype html>\n<html lang=\"en\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<title>" + message + "</title>\n\n\t\t<style>\n\t\t\tbody {\n\t\t\t\t--bg: white;\n\t\t\t\t--fg: #222;\n\t\t\t\t--divider: #ccc;\n\t\t\t\tbackground: var(--bg);\n\t\t\t\tcolor: var(--fg);\n\t\t\t\tfont-family:\n\t\t\t\t\tsystem-ui,\n\t\t\t\t\t-apple-system,\n\t\t\t\t\tBlinkMacSystemFont,\n\t\t\t\t\t'Segoe UI',\n\t\t\t\t\tRoboto,\n\t\t\t\t\tOxygen,\n\t\t\t\t\tUbuntu,\n\t\t\t\t\tCantarell,\n\t\t\t\t\t'Open Sans',\n\t\t\t\t\t'Helvetica Neue',\n\t\t\t\t\tsans-serif;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tjustify-content: center;\n\t\t\t\theight: 100vh;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t.error {\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tmax-width: 32rem;\n\t\t\t\tmargin: 0 1rem;\n\t\t\t}\n\n\t\t\t.status {\n\t\t\t\tfont-weight: 200;\n\t\t\t\tfont-size: 3rem;\n\t\t\t\tline-height: 1;\n\t\t\t\tposition: relative;\n\t\t\t\ttop: -0.05rem;\n\t\t\t}\n\n\t\t\t.message {\n\t\t\t\tborder-left: 1px solid var(--divider);\n\t\t\t\tpadding: 0 0 0 1rem;\n\t\t\t\tmargin: 0 0 0 1rem;\n\t\t\t\tmin-height: 2.5rem;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t}\n\n\t\t\t.message h1 {\n\t\t\t\tfont-weight: 400;\n\t\t\t\tfont-size: 1em;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t@media (prefers-color-scheme: dark) {\n\t\t\t\tbody {\n\t\t\t\t\t--bg: #222;\n\t\t\t\t\t--fg: #ddd;\n\t\t\t\t\t--divider: #666;\n\t\t\t\t}\n\t\t\t}\n\t\t</style>\n\t</head>\n\t<body>\n\t\t<div class=\"error\">\n\t\t\t<span class=\"status\">" + status + "</span>\n\t\t\t<div class=\"message\">\n\t\t\t\t<h1>" + message + "</h1>\n\t\t\t</div>\n\t\t</div>\n\t</body>\n</html>\n"
	},
	version_hash: "1h753rp"
};

export function get_hooks() {
	return {};
}

export { set_assets, set_building, set_private_env, set_public_env };
