// Card data index - imports all character card files

import otomune_kozueCards from './otomune_kozue.js'
import yugiri_tsuzuriCards from './yugiri_tsuzuri.js'
import fujishima_megumiCards from './fujishima_megumi.js'
import hinoshita_kahoCards from './hinoshita_kaho.js'
import murano_sayakaCards from './murano_sayaka.js'
import osawa_rurinoCards from './osawa_rurino.js'
import momose_ginkoCards from './momose_ginko.js'
import kachimachi_kosuzuCards from './kachimachi_kosuzu.js'
import anyoji_himeCards from './anyoji_hime.js'
import katsuragi_izumiCards from './katsuragi_izumi.js'
import ceras_rilienfeltCards from './ceras_rilienfelt.js'
import katsuragi_and_cerasCards from './katsuragi_and_ceras.js'
import ogami_sachiCards from './ogami_sachi.js'

// Merge all card data
const cardData = {
  ...otomune_kozueCards,
  ...yugiri_tsuzuriCards,
  ...fujishima_megumiCards,
  ...hinoshita_kahoCards,
  ...murano_sayakaCards,
  ...osawa_rurinoCards,
  ...momose_ginkoCards,
  ...kachimachi_kosuzuCards,
  ...anyoji_himeCards,
  ...katsuragi_izumiCards,
  ...ceras_rilienfeltCards,
  ...katsuragi_and_cerasCards,
  ...ogami_sachiCards,
}

export default cardData
