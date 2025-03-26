import { NextResponse } from "next/server";
import pool from "@/lib/db-setup"; // Import the database pool

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Check if user exists and password matches
    const [rows] = await connection.execute(
      "SELECT id, username FROM users WHERE username = ? AND password = ?",
      [username, password]
    );

    connection.release(); // Release the connection back to the pool

    if (Array.isArray(rows) && rows.length === 0) {
      return NextResponse.json({ message: "Invalid username or password" }, { status: 401 });
    }

    // Return user data (excluding password)
    return NextResponse.json({ user: rows[0] });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "An error occurred during login" }, { status: 500 });
  }
}
