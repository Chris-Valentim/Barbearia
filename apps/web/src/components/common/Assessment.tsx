import { IconStar, IconStarFilled, IconStarHalfFilled } from '@tabler/icons-react'

export interface AssessmentProps {
  value: number
  amount: number
}

const Assessment = (props: AssessmentProps) => {
  const { value: assessment, amount } = props

  const star = Array.from({ length: 5 }, (_, index) => {
    const value = index + 1
    if (assessment >= value) {
      return <IconStarFilled key={index} size={18} />
    }
    if (assessment + 1 > value) {
      return <IconStarHalfFilled key={index} size={18} />
    }
    return <IconStar key={index} size={18} />
  })

  return (
    <div className='flex items-end gap-2'>
      <div className='flex items-center gap-1 text-yellow-400'>
        {star}
      </div>
      <div className='flex text-xs text-zinc-300'>
        {amount}
      </div>
    </div>
  )
}

export default Assessment
