"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MCQQuestion } from "@/components/mcq-question"
import { Timer } from "@/components/timer"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEvent } from "@/hooks/use-event"
import { getParticipants, updateParticipant } from "@/lib/data-service"
import { HomeButton } from "@/components/home-button"

// Define our questions directly here
const questions = [
  {
    id: 1,
    question: "Which layout manager is used by default for JFrame?",
    options: ["BorderLayout", "FlowLayout", "GridLayout", "CardLayout"],
    correctAnswer: 0, // A
  },
  {
    id: 2,
    question: "Which class is used to create a button in Java Swing?",
    options: ["JButton", "JLabel", "JRadioButton", "JTextArea"],
    correctAnswer: 0, // A
  },
  {
    id: 3,
    question: "What is the purpose of the setVisible() method in JFrame?",
    options: [
      "To set the size of the frame",
      "To set the title of the frame",
      "To make the frame visible on the screen",
      "To close the frame",
    ],
    correctAnswer: 2, // C
  },
  {
    id: 4,
    question: "Which of these methods is a part of Abstract Window Toolkit (AWT)?",
    options: ["display()", "paint()", "drawString()", "transient()"],
    correctAnswer: 1, // B
  },
  {
    id: 5,
    question:
      "Which of these modifiers can be used for a variable so that it can be accessed from any thread or parts of a program?",
    options: ["transient", "volatile", "global", "No modifier is needed"],
    correctAnswer: 1, // B
  },
  {
    id: 6,
    question: "Which of these operators can be used to get run time information about an object?",
    options: ["getInfo", "Info", "instanceof", "getinfoof"],
    correctAnswer: 2, // C
  },
  {
    id: 7,
    question: "_________ is not a part of JFC (Java Foundation Classes) that is used to create GUI application?",
    options: ["Swing", "AWT", "Both A & B", "None of the above"],
    correctAnswer: 0, // A
  },
  {
    id: 8,
    question: "Which of these functions is called to display the output of an applet?",
    options: ["display()", "paint()", "displayApplet()", "PrintApplet()"],
    correctAnswer: 1, // B
  },
  {
    id: 9,
    question: "Which of these methods can be used to output a string in an applet?",
    options: ["display()", "print()", "drawString()", "transient()"],
    correctAnswer: 2, // C
  },
  {
    id: 10,
    question:
      "Which of these modifiers can be used for a variable so that it can be accessed from any thread or parts of a program?",
    options: ["transient", "volatile", "global", "No modifier is needed"],
    correctAnswer: 1, // B
  },
  {
    id: 11,
    question: "Java applets are used to create _______________ applications",
    options: ["Graphical", "User interactive", "Both a & b", "None of these"],
    correctAnswer: 2, // C
  },
  {
    id: 12,
    question: "An Applet is a ________ of Panel:",
    options: ["Subclass", "Superclass", "Both a & b", "None of these"],
    correctAnswer: 0, // A
  },
  {
    id: 13,
    question: "Which package contains the Java Swing classes?",
    options: ["java.lang", "java.io", "java.util", "javax.swing"],
    correctAnswer: 3, // D
  },
  {
    id: 14,
    question: "______________________ follows MVC (Model View Controller) architecture.",
    options: ["Swing", "AWT", "Both A & B", "None of the above"],
    correctAnswer: 0, // A
  },
  {
    id: 15,
    question: "Which of the following architecture does the Swing framework use?",
    options: ["MVC", "MVP", "Layered architecture", "Master-Slave architecture"],
    correctAnswer: 0, // A
  },
  {
    id: 16,
    question: "A ____ is the abstract foundation class for SWING's non-menu user interface controls?",
    options: ["Container", "Jcomponent", "Component", "AbstractButton"],
    correctAnswer: 2, // C
  },
  {
    id: 17,
    question:
      "A ____ is a one-line input field that allows the user to choose a number or an object value from an ordered sequence?",
    options: ["JTextarea", "Jtextfield", "Jspinner", "Jslider"],
    correctAnswer: 2, // C
  },
  {
    id: 18,
    question: "Which class is used to create a button in Java Swing?",
    options: ["JButton", "JLabel", "JRadioButton", "JTextArea"],
    correctAnswer: 0, // A
  },
  {
    id: 19,
    question: "The ____ class serves as the foundation for all Swing components.",
    options: ["JButton", "JComponent", "JTextField", "Container"],
    correctAnswer: 1, // B
  },
  {
    id: 20,
    question: "invokeandwait() method in Swing framework is ____.",
    options: ["Synchronous", "Asynchronous", "Delayed", "Static"],
    correctAnswer: 0, // A
  },
]

export default function ChallengePage() {
  const router = useRouter()
  const [participantName, setParticipantName] = useState<string>("")
  const [participantId, setParticipantId] = useState<string>("")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes in seconds
  const [timeSpentByQuestion, setTimeSpentByQuestion] = useState<number[]>([])
  const [timeUp, setTimeUp] = useState(false)
  const [startTime] = useState(Date.now())
  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(new Set())

  const handleTimeUp = useEvent(() => {
    setTimeUp(true)
    saveProgress()
    const totalTimeSpent = 1800 - timeLeft
    localStorage.setItem("totalTimeSpent", totalTimeSpent.toString())
    calculateAndSaveScores()
    router.push("/completed")
  })

  const saveProgress = useCallback(() => {
    localStorage.setItem("timeSpentByQuestion", JSON.stringify(timeSpentByQuestion))
    localStorage.setItem("selectedAnswers", JSON.stringify(selectedAnswers))
    const totalTimeSpent = 1800 - timeLeft
    localStorage.setItem("totalTimeSpent", totalTimeSpent.toString())
  }, [timeSpentByQuestion, selectedAnswers, timeLeft])

  const calculateAndSaveScores = useCallback(() => {
    let score = 0
    Object.entries(selectedAnswers).forEach(([questionId, selectedAnswer]) => {
      const question = questions.find((q) => q.id === Number.parseInt(questionId))
      if (question && selectedAnswer === question.correctAnswer) {
        score++
      }
    })

    const completedChallenges = [{ id: 1, score: score }]
    localStorage.setItem("completedChallenges", JSON.stringify(completedChallenges))

    if (participantId) {
      const participants = getParticipants()
      const participant = participants.find((p) => p.id === participantId)
      if (participant) {
        participant.completedChallenges = completedChallenges
        participant.lastActive = new Date().toISOString()
        updateParticipant(participant)
      }
    }
  }, [selectedAnswers, participantId])

  useEffect(() => {
    const name = localStorage.getItem("participantName")
    const id = localStorage.getItem("participantId")

    if (!name || !id) {
      router.push("/login")
      return
    }

    setParticipantName(name)
    setParticipantId(id)

    // Load selected answers from localStorage if available
    const savedAnswers = JSON.parse(localStorage.getItem("selectedAnswers") || "{}")
    setSelectedAnswers(savedAnswers)

    // Initialize visited questions based on saved answers
    const visited = new Set<number>()
    Object.keys(savedAnswers).forEach((id) => {
      visited.add(Number.parseInt(id))
    })
    // Add current question to visited
    visited.add(questions[currentQuestionIndex].id)
    setVisitedQuestions(visited)

    setTimeSpentByQuestion(new Array(questions.length).fill(0))

    const savedTimeSpent = JSON.parse(localStorage.getItem("timeSpentByQuestion") || "null")
    if (savedTimeSpent) {
      setTimeSpentByQuestion(savedTimeSpent)
    }

    const savedTimeLeft = localStorage.getItem("timeLeft")
    if (savedTimeLeft) {
      setTimeLeft(Number.parseInt(savedTimeLeft))
    }

    if (!localStorage.getItem("challengeStartTime")) {
      localStorage.setItem("challengeStartTime", startTime.toString())
    }
  }, [router, startTime, currentQuestionIndex])

  useEffect(() => {
    if (timeUp) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleTimeUp()
          return 0
        }
        localStorage.setItem("timeLeft", (prev - 1).toString())
        return prev - 1
      })

      setTimeSpentByQuestion((prev) => {
        const updated = [...prev]
        updated[currentQuestionIndex] = (updated[currentQuestionIndex] || 0) + 1
        localStorage.setItem("timeSpentByQuestion", JSON.stringify(updated))
        return updated
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentQuestionIndex, timeUp, handleTimeUp])

  const handleAnswerSelect = useCallback((questionId: number, answerIndex: number) => {
    setSelectedAnswers((prev) => {
      const updated = { ...prev, [questionId]: answerIndex }
      localStorage.setItem("selectedAnswers", JSON.stringify(updated))
      return updated
    })
  }, [])

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      saveProgress()
      setCurrentQuestionIndex((prev) => prev + 1)

      // Mark the next question as visited
      setVisitedQuestions((prev) => {
        const newVisited = new Set(prev)
        newVisited.add(questions[currentQuestionIndex + 1].id)
        return newVisited
      })
    } else {
      saveProgress()
      calculateAndSaveScores()
      router.push("/completed")
    }
  }, [currentQuestionIndex, saveProgress, calculateAndSaveScores, router, questions])

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      saveProgress()
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }, [currentQuestionIndex, saveProgress])

  const handleFinish = useCallback(() => {
    saveProgress()
    calculateAndSaveScores()
    router.push("/completed")
  }, [saveProgress, calculateAndSaveScores, router])

  const currentQuestion = questions[currentQuestionIndex]

  // Check if this question has been visited before and has an answer
  const hasBeenAnswered = Object.prototype.hasOwnProperty.call(selectedAnswers, currentQuestion.id)
  const selectedAnswer = hasBeenAnswered ? selectedAnswers[currentQuestion.id] : null

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <HomeButton />
      <header className="sticky top-0 z-10 border-b bg-white p-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="font-medium">{participantName}</div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <Button onClick={handleFinish} variant="destructive" size="sm">
              Finish and View Results
            </Button>
            <Timer seconds={timeLeft} isRunning={!timeUp} />
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <MCQQuestion
            questionNumber={currentQuestionIndex + 1}
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            disabled={timeUp}
          />
        </div>

        <div className="mt-8 flex justify-between max-w-3xl mx-auto w-full">
          <Button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0 || timeUp}
            variant="outline"
            className="w-32"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Previous
          </Button>

          <Button
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === questions.length - 1 || timeUp}
            variant="outline"
            className="w-32"
          >
            Next <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  )
}
