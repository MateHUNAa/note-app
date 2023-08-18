import { User, Roles } from "@prisma/client";
import { db } from "@/lib/db";

export async function isAdminAsync(user: User): Promise<boolean> {
  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
    select: {
      role: true,
    },
  });

  if (!dbUser) {
    return false;
  }

  return dbUser.role === Roles.ADMIN;
}

export async function hasRole(
  user: User,
  requiredRole: Roles
): Promise<boolean> {
  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
    select: {
      role: true,
    },
  });

  if (!dbUser) {
    return false;
  }

  return dbUser.role === requiredRole;
}

export async function getRoleAsync(user: User): Promise<Roles> {
  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
    select: {
      role: true,
    },
  });

  if (!dbUser) {
    return Roles.USER;
  }

  return dbUser.role;
}

export function isAdmin(user: User): boolean {
  return user.role === Roles.ADMIN;
}
