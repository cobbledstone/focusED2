// Utility functions for localStorage to simulate state persistence

export const saveQuizResult = (subjectId, topicId, score, difficulty) => {
  const results = JSON.parse(localStorage.getItem('quizResults') || '[]')
  results.push({
    subjectId,
    topicId,
    score,
    difficulty,
    timestamp: new Date().toISOString()
  })
  localStorage.setItem('quizResults', JSON.stringify(results))
  return results
}

export const getLastQuizScore = (topicId) => {
  const results = JSON.parse(localStorage.getItem('quizResults') || '[]')
  const topicResults = results.filter(r => r.topicId === topicId)
  return topicResults.length > 0 ? topicResults[topicResults.length - 1].score : null
}

export const getRecommendedDifficulty = (lastScore) => {
  if (lastScore === null) return 'medium' // Default for first attempt
  if (lastScore < 50) return 'easy'
  if (lastScore >= 50 && lastScore <= 75) return 'medium'
  return 'hard'
}

export const updateStudentProgress = (subjectId, topicId, newScore) => {
  // This would update the student's progress in a real system
  // For now, we'll just store it in localStorage
  const progress = JSON.parse(localStorage.getItem('studentProgress') || '{}')
  if (!progress[subjectId]) progress[subjectId] = {}
  progress[subjectId][topicId] = {
    mastery: newScore,
    lastScore: newScore,
    lastUpdated: new Date().toISOString()
  }
  localStorage.setItem('studentProgress', JSON.stringify(progress))
}

