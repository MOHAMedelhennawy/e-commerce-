import { beforeEach } from "@jest/globals";
import { cleanDatabase } from "./helpers";

beforeEach(async () => {
  await cleanDatabase();
});
