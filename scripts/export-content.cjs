/**
 * Exporta o conteúdo das missões (data/*.ts) para Markdown, um arquivo por fase.
 * Uso:  node scripts/export-content.cjs [pasta-de-saída]
 * Serve para revisão técnica (adestrador) e documentação — o texto sai exatamente como no app.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const ts = require('typescript');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'docs', 'conteudo'));
const BUILD = fs.mkdtempSync(path.join(os.tmpdir(), 'wolverbark-content-'));

// Transpila os arquivos de conteúdo para CommonJS (os imports de tipos somem na transpilação).
for (const file of ['mockData.ts', 'lessonBuilder.ts', 'missionsExtra.ts']) {
  const src = fs.readFileSync(path.join(ROOT, 'data', file), 'utf8');
  const { outputText } = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  fs.writeFileSync(path.join(BUILD, file.replace(/\.ts$/, '.js')), outputText);
}
const { MODULES } = require(path.join(BUILD, 'mockData.js'));

const LETTERS = ['A', 'B', 'C', 'D', 'E'];
const lines = [];
const md = (s = '') => lines.push(s);

function lessonMarkdown(lesson, n) {
  const [concept, practice, validation, victory] = lesson.steps;
  md(`### ${n}. ${lesson.title}`);
  md();
  md(`${lesson.summary} Duração: ${lesson.durationMinutes} min. Recompensa: ${lesson.xpReward} garras.`);
  md();
  md(`**Dica do Logan: ${concept.title}**`);
  md();
  md(`*Logan:* "${concept.loganSpeech}"`);
  md();
  md(concept.body);
  if (concept.whyItWorks) {
    md();
    md(`*Por que funciona:* ${concept.whyItWorks}`);
  }
  if (lesson.quiz && lesson.quiz.length) {
    md();
    md(`**Quiz (${lesson.quiz.length} perguntas, +2 garras por acerto)**`);
    md();
    lesson.quiz.forEach((q, i) => {
      md(`${i + 1}. ${q.question}`);
      q.options.forEach((o, j) => md(`    - ${LETTERS[j]}) ${o}${j === q.correctIndex ? ' **(resposta certa)**' : ''}`));
      md(`    - *Explicação:* ${q.explanation}`);
    });
  }
  md();
  const meta = [practice.targetReps ? `${practice.targetReps} repetições` : null, practice.timerSeconds ? (practice.timerSeconds < 60 ? `cronômetro de ${practice.timerSeconds} s` : `cronômetro de ${Math.round(practice.timerSeconds / 60)} min`) : null]
    .filter(Boolean)
    .join(' · ');
  md(`**Hora do treino: ${practice.title}**${meta ? ` (${meta})` : ''}`);
  md();
  md(`*Logan:* "${practice.loganSpeech}"`);
  md();
  practice.instructions.forEach((s, i) => md(`${i + 1}. ${s}`));
  if (practice.avoid && practice.avoid.length) {
    md();
    md('Evite:');
    md();
    practice.avoid.forEach((a) => md(`- ${a}`));
  }
  md();
  md(`**Relatório do treino:** ${validation.question}`);
  md();
  validation.options.forEach((o) => md(`- *${o.label}:* ${o.loganFeedback}`));
  md();
  md(`**Missão cumprida:** "${victory.loganSpeech}"${victory.nextTip ? ` Próximo treino: ${victory.nextTip}` : ''}`);
  md();
}

fs.mkdirSync(OUT, { recursive: true });
for (const module of MODULES) {
  lines.length = 0;
  md(`## Fase ${module.phase}: ${module.title}`);
  md();
  md(`${module.description} ${module.isFree ? 'Fase gratuita.' : 'Fase do WolverBark Pro.'} ${module.lessons.length} missões.`);
  md();
  module.lessons.forEach((l, i) => lessonMarkdown(l, i + 1));
  fs.writeFileSync(path.join(OUT, `fase-${module.phase}.md`), lines.join('\n').trimEnd() + '\n');
}
fs.rmSync(BUILD, { recursive: true, force: true });
console.log(`Conteúdo exportado em ${OUT} (${MODULES.length} fases, ${MODULES.reduce((s, m) => s + m.lessons.length, 0)} missões)`);
