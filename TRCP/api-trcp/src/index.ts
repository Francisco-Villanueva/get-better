import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { z } from "zod";
import { db } from "./db";
import { publicProcedure, router } from "./trpc";

const appRouter = router({
  userList: publicProcedure.query(async () => await db.user.findMany()),
  useyById: publicProcedure
    .input(z.string())
    .query(async (opts) => await db.user.findById(opts.input)),
  userCreate: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async (opts) => await db.user.create(opts.input)),
});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
});

server.listen(3000);
console.log("Server running on port 3000");
