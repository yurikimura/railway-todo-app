/**
 * 日時フォーマット関連のユーティリティ関数
 */

/**
 * ISO 8601 フォーマット（YYYY-MM-DDTHH:MM:SSZ）に変換
 * @param {Date|string} date - 変換する日時
 * @returns {string} ISO 8601 形式の文字列
 */
export const formatToISO = date => {
  if (!date) return ''
  const dateObj = date instanceof Date ? date : new Date(date)
  return dateObj.toISOString()
}

/**
 * datetime-local input用のフォーマット（YYYY-MM-DDTHH:MM）に変換
 * @param {Date|string} date - 変換する日時
 * @returns {string} datetime-local 形式の文字列
 */
export const formatToDatetimeLocal = date => {
  if (!date) return ''
  const dateObj = date instanceof Date ? date : new Date(date)

  // ローカル時間でフォーマット
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')
  const hours = String(dateObj.getHours()).padStart(2, '0')
  const minutes = String(dateObj.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * datetime-local形式からDateオブジェクトに変換
 * @param {string} datetimeLocal - datetime-local形式の文字列
 * @returns {Date} Date オブジェクト
 */
export const parseFromDatetimeLocal = datetimeLocal => {
  if (!datetimeLocal) return null
  return new Date(datetimeLocal)
}

/**
 * 日時を読みやすい形式で表示
 * @param {Date|string} date - 表示する日時
 * @returns {string} 読みやすい形式の文字列
 */
export const formatDisplayDate = date => {
  if (!date) return ''
  const dateObj = date instanceof Date ? date : new Date(date)

  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(dateObj)
}

/**
 * 残り時間を計算して表示用文字列を生成
 * @param {Date|string} limitDate - 期限日時
 * @returns {Object} { text: string, isOverdue: boolean, isToday: boolean }
 */
export const calculateTimeRemaining = limitDate => {
  if (!limitDate) return { text: '', isOverdue: false, isToday: false }

  const now = new Date()
  const limit = limitDate instanceof Date ? limitDate : new Date(limitDate)
  const diffMs = limit.getTime() - now.getTime()

  const isOverdue = diffMs < 0
  const absDiffMs = Math.abs(diffMs)

  const days = Math.floor(absDiffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor(
    (absDiffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  )
  const minutes = Math.floor((absDiffMs % (1000 * 60 * 60)) / (1000 * 60))

  let text = ''

  if (isOverdue) {
    if (days > 0) {
      text = `${days}日${hours}時間${minutes}分前に期限切れ`
    } else if (hours > 0) {
      text = `${hours}時間${minutes}分前に期限切れ`
    } else {
      text = `${minutes}分前に期限切れ`
    }
  } else {
    if (days > 0) {
      text = `残り${days}日${hours}時間${minutes}分`
    } else if (hours > 0) {
      text = `残り${hours}時間${minutes}分`
    } else {
      text = `残り${minutes}分`
    }
  }

  // 今日かどうかの判定
  const today = new Date()
  const isToday =
    limit.getFullYear() === today.getFullYear() &&
    limit.getMonth() === today.getMonth() &&
    limit.getDate() === today.getDate()

  return { text, isOverdue, isToday }
}
