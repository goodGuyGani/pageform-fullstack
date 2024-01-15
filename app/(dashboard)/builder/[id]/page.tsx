import { GetFormById } from "@/actions/form";
import { getIdCookie } from "@/actions/session";
import FormBuilder from "@/components/FormBuilder";
import React from "react";

async function BuilderPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = params;
  const userId = await getIdCookie();
  const form = await GetFormById(Number(id), userId);
  if (!form) {
    throw new Error("form not found");
  }
  return <FormBuilder form={form} />;
}

export default BuilderPage;
