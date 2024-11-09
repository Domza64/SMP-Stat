import dbConnect from "@/lib/dbConnect";
import McServerModel, { IMcServerModel } from "@/model/McServerModel";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  await dbConnect();

  // If the server was previously shut down incorectly we need to set each player's onlineSince to undefined to make them offline untly they rejoin.
  const server: IMcServerModel | null = await McServerModel.findOne({
    serverSecret: data.serverSecret,
  });

  if (server) {
    server.players.forEach((player) => {
      player.onlineSince = undefined;
    });
  }

  await McServerModel.updateOne(
    { serverSecret: data.serverSecret },
    { $set: { players: server?.players } }
  );

  return new NextResponse("OK", { status: 200 });
}
