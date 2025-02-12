
// import prisma from "@/lib/prisma";
import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password, name, role } = await request.json();

    // Basic validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma?.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma!.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: role as "ADMIN" | "MODERATOR" | "USER",
      },
    });
// eslint-disable-next-line @typescript-eslint/no-unused-vars
    // Remove password from response
    const { password: _password, ...userWithoutPassword } = user! ;// Using the non-null assertion operator
console.log(_password)//not rec 
/*
password: _ extracts the password property from the user object but assigns it to _, which is just a throwaway variable (it means "I don't need this value").
...userWithoutPassword gathers the remaining properties of user into a new object named userWithoutPassword.
*/

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
