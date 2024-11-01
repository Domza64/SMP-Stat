import PrivateCheckboxForm from "@/component/PrivateCheckboxForm";
import ServerSecretDisplay from "@/component/ServerSecretDisplay";
import dbConnect from "@/lib/dbConnect";
import McServerModel, { Player, Event } from "@/model/McServerModel";
import UserModel from "@/model/UserModel";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { playerLastSeen } from "@/lib/TimeUtils";

export default async function Server({ params }: { params: { id: string } }) {
  const id = params.id;
  const serverData = await getData(id);

  if (!serverData) {
    return <div>Server not found</div>;
  }

  const { getUser, isAuthenticated } = getKindeServerSession();
  const user = await getUser();

  const privateServer = serverData.private;
  const isUserAuthenticated = await isAuthenticated();
  if (privateServer && (await !isUserAuthenticated)) {
    // TODO - Replace with user has access to server instead of just checking if user is authenticated
    return <div>This is a private server.</div>;
  }

  async function deleteServer(formData: FormData) {
    "use server";

    const { getUser, isAuthenticated } = getKindeServerSession();
    const actionUser = await getUser();

    if (!isAuthenticated) {
      redirect("/api/auth/login?post_login_redirect_url=/server/" + id);
    }

    const serverName = formData.get("serverName");
    if (serverName !== serverData.serverName) {
      redirect("/server/" + id);
    }

    await dbConnect();
    // Delete server
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
    <section className="p-4 mt-8 w-full max-w-7xl mx-auto">
      <h1 className="text-4xl my-2 font-semibold">{serverData.serverName}</h1>
      <h2 className="my-4 mt-8 text-2xl font-semibold">Players:</h2>
      <ul className="flex gap-4">
        {serverData.players
          .sort((a: any, b: any) => {
            const aOnlineSince = a.onlineSince
              ? new Date(a.onlineSince).getTime()
              : -Infinity;
            const bOnlineSince = b.onlineSince
              ? new Date(b.onlineSince).getTime()
              : -Infinity;

            return bOnlineSince - aOnlineSince;
          })
          .map((player: Player) => (
            <li
              key={player.uuid}
              className="bg-gray-800 p-2 rounded w-52 flex flex-col justify-between"
            >
              <div className="mb-4 flex flex-col items-center">
                <Image
                  src={"/images/steve.png"}
                  alt={"Player icon"}
                  width={52}
                  height={52}
                />
                <span className="text-lg font-semibold">{player.name}</span>
              </div>
              <div>
                <div>
                  <span className="font-medium">Deaths: </span>
                  <span>{player.deaths}</span>
                </div>
                <div>
                  <span className="font-medium">Playtime: </span>
                  <span>
                    {Math.round(player.playTime * 2) / 2 === 0
                      ? "less than 30 min"
                      : `${Math.round(player.playTime * 2) / 2}h`}
                  </span>
                </div>
                {!player.onlineSince && player.lastSeen ? (
                  <>
                    <span className="font-medium">Last seen: </span>
                    <span>{playerLastSeen(player.lastSeen)}</span>
                  </>
                ) : (
                  <span className="text-green-400">Online</span>
                )}
              </div>
            </li>
          ))}
      </ul>
      <h2 className="my-4 text-2xl font-semibold">Server Events:</h2>
      <ul className="space-y-4">
        {serverData.events.reverse().map((event: Event, index: number) => (
          <li
            key={index}
            className={`flex bg-gray-800 gap-4 items-center ${
              event.type === "advancement" ? "text-green-400" : "text-red-400"
            } p-2 px-4 rounded`}
          >
            {event.type === "advancement" ? (
              <Image
                className="pixel-art"
                src={"/images/advancement.png"}
                alt={"Advancement icon"}
                width={32}
                height={32}
              />
            ) : event.type === "death" ? (
              <Image
                className="pixel-art"
                src={"/images/death.png"}
                alt={"Death icon"}
                width={32}
                height={32}
              />
            ) : null}

            <div className="flex flex-col">
              <span className="font-semibold">
                {event.type === "advancement"
                  ? `${event.player} achieved: `
                  : ""}
                {event.text}
              </span>
              <span className="text-gray-300 text-sm">
                {event.datetime.toLocaleString()}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {user && serverData.owner === user.id && (
        <>
          <hr className="my-6 border-gray-600" />
          <h2 className="font-bold text-2xl">Admin stuff: </h2>
          <ServerSecretDisplay serverSecret={serverData.serverSecret} />
          <form action={deleteServer}>
            <input
              type="text"
              name="serverName"
              placeholder="Enter server name here"
              className="text-black"
              required
            />
            <button className="bg-red-400 text-black">Delete</button>
          </form>
          <span>Server access:</span>
          <PrivateCheckboxForm
            key={serverData.private}
            isPrivate={serverData.private}
            id={serverData._id.toString()}
          />
        </>
      )}
    </section>
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
