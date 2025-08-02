import { render } from "preact";
import { App } from "./App";

// Import Bootstrap JS so it is bundled by Vite
import "bootstrap/dist/js/bootstrap.bundle.min.js";

render(<App />, document.body);
