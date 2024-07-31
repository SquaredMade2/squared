export const log = (...args: Parameters<typeof console.log>) => {
  console.log("logger:", ...args);
};
