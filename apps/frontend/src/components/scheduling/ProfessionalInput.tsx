import { useProfessionals } from "@barba/ui";
import { Professional } from "@barba/core";
import Image from "next/image";

export interface ProfessionalInputProps {
  professional: Professional | null
  professionalHasChanged: (professional: Professional) => void
}

function Option(props: {
  professional: Professional
  onClick: (p: Professional) => void
  selected?: boolean
}) {
  return (
    <div
      className={`flex flex-col items-center cursor-pointer select-none rounded-lg border w-[150px] h-[180px] ${props.selected ? 'border-green-400' : 'border-zinc-700'} overflow-hidden`}
      onClick={() => props.onClick(props.professional)}
    >
      <Image
        src={props.professional.imageUrl}
        alt={props.professional.name}
        width={150}
        height={150}
      />
      <div
        className={`
          py-2 w-full text-center text-xs ${props.selected ? 'text-black bg-green-400 font-semibold' : 'text-zinc-400 font-light bg-zinc-900'}
        `}
      >
        {props.professional.name.split(' ')[0]}
      </div>
    </div >
  )
}

const ProfessionalInput = (props: ProfessionalInputProps) => {
  const { professionals } = useProfessionals()

  return (
    <div className="flex flex-col gap-5">
      <span className="text-sm uppercase text-zinc-400">
        Profissionais Disponíveis
      </span>
      <div className="grid grid-cols-2 md:grid-cols-3 self-start gap-5">
        {professionals.map((professional: Professional) => (
          <Option
            key={professional.id}
            professional={professional}
            onClick={props.professionalHasChanged}
            selected={professional.id === props.professional?.id}
          />
        ))}
      </div>
    </div>
  )
}

export default ProfessionalInput
