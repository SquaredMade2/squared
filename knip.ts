const config = {
  workspaces: {
    "apps/web": {
      entry: ["src/app/**/*.tsx", "**/page.tsx", "**/route.ts"],
      project: ["**/*.{js,ts,tsx}"],
      ignore: [
        "src/node_modules/**",
        "src/.next/**",
        "src/.turbo/**",
        "src/coverage/**",
        "src/dist/**",
        "src/__mocks__/**",
        "src/cypress/**"
      ],
    },
  },
};

export default config;
