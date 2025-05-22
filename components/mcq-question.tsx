"use client"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface MCQQuestionProps {
  questionNumber: number
  question: {
    id: number
    question: string
    options: string[]
  }
  selectedAnswer: number | null
  onAnswerSelect: (questionId: number, answerIndex: number) => void
  disabled?: boolean
}

export function MCQQuestion({
  questionNumber,
  question,
  selectedAnswer,
  onAnswerSelect,
  disabled = false,
}: MCQQuestionProps) {
  return (
    <div className="max-w-3xl mx-auto w-full">
      <h2 className="text-xl font-medium mb-6">
        {questionNumber}. {question.question}
      </h2>
      <RadioGroup
        value={selectedAnswer !== null ? selectedAnswer.toString() : undefined}
        onValueChange={(value) => {
          if (!disabled) {
            onAnswerSelect(question.id, Number.parseInt(value))
          }
        }}
        className="space-y-3"
        disabled={disabled}
      >
        {question.options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2 rounded-md border p-4 hover:bg-slate-50">
            <RadioGroupItem
              value={index.toString()}
              id={`q${question.id}-option-${index}`}
              disabled={disabled}
              checked={selectedAnswer === index}
            />
            <Label
              htmlFor={`q${question.id}-option-${index}`}
              className={`w-full cursor-pointer ${disabled ? "cursor-not-allowed opacity-70" : ""}`}
            >
              {String.fromCharCode(65 + index)}. {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
