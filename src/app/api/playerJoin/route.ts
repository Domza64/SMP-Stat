import dbConnect from "@/lib/dbConnect";
import McServerModel from "@/model/McServerModel";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  const newPlayer = {
    name: data.player,
  };

  await dbConnect();
  await McServerModel.updateOne(
    {
      "players.name": { $ne: newPlayer.name }, // Find the player by name
      serverSecret: data.serverSecret, // Find the server by secret
    },
    { $addToSet: { players: newPlayer } }
  );

  return new NextResponse("OK", { status: 200 });
}
