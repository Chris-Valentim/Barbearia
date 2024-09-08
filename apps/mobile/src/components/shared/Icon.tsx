import { Ionicons } from '@expo/vector-icons'

export interface IconProps {
  nameIcon: React.ComponentProps<typeof Ionicons>['name']
  color?: string
  size?: number
}

const Icon = (props: IconProps) => {
  return (
    <Ionicons
      name={props.nameIcon}
      size={props.size ?? 28}
      {...props}
    />
  )
}

export default Icon
