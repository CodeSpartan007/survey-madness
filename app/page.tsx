"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ThemeToggle from "@/components/ThemeToggle"; // Ensure correct import




type Poll = {
  id: number;
  title: string;
  description: string;
  username: string;
  votes: number;
};

type User = {
  username: string;
};


export default function Home() {
  
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);


  const [popularPoll, setPopularPoll] = useState<Poll | null>(null);

  useEffect(() => {
    // Retrieve user from localStorage
   const loggedInUser = localStorage.getItem("user");
if (loggedInUser) {
  setUser(JSON.parse(loggedInUser) as User);
}

  
    // Fetch polls
    fetch("/api/polls")
      .then((res) => res.json())
      .then((data: Poll[]) => {
        setPolls(data);
        setLoading(false);
  
        if (data.length > 0) {
          // Find the poll with the most votes
          const sortedPolls = [...data].sort((a, b) => b.votes - a.votes);
          setPopularPoll(sortedPolls[0]);
        }
      })
      .catch((err) => {
        console.error("Error fetching polls:", err);
        setLoading(false);
      });
  }, []);
  
  
  

  if (loading) {
    return <div className="container mx-auto p-4">Loading surveyMadness...</div>;
  }

  return (
    <div className="container mx-auto p-4">
{/* Navbar Section */}
<div className="container mx-auto p-4">
      <nav className="border-b border-gray-300 dark:border-gray-600 py-4 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">SurveyMadness</h1>
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" onClick={() => document.getElementById("polls")?.scrollIntoView({ behavior: "smooth" })} className="pr-4 border-r border-gray-900 dark:border-white">Polls</Button>
            <Button variant="ghost" onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })} className="pr-4 border-r border-gray-900 dark:border-white">About</Button>
            <Button variant="ghost" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} className="pr-4 border-r border-gray-900 dark:border-white">Contact</Button>
            {user ? (
              <span className="pl-4 text-sm font-semibold text-green-900 dark:text-white transition-all duration-300 hover:text-yellow-600 dark:hover:text-yellow-600">User: {user.username}</span>
            ) : (
              <span className="pl-4 text-sm font-semibold text-green-900 dark:text-white transition-all duration-300 hover:text-yellow-600 dark:hover:text-yellow-600">User: Guest</span>
            )}
            {user ? (
              <>
                <Button onClick={() => router.push("/create-poll")}>Create Poll</Button>
                <Button variant="outline" onClick={() => { localStorage.removeItem("user"); setUser(null); }}>Logout</Button>
              </>
            ) : (
              <>
                <Button onClick={() => router.push("/login")}>Login</Button>
                <Button onClick={() => router.push("/register")}>Register</Button>
              </>
            )}
            <ThemeToggle />
          </div>
          <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none text-2xl">
  {menuOpen ? "✖" : "☰"}
</button>

          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden flex flex-col items-center gap-4 mt-4 border-t border-gray-300 dark:border-gray-600 pt-4">
            <Button variant="ghost" onClick={() => document.getElementById("polls")?.scrollIntoView({ behavior: "smooth" })}>Polls</Button>
            <Button variant="ghost" onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}>About</Button>
            <Button variant="ghost" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>Contact</Button>
            {user ? (
              <>
                <span className="text-sm font-semibold text-green-900 dark:text-white">User: {user.username}</span>
                <Button onClick={() => router.push("/create-poll")}>Create Poll</Button>
                <Button variant="outline" onClick={() => { localStorage.removeItem("user"); setUser(null); }}>Logout</Button>
              </>
            ) : (
              <>
                <Button onClick={() => router.push("/login")}>Login</Button>
                <Button onClick={() => router.push("/register")}>Register</Button>
              </>
            )}
            <ThemeToggle />
          </div>
        )}
      </nav>
    </div>




      {/* Call to Action Section (Now Theme Responsive) */}
      <div className="mb-8 p-6 text-center rounded-lg shadow-lg bg-primary text-primary-foreground ">
        <h2 className="text-2xl font-bold mb-2">Share Your Thoughts—Take the Survey!</h2>
        <p className="text-lg mb-4">
          Your opinions matter! Answer a few quick questions and see how your views compare with others.
          It only takes a minute!
        </p>
        <p className="text-lg font-semibold mb-2"> Have a thought-provoking question?</p>
        <p className="text-md mb-4">
          Shape the conversation by submitting your own survey questions and help spark meaningful discussions!
        </p>
        <Button
          size="lg"
          className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          onClick={() => router.push("/create-poll")}
        >
           Submit a Poll Now!
        </Button>
      </div>

{/* Most Popular Poll Section */}
{popularPoll && (
 <div className="mb-8 p-6 text-center rounded-lg shadow-lg bg-primary text-primary-foreground ">
    <h2 className="text-2xl font-bold mb-2"> Most Popular Poll</h2>
    <Card className="w-full border-2 border-yellow-700 mx-auto max-w-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl">
      <CardHeader>
        <CardTitle>{popularPoll.title}</CardTitle>
        <CardDescription>Created by: {popularPoll.username}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{popularPoll.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => router.push(`/poll/${popularPoll.id}`)}>Vote</Button>
        <Button variant="outline" onClick={() => router.push(`/results/${popularPoll.id}`)}>Results</Button>
      </CardFooter>
    </Card>
  </div>
)}


      {/* Polls Section */}
      <div id = "polls" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {polls.length > 0 ? (
          polls.map((poll) => (
            <Card key={poll.id} className="w-full border border-yellow-500 transition-transform transform hover:scale-105 hover:shadow-xl ">
              <CardHeader>
                <CardTitle>{poll.title}</CardTitle>
                <CardDescription>Created by: {poll.username}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{poll.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button onClick={() => router.push(`/poll/${poll.id}`)}>Vote</Button>
                <Button variant="outline" onClick={() => router.push(`/results/${poll.id}`)}>
                  Results
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="col-span-3 text-center">No polls available. Create one!</p>
        )}
      </div>

{/* About Section */}
<div id="about" className="mt-12 p-6 text-center rounded-lg shadow-lg bg-primary text-primary-foreground ">
  <h2 className="text-2xl font-bold mb-2">📖 About SurveyMadness</h2>
  <p className="text-lg mb-4">
    SurveyMadness is a platform for sharing and exploring thought-provoking questions. 
    Participate in surveys, see how others think, and even create your own polls to spark discussions. 
    Your opinions matter—join the conversation!
  </p>
</div>




{/* Footer Section (Contact) */}
<footer id="contact" className="mt-12 p-6 text-center rounded-lg shadow-lg bg-primary text-primary-foreground ">
  <p className="text-lg font-semibold">Contact Us</p>
  <p>
    Email: <a href="mailto:praisekibet468@gmail.com" className="hover:underline">surveyMadness69@gmail.com</a>
  </p>
  <p>
    Phone: <a href="tel:+254758314060" className="hover:underline">075X31X06X</a>
  </p>
  <hr className="my-4 border-primary-foreground/50" />
  <p className="text-sm opacity-75">© {new Date().getFullYear()} CodeSpartan. All rights reserved.</p>
</footer>


    </div>  
  );
}
