import mongoose from "mongoose";

const componentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    prompt: {
      type: String,
      default: "",
    },

    code: {
      type: String,
      required: true,
    },

    props:[String],

    owner:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    },

    visibility: {
      type: String,
      enum:["private","public"],
      default: "private",
    },

    npmPackage:String,
  },
  {
    timestamps: true,
  }
);

const Component = mongoose.model("Component", componentSchema);

export default Component;