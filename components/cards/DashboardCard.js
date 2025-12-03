import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardCard({ title, value, icon, subtitle, color = 'default' }) {
  const getGradientClass = () => {
    switch(color) {
      case 'primary':
        return 'bg-gradient-to-r from-primary to-primary-dark text-white'
      case 'secondary':
        return 'bg-gradient-to-r from-secondary to-secondary-dark text-white'
      default:
        return 'bg-white border border-gray-200'
    }
  }

  const getTitleColor = () => {
    return color === 'default' ? 'text-gray-900' : 'text-white'
  }

  const getValueColor = () => {
    return color === 'default' ? 'text-gray-900' : 'text-white'
  }

  const getSubtitleColor = () => {
    return color === 'default' ? 'text-gray-600' : 'text-white opacity-80'
  }

  return (
    <Card className={getGradientClass()}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={`text-sm font-medium ${getTitleColor()}`}>
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${getValueColor()}`}>
          {value}
        </div>
        {subtitle && (
          <p className={`text-xs ${getSubtitleColor()}`}>
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  )
}