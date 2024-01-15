"use server";

import prisma from "@/lib/prisma";
import { formSchema, formSchemaType } from "@/schemas/form";

class UserNotFoundErr extends Error {}

export async function GetFormStats(id:number) {
  

  const stats = await prisma.form.aggregate({
    where: {
      userId: id,
    },
    _sum: {
      visits: true,
      submissions: true,
    },
  });

  const visits = stats._sum.visits || 0;
  const submissions = stats._sum.submissions || 0;

  let submissionRate = 0;

  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
  }

  const bounceRate = 100 - submissionRate;

  return {
    visits,
    submissions,
    submissionRate,
    bounceRate,
  };
}

export async function CreateForm(data: formSchemaType, id:any) {
  const validation = formSchema.safeParse(data);
  if (!validation.success) {
    throw new Error("form not valid");
  }

  const { name, description } = data;

  const form = await prisma.form.create({
    data: {
      userId: id,
      name,
      description,
    },
  });

  if (!form) {
    throw new Error("something went wrong");
  }

  return form.id;
}

export async function GetForms(id:number) {

  return await prisma.form.findMany({
    where: {
      userId: id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function GetFormById(id: number, userId: number) {

  return await prisma.form.findUnique({
    where: {
      userId: userId,
      id,
    },
  });
}

export async function UpdateFormContent(id: number, jsonContent: string, userId: number) {

  return await prisma.form.update({
    where: {
      userId: userId,
      id,
    },
    data: {
      content: jsonContent,
    },
  });
}

export async function PublishForm(id: number, userId: number) {

  return await prisma.form.update({
    data: {
      published: true,
    },
    where: {
      userId: userId,
      id,
    },
  });
}

export async function GetFormContentByUrl(formUrl: string) {
  return await prisma.form.update({
    select: {
      content: true,
    },
    data: {
      visits: {
        increment: 1,
      },
    },
    where: {
      shareURL: formUrl,
    },
  });
}

export async function SubmitForm(formUrl: string, content: string) {
  return await prisma.form.update({
    data: {
      submissions: {
        increment: 1,
      },
      FormSubmissions: {
        create: {
          content,
        },
      },
    },
    where: {
      shareURL: formUrl,
      published: true,
    },
  });
}

export async function GetFormWithSubmissions(id: number, userId: number) {

  return await prisma.form.findUnique({
    where: {
      userId: userId,
      id,
    },
    include: {
      FormSubmissions: true,
    },
  });
}
