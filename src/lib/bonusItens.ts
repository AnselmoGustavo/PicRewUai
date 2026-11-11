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
  "arqueiro/arma/arco_bom": {},            // Arco Bom (dia2)
  "arqueiro/arma/arco_vagabundo": {},      // Arco Vagabundo (dia1)
  "arqueiro/calca/calca": {},              // Calca (dia2)
  "arqueiro/calca/short": {},              // Short (dia1)
  "arqueiro/calcado/botas": {},            // Botas (dia2)
  "arqueiro/camisa/blusa": {},             // Blusa (dia2)
  "arqueiro/camisa/tunica": {},            // Tunica (dia1)

  // ---- bardo ----
  "bardo/arma/alaude": {},                 // Alaude (dia2)
  "bardo/arma/viola_desafinada": {},       // Viola Desafinada (dia1)
  "bardo/calca/calca": {},                 // Calca (dia2)
  "bardo/calca/short": {},                 // Short (dia1)
  "bardo/calcado/sandalia": {},            // Sandalia (dia2)
  "bardo/calcado/sapatos": {},             // Sapatos (dia2)
  "bardo/camisa/blusa": {},                // Blusa (dia2)
  "bardo/camisa/tunica": {},               // Tunica (dia1)

  // ---- guerreiro ----
  "guerreiro/arma/espada_boa": {},         // Espada Boa (dia2)
  "guerreiro/arma/espada_madeira": {},     // Espada Madeira (dia1)
  "guerreiro/calca/armadura": {},          // Armadura (dia2)
  "guerreiro/calca/short": {},             // Short (dia1)
  "guerreiro/calcado/botas": {},           // Botas (dia2)
  "guerreiro/camisa/armadura": {},         // Armadura (dia2)
  "guerreiro/camisa/tunica": {},           // Tunica (dia1)
  "guerreiro/capa/capa": {},               // Capa (dia2)

  // ---- mago ----
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
  "ninja/chapeu/girassol": {},             // Girassol (inicial)
  "ninja/chapeu/laco": {},                 // Laco (inicial)
};
