import pkg from '@squared/builder';
const {build} = pkg;

build("src/index.ts", ["express", "@squared/context", "@squared/logger", "zod"])