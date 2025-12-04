import { createRouter } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { routeTree } from "./routeTree.gen.ts";
import "./styles/tailwind.css";
import "./common/i18n";

const router = createRouter({ routeTree });

export type TanstackRouter = typeof router;

declare module "@tanstack/react-router" {
	interface Register {
		// This infers the type of our router and registers it across your entire project
		router: TanstackRouter;
	}
}

const AppLoader = () => (
	<div className="flex min-h-screen items-center justify-center bg-background">
		<div className="flex flex-col items-center gap-4">
			<div className="h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-foreground" />
			<span className="text-sm text-muted-foreground">Loading...</span>
		</div>
	</div>
);

const rootElement = document.querySelector("#root") as Element;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<React.StrictMode>
			<React.Suspense fallback={<AppLoader />}>
				<App router={router} />
			</React.Suspense>
		</React.StrictMode>
	);
}
