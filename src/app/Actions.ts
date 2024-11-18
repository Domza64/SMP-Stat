"use server";

import dbConnect from "@/lib/dbConnect";
import McServerModel from "@/model/McServerModel";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import UserModel from "@/model/UserModel";

export async function addUser(
  formData: FormData,
  serverId: string,
  serverName: string
) {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const actionUser = await getUser();

  if (!isAuthenticated) {
    redirect("/api/auth/login?post_login_redirect_url=/server/" + serverId);
  }

  const mailOrUsername = formData.get("mailOrUsername");

  await dbConnect();

  try {
    // First check if user exists
    const user = await UserModel.findOne({
      $or: [{ email: mailOrUsername }, { username: mailOrUsername }],
    });

    if (!user) {
      return { error: "USER_NOT_FOUND" };
    }

    // Check if user is already in the allowed users list
    const serverWithUser = await McServerModel.findOne({
      _id: serverId,
      "allowedUsers.kindeUserId": user.kindeUserId,
    });

    if (serverWithUser) {
      return { error: "USER_ALREADY_ADDED" };
    }

    // Add server to user's servers list
    await UserModel.findOneAndUpdate(
      { kindeUserId: user.kindeUserId },
      {
        $addToSet: { servers: { serverId: serverId, name: serverName } },
      }
    );

    const newAllowedUser = {
      kindeUserId: user.kindeUserId,
      username: user.username,
    };

    // Add user to server's allowed users list
    await McServerModel.findOneAndUpdate(
      {
        _id: serverId,
        owner: actionUser.id,
      },
      { $addToSet: { allowedUsers: newAllowedUser } }
    );

    revalidatePath("/server/" + serverId);
    return { error: null };
  } catch (error) {
    console.error("Error adding user:", error);
    return { error: "FAILED" };
  }
}

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
