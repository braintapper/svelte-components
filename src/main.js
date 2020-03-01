import App from './App.svelte';



import Sugar from "sugar";
Sugar.extend()

import uuid from "uuid";
window.uuid = uuid;

const app = new App({
	target: document.body,
	props: {
    environment: "environment"
	}
});

export default app;
