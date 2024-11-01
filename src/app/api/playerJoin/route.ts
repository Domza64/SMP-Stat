import dbConnect from "@/lib/dbConnect";
import McServerModel from "@/model/McServerModel";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  await dbConnect();
  const qureryResponse = await McServerModel.updateOne(
    {
      serverSecret: data.serverSecret, // Find the server by secret
      "players.uuid": data.uuid, // Find the player by uuid
    },
    { $set: { "players.$.onlineSince": new Date() } }
  );

  if (qureryResponse.matchedCount == 0) {
    const newPlayer = {
      uuid: data.uuid,
      name: data.player,
      onlineSince: new Date(),
    };

    await McServerModel.updateOne(
      {
        serverSecret: data.serverSecret, // Find the server by secret
        "players.uuid": { $ne: newPlayer.uuid }, // Find the player by name
      },
      { $addToSet: { players: newPlayer } }
    );
  }

  return new NextResponse("OK", { status: 200 });
}
