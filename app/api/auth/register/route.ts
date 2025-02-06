import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";


export async function POST(request: NextRequest, response: NextResponse) {
    try {
        const { email, password } = await request.json()
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
        }

        await connectToDatabase()
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }

        const user = User.create({ email, password })
        if (!user) {
            return NextResponse.json({ error: "User not created" }, { status: 400 })
        }
        return NextResponse.json({ message: "User created successfully" }, { status: 201 })

    } catch (error) {
        return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
    }

}