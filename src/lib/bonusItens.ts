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
// Cada status da carta vai no máximo até MAX_STATUS (lib/status.ts) — hoje 15.
//
// Distribuição atual (18/11/2026) — referência para ajustes:
//   (teto 15; só com classe + raça cada status fica entre 2 e 5)
//   skin dia 1 (livre) ... +1 por peça (arma no atributo principal da classe)
//   skin dia 2 ........... arma +3 · roupas +2
//   skin DARK (dia 3) .... arma +5 · roupas +3, espalhado (conjunto completo ≈ 10–13 no principal + reforço geral)
//   especiais da classe (Key Blade, Escudo Link, Megaman, Besta Twitch, guitarras, Varinha das Varinhas,
//     Leques Katana) ... +5, como as armas dark · Witch Hat Atelier e Bandana +4 · Diário +2
//   comuns especiais (Óculos, Pokébola, Godzilla, Luffy, Camisa São Paulo) ... +3
//   acessórios flutuantes (Lampião 2022, Estrela 2023, Lanterna 2025) ... +2
//   acessórios avulsos (Cachecol, Girassol, Laço, Maquinista) ... +1
import type { Status } from "./tipos";

export const BONUS_ITENS: Record<string, Partial<Status>> = {
  // ---- arqueiro ----
  "arqueiro/acessorio/cachecol": { vida: 1 },                          // Cachecol (inicial)
  "arqueiro/acessorio/girassol": { intelecto: 1 },                     // Girassol (inicial)
  "arqueiro/acessorio/laco": { destreza: 1 },                          // Laço (inicial)
  "arqueiro/acessorio/oculos_de_grau": { intelecto: 3 },               // Óculos de Grau (inicial)
  "arqueiro/acessorio/oculos_squirtle": { intelecto: 2, destreza: 1 }, // Óculos Squirtle (inicial)
  "arqueiro/acessorio/pokebola": { vida: 1, intelecto: 1, destreza: 1 }, // Pokébola (inicial)
  "arqueiro/arma/besta_twich": { forca: 2, destreza: 3 },              // Besta Twitch (inicial)
  "arqueiro/arma/megaman": { intelecto: 2, destreza: 3 },              // Megaman (inicial)
  "arqueiro/chapeu/cabeca_godzilla": { vida: 1, forca: 2 },            // Cabeça Godzilla (inicial)
  "arqueiro/chapeu/chapeu_luffy": { vida: 2, forca: 1 },               // Chapéu Luffy (inicial)
  "arqueiro/chapeu/chapeu_maquinista": { forca: 1 },                   // Chapéu Maquinista (inicial)
  "arqueiro/arma/arco_bom": { destreza: 3 },                           // Arco Bom (dia2)
  "arqueiro/arma/arco_vagabundo": { destreza: 1 },                     // Arco Vagabundo (dia1)
  "arqueiro/calca/calca": { vida: 1, destreza: 1 },                    // Calça (dia2)
  "arqueiro/calca/short": { destreza: 1 },                             // Short (dia1)
  "arqueiro/calcado/botas": { vida: 1, destreza: 1 },                  // Botas (dia2)
  "arqueiro/camisa/blusa": { vida: 1, forca: 1 },                      // Blusa (dia2)
  "arqueiro/camisa/tunica": { vida: 1 },                               // Túnica (dia1)

  // ---- bardo ----
  "bardo/acessorio/cachecol": { vida: 1 },                             // Cachecol (inicial)
  "bardo/acessorio/girassol": { intelecto: 1 },                        // Girassol (inicial)
  "bardo/acessorio/laco": { destreza: 1 },                             // Laço (inicial)
  "bardo/acessorio/oculos_de_grau": { intelecto: 3 },                  // Óculos de Grau (inicial)
  "bardo/acessorio/oculos_squirtle": { intelecto: 2, destreza: 1 },    // Óculos Squirtle (inicial)
  "bardo/acessorio/pokebola": { vida: 1, intelecto: 1, destreza: 1 },  // Pokébola (inicial)
  "bardo/arma/guitarra_brook": { vida: 2, intelecto: 3 },              // Guitarra Brook (inicial)
  "bardo/arma/guitarra_larinha": { intelecto: 3, destreza: 2 },        // Guitarra Larinha (inicial)
  "bardo/chapeu/cabeca_godzilla": { vida: 1, forca: 2 },               // Cabeça Godzilla (inicial)
  "bardo/chapeu/chapeu_luffy": { vida: 2, forca: 1 },                  // Chapéu Luffy (inicial)
  "bardo/chapeu/chapeu_maquinista": { forca: 1 },                      // Chapéu Maquinista (inicial)
  "bardo/arma/alaude": { intelecto: 3 },                               // Alaúde (dia2)
  "bardo/arma/viola_desafinada": { intelecto: 1 },                     // Viola Desafinada (dia1)
  "bardo/calca/calca": { vida: 1, destreza: 1 },                       // Calça (dia2)
  "bardo/calca/short": { destreza: 1 },                                // Short (dia1)
  "bardo/calcado/sapatos": { vida: 1, destreza: 1 },                   // Sapatos (dia2)
  "bardo/camisa/blusa": { vida: 1, destreza: 1 },                      // Blusa (dia2)
  "bardo/camisa/tunica": { vida: 1 },                                  // Túnica (dia1)

  // ---- guerreiro ----
  "guerreiro/acessorio/cachecol": { vida: 1 },                         // Cachecol (inicial)
  "guerreiro/acessorio/diario": { intelecto: 2 },                      // Diário (inicial)
  "guerreiro/acessorio/girassol": { intelecto: 1 },                    // Girassol (inicial)
  "guerreiro/acessorio/laco": { destreza: 1 },                         // Laço (inicial)
  "guerreiro/acessorio/oculos_de_grau": { intelecto: 3 },              // Óculos de Grau (inicial)
  "guerreiro/acessorio/oculos_squirtle": { intelecto: 2, destreza: 1 }, // Óculos Squirtle (inicial)
  "guerreiro/acessorio/pokebola": { vida: 1, intelecto: 1, destreza: 1 }, // Pokébola (inicial)
  "guerreiro/escudo/escudo_link": { vida: 3, forca: 2 },               // Escudo Link (inicial)
  "guerreiro/arma/key_blade": { forca: 3, intelecto: 2 },              // Key Blade (inicial)
  "guerreiro/chapeu/cabeca_godzilla": { vida: 1, forca: 2 },           // Cabeça Godzilla (inicial)
  "guerreiro/chapeu/chapeu_luffy": { vida: 2, forca: 1 },              // Chapéu Luffy (inicial)
  "guerreiro/chapeu/chapeu_maquinista": { forca: 1 },                  // Chapéu Maquinista (inicial)
  "guerreiro/arma/espada_boa": { forca: 3 },                           // Espada Boa (dia2)
  "guerreiro/arma/espada_madeira": { forca: 1 },                       // Espada Madeira (dia1)
  "guerreiro/calca/armadura": { vida: 1, destreza: 1 },                // Armadura (dia2)
  "guerreiro/calca/short": { destreza: 1 },                            // Short (dia1)
  "guerreiro/calcado/botas": { vida: 1, destreza: 1 },                 // Botas (dia2)
  "guerreiro/camisa/armadura": { vida: 1, forca: 1 },                  // Armadura (dia2)
  "guerreiro/camisa/tunica": { vida: 1 },                              // Túnica (dia1)
  "guerreiro/capa/capa": { vida: 2 },                                  // Capa (dia2)

  // ---- mago ----
  "mago/acessorio/cachecol": { vida: 1 },                              // Cachecol (inicial)
  "mago/acessorio/girassol": { intelecto: 1 },                         // Girassol (inicial)
  "mago/acessorio/laco": { destreza: 1 },                              // Laço (inicial)
  "mago/acessorio/oculos_de_grau": { intelecto: 3 },                   // Óculos de Grau (inicial)
  "mago/acessorio/oculos_squirtle": { intelecto: 2, destreza: 1 },     // Óculos Squirtle (inicial)
  "mago/acessorio/pokebola": { vida: 1, intelecto: 1, destreza: 1 },   // Pokébola (inicial)
  "mago/arma/varinha_das_varinhas": { vida: 1, intelecto: 4 },         // Varinha das Varinhas (inicial)
  "mago/chapeu/cabeca_godzilla": { vida: 1, forca: 2 },                // Cabeça Godzilla (inicial)
  "mago/chapeu/chapeu_luffy": { vida: 2, forca: 1 },                   // Chapéu Luffy (inicial)
  "mago/chapeu/chapeu_maquinista": { forca: 1 },                       // Chapéu Maquinista (inicial)
  "mago/chapeu/witch_hat_atelier": { intelecto: 3, destreza: 1 },      // Witch Hat Atelier (inicial)
  "mago/arma/cajado": { intelecto: 3 },                                // Cajado (dia2)
  "mago/arma/varinha_furreca": { intelecto: 1 },                       // Varinha Furreca (dia1)
  "mago/calca/calca": { vida: 1, destreza: 1 },                        // Calça (dia2)
  "mago/calca/short": { destreza: 1 },                                 // Short (dia1)
  "mago/calcado/botas": { vida: 1, destreza: 1 },                      // Botas (dia2)
  "mago/camisa/blusa": { vida: 1, intelecto: 1 },                      // Blusa (dia2)
  "mago/camisa/tunica": { vida: 1 },                                   // Túnica (dia1)
  "mago/capa/capa": { vida: 2 },                                       // Capa (dia2)
  "mago/chapeu/chapeu": { intelecto: 2 },                              // Chapéu (dia2)

  // ---- ninja ----
  "ninja/acessorio/cachecol": { vida: 1 },                             // Cachecol (inicial)
  "ninja/acessorio/oculos_de_grau": { intelecto: 3 },                  // Óculos de Grau (inicial)
  "ninja/acessorio/oculos_squirtle": { intelecto: 2, destreza: 1 },    // Óculos Squirtle (inicial)
  "ninja/arma/katana_de_treino": { destreza: 1 },                      // Katana de Treino (dia1)
  "ninja/arma/katana_decente": { destreza: 3 },                        // Katana Decente (dia2)
  "ninja/arma/leques_katana": { intelecto: 2, destreza: 3 },           // Leques Katana (inicial)
  "ninja/calca/calca": { vida: 1, destreza: 1 },                       // Calça (dia2)
  "ninja/calca/short": { destreza: 1 },                                // Short (dia1)
  "ninja/calcado/sapatos": { vida: 1, destreza: 1 },                   // Sapatos (dia2)
  "ninja/camisa/blusa": { vida: 1, intelecto: 1 },                     // Blusa (dia2)
  "ninja/camisa/tunica": { vida: 1 },                                  // Túnica (dia1)
  "ninja/chapeu/bandana": { vida: 1, intelecto: 1, destreza: 2 },      // Bandana (inicial)
  "ninja/chapeu/cabeca_godzilla": { vida: 1, forca: 2 },               // Cabeça Godzilla (inicial)
  "ninja/chapeu/chapeu_luffy": { vida: 2, forca: 1 },                  // Chapéu Luffy (inicial)
  "ninja/chapeu/chapeu_maquinista": { forca: 1 },                      // Chapéu Maquinista (inicial)
  "ninja/acessorio/girassol": { intelecto: 1 },                        // Girassol (inicial)
  "ninja/acessorio/laco": { destreza: 1 },                             // Laço (inicial)

  // ---- ninja ----
  "ninja/acessorio/estrela_2023": { intelecto: 2 },                    // Estrela 2023 (inicial)
  "ninja/acessorio/lampiao_2022": { vida: 2 },                         // Lampião 2022 (inicial)
  "ninja/acessorio/lanterna_2025": { destreza: 2 },                    // Lanterna 2025 (inicial)
  "ninja/camisa/camisa_sao_paulo": { vida: 1, forca: 1, destreza: 1 }, // Camisa São Paulo (inicial)
  "ninja/arma/shuriken": { intelecto: 2, destreza: 3 },                // Shuriken (dia3)
  "ninja/calca/calca_dark": { vida: 1, destreza: 2 },                  // Calça Dark (dia3)
  "ninja/calcado/geta_com_meia": { vida: 1, destreza: 2 },             // Geta com Meia (dia3)
  "ninja/camisa/blusa_dark": { vida: 1, intelecto: 1, destreza: 1 },   // Blusa Dark (dia3)
  "ninja/capa/ombreiras_e_katana_dark": { forca: 1, intelecto: 1, destreza: 1 }, // Ombreiras e Katana Dark (dia3)
  "ninja/acessorio/pokebola": { vida: 1, intelecto: 1, destreza: 1 },  // Pokébola (inicial)

  // ---- arqueiro ----
  "arqueiro/acessorio/estrela_2023": { intelecto: 2 },                 // Estrela 2023 (inicial)
  "arqueiro/acessorio/lampiao_2022": { vida: 2 },                      // Lampião 2022 (inicial)
  "arqueiro/acessorio/lanterna_2025": { destreza: 2 },                 // Lanterna 2025 (inicial)
  "arqueiro/camisa/camisa_sao_paulo": { vida: 1, forca: 1, destreza: 1 }, // Camisa São Paulo (inicial)
  "arqueiro/arma/arco_dark": { forca: 2, destreza: 3 },                // Arco Dark (dia3)
  "arqueiro/calca/calca_dark": { vida: 1, destreza: 2 },               // Calça Dark (dia3)
  "arqueiro/calcado/botas_dark": { vida: 1, destreza: 2 },             // Botas Dark (dia3)
  "arqueiro/camisa/blusa_com_capuz_dark": { vida: 1, forca: 1, destreza: 1 }, // Blusa com Capuz Dark (dia3)

  // ---- bardo ----
  "bardo/acessorio/estrela_2023": { intelecto: 2 },                    // Estrela 2023 (inicial)
  "bardo/acessorio/lampiao_2022": { vida: 2 },                         // Lampião 2022 (inicial)
  "bardo/acessorio/lanterna_2025": { destreza: 2 },                    // Lanterna 2025 (inicial)
  "bardo/camisa/camisa_sao_paulo": { vida: 1, forca: 1, destreza: 1 }, // Camisa São Paulo (inicial)
  "bardo/arma/violino_sombrio": { intelecto: 3, destreza: 2 },         // Violino Sombrio (dia3)
  "bardo/calca/calca_suspensorio_e_cintos_dark": { vida: 1, intelecto: 1, destreza: 1 }, // Calça Suspensório e Cintos Dark (dia3)
  "bardo/calcado/botas_dark": { vida: 1, destreza: 2 },                // Botas Dark (dia3)
  "bardo/camisa/jaqueta_e_blusa_dark": { vida: 1, intelecto: 2, destreza: 1 }, // Jaqueta e Blusa Dark (dia3)

  // ---- guerreiro ----
  "guerreiro/acessorio/estrela_2023": { intelecto: 2 },                // Estrela 2023 (inicial)
  "guerreiro/acessorio/lampiao_2022": { vida: 2 },                     // Lampião 2022 (inicial)
  "guerreiro/acessorio/lanterna_2025": { destreza: 2 },                // Lanterna 2025 (inicial)
  "guerreiro/camisa/camisa_sao_paulo": { vida: 1, forca: 1, destreza: 1 }, // Camisa São Paulo (inicial)
  "guerreiro/arma/machado": { vida: 2, forca: 3 },                     // Machado (dia3)
  "guerreiro/calca/armadura_dark": { vida: 1, forca: 1, destreza: 1 }, // Armadura Dark (dia3)
  "guerreiro/calcado/botas_dark": { vida: 1, destreza: 2 },            // Botas Dark (dia3)
  "guerreiro/camisa/armadura_dark": { vida: 1, forca: 2 },             // Armadura Dark (dia3)
  "guerreiro/capa/capa_dark": { vida: 1, forca: 2 },                   // Capa Dark (dia3)
  "guerreiro/chapeu/elmo_dark": { vida: 1, forca: 1, destreza: 1 },    // Elmo Dark (dia3)

  // ---- mago ----
  "mago/acessorio/estrela_2023": { intelecto: 2 },                     // Estrela 2023 (inicial)
  "mago/acessorio/lampiao_2022": { vida: 2 },                          // Lampião 2022 (inicial)
  "mago/acessorio/lanterna_2025": { destreza: 2 },                     // Lanterna 2025 (inicial)
  "mago/camisa/camisa_sao_paulo": { vida: 1, forca: 1, destreza: 1 },  // Camisa São Paulo (inicial)
  "mago/arma/vassoura": { vida: 2, intelecto: 3 },                     // Vassoura (dia3)
  "mago/calca/saia_babados_dark": { vida: 1, intelecto: 1, destreza: 1 }, // Saia Babados Dark (dia3)
  "mago/calcado/sapatinho_magico_dark": { intelecto: 2, destreza: 1 }, // Sapatinho Mágico Dark (dia3)
  "mago/camisa/blusa_babados_dark": { vida: 2, intelecto: 1 },         // Blusa Babados Dark (dia3)
  "mago/chapeu/chapeu_dark": { vida: 1, intelecto: 2 },                // Chapéu Dark (dia3)
};
