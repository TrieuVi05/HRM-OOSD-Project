export default function StatsCard({ 
  title, 
  value, 
  icon, 
  trend,
  trendValue,
  color = '#3b82f6' 
}) {
  const colors = {
    blue: { bg: '#eff6ff', text: '#3b82f6' },
    green: { bg: '#f0fdf4', text: '#10b981' },
    yellow: { bg: '#fefce8', text: '#eab308' },
    red: { bg: '#fef2f2', text: '#ef4444' },
    purple: { bg: '#faf5ff', text: '#a855f7' }
  };

  const selectedColor = colors[color] || colors.blue;

  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      padding: 20,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #f3f4f6'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          background: selectedColor.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24
        }}>
          {icon}
        </div>
        {trend && (
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            color: trend === 'up' ? '#10b981' : '#ef4444',
            background: trend === 'up' ? '#f0fdf4' : '#fef2f2',
            padding: '4px 8px',
            borderRadius: 4
          }}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
        )}
      </div>
      
      <h3 style={{ 
        fontSize: 28, 
        fontWeight: 700, 
        margin: '8px 0',
        color: '#1f2937'
      }}>
        {value}
      </h3>
      
      <p style={{ 
        fontSize: 14, 
        color: '#6b7280',
        margin: 0
      }}>
        {title}
      </p>
    </div>
  );
}