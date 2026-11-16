/**
 * typograph.js — Russian typographic rules according to studio methodology (Rule Т10)
 */
export function typograph(text) {
  if (!text || typeof text !== 'string') return text || ''

  return text
    .replace(/(^|[\s(«"„])([ввооиусккяпозаиздоотнапоподнадсооббезиз-под]+)\s+/gi, '$1$2\u00A0')
    .replace(/(\s+)([-—–])(\s+)/g, '\u00A0— ')
    .replace(/(\d+)\s+([а-яa-z%]+)/gi, '$1\u00A0$2')
    .trim()
}
