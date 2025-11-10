import type { FieldError } from 'react-hook-form'

type Props = {
  label: string
  children: React.ReactNode
  error?: FieldError
  required?: boolean
}

export default function FormField({ label, children, error, required }: Props) {
  return (
    <div className="mb-6">
      <label className="block text-white font-medium mb-2">
        {label} {required ? <span className="text-red-400">*</span> : null}
      </label>
      {children}
      {error && <p className="text-red-400 text-sm mt-2">{error.message}</p>}
    </div>
  )
}
