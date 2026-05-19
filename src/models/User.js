import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Por favor proporciona un nombre"],
    },
    email: {
      type: String,
      required: [true, "Por favor proporciona un correo electrónico"],
      unique: true,
    },
    username: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    bio: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    lat: {
      type: Number,
      default: null,
    },
    lng: {
      type: Number,
      default: null,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    preferences: {
      theme: {
        type: String,
        enum: ["light", "dark", "high-contrast"],
        default: "light",
      },
      largeText: {
        type: Boolean,
        default: false,
      },
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
