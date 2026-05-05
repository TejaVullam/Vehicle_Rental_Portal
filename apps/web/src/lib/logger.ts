import pino from "pino";

const isServer = typeof window === "undefined";

export const logger = pino({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  transport:
    isServer && process.env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        }
      : undefined,
  browser: {
    asObject: true,
  },
});
