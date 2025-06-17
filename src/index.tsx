import { h, render } from 'preact';
import { App } from './App';

const rootElement = document.getElementById('app');
if (rootElement) {
    render(<App />, rootElement);
} else {
    console.error("Root element #app not found in the DOM. Preact application cannot be mounted.");
}
