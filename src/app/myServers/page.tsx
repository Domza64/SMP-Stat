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
    <section className="flex flex-col w-full max-w-6xl mx-auto py-16">
      <h1 className="text-3xl font-bold mb-4">My Servers:</h1>
      <ul className="flex flex-wrap gap-4">
        {userData.servers.map((server: any) => (
          <li
            className="bg-gray-700 rounded-lg hover:bg-gray-600 w-48 h-32"
            key={server.serverId}
          >
            <Link
              href={`/server/${server.serverId}`}
              key={server.serverId}
              className="p-2 flex justify-between h-full flex-col"
            >
              <span className="text-2xl font-bold">{server.name}</span>
              <div className="flex flex-col">
                <div className="flex justify-between">
                  <span className="font-semibold">Players online:</span>
                  <span className="font-semibold text-lg">2/16</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
        <li>
          <form
            action={createServer}
            className="bg-gray-700 rounded-lg w-64 h-32 flex flex-col p-2 gap-2"
          >
            <label htmlFor="serverName" className="text-lg font-semibold">
              Add new server
            </label>
            <input
              type="text"
              name="serverName"
              placeholder="Server Name"
              className="text-black rounded"
              required
            />
            <button className="bg-green-400 text-black rounded p-1 px-2 font-semibold hover:bg-green-300 transition-all">
              Add Server
            </button>
          </form>
        </li>
      </ul>
    </section>
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
