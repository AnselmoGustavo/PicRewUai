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
  selecao: {                      // item escolhido por categoria (id ou null)
    vestimenta: string | null;
    arma: string | null;
    cabeca: string | null;
    acessorio1: string | null;
    acessorio2: string | null;
  };
  ficha: {
    nome: string;
    titulo?: string;
    bio?: string;
    // outros campos a definir
  };
  desbloqueios: GrupoDesbloqueio[]; // grupos já liberados, ex.: ['inicial','dia1']
}
```

- Persistido automaticamente em `localStorage` a cada mudança.
- `inicial` está sempre desbloqueado.

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

## Migração de versão

- Todo save carrega `versao`. Se mudarmos o formato antes do evento, `migrarSeNecessario` converte saves antigos, para ninguém perder o personagem.
