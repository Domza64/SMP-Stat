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
import AddUserForm from "@/component/AddUserForm";

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

    if (serverData.owner == user.id) {
      userAllowed = true;
    } else {
      serverData.allowedUsers.forEach((u: AllowedUser) => {
        if (u.kindeUserId == user.id) {
          userAllowed = true;
        }
      });
    }

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

    redirect("/servers");
  }

  async function removeAllowedUser(formData: FormData) {
    "use server";

    const { getUser, isAuthenticated } = getKindeServerSession();
    const actionUser = await getUser();

    if (!isAuthenticated) {
      redirect("/api/auth/login?post_login_redirect_url=/server/" + id);
    }

    const kindeUserId = formData.get("kindeUserId");
    if (!kindeUserId) {
      redirect("/server/" + id);
    }

    await dbConnect();
    const user = await UserModel.findOneAndUpdate(
      {
        kindeUserId,
      },
      {
        $pull: {
          servers: { serverId: id },
        },
      }
    );

    await McServerModel.updateOne(
      {
        _id: id,
        owner: actionUser.id,
      },
      {
        $pull: {
          allowedUsers: { kindeUserId: user.kindeUserId },
        },
      }
    );

    redirect("/server/" + id);
  }

  return (
    <section className="p-4 mt-12 w-full max-w-7xl mx-auto">
      <h1 className="text-5xl font-bold bg-gradient-to-r from-green-200 via-green-500 to-green-950 bg-clip-text text-transparent text-center uppercase">
        {serverData.serverName}
      </h1>
      <h2 className="mb-4 mt-16 text-3xl font-semibold uppercase text-center border-t-2 p-2 border-x-2 border-green-700">
        The Realm's Heroes
      </h2>
      <ul className="grid grid-cols-2 justify-center gap-4 sm:flex flex-wrap">
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
              className="bg-gray-800 p-2 rounded flex flex-col justify-between max-w-80 h-52"
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
                  <span>Deaths: </span>
                  <span className="font-semibold">{player.deaths}</span>
                </div>
                <div>
                  <span>Playtime: </span>
                  <span className="font-medium">
                    {Math.round(player.playTime * 2) / 2 === 0
                      ? "less than 30 min"
                      : `${Math.round(player.playTime * 2) / 2}h`}
                  </span>
                </div>
                {!player.onlineSince && player.lastSeen ? (
                  <>
                    <span>Last seen: </span>
                    <span className="font-medium">
                      {playerLastSeen(player.lastSeen)}
                    </span>
                  </>
                ) : (
                  <span className="text-green-400">Online</span>
                )}
              </div>
            </li>
          ))}
      </ul>
      <h2 className="mb-4 mt-16 text-3xl font-semibold uppercase text-center border-t-2 p-2 border-x-2 border-green-700">
        The Event Log
      </h2>
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
        <div className="space-y-4 border-gray-600 border rounded p-4 mt-24">
          <h2 className="font-bold text-2xl text-center uppercase">
            Server Settings
          </h2>
          <hr className="my-6 border-gray-600" />
          <div>
            <h3 className="font-semibold text-xl">Server visibility</h3>
            <span>
              Anyone with the link can see public server. Private servers can
              only be seen by users on allowed users list
            </span>
            <div className="flex gap-2">
              <span className="font-semibold">Private Server</span>
              <PrivateCheckboxForm
                key={serverData.private}
                isPrivate={serverData.private}
                id={serverData._id.toString()}
              />
            </div>
          </div>
          <hr className="my-6 border-gray-600" />
          {serverData.private && (
            <div>
              <h3 className="font-semibold text-xl">
                Users with acces to this server:
              </h3>
              <ul className="flex gap-3">
                {serverData.allowedUsers.map(
                  (allowedUser: AllowedUser, index: number) => (
                    <li key={index} className="flex gap-1">
                      <span>{allowedUser.username}</span>
                      <form action={removeAllowedUser}>
                        <input
                          type="hidden"
                          name="kindeUserId"
                          value={allowedUser.kindeUserId}
                        />
                        <button className="text-red-400 hover:text-red-500">
                          R
                        </button>
                      </form>
                    </li>
                  )
                )}
              </ul>
              <AddUserForm serverId={id} serverName={serverData.serverName} />
              <hr className="my-6 border-gray-600" />
            </div>
          )}
          <div className="flex flex-col items-start">
            <h3 className="font-semibold text-xl">Server secret</h3>
            <span>
              To connect your Minecraft server, you need to add this secret key
              to your minecraft plugin/mod configuration.{" "}
              <a
                href="/tutorial#key"
                className="underline text-green-400 hover:text-green-500"
              >
                Instructions
              </a>
            </span>
            <span className="mb-4 italic font-medium">
              Note - Anyone with this secret key can add data here, so don't
              share it.
            </span>
            <ServerSecretDisplay serverSecret={serverData.serverSecret} />
          </div>
          <hr className="my-6 border-gray-600" />
          <form action={deleteServer} className="flex flex-col w-max gap-2">
            <label
              htmlFor="serverName"
              className="text-xl font-semibold text-red-400"
            >
              Delete server
            </label>
            <div className="flex gap-2 flex-col sm:flex-row">
              <input
                type="text"
                name="serverName"
                placeholder="Enter server name here"
                className="text-white bg-slate-950 p-1 px-3 rounded border-red-400 border-2 border-dashed"
                required
              />
              <button className="bg-red-400 hover:bg-red-500 py-1 px-3 rounded font-medium max-w-max text-black">
                Delete Server
              </button>
            </div>
          </form>
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
