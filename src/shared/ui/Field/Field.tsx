import type { ReactNode } from 'react'
import s from './Field.module.scss'

type FieldProps = {
  label: string
  children: ReactNode
  required?: boolean
  characteristics?: boolean
}

export function Field({ label, children, required, characteristics }: FieldProps) {
  return (
    <label className={characteristics ? s.charLabel : s.label}>
      <div>
        <span>
          {required && <span className="star">* </span>}
          {label}
        </span>
        {children}
      </div>
    </label>
  )
}