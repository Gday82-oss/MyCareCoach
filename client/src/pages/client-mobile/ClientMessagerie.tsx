export default function ClientMessagerie() {
  return (
    <div style={{ padding: '24px 32px', backgroundColor: 'var(--mcc-bg)', minHeight: '100%', display: 'flex', flexDirection: 'column' }}
      className="!p-5 md:!p-8">

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 22, fontWeight: 500, color: 'var(--mcc-text)' }}>Messagerie</p>
        <p style={{ fontSize: 13, color: 'var(--mcc-text-sec)', marginTop: 4 }}>Échangez avec votre coach</p>
      </div>

      {/* État vide centré */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(108,92,231,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 16,
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#B2BEC3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--mcc-text)', marginBottom: 6 }}>Aucun message pour le moment</p>
        <p style={{ fontSize: 13, color: 'var(--mcc-text-sec)', textAlign: 'center', maxWidth: 260 }}>
          La messagerie sera bientôt disponible pour échanger avec votre coach.
        </p>
      </div>
    </div>
  );
}
