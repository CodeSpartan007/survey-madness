import { NextResponse } from "next/server";
import pool from "@/lib/db-setup"; // ✅ Import shared DB pool
import { RowDataPacket } from "mysql2/promise";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // ✅ Await params to avoid Next.js error
    const { id: pollId } = await Promise.resolve(context.params);

    // ✅ Get a connection from the pool
    const connection = await pool.getConnection();

    // Get poll details
    const [pollRows] = await connection.execute<RowDataPacket[]>(
      `
      SELECT p.id, p.title, p.description, p.created_at, p.user_id, u.username 
      FROM polls p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `,
      [pollId]
    );

    if (!pollRows.length) {
      connection.release(); // ✅ Release the connection before returning
      return NextResponse.json({ message: "Poll not found" }, { status: 404 });
    }

    // Get poll options with vote counts (✅ Correct table name: `options`)
    const [resultRows] = await connection.execute<RowDataPacket[]>(
      `
      SELECT o.id, o.text, COUNT(v.id) as votes
      FROM options o
      LEFT JOIN votes v ON o.id = v.option_id
      WHERE o.poll_id = ?
      GROUP BY o.id
      ORDER BY votes DESC
    `,
      [pollId]
    );

    connection.release(); // ✅ Release the connection back to the pool

    return NextResponse.json({
      poll: pollRows[0],
      results: resultRows,
    });
  } catch (error) {
    console.error("Error fetching poll results:", error);
    return NextResponse.json({ message: "Failed to fetch poll results" }, { status: 500 });
  }
}
