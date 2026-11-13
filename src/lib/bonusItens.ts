// BÔNUS DE STATUS DOS ITENS — edite à vontade.
// O bônus de cada item equipado é SOMADO ao status da ficha (base + classe + raça + itens).
//
// Chave: "classe/tipo/nome" — vale para TODOS os animais (o cajado do mago dá o mesmo bônus
// no macaco, na raposa etc.). Status possíveis: vida, forca, intelecto, destreza.
//
// Exemplos:
//   "mago/arma/cajado": { intelecto: 2 },
//   "guerreiro/camisa/armadura": { vida: 1, forca: 1 },
//   "ninja/chapeu/bandana": {},            <- {} = sem bônus
//
// Item novo que chegar e não estiver aqui fica sem bônus (o "npm run assets" avisa quais faltam).
// Cada status da carta vai no máximo até MAX_STATUS (lib/status.ts) para caber 1 dígito.
import type { Status } from "./tipos";

export const BONUS_ITENS: Record<string, Partial<Status>> = {
  // ---- arqueiro ----
  "arqueiro/acessorio/cachecol": {},       // Cachecol (inicial)
  "arqueiro/acessorio/girassol": {},       // Girassol (inicial)
  "arqueiro/acessorio/laco": {},           // Laco (inicial)
  "arqueiro/acessorio/oculos_de_grau": {}, // Oculos de Grau (inicial)
  "arqueiro/acessorio/oculos_squirtle": {}, // Oculos Squirtle (inicial)
  "arqueiro/acessorio/pokebola": {},       // Pokebola (inicial)
  "arqueiro/arma/besta_twich": {},         // Besta Twich (inicial)
  "arqueiro/arma/megaman": {},             // Megaman (inicial)
  "arqueiro/chapeu/cabeca_godzilla": {},   // Cabeca Godzilla (inicial)
  "arqueiro/chapeu/chapeu_luffy": {},      // Chapeu Luffy (inicial)
  "arqueiro/chapeu/chapeu_maquinista": {}, // Chapeu Maquinista (inicial)
  "arqueiro/arma/arco_bom": {},            // Arco Bom (dia2)
  "arqueiro/arma/arco_vagabundo": {},      // Arco Vagabundo (dia1)
  "arqueiro/calca/calca": {},              // Calca (dia2)
  "arqueiro/calca/short": {},              // Short (dia1)
  "arqueiro/calcado/botas": {},            // Botas (dia2)
  "arqueiro/camisa/blusa": {},             // Blusa (dia2)
  "arqueiro/camisa/tunica": {},            // Tunica (dia1)

  // ---- bardo ----
  "bardo/acessorio/cachecol": {},          // Cachecol (inicial)
  "bardo/acessorio/girassol": {},          // Girassol (inicial)
  "bardo/acessorio/laco": {},              // Laco (inicial)
  "bardo/acessorio/oculos_de_grau": {},    // Oculos de Grau (inicial)
  "bardo/acessorio/oculos_squirtle": {},   // Oculos Squirtle (inicial)
  "bardo/acessorio/pokebola": {},          // Pokebola (inicial)
  "bardo/arma/guitarra_brook": {},         // Guitarra Brook (inicial)
  "bardo/arma/guitarra_larinha": {},       // Guitarra Larinha (inicial)
  "bardo/chapeu/cabeca_godzilla": {},      // Cabeca Godzilla (inicial)
  "bardo/chapeu/chapeu_luffy": {},         // Chapeu Luffy (inicial)
  "bardo/chapeu/chapeu_maquinista": {},    // Chapeu Maquinista (inicial)
  "bardo/arma/alaude": {},                 // Alaude (dia2)
  "bardo/arma/viola_desafinada": {},       // Viola Desafinada (dia1)
  "bardo/calca/calca": {},                 // Calca (dia2)
  "bardo/calca/short": {},                 // Short (dia1)
  "bardo/calcado/sapatos": {},             // Sapatos (dia2)
  "bardo/camisa/blusa": {},                // Blusa (dia2)
  "bardo/camisa/tunica": {},               // Tunica (dia1)

  // ---- guerreiro ----
  "guerreiro/acessorio/cachecol": {},      // Cachecol (inicial)
  "guerreiro/acessorio/diario": {},        // Diario (inicial)
  "guerreiro/acessorio/girassol": {},      // Girassol (inicial)
  "guerreiro/acessorio/laco": {},          // Laco (inicial)
  "guerreiro/acessorio/oculos_de_grau": {}, // Oculos de Grau (inicial)
  "guerreiro/acessorio/oculos_squirtle": {}, // Oculos Squirtle (inicial)
  "guerreiro/acessorio/pokebola": {},      // Pokebola (inicial)
  "guerreiro/arma/escudo_link": {},        // Escudo Link (inicial)
  "guerreiro/arma/key_blade": {},          // Key Blade (inicial)
  "guerreiro/chapeu/cabeca_godzilla": {},  // Cabeca Godzilla (inicial)
  "guerreiro/chapeu/chapeu_luffy": {},     // Chapeu Luffy (inicial)
  "guerreiro/chapeu/chapeu_maquinista": {}, // Chapeu Maquinista (inicial)
  "guerreiro/arma/espada_boa": {},         // Espada Boa (dia2)
  "guerreiro/arma/espada_madeira": {},     // Espada Madeira (dia1)
  "guerreiro/calca/armadura": {},          // Armadura (dia2)
  "guerreiro/calca/short": {},             // Short (dia1)
  "guerreiro/calcado/botas": {},           // Botas (dia2)
  "guerreiro/camisa/armadura": {},         // Armadura (dia2)
  "guerreiro/camisa/tunica": {},           // Tunica (dia1)
  "guerreiro/capa/capa": {},               // Capa (dia2)

  // ---- mago ----
  "mago/acessorio/cachecol": {},           // Cachecol (inicial)
  "mago/acessorio/girassol": {},           // Girassol (inicial)
  "mago/acessorio/laco": {},               // Laco (inicial)
  "mago/acessorio/oculos_de_grau": {},     // Oculos de Grau (inicial)
  "mago/acessorio/oculos_squirtle": {},    // Oculos Squirtle (inicial)
  "mago/acessorio/pokebola": {},           // Pokebola (inicial)
  "mago/arma/varinha_das_varinhas": {},    // Varinha das Varinhas (inicial)
  "mago/chapeu/cabeca_godzilla": {},       // Cabeca Godzilla (inicial)
  "mago/chapeu/chapeu_luffy": {},          // Chapeu Luffy (inicial)
  "mago/chapeu/chapeu_maquinista": {},     // Chapeu Maquinista (inicial)
  "mago/chapeu/witch_hat_atelier": {},     // Witch Hat Atelier (inicial)
  "mago/arma/cajado": {},                  // Cajado (dia2)
  "mago/arma/varinha_furreca": {},         // Varinha Furreca (dia1)
  "mago/calca/calca": {},                  // Calca (dia2)
  "mago/calca/short": {},                  // Short (dia1)
  "mago/calcado/botas": {},                // Botas (dia2)
  "mago/camisa/blusa": {},                 // Blusa (dia2)
  "mago/camisa/tunica": {},                // Tunica (dia1)
  "mago/capa/capa": {},                    // Capa (dia2)
  "mago/chapeu/chapeu": {},                // Chapeu (dia2)

  // ---- ninja ----
  "ninja/acessorio/cachecol": {},          // Cachecol (inicial)
  "ninja/acessorio/oculos_de_grau": {},    // Oculos de Grau (inicial)
  "ninja/acessorio/oculos_squirtle": {},   // Oculos Squirtle (inicial)
  "ninja/arma/katana_de_treino": {},       // Katana de Treino (dia1)
  "ninja/arma/katana_decente": {},         // Katana Decente (dia2)
  "ninja/arma/leques_katana": {},          // Leques Katana (inicial)
  "ninja/calca/calca": {},                 // Calca (dia2)
  "ninja/calca/short": {},                 // Short (dia1)
  "ninja/calcado/sapatos": {},             // Sapatos (dia2)
  "ninja/camisa/blusa": {},                // Blusa (dia2)
  "ninja/camisa/tunica": {},               // Tunica (dia1)
  "ninja/chapeu/bandana": {},              // Bandana (inicial)
  "ninja/chapeu/cabeca_godzilla": {},      // Cabeca Godzilla (inicial)
  "ninja/chapeu/chapeu_luffy": {},         // Chapeu Luffy (inicial)
  "ninja/chapeu/chapeu_maquinista": {},    // Chapeu Maquinista (inicial)
  "ninja/acessorio/girassol": {},             // Girassol (inicial)
  "ninja/acessorio/laco": {},                 // Laco (inicial)
};
