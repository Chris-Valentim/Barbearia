import { useContext } from "react";
import { SchedulingContext } from '../contexts/SchedulingContext'

const useScheduling = () => useContext(SchedulingContext)
export default useScheduling
