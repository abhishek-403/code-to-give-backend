import mongoose, { Document, Schema } from "mongoose";
import { FormFieldType } from "../lib/constants";

// Interface for Template Form
export interface ITemplateFormSchema extends Document {
  name: string;
  isSaved: boolean;
  fields: {
    name: string;
    placeholder?: string;
    type: FormFieldType;
    required: boolean;
    options?: string[];
  }[];
}

const TemplateFormSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    isSaved: { type: Boolean, required: true },
    fields: [
      {
        label: { type: String, required: true },
        placeholder: { type: String },
        type: {
          type: String,
          required: true,
          enum: Object.values(FormFieldType),
        },
        required: { type: Boolean, default: false },
        // options: {
        //   type: [String],
        //   required: function (this: { type: string }) {
        //     return ["select", "radio", "checkbox"].includes(this.type);
        //   },
        // },
      },
    ],
  },
  { timestamps: true }
);

export const TemplateFormModel = mongoose.model<ITemplateFormSchema>(
  "TemplateForm",
  TemplateFormSchema
);
