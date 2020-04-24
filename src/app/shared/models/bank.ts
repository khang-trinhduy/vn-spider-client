import { Product } from './product'

export interface Bank {
  _id: string
  name: string
  code: string
  link: string
  products: Product[]
}
