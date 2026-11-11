# 05 — Modelo de Dados, Códigos e Save

## Manifesto de itens (fonte da verdade)

Um único arquivo TypeScript/JSON descreve todos os itens. Todas as telas, filtros e o sistema de códigos leem dele.

```ts
type Categoria = 'camisa' | 'calca' | 'arma' | 'calcado' | 'capa' | 'chapeu' | 'acessorio';
type Classe = 'guerreiro' | 'arqueiro' | 'mago' | 'bardo' | 'ninja';
type Animal = 'macaco' | 'raposa' | 'gato' | 'veado' | 'cachorro';

// Grupo de desbloqueio: itens iniciais + um grupo por dia do evento
type GrupoDesbloqueio = 'inicial' | 'dia1' | 'dia2' | 'dia3' | 'dia4' | 'envio';  // 'envio' libera o botão Enviar

// Itens são POR ANIMAL+CLASSE e MULTI-CAMADA (ADR-016).
interface CamadaItem {
  arquivo: string;         // PNG full-canvas pré-posicionado
  z: number;               // z-index global (menor = mais atrás)
}

interface ItemDef {
  id: string;              // único e estável, ex.: "vm_arma_cajado"
  nome: string;            // rótulo exibido no app
  categoria: Categoria;
  classe: Classe;
  animal?: Animal;         // item específico deste animal; ausente = placeholder genérico
  grupo: GrupoDesbloqueio; // define por qual código é liberado
  camadas?: CamadaItem[];  // camadas reais (uma peça pode ter várias: ex. capa frente+atrás)
  cor?: string;            // cor do placeholder enquanto não há arte
}
```

> **Z-index padrão por tipo** (`Z_POR_TIPO` em `src/lib/tipos.ts`): capa 10, corpo (base) 20, calçado 30, calça 40, camisa 50, arma 70, acessório 75, chapéu 80. A frente da capa usa z60, informado no nome do arquivo. O app coleta a base + as camadas dos itens escolhidos e **desenha tudo ordenado por z**. Uma peça com partes na frente e atrás do corpo (capa) tem duas camadas com z diferentes.

> **Base (corpo) por animal:** `BASES_POR_ANIMAL[animal]` → PNG do corpo (desenhado em z=20). Hoje só o Veado tem base real; os demais usam a silhueta placeholder.

### Cenários (fundos)

Os cenários são uma categoria à parte (não pertencem a uma classe) e cada um carrega o **tema** que define a moldura dia/noite da carta:

```ts
interface CenarioDef {
  id: string;
  nome: string;
  arquivo: string;            // /public/assets/cenarios/...
  tema: 'claro' | 'escuro';   // claro → moldura "dia" · escuro → moldura "noite"
  grupo: GrupoDesbloqueio;    // dia1..dia4 — cada dia libera 1 cenário
}
```

> **3 cenários no total, liberados 1 por dia** — o mesmo código do dia libera os itens **e** o cenário daquele dia.

Exemplo:

```ts
export const ITENS: ItemDef[] = [
  {
    id: 'arma_mago_cajado-cristal',
    nome: 'Cajado de Cristal',
    categoria: 'arma',
    classe: 'mago',
    grupo: 'dia2',
    arquivo: '/assets/itens/mago/arma_mago_cajado-cristal.png',
  },
  // ...
];
```

> A planilha de itens da ilustradora (nome, classe, categoria, dia de desbloqueio) é convertida diretamente neste manifesto.

## Estado do personagem

O que é guardado por participante:

```ts
interface EstadoPersonagem {
  versao: number;                 // versão do formato do save (para migração)
  animal: Animal | null;
  classe: Classe | null;
  cenario: string | null;         // fundo escolhido; define o tema dia/noite
  selecao: Record<Categoria, string | null>; // item escolhido por tipo (id ou null)
  ficha: {
    nomePersonagem: string;       // aparece na carta (fonte Adam Script)
    titulo?: string;              // epíteto/título — aparece na carta, abaixo do nome
    // status NÃO fica no estado: é CALCULADO de animal+classe (lib/status.ts)
    habilidade?: string;          // campo de "habilidade" (uso na ficha; não vai na carta)
  };
  desbloqueios: GrupoDesbloqueio[]; // grupos já liberados, ex.: ['inicial','dia1']
  enviado: boolean;                 // true após o envio final → trava o editor
  atualizadoEm: number;             // epoch ms da última mudança (last-write-wins)
}
```

- Persistido automaticamente em `localStorage` a cada mudança (cache rápido/offline).
- `inicial` está sempre desbloqueado.
- Quando `enviado === true`, o editor entra em modo somente-leitura (envio é único e definitivo).
- **Status é derivado** de `animal + classe` (`src/lib/status.ts`: base 2 + bônus de classe + bônus de raça, aditivo), **não armazenado** nem editável. Exibido na ficha e desenhado na carta.

## Conta (usuário + senha) e sincronização — ADR-015

A tela inicial pede **criar conta / entrar** (usuário + senha). A conta é a identidade e a chave do progresso (cross-device).

- **Sessão (cliente):** `useSessao` guarda `{ usuario, token }` no `localStorage` (chave `picrewuai:sessao`), separado do personagem.
- **Auth:** `POST /api/auth { acao: "registrar"|"entrar", usuario, senha }`. Senha com **hash pbkdf2 + salt** no servidor; devolve um **token** estável. Validações: usuário `[a-z0-9_]{3,20}`, senha ≥ 4.
- **Salvar progresso:** a cada mudança, `POST /api/progresso { usuario, token, estado }` (debounce ~1,5 s). O servidor **valida o token** (senão 401) e grava por usuário.
- **Carregar:** ao abrir (logado), `GET /api/progresso?usuario=&token=`; se o servidor tiver `atualizadoEm` mais recente, adota (**last-write-wins**).
- **Offline:** edita a partir do `localStorage`; sincroniza quando logar/conectar.

```ts
// tabelas Supabase (produção):
// usuarios:  usuario (text, PK) · hash · salt · token · criado_em
// progresso: usuario (text, PK) · estado (jsonb) · atualizado_em (timestamptz)
```

> **Dev:** sem chaves Supabase, auth e progresso usam **mock em arquivo** (`.dev-data/usuarios`, `.dev-data/progresso`). Senhas sempre com hash, nunca em texto puro.
> **Produção:** recomendado **Supabase Auth** no lugar da auth caseira (ver ADR-015).

## Sistema de códigos de desbloqueio

- Cada **código** libera um **grupo** (`dia1`…`dia4`), igual para todos os participantes.
- Há um **código de envio** (grupo `envio`, hoje `UAI-ENVIAR`): não libera itens, só o botão **Enviar personagem**. Divulgado no último dia, para ninguém enviar antes de ver todos os itens. O código mestre também libera.
- **Títulos** (`src/lib/titulos.ts`): o participante não digita o título. Todos começam com **"Recruta"** e escolhem, na aba Ficha, entre os títulos já desbloqueados. Cada título tem um `codigo` (pode ser compartilhado entre títulos, ou ser um código do dia). Títulos bloqueados ficam escondidos (só aparece quantos faltam). O mestre libera todos. Estado: `titulos: string[]` (desbloqueados) + `ficha.titulo`.
- **Bônus dos itens** (`src/lib/bonusItens.ts`): cada item equipado soma status, chave `classe/tipo/nome` (vale para todos os animais). Status final = base 2 + classe + raça + itens, com teto `MAX_STATUS` (9, 1 dígito na carta). `npm run assets` avisa itens novos sem linha no arquivo.
- **Códigos de itens** (`src/lib/codigosItens.ts`): chave `classe/tipo/nome` → código. Vazio = o item segue o dia; preenchido = o item **só** libera com esse código (ou o mestre). Estado: `itensLiberados: string[]`.
- Cumulativo: no dia 4, com todos inseridos, 100% dos itens da classe ficam disponíveis.

### Armazenamento seguro dos códigos

Como o app é 100% cliente, o código-fonte é inspecionável. Para não deixar os códigos em texto puro (evitar que alguém abra o JS e leia todos antecipadamente), guardamos apenas o **hash** de cada código:

```ts
// codigos.ts
const HASH_POR_GRUPO: Record<GrupoDesbloqueio, string> = {
  inicial: '',                       // sempre liberado
  dia1: '<sha256 do código do dia 1>',
  dia2: '<sha256 do código do dia 2>',
  dia3: '<sha256 do código do dia 3>',
  dia4: '<sha256 do código do dia 4>',
};

async function validarCodigo(input: string): Promise<GrupoDesbloqueio | null> {
  const hash = await sha256(normalizar(input)); // normalizar: trim + maiúsculas
  const grupo = Object.entries(HASH_POR_GRUPO).find(([, h]) => h === hash)?.[0];
  return (grupo as GrupoDesbloqueio) ?? null;
}
```

> Nota de segurança honesta: hash **não** impede um atacante determinado (ele pode desbloquear editando o próprio `localStorage`). Mas as apostas são baixas — é um app de evento — e o hash já barra o compartilhamento casual do código lido no fonte. Isso está alinhado à decisão "códigos iguais para todos" (ver [09](09-decisoes.md)).

- Ao liberar um grupo (`diaN`), ficam disponíveis **todos os itens e o cenário** marcados com aquele grupo.
- Um **código mestre/staff** extra pode liberar tudo, para testes e suporte no evento.

## Código de backup (save/restore)

Permite recuperar o personagem em outro dispositivo sem backend.

- **Gerar**: serializa o `EstadoPersonagem` → JSON → compacta → codifica em Base64URL. Resultado é uma string colável.
- **Restaurar**: decodifica → valida `versao` → carrega no estado.

```ts
function gerarCodigoBackup(estado: EstadoPersonagem): string {
  const json = JSON.stringify(estado);
  return base64url(comprimir(json)); // compressão opcional para encurtar
}

function restaurarDeCodigo(codigo: string): EstadoPersonagem {
  const json = descomprimir(base64url_decode(codigo));
  const estado = JSON.parse(json);
  return migrarSeNecessario(estado); // usa 'versao' para compatibilidade
}
```

- O estado é pequeno (ids curtos), então a string de backup é curta.
- Prefixar com um marcador de versão (ex.: `UAI1.`) para validar/migrar formatos futuros.
- Opcional: mostrar como **QR Code** para facilitar transferir entre celulares.

## Envio da carta para coleta (upload)

No envio, o app **desenha nome e status na própria carta** (posições em [11](11-carta-composicao.md)) e sobe a **imagem pronta**. Um JSON de metadados é **opcional** (só para organizar o painel).

```ts
interface EnvioCarta {
  imagem: Blob;              // PNG 744 × 1039 — carta com nome e status JÁ DESENHADOS
  // metadados OPCIONAIS (apenas para filtrar/organizar no painel dos organizadores):
  meta?: {
    nomePersonagem: string;
    classe: Classe;
    animal: Animal;
    cenario: string;
    status: { vida: number; forca: number; intelecto: number; destreza: number };
    enviadoEm: string;       // ISO timestamp (gerado no cliente)
  };
}
```

- Os dados do personagem estão **queimados na imagem** — o JSON não é necessário para a carta, só conveniência.
- **Sem dados pessoais** (nome real/contato): privacidade baixa por design.
- **1 envio final por participante** (definitivo): 1 imagem por pessoa, o que mantém o armazenamento previsível.

## Migração de versão

- Todo save carrega `versao`. Se mudarmos o formato antes do evento, `migrarSeNecessario` converte saves antigos, para ninguém perder o personagem.
