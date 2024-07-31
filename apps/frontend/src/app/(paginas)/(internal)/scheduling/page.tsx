'use client'
import { useState } from 'react'
import { Professional, Service } from '@barba/core'
import useScheduling from '@/data/hooks/useScheduling'
import Summary from '@/components/scheduling/Summary'
import ServiceInput from '@/components/scheduling/ServiceInput'
import ProfessionalInput from '@/components/scheduling/ProfissionalInput'
import Steps from '@/components/shared/Steps'
import DateInput from '@/components/scheduling/DateInput'
import Header from '@/components/shared/Header'

const PageScheduling = () => {
  const [allowsNextStep, setAllowsNextStep] = useState<boolean>(false)
  const {
    professional,
    services,
    date,
    selectProfessional,
    selectServices,
    selectDate,
    numberOfSlots,
  } = useScheduling()

  function professionalChanged(professional: Professional) {
    selectProfessional(professional)
    setAllowsNextStep(!!professional)
  }

  function servicesChanged(service: Service[]) {
    selectServices(services)
    setAllowsNextStep(services.length > 0)
  }

  function dateChanged(date: Date) {
    selectDate(date)

    const hasDate = date
    const validTime = date.getHours() >= 8 && date.getHours() <= 21
    setAllowsNextStep(hasDate && validTime)
  }

  return (
    <div className='flex flex-col bg-zinc-900'>
      <Header title='Agendamento de Serviço' description='Seja atendido exatamente no horário marcado.' />
      <div className='container flex flex-col lg:flex-row items-center lg:items-start lg:justify-around gap-10 lg:gap-0 py-10'>
        <Steps
          allowsNextStep={allowsNextStep}
          allowsNextStepChanged={setAllowsNextStep}
          labels={[
            'Selecione o profissional',
            'Informe os serviços',
            'Escolha o horário',
          ]}
        >
          <ProfessionalInput professional={professional} professionalHasChanged={professionalChanged} />
          <ServiceInput services={services} serviceHasChanged={servicesChanged} />
          <DateInput
            date={date}
            dateChanged={dateChanged}
            numberOfSlots={numberOfSlots()}
          />
        </Steps>
        <Summary />
      </div>
    </div>
  )
}

export default PageScheduling
