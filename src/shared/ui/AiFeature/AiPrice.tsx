import { useState } from 'react'
import EmojiObjectsOutlinedIcon from '@mui/icons-material/EmojiObjectsOutlined'
import s from './AiFeature.module.scss'

interface AiPriceProps {
  title: string
  category: string
  params: Record<string, unknown>
  currentPrice?: number
  onApply: (price: number) => void
}

export function AiPrice({ title, category, params, currentPrice, onApply}: AiPriceProps) {
  const [aiText, setAiText] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    setError(null)
    setShowTooltip(false)

    try {
      const prompt = `Ты — AI-ассистент для оценки рыночной цены товара. Используй только предоставленные данные. Данные:
      Название: ${title}
      Категория: ${category}
      Параметры:
      ${Object.entries(params).map(([k, v]) => `${k}: ${v}`).join('\n')}
      Текущая цена: ${currentPrice ?? 'не указана'}
      Предложи диапазон рыночной цены и краткое рассуждение по пунктам (не более 50 слов). Ответ только на русском языке.`

      const res = await fetch(`${import.meta.env.VITE_OLLAMA_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'llama3.2', prompt, stream: false, max_tokens: 300 }),
      })

      const data = await res.json()
      if (!res.ok) {
        const msg = data.error || data.message || 'Ошибка AI'
        throw new Error(msg)
      }

      const text = data.response?.trim()
      if (!text) throw new Error('Пустой ответ от AI')

      setAiText(text)
      setShowTooltip(true)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Неизвестная ошибка'
      setError(msg)
      setShowTooltip(true)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = () => {
    if (!aiText) return
    // * Извлекаем все числовые значения из текста (игнорируя любые символы кроме цифр и пробелов)
    const numbers = aiText.match(/\d[\d\s]*/g)
    if (!numbers || numbers.length === 0) return

    // * Преобразуем строки чисел в числа, удаляя пробелы
    const parsedNumbers = numbers.map(numStr => Number(numStr.replace(/\s+/g, ''))).filter(n => !isNaN(n))

    if (parsedNumbers.length === 0) return

    let price: number

    if (parsedNumbers.length === 1) {
      price = parsedNumbers[0]
    } else {
      // * Если есть диапазон, берем среднее значение
      const min = Math.min(...parsedNumbers)
      const max = Math.max(...parsedNumbers)
      price = Math.round((min + max) / 2)
    }

    onApply(price)
    setShowTooltip(false)
  }

  return (
    <div>
      <button className={s.improveDescription} 
      type="button" 
      onClick={handleClick} 
      disabled={loading}
      >
        <EmojiObjectsOutlinedIcon />
        {loading 
        ? 'Выполняется запрос' 
        : 'Узнать рыночную цену'}
      </button>

      {showTooltip && (
        <div className={s.aiTooltip}>
          {error ? (
            <>
              <p className={s.error}>Произошла ошибка при запросе к AI: {error}</p>
              <button 
              className={s.closeBtn} 
              onClick={() => setShowTooltip(false)}>
                Закрыть
              </button>
            </>
          ) : (
            <>
							<h2 className={s.aiTitle}>Ответ AI:</h2>
              <p className={s.aiText}>{aiText}</p>
              <div className={s.aiButtons}>
                <button className={s.applyBtn} onClick={handleApply}>Применить</button>
                <button className={s.closeBtn} onClick={() => setShowTooltip(false)}>Закрыть</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
