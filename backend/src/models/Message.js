import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    investigationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Investigation",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["USER", "ASSISTANT"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ investigationId: 1, createdAt: 1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;