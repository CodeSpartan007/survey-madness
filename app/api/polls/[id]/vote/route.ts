import { NextResponse } from "next/server";
import pool from "@/lib/db-setup"; // ✅ Import pool from db-setup

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // ✅ Fix: Ensure params are correctly resolved
    const { id: pollId } = await Promise.resolve(context.params);

    if (!pollId) {
      return NextResponse.json({ message: "Poll ID is missing" }, { status: 400 });
    }

    // ✅ Parse JSON body correctly
    const { optionId, userId } = await request.json();

    if (!optionId || !userId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Check if user has already voted
    const [existingVotes] = await pool.execute(
      "SELECT id FROM votes WHERE poll_id = ? AND user_id = ?",
      [pollId, userId]
    );

    if (Array.isArray(existingVotes) && existingVotes.length > 0) {
      return NextResponse.json({ message: "You have already voted on this poll" }, { status: 400 });
    }

    // Verify if option belongs to this poll
    const [optionRows] = await pool.execute(
      "SELECT id FROM options WHERE id = ? AND poll_id = ?",
      [optionId, pollId]
    );

    if (Array.isArray(optionRows) && optionRows.length === 0) {
      return NextResponse.json({ message: "Invalid option for this poll" }, { status: 400 });
    }

    // Record the vote
    await pool.execute("INSERT INTO votes (poll_id, option_id, user_id) VALUES (?, ?, ?)", [
      pollId,
      optionId,
      userId,
    ]);

    return NextResponse.json({ message: "Vote recorded successfully" });
  } catch (error) {
    console.error("Error recording vote:", error);
    return NextResponse.json({ message: "Failed to record vote" }, { status: 500 });
  }
}
