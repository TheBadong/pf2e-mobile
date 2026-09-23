import { build, defineConfig } from 'vite';

export default defineConfig({
  build: {
    watch: {
      buildDelay: 100,
      chokidar: {
        usePolling: true,
        interval: 100,
      },
    },
    lib: {
      name: 'fvttMobile',
      entry: ['src/main.ts'],
    },
    rollupOptions: {
      output: {
        assetFileNames: ({ names }) => {
          console.debug('test');
          const extension = names[0].split('.').slice(-1)[0];

          switch (extension) {
            case 'css':
              return 'styles/[name].css';
          }

          return names[0];
        },
      },
    },
  },
});
