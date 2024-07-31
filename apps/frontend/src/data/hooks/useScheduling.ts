import { useContext } from "react";
import { ContentScheduling } from '@/data/contexts/ContentScheduling'

const useScheduling = () => useContext(ContentScheduling)
export default useScheduling
