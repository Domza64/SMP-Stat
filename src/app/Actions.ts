"use server";

import dbConnect from "@/lib/dbConnect";
import McServerModel from "@/model/McServerModel";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateServerAccess(formData: FormData) {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const actionUser = await getUser();

  const isPrivate = formData.get("isPrivate") == "on";
  const id = formData.get("id");

  if (!isAuthenticated) {
    redirect("/api/auth/login?post_login_redirect_url=/server/" + id);
  }

  await dbConnect();
  // Create server
  await McServerModel.updateOne(
    {
      _id: id,
      owner: actionUser.id,
    },
    {
      $set: {
        private: isPrivate,
      },
    }
  );

  revalidatePath("/server/" + id);
}
