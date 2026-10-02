import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  /* ONE COPY OF REACT, AND THIS IS LOAD-BEARING IN DEV.
   *
   * `@vercel/analytics/react` is a second entry point, and Vite's dependency
   * optimizer pre-bundled it with its OWN copy of React — the browser loaded
   * `react.js?v=12d294d1` for it while react-dom came from `?v=b2114662`.
   * Two copies means two dispatchers, so the component's first `useEffect`
   * threw "Cannot read properties of null", React logged "Invalid hook call",
   * and the <Analytics> subtree crashed on every page.
   *
   * It survived a full `rm -rf node_modules/.vite` and a server restart, so it
   * is not a stale-cache artifact. `dedupe` makes every importer resolve to the
   * one install; `optimizeDeps.include` makes the optimizer pre-bundle the
   * analytics entry in the same pass rather than discovering it late and
   * splitting it off. */
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@vercel/analytics/react'],
  },
  server: {
    port: 3000,
    strictPort: false,
  },
})
