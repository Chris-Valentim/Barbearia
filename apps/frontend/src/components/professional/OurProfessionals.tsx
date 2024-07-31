'use client'
import { Professional } from "@barba/core"
import { useProfessionals } from "@barba/ui"
import ProfessionalItem from "./ProfessionalItem"
import Title from "../shared/Title"

const OurProfessionals = () => {
  const { professionals } = useProfessionals()

  return (
    <div className="container flex flex-col items-center gap-y-16">
      <Title
        tag="Time"
        main="Nossos Brutos"
        secondary="Só os mais brabos estão aqui! Temos o orgulho de ter o time mais qualificado do Brasil!"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {professionals.map((professional: Professional) => (
          <ProfessionalItem key={professional.id} professional={professional} />
        ))}
      </div>
    </div>
  )
}

export default OurProfessionals
