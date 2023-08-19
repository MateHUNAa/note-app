import type { Session, User } from "next-auth";
import type { Roles } from "@prisma/client";
import type {JWT} from "next-auth/jwt";

type UserId = string;

declare module "next-auth/jwt" {
  export interface JWT {
    id: UserId;
  }
}
declare module "next-auth" {
  export interface Session {
    user: User & {
      id: UserId;
      role: Roles;
      name: string | null; 
      email: string;
      image: string;
      username: string;
      emailVerified: DateTime
    }
  }
}
