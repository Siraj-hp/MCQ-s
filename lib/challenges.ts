export interface Challenge {
  id: number
  title: string
  language: string
  description: string
  questions: {
    id: number
    question: string
    options: string[]
    correctAnswer: number
  }[]
}

// Updated challenges with 10 MCQs per challenge
export const challenges: Challenge[] = [
  {
    id: 1,
    title: "Python Basics",
    language: "python",
    description: "Test your knowledge of Python basics with these multiple-choice questions.",
    questions: [
      {
        id: 1,
        question: "What is the output of print(2 + 2 * 3)?",
        options: ["8", "10", "12", "Error"],
        correctAnswer: 0,
      },
      {
        id: 2,
        question: "Which of the following is NOT a valid Python data type?",
        options: ["int", "float", "char", "bool"],
        correctAnswer: 2,
      },
      {
        id: 3,
        question: "What does the 'len()' function do in Python?",
        options: [
          "Returns the length of a string",
          "Returns the length of a list",
          "Returns the length of a dictionary",
          "All of the above",
        ],
        correctAnswer: 3,
      },
      {
        id: 4,
        question: "How do you create a list in Python?",
        options: ["[1, 2, 3]", "{1, 2, 3}", "(1, 2, 3)", "<1, 2, 3>"],
        correctAnswer: 0,
      },
      {
        id: 5,
        question: "Which operator is used for exponentiation in Python?",
        options: ["^", "**", "^^", "//"],
        correctAnswer: 1,
      },
      {
        id: 6,
        question: "What is the result of 10 / 3 in Python 3?",
        options: ["3", "3.0", "3.33", "3.333333..."],
        correctAnswer: 3,
      },
      {
        id: 7,
        question: "How do you comment a single line in Python?",
        options: ["// comment", "/* comment */", "# comment", "-- comment"],
        correctAnswer: 2,
      },
      {
        id: 8,
        question: "Which method is used to add an element to the end of a list?",
        options: ["list.add()", "list.append()", "list.insert()", "list.extend()"],
        correctAnswer: 1,
      },
      {
        id: 9,
        question: "What is the output of print('Hello' + 'World')?",
        options: ["Hello World", "HelloWorld", "Hello+World", "Error"],
        correctAnswer: 1,
      },
      {
        id: 10,
        question: "Which of the following is true about Python variables?",
        options: [
          "Variables must be declared before use",
          "Variables must have a type specified",
          "Variables are case-insensitive",
          "Variables are dynamically typed",
        ],
        correctAnswer: 3,
      },
    ],
  },
  {
    id: 2,
    title: "Python Control Flow",
    language: "python",
    description: "Test your knowledge of Python control flow statements.",
    questions: [
      {
        id: 11,
        question: "Which of the following is NOT a loop in Python?",
        options: ["for", "while", "do-while", "foreach"],
        correctAnswer: 2,
      },
      {
        id: 12,
        question: "What is the correct syntax for a Python if statement?",
        options: ["if (x > 5) {}", "if x > 5:", "if x > 5 then", "if (x > 5):"],
        correctAnswer: 1,
      },
      {
        id: 13,
        question: "How do you exit a loop prematurely in Python?",
        options: ["exit", "stop", "break", "return"],
        correctAnswer: 2,
      },
      {
        id: 14,
        question: "What does the 'continue' statement do in a loop?",
        options: [
          "Exits the loop",
          "Skips the current iteration",
          "Pauses the loop",
          "Restarts the loop from the beginning",
        ],
        correctAnswer: 1,
      },
      {
        id: 15,
        question: "Which of the following is a valid way to iterate through a list in Python?",
        options: ["for i in range(list):", "for i in list:", "foreach i in list:", "iterate(list)"],
        correctAnswer: 1,
      },
      {
        id: 16,
        question: "What is the output of the following code?\nfor i in range(3):\n    print(i)",
        options: ["0 1 2", "1 2 3", "0 1 2 3", "Error"],
        correctAnswer: 0,
      },
      {
        id: 17,
        question: "Which statement is used with 'try' to handle exceptions?",
        options: ["catch", "except", "finally", "handle"],
        correctAnswer: 1,
      },
      {
        id: 18,
        question: "What is the purpose of the 'else' clause in a loop?",
        options: [
          "It executes if the loop condition is false",
          "It executes after the loop completes normally (without break)",
          "It executes if an exception occurs",
          "It executes before the loop starts",
        ],
        correctAnswer: 1,
      },
      {
        id: 19,
        question: "What is the output of the following code?\ni = 1\nwhile i < 5:\n    print(i)\n    i += 1",
        options: ["1 2 3 4 5", "1 2 3 4", "0 1 2 3 4", "Error"],
        correctAnswer: 1,
      },
      {
        id: 20,
        question: "Which of the following is NOT a valid conditional operator in Python?",
        options: ["==", "!=", "<>", "<="],
        correctAnswer: 2,
      },
    ],
  },
]
