import { defineMongooseModel } from "#nuxt/mongoose";
import mongoose from "mongoose";
import Patient from "./patient.model.js";
import Encounter from "./encounter.model.js";
import User from "./user.model.js";

const Vital = defineMongooseModel({
  name: "Vital",
  schema: {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Patient,
      required: true,
    },
    encounter: { type: mongoose.Schema.Types.ObjectId, ref: Encounter },
    date: { type: Date, default: Date.now },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: User },

    // Vital values
    bloodPreasureHigh: { type: Number },
    bloodPreasureLow: { type: Number },
    pulse: { type: Number },
    temperature: { type: Number },
    spo2: { type: Number },
    weight: { type: Number },
    bmi: { type: Number },
    waist: { type: Number },
    height: { type: Number },
    head: { type: Number },
    breast: { type: Number },
    memo: { type: String },
  },
  options: {
    collection: "patients_vitals", // using 'patients_vitals' to align with local style
  },
});

export default Vital;
