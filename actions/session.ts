"use server";

import { cookies } from "next/headers";

export async function createCookie(
  userId: string,
  email: string,
  name: string
) {
  cookies().set({
    name: "id",
    value: userId,
    httpOnly: true,
    path: "/",
  });
  cookies().set({
    name: "email",
    value: email,
    httpOnly: true,
    path: "/",
  });
  cookies().set({
    name: "name",
    value: name,
    httpOnly: true,
    path: "/",
  });
}

export async function getCookie() {
  return await cookies();
}

export async function getIdCookie() {
  return await cookies().get("id")?.value;
}

export async function deleteCookie() {
  await cookies().delete("name");
}
