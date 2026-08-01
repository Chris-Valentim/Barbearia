import { useContext } from "react";
import { SchedulingContext } from '@/data/contexts/SchedulingContext'

const useScheduling = () => useContext(SchedulingContext)
export default useScheduling
