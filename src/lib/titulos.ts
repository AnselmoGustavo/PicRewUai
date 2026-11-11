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
//    Pode até ser um código do dia (ex.: "UAI-DIA2") para o título vir junto com os itens do dia.
//  - Os títulos bloqueados ficam escondidos no app (surpresa) — só aparece quantos faltam.
//  - O código mestre (UAI-MESTRE) libera todos.
//
// ⚠️ Não troque o texto de um título depois que o evento começar: quem já o escolheu volta
//    para o título inicial (o app guarda o texto do título escolhido).

export const TITULO_INICIAL = "Recruta";

export const TITULOS: { titulo: string; codigo: string }[] = [
  // Exemplos (apague/troque):
  { titulo: "o Bravo", codigo: "UAI-BRAVO" },
  { titulo: "a Lenda da Taverna", codigo: "UAI-TAVERNA" },
];
