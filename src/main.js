import App from './App.svelte';



const app = new App({
	target: document.body,
	props: {
    environment: "environment"
	}
});

export default app;
