import dbConnect from "@/lib/dbConnect";
import McServerModel from "@/model/McServerModel";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  await dbConnect();

  // Update the player's deaths count and log the death event
  await McServerModel.updateOne(
    {
      "players.uuid": data.uuid, // Find the player by uuid
      serverSecret: data.serverSecret, // Find the server by secret
    },
    {
      // Add a new event for the player advancement
      $push: {
        events: {
          type: "advancement", // Event type
          text: data.advancement, // Death message
          player: data.player, // Player associated with the death
          datetime: new Date(), // Current date and time
        },
      },
    }
  );

  return new NextResponse("OK", { status: 200 });
}
