import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import subjectsData from '../data/subjects.json'

function Feedback() {
  const location = useLocation()
  const navigate = useNavigate()
  const { score, totalQuestions, subjectId, topicId, difficulty } = location.state || {}
  const [recommendation, setRecommendation] = useState(null)

  useEffect(() => {
    if (!score && score !== 0) {
      navigate('/dashboard')
      return
    }

    // Determine recommendation based on score
    let nextDifficulty = 'medium'
    let action = 'Continue practicing'
    let reason = ''

    if (score < 50) {
      nextDifficulty = 'easy'
      action = 'Review fundamentals'
      reason = 'Your score indicates you need to strengthen the basics. Try easier questions to build confidence.'
    } else if (score >= 50 && score <= 75) {
      nextDifficulty = 'medium'
      action = 'Keep practicing'
      reason = 'You\'re making good progress! Continue with medium difficulty to solidify your understanding.'
    } else {
      nextDifficulty = 'hard'
      action = 'Challenge yourself'
      reason = 'Excellent work! You\'re ready for more challenging questions to master this topic.'
    }

    // Find next topic recommendation
    const subject = subjectsData.find(s => s.id === subjectId)
    const currentTopicIndex = subject?.topics.findIndex(t => t.id === topicId) || -1
    let nextTopic = null

    if (subject && currentTopicIndex >= 0 && currentTopicIndex < subject.topics.length - 1) {
      nextTopic = subject.topics[currentTopicIndex + 1]
    } else if (subject && subject.topics.length > 0) {
      // If last topic, recommend a topic from another subject or revision
      const otherSubjects = subjectsData.filter(s => s.id !== subjectId)
      if (otherSubjects.length > 0) {
        const otherSubject = otherSubjects[0]
        if (otherSubject.topics.length > 0) {
          nextTopic = { ...otherSubject.topics[0], subjectName: otherSubject.name, subjectId: otherSubject.id }
        }
      }
    }

    setRecommendation({
      nextDifficulty,
      action,
      reason,
      nextTopic,
      shouldRevise: score < 50
    })
  }, [score, subjectId, topicId, navigate])

  if (!recommendation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading feedback...</p>
      </div>
    )
  }

  const getScoreColor = () => {
    if (score >= 75) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = () => {
    if (score >= 75) return 'bg-green-100'
    if (score >= 50) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Score Summary */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="text-center mb-6">
            <div className={`inline-block p-6 rounded-full ${getScoreBg()} mb-4`}>
              <span className={`text-5xl font-bold ${getScoreColor()}`}>{score}%</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Results</h2>
            <p className="text-gray-600">
              You answered {Math.round((score / 100) * totalQuestions)} out of {totalQuestions} questions correctly
            </p>
            <p className="text-sm text-gray-500 mt-2">Difficulty: <span className="capitalize">{difficulty}</span></p>
          </div>
        </div>

        {/* Feedback Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 mb-6 text-white">
          <h3 className="text-xl font-semibold mb-4">📊 Performance Analysis</h3>
          <p className="mb-4">{recommendation.reason}</p>
          <div className="bg-white/20 rounded-lg p-4">
            <p className="font-semibold mb-2">Recommended Action:</p>
            <p className="text-lg">{recommendation.action}</p>
            <p className="text-sm mt-2 opacity-90">Next difficulty level: <span className="capitalize font-semibold">{recommendation.nextDifficulty}</span></p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {recommendation.shouldRevise && (
            <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-orange-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🔄 Revision Recommended</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Consider reviewing this topic again with easier questions to strengthen your foundation.
              </p>
              <button
                onClick={() => navigate(`/quiz/${subjectId}/${topicId}`)}
                className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
              >
                Retry with Easier Questions
              </button>
            </div>
          )}

          {recommendation.nextTopic && (
            <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-primary-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">➡️ Next Topic</h3>
              <p className="text-gray-600 mb-2 text-sm">
                Ready to move forward? Try the next topic:
              </p>
              <p className="font-semibold text-primary-700 mb-4">
                {recommendation.nextTopic.name}
                {recommendation.nextTopic.subjectName && ` (${recommendation.nextTopic.subjectName})`}
              </p>
              <button
                onClick={() => navigate(`/quiz/${recommendation.nextTopic.subjectId || subjectId}/${recommendation.nextTopic.id}`)}
                className="w-full bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                Start Next Topic
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate(`/subject/${subjectId}`)}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            View All Topics
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </main>
    </div>
  )
}

export default Feedback

