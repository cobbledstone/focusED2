import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import subjectsData from '../data/subjects.json'

function SubjectPage() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
  const [subject, setSubject] = useState(null)

  useEffect(() => {
    const found = subjectsData.find(s => s.id === subjectId)
    setSubject(found)
  }, [subjectId])

  if (!subject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Subject not found</p>
      </div>
    )
  }

  const getMasteryColor = (mastery) => {
    if (mastery >= 80) return 'bg-green-500'
    if (mastery >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Dashboard
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{subject.name}</h1>
              <p className="text-gray-600">Mastery: {subject.mastery}% • {subject.status}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subject.topics.map((topic) => (
              <div
                key={topic.id}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition cursor-pointer border-2 border-transparent hover:border-primary-300"
                onClick={() => navigate(`/quiz/${subjectId}/${topic.id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{topic.name}</h3>
                  {topic.priority && (
                    <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                      Priority
                    </span>
                  )}
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Mastery</span>
                    <span className="text-sm font-semibold text-gray-900">{topic.mastery}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getMasteryColor(topic.mastery)}`}
                      style={{ width: `${topic.mastery}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                  <span>Last Score: {topic.lastScore}%</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/quiz/${subjectId}/${topic.id}`)
                  }}
                  className="w-full bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 transition"
                >
                  Start Practice
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default SubjectPage

