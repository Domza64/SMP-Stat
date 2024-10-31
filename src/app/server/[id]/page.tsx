import ServerSecretDisplay from "@/component/ServerSecretDisplay";
import dbConnect from "@/lib/dbConnect";
import McServerModel, { Player, Event } from "@/model/McServerModel";
import UserModel from "@/model/UserModel";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function Server({ params }: { params: { id: string } }) {
  const id = params.id;
  const serverData = await getData(id);

  if (!serverData) {
    return <div>Server not found</div>;
  }

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const privateServer = false;
  if (privateServer) {
    redirect("/api/auth/login?post_login_redirect_url=/server/" + id);
  }

  async function deleteServer() {
    "use server";

    const { getUser, isAuthenticated } = getKindeServerSession();
    const actionUser = await getUser();

    if (!isAuthenticated) {
      redirect("/api/auth/login?post_login_redirect_url=/server/" + id);
    }

    await dbConnect();
    // Create server
    const server = await McServerModel.findOneAndDelete({
      _id: id,
      owner: actionUser.id,
    });
    // Update the user's servers
    await UserModel.updateOne(
      {
        kindeUserId: actionUser.id,
      },
      {
        $pull: {
          servers: { serverId: server._id },
        },
      }
    );

    redirect("/myServers");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">{serverData.serverName}</h1>
      <h2 className="mt-4 text-xl">Players:</h2>
      <ul className="list-disc pl-5">
        {serverData.players.map((player: Player) => (
          <li key={player.name}>
            {player.name} - Deaths: {player.deaths}
          </li>
        ))}
      </ul>
      <h2 className="mt-4 text-xl">Events:</h2>
      <ul className="list-disc pl-5">
        {serverData.events.map((event: Event, index: number) => (
          <li key={index}>
            [{event.datetime.toString()}] {event.type}: {event.text}
          </li>
        ))}
      </ul>
      {user && serverData.owner === user.id && (
        <>
          <ServerSecretDisplay serverSecret={serverData.serverSecret} />
          <form action={deleteServer}>
            <button className="bg-red-400">Delete</button>
          </form>
        </>
      )}
    </div>
  );
}

async function getData(serverId: string) {
  await dbConnect();

  // Fetch the server data
  const serverData = await McServerModel.findOne({
    _id: serverId,
  });

  return serverData;
}
