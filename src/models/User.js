import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Por favor proporciona un nombre"],
    },
    email: {
      type: String,
      required: [true, "Por favor proporciona un correo electrónico"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Por favor proporciona un correo válido",
      ],
    },
    password: {
      type: String,
      required: [true, "Por favor proporciona una contraseña"],
      minlength: 6,
      select: false, // Don't return password by default
    },
    username: {
      type: String,
      default: "",
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
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
