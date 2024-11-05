import PrivateCheckboxForm from "@/component/PrivateCheckboxForm";
import ServerSecretDisplay from "@/component/ServerSecretDisplay";
import dbConnect from "@/lib/dbConnect";
import McServerModel, {
  Player,
  Event,
  AllowedUser,
} from "@/model/McServerModel";
import UserModel from "@/model/UserModel";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { playerLastSeen } from "@/lib/TimeUtils";
import { revalidatePath } from "next/cache";

export default async function Server({ params }: { params: { id: string } }) {
  const id = params.id;
  const serverData = await getData(id);

  if (!serverData) {
    return <div>Server not found</div>;
  }

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (serverData.private) {
    let userAllowed = false;
    serverData.allowedUsers.forEach((u: AllowedUser) => {
      if (u.kindeUserId == user.id) {
        userAllowed = true;
      }
    });
    if (!userAllowed) {
      return <div>This is a private server.</div>;
    }
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

  async function addUser(formData: FormData) {
    "use server";

    const { getUser, isAuthenticated } = getKindeServerSession();
    const actionUser = await getUser();

    if (!isAuthenticated) {
      redirect("/api/auth/login?post_login_redirect_url=/server/" + id);
    }

    const mailOrUsername = formData.get("mailOrUsername");

    await dbConnect();

    // Find user in UserModel and create newAllowedUser from it, add server to that user
    const user = await UserModel.findOneAndUpdate(
      {
        $or: [{ email: mailOrUsername }, { username: mailOrUsername }],
      },
      {
        $addToSet: { servers: { serverId: id, name: serverData.serverName } },
      }
    );

    if (user) {
      const newAllowedUser = {
        kindeUserId: user.kindeUserId,
        username: user.username,
      };
      // Add allowed user to server
      await McServerModel.findOneAndUpdate(
        {
          _id: id,
          owner: actionUser.id,
        },
        { $addToSet: { allowedUsers: newAllowedUser } }
      );

      revalidatePath("/server/" + id);
    } else {
      // TODO - Handle user not found
    }
  }

  return (
    <section className="p-4 mt-8 w-full max-w-7xl mx-auto">
      <h1 className="text-4xl my-2 font-semibold">{serverData.serverName}</h1>
      <h2 className="my-4 mt-8 text-2xl font-semibold">Players:</h2>
      <ul className="flex gap-4 flex-wrap">
        {serverData.players
          .sort((a: Player, b: Player) => {
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
        <div className="space-y-4">
          <hr className="my-6 border-gray-600" />
          <h2 className="font-bold text-2xl">Admin stuff: </h2>
          <ServerSecretDisplay serverSecret={serverData.serverSecret} />
          <form action={deleteServer} className="flex flex-col w-max gap-1">
            <label htmlFor="serverName" className="text-xl font-semibold">
              Delete server
            </label>
            <input
              type="text"
              name="serverName"
              placeholder="Enter server name here"
              className="text-black"
              required
            />
            <button className="bg-red-400 text-black">Delete</button>
          </form>
          <h3 className="text-2xl font-bold">Server setttings</h3>
          <div className="bg-gray-800 p-4">
            <span>Server access:</span>
            <PrivateCheckboxForm
              key={serverData.private}
              isPrivate={serverData.private}
              id={serverData._id.toString()}
            />
            <span className="w-32">
              info: <br /> - Anyone with the link can see public server. <br />{" "}
              - Private servers can only be seen by users on allowed users list
            </span>
          </div>
          {serverData.private && (
            <div>
              <h4>Allowed Users:</h4>
              <ul>
                {serverData.allowedUsers.map(
                  (allowedUser: AllowedUser, index: number) => (
                    <li key={index}>
                      <span>{allowedUser.username}</span>
                    </li>
                  )
                )}
              </ul>
              <hr />
              <form action={addUser} className="flex gap-2 flex-col">
                <label
                  htmlFor="mailOrUsername"
                  className="text-xl font-semibold"
                >
                  Add user
                </label>
                <input
                  type="text"
                  name="mailOrUsername"
                  className="w-max text-black"
                  placeholder="Enter email or username"
                  required
                />
                <button className="bg-green-400 w-max text-black p-1 px-3 rounded">
                  Add user
                </button>
              </form>
            </div>
          )}
        </div>
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
