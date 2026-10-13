/**
 * Configuration de la popup d'annonce site-wide.
 * Pour réafficher la popup après un dismiss, changez `id`.
 */
export const popupConfig = {
	enabled: true,
	/** Identifiant unique — changez-le pour forcer la réapparition chez les utilisateurs qui ont déjà fermé */
	id: 'season-2026',
	title: 'Mise à jour 2026',
	/** HTML autorisé (contenu contrôlé, pas user-generated) */
	message: `
    <p>Le site FantasyBallers a été mis à jour pour la saison <strong>2026</strong>.</p>
    <p>Bonne saison à tous !</p>
  `,
	okLabel: 'OK',
};
