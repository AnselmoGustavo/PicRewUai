// CÓDIGOS DOS ITENS — edite à vontade.
//
// Cada linha é uma peça (chave "classe/tipo/nome", vale para TODOS os animais).
//  - "" (vazio)  -> o item segue a regra do dia (libera com o código do dia dele).
//  (17/11/2026: TODOS os itens ganharam código próprio — lista em codigos-evento.csv.)
//  - "UAI-XYZ"   -> o item SÓ libera com esse código (ou com o código mestre). O dia deixa de valer.
//
// Vários itens podem ter o MESMO código (um código libera todos de uma vez).
// Maiúsculas/minúsculas e espaços nas pontas não importam. O código vai no mesmo campo dos
// códigos do dia. Exemplo:
//   "ninja/chapeu/chapeu_luffy": "UAI-PIRATA",
//
// Item novo que chegar e não estiver aqui segue a regra do dia (o "npm run assets" avisa quais faltam).

export const CODIGOS_ITENS: Record<string, string> = {
  // ---- arqueiro ----
  "arqueiro/acessorio/cachecol": "UAI-MGWV4",        // Cachecol (inicial)
  "arqueiro/acessorio/girassol": "UAI-76VJD",        // Girassol (inicial)
  "arqueiro/acessorio/laco": "UAI-PQGHA",            // Laço (inicial)
  "arqueiro/acessorio/oculos_de_grau": "UAI-RPKEJ",  // Óculos de Grau (inicial)
  "arqueiro/acessorio/oculos_squirtle": "UAI-D93CJ", // Óculos Squirtle (inicial)
  "arqueiro/acessorio/pokebola": "UAI-Y4VP6",        // Pokébola (inicial)
  "arqueiro/arma/besta_twich": "UAI-3VJC6",          // Besta Twitch (inicial)
  "arqueiro/arma/megaman": "UAI-H9RGF",              // Megaman (inicial)
  "arqueiro/chapeu/cabeca_godzilla": "UAI-6X4HE",    // Cabeça Godzilla (inicial)
  "arqueiro/chapeu/chapeu_luffy": "UAI-N3JNF",       // Chapéu Luffy (inicial)
  "arqueiro/chapeu/chapeu_maquinista": "UAI-DEHKP",  // Chapéu Maquinista (inicial)
  "arqueiro/arma/arco_bom": "UAI-YPYXY",             // Arco Bom (dia2)
  "arqueiro/arma/arco_vagabundo": "",                // Arco Vagabundo (dia1 — liberado desde o início)
  "arqueiro/calca/calca": "UAI-RU6UA",               // Calça (dia2)
  "arqueiro/calca/short": "",                        // Short (dia1 — liberado desde o início)
  "arqueiro/calcado/botas": "UAI-DEMH7",             // Botas (dia2)
  "arqueiro/camisa/blusa": "UAI-YTD7M",              // Blusa (dia2)
  "arqueiro/camisa/tunica": "",                      // Túnica (dia1 — liberado desde o início)

  // ---- bardo ----
  "bardo/acessorio/cachecol": "UAI-PMNE4",           // Cachecol (inicial)
  "bardo/acessorio/girassol": "UAI-QN7MY",           // Girassol (inicial)
  "bardo/acessorio/laco": "UAI-3UPYP",               // Laço (inicial)
  "bardo/acessorio/oculos_de_grau": "UAI-G7FP3",     // Óculos de Grau (inicial)
  "bardo/acessorio/oculos_squirtle": "UAI-KWKEX",    // Óculos Squirtle (inicial)
  "bardo/acessorio/pokebola": "UAI-4G9HF",           // Pokébola (inicial)
  "bardo/arma/guitarra_brook": "UAI-DXCP7",          // Guitarra Brook (inicial)
  "bardo/arma/guitarra_larinha": "UAI-HU9AR",        // Guitarra Larinha (inicial)
  "bardo/chapeu/cabeca_godzilla": "UAI-33M3W",       // Cabeça Godzilla (inicial)
  "bardo/chapeu/chapeu_luffy": "UAI-X3VEV",          // Chapéu Luffy (inicial)
  "bardo/chapeu/chapeu_maquinista": "UAI-VCQXM",     // Chapéu Maquinista (inicial)
  "bardo/arma/alaude": "UAI-M4Y4F",                  // Alaúde (dia2)
  "bardo/arma/viola_desafinada": "",                 // Viola Desafinada (dia1 — liberado desde o início)
  "bardo/calca/calca": "UAI-F6V3F",                  // Calça (dia2)
  "bardo/calca/short": "",                           // Short (dia1 — liberado desde o início)
  "bardo/calcado/sapatos": "UAI-HACAK",              // Sapatos (dia2)
  "bardo/camisa/blusa": "UAI-R4JAH",                 // Blusa (dia2)
  "bardo/camisa/tunica": "",                         // Túnica (dia1 — liberado desde o início)

  // ---- guerreiro ----
  "guerreiro/acessorio/cachecol": "UAI-HFETP",       // Cachecol (inicial)
  "guerreiro/acessorio/diario": "UAI-797XY",         // Diário (inicial)
  "guerreiro/acessorio/girassol": "UAI-PVXTX",       // Girassol (inicial)
  "guerreiro/acessorio/laco": "UAI-NC7QK",           // Laço (inicial)
  "guerreiro/acessorio/oculos_de_grau": "UAI-M9DYA", // Óculos de Grau (inicial)
  "guerreiro/acessorio/oculos_squirtle": "UAI-FMGD7", // Óculos Squirtle (inicial)
  "guerreiro/acessorio/pokebola": "UAI-GEGGJ",       // Pokébola (inicial)
  "guerreiro/escudo/escudo_link": "UAI-FK64G",       // Escudo Link (inicial)
  "guerreiro/arma/key_blade": "UAI-WQ7N9",           // Key Blade (inicial)
  "guerreiro/chapeu/cabeca_godzilla": "UAI-F7V7Q",   // Cabeça Godzilla (inicial)
  "guerreiro/chapeu/chapeu_luffy": "UAI-EJ6KD",      // Chapéu Luffy (inicial)
  "guerreiro/chapeu/chapeu_maquinista": "UAI-C4KX6", // Chapéu Maquinista (inicial)
  "guerreiro/arma/espada_boa": "UAI-NR44Y",          // Espada Boa (dia2)
  "guerreiro/arma/espada_madeira": "",               // Espada Madeira (dia1 — liberado desde o início)
  "guerreiro/calca/armadura": "UAI-YDUVH",           // Armadura (dia2)
  "guerreiro/calca/short": "",                       // Short (dia1 — liberado desde o início)
  "guerreiro/calcado/botas": "UAI-M9NAF",            // Botas (dia2)
  "guerreiro/camisa/armadura": "UAI-CFHKG",          // Armadura (dia2)
  "guerreiro/camisa/tunica": "",                     // Túnica (dia1 — liberado desde o início)
  "guerreiro/capa/capa": "UAI-WFJ7P",                // Capa (dia2)

  // ---- mago ----
  "mago/acessorio/cachecol": "UAI-474AJ",            // Cachecol (inicial)
  "mago/acessorio/girassol": "UAI-QAQJU",            // Girassol (inicial)
  "mago/acessorio/laco": "UAI-A7EJ9",                // Laço (inicial)
  "mago/acessorio/oculos_de_grau": "UAI-K4ENV",      // Óculos de Grau (inicial)
  "mago/acessorio/oculos_squirtle": "UAI-TAT9G",     // Óculos Squirtle (inicial)
  "mago/acessorio/pokebola": "UAI-GAM3F",            // Pokébola (inicial)
  "mago/arma/varinha_das_varinhas": "UAI-T7HMQ",     // Varinha das Varinhas (inicial)
  "mago/chapeu/cabeca_godzilla": "UAI-UNM9W",        // Cabeça Godzilla (inicial)
  "mago/chapeu/chapeu_luffy": "UAI-UR9AP",           // Chapéu Luffy (inicial)
  "mago/chapeu/chapeu_maquinista": "UAI-MHAVU",      // Chapéu Maquinista (inicial)
  "mago/chapeu/witch_hat_atelier": "UAI-NJYQU",      // Witch Hat Atelier (inicial)
  "mago/arma/cajado": "UAI-EW7T9",                   // Cajado (dia2)
  "mago/arma/varinha_furreca": "",                   // Varinha Furreca (dia1 — liberado desde o início)
  "mago/calca/calca": "UAI-JH47M",                   // Calça (dia2)
  "mago/calca/short": "",                            // Short (dia1 — liberado desde o início)
  "mago/calcado/botas": "UAI-6DNQP",                 // Botas (dia2)
  "mago/camisa/blusa": "UAI-CJ9RX",                  // Blusa (dia2)
  "mago/camisa/tunica": "",                          // Túnica (dia1 — liberado desde o início)
  "mago/capa/capa": "UAI-6RMCG",                     // Capa (dia2)
  "mago/chapeu/chapeu": "UAI-VR6MU",                 // Chapéu (dia2)

  // ---- ninja ----
  "ninja/acessorio/cachecol": "UAI-MMQPX",           // Cachecol (inicial)
  "ninja/acessorio/oculos_de_grau": "UAI-PAARE",     // Óculos de Grau (inicial)
  "ninja/acessorio/oculos_squirtle": "UAI-3JKGY",    // Óculos Squirtle (inicial)
  "ninja/arma/katana_de_treino": "",                 // Katana de Treino (dia1 — liberado desde o início)
  "ninja/arma/katana_decente": "UAI-EJKTN",          // Katana Decente (dia2)
  "ninja/arma/leques_katana": "UAI-FQAVC",           // Leques Katana (inicial)
  "ninja/calca/calca": "UAI-3E9QN",                  // Calça (dia2)
  "ninja/calca/short": "",                           // Short (dia1 — liberado desde o início)
  "ninja/calcado/sapatos": "UAI-FNYGT",              // Sapatos (dia2)
  "ninja/camisa/blusa": "UAI-PYFXQ",                 // Blusa (dia2)
  "ninja/camisa/tunica": "",                         // Túnica (dia1 — liberado desde o início)
  "ninja/chapeu/bandana": "UAI-U4XUJ",               // Bandana (inicial)
  "ninja/chapeu/cabeca_godzilla": "UAI-VX6CJ",       // Cabeça Godzilla (inicial)
  "ninja/chapeu/chapeu_luffy": "UAI-U447K",          // Chapéu Luffy (inicial)
  "ninja/chapeu/chapeu_maquinista": "UAI-XGDGF",     // Chapéu Maquinista (inicial)
  "ninja/acessorio/girassol": "UAI-UYR9E",           // Girassol (inicial)
  "ninja/acessorio/laco": "UAI-67F34",               // Laço (inicial)

  // ---- ninja ----
  "ninja/arma/shuriken": "UAI-EAPKW",                // Shuriken (dia3)
  "ninja/calca/calca_dark": "UAI-NFC3U",             // Calça Dark (dia3)
  "ninja/calcado/geta_com_meia": "UAI-FCNKX",        // Geta com Meia (dia3)
  "ninja/camisa/blusa_dark": "UAI-VQGFN",            // Blusa Dark (dia3)
  "ninja/capa/ombreiras_e_katana_dark": "UAI-VCREF", // Ombreiras e Katana Dark (dia3)
  "ninja/acessorio/pokebola": "UAI-XKKNU",           // Pokébola (inicial)

  // ---- arqueiro ----
  "arqueiro/arma/arco_dark": "UAI-HJMNY",            // Arco Dark (dia3)
  "arqueiro/calca/calca_dark": "UAI-HAGEC",          // Calça Dark (dia3)
  "arqueiro/calcado/botas_dark": "UAI-HYHY4",        // Botas Dark (dia3)
  "arqueiro/camisa/blusa_com_capuz_dark": "UAI-YMND7", // Blusa com Capuz Dark (dia3)

  // ---- bardo ----
  "bardo/arma/violino_sombrio": "UAI-33PWD",         // Violino Sombrio (dia3)
  "bardo/calca/calca_suspensorio_e_cintos_dark": "UAI-DMWPD", // Calça Suspensório e Cintos Dark (dia3)
  "bardo/calcado/botas_dark": "UAI-CNEQJ",           // Botas Dark (dia3)
  "bardo/camisa/jaqueta_e_blusa_dark": "UAI-7WPNW",  // Jaqueta e Blusa Dark (dia3)

  // ---- guerreiro ----
  "guerreiro/camisa/camisa_sao_paulo": "UAI-RHAYT",  // Camisa São Paulo (inicial)
  "guerreiro/arma/machado": "UAI-TQ7GG",             // Machado (dia3)
  "guerreiro/calca/armadura_dark": "UAI-UY9H9",      // Armadura Dark (dia3)
  "guerreiro/calcado/botas_dark": "UAI-Y9VKN",       // Botas Dark (dia3)
  "guerreiro/camisa/armadura_dark": "UAI-9NRG9",     // Armadura Dark (dia3)
  "guerreiro/capa/capa_dark": "UAI-A97M4",           // Capa Dark (dia3)
  "guerreiro/chapeu/elmo_dark": "UAI-DMDDY",         // Elmo Dark (dia3)

  // ---- mago ----
  "mago/camisa/camisa_sao_paulo": "UAI-YKF3J",       // Camisa São Paulo (inicial)
  "mago/arma/vassoura": "UAI-RP7E4",                 // Vassoura (dia3)
  "mago/calca/saia_babados_dark": "UAI-49T44",       // Saia Babados Dark (dia3)
  "mago/calcado/sapatinho_magico_dark": "UAI-QKCUX", // Sapatinho Mágico Dark (dia3)
  "mago/camisa/blusa_babados_dark": "UAI-EAUA3",     // Blusa Babados Dark (dia3)
  "mago/chapeu/chapeu_dark": "UAI-PNW3G",            // Chapéu Dark (dia3)

  // ---- bardo ----
  "bardo/camisa/camisa_sao_paulo": "UAI-ME36T",      // Camisa São Paulo (inicial)

  // ---- arqueiro ----
  "arqueiro/camisa/camisa_sao_paulo": "UAI-EFR7D",   // Camisa São Paulo (inicial)

  // ---- ninja ----
  "ninja/camisa/camisa_sao_paulo": "UAI-GWCKR",      // Camisa São Paulo (inicial)

  // ---- ninja ----
  "ninja/acessorio/estrela_2023": "UAI-T6Y47",       // Estrela 2023 (todas as classes)
  "ninja/acessorio/lampiao_2022": "UAI-EUJ6F",       // Lampião 2022 (todas as classes)
  "ninja/acessorio/lanterna_2025": "UAI-XWNJT",      // Lanterna 2025 (todas as classes)

  // ---- mago ----
  "mago/acessorio/estrela_2023": "UAI-T6Y47",        // Estrela 2023 (todas as classes)
  "mago/acessorio/lampiao_2022": "UAI-EUJ6F",        // Lampião 2022 (todas as classes)
  "mago/acessorio/lanterna_2025": "UAI-XWNJT",       // Lanterna 2025 (todas as classes)

  // ---- guerreiro ----
  "guerreiro/acessorio/estrela_2023": "UAI-T6Y47",   // Estrela 2023 (todas as classes)
  "guerreiro/acessorio/lampiao_2022": "UAI-EUJ6F",   // Lampião 2022 (todas as classes)
  "guerreiro/acessorio/lanterna_2025": "UAI-XWNJT",  // Lanterna 2025 (todas as classes)

  // ---- bardo ----
  "bardo/acessorio/estrela_2023": "UAI-T6Y47",       // Estrela 2023 (todas as classes)
  "bardo/acessorio/lampiao_2022": "UAI-EUJ6F",       // Lampião 2022 (todas as classes)
  "bardo/acessorio/lanterna_2025": "UAI-XWNJT",      // Lanterna 2025 (todas as classes)

  // ---- arqueiro ----
  "arqueiro/acessorio/estrela_2023": "UAI-T6Y47",    // Estrela 2023 (todas as classes)
  "arqueiro/acessorio/lampiao_2022": "UAI-EUJ6F",    // Lampião 2022 (todas as classes)
  "arqueiro/acessorio/lanterna_2025": "UAI-XWNJT",   // Lanterna 2025 (todas as classes)

  // ---- bardo ----
  "bardo/chapeu/boina_maneira": "UAI-HQDX7",        // Boina Maneira (dia2)
};
