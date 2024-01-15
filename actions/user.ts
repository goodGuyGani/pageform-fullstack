"use server";
import prisma from "@/lib/prisma";
import { createUserSchemaType } from "@/schema/createUser";

export async function createUser(form: createUserSchemaType) {
  return await prisma.user.create({
    data: {
      email: form.email,
      firstName: form.firstName,
      lastName: form.lastName,
      password: form.password,
    },
  });
}

export async function getUser(email: string, password: string) {
  return await prisma.user.findFirst({
    where: {
      email: email,
      password: password,
    },
  });
}
