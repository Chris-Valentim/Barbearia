import { Professional } from "../professional";
import { Service } from "../service";

export default interface Scheduling {
  id: number
  emailClient: string
  date: Date
  professional: Professional
  services: Service[]
}