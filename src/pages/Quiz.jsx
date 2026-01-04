import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import easyQuestions from '../data/questions_easy.json'
import mediumQuestions from '../data/questions_medium.json'
import hardQuestions from '../data/questions_hard.json'
import { getLastQuizScore, getRecommendedDifficulty, saveQuizResult } from '../utils/storage'

function Quiz() {
  const { subjectId, topicId } = useParams()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answers, setAnswers] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [difficulty, setDifficulty] = useState('medium')

  useEffect(() => {
    // Determine difficulty based on last quiz score
    const lastScore = getLastQuizScore(topicId)
    const recommendedDifficulty = getRecommendedDifficulty(lastScore)
    setDifficulty(recommendedDifficulty)

    // Get questions based on difficulty and filter by subject/topic
    let questionPool = []
    if (recommendedDifficulty === 'easy') {
      questionPool = easyQuestions
    } else if (recommendedDifficulty === 'medium') {
      questionPool = mediumQuestions
    } else {
      questionPool = hardQuestions
    }

    // Filter questions by subject and topic, then shuffle and take 5-7
    const filtered = questionPool.filter(
      q => q.subject === subjectId && q.topic === topicId
    )

    // If not enough questions, use any questions from the difficulty level
    const finalQuestions = filtered.length >= 5 
      ? filtered.sort(() => Math.random() - 0.5).slice(0, 7)
      : questionPool.sort(() => Math.random() - 0.5).slice(0, 7)

    setQuestions(finalQuestions)
  }, [subjectId, topicId])

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNext = () => {
    if (selectedAnswer === null) return

    const newAnswers = [...answers, selectedAnswer]
    setAnswers(newAnswers)

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
    } else {
      // Quiz complete - calculate score
      const correctAnswers = questions.reduce((count, q, idx) => {
        return count + (newAnswers[idx] === q.correctAnswer ? 1 : 0)
      }, 0)
      const finalScore = Math.round((correctAnswers / questions.length) * 100)
      setScore(finalScore)
      setShowResult(true)
      
      // Save quiz result
      saveQuizResult(subjectId, topicId, finalScore, difficulty)
    }
  }

  const handleFinish = () => {
    navigate('/feedback', { 
      state: { 
        score, 
        totalQuestions: questions.length,
        subjectId,
        topicId,
        difficulty
      } 
    })
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading questions...</p>
      </div>
    )
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className={`text-6xl mb-4 ${score >= 75 ? 'text-green-500' : score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
              {score >= 75 ? '🎉' : score >= 50 ? '👍' : '📚'}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
            <p className="text-gray-600">Your Score: <span className="font-bold text-primary-600">{score}%</span></p>
            <p className="text-sm text-gray-500 mt-2">Difficulty: <span className="capitalize">{difficulty}</span></p>
          </div>
          <button
            onClick={handleFinish}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            View Feedback & Recommendations
          </button>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded capitalize">
                {difficulty}
              </span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${
                  selectedAnswer === index
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium text-gray-900">{option}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish Quiz'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Quiz

