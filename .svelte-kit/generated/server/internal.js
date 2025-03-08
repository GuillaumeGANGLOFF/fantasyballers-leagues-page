
import root from '../root.js';
import { set_building, set_prerendering } from '__sveltekit/environment';
import { set_assets } from '__sveltekit/paths';
import { set_manifest, set_read_implementation } from '__sveltekit/server';
import { set_private_env, set_public_env, set_safe_public_env } from '../../../node_modules/@sveltejs/kit/src/runtime/shared-server.js';

export const options = {
	app_template_contains_nonce: false,
	csp: {"mode":"auto","directives":{"upgrade-insecure-requests":false,"block-all-mixed-content":false},"reportOnly":{"upgrade-insecure-requests":false,"block-all-mixed-content":false}},
	csrf_check_origin: true,
	embedded: false,
	env_public_prefix: 'PUBLIC_',
	env_private_prefix: '',
	hash_routing: false,
	hooks: null, // added lazily, via `get_hooks`
	preload_strategy: "modulepreload",
	root,
	service_worker: false,
	templates: {
		app: ({ head, body, assets, nonce, env }) => "<!DOCTYPE html>\n<html lang=\"fr\">\n<head>\n\t<meta charset=\"utf-8\" />\n\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n\t<meta name=\"apple-mobile-web-app-capable\" content=\"yes\">\n\n\t<!-- favicons -->\n\t<link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"/favicons/apple-touch-icon.png\">\n\t<link rel=\"icon\" type=\"image/png\" sizes=\"32x32\" href=\"/favicons/favicon-32x32.png\">\n\t<link rel=\"icon\" type=\"image/png\" sizes=\"16x16\" href=\"/favicons/favicon-16x16.png\">\n\t<link rel=\"mask-icon\" href=\"/favicons/safari-pinned-tab.svg\" color=\"#352A7E\">\n\t<link rel=\"shortcut icon\" href=\"/favicons/favicon.ico\">\n\t<meta name=\"apple-mobile-web-app-title\" content=\"League Page\">\n\t<meta name=\"application-name\" content=\"League Page\">\n\t<meta name=\"msapplication-TileColor\" content=\"#505051\">\n\t<meta name=\"msapplication-config\" content=\"/favicons/browserconfig.xml\">\n\t<meta name=\"theme-color\" content=\"#ffffff\">\n\n\t<!-- PWA -->\n\t<link rel=\"manifest\" href=\"/manifest.json\">\n\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-2048-2732.jpg\" media=\"(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)\">\n\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-2732-2048.jpg\" media=\"(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)\">\n\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-1668-2388.jpg\" media=\"(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)\">\n\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-2388-1668.jpg\" media=\"(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)\">\n\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-1536-2048.jpg\" media=\"(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)\">\n\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-2048-1536.jpg\" media=\"(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)\">\n\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-1668-2224.jpg\" media=\"(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)\">\n\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-2224-1668.jpg\" media=\"(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)\">\n\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-1620-2160.jpg\" media=\"(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)\">\n\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-2160-1620.jpg\" media=\"(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)\">\n\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-1284-2778.jpg\" media=\"(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)\">\n\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-2778-1284.jpg\" media=\"(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)\">\n\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-1170-2532.jpg\" media=\"(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)\">\n\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-2532-1170.jpg\" media=\"(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)\">\n\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-1125-2436.jpg\" media=\"(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)\">\n\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-2436-1125.jpg\" media=\"(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)\">\n\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-1242-2688.jpg\" media=\"(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)\">\n\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-2688-1242.jpg\" media=\"(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)\">\n\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-828-1792.jpg\" media=\"(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)\">\n\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-1792-828.jpg\" media=\"(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)\">\n\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-1242-2208.jpg\" media=\"(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)\">\n\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-2208-1242.jpg\" media=\"(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)\">\n\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-750-1334.jpg\" media=\"(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)\">\n\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-1334-750.jpg\" media=\"(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)\">\n\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-640-1136.jpg\" media=\"(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)\">\n\t<link rel=\"apple-touch-startup-image\" href=\"pwa/apple-splash-1136-640.jpg\" media=\"(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)\">\n\n\t<!-- Fonts and CSS -->\n\t<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/icon?family=Material+Icons&display=swap\" />\n\t<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700&display=swap\" />\n\t<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap\" />\n\n\t<!-- SMUI Styles -->\n\t<link rel=\"stylesheet\" href=\"/smui.css\" media=\"(prefers-color-scheme: light)\" />\n\t<link rel=\"stylesheet\" href=\"/smui-dark.css\" media=\"screen and (prefers-color-scheme: dark)\" />\n\t" + head + "\n\n\t<!-- Google tag (gtag.js) -->\n\t<script async src=\"https://www.googletagmanager.com/gtag/js?id=G-74NZ3EZ0JC\"></script>\n\t<script>\n\t\twindow.dataLayer = window.dataLayer || [];\n\t\tfunction gtag(){dataLayer.push(arguments);}\n\t\tgtag('js', new Date());\n\n\t\tgtag('config', 'G-74NZ3EZ0JC');\n\t</script>\n\n\t<!-- Cookie Consent -->\n\t<link rel=\"stylesheet\" type=\"text/css\" href=\"https://cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.1.0/cookieconsent.min.css\" />\n\t<script src=\"https://cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.1.0/cookieconsent.min.js\"></script>\n\t<script>\n\t\twindow.addEventListener('load', function() {\n\t\t\twindow.cookieconsent.initialise({\n\t\t\t\tpalette: {\n\t\t\t\t\tpopup: { background: \"#000\" },\n\t\t\t\t\tbutton: { background: \"#f1d600\" }\n\t\t\t\t},\n\t\t\t\ttheme: \"classic\",\n\t\t\t\ttype: \"opt-in\",\n\t\t\t\tcontent: {\n\t\t\t\t\tmessage: \"Ce site utilise des cookies pour vous garantir la meilleure expérience.\",\n\t\t\t\t\tdismiss: \"Accepter\",\n\t\t\t\t\tallow: \"Accepter\",\n\t\t\t\t\tdeny: \"Refuser\",\n\t\t\t\t},\n\t\t\t\tonInitialise: function (status) {\n\t\t\t\t\tif (this.hasConsented()) {\n\t\t\t\t\t\t// Load Google Analytics here if consent is given\n\t\t\t\t\t\tgtag('config', 'G-74NZ3EZ0JC');\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\tonStatusChange: function(status) {\n\t\t\t\t\tif (this.hasConsented()) {\n\t\t\t\t\t\t// Load Google Analytics here if consent is given\n\t\t\t\t\t\tgtag('config', 'G-74NZ3EZ0JC');\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\tonRevokeChoice: function() {\n\t\t\t\t\t// Disable Google Analytics if consent is revoked\n\t\t\t\t\twindow['ga-disable-G-74NZ3EZ0JC'] = true;\n\t\t\t\t}\n\t\t\t})\n\t\t});\n\t</script>\n</head>\n<body>\n<div id=\"svelte\">" + body + "</div>\n</body>\n</html>\n",
		error: ({ status, message }) => "<!doctype html>\n<html lang=\"en\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<title>" + message + "</title>\n\n\t\t<style>\n\t\t\tbody {\n\t\t\t\t--bg: white;\n\t\t\t\t--fg: #222;\n\t\t\t\t--divider: #ccc;\n\t\t\t\tbackground: var(--bg);\n\t\t\t\tcolor: var(--fg);\n\t\t\t\tfont-family:\n\t\t\t\t\tsystem-ui,\n\t\t\t\t\t-apple-system,\n\t\t\t\t\tBlinkMacSystemFont,\n\t\t\t\t\t'Segoe UI',\n\t\t\t\t\tRoboto,\n\t\t\t\t\tOxygen,\n\t\t\t\t\tUbuntu,\n\t\t\t\t\tCantarell,\n\t\t\t\t\t'Open Sans',\n\t\t\t\t\t'Helvetica Neue',\n\t\t\t\t\tsans-serif;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tjustify-content: center;\n\t\t\t\theight: 100vh;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t.error {\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tmax-width: 32rem;\n\t\t\t\tmargin: 0 1rem;\n\t\t\t}\n\n\t\t\t.status {\n\t\t\t\tfont-weight: 200;\n\t\t\t\tfont-size: 3rem;\n\t\t\t\tline-height: 1;\n\t\t\t\tposition: relative;\n\t\t\t\ttop: -0.05rem;\n\t\t\t}\n\n\t\t\t.message {\n\t\t\t\tborder-left: 1px solid var(--divider);\n\t\t\t\tpadding: 0 0 0 1rem;\n\t\t\t\tmargin: 0 0 0 1rem;\n\t\t\t\tmin-height: 2.5rem;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t}\n\n\t\t\t.message h1 {\n\t\t\t\tfont-weight: 400;\n\t\t\t\tfont-size: 1em;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t@media (prefers-color-scheme: dark) {\n\t\t\t\tbody {\n\t\t\t\t\t--bg: #222;\n\t\t\t\t\t--fg: #ddd;\n\t\t\t\t\t--divider: #666;\n\t\t\t\t}\n\t\t\t}\n\t\t</style>\n\t</head>\n\t<body>\n\t\t<div class=\"error\">\n\t\t\t<span class=\"status\">" + status + "</span>\n\t\t\t<div class=\"message\">\n\t\t\t\t<h1>" + message + "</h1>\n\t\t\t</div>\n\t\t</div>\n\t</body>\n</html>\n"
	},
	version_hash: "11gezzo"
};

export async function get_hooks() {
	let handle;
	let handleFetch;
	let handleError;
	let init;
	

	let reroute;
	let transport;
	

	return {
		handle,
		handleFetch,
		handleError,
		init,
		reroute,
		transport
	};
}

export { set_assets, set_building, set_manifest, set_prerendering, set_private_env, set_public_env, set_read_implementation, set_safe_public_env };
