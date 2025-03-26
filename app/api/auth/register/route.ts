import { NextResponse } from "next/server";
import pool from "@/lib/db-setup"; // Import the database pool

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Check if username already exists
    const [existingUsers] = await connection.execute(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      connection.release(); // Release the connection back to the pool
      return NextResponse.json({ message: "Username already exists" }, { status: 400 });
    }

    // Insert new user
    await connection.execute(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, password]
    );

    connection.release(); // Release the connection

    return NextResponse.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "An error occurred during registration" }, { status: 500 });
  }
}
