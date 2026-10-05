import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { mockApi } from './server/mockApi';

export default defineConfig({
  plugins: [react(), mockApi()],
  // mock/db.json is written by the mock API; it must not trigger a dev-server reload.
  server: { watch: { ignored: ['**/mock/**'] } },
});
