"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminHeader } from "@/components/admin/admin-header"
import { getChallenges, saveChallenge, deleteChallenge } from "@/lib/data-service"
import { Plus, Trash } from "lucide-react"

export default function EditChallengePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [challenge, setChallenge] = useState<any>(null)

  // Form state
  const [title, setTitle] = useState("")
  const [language, setLanguage] = useState("python")
  const [description, setDescription] = useState("")
  const [questions, setQuestions] = useState<any[]>([])

  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuthenticated")
    if (adminAuth !== "true") {
      router.push("/admin")
      return
    }
    setIsAuthenticated(true)

    // Load challenges from our data service
    const challenges = getChallenges()

    // Find the challenge by ID
    const foundChallenge = challenges.find((c) => c.id.toString() === params.id)

    // Populate form with challenge data if found
    if (foundChallenge) {
      setChallenge(foundChallenge)
      setTitle(foundChallenge.title)
      setLanguage(foundChallenge.language)
      setDescription(foundChallenge.description)

      // Handle both old format (errors) and new format (questions)
      if (foundChallenge.questions) {
        setQuestions(foundChallenge.questions)
      } else {
        // Convert old format to new format
        const convertedQuestions = [
          {
            id: 1,
            question: "What is wrong with this code?",
            options: ["Option 1", "Option 2", "Option 3", "Option 4"],
            correctAnswer: 0,
          },
        ]
        setQuestions(convertedQuestions)
      }
    } else {
      // Challenge not found, redirect to dashboard
      router.push("/admin/dashboard")
    }
  }, [router, params.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Create updated challenge
    const updatedChallenge = {
      ...challenge,
      title,
      language,
      description,
      questions,
    }

    // Save challenge
    saveChallenge(updatedChallenge)

    // Show success message
    alert("Challenge updated successfully!")
    router.push("/admin/dashboard")
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this challenge?")) {
      deleteChallenge(challenge.id)
      alert("Challenge deleted successfully!")
      router.push("/admin/dashboard")
    }
  }

  const handleQuestionChange = (index: number, field: string, value: string) => {
    const updatedQuestions = [...questions]
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    }
    setQuestions(updatedQuestions)
  }

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex].options[optionIndex] = value
    setQuestions(updatedQuestions)
  }

  const handleCorrectAnswerChange = (questionIndex: number, value: string) => {
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex].correctAnswer = Number.parseInt(value)
    setQuestions(updatedQuestions)
  }

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
      },
    ])
  }

  const removeQuestion = (index: number) => {
    if (questions.length <= 1) {
      alert("You must have at least one question")
      return
    }

    const updatedQuestions = questions.filter((_, i) => i !== index)
    // Update IDs to be sequential
    updatedQuestions.forEach((q, i) => {
      q.id = i + 1
    })

    setQuestions(updatedQuestions)
  }

  if (!isAuthenticated || !challenge) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader />

      <main className="container mx-auto p-4 pt-24">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Edit Challenge</h1>
          <p className="text-muted-foreground">Update the details of this multiple-choice challenge</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Challenge Details</CardTitle>
              <CardDescription>Edit information about the challenge</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Challenge Title</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Programming Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="c">C</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Questions</h3>
                  <Button type="button" onClick={addQuestion} variant="outline" size="sm">
                    <Plus className="mr-1 h-4 w-4" /> Add Question
                  </Button>
                </div>

                {questions.map((question, questionIndex) => (
                  <Card key={questionIndex} className="border-dashed">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Question {questionIndex + 1}</CardTitle>
                        <Button
                          type="button"
                          onClick={() => removeQuestion(questionIndex)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`question-${questionIndex}`}>Question Text</Label>
                        <Input
                          id={`question-${questionIndex}`}
                          value={question.question}
                          onChange={(e) => handleQuestionChange(questionIndex, "question", e.target.value)}
                          placeholder="What is the output of print(2 + 2 * 3)?"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Options</Label>
                        {question.options.map((option: string, optionIndex: number) => (
                          <div key={optionIndex} className="flex items-center gap-2">
                            <Input
                              value={option}
                              onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                              placeholder={`Option ${optionIndex + 1}`}
                              required
                            />
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`correct-answer-${questionIndex}`}>Correct Answer</Label>
                        <Select
                          value={question.correctAnswer.toString()}
                          onValueChange={(value) => handleCorrectAnswerChange(questionIndex, value)}
                        >
                          <SelectTrigger id={`correct-answer-${questionIndex}`}>
                            <SelectValue placeholder="Select correct answer" />
                          </SelectTrigger>
                          <SelectContent>
                            {question.options.map((_: string, optionIndex: number) => (
                              <SelectItem key={optionIndex} value={optionIndex.toString()}>
                                Option {optionIndex + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/dashboard")}>
                Cancel
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </main>
    </div>
  )
}
