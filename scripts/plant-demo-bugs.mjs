// 데모 녹화용 버그 3개를 번들에 심는 스크립트. 여러 번 실행해도 결과가 같다(멱등).
// 실행: node scripts/plant-demo-bugs.mjs        (원복: git checkout assets/)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const assetsDirectory = fileURLToPath(new URL('../assets/', import.meta.url));
const bundlePath = `${assetsDirectory}index-CD78DD9U.js`;
const stylePath = `${assetsDirectory}index-DN910HHQ.css`;

const bundleReplacements = [
  {
    name: 'A. 계약서 등록 버튼 무반응 (onClick을 빈 함수로)',
    original: 'text:"계약서 등록",icon:{name:"Plus",position:"start"},onClick:o}',
    planted: 'text:"계약서 등록",icon:{name:"Plus",position:"start"},onClick:()=>{}}',
  },
  {
    name: 'B. 컬럼 헤더 오타 (계약 금액 -> 계약 긍액)',
    original: '{name:"계약 금액",field:"amount"',
    planted: '{name:"계약 긍액",field:"amount"',
  },
];

// C. 제목 글씨만 굵고 자간이 좁아 형제 요소와 달라 보이게 한다. 원인은 일부러 모호하게 둔다.
const STYLE_MARKER = '/* demo-bug-c */';
const plantedStyle = `\n${STYLE_MARKER}\n[class*="_titleSection_1dv6w_"] p[class*="_title_1dv6w_"][class*="_size2_"][class*="_medium_"]{font-size:16px;font-weight:800;letter-spacing:-0.06em}\n`;

let bundle = readFileSync(bundlePath, 'utf8');
for (const { name, original, planted } of bundleReplacements) {
  if (bundle.includes(planted)) {
    console.log(`이미 적용됨: ${name}`);
    continue;
  }
  const occurrences = bundle.split(original).length - 1;
  if (occurrences !== 1) {
    throw new Error(`${name}: 원본 문자열이 ${occurrences}번 발견됨 (1번이어야 함)`);
  }
  bundle = bundle.replace(original, () => planted);
  console.log(`적용: ${name}`);
}
writeFileSync(bundlePath, bundle);

const style = readFileSync(stylePath, 'utf8');
if (style.includes(STYLE_MARKER)) {
  console.log('이미 적용됨: C. 제목 글씨 이상');
} else {
  writeFileSync(stylePath, style + plantedStyle);
  console.log('적용: C. 제목 글씨 이상');
}
