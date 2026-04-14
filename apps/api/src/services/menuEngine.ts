import { Recipe, Member } from '@prisma/client'
import prisma from '../prisma'

interface DayConfig {
  date: Date
  memberIds: string[]
}

interface ScoredRecipe {
  recipe: Recipe & { ingredients: { ingredientId: string }[] }
  score: number
}

export async function generateWeeklyMenu(
  familyId: string,
  days: DayConfig[]
): Promise<{ dayDate: Date; recipeId: string; memberIds: string[] }[]> {

  // 1. Cargar todos los miembros con sus preferencias y restricciones
  const allMembers = await prisma.member.findMany({
    where: { familyId },
    include: { preferences: true, restrictions: true }
  })

  console.log('allMembers:', allMembers.length)

  // 2. Cargar historial reciente (últimas 2 semanas) para evitar repetición
  const twoWeeksAgo = new Date()
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

  const recentPlanDays = await prisma.planDay.findMany({
    where: {
      plan: { familyId },
      dayDate: { gte: twoWeeksAgo }
    }
  })
  const recentRecipeIds = new Set(recentPlanDays.map(pd => pd.recipeId))

  // 3. Cargar todas las recetas con ingredientes
  const allRecipes = await prisma.recipe.findMany({
    include: { ingredients: true }
  })

  console.log('allRecipes:', allRecipes.length)
  console.log('recentRecipeIds:', recentRecipeIds.size)

  const result: { dayDate: Date; recipeId: string; memberIds: string[] }[] = []
  // Rastrear qué ingredientes ya se usaron esta semana para el bonus
  const weekIngredients = new Map<string, number>()

  for (const day of days) {
    const presentMembers = allMembers.filter(m => day.memberIds.includes(m.id))

    console.log(`Day ${day.date.toISOString()}, presentMembers: ${presentMembers.length}`)

    // 4. Obtener restricciones duras de los miembros presentes
    const hardRestrictions = new Set(
      presentMembers.flatMap(m => m.restrictions.map(r => r.type))
    )

    console.log('hardRestrictions:', [...hardRestrictions])

    // 5. Filtrar recetas que cumplan restricciones duras
    const candidates = allRecipes.filter(recipe => {
      // Eliminar si ya se usó recientemente
      if (recentRecipeIds.has(recipe.id)) return false
      // Eliminar si tiene tag incompatible con alguna restricción
      if (hardRestrictions.has('gluten_free') && !recipe.tags.includes('gluten_free')) return false
      if (hardRestrictions.has('vegetarian') && !recipe.tags.includes('vegetarian')) return false
      if (hardRestrictions.has('lactose_free') && !recipe.tags.some(tag => tag === 'lactose_free' || tag === 'sin_lactosa')) return false
      return true
    })

    console.log(`candidates: ${candidates.length}`)

    // 6. Puntuar cada candidata
    const scored: ScoredRecipe[] = candidates.map(recipe => {
      let score = 0

      // Sumar preferencias de los miembros presentes
      for (const member of presentMembers) {
        for (const pref of member.preferences) {
          if (recipe.tags.includes(pref.foodTag)) {
            score += pref.score // +1 o -1
          }
        }
      }

      // Bonus por ingredientes compartidos con otras comidas de la semana
      for (const ri of recipe.ingredients) {
        const uses = weekIngredients.get(ri.ingredientId) ?? 0
        if (uses > 0) score += 0.5 * uses // bonus acumulativo
      }

      // Penalización leve por recetas ya elegidas esta semana
      if (result.some(r => r.recipeId === recipe.id)) score -= 5

      return { recipe, score }
    })

    console.log(`scored: ${scored.length}`)

    // 7. Elegir la de mayor score (con pequeño factor aleatorio para variedad)
    scored.sort((a, b) => (b.score + Math.random() * 0.3) - (a.score + Math.random() * 0.3))
    const chosen = scored[0]

    if (!chosen) {
      console.log('No chosen recipe for day')
      continue // fallback: no hay recetas disponibles
    }

    console.log('Chosen recipe:', chosen.recipe.name)

    // 8. Actualizar el mapa de ingredientes semanales
    for (const ri of chosen.recipe.ingredients) {
      weekIngredients.set(ri.ingredientId, (weekIngredients.get(ri.ingredientId) ?? 0) + 1)
    }

    result.push({
      dayDate: day.date,
      recipeId: chosen.recipe.id,
      memberIds: day.memberIds
    })
  }

  return result
}

// Genera la lista de compras consolidada a partir de un plan
export async function generateShoppingList(planId: string) {
  const plan = await prisma.weeklyPlan.findUnique({
    where: { id: planId },
    include: {
      days: {
        include: {
          recipe: {
            include: {
              ingredients: { include: { ingredient: true } }
            }
          },
          members: true
        }
      }
    }
  })

  if (!plan) throw new Error('Plan no encontrado')

  // Consolidar ingredientes sumando cantidades
  const consolidated = new Map<string, {
    ingredient: { id: string; name: string; category: string; unit: string }
    quantity: number
    unit: string
  }>()

  for (const day of plan.days) {
    for (const ri of day.recipe.ingredients) {
      const key = ri.ingredientId
      if (consolidated.has(key)) {
        consolidated.get(key)!.quantity += ri.quantity
      } else {
        consolidated.set(key, {
          ingredient: ri.ingredient,
          quantity: ri.quantity,
          unit: ri.unit
        })
      }
    }
  }

  // Guardar en BD y retornar agrupado por categoría
  const items = []
  for (const [ingredientId, data] of consolidated) {
    const item = await prisma.shoppingListItem.create({
      data: {
        planId,
        ingredientId,
        quantity: data.quantity,
        unit: data.unit
      }
    })
    items.push({ ...item, ingredient: data.ingredient })
  }

  // Agrupar por categoría para la UI
  return items.reduce((acc, item) => {
    const cat = item.ingredient.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {} as Record<string, typeof items>)
}