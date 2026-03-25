import { useState } from 'react'
import EmojiObjectsOutlinedIcon from '@mui/icons-material/EmojiObjectsOutlined'
import s from './AiDescription.module.scss'

interface AiDescriptionProps {
  value: string
  title: string
  category: string
  params: Record<string, unknown>
  onApply: (newValue: string) => void
}

export function AiDescription({
  value,
  title,
  category,
  params,
  onApply,
}: AiDescriptionProps) {
  const [aiText, setAiText] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const prompt = `
    Ты — AI‑ассистент, который пишет **краткие, грамотные и продающие описания объявлений** на русском языке. 
    Используй только те данные, которые реально есть. Если какое-то поле отсутствует — пропусти его. 
    Не вставляй placeholders вроде "[напишите здесь ...]" и не используй английские слова.

    Требования:
    • Язык: русский
    • Стиль: продающий, грамотный, привлекающий внимание покупателей
    • Текст: один цельный блок, минимум 3 предложения
    • Все параметры, которые есть, включай естественно в описание
    • Если поле description пустое — сгенерируй новое описание
    • Если поле description есть — улучши его, исправив ошибки и сделав более привлекательным
    • Не вставляй технические указания или слова типа "additional"

    Данные объявления:
    Название: ${title}
    Категория: ${category}
    Параметры:
    ${Object.entries(params).map(([key, value]) => `${key}: ${value}`).join('\n')}

    Текущее описание: "${value}"

    Вывод: только текст описания объявления.
`

  const handleClick = async () => {
    setError(null)
    setLoading(true)
    setShowTooltip(false)

    try {
      const res = await fetch(
        `${import.meta.env.VITE_OLLAMA_BASE_URL}/api/generate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'llama3.2',
            prompt,
            stream: false,
            max_tokens: 400,
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        const errMsg = data.error || data.message || 'Ошибка AI'
        throw new Error(errMsg)
      }

      const text = data.response?.trim()
      if (!text) throw new Error('Пустой ответ от AI')

      setAiText(text)
      setShowTooltip(true)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Неизвестная ошибка'
      setError(`Произошла ошибка: ${msg}`)
      setShowTooltip(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={s.aiBlock}>
      <button
        className={s.improveDescription}
        type="button"
        onClick={handleClick}
        disabled={loading}
      >
        <EmojiObjectsOutlinedIcon />
        {loading
          ? 'Загрузка…'
          : value.trim()
          ? 'Улучшить описание'
          : 'Придумать описание'}
      </button>

      {showTooltip && (
        <div className={s.aiTooltip}>
          {error ? (
            <>
              <p className={s.error}>{error}</p>
              <button
                className={s.closeBtn}
                onClick={() => setShowTooltip(false)}
              >
                Закрыть
              </button>
            </>
          ) : (
            <>
              <h2 className={s.aiTitle}>Ответ AI:</h2>
              <p className={s.aiText}>{aiText}</p>
              <div className={s.aiButtons}>
                <button
                  className={s.applyBtn}
                  onClick={() => {
                    if (aiText) onApply(aiText)
                    setShowTooltip(false)
                  }}
                >
                  Применить
                </button>
                <button
                  className={s.closeBtn}
                  onClick={() => setShowTooltip(false)}
                >
                  Закрыть
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}