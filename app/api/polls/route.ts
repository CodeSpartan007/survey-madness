import { NextResponse } from "next/server";
import pool from "@/lib/db-setup";

// GET all polls
export async function GET() {
  try {
    // Get all polls with creator username and vote count
    const [rows] = await pool.execute(`
      SELECT p.id, p.title, p.description, p.created_at, p.user_id, u.username,
             COALESCE((SELECT COUNT(*) FROM votes WHERE votes.poll_id = p.id), 0) AS votes
      FROM polls p
      JOIN users u ON p.user_id = u.id
      ORDER BY votes DESC, p.created_at DESC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching polls:", error);
    return NextResponse.json({ message: "Failed to fetch polls" }, { status: 500 });
  }
}

// CREATE a new poll
export async function POST(request: Request) {
  try {
    const { title, description, options, userId } = await request.json();

    if (!title || !options || options.length < 2 || !userId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Insert poll
      const [pollResult]: any = await connection.execute(
        "INSERT INTO polls (title, description, created_by, user_id) VALUES (?, ?, ?, ?)",
        [title, description || "", userId, userId]
      );

      const pollId = pollResult.insertId;

      // Insert options
      for (const optionText of options) {
        await connection.execute("INSERT INTO options (poll_id, text) VALUES (?, ?)", [pollId, optionText]);
      }

      // Commit transaction
      await connection.commit();
      connection.release();

      return NextResponse.json({ id: pollId, message: "Poll created successfully" });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error("Error creating poll:", error);
    return NextResponse.json({ message: "Failed to create poll" }, { status: 500 });
  }
}
