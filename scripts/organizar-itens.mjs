// Move peças de "Assets Prontos/itens/itens-para-formatacao/<Animal> - <Classe>/" (com subpastas)
// para as pastas de tipo, já com o nome na convenção (animal-classe-tipo-nome-dia[-zNN].png).
//
// Como cada arquivo é reconhecido:
//  - corpo base: "<animal>-<classe>.png" ou "<animal>_<classe>.png" → personages-pelados/<animal>/
//  - acessórios avulsos (bandana, óculos...): tabela AVULSOS, por nome completo
//  - roupa/arma das skins (padrão "animal-classe-[adv|basico|tipo]-peça-dia"): a ÚLTIMA parte
//    antes do dia é a peça, traduzida pela tabela PECAS (blusa → camisa, short → calça...)
// Arquivo que já existe idêntico no destino é duplicata (removido); diferente → pendência.
//
// Uso:
//   npm run organizar               -> só mostra o que faria
//   npm run organizar -- --mover    -> move de fato
import {
  readdirSync, renameSync, rmdirSync, existsSync, mkdirSync, readFileSync, unlinkSync, statSync,
} from "node:fs";
import { join, relative } from "node:path";
import { createHash } from "node:crypto";

const ITENS = "Assets Prontos/itens";
const PELADOS = "Assets Prontos/personages-pelados";
const ENTRADA = join(ITENS, "itens-para-formatacao");
const DIA_PADRAO = "inicial"; // para peças que não trazem o dia no nome
const ANIMAIS = ["macaco", "raposa", "gato", "veado", "cachorro"];
const CLASSES = ["guerreiro", "arqueiro", "mago", "bardo", "ninja"];
const TIPOS = new Set(["camisa", "calca", "arma", "escudo", "calcado", "capa", "chapeu", "acessorio"]);

// acessórios avulsos (nome completo, já normalizado) -> [tipo, nome]
const AVULSOS = {
  "bandana": ["chapeu", "bandana"],
  "cabeca godzilla": ["chapeu", "cabeca_godzilla"],
  "cabeca godzila": ["chapeu", "cabeca_godzilla"],
  "besta twitch": ["arma", "besta_twich"],
  "cachecol": ["acessorio", "cachecol"],
  "chapeu luffy": ["chapeu", "chapeu_luffy"],
  "chapeu maquinista": ["chapeu", "chapeu_maquinista"],
  "girassol": ["acessorio", "girassol"],
  "laco": ["acessorio", "laco"],
  "leques katana": ["arma", "leques_katana"],
  "oculos de grau": ["acessorio", "oculos_de_grau"],
  "oculos grau": ["acessorio", "oculos_de_grau"],
  "oculos squirtle": ["acessorio", "oculos_squirtle"],
};

// peça das skins -> [tipo, nome, z explícito (só p/ peças de várias camadas)]
const PECAS = {
  blusa: ["camisa", "blusa"],
  tunica: ["camisa", "tunica"],
  armadura_cima: ["camisa", "armadura"],
  calca: ["calca", "calca"],
  short: ["calca", "short"],
  shorts: ["calca", "short"],
  bermuda: ["calca", "bermuda"],
  armadura_calca: ["calca", "armadura"],
  botas: ["calcado", "botas"],
  sapatos: ["calcado", "sapatos"],
  sapato: ["calcado", "sapatos"],
  sandalia: ["calcado", "sapatos"], // mesma peça que "sapatos" no bardo
  capa: ["capa", "capa"],
  capa_cima: ["capa", "capa", 60],
  capa_baixo: ["capa", "capa", 10],
  chapeu: ["chapeu", "chapeu"],
};
const ARMA = /^(arco|espada|cajado|varinha|katana|alaude|viola|violino|leque|machado|vassoura|guitarra)/;

// Formato "tipo nome" (ex.: "acessorio pokebola Mescladas.PNG", "arma besta twich"):
// o tipo vem na frente. Dia = DIA_PADRAO.
const PREFIXO_TIPO = /^(acessorio|arma|escudo|chapeu|camisa|calca|calcado|capa) (.+)$/;

// Tipo FIXO de peças que já vieram com etiquetas diferentes entre animais — mantém a mesma
// peça no mesmo tipo em todos (o bônus e o código do item dependem disso).
const TIPO_FIXO = {
  megaman: "arma",
  cabeca_godzilla: "chapeu",
  key_blade: "arma",
  escudo_link: "escudo", // escudo é tipo próprio (o guerreiro usa arma + escudo)
};

const semAcento = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
const normalizar = (arq) =>
  semAcento(arq.replace(/\.png$/i, "").toLowerCase())
    .replace(/\bmescladas?\b/g, "")
    .replace(/\b20\d\d\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
const hash = (f) => createHash("sha1").update(readFileSync(f)).digest("hex");
const walk = (d) =>
  readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

/** Decide o destino de um arquivo. Retorna {destino, tipo} ou {erro}. */
function classificar(arq, animal, classe) {
  const n = normalizar(arq);
  // corpo: "veado-mago", "veado_mago", "Veado - Mago"...
  if (n.replace(/\s*-\s*/g, "-").replace(/[_ ]/g, "-") === `${animal}-${classe}`) {
    return { tipo: "corpo", destino: join(PELADOS, animal, `${animal}-${classe}.png`) };
  }
  if (AVULSOS[n]) {
    const [tipo, nome] = AVULSOS[n];
    return { tipo, destino: join(ITENS, tipo, `${animal}-${classe}-${tipo}-${nome}-${DIA_PADRAO}.png`) };
  }
  const pre = PREFIXO_TIPO.exec(n);
  if (pre) {
    const resto = pre[2].trim();
    const nome = AVULSOS[resto]?.[1] ?? resto.replace(/[\s-]+/g, "_");
    const tipo = TIPO_FIXO[nome] ?? pre[1];
    const aviso = tipo !== pre[1] ? `veio como "${pre[1]}", usei "${tipo}" (TIPO_FIXO)` : undefined;
    return { tipo, aviso, destino: join(ITENS, tipo, `${animal}-${classe}-${tipo}-${nome}-${DIA_PADRAO}.png`) };
  }
  const dia = (n.match(/[-_](inicial|dia\d)$/) || [])[1];
  if (!dia) return { erro: "sem dia no nome e não é acessório conhecido" };
  const partes = n.replace(/[-_](inicial|dia\d)$/, "").split("-");
  const peca = partes[partes.length - 1];
  let def = PECAS[peca];
  // Capa em duas partes: "capa_atras_dark" (z10, atrás do corpo) + "capa_frente_dark" (z60, por cima)
  // -> mesma peça "capa_dark" com duas camadas. Também aceita cima/baixo.
  const capa = /^capa_(atras|frente|cima|baixo)(?:_(.+))?$/.exec(peca);
  if (!def && capa) {
    const z = capa[1] === "atras" || capa[1] === "baixo" ? 10 : 60;
    def = ["capa", capa[2] ? `capa_${capa[2]}` : "capa", z];
  }
  // Nome já na convenção "animal-classe-TIPO-nome-dia" (ex.: "gato-arqueiro-calcado-botas_dark-dia3"):
  // usa o tipo e o nome que vieram. "vestimenta" (tipo antigo) vira calça ou camisa pelo nome.
  // "_cima"/"_baixo" = parte de cima/baixo da roupa (não é camada) -> sai do nome.
  if (!def && partes.length === 4) {
    const tipoNome = partes[2];
    let tipo = TIPOS.has(tipoNome) ? tipoNome : null;
    let nome = peca;
    if (tipoNome === "vestimenta") {
      if (/^(calca|short|bermuda|saia)/.test(peca)) tipo = "calca"; // "calca_dark", "short", "saia_babados_dark"...
      else if (/_calca(?=_|$)/.test(peca)) {
        // "armadura_calca_dark" = a parte de calça da armadura -> calça "armadura_dark"
        tipo = "calca";
        nome = peca.replace(/_calca(?=_|$)/, "");
      } else tipo = "camisa";
    }
    if (tipo) {
      if (tipo === "camisa" || tipo === "calca") nome = nome.replace(/_(cima|baixo)(?=_|$)/g, "");
      def = [tipo, nome];
    }
  }
  // tipo grudado no nome, sem o campo de tipo: "veado-mago-chapeu_dark-dia3" -> chapéu "chapeu_dark"
  const grudado = /^(chapeu|calcado|escudo|acessorio)_/.exec(peca);
  if (!def && grudado) def = [grudado[1], peca];
  if (!def && ARMA.test(peca)) def = ["arma", peca];
  if (!def) return { erro: `peça "${peca}" sem tipo conhecido` };
  const [tipo, nome, zPeca] = def;
  // capa de UMA camada do guerreiro e do ninja (capa vermelha, ombreiras) fica POR CIMA da roupa,
  // não atrás do corpo (z padrão da capa = 10)
  const z = zPeca ?? (tipo === "capa" && (classe === "guerreiro" || classe === "ninja") ? 60 : undefined);
  const sufixoZ = z ? `-z${z}` : "";
  return { tipo, destino: join(ITENS, tipo, `${animal}-${classe}-${tipo}-${nome}-${dia}${sufixoZ}.png`) };
}

const mover = process.argv.includes("--mover");
if (!existsSync(ENTRADA)) {
  console.log(`Pasta ${ENTRADA} não existe.`);
  process.exit(0);
}

let pendencias = 0;
for (const pasta of readdirSync(ENTRADA)) {
  const dir = join(ENTRADA, pasta);
  if (!statSync(dir).isDirectory()) {
    console.log(`?? fora de uma pasta "<Animal> - <Classe>": ${pasta}`);
    pendencias++;
    continue;
  }
  // Animal/classe vêm da pasta "<Animal> - <Classe>"; se a pasta tiver outro nome
  // (ex.: "Arqueiro - Dark"), vêm do começo do nome de cada arquivo ("gato-arqueiro-...").
  const m = /^\s*(\S+)\s*-\s*(\S+)\s*$/.exec(pasta);
  const animalPasta = m && semAcento(m[1].toLowerCase());
  const classePasta = m && semAcento(m[2].toLowerCase());
  const pastaValida = ANIMAIS.includes(animalPasta) && CLASSES.includes(classePasta);
  console.log(pastaValida ? `\n== ${animalPasta}-${classePasta} ==` : `\n== pasta "${pasta}" (animal/classe pelo nome de cada arquivo) ==`);

  for (const origem of walk(dir).sort()) {
    const rel = relative(dir, origem);
    const arq = origem.split(/[\\/]/).pop();
    if (!/\.png$/i.test(arq)) {
      console.log(`  -- ignorado (não é PNG): ${rel}`);
      if (mover) unlinkSync(origem);
      continue;
    }
    const doNome = new RegExp(`^(${ANIMAIS.join("|")})[-_ ](${CLASSES.join("|")})(?![a-z])`).exec(normalizar(arq));
    const animal = doNome?.[1] ?? (pastaValida ? animalPasta : null);
    const classe = doNome?.[2] ?? (pastaValida ? classePasta : null);
    if (!animal || !classe) {
      console.log(`  ?? ${rel}: não sei o animal/classe (nem pela pasta, nem pelo nome do arquivo)`);
      pendencias++;
      continue;
    }
    const r = classificar(arq, animal, classe);
    if (r.erro) {
      console.log(`  ?? ${rel}: ${r.erro}`);
      pendencias++;
      continue;
    }
    // Mesmo nome de peça em OUTRO dia (ex.: "blusa" dia2 x "blusa" dia3) dividiria bônus/código
    // (a chave é classe/tipo/nome) e apareceria duplicado no app -> barra e pede outro nome.
    const [, , tipoD, nomeD, diaD] = r.destino.split(/[\\/]/).pop().replace(/\.png$/, "").split("-");
    if (r.tipo !== "corpo") {
      const outroDia = readdirSync(join(ITENS, tipoD)).find((f) => {
        const p = f.replace(/\.png$/, "").split("-");
        return p[0] === animal && p[1] === classe && p[3] === nomeD && p[4] !== diaD;
      });
      if (outroDia) {
        console.log(`  ?? ${rel}: o nome "${nomeD}" já é usado por ${outroDia} (outro dia) — renomeie (ex.: "${nomeD}_dark")`);
        pendencias++;
        continue;
      }
    }
    if (existsSync(r.destino)) {
      if (hash(r.destino) === hash(origem)) {
        console.log(`  =  ${rel}  (já existe idêntico em ${r.destino}${mover ? ", removido daqui" : ""})`);
        if (mover) unlinkSync(origem);
      } else {
        console.log(`  !! ${rel}: ${r.destino} já existe e é DIFERENTE — não sobrescrevi`);
        pendencias++;
      }
      continue;
    }
    console.log(`  ${rel}  ->  ${r.destino}${r.aviso ? `   (${r.aviso})` : ""}`);
    if (mover) {
      mkdirSync(join(r.destino, ".."), { recursive: true });
      renameSync(origem, r.destino);
    }
  }
}

// remove pastas que ficaram vazias (de dentro para fora)
if (mover) {
  const pastas = [];
  const coletar = (d) => {
    for (const f of readdirSync(d)) {
      const p = join(d, f);
      if (statSync(p).isDirectory()) { coletar(p); pastas.push(p); }
    }
  };
  coletar(ENTRADA);
  for (const p of pastas) {
    try {
      if (readdirSync(p).length === 0) rmdirSync(p);
    } catch {
      console.log(`  (pasta "${relative(ENTRADA, p)}" ficou vazia, mas está aberta em algum terminal/Explorer — apague depois)`);
    }
  }
}

console.log(mover ? "\nmovido." : "\n(simulação — rode com --mover para mover)");
if (pendencias) console.log(`${pendencias} pendência(s) acima.`);
