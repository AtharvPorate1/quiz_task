# Quiz App


## Introduction

This Quiz App is a Next.js-based application that allows users to take quizzes with multiple-choice questions. It features a dynamic UI, timer functionality, and supports questions with multiple correct answers.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/AtharvPorate1/quiz_task.git
   ```

2. Navigate to the project directory:
   ```
   cd quiz_task
   ```

3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

4. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

5. Open your browser and visit `http://localhost:3000`


## How It Works

### Frontend

The frontend is built using Next.js and Tailwind CSS. The main components are:

1. **QuizPage** (`app/quiz/page.tsx`): This is the main quiz interface where users answer questions. It handles:
   - Fetching quiz data
   - Displaying questions and options
   - Timer functionality
   - Submitting answers
   - Progressing through the quiz

2. **Results Page** (`app/result/page.tsx`): Displays the final results of the quiz.
   
3. **Landing** (`app/page.tsx`): Displays the button to start the test.
---
### Bonus Task Completion

In addition to the core requirements, this project also includes a containerized application using Docker, demonstrating proficiency in modern deployment practices.

Additional featues

- 30-second countdown per question
- Auto-progression when time expires
- Visual time indicator

### Backend

The backend is implemented using Next.js API routes. It handles:

1. Starting the quiz
2. Checking answers
3. Calculating final scores

## API Routes

1. **Start Quiz** (`/api/start`)
   - Method: GET
   - Description: Initializes a new quiz and returns the quiz data.
   - Response: JSON object containing `quizId` and `questions` array.

2. **Check Answer** (`/api/check-answer`)
   - Method: POST
   - Description: Checks the submitted answer(s) for a question.
   - Request Body: 
     ```json
     {
       "questionId": number,
       "selectedAnswers": number[]
     }
     ```
   - Response: JSON object containing `isCorrect`, `partiallyCorrect`, `correctSelectedCount`, `totalCorrectOptions`, and `score`.

3. **Finish Quiz** (`/api/finish-quiz`)
   - Method: POST
   - Description: Calculates the final score and stores the quiz results.
   - Request Body:
     ```json
     {
       "quizId": string,
       "answers": [
         {
           "questionId": number,
           "selectedAnswers": number[]
         }
       ]
     }
     ```
   - Response: JSON object containing `correct`, `incorrect`, `partiallyCorrect`, `score`, and `totalQuestions`.

## Customization

### Adding/Modifying Questions

To add or modify questions, edit the `json/questions.json` file. Each question should have the following structure:

```json
{
  "id": number,
  "question": string,
  "options": string[],
  "correctAnswers": number[],
  "image": string (optional)
}
```

### Styling

The app uses Tailwind CSS for styling. You can customize the appearance by modifying the Tailwind classes in the component files or by editing the `styles/globals.css` file.


