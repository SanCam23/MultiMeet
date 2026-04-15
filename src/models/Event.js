import mongoose from "mongoose";
import { deleteDropboxFileBySharedUrl } from "@/lib/dropbox";

async function cleanupEventDropboxMedia(eventDoc) {
  if (!eventDoc) {
    return;
  }

  const mediaUrls = [
    eventDoc.coverImage,
    ...(Array.isArray(eventDoc.userGallery)
      ? eventDoc.userGallery.map((item) => item?.url).filter(Boolean)
      : []),
  ].filter(Boolean);

  if (mediaUrls.length === 0) {
    return;
  }

  const results = await Promise.allSettled(
    mediaUrls.map((url) => deleteDropboxFileBySharedUrl(url))
  );

  const cleanupErrors = results
    .filter((result) => result.status === "rejected")
    .map((result) => result.reason?.message || "Error desconocido limpiando media de Dropbox");

  if (cleanupErrors.length > 0) {
    console.error("Event media cleanup errors:", cleanupErrors);
  }
}

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El titulo del evento es obligatorio"],
      trim: true,
      maxlength: [120, "El titulo no puede superar 120 caracteres"],
    },
    description: {
      type: String,
      required: [true, "La descripcion del evento es obligatoria"],
      trim: true,
      maxlength: [2000, "La descripcion no puede superar 2000 caracteres"],
    },
    dateTime: {
      type: Date,
      required: [true, "La fecha y hora del evento son obligatorias"],
    },
    locationText: {
      type: String,
      required: [true, "La ubicacion del evento es obligatoria"],
      trim: true,
      maxlength: [200, "La ubicacion no puede superar 200 caracteres"],
    },
    lat: {
      type: Number,
      default: null,
      min: -90,
      max: 90,
    },
    lng: {
      type: Number,
      default: null,
      min: -180,
      max: 180,
    },
    categories: [
      {
        type: String,
        trim: true,
      },
    ],
    coverImage: {
      type: String,
      default: "",
      trim: true,
    },
    maxParticipants: {
      type: Number,
      default: null,
      min: [1, "El maximo de participantes debe ser al menos 1"],
    },
    participantsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    userGallery: [
      {
        url: { type: String, required: true },
        type: { type: String, enum: ["image", "video"], default: "image" },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        value: { type: Number, required: true, min: 1, max: 5 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ["active", "finished", "cancelled"],
      default: "active",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El autor del evento es obligatorio"],
      index: true,
    },
    parentEvent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      default: null,
    },
  },
  { timestamps: true }
);

EventSchema.index({ categories: 1 });
EventSchema.index({ dateTime: 1 });
EventSchema.index({ locationText: 1 });
EventSchema.index({ title: "text", description: "text", locationText: "text" });

EventSchema.post("findOneAndDelete", async function (doc) {
  await cleanupEventDropboxMedia(doc);
});

EventSchema.pre("deleteOne", { query: true, document: false }, async function () {
  this._eventToCleanup = await this.model.findOne(this.getFilter());
});

EventSchema.post("deleteOne", { query: true, document: false }, async function () {
  await cleanupEventDropboxMedia(this._eventToCleanup);
});

EventSchema.post("deleteOne", { query: false, document: true }, async function () {
  await cleanupEventDropboxMedia(this);
});

export default mongoose.models.Event || mongoose.model("Event", EventSchema);