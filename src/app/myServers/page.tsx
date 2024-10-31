import dbConnect from "@/lib/dbConnect";
import McServerModel from "@/model/McServerModel";
import UserModel from "@/model/UserModel";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import crypto from "crypto";
import { redirect } from "next/navigation";

export default async function Server() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userData = await getUserData(user.id);

  async function createServer(formData: FormData) {
    "use server";

    const serverName = formData.get("serverName");
    const serverSecret = crypto.randomBytes(16).toString("hex");

    await dbConnect();
    // Create server
    const server = await McServerModel.create({
      serverName,
      serverSecret,
      owner: user.id,
    });
    // Update the user's servers
    await UserModel.updateOne(
      {
        kindeUserId: user.id,
      },
      {
        $push: {
          servers: {
            name: server.serverName,
            serverId: server._id,
          },
        },
      }
    );

    redirect("/server/" + server._id);
  }

  return (
    <div>
      <h1>Servers:</h1>
      {userData.servers.map((server: any) => (
        <Link
          href={`/server/${server.serverId}`}
          key={server.serverId}
          className="p-2 m-2 bg-gray-700 w-max rounded-lg hover:bg-gray-600"
        >
          <span>{server.name}</span>
        </Link>
      ))}
      <form
        action={createServer}
        className="bg-gray-700 w-max flex flex-col my-12 p-4 gap-2"
      >
        <h2 className="text-lg font-bold">Add new server</h2>
        <input
          type="text"
          name="serverName"
          placeholder="Server Name"
          className="text-black"
        />
        <button className="bg-green-400 text-black">Add Server</button>
      </form>
    </div>
  );
}

async function getUserData(kindeUserId: string) {
  await dbConnect();

  // Fetch the user data
  var userData = await UserModel.findOne({
    kindeUserId: kindeUserId,
  });

  if (!userData) {
    userData = await UserModel.create({ kindeUserId: kindeUserId });
  }

  return userData;
}
