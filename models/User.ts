import mongoose, { Schema, models } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
    email: string;
    password: string;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
    {
        email: { types: String, required: true, unique: true },
        password: { types: String, required: true },
    },
    { timestamps: true }
)

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) { //if password is modified then hash it
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

const User = models?.User || mongoose.model<IUser>("User", userSchema)

export default User