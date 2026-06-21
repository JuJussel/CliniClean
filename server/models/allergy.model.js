import { defineMongooseModel } from "#nuxt/mongoose";
import mongoose from "mongoose";
import Patient from "./patient.model.js";
import Encounter from "./encounter.model.js";
import User from "./user.model.js";

const Allergy = defineMongooseModel({
  name: "Allergy",
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
    category: {
      type: String,
      enum: ["allergies", "medicationAllergies"],
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    severity: {
      type: String,
      enum: ["light", "medium", "high"],
    },
    comment: {
      type: String,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  options: {
    collection: "patients_allergies",
  },
});

export default Allergy;
