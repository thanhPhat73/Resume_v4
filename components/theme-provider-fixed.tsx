layout.tsx
:30 A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won\'t be patched up. This can happen if a SSR-ed Client Component used:

- A server/client branch `
if (typeof window !== 'undefined')`.
- Variable input such as \`Date.now()\` or \`Math.random()\` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

  ...
    <HotReload assetPrefix="" globalError={[...]}>
      <AppDevOverlay state={{nextId:1, ...}} globalError={[...]}>
        <AppDevOverlayErrorBoundary globalError={[...]} onError={function bound dispatchSetState}>
          <ReplaySsrOnlyErrors>
          <DevRootHTTPAccessFallbackBoundary>
            <HTTPAccessFallbackBoundary notFound={<NotAllowedRootHTTPFallbackError>}>
              <HTTPAccessFallbackErrorBoundary pathname="/" notFound={<NotAllowedRootHTTPFallbackError>} ...>
                <RedirectBoundary>
                  <RedirectErrorBoundary router={{...}}>
                    <Head>
                    <link>
                    <RootLayout>
                      <html
                        lang="en"
-                       className="light mdl-js"
-                       style={{color-scheme:"light"}}
                      >
                        <head>
                        <body
-                         cz-shortcut-listen="true"
                        >
                    ...
        ...
