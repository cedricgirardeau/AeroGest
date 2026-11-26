import { Prisma } from "@prisma/client"

export type Aeronef = Prisma.AeronefGetPayload<{
  include: {
    modele: true
    exploitant: true
    client: true
    pays: true
  }
}>

export type ModeleAeronef = Prisma.ModeleAeronefGetPayload<{
  include: {
    categorie: true
    aeronefs: false
  }
}>

export type Exploitant = Prisma.ExploitantGetPayload<{
  include: {
    pays: true
    type: true
    aeronefs: false
    indicatifs_oaci: false
    dossiers_vol: false
    clients: false
  }
}>

export type Client = Prisma.ClientGetPayload<{
  include: {
    pays: true
    exploitant: true
    aeronefs: false
    factures: false
    contrats: false
  }
}>

export type DossierVol = Prisma.DossierVolGetPayload<{
  include: {
    aerodrome_source: true
    aeronef: {
      include: {
        modele: true
        exploitant: true
      }
    }
    exploitant: true
    indicatif_oaci: true
    type_voyage: true
    mouvements: {
      include: {
        type_mouvement: true
        aerodrome_escale: true
      }
    }
    lignes_facture: false
  }
}>

export type Mouvement = Prisma.MouvementGetPayload<{
  include: {
    dossier: false
    type_mouvement: true
    aerodrome_escale: true
    lignes_facture: false
  }
}>

export type Facture = Prisma.FactureGetPayload<{
  include: {
    client: true
    contrat: true
    lignes_facture: {
      include: {
        dossier: false
        mouvement: false
        prestation: true
        rubrique: true
      }
    }
    reglements: true
    ecritures: false
  }
}>

export type LigneFacture = Prisma.LigneFactureGetPayload<{
  include: {
    facture: false
    dossier: false
    mouvement: false
    prestation: true
    rubrique: true
  }
}>

export interface TableColumn<T> {
  key: string
  header: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
  width?: string
}

export interface FilterOption {
  value: string
  label: string
}

export interface SelectOption {
  value: string
  label: string
}