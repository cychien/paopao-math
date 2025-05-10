import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["production", "development", "test"] as const),
  SESSION_SECRET: z.string(),
  HONEYPOT_SECRET: z.string(),
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof schema> {}
  }
}
