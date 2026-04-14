import { useState } from 'react'
import type { PlanDay, Recipe } from '../api/client'
import { recipeApi, planApi } from '../api/client'
import { useFamilyStore } from '../store/familyStore'
import MemberAvatar from './MemberAvatar'

const DAY_LABELS: Record<string, string> = {
  '1': 'Lun', '2': 'Mar', '3': 'Mié',
  '4': 'Jue', '5': 'Vie', '6': 'Sáb', '0': 'Dom'
}

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  pollo:       { bg: '#FAEEDA', text: '#633806' },
  carne:       { bg: '#FAECE7', text: '#712B13' },
  pasta:       { bg: '#EEEDFE', text: '#3C3489' },
  vegetarian:  { bg: '#EAF3DE', text: '#27500A' },
  pescado:     { bg: '#E6F1FB', text: '#0C447C' },
  tarta:       { bg: '#FBEAF0', text: '#72243E' },
  legumbres:   { bg: '#E1F5EE', text: '#085041' },
  rapido:      { bg: '#F1EFE8', text: '#444441' },
}

interface Props {
  day: PlanDay
  planId: string
  familyMembers: { id: string; name: string }[]
}

export default function DayCard({ day, planId, familyMembers }: Props) {
  const [showSwap, setShowSwap] = useState(false)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const { updateDayRecipe } = useFamilyStore()

  const dayLabel = DAY_LABELS[new Date(day.dayDate).getDay().toString()] ?? '?'
  const presentMembers = day.members.map(m => m.member)

  const handleSwapOpen = async () => {
    setShowSwap(true)
    if (recipes.length) return
    setLoading(true)
    const all = await recipeApi.list()
    setRecipes(all.filter(r => r.id !== day.recipe.id))
    setLoading(false)
  }

  const handleSwapSelect = async (recipe: Recipe) => {
    await planApi.changeRecipe(planId, day.id, recipe.id)
    updateDayRecipe(day.id, recipe)
    setShowSwap(false)
  }

  return (
    <div style={{
      background: 'var(--color-background-primary)',
      border: '0.5px solid var(--color-border-tertiary)',
      borderRadius: 'var(--border-radius-lg)',
      padding: '12px 14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Día */}
        <div style={{
          fontSize: 11, fontWeight: 500,
          color: 'var(--color-text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '.04em',
          minWidth: 32
        }}>
          {dayLabel}
        </div>

        {/* Receta */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)' }}>
            {day.recipe.name}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
              {day.recipe.prepMinutes} min
            </span>
            {day.recipe.tags.slice(0, 2).map(tag => {
              const c = TAG_COLORS[tag] ?? { bg: '#F1EFE8', text: '#444441' }
              return (
                <span key={tag} style={{
                  fontSize: 11, padding: '2px 8px',
                  borderRadius: 99, background: c.bg, color: c.text
                }}>
                  {tag}
                </span>
              )
            })}
            {day.recipe.recipeUrl && (
              <a href={day.recipe.recipeUrl} target="_blank" rel="noreferrer"
                style={{ fontSize: 11, color: 'var(--color-text-info)' }}>
                ver receta
              </a>
            )}
          </div>
        </div>

        {/* Avatares miembros presentes */}
        <div style={{ display: 'flex', gap: 3 }}>
          {presentMembers.map((m, i) => {
            const idx = familyMembers.findIndex(fm => fm.id === m.id)
            return <MemberAvatar key={m.id} name={m.name} index={idx} size={22} />
          })}
        </div>

        {/* Botón cambiar */}
        <button onClick={handleSwapOpen} style={{
          background: 'none',
          border: '0.5px solid var(--color-border-secondary)',
          borderRadius: 'var(--border-radius-md)',
          padding: '4px 10px',
          fontSize: 12,
          color: 'var(--color-text-secondary)',
          cursor: 'pointer',
          whiteSpace: 'nowrap'
        }}>
          Cambiar
        </button>
      </div>

      {/* Panel de swap */}
      {showSwap && (
        <div style={{
          marginTop: 10,
          borderTop: '0.5px solid var(--color-border-tertiary)',
          paddingTop: 10,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
              Elegir otra receta:
            </span>
            <button onClick={() => setShowSwap(false)} style={{
              background: 'none', border: 'none',
              fontSize: 12, color: 'var(--color-text-secondary)', cursor: 'pointer'
            }}>
              Cancelar
            </button>
          </div>
          {loading ? (
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Cargando...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 200, overflowY: 'auto' }}>
              {recipes.map(r => (
                <div key={r.id}
                  onClick={() => handleSwapSelect(r)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--border-radius-md)',
                    border: '0.5px solid var(--color-border-tertiary)',
                    cursor: 'pointer',
                    fontSize: 13,
                    color: 'var(--color-text-primary)',
                  }}
                >
                  {r.name}
                  <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginLeft: 8 }}>
                    {r.prepMinutes} min
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}