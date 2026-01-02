// Client-side API exports only
import { admin } from "./admin";
import { auth } from "./auth-client";
import { client } from "./client";
import { partner } from "./partner";

export const api = {
  auth,
  admin,
  client,
  partner,
};
