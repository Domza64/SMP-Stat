import dbConnect from "@/lib/dbConnect";
import McServerModel from "@/model/McServerModel";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  await dbConnect();

  // Update the player's deaths count and log the death event
  await McServerModel.updateOne(
    {
      "players.name": data.player, // Find the player by name
      serverSecret: data.serverSecret, // Find the server by secret
    },
    {
      // Increment the deaths count by 1
      $inc: {
        "players.$.deaths": 1, // Increment the death count
      },
      // Add a new event for the player's death
      $push: {
        events: {
          type: "death", // Event type
          text: data.deathMsg, // Death message
          player: data.player, // Player associated with the death
          datetime: new Date(), // Current date and time
        },
      },
    }
  );

  return new NextResponse("OK", { status: 200 });
}
