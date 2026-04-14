import { create } from 'zustand'
import type { Family, WeeklyPlan, ShoppingItem } from '../api/client'

interface FamilyStore {
  family: Family | null
  currentPlan: WeeklyPlan | null
  shoppingList: Record<string, ShoppingItem[]>
  isGenerating: boolean

  setFamily: (f: Family) => void
  setCurrentPlan: (p: WeeklyPlan) => void
  setShoppingList: (s: Record<string, ShoppingItem[]>) => void
  setGenerating: (v: boolean) => void
  updateDayRecipe: (dayId: string, recipe: any) => void
  toggleShoppingItem: (category: string, itemId: string) => void
}

export const useFamilyStore = create<FamilyStore>((set) => ({
  family: null,
  currentPlan: null,
  shoppingList: {},
  isGenerating: false,

  setFamily: (family) => set({ family }),
  setCurrentPlan: (currentPlan) => set({ currentPlan }),
  setShoppingList: (shoppingList) => set({ shoppingList }),
  setGenerating: (isGenerating) => set({ isGenerating }),

  updateDayRecipe: (dayId, recipe) =>
    set(state => {
      if (!state.currentPlan) return state
      return {
        currentPlan: {
          ...state.currentPlan,
          days: state.currentPlan.days.map(d =>
            d.id === dayId ? { ...d, recipe } : d
          )
        }
      }
    }),

  toggleShoppingItem: (category, itemId) =>
    set(state => ({
      shoppingList: {
        ...state.shoppingList,
        [category]: state.shoppingList[category].map(item =>
          item.id === itemId ? { ...item, haveAtHome: !item.haveAtHome } : item
        )
      }
    }))
}))