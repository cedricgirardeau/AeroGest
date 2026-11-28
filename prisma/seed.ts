import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // ============================================================================
  // SCHEMA aer - RÉFÉRENTIEL GÉOGRAPHIQUE
  // ============================================================================

  // Pays
  const paysFR = await prisma.pays.upsert({
    where: { code_pays: 'FR' },
    update: {},
    create: {
      code_pays: 'FR',
      libelle: 'France',
      prefixe_immat: 'F',
    },
  })

  const paysDE = await prisma.pays.upsert({
    where: { code_pays: 'DE' },
    update: {},
    create: {
      code_pays: 'DE',
      libelle: 'Allemagne',
      prefixe_immat: 'D',
    },
  })

  const paysUS = await prisma.pays.upsert({
    where: { code_pays: 'US' },
    update: {},
    create: {
      code_pays: 'US',
      libelle: 'États-Unis',
      prefixe_immat: 'N',
    },
  })

  const paysGB = await prisma.pays.upsert({
    where: { code_pays: 'GB' },
    update: {},
    create: {
      code_pays: 'GB',
      libelle: 'Royaume-Uni',
      prefixe_immat: 'G',
    },
  })

  const paysCH = await prisma.pays.upsert({
    where: { code_pays: 'CH' },
    update: {},
    create: {
      code_pays: 'CH',
      libelle: 'Suisse',
      prefixe_immat: 'HB',
    },
  })

  console.log('Pays créés')

  // Aérodromes
  const aerodromeLFPB = await prisma.aerodrome.upsert({
    where: { code_oaci: 'LFPB' },
    update: {},
    create: {
      code_oaci: 'LFPB',
      libelle: 'Aérodrome de Paris-Beauvais-Tillé',
      code_pays: 'FR',
    },
  })

  const aerodromeLFPO = await prisma.aerodrome.upsert({
    where: { code_oaci: 'LFPO' },
    update: {},
    create: {
      code_oaci: 'LFPO',
      libelle: 'Aéroport de Paris-Orly',
      code_pays: 'FR',
    },
  })

  const aerodromeLFLL = await prisma.aerodrome.upsert({
    where: { code_oaci: 'LFLL' },
    update: {},
    create: {
      code_oaci: 'LFLL',
      libelle: 'Aéroport de Lyon-Saint Exupéry',
      code_pays: 'FR',
    },
  })

  const aerodromeEDDK = await prisma.aerodrome.upsert({
    where: { code_oaci: 'EDDK' },
    update: {},
    create: {
      code_oaci: 'EDDK',
      libelle: 'Aéroport de Cologne/Bonn',
      code_pays: 'DE',
    },
  })

  console.log('Aérodromes créés')
  // Catégories de propulsion
  const catPiston = await prisma.categoriePropulsion.upsert({
    where: { code: 'PISTON' },
    update: {},
    create: {
      code: 'PISTON',
      libelle: 'Moteurs à pistons',
    },
  })

  const catTurboprop = await prisma.categoriePropulsion.upsert({
    where: { code: 'TURBOPROP' },
    update: {},
    create: {
      code: 'TURBOPROP',
      libelle: 'Turbopropulseurs',
    },
  })

  const catReacteur = await prisma.categoriePropulsion.upsert({
    where: { code: 'REACTEUR' },
    update: {},
    create: {
      code: 'REACTEUR',
      libelle: 'Réacteurs',
    },
  })

  const catHelico = await prisma.categoriePropulsion.upsert({
    where: { code: 'HELICO' },
    update: {},
    create: {
      code: 'HELICO',
      libelle: 'Hélicoptères',
    },
  })

  const catPlaneur = await prisma.categoriePropulsion.upsert({
    where: { code: 'PLANEUR' },
    update: {},
    create: {
      code: 'PLANEUR',
      libelle: 'Planeurs',
    },
  })

  console.log('Catégories de propulsion créées')

  // Modèles d'aéronefs
  const modeleA320 = await prisma.modeleAeronef.upsert({
    where: { code_modele: 'A320' },
    update: {},
    create: {
      code_modele: 'A320',
      libelle_modele: 'Airbus A320',
      categorie_propulsion: 'REACTEUR',
      is_helico: false,
      mtow_kg: 78000,
    },
  })

  const modeleC56X = await prisma.modeleAeronef.upsert({
    where: { code_modele: 'C56X' },
    update: {},
    create: {
      code_modele: 'C56X',
      libelle_modele: 'Cessna 560XL Citation XLS+',
      categorie_propulsion: 'REACTEUR',
      is_helico: false,
      mtow_kg: 9298,
    },
  })

  const modeleE55P = await prisma.modeleAeronef.upsert({
    where: { code_modele: 'E55P' },
    update: {},
    create: {
      code_modele: 'E55P',
      libelle_modele: 'Embraer E55P Phenom 300',
      categorie_propulsion: 'REACTEUR',
      is_helico: false,
      mtow_kg: 8200,
    },
  })

  const modeleC172 = await prisma.modeleAeronef.upsert({
    where: { code_modele: 'C172' },
    update: {},
    create: {
      code_modele: 'C172',
      libelle_modele: 'Cessna 172 Skyhawk',
      categorie_propulsion: 'PISTON',
      is_helico: false,
      mtow_kg: 1156,
    },
  })

  const modeleR44 = await prisma.modeleAeronef.upsert({
    where: { code_modele: 'R44' },
    update: {},
    create: {
      code_modele: 'R44',
      libelle_modele: 'Robinson R44',
      categorie_propulsion: 'PISTON',
      is_helico: true,
      mtow_kg: 1186,
    },
  })

  console.log('Modèles d\\'aéronefs créés')

  // Types d'exploitants
  const typeAeroClub = await prisma.typeExploitant.upsert({
    where: { code: 'AEROCLUB' },
    update: {},
    create: {
      code: 'AEROCLUB',
      libelle: 'Aéroclub',
    },
  })

  const typeProprietaire = await prisma.typeExploitant.upsert({
    where: { code: 'PROPRIETAIRE' },
    update: {},
    create: {
      code: 'PROPRIETAIRE',
      libelle: 'Propriétaire privé',
    },
  })

  const typeGestionnaire = await prisma.typeExploitant.upsert({
    where: { code: 'GESTIONNAIRE' },
    update: {},
    create: {
      code: 'GESTIONNAIRE',
      libelle: 'Gestionnaire / copropriété',
    },
  })

  const typeTransporteur = await prisma.typeExploitant.upsert({
    where: { code: 'TRANSPORTEUR' },
    update: {},
    create: {
      code: 'TRANSPORTEUR',
      libelle: 'Transporteur aérien (CTA/AOC)',
    },
  })

  const typeTravailAerien = await prisma.typeExploitant.upsert({
    where: { code: 'TRAVAIL_AERIEN' },
    update: {},
    create: {
      code: 'TRAVAIL_AERIEN',
      libelle: 'Travail aérien',
    },
  })

  console.log('Types d\\'exploitants créés')

  // Exploitants
  const exploitantAirFrance = await prisma.exploitant.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      raison_sociale: 'Air France',
      code_pays: 'FR',
      code_type_exploitant: 'TRANSPORTEUR',
      cta_detenu: true,
      code_transporteur: 'AFR',
    },
  })

  const exploitantAeroClubBeauvais = await prisma.exploitant.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      raison_sociale: 'Aéroclub de Beauvais',
      code_pays: 'FR',
      code_type_exploitant: 'AEROCLUB',
      cta_detenu: false,
    },
  })

  const exploitantProprietairePrive = await prisma.exploitant.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      raison_sociale: 'Jean Dupont',
      code_pays: 'FR',
      code_type_exploitant: 'PROPRIETAIRE',
      cta_detenu: false,
    },
  })

  console.log('Exploitants créés')

  // Indicatifs OACI
  const indicatifAFR = await prisma.indicatifOACI.upsert({
    where: { code_oaci: 'AFR' },
    update: {},
    create: {
      code_oaci: 'AFR',
      exploitant_id: 1,
      telephonie: 'Airfrans',
      date_debut_validite: new Date(),
    },
  })

  console.log('Indicatifs OACI créés')
  // Aéronefs
  const aeronef1 = await prisma.aeronef.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      immatriculation: 'F-GKXL',
      code_pays_registre: 'FR',
      code_modele: 'A320',
      exploitant_habituel_id: 1,
      adresse_mode_s: '3C6444',
      actif: true,
    },
  })

  const aeronef2 = await prisma.aeronef.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      immatriculation: 'F-HBXY',
      code_pays_registre: 'FR',
      code_modele: 'C172',
      exploitant_habituel_id: 2,
      actif: true,
    },
  })

  const aeronef3 = await prisma.aeronef.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      immatriculation: 'F-JDUP',
      code_pays_registre: 'FR',
      code_modele: 'R44',
      exploitant_habituel_id: 3,
      actif: true,
    },
  })

  console.log('Aéronefs créés')

  // Types de voyage DGAC
  const typeVoyage1 = await prisma.typeVoyageDGAC.upsert({
    where: { code: '1' },
    update: {},
    create: {
      code: '1',
      libelle: "Vol d'aéroclub",
    },
  })

  const typeVoyage2 = await prisma.typeVoyageDGAC.upsert({
    where: { code: '2' },
    update: {},
    create: {
      code: '2',
      libelle: 'Vol privé français',
    },
  })

  const typeVoyage3 = await prisma.typeVoyageDGAC.upsert({
    where: { code: '3' },
    update: {},
    create: {
      code: '3',
      libelle: 'Vol privé étranger',
    },
  })

  const typeVoyage4 = await prisma.typeVoyageDGAC.upsert({
    where: { code: '4' },
    update: {},
    create: {
      code: '4',
      libelle: 'Vol de travail aérien',
    },
  })

  const typeVoyage5 = await prisma.typeVoyageDGAC.upsert({
    where: { code: '5' },
    update: {},
    create: {
      code: '5',
      libelle: "Vol d'appareil commercial sans passager",
    },
  })

  const typeVoyage6 = await prisma.typeVoyageDGAC.upsert({
    where: { code: '6' },
    update: {},
    create: {
      code: '6',
      libelle: 'Autre vol',
    },
  })

  console.log('Types de voyage DGAC créés')

  // Types de mouvement
  const typeMouvementDEP = await prisma.typeMouvement.upsert({
    where: { code: 'DEP' },
    update: {},
    create: {
      code: 'DEP',
      libelle: 'Départ (mouvement au départ)',
    },
  })

  const typeMouvementARR = await prisma.typeMouvement.upsert({
    where: { code: 'ARR' },
    update: {},
    create: {
      code: 'ARR',
      libelle: "Arrivée (mouvement à l'arrivée)",
    },
  })

  const typeMouvementLOC = await prisma.typeMouvement.upsert({
    where: { code: 'LOC' },
    update: {},
    create: {
      code: 'LOC',
      libelle: 'Vol local (évolutions dans le circuit)',
    },
  })

  console.log('Types de mouvement créés')
  // ============================================================================
  // SCHEMA fac - FACTURATION
  // ============================================================================

  // Plan comptable (simplifié)
  const compte606 = await prisma.planComptable.upsert({
    where: { code: '606' },
    update: {},
    create: {
      code: '606',
      libelle: 'Achats non stockés de matières et fournitures',
      type: 'CHARGE',
      niveau: 3,
    },
  })

  const compte706 = await prisma.planComptable.upsert({
    where: { code: '706' },
    update: {},
    create: {
      code: '706',
      libelle: 'Prestations de services',
      type: 'PRODUIT',
      niveau: 3,
    },
  })

  const compte44566 = await prisma.planComptable.upsert({
    where: { code: '44566' },
    update: {},
    create: {
      code: '44566',
      libelle: 'TVA collectée',
      type: 'PASSIF',
      niveau: 5,
    },
  })

  console.log('Plan comptable créé')

  // Rubriques de facturation
  const rubriqueAtterrissage = await prisma.rubriqueFacturation.upsert({
    where: { code: 'TAXE_ATT' },
    update: {},
    create: {
      code: 'TAXE_ATT',
      libelle: 'Taxe d\\'atterrissage',
      description: 'Taxe basée sur le MTOW de l\\'aéronef',
      code_comptable: '706',
      type_rubrique: 'TAXE_ATTERRISSAGE',
      tarif_base: 0,
      unite: 'MTOW',
      actif: true,
    },
  })

  const rubriqueParking = await prisma.rubriqueFacturation.upsert({
    where: { code: 'TAXE_PARK' },
    update: {},
    create: {
      code: 'TAXE_PARK',
      libelle: 'Taxe de parking',
      description: 'Taxe basée sur la durée de stationnement',
      code_comptable: '706',
      type_rubrique: 'TAXE_PARKING',
      tarif_base: 0,
      unite: 'HEURE',
      actif: true,
    },
  })

  const rubriquePrestation = await prisma.rubriqueFacturation.upsert({
    where: { code: 'PRESTA' },
    update: {},
    create: {
      code: 'PRESTA',
      libelle: 'Prestations diverses',
      description: 'Prestations diverses facturées à l\\'unité',
      code_comptable: '706',
      type_rubrique: 'PRESTATION',
      tarif_base: 0,
      unite: 'FORFAIT',
      actif: true,
    },
  })

  console.log('Rubriques de facturation créées')

  // Prestations
  const prestationPleins = await prisma.prestation.upsert({
    where: { code: 'PLEINS' },
    update: {},
    create: {
      code: 'PLEINS',
      libelle: 'Pleins de carburant',
      description: 'Ravitaillement en carburant',
      rubrique_id: rubriquePrestation.id,
      tarif: 1.5,
      unite: 'LITRE',
      actif: true,
    },
  })

  const prestationNettoyage = await prisma.prestation.upsert({
    where: { code: 'NETTOYAGE' },
    update: {},
    create: {
      code: 'NETTOYAGE',
      libelle: 'Nettoyage intérieur',
      description: 'Nettoyage complet de l\\'aéronef',
      rubrique_id: rubriquePrestation.id,
      tarif: 150,
      unite: 'FORFAIT',
      actif: true,
    },
  })

  console.log('Prestations créées')

  // Clients
  const clientAirFrance = await prisma.client.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      raison_sociale: 'Air France',
      code_pays: 'FR',
      adresse: '45 Rue de Paris, 95747 Roissy CDG Cedex',
      code_postal: '95747',
      ville: 'Roissy-en-France',
      telephone: '+33 1 41 56 78 00',
      email: 'contact@airfrance.fr',
      siren: '315708106',
      tva_intra: 'FR 315708106',
      exploitant_id: 1,
      actif: true,
    },
  })

  const clientAeroClub = await prisma.client.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      raison_sociale: 'Aéroclub de Beauvais',
      code_pays: 'FR',
      adresse: 'Aérodrome de Beauvais-Tillé',
      code_postal: '60000',
      ville: 'Beauvais',
      telephone: '+33 3 44 11 22 33',
      email: 'contact@aeroclub-beauvais.fr',
      siren: '123456789',
      exploitant_id: 2,
      actif: true,
    },
  })

  const clientPrive = await prisma.client.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      raison_sociale: 'Jean Dupont',
      code_pays: 'FR',
      adresse: '1 Rue de la Paix',
      code_postal: '75000',
      ville: 'Paris',
      telephone: '+33 1 23 45 67 89',
      email: 'jean.dupont@email.com',
      exploitant_id: 3,
      actif: true,
    },
  })

  console.log('Clients créés')

  // Mettre à jour les aéronefs avec les clients
  await prisma.aeronef.update({
    where: { id: 1 },
    data: { client_id: 1 },
  })

  await prisma.aeronef.update({
    where: { id: 2 },
    data: { client_id: 2 },
  })

  await prisma.aeronef.update({
    where: { id: 3 },
    data: { client_id: 3 },
  })

  console.log('Aéronefs mis à jour avec les clients')
  // ============================================================================
  // SCHEMA sec - SÉCURITÉ
  // ============================================================================

  // Rôles
  const roleAdmin = await prisma.role.upsert({
    where: { code: 'ADMIN' },
    update: {},
    create: {
      code: 'ADMIN',
      libelle: 'Administrateur',
      description: 'Accès complet à toutes les fonctionnalités',
    },
  })

  const roleGestionnaire = await prisma.role.upsert({
    where: { code: 'GESTIONNAIRE' },
    update: {},
    create: {
      code: 'GESTIONNAIRE',
      libelle: 'Gestionnaire',
      description: 'Gestion des vols, mouvements et facturation',
    },
  })

  const roleComptable = await prisma.role.upsert({
    where: { code: 'COMPTABLE' },
    update: {},
    create: {
      code: 'COMPTABLE',
      libelle: 'Comptable',
      description: 'Accès à la facturation et à la comptabilité',
    },
  })

  const roleUtilisateur = await prisma.role.upsert({
    where: { code: 'UTILISATEUR' },
    update: {},
    create: {
      code: 'UTILISATEUR',
      libelle: 'Utilisateur',
      description: 'Accès limité aux consultations',
    },
  })

  console.log('Rôles créés')

  // Permissions
  const permissions = [
    { code: 'GESTION_VOLS', libelle: 'Gestion des dossiers de vol', description: 'Créer, modifier, supprimer des dossiers de vol' },
    { code: 'GESTION_MOUVEMENTS', libelle: 'Gestion des mouvements', description: 'Créer, modifier, supprimer des mouvements' },
    { code: 'GESTION_AERONEFS', libelle: 'Gestion des aéronefs', description: 'Créer, modifier, supprimer des aéronefs' },
    { code: 'GESTION_EXPLOITANTS', libelle: 'Gestion des exploitants', description: 'Créer, modifier, supprimer des exploitants' },
    { code: 'GESTION_CLIENTS', libelle: 'Gestion des clients', description: 'Créer, modifier, supprimer des clients' },
    { code: 'GESTION_FACTURATION', libelle: 'Gestion de la facturation', description: 'Créer, modifier, supprimer des factures' },
    { code: 'GESTION_COMPTA', libelle: 'Gestion comptable', description: 'Accès au paramétrage comptable' },
    { code: 'EXPORT_DONNEES', libelle: 'Export des données', description: 'Exporter des données en CSV, XLSX, JSON' },
    { code: 'ADMINISTRATION', libelle: 'Administration', description: 'Gestion des utilisateurs et des rôles' },
    { code: 'CONSULTATION', libelle: 'Consultation', description: 'Consulter les données (lecture seule)' },
  ]

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { code: perm.code },
      update: {},
      create: perm,
    })
  }

  console.log('Permissions créées')

  // Associer permissions aux rôles
  const allPermissions = await prisma.permission.findMany()

  // Admin a toutes les permissions
  for (const perm of allPermissions) {
    await prisma.rolePermission.upsert({
      where: { role_id_permission_id: { role_id: roleAdmin.id, permission_id: perm.id } },
      update: {},
      create: {
        role_id: roleAdmin.id,
        permission_id: perm.id,
      },
    })
  }

  // Gestionnaire a la plupart des permissions sauf administration
  const gestionnairePermissions = allPermissions.filter(p => p.code !== 'ADMINISTRATION')
  for (const perm of gestionnairePermissions) {
    await prisma.rolePermission.upsert({
      where: { role_id_permission_id: { role_id: roleGestionnaire.id, permission_id: perm.id } },
      update: {},
      create: {
        role_id: roleGestionnaire.id,
        permission_id: perm.id,
      },
    })
  }

  // Comptable a les permissions comptables et consultation
  const comptablePermissions = allPermissions.filter(p =>
    p.code === 'GESTION_FACTURATION' ||
    p.code === 'GESTION_COMPTA' ||
    p.code === 'EXPORT_DONNEES' ||
    p.code === 'CONSULTATION'
  )
  for (const perm of comptablePermissions) {
    await prisma.rolePermission.upsert({
      where: { role_id_permission_id: { role_id: roleComptable.id, permission_id: perm.id } },
      update: {},
      create: {
        role_id: roleComptable.id,
        permission_id: perm.id,
      },
    })
  }

  // Utilisateur a seulement la consultation
  const userPermission = allPermissions.find(p => p.code === 'CONSULTATION')
  if (userPermission) {
    await prisma.rolePermission.upsert({
      where: { role_id_permission_id: { role_id: roleUtilisateur.id, permission_id: userPermission.id } },
      update: {},
      create: {
        role_id: roleUtilisateur.id,
        permission_id: userPermission.id,
      },
    })
  }

  console.log('Permissions associées aux rôles')

  // Utilisateur admin local
  const adminUser = await prisma.utilisateur.upsert({
    where: { email: 'admin@aerogest.local' },
    update: {},
    create: {
      email: 'admin@aerogest.local',
      nom: 'Admin',
      prenom: 'Administrateur',
      password_hash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // bcrypt hash of "admin123"
      provider: 'local',
      aerodrome_id: 'LFPB',
      role_id: roleAdmin.id,
      actif: true,
    },
  })

  console.log('Utilisateur admin créé')

  // Utilisateur gestionnaire
  const gestionnaireUser = await prisma.utilisateur.upsert({
    where: { email: 'gestionnaire@aerogest.local' },
    update: {},
    create: {
      email: 'gestionnaire@aerogest.local',
      nom: 'Gestionnaire',
      prenom: 'Jean',
      password_hash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // bcrypt hash of "gestion123"
      provider: 'local',
      aerodrome_id: 'LFPB',
      role_id: roleGestionnaire.id,
      actif: true,
    },
  })

  console.log('Utilisateur gestionnaire créé')

  // Utilisateur comptable
  const comptableUser = await prisma.utilisateur.upsert({
    where: { email: 'comptable@aerogest.local' },
    update: {},
    create: {
      email: 'comptable@aerogest.local',
      nom: 'Comptable',
      prenom: 'Marie',
      password_hash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // bcrypt hash of "compta123"
      provider: 'local',
      aerodrome_id: 'LFPB',
      role_id: roleComptable.id,
      actif: true,
    },
  })

  console.log('Utilisateur comptable créé')

  // Créer quelques dossiers de vol et mouvements d'exemple
  const dossier1 = await prisma.dossierVol.create({
    data: {
      numero_dossier: 'LFPB-2026-000001',
      date_vol: new Date('2026-01-15'),
      code_aerodrome_source: 'LFPB',
      aeronef_id: 1,
      exploitant_id: 1,
      indicatif_utilise: 'AFR123',
      code_indicatif_oaci: 'AFR',
      qualification: 'COMMERCIAL',
      type_voyage_dgac: '5',
      regime_vol: 'IFR',
      case8_plan_vol: 'N',
      vol_regulier: true,
      nb_passagers: 150,
      statut: 'CLOTURE',
      saisi_par: 'admin@aerogest.local',
    },
  })

  const mouvement1 = await prisma.mouvement.create({
    data: {
      dossier_id: dossier1.id,
      ordre_chrono: 1,
      code_type_mouvement: 'ARR',
      code_aerodrome_escale: 'LFPB',
      debut_ts: new Date('2026-01-15T10:00:00Z'),
      fin_ts: new Date('2026-01-15T10:30:00Z'),
      heure_piste: new Date('1970-01-01T10:15:00Z'),
      piste_utilisee: '08',
    },
  })

  const mouvement2 = await prisma.mouvement.create({
    data: {
      dossier_id: dossier1.id,
      ordre_chrono: 2,
      code_type_mouvement: 'DEP',
      code_aerodrome_escale: 'LFPB',
      debut_ts: new Date('2026-01-15T12:00:00Z'),
      fin_ts: new Date('2026-01-15T12:20:00Z'),
      heure_piste: new Date('1970-01-01T12:10:00Z'),
      piste_utilisee: '08',
    },
  })

  const dossier2 = await prisma.dossierVol.create({
    data: {
      numero_dossier: 'LFPB-2026-000002',
      date_vol: new Date('2026-01-16'),
      code_aerodrome_source: 'LFPB',
      aeronef_id: 2,
      exploitant_id: 2,
      indicatif_utilise: 'AERO1',
      qualification: 'PRIVE',
      type_voyage_dgac: '1',
      regime_vol: 'VFR_PLN',
      nb_passagers: 2,
      statut: 'CLOTURE',
      saisi_par: 'gestionnaire@aerogest.local',
    },
  })

  const mouvement3 = await prisma.mouvement.create({
    data: {
      dossier_id: dossier2.id,
      ordre_chrono: 1,
      code_type_mouvement: 'LOC',
      debut_ts: new Date('2026-01-16T14:00:00Z'),
      fin_ts: new Date('2026-01-16T15:30:00Z'),
      nb_touch_and_go: 3,
      nb_remises_gaz: 2,
    },
  })

  console.log('Dossiers de vol et mouvements créés')

  // Créer une facture d'exemple
  const facture1 = await prisma.facture.create({
    data: {
      numero_facture: 'FACT-2026-000001',
      client_id: 1,
      date_facture: new Date('2026-01-16'),
      date_echeance: new Date('2026-02-15'),
      statut: 'VALIDE',
      montant_ht: 1500,
      montant_tva: 300,
      montant_ttc: 1800,
      tva_taux: 20,
    },
  })

  const ligneFacture1 = await prisma.ligneFacture.create({
    data: {
      facture_id: facture1.id,
      dossier_id: dossier1.id,
      rubrique_id: rubriqueAtterrissage.id,
      libelle: 'Taxe d\\'atterrissage - Airbus A320',
      description: 'Taxe basée sur MTOW 78000 kg',
      quantite: 1,
      prix_unitaire: 750,
      montant_ht: 750,
      montant_tva: 150,
      montant_ttc: 900,
      tva_taux: 20,
    },
  })

  const ligneFacture2 = await prisma.ligneFacture.create({
    data: {
      facture_id: facture1.id,
      dossier_id: dossier1.id,
      rubrique_id: rubriqueParking.id,
      libelle: 'Taxe de parking - 2 heures',
      description: 'Stationnement de 2 heures',
      quantite: 2,
      prix_unitaire: 375,
      montant_ht: 750,
      montant_tva: 150,
      montant_ttc: 900,
      tva_taux: 20,
    },
  })

  console.log('Facture et lignes de facture créées')
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
