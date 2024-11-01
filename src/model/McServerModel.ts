import mongoose from "mongoose";

export interface Player {
  uuid: string;
  name: string;
  deaths: number;
  onlineSince: Date | undefined; // If undefined the player is offline, otherwise the time when player joined
  lastSeen: Date | undefined;
  playTime: number; // Decimal number of playtime in hours
}

const PlayerSchema = new mongoose.Schema<Player>({
  uuid: { type: String, required: true },
  name: { type: String, required: true },
  deaths: { type: Number, required: true, default: 0 },
  onlineSince: { type: Date, default: undefined },
  lastSeen: { type: Date, default: undefined },
  playTime: { type: Number, required: true, default: 0 },
});

export interface Event {
  type: string; // Type of the event (e.g., deaths, achievement)
  text: string; // Description of the event
  player: string; // Player associated with the event
  datetime: Date; // Date and time of the event
}

// Define the McServerModel interface
export interface McServerModel extends mongoose.Document {
  serverName: string;
  serverSecret: string;
  owner: string;
  players: Player[]; // Array of players
  events: Event[]; // Array of events
  private: boolean;
}

// Create the McServer Schema
const McServerSchema = new mongoose.Schema<McServerModel>({
  serverName: { type: String, required: true },
  serverSecret: { type: String, required: true },
  owner: { type: String, required: true },
  players: {
    type: [PlayerSchema], // Use the PlayerSchema for the players array
    default: [], // Default to an empty array
  },
  events: {
    type: [
      {
        type: {
          type: String, // Event type (e.g., "deaths", "achievement")
          required: true,
        },
        text: {
          type: String, // Event description
          required: true,
        },
        player: {
          type: String, // Player associated with the event
          required: true,
        },
        datetime: {
          type: Date, // Event date and time
          required: true,
          default: Date.now, // Default to the current date and time
        },
      },
    ],
    default: [], // Default to an empty array
  },
  private: { type: Boolean, default: true },
});

// Export the McServer model
export default mongoose.models.McServerModel ||
  mongoose.model<McServerModel>("McServerModel", McServerSchema);
