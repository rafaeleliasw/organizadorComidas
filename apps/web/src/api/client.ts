import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token') ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBiNjk0ZTFmLTA3OGYtNGYzOS1iNWRkLWY0YzYyM2VkNTIxNiIsImlhdCI6MTc3NjE2NDY5NH0.w651VxDSOar_9FPWJPyfKs5UjPTSrdnhqYlukDCWa_Q'
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api

// ── Tipos ─────────────────────────────────────────────────────────────────

export interface Member {
  id: string
  name: string
  preferences: { foodTag: string; score: number }[]
  restrictions: { type: string }[]
}

export interface Family {
  id: string
  name: string
  members: Member[]
}

export interface Recipe {
  id: string
  name: string
  prepMinutes: number
  difficulty: string
  recipeUrl?: string
  tags: string[]
  costEstimate?: number
  ingredients: {
    quantity: number
    unit: string
    ingredient: { id: string; name: string; category: string }
  }[]
}

export interface PlanDay {
  id: string
  dayDate: string
  mealType: string
  recipe: Recipe
  members: { member: Member }[]
}

export interface WeeklyPlan {
  id: string
  weekStart: string
  status: string
  days: PlanDay[]
}

export interface ShoppingItem {
  id: string
  quantity: number
  unit: string
  haveAtHome: boolean
  ingredient: { id: string; name: string; category: string }
}

// ── Llamadas a la API ─────────────────────────────────────────────────────

export const familyApi = {
  list: () => api.get<Family[]>('/api/families').then(r => r.data),
  get: (id: string) => api.get<Family>(`/api/families/${id}`).then(r => r.data),
}

export const planApi = {
  list: (familyId: string) =>
    api.get<WeeklyPlan[]>('/api/plans', { params: { familyId } }).then(r => r.data),

  generate: (body: {
    familyId: string
    weekStart: string
    days: { date: string; memberIds: string[] }[]
  }) => api.post<{ plan: WeeklyPlan; shoppingList: Record<string, ShoppingItem[]> }>(
    '/api/plans/generate', body
  ).then(r => r.data),

  confirm: (planId: string) =>
    api.put(`/api/plans/${planId}/confirm`).then(r => r.data),

  changeRecipe: (planId: string, dayId: string, recipeId: string) =>
    api.patch(`/api/plans/${planId}/days/${dayId}/recipe`, { recipeId }).then(r => r.data),

  shopping: (planId: string) =>
    api.get<Record<string, ShoppingItem[]>>(`/api/plans/${planId}/shopping`).then(r => r.data),

  toggleItem: (planId: string, itemId: string, haveAtHome: boolean) =>
    api.patch(`/api/plans/${planId}/shopping/${itemId}`, { haveAtHome }).then(r => r.data),
}

export const recipeApi = {
  list: (tag?: string) =>
    api.get<Recipe[]>('/api/recipes', { params: tag ? { tag } : {} }).then(r => r.data),
}