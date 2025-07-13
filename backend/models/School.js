import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User Name is required'],
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    nameInShort: {
      type: String,
      required: true,
      trim: true,
      maxLength: 5,
      uppercase: true,
      match: [/^[A-Z]+$/, 'Name in short must be uppercase letters only'],
    },
    email: {
      type: String,
      required: [true, 'User Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please fill a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'User Password is required'],
      minLength: 6,
    },
    avatar: {
      url: {
        type: String,
        default: ''
      },
      publicId: {
        type: String,
        default: ''
      }
    },
    role: {
      type: String,
      enum: ['School', 'Judge', 'Admin'],
      default: "School",
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
schoolSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
schoolSchema.methods.comparePasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("School", schoolSchema);