const COLORS = [
  { bg: '#E6F1FB', text: '#0C447C' },
  { bg: '#E1F5EE', text: '#085041' },
  { bg: '#FAEEDA', text: '#633806' },
  { bg: '#EEEDFE', text: '#3C3489' },
  { bg: '#FAECE7', text: '#712B13' },
]

interface Props {
  name: string
  index?: number
  size?: number
}

export default function MemberAvatar({ name, index = 0, size = 28 }: Props) {
  const color = COLORS[index % COLORS.length]
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: color.bg,
      color: color.text,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.38,
      fontWeight: 500,
      flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}