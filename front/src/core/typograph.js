// Т10: русская типографика студии «Калибр» для интерфейсов и данных
// Неразрывные пробелы после коротких слов, перед тире и частицами, в числах и единицах, «ёлочки»

const NBSP = '\u00A0';

// Короткие служебные слова, которые не должны оставаться в конце строки
const SHORT = 'без|для|над|под|при|про|изо|обо|ото|что|как|или|чем|где|кто';
const AFTER_SHORT = new RegExp(`(?<=^|[\\s(«„"—])([А-ЯЁа-яёA-Za-z]{1,2}|${SHORT})\\s+(?=\\S)`, 'giu');
const PARTICLES = /\s+(ли|ль|же|ж|бы|б)(?=[\s.,!?;:…)»“]|$)/giu;

function quotes(text) {
  let depth = 0;
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch !== '"') {
      out += ch;
      continue;
    }
    const prev = i === 0 ? ' ' : text[i - 1];
    const opening = /[\s([{«„—–-]/u.test(prev);
    if (!opening && depth === 0 && /\d/.test(prev)) {
      out += '″';
      continue;
    }
    if (opening) {
      out += depth === 0 ? '«' : '„';
      depth++;
    } else {
      depth = Math.max(0, depth - 1);
      out += depth === 0 ? '»' : '“';
    }
  }
  return out;
}

export function typograph(input) {
  if (!input || typeof input !== 'string') return input || '';
  let s = quotes(input);

  s = s.replace(/\.{3}/g, '…');
  // Тире: неразрывный пробел + длинное тире
  s = s.replace(/[ \t\u00A0]+(?:-{1,2}|–|—)(?=\s)/g, `${NBSP}—`);

  // Разряды цифр в суммах: «4 500 000»
  s = s.replace(/(?<=\d) (?=\d{3}(?!\d))/g, NBSP);

  // Число и единица, валюта, процент: «14.85 %», «500 ₽», «25 USDC», «10 ETH»
  s = s.replace(/(\d)[ \t]+(?=[^\s\d][^\s]{0,6}(?=[\s.,!?;:…)»]|$))/gu, `$1${NBSP}`);
  s = s.replace(/([№§])[ \t]*(?=\d)/g, `$1${NBSP}`);

  s = s.replace(AFTER_SHORT, `$1${NBSP}`);
  s = s.replace(PARTICLES, `${NBSP}$1`);
  return s;
}
