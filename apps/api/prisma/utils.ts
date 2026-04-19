/**
 * Verwandelt einen String in einen URL-freundlichen Slug.
 * Beispiel: "Straw In The Wind" -> "straw-in-the-wind"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')                   // Zerlegt Umlaute (ä -> a + ¨)
    .replace(/[\u0300-\u036f]/g, '')    // Entfernt die Akzente/Punkte
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')               // Ersetzt Leerzeichen durch -
    .replace(/[^\w-]+/g, '')            // Entfernt alles, was kein Buchstabe/Zahl/- ist
    .replace(/--+/g, '-');              // Verhindert doppelte Bindestriche
}