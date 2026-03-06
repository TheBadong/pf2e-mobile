import { build, defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      name: 'fvttMobile',
      entry: ['src/scripts/main.ts'],
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
      watch: { buildDelay: 100 },
    },
  },
});
