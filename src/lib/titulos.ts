// TÍTULOS DOS PERSONAGENS — edite à vontade.
//
// O participante NÃO digita o título: todo mundo começa com o TITULO_INICIAL e escolhe, na aba
// Ficha, entre os títulos que já desbloqueou. Os outros são liberados digitando o `codigo` no
// mesmo campo dos códigos do dia.
//
// Regras:
//  - `titulo`: o texto que vai na carta (até ~28 caracteres para caber na linha do título).
//  - `codigo`: o que a pessoa digita (maiúsculas/minúsculas e espaços nas pontas não importam).
//    Vários títulos podem ter o MESMO código (um código libera todos eles de uma vez).
//    Pode até ser um código do dia (codigos.ts) para o título vir junto com o cenário do dia.
//  - Os títulos bloqueados ficam escondidos no app (surpresa) — só aparece quantos faltam.
//  - O código mestre (codigos.ts) libera todos.
//
// ⚠️ Não troque o texto de um título depois que o evento começar: quem já o escolheu volta
//    para o título inicial (o app guarda o texto do título escolhido).

export const TITULO_INICIAL = "Recruta";

export const TITULOS: { titulo: string; codigo: string }[] = [
  { titulo: "Safari", codigo: "UAI-3ADXD" },
  { titulo: "Congelado", codigo: "UAI-4M3GP" },
  { titulo: "Move Multidões", codigo: "UAI-VWKDV" },
  { titulo: "Evidente", codigo: "UAI-6WMTC" },
  { titulo: "Vilão", codigo: "UAI-Y4FYH" },
  { titulo: "Curioso", codigo: "UAI-3AGAR" },
  { titulo: "Influencer", codigo: "UAI-YK74F" },
  { titulo: "O Vampiro", codigo: "UAI-EUNRC" },
  { titulo: "O Caçador de Vampiros", codigo: "UAI-9W7MK" },
  { titulo: "Muuuu", codigo: "UAI-CMACU" },
  { titulo: "드라마", codigo: "UAI-PNKPE" },
  { titulo: "Do Rock", codigo: "UAI-DP7NA" },
  { titulo: "Fã", codigo: "UAI-YPQCD" },
  { titulo: "O Que Tudo Vê", codigo: "UAI-HRR33" },
  { titulo: "Madagascar", codigo: "UAI-9UFMD" },
  { titulo: "Alienígena", codigo: "UAI-A4WQN" },
  { titulo: "O Ricardo", codigo: "UAI-Q9JYY" },
  { titulo: "Mighty Morphin", codigo: "UAI-QE79F" },
  { titulo: "Padre", codigo: "UAI-NPKTC" },
  { titulo: "Número 2", codigo: "UAI-MYWPR" },
  { titulo: "Rei do Pop", codigo: "UAI-QTVNM" },
  { titulo: "Lady Gaga", codigo: "UAI-7T4CW" },
  { titulo: "Rapper", codigo: "UAI-TWFNG" },
  { titulo: "Comediante", codigo: "UAI-93GDN" },
  { titulo: "Músico", codigo: "UAI-QXNUJ" },
  { titulo: "Dançarino", codigo: "UAI-VCQ3K" },
  { titulo: "Amoroso", codigo: "UAI-PYHGG" },
  { titulo: "Motivacional", codigo: "UAI-V4GJE" },
  { titulo: "Cantor", codigo: "UAI-GE6RC" },
  { titulo: "Fofo", codigo: "UAI-YAUCD" },
  { titulo: "Assustador", codigo: "UAI-KXD4N" },
  { titulo: "Imitador", codigo: "UAI-9KW6D" },
  { titulo: "Construtor", codigo: "UAI-JFXTM" },
  { titulo: "Mágico", codigo: "UAI-9CEWR" },
  { titulo: "Criador de Tendências", codigo: "UAI-YFY74" },
  { titulo: "Popular", codigo: "UAI-TQW47" },
  { titulo: "Atencioso", codigo: "UAI-4R9Y7" },
  { titulo: "Sorridente", codigo: "UAI-N6J6P" },
  { titulo: "Ornitólogo", codigo: "UAI-QTTF3" },
  { titulo: "Entomófilo", codigo: "UAI-TDKGD" },
  { titulo: "Otaku", codigo: "UAI-PVWMA" },
  { titulo: "Artista", codigo: "UAI-FMNYK" },
  { titulo: "Pinguim", codigo: "UAI-9JJAN" },
  { titulo: "Huntrix", codigo: "UAI-TAWTJ" },
  { titulo: "67", codigo: "UAI-NUF94" },
  { titulo: "Invencível", codigo: "UAI-UYK7A" },
  { titulo: "Emocionante", codigo: "UAI-TMPMK" },
  { titulo: "Herói Lendário", codigo: "UAI-VGJBW" },
];
