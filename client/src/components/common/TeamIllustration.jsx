// Friendly flat illustration of a student team around a laptop (pure SVG, no image files).
function TeamIllustration({ className = '' }) {
  return (
    <svg
      viewBox="0 0 520 320"
      className={className}
      role="img"
      aria-label="Students collaborating around a laptop"
    >
      <defs>
        <linearGradient id="tiBlob" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#dbeafe" />
          <stop offset="1" stopColor="#e0e7ff" />
        </linearGradient>
        <linearGradient id="tiScreen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#eff6ff" />
        </linearGradient>
      </defs>

      {/* background blob */}
      <ellipse cx="270" cy="170" rx="235" ry="140" fill="url(#tiBlob)" />
      <circle cx="60" cy="60" r="6" fill="#93c5fd" />
      <circle cx="470" cy="50" r="9" fill="#c4b5fd" />
      <circle cx="490" cy="210" r="5" fill="#93c5fd" />

      {/* floating chips */}
      <g fontFamily="system-ui, sans-serif" fontSize="12" fontWeight="700">
        <rect x="36" y="86" width="64" height="26" rx="13" fill="#fff" />
        <text x="68" y="103" textAnchor="middle" fill="#2563eb">Ideas</text>
        <rect x="404" y="30" width="70" height="26" rx="13" fill="#fff" />
        <text x="439" y="47" textAnchor="middle" fill="#7c3aed">Teams</text>
      </g>

      {/* person 1 — blue hoodie (left) */}
      <path d="M62 300 V236 a58 58 0 0 1 116 0 V300 Z" fill="#2563eb" />
      <path d="M102 196 q20 22 40 0 v14 q-20 24 -40 0 Z" fill="#1d4ed8" />
      <circle cx="120" cy="150" r="30" fill="#f3c6a5" />
      <path d="M88 146 a32 32 0 0 1 64 -4 q-18 -14 -40 -4 q-14 4 -24 8 Z" fill="#1e3a8a" />
      <circle cx="110" cy="152" r="2.6" fill="#1e293b" />
      <circle cx="131" cy="152" r="2.6" fill="#1e293b" />
      <path d="M112 164 q9 8 18 0" stroke="#1e293b" strokeWidth="2.4" fill="none" strokeLinecap="round" />

      {/* person 2 — purple top, long dark hair */}
      <path d="M165 300 V250 a52 52 0 0 1 104 0 V300 Z" fill="#7c3aed" />
      <path d="M170 168 a34 40 0 0 1 68 0 v42 q-34 12 -68 0 Z" fill="#1e293b" />
      <circle cx="204" cy="176" r="27" fill="#f3c6a5" />
      <path d="M176 170 a30 30 0 0 1 56 -6 q-20 -12 -56 6 Z" fill="#1e293b" />
      <circle cx="195" cy="178" r="2.6" fill="#1e293b" />
      <circle cx="214" cy="178" r="2.6" fill="#1e293b" />
      <path d="M196 189 q8 7 16 0" stroke="#1e293b" strokeWidth="2.4" fill="none" strokeLinecap="round" />

      {/* person 3 — beige hoodie, glasses, curly hair */}
      <path d="M290 300 V246 a56 56 0 0 1 112 0 V300 Z" fill="#e7dccb" />
      <circle cx="346" cy="170" r="29" fill="#8d5a3b" />
      <g fill="#1e293b">
        <circle cx="324" cy="150" r="11" />
        <circle cx="340" cy="142" r="12" />
        <circle cx="358" cy="142" r="12" />
        <circle cx="371" cy="152" r="11" />
      </g>
      <g stroke="#1e293b" strokeWidth="2.4" fill="#fff" fillOpacity=".35">
        <circle cx="336" cy="172" r="8" />
        <circle cx="357" cy="172" r="8" />
        <path d="M344 172 h5" fill="none" />
      </g>
      <path d="M338 186 q8 6 16 0" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" />

      {/* person 4 — white top, brown long hair (right) */}
      <path d="M382 300 V232 a54 54 0 0 1 108 0 V300 Z" fill="#fbbf24" />
      <path d="M386 138 a34 38 0 0 1 68 0 v40 q-34 12 -68 0 Z" fill="#92400e" />
      <circle cx="420" cy="146" r="27" fill="#f3c6a5" />
      <path d="M392 140 a30 30 0 0 1 56 -6 q-20 -12 -56 6 Z" fill="#92400e" />
      <circle cx="411" cy="148" r="2.6" fill="#1e293b" />
      <circle cx="430" cy="148" r="2.6" fill="#1e293b" />
      <path d="M412 159 q8 7 16 0" stroke="#1e293b" strokeWidth="2.4" fill="none" strokeLinecap="round" />

      {/* laptop */}
      <rect x="190" y="228" width="170" height="14" rx="7" fill="#cbd5e1" />
      <rect x="206" y="176" width="138" height="56" rx="8" fill="#e2e8f0" />
      <rect x="212" y="181" width="126" height="46" rx="5" fill="url(#tiScreen)" />
      <rect x="220" y="189" width="48" height="6" rx="3" fill="#2563eb" />
      <rect x="220" y="201" width="80" height="5" rx="2.5" fill="#bfdbfe" />
      <rect x="220" y="211" width="62" height="5" rx="2.5" fill="#bfdbfe" />
      <circle cx="318" cy="205" r="12" fill="#dbeafe" />
      <path d="M312 205 l5 5 l9 -10" stroke="#2563eb" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* books */}
      <rect x="20" y="276" width="86" height="16" rx="3" fill="#2563eb" />
      <rect x="28" y="262" width="76" height="14" rx="3" fill="#60a5fa" />
      <rect x="22" y="250" width="80" height="12" rx="3" fill="#a78bfa" />
    </svg>
  )
}

export default TeamIllustration
