-- ============================================================================
-- BDD AÉRODROME UNIFIÉE
-- Fusion du modèle « dossiers de vol / mouvements / statistiques DGAC » (aer)
-- et du modèle « facturation / interface Sigma Linéa Compta » (fac)
-- PostgreSQL 14+
-- Schémas :
-- aer : exploitation — aéronefs, exploitants, dossiers de vol, mouvements,
-- nomenclature DGAC, vues statistiques et collectes
-- fac : facturation — plan comptable M14, prestations, clients, contrats,
-- factures, règlements, écritures export Sigma
-- sec : sécurité — utilisateurs (comptes locaux ou Office 365 / Microsoft
-- Entra ID), rôles, droits, sites de rattachement, RLS par site
-- Principes de fusion :
-- * Une seule table AERONEF (aer.aeronef) enrichie du client de facturation.
-- * Une seule table de mouvements (aer.mouvement, issue du dossier de vol) :
-- la facturation s'appuie sur ces mouvements, l'ancienne table
-- mouvement_aeronef disparaît.
-- * Lien mouvement <-> ligne de facture via la table d'association
-- fac.mouvement_facture (anti-double-facturation, sans FK cyclique).
-- * MTOW porté par le modèle d'aéronef (utilisé par les grilles tarifaires).
-- * fac.client peut référencer un exploitant (aer.exploitant).
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS btree_gist; -- contraintes d'exclusion anti-chevauchement
-- gen_random_uuid() est natif depuis PostgreSQL 13

CREATE SCHEMA IF NOT EXISTS aer;
CREATE SCHEMA IF NOT EXISTS fac;
SET search_path TO aer, fac, public;

-- ============================================================================
-- 1. SCHÉMA aer — RÉFÉRENTIEL GÉOGRAPHIQUE ET AÉRONEFS
-- ============================================================================

CREATE TABLE aer.pays (
code_pays text PRIMARY KEY, -- code OACI (FR, DE, US, GB...)
libelle text NOT NULL,
prefixe_immat text -- préfixe du registre ('F','D','N','HB'...
-- ou multi-lettres 'HB','OO','9A'...)
-- pour déduire le pays d'une immatriculation
);

CREATE TABLE aer.aerodrome (
code_oaci text PRIMARY KEY, -- LFPB, LFPO, EDDK...
libelle text NOT NULL,
code_pays text NOT NULL REFERENCES aer.pays(code_pays)
);

CREATE TABLE aer.categorie_propulsion (
code text PRIMARY KEY, -- PISTON TURBOPROP REACTEUR HELICO PLANEUR
libelle text NOT NULL
);
INSERT INTO aer.categorie_propulsion VALUES
('PISTON', 'Moteurs à pistons'),
('TURBOPROP','Turbopropulseurs'),
('REACTEUR', 'Réacteurs'),
('HELICO', 'Hélicoptères'),
('PLANEUR', 'Planeurs');

CREATE TABLE aer.modele_aeronef (
code_modele text PRIMARY KEY, -- code OACI du modèle (A320, C56X, E55P...)
libelle_modele text NOT NULL,
categorie_propulsion text NOT NULL REFERENCES aer.categorie_propulsion(code),
is_helico boolean NOT NULL DEFAULT false,
mtow_kg numeric(10,2) -- masse maxi au décollage (base tarifaire MTOW)
);

CREATE TABLE aer.aeronef (
id bigserial PRIMARY KEY,
immatriculation text NOT NULL UNIQUE, -- F-GXYZ, N123AB, D-ABCD...
code_pays_registre text NOT NULL REFERENCES aer.pays(code_pays), -- critère DGAC FR/étranger
code_modele text REFERENCES aer.modele_aeronef(code_modele),
exploitant_habituel_id bigint, -- FK ajoutée plus bas
-- client_id (facturation) ajouté plus bas (schéma fac)
mtow_kg_override numeric(10,2), -- dérogation ponctuelle au MTOW du modèle
-- Adresse transpondeur Mode S (hex 24 bits, ex. '3C6444') : identification
-- ADS-B / radar, seul moyen d'identifier l'appareil réel d'un callsign
adresse_mode_s text UNIQUE,
actif boolean NOT NULL DEFAULT true,
CONSTRAINT chk_immat CHECK (length(immatriculation) <= 10)
);

-- ============================================================================
-- 2. SCHÉMA aer — EXPLOITANTS & INDICATIFS
-- ============================================================================

CREATE TABLE aer.type_exploitant (
code text PRIMARY KEY,
libelle text NOT NULL
);
INSERT INTO aer.type_exploitant VALUES
('AEROCLUB', 'Aéroclub'),
('PROPRIETAIRE', 'Propriétaire privé'),
('GESTIONNAIRE', 'Gestionnaire / copropriété'),
('TRANSPORTEUR', 'Transporteur aérien (CTA/AOC)'),
('TRAVAIL_AERIEN', 'Travail aérien');

CREATE TABLE aer.exploitant (
id bigserial PRIMARY KEY,
raison_sociale text NOT NULL,
code_pays text NOT NULL REFERENCES aer.pays(code_pays), -- État d'établissement
code_type_exploitant text NOT NULL REFERENCES aer.type_exploitant(code),
cta_detenu boolean NOT NULL DEFAULT false, -- licence + CTA détenus
code_transporteur text UNIQUE -- code DGAC transporteur
);

CREATE TABLE aer.indicatif_oaci (
code_oaci text PRIMARY KEY, -- AFR, EZY, DLH... (3 lettres)
exploitant_id bigint NOT NULL REFERENCES aer.exploitant(id),
telephonie text, -- "Airfrans", "Speedbird"...
date_debut_validite date NOT NULL DEFAULT CURRENT_DATE,
date_fin_validite date -- null = en vigueur
);

ALTER TABLE aer.aeronef
ADD CONSTRAINT fk_aeronef_exploitant
FOREIGN KEY (exploitant_habituel_id) REFERENCES aer.exploitant(id);

-- ============================================================================
-- 3. SCHÉMA aer — NOMENCLATURE DGAC
-- ============================================================================

CREATE TABLE aer.type_voyage_dgac (
code text PRIMARY KEY,
libelle text NOT NULL
);
INSERT INTO aer.type_voyage_dgac VALUES
('1', 'Vol d''aéroclub'),
('2', 'Vol privé français'),
('3', 'Vol privé étranger'),
('4', 'Vol de travail aérien'),
('5', 'Vol d''appareil commercial sans passager'),
('6', 'Autre vol');

CREATE TABLE aer.type_mouvement (
code text PRIMARY KEY, -- DEP ARR LOC
libelle text NOT NULL
);
INSERT INTO aer.type_mouvement VALUES
('DEP', 'Départ (mouvement au départ)'),
('ARR', 'Arrivée (mouvement à l''arrivée)'),
('LOC', 'Vol local (évolutions dans le circuit)');

-- ============================================================================
-- 4. SCHÉMA aer — DOSSIER DE VOL ET MOUVEMENTS (source unique des mouvements)
-- ============================================================================

CREATE TABLE aer.dossier_vol (
id bigserial PRIMARY KEY,
numero_dossier text NOT NULL UNIQUE, -- ex. LFxx-2026-000123
date_vol date NOT NULL,
code_aerodrome_source text NOT NULL REFERENCES aer.aerodrome(code_oaci),
-- Aéronef et exploitant
aeronef_id bigint NOT NULL REFERENCES aer.aeronef(id),
exploitant_id bigint REFERENCES aer.exploitant(id), -- nullable
-- Identification du vol
indicatif_utilise text, -- indicatif radio / champ 7 du strip
code_indicatif_oaci text REFERENCES aer.indicatif_oaci(code_oaci),
-- Qualification (portée par le VOL, pas par l'appareil ni l'exploitant)
qualification text NOT NULL CHECK (qualification IN ('PRIVE','COMMERCIAL')),
type_voyage_dgac text NOT NULL REFERENCES aer.type_voyage_dgac(code),
-- Plan de vol / régime
regime_vol text NOT NULL CHECK (regime_vol IN ('IFR','VFR_PLN','VFR_SANS')),
case8_plan_vol text CHECK (case8_plan_vol IN ('N','G')),
circonstance_vol text CHECK (circonstance_vol IN ('N','D','I','C')) DEFAULT 'N',
-- Trafic commercial (DGAC bulletin statistique)
vol_regulier boolean NOT NULL DEFAULT false,
nb_passagers integer DEFAULT 0,
fret_kg numeric(10,2) DEFAULT 0,
poste_kg numeric(10,2) DEFAULT 0,
-- Retards (régularité/ponctualité)
retard_minutes integer,
code_cause_retard text,
-- Gestion
statut text NOT NULL DEFAULT 'OUVERT'
CHECK (statut IN ('OUVERT','CLOTURE','ANNULE')),
cree_le timestamptz NOT NULL DEFAULT now(),
modifie_le timestamptz NOT NULL DEFAULT now(),
saisi_par text
);
CREATE INDEX idx_dv_date ON aer.dossier_vol(date_vol);
CREATE INDEX idx_dv_source ON aer.dossier_vol(code_aerodrome_source, date_vol);
CREATE INDEX idx_dv_aeronef ON aer.dossier_vol(aeronef_id);
CREATE INDEX idx_dv_qualif ON aer.dossier_vol(qualification, type_voyage_dgac);

CREATE TABLE aer.mouvement (
id bigserial PRIMARY KEY,
dossier_id bigint NOT NULL REFERENCES aer.dossier_vol(id) ON DELETE CASCADE,
ordre_chrono integer NOT NULL, -- 1, 2, 3... dans le dossier
code_type_mouvement text NOT NULL REFERENCES aer.type_mouvement(code),
code_aerodrome_escale text REFERENCES aer.aerodrome(code_oaci), -- null pour vol local
-- Fenêtre temporelle du mouvement : début et fin obligatoires
debut_ts timestamptz NOT NULL,
fin_ts timestamptz NOT NULL,
heure_bloc time, -- parking
heure_piste time, -- atterrissage/décollage
piste_utilisee text,
-- Vol local : décomptes spécifiques DGAC
nb_touch_and_go integer NOT NULL DEFAULT 0,
nb_remises_gaz integer NOT NULL DEFAULT 0,
remarques text,
CONSTRAINT uq_mvt_ordre UNIQUE (dossier_id, ordre_chrono),
CONSTRAINT chk_mvt_ordre_positif CHECK (ordre_chrono >= 1),
CONSTRAINT chk_mvt_fenetre CHECK (fin_ts >= debut_ts),
CONSTRAINT chk_mvt_local_decomptes CHECK (
(code_type_mouvement = 'LOC')
OR (nb_touch_and_go = 0 AND nb_remises_gaz = 0)
),
-- Pas de chevauchement temporel entre mouvements d'un même dossier
CONSTRAINT excl_mvt_chevauchement EXCLUDE USING gist (
dossier_id WITH =,
tstzrange(debut_ts, fin_ts) WITH &&
)
);
CREATE INDEX idx_mvt_dossier ON aer.mouvement(dossier_id, ordre_chrono);
CREATE INDEX idx_mvt_debut ON aer.mouvement(debut_ts);

-- Un dossier CLOTURE doit avoir au moins un mouvement ET un aéronef renseigné
-- (la saisie manuelle permet un dossier incomplet en cours, cf. section 5 bis / règle 19)
CREATE OR REPLACE FUNCTION aer.trg_verif_dossier_complet() RETURNS trigger AS $$
BEGIN
IF NEW.statut = 'CLOTURE' AND (
NOT EXISTS (SELECT 1 FROM aer.mouvement m WHERE m.dossier_id = NEW.id)
OR NEW.aeronef_id IS NULL
) THEN
RAISE EXCEPTION 'Le dossier % ne peut être clôturé sans mouvement ni aéronef renseigné',
NEW.numero_dossier;
END IF;
RETURN NEW;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_dossier_complet BEFORE UPDATE OF statut ON aer.dossier_vol
FOR EACH ROW EXECUTE FUNCTION aer.trg_verif_dossier_complet();

-- Mise à jour automatique (modifie_le)
CREATE OR REPLACE FUNCTION aer.trg_touch_modifie_le() RETURNS trigger AS $$
BEGIN
NEW.modifie_le := now();
RETURN NEW;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_dv_modifie_le BEFORE UPDATE ON aer.dossier_vol
FOR EACH ROW EXECUTE FUNCTION aer.trg_touch_modifie_le();

-- ============================================================================
-- 5. SCHÉMA aer — AIDE À LA QUALIFICATION (PRIVÉ / COMMERCIAL)
-- ============================================================================

CREATE OR REPLACE FUNCTION aer.suggerer_qualification(
p_indicatif text, -- indicatif entendu / champ 7 du strip
p_case8 text, -- 'N' ou 'G' (null si pas de plan de vol)
p_pays_registre text -- pays d'immatriculation de l'aéronef
) RETURNS TABLE (qualification text, type_voyage_dgac text, confiance text) AS