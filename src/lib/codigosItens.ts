// CÓDIGOS DOS ITENS — edite à vontade.
//
// Cada linha é uma peça (chave "classe/tipo/nome", vale para TODOS os animais).
//  - "" (vazio)  -> o item segue a regra do dia (libera com o código do dia dele, como hoje).
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
  "arqueiro/acessorio/cachecol": "",       // Cachecol (hoje: inicial)
  "arqueiro/acessorio/girassol": "",       // Girassol (hoje: inicial)
  "arqueiro/acessorio/laco": "",           // Laco (hoje: inicial)
  "arqueiro/acessorio/oculos_de_grau": "", // Oculos de Grau (hoje: inicial)
  "arqueiro/acessorio/oculos_squirtle": "", // Oculos Squirtle (hoje: inicial)
  "arqueiro/acessorio/pokebola": "",       // Pokebola (hoje: inicial)
  "arqueiro/arma/besta_twich": "",         // Besta Twich (hoje: inicial)
  "arqueiro/arma/megaman": "",             // Megaman (hoje: inicial)
  "arqueiro/chapeu/cabeca_godzilla": "",   // Cabeca Godzilla (hoje: inicial)
  "arqueiro/chapeu/chapeu_luffy": "",      // Chapeu Luffy (hoje: inicial)
  "arqueiro/chapeu/chapeu_maquinista": "", // Chapeu Maquinista (hoje: inicial)
  "arqueiro/arma/arco_bom": "",            // Arco Bom (hoje: dia2)
  "arqueiro/arma/arco_vagabundo": "",      // Arco Vagabundo (hoje: dia1)
  "arqueiro/calca/calca": "",              // Calca (hoje: dia2)
  "arqueiro/calca/short": "",              // Short (hoje: dia1)
  "arqueiro/calcado/botas": "",            // Botas (hoje: dia2)
  "arqueiro/camisa/blusa": "",             // Blusa (hoje: dia2)
  "arqueiro/camisa/tunica": "",            // Tunica (hoje: dia1)

  // ---- bardo ----
  "bardo/acessorio/cachecol": "",          // Cachecol (hoje: inicial)
  "bardo/acessorio/girassol": "",          // Girassol (hoje: inicial)
  "bardo/acessorio/laco": "",              // Laco (hoje: inicial)
  "bardo/acessorio/oculos_de_grau": "",    // Oculos de Grau (hoje: inicial)
  "bardo/acessorio/oculos_squirtle": "",   // Oculos Squirtle (hoje: inicial)
  "bardo/acessorio/pokebola": "",          // Pokebola (hoje: inicial)
  "bardo/arma/guitarra_brook": "",         // Guitarra Brook (hoje: inicial)
  "bardo/arma/guitarra_larinha": "",       // Guitarra Larinha (hoje: inicial)
  "bardo/chapeu/cabeca_godzilla": "",      // Cabeca Godzilla (hoje: inicial)
  "bardo/chapeu/chapeu_luffy": "",         // Chapeu Luffy (hoje: inicial)
  "bardo/chapeu/chapeu_maquinista": "",    // Chapeu Maquinista (hoje: inicial)
  "bardo/arma/alaude": "",                 // Alaude (hoje: dia2)
  "bardo/arma/viola_desafinada": "",       // Viola Desafinada (hoje: dia1)
  "bardo/calca/calca": "",                 // Calca (hoje: dia2)
  "bardo/calca/short": "",                 // Short (hoje: dia1)
  "bardo/calcado/sapatos": "",             // Sapatos (hoje: dia2)
  "bardo/camisa/blusa": "",                // Blusa (hoje: dia2)
  "bardo/camisa/tunica": "",               // Tunica (hoje: dia1)

  // ---- guerreiro ----
  "guerreiro/acessorio/cachecol": "",      // Cachecol (hoje: inicial)
  "guerreiro/acessorio/diario": "",        // Diario (hoje: inicial)
  "guerreiro/acessorio/girassol": "",      // Girassol (hoje: inicial)
  "guerreiro/acessorio/laco": "",          // Laco (hoje: inicial)
  "guerreiro/acessorio/oculos_de_grau": "", // Oculos de Grau (hoje: inicial)
  "guerreiro/acessorio/oculos_squirtle": "", // Oculos Squirtle (hoje: inicial)
  "guerreiro/acessorio/pokebola": "",      // Pokebola (hoje: inicial)
  "guerreiro/escudo/escudo_link": "",        // Escudo Link (hoje: inicial)
  "guerreiro/arma/key_blade": "",          // Key Blade (hoje: inicial)
  "guerreiro/chapeu/cabeca_godzilla": "",  // Cabeca Godzilla (hoje: inicial)
  "guerreiro/chapeu/chapeu_luffy": "",     // Chapeu Luffy (hoje: inicial)
  "guerreiro/chapeu/chapeu_maquinista": "", // Chapeu Maquinista (hoje: inicial)
  "guerreiro/arma/espada_boa": "",         // Espada Boa (hoje: dia2)
  "guerreiro/arma/espada_madeira": "",     // Espada Madeira (hoje: dia1)
  "guerreiro/calca/armadura": "",          // Armadura (hoje: dia2)
  "guerreiro/calca/short": "",             // Short (hoje: dia1)
  "guerreiro/calcado/botas": "",           // Botas (hoje: dia2)
  "guerreiro/camisa/armadura": "",         // Armadura (hoje: dia2)
  "guerreiro/camisa/tunica": "",           // Tunica (hoje: dia1)
  "guerreiro/capa/capa": "",               // Capa (hoje: dia2)

  // ---- mago ----
  "mago/acessorio/cachecol": "",           // Cachecol (hoje: inicial)
  "mago/acessorio/girassol": "",           // Girassol (hoje: inicial)
  "mago/acessorio/laco": "",               // Laco (hoje: inicial)
  "mago/acessorio/oculos_de_grau": "",     // Oculos de Grau (hoje: inicial)
  "mago/acessorio/oculos_squirtle": "",    // Oculos Squirtle (hoje: inicial)
  "mago/acessorio/pokebola": "",           // Pokebola (hoje: inicial)
  "mago/arma/varinha_das_varinhas": "",    // Varinha das Varinhas (hoje: inicial)
  "mago/chapeu/cabeca_godzilla": "",       // Cabeca Godzilla (hoje: inicial)
  "mago/chapeu/chapeu_luffy": "",          // Chapeu Luffy (hoje: inicial)
  "mago/chapeu/chapeu_maquinista": "",     // Chapeu Maquinista (hoje: inicial)
  "mago/chapeu/witch_hat_atelier": "",     // Witch Hat Atelier (hoje: inicial)
  "mago/arma/cajado": "",                  // Cajado (hoje: dia2)
  "mago/arma/varinha_furreca": "",         // Varinha Furreca (hoje: dia1)
  "mago/calca/calca": "",                  // Calca (hoje: dia2)
  "mago/calca/short": "",                  // Short (hoje: dia1)
  "mago/calcado/botas": "",                // Botas (hoje: dia2)
  "mago/camisa/blusa": "",                 // Blusa (hoje: dia2)
  "mago/camisa/tunica": "",                // Tunica (hoje: dia1)
  "mago/capa/capa": "",                    // Capa (hoje: dia2)
  "mago/chapeu/chapeu": "",                // Chapeu (hoje: dia2)

  // ---- ninja ----
  "ninja/acessorio/cachecol": "",          // Cachecol (hoje: inicial)
  "ninja/acessorio/oculos_de_grau": "",    // Oculos de Grau (hoje: inicial)
  "ninja/acessorio/oculos_squirtle": "",   // Oculos Squirtle (hoje: inicial)
  "ninja/arma/katana_de_treino": "",       // Katana de Treino (hoje: dia1)
  "ninja/arma/katana_decente": "",         // Katana Decente (hoje: dia2)
  "ninja/arma/leques_katana": "",          // Leques Katana (hoje: inicial)
  "ninja/calca/calca": "",                 // Calca (hoje: dia2)
  "ninja/calca/short": "",                 // Short (hoje: dia1)
  "ninja/calcado/sapatos": "",             // Sapatos (hoje: dia2)
  "ninja/camisa/blusa": "",                // Blusa (hoje: dia2)
  "ninja/camisa/tunica": "",               // Tunica (hoje: dia1)
  "ninja/chapeu/bandana": "",              // Bandana (hoje: inicial)
  "ninja/chapeu/cabeca_godzilla": "",      // Cabeca Godzilla (hoje: inicial)
  "ninja/chapeu/chapeu_luffy": "",         // Chapeu Luffy (hoje: inicial)
  "ninja/chapeu/chapeu_maquinista": "",    // Chapeu Maquinista (hoje: inicial)
  "ninja/acessorio/girassol": "",             // Girassol (hoje: inicial)
  "ninja/acessorio/laco": "",                 // Laco (hoje: inicial)
};
