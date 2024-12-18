import mongoose from "mongoose";

export interface ServerData {
  name: string;
  serverId: string;
}

// Define the McServerModel interface
export interface UserModel extends mongoose.Document {
  kindeUserId: string;
  email: string;
  username: string;
  servers: ServerData[]; // Array of servers
}

// Create the Server Schema
const Server = new mongoose.Schema<ServerData>({
  name: { type: String, required: true },
  serverId: { type: String, required: true },
});

// Create the User Schema
const UserSchema = new mongoose.Schema<UserModel>({
  kindeUserId: { type: String, required: true, index: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  servers: {
    type: [Server],
    default: [], // Default to an empty array
  },
});

// Export the User model
export default mongoose.models.UserModel ||
  mongoose.model<UserModel>("UserModel", UserSchema);
