import { NextResponse } from "next/server";
import pool from "@/lib/db-setup"; // ✅ Import shared DB pool
import { RowDataPacket } from "mysql2/promise";

// Define types extending RowDataPacket
interface Poll extends RowDataPacket {
  id: number;
  title: string;
  description?: string;
  created_at: string;
  user_id: number;
  username: string;
}

interface PollOption extends RowDataPacket {
  id: number;
  text: string;
}

interface VoteCheck extends RowDataPacket {
  id: number;
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; // ✅ Await params before using

    // ✅ Validate poll ID
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ message: "Invalid poll ID" }, { status: 400 });
    }

    // Fetch poll details
    const [pollRows] = await pool.execute<Poll[]>(
      `SELECT p.id, p.title, p.description, p.created_at, p.user_id, u.username 
       FROM polls p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = ?`,
      [id]
    );

    if (!pollRows.length) {
      return NextResponse.json({ message: "Poll not found" }, { status: 404 });
    }

    // Fetch poll options
    const [optionRows] = await pool.execute<PollOption[]>(
      "SELECT id, text FROM options WHERE poll_id = ?",
      [id]
    );

    // Check if user has already voted
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    let hasVoted = false;

    if (userId && !isNaN(Number(userId))) {
      const [voteRows] = await pool.execute<VoteCheck[]>(
        "SELECT id FROM votes WHERE poll_id = ? AND user_id = ?",
        [id, userId]
      );

      hasVoted = voteRows.length > 0;
    }

    return NextResponse.json({
      poll: pollRows[0],
      options: optionRows,
      hasVoted,
    });
  } catch (error) {
    console.error("Error fetching poll:", error);
    return NextResponse.json({ message: "Failed to fetch poll", error: (error as Error).message }, { status: 500 });
  }
}
