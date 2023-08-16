import type { Session, User } from "next-auth";
import type {JWT} from "next-auth/jwt";

type UserId = string;

declare module "next-auth/jwt" {
  export interface JWT {
    id: UserId;
    username?: string | null;
  }
}
declare module "next-auth" {
  export interface Session {
    user: User & {
      id: UserId;
      username?: string | null;
    }
  }
}