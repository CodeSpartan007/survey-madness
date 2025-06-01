"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Poll {
  id: number;
  title: string;
  description?: string;
  username: string;
}

interface PollOption {
  id: number;
  text: string;
  votes: number;
}

export default function ResultsPage() {
  const params = useParams();
  const id = params.id as string;

  const [poll, setPoll] = useState<Poll | null>(null);
  const [results, setResults] = useState<PollOption[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    fetch(`/api/polls/${id}/results`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch poll: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("API Response:", data); // ✅ Debugging log

        if (!data.poll) {
          console.error("Poll not found in API response:", data);
          throw new Error("Poll not found");
        }

        setPoll(data.poll);

        const resultsArray: PollOption[] = Array.isArray(data.results) ? data.results : [];

        setResults(resultsArray);

        const total = resultsArray.reduce(
          (sum: number, option: PollOption) => sum + (option.votes || 0),
          0
        );
        setTotalVotes(total);

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching results:", err);
        setError("Failed to load poll results");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading results...</div>;
  }

  if (error && !poll) {
    return <div className="container mx-auto p-4 text-red-600">{error}</div>;
  }

  if (!poll) {
    return <div className="container mx-auto p-4">Poll not found</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{poll.title} - Results</CardTitle>
          {poll.description && poll.description.trim() !== "" && (
            <CardDescription>{poll.description}</CardDescription>
          )}
          <CardDescription>Created by: {poll.username}</CardDescription>
          <CardDescription>Total votes: {totalVotes}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {results.length === 0 ? (
            <p className="text-gray-500">No votes have been cast yet.</p>
          ) : (
            results.map((option) => {
              const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;

              return (
                <div key={option.id} className="space-y-1">
                  <div className="flex justify-between">
                    <span>{option.text}</span>
                    <span className="font-medium">
                      {percentage}% ({option.votes} votes)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/")}>
            Back to Polls
          </Button>
          <Button variant="outline" onClick={() => router.push(`/poll/${id}`)}>
            View Poll
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
