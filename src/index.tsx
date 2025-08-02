import { render } from "preact";
import { App } from "./App";

// Import Bootstrap CSS and JS, and Bootstrap Icons CSS so Vite bundles them
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

render(<App />, document.body);
