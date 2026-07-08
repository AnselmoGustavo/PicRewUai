# 05 — Modelo de Dados, Códigos e Save

## Manifesto de itens (fonte da verdade)

Um único arquivo TypeScript/JSON descreve todos os itens. Todas as telas, filtros e o sistema de códigos leem dele.

```ts
type Categoria = 'vestimenta' | 'arma' | 'cabeca' | 'acessorio1' | 'acessorio2';
type Classe = 'guerreiro' | 'arqueiro' | 'mago' | 'bardo' | 'ninja';
type Animal = 'sapo' | 'macaco' | 'raposa' | 'gato' | 'veado' | 'carpa' | 'coruja' | 'cachorro';

// Grupo de desbloqueio: itens iniciais + um grupo por dia do evento
type GrupoDesbloqueio = 'inicial' | 'dia1' | 'dia2' | 'dia3' | 'dia4';

interface ItemDef {
  id: string;              // único e estável, ex.: "arma_mago_cajado-cristal"
  nome: string;            // rótulo exibido no app
  categoria: Categoria;
  classe: Classe;
  grupo: GrupoDesbloqueio; // define por qual código é liberado
  arquivo: string;         // caminho em /public/assets/...
  zIndex?: number;         // opcional: sobrescreve a ordem padrão da categoria
}
```

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

> **3 a 4 cenários no total, liberados 1 por dia** — o mesmo código do dia libera os itens **e** o cenário daquele dia.

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
  selecao: {                      // item escolhido por categoria (id ou null)
    vestimenta: string | null;
    arma: string | null;
    cabeca: string | null;
    acessorio1: string | null;
    acessorio2: string | null;
  };
  ficha: {
    nomePersonagem: string;       // aparece na carta (fonte Adam Script)
    status: {                     // 4 valores que aparecem na carta
      vida: number;
      forca: number;
      intelecto: number;
      velocidade: number;
    };
    habilidade?: string;          // campo de "habilidade" (uso na ficha; não vai na carta)
  };
  desbloqueios: GrupoDesbloqueio[]; // grupos já liberados, ex.: ['inicial','dia1']
  enviado: boolean;                 // true após o envio final → trava o editor
}
```

- Persistido automaticamente em `localStorage` a cada mudança.
- `inicial` está sempre desbloqueado.
- Quando `enviado === true`, o editor entra em modo somente-leitura (envio é único e definitivo).

## Sistema de códigos de desbloqueio

- Cada **código** libera um **grupo** (`dia1`…`dia4`), igual para todos os participantes.
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
    status: { vida: number; forca: number; intelecto: number; velocidade: number };
    enviadoEm: string;       // ISO timestamp (gerado no cliente)
  };
}
```

- Os dados do personagem estão **queimados na imagem** — o JSON não é necessário para a carta, só conveniência.
- **Sem dados pessoais** (nome real/contato): privacidade baixa por design.
- **1 envio final por participante** (definitivo): 1 imagem por pessoa, o que mantém o armazenamento previsível.

## Migração de versão

- Todo save carrega `versao`. Se mudarmos o formato antes do evento, `migrarSeNecessario` converte saves antigos, para ninguém perder o personagem.
