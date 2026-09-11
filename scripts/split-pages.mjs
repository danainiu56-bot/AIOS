import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');
const sourcePath = path.join(root, 'app-shell.html');
const pagesDir = path.join(root, 'pages');
const source = fs.readFileSync(sourcePath, 'utf8');

const definitions = [
  { file: '1-Dashboard.html', page: 'dash', title: 'Dashboard', blocks: ['isDash'] },
  { file: '2-My-Tasks.html', page: 'tasks', title: 'My Tasks', blocks: ['isTasks'] },
  { file: '3-Products.html', page: 'products', title: 'Products', blocks: ['isProducts', 'isProductDetail'] },
  { file: '4-Campaigns.html', page: 'campaigns', title: 'Campaigns', blocks: ['isNewCampaign', 'isCampaigns', 'isCampaign'] },
  { file: '5-Strategy-Studio.html', page: 'strategy', title: 'Strategy Studio', blocks: ['isStrategy'] },
  { file: '6-Brief-Studio.html', page: 'brief', title: 'Brief Studio', blocks: ['isBrief'] },
  { file: '7-Influencer-CRM.html', page: 'creators', title: 'Influencer CRM', blocks: ['isCreators', 'isContact', 'isCreatorProfile'] },
  { file: '8-Sample-Mgt.html', page: 'samples', title: 'Sample Mgt', blocks: ['isSamples'] },
  { file: '9-Asset-Library.html', page: 'assets', title: 'Asset Library', blocks: ['isAssetDetail', 'isAssets'] },
  { file: '10-Budget-Mgt.html', page: 'finance', title: 'Budget Mgt', blocks: ['isFinance'] },
  { file: '11-Reports.html', page: 'reports', title: 'Reports', blocks: ['isReports'] },
  { file: '12-Contract-Mgt.html', page: 'contracts', title: 'Contract Mgt', blocks: ['isContracts'] },
  { file: '13-Settings.html', page: 'settings', title: 'Settings', blocks: ['isSettings'] }
];

const sections = [
  ['isDash', '<!-- ══ DASHBOARD ══ -->'],
  ['isTasks', '<!-- ══ MY TASKS ══ -->'],
  ['isProducts', '<!-- ══ PRODUCTS LIST ══ -->'],
  ['isProductDetail', '<!-- ══ PRODUCT DETAIL ══ -->'],
  ['isStrategy', '<!-- ══ STRATEGY ══ -->'],
  ['isBrief', '<!-- ══ BRIEF STUDIO ══ -->'],
  ['isCreators', '<!-- ══ CREATORS ══ -->'],
  ['isFinance', '<!-- ══ FINANCE ══ -->'],
  ['isContracts', '<!-- ══ CONTRACT MGT ══ -->'],
  ['isSamples', '<!-- ══ SAMPLE MGT ══ -->'],
  ['isContact', '<!-- ══ CONTACT CREATOR ══ -->'],
  ['isCreatorProfile', '<!-- ══ CREATOR PROFILE ══ -->'],
  ['isNewCampaign', '<!-- ══ NEW CAMPAIGN ══ -->'],
  ['isCampaigns', '<!-- ══ CAMPAIGNS LIST ══ -->'],
  ['isAssetDetail', '<!-- ══ ASSET DETAIL ══ -->'],
  ['isCampaign', '<!-- ══ CAMPAIGN DETAIL ══ -->'],
  ['isAssets', '<!-- ══ ASSETS ══ -->'],
  ['isReports', '<!-- ══ REPORTS ══ -->'],
  ['isSettings', '<!-- ══ SETTINGS ══ -->']
];

const commonSuffixMarker = '\n    </div>\n  </main>\n\n  <sc-if value="{{ copilotClosed }}"';
const commonSuffixStart = source.indexOf(commonSuffixMarker);
if (commonSuffixStart < 0) throw new Error('Unable to locate the shared page suffix.');

const sectionRanges = sections.map(([name, marker], index) => {
  const start = source.indexOf(marker);
  const nextMarker = sections[index + 1]?.[1];
  const end = nextMarker ? source.indexOf(nextMarker) : commonSuffixStart;
  if (start < 0 || end < 0) throw new Error(`Unable to locate section: ${name}`);
  return { name, start, end };
});

const commonPrefix = source.slice(0, sectionRanges[0].start);
const commonSuffix = source.slice(commonSuffixStart);
const scriptOpen = source.indexOf('<script type="text/x-dc" data-dc-script');
const scriptBodyStart = source.indexOf('>', scriptOpen) + 1;
const scriptEnd = source.indexOf('</script>', scriptBodyStart);
if (scriptOpen < 0 || scriptBodyStart < 1 || scriptEnd < 0) {
  throw new Error('Unable to locate the shared DC logic script.');
}

const logic = source.slice(scriptBodyStart, scriptEnd);
const logicLoader = `// Shared application logic used by every menu page.\n(() => {\n  const script = document.querySelector('script[data-dc-script]');\n  if (!script) throw new Error('Missing data-dc-script host');\n  script.textContent = ${JSON.stringify(logic)};\n})();\n`;
fs.writeFileSync(path.join(root, 'app-logic.js'), logicLoader);

fs.mkdirSync(pagesDir, { recursive: true });

for (const definition of definitions) {
  const keep = new Set(definition.blocks);
  let html = commonPrefix
    + sectionRanges.filter((range) => keep.has(range.name)).map((range) => source.slice(range.start, range.end)).join('')
    + commonSuffix;

  const open = html.indexOf('<script type="text/x-dc" data-dc-script');
  const bodyStart = html.indexOf('>', open) + 1;
  const end = html.indexOf('</script>', bodyStart);
  html = html.slice(0, bodyStart)
    + '\n'
    + html.slice(end, end + '</script>'.length)
    + '\n<script src="../app-logic.js"></script>'
    + html.slice(end + '</script>'.length);

  html = html
    .replace(
      '<script src="./support.js"></script>',
      `<script>window.AIOS_PAGE = ${JSON.stringify(definition.page)};</script>\n<script src="../support.js"></script>`
    )
    .replace('<link rel="stylesheet" href="./design-system.css">', '<link rel="stylesheet" href="../design-system.css">')
    .replace('<body data-page="dash">', `<body data-page="${definition.page}">`)
    .replace(/<title>[^<]*<\/title>/, `<title>${definition.title} · Influencer Marketing AIOS</title>`);

  fs.writeFileSync(path.join(pagesDir, definition.file), html);
}

const dashboard = fs.readFileSync(path.join(pagesDir, '1-Dashboard.html'), 'utf8')
  .replace('<script>window.AIOS_PAGE = "dash";</script>\n<script src="../support.js"></script>', '<script>window.AIOS_PAGE = "dash"; window.AIOS_ROUTE_PREFIX = "pages/";</script>\n<script src="./support.js"></script>')
  .replace('<link rel="stylesheet" href="../design-system.css">', '<link rel="stylesheet" href="./design-system.css">')
  .replace('<script src="../app-logic.js"></script>', '<script src="./app-logic.js"></script>');
fs.writeFileSync(path.join(root, 'index.html'), dashboard);

console.log(`Generated ${definitions.length} standalone menu pages.`);
