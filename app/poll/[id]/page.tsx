"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Define TypeScript interfaces
interface Poll {
  id: number;
  title: string;
  description?: string;
  created_at: string;
  user_id: number;
  username: string;
}

interface PollOption {
  id: number;
  text: string;
}

export default function PollPage() {
  const { id } = useParams<{ id: string }>(); // ✅ Correctly type `useParams`
  const [poll, setPoll] = useState<Poll | null>(null);
  const [options, setOptions] = useState<PollOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<{ id: number } | null>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }

    // Fetch poll data with user ID (if available)
    const userId = loggedInUser ? JSON.parse(loggedInUser).id : null;
    const fetchUrl = userId ? `/api/polls/${id}?userId=${userId}` : `/api/polls/${id}`;

    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => {
        setPoll(data.poll);
        setOptions(data.options);
        setHasVoted(data.hasVoted);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error("Error fetching poll:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load poll");
        }
        setLoading(false);
      });
  }, [id]);

  const handleVote = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!selectedOption) {
      setError("Please select an option");
      return;
    }

    try {
      const response = await fetch(`/api/polls/${id}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          optionId: Number(selectedOption), // ✅ Ensure optionId is a number
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit vote");
      }

      router.push(`/results/${id}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading poll...</div>;
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
          <CardTitle className="text-2xl">{poll.title}</CardTitle>
          {poll.description && <CardDescription>{poll.description}</CardDescription>}
          <CardDescription>Created by: {poll.username}</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="p-3 bg-red-100 text-red-600 rounded mb-4">{error}</div>}

          {hasVoted ? (
            <div className="p-3 bg-yellow-100 text-yellow-800 rounded">
              You have already voted on this poll. View the results instead.
            </div>
          ) : (
            <RadioGroup
              value={selectedOption}
              onValueChange={(value) => setSelectedOption(value.toString())} // ✅ Ensure value is a string
              className="space-y-3"
            >
              {options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 border p-3 rounded hover:bg-muted">
                  <RadioGroupItem value={option.id.toString()} id={`option-${option.id}`} />
                  <Label htmlFor={`option-${option.id}`} className="flex-grow cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/")}>
            Back to Polls
          </Button>
          {hasVoted ? (
            <Button onClick={() => router.push(`/results/${id}`)}>View Results</Button>
          ) : (
            <Button onClick={handleVote} disabled={!selectedOption || !user}>
              Submit Vote
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
