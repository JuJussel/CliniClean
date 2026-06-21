import { defineMongooseModel } from "#nuxt/mongoose";
import mongoose from "mongoose";
import Patient from "./patient.model.js";
import Encounter from "./encounter.model.js";
import User from "./user.model.js";

const SocialRisk = defineMongooseModel({
  name: "SocialRisk",
  schema: {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Patient,
      required: true,
    },
    encounter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Encounter,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    values: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  options: {
    collection: "patients_social_risks",
  },
});

export default SocialRisk;
