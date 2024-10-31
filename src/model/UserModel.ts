import mongoose from "mongoose";

interface Server {
  name: string;
  serverId: string;
}

// Define the McServerModel interface
interface UserModel extends mongoose.Document {
  kindeUserId: string;
  servers: Server[]; // Array of servers
}

// Create the Server Schema
const Server = new mongoose.Schema<Server>({
  name: { type: String, required: true },
  serverId: { type: String, required: true },
});

// Create the User Schema
const UserSchema = new mongoose.Schema<UserModel>({
  kindeUserId: { type: String, required: true, index: true },
  servers: {
    type: [Server],
    default: [], // Default to an empty array
  },
});

// Export the User model
export default mongoose.models.UserModel ||
  mongoose.model<UserModel>("UserModel", UserSchema);
