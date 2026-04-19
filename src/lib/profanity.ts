import { Terlik } from 'terlik.js'

// Terlik.js'in suffix motorunun yakalayamadığı ek çekimli formlar
const missingVariants = [
  // göt ekleri
  'götten',
  'götümü',
  'götüm',
  'götümüz',
  'götüme',
  'göte',
  'götü',
  'götün',
  'götlü',
  'götlek',
  // am ekleri
  'amınıza',
  'amından',
  'amcığa',
  'amcığı',
  // sik ekleri
  'sikten',
  'sikimi',
  'sikimden',
  // yarrak ekleri
  'yarrağı',
  'yarrağa',
  'yarrağın',
  'yarraktan',
  // taşak ekleri
  'taşağı',
  'taşağa',
  'taşşak',
  'taşşağı',
  // diğer eksik ekler
  'pezevengin',
  'pezevenke',
  'kaltağı',
  'kaltağa',
  'gavatın',
  'gavata',
  'dölü',
  'dölün',
  'piçten',
  'piçe',
]

const terlikTr = new Terlik({
  language: 'tr',
  mode: 'balanced',
  maskStyle: 'partial',
  customList: missingVariants,
})

const terlikEn = new Terlik({
  language: 'en',
  mode: 'balanced',
  maskStyle: 'partial',
})

// Warmup
terlikTr.containsProfanity('warmup')
terlikEn.containsProfanity('warmup')

export function censorText(text: string): string {
  let result = terlikTr.clean(text)
  result = terlikEn.clean(result)
  return result
}

export function containsProfanity(text: string): boolean {
  return terlikTr.containsProfanity(text) || terlikEn.containsProfanity(text)
}
