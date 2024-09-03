const config = {
  workspaces: {
    "apps/web": {
      entry: ["src/app/**/*.tsx", "**/page.tsx", "**/route.ts"],
      project: ["**/*.{js,ts,tsx}"],
      ignore: [
        "**/node_modules/**",
        "**/.next/**",
        "**/.turbo/**",
        "**/coverage/**",
        "**/dist/**",
      ],
    },
  },
};

export default config;
