import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

import prismadb from "@/lib/prismadb";
import Navbar from "@/components/navbar";

export default async function Dashboard({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }



  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId: userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
