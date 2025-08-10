// Card data index - imports all character card files
import { CardData } from '../../core/models/Card'

import otomune_kozueCards from './otomune_kozue'
import yugiri_tsuzuriCards from './yugiri_tsuzuri'
import fujishima_megumiCards from './fujishima_megumi'
import hinoshita_kahoCards from './hinoshita_kaho'
import murano_sayakaCards from './murano_sayaka'
import osawa_rurinoCards from './osawa_rurino'
import momose_ginkoCards from './momose_ginko'
import kachimachi_kosuzuCards from './kachimachi_kosuzu'
import anyoji_himeCards from './anyoji_hime'
import katsuragi_izumiCards from './katsuragi_izumi'
import ceras_rilienfeltCards from './ceras_rilienfelt'
import katsuragi_and_cerasCards from './katsuragi_and_ceras'
import ogami_sachiCards from './ogami_sachi'

// Merge all card data
const cardData: CardData = {
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
