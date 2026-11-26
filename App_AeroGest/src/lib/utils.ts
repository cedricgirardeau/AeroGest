// Formatage du MTOW (Masse Maximale au Décollage)
export function formatMTOW(kg: number): string {
  if (kg >= 1000) {
    const tonnes = kg / 1000
    return tonnes.toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' t'
  }
  return kg.toLocaleString('fr-FR') + ' kg'
}

// Formatage des dates
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateTime(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatTime(time: Date | string): string {
  if (typeof time === 'string') {
    time = new Date(time)
  }
  return time.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Formatage des montants
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

// Génération de numéros de dossier
export function generateDossierNumber(aerodromeCode: string): string {
  const year = new Date().getFullYear()
  const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
  return `${aerodromeCode}-${year}-${randomNum}`
}

// Génération de numéros de facture
export function generateFactureNumber(): string {
  const year = new Date().getFullYear()
  const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
  return `FACT-${year}-${randomNum}`
}

// Validation des immatriculations
export function isValidImmatriculation(immatriculation: string): boolean {
  // Format: F-GXYZ, N123AB, D-ABCD, etc.
  const regex = /^[A-Z0-9]{1,10}$/i
  return regex.test(immatriculation.replace(/-/g, ''))
}

// Validation des adresses Mode S
export function isValidModeS(address: string): boolean {
  // Format: 6 caractères hexadécimaux (24 bits)
  const regex = /^[0-9A-Fa-f]{6}$/
  return regex.test(address)
}

// Calcul des taxes d'atterrissage (exemple simplifié)
export function calculateAtterrissageTax(mtowKg: number, baseRate: number = 0.5): number {
  return mtowKg * baseRate
}

// Calcul des taxes de parking (exemple simplifié)
export function calculateParkingTax(durationHours: number, baseRate: number = 10): number {
  return durationHours * baseRate
}

// Formatage de la durée
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

// Formatage du statut
export function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    OUVERT: 'Ouvert',
    CLOTURE: 'Clôturé',
    ANNULE: 'Annulé',
    BROUILLON: 'Brouillon',
    VALIDE: 'Validé',
    PAYEE: 'Payée',
    EN_ATTENTE: 'En attente',
    ACTIF: 'Actif',
    INACTIF: 'Inactif',
  }
  return statusMap[status] || status
}

// Formatage du régime de vol
export function formatRegimeVol(regime: string): string {
  const regimeMap: Record<string, string> = {
    IFR: 'IFR',
    VFR_PLN: 'VFR avec plan de vol',
    VFR_SANS: 'VFR sans plan de vol',
  }
  return regimeMap[regime] || regime
}

// Formatage de la qualification
export function formatQualification(qualification: string): string {
  const qualifMap: Record<string, string> = {
    PRIVE: 'Privé',
    COMMERCIAL: 'Commercial',
  }
  return qualifMap[qualification] || qualification
}

// Formatage du type de mouvement
export function formatTypeMouvement(type: string): string {
  const typeMap: Record<string, string> = {
    DEP: 'Départ',
    ARR: 'Arrivée',
    LOC: 'Vol local',
  }
  return typeMap[type] || type
}

// Formatage du type de voyage DGAC
export function formatTypeVoyageDGAC(type: string): string {
  const typeMap: Record<string, string> = {
    '1': "Vol d'aéroclub",
    '2': 'Vol privé français',
    '3': 'Vol privé étranger',
    '4': 'Vol de travail aérien',
    '5': "Vol d'appareil commercial sans passager",
    '6': 'Autre vol',
  }
  return typeMap[type] || type
}