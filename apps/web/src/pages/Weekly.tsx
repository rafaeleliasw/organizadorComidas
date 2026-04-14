import { useEffect } from 'react'
import { familyApi, planApi } from '../api/client'
import { useFamilyStore } from '../store/familyStore'
import DayCard from '../components/DayCard'
import MemberAvatar from '../components/MemberAvatar'

function getWeekDays(from: Date): { date: string; label: string }[] {
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(from)
    d.setDate(from.getDate() + i)
    return {
      date: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'short' })
    }
  })
}

export default function Weekly() {
  const { family, currentPlan, shoppingList, isGenerating,
          setFamily, setCurrentPlan, setShoppingList, setGenerating } = useFamilyStore()

  // Cargar familia al montar
  useEffect(() => {
    familyApi.list().then(families => {
      if (families.length) setFamily(families[0])
    })
  }, [])

 const handleGenerate = async () => {
  if (!family) return
  setGenerating(true)

  const today = new Date()
  const monday = new Date(today)
  monday.setDate(today.getDate() - today.getDay() + 1)
  const days = getWeekDays(monday)

  try {
    const { plan, shoppingList } = await planApi.generate({
      familyId: family.id,
      weekStart: monday.toISOString().split('T')[0],
      days: days.map(d => ({
        date: d.date,
        memberIds: family.members.map(m => m.id)
      }))
    })

    // Recargar el plan completo con días y recetas populadas
    const plans = await planApi.list(family.id)
    const fullPlan = plans.find(p => p.id === plan.id) ?? plan
    setCurrentPlan(fullPlan)
    setShoppingList(shoppingList)
  } finally {
    setGenerating(false)
  }
}

  if (!family) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        Cargando familia...
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>{family.name}</h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: '4px 0 0' }}>
            Semana del {new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {family.members.map((m, i) => (
            <MemberAvatar key={m.id} name={m.name} index={i} />
          ))}
        </div>
      </div>

      {/* Botón generar */}
      {!currentPlan ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 16 }}>
            No hay menú para esta semana todavía.
          </p>
          <button onClick={handleGenerate} disabled={isGenerating} style={{
            background: 'var(--color-background-info)',
            color: 'var(--color-text-info)',
            border: 'none',
            borderRadius: 'var(--border-radius-md)',
            padding: '10px 24px',
            fontSize: 14,
            fontWeight: 500,
            cursor: isGenerating ? 'wait' : 'pointer',
          }}>
            {isGenerating ? 'Generando...' : 'Generar menú de la semana'}
          </button>
        </div>
      ) : (
        <>
          {/* Acciones */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
              {currentPlan.status === 'confirmed' ? 'Menú confirmado' : 'Borrador'}
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleGenerate} style={{
                fontSize: 12, padding: '5px 12px',
                border: '0.5px solid var(--color-border-secondary)',
                borderRadius: 'var(--border-radius-md)',
                background: 'none', cursor: 'pointer',
                color: 'var(--color-text-secondary)'
              }}>
                Regenerar
              </button>
              {currentPlan.status === 'draft' && (
                <button onClick={() => planApi.confirm(currentPlan.id)} style={{
                  fontSize: 12, padding: '5px 12px',
                  background: 'var(--color-background-success)',
                  color: 'var(--color-text-success)',
                  border: 'none', borderRadius: 'var(--border-radius-md)', cursor: 'pointer'
                }}>
                  Confirmar menú
                </button>
              )}
            </div>
          </div>

          {/* Cards de días */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(currentPlan.days ?? []).map(day => (
              <DayCard
                key={day.id}
                day={day}
                planId={currentPlan.id}
                familyMembers={family.members}
              />
            ))}
          </div>

          {/* Lista de compras resumida */}
          {Object.keys(shoppingList).length > 0 && (
            <div style={{
              marginTop: 20,
              background: 'var(--color-background-primary)',
              border: '0.5px solid var(--color-border-tertiary)',
              borderRadius: 'var(--border-radius-lg)',
              padding: '14px 16px'
            }}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 10 }}>
                Lista de compras
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {Object.entries(shoppingList).map(([cat, items]) => (
                  <div key={cat} style={{
                    fontSize: 12,
                    background: 'var(--color-background-secondary)',
                    borderRadius: 99,
                    padding: '4px 12px',
                    color: 'var(--color-text-secondary)'
                  }}>
                    <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{cat}</span>
                    {' · '}{items.length} ítem{items.length !== 1 ? 's' : ''}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}