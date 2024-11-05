import dbConnect from "@/lib/dbConnect";
import McServerModel from "@/model/McServerModel";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  await dbConnect();

  // Find the player data first to get the current onlineSince value
  const server = await McServerModel.findOne(
    {
      serverSecret: data.serverSecret,
      "players.uuid": data.uuid,
    },
    { "players.$": 1 } // Project only the matched player
  );

  if (!server || !server.players || server.players.length === 0) {
    return new NextResponse(
      "Player or server not found: Please make sure that server secret is setup corectly",
      { status: 404 }
    );
  }

  const player = server.players[0];

  if (!player.onlineSince) {
    return new NextResponse("Player is already offline", { status: 400 });
  }

  // Calculate the play time in hours
  const currentTime = new Date();
  const onlineSince = player.onlineSince;
  const elapsedHours =
    (currentTime.getTime() - onlineSince.getTime()) / (1000 * 60 * 60);

  // Update the player record with the new playTime and unset onlineSince
  await McServerModel.updateOne(
    {
      "players.uuid": data.uuid,
      serverSecret: data.serverSecret,
    },
    {
      $set: {
        "players.$.lastSeen": currentTime,
        "players.$.playTime": (player.playTime || 0) + elapsedHours,
      },
      $unset: {
        "players.$.onlineSince": "", // Unset onlineSince
      },
    }
  );

  return new NextResponse("OK", { status: 200 });
}
