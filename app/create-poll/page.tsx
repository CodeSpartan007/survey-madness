"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"

export default function CreatePoll() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [options, setOptions] = useState(["", ""])
  const [error, setError] = useState("")
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem("user")
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser))
    } else {
      router.push("/login")
    }
  }, [router])

  const handleAddOption = () => {
    setOptions([...options, ""])
  }

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = [...options]
      newOptions.splice(index, 1)
      setOptions(newOptions)
    }
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validate
    if (!title.trim()) {
      setError("Title is required")
      return
    }

    if (options.filter((opt) => opt.trim()).length < 2) {
      setError("At least two valid options are required")
      return
    }

    try {
      const response = await fetch("/api/polls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          options: options.filter((opt) => opt.trim()),
          userId: user.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create poll")
      }

      router.push("/")
    } catch (err) {
      setError(err.message)
    }
  }

  if (!user) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create a New Poll</CardTitle>
          <CardDescription>Fill in the details to create your poll</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-red-100 text-red-600 rounded">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="title">Poll Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your question here"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide additional context for your poll"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Poll Options</Label>
              {options.map((option, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                  {options.length > 2 && (
                    <Button type="button" variant="outline" size="icon" onClick={() => handleRemoveOption(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={handleAddOption} className="mt-2">
                Add Option
              </Button>
            </div>
            <Button type="submit" className="w-full">
              Create Poll
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

