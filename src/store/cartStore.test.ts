import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from './cartStore'
import type { Product } from '@/lib/api'

const someProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'A product for testing',
  price: 10,
  category: 'test',
  stock: 5,
}

const otherProduct: Product = { ...someProduct, id: '2', price: 25 }

beforeEach(() => {
  useCartStore.setState({ items: [] }) // start every test with an empty cart
})

describe('cart', () => {
  it('adds an item to the cart', () => {
    useCartStore.getState().addItem(someProduct) // action
    expect(useCartStore.getState().items).toHaveLength(1) // check
  })
})

it('increases quantity when the same product is added twice', () => {
  const { addItem } = useCartStore.getState()
  addItem(someProduct)
  addItem(someProduct)

  const items = useCartStore.getState().items
  expect(items).toHaveLength(1)
  expect(items[0].quantity).toBe(2)
})

it('removes an item from the cart', () => {
  const { addItem, removeItem } = useCartStore.getState()
  addItem(someProduct)
  removeItem(someProduct.id)

  expect(useCartStore.getState().items).toHaveLength(0)
})

it('calculates the total across multiple products', () => {
  const { addItem } = useCartStore.getState()
  addItem(someProduct) // 10
  addItem(otherProduct) // 25

  expect(useCartStore.getState().getTotal()).toBe(35)
})

it('has a total of 0 when the cart is empty', () => {
  expect(useCartStore.getState().getTotal()).toBe(0)
})