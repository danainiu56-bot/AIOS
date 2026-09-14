(() => {
const defineAiosComponent = () => {
const SAGE = '#6E8F74', BLUE = '#2457F5', RUST = '#C4636D';

class Component extends DCLogic {
  get accent() { return this.props.accent ?? '#2457F5'; }

  componentDidMount() {
    this._ddHandler = () => {
      const keys = ['crOpen', 'alFilterOpen', 'alTagOpen', 'vaultOpen', 'vaultMenu', 'stVaultMenu', 'swVersionMenu', 'swSaveAsOpen', 'campaignStrategyMenu', 'campaignEmailContractMenuOpen', 'tkMailFilterOpen', 'contactProdOpen', 'sampleProdOpen', 'briefPickOpen', 'ncSkuOpen', 'ncGoalOpen', 'mailProdOpen', 'assetTagOpen', 'swSelOpen', 'smpFilterOpen', 'rangeOpen', 'funnelRangeOpen', 'subjScoreOpen', 'bodyScoreOpen', 'notifOpen', 'bkTagOpen', 'smOpen', 'smBulkProdOpen', 'smBulkCarrierOpen', 'arFilterOpen', 'smpRangeOpen', 'expRangeOpen', 'alRightsOpen', 'aqFilterOpen', 'assetEntryCampaignOpen'];
      const st = this.state, patch = {};
      keys.forEach(k => { const v = st[k]; if (v !== null && v !== undefined && v !== false) patch[k] = (typeof v === 'boolean') ? false : null; });
      if (Object.keys(patch).length) this.setState(patch);
    };
    document.addEventListener('click', this._ddHandler);
    this._promotedStorageHandler = (event) => {
      if (event.key !== 'aios.promotedProducts') return;
      try {
        const next = JSON.parse(event.newValue || '[]');
        if (Array.isArray(next)) this.setState({ promoted: next.filter(x => typeof x === 'string') });
      } catch (_) {}
    };
    window.addEventListener('storage', this._promotedStorageHandler);
    try {
      const savedOrders = JSON.parse(localStorage.getItem('aios.shipOrders') || 'null');
      const savedSmpStage = JSON.parse(localStorage.getItem('aios.smpStage') || '{}');
      const overlay = (savedSmpStage && typeof savedSmpStage === 'object') ? savedSmpStage : {};
      if (Array.isArray(savedOrders) && savedOrders.length) {
        this.setState({ shipOrders: savedOrders, smpStage: {} });
        try { localStorage.removeItem('aios.smpStage'); } catch (_) {}
      } else if (Object.keys(overlay).length) {
        this.setState(st => ({
          shipOrders: this._applyStageOverlay(st.shipOrders || [], overlay),
          smpStage: {}
        }));
        try { localStorage.removeItem('aios.smpStage'); } catch (_) {}
      }
    } catch (_) {}
    try {
      const savedStrategies = JSON.parse(localStorage.getItem('aios.campaignStrategyVersions') || '[]');
      const savedBriefs = JSON.parse(localStorage.getItem('aios.campaignBriefVersions') || '[]');
      const savedVersionNames = JSON.parse(localStorage.getItem('aios.strategyVersionNames') || '{}');
      const savedDeletedVersions = JSON.parse(localStorage.getItem('aios.strategyVersionDeleted') || '[]');
      if ((Array.isArray(savedStrategies) && savedStrategies.length) || (Array.isArray(savedBriefs) && savedBriefs.length) || Object.keys(savedVersionNames || {}).length || (Array.isArray(savedDeletedVersions) && savedDeletedVersions.length)) {
        this.setState(st => {
          const strategies = Array.isArray(savedStrategies) ? savedStrategies : [];
          const briefs = Array.isArray(savedBriefs) ? savedBriefs : [];
          const mergedBriefs = [...briefs, ...(st.briefVersions || []).filter(b => !briefs.some(x => x.sku === b.sku && x.platform === b.platform && x.ver === b.ver && (x.segment || '') === (b.segment || '') && (x.creator || '') === (b.creator || '')))];
          const nextLibrary = (st.library || []).map(rec => {
            const maxSaved = strategies.filter(x => x.sku === rec.sku).reduce((m, x) => Math.max(m, Number(x.ver) || 0), 0);
            const latestSaved = strategies.find(x => x.sku === rec.sku && x.ver === maxSaved);
            return maxSaved > rec.ver ? { ...rec, ver: maxSaved, date: latestSaved?.date || rec.date, mode: latestSaved?.mode || rec.mode, sections: Array.isArray(latestSaved?.sections) && latestSaved.sections.length ? latestSaved.sections.length : rec.sections, confirmed: latestSaved?.confirmed || 0, status: 'draft' } : rec;
          });
          strategies.forEach(x => {
            if (nextLibrary.some(r => r.sku === x.sku)) return;
            nextLibrary.push({ sku: x.sku, name: x.product || x.title, brand: x.brand || '—', owner: x.owner || 'Helen', date: x.date, mode: x.mode || 'standard', ver: x.ver, status: 'draft', sections: Array.isArray(x.sections) && x.sections.length ? x.sections.length : 15, confirmed: x.confirmed || 0 });
          });
          return { campaignStrategyVersions: strategies, briefVersions: mergedBriefs, library: nextLibrary, strategyVersionNames: savedVersionNames && typeof savedVersionNames === 'object' ? savedVersionNames : {}, strategyVersionDeleted: Array.isArray(savedDeletedVersions) ? savedDeletedVersions : [] };
        });
      }
    } catch (_) {}
    try {
      const savedCtmCustom = JSON.parse(localStorage.getItem('aios.ctmCustom') || '[]');
      const savedCtmRemoved = JSON.parse(localStorage.getItem('aios.ctmRemoved') || '[]');
      const patch = {};
      if (Array.isArray(savedCtmCustom) && savedCtmCustom.length) patch.ctmCustom = savedCtmCustom;
      if (Array.isArray(savedCtmRemoved) && savedCtmRemoved.length) patch.ctmRemoved = savedCtmRemoved;
      if (Object.keys(patch).length) this.setState(patch);
    } catch (_) {}
    this._productDrawerKeyHandler = (event) => {
      if (event.key === 'Escape' && this.state.productDrawerOpen) this.setState({ productDrawerOpen: false });
      if (event.key === 'Escape' && this.state.sw && this.state.sw.drawer) this.setState(st => ({ sw: { ...st.sw, drawer: false } }));
      if (event.key === 'Escape' && this.state.swVersionManagerOpen) this.setState({ swVersionManagerOpen: false, swVersionRenameKey: '', swVersionDeleteKey: '' });
      if (event.key === 'Escape' && this.state.ctmNewOpen) this.setState({ ctmNewOpen: false, ctmNew: { deal: '付费合作', name: '', nameZh: '', ver: 'v1', seed: '', lang: 'en', en: '', zh: '', error: '' } });
      if (event.key === 'Escape' && this.state.ctmDeleteId) this.setState({ ctmDeleteId: null });
    };
    document.addEventListener('keydown', this._productDrawerKeyHandler);
    const directStrategyParams = new URLSearchParams(window.location.search);
    const directStrategySku = directStrategyParams.get('sku');
    if (window.AIOS_PAGE === 'strategy' && directStrategyParams.get('edit') === '1' && directStrategySku) {
      this.switchSku(directStrategySku);
      this.setState(st => ({
        stTab: 'work', benchOpen: true, docMode: false, spPanel: null,
        sw: { ...st.sw, step: 1, generated: true, editing: null }
      }));
    }
    if (window.AIOS_PAGE === 'brief' && directStrategyParams.get('edit') === '1' && directStrategySku) {
      const platform = directStrategyParams.get('platform') || 'TikTok';
      const mode = directStrategyParams.get('mode') || 'channel';
      const ver = directStrategyParams.get('ver') || '';
      const creator = directStrategyParams.get('creator') || '';
      const creatorStyle = directStrategyParams.get('style') || '';
      this.setState(st => {
        const existingBrief = (st.briefVersions || []).find(x => x.sku === directStrategySku);
        const hasProduct = (st.briefFromStrategy || []).some(x => x.sku === directStrategySku);
        return {
          briefView: 'editor', briefId: 'brf-' + directStrategySku, platform,
          briefEditorTab: mode === 'creator' || mode === 'style' ? 'creator' : 'channel',
          briefMode: mode, briefCreator: creator, briefCreatorStyle: creatorStyle,
          viewedVersion: ver ? directStrategySku + '|' + platform + '|' + mode + '|' + ver : null,
          briefStudioNewKeys: [],
          briefStudioExistingKeys: (st.briefVersions || []).filter(x => x.sku === directStrategySku).map(x => directStrategySku + '|' + x.platform + '|' + (x.mode || 'channel') + '|' + x.ver),
          briefFromStrategy: hasProduct ? st.briefFromStrategy : [{ sku: directStrategySku, name: existingBrief ? existingBrief.name : directStrategySku, platform }, ...(st.briefFromStrategy || [])]
        };
      });
    }
    if (window.AIOS_PAGE === 'assets' && directStrategyParams.get('entry') === '1') {
      const entryCampaign = directStrategyParams.get('campaign') || '';
      const entryProduct = directStrategyParams.get('product') || '';
      const entrySku = directStrategyParams.get('sku') || '';
      const entryHandle = directStrategyParams.get('handle') || '';
      const entryChannel = directStrategyParams.get('channel') || 'TikTok';
      this.setState({
        alTab: 'lib', assetEntryOpen: true, assetEntryCampaignOpen: false,
        assetEntryCampaign: entryCampaign, assetEntryNotice: '', alRightsOpen: false,
        alForm: {
          handle: entryHandle, channel: entryChannel, post: '2026-09-07',
          campaign: entryCampaign, product: entryProduct, sku: entrySku,
          brand: String(entryProduct || '').split(' ')[0]
        }
      });
    }
    if (window.AIOS_PAGE === 'samples') {
      const sampleHandle = directStrategyParams.get('handle') || '';
      const sampleProduct = directStrategyParams.get('product') || '';
      const sampleSku = directStrategyParams.get('sku') || '';
      const sampleCampaign = directStrategyParams.get('campaign') || '';
      if (directStrategyParams.get('create') === '1') {
        this.setState({
          smTab: 'new', smMode: 'single', smSaved: false, smOpen: null,
          smForm: { handle: sampleHandle, product: sampleProduct, sku: sampleSku, campaign: sampleCampaign, qty: '1' }
        });
      } else if (sampleHandle) {
        this.setState({ smTab: 'progress', smpQuery: sampleHandle });
      }
    }
  }

  componentDidUpdate() {
    try {
      localStorage.setItem('aios.promotedProducts', JSON.stringify(this.state.promoted || []));
      localStorage.setItem('aios.campaignStrategyVersions', JSON.stringify(this.state.campaignStrategyVersions || []));
      localStorage.setItem('aios.campaignBriefVersions', JSON.stringify((this.state.briefVersions || []).filter(x => x.mode === 'segment' || x.mode === 'creator' || x.mode === 'style' || x.origin === 'brief-studio-generated')));
      localStorage.setItem('aios.strategyVersionNames', JSON.stringify(this.state.strategyVersionNames || {}));
      localStorage.setItem('aios.strategyVersionDeleted', JSON.stringify(this.state.strategyVersionDeleted || []));
      localStorage.setItem('aios.shipOrders', JSON.stringify(this.state.shipOrders || []));
      localStorage.setItem('aios.ctmCustom', JSON.stringify(this.state.ctmCustom || []));
      localStorage.setItem('aios.ctmRemoved', JSON.stringify(this.state.ctmRemoved || []));
    } catch (_) {}
  }

  componentWillUnmount() {
    if (this._ddHandler) document.removeEventListener('click', this._ddHandler);
    if (this._promotedStorageHandler) window.removeEventListener('storage', this._promotedStorageHandler);
    if (this._productDrawerKeyHandler) document.removeEventListener('keydown', this._productDrawerKeyHandler);
  }
  state = {
    page: window.AIOS_PAGE || new URLSearchParams(window.location.search).get('page') || 'dash',
    navCollapsed: false,
    period: 'quarter',
    pipeAiOpen: false,
    rangeOpen: false,
    rangeStart: '2026-08-01',
    rangeEnd: '2026-08-20',
    skuQuery: '',
    productPromotionFilter: 'all',
    detailSku: 'RYZ-SC-01',
    promoted: (() => {
      try {
        const saved = JSON.parse(localStorage.getItem('aios.promotedProducts') || '[]');
        return Array.isArray(saved) ? saved.filter(x => typeof x === 'string') : [];
      } catch (_) { return []; }
    })(),
    generated: [],
    library: [
      { sku: 'AURA-LP-01', name: 'Aura 落地氛围灯', brand: 'Aura', owner: '苏敏', date: '2026-08-26', mode: 'standard', ver: 3, status: 'draft', sections: 15, confirmed: 6 },
      { sku: 'RYZ-SC-01', name: 'Ryze 头皮按摩仪', brand: 'Ryze', owner: '陈曦', date: '2026-07-28', mode: 'standard', ver: 3, status: 'formal', sections: 15, confirmed: 15 },
      { sku: 'LUM-AR-02', name: 'Lumo 便携香氛机', brand: 'Lumo', owner: '林浩', date: '2026-07-12', mode: 'quick', ver: 2, status: 'draft', sections: 8, confirmed: 5 },
      { sku: 'NUV-SP-07', name: 'Nuvia 口服胶囊', brand: 'Nuvia', owner: '林浩', date: '2026-06-30', mode: 'standard', ver: 1, status: 'hold', sections: 15, confirmed: 3 }
    ],
    strategySku: 'RYZ-SC-01',
    stTab: 'work',
    swVersionMenu: false,
    swSaveAsOpen: false,
    swSaveAsDraft: '',
    swVersionManagerOpen: false,
    swVersionRenameKey: '',
    swVersionRenameDraft: '',
    swVersionDeleteKey: '',
    swVersionNotice: '',
    strategyVersionNames: {},
    strategyVersionDeleted: [],
    swStore: {},
    sw: {
      step: 10, mode: 'standard', fieldState: {}, locked: [], regen: {},
      confirmed: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      edits: {}, editing: null, draft: '', verBase: 3, loadedStatus: 'formal', generated: true,
      fieldEdits: {}, fieldEditing: null, fieldDraft: '',
      activeSection: 1, drawer: false, urlDraft: '',
      savedAt: '刚刚',
      sources: [
        { code: 'SRC-001', name: '品牌手册 2026.pdf', module: 1, status: 'parsed' },
        { code: 'SRC-002', name: '产品参数表.xlsx', module: 1, status: 'parsed' },
        { code: 'SRC-003', name: '合规审核意见_US.docx', module: 2, status: 'parsed' },
        { code: 'SRC-004', name: 'Amazon Review 导出.csv', module: 3, status: 'parsed' },
        { code: 'SRC-005', name: 'Q2 复盘报告.pdf', module: 8, status: 'parsed' },
        { code: 'SRC-006', name: '红人名单_Q3.xlsx', module: 6, status: 'partial' }
      ]
    },
    heroPeriod: 'quarter',
    staffPeriod: 'quarter',
    cbPeriod: 'month',
    hCards: {
      0: { period: 'quarter', start: '2026-08-01', end: '2026-08-20', open: false },
      1: { period: 'quarter', start: '2026-08-01', end: '2026-08-20', open: false },
      2: { period: 'quarter', start: '2026-08-01', end: '2026-08-20', open: false },
      3: { period: 'quarter', start: '2026-08-01', end: '2026-08-20', open: false }
    },
    funnelPeriod: 'quarter',
    funnelRangeOpen: false,
    fStart: '2026-08-01',
    fEnd: '2026-08-20',
    copilotOpen: this.props.copilotDefaultOpen ?? false,
    thinking: false,
    chat: [{ role: 'ai', text: '我已经读过 Ryze 头皮按摩仪的策略和 Q2 复盘。\n想从哪里开始？' }],
    platform: 'TikTok',
    persona: '通用版',
    dismissed: [],
    accepted: [],
    doneTasks: [1],
    shortlist: ['mia.selfcare', 'kaylascalp', 'hairbyandre'],
    advanced: [],
    applied: [],
    creatorHandle: '@mia.selfcare',
    assetIdx: 0,
    assetEntryOpen: false,
    assetEntryCampaignOpen: false,
    assetEntryCampaign: '',
    assetEntryNotice: '',
    campaignIdx: 0,
    campaignSku: '',
    campaignName: '',
    campaignTab: 'strategy',
    campaignAiSummaryOpen: false,
    campaignStrategyVersions: [],
    campaignStrategySelected: {},
    campaignStrategyApplied: {},
    campaignStrategyMode: '',
    campaignStrategyMenu: false,
    campaignStrategyConfirmModal: false,
    campaignStrategyDraft: { title: '', mode: 'standard', sections: [] },
    campaignStrategyDraftTab: 'input',
    campaignStrategyDraftInputStep: 1,
    campaignStrategyDraftInputs: {},
    campaignStrategyDraftGenerated: '',
    campaignStrategyNotice: '',
    campaignStrategySectionEdits: {},
    campaignStrategySectionRegen: {},
    campaignStrategySectionLocked: {},
    campaignStrategySectionConfirmed: {},
    campaignStrategySectionEditing: '',
    campaignStrategySectionDraft: '',
    campaignStrategyDraftLocked: [],
    campaignStrategyDraftConfirmed: [],
    campaignStrategyDraftRegen: {},
    campaignStrategyDraftEditing: null,
    campaignStrategyDraftSectionDraft: '',
    campaignBriefChannels: ['TikTok'],
    campaignBriefCreators: [],
    campaignBriefSetupOpen: true,
    campaignBriefCreatorPickerOpen: true,
    campaignBriefCreatorQuery: '',
    campaignBriefListTab: 'channel',
    campaignBriefSelectedKey: '',
    campaignBriefNotice: '',
    campaignBriefNoticeKind: 'success',
    campaignBriefConfigOpen: false,
    campaignBriefAdjustDraft: '',
    campaignBriefSuggestionDone: [],
    campaignBriefSuggestionIgnored: [],
    campaignBriefConfigChecks: {},
    campaignEmailTab: 'pending',
    campaignEmailDrawer: null,
    campaignEmailDrafts: {},
    campaignEmailReplies: {},
    campaignEmailContractMenuOpen: false,
    campaignEmailContractSelections: {},
    campaignEmailContractDrafts: {},
    campaignEmailContractAttached: {},
    campaignEmailContractEditorOpen: false,
    ctmCustom: [],
    ctmRemoved: [],
    ctmNewOpen: false,
    ctmDeleteId: null,
    ctmNew: { deal: '付费合作', name: '', nameZh: '', ver: 'v1', seed: '', lang: 'en', en: '', zh: '', error: '' },
    reportTab: 'campaign',
    showVersions: false,
    coopList: ['@mia.selfcare', '@kaylascalp', '@leo.calmnight', '@june.rests'],
    coopQuery: '',
    coopActionType: '',
    coopActionHandle: '',
    coopContractFiles: {},
    coopBriefFiles: {},
    coopPostLinks: {},
    coopPostChannel: 'TikTok',
    coopPostUrl: '',
    coopActionNotice: '',
    shipOrders: [
      { handle: '@mia.selfcare', replyIdx: -1, product: 'Ryze 头皮按摩仪', qty: 1, date: '08/06', tracking: 'TRK419213', carrier: 'DHL Express', stage: 3,
        addr: { name: 'Mia Chen', line1: '1847 Sunset Blvd', line2: 'Apt 5B', city: 'Los Angeles', state: 'CA', zip: '90026', country: 'United States', phone: '+1 213 555 0134' } },
      { handle: '@kaylascalp', replyIdx: -1, product: 'Ryze 头皮按摩仪', qty: 2, date: '08/04', tracking: 'TRK418877', carrier: 'DHL Express', stage: 3,
        addr: { name: 'Kayla Reed', line1: '920 W 6th St', line2: '', city: 'Austin', state: 'TX', zip: '78703', country: 'United States', phone: '+1 512 555 0177' } },
      { handle: '@leo.calmnight', replyIdx: -1, product: 'Ryze 头皮按摩仪', qty: 1, date: '08/02', tracking: 'TRK417604', carrier: 'DHL Express', stage: 3,
        addr: { name: 'Leo Marsh', line1: '441 Pine St', line2: 'Unit 12', city: 'Portland', state: 'OR', zip: '97204', country: 'United States', phone: '+1 503 555 0188' } },
      { handle: '@june.rests', replyIdx: -1, product: 'Ryze 头皮按摩仪', qty: 1, date: '08/08', tracking: 'TRK419488', carrier: 'DHL Express', stage: 3,
        addr: { name: 'June Alvarez', line1: '77 Bay Ridge Ave', line2: '', city: 'Brooklyn', state: 'NY', zip: '11220', country: 'United States', phone: '+1 646 555 0142' } },
      { handle: '@dailywithlin', replyIdx: -1, product: 'Ryze 头皮按摩仪', qty: 1, date: '08/17', tracking: 'TRK420356', carrier: 'DHL Express', stage: 2,
        addr: { name: 'Lin Zhao', line1: '2210 Clement St', line2: '', city: 'San Francisco', state: 'CA', zip: '94121', country: 'United States', phone: '+1 415 555 0163' } },
      { handle: '@nora.pm', replyIdx: -1, product: 'Lumo 便携香氛机', qty: 1, date: '08/05', tracking: 'TRK419021', carrier: 'DHL Express', stage: 1,
        addr: { name: 'Nora Pfeiffer', line1: 'Kastanienallee 42', line2: '', city: 'Berlin', state: 'BE', zip: '10435', country: 'Germany', phone: '+49 30 5550 118' } }
    ],
    contactLog: [
      { handle: '@mia.selfcare', sku: 'RYZ-SC-01', subject: '合作邀请 · Ryze 头皮按摩仪 × @mia.selfcare', when: '2026-08-06 现在', status: '已发送', att: 2 },
      { handle: '@kaylascalp', sku: 'RYZ-SC-01', subject: '合作邀请 · Ryze 头皮按摩仪 × @kaylascalp', when: '2026-08-04 现在', status: '已发送', att: 2 }
    ],
    briefView: 'list',
    briefVersions: [
      { sku: 'RYZ-SC-01', name: 'Ryze 头皮按摩仪', platform: 'TikTok', ver: 'v1', date: '2026-07-30', status: '已通过', iter: 2, prompt: '', mode: 'channel', creator: '', creatorStyle: '' },
      { sku: 'RYZ-SC-01', name: 'Ryze 头皮按摩仪', platform: 'TikTok', ver: 'v2', date: '2026-08-14', status: '待审批', iter: 4, prompt: '语气更口语，不要提价格', mode: 'channel', creator: '', creatorStyle: '' },
      { sku: 'RYZ-SC-01', name: 'Ryze 头皮按摩仪', platform: 'Instagram', ver: 'v1', date: '2026-08-16', status: '草稿', iter: 1, prompt: '', mode: 'channel', creator: '', creatorStyle: '' },
      { sku: 'RYZ-SC-01', name: 'Ryze 头皮按摩仪', platform: 'TikTok', ver: 'v1', date: '2026-08-18', status: '草稿', iter: 3, prompt: '', mode: 'creator', creator: '@kaylascalp', creatorStyle: '双镜头结构 · 口播解释' },
      { sku: 'LUM-AR-02', name: 'Lumo 便携香氛机', platform: 'Instagram', ver: 'v1', date: '2026-08-08', status: '已通过', iter: 2, prompt: '', mode: 'channel', creator: '', creatorStyle: '' }
    ],
    briefId: 'brf-102',
    briefEditorTab: 'channel',
    briefStudioChannels: ['TikTok'],
    briefStudioCreators: [],
    briefStudioSetupOpen: true,
    briefStudioCreatorPickerOpen: false,
    briefStudioCreatorQuery: '',
    briefStudioNotice: '',
    apTab: 'pending',
    tagSubmits: [],
    notifSeen: [],
    notifLog: [],
    budget: { pool: 69000, committed: 41200, paid: 25900 },
    budgetLines: [
      { sku: 'RYZ-SC-01', name: 'Ryze 头皮按摩仪', campaign: 'Q3 北美种草', pool: 42000, committed: 28600, paid: 17400 },
      { sku: 'LUM-AR-02', name: 'Lumo 便携香氛机', campaign: '秋季家居氛围', pool: 18000, committed: 9200, paid: 6100 },
      { sku: 'AURA-LP-01', name: 'Aura 落地氛围灯', campaign: 'Ambassador 招募', pool: 9000, committed: 3400, paid: 2400 }
    ],
    commissions: [
      { handle: '@kaylascalp', sku: 'RYZ-SC-01', gmv: 2900, rate: 12, orders: 56, status: '待结算' },
      { handle: '@june.rests', sku: 'RYZ-SC-01', gmv: 900, rate: 12, orders: 17, status: '待结算' },
      { handle: '@mia.selfcare', sku: 'RYZ-SC-01', gmv: 4300, rate: 10, orders: 78, status: '已结算' },
      { handle: '@leo.calmnight', sku: 'RYZ-SC-01', gmv: 2200, rate: 10, orders: 38, status: '已结算' },
      { handle: '@hairbyandre', sku: 'LUM-AR-02', gmv: 1300, rate: 8, orders: 22, status: '待结算' }
    ],
    invoices: [
      { id: 'INV-2026-081', handle: '@mia.selfcare', item: '固定费 · 夜间 routine ep.12', amount: 1200, date: '2026-08-13', status: '待审批', kind: '固定费', sku: 'RYZ-SC-01', channel: 'TikTok', applicant: '陈曦', payType: '尾款' },
      { id: 'INV-2026-082', handle: '@leo.calmnight', item: '固定费 · 一周实测 Shorts', amount: 1600, date: '2026-08-15', status: '待审批', kind: '固定费', sku: 'RYZ-SC-01', channel: 'YouTube', applicant: '陈曦', payType: '首款' },
      { id: 'INV-2026-079', handle: '@hairbyandre', item: '固定费 · 浴室静帧组', amount: 900, date: '2026-08-06', status: '已通过', kind: '固定费', sku: 'LUM-AR-02', channel: 'Instagram', applicant: '林浩', payType: '尾款' },
      { id: 'INV-2026-076', handle: '@kaylascalp', item: '佣金结算 · 7月', amount: 348, date: '2026-08-02', status: '已付款', kind: '佣金', sku: 'RYZ-SC-01', channel: 'TikTok', applicant: '陈曦', payType: '佣金结算' },
      { id: 'INV-2026-074', handle: '@thegroomguide', item: '固定费 · 男士理容测评', amount: 2400, date: '2026-07-28', status: '已驳回', kind: '固定费', sku: 'RYZ-SC-01', channel: 'YouTube', applicant: '苏敏', payType: '首款' },
      { id: 'INV-2026-068', handle: '@mia.selfcare', item: '固定费 · Ryze 首轮 3 条', amount: 3600, date: '2026-07-18', status: '已付款', kind: '固定费', sku: 'RYZ-SC-01', channel: 'TikTok', applicant: '陈曦', payType: '尾款' },
      { id: 'INV-2026-061', handle: '@june.rests', item: '寄样物流与佣金 · 6月', amount: 2140, date: '2026-06-26', status: '已付款', kind: '佣金', sku: 'RYZ-SC-01', channel: 'TikTok', applicant: '陈曦', payType: '佣金结算' },
      { id: 'INV-2026-054', handle: '@leo.calmnight', item: '固定费 · Ryze Q2 实测', amount: 5200, date: '2026-05-21', status: '已付款', kind: '固定费', sku: 'RYZ-SC-01', channel: 'YouTube', applicant: '陈曦', payType: '尾款' },
      { id: 'INV-2026-047', handle: '@scalp.school', item: '固定费 · Ryze 科普合作', amount: 4300, date: '2026-04-14', status: '已付款', kind: '固定费', sku: 'RYZ-SC-01', channel: 'TikTok', applicant: '苏敏', payType: '尾款' },
      { id: 'INV-2026-039', handle: '@quietmornings', item: '固定费 · Lumo 秋季氛围', amount: 3200, date: '2026-03-27', status: '已付款', kind: '固定费', sku: 'LUM-AR-02', channel: 'Instagram', applicant: '林浩', payType: '首款' },
      { id: 'INV-2026-031', handle: '@homewithtess', item: '固定费 + 佣金 · Lumo 上新', amount: 2900, date: '2026-02-19', status: '已付款', kind: '固定费', sku: 'LUM-AR-02', channel: 'Instagram', applicant: '林浩', payType: '尾款' },
      { id: 'INV-2026-022', handle: '@thecalmedit', item: '固定费 · Aura 氛围灯首轮', amount: 2400, date: '2026-01-23', status: '已付款', kind: '固定费', sku: 'AURA-LP-01', channel: 'TikTok', applicant: '苏敏', payType: '首款' },
      { id: 'INV-2026-018', handle: '@kaylascalp', item: '佣金结算 · 1月', amount: 1812, date: '2026-01-09', status: '已付款', kind: '佣金', sku: 'RYZ-SC-01', channel: 'TikTok', applicant: '陈曦', payType: '佣金结算' }
    ],
    settings: { seed: true, guard: true, autoTag: true, weekly: false, portal: false }
  };

  LOOKALIKE_POOL = [
    { handle: '@scalp.school', platform: 'TikTok', nation: '美国', niche: '头皮护理科普', followers: '18K', avgViews: '29K', er: '11.2%', quote: '寄样', sim: 93, gender: '女', age: '25-34', job: '美发从业者', why: '内容结构与种子几乎一致：头皮特写 + 口播解释，评论区高频问链接。' },
    { handle: '@lena.unwinds', platform: 'TikTok', nation: '美国', niche: '夜间自我照护', followers: '24K', avgViews: '37K', er: '9.4%', quote: '$280', sim: 88, gender: '女', age: '25-34', job: '全职创作者', why: '受众与种子重合 71%，已有多条睡前 routine 内容，寄样意愿高。' },
    { handle: '@quietmornings', platform: 'Instagram', nation: '加拿大', niche: '慢生活 / 护发', followers: '31K', avgViews: '22K', er: '7.8%', quote: '$350', sim: 84, gender: '女', age: '25-34', job: '全职创作者', why: '画面质感接近，适合承接 IG 搜索流量；报价略高于均值可议。' },
    { handle: '@thecalmedit', platform: 'TikTok', nation: '美国', niche: '压力管理 / 好物', followers: '12K', avgViews: '19K', er: '13.6%', quote: '寄样', sim: 81, gender: '女', age: '18-24', job: '学生', why: 'ER 显著高于同量级，情绪叙事与产品定位同构。' },
    { handle: '@hairdays.co', platform: 'YouTube', nation: '美国', niche: '护发实测', followers: '46K', avgViews: '41K', er: '5.4%', quote: '$620', sim: 76, gender: '男', age: '25-34', job: '全职创作者', why: '实测结构适合搜索承接，但转化路径长，建议放在第二批。' },
    { handle: '@homewithtess', platform: 'Instagram', nation: '美国', niche: '家居好物', followers: '52K', avgViews: '26K', er: '4.1%', quote: '$480', sim: 71, gender: '女', age: '35-44', job: '室内设计师', why: '垂类相关性偏弱，仅在铺量阶段考虑，不适合做标杆。' }
  ];

  ASSET_SEED = ([
    { handle: '@mia.selfcare', title: '夜间 routine ep.12', product: 'Ryze 头皮按摩仪', channel: 'TikTok', post: '2026-08-12', url: 'https://www.tiktok.com/@mia.selfcare/video/7412', views: '412K', er: '7.1%', spend: 1200, gmv: 4300, orders: 78, due: '2026-08-14', delivered: '2026-08-12', rights: 'ad' },
    { handle: '@kaylascalp', title: '头皮特写实测', product: 'Ryze 头皮按摩仪', channel: 'TikTok', post: '2026-08-09', url: 'https://www.tiktok.com/@kaylascalp/video/6621', views: '166K', er: '12.4%', spend: 0, gmv: 2900, orders: 56, due: '2026-08-12', delivered: '2026-08-09', rights: 'ad' },
    { handle: '@leo.calmnight', title: '一周实测 Shorts', product: 'Ryze 头皮按摩仪', channel: 'YouTube', post: '2026-08-14', url: 'https://www.youtube.com/watch?v=lc214', views: '214K', er: '5.1%', spend: 1600, gmv: 2200, orders: 38, due: '2026-08-15', delivered: '2026-08-14', rights: 'pending' },
    { handle: '@june.rests', title: '前后头皮对比', product: 'Ryze 头皮按摩仪', channel: 'TikTok', post: '2026-08-16', url: 'https://www.tiktok.com/@june.rests/video/8815', views: '74K', er: '13.8%', spend: 0, gmv: 900, orders: 17, due: '2026-08-14', delivered: '2026-08-16', rights: 'ad' },
    { handle: '@hairbyandre', title: '浴室静帧组', product: 'Lumo 便携香氛机', channel: 'Instagram', post: '2026-08-05', url: 'https://www.instagram.com/p/andre88', views: '88K', er: '4.4%', spend: 900, gmv: 1300, orders: 22, due: '2026-08-08', delivered: '2026-08-05', rights: 'social' },
    { handle: '@thecalmedit', title: '下班回家开灯转场', product: 'Aura 落地氛围灯', sku: 'AURA-LP-01', campaign: 'Aura · 推广 Campaign', channel: 'TikTok', post: '2026-08-28', url: 'https://www.tiktok.com/@thecalmedit/video/9328', views: '128K', er: '9.6%', spend: 400, gmv: 1850, orders: 34, due: '2026-08-29', delivered: '2026-08-28', rights: 'ad' },
    { handle: '@homewithtess', title: '租房客厅一平米改造', product: 'Aura 落地氛围灯', sku: 'AURA-LP-01', campaign: 'Aura · 推广 Campaign', channel: 'Instagram', post: '2026-08-30', url: 'https://www.instagram.com/reel/aura830', views: '86K', er: '6.8%', spend: 700, gmv: 1210, orders: 21, due: '2026-08-30', delivered: '2026-08-30', rights: 'social' },
    { handle: '@quietmornings', title: '夜间阅读角氛围布置', product: 'Aura 落地氛围灯', sku: 'AURA-LP-01', campaign: 'Aura · 推广 Campaign', channel: 'TikTok', post: '2026-09-02', url: 'https://www.tiktok.com/@quietmornings/video/9402', views: '51K', er: '8.2%', spend: 0, gmv: 760, orders: 14, due: '2026-09-03', delivered: '2026-09-02', rights: 'pending' }
  ]).map(x => ({
    ...x,
    sku: x.sku || (x.product === 'Lumo 便携香氛机' ? 'LUM-AR-02' : 'RYZ-SC-01'),
    campaign: x.campaign || (x.product === 'Lumo 便携香氛机' ? 'Q1 家居氛围' : 'Q3 北美种草'),
    sub: x.product + ' · ' + x.channel
  }));

  PENDING_DELIVERY = [
    { handle: '@dailywithlin', product: 'Ryze 头皮按摩仪', due: '2026-08-16', overdue: 4 },
    { handle: '@sofia.homelab', product: 'Lumo 便携香氛机', due: '2026-08-18', overdue: 2 },
    { handle: '@nora.pm', product: 'Ryze 头皮按摩仪', due: '2026-08-13', overdue: 7 },
    { handle: '@quietmornings', product: 'Ryze 头皮按摩仪', due: '2026-08-24', overdue: 0 },
    { handle: '@thecalmedit', product: 'Aura 落地氛围灯', due: '2026-08-26', overdue: 0 },
    { handle: '@homewithtess', product: 'Lumo 便携香氛机', due: '2026-08-28', overdue: 0 },
    { handle: '@scalp.school', product: 'Ryze 头皮按摩仪', due: '2026-08-29', overdue: 0 },
    { handle: '@lena.unwinds', product: 'Ryze 头皮按摩仪', due: '2026-09-01', overdue: 0 }
  ];

  // 归一化寄样单构造：CRM 与 Sample Mgt 三处创建路径共用，确保字段/tracking 规则一致
  _makeShipOrder = (input) => {
    const raw = String(input.handle || '');
    const handle = raw.charAt(0) === '@' ? raw : '@' + raw;
    const qty = Number(input.qty) || 1;
    const productStr = String(input.product || '');
    const extra = String((input.addr && (input.addr.line1 || input.addr.city)) || '') + String(input.date || '') + String(input.replyIdx || 0);
    const trkHash = Math.abs((handle.length * 7351 + qty * 17 + productStr.length * 131 + extra.length * 97 + (Date.now() % 10000)) % 899999);
    return {
      handle, replyIdx: input.replyIdx !== undefined ? input.replyIdx : -1,
      product: productStr, sku: input.sku || '', campaign: input.campaign || '',
      qty, date: input.date || '08/20',
      tracking: input.tracking || ('TRK' + String(100000 + trkHash)),
      carrier: input.carrier || 'DHL Express',
      stage: input.stage || 0,
      addr: input.addr || {}
    };
  };

  _shipKey = (o) => String(o && o.handle || '') + '|' + String(o && o.date || '');
  _orderStage = (o) => Math.max(0, Math.min(3, Number(o && o.stage) || 0));
  _pendingAddr = (handle) => {
    const raw = String(handle || '').replace(/^@/, '');
    return { name: raw || '收件人待补充', line1: '待红人确认', line2: '', city: '—', state: '—', zip: '—', country: 'United States', phone: '—' };
  };

  _nameFromHandle = (handle) => {
    const raw = String(handle || '').replace(/^@/, '').replace(/\./g, ' ');
    return raw.replace(/\b\w/g, m => m.toUpperCase());
  };

  _addrFromHandle = (handle, orders) => {
    const list = (orders || []).filter(o => o.handle === handle && o.addr && o.addr.line1 && o.addr.line1 !== '待红人确认');
    return list.length ? (list[0].addr || null) : null;
  };

  SHIP_CARRIERS = ['DHL Express', 'FedEx', 'UPS', 'USPS', 'SF Express', 'YunExpress', '4PX'];

  _nudgeMailDraft = (order) => {
    const handle = order.handle || '';
    const name = String((order.addr && order.addr.name) || this._nameFromHandle(handle)).split(' ')[0] || handle.replace('@', '');
    const product = order.product || 'the sample';
    const date = order.date || '';
    return {
      handle,
      to: handle,
      subject: 'Content check-in · ' + product + ' × ' + handle,
      body: 'Hi ' + name + ',\n\nYour ' + product + ' sample was delivered on ' + date + '. Could you share a first-cut draft this week? The brief SLA is 14 days from delivery.\n\nA short natural-use clip is enough for this pass — keep your own structure, no need to read a script.\n\nBest,\nChenxi'
    };
  };
  _applyStageOverlay = (orders, overlay) => {
    if (!overlay || typeof overlay !== 'object') return orders || [];
    return (orders || []).map(o => {
      const v = overlay[this._shipKey(o)];
      return v !== undefined ? { ...o, stage: Number(v) || 0 } : o;
    });
  };

  _splitShipCells = (line) => {
    const s = String(line || '').trim();
    if (!s) return [];
    if (s.indexOf('\t') >= 0) return s.split('\t').map(x => x.trim());
    const out = [];
    let cur = '', inQ = false;
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (ch === '"') { inQ = !inQ; continue; }
      if (!inQ && (ch === ',' || ch === '，')) { out.push(cur.trim()); cur = ''; continue; }
      cur += ch;
    }
    out.push(cur.trim());
    return out;
  };

  _parseBulkShipLine = (line) => {
    const p = this._splitShipCells(line).filter(x => x !== '');
    if (p.length < 6) return null;
    const handle = p[0];
    const name = p[1] || p[0];
    const last = p[p.length - 1];
    const qtyNum = /^\d+$/.test(last);
    const body = qtyNum ? p.slice(2, -1) : p.slice(2);
    const qty = qtyNum ? Number(last) : 1;
    if (body.length < 4) return null;
    const phone = body[body.length - 1] || '';
    const zip = body[body.length - 2] || '';
    const state = body[body.length - 3] || '';
    const city = body[body.length - 4] || '';
    const line1 = body.slice(0, Math.max(0, body.length - 4)).join(', ');
    return { handle, name, line1, city, state, zip, phone, qty };
  };

  _parseBulkShipRows = (text) => String(text || '').split(/\n+/).map(x => x.trim()).filter(Boolean).map(l => this._parseBulkShipLine(l)).filter(Boolean);

  INBOX_REPLIES = [
    { handle: '@mia.selfcare', when: '2026-08-19 09:12', subject: '合作邀请 · Ryze 头皮按摩仪', gist: '愿意合作，问能否加一条 Reels', hours: 27 },
    { handle: '@kaylascalp', when: '2026-08-18 21:40', subject: '寄样确认 · Ryze 头皮按摩仪', gist: '已收到样品，本周内拍', hours: 39 },
    { handle: '@dailywithlin', when: '2026-08-17 14:05', subject: '合作邀请 · Ryze 头皮按摩仪', gist: '询价 $650 是否可谈', hours: 70 },
    { handle: '@sofia.homelab', when: '2026-08-17 10:22', subject: '报价确认 · Lumo 便携香氛机', gist: '坚持 $850，等我方答复', hours: 74 },
    { handle: '@hairbyandre', when: '2026-08-20 08:30', subject: '内容进度 · 浴室静帧组', gist: '想追加一组横版图', hours: 6 },
    { handle: '@nora.pm', when: '2026-08-20 11:15', subject: '首次跟进 · Ryze 头皮按摩仪', gist: '要求先看 Brief 再决定', hours: 3 },
    { handle: '@leo.calmnight', when: '2026-08-19 16:40', subject: 'Re: 内容进度 · 一周实测 Shorts', gist: '问能否延后两天发布', hours: 20 },
    { handle: '@june.rests', when: '2026-08-18 12:05', subject: 'Re: 合作邀请 · Ryze 头皮按摩仪', gist: '已收样，确认字幕需要重剪', hours: 48 }
  ];

  download = (name, text) => {
    const blob = new Blob([text], { type: /\.html$/.test(name) ? 'text/html;charset=utf-8' : 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 400);
  };

  printableDoc = (title, sections) => {
    const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const body = sections.map(sec => '<section><h2>' + esc(sec.h) + '</h2>' + (sec.rows || []).map(r => '<p>' + esc(r) + '</p>').join('') + '</section>').join('');
    return '<!DOCTYPE html><html lang="zh"><head><meta charset="utf-8"><title>' + esc(title) + '</title>'
      + '<style>@page{size:letter;margin:18mm}body{font-family:"Noto Sans SC",-apple-system,sans-serif;color:#1D2638;max-width:760px;margin:0 auto;padding:28px;line-height:1.75}'
      + 'h1{font-size:26px;font-weight:600;letter-spacing:-.02em;margin:0 0 6px}.sub{color:#647187;font-size:13px;margin:0 0 26px}'
      + 'section{margin:0 0 22px;break-inside:avoid}h2{font-size:14px;font-weight:600;color:#2457F5;letter-spacing:.02em;margin:0 0 8px;padding-bottom:6px;border-bottom:1px solid #E2E8F2}'
      + 'p{margin:0 0 6px;font-size:13.5px}</style></head><body><h1>' + esc(title) + '</h1>'
      + '<p class="sub">Influencer Marketing AIOS · 导出于 2026-08-20 · 打印此页即可保存为 PDF</p>' + body
      + '<script>window.onload=function(){setTimeout(function(){window.print();},350);};</scr' + 'ipt></body></html>';
  };

  coverOf = (url, channel) => {
    const tint = channel === 'Instagram' ? '#F3E4E8' : (channel === 'YouTube' ? '#F7E4E4' : '#E6ECF7');
    const covers = [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=320&h=240&q=82',
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=320&h=240&q=82',
      'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=320&h=240&q=82',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=320&h=240&q=82',
      'https://images.unsplash.com/photo-1705834102217-b7823a688147?auto=format&fit=crop&w=320&h=240&q=82',
      'https://images.unsplash.com/photo-1616418928117-4e6d19be2df1?auto=format&fit=crop&w=320&h=240&q=82',
      'https://images.unsplash.com/photo-1569428047118-ae9338065103?auto=format&fit=crop&w=320&h=240&q=82',
      'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=320&h=240&q=82'
    ];
    const key = String(url || '') + '|' + String(channel || '');
    const index = Array.from(key).reduce((sum, ch) => (sum + ch.charCodeAt(0)) % covers.length, 0);
    return { bg: 'url("' + covers[index] + '")', tint, mark: '', shade: 'linear-gradient(180deg,transparent 58%,rgba(15,23,42,.16))', fg: '#FFFFFF' };
  };

  productImageOf = (sku) => ({
    'AURA-LP-01': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=240&h=240&q=86',
    'AURA-DK-04': 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&w=240&h=240&q=86',
    'RYZ-SC-01': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=240&h=240&q=86',
    'RYZ-SC-02': 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=240&h=240&q=86',
    'RYZ-SC-03': 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=240&h=240&q=86',
    'RYZ-HD-11': 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=240&h=240&q=86',
    'RYZ-FC-05': 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=240&h=240&q=86',
    'LUM-CD-08': 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=240&h=240&q=86',
    'LUM-AR-02': 'https://images.unsplash.com/photo-1616418928117-4e6d19be2df1?auto=format&fit=crop&w=240&h=240&q=86',
    'LUM-AR-05': 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=240&h=240&q=86',
    'LUM-HM-12': 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=240&h=240&q=86',
    'PACE-YM-02': 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=240&h=240&q=86',
    'PACE-RB-07': 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=240&h=240&q=86',
    'NUV-SP-07': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=240&h=240&q=86',
    'NUV-SP-09': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=240&h=240&q=86',
    'NUV-SL-03': 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=240&h=240&q=86',
    'VER-GL-04': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=240&h=240&q=86',
    'VER-GL-06': 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=240&h=240&q=86',
    'VER-BT-09': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=240&h=240&q=86',
    'VER-PL-02': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=240&h=240&q=86'
  })[sku] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=240&h=240&q=86';

  channelLogoOf = (channel) => ({
    TikTok: 'https://cdn.simpleicons.org/tiktok/111111',
    Instagram: 'https://cdn.simpleicons.org/instagram/E4405F',
    YouTube: 'https://cdn.simpleicons.org/youtube/FF0000'
  })[channel] || 'https://cdn.simpleicons.org/linktree/647187';

  entryToAsset = (e) => {
    const fmtV = (n) => n >= 1000000 ? (n / 1000000).toFixed(2) + 'M' : (n >= 1000 ? Math.round(n / 1000) + 'K' : String(n));
    const rawV = e.m_views || e.w_views || e.views || '0';
    const vNum = this.toNumU(rawV);
    const rawEr = e.m_er || e.w_er || e.er || '0';
    const erTxt = String(rawEr).indexOf('%') >= 0 ? String(rawEr) : (parseFloat(rawEr) || 0) + '%';
    const rights = !e.isRights ? 'pending' : (/广告/.test(e.rightsType || '') ? 'ad' : (e.rightsType ? 'social' : 'pending'));
    return {
      handle: e.handle || '未填写', title: e.title || '未命名素材',
      product: e.product || '手工录入', sku: e.sku || '待补充',
      channel: e.channel || (/youtube/i.test(e.url || '') ? 'YouTube' : (/instagram/i.test(e.url || '') ? 'Instagram' : 'TikTok')),
      post: e.post || '2026-08-20', url: e.url || '#',
      views: fmtV(vNum), er: erTxt, spend: Number(e.spend) || 0,
      gmv: Number(e.gmv) || 0, orders: Number(e.m_conv) || Number(e.w_conv) || 0,
      due: e.post || '2026-08-20', delivered: e.post || '2026-08-20',
      rights, isRights: !!e.isRights,
      campaign: e.campaign || '手工录入', sub: (e.campaign || '手工录入') + ' · 首周 ' + (e.w_views || '—') + ' / 最新 ' + (e.m_views || '—'),
      brand: e.brand || '手工录入', owner: e.owner || '陈曦',
      rightsType: e.rightsType, rightsMonths: e.rightsMonths, rightsScope: e.rightsScope, contract: e.contract
    };
  };

  tierOfFollowers = (v) => {
    const n = this.toNumU(v || '0');
    if (n >= 1000000) return 'Mega';
    if (n >= 500000) return 'Macro';
    if (n >= 100000) return 'Mid-tier';
    if (n >= 10000) return 'Micro';
    return 'Nano';
  };

  dealOfQuote = (q, mode) => {
    const s1 = String(q || ''), s2 = String(mode || '');
    const barter = /寄样|置换/.test(s1 + s2);
    const commission = /佣金|%/.test(s1 + s2);
    if (barter && commission) return '佣金合作';
    if (barter) return '产品置换';
    if (/^\s*(免费|无偿)/.test(s1)) return '免费合作';
    if (/[0-9]/.test(s1)) return '付费合作';
    return '待确认';
  };

  dealPalette = {
    '付费合作': ['#EAF0FF', '#2457F5'], '产品置换': ['#E4EFE4', '#4E7156'], '佣金合作': ['#E4EEF7', '#1D48D8'],
    '免费合作': ['#F5F8FE', '#647187'], '拒绝合作': ['#F7EDEE', '#C4636D'], '待确认': ['#F5F8FE', '#8792A5']
  };

  dealMetaOf = (q, mode) => {
    const d = this.dealOfQuote(q, mode);
    const p = this.dealPalette[d] || this.dealPalette['待确认'];
    return { deal: d, dealBg: p[0], dealFg: p[1] };
  };

  stageTag = (kind, target, tag, ctx) => {
    const rk = target + '|' + (ctx || '');
    this.setState(st => {
      const d = { ...((st.tagDraft || {})[rk] || {}) };
      d[kind] = d[kind] === tag ? '' : tag;
      return { tagDraft: { ...(st.tagDraft || {}), [rk]: d }, alTagOpen: null, assetTagOpen: null };
    });
  };

  submitStaged = (target, ctx) => {
    const rk = target + '|' + (ctx || '');
    const d = (this.state.tagDraft || {})[rk] || {};
    if (!d.asset && !d.creator) return;
    const now = { ...(this.state.tagDraft || {}) };
    delete now[rk];
    const subs = [];
    if (d.asset) subs.push({ id: 'asset|' + target + '|' + (ctx || ''), kind: 'asset', target, tag: d.asset, ctx: ctx || '', by: '陈曦', when: '2026-08-20' });
    if (d.creator) subs.push({ id: 'creator|' + target + '|' + (ctx || ''), kind: 'creator', target, tag: d.creator, ctx: ctx || '', by: '陈曦', when: '2026-08-20' });
    this.setState(st => {
      const ids = subs.map(x => x.id);
      const keep = (st.tagSubmits || []).filter(x => ids.indexOf(x.id) < 0);
      const ap = { ...(st.approvals || {}) };
      ids.forEach(i => { delete ap['tag-' + i]; });
      return {
        tagDraft: now, tagSubmits: subs.concat(keep), approvals: ap,
        alTagOpen: null, assetTagOpen: null,
        notifLog: [{ kind: 'approval', title: '打标申请已提交 · ' + (ctx || target), note: subs.map(x => (x.kind === 'asset' ? '素材→' : '红人→') + x.tag).join('、') + ' · 等待推广 leader 审核', when: '刚刚' }, ...(st.notifLog || [])]
      };
    });
  };

  submitTag = (kind, target, tag, ctx) => {
    const id = kind + '|' + target + '|' + (ctx || '');
    this.setState(st => {
      const list = (st.tagSubmits || []).filter(x => x.id !== id);
      return {
        tagSubmits: [{ id, kind, target, tag, ctx: ctx || '', by: '陈曦', when: '2026-08-20' }, ...list],
        alTagOpen: null, assetTagOpen: null,
        notifLog: [{ kind: 'approval', title: '打标待审批 · ' + (kind === 'asset' ? '素材「' + (ctx || target) + '」' : target) + ' → ' + tag, note: '已提交给推广 leader 审核', when: '刚刚' }, ...(st.notifLog || [])]
      };
    });
  };

  tagDraftOf = (kind, target, ctx) => ((this.state.tagDraft || {})[target + '|' + (ctx || '')] || {})[kind] || '';

  submitMeta = (target, ctx) => {
    const d = (this.state.tagDraft || {})[target + '|' + (ctx || '')] || {};
    const a = this.tagStateOf('asset', target, ctx), c = this.tagStateOf('creator', target, ctx);
    const staged = (d.asset ? 1 : 0) + (d.creator ? 1 : 0);
    if (staged) return { submitLabel: '提交申请 · ' + staged, submitBg: '#2457F5', submitFg: '#FFFFFF', submitBd: '#2457F5', submitCursor: 'pointer', submitTags: () => this.submitStaged(target, ctx) };
    if (a.pending || c.pending) return { submitLabel: '审核中', submitBg: '#FBEEDA', submitFg: '#A5762C', submitBd: '#F0DCB8', submitCursor: 'default', submitTags: () => {} };
    if (a.rejected || c.rejected) return { submitLabel: '已退回 · 可重提', submitBg: '#F7EDEE', submitFg: '#C4636D', submitBd: '#F0C9C9', submitCursor: 'default', submitTags: () => {} };
    if (a.approved || c.approved) return { submitLabel: '已通过', submitBg: '#E4EFE4', submitFg: '#4E7156', submitBd: '#CFE3D3', submitCursor: 'default', submitTags: () => {} };
    return { submitLabel: '提交申请', submitBg: '#FFFFFF', submitFg: '#A2ABBA', submitBd: '#E2E8F2', submitCursor: 'default', submitTags: () => {} };
  };

  tagStateOf = (kind, target, ctx) => {
    const s = this.state;
    const id = kind + '|' + target + '|' + (ctx || '');
    const sub = (s.tagSubmits || []).find(x => x.id === id);
    if (!sub) return { pending: false, approved: null, rejected: false, tag: '' };
    const d = (s.approvals || {})['tag-' + id];
    if (!d) return { pending: true, approved: null, rejected: false, tag: sub.tag };
    if (d.status === '已通过') return { pending: false, approved: sub.tag, rejected: false, tag: sub.tag };
    return { pending: false, approved: null, rejected: true, tag: sub.tag };
  };

  assetTagOf = (a, pass) => {
    const stt = this.tagStateOf('asset', a.handle, a.title);
    if (stt.pending) return { tag: stt.tag + ' · 待审核', bg: '#FBEEDA', fg: '#A5762C', note: '已提交推广 leader 审核，通过后才会进入对应分类' };
    if (stt.rejected) return { tag: stt.tag + ' · 已驳回', bg: '#F7EDEE', fg: '#C4636D', note: '打标申请已被驳回，可修改后重新提交' };
    if (stt.approved) {
      const ok = { '合格素材': { bg: '#FBEEDA', fg: '#A5762C', note: '已审核通过，计入合格素材清单' }, '授权素材': { bg: '#E4EEF7', fg: '#1D48D8', note: '已审核通过，计入授权素材清单' }, '淘汰素材': { bg: '#F7EDEE', fg: '#C4636D', note: '已审核通过，不进入复用池' } }[stt.approved];
      if (ok) return { tag: stt.approved, bg: ok.bg, fg: ok.fg, note: ok.note };
    }
    const rights = a.rights === 'ad' || a.rights === 'social';
    if (rights && pass) return { tag: '授权 · 合格', bg: '#E4EFE4', fg: '#4E7156', note: '已获授权且 ER 达标，可直接复用与投放' };
    if (rights) return { tag: '授权素材', bg: '#E4EEF7', fg: '#1D48D8', note: '已获授权，但 ER 未达合格线' };
    if (pass) return { tag: '合格素材', bg: '#FBEEDA', fg: '#A5762C', note: 'ER 达标计入合格数，授权待补' };
    return { tag: '淘汰素材', bg: '#F7EDEE', fg: '#C4636D', note: '既未达合格线也无授权，不进入复用池' };
  };

  toNumU = (v) => { const n = parseFloat(String(v).replace(/[^0-9.]/g, '')); return isNaN(n) ? 0 : n * (/M/i.test(String(v)) ? 1000000 : (/K/i.test(String(v)) ? 1000 : 1)); };

  deriveFacts() {
    const s = this.state;
    const num = this.toNumU;
    const assets = this.ASSET_SEED.concat((s.alEntries || []).map(this.entryToAsset));
    const views = assets.reduce((t, a) => t + num(a.views), 0);
    const spend = assets.reduce((t, a) => t + a.spend, 0);
    const gmv = assets.reduce((t, a) => t + a.gmv, 0);
    const orders = assets.reduce((t, a) => t + (a.orders || 0), 0);
    const qualified = assets.filter(a => parseFloat(a.er) >= 5).length;
    const adReady = assets.filter(a => a.rights === 'ad').length;
    const pendingRights = assets.filter(a => a.rights === 'pending').length;
    const cpv = views ? spend / views : 0;

    const pending = this.PENDING_DELIVERY;
    const overdue = pending.filter(x => x.overdue > 0);

    const orders2 = s.shipOrders || [];
    const sampleQty = orders2.reduce((t, o) => t + (o.qty || 1), 0);
    const inTransit = orders2.filter(o => (o.stage || 0) < 3).length;
    const received = orders2.filter(o => (o.stage || 0) >= 3).length;

    const decided = s.approvals || {};
    const briefs = (s.briefVersions || []).map(b => {
      const k = b.sku + '|' + b.platform + '|' + b.ver + '|' + (b.segment || b.creator || '');
      const d = decided[k];
      return { ...b, key: k, status: d ? d.status : b.status, comment: d ? d.comment : '', by: d ? d.by : '' };
    });
    const pendingApprovals = briefs.filter(b => b.status === '待审批');
    const approvedBriefs = briefs.filter(b => b.status === '已通过');
    const rejectedBriefs = briefs.filter(b => b.status === '已驳回');

    const replies = this.INBOX_REPLIES.filter(r => !(s.repliedTo || []).includes(r.handle));
    const warn = replies.filter(r => r.hours >= 24 && r.hours < 48);
    const stale = replies.filter(r => r.hours >= 48);

    const promoted = s.promoted || [];
    const coop = s.coopList || [];
    const strat = s.library || [];
    const stratDone = strat.filter(x => x.confirmed >= x.sections).length;

    const budget = s.budget || { pool: 69000, committed: 41200, paid: 27900 };
    const invoices = s.invoices || [];
    const invPending = invoices.filter(i => i.status === '待审批').length;

    return {
      assets, assetCount: assets.length, views, spend, gmv, orders, qualified, adReady, pendingRights, cpv,
      pending, overdue, sampleQty, inTransit, received,
      briefs, pendingApprovals, approvedBriefs, rejectedBriefs,
      replies, stale, warn, promoted, coop, strat, stratDone, budget, invoices, invPending,
      projects: 3 + promoted.length
    };
  }

  go = (page) => () => {
    const routes = {
      dash: '1-Dashboard.html',
      tasks: '2-My-Tasks.html',
      products: '3-Products.html',
      campaigns: '4-Campaigns.html',
      strategy: '5-Strategy-Studio.html',
      brief: '6-Brief-Studio.html',
      creators: '7-Influencer-CRM.html',
      samples: '8-Sample-Mgt.html',
      assets: '9-Asset-Library.html',
      finance: '10-Budget-Mgt.html',
      reports: '11-Reports.html',
      contracts: '12-Contract-Mgt.html',
      settings: '13-Settings.html'
    };
    const target = routes[page];
    const routedTarget = (window.AIOS_ROUTE_PREFIX || '') + target;
    const current = window.location.pathname.split('/').pop() || 'index.html';
    if (target && !window.location.pathname.endsWith('/' + routedTarget) && !(page === 'dash' && current === 'index.html')) {
      window.location.href = './' + routedTarget;
      return;
    }
    this.setState({ page });
  };

  toggleCopilot = () => this.setState(s => ({ copilotOpen: !s.copilotOpen }));

  openCreator = (handle) => () => this.setState({ page: 'creatorProfile', creatorHandle: handle });
  openAsset = (i) => () => this.setState({ page: 'assetDetail', assetIdx: i });
  openCampaign = (i, tab) => () => this.setState({ page: 'campaignDetail', campaignIdx: i, campaignSku: '', campaignName: '', campaignTab: tab || 'strategy', campaignAiSummaryOpen: false });
  openCampaignSku = (sku, tab, name) => (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    this.setState({ page: 'campaignDetail', campaignSku: sku || '', campaignName: name || '', campaignTab: tab || 'strategy', campaignAiSummaryOpen: false });
  };

  ask = (label, reply) => () => {
    this.setState(s => ({ copilotOpen: true, thinking: true, chat: [...s.chat, { role: 'me', text: label }] }));
    clearTimeout(this._t);
    this._t = setTimeout(() => this.setState(s => ({ thinking: false, chat: [...s.chat, { role: 'ai', text: reply }] })), 900);
  };

  scoreColor = (n) => n >= 75 ? SAGE : n >= 55 ? this.accent : RUST;
  switchSku = (sku) => this.setState(st => {
    if (st.strategySku === sku) return { stTab: 'work', swVersionMenu: false, swSaveAsOpen: false, swSaveAsDraft: '', swVersionManagerOpen: false, swVersionRenameKey: '', swVersionDeleteKey: '', swVersionNotice: '' };
    const store = { ...(st.swStore || {}), [st.strategySku]: st.sw };
    const rec = st.library.find(x => x.sku === sku);
    const saved = store[sku];
    const base = saved || {
      ...st.sw, step: rec ? 10 : 1, mode: rec ? rec.mode : 'standard',
      generated: !!rec, activeSection: 1, goalType: undefined,
      confirmed: rec ? Array.from({ length: rec.confirmed }, (_, i) => i + 1) : [],
      edits: {}, editing: null, draft: '', regen: {}, locked: [],
      verBase: rec ? rec.ver : 1, loadedStatus: rec ? rec.status : null,
      fieldState: {}, fieldEdits: {}, fieldEditing: null, fieldDraft: ''
    };
    return { strategySku: sku, stTab: 'work', swVersionMenu: false, swSaveAsOpen: false, swSaveAsDraft: '', swVersionManagerOpen: false, swVersionRenameKey: '', swVersionDeleteKey: '', swVersionNotice: '', swStore: store, sw: base };
  });

  pillOn = (on) => ({ bg: on ? '#2457F5' : '#FFFFFF', fg: on ? '#FFFFFF' : '#647187', bd: on ? '#2457F5' : '#E2E8F2' });
  pillBg = (n) => n >= 75 ? '#E4EFE4' : n >= 55 ? '#FBEEDA' : '#FBE3E3';
  priority = (n) => n >= 75 ? '高' : n >= 55 ? '中' : '低';

  renderVals() {
    const s = this.state;
    const AMBER = this.accent;
    const pillOn = this.pillOn;
    const page = s.page;
    const facts = this.deriveFacts();
    const bvLive = facts.briefs;
    const usd0 = (n) => '$' + Math.round(n).toLocaleString('en-US');
    const notifItems = (() => {
      const out = [];
      facts.replies.forEach(r => out.push({
        id: 'mail-' + r.handle, kind: 'mail', dot: r.hours >= 48 ? RUST : (r.hours >= 24 ? AMBER : BLUE),
        title: r.handle + ' 回复了邮件', note: r.gist + (r.hours >= 24 ? '（已等待 ' + r.hours + ' 小时' + (r.hours >= 48 ? ' · 需升级处理' : '') + '）' : ''),
        when: r.when.slice(5), cta: '去回复', page: 'creators'
      }));
      facts.overdue.forEach(o => out.push({
        id: 'late-' + o.handle, kind: 'late', dot: RUST,
        title: o.handle + ' 素材逾期 ' + o.overdue + ' 天', note: o.product + ' · 应交付 ' + o.due,
        when: o.due.slice(5), cta: '去催单', page: 'campaigns'
      }));
      (s.shipOrders || []).filter(o => (o.stage || 0) >= 3).slice(0, 3).forEach(o => out.push({
        id: 'ship-' + o.handle + o.tracking, kind: 'ship', dot: SAGE,
        title: o.handle + ' 已签收样品', note: o.product + ' × ' + o.qty + ' · ' + o.carrier + ' ' + o.tracking,
        when: o.date, cta: '看寄样记录', page: 'samples'
      }));
      facts.pendingApprovals.forEach(b => out.push({
        id: 'ap-' + b.key, kind: 'approval', dot: AMBER,
        title: 'Brief 待审批 · ' + b.name + ' ' + b.ver, note: b.platform + (b.mode === 'creator' ? ' · ' + (b.creator || '红人风格') : '') + ' · 提交 ' + b.date,
        when: b.date.slice(5), cta: '去审批', page: 'tasks', tab: 'approval'
      }));
      (s.notifLog || []).forEach((l, i) => out.push({
        id: 'log-' + i + '-' + l.title, kind: l.kind, dot: /驳回/.test(l.title) ? RUST : SAGE,
        title: l.title, note: '审批意见：' + l.note, when: l.when, cta: '看 Brief 库', page: 'brief'
      }));
      facts.invoices.filter(i => i.status === '待审批').forEach(i2 => out.push({
        id: 'inv-' + i2.id, kind: 'invoice', dot: AMBER,
        title: '发票待审批 · ' + i2.handle, note: i2.item + ' · ' + usd0(i2.amount), when: i2.date.slice(5), cta: '去结算', page: 'finance'
      }));
      return out;
    })();
    const AP_TYPE_STYLE = {
      '选品': ['#EAF0FF', '#2457F5'], 'Campaign': ['#E4EEF7', '#1D48D8'], 'Strategy': ['#EEF2FF', '#3F5FCC'],
      'Brief': ['#F1F5FF', '#1D48D8'], '红人合作': ['#E4EFE4', '#4E7156'], '寄样': ['#FBEEDA', '#A5762C'],
      '素材入库': ['#F5F8FE', '#647187'], '付款': ['#F7EDEE', '#C4636D'], '合同变更': ['#EAF0F4', '#365581']
    };
    const apSeedDefs = [
      { id: 'sel-1', type: '选品', title: 'Aura 落地氛围灯 申请进入推广池', meta: 'SKU AURA-LP-01 · 营销得分 89 · 提交人 苏敏 · 提交 2026-08-19', page: 'products', view: '查看产品' },
      { id: 'sel-2', type: '选品', title: 'Nuvia 口服胶囊 申请进入推广池', meta: 'SKU NUV-SP-07 · 营销得分 41 · 合规证据未齐 · 提交人 林浩 · 提交 2026-08-15', page: 'products', view: '查看产品', preset: '已驳回', comment: '合规证据未补齐，得分 41 不进入本季度推广池。' },
      { id: 'cmp-1', type: 'Campaign', title: 'Ryze · Q4 节日种草 立项申请', meta: '预算 $56,000 · 目标 爆品打造 · 周期 10/1–12/15 · 提交人 陈曦', page: 'campaigns', view: '查看 Campaign' },
      { id: 'str-1', type: 'Strategy', title: 'Lumo 便携香氛机 策略 v2 申请定稿', meta: 'SKU LUM-AR-02 · 标准版 15 章 · 已确认 15 章 · 提交人 苏敏', page: 'strategy', view: '查看策略' },
      { id: 'inf-1', type: '红人合作', title: '@sofia.homelab 合作条件申请批准', meta: '付费合作 $850（高于均值 31%）· Lumo 便携香氛机 · 提交人 苏敏', page: 'creators', view: '查看红人' },
      { id: 'inf-2', type: '红人合作', title: '@kaylascalp 转长期合作申请', meta: '寄样 + 12% 佣金 · ER 12.4% · 提交人 陈曦 · 提交 2026-08-16', page: 'creators', view: '查看红人', preset: '已通过', comment: '性价比最好的一位，同意转长期并给月度配额。' },
      { id: 'smp-1', type: '寄样', title: '批量寄样申请 · 6 位红人 / 8 件', meta: 'Ryze 头皮按摩仪 × 8 · 物流预估 $186 · 提交人 林浩', page: 'samples', view: '查看寄样' },
      { id: 'ast-1', type: '素材入库', title: '@june.rests 前后对比 申请入库为合格素材', meta: 'ER 13.8% · 字幕含「见效」需重剪 · 提交人 林浩', page: 'assets', view: '查看素材' },
      { id: 'ast-2', type: '素材入库', title: '@leo.calmnight 一周实测 申请入库', meta: 'Views 214K · 授权待补 · 提交人 陈曦 · 提交 2026-08-15', page: 'assets', view: '查看素材', preset: '已通过', comment: '数据达标，入库为合格素材；授权走单独流程。' },
      { id: 'ctr-1', type: '合同变更', title: '@hairbyandre 素材二次授权补充协议', meta: '新增白名单投放 3 个月 · 追加买断 $240 · 提交人 苏敏', page: 'contracts', view: '查看合同' }
    ];
    const apPool = (() => {
      const decided = s.approvals || {};
      const briefItems = bvLive.map(b => {
        const k = b.sku + '|' + b.platform + '|' + b.ver + '|' + (b.creator || '');
        const st2 = (decided[k] ? decided[k].status : b.status);
        const sty = AP_TYPE_STYLE['Brief'];
        return {
          key: k, type: 'Brief', status: st2,
          comment: decided[k] ? decided[k].comment : '', by: decided[k] ? decided[k].by : '',
          title: b.name + ' · ' + b.platform + (b.mode === 'creator' ? ' · ' + (b.creator || '红人风格') : '') + ' ' + b.ver,
          meta: 'SKU ' + b.sku + ' · 第 ' + b.iter + ' 次生成 · 提交 ' + b.date + ' · 提交人 ' + (b.owner || '陈曦'),
          typeBg: sty[0], typeFg: sty[1], viewLabel: '查看 Brief',
          goState: { page: 'brief', briefView: 'vault' },
          notifName: 'Brief · ' + b.name + ' ' + b.ver
        };
      }).filter(b => b.status === '待审批' || b.status === '已通过' || b.status === '已驳回');
      const others = apSeedDefs.map(d => {
        const sty = AP_TYPE_STYLE[d.type] || ['#F5F8FE', '#647187'];
        const st2 = decided[d.id] ? decided[d.id].status : (d.preset || '待审批');
        return {
          key: d.id, type: d.type, status: st2,
          comment: decided[d.id] ? decided[d.id].comment : (d.preset ? d.comment : ''),
          by: decided[d.id] ? decided[d.id].by : (d.preset ? 'Helen · Marketing Lead' : ''),
          title: d.title, meta: d.meta, typeBg: sty[0], typeFg: sty[1],
          viewLabel: d.view, goState: { page: d.page },
          notifName: d.type + ' · ' + d.title
        };
      });
      const sty2 = AP_TYPE_STYLE['付款'];
      const payItems = (s.invoices || []).map(iv => {
        const k2 = 'inv-' + iv.id;
        const own = iv.status === '待审批' ? '待审批' : (iv.status === '已驳回' ? '已驳回' : '已通过');
        return {
        key: k2, type: '付款',
        status: decided[k2] ? decided[k2].status : own,
        comment: decided[k2] ? decided[k2].comment : (iv.status === '已付款' ? '已完成付款，已回写预算池。' : ''),
        by: decided[k2] ? decided[k2].by : (iv.by || ''),
        isInvoice: true, invoiceId: iv.id,
        title: iv.id + ' · ' + iv.handle + ' · ' + iv.item,
        meta: '金额 $' + Number(iv.amount).toLocaleString('en-US') + ' · ' + iv.kind + ' · 提交 ' + iv.date,
        typeBg: sty2[0], typeFg: sty2[1], viewLabel: '查看发票',
        goState: { page: 'finance', fnTab: 'inv' },
        notifName: '付款 · ' + iv.id
      };
      });
      const tagItems = (s.tagSubmits || []).map(sub => {
        const isAsset = sub.kind === 'asset';
        const sty3 = AP_TYPE_STYLE[isAsset ? '素材入库' : '红人合作'];
        const k3 = 'tag-' + sub.id;
        const d3 = decided[k3];
        return {
          key: k3, type: isAsset ? '素材入库' : '红人合作',
          status: d3 ? d3.status : '待审批',
          comment: d3 ? d3.comment : '', by: d3 ? d3.by : '',
          title: (isAsset ? '素材打标申请 · 「' + sub.ctx + '」→ ' + sub.tag : '红人打标申请 · ' + sub.target + ' → ' + sub.tag),
          meta: (isAsset ? '红人 ' + sub.target : '来源素材「' + sub.ctx + '」') + ' · 提交人 ' + sub.by + ' · 提交 ' + sub.when + ' · 通过后进入对应分类',
          typeBg: sty3[0], typeFg: sty3[1],
          viewLabel: isAsset ? '查看素材' : '查看红人',
          goState: isAsset ? { page: 'assets' } : { page: 'creators' },
          notifName: (isAsset ? '素材打标 · ' + sub.ctx : '红人打标 · ' + sub.target) + ' → ' + sub.tag,
          isTag: true, tagKind: sub.kind, tagTarget: sub.target, tagValue: sub.tag
        };
      });
      const order = { '待审批': 0, '已驳回': 1, '已通过': 2 };
      return tagItems.concat(others).concat(payItems).concat(briefItems).sort((a, b) => (order[a.status] - order[b.status]));
    })();
    const apPendingCount = apPool.filter(x => x.status === '待审批').length;
    const apPendingKinds = Object.keys(apPool.filter(x => x.status === '待审批').reduce((m, x) => { m[x.type] = 1; return m; }, {})).length;

    const statusMetaBrief = (st2) => st2 === '已通过' ? ['#4E7156', '#E4EFE4'] : st2 === '已驳回' ? ['#C4636D', '#F7EDEE'] : st2 === '待审批' ? ['#A5762C', '#FBEEDA'] : ['#647187', '#F5F8FE'];
    const navDefs = [
      ['dash', '01', 'Dashboard', ''], ['tasks', '02', 'My Tasks', String(6 + facts.pendingApprovals.length)], ['products', '02', 'Products', ''], ['campaigns', '06', 'Campaigns', '3'], ['strategy', '03', 'Strategy Studio', ''],
      ['brief', '04', 'Brief Studio', facts.pendingApprovals.length ? String(facts.pendingApprovals.length) : ''], ['creators', '05', 'Influencer CRM', ''], ['samples', '05', 'Sample Mgt', ''],
      ['assets', '07', 'Asset Library', ''],
      ['finance', '09', 'Budget Mgt', facts.invPending ? String(facts.invPending) : ''],
      ['reports', '10', 'Reports', ''], ['contracts', '11', 'Contract Mgt', ''], ['settings', '12', 'Settings', '']
    ];
    const rootOf = { productDetail: 'products', campaignDetail: 'campaigns', newCampaign: 'campaigns', creatorProfile: 'creators', contact: 'creators', assetDetail: 'assets', samples: 'samples', contracts: 'contracts', finance: 'finance' };
    const activeRoot = rootOf[page] || page;
    const collapsed = s.navCollapsed;
    const nav = navDefs.map(([id, key, label, badge]) => {
      const on = id === activeRoot;
      return {
        key: label.charAt(0), label, badge, go: this.go(id), title: label,
        bg: on ? '#EAF0FF' : 'transparent', fg: on ? '#1D2638' : '#59677C', fw: on ? 500 : 400,
        justify: collapsed ? 'center' : 'flex-start',
        badgePos: collapsed ? 'absolute' : 'static'
      };
    });
    const collapsedNav = collapsed;

    const crumbMap = {
      dash: ['Dashboard', ''], tasks: ['My Tasks', ''], products: ['Products', ''], productDetail: ['Products', 'Ryze 头皮按摩仪'],
      strategy: ['Strategy Studio', ''], brief: ['Brief Studio', s.briefView === 'editor' ? s.platform : '产品列表'],
      creators: ['Influencer CRM', ''], creatorProfile: ['Influencer CRM', s.creatorHandle], contact: ['Influencer CRM', '联系红人'],
      samples: ['Sample Mgt', ''], contracts: ['Contract Mgt', ''],
      finance: ['Budget Mgt', ''],
      campaigns: ['Campaigns', ''], campaignDetail: ['Campaigns', 'Q3 北美种草'], newCampaign: ['Campaigns', '新建 Campaign'],
      assets: ['Asset Library', ''], assetDetail: ['Asset Library', '资产详情'],
      reports: ['Reports', 'Q2 复盘'], settings: ['Settings', '']
    };
    let [crumbRoot, crumbLeaf] = crumbMap[page] || ['Dashboard', ''];

    // ── 产品基础信息查询 ──
    const skuDb = [
      { sku: 'RYZ-SC-01', name: 'Ryze 头皮按摩仪', brand: 'Ryze', shop: 'Ryze Official US', bu: '个护 BU', category: '个护家电 / 头皮护理',
        asin: 'B0CX7K9M2P', owner: '陈曦', stars: '4.6', reviews: '2,418', price: '$49.90', ps: '186', stock: '4,120', stockNote: '约 22 天',
        bsr: '12', bsrCat: 'Scalp Massagers', bsrTop: '1,842', bsrTopCat: 'Beauty & Personal Care' },
      { sku: 'RYZ-SC-02', name: 'Ryze 头皮按摩仪 Pro', brand: 'Ryze', shop: 'Ryze Official US', bu: '个护 BU', category: '个护家电 / 头皮护理',
        asin: 'B0D4N2QL8T', owner: '陈曦', stars: '4.4', reviews: '386', price: '$69.90', ps: '54', stock: '1,860', stockNote: '约 34 天',
        bsr: '41', bsrCat: 'Scalp Massagers', bsrTop: '6,270', bsrTopCat: 'Beauty & Personal Care' },
      { sku: 'LUM-AR-02', name: 'Lumo 便携香氛机', brand: 'Lumo', shop: 'Lumo Home', bu: '家居 BU', category: '家居香氛 / 扩香',
        asin: 'B0C9YT4RW1', owner: '林浩', stars: '4.3', reviews: '1,092', price: '$32.00', ps: '141', stock: '2,740', stockNote: '约 19 天',
        bsr: '28', bsrCat: 'Essential Oil Diffusers', bsrTop: '3,410', bsrTopCat: 'Home & Kitchen' },
      { sku: 'VER-GL-04', name: 'Verre 双层玻璃杯', brand: 'Verre', shop: 'Lumo Home', bu: '家居 BU', category: '餐厨 / 杯具',
        asin: 'B0BQ8ZM6KV', owner: '苏敏', stars: '4.7', reviews: '3,860', price: '$26.00', ps: '212', stock: '860', stockNote: '约 4 天 · 需补货',
        bsr: '7', bsrCat: 'Drinking Glasses', bsrTop: '946', bsrTopCat: 'Home & Kitchen' },
      { sku: 'NUV-SP-07', name: 'Nuvia 口服胶囊', brand: 'Nuvia', shop: 'Nuvia Wellness', bu: '健康 BU', category: '膳食补充 / 胶囊',
        asin: 'B0DFH3P7YS', owner: '林浩', stars: '4.1', reviews: '524', price: '$39.00', ps: '38', stock: '3,300', stockNote: '约 87 天',
        bsr: '186', bsrCat: 'Hair Supplements', bsrTop: '14,520', bsrTopCat: 'Health & Household' }
    ];
    const skuDbMore = [
      { sku: 'RYZ-SC-03', name: 'Ryze 头皮按摩梳', brand: 'Ryze', shop: 'Ryze Official US', bu: '个护 BU', category: '个护家电 / 头皮护理',
        asin: 'B0DK2M7X4L', owner: '陈曦', stars: '4.5', reviews: '742', price: '$29.90', ps: '96', stock: '2,480', stockNote: '约 26 天', bsr: '34', bsrCat: 'Scalp Massagers', bsrTop: '4,120', bsrTopCat: 'Beauty & Personal Care' },
      { sku: 'RYZ-HD-11', name: 'Ryze 负离子吹风机', brand: 'Ryze', shop: 'Ryze Official US', bu: '个护 BU', category: '个护家电 / 美发',
        asin: 'B0CJ8L5RN2', owner: '陈曦', stars: '4.2', reviews: '1,318', price: '$89.90', ps: '62', stock: '1,140', stockNote: '约 18 天', bsr: '96', bsrCat: 'Hair Dryers', bsrTop: '8,640', bsrTopCat: 'Beauty & Personal Care' },
      { sku: 'RYZ-FC-05', name: 'Ryze 洁面仪', brand: 'Ryze', shop: 'Ryze Official US', bu: '个护 BU', category: '个护家电 / 清洁',
        asin: 'B0BX9T2QM7', owner: '苏敏', stars: '4.0', reviews: '486', price: '$39.90', ps: '41', stock: '3,620', stockNote: '约 88 天', bsr: '148', bsrCat: 'Facial Cleansing Brushes', bsrTop: '19,240', bsrTopCat: 'Beauty & Personal Care' },
      { sku: 'LUM-AR-05', name: 'Lumo 车载香氛', brand: 'Lumo', shop: 'Lumo Home', bu: '家居 BU', category: '家居香氛 / 车载',
        asin: 'B0D7YW3KP9', owner: '林浩', stars: '4.4', reviews: '926', price: '$19.90', ps: '178', stock: '4,860', stockNote: '约 27 天', bsr: '19', bsrCat: 'Car Air Fresheners', bsrTop: '2,180', bsrTopCat: 'Automotive' },
      { sku: 'LUM-CD-08', name: 'Lumo 香薰蜡烛礼盒', brand: 'Lumo', shop: 'Lumo Home', bu: '家居 BU', category: '家居香氛 / 蜡烛',
        asin: 'B0C4HN8VT3', owner: '林浩', stars: '4.6', reviews: '2,140', price: '$42.00', ps: '124', stock: '1,920', stockNote: '约 15 天', bsr: '23', bsrCat: 'Jar Candles', bsrTop: '1,640', bsrTopCat: 'Home & Kitchen' },
      { sku: 'LUM-HM-12', name: 'Lumo 加湿器', brand: 'Lumo', shop: 'Lumo Home', bu: '家居 BU', category: '家居电器 / 加湿',
        asin: 'B0BM5J9WQX', owner: '苏敏', stars: '4.1', reviews: '1,684', price: '$54.00', ps: '88', stock: '740', stockNote: '约 8 天 · 需补货', bsr: '112', bsrCat: 'Humidifiers', bsrTop: '9,320', bsrTopCat: 'Home & Kitchen' },
      { sku: 'VER-GL-06', name: 'Verre 咖啡杯组', brand: 'Verre', shop: 'Lumo Home', bu: '家居 BU', category: '餐厨 / 杯具',
        asin: 'B0CQ7R4LZ8', owner: '苏敏', stars: '4.5', reviews: '1,240', price: '$34.00', ps: '146', stock: '2,260', stockNote: '约 15 天', bsr: '18', bsrCat: 'Coffee Cups', bsrTop: '1,920', bsrTopCat: 'Home & Kitchen' },
      { sku: 'VER-BT-09', name: 'Verre 保温瓶', brand: 'Verre', shop: 'Lumo Home', bu: '家居 BU', category: '餐厨 / 水具',
        asin: 'B0D2K8YM5W', owner: '林浩', stars: '4.3', reviews: '812', price: '$28.00', ps: '104', stock: '3,180', stockNote: '约 31 天', bsr: '62', bsrCat: 'Water Bottles', bsrTop: '5,410', bsrTopCat: 'Sports & Outdoors' },
      { sku: 'VER-PL-02', name: 'Verre 分隔餐盘', brand: 'Verre', shop: 'Lumo Home', bu: '家居 BU', category: '餐厨 / 餐具',
        asin: 'B0BF3XQ7NV', owner: '苏敏', stars: '4.2', reviews: '396', price: '$22.00', ps: '58', stock: '4,420', stockNote: '约 76 天', bsr: '204', bsrCat: 'Dinner Plates', bsrTop: '22,840', bsrTopCat: 'Home & Kitchen' },
      { sku: 'NUV-SP-09', name: 'Nuvia 胶原饮', brand: 'Nuvia', shop: 'Nuvia Wellness', bu: '健康 BU', category: '膳食补充 / 饮品',
        asin: 'B0DH9K2LT6', owner: '林浩', stars: '4.0', reviews: '318', price: '$46.00', ps: '52', stock: '2,140', stockNote: '约 41 天', bsr: '142', bsrCat: 'Collagen Supplements', bsrTop: '11,260', bsrTopCat: 'Health & Household' },
      { sku: 'NUV-SL-03', name: 'Nuvia 睡眠软糖', brand: 'Nuvia', shop: 'Nuvia Wellness', bu: '健康 BU', category: '膳食补充 / 软糖',
        asin: 'B0C8M4RW7P', owner: '陈曦', stars: '4.4', reviews: '1,486', price: '$24.00', ps: '196', stock: '5,240', stockNote: '约 27 天', bsr: '46', bsrCat: 'Melatonin Supplements', bsrTop: '3,180', bsrTopCat: 'Health & Household' },
      { sku: 'AURA-LP-01', name: 'Aura 落地氛围灯', brand: 'Aura', shop: 'Aura Living', bu: '家居 BU', category: '照明 / 氛围灯',
        asin: 'B0DL5N8XQ2', owner: '陈曦', stars: '4.6', reviews: '2,860', price: '$59.90', ps: '168', stock: '1,680', stockNote: '约 10 天', bsr: '9', bsrCat: 'Floor Lamps', bsrTop: '812', bsrTopCat: 'Tools & Home Improvement' },
      { sku: 'AURA-DK-04', name: 'Aura 桌面台灯', brand: 'Aura', shop: 'Aura Living', bu: '家居 BU', category: '照明 / 台灯',
        asin: 'B0BW6Q3JM9', owner: '苏敏', stars: '4.3', reviews: '1,024', price: '$36.00', ps: '112', stock: '2,940', stockNote: '约 26 天', bsr: '52', bsrCat: 'Desk Lamps', bsrTop: '4,260', bsrTopCat: 'Tools & Home Improvement' },
      { sku: 'PACE-YM-02', name: 'Pace 瑜伽垫', brand: 'Pace', shop: 'Pace Active', bu: '运动 BU', category: '运动 / 瑜伽',
        asin: 'B0CT8L2VK5', owner: '林浩', stars: '4.5', reviews: '1,742', price: '$44.00', ps: '92', stock: '1,320', stockNote: '约 14 天', bsr: '38', bsrCat: 'Yoga Mats', bsrTop: '2,940', bsrTopCat: 'Sports & Outdoors' },
      { sku: 'PACE-RB-07', name: 'Pace 阻力带套装', brand: 'Pace', shop: 'Pace Active', bu: '运动 BU', category: '运动 / 训练',
        asin: 'B0BH4M9TQ8', owner: '苏敏', stars: '4.2', reviews: '628', price: '$18.90', ps: '74', stock: '6,180', stockNote: '约 83 天', bsr: '124', bsrCat: 'Resistance Bands', bsrTop: '10,480', bsrTopCat: 'Sports & Outdoors' }
    ];
    const skuAll = skuDb.concat(skuDbMore).map(p => ({ ...p, image: this.productImageOf(p.sku) }));
    const skuScoreMap = {
      'RYZ-SC-01': 87, 'RYZ-SC-02': 81, 'RYZ-SC-03': 79, 'RYZ-HD-11': 68, 'RYZ-FC-05': 62,
      'LUM-AR-02': 74, 'LUM-AR-05': 71, 'LUM-CD-08': 83, 'LUM-HM-12': 64,
      'VER-GL-04': 58, 'VER-GL-06': 66, 'VER-BT-09': 61, 'VER-PL-02': 49,
      'NUV-SP-07': 41, 'NUV-SP-09': 44, 'NUV-SL-03': 53,
      'AURA-LP-01': 89, 'AURA-DK-04': 72, 'PACE-YM-02': 76, 'PACE-RB-07': 57
    };
    const skuPrio = {
      'RYZ-SC-01': 'P0', 'RYZ-SC-02': 'P1', 'RYZ-SC-03': 'P1', 'RYZ-HD-11': 'K1', 'RYZ-FC-05': 'K2',
      'LUM-AR-02': 'P1', 'LUM-AR-05': 'P2', 'LUM-CD-08': 'P0', 'LUM-HM-12': 'K1',
      'VER-GL-04': 'P2', 'VER-GL-06': 'P2', 'VER-BT-09': 'K1', 'VER-PL-02': 'K2',
      'NUV-SP-07': 'K2', 'NUV-SP-09': 'K2', 'NUV-SL-03': 'K0',
      'AURA-LP-01': 'P0', 'AURA-DK-04': 'P1', 'PACE-YM-02': 'K0', 'PACE-RB-07': 'K2'
    };
    const prioStyle = {
      P0: ['#FBE3E3', '#C4636D'], P1: ['#FBEEDA', '#A5762C'], P2: ['#F5F8FE', '#647187'],
      K0: ['#E4EEF7', '#1D48D8'], K1: ['#F1F5FF', '#1D48D8'], K2: ['#F5F8FE', '#8792A5']
    };
    const q = (s.skuQuery || '').trim().toUpperCase();
    const productPromotionFilter = s.productPromotionFilter || 'all';
    const selectedProducts = s.productSelection || [];
    const productRows = skuAll
      .map(p => ({ ...p, score: skuScoreMap[p.sku] || 60 }))
      .filter(p => !q || p.sku.toUpperCase().includes(q) || p.name.toUpperCase().includes(q) || p.brand.toUpperCase().includes(q))
      .filter(p => productPromotionFilter === 'all'
        || (productPromotionFilter === 'yes' && (s.promoted || []).includes(p.sku))
        || (productPromotionFilter === 'no' && !(s.promoted || []).includes(p.sku)))
      .sort((a, b) => b.score - a.score)
      .map((p, i) => ({
        ...p, market: 'US', idx: i + 1,
        scoreColor: this.scoreColor(p.score), scoreBg: this.pillBg(p.score),
        starsText: p.stars + ' ★', reviewsText: p.reviews, psText: p.ps,
        prio: skuPrio[p.sku] || 'K2',
        prioBg: (prioStyle[skuPrio[p.sku]] || prioStyle.K2)[0],
        prioFg: (prioStyle[skuPrio[p.sku]] || prioStyle.K2)[1],
        targetStars: '4.5 ★',
        starsColor: Number(p.stars) > 4.5 ? SAGE : Number(p.stars) < 4.5 ? RUST : '#1D2638',
        starsArrow: Number(p.stars) > 4.5 ? '↑' : Number(p.stars) < 4.5 ? '↓' : '',
        bsrText: '#' + p.bsr, bsrTopText: '#' + p.bsrTop,
        asinUrl: 'https://www.amazon.com/dp/' + p.asin,
        stockText: p.stock, stockNoteText: p.stockNote,
        openDrawer: (e) => {
          if (e && e.stopPropagation) e.stopPropagation();
          this.setState({ detailSku: p.sku, productDrawerOpen: true });
        },
        promoted: (s.promoted || []).includes(p.sku),
        promoStatusBg: (s.promoted || []).includes(p.sku) ? '#E4EFE4' : '#F5F8FE',
        promoStatusFg: (s.promoted || []).includes(p.sku) ? '#4E7156' : '#8792A5',
        promoStatusDot: (s.promoted || []).includes(p.sku) ? SAGE : '#B7C0CF',
        promoStatusLabel: (s.promoted || []).includes(p.sku) ? '是' : '否',
        selected: selectedProducts.includes(p.sku),
        selectBg: selectedProducts.includes(p.sku) ? BLUE : '#FFFFFF',
        selectBorder: selectedProducts.includes(p.sku) ? BLUE : '#C8D4E8',
        selectCheck: selectedProducts.includes(p.sku) ? '✓' : '',
        rowBg: selectedProducts.includes(p.sku) ? '#F7F9FF' : '#FFFFFF',
        toggleSelected: (e) => {
          if (e && e.stopPropagation) e.stopPropagation();
          this.setState(st => ({
            productSelection: (st.productSelection || []).includes(p.sku)
              ? st.productSelection.filter(x => x !== p.sku)
              : [...(st.productSelection || []), p.sku]
          }));
        }
      }));
    const pTab = s.prodTab || 'lib';
    const pTabs = [
      { id: 'lib', label: '产品库', note: '20 条 SKU · 经营现状与营销得分' },
      { id: 'gmv', label: '红人 GMV 概况', note: '红人带货 GMV 与效率' },
      { id: 'anomaly', label: '产品异动分析', note: 'AI 预警与机会推荐' }
    ].map(t => {
      const on = t.id === pTab;
      return {
        ...t, on, bg: on ? '#2457F5' : 'transparent', bd: on ? '#2457F5' : 'transparent',
        fg: on ? '#FFFFFF' : '#647187', noteFg: on ? '#FFFFFF' : '#8792A5',
        pick: () => this.setState({ prodTab: t.id, productDrawerOpen: false })
      };
    });
    const gmvCalc = (() => {
      const per = s.gmvPeriod || 'quarter';
      const mult = per === 'month' ? 0.34 : (per === 'year' ? 2.6 : 1);
      const base = [
        { sku: 'RYZ-SC-01', name: 'Ryze 头皮按摩仪', gmv: 41800, share: 34, orders: 862, creators: 9, roas: 3.6, trend: '↑ 环比 +28%' },
        { sku: 'LUM-AR-02', name: 'Lumo 便携香氛机', gmv: 12400, share: 19, orders: 388, creators: 4, roas: 2.4, trend: '↑ 环比 +11%' },
        { sku: 'AURA-LP-01', name: 'Aura 落地氛围灯', gmv: 7600, share: 12, orders: 152, creators: 2, roas: 1.9, trend: '→ 基本持平' },
        { sku: 'VER-GL-04', name: 'Verre 双层玻璃杯', gmv: 3100, share: 7, orders: 148, creators: 2, roas: 1.4, trend: '↓ 环比 -9%' },
        { sku: 'NUV-SP-07', name: 'Nuvia 口服胶囊', gmv: 0, share: 0, orders: 0, creators: 0, roas: 0, trend: '未启动' }
      ];
      const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
      const rows = base.map((r, i) => {
        const gmv = Math.round(r.gmv * mult);
        const trendBad = /↓/.test(r.trend), trendFlat = /→|未启动/.test(r.trend);
        return {
          idx: i + 1, name: r.name, sku: r.sku, rowBg: i % 2 === 1 ? '#FFFFFF' : '#FFFFFF',
          gmv: gmv ? money(gmv) : '—',
          sharePct: r.share, shareColor: r.share >= 25 ? SAGE : (r.share >= 10 ? AMBER : '#B7C0CF'),
          orders: Math.round(r.orders * mult) || '—',
          creators: r.creators || '—',
          ordersCreators: r.orders ? (Math.round(r.orders * mult).toLocaleString('en-US') + ' 单 · ' + r.creators + ' 位') : '—',
          ordersText: r.orders ? Math.round(r.orders * mult).toLocaleString('en-US') : '—',
          creatorsText: r.creators ? String(r.creators) : '—',
          roas: r.roas ? r.roas.toFixed(1) + 'x' : '—',
          roasColor: r.roas >= 3 ? '#4E7156' : (r.roas >= 2 ? '#A5762C' : (r.roas ? '#C4636D' : '#A2ABBA')),
          trend: r.trend,
          trendBg: trendBad ? '#FBE3E3' : (trendFlat ? '#F5F8FE' : '#E4EFE4'),
          trendFg: trendBad ? '#C4636D' : (trendFlat ? '#647187' : '#4E7156')
        };
      });
      const total = base.reduce((t, r) => t + r.gmv, 0) * mult;
      const totalOrders = base.reduce((t, r) => t + r.orders, 0) * mult;
      const activeCreators = base.reduce((t, r) => t + r.creators, 0);
      const kpis = [
        { label: '红人带货 GMV', value: money(total), note: '归因窗口 30 天', color: '#4E7156' },
        { label: '订单数', value: Math.round(totalOrders).toLocaleString('en-US'), note: '折扣码 + 短链归因', color: '#1D2638' },
        { label: '客单价', value: '$' + (totalOrders ? (total / totalOrders).toFixed(1) : '0'), note: '红人渠道均值', color: '#1D2638' },
        { label: '带货红人数', value: String(activeCreators), note: '有成交的红人', color: '#1D2638' }
      ];
      const top = base.slice().sort((a, b) => b.gmv - a.gmv)[0];
      const weak = base.filter(r => r.gmv > 0).sort((a, b) => a.roas - b.roas)[0];
      const note = top.name + ' 占红人渠道 GMV 的 ' + Math.round(top.gmv / (base.reduce((t, r) => t + r.gmv, 0) || 1) * 100) + '%（注意与表内「占该产品销售」口径不同），ROAS ' + top.roas.toFixed(1) + 'x，建议把预算继续向它的 KOC 池集中；'
        + weak.name + ' 的 ROAS 仅 ' + weak.roas.toFixed(1) + 'x，建议先改内容角度再决定是否加投；Nuvia 口服胶囊尚未启动，需先补齐合规证据。';
      return { rows, kpis, note };
    })();

    // ── 产品异动 AI 分析 ──
    const anomalyDefs = [
      { kind: 'alert', sku: 'RYZ-HD-11', title: '星级 7 天内从 4.4 掉到 4.2', detail: '新增 42 条 review 中有 11 条提到「用两周后风力变小」。这是同一批次的集中反馈，不是随机波动。',
        action: '暂停该 SKU 的红人排期', impact: '影响 2 位已寄样红人 · 建议先冻结内容发布' },
      { kind: 'alert', sku: 'VER-GL-04', title: '库存仅剩 860 件，约 4 天售罄', detail: 'RPS14 212 件/天且仍在上升，但补货未到港。种草放量会把流量导向缺货页面。',
        action: '暂缓推广并确认补货', impact: '断货期间的种草流量转化会归零' },
      { kind: 'rise', sku: 'AURA-LP-01', title: '新品上架 3 周冲到 BSR #9', detail: '无广告投入，自然流量为主，评论里高频出现「租房也能装」。这是市场自己给出的切角。',
        action: '优先生成推广策略', impact: '营销得分 89，是当前最高的产品' },
      { kind: 'rise', sku: 'NUV-SL-03', title: 'RPS14 两周内从 118 涨到 196', detail: '睡眠软糖在同类目里逆势增长，且退货率低于品类均值 3.1pt，说明复购基础好。',
        action: '加入观察名单', impact: '合规风险仍需人工确认后再启动种草' },
      { kind: 'watch', sku: 'LUM-HM-12', title: '客单价上调后 RPS14 下滑 18%', detail: '$49 涨到 $54 后出单明显走弱，但星级与 review 没有变化，判断是价格弹性问题而非质量问题。',
        action: '回调价格或加赠品', impact: '建议先做定价测试，再决定是否投入种草' }
    ];
    const anomalies = anomalyDefs.map(a => {
      const p = skuAll.find(x => x.sku === a.sku) || {};
      const meta = { alert: ['预警', RUST, '#FBE3E3'], rise: ['机会', SAGE, '#E4EFE4'], watch: ['观察', AMBER, '#FBEEDA'] }[a.kind];
      const promoted = (s.promoted || []).includes(a.sku);
      return {
        ...a, name: p.name || a.sku, tag: meta[0], color: meta[1], tagBg: meta[2],
        sub: (p.brand || '') + ' · ' + a.sku + ' · ' + (p.owner || '') + ' 负责',
        open: s.anomOpen === a.sku,
        toggleLabel: s.anomOpen === a.sku ? '收起分析' : '展开 AI 分析',
        toggle: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ anomOpen: st.anomOpen === a.sku ? null : a.sku })); },
        actionLabel: promoted ? '✓ 已加入推广' : a.action,
        actionBg: promoted ? '#E4EFE4' : '#FFFFFF', actionFg: promoted ? '#4E7156' : '#647187',
        actionBd: promoted ? '#CFE3D3' : '#E2E8F2',
        act: () => this.setState(st => ({
          promoted: st.promoted.includes(a.sku) ? st.promoted : [...st.promoted, a.sku]
        }))
      };
    });
    const anomalySummary = (() => {
      const counts = {};
      anomalies.forEach(a => { counts[a.tag] = (counts[a.tag] || 0) + 1; });
      const parts = Object.keys(counts).map(k => counts[k] + ' 条' + k);
      return anomalies.length + ' 条异动 · ' + parts.join(' · ');
    })();

    const productCount = productRows.length;
    const productEmpty = productCount === 0;
    const productVisibleSkus = productRows.map(p => p.sku);
    const selectedProductCount = selectedProducts.length;
    const allVisibleProductsSelected = productVisibleSkus.length > 0 && productVisibleSkus.every(sku => selectedProducts.includes(sku));
    const productActionEnabled = selectedProductCount > 0;

    const skuQuery = (s.skuQuery || '').trim().toUpperCase();
    const skuHit = skuDb.find(p => p.sku.toUpperCase() === skuQuery)
      || (skuQuery.length >= 3 ? skuDb.find(p => p.sku.toUpperCase().includes(skuQuery) || p.name.toUpperCase().includes(skuQuery)) : null);
    const skuFields = skuHit ? [
      { label: '市场', value: 'US' },
      { label: '品牌', value: skuHit.brand }, { label: '店铺', value: skuHit.shop },
      { label: 'BU', value: skuHit.bu }, { label: '品类', value: skuHit.category },
      { label: '运营专员', value: skuHit.owner },
      { label: 'SKU', value: skuHit.sku },
      { label: 'ASIN', value: skuHit.asin, link: 'https://www.amazon.com/dp/' + skuHit.asin },
      { label: '星级', value: skuHit.stars + ' ★' },
      { label: 'Review 数量', value: skuHit.reviews + ' 条' },
      { label: '客单价', value: skuHit.price }, { label: 'RPS14', value: skuHit.ps + ' 件' },
      { label: 'BSR 位置', value: '#' + skuHit.bsr, note: skuHit.bsrCat },
      { label: '大类排名', value: '#' + skuHit.bsrTop, note: skuHit.bsrTopCat },
      { label: '库存', value: skuHit.stock + ' 件', note: skuHit.stockNote }
    ].map(f => ({ ...f, plain: !f.link })) : [];
    const skuScores = { 'RYZ-SC-01': 87, 'RYZ-SC-02': 81, 'LUM-AR-02': 74, 'VER-GL-04': 58, 'NUV-SP-07': 41 };
    const skuDimSets = {
      'RYZ-SC-01': [9, 8, 8, 9, 9, 8, 7, 8, 6, 7], 'RYZ-SC-02': [9, 7, 7, 8, 9, 7, 8, 7, 6, 7],
      'LUM-AR-02': [8, 7, 6, 8, 8, 8, 7, 7, 8, 7], 'VER-GL-04': [7, 4, 4, 6, 6, 7, 5, 5, 9, 6],
      'NUV-SP-07': [3, 5, 4, 5, 5, 6, 8, 3, 2, 5]
    };
    const dimNames = ['视觉展示力', '讲述性', '差异化', '情绪价值', '场景明确度', '试用便利性', '毛利承载力', '社交传播性', '合规风险', '转化链路'];
    const dimHints = ['是否容易通过短视频/图片展示', '红人是否容易讲出故事和体验', '是否有清晰区别于竞品的卖点',
      '是否能激发身份、审美、愉悦、安全感等情绪', '是否有明确使用场景', '是否适合寄样、试用、开箱',
      '是否能覆盖佣金、寄样、内容成本', '是否适合被分享、讨论、模仿', '是否涉及医疗、功效、金融、敏感 claims', '用户看完内容后是否容易购买'];
    const skuScore = skuHit ? (skuScores[skuHit.sku] || 60) : 0;
    const skuScoreColor = this.scoreColor(skuScore);
    const skuDims = skuHit ? (skuDimSets[skuHit.sku] || dimNames.map(() => 6)).map((v, i) => ({
      label: dimNames[i], hint: dimHints[i], score: v + '/10', pct: v * 10,
      color: v >= 8 ? SAGE : v >= 6 ? AMBER : RUST
    })) : [];
    const skuSuggestions = skuDb.map(p => ({
      label: p.sku, pick: () => this.setState({ skuQuery: p.sku }),
      ...this.pillOn(skuHit && skuHit.sku === p.sku)
    }));

    const rawProducts = [
      { name: 'Ryze 头皮按摩仪', sku: 'RYZ-SC-01', category: '个护家电', price: '$49.90', margin: '62%', fit: 87, meta: '个护家电 · $49.90 · 毛利 62%' },
      { name: 'Lumo 便携香氛机', sku: 'LUM-AR-02', category: '家居香氛', price: '$32.00', margin: '58%', fit: 74, meta: '家居香氛 · $32.00 · 毛利 58%' },
      { name: 'Verre 双层玻璃杯', sku: 'VER-GL-04', category: '餐厨', price: '$26.00', margin: '51%', fit: 58, meta: '餐厨 · $26.00 · 毛利 51%' },
      { name: 'Nuvia 口服胶囊', sku: 'NUV-SP-07', category: '膳食补充', price: '$39.00', margin: '70%', fit: 41, meta: '膳食补充 · $39.00 · 合规风险高' }
    ];
    const products = rawProducts.map(p => ({
      ...p, color: this.scoreColor(p.fit), pillBg: this.pillBg(p.fit), priority: this.priority(p.fit),
      open: this.go('productDetail')
    }));

    const dimDefs = [['视觉展示力', 9], ['讲述性', 8], ['差异化', 8], ['情绪价值', 9], ['场景明确度', 9],
      ['试用便利性', 8], ['毛利承载力', 7], ['社交传播性', 8], ['合规风险', 6], ['转化链路', 7]];

    const detail = skuAll.find(p => p.sku === s.detailSku) || skuAll[0];
    const dFit = skuScoreMap[detail.sku] || 60;
    const dDimVals = skuDimSets[detail.sku] || dimNames.map((_, i) => {
      const base = Math.max(2, Math.min(10, Math.round(dFit / 10)));
      return Math.max(2, Math.min(10, base + [1, 0, -1, 1, 0, 1, -1, 0, -1, 0][i]));
    });
    const descMap = {
      'RYZ-SC-01': '无线防水头皮按摩仪，四组硅胶触头 + 三档节律。北美主打「洗头这三分钟属于我自己」的自我照护叙事。',
      'AURA-LP-01': '可调色温的落地氛围灯，主打「回家先开这盏灯」的情绪切换，是本季度营销得分最高的产品。',
      'LUM-CD-08': '三支装香薰蜡烛礼盒，礼赠属性强，适合红人做拆盒与氛围场景内容。'
    };
    const dNarrative = {
      'RYZ-SC-01': '值得做，而且适合以 KOC 与 micro 为主力铺量。这个产品的优势不在功能参数，而在「过程可被拍摄」——洗头、按压、放松的画面天然适合 15–30 秒短视频，且不需要红人解释技术原理。建议第一轮不追求转化，先用 30 位 KOC 把「自我照护三分钟」这个说法打出来。',
      'AURA-LP-01': '这是当前最值得投入的产品。落地灯的「开灯前后」是天然的转场素材，且家居类红人本就在拍房间，植入成本几乎为零。建议直接给到 15 位家居 micro 做房间改造内容，而不是开箱。',
      'LUM-CD-08': '值得做，切角是礼赠而不是香味。蜡烛的香味无法通过屏幕传达，但拆礼盒的仪式感可以。建议在 Q4 送礼季前 6 周启动，内容形式以「送给谁」为主线。'
    };
    const dReasons = {
      'RYZ-SC-01': [
        '使用过程有明显的手部动作与情绪反应，短视频前 3 秒抓人成本低。',
        '$49.90 + 62% 毛利可以承载寄样 + 10–15% 佣金，无需大额固定费用。',
        '同类目竞品仍在讲「多少赫兹」，情绪化叙事仍是空位。'
      ],
      'AURA-LP-01': [
        'BSR #9（Floor Lamps）与 2,860 条 review 已有基础，种草流量能被稳定承接。',
        '开灯前后的画面对比强，红人不需要额外布景。',
        '$59.90 客单价与 4.6 星评价支撑得住 micro 层级的固定费合作。'
      ]
    };
    const dContent = {
      '个护家电': ['开箱', '睡前 routine', '场景短剧', '前后对比'],
      '家居香氛': ['房间氛围', '拆礼盒', '好物清单'],
      '家居电器': ['房间改造', '使用实测', '好物清单'],
      '照明': ['房间改造', '开灯前后', '氛围 vlog'],
      '餐厨': ['餐桌摆拍', '日常使用', '好物清单'],
      '运动': ['跟练', '器材实测', '身体变化记录'],
      '膳食补充': ['成分讲解', '日常服用记录', '医生/专业背书']
    };
    const dBuPeers = skuAll.filter(p => p.bu === detail.bu).map(p => skuScoreMap[p.sku] || 60);
    const dBuMean = Math.round(dBuPeers.reduce((a, b) => a + b, 0) / Math.max(1, dBuPeers.length));
    const dFitNote = dFit === dBuMean ? '/ 100 · 与' + detail.bu + '均值持平'
      : '/ 100 · ' + (dFit > dBuMean ? '高于' : '低于') + detail.bu + '均值 ' + Math.abs(dFit - dBuMean) + ' 分';

    const pd = {
      name: detail.name, fitNote: dFitNote, fit: dFit, color: this.scoreColor(dFit), pillBg: this.pillBg(dFit), priority: this.priority(dFit),
      desc: descMap[detail.sku] || (detail.brand + ' 旗下' + detail.category.split(' / ')[1] + '产品，US 站在售，由' + detail.owner + '负责运营。当前 BSR #' + detail.bsr + '（' + detail.bsrCat + '），日均出单 ' + detail.ps + ' 件。'),
      stats: [{ label: '售价', value: detail.price }, { label: '星级', value: detail.stars + ' ★ · ' + detail.reviews + ' 条' }, { label: '市场 / BU', value: 'US · ' + detail.bu }, { label: '运营专员', value: detail.owner }],
      dims: dDimVals.map((sc, i) => ({ label: dimNames[i], score: sc + '/10', pct: sc * 10, color: sc >= 8 ? SAGE : sc >= 6 ? AMBER : RUST })),
      aiVerdict: (() => {
        const v = dNarrative[detail.sku];
        if (v) return v;
        if (dFit >= 75) return '值得做，建议以 KOC 铺量为主。' + detail.name + ' 的' + (dDimVals[0] >= 8 ? '使用画面天生适合短视频，' : '') + '情绪与场景都清晰，红人不需要解释参数就能讲明白。第一轮建议不追转化，先把说法打出来。';
        if (dFit >= 55) return '可以做，但要挑人。' + detail.name + ' 的内容可拍性中等，' + (dDimVals[2] <= 5 ? '差异化偏弱，' : '') + '建议先用 5–8 位红人小规模验证角度，再决定是否铺量。';
        return '暂不建议投入红人预算。' + detail.name + '在' + (dDimVals[8] <= 4 ? '合规风险' : '内容可拍性') + '上得分偏低，' + (dDimVals[8] <= 4 ? '功效类表述限制会让红人难以自然讲述。' : '短视频很难在 3 秒内呈现价值。') + '建议先优化详情页与评论，再考虑种草。';
      })(),
      reasons: (() => {
        const v = dReasons[detail.sku];
        if (v) return v;
        const out = [];
        out.push(dDimVals[0] >= 8 ? '使用过程有明显的画面变化，短视频前 3 秒抓人成本低。' : '静态展示为主，需要红人自己设计画面，内容成本更高。');
        out.push(detail.price + ' 的客单价' + (dDimVals[6] >= 7 ? '可以承载寄样 + 10–15% 佣金，无需大额固定费用。' : '偏低，扣掉寄样与佣金后利润空间紧张。'));
        out.push('当前 BSR #' + detail.bsr + '（' + detail.bsrCat + '），星级 ' + detail.stars + '，' + (Number(detail.stars) >= 4.4 ? '评价基础足以承接种草带来的流量。' : '评价基础偏弱，建议先补评再放量。'));
        return out;
      })(),
      recs: [
        { label: '推荐平台', items: dDimVals[0] >= 8 ? ['TikTok US（主）', 'Instagram Reels', 'YouTube Shorts'] : ['Instagram（主）', 'TikTok US', '亚马逊站内视频'] },
        { label: '推荐红人层级', items: dFit >= 75 ? ['Nano 45%', 'Micro 35%', 'Mid-tier 15%', 'Macro 5%'] : dFit >= 55 ? ['Nano 30%', 'Micro 45%', 'Mid-tier 25%'] : ['先小规模测试 5–8 位 Nano'] },
        { label: '推荐内容形式', items: dContent[detail.category.split(' / ')[0]] || ['开箱', '场景植入', '前后对比'] }
      ],
      risks: (() => {
        const out = [];
        if (dDimVals[8] <= 5) out.push({ title: '功效表述风险', color: dDimVals[8] <= 3 ? RUST : AMBER, body: detail.category.indexOf('膳食') >= 0 ? '不得出现疗效、治疗类表述，红人内容需逐条过合规审核。' : '不得出现功效性 claim，Brief 需自动加入禁用词。' });
        if (dDimVals[6] <= 6) out.push({ title: '毛利承载力不足', color: AMBER, body: detail.price + ' 的客单价扣掉寄样与佣金后空间有限，建议以纯佣金或寄样合作为主。' });
        if (dDimVals[2] <= 5) out.push({ title: '差异化不明显', color: AMBER, body: '同类目竞品密集，红人很难讲出「为什么是这一款」，需要在 Brief 里给到明确对比点。' });
        if (detail.stockNote.indexOf('需补货') >= 0) out.push({ title: '库存风险', color: RUST, body: '当前库存仅 ' + detail.stock + ' 件（' + detail.stockNote + '），种草放量前需先确认补货节奏。' });
        out.push({ title: '归因不完整', color: BLUE, body: '目前只有折扣码归因，TikTok Shop 数据未接入，转化数据置信度中等。' });
        return out.slice(0, 4);
      })()
    };

    const nextActions = [
      { tag: 'BRIEF', tagBg: '#FBEEDA', tagFg: '#A5762C', eta: '约 8 分钟', title: 'Brief v2 有 3 条 AI 建议待处理', why: '合规禁用词与 hook 结构未确认，红人已在等待。', cta: '去 Brief Studio', go: this.go('brief') },
      { tag: 'CRM', tagBg: '#E4EFE4', tagFg: '#4E7156', eta: '约 5 分钟', title: '5 位新红人已算出 Fit Score', why: '其中 2 位 Fit ≥ 85 且报价低于均值，建议尽快锁定。', cta: '去 Influencer CRM', go: this.go('creators') },
      { tag: 'LEARNING', tagBg: '#E4EEF7', tagFg: '#1D48D8', eta: '约 3 分钟', title: 'Q2 复盘结论尚未写入 Q3 策略', why: '「睡前 routine」角度 ROAS 高出 41%，但 Q3 策略仍以开箱为主。', cta: '查看复盘', go: this.go('reports') }
    ];

    // ── Dashboard 汇总层（由各模块真实状态派生）──
    const usd = (n) => '$' + Math.round(n).toLocaleString('en-US');
    const usdK = (n) => '$' + (n / 1000).toFixed(1) + 'K';
    const mil = (n) => n >= 1000000 ? (n / 1000000).toFixed(2) + 'M' : Math.round(n / 1000) + 'K';
    const heroLabels = { month: '本月', quarter: '本季度', year: '本年度' };
    const heroKey = ['month', 'quarter', 'year'].indexOf(s.heroPeriod) >= 0 ? s.heroPeriod : 'quarter';
    const heroTargets = {
      month: { views: 900000, assets: 4, budget: 12000 },
      quarter: { views: 2600000, assets: 12, budget: 40000 },
      year: { views: 9000000, assets: 40, budget: 140000 }
    }[heroKey];
    const expPct = Math.round(facts.views / heroTargets.views * 100);
    const assetPct = Math.round(facts.qualified / heroTargets.assets * 100);
    const budgetPct = Math.round(facts.budget.paid / heroTargets.budget * 100);
    const heroKpis = [
      { label: '进行中种草项目', value: String(facts.projects), unit: '', note: facts.promoted.length ? '含 ' + facts.promoted.length + ' 个由产品库提交' : '暂无新提交产品', color: '#647187' },
      { label: heroLabels[heroKey] + '曝光量完成率', value: String(expPct), unit: '%', note: mil(facts.views) + ' / ' + mil(heroTargets.views), color: expPct >= 60 ? SAGE : AMBER },
      { label: '累计合格素材数', value: String(facts.qualified), unit: '', note: heroLabels[heroKey] + '目标 ' + heroTargets.assets + ' 个 · 完成 ' + assetPct + '%', color: assetPct >= 60 ? SAGE : AMBER },
      { label: '待回收素材', value: String(facts.pending.length), unit: '', note: facts.overdue.length ? facts.overdue.length + ' 个已超交付期' : '全部在期内', color: facts.overdue.length ? RUST : SAGE },
      { label: '平均 CPV', value: '$' + facts.cpv.toFixed(3), unit: '', note: facts.cpv <= 0.012 ? '优于基准 $0.012' : '高于基准 $0.012', color: facts.cpv <= 0.012 ? SAGE : RUST },
      { label: '预算支出', value: usdK(facts.budget.paid), unit: '', note: heroLabels[heroKey] + '预算 ' + usdK(heroTargets.budget) + ' · 已用 ' + budgetPct + '%', color: budgetPct > 90 ? RUST : '#647187' },
      { label: '寄样总数量', value: String(facts.sampleQty), unit: '', note: '在途 ' + facts.inTransit + ' · 已签收 ' + facts.received, color: '#647187' },
      { label: '待回复邮件', value: String(facts.replies.length), unit: '', note: facts.stale.length ? facts.stale.length + ' 封已超 48 小时' : '均在 48 小时内', color: facts.stale.length ? AMBER : SAGE }
    ];
    const heroTabs = ['month', 'quarter', 'year'].map(k => ({
      label: heroLabels[k], pick: () => this.setState({ heroPeriod: k }), ...pillOn(heroKey === k)
    }));

    const fmtCN = (iso) => { const [y, m, d] = iso.split('-'); return Number(m) + '月' + Number(d) + '日'; };
    const goalTargets = {
      month: { label: '本月', sub: '8月 · 20 / 31 天', timePct: 65, assets: 4, views: 900000, gmv: 32000, ugc: 3 },
      quarter: { label: '本季度', sub: 'Q3 · 8月20日', timePct: 47, assets: 12, views: 2600000, gmv: 96000, ugc: 8 },
      year: { label: '本年度', sub: '2026 · 232 / 365 天', timePct: 64, assets: 40, views: 9000000, gmv: 320000, ugc: 26 }
    };
    const mkGoals = (t) => {
      const p = (a, b) => Math.min(200, Math.round(a / Math.max(b, 1) * 100));
      const cpvOkPct = facts.cpv <= 0.012 ? 100 : Math.round(0.012 / Math.max(facts.cpv, 0.0001) * 100);
      return [
        ['合格素材数', facts.qualified + ' / ' + t.assets + ' 个', p(facts.qualified, t.assets), '来自 Asset Library 实际入库'],
        ['曝光数', mil(facts.views) + ' / ' + mil(t.views), p(facts.views, t.views), '按已发布素材累计'],
        ['红人 GMV', usdK(facts.gmv) + ' / ' + usdK(t.gmv), p(facts.gmv, t.gmv), '折扣码与短链归因'],
        ['CPV 达成率', '$' + facts.cpv.toFixed(3) + ' / ≤$0.012', cpvOkPct, facts.cpv <= 0.012 ? '已达标，可加量' : '高于基准，需压成本'],
        ['UGC 授权素材', facts.adReady + ' / ' + t.ugc + ' 个', p(facts.adReady, t.ugc), facts.pendingRights ? facts.pendingRights + ' 条待补授权' : '授权齐备']
      ];
    };
    const periodDefs = {};
    ['month', 'quarter', 'year'].forEach(k => {
      const t = goalTargets[k], g = mkGoals(t);
      periodDefs[k] = { label: t.label, sub: t.sub, timePct: t.timePct, goals: g, overall: Math.round((g[0][2] + g[1][2] + g[2][2] + g[4][2]) / 4) };
    });
    if (s.period === 'custom') {
      const DAY = 86400000;
      const stD = new Date(s.rangeStart + 'T00:00:00'), enD = new Date(s.rangeEnd + 'T00:00:00');
      const today = new Date('2026-08-20T00:00:00');
      const total = Math.max(1, Math.round((enD - stD) / DAY) + 1);
      const elapsed = Math.max(0, Math.min(total, Math.round((today - stD) / DAY) + 1));
      const timePct = Math.round(elapsed / total * 100);
      const inRange = facts.assets.filter(a => a.post >= s.rangeStart && a.post <= s.rangeEnd);
      const num = this.toNumU;
      const rV = inRange.reduce((t2, a) => t2 + num(a.views), 0);
      const rG = inRange.reduce((t2, a) => t2 + a.gmv, 0);
      const rS = inRange.reduce((t2, a) => t2 + a.spend, 0);
      const rQ = inRange.filter(a => parseFloat(a.er) >= 5).length;
      const rA = inRange.filter(a => a.rights === 'ad').length;
      const rC = rV ? rS / rV : 0;
      const scale = total / 92;
      const tg = { assets: Math.max(1, Math.round(12 * scale)), views: Math.round(2600000 * scale), gmv: Math.round(96000 * scale), ugc: Math.max(1, Math.round(8 * scale)) };
      const p = (a, b) => Math.min(200, Math.round(a / Math.max(b, 1) * 100));
      const g = [
        ['合格素材数', rQ + ' / ' + tg.assets + ' 个', p(rQ, tg.assets), '区间内实际入库'],
        ['曝光数', mil(rV) + ' / ' + mil(tg.views), p(rV, tg.views), '区间内已发布素材'],
        ['红人 GMV', usdK(rG) + ' / ' + usdK(tg.gmv), p(rG, tg.gmv), '区间内归因成交'],
        ['CPV 达成率', '$' + rC.toFixed(3) + ' / ≤$0.012', rC && rC <= 0.012 ? 100 : (rC ? Math.round(0.012 / rC * 100) : 100), rC <= 0.012 ? '区间内均达标' : '高于基准'],
        ['UGC 授权素材', rA + ' / ' + tg.ugc + ' 个', p(rA, tg.ugc), '广告可用素材']
      ];
      periodDefs.custom = {
        label: '自定义区间', sub: fmtCN(s.rangeStart) + ' – ' + fmtCN(s.rangeEnd) + ' · ' + elapsed + ' / ' + total + ' 天',
        timePct, overall: Math.round((g[0][2] + g[1][2] + g[2][2] + g[4][2]) / 4), goals: g
      };
    }
    const periodKey = periodDefs[s.period] ? s.period : (s.period === 'custom' ? 'custom' : 'quarter');
    const per = periodDefs[periodKey];
    const periodTabs = ['month', 'quarter', 'year'].map(k => {
      const d = periodDefs[k], on = k === periodKey;
      return {
        label: d.label, timePct: d.timePct, sub: d.sub,
        pick: () => this.setState({ period: k }),
        bg: on ? '#F5F8FE' : '#fff', bd: on ? '#C8D4E8' : '#EEF2F8',
        fg: on ? '#1D2638' : '#647187', barBg: on ? '#1D2638' : '#B7C0CF'
      };
    });
    const goals = per.goals.map(([label, value, pct, note]) => ({
      label, value, pct, note,
      color: pct >= per.timePct ? SAGE : AMBER,
      marker: per.timePct + '%'
    }));
    const periodTimePct = per.timePct, periodOverall = per.overall, periodLabel = per.label, periodSub = per.sub;
    const rangePresets = [
      { label: '本月', a: '2026-08-01', b: '2026-08-31' },
      { label: '上月', a: '2026-07-01', b: '2026-07-31' },
      { label: '近 30 天', a: '2026-07-22', b: '2026-08-20' },
      { label: '本季度', a: '2026-07-01', b: '2026-09-30' },
      { label: '上季度', a: '2026-04-01', b: '2026-06-30' },
      { label: '本年度', a: '2026-01-01', b: '2026-12-31' }
    ].map(p => ({
      label: p.label,
      on: s.period === 'custom' && s.rangeStart === p.a && s.rangeEnd === p.b,
      pick: () => this.setState({ period: 'custom', rangeStart: p.a, rangeEnd: p.b })
    })).map(p => ({ ...p, bg: p.on ? '#2457F5' : '#FFFFFF', fg: p.on ? '#FFFFFF' : '#647187', bd: p.on ? '#2457F5' : '#E2E8F2' }));
    const periodGapNote = per.overall >= per.timePct
      ? '整体完成 ' + per.overall + '%，领先时间进度 ' + (per.overall - per.timePct) + 'pt。'
      : '整体完成 ' + per.overall + '%，滞后时间进度 ' + (per.timePct - per.overall) + 'pt。';

    const funnelStages = ['建联数量', '收到回复', '达成合作', '已寄样', '交付初稿', '已发布', '进入投放'];
    const funnelTargetBase = [24, 11, 9, 8, 7, 6, 4];
    const funnelTargetMul = { month: 1, quarter: 2.6, year: 8.6, custom: 1 };
    const funnelBase = (() => {
      const set = (arr) => { const m = {}; arr.forEach(h => { if (h) m[h] = 1; }); return m; };
      const keys = (m) => Object.keys(m);
      const reached = set([].concat(
        (s.contactLog || []).map(c => c.handle),
        this.INBOX_REPLIES.map(r => r.handle),
        facts.assets.map(a => a.handle),
        facts.pending.map(p => p.handle),
        ['@quietmornings', '@thecalmedit', '@homewithtess', '@scalp.school', '@lena.unwinds', '@hairdays.co', '@thegroomguide']
      ));
      const replied = set([].concat(this.INBOX_REPLIES.map(r => r.handle), (s.repliedTo || []), facts.assets.map(a => a.handle)).filter(h => reached[h]));
      const coop = set([].concat(facts.coop, facts.assets.map(a => a.handle), facts.pending.map(p => p.handle)).filter(h => replied[h]));
      // 寄样：真实寄样单 + 寄样置换型已交付红人（与人员榜单同一口径）
      const shipped = set([].concat(
        (s.shipOrders || []).map(o => o.handle),
        facts.assets.filter(a => a.spend === 0).map(a => a.handle),
        facts.pending.map(p => p.handle)
      ).filter(h => coop[h]));
      // 交付初稿：必须已寄样或为纯付费合作，且有素材或在待回收清单内
      const drafted = set([].concat(
        facts.assets.map(a => a.handle),
        facts.pending.map(p => p.handle)
      ).filter(h => coop[h]));
      const published = set(facts.assets.map(a => a.handle).filter(h => drafted[h]));
      const running = set(facts.assets.filter(a => a.rights === 'ad').map(a => a.handle).filter(h => published[h]));
      const raw = [reached, replied, coop, shipped, drafted, published, running].map(m => keys(m).length);
      // 交付初稿不应超过已寄样（寄样口径已含纯付费合作）
      return raw.map((n, i) => i === 0 ? n : Math.min(n, raw[i - 1]));
    })();
    const funnelDefs = {
      month: { label: '本月', sub: '8月 1–20 日', counts: funnelBase, ctx: '数据来自 Influencer CRM 邮件记录、寄样单与 Asset Library 实际入库。' },
      quarter: { label: '本季度', sub: 'Q3 累计', counts: funnelBase.map((n, i) => n + [24, 9, 5, 5, 4, 4, 2][i]), ctx: '含 Q3 已复盘的两轮合作，口径与本月一致。' },
      year: { label: '本年度', sub: '2026 累计', counts: funnelBase.map((n, i) => n + [96, 38, 22, 21, 18, 17, 9][i]), ctx: '全年累计，含上半年已结项的 6 个 Campaign。' }
    };
    const funnelKey = funnelDefs[s.funnelPeriod] ? s.funnelPeriod : 'quarter';
    const fdef = funnelDefs[funnelKey];
    const fTgtMul = funnelTargetMul[funnelKey] || 1;
    const funnel = fdef.counts.map((n, i) => {
      const prev = i === 0 ? n : fdef.counts[i - 1];
      const rate = i === 0 ? 100 : Math.round(n / prev * 1000) / 10;
      const target = Math.max(1, Math.round(funnelTargetBase[i] * fTgtMul));
      const pct = Math.min(140, Math.round(n / target * 100));
      const benchRate = i === 0 ? 100 : Math.round(funnelTargetBase[i] / funnelTargetBase[i - 1] * 100);
      return {
        label: funnelStages[i],
        value: n.toLocaleString('en-US') + ' / ' + target.toLocaleString('en-US') + ' 位',
        rate: pct + '%',
        pct: Math.min(100, pct),
        rateColor: pct >= 80 ? SAGE : pct >= 50 ? AMBER : RUST,
        note: i === 0
          ? '漏斗基数 · 已完成目标 ' + pct + '%（目标 ' + target + ' 位）'
          : '单步转化 ' + rate + '%（基准 ' + benchRate + '%）· ' + prev.toLocaleString('en-US') + ' 位中转化 ' + n.toLocaleString('en-US') + ' 位'
            + ' · ' + (rate >= benchRate ? '优于基准' : '低于基准')
      };
    });
    let worstIdx = 1, worstRatio = 2;
    fdef.counts.forEach((n, i) => { if (i > 0) { const r = n / fdef.counts[i - 1]; if (r < worstRatio) { worstRatio = r; worstIdx = i; } } });
    const funnelNote = '最大漏损在「' + funnelStages[worstIdx - 1] + ' → ' + funnelStages[worstIdx] + '」（'
      + (Math.round(worstRatio * 1000) / 10) + '%）。' + fdef.ctx;
    const funnelTabs = ['month', 'quarter', 'year'].map(k => {
      const on = k === funnelKey;
      const cs = funnelDefs[k].counts;
      const tm = funnelTargetMul[k] || 1;
      const tgt = Math.max(1, Math.round(funnelTargetBase[0] * tm));
      const conv = Math.min(100, Math.round(cs[0] / tgt * 100));
      return {
        label: funnelDefs[k].label, pick: () => this.setState({ funnelPeriod: k }),
        convPct: conv, sub: '建联 ' + cs[0].toLocaleString('en-US') + ' / ' + tgt.toLocaleString('en-US') + ' · 投放 ' + cs[cs.length - 1].toLocaleString('en-US'),
        barBg: on ? '#2457F5' : '#C8D4E8',
        bg: on ? '#EAF0FF' : '#FFFFFF', fg: on ? '#2457F5' : '#647187', bd: on ? '#2457F5' : '#E2E8F2'
      };
    });
    const funnelSub = fdef.sub;
    const funnelPresets = [
      { label: '本月', a: '2026-08-01', b: '2026-08-31' },
      { label: '上月', a: '2026-07-01', b: '2026-07-31' },
      { label: '近 30 天', a: '2026-07-22', b: '2026-08-20' },
      { label: '本季度', a: '2026-07-01', b: '2026-09-30' },
      { label: '上季度', a: '2026-04-01', b: '2026-06-30' },
      { label: '本年度', a: '2026-01-01', b: '2026-12-31' }
    ].map(p => {
      const on = s.funnelPeriod === 'custom' && s.fStart === p.a && s.fEnd === p.b;
      return {
        label: p.label, pick: () => this.setState({ funnelPeriod: 'custom', fStart: p.a, fEnd: p.b }),
        bg: on ? '#2457F5' : '#FFFFFF', fg: on ? '#FFFFFF' : '#647187', bd: on ? '#2457F5' : '#E2E8F2'
      };
    });

    const avgOverdue = facts.overdue.length ? Math.round(facts.overdue.reduce((t, x) => t + x.overdue, 0) / facts.overdue.length) : 0;
    const blockers = [
      { label: '待回复邮件（超 24h）', value: String(facts.warn.length + facts.stale.length), note: facts.stale.length ? facts.stale.length + ' 封已超 48h' : (facts.warn.length ? '均为 24–48h' : '无超时'), color: facts.stale.length ? RUST : (facts.warn.length ? AMBER : SAGE), go: () => this.setState({ page: 'tasks', tkTab: 'mail' }) },
      { label: '待回收素材', value: String(facts.pending.length), note: facts.overdue.length ? facts.overdue.length + ' 个超期 · 需催单' : '全部在期内', color: facts.overdue.length ? RUST : SAGE, go: this.go('campaigns') },
      { label: '待审批事项', value: String(apPendingCount), note: apPendingCount ? '含 Brief / 选品 / 付款等 ' + apPendingKinds + ' 类' : '无待审批', color: apPendingCount ? AMBER : SAGE, go: () => this.setState({ page: 'tasks', tkTab: 'approval', apType: '全部类型', apTab: 'pending' }) },
      { label: '待补内容授权', value: String(facts.pendingRights), note: facts.pendingRights ? '影响 ' + facts.pendingRights + ' 条素材投放' : '授权齐备', color: facts.pendingRights ? AMBER : SAGE, go: this.go('assets') },
      { label: '逾期交付红人', value: String(facts.overdue.length), note: avgOverdue ? '平均逾期 ' + avgOverdue + ' 天' : '无逾期', color: facts.overdue.length ? RUST : SAGE, go: this.go('campaigns') },
      { label: '待审批发票', value: String(facts.invPending), note: facts.invPending ? '结算流程等待确认' : '无待审批', color: facts.invPending ? AMBER : SAGE, go: this.go('finance') }
    ];

    const CK = { s: SAGE, a: AMBER, r: RUST, n: '#647187' };
    const hf = (() => {
      const shipHandles = {};
      (s.shipOrders || []).forEach(o => { shipHandles[o.handle] = 1; });
      facts.assets.filter(a => a.spend === 0).forEach(a => { shipHandles[a.handle] = 1; });
      facts.pending.forEach(p => { shipHandles[p.handle] = 1; });
      const ships = Math.max(1, Object.keys(shipHandles).length);
      const delivered = facts.assets.filter(a => shipHandles[a.handle]).length;
      const delivRate = Math.min(100, Math.round(delivered / ships * 100));
      const replyRate = Math.round(this.INBOX_REPLIES.length / Math.max(1, funnelBase[0]) * 100);
      const erAvg = facts.assets.length ? (facts.assets.reduce((t, a) => t + parseFloat(a.er), 0) / facts.assets.length) : 0;
      const onTime = facts.assets.filter(a => a.delivered <= a.due).length;
      const onTimeRate = Math.round(onTime / Math.max(1, facts.assets.length) * 100);
      const noShow = Math.round(facts.overdue.length / Math.max(1, ships + facts.overdue.length) * 100);
      const unitCost = facts.assetCount ? Math.round(facts.spend / facts.assetCount) : 0;
      const rightsRate = Math.round(facts.adReady / Math.max(1, facts.assetCount) * 100);
      const briefPass = Math.round(facts.approvedBriefs.length / Math.max(1, facts.briefs.length) * 100);
      const rework = Math.round(facts.rejectedBriefs.length / Math.max(1, facts.briefs.length) * 100);
      return { ships, delivRate, replyRate, erAvg, onTimeRate, noShow, unitCost, rightsRate, briefPass, rework };
    })();
    const hMul = { month: 1, quarter: 2.4, year: 8.2 };
    const mkHealth = (k) => {
      const m = hMul[k], lbl = { month: '本月', quarter: '本季度', year: '本年度' }[k];
      const cycle = k === 'month' ? 16 : k === 'quarter' ? 18 : 19;
      const resp = k === 'month' ? 1.2 : k === 'quarter' ? 1.4 : 1.8;
      const scaled = (n) => Math.round(n * m);
      return [
        { title: '流程健康', ai: lbl + '邀约回复率 ' + hf.replyRate + '%（基准 25–30%），寄样→交付率 ' + hf.delivRate + '%。'
            + (facts.overdue.length ? '当前有 ' + facts.overdue.length + ' 位红人逾期未交付，交付端是唯一堵点。' : '暂无逾期，交付端顺畅。')
            + '寄样到发布平均 ' + cycle + ' 天，仍高于 14 天目标。', rows: [
          ['邀约回复率', hf.replyRate + '%', '基准 25–30%', hf.replyRate >= 30 ? 's' : 'a'],
          ['寄样 → 交付率', hf.delivRate + '%', '目标 ≥ 80%', hf.delivRate >= 80 ? 's' : 'a'],
          ['寄样 → 发布平均周期', cycle + ' 天', '目标 ≤ 14 天', 'a'],
          ['红人平均响应时长', resp + ' 天', k === 'month' ? '上月 1.6 天' : '上一周期更慢', 's'],
          ['逾期交付', facts.overdue.length + ' 位 / ' + scaled(hf.ships), '占 ' + Math.round(facts.overdue.length / Math.max(1, scaled(hf.ships)) * 100) + '%', facts.overdue.length ? 'r' : 's']
        ] },
        { title: '内容质量', ai: '平均互动率 ' + hf.erAvg.toFixed(1) + '%（基准 3.2%），说明选人与叙事方向对。Brief 一次通过率 ' + hf.briefPass + '%，'
            + (facts.pendingApprovals.length ? '仍有 ' + facts.pendingApprovals.length + ' 份待审批。' : '当前无待审批。')
            + (facts.pendingRights ? '另有 ' + facts.pendingRights + ' 条素材因授权未补无法投放。' : ''), rows: [
          ['平均完播率', Math.round(hf.erAvg * 5.4) + '%', '目标 35%', hf.erAvg * 5.4 >= 35 ? 's' : 'a'],
          ['平均互动率', hf.erAvg.toFixed(1) + '%', '基准 3.2%', hf.erAvg >= 3.2 ? 's' : 'a'],
          ['Brief 一次通过率', hf.briefPass + '%', facts.briefs.length + ' 份 Brief 口径', hf.briefPass >= 70 ? 's' : 'a'],
          ['返工 / 驳回率', hf.rework + '%', '目标 ≤ 15%', hf.rework <= 15 ? 's' : 'a'],
          ['合规问题内容', facts.assets.filter(a => a.rights === 'pending').length + ' 条', '需重剪或补授权', facts.pendingRights ? 'r' : 's']
        ] },
        { title: '成本效率', ai: '平均 CPV $' + facts.cpv.toFixed(3) + '，' + (facts.cpv <= 0.012 ? '优于基准 $0.012；' : '高于基准 $0.012；')
            + '单条内容综合成本 $' + hf.unitCost + '。' + (facts.overdue.length ? '逾期与爽约会把寄样成本变成沉没成本，当前 ' + facts.overdue.length + ' 位。' : '暂无爽约损耗。'), rows: [
          ['平均 CPV', '$' + facts.cpv.toFixed(3), '基准 $0.012', facts.cpv <= 0.012 ? 's' : 'r'],
          ['发布准时率', hf.onTimeRate + '%', '目标 ≥ 90%', hf.onTimeRate >= 90 ? 's' : 'a'],
          ['爽约率', hf.noShow + '%', facts.overdue.length + ' 位 / ' + (hf.ships + facts.overdue.length), hf.noShow <= 5 ? 's' : 'a'],
          ['单条内容综合成本', '$' + hf.unitCost, '含寄样与物流', 'n']
        ] },
        { title: '资产与关系沉淀', ai: lbl + '入库 ' + facts.assetCount + ' 个资产，其中 ' + facts.adReady + ' 个可用于广告投放（' + hf.rightsRate + '%）。'
            + (hf.rightsRate < 60 ? '授权仍在交付后补谈，建议前置到 Brief。' : '授权前置机制已生效。')
            + '长期合作红人 ' + facts.coop.length + ' 位。', rows: [
          [lbl + '新增资产', facts.assetCount + ' 个', '视频 ' + facts.assets.filter(a => a.channel !== 'Instagram').length + ' · 图文 ' + facts.assets.filter(a => a.channel === 'Instagram').length, 's'],
          ['广告可授权比例', hf.rightsRate + '%', facts.adReady + ' / ' + facts.assetCount, hf.rightsRate >= 60 ? 's' : 'a'],
          ['资产复用次数', scaled(facts.adReady * 2) + ' 次', '投放与详情页', 's'],
          ['长期合作红人', facts.coop.length + ' 位', '来自合作红人 List', 's'],
          ['淘汰 / 黑名单', ((s.blackAdded || []).length + 2) + ' 位', '受众或交付不匹配', 'n']
        ] }
      ];
    };
    const healthData = { month: mkHealth('month'), quarter: mkHealth('quarter'), year: mkHealth('year') };
    const healthPeriodLabels = { month: '本月', quarter: '本季度', year: '本年度' };
    const healthSubs = { month: '8月 1–20 日', quarter: 'Q3 累计', year: '2026 累计' };
    const hStates = s.hCards || {};
    const presetDefs = [
      { label: '本月', a: '2026-08-01', b: '2026-08-31' }, { label: '上月', a: '2026-07-01', b: '2026-07-31' },
      { label: '近 30 天', a: '2026-07-22', b: '2026-08-20' }, { label: '本季度', a: '2026-07-01', b: '2026-09-30' },
      { label: '上季度', a: '2026-04-01', b: '2026-06-30' }, { label: '本年度', a: '2026-01-01', b: '2026-12-31' }
    ];
    const setCard = (i, patch) => this.setState(st => ({
      hCards: { ...st.hCards, [i]: { ...(st.hCards[i] || {}), ...patch } }
    }));


    const healthGroups = [0, 1, 2, 3].map(i => {
      const cs = hStates[i] || { period: 'quarter', start: '2026-08-01', end: '2026-08-20', open: false };
      let key = healthData[cs.period] ? cs.period : 'quarter';
      let rangeLabel = healthPeriodLabels[key] + ' · ' + healthSubs[key];
      let scopeNote = '';
      if (cs.period === 'custom') {
        const DAY = 86400000;
        const st = new Date(cs.start + 'T00:00:00'), en = new Date(cs.end + 'T00:00:00');
        const days = Math.max(1, Math.round((en - st) / DAY) + 1);
        key = days <= 45 ? 'month' : days <= 150 ? 'quarter' : 'year';
        rangeLabel = fmtCN(cs.start) + ' – ' + fmtCN(cs.end) + ' · ' + days + ' 天';
        scopeNote = '所选区间 ' + days + ' 天，比率类指标按最接近的统计口径（' + healthPeriodLabels[key] + '）计算。';
      }
      const g = healthData[key][i];
      const aiFull = scopeNote + g.ai;
      return {
        title: g.title, ai: aiFull, rangeLabel,
        aiShort: aiFull.split(/[。；]/)[0] + '。',
        aiOpen: s.hAiOpen === i,
        aiToggle: s.hAiOpen === i ? '收起' : '展开',
        toggleAi: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st2 => ({ hAiOpen: st2.hAiOpen === i ? null : i })); },
        rows: g.rows.map(([label, value, note, c]) => ({ label, value, note, color: CK[c] })),
        open: !!cs.open, start: cs.start, end: cs.end,
        toggleRange: () => setCard(i, { open: !cs.open }),
        closeRange: () => setCard(i, { open: false }),
        setStart: (e) => setCard(i, { period: 'custom', start: e.target.value }),
        setEnd: (e) => setCard(i, { period: 'custom', end: e.target.value }),
        tabs: ['month', 'quarter', 'year'].map(k => ({
          label: healthPeriodLabels[k], pick: () => setCard(i, { period: k, open: false }), ...pillOn(cs.period === k)
        })),
        presets: presetDefs.map(p => ({
          label: p.label, pick: () => setCard(i, { period: 'custom', start: p.a, end: p.b }),
          ...pillOn(cs.period === 'custom' && cs.start === p.a && cs.end === p.b)
        }))
      };
    });

    // ── 人员榜单 ──
    const ownerOf = (sku) => (skuAll.find(p => p.sku === sku) || { owner: '陈曦' }).owner;
    const staffRoles = { 'Helen': 'Marketing Lead' };
    const OUTREACH_SEED = [
      { handle: '@quietmornings', sku: 'RYZ-SC-01' }, { handle: '@thecalmedit', sku: 'AURA-LP-01' },
      { handle: '@homewithtess', sku: 'LUM-AR-02' }, { handle: '@scalp.school', sku: 'RYZ-SC-01' },
      { handle: '@lena.unwinds', sku: 'RYZ-SC-01' }, { handle: '@hairdays.co', sku: 'RYZ-SC-01' },
      { handle: '@nora.pm', sku: 'RYZ-SC-01' }, { handle: '@dailywithlin', sku: 'RYZ-SC-01' },
      { handle: '@sofia.homelab', sku: 'LUM-AR-02' }
    ];
    const DROPPED = [
      { handle: '@thegroomguide', sku: 'RYZ-SC-01', why: '受众不匹配 · 交付延期 2 次' },
      { handle: '@sofia.homelab', sku: 'LUM-AR-02', why: '报价高于产出，议价未果' }
    ];
    const BLACK_SEED = [
      { handle: '@fastcashreviews', sku: 'RYZ-SC-01' }, { handle: '@dealhunter.uk', sku: 'AURA-LP-01' },
      { handle: '@viral.dupes', sku: 'RYZ-SC-01' }
    ];
    const _skuOwner = (sku) => (skuAll.find(p => p.sku === sku) || { owner: '陈曦' }).owner;
    const _handleOwner = (() => {
      const map = {};
      facts.assets.forEach(a => { map[a.handle] = _skuOwner(a.sku); });
      (s.contactLog || []).forEach(c => { if (!map[c.handle]) map[c.handle] = _skuOwner(c.sku || 'RYZ-SC-01'); });
      (s.shipOrders || []).forEach(o => { if (!map[o.handle]) map[o.handle] = _skuOwner((skuAll.find(p => p.name === o.product) || {}).sku || 'RYZ-SC-01'); });
      OUTREACH_SEED.concat(DROPPED, BLACK_SEED).forEach(x => { if (!map[x.handle]) map[x.handle] = _skuOwner(x.sku); });
      return (h) => map[h] || '陈曦';
    })();
    const _staffCrmBase = (() => {
      const acc = {};
      const bump = (h, key) => {
        const o = _handleOwner(h);
        acc[o] = acc[o] || { reachSet: {}, coopSet: {}, shipSet: {}, blackSet: {}, dropSet: {} };
        acc[o][key][h] = 1;
      };
      const reached = {};
      (s.contactLog || []).forEach(c => { reached[c.handle] = 1; });
      this.INBOX_REPLIES.forEach(r => { reached[r.handle] = 1; });
      facts.assets.forEach(a => { reached[a.handle] = 1; });
      facts.pending.forEach(p => { reached[p.handle] = 1; });
      OUTREACH_SEED.forEach(x => { reached[x.handle] = 1; });
      DROPPED.forEach(x => { reached[x.handle] = 1; });
      Object.keys(reached).forEach(h => bump(h, 'reachSet'));
      const coop = {};
      (facts.coop || []).forEach(h => { coop[h] = 1; });
      facts.assets.forEach(a => { coop[a.handle] = 1; });
      Object.keys(coop).forEach(h => bump(h, 'coopSet'));
      (s.shipOrders || []).forEach(o => bump(o.handle, 'shipSet'));
      facts.assets.filter(a => a.spend === 0).forEach(a => bump(a.handle, 'shipSet'));
      BLACK_SEED.concat(((s.blackAdded || []).map(h => ({ handle: h, sku: 'RYZ-SC-01' })))).forEach(x => bump(x.handle, 'blackSet'));
      DROPPED.forEach(x => bump(x.handle, 'dropSet'));
      return acc;
    })();
    const _staffCrm = (name, mul) => {
      const d = _staffCrmBase[name] || { reachSet: {}, coopSet: {}, shipSet: {}, blackSet: {}, dropSet: {} };
      const n = (o) => Object.keys(o).length;
      const sc = (v) => mul <= 1 ? v : Math.round(v * mul);
      return {
        reach: sc(n(d.reachSet)), coop: sc(n(d.coopSet)), ship: sc(n(d.shipSet)),
        black: sc(n(d.blackSet)), drop: sc(n(d.dropSet)),
        _live: n(d.reachSet) + n(d.coopSet) + n(d.shipSet)
      };
    };

    const mkStaff = (mul, target) => {
      const num = this.toNumU;
      const byOwner = {};
      facts.assets.forEach(a => {
        const o = ownerOf(a.sku || 'RYZ-SC-01');
        byOwner[o] = byOwner[o] || { views: 0, gmv: 0, spend: 0, assets: 0 };
        byOwner[o].views += num(a.views) * mul;
        byOwner[o].gmv += a.gmv * mul;
        byOwner[o].spend += a.spend * mul;
        byOwner[o].assets += 1;
      });
      ['Helen', '林浩', '陈曦', '苏敏'].forEach(o => { byOwner[o] = byOwner[o] || { views: 0, gmv: 0, spend: 0, assets: 0 }; });
      return Object.keys(byOwner).map(name => {
        const d = byOwner[name];
        const cpv = d.views ? d.spend / d.views : 0;
        return {
          name, role: staffRoles[name] || '推广专员',
          views: (d.views / 1000000).toFixed(2) + 'M', target: (target / 1000000).toFixed(1) + 'M',
          pct: Math.round(d.views / target * 100),
          assets: Math.round(d.assets * (mul > 1 ? mul : 1)),
          gmv: '$' + (d.gmv / 1000).toFixed(1) + 'K',
          cpv: cpv ? '$' + cpv.toFixed(3) : '—',
          reply: Math.round(hf.replyRate * (name === '陈曦' ? 1.15 : name === '苏敏' ? 0.7 : 1)) + '%',
          ..._staffCrm(name, mul)
        };
      }).filter(x => x.reach > 0 || x.assets > 0).sort((a, b) => b.pct - a.pct);
    };
    const staffData = {
      month: mkStaff(1, 650000),
      quarter: mkStaff(2.4, 2000000),
      year: mkStaff(8.2, 6500000)
    };
    const staffLabels = { month: '本月', quarter: '本季度', year: '本年度' };
    const staffSubs = { month: '8月 1–20 日', quarter: 'Q3 累计', year: '2026 累计' };
    const staffKey = staffData[s.staffPeriod] ? s.staffPeriod : 'quarter';
    const staff = staffData[staffKey].map((p, i) => ({
      ...p, rank: i + 1,
      color: p.pct >= 50 ? SAGE : p.pct >= 35 ? AMBER : RUST,
      rankBg: i === 0 ? '#EAF0FF' : '#F5F8FE', rankFg: i === 0 ? '#2457F5' : '#647187',
      cells: [
        { value: p.reach, sub: '位', color: '#1D2638' },
        { value: p.coop, sub: p.reach ? Math.round(p.coop / p.reach * 100) + '% 转化' : '—', color: '#4E7156' },
        { value: p.ship, sub: p.ship ? '单' : (p.coop ? '纯付费合作' : '单'), color: '#1D2638' },
        { value: p.assets, sub: p.coop ? (p.assets / p.coop).toFixed(1) + ' 条/位' : '—', color: '#1D2638' },
        { value: p.gmv, sub: 'CPV ' + p.cpv, color: '#4E7156' },
        { value: p.reply, sub: '邮件回复', color: '#1D48D8' },
        { value: p.black + ' / ' + p.drop, sub: '黑名单 / 淘汰', color: p.black + p.drop ? '#C4636D' : '#647187' }
      ]
    }));
    const staffTabs = ['month', 'quarter', 'year'].map(k => ({
      label: staffLabels[k], pick: () => this.setState({ staffPeriod: k }), ...pillOn(staffKey === k)
    }));
    const staffSub = '按曝光量完成率排序 · ' + staffSubs[staffKey];

    const campaigns = [
      { name: 'Ryze · Q3 北美种草', meta: 'UGC + 种草 · $42,000 · 8/1–9/30', stage: 'Content Draft', pct: 46, color: AMBER, creators: 14 },
      { name: 'Lumo · 秋季家居氛围', meta: '曝光 · $18,000 · 8/15–10/15', stage: 'Outreach', pct: 22, color: BLUE, creators: 9 },
      { name: 'Ryze · Ambassador 招募', meta: '长期合作 · $9,000 · 常设', stage: 'Negotiation', pct: 68, color: SAGE, creators: 6 }
    ].map((c, i) => ({ ...c, open: this.openCampaign(i) }));

    const learnings = [
      { title: '「睡前 routine」角度优于纯开箱', body: '同一产品、同一层级红人，睡前场景内容 ROAS 高 41%，评论区问价比例更高。', src: 'Q2 复盘', conf: '高' },
      { title: 'KOC 的完播率比 micro 更高', body: '2 万粉以下红人平均完播 38%，micro 为 26%；建议提高 KOC 配比。', src: '19 条内容', conf: '中' },
      { title: 'Brief 里限制台词会降低质量', body: '要求逐字口播的 5 条内容互动率全部低于均值，改为「必须讲到的三件事」后回升。', src: 'Brief 对照', conf: '中' }
    ];

    const CB_META = {
      '@mia.selfcare': { nation: '美国', market: 'US', tier: '10万-50万', gender: '女', age: '25-34', job: '全职创作者', avgViews: '128K', er30: '6.4%' },
      '@kaylascalp': { nation: '美国', market: 'US', tier: '1万-10万', gender: '女', age: '25-34', job: '美发从业者', avgViews: '34K', er30: '12.1%' },
      '@leo.calmnight': { nation: '美国', market: 'US', tier: '1万-10万', gender: '男', age: '25-34', job: '全职创作者', avgViews: '86K', er30: '5.2%' },
      '@june.rests': { nation: '美国', market: 'US', tier: '1万-10万', gender: '女', age: '18-24', job: '学生', avgViews: '31K', er30: '13.4%' },
      '@hairbyandre': { nation: '加拿大', market: 'US', tier: '1万-10万', gender: '男', age: '35-44', job: '执业发型师', avgViews: '19K', er30: '4.3%' },
      '@dailywithlin': { nation: '美国', market: 'US', tier: '1万-10万', gender: '女', age: '25-34', job: '上班族兼职', avgViews: '41K', er30: '8.7%' },
      '@sofia.homelab': { nation: '美国', market: 'US', tier: '50万以下', gender: '女', age: '35-44', job: '室内设计师', avgViews: '23K', er30: '3.6%' },
      '@nora.pm': { nation: '美国', market: 'US', tier: '1万-10万', gender: '女', age: '25-34', job: '产品经理', avgViews: '22K', er30: '6.1%' }
    };
    const mkBoard = (mul, sub) => {
      const num = this.toNumU;
      const by = {};
      facts.assets.forEach(a => {
        by[a.handle] = by[a.handle] || { views: 0, gmv: 0, spend: 0, erSum: 0, platform: a.channel, top: a, n: 0 };
        const d = by[a.handle];
        d.views += num(a.views) * mul;
        d.gmv += a.gmv * mul;
        d.spend += a.spend * mul;
        d.erSum += parseFloat(a.er) || 0;
        d.n += 1;
        if (num(a.views) > num(d.top.views)) d.top = a;
      });
      const rows = Object.keys(by).map(h => {
        const d = by[h], t = d.top;
        const cpv = d.views ? d.spend / d.views : 0;
        const cov = this.coverOf(t.url, t.channel);
        const bare = h.slice(1), nm = { TikTok: 'Ti', Instagram: 'In', YouTube: 'Yo' };
        return {
          handle: h, platform: d.platform,
          views: d.views >= 1000000 ? (d.views / 1000000).toFixed(2) + 'M' : Math.round(d.views / 1000) + 'K',
          sales: '$' + Math.round(d.gmv).toLocaleString('en-US'),
          asset: d.n > 1 ? t.title + ' 等 ' + d.n + ' 条' : t.title,
          assetTitle: t.title, assetUrl: t.url, assetChannel: t.channel,
          product: t.product, sku: t.sku,
          er: (d.erSum / d.n).toFixed(1) + '%',
          cpv: d.spend > 0 && d.views ? '$' + cpv.toFixed(3) : '寄样',
          cpvColor: d.spend === 0 ? '#4E7156' : (cpv <= 0.012 ? '#1D2638' : '#C4636D'),
          coverTint: cov.tint, coverBg: cov.bg, coverMark: cov.mark, coverShade: cov.shade, coverFg: cov.fg,
          links: [
            { short: nm[t.channel] || 'Ti', title: (t.channel || 'TikTok') + ' 主页', url: t.channel === 'YouTube' ? 'https://www.youtube.com/' + h : (t.channel === 'Instagram' ? 'https://www.instagram.com/' + bare : 'https://www.tiktok.com/' + h) },
            { short: t.channel === 'Instagram' ? 'Ti' : 'In', title: '其他渠道主页', url: t.channel === 'Instagram' ? 'https://www.tiktok.com/' + h : 'https://www.instagram.com/' + bare }
          ],
          _v: d.views, ...(CB_META[h] || {})
        };
      }).sort((a, b) => b._v - a._v);
      return { sub, rows };
    };
    const creatorBoard = {
      month: mkBoard(1, '8月 1–20 日'),
      quarter: mkBoard(2.4, 'Q3 累计'),
      year: mkBoard(8.2, '2026 累计')
    };
    const cbLabels = { month: '本月', quarter: '本季度', year: '本年度' };
    const cbKey = creatorBoard[s.cbPeriod] ? s.cbPeriod : 'month';
    const cbSortKey = s.cbSort || 'views';
    const cbSortDir = s.cbDir === 'asc' ? 'asc' : 'desc';
    const cbNum = (v) => { const n = parseFloat(String(v).replace(/[^0-9.]/g, '')); return isNaN(n) ? 0 : n * (/M/i.test(String(v)) ? 1e6 : (/K/i.test(String(v)) ? 1e3 : 1)); };
    const cbSorted = creatorBoard[cbKey].rows.slice().sort((a, b) => {
      const g = (x) => cbSortKey === 'views' ? cbNum(x.views) : (cbSortKey === 'er' ? parseFloat(x.er) || 0 : (cbSortKey === 'cpv' ? cbNum(x.cpv) : cbNum(x.sales)));
      return cbSortDir === 'asc' ? g(a) - g(b) : g(b) - g(a);
    });
    const cbSortHead = [['views', 'Views'], ['er', 'ER'], ['cpv', 'CPV'], ['sales', '红人 GMV']].map(([k, label]) => {
      const on = cbSortKey === k;
      return {
        label,
        upFg: on && cbSortDir === 'asc' ? '#2457F5' : '#BEC8D7',
        downFg: on && cbSortDir === 'desc' ? '#2457F5' : '#BEC8D7',
        sortUp: () => this.setState({ cbSort: k, cbDir: 'asc' }),
        sortDown: () => this.setState({ cbSort: k, cbDir: 'desc' })
      };
    });
    const topCreators = cbSorted.map((c, i) => ({
      ...c, rank: i + 1, open: this.openCreator(c.handle),
      initial: (c.handle || '@').slice(1, 2).toUpperCase(),
      openAsset: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState({ page: 'assetDetail', assetIdx: Math.min(i, 5) }); },
      rankBg: i === 0 ? '#EAF0FF' : '#F5F8FE', rankFg: i === 0 ? '#2457F5' : '#647187'
    }));
    const cbTabs = ['month', 'quarter', 'year'].map(k => ({
      label: cbLabels[k], pick: () => this.setState({ cbPeriod: k }), ...pillOn(cbKey === k)
    }));
    const cbSortLabel = { views: 'Views', er: 'ER', cpv: 'CPV', sales: '红人 GMV' }[cbSortKey];
    const cbSub = '按' + cbSortLabel + (cbSortDir === 'asc' ? '升序' : '降序') + ' · ' + creatorBoard[cbKey].sub;

    const taskDefs = [
      ['确认 Ryze Brief v2 的合规禁用词清单', '今天', 'Brief', this.go('brief')],
      ['给 @sofia.homelab 回报价（她要求 $850）', '今天', 'CRM', this.go('creators')],
      ['@thegroomguide 的初稿已超期 2 天，需催单', '逾期 2 天', 'Campaign', this.go('campaignDetail')],
      ['为 Q3 上传 6 条已获授权的广告素材', '本周五', 'Assets', this.go('assets')],
      ['把 Q2 复盘的「睡前 routine」结论写入 Q3 策略', '本周五', 'Strategy', this.go('strategy')],
      ['审批 Ryze 白名单投放授权 Brief', '下周一', 'Brief', this.go('brief')],
      ['@june.rests 的前后对比需重剪字幕后再投放', '下周三', 'Assets', this.go('assets')]
    ];
    const tasks = taskDefs.map(([title, due, tag, go], i) => {
      const done = s.doneTasks.includes(i);
      const overdue = due.startsWith('逾期');
      return {
        title, due, tag, go, check: done ? '✓' : '',
        dueColor: done ? '#929CAF' : overdue ? RUST : due === '今天' ? AMBER : '#8792A5',
        boxBg: done ? SAGE : 'transparent', boxBorder: done ? SAGE : '#C8D4E8',
        fg: done ? '#929CAF' : '#1D2638', deco: done ? 'line-through' : 'none',
        toggle: () => this.setState(st => ({ doneTasks: st.doneTasks.includes(i) ? st.doneTasks.filter(x => x !== i) : [...st.doneTasks, i] }))
      };
    });

    const sSku = skuAll.find(p => p.sku === s.strategySku) || skuAll[0];
    const sScore = skuScoreMap[sSku.sku] || 60;
    const sDims = skuDimSets[sSku.sku] || dimNames.map(() => 6);
    const sCat = sSku.category.split(' / ')[0];
    const sTier = sScore >= 75 ? 'KOC 60% · Micro 30% · Expert 10%' : sScore >= 55 ? 'KOC 40% · Micro 50% · Expert 10%' : '先测试 5–8 位 KOC';
    const sPlat = sDims[0] >= 8 ? 'TikTok US 主战场，IG Reels 承接搜索' : 'Instagram 为主，TikTok 辅助测试';
    const sPlatName = sDims[0] >= 8 ? 'TikTok US' : 'Instagram';
    const sFmt = (dContent[sCat] || ['开箱', '场景植入', '前后对比']).join(' · ');
    const sAngleMap = {
      'RYZ-SC-01': '不是按摩器，是每天三分钟属于自己的时间',
      'AURA-LP-01': '不是一盏灯，是回家后把状态切换过来的开关',
      'LUM-CD-08': '不是香味，是「我特意为你挑的」这件事'
    };
    const sAudMap = {
      '个护家电': '25–38 岁女性，长期熬夜与压力，已有护理习惯',
      '家居香氛': '25–35 岁女性，注重居家氛围与礼赠场合',
      '家居电器': '28–45 岁，租房或首次装修的都市家庭',
      '照明': '25–35 岁，重视居家氛围与拍照效果的租房人群',
      '餐厨': '28–45 岁，注重餐桌质感的家庭用户',
      '运动': '22–35 岁，居家健身与轻量训练人群',
      '膳食补充': '30–45 岁，关注睡眠与状态管理的人群'
    };
    const strategySummary = [
      { key: '产品切角', value: sAngleMap[sSku.sku] || (sSku.name + '：从' + sCat + '参数比价转向具体使用场景的体感') },
      { key: '目标人群', value: sAudMap[sCat] || '25–40 岁，' + sCat + '品类的日常使用者' },
      { key: '核心信息', value: sScore >= 75 ? '让人看完就想今晚试一次' : '先讲清「为什么是这一款」，再谈体验' },
      { key: '红人类型', value: sTier },
      { key: '平台组合', value: sPlat },
      { key: '内容形式', value: sFmt },
      { key: '预算逻辑', value: sScore >= 75 ? '70% 铺量 · 20% 精品 · 10% 白名单投放' : '50% 小规模测试 · 30% 精品 · 20% 观察' },
      { key: 'KPI', value: (sScore >= 75 ? '90' : sScore >= 55 ? '40' : '12') + ' 条内容 · 完播 ≥ 35% · CPV ≤ $0.012' },
      { key: '风险提示', value: (sDims[8] <= 5 ? '禁止功效类 claim；' : '') + (sSku.stockNote.indexOf('需补货') >= 0 ? '库存仅 ' + sSku.stock + ' 件，放量前需补货' : '避免与竞品同款音乐撞车') }
    ];
    const strategyTitle = sSku.name;
    if (page === 'strategy') crumbLeaf = sSku.name;

    const sBudgetTotal = sScore >= 75 ? 42000 : sScore >= 55 ? 18000 : 6000;
    const sBudgetSplit = sScore >= 75 ? [34, 30, 22, 14] : sScore >= 55 ? [40, 26, 16, 18] : [52, 20, 6, 22];
    const sBudgetLabels = ['KOC 铺量（寄样+佣金）', 'Micro 内容标杆', '白名单广告投放', '寄样物流与备用'];
    const sBudgetColors = [SAGE, AMBER, BLUE, '#A8B1C0'];
    const budget = sBudgetSplit.map((pct, i) => ({
      label: sBudgetLabels[i], pct, color: sBudgetColors[i],
      amount: '$' + Math.round(sBudgetTotal * pct / 100).toLocaleString('en-US')
    }));
    const budgetTotalText = '$' + sBudgetTotal.toLocaleString('en-US');

    // ══ 策略生成工作台 ══
    const sw = s.sw;
    const swStepDefs = [
      ['产品与品牌', 'form'], ['证据与合规', 'form'], ['目标消费者', 'form'], ['推广目标', 'form'],
      ['平台与市场', 'form'], ['红人资源与筛选', 'form'], ['商业与执行约束', 'form'],
      ['现有数据与参考案例', 'form'], ['完整性检查', 'check'], ['策略生成与导出', 'gen']
    ];
    const swProfiles = {
      'RYZ-SC-01': {
        brandLine: 'Ryze：让日常护理变成放松时刻',
        tone: '克制、真诚、不夸大，像朋友分享而非导购',
        user: '本人使用为主，偶尔家人共用',
        pain: '压力大、头皮紧，洗头长期敷衍了事',
        jobEmo: '给自己一个合理的休息借口，并愿意分享这份放松',
        func: '四组硅胶触头 + 三档节律，湿发干发均可用',
        diff: '防水可带进淋浴；单次使用 3 分钟',
        canClaim: '头皮清洁辅助、放松体感、防水可用',
        noClaim: '生发、治疗脱发、防脱、立刻见效',
        sensitive: '涉及头皮健康表述，按医疗边界处理',
        buyer: '25–38 岁女性，自购自用为主',
        scene: '睡前洗护；压力大、头皮紧、洗头敷衍',
        job: '把洗头这三分钟变成属于自己的时间',
        doubt: '担心用两次闲置；不确定与手指按摩的差别',
        voc: '「我洗头一直很敷衍，直到…」',
        platformPref: 'TikTok 为主，偏好第一人称低饱和暖光',
        creatorNiche: '自我照护 / 头皮护理垂类，真实感优先',
        formLimit: '竖屏 21–34 秒；禁用医疗类表述',
        hypothesis: '睡前 routine 角度优于开箱',
        pillars: '三个支柱：睡前仪式（60%）、真实体感特写（25%）、专业解释（15%）',
        hook: 'Hook：前 3 秒直接进入使用画面。Proof：手部动作特写 + 第一人称体感。CTA：bio 链接 + 专属折扣码。',
        briefMust: '必须包含：真实浴室环境、开机使用特写、防水可带进淋浴、专属折扣码。禁止：生发、治疗脱发、立刻见效、竞品比较。',
        evidence: [['头皮清洁辅助', 'SRC-003 合规审核文件', true], ['防水可带进淋浴', 'SRC-002 产品参数表', true], ['缓解压力 / 放松体感', '', false], ['改善头皮环境', '', false]]
      },
      'LUM-AR-02': {
        brandLine: 'Lumo：把气味变成回家的信号',
        tone: '安静、有质感，重氛围轻说教',
        user: '本人使用为主，送礼场景占三成',
        pain: '居家与工作状态混在一起，难以切换',
        jobEmo: '营造有品味的居家氛围，值得被拍进空间照',
        func: '超声波雾化 + 三档香氛浓度，USB-C 六小时续航',
        diff: '便携可带上桌面与差旅；无明火无热源',
        canClaim: '香氛扩散、便携续航、静音运行',
        noClaim: '空气净化、杀菌除螨、助眠疗效',
        sensitive: '涉及香精成分，需标注过敏原提示',
        buyer: '24–35 岁都市租房人群，自购与送礼各半',
        scene: '下班回家、居家办公切换状态时开机',
        job: '用气味给一天划一条分界线',
        doubt: '担心香味太冲；不确定精油耗材成本',
        voc: '「一进门开机，才算真正下班了」',
        platformPref: 'Instagram 为主，偏好静物与空间氛围图',
        creatorNiche: '家居 / 空间美学垂类，审美一致性优先',
        formLimit: 'Reels 15–25 秒；封面需可进 Grid',
        hypothesis: '空间氛围角度优于产品参数讲解',
        pillars: '三个支柱：回家仪式（50%）、桌面氛围（30%）、差旅便携（20%）',
        hook: 'Hook：开机雾化的第一秒特写。Proof：空间前后氛围对比。CTA：bio 链接 + 专属折扣码。',
        briefMust: '必须包含：真实居家或桌面环境、开机雾化特写、续航或便携交代、专属折扣码。禁止：净化空气、杀菌、助眠疗效、竞品比较。',
        evidence: [['USB-C 六小时续航', 'SRC-002 产品参数表', true], ['静音运行', 'SRC-002 产品参数表', true], ['提升放松感', '', false], ['改善空气质量', '', false]]
      },
      'NUV-SP-07': {
        brandLine: 'Nuvia：把每天的基础营养变简单',
        tone: '克制、可信、以事实为主，不做情绪煽动',
        user: '购买者与使用者常为家庭内不同成员',
        pain: '想补基础营养但不愿研究成分表',
        jobEmo: '获得「我在认真照顾自己与家人」的安心感',
        func: '每日两粒随水服用，30 天装，植物胶囊',
        diff: '小粒径易吞服；无腥味无添加糖',
        canClaim: '成分与含量事实、剂型与服用方式、第三方检测报告结论',
        noClaim: '治疗、预防、替代药物、减重、增强免疫等疗效表述',
        sensitive: '膳食补充剂，须附 FDA 免责声明，仅可作结构/功能声明',
        buyer: '30–45 岁人群，家庭健康采购者为主',
        scene: '早餐后随水服用，纳入固定日常',
        job: '不用研究成分表也能把基础营养补上',
        doubt: '担心成分是否可信；不确定与药物是否冲突',
        voc: '「我只想要一个不用思考的日常」',
        platformPref: 'YouTube 与 Instagram 并重，偏好口播与图文说明',
        creatorNiche: '健康 / 家庭生活垂类，具备资质或谨慎表述能力',
        formLimit: '需含 FDA 免责字幕；禁止任何疗效与前后对比',
        hypothesis: '「省心的日常」角度优于成分科普',
        pillars: '三个支柱：日常习惯（50%）、成分透明（30%）、家庭场景（20%）',
        hook: 'Hook：早餐桌上的两粒。Proof：第三方检测报告与成分表。CTA：bio 链接 + 专属折扣码。',
        briefMust: '必须包含：真实服用场景、FDA 免责声明字幕、成分与含量事实、专属折扣码。禁止：治疗预防类表述、前后对比、替代药物、个人疗效故事。',
        evidence: [['成分与含量事实', 'SRC-002 产品参数表', true], ['第三方检测报告', '', false], ['支持日常精力', '', false], ['增强免疫力', '', false]]
      }
    };
    const swGenericPf = (p) => {
      const cat = p.category || p.bu || '该品类';
      const isIngest = /膳食|保健|口服|食品|补充/.test(cat + p.name);
      const isSkin = /护肤|个护|美妆|洗护/.test(cat + p.name);
      return {
        brandLine: p.brand + '：以' + cat + '的日常体验为核心',
        tone: '待补充：品牌语气与表达边界',
        user: '待补充：实际使用者是否等同于购买者',
        pain: '待补充：' + cat + '当前最未被解决的痛点',
        jobEmo: '待补充：用户希望获得的情绪与社会性价值',
        func: '待补充：' + p.name + '的核心功能与使用方式（可由产品参数表提取）',
        diff: '待补充：相对同类' + cat + '产品的差异点',
        canClaim: '产品参数表可核实的规格与材质事实、实际使用方式、第三方检测结论',
        noClaim: isIngest ? '治疗、预防、替代药物等疗效表述' : (isSkin ? '医疗功效、疗效承诺、绝对化用语' : '未经证据支持的效果承诺、绝对化用语、竞品贬损'),
        sensitive: isIngest ? '涉及入口类产品，须附 FDA 免责声明，仅可作结构/功能声明' : '按平台广告规范处理，避免功效与绝对化表述',
        buyer: '待补充：' + cat + '的核心购买者与决策者',
        scene: '待补充：' + p.name + '最高频的使用场景与对应痛点',
        job: '待补充：用户希望通过' + cat + '解决的功能与情绪需求',
        doubt: '待补充：价格、耐用性或效果可信度方面的主要顾虑',
        voc: '待补充：来自 Review 与评论区的原声表达',
        platformPref: '待确认：按' + cat + '受众的平台分布确定主次平台',
        creatorNiche: cat + '相关垂类，内容真实感与受众重合度优先',
        formLimit: '按主投平台的时长与版式规范执行；避免功效类表述',
        hypothesis: '待验证：哪一个内容角度对' + cat + '更有效',
        pillars: '待补充：为' + p.name + '拟定三个内容支柱及其配比',
        hook: 'Hook：产品进入真实使用场景的第一秒。Proof：可被镜头验证的使用细节。CTA：bio 链接 + 专属折扣码。',
        briefMust: '必须包含：真实使用场景、产品使用细节特写、规格或材质事实交代、专属折扣码。禁止：未经证据支持的效果承诺、绝对化用语、竞品比较。',
        evidence: [['规格与材质事实', 'SRC-002 产品参数表', true], ['实际使用方式', 'SRC-002 产品参数表', true], ['使用效果表述', '', false], ['第三方检测结论', '', false]]
      };
    };
    const swPf = swProfiles[sSku.sku] || swGenericPf(sSku);
    const swFieldBank = [
      [['品牌定位', 'ok', swPf.brandLine, 'SRC-001'],
       ['品牌调性', 'ai', swPf.tone, 'SRC-001'],
       ['产品名称', 'ok', sSku.name, ''],
       ['SKU', 'ok', sSku.sku, ''],
       ['ASIN', 'ok', sSku.asin, ''],
       ['售价与币种', 'ok', sSku.price + ' USD', ''],
       ['核心功能与使用方式', 'ai', swPf.func, 'SRC-002'],
       ['差异化卖点', 'ai', swPf.diff, 'SRC-002'],
       ['适用人群', 'missing', '', ''],
       ['不适用人群', 'missing', '', ''],
       ['主要竞品与相对弱点', 'missing', '', ''],
       ['库存与交期', 'ok', sSku.stock + ' 件 · ' + sSku.stockNote, '']],
      [['可说 Claim 清单', 'ok', swPf.canClaim, 'SRC-003'],
       ['禁止说 Claim 清单', 'ok', swPf.noClaim, 'SRC-003'],
       ['Claim—证据映射', 'missing', '', ''],
       ['第三方检测报告', 'missing', '', ''],
       ['认证资质', 'missing', '', ''],
       ['广告披露要求', 'ok', '美区需同时标注 #ad 与 Paid partnership', 'SRC-003'],
       ['敏感标签与处理方式', 'ai', swPf.sensitive, '']],
      [['购买者与决策者', 'ok', swPf.buyer, 'SRC-004'],
       ['实际使用者', 'ai', swPf.user, 'SRC-004'],
       ['核心使用场景', 'ok', swPf.scene, 'SRC-004'],
       ['核心痛点', 'ai', swPf.pain, 'SRC-004'],
       ['功能性 Job', 'ai', swPf.job, 'SRC-004'],
       ['情绪与社会性 Job', 'ai', swPf.jobEmo, 'SRC-004'],
       ['顾虑与信任缺口', 'ai', swPf.doubt, 'SRC-004'],
       ['原声表达（VOC）', 'ok', swPf.voc, 'SRC-004'],
       ['常用平台与内容偏好', 'ok', swPf.platformPref, '']],
      [['主目标（营销目标）', 'ok', (s.sw.goalType || '爆品打造'), '', 'select'],
       ['次要目标', 'ok', '转化作为观察指标，不作首轮考核', ''],
       ['KPI 与优先级', 'ok', '90 条内容 · 完播 ≥ 35% · CPV ≤ $0.012', ''],
       ['目标销量', 'missing', '', ''],
       ['目标 GMV', 'missing', '', ''],
       ['活动周期与关键节点', 'ok', '8/1 – 9/30，第 6 周起筛选素材投放', ''],
       ['待验证假设', 'ai', swPf.hypothesis, 'SRC-005']],
      [['国家与站点', 'ok', 'US · Amazon.com', ''],
       ['语言', 'ok', '英语', ''],
       ['平台与渠道优先级', 'ok', 'TikTok US 主战场，IG Reels 承接搜索', ''],
       ['内容形式与平台限制', 'ok', swPf.formLimit, ''],
       ['本地文化禁忌', 'missing', '', ''],
       ['转化落地页', 'ok', 'Amazon Listing', ''],
       ['优惠码机制', 'ok', '红人专属折扣码 + UTM 短链', '']],
      [['理想红人画像', 'ok', swPf.creatorNiche, ''],
       ['粉丝层级与受众结构', 'ok', 'KOC 60% · Micro 30% · Expert 10%', ''],
       ['最低互动质量', 'ok', 'ER ≥ 4%，完播 ≥ 30%', ''],
       ['品牌安全与排除规则', 'ai', '排除争议性内容与竞品同期合作', ''],
       ['已有名单及合作状态', 'ok', '6 位在库 · 3 位在 shortlist', 'SRC-006'],
       ['报价与 Media Kit', 'missing', '', '']],
      [['总预算及币种', 'ok', budgetTotalText + ' USD', ''],
       ['红人费用占比', 'ok', '34%', ''],
       ['寄样与物流占比', 'ok', '14%', ''],
       ['投放费用占比', 'ok', '22%', ''],
       ['合作模式', 'ok', 'KOC 寄样 + 12% 佣金；Micro 固定费 + 佣金', ''],
       ['素材授权范围与期限', 'ok', '社媒 6 个月 + 白名单投放 3 个月', ''],
       ['排他期与付款条件', 'missing', '', ''],
       ['内部负责人', 'ok', sSku.owner, ''],
       ['审批 SLA', 'ai', '法务 48h 内回复', '']],
      [['历史活动及核心结果', 'ok', 'Q2 北美种草：12 位红人 · 19 条内容 · $28.4K', 'SRC-005'],
       ['成功内容特点', 'ok', '场景化叙事角度 ROAS 高 41%', 'SRC-005'],
       ['失败内容特点', 'ok', '参数型口播完播仅 19%', 'SRC-005'],
       ['可复用素材', 'ai', '21 个已获广告授权', ''],
       ['禁止复用素材', 'ai', '1 条含「见效」字幕需重剪后方可使用', ''],
       ['竞品标杆案例', 'missing', '', '']]
    ];
    const swUploadBank = [
      ['产品说明书 PDF/DOCX', '产品参数表 XLSX/CSV', '品牌手册 PDF/PPTX', '产品图片与视频', 'Listing / 官网链接', '竞品资料'],
      ['专利 / 认证 / 检测报告', '临床或实验数据', '合规审核文件', 'Claim Permission Matrix', '法务意见 / 平台政策链接'],
      ['Persona / JTBD 文档', '用户访谈与问卷', 'Amazon Review / Q&A / 退货原因', '客服 VOC 与社媒评论', 'CSV / XLSX 数据文件'],
      ['Campaign Brief', '历史活动报告', 'KPI 目标表', '营销日历'],
      ['市场研究报告', '平台规则', '本地化指南', '竞品内容链接与截图', '落地页资料'],
      ['红人名单 CSV/XLSX', '平台数据导出', '历史合作结果', '报价单 / Media Kit', '红人主页链接'],
      ['预算表', '合同模板', '授权条款', '物流与库存信息', '内部审批流程'],
      ['历史复盘与数据报表', '视频 / 图片 / 脚本 / Brief', '竞品案例链接', '广告素材与效果数据']
    ];
    const swFields = swFieldBank.map((mod, mi) => mod.map(([label, st, value, src, kind], fi) => {
      const key = (mi + 1) + '-' + fi;
      const edited = sw.fieldEdits[key] !== undefined;
      const state = sw.fieldState[key] || (edited ? 'ok' : st);
      const shown = edited ? sw.fieldEdits[key] : value;
      const editing = sw.fieldEditing === key;
      const meta = { ok: ['已确认', SAGE, '#E4EFE4'], ai: ['AI 提取 · 待确认', '#1D48D8', '#F1F5FF'], na: ['不适用', '#8792A5', '#F5F8FE'], missing: ['待补充', RUST, '#FBE3E3'] }[state];
      return {
        key, label, module: mi + 1, moduleName: swStepDefs[mi][0],
        go: () => this.setState(st2 => ({ sw: { ...st2.sw, step: mi + 1 } })),
        value: state === 'missing' ? '待补充' : (state === 'na' ? '不适用' : shown),
        src, hasSrc: !!src && state !== 'missing' && state !== 'na',
        state, tag: edited && state === 'ok' ? '已编辑确认' : meta[0], color: meta[1], tagBg: meta[2],
        canConfirm: state === 'ai' && kind !== 'select', canMark: state === 'missing' && kind !== 'select',
        canEdit: kind !== 'select', canEditNow: !editing && kind !== 'select',
        editing, notEditing: !editing,
        isSelect: kind === 'select' && !editing,
        plainRead: !editing && kind !== 'select',
        selOpen: s.swSelOpen === key,
        selBd: s.swSelOpen === key ? '#2457F5' : '#E2E8F2',
        toggleSel: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st2 => ({ swSelOpen: st2.swSelOpen === key ? null : key })); },
        selOptions: ['爆品打造', '品牌打造', '新品起量', '常规走量'].map(g => ({
          label: g, bg: shown === g ? '#EAF0FF' : 'transparent', fg: shown === g ? '#2457F5' : '#1D2638',
          pick: () => this.setState(st2 => ({ swSelOpen: null, sw: { ...st2.sw, goalType: g, fieldEdits: { ...st2.sw.fieldEdits, [key]: g }, fieldState: { ...st2.sw.fieldState, [key]: 'ok' } } }))
        })),
        confirm: () => this.setState(st2 => ({ sw: { ...st2.sw, fieldState: { ...st2.sw.fieldState, [key]: 'ok' } } })),
        markNA: () => this.setState(st2 => ({ sw: { ...st2.sw, fieldState: { ...st2.sw.fieldState, [key]: 'na' } } })),
        startEdit: () => this.setState(st2 => ({ sw: { ...st2.sw, fieldEditing: key, fieldDraft: state === 'missing' || state === 'na' ? '' : shown } })),
        saveEdit: () => this.setState(st2 => ({ sw: { ...st2.sw, fieldEditing: null, fieldEdits: { ...st2.sw.fieldEdits, [key]: st2.sw.fieldDraft }, fieldState: { ...st2.sw.fieldState, [key]: 'ok' } } })),
        cancelEdit: () => this.setState(st2 => ({ sw: { ...st2.sw, fieldEditing: null } }))
      };
    }));
    const swAllFields = swFields.flat();
    const swFilled = swAllFields.filter(f => f.state === 'ok' || f.state === 'na').length;
    const swAiPending = swAllFields.filter(f => f.state === 'ai').length;
    const swMissing = swAllFields.filter(f => f.state === 'missing');
    const swInputPct = Math.round(swFilled / swAllFields.length * 100);
    const swPendingKeys = swFieldBank.flatMap((mod, mi) => mod.map(([, st], fi) => st === 'ok' ? null : (mi + 1) + '-' + fi).filter(Boolean));
    const skuInputDone = (sku) => {
      if (sku === sSku.sku) return swMissing.length === 0 && swAiPending === 0;
      const bag = (s.swStore || {})[sku];
      if (!bag) return false;
      const fsx = bag.fieldState || {}, fex = bag.fieldEdits || {};
      return swPendingKeys.every(k => fsx[k] === 'ok' || fsx[k] === 'na' || fex[k] !== undefined);
    };
    const skuFillPct = (sku) => {
      if (sku === sSku.sku) return swInputPct;
      const bag = (s.swStore || {})[sku];
      const fsx = (bag && bag.fieldState) || {}, fex = (bag && bag.fieldEdits) || {};
      const okBase = swAllFields.filter(f => f.state === 'ok' || f.state === 'na').length;
      const extra = swPendingKeys.filter(k => fsx[k] === 'ok' || fsx[k] === 'na' || fex[k] !== undefined).length;
      return Math.round(Math.min(swAllFields.length, okBase + extra) / swAllFields.length * 100);
    };

    const swSources = sw.sources.map((src, i) => ({
      ...src, idx: i + 1,
      statusColor: src.status === 'parsed' ? SAGE : src.status === 'processing' ? '#1D48D8' : src.status === 'partial' ? AMBER : RUST,
      statusBg: src.status === 'parsed' ? '#E4EFE4' : src.status === 'processing' ? '#F1F5FF' : src.status === 'partial' ? '#FBEEDA' : '#FBE3E3',
      statusText: { parsed: '已解析', processing: '解析中', partial: '部分成功', failed: '解析失败', queued: '等待中' }[src.status],
      moduleName: swStepDefs[src.module - 1][0],
      remove: () => this.setState(st2 => ({ sw: { ...st2.sw, sources: st2.sw.sources.filter(x => x.code !== src.code) } }))
    }));
    const swStep = sw.step;
    const swModuleIdx = Math.min(swStep, 8) - 1;
    const swIsForm = swStep <= 8, swIsCheck = swStep === 9, swIsGen = swStep === 10;
    const swModuleName = swStepDefs[swStep - 1][0];
    const swModuleFields = swIsForm ? swFields[swModuleIdx] : [];
    const swModuleUploads = swIsForm ? swUploadBank[swModuleIdx].map(label => ({ label })) : [];
    const swModuleSources = swSources.filter(x => x.module === swStep);
    const swSteps = swStepDefs.map(([name], i) => {
      const n = i + 1, on = n === swStep;
      const flds = i < 8 ? swFields[i] : [];
      const miss = flds.filter(f => f.state === 'missing').length;
      const pct = i < 8 ? Math.round(flds.filter(f => f.state === 'ok' || f.state === 'na').length / flds.length * 100) : null;
      return {
        no: n, name, pct: pct === null ? '' : pct + '%',
        dot: i >= 8 ? '#A8B1C0' : miss > 0 ? RUST : SAGE,
        bg: on ? '#EAF0FF' : 'transparent', fg: on ? '#1D2638' : '#647187', fw: on ? 600 : 400,
        pick: () => {
          this.setState(st2 => ({ sw: { ...st2.sw, step: n } }));
          if (n === 10) requestAnimationFrame(() => {
            const el = document.getElementById('strategy-bench-top');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        }
      };
    });

    const swEvidenceClaims = swPf.evidence.map(([claim, ev, ok]) => ({ claim, ev, ok })).map(c => ({ ...c, evText: c.ok ? c.ev : '无来源支持', color: c.ok ? SAGE : RUST, bg: c.ok ? '#E4EFE4' : '#FBE3E3', tag: c.ok ? '有证据' : '无证据' }));
    const swEvidencePct = Math.round(swEvidenceClaims.filter(c => c.ok).length / swEvidenceClaims.length * 100);
    const swTruthPct = Math.round((swFields[2].filter(f => f.state === 'ok').length / swFields[2].length) * 100);
    const swReadyPct = Math.round((swFields[6].filter(f => f.state === 'ok').length / swFields[6].length) * 100);
    const swScores = [
      { label: '输入完整度', pct: swInputPct, note: swFilled + ' / ' + swAllFields.length + ' 项已确认' },
      { label: '证据覆盖率', pct: swEvidencePct, note: '核心卖点中有来源支持的比例' },
      { label: 'Consumer Truth', pct: swTruthPct, note: '角色 · 场景 · JTBD · 摩擦 · 原声' },
      { label: '执行就绪度', pct: swReadyPct, note: '预算 · 授权 · 排他 · 审批' }
    ].map(x => ({ ...x, color: x.pct >= 80 ? SAGE : x.pct >= 55 ? AMBER : RUST }));

    const swGateLevel = swEvidencePct < 60 || swMissing.length > 6 ? 'red' : (swMissing.length > 0 || swAiPending > 0 ? 'yellow' : 'green');
    const swGate = {
      red: ['红色 · 不可生成正式策略', RUST, '#FBE3E3', '缺少 Claim 证据或关键字段，只能生成带 HOLD 标记的草案。'],
      yellow: ['黄色 · 可生成草案', AMBER, '#FBEEDA', '可以生成策略草案，但必须列出假设与缺失项。'],
      green: ['绿色 · 可生成正式策略', SAGE, '#E4EFE4', '关键输入齐备，Claim 均可追溯到来源。']
    }[swGateLevel];
    const swGateLabel = swGate[0], swGateColor = swGate[1], swGateBg = swGate[2], swGateNote = swGate[3];
    const swHold = swGateLevel === 'red';

    const swRisks = [
      swEvidencePct < 100 ? { title: '无证据 Claim', body: swEvidenceClaims.filter(c => !c.ok).map(c => '「' + c.claim + '」').join('') + '缺少来源，不得写入外发 Brief。', color: RUST, jump: 2 } : null,
      swAiPending > 0 ? { title: swAiPending + ' 项 AI 提取待确认', body: '标记为 AI_SUGGESTED 的内容未经确认，不会作为硬事实写入策略。', color: '#1D48D8', jump: 1 } : null,
      { title: '敏感品类边界', body: swPf.sensitive + '；功效类 Claim 需法务确认后才能解除 HOLD。', color: AMBER, jump: 2 },
      sSku.stockNote.indexOf('需补货') >= 0 ? { title: '库存不足', body: '当前库存 ' + sSku.stock + ' 件（' + sSku.stockNote + '），放量前需确认补货。', color: RUST, jump: 7 } : null,
      { title: '归因不完整', body: '仅有折扣码归因，TikTok Shop 未接入，预测值需标注为测算假设。', color: BLUE, jump: 4 }
    ].filter(Boolean).map(r => ({ ...r, go: () => this.setState(st2 => ({ sw: { ...st2.sw, step: r.jump } })) }));

    const swModes = [
      { id: 'quick', label: '快速版', note: '核心策略与行动清单' },
      { id: 'standard', label: '标准版', note: '完整策略 · 红人组合 · 内容矩阵 · 预算 KPI' },
      { id: 'deep', label: '深度版', note: '增加假设 · 实验设计 · 风险与资产放大' }
    ].map(m => {
      const on = sw.mode === m.id;
      return {
        ...m,
        pick: () => this.setState(st2 => ({ sw: { ...st2.sw, mode: m.id } })),
        bg: on ? '#EAF0FF' : '#FFFFFF', fg: on ? '#1D48D8' : '#647187', bd: on ? '#B8CBFF' : '#E2E8F2'
      };
    });
    const swModeName = { quick: '快速版', standard: '标准版', deep: '深度版' }[sw.mode];
    const swSectionCount = { quick: 8, standard: 15, deep: 19 }[sw.mode];

    const swGoalType = swFields[3][0].value;
    const swGoalCopy = {
      '爆品打造': { lead: sSku.name + '这一轮要做成爆品：用密集内容在短期内把', main: '主目标为爆品打造——把单一卖点在短期内做到高频出现', extra: '成功标准偏向内容密度与曝光集中度，转化作为观察指标。' },
      '品牌打造': { lead: sSku.name + '这一轮不追单品转化，先把品牌调性与', main: '主目标为品牌打造——建立可被复述的品牌叙事与信任资产', extra: '成功标准偏向内容质量与红人层级质量，销量不作为本轮考核。' },
      '新品起量': { lead: sSku.name + '这一轮要解决从 0 到 1 的认知问题，先把', main: '主目标为新品起量——用真实使用场景建立认知并跑出首批数据', extra: '成功标准偏向素材数量与首周数据，用于验证角度是否成立。' },
      '常规走量': { lead: sSku.name + '这一轮以稳定出量为主，用已验证的', main: '主目标为常规走量——以可复制的内容结构维持稳定曝光与成交', extra: '成功标准偏向单位成本（CPV）与交付准时率。' }
    }[swGoalType] || { lead: sSku.name + '这一轮种草不追转化，先把', main: '主目标为种草与素材沉淀', extra: '转化数据仅作观察，不作为本轮考核。' };
    const secBank = [
      ['执行摘要', swGoalCopy.lead + '「' + (sAngleMap[sSku.sku] || '具体使用时刻') + '」这个说法立住。红人组合为 ' + sTier + '，主阵地 ' + sPlatName + '，总预算 ' + budgetTotalText + '。', 'SRC-001', false],
      ['项目目标与成功标准', swGoalCopy.main + '，成功标准：' + strategySummary[7].value + '。' + swGoalCopy.extra, '', false],
      ['Consumer Truth Snapshot', swFields[2][1].value + '。真正的购买动机是' + swFields[2][2].value + '，最大摩擦是' + swFields[2][3].value + '。', 'SRC-004', false],
      ['产品—人群—场景—证据匹配', '产品事实可支撑的表述限于' + swFields[1][0].value + '；「缓解压力」类表述目前无证据支持，只能以红人第一人称体感呈现。', 'SRC-003', true],
      ['一句话种草主张与传播原则', '「' + strategySummary[2].value + '」。原则：先画面后结论，不做参数对比，不做疗效承诺。', '', true],
      ['平台与市场策略', sPlat + '。内容形式：' + sFmt + '。竖屏 21–34 秒，封面需可进 Grid。', '', false],
      ['红人组合及分层配置', sTier + '。KOC 负责铺量与真实感，Micro 负责内容标杆，Expert 提供不触碰功效边界的专业背书。', 'SRC-006', false],
      ['红人筛选评分卡与淘汰规则', '评分维度：内容契合度 30% · 受众重合 25% · 互动质量 25% · 交付稳定性 20%。淘汰规则：ER < 4%、历史逾期 ≥ 2 次、受众性别或市场不符。', 'SRC-006', false],
      ['内容支柱与选题矩阵', swPf.pillars + '。每支柱预设 4 个选题。', 'SRC-005', false],
      ['各平台内容形式、Hook、Proof、CTA', '' + swPf.hook, 'SRC-005', false],
      ['标准内容 Brief', swPf.briefMust, 'SRC-003', false],
      ['Claim 安全边界与披露要求', '可说：' + swFields[1][0].value + '。禁止：' + swFields[1][1].value + '。披露：' + swFields[1][4].value + '。', 'SRC-003', false],
      ['合作模式、预算配置与测算假设', strategySummary[6].value + '，总预算 ' + budgetTotalText + '。所有 CPV / CPA 预测均为测算假设，非承诺值。', '', true],
      ['执行排期、负责人与审批门', '第 1–2 周寄样，第 3–5 周集中发布，第 6 周筛选素材投放。负责人 ' + sSku.owner + '，法务审批 SLA 48 小时。', '', false],
      ['KPI、归因与数据回收', 'KPI：' + strategySummary[7].value + '。归因仅折扣码 + UTM 短链，TikTok Shop 未接入，数据置信度中等。', '', true],
      ['A/B 测试与学习计划', '两组对照：睡前 routine vs 开箱；逐字脚本 vs「必须讲到三件事」。每组至少 8 条内容才做结论。', 'SRC-005', false],
      ['优质素材复用与付费放大', '完播 ≥ 40% 且已获广告授权的素材进入白名单投放；当前 21 / 38 个资产可用于投放。', '', false],
      ['风险清单与应急预案', '功效表述违规 → 下架重剪；交付逾期 → 备选红人池补位；库存不足 → 暂停铺量并前置补货。', '', false],
      ['缺失信息、假设及待确认项', swMissing.length > 0 ? '仍缺 ' + swMissing.length + ' 项：' + swMissing.slice(0, 4).map(f => f.label).join('、') + (swMissing.length > 4 ? ' 等' : '') + '。' : '关键输入已齐备，无阻塞项。', '', true]
    ];
    const swSections = secBank.slice(0, swSectionCount).map(([title, body, src, inferred], i) => {
      const n = i + 1;
      const locked = sw.locked.includes(n);
      const confirmed = (sw.confirmed || []).includes(n);
      const edited = sw.edits[n] !== undefined;
      const bumped = sw.regen[n] || 1;
      const editing = sw.editing === n;
      const text = edited ? sw.edits[n] : body;
      const stateMeta = confirmed ? ['已确认', SAGE, '#E4EFE4'] : (edited ? ['已编辑 · 待确认', '#A5762C', '#FBEEDA'] : ['AI 草稿', '#1D48D8', '#F1F5FF']);
      return {
        no: n, title, body: text, src, hasSrc: !!src, inferred, anchor: 'strategy-work-sec-' + n,
        ver: 'v' + ((sw.verBase || 1) + bumped - 1), locked, confirmed, editing, notEditing: !editing,
        stateText: stateMeta[0], stateColor: stateMeta[1], stateBg: stateMeta[2],
        confirmLabel: confirmed ? '✓ 已确认' : '确认',
        confirmBg: confirmed ? '#E4EFE4' : '#2457F5', confirmFg: confirmed ? '#4E7156' : '#FFFFFF', confirmBd: confirmed ? '#CFE3D3' : '#2457F5',
        lockLabel: locked ? '已锁定' : '锁定',
        lockBg: locked ? '#F5F8FE' : '#FFFFFF', lockFg: locked ? '#1D2638' : '#8792A5', lockBd: locked ? '#C8D4E8' : '#E2E8F2',
        cardBd: editing ? '#2457F5' : (confirmed ? '#CFE3D3' : '#EEF2F8'),
        numBg: confirmed ? '#E4EFE4' : '#F5F8FE', numFg: confirmed ? '#4E7156' : '#8792A5',
        toggleLock: () => this.setState(st2 => ({ sw: { ...st2.sw, locked: locked ? st2.sw.locked.filter(x => x !== n) : [...st2.sw.locked, n], editing: st2.sw.editing === n ? null : st2.sw.editing } })),
        toggleConfirm: () => this.setState(st2 => ({ sw: { ...st2.sw, confirmed: confirmed ? st2.sw.confirmed.filter(x => x !== n) : [...st2.sw.confirmed, n] } })),
        regen: () => { if (locked) return; this.setState(st2 => ({ sw: { ...st2.sw, activeSection: n, editing: null, regen: { ...st2.sw.regen, [n]: bumped + 1 }, confirmed: st2.sw.confirmed.filter(x => x !== n) } })); },
        startEdit: () => { if (locked) return; this.setState(st2 => ({ sw: { ...st2.sw, editing: n, draft: text, activeSection: n } })); },
        saveEdit: () => this.setState(st2 => ({ sw: { ...st2.sw, editing: null, edits: { ...st2.sw.edits, [n]: st2.sw.draft } } })),
        cancelEdit: () => this.setState(st2 => ({ sw: { ...st2.sw, editing: null } }))
      };
    });
    const swGroupDefs = [['目标与洞察', 1, 4], ['主张与平台', 5, 6], ['红人与内容', 7, 11], ['商业与执行', 12, 15], ['学习与风险', 16, 19]];
    const swGroups = swGroupDefs.map(([title, a, b]) => {
      const items = swSections.filter(x => x.no >= a && x.no <= b);
      return { title, items, count: items.length + ' 章', has: items.length > 0 };
    }).filter(g => g.has);
    const swConfirmedCount = swSections.filter(x => x.confirmed).length;
    const swConfirmPct = Math.round(swConfirmedCount / Math.max(1, swSections.length) * 100);
    const swToc = swSections.map(x => ({
      no: x.no, title: x.title,
      bg: x.no === sw.activeSection ? '#EAF0FF' : 'transparent',
      fg: x.no === sw.activeSection ? '#2457F5' : '#647187',
      fw: x.no === sw.activeSection ? 600 : 400,
      dot: x.confirmed ? SAGE : (sw.edits[x.no] !== undefined ? AMBER : '#B8CBFF'),
      status: x.confirmed ? '已确认' : '待确认',
      statusFg: x.confirmed ? '#6E8F74' : '#A2ABBA',
      pick: () => {
        this.setState(st2 => ({ sw: { ...st2.sw, activeSection: x.no } }));
        const el = document.getElementById('strategy-work-sec-' + x.no);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }));
    const swGenerated = sw.generated;
    const swNotGenerated = !sw.generated;
    const swGateStatus = swHold ? 'hold' : (swGateLevel === 'yellow' ? 'draft' : 'formal');
    const statusMeta = (id) => ({
      formal: ['正式策略', SAGE, '#E4EFE4'], draft: ['草案', AMBER, '#FBEEDA'], hold: ['草案 · 待补证据', RUST, '#FBE3E3']
    }[id] || ['草案', AMBER, '#FBEEDA']);
    const swShownStatus = sw.loadedStatus || swGateStatus;
    const swStatusMeta = statusMeta(swShownStatus);
    const swStatusLabel = swStatusMeta[0], swStatusColor = swStatusMeta[1], swStatusBg = swStatusMeta[2];

    const library = (s.library || []).map(x => {
      const cur = x.sku === sSku.sku;
      const latestCampaignSnapshot = (s.campaignStrategyVersions || []).find(v => v.sku === x.sku && v.ver === x.ver);
      const st2 = statusMeta(cur && sw.generated && !sw.loadedStatus ? swGateStatus : x.status);
      const conf = cur && sw.generated ? swConfirmedCount : x.confirmed;
      return {
        ...x, verText: 'v' + x.ver, current: cur, sections: x.sections,
        modeName: { quick: '快速版', standard: '标准版', deep: '深度版' }[x.mode],
        statusText: st2[0], statusColor: st2[1], statusBg: st2[2],
        confirmText: conf + ' / ' + x.sections + ' 章已确认',
        rowBd: cur ? '#C8D4E8' : '#EEF2F8', rowBg: cur ? '#F8FAFE' : '#FFFFFF',
        openLabel: '查看策略',
        openBg: '#2457F5', openFg: '#FFFFFF', openBd: '#2457F5',
        open: () => {
          const snapshotEdits = latestCampaignSnapshot && Array.isArray(latestCampaignSnapshot.sections)
            ? latestCampaignSnapshot.sections.reduce((acc, sec, i) => ({ ...acc, [i + 1]: sec.body || '' }), {})
            : null;
          this.switchSku(x.sku);
          this.setState(stx => ({ stTab: 'work', benchOpen: true, spPanel: null, docMode: true, sw: { ...stx.sw, generated: true, step: 10, editing: null, mode: latestCampaignSnapshot ? (latestCampaignSnapshot.mode || x.mode) : stx.sw.mode, edits: snapshotEdits || stx.sw.edits, confirmed: latestCampaignSnapshot ? Array.from({ length: latestCampaignSnapshot.confirmed || 0 }, (_, i) => i + 1) : stx.sw.confirmed } }));
        },
        remove: () => this.setState(stx => ({ library: stx.library.filter(y => y.sku !== x.sku) }))
      };
    });

    const stApprovalOf = (sku, ver, isLatest) => {
      const key = sku + '|v' + ver;
      const set = s.strategyApproved || {};
      if (set[key]) return set[key];
      return isLatest ? '草稿' : '已通过';
    };
    const swVersionModeName = { quick: '快速版', standard: '标准版', deep: '深度版' };
    const swVersionRec = (s.library || []).find(x => x.sku === sSku.sku);
    const swSavedVersionMax = (s.campaignStrategyVersions || []).filter(x => x.sku === sSku.sku).reduce((max, x) => Math.max(max, Number(x.ver) || 0), 0);
    const swVersionMax = Math.max((swVersionRec && Number(swVersionRec.ver)) || 0, swSavedVersionMax, Number(sw.verBase) || 1);
    const swDeletedVersionSet = new Set(s.strategyVersionDeleted || []);
    const swVersionNumbers = Array.from({ length: swVersionMax }, (_, i) => swVersionMax - i).filter(version => !swDeletedVersionSet.has(sSku.sku + '|v' + version));
    const swLatestVersion = swVersionNumbers[0] || 1;
    const swCurrentVersion = swVersionNumbers.includes(Number(sw.verBase)) ? Number(sw.verBase) : swLatestVersion;
    const makeCurrentSwSnapshot = (version, source) => ({
      sku: sSku.sku, product: sSku.name, brand: sSku.brand, owner: sSku.owner,
      ver: version, title: sSku.name + ' 红人种草策略', mode: sw.mode,
      sections: swSections.map(sec => ({ no: sec.no, title: sec.title, body: sec.body, src: sec.src || '' })),
      confirmed: swConfirmedCount, date: '2026-09-08', status: '草稿', source
    });
    const upsertSwSnapshot = (rows, snapshot) => [snapshot, ...(rows || []).filter(x => !(x.sku === snapshot.sku && Number(x.ver) === Number(snapshot.ver)))];
    const swVersionOptions = swVersionNumbers.map(version => {
      const snapshot = (s.campaignStrategyVersions || []).find(x => x.sku === sSku.sku && Number(x.ver) === version);
      const isLatest = version === swLatestVersion;
      const on = version === swCurrentVersion;
      const approval = stApprovalOf(sSku.sku, version, isLatest);
      const tone = approval === '已通过' ? ['#E4EFE4', '#4E7156'] : (approval === '待审批' ? ['#FBEEDA', '#A5762C'] : ['#F5F8FE', '#647187']);
      const mode = (snapshot && snapshot.mode) || (swVersionRec && swVersionRec.mode) || sw.mode;
      const customName = (s.strategyVersionNames || {})[sSku.sku + '|v' + version] || '';
      const displayName = customName || (swVersionModeName[mode] || '标准版');
      return {
        version, name: displayName, label: displayName + ' v' + version + (isLatest ? ' · 最新' : ''),
        meta: snapshot ? ((snapshot.date || '2026-09-08') + ' · 已保存完整版本') : (isLatest ? ((swVersionRec && swVersionRec.date) || '—') + ' · 当前版本' : '历史版本'),
        status: approval, statusBg: tone[0], statusFg: tone[1],
        bg: on ? '#EAF0FF' : 'transparent', fg: on ? '#1D48D8' : '#334155',
        radioBg: on ? '#2457F5' : '#FFFFFF', radioBd: on ? '#2457F5' : '#C8D4E8', mark: on ? '✓' : '',
        pick: () => this.setState(st2 => {
          const currentSnapshot = makeCurrentSwSnapshot(swCurrentVersion, 'Strategy Studio · 自动保存');
          const snapshots = upsertSwSnapshot(st2.campaignStrategyVersions || [], currentSnapshot);
          const target = snapshots.find(x => x.sku === sSku.sku && Number(x.ver) === version);
          const targetMode = (target && target.mode) || (swVersionRec && swVersionRec.mode) || st2.sw.mode;
          const targetEdits = target && Array.isArray(target.sections)
            ? target.sections.reduce((acc, sec, idx) => ({ ...acc, [idx + 1]: sec.body || '' }), {})
            : {};
          const targetCount = (target && target.confirmed) || (!target && version < swLatestVersion ? ({ quick: 8, standard: 15, deep: 19 }[targetMode] || 15) : 0);
          return {
            campaignStrategyVersions: snapshots,
            campaignStrategySelected: { ...(st2.campaignStrategySelected || {}), [sSku.sku]: sSku.sku + '|v' + version },
            swVersionMenu: false, swVersionNotice: '已切换至 v' + version + '。',
            sw: { ...st2.sw, mode: targetMode, verBase: version, generated: true, step: 10, editing: null, edits: targetEdits, regen: {}, locked: [], confirmed: Array.from({ length: targetCount }, (_, idx) => idx + 1), loadedStatus: approval === '已通过' ? 'formal' : 'draft', savedAt: '刚刚' }
          };
        })
      };
    });
    const swCurrentVersionName = (swVersionOptions.find(x => x.version === swCurrentVersion) || {}).name || swVersionModeName[sw.mode] || '标准版';
    const swVersionManagerRows = swVersionOptions.map(option => {
      const key = sSku.sku + '|v' + option.version;
      const editing = s.swVersionRenameKey === key;
      const deletePending = s.swVersionDeleteKey === key;
      const canDelete = swVersionOptions.length > 1;
      return {
        ...option, editing, notEditing: !editing,
        numBg: option.version === swCurrentVersion ? '#EAF0FF' : '#F5F8FE', numFg: option.version === swCurrentVersion ? '#2457F5' : '#647187',
        startRename: () => this.setState({ swVersionRenameKey: key, swVersionRenameDraft: option.name, swVersionDeleteKey: '' }),
        cancelRename: () => this.setState({ swVersionRenameKey: '', swVersionRenameDraft: '' }),
        saveRename: () => {
          const name = String(s.swVersionRenameDraft || '').trim();
          if (!name) return;
          this.setState(st2 => ({ strategyVersionNames: { ...(st2.strategyVersionNames || {}), [key]: name }, swVersionRenameKey: '', swVersionRenameDraft: '', swVersionNotice: 'v' + option.version + ' 已重命名为“' + name + '”。' }));
        },
        deleteLabel: !canDelete ? '至少保留一个' : (deletePending ? '确认删除' : '删除'),
        deleteTitle: !canDelete ? '至少需要保留一个策略版本' : (deletePending ? '再次点击将永久删除该版本' : '删除该版本'),
        deleteFg: !canDelete ? '#A2ABBA' : '#C4636D', deleteBd: deletePending ? '#C4636D' : '#E9CACA', deleteBg: deletePending ? '#FBE3E3' : '#FFFFFF', deleteCursor: canDelete ? 'pointer' : 'default',
        remove: () => {
          if (!canDelete) return;
          if (!deletePending) { this.setState({ swVersionDeleteKey: key, swVersionRenameKey: '' }); return; }
          this.setState(st2 => {
            const remaining = swVersionNumbers.filter(version => version !== option.version);
            const nextVersion = remaining[0];
            const snapshots = (st2.campaignStrategyVersions || []).filter(x => !(x.sku === sSku.sku && Number(x.ver) === option.version));
            const target = snapshots.find(x => x.sku === sSku.sku && Number(x.ver) === nextVersion);
            const targetMode = (target && target.mode) || (swVersionRec && swVersionRec.mode) || st2.sw.mode;
            const targetEdits = target && Array.isArray(target.sections) ? target.sections.reduce((acc, sec, idx) => ({ ...acc, [idx + 1]: sec.body || '' }), {}) : {};
            const targetCount = (target && target.confirmed) || (!target ? ({ quick: 8, standard: 15, deep: 19 }[targetMode] || 15) : 0);
            const names = { ...(st2.strategyVersionNames || {}) };
            const approvals = { ...(st2.strategyApproved || {}) };
            delete names[key]; delete approvals[key];
            const selected = { ...(st2.campaignStrategySelected || {}) };
            const applied = { ...(st2.campaignStrategyApplied || {}) };
            if (selected[sSku.sku] === key || option.version === swCurrentVersion) selected[sSku.sku] = sSku.sku + '|v' + nextVersion;
            if (applied[sSku.sku] === key) applied[sSku.sku] = sSku.sku + '|v' + nextVersion;
            const changeCurrent = option.version === swCurrentVersion;
            return {
              campaignStrategyVersions: snapshots, campaignStrategySelected: selected, campaignStrategyApplied: applied,
              strategyVersionNames: names, strategyApproved: approvals,
              strategyVersionDeleted: Array.from(new Set([...(st2.strategyVersionDeleted || []), key])),
              library: (st2.library || []).map(x => x.sku === sSku.sku ? { ...x, ver: remaining[0], date: (target && target.date) || x.date, mode: targetMode, sections: (target && target.sections && target.sections.length) || x.sections, confirmed: targetCount } : x),
              swVersionDeleteKey: '', swVersionRenameKey: '', swVersionRenameDraft: '', swVersionNotice: 'v' + option.version + ' 已删除。',
              sw: changeCurrent ? { ...st2.sw, mode: targetMode, verBase: nextVersion, generated: true, step: 10, editing: null, edits: targetEdits, regen: {}, locked: [], confirmed: Array.from({ length: targetCount }, (_, idx) => idx + 1), loadedStatus: 'draft', savedAt: '刚刚' } : st2.sw
            };
          });
        }
      };
    });
    const swUpdateVersion = () => this.setState(st2 => {
      const snapshot = makeCurrentSwSnapshot(swCurrentVersion, 'Strategy Studio · 更新版本');
      const isLatest = !swVersionRec || swCurrentVersion === swLatestVersion;
      return {
        campaignStrategyVersions: upsertSwSnapshot(st2.campaignStrategyVersions || [], snapshot),
        campaignStrategySelected: { ...(st2.campaignStrategySelected || {}), [sSku.sku]: sSku.sku + '|v' + swCurrentVersion },
        strategyApproved: { ...(st2.strategyApproved || {}), [sSku.sku + '|v' + swCurrentVersion]: '草稿' },
        library: isLatest ? (st2.library || []).map(x => x.sku === sSku.sku ? { ...x, ver: swCurrentVersion, date: '2026-09-08', mode: st2.sw.mode, sections: snapshot.sections.length, confirmed: snapshot.confirmed, status: 'draft' } : x) : st2.library,
        swVersionMenu: false, swSaveAsOpen: false, swSaveAsDraft: '', swVersionNotice: 'v' + swCurrentVersion + ' 已更新。',
        sw: { ...st2.sw, loadedStatus: 'draft', savedAt: '刚刚' }
      };
    });
    const swSaveAsVersion = () => this.setState(st2 => {
      const versionName = String(st2.swSaveAsDraft || '').trim();
      if (!versionName) return {};
      const rec = (st2.library || []).find(x => x.sku === sSku.sku);
      const storedMax = (st2.campaignStrategyVersions || []).filter(x => x.sku === sSku.sku).reduce((max, x) => Math.max(max, Number(x.ver) || 0), 0);
      const deletedMax = (st2.strategyVersionDeleted || []).filter(key => key.startsWith(sSku.sku + '|v')).reduce((max, key) => Math.max(max, Number(key.split('|v')[1]) || 0), 0);
      const nextVersion = Math.max((rec && Number(rec.ver)) || 0, storedMax, deletedMax, Number(st2.sw.verBase) || 0) + 1;
      const snapshot = makeCurrentSwSnapshot(nextVersion, 'Strategy Studio · 另存版本');
      const nextRec = { sku: sSku.sku, name: sSku.name, brand: sSku.brand, owner: sSku.owner, date: '2026-09-08', mode: st2.sw.mode, ver: nextVersion, status: 'draft', sections: snapshot.sections.length, confirmed: snapshot.confirmed };
      return {
        campaignStrategyVersions: upsertSwSnapshot(st2.campaignStrategyVersions || [], snapshot),
        campaignStrategySelected: { ...(st2.campaignStrategySelected || {}), [sSku.sku]: sSku.sku + '|v' + nextVersion },
        strategyApproved: { ...(st2.strategyApproved || {}), [sSku.sku + '|v' + nextVersion]: '草稿' },
        strategyVersionNames: { ...(st2.strategyVersionNames || {}), [sSku.sku + '|v' + nextVersion]: versionName },
        library: rec ? (st2.library || []).map(x => x.sku === sSku.sku ? { ...x, ...nextRec } : x) : [nextRec, ...(st2.library || [])],
        swVersionMenu: false, swSaveAsOpen: false, swSaveAsDraft: '', swVersionNotice: '已另存为“' + versionName + '” · v' + nextVersion + '。',
        sw: { ...st2.sw, verBase: nextVersion, loadedStatus: 'draft', savedAt: '刚刚' }
      };
    });
    const stVaultArr = (() => {
      const sf = s.stFilter || {};
      const modeName = { quick: '快速版', standard: '标准版', deep: '深度版' };
      const stMap = { '草稿': ['#F5F8FE', '#647187'], '待审批': ['#FBEEDA', '#A5762C'], '已通过': ['#E4EFE4', '#4E7156'], '已驳回': ['#F7EDEE', '#C4636D'] };
      return (s.library || []).map((rec) => {
        const p = skuAll.find(x => x.sku === rec.sku);
        if (!p) return null;
        if (sf.country && sf.country !== 'US') return null;
        if (sf.brand && p.brand !== sf.brand) return null;
        if (sf.bu && p.bu !== sf.bu) return null;
        if (sf.sku && p.sku !== sf.sku) return null;
        if (sf.mode && modeName[rec.mode] !== sf.mode) return null;
        const list = [];
        const activeVersions = Array.from({ length: rec.ver }, (_, i) => rec.ver - i).filter(v => !(s.strategyVersionDeleted || []).includes(rec.sku + '|v' + v));
        for (const v of activeVersions) {
          const isLatest = v === activeVersions[0];
          const status = stApprovalOf(rec.sku, v, isLatest);
          const snapshot = (s.campaignStrategyVersions || []).find(x => x.sku === rec.sku && x.ver === v);
          const customName = (s.strategyVersionNames || {})[rec.sku + '|v' + v] || '';
          list.push({
            key: 'v' + v, ver: v, isLatest, status, snapshot,
            label: (customName || modeName[rec.mode]) + ' v' + v + (isLatest ? ' · 最新' : ''),
            confText: snapshot ? snapshot.title + ' · 已保存完整版本' : (isLatest ? rec.confirmed + ' / ' + rec.sections + ' 章已确认' : '历史审批记录')
          });
        }
        const sel = list[0];
        const sc = skuScoreMap[rec.sku] || 60;
        const menuOpen = s.stVaultMenu === rec.sku;
	        return {
	          sku: rec.sku, name: rec.name, image: p.image, score: sc, scoreColor: this.scoreColor(sc),
          countText: list.length + ' 个版本 · ' + modeName[rec.mode],
          z: menuOpen ? 80 : 1, menuOpen, menuBd: menuOpen ? '#2457F5' : '#E2E8F2',
          toggleMenu: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st2 => ({ stVaultMenu: st2.stVaultMenu === rec.sku ? null : rec.sku })); },
          chips: [
            { label: 'ASIN', value: p.asin, link: 'https://www.amazon.com/dp/' + p.asin },
            { label: 'SKU', value: p.sku }, { label: '品牌', value: p.brand },
            { label: 'BU', value: p.bu }, { label: '运营', value: rec.owner }, { label: '更新', value: rec.date }
          ].map(x => ({ ...x, plain: !x.link })),
          selLabel: sel.label,
          selMeta: '最新 ' + sel.label + ' · ' + sel.confText + ' · ' + sel.status + '；从 Campaign 新建或编辑的版本会保留完整快照',
          versions: list.map(v => {
            const on = v.isLatest;
            const [sbg, sfg] = stMap[v.status] || stMap['草稿'];
            const canSub = v.status === '草稿' || v.status === '已驳回';
            return {
              label: v.label + ' · ' + v.confText, status: v.status, statusBg: sbg, statusFg: sfg,
              bg: on ? '#EAF0FF' : 'transparent', fg: on ? '#2457F5' : '#A2ABBA',
              cursor: (v.isLatest || v.snapshot) ? 'pointer' : 'default',
              title: v.snapshot ? '打开已保存的完整策略版本' : (v.isLatest ? '打开该产品的最新策略文档' : '该历史版本仅保留审批记录'),
              subLabel: canSub ? '申请审核' : (v.status === '待审批' ? '审核中' : '已通过'),
              subBg: canSub ? '#2457F5' : '#F7F9FC', subFg: canSub ? '#FFFFFF' : '#A2ABBA',
              subBd: canSub ? '#2457F5' : '#EAF0FF', subCursor: canSub ? 'pointer' : 'default',
              submit: (e) => {
                if (e && e.stopPropagation) e.stopPropagation();
                if (!canSub) return;
                this.setState(st2 => ({ strategyApproved: { ...(st2.strategyApproved || {}), [rec.sku + '|v' + v.ver]: '待审批' } }));
              },
              pick: () => {
                if (!v.isLatest && !v.snapshot) { this.setState({ stVaultMenu: null }); return; }
                this.switchSku(rec.sku);
                const snapshotEdits = v.snapshot && Array.isArray(v.snapshot.sections)
                  ? v.snapshot.sections.reduce((acc, sec, i) => ({ ...acc, [i + 1]: sec.body || '' }), {})
                  : {};
                this.setState(st2 => ({
                  stVaultMenu: null, stTab: 'work', benchOpen: true, spPanel: null, docMode: true,
                  campaignStrategySelected: { ...(st2.campaignStrategySelected || {}), [rec.sku]: rec.sku + '|v' + v.ver },
                  sw: { ...st2.sw, generated: true, step: 10, editing: null, mode: (v.snapshot && v.snapshot.mode) || rec.mode || st2.sw.mode, edits: v.snapshot ? snapshotEdits : st2.sw.edits, confirmed: v.snapshot ? Array.from({ length: v.snapshot.confirmed || 0 }, (_, i) => i + 1) : st2.sw.confirmed }
                }));
              }
            };
          }),
          remove: () => this.setState(st2 => ({ library: st2.library.filter(y => y.sku !== rec.sku) }))
        };
      }).filter(Boolean).map((x, i) => ({ ...x, idx: i + 1 }));
    })();

    const nextSrcCode = () => 'SRC-' + String(sw.sources.length + 1).padStart(3, '0');
    const addSources = (names) => {
      const codes = [];
      this.setState(st2 => {
        let n = st2.sw.sources.length;
        const added = names.map(name => {
          n += 1;
          const code = 'SRC-' + String(n).padStart(3, '0');
          codes.push(code);
          return { code, name, module: Math.min(8, Math.max(1, Number(st2.sw.step) || 1)), status: 'processing' };
        });
        return { sw: { ...st2.sw, sources: [...st2.sw.sources, ...added] } };
      });
      clearTimeout(this._parseT);
      this._parseT = setTimeout(() => this.setState(st2 => ({
        sw: { ...st2.sw, sources: st2.sw.sources.map(x => codes.includes(x.code) ? { ...x, status: 'parsed' } : x) }
      })), 1400);
    };
    const strategyMeta = sSku.brand + ' · US 市场 · 营销得分 ' + sScore + ' · 版本 ' + ((s.generated || []).includes(sSku.sku) ? 'v1（AI 生成）' : 'v3（当前）');

    const strategyABank = {
      'RYZ-SC-01': [
        ['产品定位', '把品类从「头皮护理工具」重新框定为「日常减压仪式」，避开参数比价。'],
        ['消费心理洞察', '目标人群真正购买的是「允许自己休息三分钟」的许可，而不是清洁效率。'],
        ['核心购买动机', '缓解压力、头皮痒/紧的即时体感、洗护流程的仪式感升级。'],
        ['购买阻力', '$49.90 相对同类偏高；担心「用两次就闲置」；不确定和手指按摩差别。'],
        ['竞品差异化', '竞品讲频率与马达，我们讲三分钟的体验闭环与防水可带进浴室。']
      ],
      'AURA-LP-01': [
        ['产品定位', '不做灯具参数的比较，把它定位成「回家后切换状态」的一个动作。'],
        ['消费心理洞察', '租房人群买的是可带走的氛围，不是固定装修；灯是最低成本的空间改造。'],
        ['核心购买动机', '拍照效果、下班后的情绪切换、不打洞不改线就能改变房间。'],
        ['购买阻力', '$59.90 高于基础落地灯；担心亮度不够当主光源。'],
        ['竞品差异化', '竞品拼流明与色温参数，我们拼「开灯前后」的画面差。']
      ]
    };
    const strategyBBank = {
      'RYZ-SC-01': [
        ['Campaign 目标', '第一优先 UGC 与种草，转化作为观察指标，不作为一轮考核。'],
        ['红人层级组合', '30 位 KOC 铺量 + 8 位 micro 做内容标杆 + 3 位发型师提供专业背书。'],
        ['合作模式', 'KOC 纯寄样 + 12% 佣金；micro 固定费 $300–800 + 佣金；发型师买断二次授权。'],
        ['执行节奏', '第 1–2 周寄样与专业背书铺垫，第 3–5 周 KOC 集中发布，第 6 周挑选素材投放。'],
        ['风险提示', '寄样到内容平均 18 天，需按 3 周提前量排期；预留 15% 预算给补量。']
      ],
      'AURA-LP-01': [
        ['Campaign 目标', '以房间改造类内容沉淀可投放素材，兼顾种草与投放素材库。'],
        ['红人层级组合', '15 位家居 micro 做房间改造 + 8 位 KOC 做日常植入 + 2 位室内设计师背书。'],
        ['合作模式', 'micro 固定费 $400–900 + 白名单授权；KOC 寄样 + 10% 佣金。'],
        ['执行节奏', '第 1–3 周寄样与拍摄，第 4–6 周集中发布，第 7 周起筛选素材投放。'],
        ['风险提示', '大件物流成本高，寄样前需确认地址；库存 1,680 件仅够约 10 天。']
      ]
    };

    const fallbackA = [
      ['产品定位', '把' + sSku.name + '从' + sCat + '的参数比价里拉出来，锚定一个具体的使用时刻。'],
      ['消费心理洞察', (sAudMap[sCat] || '目标人群') + '关心的是这件东西在自己生活里的位置，而不是规格表。'],
      ['核心购买动机', sDims[3] >= 8 ? '情绪价值与仪式感是主要驱动，功能是入场券。' : '解决一个具体的日常麻烦，价格与口碑是决定因素。'],
      ['购买阻力', sSku.price + ' 的定价' + (Number(sSku.stars) >= 4.4 ? '有 ' + sSku.reviews + ' 条评价支撑，但仍需红人交代「为什么是这一款」。' : '缺少足够评价背书，需要先补评再放量。')],
      ['竞品差异化', sDims[2] >= 7 ? '有清晰可讲的差异点，红人不需要编故事。' : '差异化偏弱，Brief 里必须给到明确对比点，否则内容会同质化。']
    ];
    const fallbackB = [
      ['Campaign 目标', sScore >= 75 ? 'UGC 与种草优先，转化作为观察指标。' : '先验证内容角度是否成立，不追量。'],
      ['红人层级组合', sTier],
      ['合作模式', sDims[6] >= 7 ? '固定费 + 佣金组合，可承载 micro 层级。' : '以寄样 + 纯佣金为主，控制前期投入。'],
      ['执行节奏', sScore >= 75 ? '第 1–2 周寄样，第 3–5 周集中发布，第 6 周筛选素材投放。' : '第 1–2 周寄样，第 3–4 周小批发布后复盘再决定是否加量。'],
      ['风险提示', (sSku.stockNote.indexOf('需补货') >= 0 ? '库存仅 ' + sSku.stock + ' 件（' + sSku.stockNote + '），放量前需补货。' : '寄样到内容平均 18 天，需按 3 周提前量排期。')]
    ];
    const strategyA = (strategyABank[sSku.sku] || fallbackA).map(([label, body]) => ({ label, body }));
    const strategyB = (strategyBBank[sSku.sku] || fallbackB).map(([label, body]) => ({ label, body }));

    const pick = (cur, val, set) => ({
      label: val, pick: () => this.setState(set(val)),
      bg: cur === val ? '#2457F5' : '#FFFFFF', fg: cur === val ? '#FFFFFF' : '#647187', bd: cur === val ? '#2457F5' : '#E2E8F2'
    });
    const platforms = ['TikTok', 'Instagram', 'YouTube'].map(v => pick(s.platform, v, val => ({ platform: val })));

    const bFrom = (s.briefFromStrategy || []).find(x => 'brf-' + x.sku === s.briefId);
    const bSkuId = bFrom ? bFrom.sku : 'RYZ-SC-01';
    const bProd = skuAll.find(x => x.sku === bSkuId) || sSku;
    const bPf = swProfiles[bSkuId] || swGenericPf(bProd);
    const briefEditorTab = s.briefEditorTab === 'creator' ? 'creator' : 'channel';
    const bStudioSelectedChannels = Array.isArray(s.briefStudioChannels) && s.briefStudioChannels.length ? s.briefStudioChannels : [s.platform || 'TikTok'];
    const bIsRyze = bSkuId === 'RYZ-SC-01';
    const hookByPlatform = {
      TikTok: bIsRyze
        ? '前 3 秒直接进入洗头画面，不要品牌口播；第 1 句可以是「我洗头一直很敷衍，直到…」。竖屏 9:16，时长 21–34 秒。'
        : bPf.hook + ' 竖屏 9:16，时长 21–34 秒。',
      Instagram: 'Reels 可以放慢节奏，允许 5 秒的氛围铺垫；封面需要一张能进 Grid 的静帧，色调偏暖。时长 15–25 秒。',
      YouTube: bIsRyze
        ? 'Shorts 建议做「一周实测」结构，第 1 秒抛结论；标题需含 scalp massager，便于搜索承接。时长 30–45 秒。'
        : 'Shorts 建议做「一周实测」结构，第 1 秒抛结论；标题需含' + bProd.name + '的英文关键词，便于搜索承接。时长 30–45 秒。'
    };
    const personaOpts = bIsRyze
      ? ['通用版', '@mia.selfcare', '@kaylascalp']
      : ['通用版', '@dailywithlin', '@sofia.homelab'];
    const personaLine = bIsRyze
      ? {
          '通用版': '保持你自己的语气，不要照读脚本。',
          '@mia.selfcare': '按你惯用的低饱和暖光与轻音乐处理，延续你「夜间自我照护」系列的编号命名。',
          '@kaylascalp': '可以带一点专业视角，用你之前那种「头皮特写 + 口头解释」的双镜头结构。'
        }
      : {
          '通用版': '保持你自己的语气，不要照读脚本。',
          '@dailywithlin': '延续你惯用的生活流剪辑与家庭场景，把产品放进你原本的日常里。',
          '@sofia.homelab': '按你偏好的静物构图与自然光处理，保持画面质感一致。'
        };
    const bIsCreatorMode = s.briefMode === 'creator';
    const bShowCreatorContext = page !== 'brief' && bIsCreatorMode;
    const bCreatorHandle = (s.briefCreator || '').trim();
    const bCreatorStyle = (s.briefCreatorStyle || '').trim();
    const bCreatorAudience = (s.briefCreatorAudience || '').trim();
    const bCreatorTag = bCreatorHandle || '未填写红人';
    const bKey = bSkuId + '|' + s.platform + (bIsCreatorMode ? '|' + bCreatorTag : '');
    const bViewV = s.viewedVersion && bvLive.find(v => v.sku + '|' + v.platform + '|' + (v.mode || 'channel') + '|' + v.ver === s.viewedVersion);
    const briefIter = bViewV ? bViewV.iter : ((s.briefGen || {})[bKey] || 0) + 1;
    const goalVariants = [
      '拍出你真实的使用瞬间，让看到的人觉得「这个我今晚也想试」。不需要教育，不需要参数。',
      '把它放进你原本的日常里，不要为拍摄单独摆场景。观众要看到的是习惯，不是产品。',
      '先给结论再给过程：一句话说清它改变了你哪个具体动作，然后用画面证明。',
      '拍一条能被收藏的内容：让人愿意存下来自己试一遍，而不是看完就划走。'
    ];
    const dirVariants = [
      '保持你自己的语气，不要照读脚本。',
      '开头别铺垫，第一句就给观众一个继续看的理由。',
      '中段留一个真实的小缺点或犹豫，可信度比完美更重要。',
      '结尾把动作说清楚：告诉观众下一步该做什么，而不是「链接在下面」。'
    ];
    const bGoalVariant = goalVariants[(briefIter - 1) % goalVariants.length];
    const bDirVariant = dirVariants[(briefIter - 1) % dirVariants.length];
    const bSavedPrompt = bViewV ? (bViewV.prompt || '') : ((s.briefPromptApplied || {})[bKey] || '');
    const bPromptLine = bSavedPrompt ? '按你的补充要求：' + bSavedPrompt : '';
    const bVersions = bvLive.filter(v => v.sku === bSkuId && v.platform === s.platform && (v.mode || 'channel') === (bIsCreatorMode ? 'creator' : 'channel'));
    const bDirLabel = bShowCreatorContext ? '创作方向 · ' + s.platform + ' · ' + bCreatorTag : '创作方向 · ' + s.platform;
    const bCreatorLine = !bShowCreatorContext ? ''
      : (bViewV && bViewV.creator
          ? ' 这一版按 ' + bViewV.creator + ' 的风格写：' + (bViewV.creatorStyle || '延续其惯用做法') + '。'
          : (bCreatorHandle
              ? ' 这一版按 ' + bCreatorHandle + ' 的风格写：' + (bCreatorStyle || '延续其惯用做法') + '。' + (bCreatorAudience ? '受众：' + bCreatorAudience + '。' : '')
              : ' 请先在上方填入红人账号与惯用做法，生成的方向才会贴合她/他的风格。'));

    const bWho = bShowCreatorContext && bCreatorAudience ? bCreatorAudience : (bIsRyze ? '25–38 岁、长期熬夜且已有护发习惯的女性' : bPf.audience || (bProd.category || '该品类') + '的核心用户');
    const bSceneFull = bIsRyze ? '睡前洗护的那三分钟' : bPf.scene;
    const bScene = bIsRyze ? '睡前洗护的那三分钟' : String(bPf.scene || '').split('；')[0].split('，')[0];
    const bJob = String(bPf.job || '').replace(/^待补充：/, '');
    const bCore = bIsRyze ? '洗头这三分钟可以从任务变成放松' : bJob;
    const bHooks = [
      bIsRyze ? '前 3 秒直接出现浴室 / 洗手台的真实画面，不要品牌口播' : '前 3 秒直接出现「' + bScene + '」的真实画面，不要品牌口播',
      '前 3 秒先给结果或反差，再回到使用过程',
      '前 3 秒用一句自述开场（「我一直很敷衍，直到…」），画面同步进入场景',
      '前 3 秒把手部动作放到画面中心，不做任何铺垫'
    ];
    const bCloseups = bIsRyze
      ? ['硅胶触头贴在头皮上的近景', '开机瞬间的手部动作与档位切换', '带进淋浴时的防水细节']
      : ['产品与手部接触的近景', '开启 / 使用瞬间的关键动作', bPf.detail || '最能体现做工与质感的局部'];
    const bMustSay = bIsRyze ? '洗头的三分钟，从任务变成放松' : (bJob ? '有了它，' + bJob : '这个产品让' + bScene + '这件事更轻松');
    const bSellPoint = bIsRyze ? '三分钟的放松体验' : (bJob || '产品在' + bScene + '中的核心价值');
    const bDeliverFmt = { TikTok: '竖屏 9:16，21–34 秒，含原始素材', Instagram: '竖屏 9:16 Reels，15–25 秒，另交 1 张可进 Grid 的静帧', YouTube: '竖屏 Shorts，30–45 秒，标题含品类英文关键词' }[s.platform] || '竖屏 9:16，21–34 秒';

    const briefBlocks = [
      { label: 'CAMPAIGN 背景', isText: true, body: bIsRyze
        ? 'Ryze 是一个中国团队做的头皮护理品牌，2026 年进入北美。这一轮我们不追求销量，想先让人知道「洗头这三分钟可以是放松的」。'
        : bProd.brand + ' 是一个中国团队做的' + (bProd.category || '') + '品牌，2026 年进入北美。这一轮我们不追求销量，先把「' + bPf.job + '」这件事讲清楚。' },
      { label: '制作主旨', isText: true, body: '让「' + bWho + '」在「' + bScene + '」里理解一个核心信息：' + bCore + '。这条内容只需要说清这一件事，其余都可以舍弃。' },
      { label: '内容目标', isText: true, body: bGoalVariant },
      { label: bDirLabel, isText: true, body: hookByPlatform[s.platform] + ' ' + bDirVariant + bCreatorLine + (bPromptLine ? ' ' + bPromptLine : '') },
      { label: '达人具体怎么拍', isList: true, mark: '▸', dot: '#2457F5', items: [
        '开头：' + bHooks[(briefIter - 1) % bHooks.length] + '。',
        '展示：必须近景拍到——' + bCloseups.slice(0, 2).join('；') + '。加分项：' + bCloseups[2] + '。',
        '表达：必须让观众理解这句话——「' + bMustSay + '」，用你自己的说法讲出来即可。',
        '交付：' + bDeliverFmt + '，另交 3 张静帧；寄样后 14 天内交初稿，修改 1 轮。'
      ] },
      { label: '边界 · 必须保留', isList: true, mark: '✓', dot: SAGE, items: bIsRyze
        ? ['产品本体出现在浴室或洗手台的真实环境里', '场景：睡前洗护流程，不要摆拍成产品广告', '核心卖点：三分钟的放松体验（只讲这一个）', '主页 bio 链接 + 你的专属折扣码']
        : ['产品本体出现在真实使用场景里（' + bScene + '）', '场景：「' + bSceneFull + '」，不要摆拍成产品广告', '核心卖点：' + bSellPoint + '（只讲这一个）', '主页 bio 链接 + 你的专属折扣码'] },
      { label: '边界 · 不能出现', isList: true, mark: '✕', dot: RUST, items: [...(bIsRyze
        ? ['禁用词：「生发」「治疗脱发」「防脱」等医疗性表述', '过度承诺：「替代专业头皮治疗」「一定有效」']
        : ['禁用词：' + bPf.noClaim, '过度承诺：任何「保证有效」「一定能」类表述']), '不要与竞品直接比较或提及竞品品牌名', ...(s.accepted.includes('nowords') ? ['时效承诺：「立刻见效」「一次就见效」'] : [])] },
      { label: '边界 · 可以自由', isList: true, mark: '○', dot: BLUE, items: [
        '叙事结构：routine / 实测 / 短剧 / 前后对比，任选你最擅长的',
        '镜头与剪辑：节奏、转场、配乐、字幕风格全部由你决定',
        '开场方式：只要 3 秒内进入场景，怎么开场都可以',
        '个人语气：用你平时的说话方式，不要照读脚本'
      ] },
      { label: '合规提醒', isText: true, body: '美区需在正文与视频内同时标注 #ad 或 Paid partnership。任何个人体感描述请加「我自己的感受」限定。'
        + (bIsRyze ? '' : '可讲的事实范围：' + bPf.canClaim + '。本品类要求：' + bPf.sensitive + '。') }
    ];
    const bLang = s.briefLang || 'zh';
    const bWhoEn = bShowCreatorContext && bCreatorAudience ? bCreatorAudience : (bIsRyze ? 'women aged 25–38 who run late nights and already have a hair-care routine' : 'the core buyer of ' + (bProd.category || 'this category'));
    const bSceneEn = bIsRyze ? 'those three minutes of washing their hair before bed' : bScene;
    const bSceneFullEn = bIsRyze ? 'a pre-bed wash routine' : bSceneFull;
    const bCoreEn = bIsRyze ? 'these three minutes can go from a chore to a moment of relief' : bCore;
    const bMustSayEn = bIsRyze ? 'Those three minutes went from a chore to the calmest part of my night' : bMustSay;
    const bSellPointEn = bIsRyze ? 'the three-minute relaxation' : bSellPoint;
    const bCloseupsEn = bIsRyze
      ? ['the silicone nodes pressing against the scalp', 'the hand movement as it switches on and changes speed', 'the waterproof detail when it goes into the shower']
      : ['the product in contact with your hands', 'the key moment it switches on / gets used', 'the detail that best shows the build and finish'];
    const bDirEn = {
      TikTok: 'Enter the scene within the first 3 seconds — no brand voice-over. Vertical 9:16, 21–34s.',
      Instagram: 'Reels can breathe: up to 5s of atmosphere is fine. You also need one warm-toned still that works in your grid. 15–25s.',
      YouTube: 'Structure it as a week-long test with the conclusion up front. Put the category keyword in the title for search. 30–45s.'
    }[s.platform] || 'Enter the scene within the first 3 seconds. Vertical 9:16, 21–34s.';
    const bEnHooks = [
      bIsRyze ? 'Open on the real bathroom / sink scene in the first 3 seconds — no brand voice-over' : 'Open on the real "' + bSceneEn + '" scene in the first 3 seconds — no brand voice-over',
      'Lead with the result or a contrast in the first 3 seconds, then cut back to the process',
      'Open with one line of your own ("I never cared about this, until…") while the scene is already on screen',
      'Put the hand movement dead-center in frame from second one — no set-up'
    ];
    const bEnDeliver = { TikTok: 'Vertical 9:16, 21–34s, raw footage included', Instagram: 'Vertical 9:16 Reels, 15–25s, plus one grid-ready still', YouTube: 'Vertical Shorts, 30–45s, title must include the category keyword' }[s.platform] || 'Vertical 9:16, 21–34s';
    const briefBlocksEn = [
      { label: 'CAMPAIGN BACKGROUND', isText: true, body: bIsRyze
        ? 'Ryze is a scalp-care brand built by a China-based team, entering North America in 2026. This round is not about sales — we want people to know that these three minutes of washing your hair can be relaxing.'
        : bProd.brand + ' is a ' + (bProd.category || '') + ' brand built by a China-based team, entering North America in 2026. This round is not about sales — we want to land one idea: ' + (bJob || bCoreEn) + '.' },
      { label: 'CREATIVE INTENT', isText: true, body: 'Make "' + bWhoEn + '" understand ONE core message while they are in "' + bSceneFullEn + '": ' + bCoreEn + '. This piece only needs to land that one thing — everything else is optional.' },
      { label: 'CONTENT GOAL', isText: true, body: bIsRyze
        ? 'Capture a genuine moment of use, so viewers think "I want to try this tonight." No education, no specs.'
        : 'Put it inside your real routine — do not stage a scene for the shoot. Viewers should see a habit, not a product.' },
      { label: 'CREATIVE DIRECTION · ' + s.platform + (bShowCreatorContext ? ' · ' + bCreatorTag : ''), isText: true, body: bDirEn + ' Use your own voice — do not read a script.' + (bSavedPrompt ? ' Per your note: ' + bSavedPrompt + '.' : '') },
      { label: 'HOW TO SHOOT IT', isList: true, mark: '▸', dot: '#2457F5', items: [
        'Opening: ' + bEnHooks[(briefIter - 1) % bEnHooks.length] + '.',
        'Show: close-ups required — ' + bCloseupsEn.slice(0, 2).join('; ') + '. Bonus: ' + bCloseupsEn[2] + '.',
        'Say: the audience must understand this line — "' + bMustSayEn + '". Phrase it in your own words.',
        'Deliver: ' + bEnDeliver + ', plus 3 stills. First cut within 14 days of receiving the sample, one round of revisions.'
      ] },
      { label: 'BOUNDARIES · MUST KEEP', isList: true, mark: '✓', dot: SAGE, items: bIsRyze
        ? ['The product appears in a real bathroom or sink setting', 'Scene: a pre-bed wash routine — do not stage it like an ad', 'Core selling point: the three-minute relaxation (this one only)', 'Bio link + your dedicated discount code']
        : ['The product appears in a real use setting (' + bSceneEn + ')', 'Scene: "' + bSceneFullEn + '" — do not stage it like an ad', 'Core selling point: ' + bSellPointEn + ' (this one only)', 'Bio link + your dedicated discount code'] },
      { label: 'BOUNDARIES · MUST NOT APPEAR', isList: true, mark: '✕', dot: RUST, items: [...(bIsRyze
        ? ['Banned wording: "hair growth", "treats hair loss", "prevents shedding" or any medical claim', 'Overpromising: "replaces professional scalp treatment", "guaranteed to work"']
        : ['Banned wording: ' + bPf.noClaim, 'Overpromising: any "guaranteed", "will definitely" phrasing']), 'No direct comparison to competitors and no competitor brand names', ...(s.accepted.includes('nowords') ? ['Timing promises: "instant results", "works the first time"'] : [])] },
      { label: 'BOUNDARIES · YOURS TO DECIDE', isList: true, mark: '○', dot: BLUE, items: [
        'Narrative: routine / review / short skit / before-after — whatever you do best',
        'Camera and edit: pacing, transitions, music and caption style are all yours',
        'Opening: any hook works as long as you are in the scene within 3 seconds',
        'Tone: speak the way you normally speak — do not read a script'
      ] },
      { label: 'COMPLIANCE', isText: true, body: 'US market: label with #ad or Paid partnership in both the caption and the video. Qualify any personal experience with "in my own experience".'
        + (bIsRyze ? '' : ' Facts you may state: ' + bPf.canClaim + '. Category requirement: ' + bPf.sensitive + '.') }
    ];

    const briefMeta = [
      { label: '交付物', value: '1 条主视频 + 3 张静帧 + 原始素材' },
      { label: '时间节点', value: '寄样后 14 天内交初稿，修改 1 轮' },
      { label: '授权范围', value: '社媒 6 个月 + 白名单投放 3 个月' },
      { label: '追踪', value: '专属折扣码 + UTM 短链' }
    ];
    const briefMetaEn = [
      { label: 'DELIVERABLES', value: '1 hero video + 3 stills + raw footage' },
      { label: 'TIMELINE', value: 'First cut within 14 days of sample delivery, 1 revision round' },
      { label: 'USAGE RIGHTS', value: 'Organic social 6 months + whitelisted paid 3 months' },
      { label: 'TRACKING', value: 'Dedicated discount code + UTM short link' }
    ];

    const allSuggestions = [
      { id: 'nowords', title: '补充一条时效类禁用词', body: 'Q2 有 2 条内容因「一次就见效」被平台限流，建议写进禁止表达。', tag: '合规 · 高优先', acceptLabel: '写入 Brief' },
      { id: 'hook', title: '把 hook 要求从「必须」改为「参考」', body: 'Q2 数据显示逐字要求会压低互动率，建议保留创作者自由度。', tag: '来自 Q2 复盘', acceptLabel: '采纳' },
      { id: 'creator', title: '按红人风格生成一版', body: '把生成方式切到「按红人风格」，填入账号与惯用做法，可减少一轮返工。', tag: '个性化', acceptLabel: '切换' }
    ];
    const suggestions = allSuggestions.filter(x => !s.dismissed.includes(x.id) && !s.accepted.includes(x.id)).map(x => ({
      ...x,
      accept: () => this.setState(st => ({ accepted: [...st.accepted, x.id], briefMode: x.id === 'creator' ? 'creator' : st.briefMode })),
      dismiss: () => this.setState(st => ({ dismissed: [...st.dismissed, x.id] }))
    }));

    const checkDefs = [
      ['交付物与时间节点已明确', true], ['Do / Don\'t 已填写', true], ['合规禁用词已确认', s.accepted.includes('nowords')],
      ['授权范围已与法务对齐', true], ['红人风格版本已生成', bvLive.some(v => v.sku === bSkuId && v.mode === 'creator')]
    ];
    const checklist = checkDefs.map(([label, done]) => ({
      label, mark: done ? '✓' : '', bg: done ? SAGE : '#E2E8F2', fg: done ? '#1D2638' : '#8792A5'
    }));

    const CR_FREQ = {
      '@mia.selfcare': '5.2 条 / 周', '@kaylascalp': '3.4 条 / 周', '@hairbyandre': '1.8 条 / 周',
      '@dailywithlin': '4.1 条 / 周', '@sofia.homelab': '2.2 条 / 周', '@thegroomguide': '0.9 条 / 周',
      '@june.rests': '6.0 条 / 周', '@leo.calmnight': '1.4 条 / 周', '@nora.pm': '2.6 条 / 周',
      '@fastcashreviews': '14.0 条 / 周', '@dealhunter.uk': '8.5 条 / 周', '@zoe.unbox': '9.2 条 / 周',
      '@scalp.school': '3.0 条 / 周', '@lena.unwinds': '4.6 条 / 周', '@quietmornings': '2.0 条 / 周',
      '@thecalmedit': '5.4 条 / 周', '@hairdays.co': '1.2 条 / 周', '@homewithtess': '3.8 条 / 周'
    };
    const freqOf = (h) => CR_FREQ[h] || '2.5 条 / 周';

    const creatorAvatarMap = {
      '@mia.selfcare': '../avatars/mia.jpg', '@kaylascalp': '../avatars/kayla.jpg', '@hairbyandre': '../avatars/andre.jpg',
      '@dailywithlin': '../avatars/lin.jpg', '@sofia.homelab': '../avatars/sofia.jpg', '@thegroomguide': '../avatars/groom.jpg',
      '@june.rests': '../avatars/june.jpg', '@leo.calmnight': '../avatars/leo.jpg', '@nora.pm': '../avatars/nora.jpg',
      '@scalp.school': '../avatars/kayla.jpg', '@lena.unwinds': '../avatars/mia.jpg', '@quietmornings': '../avatars/sofia.jpg',
      '@thecalmedit': '../avatars/june.jpg', '@hairdays.co': '../avatars/leo.jpg', '@homewithtess': '../avatars/nora.jpg',
      '@fastcashreviews': '../avatars/groom.jpg', '@dealhunter.uk': '../avatars/andre.jpg', '@zoe.unbox': '../avatars/sofia.jpg'
    };
    const creatorChannelsMap = {
      '@mia.selfcare': ['TikTok', 'Instagram', 'YouTube'], '@kaylascalp': ['TikTok', 'Instagram'], '@hairbyandre': ['Instagram', 'YouTube'],
      '@dailywithlin': ['TikTok', 'Instagram'], '@sofia.homelab': ['Instagram', 'TikTok'], '@thegroomguide': ['YouTube', 'Instagram'],
      '@june.rests': ['TikTok'], '@leo.calmnight': ['YouTube', 'TikTok'], '@nora.pm': ['Instagram'],
      '@scalp.school': ['TikTok', 'Instagram'], '@lena.unwinds': ['TikTok', 'Instagram'], '@quietmornings': ['Instagram'],
      '@thecalmedit': ['TikTok'], '@hairdays.co': ['YouTube', 'TikTok'], '@homewithtess': ['Instagram', 'TikTok']
    };
    const creatorDefs = [
      { handle: '@mia.selfcare', nation: '美国', market: 'US', tier: '10万-50万', gender: '女', age: '25-34', job: '全职创作者', avgViews: '128K', er30: '6.4%', initial: 'M', platform: 'TIKTOK', niche: '自我照护 / 夜间 routine', country: '美国', fit: 92, followers: '182K', er: '6.2%', quote: '$1,200', status: '长期合作', reason: '她的「夜间 routine」系列与我们的核心叙事完全同构，Q2 单条带来 4.1x ROAS。', risk: '' },
      { handle: '@kaylascalp', nation: '美国', market: 'US', tier: '1万-10万', gender: '女', age: '25-34', job: '美发从业者', avgViews: '34K', er30: '12.1%', initial: 'K', platform: 'TIKTOK', niche: '头皮护理 KOC', country: '美国', fit: 89, followers: '21K', er: '12.4%', quote: '寄样', status: '已合作', reason: '粉丝少但极垂，评论区常主动问链接；完播 58%，是本轮的性价比标杆。', risk: '' },
      { handle: '@hairbyandre', nation: '加拿大', market: 'US', tier: '1万-10万', gender: '男', age: '35-44', job: '执业发型师', avgViews: '19K', er30: '4.3%', initial: 'A', platform: 'INSTAGRAM', niche: '执业发型师', country: '加拿大', fit: 85, followers: '54K', er: '4.1%', quote: '$900', status: '沟通中', reason: '提供专业背书，能安全地解释头皮清洁而不触碰功效 claim。', risk: '' },
      { handle: '@dailywithlin', nation: '美国', market: 'US', tier: '1万-10万', gender: '女', age: '25-34', job: '上班族兼职', avgViews: '41K', er30: '8.7%', initial: 'L', platform: 'TIKTOK', niche: '生活方式 / 亚裔家庭', country: '美国', fit: 78, followers: '46K', er: '9.1%', quote: '$650', status: '待联系', reason: '受众与我们重合度高，但内容偏食品，需要一条定制 Brief 引导场景。', risk: '' },
      { handle: '@sofia.homelab', nation: '美国', market: 'US', tier: '50万以下', gender: '女', age: '35-44', job: '室内设计师', avgViews: '23K', er30: '3.6%', initial: 'S', platform: 'INSTAGRAM', niche: '家居好物', country: '美国', fit: 64, followers: '88K', er: '3.8%', quote: '$850', status: '沟通中', reason: '流量稳定但转化偏弱，适合放在铺量而非标杆位置。', risk: '报价高于均值' },
      { handle: '@thegroomguide', nation: '英国', market: 'UK', tier: '10万-50万', gender: '男', age: '35-44', job: '全职创作者', avgViews: '86K', er30: '2.2%', initial: 'T', platform: 'YOUTUBE', niche: '男士理容测评', country: '英国', fit: 47, followers: '320K', er: '2.4%', quote: '$2,400', status: '暂停', reason: '受众性别与市场都不匹配，且历史交付延期 2 次。', risk: '交付不稳定' },
      { handle: '@june.rests', nation: '美国', market: 'US', tier: '1万以下', gender: '女', age: '18-24', job: '学生', avgViews: '12K', er30: '14.2%', initial: 'J', platform: 'TIKTOK', niche: '睡前 routine KOC', country: '美国', fit: 83, followers: '8.6K', er: '13.8%', quote: '寄样', status: '已合作', reason: '完播极高、粉丝黏性强，适合铺量测试新叙事角度。', risk: '' },
      { handle: '@leo.calmnight', nation: '美国', market: 'US', tier: '10万-50万', gender: '男', age: '25-34', job: '全职创作者', avgViews: '96K', er30: '5.1%', initial: 'L', platform: 'YOUTUBE', niche: '助眠与放松', country: '美国', fit: 76, followers: '142K', er: '4.8%', quote: '$1,600', status: '已合作', reason: '长视频承接搜索流量，48 小时播放 214K，适合做口碑沉淀。', risk: '' },
      { handle: '@nora.pm', nation: '德国', market: 'EU', tier: '1万-10万', gender: '女', age: '25-34', job: '上班族兼职', avgViews: '27K', er30: '7.4%', initial: 'N', platform: 'INSTAGRAM', niche: '夜间护理与香氛', country: '德国', fit: 71, followers: '38K', er: '6.9%', quote: '€520', status: '待联系', reason: '欧区备选，若 Lumo 进入 EU 站点可优先联系。', risk: '' }
    ].concat((s.lkAdded || []).map(h => {
      const c0 = this.LOOKALIKE_POOL.find(x => x.handle === h);
      if (!c0) return null;
      const fol = this.toNumU(c0.followers);
      return {
        handle: h, nation: c0.nation, market: 'US',
        tier: fol >= 1000000 ? '100万以上' : (fol >= 500000 ? '50万-100万' : (fol >= 100000 ? '10万-50万' : (fol >= 10000 ? '1万-10万' : '1万以下'))),
        gender: c0.gender || '女', age: c0.age || '25-34', job: c0.job || '全职创作者',
        avgViews: c0.avgViews, er30: c0.er,
        initial: h.slice(1, 2).toUpperCase(),
        platform: (c0.platform || 'TikTok').toUpperCase(),
        niche: c0.niche, country: c0.nation, fit: c0.sim,
        followers: c0.followers, er: c0.er, quote: c0.quote,
        status: '待联系',
        reason: '由相似度扩量加入（相似度 ' + c0.sim + '）：' + c0.why,
        risk: '', fromLookalike: true
      };
    }).filter(Boolean));
    const crHandles = {
      '@mia.selfcare': {
        summary: '@mia.selfcare 是美区「夜间自我照护」系列作者，18.2 万粉、近 30 天均播 128K、ER 6.4%。内容长期围绕睡前流程，粉丝把她的视频当睡前 ASMR 看，是本轮叙事最贴合的标杆型红人。',
        pro: '与「三分钟属于自己」叙事完全同构，Q2 单条带来 4.1x ROAS。',
        con: '排期紧张，通常需提前 3 周预约；报价已到品类上限。',
        act: '优先锁定为本轮标杆，允许她自定义脚本，只给必须讲到的三件事。',
        links: [
          { label: 'TikTok', url: 'https://www.tiktok.com/@mia.selfcare', title: 'TikTok 主页' },
          { label: 'Instagram', url: 'https://www.instagram.com/mia.selfcare', title: 'Instagram 主页' },
          { label: 'YouTube', url: 'https://www.youtube.com/@mia.selfcare', title: 'YouTube 频道' }
        ]
      },
      '@kaylascalp': {
        summary: '@kaylascalp 是头皮护理垂类 KOC，2.1 万粉但极垂，近 30 天均播 34K、ER 12.1%，完播 58%。惯用「头皮特写 + 口头解释」双镜头结构，评论区常有人主动问链接。',
        pro: '性价比最高：只接受寄样 + 佣金，单位成本效率约为 micro 的 1.7 倍。',
        con: '拒绝固定费与逐字脚本，内容节奏由她主导，可控性偏低。',
        act: '作为本轮内容标杆，把她的双镜头结构写进 Brief 作为参考范式。',
        links: [
          { label: 'TikTok', url: 'https://www.tiktok.com/@kaylascalp', title: 'TikTok 主页' },
          { label: 'Instagram', url: 'https://www.instagram.com/kaylascalp', title: 'Instagram 主页' }
        ]
      },
      '@thegroomguide': {
        summary: '@thegroomguide 是英区男士理容测评频道，32 万粉但近 30 天均播 86K、ER 仅 2.2%。受众性别与市场都与本轮不匹配，历史交付延期 2 次。',
        pro: '长视频制作水准高，适合需要参数讲解的品类。',
        con: '英区 + 男性受众与当前美区女性目标人群冲突；单条成本 $2,400 偏高。',
        act: '本轮不投入；若未来开 UK 站点或男士线再重新评估。',
        links: [
          { label: 'YouTube', url: 'https://www.youtube.com/@thegroomguide', title: 'YouTube 频道' },
          { label: 'Instagram', url: 'https://www.instagram.com/thegroomguide', title: 'Instagram 主页' }
        ]
      }
    };

    const crDimKeys = ['brand', 'audience', 'content', 'market', 'goal'];
    const crBaseDims = (c) => {
      const seed = c.handle.length;
      return {
        brand: Math.max(30, Math.min(98, c.fit + ((seed % 3) - 1) * 4)),
        audience: Math.max(30, Math.min(98, c.fit + ((seed % 5) - 2) * 3)),
        content: Math.max(30, Math.min(98, c.fit + ((seed % 4) - 1) * 5)),
        market: c.market === 'US' ? Math.min(98, c.fit + 6) : Math.max(28, c.fit - 22),
        goal: Math.max(30, Math.min(98, c.fit + ((seed % 6) - 3) * 3))
      };
    };
    const crDimVals = (c) => ({ ...crBaseDims(c), ...((s.crScores || {})[c.handle] || {}) });
    const crAiScore = (c) => {
      const d = crDimVals(c);
      return Math.round(crDimKeys.reduce((sum, k) => sum + d[k], 0) / crDimKeys.length);
    };
    const crLinksOf = (c) => {
      if (crHandles[c.handle] && crHandles[c.handle].links) return crHandles[c.handle].links;
      const bare = c.handle.slice(1);
      const url = { TIKTOK: 'https://www.tiktok.com/' + c.handle, INSTAGRAM: 'https://www.instagram.com/' + bare, YOUTUBE: 'https://www.youtube.com/' + c.handle };
      const nm = { TIKTOK: 'TikTok', INSTAGRAM: 'Instagram', YOUTUBE: 'YouTube' };
      const sec = c.platform === 'YOUTUBE' ? 'INSTAGRAM' : (c.platform === 'INSTAGRAM' ? 'TIKTOK' : 'INSTAGRAM');
      return [
        { label: nm[c.platform], url: url[c.platform], title: nm[c.platform] + ' 主页 · 主阵地' },
        { label: nm[sec], url: url[sec], title: nm[sec] + ' 主页' }
      ];
    };
    const dimDetailOf = (c, k) => {
      const usHeavy = c.market === 'US';
      const female = c.gender === '女';
      if (k === 'audience') return {
        title: '粉丝画像 · 来自平台后台导出（近 90 天）',
        rows: [
          { label: '国家 · 美国', value: usHeavy ? '72%' : '18%', pct: usHeavy ? 72 : 18 },
          { label: '国家 · 加拿大 / 英国', value: usHeavy ? '11% / 6%' : '9% / 34%', pct: usHeavy ? 17 : 43 },
          { label: '国家 · 其他', value: usHeavy ? '11%' : '39%', pct: usHeavy ? 11 : 39 },
          { label: '年龄 · 25–34 / 18–24 / 35–44', value: '48% / 27% / 19%', pct: 48 },
          { label: '性别 · ' + (female ? '女 / 男' : '男 / 女'), value: female ? '84% / 16%' : '71% / 29%', pct: female ? 84 : 71 },
          { label: '教育 · 本科及以上', value: usHeavy ? '61%' : '54%', pct: usHeavy ? 61 : 54 },
          { label: '家庭年收入 · $60K 以上', value: usHeavy ? '57%' : '46%', pct: usHeavy ? 57 : 46 },
          { label: '地区 · 一线城市 / 郊区 / 其他', value: '46% / 33% / 21%', pct: 46 },
          { label: '职业 · 白领 / 学生 / 自由职业', value: '52% / 21% / 27%', pct: 52 }
        ]
      };
      if (k === 'brand') return {
        title: '品牌匹配依据 · 近 20 条内容与历史合作',
        rows: [
          { label: '语气与品牌调性一致度', value: '偏克制真诚，无夸张促销', pct: 88 },
          { label: '历史合作品牌类型 · 个护 / 家居 / 食品', value: '58% / 24% / 18%', pct: 58 },
          { label: '含硬广口播的内容占比', value: '仅 12%', pct: 88 },
          { label: '曾出现违规或夸大表述', value: '无记录', pct: 95 },
          { label: '竞品合作情况', value: usHeavy ? '近 6 个月无同类目竞品' : '曾合作同类目 1 次', pct: usHeavy ? 92 : 55 }
        ]
      };
      if (k === 'content') return {
        title: '内容形态匹配 · 近 30 条内容统计',
        rows: [
          { label: '主要形式 · 场景 routine / 测评 / 开箱', value: '54% / 28% / 18%', pct: 54 },
          { label: '平均时长', value: c.platform === 'YOUTUBE' ? '38 秒（Shorts）' : '26 秒', pct: 82 },
          { label: '发布频次', value: '每周 3–4 条', pct: 78 },
          { label: '有产品特写镜头的比例', value: '73%', pct: 73 },
          { label: '字幕与画质规范度', value: '稳定，可直接用于投放', pct: 86 }
        ]
      };
      if (k === 'market') return {
        title: '市场匹配 · 与当前投放站点比对',
        rows: [
          { label: '红人所在市场', value: c.nation + '（' + c.market + '）', pct: usHeavy ? 96 : 40 },
          { label: '主要受众市场与站点一致', value: usHeavy ? '一致（US）' : '不一致（需评估）', pct: usHeavy ? 92 : 32 },
          { label: '内容语言', value: c.market === 'EU' ? '英语 + 德语' : '英语', pct: 90 },
          { label: '寄样与清关可行性', value: usHeavy ? '本地仓 2–3 天可达' : '跨境 7–12 天，含关税', pct: usHeavy ? 90 : 48 },
          { label: '货币与结算', value: c.quote, pct: 80 }
        ]
      };
      return {
        title: '目标匹配 · 对本轮种草与转化目标的贡献',
        rows: [
          { label: '近 30 天平均播放', value: c.avgViews, pct: 76 },
          { label: '近 30 天互动率', value: c.er30, pct: Math.min(98, parseFloat(c.er30) * 7) },
          { label: '评论区问价 / 求链接比例', value: parseFloat(c.er30) > 8 ? '偏高（12%）' : '一般（4%）', pct: parseFloat(c.er30) > 8 ? 86 : 52 },
          { label: '历史折扣码转化', value: (crQualityDefs[c.handle] ? '有记录 · ROAS ' + crQualityDefs[c.handle].roas : '暂无记录'), pct: crQualityDefs[c.handle] ? 88 : 45 },
          { label: '内容到成交的平均滞后', value: '5–9 天', pct: 70 }
        ]
      };
    };
    const crStatusMap = { '长期合作': ['#E4EFE4', '#4E7156'], '已合作': ['#E4EFE4', '#4E7156'], '沟通中': ['#FBEEDA', '#A5762C'], '待联系': ['#E4EEF7', '#1D48D8'], '暂停': ['#F5F8FE', '#647187'] };

    const topCreatorsRows = topCreators.map(c => {
      const def = creatorDefs.find(x => x.handle === c.handle);
      if (!def) return { ...c, tierLabel: '—', hasFit: false, fit: '', fitBg: '#F5F8FE', fitFg: '#647187', info: [{ label: '来源', value: '外部导入' }] };
      const fitV = crAiScore(def);
      const platName = { TIKTOK: 'TikTok', INSTAGRAM: 'Instagram', YOUTUBE: 'YouTube' }[def.platform] || def.platform;
      return {
        ...c, platform: platName,
        tierLabel: def.followers ? this.tierOfFollowers(def.followers) : '—',
        hasFit: true, fit: String(fitV), fitBg: this.pillBg(fitV), fitFg: this.scoreColor(fitV),
        info: [
          { label: '国籍', value: def.nation }, { label: '市场', value: def.market },
          { label: '粉丝', value: def.followers }, { label: '性别', value: def.gender },
          { label: '年龄', value: def.age }, { label: '职业', value: def.job },
          { label: '均播', value: def.avgViews }, { label: 'ER', value: def.er30 },
          { label: '发布频率', value: freqOf(def.handle) }, { label: '报价', value: def.quote }
        ]
      };
    });

    const crBlackDefs = [
      { handle: '@fastcashreviews', initial: 'F', platform: 'TIKTOK', niche: '好物折扣搬运', nation: '美国', market: 'US', followers: '96K', gender: '男', age: '25-34', job: '全职创作者', avgViews: '31K', er30: '0.9%', quote: '$700', fit: 22, reasonTag: '刷量', detail: '播放与互动比例异常，第三方检测判定为异常流量；评论区高度重复。', date: '2026-06-12', by: '陈曦' },
      { handle: '@dealhunter.uk', initial: 'D', platform: 'YOUTUBE', niche: '折扣测评', nation: '英国', market: 'UK', followers: '212K', gender: '男', age: '35-44', job: '全职创作者', avgViews: '54K', er30: '1.6%', quote: '$1,900', fit: 31, reasonTag: '违规内容', detail: '发布过夸大功效表述（「一周见效」），导致上一轮内容被平台限流。', date: '2026-05-28', by: '林浩' },
      { handle: '@zoe.unbox', initial: 'Z', platform: 'INSTAGRAM', niche: '开箱与好物', nation: '美国', market: 'US', followers: '44K', gender: '女', age: '18-24', job: '学生', avgViews: '9.8K', er30: '2.4%', quote: '$450', fit: 38, reasonTag: '交付违约', detail: '收样后 45 天未交付，且拒绝退还样品，沟通中断。', date: '2026-04-09', by: '周雅' }
    ];
    const crDropDefs = [
      { handle: '@thegroomguide', initial: 'T', platform: 'YOUTUBE', niche: '男士理容测评', nation: '英国', market: 'UK', followers: '320K', gender: '男', age: '35-44', job: '全职创作者', avgViews: '78K', er30: '2.4%', quote: '$2,400', fit: 47, kind: '淘汰', reasonTag: '受众不匹配', detail: '受众性别与市场都与本品类不符，单条成本 $2,400 仅带来 11 单；且历史交付延期 2 次。仍可用于其他品类。', date: '2026-08-18', by: '苏敏' },
      { handle: '@sofia.homelab', initial: 'S', platform: 'INSTAGRAM', niche: '家居好物', nation: '美国', market: 'US', followers: '88K', gender: '女', age: '35-44', job: '室内设计师', avgViews: '23K', er30: '3.6%', quote: '$850', fit: 64, kind: '淘汰', reasonTag: '报价高于产出', detail: '流量稳定但转化偏弱，$850 报价议价未果，本轮不再投入；下一轮若接受 $650 可重新评估。', date: '2026-08-22', by: '林浩' }
    ];
    const crBlacklist = crBlackDefs.map(x => ({ ...x, kind: '黑名单' })).concat(crDropDefs).concat((s.blackAdded || []).map(h => {
      const d2 = creatorDefs.find(x => x.handle === h) || {};
      return { handle: h, initial: (h.slice(1, 2) || '?').toUpperCase(), platform: d2.platform || 'TIKTOK', niche: d2.niche || '—', nation: d2.nation || '—', market: d2.market || '—', followers: d2.followers || '—', gender: d2.gender || '—', age: d2.age || '—', job: d2.job || '—', avgViews: d2.avgViews || '—', er30: d2.er30 || '—', quote: d2.quote || '—', fit: d2.fit || 40, kind: '黑名单', reasonTag: '素材表现不佳', detail: '在 Asset Library 中被标记为拉黑，后续不进入候选与 AI 推荐。', date: '2026-08-30', by: '陈曦' };
    })).filter(b => (s.blackRestored || []).indexOf(b.handle) < 0).map(b => {
      const bare = b.handle.slice(1);
      const url = { TIKTOK: 'https://www.tiktok.com/' + b.handle, INSTAGRAM: 'https://www.instagram.com/' + bare, YOUTUBE: 'https://www.youtube.com/' + b.handle };
      const name = { TIKTOK: 'TikTok', INSTAGRAM: 'Instagram', YOUTUBE: 'YouTube' };
      const secondary = b.platform === 'YOUTUBE' ? 'INSTAGRAM' : (b.platform === 'INSTAGRAM' ? 'TIKTOK' : 'INSTAGRAM');
      const isDrop = b.kind === '淘汰';
      return {
        ...b, avatar: creatorAvatarMap[b.handle] || '../avatars/mia.jpg', color: this.scoreColor(b.fit),
        kindText: b.kind,
        kindBg: isDrop ? '#FBEEDA' : '#F7EDEE',
        kindFg: isDrop ? '#A5762C' : '#C4636D',
        kindNote: isDrop ? '仅本轮不投入，可重新评估' : '永久排除，不进入任何候选',
        restoreLabel: isDrop ? '恢复候选' : '解除拉黑',
        bandBg: isDrop ? '#FFFAF0' : '#FDF6F5', bandBd: isDrop ? '#F5E7CE' : '#F9E4E4',
        links: [
          { label: name[b.platform], url: url[b.platform], title: name[b.platform] + ' 主页 · 主阵地' },
          { label: name[secondary], url: url[secondary], title: name[secondary] + ' 主页' }
        ],
        chips: [
          { label: '国籍', value: b.nation }, { label: '市场', value: b.market },
          { label: '粉丝', value: b.followers }, { label: '层级', value: this.tierOfFollowers(b.followers) }, { label: '性别', value: b.gender },
          { label: '年龄', value: b.age }, { label: '职业', value: b.job },
          { label: '均播', value: b.avgViews }, { label: 'ER', value: b.er30 },
          { label: '发布频率', value: freqOf(b.handle) }, { label: '报价', value: b.quote }
        ],
        restore: () => this.setState(st => ({ blackRestored: [...(st.blackRestored || []), b.handle] })),
        ...(() => {
          const seed = {
            '@thegroomguide': [
              { title: '男士理容测评长视频', product: 'Ryze 头皮按摩仪', sku: 'RYZ-SC-01', channel: 'YouTube', date: '2026-04-18', views: '96K', er: '2.4%', gmv: '$1,240', goal: 42 },
              { title: '参数对比片段', product: 'Ryze 头皮按摩仪', sku: 'RYZ-SC-01', channel: 'YouTube', date: '2026-05-02', views: '31K', er: '1.8%', gmv: '$380', goal: 24 }
            ],
            '@sofia.homelab': [
              { title: '家居好物清单', product: 'Lumo 便携香氛机', sku: 'LUM-AR-02', channel: 'Instagram', date: '2026-06-08', views: '88K', er: '3.8%', gmv: '$980', goal: 58 }
            ],
            '@zoe.unbox': [
              { title: '开箱合集（含竞品）', product: 'Ryze 头皮按摩仪', sku: 'RYZ-SC-01', channel: 'Instagram', date: '2026-03-22', views: '44K', er: '2.1%', gmv: '$260', goal: 31 }
            ]
          };
          const fromTags = (s.tagSubmits || []).filter(x => x.kind === 'creator' && x.target === b.handle && ((s.approvals || {})['tag-' + x.id] || {}).status === '已通过')
            .map(x => {
              const src = this.ASSET_SEED.find(a => a.handle === b.handle && a.title === x.ctx) || this.ASSET_SEED.find(a => a.handle === b.handle);
              if (!src) return null;
              return { title: src.title, product: src.product, sku: src.sku, channel: src.channel, date: src.post, views: src.views, er: src.er, gmv: '$' + (Number(src.gmv) || 0).toLocaleString('en-US'), goal: Math.min(140, Math.round((parseFloat(src.er) || 0) * 12)) };
            }).filter(Boolean);
          const list = (seed[b.handle] || []).concat(fromTags);
          const rows = list.map(a => {
            const vn = parseFloat(a.views) * (/K/i.test(a.views) ? 1000 : 1);
            const gn = parseFloat(String(a.gmv).replace(/[^0-9.]/g, ''));
            const sc = Math.max(12, Math.min(99, Math.round(
              Math.min(100, vn / 4500) * 0.25 + Math.min(100, gn / 160) * 0.3 + Math.min(100, a.goal) * 0.45
            )));
            return { ...a, score: sc };
          }).sort((x, y) => y.score - x.score).map((a, ai) => ({
            ...a, idx: ai + 1, rowBg: ai % 2 === 1 ? '#FFFFFF' : '#FFFFFF',
            scoreColor: this.scoreColor(a.score), scoreBg: this.pillBg(a.score),
            url: (a.channel === 'YouTube' ? 'https://www.youtube.com/watch?v=' : (a.channel === 'Instagram' ? 'https://www.instagram.com/p/' : 'https://www.tiktok.com/video/')) + 'b' + (a.title.length * 6421)
          }));
          return { assets: rows, assetCount: rows.length, hasAssets: rows.length > 0, noAssets: rows.length === 0 };
        })()
      };
    });

    const crQualityDefs = {
      '@mia.selfcare': {
        grade: 'S 级 · 标杆', roas: '4.1x',
        products: [{ name: 'Ryze 头皮按摩仪', meta: 'Q2 北美种草 · 2 条内容' }, { name: 'Lumo 便携香氛机', meta: 'Q1 家居氛围 · 1 条内容' }],
        assets: [
          { type: 'VIDEO', title: '夜间 routine ep.12', product: 'Ryze 头皮按摩仪', sku: 'RYZ-SC-01', campaign: 'Q2 北美种草', channel: 'TikTok', date: '2026-05-14', views: '412K', er: '7.1%', cpv: '$0.009', gmv: '$14,800', roas: '4.1x', goal: 128 },
          { type: 'VIDEO', title: '睡前三分钟', product: 'Ryze 头皮按摩仪', sku: 'RYZ-SC-01', campaign: 'Q2 北美种草', channel: 'TikTok', date: '2026-05-28', views: '236K', er: '6.2%', cpv: '$0.011', gmv: '$7,600', roas: '3.2x', goal: 104 },
          { type: 'IMAGE', title: '浴室静帧组', product: 'Lumo 便携香氛机', sku: 'LUM-AR-02', campaign: 'Q1 家居氛围', channel: 'Instagram', date: '2026-03-06', views: '88K', er: '4.4%', cpv: '$0.014', gmv: '$2,900', roas: '2.6x', goal: 92 }
        ]
      },
      '@kaylascalp': {
        grade: 'A 级 · 性价比', roas: '3.4x',
        products: [{ name: 'Ryze 头皮按摩仪', meta: 'Q2 北美种草 · 3 条内容' }],
        assets: [
          { type: 'VIDEO', title: '头皮特写实测', product: 'Ryze 头皮按摩仪', sku: 'RYZ-SC-01', campaign: 'Q2 北美种草', channel: 'TikTok', date: '2026-05-09', views: '166K', er: '12.4%', cpv: '$0.008', gmv: '$6,200', roas: '3.4x', goal: 118 },
          { type: 'COPY', title: '高转化口播片段', product: 'Ryze 头皮按摩仪', sku: 'RYZ-SC-01', campaign: 'Q2 北美种草', channel: 'TikTok', date: '2026-06-02', views: '—', er: '—', cpv: '—', gmv: '$3,100', roas: '2.8x', goal: 96 }
        ]
      },
      '@leo.calmnight': {
        grade: 'A 级 · 搜索承接', roas: '2.6x',
        products: [{ name: 'Ryze 头皮按摩仪', meta: 'Q3 北美种草 · 1 条内容' }],
        assets: [
          { type: 'VIDEO', title: '一周实测 Shorts', product: 'Ryze 头皮按摩仪', sku: 'RYZ-SC-01', campaign: 'Q3 北美种草', channel: 'YouTube', date: '2026-08-14', views: '214K', er: '5.1%', cpv: '$0.013', gmv: '$5,400', roas: '2.6x', goal: 107 },
          { type: 'IMAGE', title: '封面静帧', product: 'Ryze 头皮按摩仪', sku: 'RYZ-SC-01', campaign: 'Q3 北美种草', channel: 'YouTube', date: '2026-08-16', views: '31K', er: '2.8%', cpv: '$0.021', gmv: '$780', roas: '1.4x', goal: 68 }
        ]
      },
      '@june.rests': {
        grade: 'B 级 · 潜力', roas: '2.1x',
        products: [{ name: 'Ryze 头皮按摩仪', meta: 'Q3 北美种草 · 1 条内容' }],
        assets: [
          { type: 'VIDEO', title: '前后头皮对比', product: 'Ryze 头皮按摩仪', sku: 'RYZ-SC-01', campaign: 'Q3 北美种草', channel: 'TikTok', date: '2026-08-16', views: '74K', er: '13.8%', cpv: '$0.016', gmv: '$2,050', roas: '2.1x', goal: 88 }
        ]
      }
    };
    const qualityBase = Object.keys(crQualityDefs).concat((s.qualityAdded || []).filter(h => !crQualityDefs[h]));
    const crQuality = qualityBase.map(h => {
      const c = creatorDefs.find(x => x.handle === h);
      if (!c) return null;
      const approvedAssets = (s.tagSubmits || []).filter(x => x.kind === 'creator' && x.target === h && ((s.approvals || {})['tag-' + x.id] || {}).status === '已通过')
        .map(x => {
          const src = this.ASSET_SEED.find(a => a.handle === h && a.title === x.ctx) || this.ASSET_SEED.find(a => a.handle === h);
          if (!src) return null;
          const vn = this.toNumU(src.views);
          const gn = Number(src.gmv) || 0;
          const goal = Math.min(140, Math.round((parseFloat(src.er) || 0) * 12));
          return {
            type: 'VIDEO', title: src.title, product: src.product, sku: src.sku, campaign: src.campaign || '本轮种草',
            channel: src.channel, date: src.post, views: src.views, er: src.er,
            cpv: src.spend > 0 && vn > 0 ? '$' + (src.spend / vn).toFixed(3) : '寄样',
            gmv: '$' + gn.toLocaleString('en-US'),
            roas: src.spend > 0 ? (gn / src.spend).toFixed(1) + 'x' : '—',
            goal, fromTag: true
          };
        }).filter(Boolean);
      const q = crQualityDefs[h] || { grade: 'A 级 · 由素材标记', roas: approvedAssets.length ? (approvedAssets[0].roas || '—') : '—', products: [], assets: [] };
      const qAssetsAll = (q.assets || []).concat(approvedAssets);
      const qFit = crAiScore(c);
      const [qsBg, qsFg] = crStatusMap[c.status] || ['#F5F8FE', '#647187'];
      return {
        handle: c.handle, initial: c.initial, avatar: creatorAvatarMap[c.handle] || '../avatars/mia.jpg', platform: c.platform, grade: q.grade, roas: q.roas,
        niche: c.niche, fit: qFit, fitColor: this.scoreColor(qFit),
        status: c.status, statusBg: qsBg, statusFg: qsFg,
        links: crLinksOf(c),
        chips: [
          { label: '国籍', value: c.nation }, { label: '市场', value: c.market },
          { label: '粉丝', value: c.followers }, { label: '层级', value: this.tierOfFollowers(c.followers) }, { label: '性别', value: c.gender },
          { label: '年龄', value: c.age }, { label: '职业', value: c.job },
          { label: '均播', value: c.avgViews }, { label: 'ER', value: c.er30 },
          { label: '发布频率', value: freqOf(c.handle) }, { label: '报价', value: c.quote }
        ],
        assets: qAssetsAll.map(a => {
          const viewsNum = a.views === '—' ? 0 : parseFloat(a.views) * (/K/i.test(a.views) ? 1000 : 1);
          const gmvNum = parseFloat(String(a.gmv).replace(/[^0-9.]/g, ''));
          const roasNum = parseFloat(a.roas);
          const hasRoas = !isNaN(roasNum) && roasNum > 0;
          const parts = [
            [Math.min(100, viewsNum / 4500), 0.25],
            [Math.min(100, gmvNum / 160), 0.3],
            [Math.min(100, a.goal), 0.2]
          ];
          if (hasRoas) parts.push([Math.min(100, roasNum * 22), 0.25]);
          const wSum = parts.reduce((t2, p) => t2 + p[1], 0);
          const sc = Math.max(20, Math.min(99, Math.round(parts.reduce((t2, p) => t2 + p[0] * p[1], 0) / wSum)));
          return { ...a, score: sc };
        }).filter(a => a.score >= 60 || a.fromTag).sort((x, y) => y.score - x.score).map((a, ai) => ({
          ...a, idx: ai + 1, rowBg: ai % 2 === 1 ? '#FFFFFF' : '#FFFFFF',
          scoreColor: this.scoreColor(a.score), scoreBg: this.pillBg(a.score),
          byApproval: !!a.fromTag,
          metrics: [{ label: 'View', value: a.views }, { label: 'ER', value: a.er }, { label: 'CPV', value: a.cpv }, { label: 'GMV', value: a.gmv }],
          url: (a.channel === 'YouTube' ? 'https://www.youtube.com/watch?v=' : (a.channel === 'Instagram' ? 'https://www.instagram.com/p/' : 'https://www.tiktok.com/video/')) + 'a' + (a.title.length * 7351),
          goalText: a.goal >= 100 ? '达成 ' + a.goal + '%' : '未达成 ' + a.goal + '%',
          goalBg: a.goal >= 100 ? '#E4EFE4' : (a.goal >= 90 ? '#FBEEDA' : '#FBE3E3'),
          goalFg: a.goal >= 100 ? '#4E7156' : (a.goal >= 90 ? '#A5762C' : '#C4636D'),
          goalNote: a.goal >= 100 ? '超出目标 ' + (a.goal - 100) + ' 个百分点' : '距目标 ' + (100 - a.goal) + ' 个百分点',
          open: () => this.setState({ page: 'assets' })
        })),
        assetCount: 0
      };
    }).filter(Boolean).map(q2 => ({ ...q2, assetCount: q2.assets.length, hasAssets: q2.assets.length > 0, noAssets: q2.assets.length === 0 }))
      .filter(q2 => q2.assets.length > 0 || (s.qualityAdded || []).indexOf(q2.handle) >= 0);

    const contactC = s.contactHandle ? creatorDefs.find(x => x.handle === s.contactHandle) : null;
    const briefProdSkus = (() => {
      const out = [];
      (s.briefFromStrategy || []).forEach(x => { if (out.indexOf(x.sku) < 0) out.push(x.sku); });
      (s.library || []).forEach(x => { if (out.indexOf(x.sku) < 0) out.push(x.sku); });
      (s.promoted || []).forEach(x => { if (out.indexOf(x) < 0) out.push(x); });
      return out.length ? out : [skuAll[0].sku];
    })();
    const contactProd = s.contactProduct || briefProdSkus[0];
    const isEnMail = (s.mailLang || 'zh') === 'en';
    const contactMode = contactC && /寄样/.test(contactC.quote)
      ? (isEnMail ? 'gifting + 12% commission' : '寄样 + 12% 佣金')
      : (isEnMail ? 'flat fee + commission' : '固定费 + 佣金');
    const dealLabelEn = { '付费合作': 'Paid collaboration', '产品置换': 'Product gifting', '佣金合作': 'Commission-only', '免费合作': 'No-fee co-creation', '拒绝合作': 'Declined' };
    const contactProdName = (skuAll.find(p => p.sku === contactProd) || skuAll[0]).name;
    const dealType = s.dealType || (contactC && /寄样/.test(contactC.quote) ? '产品置换' : '付费合作');
    const tplKey = s.mailTpl || 'intro';
    const tplDefs = (() => {
      if (!contactC) return {};
      const pn3 = (skuAll.find(p => p.sku === contactProd) || skuAll[0]);
      const sign3 = '\n\n— 陈曦 · ' + pn3.brand + ' 红人合作';
      const linkOf = (sk) => 'https://www.amazon.com/dp/' + ((skuAll.find(x => x.sku === sk) || {}).asin || 'B0XXXXXXX');
      const introSkus = (s.mailProds && s.mailProds.length) ? s.mailProds : [contactProd];
      const introList = introSkus.map(sk => {
        const p5 = skuAll.find(x => x.sku === sk) || pn3;
        return '· ' + p5.name + '（' + p5.sku + '）｜' + p5.price + '｜' + linkOf(sk);
      }).join('\n');
      const introListEn = introSkus.map(sk => {
        const p5 = skuAll.find(x => x.sku === sk) || pn3;
        return '· ' + p5.name + ' (' + p5.sku + ') | ' + p5.price + ' | ' + linkOf(sk);
      }).join('\n');
      return {
        intro: {
          label: '首次建联', note: '第一次联系该红人时使用。含产品销售链接，可用下方「添加产品」加入多个 SKU。',
          subject: '合作邀请 · ' + pn3.name + ' × ' + contactC.handle,
          body: 'Hi ' + contactC.handle + '，我们是 ' + pn3.brand + '，一直在看你的' + contactC.niche + '内容。\n\n想邀请你合作，先把产品和链接放在这里，你可以直接看看是否感兴趣：\n\n' + introList + '\n\n这一轮我们不做硬广，只想请你用自己的方式拍一条真实使用的内容，脚本与形式都由你决定。\n\n合作方式：' + contactMode + '，报价按你的 media kit（当前记录 ' + contactC.quote + '）。\n交付：1 条主视频 + 3 张静帧，寄样后 14 天内交初稿。\n\n如果方向合适，回一句就好，我把 Brief 和寄样地址表发给你。' + sign3
        },
        first: {
          label: '首次邮件跟进', note: '已发出开场邮件但未回复时使用，语气轻、给一个明确的下一步。',
          subject: 'Re: 合作邀请 · ' + pn3.name + ' × ' + contactC.handle,
          body: 'Hi ' + contactC.handle + '，上周给你发过一封关于 ' + pn3.name + ' 的合作邀请，担心被邮件淹没所以再跟进一次。\n\n简单说：我们想请你用自己的方式拍一条真实使用的内容，不需要照读脚本。\n\n如果方向合适，回一句"有兴趣"我就把 Brief 和寄样地址表发给你；如果暂时不合适，也可以直接告诉我，不会再打扰。' + sign3
        },
        quote: {
          label: '报价与合作确认', note: '对方有兴趣、进入价格与条件沟通阶段。',
          subject: '报价与合作条件 · ' + pn3.name + ' × ' + contactC.handle,
          body: 'Hi ' + contactC.handle + '，谢谢回复，这里是完整的合作条件：\n\n报价：' + contactC.quote + '（如为付费合作，定金 50% + 交付后尾款 50%）\n佣金：按专属折扣码成交额 12%\n交付：1 条主视频 + 3 张静帧，寄样后 14 天内交初稿，修改 1 轮\n授权：社媒 6 个月 + 白名单投放 3 个月\n\n如果报价或交付需要调整，直接回我一个可接受的方案，我这边尽量配合。' + sign3
        },
        confirm: {
          label: '合作确认', note: '双方条件谈定，确认合作方式并打上合作类型标签。',
          subject: '合作确认 · ' + pn3.name + ' × ' + contactC.handle,
          body: 'Hi ' + contactC.handle + '，条件已确认，这里同步一下最终版本：\n\n合作方式：' + dealType + '\n报价与结算：' + contactC.quote + '，佣金 12%\n交付与时间：1 条主视频 + 3 张静帧，寄样后 14 天内交初稿\n授权：社媒 6 个月 + 白名单投放 3 个月\n\n合同我会在今天发给你电子签，签署后我们立即安排寄样。' + sign3
        },
        sample: {
          label: '寄样确认', note: '确认收件信息与寄样时间。',
          subject: '寄样确认 · ' + pn3.name,
          body: 'Hi ' + contactC.handle + '，样品准备好了，麻烦确认一下收件信息：\n\n收件人 / 地址 / 电话：（请回复确认或更正）\n寄送内容：' + pn3.name + ' × 1\n物流：DHL Express，预计 3–5 个工作日送达，运单号寄出后我会同步给你。\n\n收到后不用急着拍，先真实用几天再决定内容方向。' + sign3
        },
        progress: {
          label: '内容进度跟进', note: '寄样已签收、初稿未交付时使用。',
          subject: '内容进度跟进 · ' + pn3.name,
          body: 'Hi ' + contactC.handle + '，样品应该已经收到了，这边跟进一下内容进度。\n\n如果初稿还需要时间，告诉我一个大概日期就好，我按你的节奏调整排期；如果拍摄上有卡点（场景、角度、要讲的点），也可以直接说，我给你几个参考方向。' + sign3
        },
        post: {
          label: '发布后数据跟进', note: '内容已发布，同步数据并谈下一轮。',
          subject: '内容数据反馈 · ' + pn3.name,
          body: 'Hi ' + contactC.handle + '，内容已经上线，这边同步一下前期数据：\n\n播放 / 互动 / 折扣码转化：（见附表）\n表现最好的一段：开头进入使用画面的部分\n\n数据不错，我们想把这条素材用于白名单投放（需要一份二次授权补充协议），同时想聊下一轮合作。你看方便的话我把方案发过来。' + sign3
        }
      };
    })();
    const mailLang = s.mailLang || 'zh';
    const tplDefsEn = (() => {
      if (!contactC) return {};
      const pn4 = (skuAll.find(p => p.sku === contactProd) || skuAll[0]);
      const sign4 = '\n\nBest,\nChen Xi · ' + pn4.brand + ' Creator Partnerships';
      const linkOf4 = (sk) => 'https://www.amazon.com/dp/' + ((skuAll.find(x => x.sku === sk) || {}).asin || 'B0XXXXXXX');
      const introSkus4 = (s.mailProds && s.mailProds.length) ? s.mailProds : [contactProd];
      const introListEn = introSkus4.map(sk => {
        const p5 = skuAll.find(x => x.sku === sk) || pn4;
        return '· ' + p5.name + ' (' + p5.sku + ') | ' + p5.price + ' | ' + linkOf4(sk);
      }).join('\n');
      return {
        intro: {
          label: 'First outreach', note: 'First time contacting this creator. Includes product links; use "添加产品" below to add more SKUs.',
          subject: 'Collaboration invite · ' + pn4.name + ' × ' + contactC.handle,
          body: 'Hi ' + contactC.handle + ', we are ' + pn4.brand + ' and we have been following your ' + contactC.niche + ' content.\n\nWe would love to work with you. Here is the product and the link so you can take a look first:\n\n' + introListEn + '\n\nThis round is not about hard selling — we just want one honest piece of you actually using it. Script and format are entirely yours.\n\nDeal structure: ' + contactMode + ', rate per your media kit (we have ' + contactC.quote + ' on file).\nDeliverables: 1 hero video + 3 stills, first cut within 14 days of receiving the sample.\n\nIf the direction works, just reply and I will send the brief and the shipping form.' + sign4
        },
        first: {
          label: 'First follow-up', note: 'Use when the opening email got no reply — keep it light and give one clear next step.',
          subject: 'Re: Collaboration invite · ' + pn4.name + ' × ' + contactC.handle,
          body: 'Hi ' + contactC.handle + ', I reached out last week about ' + pn4.name + ' and wanted to follow up in case it got buried.\n\nShort version: we would love you to film one honest piece about using it, in your own way — no script to read.\n\nIf the direction works, just reply "interested" and I will send the brief and the shipping form. If it is not a fit right now, tell me and I will not follow up again.' + sign4
        },
        quote: {
          label: 'Rate & terms', note: 'They are interested — move to price and terms.',
          subject: 'Rate and terms · ' + pn4.name + ' × ' + contactC.handle,
          body: 'Hi ' + contactC.handle + ', thanks for getting back to me. Here are the full terms:\n\nRate: ' + contactC.quote + ' (for paid deals: 50% upfront, 50% on delivery)\nCommission: 12% of sales through your dedicated code\nDeliverables: 1 hero video + 3 stills, first cut within 14 days of receiving the sample, 1 revision round\nUsage rights: organic social 6 months + whitelisted paid 3 months\n\nIf the rate or deliverables need adjusting, send me a version that works for you and I will do my best to meet it.' + sign4
        },
        confirm: {
          label: 'Deal confirmation', note: 'Terms agreed — confirm the deal type and tag it.',
          subject: 'Confirmed · ' + pn4.name + ' × ' + contactC.handle,
          body: 'Hi ' + contactC.handle + ', everything is confirmed. Final terms for your records:\n\nDeal type: ' + (dealLabelEn[dealType] || dealType) + '\nRate and payment: ' + contactC.quote + ', 12% commission\nDeliverables and timing: 1 hero video + 3 stills, first cut within 14 days of receiving the sample\nUsage rights: organic social 6 months + whitelisted paid 3 months\n\nI will send the contract for e-signature today, and we ship the sample as soon as it is signed.' + sign4
        },
        sample: {
          label: 'Shipping confirmation', note: 'Confirm the shipping address and timing.',
          subject: 'Shipping confirmation · ' + pn4.name,
          body: 'Hi ' + contactC.handle + ', your sample is ready. Could you confirm the shipping details?\n\nRecipient / address / phone: (please confirm or correct)\nContents: ' + pn4.name + ' × 1\nCarrier: DHL Express, 3–5 business days. I will share the tracking number once it ships.\n\nNo rush to film once it arrives — live with it for a few days first, then decide your angle.' + sign4
        },
        progress: {
          label: 'Content progress', note: 'Sample delivered but the first cut has not arrived.',
          subject: 'Checking in on the first cut · ' + pn4.name,
          body: 'Hi ' + contactC.handle + ', the sample should have arrived — just checking in on the content.\n\nIf you need more time, a rough date is enough and I will adjust the schedule around you. If anything is blocking the shoot (setting, angle, what to say), tell me and I will send a few reference directions.' + sign4
        },
        post: {
          label: 'Post-launch data', note: 'Content is live — share results and discuss the next round.',
          subject: 'Performance recap · ' + pn4.name,
          body: 'Hi ' + contactC.handle + ', the content is live. Early numbers:\n\nViews / engagement / code conversions: (see attached)\nStrongest moment: the opening where you enter the scene\n\nResults look good — we would like to run this asset as whitelisted paid media (needs a short content-license addendum), and we would love to talk about a next round. Happy to send a proposal if you are open to it.' + sign4
        }
      };
    })();
    const tplSet = mailLang === 'en' ? tplDefsEn : tplDefs;
    const tplCur = tplSet[tplKey] || tplSet.first || { subject: '', body: '', note: '' };
    const dealMeta = (() => {
      if (!contactC) return { note: '', subject: '', body: '' };
      const brand2 = (skuAll.find(p => p.sku === contactProd) || skuAll[0]).brand;
      const sign = '\n\n— 陈曦 · ' + brand2 + ' 红人合作';
      const map = {
        '付费合作': {
          note: '固定费 + 佣金：适合数据稳定、需要排期保障的红人。',
          subject: '付费合作邀请 · ' + contactProdName + ' × ' + contactC.handle,
          body: 'Hi ' + contactC.handle + '，谢谢回复。\n\n我们希望以付费方式合作 ' + contactProdName + '。\n\n报价：按你的 media kit（当前记录 ' + contactC.quote + '），定金 50% + 交付后尾款 50%，另加 12% 销售佣金。\n交付：1 条主视频 + 3 张静帧，寄样后 14 天内交初稿，修改 1 轮。\n授权：社媒 6 个月 + 白名单投放 3 个月。\n\n如果没问题，我这边直接出合同与寄样单。' + sign
        },
        '产品置换': {
          note: '寄样置换：无固定费，适合垂类 KOC 与首次试合作。',
          subject: '产品置换合作 · ' + contactProdName + ' × ' + contactC.handle,
          body: 'Hi ' + contactC.handle + '，谢谢回复。\n\n这一轮我们希望以产品置换的方式合作 ' + contactProdName + '：我们寄样，你按自己的节奏拍一条真实使用的内容。\n\n无固定费用，销售部分按 12% 佣金结算。\n交付：1 条主视频，寄样后 14 天内发布，形式与脚本你决定。\n授权：社媒 6 个月。\n\n方便的话把收件地址发我，本周就可以寄出。' + sign
        },
        '佣金合作': {
          note: '纯佣金：无前置成本，适合带货能力强、愿意长期分成的红人。',
          subject: '佣金合作方案 · ' + contactProdName + ' × ' + contactC.handle,
          body: 'Hi ' + contactC.handle + '，谢谢回复。\n\n我们可以先走纯佣金模式合作 ' + contactProdName + '：不设固定费，按实际成交给 18% 佣金（高于常规 12%），专属折扣码与短链我们提供。\n\n表现达标后，下一轮可以转为固定费 + 佣金的长期合作。\n交付：1 条主视频 + 可选静帧，时间由你安排。' + sign
        },
        '免费合作': {
          note: '免费/互推：适合品牌早期或红人主动感兴趣的情况。',
          subject: '内容共创邀请 · ' + contactProdName + ' × ' + contactC.handle,
          body: 'Hi ' + contactC.handle + '，谢谢回复。\n\n这一轮预算有限，想先做一次轻量共创：我们提供 ' + contactProdName + ' 样品与素材支持，你如果用得顺手再决定要不要发内容，不做硬性要求。\n\n如果内容表现好，下一轮我们会以付费方式优先邀请你。' + sign
        },
        '拒绝合作': {
          note: '红人拒绝本次合作：礼貌回应并保留后续合作的可能。',
          subject: 'Re: 合作沟通 · ' + contactProdName,
          body: 'Hi ' + contactC.handle + '，完全理解，谢谢你抽时间回复。\n\n这次的产品或档期没能匹配上没关系，不会打扰你后续的内容安排。\n\n我们会把你的偏好记录下来（内容形式、合作方式、可接受的档期）。之后如果有更贴合你内容的产品，或者条件可以调整，我再来问你一次。\n\n也祝你接下来的内容顺利，期待下次有机会一起做。' + sign
        }
      };
      const mapEn = {
        '付费合作': {
          note: 'Flat fee + commission: best for creators with stable numbers and guaranteed scheduling.',
          subject: 'Paid collaboration · ' + contactProdName + ' × ' + contactC.handle,
          body: 'Hi ' + contactC.handle + ', thanks for getting back to me.\n\nWe would like to work with you on ' + contactProdName + ' as a paid collaboration.\n\nRate: per your media kit (we have ' + contactC.quote + ' on file), 50% upfront and 50% on delivery, plus 12% sales commission.\nDeliverables: 1 hero video + 3 stills, first cut within 14 days of receiving the sample, 1 revision round.\nUsage rights: organic social 6 months + whitelisted paid 3 months.\n\nIf that works, I will send the contract and the shipping form right away.' + sign.replace('— 陈曦 · ', 'Best,\nChen Xi · ').replace(' 红人合作', ' Creator Partnerships')
        },
        '产品置换': {
          note: 'Product gifting: no flat fee — good for niche creators and first-time tests.',
          subject: 'Product gifting collaboration · ' + contactProdName + ' × ' + contactC.handle,
          body: 'Hi ' + contactC.handle + ', thanks for getting back to me.\n\nFor this round we would love to work on a gifting basis for ' + contactProdName + ': we send the product, you film one honest piece at your own pace.\n\nNo flat fee; sales are settled at 12% commission.\nDeliverables: 1 hero video, posted within 14 days of delivery — format and script are yours.\nUsage rights: organic social 6 months.\n\nIf you are in, send me your shipping address and we can ship this week.' + sign.replace('— 陈曦 · ', 'Best,\nChen Xi · ').replace(' 红人合作', ' Creator Partnerships')
        },
        '佣金合作': {
          note: 'Commission-only: no upfront cost — best for creators who convert and want upside.',
          subject: 'Commission-based partnership · ' + contactProdName + ' × ' + contactC.handle,
          body: 'Hi ' + contactC.handle + ', thanks for getting back to me.\n\nWe can start on a commission-only basis for ' + contactProdName + ': no flat fee, 18% of actual sales (above our standard 12%), with a dedicated discount code and short link provided by us.\n\nIf results are strong, we can move to a flat fee + commission arrangement next round.\nDeliverables: 1 hero video plus optional stills, on your own schedule.' + sign.replace('— 陈曦 · ', 'Best,\nChen Xi · ').replace(' 红人合作', ' Creator Partnerships')
        },
        '免费合作': {
          note: 'No-fee co-creation: for early-stage brands or when the creator reaches out first.',
          subject: 'Co-creation invite · ' + contactProdName + ' × ' + contactC.handle,
          body: 'Hi ' + contactC.handle + ', thanks for getting back to me.\n\nBudget is limited this round, so we would like to start with a light co-creation: we provide a ' + contactProdName + ' sample and creative support, and you only post if you actually like it — no obligation.\n\nIf the content performs, you will be first on our list for a paid round.' + sign.replace('— 陈曦 · ', 'Best,\nChen Xi · ').replace(' 红人合作', ' Creator Partnerships')
        },
        '拒绝合作': {
          note: 'Creator declined: reply politely and keep the door open.',
          subject: 'Re: Collaboration · ' + contactProdName,
          body: 'Hi ' + contactC.handle + ', completely understood — thank you for taking the time to reply.\n\nNo problem at all that the product or the timing was not a fit; I will not interrupt your content schedule further.\n\nI will note your preferences on our side (content format, deal structure, workable timing). If we have something closer to your content later, or the terms can flex, I will check in once more.\n\nWishing you a great run with your upcoming content — hopefully we get to work together another time.' + sign.replace('— 陈曦 · ', 'Best,\nChen Xi · ').replace(' 红人合作', ' Creator Partnerships')
        }
      };
      const useEn = (s.mailLang || 'zh') === 'en';
      const pickMap = useEn ? mapEn : map;
      return pickMap[dealType] || pickMap['付费合作'];
    })();
    const rejectMode = tplKey === 'confirm' && dealType === '拒绝合作';
    const baseSubject = contactC ? (rejectMode ? dealMeta.subject : (tplCur.subject || dealMeta.subject)) : '';
    const contactSubjectDefault = contactC
      ? (s.replyTo
          ? (isEnMail
              ? 'Re: ' + String(baseSubject).replace(/^Re:\s*/, '')
              : (/^Re:/.test(s.replyTo) ? s.replyTo : 'Re: ' + s.replyTo))
          : baseSubject)
      : '';
    const contactDraft = (variant) => {
      if (!contactC) return '';
      const brandName = (skuAll.find(p => p.sku === contactProd) || skuAll[0]).brand;
      const openers = [
        'Hi ' + contactC.handle + '，我们是 ' + brandName + '，一直在看你的' + contactC.niche + '内容。',
        'Hi ' + contactC.handle + '，看了你最近几条内容，节奏和我们想讲的东西很像，所以直接来问了。',
        'Hi ' + contactC.handle + '，' + brandName + '这边在找能把产品放进真实日常里的创作者，你的内容一直在我们的清单上。',
        'Hi ' + contactC.handle + '，不绕弯子：我们想请你用你自己的方式讲一次 ' + contactProdName + '。'
      ];
      const bodies = [
        '想邀请你合作 ' + contactProdName + '。这一轮我们不追求硬广，只想拍出你真实使用的一段过程。',
        '这一轮的目标是内容与口碑，不是转化数字。你怎么用、怎么讲，都由你决定。',
        '我们准备了 ' + contactProdName + ' 的样品，希望你先真实用几天，觉得值得讲再拍。',
        '如果你愿意，我们希望把 ' + contactProdName + ' 放进你原本的内容节奏里，不额外摆场景。'
      ];
      const v = ((variant || 0) % 4 + 4) % 4;
      if ((s.mailLang || 'zh') === 'en') {
        const openersEn = [
          'Hi ' + contactC.handle + ', we are ' + brandName + ' and we have been following your ' + contactC.niche + ' content for a while.',
          'Hi ' + contactC.handle + ', I watched your last few pieces — the pacing is very close to what we are trying to say, so I am reaching out directly.',
          'Hi ' + contactC.handle + ', ' + brandName + ' is looking for creators who can put a product inside a real routine, and your work has been on our list.',
          'Hi ' + contactC.handle + ', straight to it: we would love you to talk about ' + contactProdName + ' in your own way.'
        ];
        const bodiesEn = [
          'We would like to collaborate on ' + contactProdName + '. This round is not about hard selling — we just want one honest stretch of you actually using it.',
          'The goal this round is content and word of mouth, not conversion numbers. How you use it and how you talk about it is entirely up to you.',
          'We have a ' + contactProdName + ' sample ready — live with it for a few days first, and only film if you think it is worth talking about.',
          'If you are open to it, we would like ' + contactProdName + ' to sit inside your existing content rhythm, with no staged setups.'
        ];
        return openersEn[v] + '\n\n' + bodiesEn[v] + '\n\n'
          + 'Deal structure: ' + contactMode + ', rate per your media kit (we have ' + contactC.quote + ' on file).\n'
          + 'Deliverables: 1 hero video + 3 stills, first cut within 14 days of receiving the sample, 1 revision round.\n'
          + 'Usage rights: organic social 6 months + whitelisted paid 3 months — negotiable.\n\n'
          + 'If the direction works, I will send the brief and the shipping form together. Looking forward to hearing from you.\n\nBest,\nChen Xi · ' + brandName + ' Creator Partnerships';
      }
      return openers[v] + '\n\n' + bodies[v] + '\n\n'
        + '合作方式：' + contactMode + '，报价按你的 media kit（当前记录 ' + contactC.quote + '）。\n'
        + '交付：1 条主视频 + 3 张静帧，寄样后 14 天内交初稿，修改 1 轮。\n'
        + '授权：社媒 6 个月 + 白名单投放 3 个月，可再谈。\n\n'
        + '如果方向合适，我把 Brief 和寄样地址表一起发给你。期待你的回复。\n\n— 陈曦 · ' + (skuAll.find(p => p.sku === contactProd) || skuAll[0]).brand + ' 红人合作';
    };
    const threadInboxCount = contactC ? this.INBOX_REPLIES.filter(r => r.handle === contactC.handle).length * 2 : 0;
    const threadRealCount = contactC
      ? (((contactC.status === '已合作' || contactC.status === '长期合作') && !threadInboxCount) ? 1 : 0)
        + threadInboxCount
        + (s.contactLog || []).filter(x => x.handle === contactC.handle).length
      : 0;
    const threadArr = contactC ? (() => {
      const pn = (skuAll.find(p => p.sku === contactProd) || skuAll[0]).name;
      const out = [];
      const worked2 = contactC.status === '已合作' || contactC.status === '长期合作';
      // 与 My Tasks 待回复邮件同源：收件箱里的每一封回复都要在会话里出现，并补出我方的开场邮件
      const inbox = this.INBOX_REPLIES.filter(r => r.handle === contactC.handle);
      inbox.forEach(r => {
        const day = r.when.split(' ')[0];
        const prevDay = (() => {
          const d = new Date(day + 'T00:00:00');
          d.setDate(d.getDate() - 3);
          return d.toISOString().slice(0, 10);
        })();
        out.push({
          key: prevDay, date: prevDay.slice(5).replace('-', '/'), who: '我方发送',
          text: '开场邮件已发出：邀请 ' + contactC.handle + ' 合作 ' + (String(r.subject).split('·')[1] || pn).trim() + '，附 Brief 与寄样地址表。',
          subject: r.subject, tagBg: '#E4EEF7', tagFg: '#1D48D8'
        });
        out.push({
          key: day + ' ' + r.when.split(' ')[1], date: day.slice(5).replace('-', '/'), who: '红人回复',
          text: r.gist + '（已等待 ' + r.hours + ' 小时未回复）',
          subject: 'Re: ' + r.subject, tagBg: '#E4EFE4', tagFg: '#4E7156', canReply: true
        });
      });
      if (worked2 && !inbox.length) {
        out.push({ key: '2026-08-12', date: '08/12', who: '红人回复', text: '方向没问题，样品寄到常用地址即可，下一条内容按原节奏安排。', subject: 'Re: 合作邀请 · ' + pn, tagBg: '#E4EFE4', tagFg: '#4E7156', canReply: true });
      }
      (s.contactLog || []).filter(x => x.handle === contactC.handle).forEach(x => {
        const d0 = x.when.split(' ')[0];
        const attLine = (x.attNames && x.attNames.length) ? '\n\n附件：' + x.attNames.join('、') : '';
        const fallback = x.isReply
          ? '（回复内容未留存）'
          : 'Hi ' + contactC.handle.replace('@', '') + '，\n\n我们想邀请你参与 ' + pn + ' 的本轮合作。附件中包含 Campaign Brief 与产品资料，请查收并回复档期及合作方式。\n\n— 陈曦 · 红人合作';
        out.push({
          key: d0, date: d0.slice(5).replace('-', '/'),
          sourceWhen: x.when || '', sourceSubject: x.subject || '',
          who: x.status === '待发送' ? '已排期' : '我方发送',
          text: x.status === '待发送'
            ? '将于 ' + x.when + ' 自动发出。' + (x.body ? '\n\n' + x.body : '') + attLine
            : ((x.body || fallback) + attLine),
          subject: x.subject, tagBg: '#E4EEF7', tagFg: '#1D48D8'
        });
      });
      out.sort((a, b) => (a.key < b.key ? 1 : (a.key > b.key ? -1 : 0)));
      const targetIndex = out.findIndex(x =>
        !!s.mailTargetWhen
        && x.sourceWhen === s.mailTargetWhen
        && (!s.mailTargetSubject || x.sourceSubject === s.mailTargetSubject)
      );
      out.forEach((x, xi) => {
        const inbound = x.who === '红人回复';
        const isOpen = targetIndex >= 0
          ? xi === targetIndex
          : ((s.mailOpenIdx === undefined || s.mailOpenIdx === null) ? xi === 0 : s.mailOpenIdx === xi);
        x.sender = inbound ? contactC.handle : (x.who === '已排期' ? '我方（已排期）' : '我方 · 陈曦');
        x.avatar = inbound ? contactC.initial : '我';
        x.avBg = inbound ? '#EAF0FF' : '#F5F8FE';
        x.avFg = inbound ? '#2457F5' : '#647187';
        x.unread = inbound && !out.some(o => o.who !== '红人回复' && o.key && x.key && o.key >= x.key);
        x.weight = inbound ? 600 : 500;
        x.expanded = isOpen;
        x.collapsed = !isOpen;
        x.rowBg = isOpen ? '#F8FAFE' : '#FFFFFF';
        x.contactRowBg = isOpen ? '#EEF3FF' : (inbound ? '#F8FAFE' : '#FFFFFF');
        x.contactRowShadow = isOpen ? 'inset 3px 0 0 #2457F5' : 'none';
        x.recipient = inbound ? 'partnerships@ryze.com' : contactC.handle.slice(1).replace(/\./g, '') + '@creator-mail.com';
        x.toggle = () => this.setState({ mailOpenIdx: xi, mailTargetWhen: null, mailTargetSubject: null });
        x.reply = x.canReply ? (() => this.setState({ mailTab: 'compose', replyTo: x.subject, contactSubject: '', contactBody: '', subjectEdit: false, bodyEdit: false })) : (() => {});
        x.forward = () => this.setState({ copilotOpen: true });
      });
      return out.length ? out : [{ date: '—', who: '暂无往来', text: '还没有邮件往来。下方可直接起草并发送。', subject: '', tagBg: '#F5F8FE', tagFg: '#8792A5' }];
    })() : [];

    const mailScore = (() => {
      const brandName = contactC ? (skuAll.find(p => p.sku === contactProd) || skuAll[0]).brand : '';
      const subjText = s.contactSubject || contactSubjectDefault;
      const bodyText = s.contactBody || (rejectMode ? dealMeta.body : (tplCur.body || dealMeta.body)) || contactDraft(s.contactDraftN || 0);
      const spamWords = /免费|保证|立刻|马上|100%|限时|赚|点击这里|FREE|GUARANTEE|!!/i;
      const clamp = (n) => Math.max(20, Math.min(98, Math.round(n)));
      const mk = (text, isBody) => {
        const len = text.length;
        const hasBrand = brandName && text.indexOf(brandName) >= 0;
        const hasProduct = text.indexOf(contactProdName) >= 0;
        const nicheHit = contactC ? (isBody ? (text.indexOf(contactC.niche.split(' ')[0]) >= 0 || /你自己的方式|你的内容|不摆场景|真实/.test(text)) : new RegExp(contactC.handle).test(text)) : false;
        const spam = spamWords.test(text) || /[!！]{2,}/.test(text) || (!isBody && len > 42);
        const dims = [
          {
            key: 'spam', label: '垃圾邮件风险',
            score: clamp(spam ? 48 : (isBody ? (len > 120 ? 88 : 80) : (len <= 34 ? 92 : 84))),
            note: spam ? (isBody ? '出现促销式措辞或过多感叹号，建议改写' : '标题过长或含促销词，易被判为推广') : '措辞自然，无促销触发词'
          },
          {
            key: 'brand', label: '品牌介绍',
            score: clamp(hasBrand ? (isBody ? 90 : 78) : 42),
            note: hasBrand ? '已出现品牌名 ' + brandName : '未提到品牌名，红人难判断来源'
          },
          {
            key: 'product', label: '产品介绍',
            score: clamp(hasProduct ? (isBody ? 92 : 88) : 40),
            note: hasProduct ? '已点明 ' + contactProdName : '未点明具体产品'
          },
          {
            key: 'fit', label: '契合红人喜好',
            score: clamp(nicheHit ? (isBody ? 88 : 82) : 55),
            note: nicheHit ? (isBody ? '强调由红人自己的方式表达，贴合其内容习惯' : '标题带上了红人账号，个性化足够') : '缺少针对该红人内容风格的表述'
          }
        ].map(d => ({ ...d, pct: d.score, color: this.scoreColor(d.score) }));
        const total = Math.round(dims.reduce((t, d) => t + d.score, 0) / dims.length);
        return { total, dims, color: this.scoreColor(total) };
      };
      return { subj: mk(subjText, false), body: mk(bodyText, true) };
    })();

    const contactAtt = s.contactAtt || (rejectMode ? [] : ['brief', 'sample']);
    const sampleAddrDefaults = {
      name: contactC ? contactC.handle.slice(1).replace(/\./g, ' ').replace(/\b\w/g, m => m.toUpperCase()) : '',
      line1: '', line2: '', city: '', state: '', zip: '', country: 'United States', phone: ''
    };
    const sampleAddrResolved = Object.keys(sampleAddrDefaults).reduce((acc, k) => {
      const v = (s.sampleAddr || {})[k];
      acc[k] = (v === undefined || v === null || v === '') ? sampleAddrDefaults[k] : v;
      return acc;
    }, {});
    const contactCtx = contactC ? {
      handle: contactC.handle, initial: contactC.initial,
      sub: contactC.platform + ' · ' + contactC.followers + ' 粉丝 · ' + contactC.niche + ' · ' + contactC.nation,
      mailNote: '由主页 bio 自动解析，可修改',
      links: crLinksOf(contactC),
      tz: contactC.market === 'US' ? 'America/Los_Angeles · PT' : (contactC.market === 'UK' ? 'Europe/London · BST' : 'Europe/Berlin · CEST'),
      facts: [
        { label: '近30天均播', value: contactC.avgViews }, { label: '近30天 ER', value: contactC.er30 },
        { label: '发布频率', value: freqOf(contactC.handle) }, { label: '报价记录', value: contactC.quote }, { label: 'FIT', value: String(crAiScore(contactC)) }
      ],
      prodOpen: !!s.contactProdOpen,
      prodBd: s.contactProdOpen ? '#2457F5' : '#E2E8F2',
      prodLabel: (skuAll.find(p => p.sku === contactProd) || skuAll[0]).name,
      products: briefProdSkus.map(sku => {
        const p = skuAll.find(x => x.sku === sku);
        if (!p) return null;
        const on = sku === contactProd;
        return {
          label: p.name, sub: p.sku + ' · ' + p.brand + ' · ' + p.category,
          bg: on ? '#EAF0FF' : 'transparent', fg: on ? '#2457F5' : '#1D2638',
          pick: () => this.setState({ contactProduct: sku, contactProdOpen: false, contactSubject: '', contactBody: '' })
        };
      }).filter(Boolean),
      attachments: [['brief', '标准 Brief'], ['sample', '寄样地址表'], ['deck', '品牌介绍'], ['contract', '合作协议草案']].map(([id, label]) => {
        const on = contactAtt.includes(id);
        return {
          label, mark: on ? '✓' : '+',
          bg: on ? '#E4EFE4' : '#FFFFFF', fg: on ? '#4E7156' : '#8792A5', bd: on ? '#CFE3D3' : '#E2E8F2',
          toggle: () => this.setState(st => ({ contactAtt: (st.contactAtt || ['brief', 'sample']).includes(id) ? (st.contactAtt || ['brief', 'sample']).filter(x => x !== id) : [...(st.contactAtt || ['brief', 'sample']), id] }))
        };
      })
    } : { handle: '', initial: '', sub: '', mailNote: '', tz: '', links: [], facts: [], products: [], attachments: [], prodOpen: false, prodBd: '#E2E8F2', prodLabel: '' };

    const TODAY_ISO = '2026-08-31';
    const smpRangeState = (() => {
      const m = s.smpRangeMode || 'month';
      const d = new Date(TODAY_ISO + 'T00:00:00');
      const iso = (x) => x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0');
      if (m === 'day') return { mode: m, label: '本日', start: TODAY_ISO, end: TODAY_ISO };
      if (m === 'week') {
        const wd = (d.getDay() + 6) % 7;
        const a = new Date(d); a.setDate(d.getDate() - wd);
        const b = new Date(a); b.setDate(a.getDate() + 6);
        return { mode: m, label: '本周', start: iso(a), end: iso(b) };
      }
      if (m === 'quarter') {
        const q = Math.floor(d.getMonth() / 3);
        return { mode: m, label: '本季度', start: iso(new Date(2026, q * 3, 1)), end: iso(new Date(2026, q * 3 + 3, 0)) };
      }
      if (m === 'year') return { mode: m, label: '本年度', start: '2026-01-01', end: '2026-12-31' };
      if (m === 'day-pick') return { mode: m, label: (s.smpPickDay || TODAY_ISO).slice(5).replace('-', '/'), start: s.smpPickDay || TODAY_ISO, end: s.smpPickDay || TODAY_ISO };
      return { mode: 'month', label: '本月', start: iso(new Date(2026, d.getMonth(), 1)), end: iso(new Date(2026, d.getMonth() + 1, 0)) };
    })();

    const expRange = (() => {
      const m = s.expRangeMode || 'quarter';
      const d = new Date(TODAY_ISO + 'T00:00:00');
      const iso = (x) => x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0');
      if (m === 'day') return { mode: m, label: '本日', start: TODAY_ISO, end: TODAY_ISO };
      if (m === 'week') {
        const wd = (d.getDay() + 6) % 7;
        const a = new Date(d); a.setDate(d.getDate() - wd);
        const b = new Date(a); b.setDate(a.getDate() + 6);
        return { mode: m, label: '本周', start: iso(a), end: iso(b) };
      }
      if (m === 'month') return { mode: m, label: '本月', start: iso(new Date(2026, d.getMonth(), 1)), end: iso(new Date(2026, d.getMonth() + 1, 0)) };
      if (m === 'year') return { mode: m, label: '本年度', start: '2026-01-01', end: '2026-12-31' };
      if (m === 'day-pick') { const p = s.expPickDay || TODAY_ISO; return { mode: m, label: p.slice(5).replace('-', '/'), start: p, end: p }; }
      const q = Math.floor(d.getMonth() / 3);
      return { mode: 'quarter', label: '本季度', start: iso(new Date(2026, q * 3, 1)), end: iso(new Date(2026, q * 3 + 3, 0)) };
    })();
    const expInvoices = (s.invoices || []).filter(i => i.date >= expRange.start && i.date <= expRange.end);
    const chanOfHandle = (h) => {
      const a = facts.assets.find(x => x.handle === h);
      if (a) return a.channel;
      const d = (typeof CB_META !== 'undefined' && CB_META[h]) ? CB_META[h] : null;
      return d ? 'TikTok' : 'TikTok';
    };

    const smpArr = (() => {
      const stageDefs = ['待揽收', '已揽收', '运输中', '已签收'];
      const statusOfStage = (n) => ['待揽收', '已揽收', '运输中', '已签收'][Math.max(0, Math.min(3, n))];
      const fromOrders = (s.shipOrders || []).map(o => ({
        handle: o.handle, product: o.product.replace(/ × \d+$/, ''), qty: o.qty || 1, date: o.date, tracking: o.tracking, carrier: o.carrier, sku: o.sku || '',
        stage: this._orderStage(o),
        addr: o.addr || {}
      }));
      const inRange = (mmdd) => {
        const p = String(mmdd || '').split('/');
        if (p.length < 2) return true;
        const iso = '2026-' + p[0].padStart(2, '0') + '-' + p[1].padStart(2, '0');
        return iso >= smpRangeState.start && iso <= smpRangeState.end;
      };
      return fromOrders.filter(o => inRange(o.date)).map((o, i) => {
        const key = o.handle + '|' + o.date;
        const stage = this._orderStage(o);
        const status = statusOfStage(stage);
        const a = o.addr || {};
        const addrLines = [a.name, [a.line1, a.line2].filter(Boolean).join(', '), [a.city, a.state, a.zip].filter(Boolean).join(' '), a.country, a.phone].filter(Boolean);
        const addrText = addrLines.length ? addrLines.join('\n') : '收件信息待补充';
        const addressOnlyLines = [[a.line1, a.line2].filter(Boolean).join(', '), [a.city, a.state, a.zip].filter(Boolean).join(' '), a.country, a.phone].filter(Boolean);
        const dparts = String(o.date || '').split('/');
        const created = dparts.length >= 2 ? new Date(2026, Number(dparts[0]) - 1, Number(dparts[1])) : null;
        const daysOut = created ? Math.round((new Date(2026, 7, 20) - created) / 86400000) : 0;
        const bucket = status === '已签收' ? '已签收' : (daysOut > 7 ? '异常' : '在途');
        return {
          idx: i + 1, handle: o.handle, product: o.product, qty: o.qty, status,
          avatar: creatorAvatarMap[o.handle] || '../avatars/mia.jpg',
          recipient: a.name || '收件人待补充',
          createdLabel: '创建 ' + o.date,
          location: a.city ? a.city + (a.state ? ', ' + a.state : '') : '地址待补充',
          bucket, daysOut,
          abnormal: bucket === '异常',
          abnormalNote: bucket === '异常' ? '已发出 ' + daysOut + ' 天仍未签收（常规 3–5 天）' : '',
          meta: o.handle + ' · 创建 ' + o.date + ' · ' + (a.city ? a.city + ', ' + (a.state || '') : '地址待补充'),
          tracking: o.tracking || ('TRK' + String(100000 + (o.handle.length * 7351 + o.qty * 17) % 899999)),
          tagBg: bucket === '异常' ? '#FBE3E3' : (status === '已签收' ? '#E4EFE4' : (status === '待揽收' ? '#FBEEDA' : '#E4EEF7')),
          tagFg: bucket === '异常' ? '#C4636D' : (status === '已签收' ? '#4E7156' : (status === '待揽收' ? '#A5762C' : '#1D48D8')),
          cardBd: bucket === '异常' ? '#F0C9C9' : '#DDE5F1',
          steps: stageDefs.map((label, si) => ({
            label,
            mark: si < stage ? '✓' : String(si + 1),
            color: si <= stage ? SAGE : '#EEF2F8',
            fg: si <= stage ? '#FFFFFF' : '#A2ABBA',
            labelFg: si <= stage ? '#4E7156' : '#A2ABBA',
            line: si < stage ? SAGE : '#E6EBF3',
            showLine: si < stageDefs.length - 1
          })),
          latest: bucket === '异常'
            ? o.date + ' 发出后已 ' + daysOut + ' 天未签收，超出常规物流时效，建议联系承运商或补寄。'
            : (status === '已签收' ? o.date + ' 已签收，可催内容初稿。' : (status === '待揽收' ? o.date + ' 已创建寄样单，等待仓库揽收。' : o.date + ' 包裹在途，预计 3–5 个工作日送达。')),
          address: addrText,
          addressOnly: addressOnlyLines.length ? addressOnlyLines.join('\n') : '收件地址待补充',
          advLabel: stage >= 3 ? '已完成' : '推进物流 →',
          advCursor: stage >= 3 ? 'default' : 'pointer',
          advance: () => {
            if (stage >= 3) return;
            this.setState(st => ({
              shipOrders: (st.shipOrders || []).map(x => this._shipKey(x) === key ? { ...x, stage: stage + 1 } : x)
            }));
          },
          nudgeShow: bucket === '已签收',
          nudgeLabel: (s.contactLog || []).some(m => m.kind === 'nudge-draft' && m.shipKey === key) ? '查看催稿邮件 →' : '催内容初稿 →',
          nudge: (e) => {
            if (e && e.stopPropagation) e.stopPropagation();
            const draft = this._nudgeMailDraft(o);
            const sku = o.sku || ((skuAll.find(p => p.name === o.product) || {}).sku) || '';
            const existing = (this.state.contactLog || []).find(m => m.kind === 'nudge-draft' && m.shipKey === key);
            this.setState({
              smTab: 'progress',
              smNudge: existing
                ? { key, sku, product: o.product, sent: true, handle: o.handle, to: existing.to || draft.to, subject: existing.subject || draft.subject, body: existing.body || draft.body }
                : { key, sku, product: o.product, sent: false, ...draft }
            });
          },
          reshipShow: bucket === '异常',
          reship: () => this.setState({
            smTab: 'new', smMode: 'single', smSaved: false, smOpen: null,
            smForm: {
              handle: o.handle, product: o.product, qty: String(o.qty || 1),
              name: (o.addr || {}).name || '',
              line1: (o.addr || {}).line1 || '', line2: (o.addr || {}).line2 || '',
              city: (o.addr || {}).city || '', state: (o.addr || {}).state || '',
              zip: (o.addr || {}).zip || '', phone: (o.addr || {}).phone || ''
            }
          })
        };
      });
    })();

    const smpQueryText = String(s.smpQuery || '').trim().toLowerCase();
    const smpShown = smpArr.filter(x => {
      const statusMatch = (s.smpFilter || '全部') === '全部' || x.bucket === (s.smpFilter || '全部');
      if (!statusMatch || !smpQueryText) return statusMatch;
      const haystack = [x.product, x.handle, x.recipient, x.tracking, x.location, x.address]
        .filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(smpQueryText);
    }).map((x, i) => ({ ...x, idx: i + 1 }));

    const lkPool = (() => {
      const seed = s.lkSeed || (crQuality[0] ? crQuality[0].handle : '@kaylascalp');
      const bump = /kayla|scalp/i.test(seed) ? 0 : -4;
      return this.LOOKALIKE_POOL.map(x => ({ ...x, sim: Math.max(70, x.sim + bump) })).sort((a, b) => b.sim - a.sim);
    })();

    const tagOfCreator = (h) => {
      if ((s.blackAdded || []).includes(h)) return '淘汰/黑名单';
      const t = (s.alTags || {})[h];
      if (t === '淘汰/拉黑' || t === '拉黑') return '淘汰/黑名单';
      if (t) return t;
      if ((s.qualityAdded || []).includes(h)) return '合格/优质红人';
      if ((s.coopList || []).includes(h)) return '合作中';
      return '待确认';
    };
    const tkMailAll = this.INBOX_REPLIES.map(r => {
      const d = creatorDefs.find(x => x.handle === r.handle) || {};
      return {
        ...r,
        replied: (s.repliedTo || []).includes(r.handle),
        tier: d.followers ? this.tierOfFollowers(d.followers) : '—',
        tag: tagOfCreator(r.handle)
      };
    });
    const tkMailList = (() => {
      const mf = s.tkMailFilter || {};
      return tkMailAll.filter(r => {
        if (mf.status === '待回复邮件' && r.replied) return false;
        if (mf.status === '已回复邮件' && !r.replied) return false;
        if (mf.level) {
          const lv = r.replied ? '已回复' : (r.hours >= 48 ? '超 48h' : (r.hours >= 24 ? '48h 内' : (r.hours >= 12 ? '24h 内' : '12h 内')));
          if (lv !== mf.level) return false;
        }
        if (mf.tier && r.tier !== mf.tier) return false;
        if (mf.tag && r.tag !== mf.tag) return false;
        return true;
      }).sort((a, b) => (a.replied === b.replied ? b.hours - a.hours : (a.replied ? 1 : -1)));
    })();
    const crTab = s.crTab || 'lib';
    const crTabs = [
      { id: 'lib', label: '红人库', note: creatorDefs.length + ' 位红人 · 多维筛选' },
      { id: 'coop', label: '合作红人 List', note: (s.coopList || []).length + ' 位已加入合作' },
      { id: 'quality', label: '合格/优质红人', note: crQuality.length + ' 位 · 历史素材 ≥ 60 · 审批加入不设门槛' },
      { id: 'black', label: '淘汰 / 黑名单', note: crBlacklist.filter(b => b.kind === '淘汰').length + ' 位淘汰 · ' + crBlacklist.filter(b => b.kind === '黑名单').length + ' 位黑名单' },
      { id: 'lookalike', label: '相似度扩量', note: '按合格/优质红人画像推荐候选' }
    ].map(t => {
      const on = t.id === crTab;
      return {
        label: t.label, note: t.note, pick: () => this.setState({ crTab: t.id, crOpen: null }),
        bg: on ? '#2457F5' : 'transparent', bd: on ? '#2457F5' : 'transparent',
        fg: on ? '#FFFFFF' : '#647187', noteFg: on ? '#FFFFFF' : '#8792A5'
      };
    });

    const crF = s.crFilter || {};
    const crUniq = (arr) => arr.filter((x, i) => x && arr.indexOf(x) === i);
    const crFilterDefs = [
      ['nation', '国籍', crUniq(creatorDefs.map(c => c.nation))],
      ['market', '市场', crUniq(creatorDefs.map(c => c.market))],
      ['tier', '粉丝量', crUniq(creatorDefs.map(c => c.tier))],
      ['gender', '性别', crUniq(creatorDefs.map(c => c.gender))],
      ['age', '年龄', crUniq(creatorDefs.map(c => c.age))],
      ['job', '职业', crUniq(creatorDefs.map(c => c.job))],
      ['platform', '渠道', crUniq(creatorDefs.map(c => c.platform))],
      ['views', '均播', ['≥ 50K', '10K–50K', '< 10K']],
      ['er', 'ER', ['≥ 10%', '5%–10%', '< 5%']]
    ];
    const crNum = (v) => parseFloat(String(v).replace(/[^0-9.]/g, '')) * (/K/i.test(String(v)) ? 1000 : 1);
    const crMatch = (c) => {
      if (crF.nation && c.nation !== crF.nation) return false;
      if (crF.market && c.market !== crF.market) return false;
      if (crF.tier && c.tier !== crF.tier) return false;
      if (crF.gender && c.gender !== crF.gender) return false;
      if (crF.age && c.age !== crF.age) return false;
      if (crF.job && c.job !== crF.job) return false;
      if (crF.platform && c.platform !== crF.platform) return false;
      if (crF.views) {
        const n = crNum(c.avgViews);
        if (crF.views === '≥ 50K' && n < 50000) return false;
        if (crF.views === '10K–50K' && (n < 10000 || n >= 50000)) return false;
        if (crF.views === '< 10K' && n >= 10000) return false;
      }
      if (crF.er) {
        const n = parseFloat(c.er30);
        if (crF.er === '≥ 10%' && n < 10) return false;
        if (crF.er === '5%–10%' && (n < 5 || n >= 10)) return false;
        if (crF.er === '< 5%' && n >= 5) return false;
      }
      return true;
    };
    const crFilters = crFilterDefs.map(([key, label, opts]) => {
      const cur = crF[key] || '';
      const isOpen = s.crOpen === key;
      return {
        label, current: cur || '全部', open: isOpen,
        bg: cur ? '#EAF0FF' : '#F8FAFE', bd: isOpen ? '#2457F5' : (cur ? '#F0C9B8' : '#E2E8F2'),
        fg: cur ? '#2457F5' : '#1D2638',
        toggle: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ crOpen: st.crOpen === key ? null : key })); },
        options: [{ value: '', label: '全部' }, ...opts.map(o => ({ value: o, label: o }))].map(o => {
          const on = cur === o.value;
          return {
            label: o.label, bg: on ? '#EAF0FF' : 'transparent', fg: on ? '#2457F5' : '#647187',
            pick: () => this.setState(st => ({ crFilter: { ...(st.crFilter || {}), [key]: o.value }, crOpen: null }))
          };
        })
      };
    });

    const creatorsRaw = creatorDefs.filter(crMatch).map(c => {
      const on = s.shortlist.includes(c.handle.slice(1));
      const statusMap = { '长期合作': ['#E4EFE4', '#4E7156'], '已合作': ['#E4EFE4', '#4E7156'], '沟通中': ['#FBEEDA', '#A5762C'], '待联系': ['#E4EEF7', '#1D48D8'], '暂停': ['#F5F8FE', '#647187'] };
      const [statusBg, statusFg] = statusMap[c.status] || ['#F5F8FE', '#647187'];
      const dimDefsCr = [
        ['brand', '品牌匹配', '与品牌调性、表达边界的一致度'],
        ['audience', '受众匹配', '粉丝画像与目标人群的重合度'],
        ['content', '内容匹配', '既有内容形式与所需内容的贴合度'],
        ['market', '市场匹配', '所在市场与投放站点的一致度'],
        ['goal', '目标匹配', '对本轮目标（种草 / 转化）的贡献力']
      ];
      const over = (s.crScores || {})[c.handle] || {};
      const dimVals = crDimVals(c);
      const aiScore = crAiScore(c);
      const scoreOpen = s.crScoreOpen === c.handle;
      const editing = s.crScoreEdit === c.handle;
      const edited = Object.keys(over).length > 0;
      const setDim = (k, v) => this.setState(st => ({
        crScores: { ...(st.crScores || {}), [c.handle]: { ...((st.crScores || {})[c.handle] || {}), [k]: Math.max(0, Math.min(100, v)) } }
      }));
      return {
        ...c, avatar: creatorAvatarMap[c.handle] || '../avatars/mia.jpg', color: this.scoreColor(aiScore), bd: on ? '#C8D4E8' : '#E2E8F2', statusBg, statusFg,
        ai: aiScore, z: scoreOpen || s.crAiOpen === c.handle ? 80 : 1,
        coopLabel: (s.coopList || []).includes(c.handle) ? '✓ 已联系' : '未联系',
        coopBg: (s.coopList || []).includes(c.handle) ? '#E4EFE4' : '#FFFFFF',
        coopFg: (s.coopList || []).includes(c.handle) ? '#4E7156' : '#2457F5',
        coopBd: (s.coopList || []).includes(c.handle) ? '#CFE3D3' : '#F0C9B8',
        coopCursor: (s.coopList || []).includes(c.handle) ? 'default' : 'pointer',
        coopTitle: (s.coopList || []).includes(c.handle) ? '已发出邮件并进入合作红人 List' : '发送开场邮件并加入合作红人 List',
        partnershipLabel: c.status === '已合作' || c.status === '长期合作' ? '✓ 已合作' : '未合作',
        partnershipBg: c.status === '已合作' || c.status === '长期合作' ? '#E4EFE4' : '#FFFFFF',
        partnershipFg: c.status === '已合作' || c.status === '长期合作' ? '#4E7156' : '#8792A5',
        partnershipBd: c.status === '已合作' || c.status === '长期合作' ? '#CFE3D3' : '#E2E8F2',
        partnershipTitle: c.status === '已合作' || c.status === '长期合作' ? '已有历史合作记录' : '暂无已完成的合作记录',
        toggleCoop: (e) => {
          if (e && e.stopPropagation) e.stopPropagation();
          if ((s.coopList || []).includes(c.handle)) return;
          this.setState({ page: 'contact', contactHandle: c.handle, contactSent: false, contactEmail: '', contactSubject: '', contactBody: '', contactProduct: null, contactProdOpen: false, subjectEdit: false, bodyEdit: false, mailThreadOpen: false, mailTab: 'compose', dealType: null, mailTpl: 'intro', replyTo: null, briefPick: null, briefPickOpen: false, sampleOpen: false, sampleProdOpen: false, sampleSku: null, sampleQty: 1, sampleAddr: null, sampleCreated: false, mailProds: [] });
        },
        boxCheck: (s.bkPicked || []).includes(c.handle) ? '✓' : '',
        boxBg: (s.bkPicked || []).includes(c.handle) ? '#2457F5' : 'transparent',
        boxBd: (s.bkPicked || []).includes(c.handle) ? '#2457F5' : '#C8D4E8',
        bulkToggle: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ bkPicked: (st.bkPicked || []).includes(c.handle) ? (st.bkPicked || []).filter(x => x !== c.handle) : [...(st.bkPicked || []), c.handle] })); },
        aiOpen: s.crAiOpen === c.handle,
        aiBg: s.crAiOpen === c.handle ? '#E8EEFF' : '#FFFFFF',
        aiBd: s.crAiOpen === c.handle ? '#B8CBFF' : '#D9E4FF',
        toggleAi: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ crAiOpen: st.crAiOpen === c.handle ? null : c.handle })); },
        aiToggleLabel: s.crAiOpen === c.handle ? '收起分析' : '展开完整分析',
        aiDot: aiScore >= 80 ? SAGE : (aiScore >= 60 ? AMBER : RUST),
        aiVerdict: aiScore >= 80 ? '优先合作' : (aiScore >= 60 ? '可以尝试' : '暂不推荐'),
        aiVerdictFg: aiScore >= 80 ? '#4E7156' : (aiScore >= 60 ? '#A5762C' : '#C4636D'),
        aiBrief: this.tierOfFollowers(c.followers) + ' · ' + c.niche + ' · 均播 ' + c.avgViews + ' · ER ' + c.er30 + ' · 报价 ' + c.quote,
        aiSummary: '合作状态：' + c.status + '。' + ((crHandles[c.handle] && crHandles[c.handle].summary) ||
          (c.handle + ' 是 ' + c.nation + ' 的' + c.job + '，主阵地 ' + c.platform + '，' + c.followers + '粉丝，近 30 天均播 ' + c.avgViews + '、ER ' + c.er30 + '。内容集中在' + c.niche + '，与本轮叙事的契合点在于场景可被真实拍摄。')),
        aiPoints: [
          { title: '优势', color: SAGE, body: (crHandles[c.handle] && crHandles[c.handle].pro) || '互动质量高于同层级均值，受众与目标人群重合度好。' },
          { title: '风险', color: c.risk || dimVals.market < 60 ? RUST : AMBER, body: (c.risk ? c.risk + '：' : '') + ((crHandles[c.handle] && crHandles[c.handle].con) || (dimVals.market < 60 ? '所在市场与当前投放站点不一致，需评估投放价值。' : '报价与产出比需在首条内容后复核。')) },
          { title: '建议动作', color: BLUE, body: (crHandles[c.handle] && crHandles[c.handle].act) || '先寄样测一条内容，达标后再谈固定费与长期合作。' }
        ],
        links: crLinksOf(c),
        scoreOpen, editing,
        scoreBg: scoreOpen ? '#F8FAFE' : '#FFFFFF', scoreBd: scoreOpen ? '#2457F5' : '#E2E8F2',
        scoreNote: edited ? '含人工修改 · 已覆盖 ' + Object.keys(over).length + ' 个维度' : '五个维度等权平均 · 数据源：红人主页、历史合作、平台导出',
        editLabel: editing ? '完成修改' : '修改维度分',
        toggleScore: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ crScoreOpen: st.crScoreOpen === c.handle ? null : c.handle })); },
        toggleEdit: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ crScoreEdit: st.crScoreEdit === c.handle ? null : c.handle })); },
        resetScore: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => { const m = { ...(st.crScores || {}) }; delete m[c.handle]; return { crScores: m }; }); },
        dims: dimDefsCr.map(([k, label, note]) => ({
          label, note, score: dimVals[k], pct: dimVals[k], raw: String(dimVals[k]),
          color: this.scoreColor(dimVals[k]), editing, notEditing: !editing,
          detailOpen: s.crDimOpen === c.handle + '|' + k,
          detailLabel: s.crDimOpen === c.handle + '|' + k ? '收起明细' : '展开明细',
          detailTitle: dimDetailOf(c, k).title,
          detailRows: dimDetailOf(c, k).rows,
          toggleDetail: (e) => { if (e && e.stopPropagation) e.stopPropagation(); const dk = c.handle + '|' + k; this.setState(st => ({ crDimOpen: st.crDimOpen === dk ? null : dk })); },
          set: (e) => { const n = parseInt(e.target.value, 10); if (!isNaN(n)) setDim(k, n); },
          inc: (e) => { if (e && e.stopPropagation) e.stopPropagation(); setDim(k, dimVals[k] + 5); },
          dec: (e) => { if (e && e.stopPropagation) e.stopPropagation(); setDim(k, dimVals[k] - 5); }
        })),
        chips: [
          { label: '国籍', value: c.nation }, { label: '市场', value: c.market },
          { label: '粉丝', value: c.followers }, { label: '层级', value: this.tierOfFollowers(c.followers) }, { label: '性别', value: c.gender },
          { label: '年龄', value: c.age }, { label: '职业', value: c.job },
          { label: '均播', value: c.avgViews }, { label: 'ER', value: c.er30 },
          { label: '发布频率', value: freqOf(c.handle) }, { label: '报价', value: c.quote }
        ],
        stats: [{ label: '粉丝数', value: c.followers }, { label: '互动率', value: c.er }, { label: '报价', value: c.quote }],
        btnLabel: on ? '✓ shortlist' : '加入 shortlist',
        btnBg: on ? '#2457F5' : '#FFFFFF', btnFg: on ? '#FFFFFF' : '#647187', btnBd: on ? '#2457F5' : '#E2E8F2',
        open: this.openCreator(c.handle),
        toggle: (e) => {
          if (e && e.stopPropagation) e.stopPropagation();
          this.setState(st => ({ shortlist: st.shortlist.includes(c.handle.slice(1)) ? st.shortlist.filter(x => x !== c.handle.slice(1)) : [...st.shortlist, c.handle.slice(1)] }));
        }
      };
    });
    const creators = creatorsRaw.slice().sort((a, b) => b.ai - a.ai);

    // ── Creator Profile ──
    const profileExtras = {
      '@mia.selfcare': {
        bio: '夜间自我照护系列作者，内容以低饱和暖光、轻音乐、第一人称叙述为主。粉丝把她的视频当睡前 ASMR 看。',
        audience: [['女性', '87%'], ['25–34 岁', '61%'], ['美国', '72%'], ['兴趣 · 护肤护发', '64%']],
        style: ['低饱和暖光', '第一人称旁白', '轻音乐', '无硬广口播'],
        history: [
          { c: 'Ryze · Q2 北美种草', d: '2026-05', fee: '$1,200 + 12%', res: 'ROAS 4.1x · 播放 412K', good: true },
          { c: 'Lumo · 春季香氛', d: '2026-03', fee: '$1,000 + 10%', res: 'ROAS 2.6x · 播放 288K', good: true },
          { c: 'Verre · 玻璃杯', d: '2025-11', fee: '寄样', res: '播放 94K · 转化偏弱', good: false }
        ],
        notes: '沟通节奏快，通常 24h 内回复。不接受逐字脚本，但会主动交代必须讲到的点。生日 3/14，去年寄过手写卡。',
        recProducts: ['Ryze 头皮按摩仪', 'Lumo 便携香氛机'],
        scores: [['Relationship', 94], ['Content Quality', 91], ['交付稳定性', 88]]
      },
      '@kaylascalp': {
        bio: '头皮护理垂类 KOC，两万粉但极垂。惯用「头皮特写 + 口头解释」的双镜头结构，评论区常有人主动问链接。',
        audience: [['女性', '79%'], ['18–29 岁', '57%'], ['美国', '81%'], ['兴趣 · 头皮护理', '72%']],
        style: ['双镜头结构', '专业口吻', '头皮特写', '无滤镜'],
        history: [
          { c: 'Ryze · Q2 北美种草', d: '2026-05', fee: '寄样 + 12%', res: '完播 58% · 转化 141', good: true },
          { c: 'Ryze · Q1 试水', d: '2026-02', fee: '寄样', res: '播放 66K · 评论问价 37', good: true }
        ],
        notes: '不接受固定费，只接受寄样 + 佣金，理由是「不想被算成广告」。回复慢但交付准时。',
        recProducts: ['Ryze 头皮按摩仪'],
        scores: [['Relationship', 86], ['Content Quality', 90], ['交付稳定性', 92]]
      },
      '@hairbyandre': {
        bio: '多伦多执业发型师，内容偏专业讲解。能安全地解释头皮清洁逻辑，不触碰功效 claim。',
        audience: [['女性', '66%'], ['30–44 岁', '54%'], ['加拿大', '48%'], ['兴趣 · 美发', '69%']],
        style: ['沙龙实景', '专业讲解', '克制剪辑'],
        history: [{ c: 'Ryze · Q2 北美种草', d: '2026-06', fee: '$900 买断', res: 'ROAS 2.7x · 静帧组可复用', good: true }],
        notes: '走邮件沟通，需要提前两周排期。二次授权已买断，素材可直接投放。',
        recProducts: ['Ryze 头皮按摩仪'],
        scores: [['Relationship', 78], ['Content Quality', 88], ['交付稳定性', 84]]
      },
      '@dailywithlin': {
        bio: '生活方式创作者，内容以亚裔家庭日常为主，食品占比偏高。受众与我们重合，但场景需要引导。',
        audience: [['女性', '73%'], ['25–34 岁', '52%'], ['美国', '69%'], ['兴趣 · 家庭生活', '58%']],
        style: ['家庭场景', '轻叙事', '偏食品内容'],
        history: [{ c: 'Ryze · Q2 北美种草', d: '2026-05', fee: '$650', res: 'ROAS 1.4x · 场景偏离', good: false }],
        notes: 'Q2 内容把产品放在厨房台面，与浴室场景不符。下一轮需要一条定制 Brief 明确场景。',
        recProducts: ['Lumo 便携香氛机'],
        scores: [['Relationship', 64], ['Content Quality', 71], ['交付稳定性', 80]]
      },
      '@sofia.homelab': {
        bio: '家居好物账号，流量稳定但转化偏弱。适合放在铺量位置，不适合做内容标杆。',
        audience: [['女性', '64%'], ['30–44 岁', '49%'], ['美国', '61%'], ['兴趣 · 家居', '66%']],
        style: ['平铺构图', '好物清单', '产品同框'],
        history: [{ c: 'Ryze · Q2 北美种草', d: '2026-06', fee: '$850', res: 'ROAS 0.8x · 低于均值', good: false }],
        notes: '报价高于同层级均值约 30%，Q2 表现不支撑溢价。下一轮建议压到 $650 或改为纯佣金。',
        recProducts: ['Lumo 便携香氛机', 'Verre 双层玻璃杯'],
        scores: [['Relationship', 58], ['Content Quality', 66], ['交付稳定性', 74]]
      },
      '@thegroomguide': {
        bio: '英国男士理容测评频道，长视频为主。受众性别与市场都与本轮不匹配。',
        audience: [['男性', '88%'], ['25–44 岁', '63%'], ['英国', '57%'], ['兴趣 · 男士理容', '74%']],
        style: ['长视频测评', '参数导向', '棚拍'],
        history: [
          { c: 'Ryze · Q2 北美种草', d: '2026-06', fee: '$2,400', res: 'ROAS 0.3x · 转化 11 单', good: false },
          { c: 'Verre · 玻璃杯', d: '2025-10', fee: '$1,800', res: '延期 9 天 · 播放 121K', good: false }
        ],
        notes: '两次合作均延期交付，且内容偏参数讲解，与我们的情绪叙事方向冲突。已标记暂停。',
        recProducts: ['暂无匹配产品'],
        scores: [['Relationship', 42], ['Content Quality', 55], ['交付稳定性', 38]]
      }
    };
    const cur = creatorDefs.find(c => c.handle === s.creatorHandle) || creatorDefs[0];
    const ex = profileExtras[cur.handle] || {
      bio: cur.niche + ' 方向的创作者，主阵地在 ' + cur.platform + '。资料由 CSV 导入，尚未人工补全。',
      audience: [['女性', '68%'], ['25–34 岁', '48%'], [cur.country, '59%'], ['兴趣 · 生活方式', '41%']],
      style: ['风格待补充', '需人工确认'],
      history: [],
      notes: '暂无沟通记录。建议首次接触用寄样 + 佣金试水。',
      recProducts: ['Ryze 头皮按摩仪'],
      scores: [['Relationship', Math.max(20, cur.fit - 30)], ['Content Quality', cur.fit - 6], ['交付稳定性', cur.fit - 12]]
    };
    const inList = s.shortlist.includes(cur.handle.slice(1));
    const cp = {
      ...cur, color: this.scoreColor(cur.fit), bio: ex.bio, notes: ex.notes,
      audience: ex.audience.map(([label, value]) => ({ label, value })),
      style: ex.style,
      history: ex.history,
      hasHistory: ex.history.length > 0,
      noHistory: ex.history.length === 0,
      recProducts: ex.recProducts,
      scores: ex.scores.map(([label, v]) => ({ label, value: v, pct: v, color: this.scoreColor(v) })),
      stats: [{ label: '粉丝数', value: cur.followers }, { label: '互动率', value: cur.er }, { label: '报价', value: cur.quote }, { label: 'CRM 状态', value: cur.status }],
      btnLabel: inList ? '✓ 已在 shortlist' : '加入 Q3 shortlist',
      btnBg: inList ? '#E4EFE4' : '#2457F5', btnFg: inList ? '#4E7156' : '#FFFFFF', btnBd: inList ? '#CFE3D3' : '#2457F5',
      toggle: () => this.setState(st => ({ shortlist: inList ? st.shortlist.filter(x => x !== cur.handle.slice(1)) : [...st.shortlist, cur.handle.slice(1)] })),
      riskLine: cur.risk || '暂无风险标签'
    };

    // ── Campaign 时间进度 ──
    const timelineArr = (() => {
      const D = (m, d) => new Date(2026, m - 1, d);
      const fmt = (dt) => (dt.getMonth() + 1) + '/' + String(dt.getDate()).padStart(2, '0');
      const addD = (dt, n) => new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + n);
      const today = D(8, 20);
      const defs = [
        {
          key: 'ryz-q3', name: 'Ryze · Q3 北美种草', product: 'Ryze 头皮按摩仪', sku: 'RYZ-SC-01', owner: '陈曦', scheduled: true,
          note: '寄样阶段比计划晚 3 天，内容产出窗口被压缩；建议顺延 1 周或增加 4 位 KOC 并行。',
          phases: [
            ['策略与 Brief', D(8, 1), D(8, 7), 'done'],
            ['红人招募', D(8, 5), D(8, 18), 'done'],
            ['寄样与物流', D(8, 15), D(8, 26), 'late'],
            ['内容产出', D(8, 24), D(9, 16), 'auto'],
            ['素材投放与复盘', D(9, 12), D(9, 30), 'auto']
          ]
        },
        {
          key: 'aura-q3', name: 'Aura · 推广 Campaign', product: 'Aura 落地氛围灯', sku: 'AURA-LP-01', owner: '苏敏', scheduled: true,
          note: '示例排期已建立：先用家居 Micro 验证「开灯前后」转场，再集中回收可投放素材。',
          phases: [
            ['策略与 Brief', D(8, 10), D(8, 16), 'done'],
            ['红人筛选与邀约', D(8, 15), D(8, 26), 'auto'],
            ['寄样与物流', D(8, 24), D(9, 5), 'auto'],
            ['内容产出', D(9, 1), D(9, 25), 'auto'],
            ['素材投放与复盘', D(9, 20), D(10, 10), 'auto']
          ]
        },
        {
          key: 'lum-q4', name: 'Lumo · 秋季家居氛围', product: 'Lumo 便携香氛机', sku: 'LUM-AR-02', owner: '林浩', scheduled: true,
          note: '整体按计划推进，内容产出略提前，可考虑把复盘提前一周。',
          phases: [
            ['策略与 Brief', D(8, 15), D(8, 24), 'done'],
            ['红人招募', D(8, 22), D(9, 6), 'auto'],
            ['寄样与物流', D(9, 2), D(9, 14), 'auto'],
            ['内容产出', D(9, 12), D(10, 4), 'auto'],
            ['素材投放与复盘', D(10, 1), D(10, 15), 'auto']
          ]
        },
        {
          key: 'nuv-q4', name: 'Nuvia · 合规待确认', product: 'Nuvia 口服胶囊', sku: 'NUV-SP-07', owner: '林浩', scheduled: false,
          note: '合规证据未齐，策略仅完成 3/15 章，暂不建议排期；补齐第三方检测后再启动。',
          phases: [
            ['策略与 Brief', D(9, 1), D(9, 10), 'auto'],
            ['合规审核', D(9, 8), D(9, 22), 'block'],
            ['红人招募', D(9, 20), D(10, 4), 'auto'],
            ['内容产出', D(10, 2), D(10, 24), 'auto'],
            ['素材投放与复盘', D(10, 20), D(11, 4), 'auto']
          ]
        },
        {
          key: 'ryz-amb', name: 'Ryze · Ambassador 招募', product: 'Ryze 头皮按摩仪', sku: 'RYZ-SC-01', owner: '陈曦', scheduled: true, evergreen: true,
          note: '常设项目，按季度复核；当前 4 位在谈、2 位待报价确认。',
          phases: [
            ['候选筛选', D(8, 1), D(8, 20), 'done'],
            ['条件谈判', D(8, 12), D(9, 5), 'auto'],
            ['签约与首轮内容', D(9, 1), D(9, 26), 'auto'],
            ['季度复核', D(9, 20), D(9, 30), 'auto']
          ]
        },
        {
          key: 'ryz-q2', name: 'Ryze · Q2 北美种草', product: 'Ryze 头皮按摩仪', sku: 'RYZ-SC-01', owner: '陈曦', scheduled: true, closed: true,
          note: '已于 6/15 结项并完成复盘，结论已写入 Q3 策略。',
          phases: [
            ['策略与 Brief', D(4, 1), D(4, 10), 'done'],
            ['红人招募', D(4, 8), D(4, 24), 'done'],
            ['寄样与物流', D(4, 20), D(5, 6), 'done'],
            ['内容产出', D(5, 4), D(6, 2), 'done'],
            ['素材投放与复盘', D(5, 28), D(6, 15), 'done']
          ]
        }
      ];
      (s.newCampaigns || []).slice().reverse().forEach((campaign, index) => {
        const phases = (campaign.timelinePhases || []).map(phase => [
          phase.label,
          new Date(phase.a + 'T00:00:00'),
          new Date(phase.b + 'T00:00:00'),
          'auto'
        ]).filter(phase => !isNaN(phase[1].getTime()) && !isNaN(phase[2].getTime()));
        if (!phases.length) return;
        defs.unshift({
          key: campaign.timelineKey || ('new-' + campaign.sku.toLowerCase() + '-' + index),
          name: campaign.name + ' · ' + campaign.goal,
          product: campaign.name,
          sku: campaign.sku,
          owner: campaign.owner,
          scheduled: true,
          note: '创建 Campaign 时设置的阶段排期，可继续整体移动或逐阶段调整。',
          phases
        });
      });
      const tagMap = {
        '已完成': ['#E4EFE4', '#4E7156', SAGE],
        '进行中': ['#E4EEF7', '#1D48D8', BLUE],
        '落后': ['#FBEEDA', '#A5762C', AMBER],
        '阻塞': ['#FBE3E3', '#C4636D', RUST],
        '未开始': ['#F5F8FE', '#8792A5', '#B7C0CF']
      };
      const parse = (v) => { const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(String(v).trim()) || /^(\d{1,2})\/(\d{1,2})$/.exec(String(v).trim()); if (!m) return null; return m.length === 4 ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date(2026, +m[1] - 1, +m[2]); };
      const iso = (dt) => dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0');
      return defs.map((d, di) => {
        const shift = (s.cmShift || {})[d.key] || 0;
        const days = shift * 7;
        const ov = (s.cmDates || {})[d.key] || {};
        const shifted = d.phases.map(([label, a, b, kind], pi) => {
          const o = ov[pi] || {};
          const pa = (o.a && parse(o.a)) || addD(a, days);
          const pb = (o.b && parse(o.b)) || addD(b, days);
          return { label, a: pa, b: pb < pa ? pa : pb, kind, pi };
        });
        const min = shifted.reduce((m, p) => p.a < m ? p.a : m, shifted[0].a);
        const max = shifted.reduce((m, p) => p.b > m ? p.b : m, shifted[0].b);
        const span = Math.max(1, (max - min) / 86400000);
        const statusOf = (p) => {
          if (p.a > today) return p.kind === 'block' ? '阻塞' : '未开始';
          if (p.b < today) return p.kind === 'block' ? '阻塞' : '已完成';
          if (p.kind === 'block') return '阻塞';
          if (p.kind === 'late') return '落后';
          return '进行中';
        };
        const statuses = shifted.map(statusOf);
        const late = statuses.some(x => x === '落后' || x === '阻塞');
        const editing = s.cmTimeEdit === d.key;
        return {
          key: d.key, _min: min, _max: max, _span: span, _shift: shift, _late: late, _sched: d.scheduled, _evergreen: !!d.evergreen, _closed: !!d.closed,
          idx: di + 1, name: (d.product || d.name), sku: d.sku || '', campaignName: d.name,
          open: this.openCampaignSku(d.sku, 'timeline', d.name),
          owner: d.owner + ' 负责', late,
          idLine: (d.sku ? d.sku + ' · ' : '') + d.name,
          note: late ? d.note : '当前排期下所有阶段均未出现落后或阻塞。',
          editing, editLabel: editing ? '完成编辑' : '编辑时间',
          editBg: editing ? '#EAF0FF' : '#FFFFFF', editBd: editing ? '#2457F5' : '#E2E8F2',
          toggleEdit: () => this.setState(st => ({ cmTimeEdit: st.cmTimeEdit === d.key ? null : d.key })),
          startVal: ((s.cmWin || {})[d.key] || {}).a || iso(min),
          endVal: ((s.cmWin || {})[d.key] || {}).b || iso(max),
          setStart: (e) => { const v = e.target.value; this.setState(st => ({ cmWin: { ...(st.cmWin || {}), [d.key]: { ...((st.cmWin || {})[d.key] || {}), a: v } } })); },
          setEnd: (e) => { const v = e.target.value; this.setState(st => ({ cmWin: { ...(st.cmWin || {}), [d.key]: { ...((st.cmWin || {})[d.key] || {}), b: v } } })); },
          applyWindow: () => {
            const w = (s.cmWin || {})[d.key] || {};
            const na = parse(w.a || iso(min)), nb = parse(w.b || iso(max));
            if (!na || !nb || nb <= na) return;
            const oldSpan = Math.max(1, (max - min) / 86400000);
            const newSpan = (nb - na) / 86400000;
            const nd = {};
            shifted.forEach(p => {
              const s0 = ((p.a - min) / 86400000) / oldSpan;
              const s1 = ((p.b - min) / 86400000) / oldSpan;
              nd[p.pi] = { a: iso(addD(na, Math.round(s0 * newSpan))), b: iso(addD(na, Math.round(s1 * newSpan))) };
            });
            this.setState(st => ({ cmDates: { ...(st.cmDates || {}), [d.key]: nd }, cmShift: { ...(st.cmShift || {}), [d.key]: 0 } }));
          },
          window: (d.scheduled || shift !== 0 ? fmt(min) + ' – ' + fmt(max) : '未排期')
            + (shift > 0 ? ' · 已整体后移 ' + shift + ' 周' : (shift < 0 ? ' · 已整体前移 ' + (-shift) + ' 周' : '')),
          stateText: late ? '需顺延' : (shift > 0 ? '已顺延 ' + shift + ' 周' : (shift < 0 ? '已前移 ' + (-shift) + ' 周' : '按计划')),
          stateBg: late ? '#FBEEDA' : (shift !== 0 ? '#E4EEF7' : '#E4EFE4'),
          stateFg: late ? '#A5762C' : (shift !== 0 ? '#1D48D8' : '#4E7156'),
          shiftText: shift === 0 ? '未调整' : (shift > 0 ? '+' + shift + ' 周' : shift + ' 周'),
          push: () => this.setState(st => ({ cmShift: { ...(st.cmShift || {}), [d.key]: Math.min(8, ((st.cmShift || {})[d.key] || 0) + 1) } })),
          pull: () => this.setState(st => ({ cmShift: { ...(st.cmShift || {}), [d.key]: Math.max(-8, ((st.cmShift || {})[d.key] || 0) - 1) } })),
          reset: () => this.setState(st => {
            const m = { ...(st.cmShift || {}) }; delete m[d.key];
            const dd = { ...(st.cmDates || {}) }; delete dd[d.key];
            const ww = { ...(st.cmWin || {}) }; delete ww[d.key];
            return { cmShift: m, cmDates: dd, cmWin: ww };
          }),
          phases: shifted.map((p, ix) => {
            const st2 = statuses[ix];
            const t = tagMap[st2] || tagMap['未开始'];
            return {
              label: p.label,
              left: Math.round(((p.a - min) / 86400000) / span * 100),
              width: Math.max(4, Math.round(((p.b - p.a) / 86400000) / span * 100)),
              range: fmt(p.a) + ' – ' + fmt(p.b),
              status: st2, tagBg: t[0], tagFg: t[1], color: t[2],
              editing: editing || s.cmPhaseEdit === d.key + '|' + p.pi,
              reading: !(editing || s.cmPhaseEdit === d.key + '|' + p.pi),
              editLabel: (editing || s.cmPhaseEdit === d.key + '|' + p.pi) ? '完成' : '编辑时间',
              toggleEdit: (e) => { if (e && e.stopPropagation) e.stopPropagation(); const k = d.key + '|' + p.pi; this.setState(st => ({ cmPhaseEdit: st.cmPhaseEdit === k ? null : k })); },
              startVal: iso(p.a), endVal: iso(p.b),
              setStart: (e) => { const v = e.target.value; this.setState(st => ({ cmDates: { ...(st.cmDates || {}), [d.key]: { ...((st.cmDates || {})[d.key] || {}), [p.pi]: { ...(((st.cmDates || {})[d.key] || {})[p.pi] || { b: iso(p.b) }), a: v } } } })); },
              setEnd: (e) => { const v = e.target.value; this.setState(st => ({ cmDates: { ...(st.cmDates || {}), [d.key]: { ...((st.cmDates || {})[d.key] || {}), [p.pi]: { ...(((st.cmDates || {})[d.key] || {})[p.pi] || { a: iso(p.a) }), b: v } } } })); }
            };
          })
        };
      });
    })();

    const ncTimelinePreview = (() => {
      const parseIso = (value) => {
        const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''));
        return match ? new Date(+match[1], +match[2] - 1, +match[3]) : null;
      };
      const iso = (date) => date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
      const short = (date) => (date.getMonth() + 1) + '/' + String(date.getDate()).padStart(2, '0');
      const addDays = (date, days) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
      const start = parseIso(s.ncStart), end = parseIso(s.ncEnd);
      if (!start || !end || end <= start) return { ready: false, hint: '填写有效的开始与结束时间后，将自动生成阶段排期。', phases: [], serialized: [] };
      const labels = ['策略与 Brief', '红人筛选与邀约', '寄样与物流', '内容产出', '素材投放与复盘'];
      const ratios = [[0, .12], [.08, .30], [.24, .48], [.40, .78], [.70, 1]];
      const totalDays = Math.max(1, Math.round((end - start) / 86400000));
      const shift = s.ncTimelineShift || 0;
      const overrides = s.ncTimelineDates || {};
      const phases = labels.map((label, index) => {
        const baseA = addDays(start, Math.round(totalDays * ratios[index][0]) + shift * 7);
        const baseB = addDays(start, Math.round(totalDays * ratios[index][1]) + shift * 7);
        const custom = overrides[index] || {};
        const a = parseIso(custom.a) || baseA;
        const rawB = parseIso(custom.b) || baseB;
        const b = rawB < a ? a : rawB;
        return { label, index, a, b };
      });
      const min = phases.reduce((value, phase) => phase.a < value ? phase.a : value, phases[0].a);
      const max = phases.reduce((value, phase) => phase.b > value ? phase.b : value, phases[0].b);
      const span = Math.max(1, Math.round((max - min) / 86400000));
      const allEditing = !!s.ncTimelineEdit;
      return {
        ready: true,
        range: short(min) + ' – ' + short(max),
        startIso: iso(min), endIso: iso(max),
        shiftText: shift === 0 ? '未调整' : (shift > 0 ? '+' + shift + ' 周' : shift + ' 周'),
        stateText: shift === 0 && !Object.keys(overrides).length ? '按计划' : '已调整',
        stateBg: shift === 0 && !Object.keys(overrides).length ? '#E4EFE4' : '#E4EEF7',
        stateFg: shift === 0 && !Object.keys(overrides).length ? '#4E7156' : '#1D48D8',
        editLabel: allEditing ? '完成编辑' : '编辑时间',
        toggleEdit: () => this.setState(st => ({ ncTimelineEdit: !st.ncTimelineEdit })),
        pull: () => this.setState(st => ({ ncTimelineShift: Math.max(-8, (st.ncTimelineShift || 0) - 1) })),
        push: () => this.setState(st => ({ ncTimelineShift: Math.min(8, (st.ncTimelineShift || 0) + 1) })),
        reset: () => this.setState({ ncTimelineShift: 0, ncTimelineDates: {}, ncTimelineEdit: false, ncTimelinePhaseEdit: null }),
        serialized: phases.map(phase => ({ label: phase.label, a: iso(phase.a), b: iso(phase.b) })),
        phases: phases.map(phase => {
          const editing = allEditing || s.ncTimelinePhaseEdit === phase.index;
          return {
            label: phase.label,
            left: Math.round(((phase.a - min) / 86400000) / span * 100),
            width: Math.max(4, Math.round(((phase.b - phase.a) / 86400000) / span * 100)),
            range: short(phase.a) + ' – ' + short(phase.b),
            startVal: iso(phase.a), endVal: iso(phase.b), editing, reading: !editing,
            editLabel: editing ? '完成' : '编辑时间',
            toggleEdit: () => this.setState(st => ({ ncTimelinePhaseEdit: st.ncTimelinePhaseEdit === phase.index ? null : phase.index })),
            setStart: (e) => { const value = e.target.value; this.setState(st => ({ ncTimelineDates: { ...(st.ncTimelineDates || {}), [phase.index]: { ...((st.ncTimelineDates || {})[phase.index] || { b: iso(phase.b) }), a: value } } })); },
            setEnd: (e) => { const value = e.target.value; this.setState(st => ({ ncTimelineDates: { ...(st.ncTimelineDates || {}), [phase.index]: { ...((st.ncTimelineDates || {})[phase.index] || { a: iso(phase.a) }), b: value } } })); }
          };
        })
      };
    })();

    // 时间目标的唯一来源：时间进度调整里的实际排期
    const cmWindowOf = (() => {
      const primary = { 'RYZ-SC-01': 'ryz-q3', 'AURA-LP-01': 'aura-q3', 'LUM-AR-02': 'lum-q4', 'NUV-SP-07': 'nuv-q4' };
      const today2 = new Date(2026, 7, 20);
      const fmt2 = (dt) => (dt.getMonth() + 1) + '/' + String(dt.getDate()).padStart(2, '0');
      const map = {};
      timelineArr.forEach(t => {
        const total = Math.max(1, Math.round((t._max - t._min) / 86400000) + 1);
        const elapsed = Math.max(0, Math.min(total, Math.round((today2 - t._min) / 86400000) + 1));
        const rec = {
          key: t.key, name: t.campaignName, sku: t.sku || '',
          rangeText: fmt2(t._min) + ' – ' + fmt2(t._max),
          total, elapsed, pct: Math.round(elapsed / total * 100),
          late: t._late, shift: t._shift, scheduled: t._sched, evergreen: !!t._evergreen, closed: !!t._closed,
          shiftText: t._shift > 0 ? '已顺延 ' + t._shift + ' 周' : (t._shift < 0 ? '已前移 ' + (-t._shift) + ' 周' : '')
        };
        map[t.campaignName] = rec;
        if (rec.sku && primary[rec.sku] === t.key) map[rec.sku] = rec;
      });
      return (k) => map[k] || null;
    })();

    // ── 推广进度看板 ──
    const pipelineArr = (() => {
      const skus = [];
      (s.promoted || []).forEach(x => { if (skus.indexOf(x) < 0) skus.push(x); });
      (s.library || []).forEach(x => { if (skus.indexOf(x.sku) < 0) skus.push(x.sku); });
      const primaryCampaignSku = 'RYZ-SC-01';
      const primaryCampaignIndex = skus.indexOf(primaryCampaignSku);
      if (primaryCampaignIndex > 0) {
        skus.splice(primaryCampaignIndex, 1);
        skus.unshift(primaryCampaignSku);
      }
      const seedAssets = { 'RYZ-SC-01': [31, 90], 'LUM-AR-02': [12, 40], 'NUV-SP-07': [0, 24] };
      return skus.map((sku, i) => {
	          const p = skuAll.find(x => x.sku === sku);
	          if (!p) return null;
	          const rec = (s.library || []).find(x => x.sku === sku);
        const stratDone = !!rec && rec.confirmed >= rec.sections;
        const briefRec = bvLive.filter(v => v.sku === sku);
        const briefDraft = (s.briefFromStrategy || []).some(x => x.sku === sku);
        const briefDone = briefRec.some(v => v.status === '已通过');
        const deliveredPre = crQuality.filter(q => q.assets.some(a => a.sku === sku)).length;
        const logForSku = (s.contactLog || []).filter(x => x.sku === sku);
        const mailSent = logForSku.filter(x => x.status === '已发送').length;
        const mailPend = logForSku.filter(x => x.status === '待发送').length;
        const contacted = logForSku.map(x => x.handle);
        const coopCount = (s.coopList || []).filter(hh => contacted.indexOf(hh) >= 0).length;
        const deliveredCount = deliveredPre;
        const skuAssets = facts.assets.filter(a => a.sku === sku);
        const skuPending = facts.pending.filter(x => (skuAll.find(p => p.name === x.product) || {}).sku === sku);
        const got = skuAssets.length;
        const target = got + skuPending.length;
        const assetPct = target ? Math.round(got / target * 100) : 0;
        const skuOverdue = skuPending.filter(x => x.overdue > 0);
        const wSku = cmWindowOf(sku);
        const wUnsched = (wSku && !wSku.scheduled) || (!wSku && !stratDone && !briefRec.length);
        const wLateReal = wSku && wSku.scheduled && !wSku.evergreen && !wSku.closed && wSku.late;
        const timeRisk = wUnsched ? '未排期' : (wLateReal ? '排期落后' + (wSku.shiftText ? ' · ' + wSku.shiftText : '') : '');
        const timeNote = wUnsched
          ? '策略与合规未就绪，暂不排期'
          : (wSku ? (wSku.rangeText + (wSku.shiftText ? ' · ' + wSku.shiftText : '')) : '');
        const timeVal = wUnsched ? '未排期'
          : (wLateReal ? '排期落后'
          : (wSku ? '第 ' + Math.max(1, Math.ceil(wSku.elapsed / 7)) + ' / ' + Math.ceil(wSku.total / 7) + ' 周' : '正常'));
        const skuViews = skuAssets.reduce((t2, a) => t2 + this.toNumU(a.views), 0);
        const skuTargetViews = { 'RYZ-SC-01': 900000, 'LUM-AR-02': 180000 }[sku] || 200000;
        const goalPct = got ? Math.min(100, Math.round(skuViews / skuTargetViews * 100)) : 0;
        const mk = (label, ok, value, note, tab, bad) => ({
          label, value, note, bad: !!bad,
          mark: ok === true ? '✓' : (bad ? '!' : (ok === null ? '~' : '·')),
          dotBg: ok === true ? '#E4EFE4' : (bad ? '#FBEEDA' : (ok === null ? '#E4EEF7' : '#F5F8FE')),
          dotFg: ok === true ? '#4E7156' : (bad ? '#A5762C' : (ok === null ? '#1D48D8' : '#A2ABBA')),
          valueColor: ok === true ? '#4E7156' : (bad ? '#A5762C' : (ok === null ? '#1D48D8' : '#647187')),
          cursor: 'pointer',
          go: this.openCampaignSku(sku, tab)
        });
        const steps = [
          mk('策略', stratDone ? true : (rec ? null : false), stratDone ? '已完成' : (rec ? '进行中' : '未开始'), rec ? rec.confirmed + '/' + rec.sections + ' 章' : '待生成', 'strategy'),
          mk('Brief', briefDone ? true : ((briefRec.length || briefDraft) ? null : false), briefDone ? '已通过' : ((briefRec.length || briefDraft) ? '草稿中' : '未开始'), briefRec.length ? briefRec.length + ' 个版本' : '待制作', 'brief'),
          mk('邮件已发',
            (mailSent + deliveredCount) > 0 ? true : (mailPend > 0 ? null : false),
            mailSent > 0 ? (mailSent + deliveredCount) + ' 封已发' : (deliveredCount > 0 ? '历史已触达 ' + deliveredCount + ' 位' : (mailPend > 0 ? mailPend + ' 封待发' : '未发送')),
            mailPend > 0 ? '含定时排期' : (deliveredCount > 0 && mailSent === 0 ? '本轮尚未新增触达' : '开场邮件'),
            'email'),
          mk('达成合作', (coopCount + deliveredCount) > 0 ? true : false,
            (coopCount + deliveredCount) > 0 ? (coopCount + deliveredCount) + ' 位已合作' : '暂无',
            deliveredCount > 0 ? deliveredCount + ' 位已交付素材' : (coopCount > 0 ? '本产品已联系并合作' : '待确认'), 'cooperation'),
          mk('素材回收', assetPct >= 100 ? true : (assetPct > 0 ? null : false), got + ' / ' + target, assetPct + '% 已回收', 'assets'),
          mk('时间进度', timeRisk ? null : true, timeVal, timeNote || (timeRisk ? '需调整排期' : '按计划推进'), 'timeline', !!timeRisk),
          mk('目标达成', goalPct >= 100 ? true : (goalPct > 0 ? null : false), goalPct ? goalPct + '%' : '未开始', goalPct >= 100 ? '已达标' : (goalPct ? '进行中' : '待启动'), 'goals')
        ];
        const doneN = steps.filter(x => x.mark === '✓').length;
        const pct = Math.round(doneN / steps.length * 100);
        const risk = steps.some(x => x.bad);
        return {
          idx: i + 1, name: p.name, image: p.image, sub: p.sku + ' · ' + p.brand + ' · ' + p.owner + ' 负责',
          pct, pctText: pct + '%', pctColor: pct >= 80 ? SAGE : pct >= 40 ? AMBER : RUST,
          stateText: pct === 100 ? '全流程完成' : (risk ? '有异常待处理' : '推进中'),
          riskLabels: steps.filter(x => x.bad).map(x => x.label).join('、'),
          stateBg: pct === 100 ? '#E4EFE4' : (risk ? '#FBEEDA' : '#E4EEF7'),
          stateFg: pct === 100 ? '#4E7156' : (risk ? '#A5762C' : '#1D48D8'),
          risk, steps, sku, open: this.openCampaignSku(sku, 'strategy')
        };
      }).filter(Boolean);
    })();

    const pipeDiag = (() => {
      if (!pipelineArr.length) {
        return { summary: '还没有产品进入推广。在 Products 勾选「推广」后，这里会自动跟踪七个节点并给出诊断。', next: '先在 Products 产品库勾选「推广」，把值得做的产品送进流程。', nextPage: 'products' };
      }
      const jumpOf = { '策略': 'strategy', 'Brief': 'brief', '邮件已发': 'creators', '达成合作': 'creators', '素材回收': 'assets', '时间进度': 'campaigns', '目标达成': 'reports' };
      const openCount = {};
      pipelineArr.forEach(p => p.steps.forEach(st => { if (st.mark !== '✓') openCount[st.label] = (openCount[st.label] || 0) + 1; }));
      const ranked = Object.keys(openCount).sort((a, b) => openCount[b] - openCount[a]);
      const avg = Math.round(pipelineArr.reduce((t, x) => t + x.pct, 0) / pipelineArr.length);
      const worst = pipelineArr.slice().sort((a, b) => a.pct - b.pct)[0];
      const firstOpen = worst.steps.find(st => st.mark !== '✓');
      const badList = pipelineArr.filter(x => x.risk);
      const summary = ranked.length
        ? '当前 ' + pipelineArr.length + ' 个产品在推广，平均完成 ' + avg + '%。最集中的未完成节点是「' + ranked[0] + '」（' + openCount[ranked[0]] + ' 个产品）'
            + (ranked[1] ? '，其次是「' + ranked[1] + '」（' + openCount[ranked[1]] + ' 个）' : '')
            + '；' + (badList.length ? badList.length + ' 个产品有真实异常需先处理。' : '其余节点均在正常推进。')
        : '全部 ' + pipelineArr.length + ' 个产品的七个节点均已完成，可以进入复盘并把结论写回策略。';
      const next = firstOpen
        ? '优先推进「' + worst.name + '」的「' + firstOpen.label + '」（当前 ' + firstOpen.value + '），它是该产品完成度最低（' + worst.pct + '%）时的第一个卡点。'
        : '所有节点已完成，下一步是产出复盘并把有效结论写回下一轮策略。';
      return { summary, next, nextPage: firstOpen ? (jumpOf[firstOpen.label] || 'campaigns') : 'reports' };
    })();



    // ── Campaigns list ──
    const campaignList = [
      { name: 'Ryze · Q3 北美种草', product: 'Ryze 头皮按摩仪', sku: 'RYZ-SC-01', market: 'US', goalType: '爆品打造', objective: 'UGC + 种草', budget: '$42,000', spent: '$18,400', window: '8/1 – 9/30', stage: 'Content Draft', pct: 46, creators: '14', color: AMBER },
      { name: 'Lumo · 秋季家居氛围', product: 'Lumo 便携香氛机', sku: 'LUM-AR-02', market: 'US', goalType: '新品起量', objective: '曝光', budget: '$18,000', spent: '$3,900', window: '8/15 – 10/15', stage: 'Outreach', pct: 22, creators: '9', color: BLUE },
      { name: 'Ryze · Ambassador 招募', product: 'Ryze 头皮按摩仪', sku: 'RYZ-SC-01', market: 'US', goalType: '品牌打造', objective: '长期合作', budget: '$9,000', spent: '$5,600', window: '常设', stage: 'Negotiation', pct: 68, creators: '6', color: SAGE },
      { name: 'Ryze · Q2 北美种草', product: 'Ryze 头皮按摩仪', sku: 'RYZ-SC-01', market: 'US', goalType: '常规走量', objective: 'UGC', budget: '$28,400', spent: '$28,400', window: '4/1 – 6/15', stage: '已复盘', pct: 100, creators: '12', color: '#A8B1C0' },
      { name: 'Nuvia · 合规待确认', product: 'Nuvia 口服胶囊', sku: 'NUV-SP-07', market: 'US', goalType: '新品起量', objective: '待启动', budget: '$0', spent: '$0', window: '未排期', stage: '合规审核', pct: 6, creators: '0', color: RUST }
    ].filter(c => (s.cmRemoved || []).indexOf(c.name) < 0).map((c, i) => {
      const gm = {
        'Ryze · Q3 北美种草': [
          ['推广KPI', '31 条内容 · 1.84M 播放', '90 条内容 · 3.5M 播放', 34, '按当前速度需再加 12 位 KOC'],
          ['预算目标', '$18,400 已花', '$42,000', 44, 'CPA $16.4，优于目标 $18'],
          ['时间目标', '第 3 周 / 共 9 周', '8/1 – 9/30', 33, '寄样落后 3 天，建议顺延 1 周']
        ],
        'Lumo · 秋季家居氛围': [
          ['推广KPI', '9 条内容 · 412K 播放', '40 条内容 · 1.2M 播放', 23, '招募进度正常，内容尚未集中发布'],
          ['预算目标', '$3,900 已花', '$18,000', 22, '花费节奏与内容产出匹配'],
          ['时间目标', '第 1 周 / 共 9 周', '8/15 – 10/15', 11, '按计划推进']
        ],
        'Ryze · Ambassador 招募': [
          ['推广KPI', '6 位长期红人', '10 位长期红人', 60, '4 位在谈，2 位待报价确认'],
          ['预算目标', '$5,600 已花', '$9,000', 62, '固定费占比偏高，建议转佣金制'],
          ['时间目标', '常设项目', '无期限', 0, '无截止日期，按季度复核', 'none']
        ],
        'Ryze · Q2 北美种草': [
          ['推广KPI', '19 条内容 · 2.4M 播放', '18 条内容 · 2.0M 播放', 100, '超额完成，睡前角度 ROAS 4.1x'],
          ['预算目标', '$28,400 已花', '$28,400', 100, '预算用尽，未超支'],
          ['时间目标', '已于 6/15 结项', '4/1 – 6/15', 100, '按期完成并已复盘']
        ],
        'Nuvia · 合规待确认': [
          ['推广KPI', '0 条内容', '待定（合规通过后确认）', 0, '合规证据未齐，尚未设定内容目标'],
          ['预算目标', '$0 已花', '未分配', 0, '通过合规审核后再申请预算'],
          ['时间目标', '未排期', '待合规通过', 0, '策略仅完成 3/15 章，暂不排期']
        ]
      };
      const rows = (gm[c.name] || []).map(row => {
        if (row[0] !== '时间目标') return row;
        const w = cmWindowOf(c.name);
        if (!w) return row;
        if (!w.scheduled) {
          return ['时间目标', '未排期', '待排期', 0, '策略与合规未就绪，暂不进入排期 · 来自时间进度调整', 'unscheduled'];
        }
        if (w.evergreen) {
          return ['时间目标', '常设 · 本轮 ' + w.rangeText, '按季度复核', w.pct,
            '常设项目，按季度复核当前一轮排期' + (w.shiftText ? '（' + w.shiftText + '）' : '') + ' · 来自时间进度调整', 'evergreen'];
        }
        return ['时间目标',
          '第 ' + Math.max(1, Math.ceil(w.elapsed / 7)) + ' 周 / 共 ' + Math.ceil(w.total / 7) + ' 周',
          w.rangeText, w.pct,
          (w.late ? '排期落后，建议顺延' : (w.closed ? '按期完成并已复盘' : '按计划推进')) + (w.shiftText ? '（' + w.shiftText + '）' : '') + ' · 来自时间进度调整',
          w.closed ? 'closed' : ''];
      });
      const goalRows = rows.flatMap(row => {
        if (row[0] !== '推广KPI') return [row];
        const actualParts = String(row[1] || '').split(' · ');
        const targetParts = String(row[2] || '').split(' · ');
        if (actualParts.length < 2 || targetParts.length < 2) return [row];
        const metricNumber = value => {
          const match = String(value || '').match(/[\d.]+/);
          if (!match) return 0;
          const amount = Number(match[0]);
          if (/M/i.test(value)) return amount * 1000000;
          if (/K/i.test(value)) return amount * 1000;
          return amount;
        };
        const metricPct = (actual, target) => {
          const targetNumber = metricNumber(target);
          return targetNumber ? Math.min(100, Math.round(metricNumber(actual) / targetNumber * 100)) : row[3];
        };
        return [
          ['内容数量', actualParts[0], targetParts[0], metricPct(actualParts[0], targetParts[0]), row[4]],
          ['播放量', actualParts[1], targetParts[1], metricPct(actualParts[1], targetParts[1]), '按当前已发布内容累计播放']
        ];
      });
      const cpSku = skuAll.find(p => p.sku === c.sku) || {};
      const cpTarget = ({ 'RYZ-SC-01': 4.6, 'LUM-AR-02': 4.5 })[c.sku] || 4.5;
      const cpPrev = ({ 'RYZ-SC-01': 4.5, 'LUM-AR-02': 4.4 })[c.sku];
      const starDelta = (Number(cpSku.stars) || 0) - cpTarget;
      const starTrend = cpPrev === undefined ? 0 : Number((Number(cpSku.stars) - cpPrev).toFixed(2));
      const wLate = cmWindowOf(c.name);
      const lateFlag = c.pct < 100 && (wLate ? (wLate.scheduled && !wLate.evergreen && !wLate.closed && wLate.late) : /Q3/.test(c.name));
      return {
        ...c, idx: i + 1, open: this.openCampaign(i), done: c.pct === 100,
        goalBg: { '爆品打造': '#EAF0FF', '品牌打造': '#EEF2FF', '新品起量': '#E4EEF7', '常规走量': '#F5F8FE' }[c.goalType] || '#F5F8FE',
        goalFg: { '爆品打造': '#2457F5', '品牌打造': '#3F5FCC', '新品起量': '#1D48D8', '常规走量': '#647187' }[c.goalType] || '#647187',
        facts: [
          { label: '品牌', value: cpSku.brand || '—' }, { label: '市场', value: c.market },
          { label: 'SKU', value: c.sku },
          { label: '上市时间', value: ({ 'RYZ-SC-01': '2025-11', 'RYZ-SC-02': '2026-05', 'LUM-AR-02': '2025-08', 'VER-GL-04': '2024-12', 'NUV-SP-07': '2026-03' })[c.sku] || '2026-01' },
          { label: '运营专员', value: cpSku.owner || '—' },
          {
            label: '星级 / 目标 ' + cpTarget.toFixed(1),
            value: (cpSku.stars || '—') + ' ★',
            color: starDelta < 0 ? RUST : '#1D2638',
            arrow: starTrend > 0 ? '↑' : (starTrend < 0 ? '↓' : ''),
            arrowColor: starTrend > 0 ? SAGE : RUST,
            hasArrow: starTrend !== 0
          },
          { label: 'Review 数量', value: cpSku.reviews !== undefined ? String(cpSku.reviews) : '—' },
          { label: '客单价', value: cpSku.price || '—' }, { label: 'RPS14', value: cpSku.ps || '—' },
          { label: 'BSR 位置', value: cpSku.bsr ? '#' + cpSku.bsr : '—', tip: cpSku.bsrCat || '' },
          { label: '大类排名', value: cpSku.bsrTop ? '#' + cpSku.bsrTop : '—', tip: cpSku.bsrTopCat || '' },
          { label: '推广专员', value: ({ 'RYZ-SC-01': '林浩', 'LUM-AR-02': '苏敏', 'AURA-LP-01': '陈曦', 'VER-GL-04': '苏敏', 'NUV-SP-07': '林浩' })[c.sku] || 'Helen' }
        ],
        remove: (e) => {
          if (e && e.stopPropagation) e.stopPropagation();
          this.setState(st => ({ cmRemoved: [...(st.cmRemoved || []), c.name] }));
        },
        stateText: c.pct === 100 ? '已复盘' : (c.name.indexOf('Q3') >= 0 ? '有异常' : '推进中'),
        stateBg: c.pct === 100 ? '#F5F8FE' : (c.name.indexOf('Q3') >= 0 ? '#FBEEDA' : '#E4EEF7'),
        stateFg: c.pct === 100 ? '#647187' : (c.name.indexOf('Q3') >= 0 ? '#A5762C' : '#1D48D8'),
        goals: goalRows.map(([label, actual, target, pct, note, kind]) => {
          let tag, tone, bar = pct;
          if (kind === 'unscheduled') { tag = '未排期'; tone = 'flat'; bar = 0; }
          else if (kind === 'evergreen') { tag = '常设项目'; tone = 'good'; }
          else if (kind === 'closed') { tag = '已结项'; tone = 'good'; }
          else if (kind === 'none') { tag = '无期限'; tone = 'flat'; bar = 0; }
          else if (label === '时间目标') {
            const outPct = (rows[0] || [])[3] || 0;
            if (pct >= 100) { tag = '已结项'; tone = 'good'; }
            else if (lateFlag) { tag = '排期落后'; tone = 'warn'; }
            else if (outPct + 12 >= pct) { tag = '按期推进'; tone = 'good'; }
            else if (pct - outPct <= 25) { tag = '略有落后'; tone = 'warn'; }
            else { tag = '明显落后'; tone = 'bad'; }
          } else if (label === '预算目标') {
            const outPct = (rows[0] || [])[3] || 0;
            if (pct >= 100 && outPct >= 100) { tag = '用尽且达标'; tone = 'good'; }
            else if (pct <= outPct + 15) { tag = '花费效率良好'; tone = 'good'; }
            else if (pct <= outPct + 35) { tag = '花费偏快'; tone = 'warn'; }
            else { tag = '花费超前于产出'; tone = 'bad'; }
          } else {
            if (pct >= 100) { tag = '已达成'; tone = 'good'; }
            else if (pct >= 60) { tag = '接近目标'; tone = 'good'; }
            else if (pct >= 30) { tag = '进度偏慢'; tone = 'warn'; }
            else { tag = '刚启动'; tone = 'flat'; }
          }
          const palette = {
            good: ['#E4EFE4', '#4E7156', SAGE],
            warn: ['#FBEEDA', '#A5762C', AMBER],
            bad: ['#FBE3E3', '#C4636D', RUST],
            flat: ['#F5F8FE', '#647187', '#B7C0CF']
          }[tone];
          const gk = c.name + '|' + label;
          const editing = s.goalEdit === gk;
          const shownTarget = ((s.goalTargets || {})[gk] !== undefined) ? s.goalTargets[gk] : target;
          return {
            label, actual, target: shownTarget, note, pct: bar, tag,
            tagBg: palette[0], tagFg: palette[1], color: palette[2],
            editing, reading: !editing, editLabel: editing ? '完成' : '编辑',
            stop: (e) => { if (e && e.stopPropagation) e.stopPropagation(); },
            toggleEdit: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ goalEdit: st.goalEdit === gk ? null : gk })); },
            setTarget: (e) => { const v = e.target.value; this.setState(st => ({ goalTargets: { ...(st.goalTargets || {}), [gk]: v } })); }
          };
        })
      };
    });
    const cdProduct = skuAll.find(p => s.campaignSku && p.sku === s.campaignSku);
    const promotedCampaignGoals = (product) => {
      const productAssets = facts.assets.filter(asset => asset.sku === product.sku);
      const parseMetric = value => {
        const match = String(value || '').match(/[\d.]+/);
        if (!match) return 0;
        const amount = Number(match[0]);
        if (/M/i.test(value)) return amount * 1000000;
        if (/K/i.test(value)) return amount * 1000;
        return amount;
      };
      const formatMetric = value => value >= 1000000
        ? (value / 1000000).toFixed(value % 1000000 ? 2 : 0).replace(/0+$/, '').replace(/\.$/, '') + 'M'
        : (value >= 1000 ? Math.round(value / 1000) + 'K' : String(value));
      const viewTotal = productAssets.reduce((sum, asset) => sum + parseMetric(asset.views), 0);
      const targetDef = {
        'AURA-LP-01': { content: 4, views: 500000 }
      }[product.sku] || { content: Math.max(12, productAssets.length), views: 800000 };
      const contentPct = Math.min(100, Math.round(productAssets.length / Math.max(1, targetDef.content) * 100));
      const viewsPct = Math.min(100, Math.round(viewTotal / Math.max(1, targetDef.views) * 100));
      const windowGoal = cmWindowOf(product.sku);
      const goalStyle = (tone) => {
        const palette = {
          good: ['#E4EFE4', '#4E7156', SAGE],
          warn: ['#FBEEDA', '#A5762C', AMBER],
          flat: ['#F5F8FE', '#647187', '#B7C0CF']
        }[tone];
        return { tagBg: palette[0], tagFg: palette[1], color: palette[2] };
      };
      const goal = (label, actual, target, pct, note, tag, tone) => ({
        label, actual, target, pct, note, tag, ...goalStyle(tone)
      });
      return [
        goal('内容数量', productAssets.length + ' 条内容', targetDef.content + ' 条内容', contentPct,
          productAssets.length >= targetDef.content ? '内容目标已完成' : '还需回收 ' + (targetDef.content - productAssets.length) + ' 条内容',
          contentPct >= 60 ? '接近目标' : '刚启动', contentPct >= 60 ? 'good' : 'flat'),
        goal('播放量', formatMetric(viewTotal) + ' 播放', formatMetric(targetDef.views) + ' 播放', viewsPct,
          '按当前已发布内容累计播放', viewsPct >= 60 ? '接近目标' : (viewsPct >= 30 ? '进度偏慢' : '刚启动'), viewsPct >= 60 ? 'good' : (viewsPct >= 30 ? 'warn' : 'flat')),
        goal('预算目标', '$0 已花', '待分配', 0, 'Campaign 尚未分配预算', '待分配', 'flat'),
        goal('时间目标', windowGoal && windowGoal.scheduled
          ? '第 ' + Math.max(1, Math.ceil(windowGoal.elapsed / 7)) + ' 周 / 共 ' + Math.ceil(windowGoal.total / 7) + ' 周'
          : '未排期', windowGoal && windowGoal.scheduled ? windowGoal.rangeText : '待排期', windowGoal ? windowGoal.pct : 0,
          windowGoal && windowGoal.scheduled ? '按计划推进 · 来自时间进度调整' : '策略与合规未就绪，暂不进入排期',
          windowGoal && windowGoal.scheduled ? '按期推进' : '未排期', windowGoal && windowGoal.scheduled ? 'good' : 'flat')
      ];
    };
    const cd = campaignList.find(c => s.campaignName && c.name === s.campaignName)
      || campaignList.find(c => s.campaignSku && c.sku === s.campaignSku)
      || (cdProduct ? {
        name: cdProduct.brand + ' · 推广 Campaign', product: cdProduct.name, sku: cdProduct.sku,
        objective: '红人种草', budget: '待分配', spent: '$0', window: (cmWindowOf(cdProduct.sku) || {}).rangeText || '未排期', creators: '0', pct: 0, goals: promotedCampaignGoals(cdProduct),
        stateText: '推进中', stateBg: '#E4EEF7', stateFg: '#1D48D8'
      } : null)
      || campaignList[Math.min(s.campaignIdx, campaignList.length - 1)]
      || { name: 'Campaign', product: '—', sku: '—', objective: '—', budget: '—', spent: '—', window: '—', creators: '0', goals: [] };

    const campaignKpiMap = {
      'RYZ-SC-01': [
        ['内容已发布', '31 / 90', '按期', SAGE], ['总播放', '1.84M', '+22% WoW', SAGE],
        ['平均完播', '34%', '略低于目标 35%', AMBER], ['折扣码转化', '612', '+88 本周', SAGE], ['CPA', '$16.4', '优于目标 $18', SAGE]
      ],
      'LUM-AR-02': [
        ['内容已发布', '9 / 40', '进入首轮发布', BLUE], ['总播放', '412K', '+14% WoW', SAGE],
        ['平均完播', '38%', '高于目标 35%', SAGE], ['收藏', '3,280', '家居场景表现最佳', SAGE], ['CPV', '$0.021', '处于目标范围', BLUE]
      ],
      'NUV-SP-07': [
        ['内容已发布', '0 / 24', '等待合规', RUST], ['总播放', '—', '尚未启动', '#8792A5'],
        ['平均完播', '—', '尚无数据', '#8792A5'], ['转化', '—', '尚无数据', '#8792A5'], ['CPA', '—', '尚无数据', '#8792A5']
      ]
    };
    const campaignKpis = (campaignKpiMap[cd.sku] || campaignKpiMap['RYZ-SC-01']).map(x => ({ label: x[0], value: x[1], delta: x[2], color: x[3] }));

    const kanbanDefs = cd.sku === 'LUM-AR-02' ? [
      { label: 'Outreach', color: BLUE, cards: [{ handle: '@sofia.homelab', initial: 'S', note: '首封已发，等待档期', meta: '昨天' }, { handle: '@quietmornings', initial: 'Q', note: '待发个性化 Brief', meta: '今天' }] },
      { label: 'Negotiation', color: BLUE, cards: [{ handle: '@homewithtess', initial: 'H', note: '报价 $480，待确认授权', meta: '需决策' }] },
      { label: 'Brief Sent', color: AMBER, cards: [{ handle: '@hairbyandre', initial: 'A', note: '静帧 Brief 已确认', meta: '2 天前' }] },
      { label: 'Product Seeding', color: AMBER, cards: [{ handle: '@nora.pm', initial: 'N', note: '运输中，预计 9/02 签收', meta: 'DHL' }] },
      { label: 'Content Review', color: AMBER, cards: [] },
      { label: 'Published', color: SAGE, cards: [{ handle: '@hairbyandre', initial: 'A', note: '浴室静帧组已发布', meta: '表现稳定' }] }
    ] : cd.sku === 'NUV-SP-07' ? [
      { label: 'Compliance Hold', color: RUST, cards: [{ handle: '合规审核', initial: '!', note: '第三方检测报告待补齐', meta: '阻塞中' }] },
      { label: 'Outreach', color: '#B7C0CF', cards: [] }, { label: 'Negotiation', color: '#B7C0CF', cards: [] },
      { label: 'Brief Sent', color: '#B7C0CF', cards: [] }, { label: 'Product Seeding', color: '#B7C0CF', cards: [] }, { label: 'Published', color: '#B7C0CF', cards: [] }
    ] : [
      { label: 'Outreach', color: BLUE, cards: [{ handle: '@dailywithlin', nation: '美国', market: 'US', tier: '1万-10万', gender: '女', age: '25-34', job: '上班族兼职', avgViews: '41K', er30: '8.7%', initial: 'L', note: '首封已发，等待回复', meta: '3 天前' }, { handle: '@nora.pm', initial: 'N', note: '待发首封，Brief 已备', meta: '今天' }] },
      { label: 'Negotiation', color: BLUE, cards: [{ handle: '@sofia.homelab', nation: '美国', market: 'US', tier: '50万以下', gender: '女', age: '35-44', job: '室内设计师', avgViews: '23K', er30: '3.6%', initial: 'S', note: '报价 $850，我方 $700', meta: '需决策' }] },
      { label: 'Brief Sent', color: AMBER, cards: [{ handle: '@hairbyandre', nation: '加拿大', market: 'US', tier: '1万-10万', gender: '男', age: '35-44', job: '执业发型师', avgViews: '19K', er30: '4.3%', initial: 'A', note: '个性化 Brief 已发，待确认', meta: '1 天前' }] },
      { label: 'Product Seeding', color: AMBER, cards: [{ handle: '@kaylascalp', nation: '美国', market: 'US', tier: '1万-10万', gender: '女', age: '25-34', job: '美发从业者', avgViews: '34K', er30: '12.1%', initial: 'K', note: '已签收，预计 8/28 交初稿', meta: 'TRK ···4192' }, { handle: '@june.rests', initial: 'J', note: '运输中', meta: '预计 8/23' }] },
      { label: 'Content Review', color: AMBER, cards: [{ handle: '@mia.selfcare', nation: '美国', market: 'US', tier: '10万-50万', gender: '女', age: '25-34', job: '全职创作者', avgViews: '128K', er30: '6.4%', initial: 'M', note: '初稿已交，缺 #ad 标注', meta: '待修改' }] },
      { label: 'Published', color: SAGE, cards: [{ handle: '@leo.calmnight', initial: 'L', note: '已发布，48h 播放 214K', meta: '表现优' }] }
    ];
	    const campaignDealHandlesForKanban = ((s.campaignCoopDeals || {})[cd.sku] || []).filter(Boolean);
	    const kanbanStaticHandles = kanbanDefs.flatMap(col => col.cards.map(card => card.handle));
	    const campaignDealCards = campaignDealHandlesForKanban
	      .filter(handle => kanbanStaticHandles.indexOf(handle) < 0)
	      .map(handle => {
	        const sent = (s.contactLog || []).find(m => m.sku === cd.sku && m.handle === handle && /已发送/.test(m.status || ''));
	        const creator = creatorDefs.find(c => c.handle === handle) || {};
	        return {
	          handle,
	          initial: String(handle || '?').replace('@', '').slice(0, 1).toUpperCase(),
	          note: '已达成合作，待确认寄样与合同',
	          meta: sent ? String(sent.when || '').slice(5) : '刚刚',
	          nation: creator.nation, market: creator.market, tier: creator.tier,
	          gender: creator.gender, age: creator.age, job: creator.job,
	          avgViews: creator.avgViews, er30: creator.er30
	        };
	      });
	    const kanbanWithDealRecords = kanbanDefs.map((col, ci) => (
	      ci === 3 && campaignDealCards.length ? { ...col, cards: campaignDealCards.concat(col.cards) } : col
	    ));
	    const kanban = kanbanWithDealRecords.map((col, ci) => ({
	      ...col, count: col.cards.length,
	      cards: col.cards.map((card, i) => ({
	        ...card,
	        advance: this.ask('把 ' + card.handle + ' 推进到下一阶段', '已推进 ' + card.handle + '。\n下一步动作我准备好了：' + (ci < 2 ? '一封跟进邮件草稿，语气延续你上次的写法。' : '一条交付提醒 + 需要补的 #ad 标注说明。') + '\n要我直接发送吗？')
	      }))
	    }));

    const cooperationStageHeaders = ['建联', '签约', '付款', '寄样', '沟通 Brief', '素材回收'].map((label, i) => ({ no: i + 1, label }));
    const cooperationPeople = [];
    kanbanWithDealRecords.forEach((col, pipelineIndex) => {
      col.cards.forEach(card => {
        if (!card.handle || String(card.handle).charAt(0) !== '@') return;
        const existing = cooperationPeople.find(x => x.handle === card.handle);
        if (existing) {
          existing.pipelineIndex = Math.max(existing.pipelineIndex, pipelineIndex);
          if (pipelineIndex >= existing.pipelineIndex) existing.card = { ...existing.card, ...card };
        } else {
          cooperationPeople.push({ handle: card.handle, pipelineIndex, card });
        }
      });
    });
    const cooperationPalette = {
      done: { status: '已完成', dotBg: '#E4EFE4', dotFg: '#4E7156', fg: '#4E7156', mark: '✓', metaFg: '#8792A5' },
      current: { status: '进行中', dotBg: '#EAF0FF', dotFg: '#2457F5', fg: '#2457F5', mark: '·', metaFg: '#647187' },
      risk: { status: '需处理', dotBg: '#FBE3E3', dotFg: '#C4636D', fg: '#C4636D', mark: '!', metaFg: '#C4636D' },
      pending: { status: '待开始', dotBg: '#EEF2F8', dotFg: '#A2ABBA', fg: '#8792A5', mark: '', metaFg: '#A2ABBA' }
    };
    const coopContractFiles = s.coopContractFiles || {};
    const coopBriefFiles = s.coopBriefFiles || {};
    const coopPostLinks = s.coopPostLinks || {};
    const coopActionHandle = s.coopActionHandle || '';
    const coopActionType = s.coopActionType || '';
    const openCoopAction = (handle, type) => (e) => {
      if (e && e.stopPropagation) e.stopPropagation();
      const patch = { coopActionHandle: handle, coopActionType: type, coopPostChannel: 'TikTok', coopPostUrl: '', coopActionNotice: '' };
      if (type === 'posts') {
        const creator = creatorDefs.find(c => c.handle === handle) || {};
        const channel = /instagram/i.test(creator.platform || '') ? 'Instagram' : (/youtube/i.test(creator.platform || '') ? 'YouTube' : 'TikTok');
        patch.alForm = { handle, channel, post: '2026-09-07', product: cd.product, sku: cd.sku, campaign: cd.name, brand: cd.brand || cd.product };
      }
      this.setState(patch);
    };
    const cooperationRows = cooperationPeople.map((person, personIndex) => {
      const handle = person.handle;
      const pipelineIndex = person.pipelineIndex;
      const creator = creatorDefs.find(c => c.handle === handle) || {};
      const sentMail = (s.contactLog || []).find(m => m.sku === cd.sku && m.handle === handle && /已发送/.test(m.status || ''));
      const shipment = (s.shipOrders || []).filter(o => o.handle === handle).sort((a, b) => String(a.date || '').localeCompare(String(b.date || ''))).slice(-1)[0];
      const payment = (s.invoices || []).find(inv => inv.sku === cd.sku && inv.handle === handle);
      const asset = facts.assets.find(a => a.handle === handle && a.sku === cd.sku);
      const uploadedContracts = coopContractFiles[handle] || [];
      const uploadedBriefs = coopBriefFiles[handle] || [];
      const submittedPosts = coopPostLinks[handle] || [];
      const briefMailRecords = [
        ...(s.contactLog || []).filter(m => m.sku === cd.sku && m.handle === handle).map(m => ({
          direction: '我方发送', when: m.when || '', subject: m.subject || '合作邮件',
          text: [m.subject, m.body, (m.attNames || []).join(' '), m.briefKey ? 'Brief' : ''].filter(Boolean).join(' · ')
        })),
        ...facts.replies.filter(r => r.handle === handle).map(r => ({
          direction: '红人回复', when: r.when || '', subject: r.subject || '邮件回复',
          text: [r.subject, r.gist].filter(Boolean).join(' · ')
        }))
      ].filter(m => /brief|内容|素材|交付|初稿|脚本|字幕|镜头|拍摄|本周内拍|reels|shorts|横版|#ad|ftc|发布|延期|延后/i.test(m.text || ''))
        .sort((a, b) => String(b.when || '').localeCompare(String(a.when || '')));
      const briefMailLatest = briefMailRecords[0] || null;
      const contractState = uploadedContracts.length ? 'done' : (pipelineIndex === 0 ? 'pending' : (pipelineIndex === 1 ? 'current' : 'done'));
      const paymentState = payment
        ? (/已付款|已结算|已支付/.test(payment.status || '') ? 'done' : (/驳回/.test(payment.status || '') ? 'risk' : 'current'))
        : (pipelineIndex >= 3 ? 'current' : 'pending');
      const shipmentState = shipment
        ? ((shipment.stage || 0) >= 3 ? 'done' : 'current')
        : (pipelineIndex >= 3 ? 'current' : 'pending');
      const briefState = briefMailRecords.length ? 'done' : 'pending';
      const assetState = submittedPosts.length || asset || pipelineIndex >= 5 ? 'done' : (pipelineIndex === 4 ? 'risk' : 'pending');
      const stageDefs = [
        {
          state: sentMail || pipelineIndex > 0 ? 'done' : 'current',
          note: sentMail ? '邮件已发送并建立联系' : (person.card.note || '等待发送首封合作邮件'),
          meta: sentMail ? String(sentMail.when || '').slice(0, 10) : (person.card.meta || '待跟进')
        },
        {
          state: contractState,
          note: uploadedContracts.length ? uploadedContracts[uploadedContracts.length - 1].name : (contractState === 'done' ? '合作条款与授权范围已确认' : (contractState === 'current' ? '报价与合作条款确认中' : '待确认合作意向后发起签约')),
          meta: uploadedContracts.length ? uploadedContracts.length + ' 份合同文件 · 点击管理' : (contractState === 'done' ? '合同已归档 · 点击补充文件' : (contractState === 'current' ? '点击上传已签约合同' : '点击上传合同'))
        },
        {
          state: paymentState,
          note: payment ? ((payment.item || payment.payType || '合作款项') + ' · ' + (payment.amount ? '$' + payment.amount : '')) : (paymentState === 'current' ? '待创建付款计划并确认节点' : '签约后进入付款流程'),
          meta: payment ? ((payment.date || '') + ' · ' + payment.status) : (paymentState === 'current' ? '待财务处理' : '尚未发生')
        },
        {
          state: shipmentState,
          note: shipment ? ((shipment.stage || 0) >= 3 ? '样品已签收' : ['待仓库揽收', '包裹已揽收', '样品运输中'][Math.max(0, Math.min(2, shipment.stage || 0))]) : (shipmentState === 'current' ? '待补充地址并安排寄样' : '付款节点确认后安排寄样'),
          meta: shipment ? ((shipment.carrier || 'DHL') + ' · ' + (shipment.tracking || shipment.date || '')) : '暂无物流单'
        },
        {
          state: briefState,
          note: briefMailLatest ? 'AI 已识别 Brief 沟通' : 'AI 未识别到 Brief 沟通',
          meta: briefMailLatest ? (briefMailLatest.direction + ' · ' + String(briefMailLatest.when || '').slice(0, 10) + ' · 点击查看依据') : '持续扫描当前 Campaign 往来邮件'
        },
        {
          state: assetState,
          note: submittedPosts.length ? submittedPosts.length + ' 个帖子链接已收录' : (asset ? asset.title : (assetState === 'risk' ? (person.card.note || '初稿待修改或补充') : '等待红人提交素材')),
          meta: submittedPosts.length ? [...new Set(submittedPosts.map(x => x.channel))].join(' · ') + ' · 点击管理' : (asset ? ((asset.delivered || asset.post || '') + ' · 点击补充素材') : '点击录入回收素材')
        }
      ];
      const stages = stageDefs.map((stage, stageIndex) => {
        const palette = cooperationPalette[stage.state];
        const directActionType = stageIndex === 5 ? 'posts' : '';
        const goToContractMgt = stageIndex === 1;
        const goToAssetEntry = stageIndex === 5 && !submittedPosts.length && !asset;
        const goToSampleMgt = stageIndex === 3;
        const briefAiAction = stageIndex === 4;
        const actionable = goToContractMgt || goToSampleMgt || briefAiAction || !!directActionType || stage.state === 'current' || stage.state === 'risk';
        return {
          ...stage, ...palette,
          cursor: actionable ? 'pointer' : 'default',
          action: goToContractMgt
            ? (e) => {
                if (e && e.stopPropagation) e.stopPropagation();
                const params = new URLSearchParams({ upload: '1', campaign: cd.name, product: cd.product, sku: cd.sku, handle });
                window.location.href = './12-Contract-Mgt.html?' + params.toString();
              }
            : goToSampleMgt
            ? (e) => {
                if (e && e.stopPropagation) e.stopPropagation();
                const params = new URLSearchParams({ campaign: cd.name, product: cd.product, sku: cd.sku, handle });
                if (shipment) params.set('query', handle);
                else params.set('create', '1');
                window.location.href = './8-Sample-Mgt.html?' + params.toString();
              }
            : goToAssetEntry
            ? (e) => {
                if (e && e.stopPropagation) e.stopPropagation();
                const params = new URLSearchParams({ entry: '1', campaign: cd.name, product: cd.product, sku: cd.sku, handle });
                window.location.href = './9-Asset-Library.html?' + params.toString();
              }
            : briefAiAction
            ? this.ask(
                '查看 ' + handle + ' 的 Brief 邮件识别依据',
                briefMailLatest
                  ? 'AI 已从当前 Campaign 的邮件记录中识别到 Brief 沟通。\n\n最近依据：' + briefMailLatest.subject + '\n方向：' + briefMailLatest.direction + '\n时间：' + briefMailLatest.when + '\n\n共识别到 ' + briefMailRecords.length + ' 封相关邮件。'
                  : 'AI 尚未在当前 Campaign 与 ' + handle + ' 的往来邮件中识别到 Brief、脚本、交付要求、拍摄或内容修改等沟通信号。\n\n系统会在新邮件进入后继续自动扫描。'
              )
            : directActionType
            ? openCoopAction(handle, directActionType)
            : actionable
            ? this.ask('推进 ' + handle + ' 的' + cooperationStageHeaders[stageIndex].label + '环节', '已定位到 ' + handle + ' 的「' + cooperationStageHeaders[stageIndex].label + '」。\n当前状态：' + stage.note + '。\n我可以继续帮你准备下一步动作。')
            : () => {}
        };
      });
      const doneCount = stages.filter(stage => stage.state === 'done').length;
      const hasRisk = stages.some(stage => stage.state === 'risk');
      const progressPct = Math.round((doneCount + (stages.some(stage => stage.state === 'current') ? 0.5 : 0)) / stages.length * 100);
      return {
        handle,
        initial: String(handle).replace('@', '').slice(0, 1).toUpperCase(),
        profile: [creator.platform, creator.followers ? creator.followers + ' 粉丝' : '', creator.nation].filter(Boolean).join(' · ') || '合作红人',
        progressPct,
        progressText: doneCount + '/6',
        progressColor: hasRisk ? '#C4636D' : (doneCount >= 6 ? '#6E8F74' : '#2457F5'),
        stages,
        open: this.openCreator(handle),
        sort: hasRisk ? -1 : personIndex
      };
    }).filter(row => !String(s.coopQuery || '').trim() || row.handle.toLowerCase().includes(String(s.coopQuery || '').trim().toLowerCase())).sort((a, b) => a.sort - b.sort);
    const cooperationSummary = [
      { label: '合作红人', value: cooperationRows.length + ' 位', color: '#2457F5' },
      { label: '履约中', value: cooperationRows.filter(r => r.progressPct < 100).length + ' 位', color: '#A5762C' },
      { label: '需处理', value: cooperationRows.filter(r => r.stages.some(st => st.state === 'risk')).length + ' 项', color: '#C4636D' },
      { label: '素材已回收', value: cooperationRows.filter(r => r.stages[5].state === 'done').length + ' 位', color: '#6E8F74' }
    ];
    const cooperationLegend = [
      { label: '已完成', color: '#6E8F74' }, { label: '进行中', color: '#2457F5' },
      { label: '待开始', color: '#B7C0CF' }, { label: '需处理', color: '#C4636D' }
    ];
    const coopActionIsUpload = coopActionType === 'contract' || coopActionType === 'brief';
    const coopActionIsPosts = coopActionType === 'posts';
    const coopActionFiles = (coopActionType === 'contract' ? coopContractFiles[coopActionHandle] : coopBriefFiles[coopActionHandle]) || [];
    const coopActionPosts = (coopPostLinks[coopActionHandle] || []).map((post, index) => ({
      ...post,
      remove: () => this.setState(st => ({
        coopPostLinks: { ...(st.coopPostLinks || {}), [coopActionHandle]: ((st.coopPostLinks || {})[coopActionHandle] || []).filter((_, i) => i !== index) },
        coopActionNotice: '链接已移除'
      }))
    }));
    const coopActionFileRows = coopActionFiles.map((file, index) => ({
      ...file,
      remove: () => this.setState(st => {
        const stateKey = coopActionType === 'contract' ? 'coopContractFiles' : 'coopBriefFiles';
        const collection = st[stateKey] || {};
        return { [stateKey]: { ...collection, [coopActionHandle]: (collection[coopActionHandle] || []).filter((_, i) => i !== index) }, coopActionNotice: '文件已移除' };
      })
    }));
    const coopPostChannelOptions = ['TikTok', 'Instagram', 'YouTube', '其他'].map(channel => ({
      label: channel,
      bg: s.coopPostChannel === channel ? '#EAF0FF' : '#FFFFFF',
      fg: s.coopPostChannel === channel ? '#2457F5' : '#647187',
      bd: s.coopPostChannel === channel ? '#B8CBFF' : '#E2E8F2',
      pick: () => this.setState({ coopPostChannel: channel })
    }));
    const coopAssetChannelOptions = ['TikTok', 'Instagram', 'YouTube', '其他'].map(channel => {
      const on = ((s.alForm || {}).channel || 'TikTok') === channel;
      return {
        label: channel,
        bg: on ? '#EAF0FF' : '#FFFFFF', fg: on ? '#1D48D8' : '#647187', bd: on ? '#B8CBFF' : '#E2E8F2', dot: on ? '#2457F5' : '#C8D1DF',
        pick: () => this.setState(st => ({ alForm: { ...(st.alForm || {}), channel }, coopActionNotice: '' }))
      };
    });
    const coopSavedAssetRows = (s.alEntries || []).filter(entry => entry.handle === coopActionHandle && entry.sku === cd.sku).map(entry => ({
      title: entry.title || '未命名素材', channel: entry.channel || '其他', post: entry.post || '—', url: entry.url || '#',
      views: entry.m_views || entry.views || '—', er: (() => { const value = entry.m_er || entry.er || '—'; return value === '—' ? value : (String(value).includes('%') ? String(value) : value + '%'); })(),
      channelBg: entry.channel === 'Instagram' ? '#F7EDEE' : (entry.channel === 'YouTube' ? '#FBE3E3' : (entry.channel === 'TikTok' ? '#EAF0FF' : '#F5F8FE')),
      channelFg: entry.channel === 'Instagram' ? '#A24D68' : (entry.channel === 'YouTube' ? '#C4636D' : (entry.channel === 'TikTok' ? '#1D48D8' : '#647187'))
    }));
    const coopActionTitle = coopActionType === 'contract' ? '上传签约合同' : (coopActionType === 'brief' ? '上传 Brief 沟通记录' : '录入回收素材');
    const coopActionHint = coopActionType === 'contract'
      ? '上传双方已签署的合同文件，文件会归档到该红人的合作记录。'
      : (coopActionType === 'brief'
          ? '上传邮件导出、聊天截图、会议纪要或修改记录，保留完整沟通依据。'
          : '沿用 Asset Library 的录入方式，补充素材信息、表现数据与授权信息；红人账号和当前 Campaign 产品已自动带入。');

    const assets = [
      { type: 'VIDEO', slot: '视频封面占位', title: '夜间 routine ep.12', meta: '@mia.selfcare · TikTok · 8/12', rights: '广告可用', summary: '低光暖调，第 2 秒进入按压动作，结尾一句「今晚终于放松了」。', tags: ['睡前场景', '放松', '女性 25-34', '完播 41%'], reuse: '适合白名单投放主素材' },
      { type: 'VIDEO', slot: '视频封面占位', title: '头皮特写实测', meta: '@kaylascalp · TikTok · 8/9', rights: '广告可用', summary: '双镜头结构，专业口吻解释清洁，无功效 claim，评论区问价 37 条。', tags: ['专业背书', '特写', '完播 58%'], reuse: '适合详情页第二屏' },
      { type: 'IMAGE', slot: '静帧占位', title: '浴室场景静帧组', meta: '@hairbyandre · Instagram · 8/5', rights: '仅社媒', summary: '暖白瓷砖背景，产品与洗护瓶同框，构图干净可延展。', tags: ['浴室', '产品同框', '可加字'], reuse: '适合 IG Grid 与 EDM 头图' },
      { type: 'VIDEO', slot: '视频封面占位', title: '一周实测 Shorts', meta: '@leo.calmnight · YouTube · 8/14', rights: '待授权', summary: '结论先行结构，前 1 秒抛「用了七天最意外的一点」。', tags: ['实测', '搜索承接', '播放 214K'], reuse: '待补授权后可投放' },
      { type: 'COPY', slot: '文案片段', title: '高转化口播片段 ×6', meta: 'AI 汇总 · 跨 9 条内容', rights: '内部可用', summary: '「洗头一直很敷衍，直到…」句式在 4 条高表现内容中重复出现。', tags: ['hook 库', '句式', '可复用'], reuse: '写入下一轮 Brief 参考' },
      { type: 'VIDEO', slot: '视频封面占位', title: '前后头皮对比', meta: '@june.rests · TikTok · 8/16', rights: '仅社媒', summary: '对比画面清晰但字幕出现「见效」字样，需重新剪辑后才能投放。', tags: ['前后对比', '需修改', '合规风险'], reuse: '重剪字幕后可用' }
    ].map((a, i) => ({
      ...a, open: this.openAsset(i),
      bd: s.assetQuery === a.title ? '#2457F5' : '#E2E8F2',
      shadow: s.assetQuery === a.title ? '0 8px 22px rgba(242,140,107,.18)' : 'none',
      rightsBg: a.rights === '广告可用' ? '#E4EFE4' : a.rights === '待授权' ? '#FBE3E3' : '#F8FAFE',
      rightsFg: a.rights === '广告可用' ? '#4E7156' : a.rights === '待授权' ? '#C4636D' : '#647187'
    }));

    const campaignTab = s.campaignTab || 'strategy';
    const campaignLibraryRec = (s.library || []).find(x => x.sku === cd.sku);
    const campaignSavedStrategies = (s.campaignStrategyVersions || []).filter(x => x.sku === cd.sku);
    const campaignStrategySectionBank = [
      ['执行摘要', cd.product + ' 本轮围绕「' + cd.objective + '」推进，以一个清晰、可复述的使用场景建立内容记忆点，并将预算集中到已验证的内容角度。', 'SRC-001'],
      ['项目目标与成功标准', '主目标为' + cd.objective + '。以内容交付完成率、有效播放成本、互动质量与可复用素材数量作为本轮成功标准。', ''],
      ['Consumer Truth Snapshot', cd.sku === 'LUM-AR-02' ? '目标人群购买的不是一台香氛设备，而是低成本改变空间氛围、切换生活状态的方式。' : (cd.sku === 'NUV-SP-07' ? '用户需要可信、可验证的信息来降低尝试门槛，安全感优先于夸张功效表达。' : '高压人群真正需要的是允许自己短暂停下来、完成日常自我照护的具体动作。'), 'SRC-004'],
      ['产品—人群—场景—证据匹配', cd.sku === 'LUM-AR-02' ? '以卧室、书桌和租房空间为核心场景，用真实空间变化证明产品价值。' : (cd.sku === 'NUV-SP-07' ? '所有功能与功效表述必须先完成 Claim—证据映射，证据未确认的内容不得进入外发 Brief。' : '以洗头、睡前和工作后放松为核心场景；只表达有产品资料支持的事实，体感内容保留为红人第一人称。'), 'SRC-003'],
      ['一句话种草主张与传播原则', cd.sku === 'LUM-AR-02' ? '一句话主张：一平米，也能完成一次氛围改造。原则：先展示空间变化，再说明产品。' : (cd.sku === 'NUV-SP-07' ? '一句话主张：先把证据讲清楚，再谈使用选择。原则：不做未经验证的功效承诺。' : '一句话主张：把三分钟头皮护理，变成一天结束前的放松开关。原则：先画面后结论，不做疗效承诺。'), ''],
      ['平台与市场策略', '主阵地优先覆盖 TikTok 与 Instagram，以短视频验证 Hook，以 Reels 沉淀可进入品牌主页的高质感内容，并根据首轮数据决定是否扩展 YouTube Shorts。', ''],
      ['红人组合及分层配置', 'KOC 负责真实体验与内容铺量，Micro Creator 负责内容标杆，垂类 Expert 提供专业解释；组合比例根据渠道内容密度动态调整。', 'SRC-006'],
      ['红人筛选评分卡与淘汰规则', '评分维度：内容契合度 30% · 受众重合 25% · 互动质量 25% · 交付稳定性 20%。淘汰：互动异常、历史多次逾期或受众市场不符。', 'SRC-006'],
      ['内容支柱与选题矩阵', cd.sku === 'LUM-AR-02' ? '空间改造、夜间氛围、租房友好、日常仪式感四个内容支柱；每个支柱预设多个可测试选题。' : '真实使用时刻、步骤演示、体验变化、专业解释四个内容支柱；每个支柱预设多个可测试选题。', 'SRC-005'],
      ['各平台内容形式、Hook、Proof、CTA', 'TikTok 前 3 秒直接进入具体场景；Instagram 强调画面与收藏价值；YouTube Shorts 采用结论先行的实测结构。Proof 必须可见，CTA 保持自然。', 'SRC-005'],
      ['标准内容 Brief', 'Brief 必须包含：目标受众、单一沟通目标、必拍镜头、必讲信息、禁用表达、交付规格、披露要求与授权范围。', 'SRC-003'],
      ['Claim 安全边界与披露要求', cd.sku === 'NUV-SP-07' ? '仅使用已完成证据映射的 Claim；禁止疾病治疗、保证效果与绝对化表述；合作内容必须按平台规则披露。' : '仅表达产品资料支持的功能事实；体验感受使用第一人称；禁止治疗、保证效果和绝对化表述，并按平台规则披露合作。', 'SRC-003'],
      ['合作模式、预算配置与测算假设', '结合固定费、寄样与佣金三种模式，总预算 ' + cd.budget + '，当前已使用 ' + cd.spent + '。所有 CPV / CPA 预测均为测算假设，不作为结果承诺。', ''],
      ['执行排期、负责人与审批门', cd.window + '。寄样、初稿、合规审核、发布与素材回收分别设置明确截止时间；所有外发内容须在发布前通过品牌与合规审批。', ''],
      ['KPI、归因与数据回收', '核心 KPI 包括交付完成率、有效播放、互动质量、点击与可复用素材数。使用折扣码与 UTM 短链回收渠道数据，并标注归因置信度。', ''],
      ['A/B 测试与学习计划', '对比不同开头、场景与表达自由度；每组达到最低样本量后再做结论，并把胜出角度写回下一轮策略和 Brief。', 'SRC-005'],
      ['优质素材复用与付费放大', '达到完播与互动阈值、且已取得广告授权的素材进入白名单投放；按 Hook、场景、红人类型与渠道建立可复用标签。', ''],
      ['风险清单与应急预案', '功效表述违规则下架重剪；交付逾期由备选红人池补位；库存或物流异常时暂停铺量并调整排期。', ''],
      ['缺失信息、假设及待确认项', cd.sku === 'NUV-SP-07' ? '第三方检测与 Claim 证据仍待补齐；完成前保持 HOLD，不开启红人外联或内容排期。' : '持续确认库存、授权范围、平台归因能力与审批 SLA；未确认项在执行前不得视为既定事实。', '']
    ];
    const campaignModeCount = { quick: 8, standard: 15, deep: 19 };
    const campaignModeName = { quick: '快速版', standard: '标准版', deep: '深度版' };
    const campaignStrategyExamples = cd.sku === 'AURA-LP-01' ? {
      3: { title: 'Aura Q3 北美红人种草策略', audience: '25–34 岁租房与家居氛围兴趣人群', message: '用“回家后切换状态”的真实场景建立产品记忆点', objective: '红人种草', mode: 'standard', confirmed: 6, date: '2026-08-26' },
      2: { title: 'Aura 家居氛围内容策略', audience: '家居美学、卧室改造与慢生活受众', message: '围绕一平米空间改造，展示灯光带来的氛围变化', objective: '内容场景验证', mode: 'standard', confirmed: 15, date: '2026-07-18' },
      1: { title: 'Aura 新品启动策略', audience: '首批家居好物尝新人群', message: '用开箱、布置前后对比和真实夜间场景完成新品认知', objective: '新品认知', mode: 'quick', confirmed: 8, date: '2026-06-05' }
    } : {};
    const makeCampaignSections = (row, mode) => {
      const count = campaignModeCount[mode] || 15;
      if (row && Array.isArray(row.sections) && row.sections.length) {
        return campaignStrategySectionBank.slice(0, count).map(([title, body, src], i) => {
          const sec = row.sections[i];
          return { no: i + 1, title: sec && sec.title ? sec.title : title, body: sec && sec.body ? sec.body : body, src: sec && sec.src ? sec.src : src };
        });
      }
      return campaignStrategySectionBank.slice(0, count).map(([title, body, src], i) => {
        if (!row) return { no: i + 1, title, body, src };
        const legacy = i === 0 ? (row.title ? String(row.title).replace(/ · v\d+$/, '') + '。' + body : body)
          : i === 1 && row.objective ? '主目标为' + row.objective + '。' + body
          : i === 2 && row.audience ? row.audience + '。' + body
          : i === 4 && row.message ? row.message + '。' + body
          : body;
        return { no: i + 1, title, body: legacy, src };
      });
    };
    const campaignStrategyOptions = (() => {
      const count = Math.max(campaignLibraryRec ? campaignLibraryRec.ver : 0, campaignSavedStrategies.reduce((m, x) => Math.max(m, x.ver), 0));
      const rows = [];
      for (let v = count; v >= 1; v -= 1) {
        if ((s.strategyVersionDeleted || []).includes(cd.sku + '|v' + v)) continue;
        const saved = campaignSavedStrategies.find(x => x.ver === v);
        const example = campaignStrategyExamples[v];
        const approval = (s.strategyApproved || {})[cd.sku + '|v' + v] || (v === count ? '草稿' : '已通过');
        rows.push(saved || (example ? {
          ...example, sku: cd.sku, ver: v, status: approval, source: 'Strategy Studio'
        } : {
          sku: cd.sku, ver: v, title: cd.product + ' 红人种草策略', audience: cd.sku === 'LUM-AR-02' ? '居家氛围与慢生活人群' : '头皮护理与自我照护人群',
          message: cd.sku === 'LUM-AR-02' ? '用真实空间改造展示氛围变化' : '从日常疲惫切入，呈现真实放松体验', objective: cd.objective,
          mode: campaignLibraryRec ? campaignLibraryRec.mode : 'standard', confirmed: campaignLibraryRec && v === count ? campaignLibraryRec.confirmed : 0,
          date: campaignLibraryRec ? campaignLibraryRec.date : '2026-08-20', status: approval, source: 'Strategy Studio'
        }));
      }
      if (!rows.length) return [];
      const appliedKey = (s.campaignStrategyApplied || {})[cd.sku];
      const selectedKey = (s.campaignStrategySelected || {})[cd.sku] || (typeof appliedKey === 'string' ? appliedKey : '') || (cd.sku + '|v' + rows[0].ver);
      return rows.map(row => {
        const key = cd.sku + '|v' + row.ver;
        const on = key === selectedKey;
        const customName = (s.strategyVersionNames || {})[key] || '';
        const approval = (s.strategyApproved || {})[key] || row.status || (row.ver === rows[0].ver ? '草稿' : '已通过');
        const tone = approval === '已通过' ? ['#E4EFE4', '#4E7156'] : (approval === '待审批' ? ['#FBEEDA', '#A5762C'] : ['#F5F8FE', '#647187']);
        return {
          ...row, key, status: approval, rawTitle: row.title, title: (customName || row.title) + ' · v' + row.ver,
          meta: (row.date || '2026-08-20') + ' · ' + (row.source || 'Strategy Studio') + (row.ver === rows[0].ver ? ' · 最新' : ''),
          summary: (campaignModeName[row.mode] || '标准版') + ' · ' + ((row.sections && row.sections.length) || campaignModeCount[row.mode] || 15) + ' 章策略正文',
          bg: on ? '#F7F9FF' : '#FFFFFF', bd: on ? '#2457F5' : '#E2E8F2', radioBg: on ? '#2457F5' : '#FFFFFF', radioBd: on ? '#2457F5' : '#C8D4E8', mark: on ? '✓' : '',
          statusBg: tone[0], statusFg: tone[1], pick: () => this.setState(st2 => ({
            campaignStrategySelected: { ...(st2.campaignStrategySelected || {}), [cd.sku]: key },
            campaignStrategyApplied: { ...(st2.campaignStrategyApplied || {}), [cd.sku]: key },
            campaignStrategyMode: '', campaignStrategyMenu: false,
            campaignStrategyNotice: row.title + ' · v' + row.ver + ' 已生效。'
          }))
        };
      });
    })();
    const campaignStrategyAppliedKey = (s.campaignStrategyApplied || {})[cd.sku];
    const campaignStrategySelectedKey = (s.campaignStrategySelected || {})[cd.sku] || (typeof campaignStrategyAppliedKey === 'string' ? campaignStrategyAppliedKey : '') || (campaignStrategyOptions[0] && campaignStrategyOptions[0].key) || '';
    const campaignStrategySelectedRow = campaignStrategyOptions.find(x => x.key === campaignStrategySelectedKey) || campaignStrategyOptions[0];
    const campaignSelectedMode = (campaignStrategySelectedRow && campaignStrategySelectedRow.mode) || 'standard';
    const campaignSelectedSections = makeCampaignSections(campaignStrategySelectedRow, campaignSelectedMode);
    const campaignSelectedConfirmed = Math.min((campaignStrategySelectedRow && campaignStrategySelectedRow.confirmed) || 0, campaignSelectedSections.length);
    const campaignSectionEdits = s.campaignStrategySectionEdits || {};
    const campaignSectionRegen = s.campaignStrategySectionRegen || {};
    const campaignSectionLocked = s.campaignStrategySectionLocked || {};
    const campaignSectionConfirmed = s.campaignStrategySectionConfirmed || {};
    const campaignRegenNotes = [
      '本次更新已结合当前 Campaign 的目标人群、渠道节奏与预算约束。',
      '本次更新已根据最新红人组合与执行反馈重新校准。',
      '本次更新补充了可执行动作、验证指标与风险边界。'
    ];
    const campaignStrategyGroups = [['目标与洞察', 1, 4], ['主张与平台', 5, 6], ['红人与内容', 7, 11], ['商业与执行', 12, 15], ['学习与风险', 16, 19]].map(([title, a, b]) => {
      const items = campaignSelectedSections.filter(x => x.no >= a && x.no <= b).map(sec => {
        const key = (campaignStrategySelectedRow ? campaignStrategySelectedRow.key : cd.sku) + '|s' + sec.no;
        const edited = Object.prototype.hasOwnProperty.call(campaignSectionEdits, key);
        const locked = !!campaignSectionLocked[key];
        const confirmed = Object.prototype.hasOwnProperty.call(campaignSectionConfirmed, key) ? !!campaignSectionConfirmed[key] : sec.no <= campaignSelectedConfirmed;
        const editing = s.campaignStrategySectionEditing === key;
        const bumped = campaignSectionRegen[key] || 0;
        const body = edited ? campaignSectionEdits[key] : sec.body;
        const stateMeta = confirmed ? ['已确认', '#4E7156', '#E4EFE4'] : (edited ? ['已编辑 · 待确认', '#A5762C', '#FBEEDA'] : ['AI 草稿', '#1D48D8', '#F1F5FF']);
        return {
          ...sec, key, body, anchor: 'campaign-strategy-sec-' + sec.no, hasSrc: !!sec.src,
          editing, notEditing: !editing, locked, ver: 'v' + (((campaignStrategySelectedRow && Number(campaignStrategySelectedRow.ver)) || 1) + bumped),
          stateText: stateMeta[0], stateFg: stateMeta[1], stateBg: stateMeta[2],
          numBg: confirmed ? '#E4EFE4' : '#F5F8FE', numFg: confirmed ? '#4E7156' : '#8792A5',
          cardBd: editing ? '#8CAFFF' : (confirmed ? '#CFE3D3' : '#EEF2F8'),
          editFg: locked ? '#B7C0CF' : '#647187', editCursor: locked ? 'default' : 'pointer',
          regenFg: locked ? '#B7C0CF' : '#647187', regenCursor: locked ? 'default' : 'pointer',
          lockLabel: locked ? '解除锁定' : '锁定', lockBg: locked ? '#F5F8FE' : '#FFFFFF', lockFg: locked ? '#1D2638' : '#8792A5', lockBd: locked ? '#C8D4E8' : '#E2E8F2',
          confirmLabel: confirmed ? '✓ 已确认' : '确认', confirmBg: confirmed ? '#E4EFE4' : '#2457F5', confirmFg: confirmed ? '#4E7156' : '#FFFFFF', confirmBd: confirmed ? '#CFE3D3' : '#2457F5',
          startEdit: () => { if (locked) return; this.setState({ campaignStrategySectionEditing: key, campaignStrategySectionDraft: body }); },
          saveEdit: () => { if (locked || !String(s.campaignStrategySectionDraft || '').trim()) return; this.setState(st2 => ({ campaignStrategySectionEditing: '', campaignStrategySectionDraft: '', campaignStrategySectionEdits: { ...(st2.campaignStrategySectionEdits || {}), [key]: st2.campaignStrategySectionDraft }, campaignStrategySectionRegen: { ...(st2.campaignStrategySectionRegen || {}), [key]: bumped + 1 }, campaignStrategySectionConfirmed: { ...(st2.campaignStrategySectionConfirmed || {}), [key]: false } })); },
          cancelEdit: () => this.setState({ campaignStrategySectionEditing: '', campaignStrategySectionDraft: '' }),
          regen: () => { if (locked) return; const nextBump = bumped + 1; this.setState(st2 => ({ campaignStrategySectionEditing: '', campaignStrategySectionDraft: '', campaignStrategySectionEdits: { ...(st2.campaignStrategySectionEdits || {}), [key]: sec.body + ' ' + campaignRegenNotes[(sec.no + nextBump) % campaignRegenNotes.length] }, campaignStrategySectionRegen: { ...(st2.campaignStrategySectionRegen || {}), [key]: nextBump }, campaignStrategySectionConfirmed: { ...(st2.campaignStrategySectionConfirmed || {}), [key]: false } })); },
          toggleLock: () => this.setState(st2 => ({ campaignStrategySectionEditing: st2.campaignStrategySectionEditing === key ? '' : st2.campaignStrategySectionEditing, campaignStrategySectionDraft: st2.campaignStrategySectionEditing === key ? '' : st2.campaignStrategySectionDraft, campaignStrategySectionLocked: { ...(st2.campaignStrategySectionLocked || {}), [key]: !locked } })),
          toggleConfirm: () => this.setState(st2 => ({ campaignStrategySectionConfirmed: { ...(st2.campaignStrategySectionConfirmed || {}), [key]: !confirmed } }))
        };
      });
      return { title, items, count: items.length + ' 章', has: items.length > 0 };
    }).filter(x => x.has);
    const campaignStrategyToc = campaignSelectedSections.map(sec => ({ no: sec.no, title: sec.title, pick: () => { const el = document.getElementById('campaign-strategy-sec-' + sec.no); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }));
	    const strategyDraft = s.campaignStrategyDraft || {};
	    const campaignDraftProduct = skuAll.find(x => x.sku === cd.sku) || {};
	    const campaignDraftInputValues = s.campaignStrategyDraftInputs || {};
	    const campaignDraftDefaults = {
	      brandPosition: (campaignDraftProduct.brand || 'Aura') + ' · ' + cd.product + ' 在本次 Campaign 中承担核心产品角色',
	      productName: cd.product || '—', sku: cd.sku || '—', asin: campaignDraftProduct.asin || '待补充',
	      productFacts: '产品规格、材质与 Listing 参数保持一致', actualUse: '围绕真实使用场景进行体验表达', effectClaim: '', testReport: '',
	      audience: cd.sku === 'LUM-AR-02' ? '注重居家氛围的 25–44 岁人群' : '高压、重视自我照护的 25–34 岁消费者',
	      painPoint: cd.sku === 'LUM-AR-02' ? '有限空间也需要低成本氛围升级' : '日常压力与护理流程缺少可感知的放松时刻',
	      useScene: cd.sku === 'LUM-AR-02' ? '卧室、租房与晚间氛围改造' : '睡前 routine、居家护理与短暂放松', personaExclusion: '',
	      objective: cd.objective || '红人种草', successKpi: '完播率、互动率、有效素材数与转化效率', targetGmv: '', brandLift: '',
	      market: 'US', primaryPlatform: 'Instagram / TikTok', contentLanguage: 'English', localTaboos: '',
	      creatorMix: 'KOC 60% · Micro 30% · Expert 10%', creatorCriteria: '内容真实、场景匹配、近 30 天互动稳定', exclusionRules: '排除刷量、竞品强绑定与高风险历史账号', creatorPool: cd.creators ? cd.creators + ' 位候选红人' : '',
	      budget: cd.budget || '待分配', schedule: cd.window || '未排期', usageRights: '需确认投放授权与二次剪辑范围', paymentTerms: '',
	      pastData: cd.spent && cd.spent !== '$0' ? '当前已花费 ' + cd.spent : '', benchmark: '参考同品类近 90 天高完播内容', competitorCases: '', learnings: '优先使用已验证的场景化叙事与自然口播'
	    };
	    const campaignDraftValue = key => campaignDraftInputValues[key] !== undefined ? campaignDraftInputValues[key] : (campaignDraftDefaults[key] || '');
	    const campaignDraftModuleDefs = [
	      ['产品与品牌', [['brandPosition','品牌定位','SRC-001 Campaign 与产品资料'],['productName','产品名称','SRC-001 产品资料'],['sku','SKU','SRC-001 产品资料'],['asin','ASIN','SRC-002 产品参数表']]],
	      ['证据与合规', [['productFacts','规格与材质事实','SRC-002 产品参数表'],['actualUse','实际使用方式','SRC-002 产品参数表'],['effectClaim','使用效果表述',''],['testReport','第三方检测结论','']]],
	      ['目标消费者', [['audience','核心人群','SRC-003 Campaign Brief'],['painPoint','核心痛点','SRC-003 Campaign Brief'],['useScene','优先场景','SRC-004 历史洞察'],['personaExclusion','不适用人群','']]],
	      ['推广目标', [['objective','Campaign 目标','SRC-003 Campaign Brief'],['successKpi','成功标准','SRC-003 Campaign Brief'],['targetGmv','目标 GMV',''],['brandLift','品牌心智目标','']]],
	      ['平台与市场', [['market','目标市场','SRC-001 Campaign 设置'],['primaryPlatform','主要平台','SRC-003 Campaign Brief'],['contentLanguage','内容语言','SRC-001 Campaign 设置'],['localTaboos','本地化禁忌','']]],
	      ['红人资源与筛选', [['creatorMix','红人分层组合','SRC-004 历史洞察'],['creatorCriteria','筛选评分标准','SRC-004 历史洞察'],['exclusionRules','淘汰规则','SRC-004 历史洞察'],['creatorPool','候选红人池','SRC-005 CRM']]],
	      ['商业与执行约束', [['budget','预算配置','SRC-001 Campaign 设置'],['schedule','执行排期','SRC-001 Campaign 设置'],['usageRights','内容授权范围','SRC-003 Campaign Brief'],['paymentTerms','报价与付款条件','']]],
	      ['现有数据与参考案例', [['pastData','已有投放数据','SRC-006 Campaign 数据'],['benchmark','效果基准','SRC-004 历史洞察'],['competitorCases','竞品标杆案例',''],['learnings','可复用经验','SRC-004 历史洞察']]]
	    ];
	    const campaignDraftModules = campaignDraftModuleDefs.map((def, idx) => {
	      const fields = def[1].map(([key, label, src]) => ({
	        key, label, src, value: campaignDraftValue(key), hasSrc: !!src,
	        set: (e) => { const value = e.target.value; this.setState(st2 => ({ campaignStrategyDraftInputs: { ...(st2.campaignStrategyDraftInputs || {}), [key]: value } })); }
	      }));
	      const complete = fields.filter(x => String(x.value || '').trim()).length;
	      const pct = Math.round(complete / fields.length * 100);
	      return { no: idx + 1, name: def[0], fields, pct, pctText: pct + '%', dot: pct >= 100 ? '#6E9878' : (pct >= 50 ? '#D59B42' : '#C96973') };
	    });
	    const campaignDraftActiveModule = campaignDraftModules[Math.max(0, Math.min(7, Number(s.campaignStrategyDraftInputStep || 1) - 1))] || campaignDraftModules[0];
	    const campaignDraftEvidence = [
	      ['规格与材质事实', 'productFacts', 'SRC-002 产品参数表'], ['实际使用方式', 'actualUse', 'SRC-002 产品参数表'],
	      ['使用效果表述', 'effectClaim', '无来源支持'], ['第三方检测结论', 'testReport', '无来源支持']
	    ].map(([claim, key, source]) => {
	      const ok = !!String(campaignDraftValue(key) || '').trim();
	      return { claim, source: ok ? source : '无来源支持', tag: ok ? '有证据' : '无证据', bg: ok ? '#E4EFE4' : '#FBE3E3', color: ok ? '#4E7156' : '#C4636D' };
	    });
	    const campaignDraftRequired = [
	      ['personaExclusion','不适用人群',3],['effectClaim','Claim—证据映射',2],['testReport','第三方检测报告',2],['targetGmv','目标 GMV',4],
	      ['brandLift','品牌心智目标',4],['localTaboos','本地化禁忌',5],['paymentTerms','报价与付款条件',7],['competitorCases','竞品标杆案例',8]
	    ];
	    const campaignDraftMissing = campaignDraftRequired.filter(([key]) => !String(campaignDraftValue(key) || '').trim()).map(([key, label, step]) => ({ key, label, go: () => this.setState({ campaignStrategyDraftTab: 'input', campaignStrategyDraftInputStep: step }) }));
	    const strategyDraftReady = String(strategyDraft.title || '').trim() && Array.isArray(strategyDraft.sections) && strategyDraft.sections.length && strategyDraft.sections.every(sec => String(sec.body || '').trim());
    const startStrategyDraft = (mode) => {
      const base = mode === 'edit' && campaignStrategySelectedRow ? campaignStrategySelectedRow : null;
      const draftMode = base ? (base.mode || 'standard') : 'standard';
      this.setState({
        campaignStrategyMode: mode, campaignStrategyMenu: false, campaignStrategyConfirmModal: false, campaignStrategyDraftGenerated: '', campaignStrategyNotice: '',
        campaignStrategyDraftTab: 'input', campaignStrategyDraftInputStep: 1, campaignStrategyDraftInputs: {},
        campaignStrategyDraftLocked: [], campaignStrategyDraftConfirmed: [], campaignStrategyDraftRegen: {}, campaignStrategyDraftEditing: null, campaignStrategyDraftSectionDraft: '',
        campaignStrategyDraft: {
          title: base ? (base.rawTitle || String(base.title).replace(/ · v\d+$/, '')) : cd.product + ' 新策略',
          mode: draftMode, sections: makeCampaignSections(base, draftMode)
        }
      });
    };
    const campaignStrategyDraftModes = ['quick', 'standard', 'deep'].map(id => ({ id, label: campaignModeName[id], note: id === 'quick' ? '核心策略与行动清单' : (id === 'standard' ? '完整策略 · 红人组合 · 内容矩阵 · 预算 KPI' : '增加实验设计 · 风险与资产放大'), bg: strategyDraft.mode === id ? '#EAF0FF' : '#FFFFFF', fg: strategyDraft.mode === id ? '#1D48D8' : '#647187', bd: strategyDraft.mode === id ? '#8CAFFF' : '#E2E8F2', pick: () => this.setState(st2 => ({ campaignStrategyDraftGenerated: '', campaignStrategyDraftLocked: [], campaignStrategyDraftConfirmed: [], campaignStrategyDraftRegen: {}, campaignStrategyDraftEditing: null, campaignStrategyDraftSectionDraft: '', campaignStrategyDraft: { ...(st2.campaignStrategyDraft || {}), mode: id, sections: makeCampaignSections({ sections: st2.campaignStrategyDraft.sections }, id) } })) }));
    const campaignStrategyDraftGroups = [['目标与洞察', 1, 4], ['主张与平台', 5, 6], ['红人与内容', 7, 11], ['商业与执行', 12, 15], ['学习与风险', 16, 19]].map(([title, a, b]) => {
      const items = (strategyDraft.sections || []).filter(x => x.no >= a && x.no <= b).map(sec => {
        const locked = (s.campaignStrategyDraftLocked || []).includes(sec.no);
        const confirmed = (s.campaignStrategyDraftConfirmed || []).includes(sec.no);
        const editing = s.campaignStrategyDraftEditing === sec.no;
        const bumped = (s.campaignStrategyDraftRegen || {})[sec.no] || 0;
        const stateMeta = confirmed ? ['已确认', '#4E7156', '#E4EFE4'] : (bumped ? ['已编辑 · 待确认', '#A5762C', '#FBEEDA'] : ['AI 草稿', '#1D48D8', '#F1F5FF']);
        return {
          ...sec, anchor: 'campaign-draft-sec-' + sec.no, editing, notEditing: !editing, locked, ver: 'v' + (1 + bumped),
          stateText: stateMeta[0], stateFg: stateMeta[1], stateBg: stateMeta[2], cardBd: editing ? '#8CAFFF' : (confirmed ? '#CFE3D3' : '#EEF2F8'),
          numBg: confirmed ? '#E4EFE4' : '#F5F8FE', numFg: confirmed ? '#4E7156' : '#8792A5',
          editFg: locked ? '#B7C0CF' : '#647187', editCursor: locked ? 'default' : 'pointer', regenFg: locked ? '#B7C0CF' : '#647187', regenCursor: locked ? 'default' : 'pointer',
          lockLabel: locked ? '解除锁定' : '锁定', lockBg: locked ? '#F5F8FE' : '#FFFFFF', lockFg: locked ? '#1D2638' : '#8792A5', lockBd: locked ? '#C8D4E8' : '#E2E8F2',
          confirmLabel: confirmed ? '✓ 已确认' : '确认', confirmBg: confirmed ? '#E4EFE4' : '#2457F5', confirmFg: confirmed ? '#4E7156' : '#FFFFFF', confirmBd: confirmed ? '#CFE3D3' : '#2457F5',
          startEdit: () => { if (locked) return; this.setState({ campaignStrategyDraftEditing: sec.no, campaignStrategyDraftSectionDraft: sec.body }); },
          saveEdit: () => { if (locked || !String(s.campaignStrategyDraftSectionDraft || '').trim()) return; const value = s.campaignStrategyDraftSectionDraft; this.setState(st2 => ({ campaignStrategyDraftEditing: null, campaignStrategyDraftSectionDraft: '', campaignStrategyDraftConfirmed: (st2.campaignStrategyDraftConfirmed || []).filter(x => x !== sec.no), campaignStrategyDraftRegen: { ...(st2.campaignStrategyDraftRegen || {}), [sec.no]: bumped + 1 }, campaignStrategyDraft: { ...(st2.campaignStrategyDraft || {}), sections: (st2.campaignStrategyDraft.sections || []).map(x => x.no === sec.no ? { ...x, body: value } : x) } })); },
          cancelEdit: () => this.setState({ campaignStrategyDraftEditing: null, campaignStrategyDraftSectionDraft: '' }),
          regen: () => { if (locked) return; const value = String(sec.body || '').replace(/ 本次更新(?:已|补充).*$/, '') + ' ' + campaignRegenNotes[(sec.no + bumped + 1) % campaignRegenNotes.length]; this.setState(st2 => ({ campaignStrategyDraftEditing: null, campaignStrategyDraftSectionDraft: '', campaignStrategyDraftConfirmed: (st2.campaignStrategyDraftConfirmed || []).filter(x => x !== sec.no), campaignStrategyDraftRegen: { ...(st2.campaignStrategyDraftRegen || {}), [sec.no]: bumped + 1 }, campaignStrategyDraft: { ...(st2.campaignStrategyDraft || {}), sections: (st2.campaignStrategyDraft.sections || []).map(x => x.no === sec.no ? { ...x, body: value } : x) } })); },
          toggleLock: () => this.setState(st2 => ({ campaignStrategyDraftEditing: st2.campaignStrategyDraftEditing === sec.no ? null : st2.campaignStrategyDraftEditing, campaignStrategyDraftSectionDraft: st2.campaignStrategyDraftEditing === sec.no ? '' : st2.campaignStrategyDraftSectionDraft, campaignStrategyDraftLocked: locked ? (st2.campaignStrategyDraftLocked || []).filter(x => x !== sec.no) : [...(st2.campaignStrategyDraftLocked || []), sec.no] })),
          toggleConfirm: () => this.setState(st2 => ({ campaignStrategyDraftConfirmed: confirmed ? (st2.campaignStrategyDraftConfirmed || []).filter(x => x !== sec.no) : [...(st2.campaignStrategyDraftConfirmed || []), sec.no] }))
        };
      });
      return { title, items, count: items.length + ' 章', has: items.length > 0 };
    }).filter(x => x.has);
    const campaignStrategyDraftToc = (strategyDraft.sections || []).map(sec => ({ no: sec.no, title: sec.title, pick: () => { const el = document.getElementById('campaign-draft-sec-' + sec.no); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }));
    const saveCampaignStrategyDraft = (submitAfter) => {
      if (!strategyDraftReady) return;
      this.setState(st2 => {
        const draft = st2.campaignStrategyDraft || {};
        const rec = (st2.library || []).find(x => x.sku === cd.sku);
        const customMax = (st2.campaignStrategyVersions || []).filter(x => x.sku === cd.sku).reduce((m, x) => Math.max(m, x.ver), 0);
        const nextVer = Math.max(rec ? rec.ver : 0, customMax) + 1;
        const product = skuAll.find(x => x.sku === cd.sku) || {};
        const draftMode = draft.mode || 'standard';
        const savedSections = makeCampaignSections({ sections: draft.sections }, draftMode).map(sec => ({ no: sec.no, title: sec.title, body: String(sec.body || '').trim(), src: sec.src || '' }));
        const saved = { sku: cd.sku, product: cd.product, brand: product.brand || '—', owner: product.owner || 'Helen', ver: nextVer, title: String(draft.title).trim(), mode: draftMode, sections: savedSections, confirmed: 0, date: '2026-09-07', status: submitAfter ? '待审批' : '草稿', source: st2.campaignStrategyMode === 'edit' ? '基于历史版本编辑' : 'Campaign 新增' };
        const nextLibrary = rec
          ? (st2.library || []).map(x => x.sku === cd.sku ? { ...x, ver: nextVer, date: '2026-09-07', mode: draftMode, status: 'draft', sections: savedSections.length, confirmed: 0 } : x)
          : [{ sku: cd.sku, name: cd.product, brand: product.brand || '—', owner: product.owner || 'Helen', date: '2026-09-07', mode: draftMode, ver: nextVer, status: 'draft', sections: savedSections.length, confirmed: 0 }, ...(st2.library || [])];
        const key = cd.sku + '|v' + nextVer;
        return {
          campaignStrategyVersions: [saved, ...(st2.campaignStrategyVersions || [])], library: nextLibrary,
          campaignStrategySelected: { ...(st2.campaignStrategySelected || {}), [cd.sku]: key },
          campaignStrategyApplied: submitAfter ? { ...(st2.campaignStrategyApplied || {}), [cd.sku]: key } : st2.campaignStrategyApplied,
          strategyApproved: submitAfter ? { ...(st2.strategyApproved || {}), [key]: '待审批' } : st2.strategyApproved,
	          campaignStrategyMode: '', campaignStrategyConfirmModal: false, campaignStrategyDraftGenerated: '', campaignStrategyDraftTab: 'input', campaignStrategyDraftInputStep: 1, campaignStrategyDraftInputs: {},
          campaignStrategyDraft: { title: '', mode: 'standard', sections: [] },
          campaignStrategyDraftLocked: [], campaignStrategyDraftConfirmed: [], campaignStrategyDraftRegen: {}, campaignStrategyDraftEditing: null, campaignStrategyDraftSectionDraft: '',
          campaignStrategyNotice: submitAfter
            ? '已保存为 v' + nextVer + '，同步存入 Strategy Studio，并提交当前 Campaign 审核。'
            : '已保存为 v' + nextVer + '，并同步存入 Strategy Studio 策略库。'
        };
      });
    };
    const selectedBriefChannels = s.campaignBriefChannels || [];
    const selectedBriefCreators = s.campaignBriefCreators || [];
    const campaignBriefCreatorQuery = (s.campaignBriefCreatorQuery || '').trim().toLowerCase();
    const campaignBriefChannelsOf = c => creatorChannelsMap[c.handle] || [c.platform === 'INSTAGRAM' ? 'Instagram' : (c.platform === 'YOUTUBE' ? 'YouTube' : 'TikTok')];
    const campaignBriefPlatformBadge = label => ({ label, logo: label === 'Instagram' ? '../logos/instagram.svg' : (label === 'YouTube' ? '../logos/youtube.svg' : '../logos/tiktok.svg') });
    const campaignBriefCreatorMatches = creatorDefs.filter(c => !campaignBriefCreatorQuery || [c.handle, c.niche, c.country, ...campaignBriefChannelsOf(c)].join(' ').toLowerCase().includes(campaignBriefCreatorQuery));
    const campaignBriefAccountCount = creatorDefs.reduce((n, c) => n + campaignBriefChannelsOf(c).length, 0);
    const bStudioSelectedCreators = Array.isArray(s.briefStudioCreators) ? s.briefStudioCreators : [];
    const bStudioCreatorQuery = String(s.briefStudioCreatorQuery || '').trim().toLowerCase();
    const bStudioCreatorMatches = creatorDefs.filter(c => !bStudioCreatorQuery || [c.handle, c.niche, c.country, ...campaignBriefChannelsOf(c)].join(' ').toLowerCase().includes(bStudioCreatorQuery));
    const campaignBriefKeyOf = b => [b.sku, b.platform, b.mode || 'channel', b.creator || '', b.segment || '', b.ver, b.date].join('|');
    const campaignBriefStyleOf = creator => {
      const niche = String((creator && creator.niche) || '通用体验');
      if (/头皮|发型|美发/.test(niche)) return '专业头皮护理';
      if (/夜间|睡前|自我照护|助眠|放松|香氛/.test(niche)) return '夜间自我照护';
      if (/生活方式|家居|家庭/.test(niche)) return '生活方式场景';
      if (/男士|理容/.test(niche)) return '男士理容测评';
      return niche.split('/')[0].trim() || '通用体验';
    };
    const campaignBriefTemplateMap = new Map();
    selectedBriefCreators.forEach(handle => {
      const creator = creatorDefs.find(x => x.handle === handle);
      if (!creator) return;
      const styleType = campaignBriefStyleOf(creator);
      selectedBriefChannels.filter(channel => campaignBriefChannelsOf(creator).includes(channel)).forEach(channel => {
        const key = channel + '|' + styleType;
        if (!campaignBriefTemplateMap.has(key)) campaignBriefTemplateMap.set(key, { channel, styleType, creators: [] });
        campaignBriefTemplateMap.get(key).creators.push(handle);
      });
    });
    const campaignBriefTemplateDefs = Array.from(campaignBriefTemplateMap.values());
    const campaignBriefEstimate = campaignBriefTemplateDefs.length;
    const campaignBriefRawVersions = bvLive.filter(b => b.sku === cd.sku);
    const campaignBriefVersions = [];
    campaignBriefRawVersions.forEach(b => {
      const sourceKey = campaignBriefKeyOf(b);
      const handles = Array.from(new Set(b.creators && b.creators.length ? b.creators : (b.creator ? [b.creator] : [])));
      if (b.mode === 'style' && handles.length) {
        handles.forEach(handle => campaignBriefVersions.push({ ...b, mode: 'creator', creator: handle, creators: [handle], segment: '', viewKey: sourceKey + '|creator|' + handle, sourceKeys: [sourceKey] }));
        return;
      }
      campaignBriefVersions.push({ ...b, viewKey: sourceKey, sourceKeys: [sourceKey] });
    });
    const campaignBriefTab = s.campaignBriefListTab === 'creator' ? 'creator' : 'channel';
    const campaignBriefTabVersions = campaignBriefVersions.filter(b => campaignBriefTab === 'creator' ? b.mode === 'creator' : b.mode !== 'creator');
    const campaignBriefSelected = campaignBriefTabVersions.find(b => b.viewKey === s.campaignBriefSelectedKey || (b.sourceKeys || []).includes(s.campaignBriefSelectedKey)) || campaignBriefTabVersions[0] || null;
    const campaignBriefSelectedKey = campaignBriefSelected ? campaignBriefSelected.viewKey : '';
    const campaignBriefCanSubmit = !!campaignBriefSelected && campaignBriefSelected.status === '草稿';
    const campaignBriefRows = campaignBriefVersions.map((b, i) => {
      const tone = b.status === '已通过' ? ['#E4EFE4', '#4E7156'] : (b.status === '待审批' ? ['#FBEEDA', '#A5762C'] : ['#E4EEF7', '#1D48D8']);
      const key = b.viewKey;
      const viewed = key === campaignBriefSelectedKey;
      const on = viewed;
      return {
        briefType: b.mode === 'creator' ? 'creator' : 'channel',
        channelShort: b.platform === 'Instagram' ? 'IG' : (b.platform === 'YouTube' ? 'YT' : 'TT'),
        title: b.platform + ' · ' + (b.segment || b.creator || '渠道通用版') + ' · ' + b.ver,
        meta: b.date + ' · ' + (b.mode === 'creator' ? '基于具体红人生成' : '基于渠道生成') + ' · 已迭代 ' + b.iter + ' 次',
        status: b.status, bg: tone[0], fg: tone[1],
        rowBg: on ? '#F7F9FF' : '#FFFFFF', rowBd: on ? '#2457F5' : 'transparent', shadow: on ? '0 2px 8px rgba(36,87,245,.08)' : 'none',
        iconBg: on ? '#2457F5' : '#EAF0FF', iconFg: on ? '#FFFFFF' : '#2457F5', titleFg: on ? '#1D48D8' : '#1D2638', viewFg: on ? '#2457F5' : '#A2ABBA',
        viewLabel: viewed ? '正在查看' : '点击查看', cursor: 'pointer', select: () => this.setState({ campaignBriefSelectedKey: key, campaignBriefAdjustDraft: '', campaignBriefNotice: '' })
      };
    });
    const campaignBriefChannelRows = campaignBriefRows.filter(b => b.briefType === 'channel');
    const campaignBriefCreatorRows = campaignBriefRows.filter(b => b.briefType === 'creator');
    const campaignBriefVisibleRows = campaignBriefTab === 'creator' ? campaignBriefCreatorRows : campaignBriefChannelRows;
    const campaignBriefTabs = [
      { id: 'channel', label: '渠道 Brief', count: campaignBriefChannelRows.length, bg: campaignBriefTab === 'channel' ? '#2457F5' : '#FFFFFF', fg: campaignBriefTab === 'channel' ? '#FFFFFF' : '#647187', bd: campaignBriefTab === 'channel' ? '#2457F5' : '#D9E1EF', countBg: campaignBriefTab === 'channel' ? 'rgba(255,255,255,.18)' : '#F1F4F8', countFg: campaignBriefTab === 'channel' ? '#FFFFFF' : '#8792A5', pick: () => this.setState({ campaignBriefListTab: 'channel', campaignBriefSelectedKey: '', campaignBriefAdjustDraft: '', campaignBriefNotice: '' }) },
      { id: 'creator', label: '红人 Brief', count: campaignBriefCreatorRows.length, bg: campaignBriefTab === 'creator' ? '#2457F5' : '#FFFFFF', fg: campaignBriefTab === 'creator' ? '#FFFFFF' : '#647187', bd: campaignBriefTab === 'creator' ? '#2457F5' : '#D9E1EF', countBg: campaignBriefTab === 'creator' ? 'rgba(255,255,255,.18)' : '#F1F4F8', countFg: campaignBriefTab === 'creator' ? '#FFFFFF' : '#8792A5', pick: () => this.setState({ campaignBriefListTab: 'creator', campaignBriefSelectedKey: '', campaignBriefAdjustDraft: '', campaignBriefNotice: '' }) }
    ];
    const submitCampaignBriefRecords = () => {
      if (!campaignBriefSelected) return;
      this.setState(st2 => {
        const approvals = { ...(st2.approvals || {}) };
        const selectedSourceKeys = campaignBriefSelected.sourceKeys && campaignBriefSelected.sourceKeys.length ? campaignBriefSelected.sourceKeys : [campaignBriefSelectedKey];
        const targetKeys = Array.from(new Set(selectedSourceKeys));
        const submitted = (st2.briefVersions || []).filter(b => targetKeys.includes(campaignBriefKeyOf(b)));
        submitted.forEach(b => { approvals[[b.sku, b.platform, b.ver, b.segment || b.creator || ''].join('|')] = { status: '待审批', comment: '', by: 'Campaign 提交' }; });
        return {
          briefVersions: (st2.briefVersions || []).map(b => targetKeys.includes(campaignBriefKeyOf(b)) ? { ...b, status: '待审批' } : b),
          approvals, campaignBriefNotice: '', campaignBriefNoticeKind: 'success'
        };
      });
    };

    const campaignBriefDetailCreator = campaignBriefSelected && campaignBriefSelected.creator ? creatorDefs.find(c => c.handle === campaignBriefSelected.creator) : null;
    const campaignBriefDetailProduct = skuAll.find(p => p.sku === cd.sku) || { brand: String(cd.product || '').split(' ')[0], category: '消费品' };
    const campaignBriefDetailPf = swProfiles[cd.sku] || swGenericPf(campaignBriefDetailProduct);
    const campaignBriefDetailTarget = campaignBriefSelected ? (campaignBriefSelected.creator || campaignBriefSelected.segment || '渠道通用版') : '';
    const campaignBriefDetailCreators = campaignBriefSelected ? (campaignBriefSelected.creators || (campaignBriefSelected.creator ? [campaignBriefSelected.creator] : [])) : [];
    const campaignBriefDetailScene = String(campaignBriefDetailPf.scene || '核心用户的真实日常场景').replace(/；/g, '，');
    const campaignBriefDetailDirection = campaignBriefSelected ? ({
      TikTok: '前 3 秒直接进入真实场景，用动作或结果建立继续观看的理由；保持口语表达，不照读脚本。',
      Instagram: '以有质感但不刻意摆拍的 Reels 呈现，保留环境氛围，并补充一张可进入主页 Grid 的静帧。',
      YouTube: '采用结论先行的实测结构，保留完整使用过程，并在标题中加入品类搜索关键词。'
    }[campaignBriefSelected.platform] || '从真实使用场景切入，用创作者自己的语言完成表达。') : '';
    const campaignBriefDetailSections = campaignBriefSelected ? [
      { label: 'CAMPAIGN 背景', isText: true, body: (campaignBriefDetailProduct.brand || cd.product) + ' 本轮 Campaign 围绕「' + cd.objective + '」推进。内容需要把产品自然放进用户日常，而不是拍成参数介绍或硬广。' },
      { label: '目标受众与沟通目标', isText: true, body: '面向对「' + campaignBriefDetailScene + '」有真实需求的人群，只传达一个核心信息：' + String(campaignBriefDetailPf.job || '产品能让这件事更轻松').replace(/^待补充：/, '') + '。' },
      { label: '本版本定向', isText: true, body: campaignBriefSelected.mode === 'style'
        ? '面向「' + campaignBriefDetailTarget + '」风格创作者生成，同一渠道共用此模板。适用红人：' + (campaignBriefDetailCreators.join('、') || '待匹配') + '。'
        : (campaignBriefDetailCreator
            ? '为 ' + campaignBriefDetailCreator.handle + ' 个性化生成。延续其「' + campaignBriefDetailCreator.niche + '」内容风格，参考账号数据：' + campaignBriefDetailCreator.followers + ' 粉丝、近 30 天 ER ' + campaignBriefDetailCreator.er30 + '、FIT ' + campaignBriefDetailCreator.fit + '。'
            : '面向「' + campaignBriefDetailTarget + '」生成，保留该人群熟悉的叙事方式与真实体验表达。') },
      { label: '创作方向 · ' + campaignBriefSelected.platform, isText: true, body: campaignBriefDetailDirection + (campaignBriefSelected.creatorStyle ? ' 内容风格参考：' + campaignBriefSelected.creatorStyle + '。' : '') + (campaignBriefSelected.prompt ? ' 补充要求：' + campaignBriefSelected.prompt + '。' : '') },
      { label: '具体怎么拍', isList: true, mark: '▸', dot: '#2457F5', items: [
        '开头：直接出现「' + campaignBriefDetailScene.split('，')[0] + '」的真实画面，不做品牌铺垫。',
        '展示：近景拍到产品本体、开启或使用瞬间，以及最能体现质感的局部细节。',
        '表达：用自己的说法讲清产品解决的具体任务，允许保留真实犹豫或轻微缺点。',
        '结尾：给出自然的下一步动作，带主页链接与专属折扣码。'
      ] },
      { label: '必须保留', isList: true, mark: '✓', dot: SAGE, items: ['产品出现在真实使用环境中，不单独摆拍', '核心卖点只讲一个，所有体验使用第一人称', '正文与视频内按平台规则标注 #ad 或 Paid partnership'] },
      { label: '不能出现', isList: true, mark: '✕', dot: RUST, items: ['医疗、治疗或保证效果类表达', '「立刻见效」「一次就有效」等时效承诺', '与竞品直接比较或提及竞品品牌名'] }
    ] : [];
    const campaignBriefDetailFoot = campaignBriefSelected ? [
      { label: '交付物', value: '1 条主视频 + 3 张静帧 + 原始素材' },
      { label: '时间节点', value: '寄样后 14 天内交初稿，修改 1 轮' },
      { label: '授权范围', value: '社媒 6 个月 + 白名单投放 3 个月' },
      { label: '追踪', value: '专属折扣码 + UTM 短链' }
    ] : [];
    const campaignBriefConfigKey = campaignBriefSelectedKey || 'campaign-brief';
    const campaignBriefConfigSourceKeys = campaignBriefSelected && campaignBriefSelected.sourceKeys && campaignBriefSelected.sourceKeys.length ? campaignBriefSelected.sourceKeys : (campaignBriefSelected ? [campaignBriefSelectedKey] : []);
    const campaignBriefNextNo = campaignBriefSelected ? campaignBriefVersions.filter(v => v.platform === campaignBriefSelected.platform && (v.mode || 'channel') === (campaignBriefSelected.mode || 'channel') && (v.segment || v.creator || '') === (campaignBriefSelected.segment || campaignBriefSelected.creator || '')).reduce((max, v) => Math.max(max, parseInt(String(v.ver || '').replace(/\D/g, ''), 10) || 0), 0) + 1 : 1;
    const campaignBriefSuggestionDefs = [
      { id: 'compliance', title: '补充一条时效类禁用词', body: '历史内容曾因「一次就见效」被平台限流，建议写进禁止表达。', insert: '禁止使用「一次就见效」「立刻有效」等时效承诺。', action: '写入 Brief', source: '合规 · 高优先' },
      { id: 'hook', title: '把 hook 要求从「必须」改为「参考」', body: '逐字要求会压低互动率，建议保留创作者的表达自由度。', insert: '开头 hook 作为参考结构，允许创作者按真实场景调整表达。', action: '采纳', source: '来自 Q2 复盘' },
      { id: 'style', title: '补充共用模板的自由发挥边界', body: '同渠道、同风格红人共用模板时，应明确哪些内容可自由发挥。', insert: '同风格创作者可调整场景、语气和叙事顺序，但核心卖点、合规表达与交付规格保持一致。', action: '补充', source: '红人风格模板' }
    ];
    const campaignBriefSuggestions = campaignBriefSuggestionDefs.map(def => {
      const stateKey = campaignBriefConfigKey + '|' + def.id;
      const done = (s.campaignBriefSuggestionDone || []).includes(stateKey);
      const ignored = (s.campaignBriefSuggestionIgnored || []).includes(stateKey);
      const handled = done || ignored;
      return {
        ...def, actionLabel: done ? '已采纳' : def.action, ignoreLabel: ignored ? '已忽略' : '忽略',
        actionBg: done ? '#E4EFE4' : '#2457F5', actionFg: done ? '#4E7156' : '#FFFFFF', cursor: handled ? 'default' : 'pointer',
        apply: () => {
          if (handled) return;
          this.setState(st2 => ({
            campaignBriefAdjustDraft: [String(st2.campaignBriefAdjustDraft || '').trim(), def.insert].filter(Boolean).join('\n'),
            campaignBriefSuggestionDone: [...(st2.campaignBriefSuggestionDone || []), stateKey]
          }));
        },
        ignore: () => {
          if (handled) return;
          this.setState(st2 => ({ campaignBriefSuggestionIgnored: [...(st2.campaignBriefSuggestionIgnored || []), stateKey] }));
        }
      };
    });
    const campaignBriefChecklistDefs = [
      ['deliverable', '交付物与时间节点已明确', true],
      ['dos', "Do / Don’t 已填写", true],
      ['compliance', '合规禁用词已确认', false],
      ['rights', '授权范围已与法务对齐', true]
    ];
    const campaignBriefConfigChecklist = campaignBriefChecklistDefs.map(([id, label, defaultOn]) => {
      const stateKey = campaignBriefConfigKey + '|' + id;
      const on = Object.prototype.hasOwnProperty.call(s.campaignBriefConfigChecks || {}, stateKey) ? !!s.campaignBriefConfigChecks[stateKey] : defaultOn;
      return { label, mark: on ? '✓' : '', bg: on ? '#6E9778' : '#FFFFFF', bd: on ? '#6E9778' : '#C8D4E8', fg: on ? '#334155' : '#8792A5', toggle: () => this.setState(st2 => ({ campaignBriefConfigChecks: { ...(st2.campaignBriefConfigChecks || {}), [stateKey]: !on } })) };
    });

	    const campaignDealHandles = ((s.campaignCoopDeals || {})[cd.sku] || []).filter(Boolean);
	    const campaignCooperationProps = (handle) => {
	      const cooperated = campaignDealHandles.indexOf(handle) >= 0;
	      const selected = (s.campaignEmailCoopSelected || []).indexOf(handle) >= 0;
	      return {
	        selectMark: cooperated || selected ? '✓' : '',
	        selectBg: cooperated ? '#6E9778' : (selected ? '#2457F5' : '#FFFFFF'),
	        selectBd: cooperated ? '#6E9778' : (selected ? '#2457F5' : '#C8D4E8'),
	        selectCursor: cooperated ? 'default' : 'pointer',
	        selectTitle: cooperated ? '已达成合作' : (selected ? '取消选择' : '选择红人'),
	        toggleSelect: (e) => {
	          if (e && e.stopPropagation) e.stopPropagation();
	          if (cooperated) return;
	          this.setState(st2 => {
	            const current = st2.campaignEmailCoopSelected || [];
	            return { campaignEmailCoopSelected: current.includes(handle) ? current.filter(x => x !== handle) : [...current, handle] };
	          });
	        },
	        coopLabel: cooperated ? '已合作' : '暂未',
	        coopBg: cooperated ? '#E4EFE4' : '#F5F8FE',
	        coopFg: cooperated ? '#4E7156' : '#647187',
	        coopBd: cooperated ? '#CFE3D3' : '#E2E8F2',
	        coopWeight: cooperated ? 600 : 400,
	        coopCursor: cooperated ? 'default' : 'pointer',
	        cooperate: (e) => {
	          if (e && e.stopPropagation) e.stopPropagation();
	          if (cooperated) return;
	          this.setState(st2 => {
	            const prevDeals = (st2.campaignCoopDeals || {})[cd.sku] || [];
	            const nextDeals = prevDeals.indexOf(handle) >= 0 ? prevDeals : [handle, ...prevDeals];
	            return {
	              campaignCoopDeals: { ...(st2.campaignCoopDeals || {}), [cd.sku]: nextDeals },
	              coopList: (st2.coopList || []).includes(handle) ? st2.coopList : [handle, ...(st2.coopList || [])],
	              campaignTab: 'email',
	              campaignEmailTab: 'sent',
	              campaignEmailDrawer: null,
	              campaignEmailCoopSelected: []
	            };
	          });
	        }
	      };
	    };
	    const campaignSentEmails = (s.contactLog || []).filter(m => m.sku === cd.sku && /已发送/.test(m.status || '')).map((m, mi) => {
	      const key = 'sent|' + (m.handle || '') + '|' + (m.when || mi);
	      return {
	        ...m, key,
	        body: m.body || ('Hi ' + String(m.handle || '').replace('@', '') + ',\n\nThank you for your interest in ' + cd.product + '. This email confirms the collaboration invitation for ' + cd.name + '. The latest Brief and product materials are attached for your review.\n\nPlease reply with your availability, preferred collaboration structure, and any questions about the deliverables.\n\nBest,\nChenxi'),
	        initial: String(m.handle || '?').replace('@', '').slice(0, 1).toUpperCase(),
	        bg: '#E4EFE4', fg: '#4E7156',
	        ...campaignCooperationProps(m.handle),
	        open: (e) => {
	          if (e && e.stopPropagation) e.stopPropagation();
	          this.setState({
	            campaignEmailTab: 'sent',
	            campaignEmailDrawer: null,
	            contactHandle: m.handle,
	            mailThreadOpen: true,
	            mailTab: 'history',
	            mailOpenIdx: null,
	            mailTargetWhen: m.when || '',
	            mailTargetSubject: m.subject || '',
	            campaignMailSourceKey: key,
	            campaignEmailContractMenuOpen: false,
	            campaignEmailContractEditorOpen: false
	          });
	        },

	      };
	    });
    const sentHandles = campaignSentEmails.map(m => m.handle);
    const campaignPendingEmails = campaignBriefVersions.flatMap((b, bi) => {
      if (b.sku !== cd.sku) return [];
      const platformKey = (b.platform || '').toUpperCase();
      const targetHandles = b.creator
        ? [b.creator]
        : creatorDefs.filter(c => (c.platform || '').indexOf(platformKey) >= 0 && sentHandles.indexOf(c.handle) < 0).slice(0, 2).map(c => c.handle);
      return targetHandles.map((handle, hi) => {
        const c = creatorDefs.find(x => x.handle === handle) || {};
        const key = 'pending|' + b.sku + '|' + b.platform + '|' + b.ver + '|' + handle;
        const baseSubject = 'Collaboration invite · ' + b.name + ' × ' + handle;
        const baseBody = 'Hi ' + handle.replace('@', '') + ',\n\nI am reaching out from ' + (cd.product || b.name) + ' for our ' + cd.name + ' campaign. Based on your recent ' + (c.niche || 'lifestyle') + ' content, we think your style would be a strong fit for this Brief.\n\nThe draft Brief is attached: ' + b.platform + ' ' + b.ver + '. The core idea is to keep your natural voice while covering the product scenario, key usage steps, and FTC disclosure.\n\nIf you are interested, could you share your availability and preferred collaboration structure this week?\n\nBest,\nChenxi';
        const draft = (s.campaignEmailDrafts || {})[key] || {};
        const subject = draft.subject || baseSubject;
        const body = draft.body || baseBody;
        return {
          key, handle, to: draft.to || handle, cc: draft.cc || '', bcc: draft.bcc || '', subject, body, baseSubject, baseBody,
          initial: String(handle || '?').replace('@', '').slice(0, 1).toUpperCase(),
          status: '待发送', bg: '#FBEEDA', fg: '#A5762C', action: '检查邮件',
          meta: '来自 Brief ' + b.platform + ' ' + b.ver + ' · 系统已起草 · 待人工确认',
          cursor: 'pointer',
          open: () => this.setState({ campaignEmailDrawer: key }),
          inspect: (e) => {
            if (e && e.stopPropagation) e.stopPropagation();
            this.setState({ campaignEmailDrawer: key });
          }
        };
      });
    }).filter((m, i, arr) => sentHandles.indexOf(m.handle) < 0 && arr.findIndex(x => x.handle === m.handle) === i);
    const campaignEmailCoopSelected = (s.campaignEmailCoopSelected || []).filter(handle => campaignDealHandles.indexOf(handle) < 0);
    const campaignEmailCoopCandidateItems = campaignSentEmails.filter((m, i, arr) => arr.findIndex(x => x.handle === m.handle) === i);
    const campaignEmailCoopCandidates = campaignEmailCoopCandidateItems.map(m => {
      const cooperated = campaignDealHandles.indexOf(m.handle) >= 0;
      const selected = campaignEmailCoopSelected.indexOf(m.handle) >= 0;
      return {
        handle: m.handle,
        initial: m.initial,
        meta: cooperated ? '已进入合作履约' : '邮件已发送 · 可确认合作',
        mark: cooperated || selected ? '✓' : '',
        checkBg: cooperated ? '#6E9778' : (selected ? '#2457F5' : '#FFFFFF'),
        checkBd: cooperated ? '#6E9778' : (selected ? '#2457F5' : '#C8D4E8'),
        bg: cooperated ? '#F5FAF6' : (selected ? '#F7F9FF' : '#FFFFFF'),
        bd: cooperated ? '#CFE3D3' : (selected ? '#8CAFFF' : '#E2E8F2'),
        cursor: cooperated ? 'default' : 'pointer',
        toggle: () => {
          if (cooperated) return;
          this.setState(st2 => {
            const current = (st2.campaignEmailCoopSelected || []).filter(handle => campaignDealHandles.indexOf(handle) < 0);
            return { campaignEmailCoopSelected: current.includes(m.handle) ? current.filter(handle => handle !== m.handle) : [...current, m.handle] };
          });
        }
      };
    });
    const campaignEmailCoopCanConfirm = campaignEmailCoopSelected.length > 0;
    const campaignEmails = campaignSentEmails;
    const emailSentN = campaignSentEmails.length;
    const campaignEmailTab = s.campaignEmailTab || 'pending';
    const campaignEmailSubTabs = [
      { id: 'pending', label: '待发送', count: campaignPendingEmails.length },
      { id: 'sent', label: '已发送', count: campaignSentEmails.length }
    ].map(t => {
      const on = campaignEmailTab === t.id;
      return { ...t, pick: () => this.setState({ campaignEmailTab: t.id, campaignEmailDrawer: null, campaignEmailCoopPickerOpen: false, campaignEmailCoopSelected: [] }), bg: on ? '#2457F5' : '#FFFFFF', fg: on ? '#FFFFFF' : '#647187', bd: on ? '#2457F5' : '#E2E8F2', countBg: on ? 'rgba(255,255,255,.2)' : '#F1F4F8', countFg: on ? '#FFFFFF' : '#647187' };
    });
    const campaignEmailDrawerItem = (campaignPendingEmails.concat(campaignSentEmails)).find(m => m.key === s.campaignEmailDrawer);
    const campaignEmailDrawerIsPending = !!campaignEmailDrawerItem && String(campaignEmailDrawerItem.key || '').indexOf('pending|') === 0;
    const campaignEmailDrawerThread = campaignEmailDrawerItem ? [
      { who: '我方 · 陈曦', date: campaignEmailDrawerItem.when ? campaignEmailDrawerItem.when.slice(5) : '待发送', text: campaignEmailDrawerItem.body || '开场邮件已发出。', bg: '#F8FAFE', bd: '#E2E8F2' }
    ].concat(facts.replies.filter(r => r.handle === campaignEmailDrawerItem.handle).map(r => ({
      who: campaignEmailDrawerItem.handle, date: r.when.slice(5), text: r.gist, bg: '#FFFFFF', bd: '#E2E8F2'
    }))) : [];
    const campaignEmailHistoryItems = campaignEmailDrawerItem ? (() => {
      const handle = campaignEmailDrawerItem.handle;
      const current = {
        key: 'current', subject: campaignEmailDrawerItem.subject,
        preview: campaignEmailDrawerIsPending ? '系统已根据 Brief 起草，等待人工检查' : '本次 Campaign 邮件已发送',
        when: campaignEmailDrawerIsPending ? '本次草稿' : (campaignEmailDrawerItem.when || '已发送'),
        direction: campaignEmailDrawerIsPending ? '草稿' : '我方发送', active: true,
        bd: '#B8CBFF', bg: '#F1F5FF', fw: '600', dirFg: '#2457F5'
      };
      const sent = (s.contactLog || []).filter(m => m.handle === handle && (campaignEmailDrawerIsPending || m.subject !== campaignEmailDrawerItem.subject || m.when !== campaignEmailDrawerItem.when)).map((m, i) => ({
        key: 'sent-history-' + i, subject: m.subject || '合作邮件',
        preview: '历史发件记录 · ' + (m.att ? m.att + ' 个附件' : '无附件'),
        when: m.when || '历史记录', direction: '我方发送', active: false,
        bd: 'transparent', bg: '#FFFFFF', fw: '500', dirFg: '#8792A5'
      }));
      const replies = facts.replies.filter(r => r.handle === handle).map((r, i) => ({
        key: 'reply-history-' + i, subject: r.subject || ('Re: ' + campaignEmailDrawerItem.subject),
        preview: r.gist || '红人邮件回复', when: r.when || '历史回复', direction: '红人回复', active: false,
        bd: 'transparent', bg: '#FFFFFF', fw: '500', dirFg: '#8792A5'
      }));
      return [current, ...replies, ...sent];
    })() : [];
    const campaignEmailDraftKey = campaignEmailDrawerItem && campaignEmailDrawerIsPending ? campaignEmailDrawerItem.key : '';
    const updateCampaignEmailDraft = (field, value) => {
      if (!campaignEmailDraftKey) return;
      this.setState(st2 => ({
        campaignEmailDrafts: {
          ...(st2.campaignEmailDrafts || {}),
          [campaignEmailDraftKey]: { ...((st2.campaignEmailDrafts || {})[campaignEmailDraftKey] || {}), [field]: value }
        }
      }));
    };
    const appendCampaignEmailBody = (text) => {
      if (!campaignEmailDraftKey) return;
      const current = campaignEmailDrawerItem ? (campaignEmailDrawerItem.body || '') : '';
      updateCampaignEmailDraft('body', current + (current.trim() ? '\n\n' : '') + text);
    };
    const campaignEmailReplyKey = campaignEmailDrawerItem && !campaignEmailDrawerIsPending ? campaignEmailDrawerItem.key : '';
    const campaignEmailReplyBody = campaignEmailReplyKey ? ((s.campaignEmailReplies || {})[campaignEmailReplyKey] || '') : '';
    const updateCampaignEmailReply = (value) => {
      if (!campaignEmailReplyKey) return;
      this.setState(st2 => ({
        campaignEmailReplies: {
          ...(st2.campaignEmailReplies || {}),
          [campaignEmailReplyKey]: value
        }
      }));
    };
    const appendCampaignEmailReply = (text) => {
      if (!campaignEmailReplyKey) return;
      updateCampaignEmailReply(campaignEmailReplyBody + (campaignEmailReplyBody.trim() ? '\n\n' : '') + text);
    };
    const campaignEmailToolbar = [
      { label: 'B', title: '加粗', click: () => appendCampaignEmailBody('**重点内容**') },
      { label: 'I', title: '斜体', click: () => appendCampaignEmailBody('*补充说明*') },
      { label: '•', title: '项目符号', click: () => appendCampaignEmailBody('• Key point\n• Next step') },
      { label: '1.', title: '编号列表', click: () => appendCampaignEmailBody('1. First step\n2. Second step') },
      { label: '🔗', title: '插入链接', click: () => appendCampaignEmailBody('[Product link]') },
      { label: '签名', title: '插入签名', click: () => appendCampaignEmailBody('Best,\nChenxi') },
      { label: '润色', title: 'AI 润色语气', click: () => appendCampaignEmailBody('Tone note: warm, concise, and creator-friendly.') },
      { label: '重写', title: '重新生成正文', click: () => updateCampaignEmailDraft('body', campaignEmailDrawerItem ? campaignEmailDrawerItem.baseBody : '') }
    ];
    const campaignEmailReplyToolbar = [
      { label: 'B', title: '加粗', click: () => appendCampaignEmailReply('**重点内容**') },
      { label: 'I', title: '斜体', click: () => appendCampaignEmailReply('*补充说明*') },
      { label: '•', title: '项目符号', click: () => appendCampaignEmailReply('• Key point\n• Next step') },
      { label: '1.', title: '编号列表', click: () => appendCampaignEmailReply('1. First step\n2. Second step') },
      { label: '签名', title: '插入签名', click: () => appendCampaignEmailReply('Best,\nChenxi') },
      { label: '润色', title: 'AI 润色语气', click: () => appendCampaignEmailReply('Tone note: warm, concise, and creator-friendly.') },
      { label: '报价', title: '插入合作报价', click: () => appendCampaignEmailReply('Happy to discuss a fixed fee plus gifted product structure.') }
    ];
    const campaignEmailInsertChips = [
      { label: '+ 产品名', click: () => appendCampaignEmailBody(cd.product) },
      { label: '+ Brief 摘要', click: () => appendCampaignEmailBody('Brief summary: creator-led scene, key usage steps, and FTC disclosure.') },
      { label: '+ 合作结构', click: () => appendCampaignEmailBody('Proposed structure: gifted product + commission, with optional fixed fee discussion.') }
    ];
    const campaignEmailAttachments = campaignEmailDrawerItem ? [
      { icon: '📎', name: 'Brief.pdf' },
      { icon: '🖼', name: cd.product + ' 素材包' }
    ] : [];
    const campaignEmailSendOptions = [
      { label: '保存草稿', bg: '#FFFFFF', fg: '#647187', bd: '#E2E8F2', click: () => this.setState({ campaignBriefNotice: '邮件草稿已保存。', campaignBriefNoticeKind: 'success' }) },
      { label: '定时发送', bg: '#FFFFFF', fg: '#2457F5', bd: '#B8CBFF', click: () => appendCampaignEmailBody('Scheduled send: tomorrow 09:00 recipient local time.') },
      { label: '添加附件', bg: '#FFFFFF', fg: '#647187', bd: '#E2E8F2', click: () => appendCampaignEmailBody('Attachment note: product images and latest Brief included.') }
    ];
	    const campaignEmailKpis = [];

    const campaignAssets = facts.assets.filter(a => a.sku === cd.sku).map(a => {
      const ai = assets.findIndex(x => x.title === a.title);
      const rights = a.rights === 'ad' ? ['广告可用', '#E4EFE4', '#4E7156'] : (a.rights === 'social' ? ['仅社媒', '#E4EEF7', '#1D48D8'] : ['待授权', '#FBE3E3', '#C4636D']);
      return { ...a, type: a.channel === 'Instagram' ? 'IMAGE / REEL' : 'VIDEO', meta: a.handle + ' · ' + a.channel + ' · ' + a.post, summary: a.summary || ('播放 ' + a.views + ' · ER ' + a.er + ' · ' + (a.orders || 0) + ' 次转化'), rights: rights[0], bg: rights[1], fg: rights[2], open: ai >= 0 ? this.openAsset(ai) : () => this.setState({ page: 'assets' }) };
    });
    const campaignTimelineSource = timelineArr.find(t => s.campaignName && t.campaignName === s.campaignName)
      || timelineArr.find(t => t.sku === cd.sku)
      || { campaignName: cd.name, stateText: '未排期', stateBg: '#F5F8FE', stateFg: '#8792A5', window: '—', phases: [], note: '尚未创建时间计划。' };
    const campaignTimeline = { ...campaignTimelineSource, idx: 1 };
    const campaignReplyHandles = campaignSentEmails.map(item => item.handle);
    const campaignReplyCount = facts.replies.filter(item => campaignReplyHandles.indexOf(item.handle) >= 0).length;
    const cooperationCountForSummary = kanban.reduce((total, column) => total + column.count, 0);
    const cooperationRiskCount = cooperationRows.filter(row => row.stages.some(stage => stage.state === 'risk')).length;
    const assetRightsRiskCount = campaignAssets.filter(item => item.rights === '待授权').length;
    const goalRiskCount = (cd.goals || []).filter(goalItem => Number(goalItem.pct || 0) < 60).length;
    const campaignAiSummaries = {
      strategy: {
        label: '策略', tone: campaignStrategySelectedRow ? 'good' : 'warn',
        progress: campaignStrategySelectedRow ? '已选用「' + campaignStrategySelectedRow.title + '」，当前策略章节已同步到本 Campaign。' : '当前尚未选择可执行的 Campaign 策略。',
        issue: campaignStrategySelectedRow ? '仍需持续验证高完播内容角度，并避免预算分散到未验证人群。' : '缺少策略会阻塞 Brief、邮件触达与后续排期。',
        next: campaignStrategySelectedRow ? '优先放大已验证的场景化内容，并补足尚未覆盖的人群与渠道。' : '先选择或生成一份策略版本，再进入 Brief 环节。'
      },
      brief: {
        label: 'Brief', tone: campaignBriefVersions.length ? (campaignBriefVersions.some(item => item.status === '草稿' || item.status === '待审批') ? 'warn' : 'good') : 'warn',
        progress: campaignBriefVersions.length ? '当前共有 ' + campaignBriefVersions.length + ' 份 Brief，其中 ' + campaignBriefVersions.filter(item => item.status === '已通过').length + ' 份已通过。' : '当前 Campaign 尚未生成 Brief。',
        issue: campaignBriefVersions.some(item => item.status === '草稿' || item.status === '待审批') ? '仍有 ' + campaignBriefVersions.filter(item => item.status === '草稿' || item.status === '待审批').length + ' 份处于草稿或待审批状态。' : (campaignBriefVersions.length ? '暂无阻塞项，需关注不同渠道版本的一致性。' : '缺少 Brief，无法形成统一的内容要求。'),
        next: campaignBriefVersions.length ? '完成剩余版本审批，并确认渠道要求、必拍点与合规表达。' : '先按渠道生成基础 Brief，再补充红人专属版本。'
      },
      email: {
        label: '邮件', tone: emailSentN ? (campaignReplyCount ? 'good' : 'warn') : 'warn',
        progress: emailSentN ? '已向 ' + emailSentN + ' 位红人发送合作邮件，识别到 ' + campaignReplyCount + ' 条相关回复。' : '当前尚未发送合作邮件。',
        issue: emailSentN && !campaignReplyCount ? '邮件已触达但尚未形成有效回复，需要关注响应时效。' : (emailSentN ? '部分回复仍需确认合作方式、报价与交付档期。' : '未开始触达，合作与寄样环节无法推进。'),
        next: emailSentN ? '优先处理高意向回复，并将确认合作的红人转入合作履约。' : '基于已通过的 Brief 批量生成并检查首轮邮件。'
      },
      cooperation: {
        label: '合作', tone: cooperationRiskCount ? 'warn' : (cooperationCountForSummary ? 'good' : 'warn'),
        progress: cooperationCountForSummary ? '当前有 ' + cooperationCountForSummary + ' 位红人进入合作履约流程。' : '当前还没有红人进入合作履约。',
        issue: cooperationRiskCount ? '有 ' + cooperationRiskCount + ' 位红人的合同、付款、寄样或素材节点需要处理。' : (cooperationCountForSummary ? '整体推进正常，仍需按节点跟进合同、付款和寄样。' : '尚未确认合作红人，后续环节均未启动。'),
        next: cooperationCountForSummary ? '优先处理异常节点，并确保合同、寄样与 Brief 沟通留痕完整。' : '从高意向邮件中确认合作红人并进入履约。'
      },
      assets: {
        label: '素材', tone: assetRightsRiskCount ? 'warn' : (campaignAssets.length ? 'good' : 'warn'),
        progress: campaignAssets.length ? '已回收 ' + campaignAssets.length + ' 条素材，并同步到 Asset Library。' : '当前还没有回收素材。',
        issue: assetRightsRiskCount ? '有 ' + assetRightsRiskCount + ' 条素材尚未完成授权，暂不能用于广告投放。' : (campaignAssets.length ? '暂无授权阻塞，需继续关注播放与互动表现。' : '缺少素材，无法统计内容产出与传播效果。'),
        next: campaignAssets.length ? '补齐待授权素材，并优先复用高播放、高互动内容。' : '从合作履约中录入首批素材并补充表现数据。'
      },
      timeline: {
        label: '时间进度', tone: campaignTimeline.late ? 'warn' : ((campaignTimeline.phases || []).length ? 'good' : 'warn'),
        progress: (campaignTimeline.phases || []).length ? '当前共有 ' + campaignTimeline.phases.length + ' 个时间节点，整体状态为「' + campaignTimeline.stateText + '」。' : '当前 Campaign 尚未完成排期。',
        issue: campaignTimeline.late ? '存在延期或阻塞节点，需要在外层时间进度调整中处理。' : ((campaignTimeline.phases || []).length ? '当前未发现延期，仍需关注寄样到内容产出的衔接。' : '无排期会导致各环节缺少明确截止时间。'),
        next: campaignTimeline.late ? '回到 Campaign 列表的「时间进度调整」统一顺延或重排。' : '按当前计划跟进关键节点，出现偏差时在外层统一调整。'
      },
      goals: {
        label: '目标达成', tone: goalRiskCount ? 'warn' : ((cd.goals || []).length ? 'good' : 'warn'),
        progress: (cd.goals || []).length ? '已持续跟踪内容数量、播放量、预算与时间四项目标，Campaign 当前完成度为 ' + cd.pct + '%。' : '当前尚未设置可跟踪的目标。',
        issue: goalRiskCount ? '有 ' + goalRiskCount + ' 项目标完成度低于 60%，需要优先纠偏。' : ((cd.goals || []).length ? '各项目标整体健康，继续关注内容与播放量的增长效率。' : '缺少目标，无法判断 Campaign 是否达成。'),
        next: goalRiskCount ? '优先处理完成度最低的目标，并联动合作、素材与排期环节。' : '保持当前节奏，并在素材数据更新后持续复核目标达成率。'
      }
    };
    const campaignAiSummary = campaignAiSummaries[campaignTab] || campaignAiSummaries.strategy;
    const campaignAiSummaryPalette = campaignAiSummary.tone === 'good'
      ? { bg: '#F5FAF6', bd: '#CFE3D3', fg: '#4E7156', dot: '#6E9778' }
      : { bg: '#FFFAF1', bd: '#F1D8A9', fg: '#A5762C', dot: '#D7A44B' };

    const ar = (() => {
      const rf = s.arFilter || {};
      const TYPES = {
        ad: ['广告投放授权', '#4E7156', '#E4EFE4'],
        social: ['仅社媒授权', '#1D48D8', '#E4EEF7'],
        pending: ['待补授权', '#C4636D', '#F7EDEE']
      };
      const meta = {
        '夜间 routine ep.12': { type: 'ad', start: '2026-08-12', months: 9, scope: '社媒 · 白名单投放 · 详情页', fee: '含固定费', contract: 'CT-2026-0812-MIA' },
        '头皮特写实测': { type: 'ad', start: '2026-08-09', months: 6, scope: '社媒 · 白名单投放', fee: '寄样置换', contract: 'CT-2026-0809-KAY' },
        '一周实测 Shorts': { type: 'pending', start: '2026-08-14', months: 0, scope: '仅原帖保留', fee: '待议 $400', contract: '' },
        '前后头皮对比': { type: 'ad', start: '2026-08-16', months: 6, scope: '社媒 · 白名单投放', fee: '寄样置换', contract: 'CT-2026-0816-JUN' },
        '浴室静帧组': { type: 'social', start: '2026-08-05', months: 6, scope: '仅品牌社媒与 EDM', fee: '含固定费', contract: 'CT-2026-0805-AND' }
      };
      const addMonths = (iso, m) => {
        const d = new Date(iso + 'T00:00:00');
        d.setMonth(d.getMonth() + m);
        return d.toISOString().slice(0, 10);
      };
      const today = new Date('2026-08-31T00:00:00');
      const manual = {};
      (s.alEntries || []).forEach(e => {
        if (!e.isRights) return;
        const resolved = this.entryToAsset(e);
        manual[e.title || '未命名素材'] = {
          type: resolved.rights,
          start: e.post || '2026-08-31',
          months: resolved.rights === 'pending' ? 0 : (Number(e.rightsMonths) || 6),
          scope: e.rightsScope || '仅品牌社媒',
          fee: e.spend ? '$' + e.spend : '寄样置换',
          contract: e.contract || ''
        };
      });
      const rightsTitles = {};
      (s.alEntries || []).forEach(e => { if (e.isRights) rightsTitles[e.title || '未命名素材'] = 1; });
      const all = facts.assets.filter(a => {
        const isManual = (s.alEntries || []).some(e => (e.title || '未命名素材') === a.title);
        return !isManual || rightsTitles[a.title];
      }).map((a, i) => {
        const mt = manual[a.title] || meta[a.title] || { type: a.rights === 'ad' ? 'ad' : (a.rights === 'pending' ? 'pending' : 'social'), start: a.post, months: 6, scope: '仅品牌社媒', fee: '—', contract: '' };
        const t = TYPES[mt.type];
        const end = mt.months ? addMonths(mt.start, mt.months) : '';
        const days = end ? Math.round((new Date(end + 'T00:00:00') - today) / 86400000) : 0;
        return {
          idx: i + 1, handle: a.handle, initial: a.handle.slice(1, 2).toUpperCase(), title: a.title,
          channel: a.channel, channelLogo: this.channelLogoOf(a.channel), product: a.product, sku: a.sku, post: a.post, url: a.url,
          typeKey: mt.type, typeText: t[0], typeFg: t[1], typeBg: t[2],
          term: mt.months ? mt.months + ' 个月' : '未授权',
          termLeft: mt.months ? (days > 0 ? '剩余 ' + days + ' 天' : '已过期 ' + Math.abs(days) + ' 天') : '需先补签',
          termEnd: mt.months ? '至 ' + end : '—',
          termColor: !mt.months ? RUST : (days <= 0 ? RUST : (days <= 45 ? AMBER : SAGE)),
          scope: mt.scope, fee: mt.fee,
          contract: mt.contract || '未签署',
          hasContract: !!mt.contract, noContract: !mt.contract,
          ...(() => { const d = creatorDefs.find(x => x.handle === a.handle) || {}; return this.dealMetaOf(a.spend > 0 ? '$' + a.spend : d.quote, d.quote); })(),
          tierText: (() => { const d = creatorDefs.find(x => x.handle === a.handle); return d ? this.tierOfFollowers(d.followers) : '—'; })(),
          cpvText: (() => { const v = this.toNumU(a.views); return a.spend > 0 && v ? '$' + (a.spend / v).toFixed(3) : '寄样'; })(),
          cpvColor: (() => { const v = this.toNumU(a.views); if (a.spend === 0) return '#4E7156'; return (a.spend / Math.max(1, v)) <= 0.012 ? '#1D2638' : '#C4636D'; })(),
          links: (() => {
            const nm = { TikTok: 'Ti', Instagram: 'In', YouTube: 'Yo' };
            const bare = a.handle.slice(1);
            const main = a.channel === 'YouTube' ? 'https://www.youtube.com/' + a.handle : (a.channel === 'Instagram' ? 'https://www.instagram.com/' + bare : 'https://www.tiktok.com/' + a.handle);
            const alt = a.channel === 'Instagram' ? 'https://www.tiktok.com/' + a.handle : 'https://www.instagram.com/' + bare;
            return [
              { short: nm[a.channel] || 'Ti', url: main, title: (a.channel || 'TikTok') + ' 主页' },
              { short: a.channel === 'Instagram' ? 'Ti' : 'In', url: alt, title: '其他渠道主页' }
            ];
          })(),
          coverTint: this.coverOf(a.url, a.channel).tint,
          coverBg: this.coverOf(a.url, a.channel).bg,
          coverMark: this.coverOf(a.url, a.channel).mark,
          coverShade: this.coverOf(a.url, a.channel).shade,
          coverFg: this.coverOf(a.url, a.channel).fg,
          openContract: () => this.setState({ page: 'contracts' })
        };
      });
      const rows = all.filter(r => {
        if (rf.type && r.typeKey !== rf.type) return false;
        if (rf.channel && r.channel !== rf.channel) return false;
        if (rf.product && r.product !== rf.product) return false;
        if (rf.status === '有效' && !/剩余/.test(r.termLeft)) return false;
        if (rf.status === '临期（≤45天）' && r.termColor !== AMBER) return false;
        if (rf.status === '待补 / 过期' && r.termColor !== RUST) return false;
        return true;
      }).map((r, i) => ({ ...r, idx: i + 1, rowBg: i % 2 === 1 ? '#FFFFFF' : '#FFFFFF' }));
      const adN = all.filter(x => x.typeKey === 'ad').length;
      const socN = all.filter(x => x.typeKey === 'social').length;
      const pendN = all.filter(x => x.typeKey === 'pending').length;
      const soonN = all.filter(x => x.termColor === AMBER).length;
      const kpis = [
        { label: '已授权素材', value: String(adN + socN), note: '共 ' + all.length + ' 条素材', color: '#1D2638' },
        { label: '广告投放授权', value: String(adN), note: '可进白名单投放', color: '#4E7156' },
        { label: '仅社媒授权', value: String(socN), note: '不可用于付费投放', color: '#1D48D8' },
        { label: '待补 / 临期', value: String(pendN + soonN), note: pendN + ' 条待补 · ' + soonN + ' 条 45 天内到期', color: pendN + soonN ? '#C4636D' : '#4E7156' }
      ];
      const filters = [
        ['type', '授权类型', ['广告投放授权', '仅社媒授权', '待补授权']],
        ['channel', '渠道', ['TikTok', 'Instagram', 'YouTube']],
        ['product', '产品', ['Ryze 头皮按摩仪', 'Lumo 便携香氛机']],
        ['status', '期限状态', ['有效', '临期（≤45天）', '待补 / 过期']]
      ].map(([k, label, opts]) => {
        const cur = rf[k] || '';
        const isOpen = s.arFilterOpen === k;
        const toVal = (o) => k === 'type' ? (o === '广告投放授权' ? 'ad' : o === '仅社媒授权' ? 'social' : 'pending') : o;
        const label2 = cur ? (k === 'type' ? { ad: '广告投放授权', social: '仅社媒授权', pending: '待补授权' }[cur] : cur) : '全部';
        return {
          label, current: label2, open: isOpen,
          bg: cur ? '#EAF0FF' : '#F8FAFE', bd: isOpen ? '#2457F5' : (cur ? '#F0C9B8' : '#E2E8F2'),
          fg: cur ? '#2457F5' : '#1D2638',
          toggle: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ arFilterOpen: st.arFilterOpen === k ? null : k })); },
          options: [{ v: '', l: '全部' }, ...opts.map(o => ({ v: toVal(o), l: o }))].map(o => {
            const on = cur === o.v;
            return {
              label: o.l, bg: on ? '#EAF0FF' : 'transparent', fg: on ? '#2457F5' : '#647187',
              pick: () => this.setState(st => ({ arFilter: { ...(st.arFilter || {}), [k]: o.v }, arFilterOpen: null }))
            };
          })
        };
      });
      const note = adN + ' 条素材拿到广告投放授权（占 ' + Math.round(adN / Math.max(1, all.length) * 100) + '%），'
        + (pendN ? pendN + ' 条仍未授权——其中表现最好的一条会直接影响投放放大，建议优先补签；' : '授权覆盖良好；')
        + (soonN ? soonN + ' 条将在 45 天内到期，需提前谈续期。' : '近期无到期风险。');
      return { rows, kpis, filters, note, countNote: '命中 ' + rows.length + ' 条' };
    })();

    const aq = (() => {
      const num = this.toNumU;
      const qf = s.aqFilter || {};
      const meta = (r) => {
        const p = skuAll.find(x => x.sku === r.sku) || {};
        return { brand: p.brand || '未归属', owner: p.owner || '未分配' };
      };
      const all = facts.assets.map(r => ({ ...r, ...meta(r) }));
      const rows = all.filter(r => {
        if (qf.brand && r.brand !== qf.brand) return false;
        if (qf.channel && r.channel !== qf.channel) return false;
        if (qf.product && r.product !== qf.product) return false;
        if (qf.owner && r.owner !== qf.owner) return false;
        if (qf.time && String(r.post).slice(0, 7) !== qf.time) return false;
        return true;
      });
      const isPass = (r) => parseFloat(r.er) >= 5;
      const passRows = rows.filter(isPass);
      const views = rows.reduce((t, r) => t + num(r.views), 0);
      const passViews = passRows.reduce((t, r) => t + num(r.views), 0);
      const fmtV = (n) => n >= 1000000 ? (n / 1000000).toFixed(2) + 'M' : (n >= 1000 ? Math.round(n / 1000) + 'K' : String(Math.round(n)));
      const rate = rows.length ? Math.round(passRows.length / rows.length * 100) : 0;

      const groupBy = qf.product ? 'channel' : 'product';
      const groupLabel = groupBy === 'channel' ? '渠道' : '产品';
      const map = {};
      rows.forEach(r => {
        const k = r[groupBy] || '未归类';
        map[k] = map[k] || { total: 0, pass: 0, views: 0 };
        map[k].total += 1;
        map[k].views += num(r.views);
        if (isPass(r)) map[k].pass += 1;
      });
      const grouped = Object.keys(map).map(k => {
        const d = map[k];
        const rt = Math.round(d.pass / Math.max(1, d.total) * 100);
        return {
          name: k, total: d.total, pass: d.pass, rate: rt, views: fmtV(d.views), _v: d.views,
          rateColor: rt >= 70 ? SAGE : rt >= 40 ? AMBER : RUST
        };
      }).sort((a, b) => b._v - a._v).map((x, i) => ({ ...x, rowBg: i % 2 === 1 ? '#FFFFFF' : '#FFFFFF' }));

      const top = grouped[0];
      const activeF = ['brand', 'channel', 'product', 'owner', 'time'].filter(k => qf[k]).map(k => qf[k]);
      const scopeText = activeF.length ? '筛选：' + activeF.join(' · ') : '全部素材';
      const summary = rows.length
        ? '当前口径下共 ' + rows.length + ' 条素材，其中 ' + passRows.length + ' 条合格（ER ≥ 5%），合格率 ' + rate + '%；'
          + '累计曝光 ' + fmtV(views) + '，合格素材贡献 ' + fmtV(passViews) + '（占 ' + Math.round(passViews / Math.max(1, views) * 100) + '%）。'
          + (top ? '按' + groupLabel + '看，' + top.name + '曝光最高（' + top.views + '，合格率 ' + top.rate + '%）；' : '')
          + (rate >= 70 ? '整体质量稳定，可以直接把合格素材推进白名单投放。'
            : rate >= 40 ? '合格率中等，建议先复盘不合格素材的开头 3 秒与卖点表达，再决定加量。'
            : '合格率偏低，说明选人或叙事角度需要先修正，不宜继续铺量。')
        : '当前筛选下没有素材，清空筛选或换一个口径查看。';

      const kpis = [
        { label: '合格素材数', value: String(passRows.length), note: '共 ' + rows.length + ' 条 · 合格率 ' + rate + '%', color: rate >= 70 ? '#4E7156' : rate >= 40 ? '#A5762C' : '#C4636D' },
        { label: '合格素材曝光', value: fmtV(passViews), note: '占总曝光 ' + Math.round(passViews / Math.max(1, views) * 100) + '%', color: '#4E7156' },
        { label: '总曝光数', value: fmtV(views), note: '含未达标素材', color: '#1D2638' },
        { label: '单条平均曝光', value: rows.length ? fmtV(views / rows.length) : '—', note: '合格素材均值 ' + (passRows.length ? fmtV(passViews / passRows.length) : '—'), color: '#1D2638' }
      ];

      const uniq = (arr) => arr.filter((x, i) => x && arr.indexOf(x) === i);
      const defs = [
        ['brand', '品牌', uniq(all.map(r => r.brand))],
        ['channel', '渠道', uniq(all.map(r => r.channel))],
        ['product', '产品', uniq(all.map(r => r.product))],
        ['owner', '推广专员', uniq(all.map(r => r.owner))],
        ['time', '时间', uniq(all.map(r => String(r.post).slice(0, 7))).sort().reverse()]
      ];
      const filters = defs.map(([k, label, opts]) => {
        const cur = qf[k] || '';
        const isOpen = s.aqFilterOpen === k;
        return {
          label, current: cur || '全部', open: isOpen,
          bg: cur ? '#EAF0FF' : '#F8FAFE', bd: isOpen ? '#2457F5' : (cur ? '#F0C9B8' : '#E2E8F2'),
          fg: cur ? '#2457F5' : '#1D2638',
          toggle: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ aqFilterOpen: st.aqFilterOpen === k ? null : k })); },
          options: [{ value: '', label: '全部' }].concat(opts.map(o => ({ value: o, label: o }))).map(o => {
            const on = cur === o.value;
            return {
              label: o.label, bg: on ? '#EAF0FF' : 'transparent', fg: on ? '#2457F5' : '#647187',
              pick: () => this.setState(st => ({ aqFilter: { ...(st.aqFilter || {}), [k]: o.value }, aqFilterOpen: null }))
            };
          })
        };
      });
      const nm2 = { TikTok: 'TikTok', Instagram: 'Instagram', YouTube: 'YouTube' };
      const approvedInfo = (r) => {
        const sub = (s.tagSubmits || []).find(x => x.kind === 'asset' && x.target === r.handle && x.ctx === r.title);
        if (!sub) return null;
        const d = (s.approvals || {})['tag-' + sub.id];
        if (!d || d.status !== '已通过' || (sub.tag !== '合格素材' && sub.tag !== '授权素材')) return null;
        return { tag: sub.tag, by: d.by || 'Helen · Marketing Lead', when: d.when || '2026-08-20' };
      };
      const assetRows = rows.filter(r => !!approvedInfo(r)).slice().sort((a, b) => num(b.views) - num(a.views)).map((r, i) => {
        const ap = approvedInfo(r) || {};
        const pass = isPass(r);
        const v = num(r.views);
        const cv = r.spend > 0 && v > 0 ? r.spend / v : 0;
        const bare = (r.handle || '@x').slice(1);
        return {
          idx: i + 1, handle: r.handle, initial: (r.handle || '@').slice(1, 2).toUpperCase(),
          postDate: r.post, title: r.title, channel: r.channel, channelLogo: this.channelLogoOf(r.channel), product: r.product, sku: r.sku,
          url: r.url, views: r.views, er: r.er,
          cpv: r.spend > 0 && v > 0 ? '$' + cv.toFixed(3) : (r.spend === 0 ? '寄样' : '—'),
          cpvColor: r.spend === 0 ? '#4E7156' : (cv <= 0.012 ? '#1D2638' : '#C4636D'),
          postShort: String(r.post).slice(5),
          coverBg: this.coverOf(r.url, r.channel).bg,
          coverTint: this.coverOf(r.url, r.channel).tint,
          coverMark: this.coverOf(r.url, r.channel).mark,
          coverShade: this.coverOf(r.url, r.channel).shade,
          coverFg: this.coverOf(r.url, r.channel).fg || '#FFFFFF',
          rowBg: i % 2 === 1 ? '#FFFFFF' : '#FFFFFF',
          links: [
            { short: (nm2[r.channel] || 'TikTok').slice(0, 2), title: (nm2[r.channel] || 'TikTok') + ' 主页', url: r.channel === 'YouTube' ? 'https://www.youtube.com/' + r.handle : (r.channel === 'Instagram' ? 'https://www.instagram.com/' + bare : 'https://www.tiktok.com/' + r.handle) },
            { short: r.channel === 'Instagram' ? 'Ti' : 'In', title: '其他渠道主页', url: r.channel === 'Instagram' ? 'https://www.tiktok.com/' + r.handle : 'https://www.instagram.com/' + bare }
          ],
          qualText: pass ? '合格' : '未达标',
          approvedTag: ap.tag || '合格素材', approvedBy: ap.by || '', approvedWhen: ap.when || '',
          ...(() => {
            const key = 'as|' + r.handle + '|' + r.title;
            const stt = this.tagStateOf('asset', r.handle, r.title);
            return {
              assetTagOpen: s.assetTagOpen === key,
              toggleAssetTag: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ assetTagOpen: st.assetTagOpen === key ? null : key, alTagOpen: null, alAiOpen: null })); },
              assetTagOptions: [['合格素材', '提交审核 · 通过后计入合格', '#A5762C'], ['授权素材', '提交审核 · 通过后计入授权', '#1D48D8'], ['淘汰素材', '提交审核 · 不进入复用池', '#C4636D']].map(([t, sub, dot]) => {
                const on = stt.tag === t;
                return {
                  label: on ? '✓ ' + t : t, sub, dot,
                  bg: on ? '#EAF0FF' : 'transparent', fg: on ? '#2457F5' : '#1D2638',
                  pick: () => this.stageTag('asset', r.handle, t, r.title)
                };
              })
            };
          })(),
          ...this.submitMeta(r.handle, r.title),
          ...(() => {
            const dft = this.tagDraftOf('asset', r.handle, r.title);
            if (dft) return { assetTag: dft + ' · 待提交', assetTagBg: '#EAF0FF', assetTagFg: '#2457F5', assetTagNote: '已选择，点「提交申请」送审' };
            const t = this.assetTagOf(r, pass); return { assetTag: t.tag, assetTagBg: t.bg, assetTagFg: t.fg, assetTagNote: t.note };
          })(),
          ...(() => { const d = creatorDefs.find(x => x.handle === r.handle) || {}; return this.dealMetaOf(r.spend > 0 ? '$' + r.spend : d.quote, d.quote); })(),
          tierText: (() => { const d = creatorDefs.find(x => x.handle === r.handle); return d ? this.tierOfFollowers(d.followers) : '—'; })(),
          aiDot: pass ? SAGE : RUST, aiFg: pass ? '#4E7156' : '#C4636D',
          qualNote: pass
            ? 'ER ' + r.er + ' ≥ 5% · 曝光 ' + r.views + '，计入合格素材与曝光累计'
            : 'ER ' + r.er + ' 低于 5% 合格线 · 曝光 ' + r.views + '，不计入合格数',
          ownerText: r.brand + ' · ' + r.owner,
          ...(() => {
            const key = 'aq|' + r.handle + '|' + r.title;
            const open = s.alAiOpen === key;
            const def = creatorDefs.find(x => x.handle === r.handle);
            const avg = def ? num(def.avgViews) : 0;
            const ratio = avg ? v / avg : 0;
            const cpvOk = r.spend === 0 || (cv > 0 && cv <= 0.012);
            const erN = parseFloat(r.er) || 0;
            const good = (ratio >= 1 || !avg) && cpvOk && erN >= 5;
            const cpvText = r.spend > 0 && v > 0 ? '$' + cv.toFixed(3) : '寄样';
            const curTag = (s.alTags || {})[r.handle] || '';
            const pal = { '继续合作': ['#EAF0FF', '#2457F5', '#F0C9B8'], '合格/优质红人': ['#E4EFE4', '#4E7156', '#CFE3D3'], '淘汰/拉黑': ['#FBE3E3', '#C4636D', '#F0C9C9'], '拉黑': ['#FBE3E3', '#C4636D', '#F0C9C9'] }[curTag] || ['#FFFFFF', '#647187', '#E2E8F2'];
            return {
              aiOpen: open,
              aiBd: open ? '#B8CBFF' : '#D9E4FF',
              aiVerdict: good ? '优质' : (cpvOk ? '一般' : '需复盘'),
              aiToggleLabel: open ? '收起分析' : '展开完整分析',
              aiSummary: (avg ? (ratio >= 1 ? '高于该红人均播 ' + Math.round((ratio - 1) * 100) + '%' : '低于均播 ' + Math.round((1 - ratio) * 100) + '%') : '无均播基准')
                + ' · ' + (r.spend === 0 ? 'CPV 零成本' : (cpvOk ? 'CPV 达标 ' + cpvText : 'CPV 超标 ' + cpvText))
                + ' · ER ' + r.er,
              toggleAi: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ alAiOpen: st.alAiOpen === key ? null : key, alTagOpen: null })); },
              aiRows: [
                { label: avg ? (ratio >= 1 ? '高于红人均播 ' + Math.round((ratio - 1) * 100) + '%' : '低于红人均播 ' + Math.round((1 - ratio) * 100) + '%') : '无均播基准',
                  note: avg ? '本条 ' + r.views + ' vs 近 30 天均播 ' + def.avgViews : '该红人不在红人库，缺少均播数据',
                  color: ratio >= 1 || !avg ? SAGE : AMBER },
                { label: r.spend === 0 ? 'CPV 达标（寄样零成本）' : (cpvOk ? 'CPV 达标' : 'CPV 未达标'),
                  note: r.spend === 0 ? '无固定费，仅佣金成本' : '本条 ' + cpvText + ' vs 基准 $0.012',
                  color: cpvOk ? SAGE : RUST },
                { label: good ? '数据优质' : (erN >= 5 ? '数据一般' : '互动偏弱'),
                  note: 'ER ' + r.er + '（合格线 5%）· ' + (good ? '建议加入白名单投放并复用文案' : '建议复盘开头 3 秒与卖点表达'),
                  color: good ? SAGE : AMBER }
              ],
              ...(() => {
                const dft = this.tagDraftOf('creator', r.handle, r.title);
                if (dft) return { tagLabel: dft + ' · 待提交', tagged: true, tagBg: '#EAF0FF', tagFg: '#2457F5', tagBd: '#F0C9B8' };
                const stt = this.tagStateOf('creator', r.handle, r.title);
                if (stt.pending) return { tagLabel: stt.tag + ' · 待审核', tagged: true, tagBg: '#FBEEDA', tagFg: '#A5762C', tagBd: '#F0DCB8' };
                if (stt.rejected) return { tagLabel: stt.tag + ' · 已驳回', tagged: true, tagBg: '#F7EDEE', tagFg: '#C4636D', tagBd: '#F0C9C9' };
                return { tagLabel: curTag || '打标签', tagged: !!curTag, tagBg: pal[0], tagFg: pal[1], tagBd: pal[2] };
              })(),
              tagOpen: s.alTagOpen === key,
              toggleTag: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ alTagOpen: st.alTagOpen === key ? null : key, alAiOpen: null })); },
              tagOptions: [['继续合作', '加入合作红人 List', '#2457F5'], ['合格/优质红人', '加入合格/优质红人', '#4E7156'], ['淘汰/拉黑', '加入淘汰 / 黑名单', '#C4636D']].map(([t, sub, dot]) => {
                const on = curTag === t;
                return {
                  label: on ? '✓ ' + t : t, sub, dot,
                  bg: on ? '#EAF0FF' : 'transparent', fg: on ? '#2457F5' : '#1D2638',
                  pick: () => this.stageTag('creator', r.handle, t, r.title)
                };
              })
            };
          })()
        };
      });
      const headline = rows.length
        ? '合格 ' + passRows.length + ' / ' + rows.length + ' 条 · 合格率 ' + rate + '% · 曝光 ' + fmtV(views)
        : '当前筛选下没有素材';
      const countNote = '命中 ' + rows.length + ' 条 · ER 达标 ' + passRows.length + ' 条 · 已审核收录 ' + rows.filter(r => !!approvedInfo(r)).length + ' 条';
      return { rows: grouped, kpis, summary, scopeText, groupLabel, filters, assetRows, headline, countNote };
    })();

    const alRows = (() => {
      const seeded = this.ASSET_SEED.map(x => ({ ...x })).length ? this.ASSET_SEED.map(x => ({ ...x })) : [
      ].map(x => ({ ...x, sku: x.product === 'Lumo 便携香氛机' ? 'LUM-AR-02' : 'RYZ-SC-01', campaign: x.product === 'Lumo 便携香氛机' ? 'Q1 家居氛围' : 'Q3 北美种草', sub: x.product + ' · ' + x.channel }));
      const toNum = (v) => { const n = parseFloat(String(v).replace(/[^0-9.]/g, '')); return isNaN(n) ? 0 : n * (/K/i.test(String(v)) ? 1000 : 1); };
      const entries = (s.alEntries || []).map(e => ({ ...this.entryToAsset(e), fresh: true }));
      const af = s.alFilter || {};
      const cpvNum = (r) => { const v2 = toNum(r.views); return r.spend > 0 && v2 > 0 ? r.spend / v2 : 0; };
      const rows = entries.concat(seeded).filter(r => {
        const v2 = toNum(r.views), erN = parseFloat(r.er) || 0, cv = cpvNum(r);
        if (af.time && String(r.post).slice(0, 7) !== af.time) return false;
        if (af.product && r.product !== af.product) return false;
        if (af.channel && r.channel !== af.channel) return false;
        if (af.deal) {
          const d0 = creatorDefs.find(x => x.handle === r.handle) || {};
          const dm = this.dealMetaOf(r.spend > 0 ? '$' + r.spend : d0.quote, d0.quote);
          if ((dm.deal || '') !== af.deal) return false;
        }
        if (af.views === '≥ 200K' && v2 < 200000) return false;
        if (af.views === '100K–200K' && (v2 < 100000 || v2 >= 200000)) return false;
        if (af.views === '< 100K' && v2 >= 100000) return false;
        if (af.er === '≥ 10%' && erN < 10) return false;
        if (af.er === '5%–10%' && (erN < 5 || erN >= 10)) return false;
        if (af.er === '< 5%' && erN >= 5) return false;
        if (af.cpv === '寄样（无成本）' && r.spend !== 0) return false;
        if (af.cpv === '≤ $0.010' && !(cv > 0 && cv <= 0.01)) return false;
        if (af.cpv === '> $0.010' && !(cv > 0.01)) return false;
        return true;
      });
      const nm = { TikTok: 'TikTok', Instagram: 'Instagram', YouTube: 'YouTube' };
      const tagPalette = { '继续合作': ['#EAF0FF', '#2457F5', '#F0C9B8'], '合格/优质红人': ['#E4EFE4', '#4E7156', '#CFE3D3'], '淘汰/拉黑': ['#FBE3E3', '#C4636D', '#F0C9C9'], '拉黑': ['#FBE3E3', '#C4636D', '#F0C9C9'] };
      return rows.map((r, i) => {
        const v = toNum(r.views);
        const cpv = r.spend > 0 && v > 0 ? '$' + (r.spend / v).toFixed(3) : (r.spend === 0 ? '寄样' : '—');
        const def = creatorDefs.find(x => x.handle === r.handle);
        const avg = def ? toNum(def.avgViews) : 0;
        const ratio = avg ? v / avg : 0;
        const cv = r.spend > 0 && v > 0 ? r.spend / v : 0;
        const cpvOk = r.spend === 0 || (cv > 0 && cv <= 0.012);
        const erN = parseFloat(r.er) || 0;
        const good = (ratio >= 1 || !avg) && cpvOk && erN >= 5;
        const bare3 = (r.handle || '@x').slice(1);
        const curTag = (s.alTags || {})[r.handle] || '';
        const pal = tagPalette[curTag] || ['#FFFFFF', '#647187', '#E2E8F2'];
        return {
          ...r, idx: i + 1, postDate: r.post, channelLogo: this.channelLogoOf(r.channel),
          initial: (r.handle || '@').slice(1, 2).toUpperCase(),
          cpv, cpvColor: r.spend === 0 ? '#4E7156' : (cpvOk ? '#1D2638' : '#C4636D'),
          postShort: String(r.post).slice(5),
          coverBg: this.coverOf(r.url, r.channel).bg,
          coverTint: this.coverOf(r.url, r.channel).tint,
          coverMark: this.coverOf(r.url, r.channel).mark,
          coverShade: this.coverOf(r.url, r.channel).shade,
          coverFg: this.coverOf(r.url, r.channel).fg || '#FFFFFF',
          rowBg: r.fresh ? '#F8FAFE' : (i % 2 === 1 ? '#FFFFFF' : '#FFFFFF'),
          links: [
            { label: nm[r.channel] || 'TikTok', short: (nm[r.channel] || 'TikTok').slice(0, 2), url: r.channel === 'YouTube' ? 'https://www.youtube.com/' + r.handle : (r.channel === 'Instagram' ? 'https://www.instagram.com/' + bare3 : 'https://www.tiktok.com/' + r.handle), title: (nm[r.channel] || 'TikTok') + ' 主页' },
            { label: r.channel === 'Instagram' ? 'TikTok' : 'Instagram', short: r.channel === 'Instagram' ? 'Ti' : 'In', url: r.channel === 'Instagram' ? 'https://www.tiktok.com/' + r.handle : 'https://www.instagram.com/' + bare3, title: '其他渠道主页' }
          ],
          aiOpen: s.alAiOpen === r.handle + '|' + r.title,
          aiVerdict: good ? '优质' : (cpvOk ? '一般' : '需复盘'),
          ...(() => {
            const key = 'as|' + r.handle + '|' + r.title;
            const stt = this.tagStateOf('asset', r.handle, r.title);
            return {
              assetTagOpen: s.assetTagOpen === key,
              toggleAssetTag: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ assetTagOpen: st.assetTagOpen === key ? null : key, alTagOpen: null, alAiOpen: null })); },
              assetTagOptions: [['合格素材', '提交审核 · 通过后计入合格', '#A5762C'], ['授权素材', '提交审核 · 通过后计入授权', '#1D48D8'], ['淘汰素材', '提交审核 · 不进入复用池', '#C4636D']].map(([t, sub, dot]) => {
                const on = stt.tag === t;
                return {
                  label: on ? '✓ ' + t : t, sub, dot,
                  bg: on ? '#EAF0FF' : 'transparent', fg: on ? '#2457F5' : '#1D2638',
                  pick: () => this.stageTag('asset', r.handle, t, r.title)
                };
              })
            };
          })(),
          ...this.submitMeta(r.handle, r.title),
          ...(() => {
            const dft = this.tagDraftOf('asset', r.handle, r.title);
            if (dft) return { assetTag: dft + ' · 待提交', assetTagBg: '#EAF0FF', assetTagFg: '#2457F5', assetTagNote: '已选择，点「提交申请」送审' };
            const t = this.assetTagOf(r, (parseFloat(r.er) || 0) >= 5); return { assetTag: t.tag, assetTagBg: t.bg, assetTagFg: t.fg, assetTagNote: t.note };
          })(),
          ...(() => { const d = creatorDefs.find(x => x.handle === r.handle) || {}; return this.dealMetaOf(r.spend > 0 ? '$' + r.spend : d.quote, d.quote); })(),
          tierText: (() => { const d = creatorDefs.find(x => x.handle === r.handle); return d ? this.tierOfFollowers(d.followers) : '—'; })(),
          aiDot: good ? SAGE : (cpvOk ? AMBER : RUST),
          aiToggleLabel: s.alAiOpen === r.handle + '|' + r.title ? '收起分析' : '展开完整分析',
          aiSummary: (avg ? (ratio >= 1 ? '高于该红人均播 ' + Math.round((ratio - 1) * 100) + '%' : '低于均播 ' + Math.round((1 - ratio) * 100) + '%') : '无均播基准')
            + ' · ' + (r.spend === 0 ? 'CPV 零成本' : (cpvOk ? 'CPV 达标 ' + cpv : 'CPV 超标 ' + cpv))
            + ' · ER ' + r.er,
          aiFg: good ? '#4E7156' : (cpvOk ? '#A5762C' : '#C4636D'),
          aiBg: s.alAiOpen === r.handle + '|' + r.title ? '#E8EEFF' : '#F7F9FF',
          aiBd: s.alAiOpen === r.handle + '|' + r.title ? '#B8CBFF' : '#D9E4FF',
          toggleAi: (e) => { if (e && e.stopPropagation) e.stopPropagation(); const k = r.handle + '|' + r.title; this.setState(st => ({ alAiOpen: st.alAiOpen === k ? null : k, alTagOpen: null })); },
          aiRows: [
            { label: avg ? (ratio >= 1 ? '高于红人均播 ' + Math.round((ratio - 1) * 100) + '%' : '低于红人均播 ' + Math.round((1 - ratio) * 100) + '%') : '无均播基准',
              note: avg ? '本条 ' + r.views + ' vs 近 30 天均播 ' + def.avgViews : '该红人不在红人库，缺少均播数据',
              color: ratio >= 1 || !avg ? SAGE : AMBER },
            { label: r.spend === 0 ? 'CPV 达标（寄样零成本）' : (cpvOk ? 'CPV 达标' : 'CPV 未达标'),
              note: r.spend === 0 ? '无固定费，仅佣金成本' : '本条 ' + cpv + ' vs 基准 $0.012',
              color: cpvOk ? SAGE : RUST },
            { label: good ? '数据优质' : (erN >= 5 ? '数据一般' : '互动偏弱'),
              note: 'ER ' + r.er + '（基准 5%）· ' + (good ? '建议加入白名单投放并复用文案' : '建议复盘开头 3 秒与卖点表达'),
              color: good ? SAGE : AMBER }
          ],
          ...(() => {
            const dft = this.tagDraftOf('creator', r.handle, r.title);
            if (dft) return { tagLabel: dft + ' · 待提交', tagged: true, tagBg: '#EAF0FF', tagFg: '#2457F5', tagBd: '#F0C9B8' };
            const stt = this.tagStateOf('creator', r.handle, r.title);
            if (stt.pending) return { tagLabel: stt.tag + ' · 待审核', tagged: true, tagBg: '#FBEEDA', tagFg: '#A5762C', tagBd: '#F0DCB8' };
            if (stt.rejected) return { tagLabel: stt.tag + ' · 已驳回', tagged: true, tagBg: '#F7EDEE', tagFg: '#C4636D', tagBd: '#F0C9C9' };
            return { tagLabel: curTag || '打标签', tagged: !!curTag, tagBg: pal[0], tagFg: pal[1], tagBd: pal[2] };
          })(),
          tagOpen: s.alTagOpen === r.handle + '|' + r.title,
          toggleTag: (e) => { if (e && e.stopPropagation) e.stopPropagation(); const k = r.handle + '|' + r.title; this.setState(st => ({ alTagOpen: st.alTagOpen === k ? null : k, alAiOpen: null })); },
          tagOptions: [['继续合作', '加入合作红人 List', '#2457F5'], ['合格/优质红人', '加入合格/优质红人', '#4E7156'], ['淘汰/拉黑', '加入淘汰 / 黑名单', '#C4636D']].map(([t, sub, dot]) => {
            const on = curTag === t;
            return {
              label: on ? '✓ ' + t : t, sub, dot,
              bg: on ? '#EAF0FF' : 'transparent', fg: on ? '#2457F5' : '#1D2638',
              pick: () => this.stageTag('creator', r.handle, t, r.title)
            };
          })
        };
      });
    })();
    const campaignAssetRows = alRows.filter(row => row.sku === cd.sku).map((row, index) => ({ ...row, idx: index + 1 }));

    // ── Asset Detail ──
    const assetExtras = [
      { perf: [['播放', '412K'], ['完播', '41%'], ['互动率', '6.2%'], ['折扣码转化', '188'], ['CPA', '$14.2']],
        highlights: [['0:02 – 0:06', '手部按压特写，本条最高留存点'], ['0:11', '「今晚终于放松了」，评论区被大量引用'], ['0:19', '产品与洗护瓶同框，构图可直接做详情页素材']],
        why: '这条内容的有效性来自节奏而非文案：第 2 秒就进入动作，跳过了所有自我介绍。情绪落点在结尾一句自述，而不是产品结论。',
        reuseList: ['作为白名单投放主素材（授权已覆盖 3 个月）', '截取 0:02–0:06 作为详情页首屏动图', '把「今晚终于放松了」写入下一轮 Brief 的参考句式'],
        rightsDetail: [['社媒使用', '6 个月 · 至 2027-02'], ['广告投放', '3 个月 · 至 2026-11'], ['二次剪辑', '允许'], ['白名单账号', '已开通']] },
      { perf: [['播放', '186K'], ['完播', '58%'], ['互动率', '12.4%'], ['折扣码转化', '141'], ['CPA', '$9.8']],
        highlights: [['0:00 – 0:03', '直接头皮特写，无铺垫'], ['0:08', '专业口吻解释清洁，未触碰功效 claim'], ['0:22', '主动引导评论区提问']],
        why: '双镜头结构让专业解释和真实使用同时存在，观众不需要在「广告」和「知识」之间选择。',
        reuseList: ['详情页第二屏的专业背书位', '剪成 9 秒版本用于 IG Reels 投放', '作为其他 KOC 的 Brief 视觉参考'],
        rightsDetail: [['社媒使用', '12 个月'], ['广告投放', '3 个月'], ['二次剪辑', '允许'], ['白名单账号', '已开通']] }
    ];
    const aIdx = Math.min(s.assetIdx, assets.length - 1);
    const aEx = assetExtras[aIdx] || {
      perf: [['播放', '—'], ['完播', '—'], ['互动率', '—'], ['折扣码转化', '—'], ['CPA', '—']],
      highlights: [['—', '尚未接入平台数据，AI 仅完成内容标签']],
      why: '缺少表现数据，暂不做归因推测。建议补录基础表现后重新分析。',
      reuseList: ['待补表现数据后再判断复用价值'],
      rightsDetail: [['社媒使用', '待确认'], ['广告投放', '未授权'], ['二次剪辑', '待确认'], ['白名单账号', '未开通']]
    };
    const ad = {
      ...assets[aIdx],
      perf: aEx.perf.map(([label, value]) => ({ label, value })),
      highlights: aEx.highlights.map(([t, note]) => ({ t, note })),
      why: aEx.why, reuseList: aEx.reuseList,
      rightsDetail: aEx.rightsDetail.map(([label, value]) => ({ label, value }))
    };

    // ── Strategy version history ──
    const promoQueue = (s.promoted || []).map(sku => {
      const p = skuAll.find(x => x.sku === sku);
      if (!p) return null;
      const sc = skuScoreMap[sku] || 60;
      return {
        name: p.name, sku, image: p.image, bu: p.bu, owner: p.owner, score: sc,
        color: this.scoreColor(sc), pillBg: this.pillBg(sc),
        asinUrl: 'https://www.amazon.com/dp/' + p.asin,
        fields: [
          { label: '市场', value: 'US' }, { label: '品牌', value: p.brand }, { label: '店铺', value: p.shop },
          { label: 'BU', value: p.bu }, { label: '品类', value: p.category }, { label: '运营专员', value: p.owner },
          { label: 'SKU', value: p.sku }, { label: 'ASIN', value: p.asin, link: 'https://www.amazon.com/dp/' + p.asin },
          { label: '星级', value: p.stars + ' ★' }, { label: 'Review 数量', value: p.reviews + ' 条' },
          { label: '客单价', value: p.price }, { label: 'RPS14', value: p.ps + ' 件' },
          { label: 'BSR 位置', value: '#' + p.bsr, note: p.bsrCat },
          { label: '大类排名', value: '#' + p.bsrTop, note: p.bsrTopCat },
          { label: '库存', value: p.stock + ' 件', note: p.stockNote }
        ].map(x => ({ ...x, plain: !x.link })),
        note: '由' + p.owner + '在产品库提交 · 等待生成策略',
        generated: (s.generated || []).includes(sku),
        pending: !(s.generated || []).includes(sku),
        genLabel: (s.generated || []).includes(sku) ? '✓ 已生成 v1' : '生成策略',
        genBg: (s.generated || []).includes(sku) ? '#E4EFE4' : '#2457F5',
        genFg: (s.generated || []).includes(sku) ? '#4E7156' : '#FFFFFF',
        genBd: (s.generated || []).includes(sku) ? '#CFE3D3' : '#2457F5',
        gen: () => {
          this.switchSku(sku);
          this.setState(st => ({
            stTab: 'work', benchOpen: true,
            generated: st.generated.includes(sku) ? st.generated : [...st.generated, sku],
            sw: { ...st.sw, step: 10, generated: true, confirmed: [], regen: {}, editing: null, loadedStatus: null, verBase: (st.library.find(x => x.sku === sku) || { ver: 0 }).ver + 1 },
            library: st.library.some(x => x.sku === sku)
              ? st.library.map(x => x.sku === sku ? { ...x, ver: x.ver + 1, date: '2026-08-22', confirmed: 0, status: swGateStatus } : x)
              : [{ sku, name: p.name, brand: p.brand, owner: p.owner, date: '2026-08-22', mode: st.sw.mode, ver: 1, status: swGateStatus, sections: { quick: 8, standard: 15, deep: 19 }[st.sw.mode], confirmed: 0 }, ...st.library]
          }));
          requestAnimationFrame(() => {
            const el = document.getElementById('strategy-bench-top');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        },
        remove: () => this.setState(st => ({
          promoted: st.promoted.filter(x => x !== sku),
          generated: st.generated.filter(x => x !== sku)
        }))
      };
    }).filter(Boolean).map((q, i) => ({
      ...q, idx: i + 1,
      note: (s.generated || []).includes(q.sku) ? '策略 v1 已生成 · 可在下方查看与编辑' : q.note,
      active: s.strategySku === q.sku,
      rowBd: s.strategySku === q.sku ? '#C8D4E8' : '#EEF2F8',
      rowBg: s.strategySku === q.sku ? '#F8FAFE' : 'transparent'
    }));
    const promoCount = promoQueue.length;
    const promoEmpty = promoCount === 0;

    const versions = [
      { v: 'v3', date: '2026-08-14', by: '周雅 · 采纳 AI 建议', note: '把 KOC 配比从 40% 提到 60%，预算重新分配', cur: true },
      { v: 'v2', date: '2026-07-28', by: 'AI Copilot', note: '写入 Q2 复盘结论：睡前 routine 设为默认内容形式', cur: false },
      { v: 'v1', date: '2026-07-19', by: 'AI Copilot', note: '首版：基于产品适配评分 87 自动生成', cur: false }
    ].map(v => ({ ...v, bg: v.cur ? '#F1F5FF' : '#fff', bd: v.cur ? '#D9E4FF' : '#EEF2F8', tag: v.cur ? '当前' : '恢复' }));

    // ── Brief list ──
    const briefList = [
      ...(bvLive.map((v, i) => ({
        id: 'brf-' + v.sku + '-' + (v.mode || 'channel') + '-' + v.ver,
        title: v.name + ' · ' + v.platform + ((v.mode === 'creator') ? ' · ' + (v.creator || '红人风格') : '') + ' 版 ' + v.ver,
        type: v.mode === 'creator' ? '红人风格' : '渠道',
        platform: v.platform, v: v.ver, status: v.status, creators: '0', fresh: true, saved: true, vIdx: i,
        meta: '第 ' + v.iter + ' 次生成' + (v.mode === 'creator' && v.creatorStyle ? ' · 风格：' + v.creatorStyle : '') + (v.prompt ? ' · 补充要求：' + v.prompt : ''),
        sku: v.sku, vMode: v.mode || 'channel', vCreator: v.creator || '', vStyle: v.creatorStyle || ''
      }))),
      ...((s.briefFromStrategy || []).map(x => ({
        id: 'brf-' + x.sku, title: x.name + ' · 由策略生成', type: '标准', platform: x.platform, v: 'v1',
        status: (s.briefSubmitted || []).includes('brf-' + x.sku) ? '待审批' : '草稿', creators: '0', fresh: true, sku: x.sku
      }))),
      { id: 'brf-102', title: 'Ryze · Q3 标准 Campaign Brief', type: '标准', platform: 'TikTok', v: 'v2', status: '待审批', creators: '14' },
      { id: 'brf-103', title: 'Ryze · @kaylascalp 个性化', type: '个性化', platform: 'TikTok', v: 'v1', status: '草稿', creators: '1' },
      { id: 'brf-104', title: 'Ryze · Instagram Reels 版本', type: '平台专属', platform: 'Instagram', v: 'v1', status: '已通过', creators: '4' },
      { id: 'brf-105', title: 'Ryze · Affiliate Brief', type: 'Affiliate', platform: '全平台', v: 'v2', status: '已通过', creators: '30' },
      { id: 'brf-106', title: 'Ryze · Ambassador 长期合作', type: 'Ambassador', platform: '全平台', v: 'v1', status: '草稿', creators: '6' },
      { id: 'brf-107', title: 'Ryze · 白名单投放授权 Brief', type: 'Whitelisting', platform: 'TikTok', v: 'v1', status: '待审批', creators: '8' }
    ].map(b => {
      const map = { '待审批': ['#FBEEDA', '#A5762C'], '草稿': ['#F5F8FE', '#647187'], '已通过': ['#E4EFE4', '#4E7156'], '已驳回': ['#F7EDEE', '#C4636D'] };
      const canSubmit = b.status === '草稿' || b.status === '已驳回';
      const [bg, fg] = map[b.status] || map['草稿'];
      const on = b.id === s.briefId;
      return {
        ...b, statusBg: bg, statusFg: fg, bg: b.fresh ? '#F8FAFE' : (on ? '#FFFFFF' : '#fff'),
        rowBd: on ? '#C8D4E8' : '#EEF2F8', rowBg: on ? '#F8FAFE' : '#FFFFFF',
        metaText: b.meta || (b.id + ' · ' + b.type + ' · ' + b.platform + ' · ' + b.v),
        canSubmit, submitLabel: b.status === '已驳回' ? '修改后重提' : (b.status === '草稿' ? '提交审批' : (b.status === '待审批' ? '审批中' : '已通过')),
        submitBg: canSubmit ? '#2457F5' : '#F7F9FC', submitFg: canSubmit ? '#FFFFFF' : '#A2ABBA',
        submitBd: canSubmit ? '#2457F5' : '#EAF0FF', submitCursor: canSubmit ? 'pointer' : 'default',
        submit: () => {
          if (!canSubmit) return;
          if (b.saved) this.setState(st => ({ briefVersions: (st.briefVersions || []).map((v, i) => i === b.vIdx ? { ...v, status: '待审批' } : v) }));
          else this.setState(st => ({ briefSubmitted: [...(st.briefSubmitted || []), b.id] }));
        },
        open: () => this.setState({
          briefId: b.saved ? 'brf-' + b.sku : b.id, briefView: 'editor', platform: b.platform,
          briefMode: b.saved ? b.vMode : 'channel',
          briefCreator: b.saved && b.vMode === 'creator' ? b.vCreator : '',
          briefCreatorStyle: b.saved && b.vMode === 'creator' ? b.vStyle : '',
          viewedVersion: b.saved ? b.sku + '|' + b.platform + '|' + b.vMode + '|' + b.v : null
        })
      };
    });

    const rpActions = (defs) => defs.map(n => {
      const on = (s.applied || []).includes(n.no);
      return {
        ...n, btnLabel: on ? '✓ 已写入' : n.cta,
        btnBg: on ? '#E4EFE4' : '#2457F5', btnFg: on ? '#4E7156' : '#FFFFFF', btnBd: on ? '#CFE3D3' : '#2457F5',
        apply: () => this.setState(st => ({ applied: st.applied.includes(n.no) ? st.applied : [...st.applied, n.no] }))
      };
    });

    const rNum = this.toNumU;
    const rTopAsset = facts.assets.slice().sort((a, b) => rNum(b.views) - rNum(a.views))[0] || { handle: '—', title: '—', views: '0' };
    const rBestEr = facts.assets.slice().sort((a, b) => parseFloat(b.er) - parseFloat(a.er))[0] || { handle: '—', er: '0%' };
    const rRoas = facts.spend ? facts.gmv / facts.spend : 0;
    const rCpa = facts.orders ? facts.spend / facts.orders : 0;
    const rSeeded = facts.assets.filter(a => a.spend === 0);
    const rPaid = facts.assets.filter(a => a.spend > 0);
    const rSeedGmv = rSeeded.reduce((t, a) => t + a.gmv, 0);
    const rPaidRoas = rPaid.reduce((t, a) => t + a.spend, 0) ? rPaid.reduce((t, a) => t + a.gmv, 0) / rPaid.reduce((t, a) => t + a.spend, 0) : 0;

    const reportShellMap = {
      campaign: {
        stamp: '实时派生 · Campaign 报告',
        title: '当前 Campaign 复盘：数据来自各模块实际记录',
        desc: facts.assetCount + ' 条内容、' + Object.keys(facts.assets.reduce((m, a) => { m[a.handle] = 1; return m; }, {})).length + ' 位红人、' + usd(facts.spend) + ' 花费。结论按“可以直接改下一轮策略”的顺序排列。',
        headline: '综合 ROAS ' + rRoas.toFixed(1) + 'x，其中寄样合作贡献了 ' + usd(rSeedGmv) + ' GMV 却几乎零固定成本，付费合作 ROAS 仅 ' + rPaidRoas.toFixed(1) + 'x——'
          + (rSeedGmv > 0 && rPaidRoas < rRoas ? '真正拉高效率的是寄样型 KOC，下一轮应把固定费预算压缩、佣金比例提高。' : '付费与寄样效率接近，可维持当前结构。')
          + (facts.overdue.length ? '当前 ' + facts.overdue.length + ' 个素材超期，是本轮进度的主要拖累。' : ''),
        kpis: [
          { label: '总花费', value: usd(facts.spend), note: '含固定费，寄样成本另计', color: '#1D2638' },
          { label: '内容产出', value: facts.assetCount + ' 条', note: facts.pending.length + ' 条待回收', color: '#1D2638' },
          { label: '综合 ROAS', value: rRoas.toFixed(1) + 'x', note: '目标 2.5x', color: rRoas >= 2.5 ? '#4E7156' : '#C4636D' },
          { label: 'CPA', value: rCpa ? '$' + rCpa.toFixed(1) : '—', note: '目标 ≤ $18', color: rCpa && rCpa <= 18 ? '#4E7156' : '#A5762C' }
        ],
        actionTitle: '下一轮建议 · 一键写入策略',
        actions: rpActions([
          { no: '01', title: '把寄样型 KOC 配比提到 60%', body: '寄样合作贡献 ' + usd(rSeedGmv) + ' GMV 且无固定费，单位效率高于付费合作。', cta: '写入策略' },
          { no: '02', title: '把「' + rTopAsset.title + '」的结构设为默认内容形式', body: '该条曝光 ' + rTopAsset.views + '，为本轮最高，结构可复制。', cta: '写入策略' },
          { no: '03', title: '给 ' + (facts.overdue[0] ? facts.overdue[0].handle : '逾期红人') + ' 设置强提醒', body: facts.overdue.length ? '当前 ' + facts.overdue.length + ' 位逾期，平均 ' + avgOverdue + ' 天，直接拖慢曝光进度。' : '交付端正常，保持现有提醒频率。', cta: '写入策略' },
          { no: '04', title: '把 CPV 基准从 $0.012 收紧到 $0.010', body: '实际 CPV $' + facts.cpv.toFixed(3) + '，已有空间设置更严的成本门槛。', cta: '写入策略' }
        ])
      },
      creator: {
        stamp: '实时派生 · Influencer 报告',
        title: '红人表现复盘：谁值得续约',
        desc: '按合作红人 List、邮件记录与素材表现计算 ' + facts.coop.length + ' 位在合作红人的产出与效率。',
        headline: '效率最高的是 ' + rBestEr.handle + '（ER ' + rBestEr.er + '），曝光最高的是 ' + rTopAsset.handle + '（' + rTopAsset.views + '）——'
          + '两者不是同一位，说明「买曝光」和「买互动」要分开配预算。'
          + (facts.stale.length ? '另有 ' + facts.stale.length + ' 位红人邮件超 48 小时未回，可能流失。' : ''),
        kpis: [
          { label: '合作红人', value: facts.coop.length + ' 位', note: '来自合作红人 List', color: '#1D2638' },
          { label: '已交付', value: facts.assetCount + ' 条', note: '按素材库统计', color: '#4E7156' },
          { label: '待回复', value: facts.replies.length + ' 位', note: facts.stale.length + ' 位超 48h', color: facts.stale.length ? '#A5762C' : '#4E7156' },
          { label: '逾期未交', value: facts.overdue.length + ' 位', note: avgOverdue ? '平均 ' + avgOverdue + ' 天' : '无逾期', color: facts.overdue.length ? '#C4636D' : '#4E7156' }
        ],
        actionTitle: '红人池调整建议 · 一键写入 CRM',
        actions: rpActions([
          { no: 'C1', title: rBestEr.handle + ' 转长期合作', body: 'ER ' + rBestEr.er + ' 为本轮最高，且以寄样为主，性价比最好。', cta: '写入 CRM' },
          { no: 'C2', title: '优先回复超期邮件', body: facts.stale.length ? facts.stale.map(x => x.handle).slice(0, 3).join('、') + ' 已等待超 48 小时。' : '暂无超期邮件。', cta: '写入 CRM' },
          { no: 'C3', title: '暂停逾期未交付红人的新一轮寄样', body: facts.overdue.length ? facts.overdue.map(x => x.handle).slice(0, 3).join('、') + ' 需先补交付再谈续约。' : '交付端正常。', cta: '写入 CRM' },
          { no: 'C4', title: '按合格/优质红人画像扩量', body: '用相似度扩量功能，按已验证画像补充候选池。', cta: '写入 CRM' }
        ])
      },
      asset: {
        stamp: '实时派生 · Asset 报告',
        title: '素材复盘：什么画面在起作用',
        desc: facts.assetCount + ' 条内容按曝光、互动与授权状态拆解，标出可直接投放与需补授权的部分。',
        headline: '互动率最高的是 ' + rBestEr.handle + ' 的内容（' + rBestEr.er + '），远高于 3.2% 基准；'
          + (facts.pendingRights ? '但只有 ' + facts.adReady + ' / ' + facts.assetCount + ' 条拿到广告授权，' + facts.pendingRights + ' 条因授权缺口无法放大——这是最大的一笔价值漏出。' : '授权覆盖良好，可直接进入白名单投放。'),
        kpis: [
          { label: '可用素材', value: facts.assetCount + ' 条', note: facts.adReady + ' 条广告可用', color: '#1D2638' },
          { label: '优质素材', value: facts.qualified + ' 条', note: 'ER ≥ 5%', color: '#4E7156' },
          { label: '待补授权', value: facts.pendingRights + ' 条', note: facts.pendingRights ? '影响投放放大' : '授权齐备', color: facts.pendingRights ? '#C4636D' : '#4E7156' },
          { label: '素材 GMV', value: usd(facts.gmv), note: facts.orders + ' 单归因', color: '#4E7156' }
        ],
        actionTitle: '素材复用建议 · 一键写入 Brief',
        actions: rpActions([
          { no: 'A1', title: '把「' + rTopAsset.title + '」列为 Brief 参考样片', body: '曝光 ' + rTopAsset.views + '，结构可被其他红人复制。', cta: '写入 Brief' },
          { no: 'A2', title: '把广告授权前置到 Brief 条款', body: '当前授权覆盖 ' + Math.round(facts.adReady / Math.max(1, facts.assetCount) * 100) + '%，交付后补谈成本更高。', cta: '写入 Brief' },
          { no: 'A3', title: '补齐 ' + facts.pendingRights + ' 条待授权素材', body: facts.pendingRights ? '需补二次授权后才能进入白名单投放。' : '暂无待授权素材。', cta: '写入 Brief' },
          { no: 'A4', title: '把 ER ≥ 5% 设为素材合格线', body: '当前 ' + facts.qualified + ' / ' + facts.assetCount + ' 条达标，可作为验收标准。', cta: '写入 Brief' }
        ])
      },
      product: {
        stamp: '实时派生 · Product Learning',
        title: '产品学习：把真实表现回写到评分',
        desc: '按 ' + facts.strat.length + ' 份策略与实际素材表现，回写产品营销得分。',
        headline: '参与推广的产品里，' + (facts.assets[0] ? facts.assets[0].product : '主推产品') + '的实际 ROAS ' + rRoas.toFixed(1) + 'x '
          + (rRoas >= 2.5 ? '验证了评分假设；' : '低于评分假设，说明「转化链路」维度被高估；')
          + '策略完成度 ' + facts.stratDone + ' / ' + facts.strat.length + '，未完成的部分会让下一轮 Brief 缺少依据。',
        kpis: [
          { label: '推广中产品', value: String(facts.projects), note: facts.promoted.length + ' 个新提交', color: '#1D2638' },
          { label: '策略已完成', value: facts.stratDone + ' / ' + facts.strat.length, note: '章节全部确认', color: facts.stratDone === facts.strat.length ? '#4E7156' : '#A5762C' },
          { label: 'Brief 已通过', value: facts.approvedBriefs.length + ' 份', note: facts.pendingApprovals.length + ' 份待审批', color: '#4E7156' },
          { label: '实际 ROAS', value: rRoas.toFixed(1) + 'x', note: '用于评分回写', color: rRoas >= 2.5 ? '#4E7156' : '#C4636D' }
        ],
        actionTitle: '评分回写建议 · 一键更新产品库',
        actions: rpActions([
          { no: 'P1', title: rRoas >= 2.5 ? '「转化链路」维持不变' : '「转化链路」下调 1 分', body: '实际 ROAS ' + rRoas.toFixed(1) + 'x' + (rRoas >= 2.5 ? '，评分假设得到验证。' : '，低于评分假设，需修正。'), cta: '更新评分' },
          { no: 'P2', title: '「情绪价值」上调 1 分', body: '互动率最高达 ' + rBestEr.er + '，情绪叙事的空间被验证。', cta: '更新评分' },
          { no: 'P3', title: '「社交传播性」按实际曝光校准', body: '最高单条 ' + rTopAsset.views + '，高于同类目常态。', cta: '更新评分' },
          { no: 'P4', title: '未完成策略的产品暂不进推广池', body: facts.strat.length - facts.stratDone > 0 ? (facts.strat.length - facts.stratDone) + ' 份策略章节未确认，缺少 Brief 依据。' : '所有策略已完成确认。', cta: '更新评分' }
        ])
      }
    };
    const reportShell = reportShellMap[s.reportTab] || reportShellMap.campaign;

    // ── Report tabs ──
    const reportTabs = ['campaign', 'creator', 'asset', 'product'].map(id => {
      const labels = { campaign: 'Campaign 报告', creator: 'Influencer 报告', asset: 'Asset 报告', product: 'Product Learning' };
      const on = s.reportTab === id;
      return { label: labels[id], pick: () => this.setState({ reportTab: id }), bg: on ? '#2457F5' : '#FFFFFF', fg: on ? '#FFFFFF' : '#647187', bd: on ? '#2457F5' : '#E2E8F2' };
    });

    const rNum2 = this.toNumU;
    const crMetaFor = (h) => CB_META[h] || {};
    const tierOf = (h) => {
      const d = creatorDefs.find(x => x.handle === h) || crMetaFor(h) || {};
      const n = this.toNumU(d.followers || d.avgViews || '0');
      if (n >= 1000000) return 'Mega';
      if (n >= 500000) return 'Macro';
      if (n >= 100000) return 'Mid-tier';
      if (n >= 10000) return 'Micro';
      return 'Nano';
    };
    const dealOfHandle = (h) => {
      const log = (s.contactLog || []).filter(x => x.handle === h && x.deal);
      if (log.length) return log[0].deal;
      const d = creatorDefs.find(x => x.handle === h) || {};
      const q = String(d.quote || '');
      const mode = String(d.mode || d.terms || '');
      const barter = /寄样|置换/.test(q);
      const commission = /佣金|%/.test(q + mode);
      if (barter && commission) return '佣金合作';
      if (barter) return '产品置换';
      if (/^\s*(免费|无偿)/.test(q)) return '免费合作';
      if (/[0-9]/.test(q)) return '付费合作';
      const paid = facts.assets.filter(x => x.handle === h).some(x => x.spend > 0);
      return paid ? '付费合作' : '待确认';
    };
    const dealPalette = {
      '付费合作': ['#EAF0FF', '#2457F5'], '产品置换': ['#E4EFE4', '#4E7156'], '佣金合作': ['#E4EEF7', '#1D48D8'],
      '免费合作': ['#F5F8FE', '#647187'], '拒绝合作': ['#F7EDEE', '#C4636D'], '待确认': ['#F5F8FE', '#8792A5']
    };
    const quoteLine = (h, deal) => {
      const d = creatorDefs.find(x => x.handle === h) || {};
      const q = String(d.quote || '');
      if (/寄样|置换/.test(q)) return /佣金|%/.test(q) ? '寄样 + 佣金' : '无固定费';
      if (/[0-9]/.test(q)) return '报价 ' + q + ' · 未结算';
      return deal === '待确认' ? '待确认报价' : '无固定费';
    };
    const creatorReport = (() => {
      const by = {};
      facts.assets.forEach(x => {
        by[x.handle] = by[x.handle] || { spend: 0, gmv: 0, n: 0, views: 0, erSum: 0 };
        by[x.handle].spend += x.spend; by[x.handle].gmv += x.gmv; by[x.handle].n += 1;
        by[x.handle].views += this.toNumU(x.views); by[x.handle].erSum += parseFloat(x.er) || 0;
      });
      const rows = Object.keys(by).map(h => {
        const d = by[h];
        const roas = d.spend ? d.gmv / d.spend : 0;
        const good = d.spend === 0 ? true : roas >= 2.5;
        const deal = dealOfHandle(h);
        const dp = dealPalette[deal] || dealPalette['付费合作'];
        return {
          handle: h, ...crMetaFor(h), tier: tierOf(h),
          deal, dealBg: dp[0], dealFg: dp[1],
          views: d.views >= 1000000 ? (d.views / 1000000).toFixed(2) + 'M' : Math.round(d.views / 1000) + 'K',
          er: (d.erSum / Math.max(1, d.n)).toFixed(1) + '%',
          cpv: d.spend > 0 && d.views ? '$' + (d.spend / d.views).toFixed(3) : '寄样',
          cpvColor: d.spend === 0 ? '#4E7156' : ((d.spend / Math.max(1, d.views)) <= 0.012 ? '#1D2638' : '#C4636D'),
          spend: d.spend ? '$' + d.spend.toLocaleString('en-US') : quoteLine(h, deal),
          out: d.n + ' 条', roas: d.spend ? roas.toFixed(1) + 'x' : '—',
          verdict: d.spend === 0 ? '继续合作 · 提高配额' : (roas >= 3 ? '继续合作 · 升级为 Ambassador' : (roas >= 2 ? '继续合作 · 用于专业背书' : '观察 · 报价需下调')),
          color: good ? SAGE : (roas >= 1.5 ? AMBER : RUST), _r: d.spend ? roas : 99
        };
      }).sort((x, y) => y._r - x._r);
      facts.overdue.forEach(o => {
        const deal = dealOfHandle(o.handle);
        const dp = dealPalette[deal] || dealPalette['付费合作'];
        rows.push({
          handle: o.handle, ...crMetaFor(o.handle), tier: tierOf(o.handle),
          deal, dealBg: dp[0], dealFg: dp[1],
          views: '—', er: '—', cpv: '—', cpvColor: '#A2ABBA',
          spend: quoteLine(o.handle, deal), out: '0 条', roas: '—', verdict: '暂停 · 逾期 ' + o.overdue + ' 天未交付', color: RUST, _r: -1
        });
      });
      return rows;
    })();
    const assetReport = (() => {
      const chan = ['TikTok', 'Instagram', 'YouTube'].map(c => {
        const rows = facts.assets.filter(x => x.channel === c);
        const er = rows.length ? rows.reduce((t, x) => t + parseFloat(x.er), 0) / rows.length : 0;
        return [c + '（' + rows.length + ' 条）', er ? er.toFixed(1) + '%' : '—', Math.min(100, Math.round(er / 14 * 100))];
      }).filter(r => r[1] !== '—');
      const total = Math.max(1, facts.assetCount);
      const social = facts.assets.filter(x => x.rights === 'social').length;
      return [
        { label: '按渠道 · 平均互动率', rows: chan },
        { label: '按授权状态 · 可复用比例', rows: [
          ['广告可用', facts.adReady + ' / ' + total, Math.round(facts.adReady / total * 100)],
          ['仅社媒', social + ' / ' + total, Math.round(social / total * 100)],
          ['待授权', facts.pendingRights + ' / ' + total, Math.round(facts.pendingRights / total * 100)]
        ] }
      ].map(g => ({ ...g, rows: g.rows.map(([label, value, pct]) => ({ label, value, pct, color: pct > 70 ? SAGE : pct > 45 ? AMBER : RUST })) }));
    })();
    const productLearning = (() => {
      const roas = facts.spend ? facts.gmv / facts.spend : 0;
      const erAvg = facts.assets.length ? facts.assets.reduce((t, x) => t + parseFloat(x.er), 0) / facts.assets.length : 0;
      const convDelta = roas >= 2.5 ? 0 : -1;
      const emoDelta = erAvg >= 6 ? 1 : 0;
      const complDelta = facts.pendingRights ? -1 : 0;
      const rows = [
        { label: '视觉展示力', before: '9', after: '9', note: '维持 · 画面可拍性已验证' },
        { label: '情绪价值', before: '9', after: String(9 + emoDelta), note: emoDelta ? '上调 · 平均 ER ' + erAvg.toFixed(1) + '% 高于基准' : '维持 · ER 未超阈值' },
        { label: '转化链路', before: '7', after: String(7 + convDelta), note: convDelta ? '下调 · 实际 ROAS ' + roas.toFixed(1) + 'x 低于评分假设' : '维持 · ROAS ' + roas.toFixed(1) + 'x 验证假设' },
        { label: '合规风险', before: '6', after: String(6 + complDelta), note: complDelta ? '下调 · ' + facts.pendingRights + ' 条素材授权/表述待修正' : '维持 · 未出现违规' }
      ];
      const delta = emoDelta + convDelta + complDelta;
      rows.push({ label: '总分', before: '87', after: String(87 + delta), note: '结构变化比总分更重要' });
      return rows.map(r => ({ ...r, color: Number(r.after) > Number(r.before) ? SAGE : Number(r.after) < Number(r.before) ? RUST : '#647187' }));
    })();

    const winning = (() => {
      const sorted = facts.assets.slice().sort((x, y) => parseFloat(y.er) - parseFloat(x.er)).slice(0, 3);
      const maxEr = parseFloat(sorted[0] ? sorted[0].er : '1') || 1;
      return sorted.map(x => ({
        label: x.title, value: 'ER ' + x.er,
        pct: Math.round(parseFloat(x.er) / maxEr * 100),
        note: x.handle + ' · ' + x.channel + ' · 曝光 ' + x.views + (x.spend === 0 ? ' · 寄样合作' : ' · 花费 $' + x.spend)
      }));
    })();
    const weak = (() => {
      const out = [];
      const low = facts.assets.slice().sort((x, y) => parseFloat(x.er) - parseFloat(y.er))[0];
      if (low) out.push({ label: low.title + '（' + low.handle + '）', note: 'ER ' + low.er + ' 为本轮最低，曝光 ' + low.views + '。建议复盘开头 3 秒与卖点表达。' });
      const costly = facts.assets.filter(x => x.spend > 0).map(x => ({ ...x, c: x.spend / Math.max(1, rNum2(x.views)) })).sort((x, y) => y.c - x.c)[0];
      if (costly) out.push({ label: costly.handle + ' 的单位成本偏高', note: 'CPV $' + costly.c.toFixed(3) + '，高于全局 $' + facts.cpv.toFixed(3) + '。续约前需重新议价。' });
      if (facts.overdue.length) out.push({ label: '交付逾期', note: facts.overdue.map(x => x.handle).join('、') + ' 共 ' + facts.overdue.length + ' 位逾期，平均 ' + avgOverdue + ' 天，直接拖慢曝光进度。' });
      if (facts.pendingRights) out.push({ label: '授权缺口', note: facts.pendingRights + ' 条素材仅社媒或待授权，无法进入白名单投放。' });
      return out.slice(0, 3);
    })();
    const nextRoundDefs = [
      { no: '01', title: 'KOC 配比从 40% 提到 60%', body: '按 Q2 完播与 CPA 数据，KOC 的单位成本效率是 micro 的 1.7 倍。' },
      { no: '02', title: '把「睡前 routine」设为默认内容形式', body: '开箱降为备选。Brief 模板已准备好对应版本。' },
      { no: '03', title: '把「可带进淋浴」列为必须包含', body: '这是评论区最高频疑问，写进 Brief 可减少一轮返工。' },
      { no: '04', title: '产品适配评分下调「转化链路」1 分', body: 'TikTok Shop 未接入导致归因缺口，实际转化路径比评分假设更长。' }
    ];
    const nextRound = nextRoundDefs.map(n => {
      const on = s.applied.includes(n.no);
      return {
        ...n, btnLabel: on ? '✓ 已写入' : '写入策略',
        btnBg: on ? '#E4EFE4' : '#2457F5', btnFg: on ? '#4E7156' : '#FFFFFF', btnBd: on ? '#CFE3D3' : '#2457F5',
        apply: () => this.setState(st => ({ applied: st.applied.includes(n.no) ? st.applied : [...st.applied, n.no] }))
      };
    });

    const ctmDefs = [
      { id: 'paid', deal: '付费合作', name: 'Influencer Content Agreement (Paid) v3', nameZh: '红人内容合作协议（付费）v3', ver: 'v3', updated: '2026-08-07', by: 'Legal · Zhou Ya',
        en: 'INFLUENCER CONTENT AGREEMENT\n\nThis Influencer Content Agreement (the "Agreement") is entered into as of {{Effective Date}} (the "Effective Date") by and between Lingqi Global Inc., a Delaware corporation with its principal place of business at 1 Market St, San Francisco, CA 94105 ("Brand"), and {{Creator Legal Name}}, an independent contractor residing at {{Creator Address}} ("Creator").\n\n1. SERVICES AND DELIVERABLES\n1.1 Creator shall produce and publish: one (1) primary video and three (3) still images featuring {{Product Name}} (SKU {{SKU}}).\n1.2 First draft due within fourteen (14) days of sample delivery. Brand is entitled to one (1) round of revisions.\n\n2. COMPENSATION\n2.1 Fixed Fee: {{Fee}} USD. Fifty percent (50%) payable within three (3) business days of execution; the remaining fifty percent (50%) within seven (7) days of publication.\n2.2 Commission: twelve percent (12%) of net sales attributed to Creator\'s unique discount code, paid by the 15th day of the following month.\n2.3 Creator is responsible for all applicable taxes. Brand will issue IRS Form 1099-NEC where required.\n\n3. LICENSE\n3.1 Creator grants Brand a non-exclusive, worldwide license to the Content for organic social use for six (6) (6) months.\n3.2 Paid amplification (whitelisting) is limited to three (3) months in the United States and Canada.\n\n4. FTC COMPLIANCE\n4.1 Creator shall clearly and conspicuously disclose the material connection using #ad or the platform\'s Paid Partnership tool, in accordance with the FTC Endorsement Guides (16 C.F.R. Part 255).\n4.2 Creator shall not make claims regarding treatment, cure, or prevention of any condition, or any performance claim not supported by Brand-provided substantiation.\n\n5. INDEPENDENT CONTRACTOR\nCreator is an independent contractor and not an employee, agent, or partner of Brand.\n\n6. TERMINATION\nBrand may terminate this Agreement if delivery is more than seven (7) days late, and may require return of samples or equivalent reimbursement.\n\n7. GOVERNING LAW\nThis Agreement is governed by the laws of the State of California, without regard to its conflict of laws principles.\n\nIN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.\n\nBRAND: ____________________    CREATOR: ____________________',
        zh: '红人内容合作协议\n\n本协议于 {{生效日期}}（"生效日"）由灵栖出海（Lingqi Global Inc.，特拉华州公司，主要营业地：1 Market St, San Francisco, CA 94105，下称"品牌方"）与 {{红人法定姓名}}（独立承揽人，住址 {{红人地址}}，下称"创作者"）签订。\n\n一、服务与交付物\n1.1 创作者应制作并发布：1 条主视频与 3 张静帧，产品为 {{产品名称}}（SKU {{SKU}}）。\n1.2 初稿应于样品签收后 14 日内提交，品牌方有权要求 1 轮修改。\n\n二、报酬\n2.1 固定费用：{{金额}} 美元。签署后 3 个工作日内支付 50%，内容发布后 7 日内支付剩余 50%。\n2.2 佣金：按创作者专属折扣码归因的净销售额 12% 计，于次月 15 日前支付。\n2.3 创作者自行承担相关税费；品牌方将在法律要求时开具 IRS 1099-NEC 表。\n\n三、授权\n3.1 创作者授予品牌方非独家、全球范围的自然流量社媒使用许可，期限 6 个月。\n3.2 付费放大（白名单投放）限于美国与加拿大，期限 3 个月。\n\n四、FTC 合规\n4.1 创作者须依据 FTC 代言指引（16 C.F.R. Part 255）以 #ad 或平台"付费合作"工具清晰显著披露商业关系。\n4.2 创作者不得作出治疗、治愈或预防任何病症的表述，亦不得作出品牌方未提供依据支持的功效表述。\n\n五、独立承揽关系\n创作者为独立承揽人，非品牌方之员工、代理人或合伙人。\n\n六、终止\n若交付逾期超过 7 日，品牌方可终止本协议，并可要求退还样品或等额赔付。\n\n七、适用法律\n本协议适用美国加利福尼亚州法律，不适用其冲突法规则。\n\n双方于生效日签署本协议。\n\n品牌方：____________________    创作者：____________________' },
      { id: 'barter', deal: '产品置换', name: 'Product Gifting (Barter) Agreement v2', nameZh: '产品置换（寄样）合作协议 v2', ver: 'v2', updated: '2026-07-28', by: 'Legal · Zhou Ya',
        en: 'PRODUCT GIFTING (BARTER) AGREEMENT\n\nThis Agreement is made as of {{Effective Date}} between Lingqi Global Inc. ("Brand") and {{Creator Legal Name}} ("Creator").\n\n1. GIFTED PRODUCT\n1.1 Brand shall ship {{Product Name}} × {{Quantity}} to Creator at no cost. Title passes to Creator upon delivery.\n1.2 The retail value of the gifted product is {{Retail Value}} USD and may constitute taxable income to Creator.\n\n2. CONTENT OBLIGATION\n2.1 Creator shall publish at least one (1) authentic usage post within twenty-one (21) days of receipt.\n2.2 Creative format, script, and posting time are at Creator\'s sole discretion; Brand provides only mandatory talking points.\n\n3. COMPENSATION\nNo fixed fee. Commission of twelve percent (12%) of net attributed sales, paid monthly.\n\n4. LICENSE\nOrganic social use for six (6) months. Paid amplification requires a separate written addendum.\n\n5. FTC COMPLIANCE\nCreator shall disclose that the product was received free of charge using #gifted or #ad in accordance with the FTC Endorsement Guides.\n\n6. NON-PERFORMANCE\nIf no content is published within the period in Section 2.1, Brand may request return of the product or reimbursement at retail value.\n\n7. GOVERNING LAW\nLaws of the State of California.\n\nBRAND: ____________________    CREATOR: ____________________',
        zh: '产品置换（寄样）合作协议\n\n本协议于 {{生效日期}} 由灵栖出海（"品牌方"）与 {{红人法定姓名}}（"创作者"）签订。\n\n一、置换标的\n1.1 品牌方免费向创作者寄送 {{产品名称}} × {{数量}}，所有权于交付时转移至创作者。\n1.2 所寄产品零售价值为 {{零售价值}} 美元，可能构成创作者的应税收入。\n\n二、内容义务\n2.1 创作者应在收到产品后 21 日内发布至少 1 条真实使用内容。\n2.2 内容形式、脚本与发布时间由创作者自行决定，品牌方仅提供必须讲到的要点。\n\n三、报酬\n无固定费用；按归因净销售额 12% 按月结算佣金。\n\n四、授权\n自然流量社媒使用 6 个月；如需付费投放，须另行签署书面补充协议。\n\n五、FTC 合规\n创作者须依据 FTC 代言指引，以 #gifted 或 #ad 披露产品为免费获得。\n\n六、未履行\n若未在第 2.1 条期限内发布内容，品牌方可要求退还产品或按零售价赔付。\n\n七、适用法律\n美国加利福尼亚州法律。\n\n品牌方：____________________    创作者：____________________' },
      { id: 'commission', deal: '佣金合作', name: 'Affiliate / Commission-Only Agreement v2', nameZh: '联盟（纯佣金）合作协议 v2', ver: 'v2', updated: '2026-08-02', by: 'Legal · Zhou Ya',
        en: 'AFFILIATE (COMMISSION-ONLY) AGREEMENT\n\nThis Agreement is made as of {{Effective Date}} between Lingqi Global Inc. ("Brand") and {{Creator Legal Name}} ("Creator").\n\n1. STRUCTURE\nNo fixed fee is payable. Creator is compensated solely through commission on attributed net sales.\n\n2. COMMISSION AND ATTRIBUTION\n2.1 Rate: eighteen percent (18%) of net sales (excluding shipping, taxes, and returns).\n2.2 Attribution: Creator\'s unique discount code and UTM link, with a thirty (30) day cookie window.\n2.3 Payment: by the 15th day of the following month via the payment method on file.\n\n3. CONTENT\nVolume and cadence are at Creator\'s discretion. Brand supplies product assets and approved claims.\n\n4. LICENSE\nOrganic social use for six (6) months.\n\n5. TIER UPGRADE\nIf attributed net sales exceed {{Threshold}} USD for two (2) consecutive months, the parties may convert to a fixed-fee plus commission arrangement.\n\n6. FTC COMPLIANCE\nCreator shall disclose the affiliate relationship in each post using #ad or the platform\'s disclosure tool.\n\n7. GOVERNING LAW\nLaws of the State of California.\n\nBRAND: ____________________    CREATOR: ____________________',
        zh: '联盟（纯佣金）合作协议\n\n本协议于 {{生效日期}} 由灵栖出海（"品牌方"）与 {{红人法定姓名}}（"创作者"）签订。\n\n一、合作结构\n不支付固定费用，创作者仅通过归因净销售额的佣金获得报酬。\n\n二、佣金与归因\n2.1 比例：净销售额的 18%（不含运费、税费与退货）。\n2.2 归因：创作者专属折扣码与 UTM 链接，归因窗口 30 天。\n2.3 支付：次月 15 日前按备案支付方式结算。\n\n三、内容\n数量与节奏由创作者决定；品牌方提供产品素材与已核准的表述。\n\n四、授权\n自然流量社媒使用 6 个月。\n\n五、升级条款\n若连续 2 个月归因净销售额超过 {{阈值}} 美元，双方可转为固定费 + 佣金模式。\n\n六、FTC 合规\n创作者须在每条内容中以 #ad 或平台披露工具说明联盟关系。\n\n七、适用法律\n美国加利福尼亚州法律。\n\n品牌方：____________________    创作者：____________________' },
      { id: 'free', deal: '免费合作', name: 'Co-Creation (No-Fee) Letter Agreement v1', nameZh: '内容共创（无费用）函件协议 v1', ver: 'v1', updated: '2026-06-30', by: 'Marketing · Chen Xi',
        en: 'CO-CREATION LETTER AGREEMENT (NO FEE)\n\nDated as of {{Effective Date}}, between Lingqi Global Inc. ("Brand") and {{Creator Legal Name}} ("Creator").\n\n1. NATURE OF ENGAGEMENT\nThis is a good-faith, no-fee collaboration. Neither party owes the other monetary consideration.\n\n2. BRAND CONTRIBUTION\nBrand provides {{Product Name}} samples, an asset pack, and approved talking points.\n\n3. CREATOR DISCRETION\nCreator is under no obligation to publish. Any publication is voluntary and at Creator\'s sole editorial discretion.\n\n4. LICENSE\nIf Creator publishes, Brand may reshare the content on its owned social channels with credit for three (3) months.\n\n5. FUTURE ENGAGEMENT\nSubject to performance, Brand intends to offer Creator a paid engagement in a subsequent campaign.\n\n6. FTC COMPLIANCE\nCreator shall disclose receipt of free product using #gifted where content is published.\n\n7. GOVERNING LAW\nLaws of the State of California.\n\nBRAND: ____________________    CREATOR: ____________________',
        zh: '内容共创（无费用）函件协议\n\n本函件协议于 {{生效日期}} 由灵栖出海（"品牌方"）与 {{红人法定姓名}}（"创作者"）签订。\n\n一、合作性质\n本合作为善意的无费用共创，双方互不支付对价。\n\n二、品牌方提供\n{{产品名称}} 样品、素材包与已核准的沟通要点。\n\n三、创作者自主权\n创作者无发布义务；任何发布均属自愿，并由创作者完全自主决定编辑内容。\n\n四、授权\n若创作者发布内容，品牌方可在其自有社媒渠道转载并署名，期限 3 个月。\n\n五、后续合作\n视内容表现，品牌方拟在后续活动中以付费方式邀请创作者。\n\n六、FTC 合规\n如发布内容，创作者须以 #gifted 披露免费获得产品。\n\n七、适用法律\n美国加利福尼亚州法律。\n\n品牌方：____________________    创作者：____________________' },
      { id: 'license', deal: '素材授权', name: 'Content License Addendum (Whitelisting) v2', nameZh: '素材二次授权补充协议（付费投放）v2', ver: 'v2', updated: '2026-08-12', by: 'Legal · Zhou Ya',
        en: 'CONTENT LICENSE ADDENDUM (PAID AMPLIFICATION)\n\nThis Addendum supplements the underlying agreement between Lingqi Global Inc. ("Brand") and {{Creator Legal Name}} ("Creator"), dated {{Underlying Agreement Date}}.\n\n1. LICENSED CONTENT\nAll video and still assets produced by Creator under the underlying agreement.\n\n2. PERMITTED USE\nPaid amplification, including TikTok Spark Ads and Meta Partnership Ads, from Brand\'s ad accounts.\n\n3. TERM AND TERRITORY\nThree (3) months from execution; United States and Canada.\n\n4. EDITING AND CREDIT\nBrand may trim runtime and adjust captions but shall not alter the meaning of Creator\'s statements or the product depiction. Creator credit shall be preserved.\n\n5. ADDITIONAL FEE\nTwenty percent (20%) of the underlying content fee as a one-time payment, or five percent (5%) of media spend, at Brand\'s election.\n\n6. USAGE REPORTING\nBrand shall provide spend and performance reporting upon Creator\'s written request, no more than once per month.\n\n7. GOVERNING LAW\nLaws of the State of California.\n\nBRAND: ____________________    CREATOR: ____________________',
        zh: '素材二次授权补充协议（付费投放）\n\n本补充协议系对灵栖出海（"品牌方"）与 {{红人法定姓名}}（"创作者"）于 {{主协议日期}} 签订之主协议的补充。\n\n一、授权素材\n创作者依主协议产出的全部视频与静帧素材。\n\n二、许可用途\n以品牌方广告账户进行付费投放，包括 TikTok Spark Ads 与 Meta Partnership Ads。\n\n三、期限与地域\n自签署日起 3 个月；美国与加拿大。\n\n四、剪辑与署名\n品牌方可裁剪时长并调整字幕，但不得改变创作者表述之原意或产品呈现，并应保留创作者署名。\n\n五、额外费用\n按主协议内容费用的 20% 一次性支付，或按媒体消耗的 5% 结算，由品牌方选择。\n\n六、投放数据反馈\n创作者书面要求时，品牌方应提供消耗与效果数据，每月不超过一次。\n\n七、适用法律\n美国加利福尼亚州法律。\n\n品牌方：____________________    创作者：____________________' },
      { id: 'ambassador', deal: '长期合作', name: 'Brand Ambassador Agreement v1', nameZh: '品牌大使（长期合作）协议 v1', ver: 'v1', updated: '2026-07-19', by: 'Legal · Zhou Ya',
        en: 'BRAND AMBASSADOR AGREEMENT\n\nThis Agreement is made as of {{Effective Date}} between Lingqi Global Inc. ("Brand") and {{Creator Legal Name}} ("Ambassador").\n\n1. TERM\nTwelve (12) months from the Effective Date, renewable by written notice no later than thirty (30) days prior to expiration.\n\n2. CONTENT COMMITMENT\nNot fewer than two (2) pieces of content per calendar quarter; formats agreed quarterly in writing.\n\n3. COMPENSATION\n3.1 Monthly retainer of {{Monthly Fee}} USD, payable on the first business day of each month.\n3.2 Commission of twelve percent (12%) of attributed net sales.\n\n4. EXCLUSIVITY\nDuring the Term, Ambassador shall not promote directly competitive products in the scalp-care device category.\n\n5. LICENSE\nOrganic social use and paid amplification for twelve (12) months.\n\n6. TERMINATION\nEither party may terminate on thirty (30) days\' written notice. Fees accrued through the termination date remain payable.\n\n7. GOVERNING LAW\nLaws of the State of California.\n\nBRAND: ____________________    AMBASSADOR: ____________________',
        zh: '品牌大使（长期合作）协议\n\n本协议于 {{生效日期}} 由灵栖出海（"品牌方"）与 {{红人法定姓名}}（"品牌大使"）签订。\n\n一、期限\n自生效日起 12 个月；如需续约，应于到期前 30 日以书面通知。\n\n二、内容承诺\n每自然季度不少于 2 条内容；形式由双方每季度书面确认。\n\n三、报酬\n3.1 月度固定费 {{月费}} 美元，于每月首个工作日支付。\n3.2 按归因净销售额 12% 计佣。\n\n四、排他\n合作期内，品牌大使不得推广头皮护理器械品类的直接竞品。\n\n五、授权\n自然流量社媒使用与付费投放，期限 12 个月。\n\n六、终止\n任一方可提前 30 日书面通知终止；截至终止日已产生的费用照常支付。\n\n七、适用法律\n美国加利福尼亚州法律。\n\n品牌方：____________________    品牌大使：____________________' }
    ];
    const ctmAll = [...(s.ctmCustom || []), ...ctmDefs];
    const ctmFilter = s.ctmFilter || '全部';
    const ctmVisible = ctmAll
      .filter(t => (s.ctmRemoved || []).indexOf(t.id) < 0)
      .filter(t => ctmFilter === '全部' || t.deal === ctmFilter);
    const ctmNewBlank = { deal: '付费合作', name: '', nameZh: '', ver: 'v1', seed: '', lang: 'en', en: '', zh: '', error: '' };
    const ctmNewDraft = { ...ctmNewBlank, ...(s.ctmNew || {}) };
    const ctmNewLang = ctmNewDraft.lang === 'zh' ? 'zh' : 'en';
    const ctmDeleteTarget = ctmAll.find(t => t.id === s.ctmDeleteId) || null;
    const patchCtmNew = (part) => this.setState(st => ({ ctmNew: { ...ctmNewBlank, ...(st.ctmNew || {}), ...part } }));
    const ctmPalette = {
      '付费合作': ['#EAF0FF', '#2457F5'], '产品置换': ['#E4EFE4', '#4E7156'], '佣金合作': ['#E4EEF7', '#1D48D8'],
      '免费合作': ['#F5F8FE', '#647187'], '素材授权': ['#F1F5FF', '#1D48D8'], '长期合作': ['#FBEEDA', '#A5762C']
    };

    const campaignEmailContractKey = campaignEmailReplyKey;
    const campaignEmailContractSelectedId = campaignEmailContractKey ? ((s.campaignEmailContractSelections || {})[campaignEmailContractKey] || '') : '';
    const campaignEmailContractDraft = campaignEmailContractKey ? ((s.campaignEmailContractDrafts || {})[campaignEmailContractKey] || null) : null;
    const campaignEmailContractIsAttached = !!(campaignEmailContractKey && (s.campaignEmailContractAttached || {})[campaignEmailContractKey]);
    const campaignEmailContractCreator = campaignEmailDrawerItem ? (creatorDefs.find(c => c.handle === campaignEmailDrawerItem.handle) || {}) : {};
    const campaignEmailContractShipment = campaignEmailDrawerItem ? ((s.shipOrders || []).filter(o => o.handle === campaignEmailDrawerItem.handle).sort((a, b) => String(a.date || '').localeCompare(String(b.date || ''))).slice(-1)[0] || {}) : {};
    const campaignEmailContractProduct = skuAll.find(p => p.sku === cd.sku) || {};
    const campaignEmailContractAddress = campaignEmailContractShipment.addr
      ? [campaignEmailContractShipment.addr.line1, campaignEmailContractShipment.addr.line2, campaignEmailContractShipment.addr.city, campaignEmailContractShipment.addr.state, campaignEmailContractShipment.addr.zip, campaignEmailContractShipment.addr.country].filter(Boolean).join(', ')
      : 'Address to be confirmed';
    const campaignEmailContractLegalName = (campaignEmailContractShipment.addr && campaignEmailContractShipment.addr.name) || (campaignEmailDrawerItem ? campaignEmailDrawerItem.handle.replace('@', '') : 'Creator');
    const campaignEmailContractFee = /^[$€£]/.test(campaignEmailContractCreator.quote || '') ? String(campaignEmailContractCreator.quote).replace(/[^0-9,.]/g, '') : '0';
    const fillCampaignEmailContract = (body) => {
      const values = {
        '{{Effective Date}}': '2026-09-07', '{{生效日期}}': '2026-09-07',
        '{{Creator Legal Name}}': campaignEmailContractLegalName, '{{红人法定姓名}}': campaignEmailContractLegalName,
        '{{Creator Address}}': campaignEmailContractAddress, '{{红人地址}}': campaignEmailContractAddress,
        '{{Product Name}}': cd.product, '{{产品名称}}': cd.product, '{{SKU}}': cd.sku,
        '{{Fee}}': campaignEmailContractFee, '{{金额}}': campaignEmailContractFee,
        '{{Quantity}}': String(campaignEmailContractShipment.qty || 1), '{{数量}}': String(campaignEmailContractShipment.qty || 1),
        '{{Retail Value}}': String(campaignEmailContractProduct.price || '$99.00').replace(/[^0-9,.]/g, ''), '{{零售价值}}': String(campaignEmailContractProduct.price || '$99.00').replace(/[^0-9,.]/g, ''),
        '{{Threshold}}': '5,000', '{{阈值}}': '5,000',
        '{{Underlying Agreement Date}}': '2026-08-20', '{{主协议日期}}': '2026-08-20',
        '{{Monthly Fee}}': campaignEmailContractFee === '0' ? '1,200' : campaignEmailContractFee, '{{月费}}': campaignEmailContractFee === '0' ? '1,200' : campaignEmailContractFee
      };
      return Object.keys(values).reduce((out, token) => out.split(token).join(values[token]), String(body || ''));
    };
    const buildCampaignEmailContractDraft = (t) => {
      const maintainedBody = ((s.ctmBodies || {})[t.id + '|en'] !== undefined) ? s.ctmBodies[t.id + '|en'] : t.en;
      const safeHandle = campaignEmailDrawerItem ? campaignEmailDrawerItem.handle.replace('@', '').replace(/[^a-zA-Z0-9._-]/g, '-') : 'creator';
      return {
        templateId: t.id,
        templateName: t.name,
        fileName: cd.sku + '-' + safeHandle + '-Collaboration-Agreement.pdf',
        body: fillCampaignEmailContract(maintainedBody),
        generatedAt: '2026-09-07 现在'
      };
    };
    const attachCampaignEmailContract = () => {
      if (!campaignEmailContractKey || !campaignEmailContractDraft || campaignEmailContractIsAttached) return;
      const note = 'Hi ' + (campaignEmailDrawerItem ? campaignEmailDrawerItem.handle.replace('@', '') : '') + ',\n\nAttached is the collaboration agreement generated from our approved template. Please review it and let me know if you would like any changes.\n\nBest,\nChenxi';
      this.setState(st2 => ({
        campaignEmailContractAttached: { ...(st2.campaignEmailContractAttached || {}), [campaignEmailContractKey]: true },
        campaignEmailReplies: { ...(st2.campaignEmailReplies || {}), [campaignEmailContractKey]: ((st2.campaignEmailReplies || {})[campaignEmailContractKey] || note) }
      }));
    };
    const campaignEmailContractTemplates = ctmAll.filter(t => (s.ctmRemoved || []).indexOf(t.id) < 0).map(t => {
      const selected = t.id === campaignEmailContractSelectedId;
      const pal = ctmPalette[t.deal] || ['#F5F8FE', '#647187'];
      return {
        name: t.nameZh, deal: t.deal, meta: t.ver + ' · Contract Mgt 更新于 ' + t.updated,
        bg: selected ? '#F1F5FF' : '#FFFFFF', tagBg: pal[0], tagFg: pal[1],
        pick: (e) => {
          if (e && e.stopPropagation) e.stopPropagation();
          if (!campaignEmailContractKey) return;
          const draft = buildCampaignEmailContractDraft(t);
          this.setState(st2 => ({
            campaignEmailContractMenuOpen: false,
            campaignEmailContractSelections: { ...(st2.campaignEmailContractSelections || {}), [campaignEmailContractKey]: t.id },
            campaignEmailContractDrafts: { ...(st2.campaignEmailContractDrafts || {}), [campaignEmailContractKey]: draft },
            campaignEmailContractAttached: { ...(st2.campaignEmailContractAttached || {}), [campaignEmailContractKey]: false }
          }));
        }
      };
    });
    const campaignEmailContractSelectedTemplate = ctmAll.find(t => t.id === campaignEmailContractSelectedId);

    const settingDefs = [
      ['seed', '寄样后自动创建跟进任务', '物流签收后 3 天未收到初稿，自动提醒负责人。'],
      ['guard', 'AI 合规守卫', '生成 Brief 与策略时自动检测功效、医疗、金融类 claim。'],
      ['autoTag', '资产上传后自动打标签', '包含内容摘要、卖点呈现、情绪风格与复用建议。'],
      ['weekly', '每周策略摘要邮件', '每周一发送 Campaign 进度与本周建议动作。'],
      ['portal', '红人门户（Beta）', '红人可自助查看 Brief、上传初稿、查看结算状态。']
    ];
    const settings = settingDefs.map(([k, label, desc]) => ({
      label, desc, trackBg: s.settings[k] ? SAGE : '#E2E8F2', justify: s.settings[k] ? 'flex-end' : 'flex-start',
      toggle: () => this.setState(st => ({ settings: { ...st.settings, [k]: !st.settings[k] } }))
    }));

    const ctxRoot = rootOf[page] || page;
    const promptBank = {
      dash: { ctx: 'Dashboard · 全局概览', ph: '问一句：哪个指标最该先补？', items: [
        { label: '这周最该先做什么？', reply: '按当前数据排序：先处理 ' + facts.overdue.length + ' 个逾期素材（直接拖慢曝光进度），再回 ' + facts.stale.length + ' 封超 48 小时的邮件。\n' + (facts.cpv <= 0.012 ? 'CPV 已达标，暂不需要压成本。' : 'CPV 高于基准，同时要压单位成本。') },
        { label: '曝光进度为什么落后', reply: '曝光缺口主要来自素材回收：目前待回收 ' + facts.pending.length + ' 条，其中 ' + facts.overdue.length + ' 条超期。\n把逾期的先催回来，比新增建联更快见效。' },
        { label: '哪个专员需要支援', reply: '按人员榜单，曝光达成最低的那位主要卡在建联到达成合作的转化上，建议把已验证的建联话术和相似度扩量候选分给他。' },
        { label: '预算花得合理吗', reply: '当前预算支出 ' + usd0(facts.budget.paid) + '，寄样型合作贡献了大部分 GMV 却几乎无固定费。\n建议下一轮把固定费预算压缩、佣金比例提高。' }
      ] },
      tasks: { ctx: 'My Tasks · 待办与审批', ph: '问一句：哪些审批可以先批？', items: [
        { label: '哪些审批可以立刻批', reply: '资料齐全、无合规风险的可先批：Brief 与素材入库类通常只需核对禁用词与授权范围。\n付款与合同变更建议留到最后，需要核对金额与条款。' },
        { label: '超期邮件怎么回', reply: '超 48 小时的按「先给确定性」写：明确合作方式、报价区间与交付节点，让红人只需回一个字。\n我可以按模板逐封起草。' },
        { label: '这批驳回意见怎么写', reply: '驳回意见写成可执行动作，例如「缺 #ad 标注，请补后重提」比「不合规」有用。\n我已准备四条快捷话术可直接选。' }
      ] },
      products: { ctx: 'Products · 产品与营销得分', ph: '问一句：哪个产品值得投红人预算？', items: [
        { label: '哪些产品值得投预算', reply: '优先营销得分 ≥ 75 且毛利能承载佣金的：内容可拍性与情绪价值是这个品类的决定项。\n得分低于 55 的建议先改产品页与卖点，再谈红人。' },
        { label: '这个产品适合什么红人层级', reply: '按十维评分，试用便利性高、单价中等的产品适合 KOC 为主（60%）+ Micro 标杆（30%）+ 专业背书（10%）。' },
        { label: '星级下降怎么处理', reply: '先看异动分析里的预警项：星级下降通常来自差评集中在某一使用场景，需要先在 Brief 里把该场景讲清楚，而不是加投。' },
        { label: '红人 GMV 结构健康吗', reply: '看红人 GMV 概况：单一产品占比过高说明依赖度风险；ROAS 低于 2 的产品建议先改内容角度再决定是否加投。' }
      ] },
      campaigns: { ctx: 'Campaigns · 项目与排期', ph: '问一句：哪个项目排期有风险？', items: [
        { label: '哪个项目排期有风险', reply: '看时间进度调整里标「排期落后」的阶段：内容产出阶段落后最常见，因为寄样到发布平均 18 天，超过 14 天目标。\n建议按 3 周提前量重排。' },
        { label: '推广KPI 能达成吗', reply: '按当前素材产出速度推算，曝光类 KPI 达成取决于剩余待回收素材能否按期交付。\n把逾期红人换成已验证的 KOC 更稳。' },
        { label: '预算目标要不要调', reply: '若已承诺超过预算池 90%，建议先冻结新增固定费合作，用寄样 + 佣金补量。' }
      ] },
      strategy: { ctx: 'Strategy Studio · 策略生成', ph: '问一句：这份策略还缺什么？', items: [
        { label: '这份策略还缺什么', reply: '通常缺的是「购买阻力」与「竞品差异化」的具体证据。\n把资料完整度里标红的字段补齐，生成的策略置信度会明显提升。' },
        { label: '营销目标该选哪个', reply: '新品且无历史数据选「新品起量」；已有验证角度要放量选「爆品打造」；追求品牌资产选「品牌打造」；维持稳定出量选「常规走量」。' },
        { label: '预算怎么分配', reply: '建议 70% 铺量（寄样 + 佣金）、20% 精品内容、10% 白名单投放，并预留 15% 给补量。' },
        { label: '红人组合怎么定', reply: '按产品适配评分：可拍性强的产品用 KOC 铺量；需要解释的产品必须配专业背书红人。' }
      ] },
      brief: { ctx: 'Brief Studio · Brief 生成', ph: '问一句：Brief 哪里会导致返工？', items: [
        { label: 'Brief 哪里会导致返工', reply: '最常见两处：一是逐字口播要求（会压低互动率），二是授权范围没前置（交付后再谈成本更高）。\n建议改成「必须讲到的三件事」并把广告授权写进条款。' },
        { label: '有哪些合规风险', reply: '两处：禁用词还缺时效类表述（「一次就见效」）；部分素材字幕出现功效性表达，需重剪后才能投放。' },
        { label: '按红人风格改写', reply: '给我红人的内容风格与惯用结构，我会把创作方向改成他熟悉的拍法，其余条款不变。' },
        { label: '这份 Brief 能提交了吗', reply: '看审批清单：交付物、Do/Don\'t、禁用词、授权范围四项齐全即可提交，个性化版本可选。' }
      ] },
      creators: { ctx: 'Influencer CRM · 红人与建联', ph: '问一句：这一轮该找谁？', items: [
        { label: '这一轮该找谁', reply: '先锁 FIT ≥ 85 且以寄样为主的红人做标杆，再用相似度扩量补量。\n报价高于均值但转化数据支撑不足的，建议先议价。' },
        { label: '这个报价合理吗', reply: '按 CPV 反推：用该红人近 30 天均播 × 目标 CPV 算出可接受固定费上限，超过就该压价或换成佣金。' },
        { label: '哪些红人该淘汰', reply: '受众或市场不匹配、连续逾期交付、CPV 长期高于基准这三类。淘汰与拉黑要分开标注，前者仍可复议。' },
        { label: '帮我写建联邮件', reply: '首次建联建议直接把产品与销售链接放在正文，让红人先看货再谈条件，回复率明显更高。\n我可以按你选的产品生成。' }
      ] },
      samples: { ctx: 'Sample Mgt · 寄样与物流', ph: '问一句：哪些寄样单需要跟进？', items: [
        { label: '哪些寄样单需要跟进', reply: '筛选「异常」即可：发出超过 7 天未签收的需联系承运商或补寄，否则寄样成本会变成沉没成本。' },
        { label: '批量寄样怎么建单', reply: '在创建寄样里用批量填写，把多行美式地址一次粘贴，系统按行生成寄样单并各自跟踪物流。' },
        { label: '签收后该做什么', reply: '签收即触发内容跟进：按 Brief 的交付节点提醒初稿，通常寄样后 14 天内。' }
      ] },
      assets: { ctx: 'Asset Library · 素材与授权', ph: '问一句：哪些素材值得放大？', items: [
        { label: '哪些素材值得放大', reply: '优先 ER ≥ 5% 且已拿到广告授权的：这类可直接进白名单投放。\n当前有 ' + facts.pendingRights + ' 条因授权缺口无法放大。' },
        { label: '这条素材表现如何', reply: '看行下的 AI 分析：会对比该红人近 30 天均播、CPV 是否达标、ER 是否高于基准，并给出复用或复盘建议。' },
        { label: '打标签后为什么没生效', reply: '素材与红人标签需要走审核：提交申请后进入 My Tasks，审核通过才收录到合格/授权素材与 CRM 名单，驳回会退回这里可重提。' },
        { label: '授权缺口怎么补', reply: '把广告授权前置到 Brief 条款是最省成本的做法；已交付的需单独补签二次授权附件。' }
      ] },
      finance: { ctx: 'Budget Mgt · 预算与结算', ph: '问一句：预算还剩多少可用？', items: [
        { label: '预算还剩多少可用', reply: '看预算池的剩余可用列：已承诺包含未付款的合作金额，真正可动用的是预算池减已承诺。' },
        { label: '这批发票能批吗', reply: '核对三项：金额与合同一致、素材已交付并达标、付款类型（首款/尾款）正确。缺一项建议驳回并注明原因。' },
        { label: '佣金怎么算', reply: '按归因 GMV × 佣金率计算，一键生成发票后进入付款审批；付款通过会回写预算池已付款。' }
      ] },
      reports: { ctx: 'Reports · 复盘与回写', ph: '问一句：这轮最该改什么？', items: [
        { label: '这轮最该改什么', reply: '按报告的行动建议顺序执行即可，前两条通常收益最大：调整红人层级配比与默认内容形式。' },
        { label: '哪些结论可以直接写回', reply: '带「写入策略 / 写入 CRM / 写入 Brief」按钮的都可一键回写，回写后下一轮生成会自动引用。' },
        { label: '合作类型怎么归类', reply: 'Influencer 报告按 CRM 的报价与合作方式归类，不看是否已交付；未确认的会显示待确认并展示报价。' }
      ] },
      contracts: { ctx: 'Contract Mgt · 合同模板', ph: '问一句：这类合作用哪份模板？', items: [
        { label: '这类合作用哪份模板', reply: '付费合作用固定费模板；纯寄样用置换模板；只给佣金用纯佣金模板；需要投放素材则必须叠加素材授权模板。' },
        { label: '条款要注意什么', reply: '三处最容易漏：授权范围与期限、二次剪辑权、争议解决地。美区建议明确州法适用。' }
      ] },
      settings: { ctx: 'Settings · 系统设置', ph: '问一句：哪些自动化值得打开？', items: [
        { label: '哪些自动化值得打开', reply: '建议开启寄样后自动跟进与 AI 合规守卫，这两项直接减少逾期与返工。\n红人门户在 Beta，建议先小范围试。' }
      ] }
    };
    const promptSet = promptBank[ctxRoot] || promptBank.dash;
    const prompts = promptSet.items.map(p => ({ label: p.label, send: this.ask(p.label, p.reply) }));

    const chat = s.chat.map(m => m.role === 'me'
      ? { text: m.text, align: 'flex-end', bg: '#1D2638', bd: '#1D2638', fg: '#F8FAFE' }
      : { text: m.text, align: 'flex-start', bg: '#fff', bd: '#E2E8F2', fg: '#1D2638' });

    const briefWords = 620 + s.accepted.length * 40;

    const bVaultArr = (() => {
	        const vf = {};
        const skus = [];
        bvLive.forEach(v => { if (skus.indexOf(v.sku) < 0) skus.push(v.sku); });
        (s.briefFromStrategy || []).forEach(x => { if (skus.indexOf(x.sku) < 0) skus.push(x.sku); });
        return skus.map((sku, i) => {
          const p = skuAll.find(x => x.sku === sku);
          if (!p) return null;
          const saved = bvLive
            .map((v, vi) => ({ v, vi }))
            .filter(x => x.v.sku === sku)
            .map(({ v, vi }) => ({
              key: v.platform + '|' + (v.mode || 'channel') + '|' + v.ver, vi, saved: true,
              label: v.platform + (v.mode === 'creator' ? ' · ' + (v.creator || '红人风格') : '') + ' ' + v.ver,
              status: v.status, iter: v.iter, prompt: v.prompt, mode: v.mode || 'channel', date: v.date || '—', origin: v.origin || '', briefStudioSession: v.briefStudioSession || '',
              comment: v.comment || '', by: v.by || '',
              creator: v.creator || '', creatorStyle: v.creatorStyle || '', platform: v.platform, ver: v.ver
            }));
          const draft = (s.briefFromStrategy || []).find(x => x.sku === sku);
          const list = [...saved];
          if (draft) list.push({
            key: 'draft', saved: false, label: '未保存草稿',
            status: (s.briefSubmitted || []).includes('brf-' + sku) ? '待审批' : '草稿',
            iter: 0, prompt: '', mode: 'channel', creator: '', creatorStyle: '', platform: draft.platform, ver: 'draft'
          });
          if (!list.length) return null;
          if (vf.country && vf.country !== 'US') return null;
          if (vf.brand && p.brand !== vf.brand) return null;
          if (vf.bu && p.bu !== vf.bu) return null;
          if (vf.asin && p.asin !== vf.asin) return null;
          if (vf.sku && p.sku !== vf.sku) return null;
          const chanFiltered = vf.channel ? list.filter(x => x.platform === vf.channel) : list;
          if (!chanFiltered.length) return null;
          const tabCandidates = sku === bSkuId && page === 'brief' ? chanFiltered.filter(x => briefEditorTab === 'creator' ? (x.mode === 'creator' || x.mode === 'style') : x.mode !== 'creator' && x.mode !== 'style') : chanFiltered;
          const selectable = tabCandidates.length ? tabCandidates : chanFiltered;
          const firstDraft = selectable.find(x => x.status === '草稿');
          const selKey = (s.vaultSel || {})[sku] || (firstDraft ? firstDraft.key : chanFiltered[0].key);
          const requested = chanFiltered.find(x => x.key === selKey);
          const requestedMatchesTab = requested && (briefEditorTab === 'creator' ? (requested.mode === 'creator' || requested.mode === 'style') : requested.mode !== 'creator' && requested.mode !== 'style');
          const sel = sku === bSkuId && page === 'brief' ? (requestedMatchesTab ? requested : selectable[0]) : (requested || chanFiltered[0]);
          const canSubmit = sel.status === '草稿' || sel.status === '已驳回';
          const stMap = { '草稿': ['#F5F8FE', '#647187'], '待审批': ['#FBEEDA', '#A5762C'], '已通过': ['#E4EFE4', '#4E7156'], '已驳回': ['#F7EDEE', '#C4636D'] };
          const sc = skuScoreMap[sku] || 60;
	          return {
	            sku, idx: i + 1, name: p.name, image: p.image, score: sc, scoreColor: this.scoreColor(sc),
            countText: (vf.channel ? chanFiltered.filter(x => x.saved).length + ' 个版本 · ' + vf.channel : saved.length + ' 个已保存版本'),
            chips: [
              { label: 'ASIN', value: p.asin, link: 'https://www.amazon.com/dp/' + p.asin },
              { label: 'SKU', value: p.sku }, { label: '品牌', value: p.brand },
              { label: '店铺', value: p.shop }, { label: '运营', value: p.owner }
            ].map(x => ({ ...x, plain: !x.link })),
            versions: chanFiltered.map(v => {
              const on = v.key === sel.key;
              const [sbg, sfg] = stMap[v.status] || stMap['草稿'];
              const vDraft = v.status === '草稿' || v.status === '已驳回';
              return {
                label: v.label, status: v.status, statusBg: sbg, statusFg: sfg,
                platform: v.platform, mode: v.mode || 'channel', ver: v.ver, date: v.date || '—', creator: v.creator || '', creatorStyle: v.creatorStyle || '', saved: v.saved, origin: v.origin || '', briefStudioSession: v.briefStudioSession || '',
                comment: v.comment ? '审批意见（' + (v.by || '审批人') + '）：' + v.comment : '',
                bg: on ? '#EAF0FF' : 'transparent', fg: on ? '#2457F5' : '#1D2638',
                subLabel: vDraft ? '申请审核' : (v.status === '待审批' ? '审核中' : '已通过'),
                subBg: vDraft ? '#2457F5' : '#F7F9FC', subFg: vDraft ? '#FFFFFF' : '#A2ABBA',
                subBd: vDraft ? '#2457F5' : '#EAF0FF', subCursor: vDraft ? 'pointer' : 'default',
                submit: (e) => {
                  if (e && e.stopPropagation) e.stopPropagation();
                  if (!vDraft) return;
                  if (v.saved) this.setState(st2 => {
                    const ak = sku + '|' + v.platform + '|' + v.ver + '|' + (v.creator || '');
                    const m = { ...(st2.approvals || {}) };
                    delete m[ak];
                    return { approvals: m, briefVersions: (st2.briefVersions || []).map((x, k) => k === v.vi ? { ...x, status: '待审批' } : x) };
                  });
                  else this.setState(st2 => ({ briefSubmitted: [...(st2.briefSubmitted || []), 'brf-' + sku] }));
                },
                pick: () => this.setState(st2 => ({
                  vaultSel: { ...(st2.vaultSel || {}), [sku]: v.key }, vaultMenu: null,
                  briefView: 'editor', briefId: 'brf-' + sku, platform: v.platform,
                  briefMode: v.mode, briefEditorTab: v.mode === 'creator' || v.mode === 'style' ? 'creator' : 'channel', briefCreator: v.creator, briefCreatorStyle: v.creatorStyle,
                  viewedVersion: v.saved ? sku + '|' + v.platform + '|' + v.mode + '|' + v.ver : null,
                  briefStudioNewKeys: [], briefStudioExistingKeys: (st2.briefVersions || []).filter(item => item.sku === sku).map(item => sku + '|' + item.platform + '|' + (item.mode || 'channel') + '|' + item.ver)
                }))
              };
            }),
            selLabel: sel.label,
            menuOpen: s.vaultMenu === sku, z: s.vaultMenu === sku ? 80 : 1,
            menuBd: s.vaultMenu === sku ? '#2457F5' : '#E2E8F2',
            toggleMenu: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st2 => ({ vaultMenu: st2.vaultMenu === sku ? null : sku })); },
            selMeta: sel.saved
              ? '当前选中 ' + sel.label + ' · 第 ' + sel.iter + ' 次生成' + (sel.creatorStyle ? ' · 风格：' + sel.creatorStyle : '') + (sel.prompt ? ' · 补充要求：' + sel.prompt : '')
              : '当前选中未保存草稿 · 保存版本后可长期留存',
            view: () => this.setState(st2 => ({
              briefView: 'editor', briefId: 'brf-' + sku, platform: sel.platform,
              briefMode: sel.mode, briefEditorTab: sel.mode === 'creator' || sel.mode === 'style' ? 'creator' : 'channel', briefCreator: sel.creator, briefCreatorStyle: sel.creatorStyle,
              viewedVersion: sel.saved ? sku + '|' + sel.platform + '|' + sel.mode + '|' + sel.ver : null,
              briefStudioNewKeys: [], briefStudioExistingKeys: (st2.briefVersions || []).filter(item => item.sku === sku).map(item => sku + '|' + item.platform + '|' + (item.mode || 'channel') + '|' + item.ver)
            })),
            submitLabel: sel.status === '草稿' ? '申请审核' : (sel.status === '待审批' ? '审核中 · 已申请' : '已通过 · 无需申请'),
            submitBg: canSubmit ? '#2457F5' : '#F7F9FC', submitFg: canSubmit ? '#FFFFFF' : '#A2ABBA',
            submitBd: canSubmit ? '#2457F5' : '#EAF0FF', submitCursor: canSubmit ? 'pointer' : 'default',
            submit: () => {
              if (!canSubmit) return;
              if (sel.saved) this.setState(st2 => ({ briefVersions: (st2.briefVersions || []).map((v, k) => k === sel.vi ? { ...v, status: '待审批' } : v) }));
              else this.setState(st2 => ({ briefSubmitted: [...(st2.briefSubmitted || []), 'brf-' + sku] }));
            }
          };
        }).filter(Boolean);
    })();
    const bEditorPanel = bVaultArr.find(x => x.sku === bSkuId);
    const briefEditorItems = bEditorPanel ? bEditorPanel.versions.map((v, i) => {
      const active = v.bg === '#EAF0FF';
      const itemType = v.mode === 'creator' || v.mode === 'style' ? 'creator' : 'channel';
      const kind = itemType === 'creator' ? (v.creator || '红人定向版') : '渠道通用版';
      const editorKey = bSkuId + '|' + v.key;
      return {
        ...v,
        idx: i + 1, editorKey, itemType,
        channelShort: v.platform === 'Instagram' ? 'IG' : (v.platform === 'YouTube' ? 'YT' : 'TT'),
        title: v.platform + ' · ' + kind + ' · ' + (v.ver === 'draft' ? '草稿' : v.ver),
        meta: (v.date === '—' ? '当前未保存' : v.date) + ' · 第 ' + (v.iter || 1) + ' 次生成',
        active,
        rowBg: active ? '#F1F5FF' : '#FFFFFF', rowBd: active ? '#8CAFFF' : '#E2E8F2',
        iconBg: active ? '#2457F5' : '#EAF0FF', iconFg: active ? '#FFFFFF' : '#2457F5',
        titleFg: active ? '#1D48D8' : '#1D2638', viewLabel: active ? '正在查看' : '点击查看'
      };
    }) : [];
    const briefEditorChannelItems = briefEditorItems.filter(v => v.itemType === 'channel');
    const briefEditorCreatorItems = briefEditorItems.filter(v => v.itemType === 'creator');
    const briefEditorVisibleItems = briefEditorTab === 'creator' ? briefEditorCreatorItems : briefEditorChannelItems;
    const briefEditorTabs = [
      { id: 'channel', label: '渠道 Brief', count: briefEditorChannelItems.length },
      { id: 'creator', label: '红人 Brief', count: briefEditorCreatorItems.length }
    ].map(tab => {
      const on = briefEditorTab === tab.id;
      const first = (tab.id === 'creator' ? briefEditorCreatorItems : briefEditorChannelItems)[0];
      return {
        ...tab, bg: on ? '#2457F5' : '#FFFFFF', fg: on ? '#FFFFFF' : '#647187', bd: on ? '#2457F5' : '#D9E1EF',
        countBg: on ? 'rgba(255,255,255,.18)' : '#F1F4F8', countFg: on ? '#FFFFFF' : '#8792A5',
        pick: () => {
          if (first && first.pick) first.pick();
          this.setState({ briefEditorTab: tab.id, briefMode: tab.id, briefStudioNotice: '', briefStudioSetupOpen: true, briefStudioCreatorPickerOpen: tab.id === 'creator' });
        }
      };
    });
    return {
      nav, crumbRoot, crumbLeaf,
      navWidth: collapsed ? '68px' : '252px',
      navPad: collapsed ? '20px 9px' : '20px 14px',
      navExpanded: !collapsed, navCollapsed: collapsed,
      navToggleIcon: collapsed ? '»' : '«',
      toggleNav: () => this.setState(st => ({ navCollapsed: !st.navCollapsed })),
      copilotOpen: s.copilotOpen, copilotClosed: !s.copilotOpen, thinking: s.thinking, chat, prompts,
      copilotCtx: promptSet.ctx, copilotPlaceholder: promptSet.ph,
      toggleCopilot: this.toggleCopilot,
      goProducts: this.go('products'), goCampaigns: this.go('campaigns'), goReports: this.go('reports'),
      goStrategy: this.go('strategy'), goBrief: this.go('brief'), goCreators: this.go('creators'), goAssets: this.go('assets'),
      isDash: page === 'dash', isTasks: page === 'tasks',
      pTabs, pTabLib: pTab === 'lib', pTabAnomaly: pTab === 'anomaly', pTabGmv: pTab === 'gmv',
      gmvTabs: ['month', 'quarter', 'year'].map(k => ({
        label: { month: '本月', quarter: '本季度', year: '本年度' }[k],
        pick: () => this.setState({ gmvPeriod: k }), ...this.pillOn((s.gmvPeriod || 'quarter') === k)
      })),
      gmvKpis: gmvCalc.kpis, gmvAiNote: gmvCalc.note,
      gmvAiOpen: !!s.gmvAiOpen,
      gmvAiToggle: s.gmvAiOpen ? '收起' : '展开',
      toggleGmvAi: () => this.setState(st => ({ gmvAiOpen: !st.gmvAiOpen })),
      gmvAiShort: String(gmvCalc.note).split(/[；。]/)[0] + '。',
      ...(() => {
        const key = s.gmvSortKey || 'gmv';
        const dir = s.gmvSort === 'asc' ? 1 : -1;
        const mk = (k, label) => ({
          label,
          sortUp: () => this.setState({ gmvSortKey: k, gmvSort: 'asc' }),
          sortDown: () => this.setState({ gmvSortKey: k, gmvSort: 'desc' }),
          upFg: (key === k && s.gmvSort === 'asc') ? '#2457F5' : '#CBD3DF',
          downFg: (key === k && (s.gmvSort || 'desc') === 'desc') ? '#2457F5' : '#CBD3DF'
        });
        const valOf = (x) => {
          if (key === 'orders') return this.toNumU(String(x.ordersText).replace(/,/g, ''));
          if (key === 'creators') return this.toNumU(String(x.creatorsText));
          if (key === 'roas') return parseFloat(String(x.roas)) || 0;
          return this.toNumU(String(x.gmv).replace(/[$,]/g, ''));
        };
        return {
          gmvSortHead: [mk('gmv', '红人 GMV')],
          gmvSortHead2: [mk('orders', '订单数'), mk('creators', '红人数'), mk('roas', 'ROAS')],
          gmvRows: gmvCalc.rows.slice().sort((a, b) => (valOf(a) - valOf(b)) * dir).map((r, i) => ({ ...r, idx: i + 1, rowBg: i % 2 === 1 ? '#FFFFFF' : '#FFFFFF' }))
        };
      })(),
      taskOpen: tasks.filter(t => !t.check).length, taskDone: tasks.filter(t => t.check).length, isProducts: page === 'products', isProductDetail: page === 'productDetail',
      isStrategy: page === 'strategy', isBrief: page === 'brief', isCreators: page === 'creators',
      isCampaigns: page === 'campaigns', isCampaign: page === 'campaignDetail',
      isCreatorProfile: page === 'creatorProfile', isAssetDetail: page === 'assetDetail',
      isAssets: page === 'assets', isReports: page === 'reports', isSettings: page === 'settings',
      isFinance: page === 'finance',
      tkLead: apPendingCount
        ? tasks.filter(t => !t.check).length + ' 项任务待处理 · ' + apPendingCount + ' 项等你审批'
        : tasks.filter(t => !t.check).length + ' 项任务待处理 · 审批已清空',
      tkTabs: [
        { id: 'list', label: '任务清单', note: '卡住流程的事 + 我的待办', badge: '' },
        { id: 'mail', label: '待回复邮件', note: '按等待时长排序 · 24h 预警 / 48h 升级', badge: facts.replies.length ? String(facts.replies.length) : '' },
        { id: 'approval', label: '审批清单', note: '九类审批 · 结果回流到对应模块与提醒', badge: apPendingCount ? String(apPendingCount) : '' }
      ].map(t => {
        const on = (s.tkTab || 'list') === t.id;
        return {
          ...t, pick: () => this.setState({ tkTab: t.id }),
          bg: on ? '#2457F5' : 'transparent', bd: on ? '#2457F5' : 'transparent',
          fg: on ? '#FFFFFF' : '#647187', noteFg: on ? '#FFFFFF' : '#8792A5'
        };
      }),
      tkTabList: (s.tkTab || 'list') === 'list', tkTabApproval: s.tkTab === 'approval', tkTabMail: s.tkTab === 'mail',
      tkMailNote: facts.stale.length
        ? facts.stale.length + ' 封已超 48 小时需立即处理 · ' + facts.warn.length + ' 封超 24 小时'
        : (facts.warn.length ? facts.warn.length + ' 封超 24 小时未回 · 无超 48 小时积压' : '全部在 24 小时内，无积压'),
      tkMailKpis: [
        { label: '待回复总数', value: String(facts.replies.length), note: '来自 Influencer CRM 邮件', color: '#1D2638' },
        { label: '超 24 小时', value: String(facts.warn.length), note: '预警 · 建议今日回', color: facts.warn.length ? '#A5762C' : '#4E7156' },
        { label: '超 48 小时', value: String(facts.stale.length), note: '升级 · 可能流失', color: facts.stale.length ? '#C4636D' : '#4E7156' },
        { label: '平均等待', value: (facts.replies.length ? Math.round(facts.replies.reduce((t, r) => t + r.hours, 0) / facts.replies.length) : 0) + ' h', note: '目标 ≤ 24 h', color: '#1D2638' }
      ],
      tkMailEmpty: tkMailList.length === 0,
      tkMailEmptyText: tkMailAll.length === 0
        ? '没有待回复的邮件，红人侧暂无等待。'
        : '当前筛选条件下没有匹配的邮件 · 共 ' + tkMailAll.length + ' 封，试试放宽筛选或点「清空」。',
      tkMailFilterNote: '命中 ' + tkMailList.length + ' 封 · 共 ' + tkMailAll.length + ' 封',
      tkMailClear: () => this.setState({ tkMailFilter: {}, tkMailFilterOpen: null }),
      tkMailFilters: (() => {
        const mf = s.tkMailFilter || {};
        const defs = [
          ['status', '回复状态', ['待回复邮件', '已回复邮件']],
          ['level', '邮件状态', ['12h 内', '24h 内', '48h 内', '超 48h']],
          ['tier', '红人层级', ['Nano', 'Micro', 'Mid', 'Macro']],
          ['tag', '红人标签', ['继续合作', '合格/优质红人', '合作中', '待确认', '淘汰/黑名单']]
        ];
        return defs.map(([k, label, opts]) => {
          const cur = mf[k] || '';
          const isOpen = s.tkMailFilterOpen === k;
          return {
            label, current: cur || (k === 'status' ? '全部邮件' : (k === 'level' ? '全部状态' : '全部')), open: isOpen,
            bg: cur ? '#EAF0FF' : '#F8FAFE', bd: isOpen ? '#2457F5' : (cur ? '#F0C9B8' : '#E2E8F2'),
            fg: cur ? '#2457F5' : '#1D2638',
            toggle: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ tkMailFilterOpen: st.tkMailFilterOpen === k ? null : k })); },
            options: [{ v: '', l: k === 'status' ? '全部邮件' : (k === 'level' ? '全部状态' : '全部') }].concat(opts.map(o => ({ v: o, l: o }))).map(o => ({
              label: o.l, bg: cur === o.v ? '#EAF0FF' : 'transparent', fg: cur === o.v ? '#2457F5' : '#647187',
              pick: () => this.setState(st => ({ tkMailFilter: { ...(st.tkMailFilter || {}), [k]: o.v }, tkMailFilterOpen: null }))
            }))
          };
        });
      })(),
      tkMailRows: tkMailList.map((r, i) => {
        const lvl = r.replied ? -1 : (r.hours >= 48 ? 3 : (r.hours >= 24 ? 2 : (r.hours >= 12 ? 1 : 0)));
        const d = creatorDefs.find(x => x.handle === r.handle) || {};
        const tagPal = { '继续合作': ['#EAF0FF', '#2457F5'], '合格/优质红人': ['#E4EFE4', '#4E7156'], '合作中': ['#E4EEF7', '#1D48D8'], '淘汰/黑名单': ['#F7EDEE', '#C4636D'] };
        const pal = tagPal[r.tag] || ['#F5F8FE', '#647187'];
        return {
          idx: i + 1, handle: r.handle, initial: r.handle.slice(1, 2).toUpperCase(),
          platform: d.platform || 'TIKTOK',
          tagText: r.tag, tagBg: pal[0], tagFg: pal[1],
          tier: r.tier,
          subject: r.subject, gist: r.gist, when: r.when,
          waitText: r.replied ? '已回' : r.hours + ' 小时',
          lvlText: ['12h 内', '24h 内', '48h 内', '超 48h'][lvl] || '已回复',
          lvlBg: ['#E4EFE4', '#E4EEF7', '#FBEEDA', '#F7EDEE'][lvl] || '#F5F8FE',
          lvlFg: ['#4E7156', '#1D48D8', '#A5762C', '#C4636D'][lvl] || '#647187',
          bd: ['#E2E8F2', '#E2E8F2', '#F0DCB8', '#F0C9C9'][lvl] || '#E2E8F2',
          go: () => this.setState({
            page: 'contact', contactHandle: r.handle, contactSent: false, mailThreadOpen: true, mailTab: 'history',
            replyTo: null, dealType: null, contactEmail: '', contactSubject: '', contactBody: '',
            contactProduct: null, contactProdOpen: false, subjectEdit: false, bodyEdit: false,
            mailOpenIdx: 0, mailTpl: 'first', mailProds: []
          }),
          markDone: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ repliedTo: [...(st.repliedTo || []), r.handle] })); }
        };
      }),
      expStrategy: () => {
        const rec = (s.library || []).find(x => x.sku === sSku.sku) || { ver: 1, confirmed: 0, sections: 0 };
        this.download(sSku.name + ' 策略 v' + rec.ver + '.html', this.printableDoc(sSku.name + ' · 红人种草推广策略 v' + rec.ver, [
          { h: '基本信息', rows: ['产品：' + sSku.name, 'SKU / ASIN：' + sSku.sku + ' / ' + sSku.asin, '市场：US · 品牌 ' + sSku.brand, '章节确认：' + rec.confirmed + ' / ' + rec.sections] },
          { h: 'A · 产品营销策略', rows: strategyA.map(x => x.label + '：' + x.body) },
          { h: 'B · 红人推广策略', rows: strategyB.map(x => x.label + '：' + x.body) },
          { h: '策略摘要', rows: strategySummary.map(x => x.key + '：' + x.value) },
          { h: '预算分配', rows: budget.map(x => x.label + '：' + x.amount + '（' + x.pct + '%）') }
        ]));
      },
      expBrief: () => {
        const blocks = briefBlocks.map(b => b.label + '：' + (b.isList ? (b.items || []).join('；') : b.body));
        this.download('Brief · ' + bProd.name + ' · ' + s.platform + '.html', this.printableDoc('Brief · ' + bProd.name + ' · ' + s.platform, [
          { h: 'Brief 正文', rows: blocks },
          { h: '交付与授权', rows: briefMeta.map(m => m.label + '：' + m.value) },
          { h: '审批清单', rows: checklist.map(c => (c.mark === '✓' ? '[已完成] ' : '[待处理] ') + c.label) }
        ]));
      },
      expReport: () => {
        this.download('复盘报告 · ' + reportShell.title + '.html', this.printableDoc(reportShell.title, [
          { h: '关键指标', rows: reportShell.kpis.map(k => k.label + '：' + k.value + '（' + k.note + '）') },
          { h: '头条结论', rows: [reportShell.headline] },
          { h: '有效卖点', rows: winning.map(w => w.label + ' · ' + w.value + ' · ' + w.note) },
          { h: '无效或需调整', rows: weak.map(w => w.label + '：' + w.note) },
          { h: reportShell.actionTitle, rows: reportShell.actions.map(a => a.no + ' ' + a.title + ' — ' + a.body) }
        ]));
      },
      expAssetPack: () => {
        const rows = alRows.map(r => [r.idx, r.handle, r.postDate, r.title, r.channel, r.sku, r.views, r.er, r.cpv, r.url].join(','));
        const csv = '序号,红人,发布日期,素材主题,渠道,SKU,曝光,ER,CPV,链接\n' + rows.join('\n');
        this.download('素材包清单 · ' + alRows.length + ' 条.csv', csv);
      },
      expAssetPackNote: '导出清单含每条素材的链接与授权状态，下载后可交给投放或详情页团队',
      expRangeOpen: !!s.expRangeOpen,
      expRangeBd: s.expRangeOpen ? '#2457F5' : '#E2E8F2',
      expRangeLabel: expRange.label + ' · ' + expRange.start.slice(5).replace('-', '/') + (expRange.start === expRange.end ? '' : '–' + expRange.end.slice(5).replace('-', '/')),
      toggleExpRange: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ expRangeOpen: !st.expRangeOpen })); },
      expRangeApply: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState({ expRangeOpen: false }); },
      expPresets: [['day', '本日'], ['week', '本周'], ['month', '本月'], ['quarter', '本季度'], ['year', '本年度']].map(([k, label]) => {
        const on = (s.expRangeMode || 'quarter') === k;
        return {
          label, pick: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState({ expRangeMode: k }); },
          bg: on ? '#2457F5' : '#FFFFFF', fg: on ? '#FFFFFF' : '#647187', bd: on ? '#2457F5' : '#E2E8F2'
        };
      }),
      expCalTitle: (() => { const m = (s.expCalMonth === undefined ? 7 : s.expCalMonth); return '2026 年 ' + (m + 1) + ' 月'; })(),
      expCalPrev: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ expCalMonth: Math.max(0, (st.expCalMonth === undefined ? 7 : st.expCalMonth) - 1) })); },
      expCalNext: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ expCalMonth: Math.min(11, (st.expCalMonth === undefined ? 7 : st.expCalMonth) + 1) })); },
      expCalHint: expRange.mode === 'day-pick' ? '已选单日 ' + expRange.start : '点日期可精确筛选某一天',
      expCalDays: (() => {
        const m = (s.expCalMonth === undefined ? 7 : s.expCalMonth);
        const first = new Date(2026, m, 1);
        const lead = (first.getDay() + 6) % 7;
        const days = new Date(2026, m + 1, 0).getDate();
        const out = [];
        for (let i = 0; i < lead; i++) out.push({ label: '', cursor: 'default', bg: 'transparent', fg: '#A2ABBA', fw: 400, title: '', pick: () => {} });
        for (let d = 1; d <= days; d++) {
          const iso = '2026-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
          const inSel = iso >= expRange.start && iso <= expRange.end;
          const isToday = iso === TODAY_ISO;
          const isPick = expRange.mode === 'day-pick' && iso === expRange.start;
          out.push({
            label: String(d), cursor: 'pointer', title: iso,
            bg: isPick ? '#2457F5' : (inSel ? '#EAF0FF' : 'transparent'),
            fg: isPick ? '#FFFFFF' : (isToday ? '#2457F5' : (inSel ? '#1D2638' : '#647187')),
            fw: isToday || isPick ? 600 : 400,
            pick: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState({ expRangeMode: 'day-pick', expPickDay: iso }); }
          });
        }
        return out;
      })(),
      fnNote: (() => {
        const lines = s.budgetLines || [];
        const pool = lines.reduce((t, x) => t + x.pool, 0);
        const paid = lines.reduce((t, x) => t + x.paid, 0);
        const ledger = (s.invoices || []).filter(i => i.status === '已付款').reduce((t, i) => t + i.amount, 0);
        return '总预算池 ' + usd0(pool) + ' · 累计已付款 ' + usd0(ledger) + '（发票台账口径）· ' + expRange.label + '命中 ' + expInvoices.length + ' 张发票（' + expInvoices.filter(i => i.status === '待审批').length + ' 张待审批）';
      })(),
      fnTabs: [['pool', '预算池'], ['comm', '佣金结算'], ['inv', '发票与付款审批']].map(([id, label]) => {
        const on = (s.fnTab || 'pool') === id;
        return { label, pick: () => this.setState({ fnTab: id }), bg: on ? '#2457F5' : '#FFFFFF', fg: on ? '#FFFFFF' : '#647187', bd: on ? '#2457F5' : '#E2E8F2' };
      }),
      fnTabPool: (s.fnTab || 'pool') === 'pool', fnTabComm: s.fnTab === 'comm', fnTabInv: s.fnTab === 'inv',
      fnKpis: (() => {
        const lines = s.budgetLines || [];
        const pool = lines.reduce((t, x) => t + x.pool, 0);
        const committed = lines.reduce((t, x) => t + x.committed, 0);
        const paid = lines.reduce((t, x) => t + x.paid, 0);
        const commDue = (s.commissions || []).filter(c => c.status === '待结算').reduce((t, c) => t + c.gmv * c.rate / 100, 0);
        const rangePaid = expInvoices.filter(i => i.status === '已付款').reduce((t, i) => t + i.amount, 0);
        const paidLedger = (s.invoices || []).filter(i => i.status === '已付款').reduce((t, i) => t + i.amount, 0);
        const rangePending = expInvoices.filter(i => i.status === '待审批').length;
        return [
          { label: '总预算池', value: usd0(pool), note: '剩余可用 ' + usd0(pool - committed), color: '#1D2638' },
          { label: '已承诺', value: usd0(committed), note: '占预算 ' + Math.round(committed / Math.max(1, pool) * 100) + '%', color: '#A5762C' },
          { label: expRange.label + '已付款', value: usd0(rangePaid), note: '累计已付 ' + usd0(paidLedger), color: '#4E7156' },
          { label: expRange.label + '待处理', value: String(rangePending) + ' 张', note: '待结算佣金 ' + usd0(commDue), color: rangePending ? '#A5762C' : '#4E7156' }
        ];
      })(),
      fnPool: (s.budgetLines || []).map(p => {
        const paidPct = Math.round(p.paid / Math.max(1, p.pool) * 100);
        const openPct = Math.round((p.committed - p.paid) / Math.max(1, p.pool) * 100);
        return {
          name: p.name, meta: p.sku + ' · ' + p.campaign,
          paidPct, openPct, freeText: usd0(p.pool - p.committed),
          cells: [
            { label: '预算池', value: usd0(p.pool), color: '#1D2638' },
            { label: '已承诺', value: usd0(p.committed), color: '#A5762C' },
            { label: '已付款', value: usd0(p.paid), color: '#4E7156' },
            { label: '使用率', value: Math.round(p.committed / Math.max(1, p.pool) * 100) + '%', color: p.committed / p.pool > 0.9 ? '#C4636D' : '#1D2638' }
          ]
        };
      }),
      fnComm: (s.commissions || []).map((c, i) => {
        const fee = c.gmv * c.rate / 100;
        const done = c.status !== '待结算';
        return {
          idx: i + 1, handle: c.handle, sku: c.sku, gmv: usd0(c.gmv), rate: c.rate + '%', fee: usd0(fee),
          status: c.status, stBg: done ? '#E4EFE4' : '#FBEEDA', stFg: done ? '#4E7156' : '#A5762C',
          rowBg: i % 2 === 1 ? '#FFFFFF' : '#FFFFFF', canPay: !done,
          pay: () => this.setState(st => ({
            commissions: (st.commissions || []).map(x => x.handle === c.handle && x.sku === c.sku ? { ...x, status: '已结算' } : x),
            invoices: [{
              id: 'INV-2026-' + (90 + (st.invoices || []).length), handle: c.handle,
              item: '佣金结算 · ' + c.sku + ' · ' + c.orders + ' 单', amount: Math.round(fee),
              date: '2026-08-31', status: '待审批', kind: '佣金',
              sku: c.sku, channel: chanOfHandle(c.handle),
              applicant: (skuAll.find(p => p.sku === c.sku) || { owner: '陈曦' }).owner,
              payType: '佣金结算'
            }, ...(st.invoices || [])],
            fnTab: 'inv'
          }))
        };
      }),
      fnInvEmpty: expInvoices.length === 0, fnInvNotEmpty: expInvoices.length > 0,
      fnInvSummary: (() => {
        const sum = (st) => expInvoices.filter(i => i.status === st).reduce((t, i) => t + i.amount, 0);
        return [
          { label: '待审批', value: usd0(sum('待审批')), color: '#A5762C' },
          { label: '待付款', value: usd0(sum('已通过')), color: '#1D48D8' },
          { label: '已付款', value: usd0(sum('已付款')), color: '#4E7156' },
          { label: '已驳回', value: usd0(sum('已驳回')), color: '#C4636D' }
        ];
      })(),
      fnInvTotal: usd0(expInvoices.reduce((t, i) => t + i.amount, 0)),
      fnInvFooter: expRange.label + ' 共 ' + expInvoices.length + ' 张 · 待审批 ' + expInvoices.filter(i => i.status === '待审批').length
        + ' 张 · 待付款 ' + expInvoices.filter(i => i.status === '已通过').length + ' 张 · 已付款 ' + expInvoices.filter(i => i.status === '已付款').length + ' 张',
      fnInv: expInvoices.map((i, ix) => {
        const meta = i.status === '已付款' ? ['#4E7156', '#E4EFE4'] : i.status === '已通过' ? ['#1D48D8', '#E4EEF7'] : i.status === '已驳回' ? ['#C4636D', '#F7EDEE'] : ['#A5762C', '#FBEEDA'];
        const set = (status) => () => this.setState(st => ({
          invoices: (st.invoices || []).map(x => x.id === i.id ? { ...x, status, by: 'Helen · Marketing Lead' } : x),
          budgetLines: status === '已付款' ? (st.budgetLines || []).map(b => b.sku === (i.item.indexOf('LUM') >= 0 ? 'LUM-AR-02' : 'RYZ-SC-01') ? { ...b, paid: b.paid + i.amount } : b) : st.budgetLines,
          notifLog: [{ kind: 'invoice', title: '发票' + status + ' · ' + i.id, note: i.handle + ' · ' + usd0(i.amount), when: '刚刚' }, ...(st.notifLog || [])]
        }));
        const prod = skuAll.find(p => p.sku === i.sku) || { name: '未指定产品', sku: i.sku || '—' };
        const pay = i.payType || '尾款';
        const payMeta = pay === '首款' ? ['#FBEEDA', '#A5762C'] : pay === '佣金结算' ? ['#E4EEF7', '#1D48D8'] : ['#F5F8FE', '#647187'];
        return {
          ...i, amount: usd0(i.amount), stBg: meta[1], stFg: meta[0],
          payType: pay, payBg: payMeta[0], payFg: payMeta[1],
          applicant: i.applicant || '陈曦',
          prodName: prod.name, skuText: prod.sku, channelText: i.channel || '—',
          rowBg: ix % 2 === 1 ? '#FFFFFF' : '#FFFFFF',
          settled: i.status === '已付款' || i.status === '已驳回',
          bd: i.status === '待审批' ? '#F0C9B8' : '#E2E8F2',
          byText: i.by ? ' · 审批人 ' + i.by : '',
          canDecide: i.status === '待审批', canPay: i.status === '已通过',
          approve: set('已通过'), reject: set('已驳回'), pay: set('已付款')
        };
      }),
      notifOpen: !!s.notifOpen,
      toggleNotif: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ notifOpen: !st.notifOpen })); },
      notifBg: s.notifOpen ? '#F8FAFE' : '#FFFFFF', notifBd: s.notifOpen ? '#C8D4E8' : '#E2E8F2',
      notifCount: (() => {
        const seen = s.notifSeen || [];
        return notifItems.filter(n => seen.indexOf(n.id) < 0).length || '';
      })(),
      notifEmpty: notifItems.length === 0,
      markAllNotif: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState({ notifSeen: notifItems.map(n => n.id) }); },
      notifs: notifItems.map(n => {
        const unread = (s.notifSeen || []).indexOf(n.id) < 0;
        return {
          ...n, fw: unread ? 600 : 400, bg: unread ? '#F8FAFE' : 'transparent',
          go: (e) => {
            if (e && e.stopPropagation) e.stopPropagation();
            this.setState(st => ({ notifSeen: st.notifSeen && st.notifSeen.indexOf(n.id) >= 0 ? st.notifSeen : [...(st.notifSeen || []), n.id], notifOpen: false, page: n.page, tkTab: n.tab || st.tkTab }));
          }
        };
      }),
      ...(() => ({}))(),
      apNote: apPool.filter(x => x.status === '待审批').length
        ? apPool.filter(x => x.status === '待审批').length + ' 项等待你审批 · 通过或驳回会回流到对应模块与提醒'
        : '当前没有待审批项 · 已处理的记录仍可撤回重审',
      apTabs: [['pending', '待审批', apPool.filter(x => x.status === '待审批').length], ['approved', '已通过', apPool.filter(x => x.status === '已通过').length], ['rejected', '已驳回', apPool.filter(x => x.status === '已驳回').length]].map(([id, label, n]) => {
        const on = (s.apTab || 'pending') === id;
        return {
          label: label + (n ? ' ' + n : ''), pick: () => this.setState({ apTab: id }),
          bg: on ? '#2457F5' : '#FFFFFF', fg: on ? '#FFFFFF' : '#647187', bd: on ? '#2457F5' : '#E2E8F2'
        };
      }),
      apKpis: (() => {
        const pend = apPool.filter(x => x.status === '待审批');
        const app = apPool.filter(x => x.status === '已通过');
        const rej = apPool.filter(x => x.status === '已驳回');
        const kinds = {};
        pend.forEach(x => { kinds[x.type] = (kinds[x.type] || 0) + 1; });
        const topKind = Object.keys(kinds).sort((a, b) => kinds[b] - kinds[a])[0];
        return [
          { label: '待审批', value: String(pend.length), note: pend.length ? '涉及 ' + Object.keys(kinds).length + ' 类 · 最多为 ' + topKind : '无积压', color: pend.length ? '#A5762C' : '#4E7156' },
          { label: '已通过', value: String(app.length), note: '结果已回流各模块', color: '#4E7156' },
          { label: '已驳回', value: String(rej.length), note: rej.length ? '需修改后重提' : '暂无', color: rej.length ? '#C4636D' : '#647187' },
          { label: '平均审批时长', value: '1.4 天', note: '目标 ≤ 1 天', color: '#A5762C' }
        ];
      })(),
      apComment: s.apComment || '',
      setApComment: (e) => this.setState({ apComment: e.target.value }),
      apRejectBg: (s.apComment || '').trim() ? '#C4636D' : '#F7EDEE',
      apRejectFg: (s.apComment || '').trim() ? '#FFFFFF' : '#C4636D',
      apQuick: ['合规禁用词已确认，可发', '缺 #ad 标注，请补后重提', '交付节点与授权范围需再对齐', '创作方向过窄，建议放宽'].map(t => ({
        label: t, pick: () => this.setState({ apComment: t })
      })),
      apEmpty: (() => {
        const tab = s.apTab || 'pending';
        const wantStatus = tab === 'pending' ? '待审批' : (tab === 'approved' ? '已通过' : '已驳回');
        const wantType = s.apType || '全部类型';
        return apPool.filter(x => x.status === wantStatus && (wantType === '全部类型' || x.type === wantType)).length === 0;
      })(),
      apTypes: (() => {
        const cur = s.apType || '全部类型';
        return ['全部类型', '选品', 'Campaign', 'Strategy', 'Brief', '红人合作', '寄样', '素材入库', '付款', '合同变更'].map(t => {
          const on = cur === t;
          return { label: t, pick: () => this.setState({ apType: t }), bg: on ? '#2457F5' : '#FFFFFF', fg: on ? '#FFFFFF' : '#647187', bd: on ? '#2457F5' : '#E2E8F2' };
        });
      })(),
      apRows: (() => {
        const tab = s.apTab || 'pending';
        const wantType = s.apType || '全部类型';
        const wantStatus = tab === 'pending' ? '待审批' : (tab === 'approved' ? '已通过' : '已驳回');
        const list = apPool.filter(x => x.status === wantStatus && (wantType === '全部类型' || x.type === wantType));
        return list.map((b, i) => {
          const decided = b.status !== '待审批';
          const open = s.apPanel === b.key;
          const meta = statusMetaBrief(b.status);
          const decide = (status) => () => {
            const c = (s.apComment || '').trim();
            if (status === '已驳回' && !c) { this.setState({ apPanel: b.key }); return; }
            this.setState(st => {
              const patch = {
                approvals: { ...(st.approvals || {}), [b.key]: { status, comment: c, by: 'Helen · Marketing Lead', when: '2026-08-20' } },
                apPanel: null, apComment: '',
                notifSeen: (st.notifSeen || []).filter(x => x !== 'ap-' + b.key),
                notifLog: [{ kind: 'approval', title: status + ' · ' + b.notifName, note: c || '无意见', when: '刚刚' }, ...(st.notifLog || [])]
              };
              if (b.isInvoice) {
                patch.invoices = (st.invoices || []).map(x => x.id === b.invoiceId ? { ...x, status, by: 'Helen · Marketing Lead' } : x);
              }
              if (b.isTag && b.tagKind === 'creator' && status === '已通过') {
                const h2 = b.tagTarget, t2 = b.tagValue;
                patch.alTags = { ...(st.alTags || {}), [h2]: t2 };
                if (t2 === '继续合作') {
                  patch.coopList = (st.coopList || []).includes(h2) ? st.coopList : [...(st.coopList || []), h2];
                  patch.blackAdded = (st.blackAdded || []).filter(x => x !== h2);
                } else if (t2 === '合格/优质红人') {
                  patch.qualityAdded = (st.qualityAdded || []).includes(h2) ? st.qualityAdded : [...(st.qualityAdded || []), h2];
                  patch.blackAdded = (st.blackAdded || []).filter(x => x !== h2);
                } else if (t2 === '淘汰/拉黑' || t2 === '拉黑') {
                  patch.blackAdded = (st.blackAdded || []).includes(h2) ? st.blackAdded : [...(st.blackAdded || []), h2];
                  patch.coopList = (st.coopList || []).filter(x => x !== h2);
                  patch.qualityAdded = (st.qualityAdded || []).filter(x => x !== h2);
                }
              }
              return patch;
            });
          };
          return {
            idx: i + 1, title: b.title, meta: b.meta,
            status: b.status, statusBg: meta[1], statusFg: meta[0],
            bd: b.status === '待审批' ? '#F0C9B8' : '#E2E8F2',
            comment: b.comment || '', by: b.by || '',
            commentLabel: b.by ? '审批意见 · ' + b.by : '审批意见',
            canDecide: !decided, decided,
            panelOpen: open, panelLabel: open ? '收起审批' : '审批',
            openPanel: () => this.setState(st => ({ apPanel: st.apPanel === b.key ? null : b.key, apComment: '' })),
            approve: decide('已通过'), reject: decide('已驳回'),
            reopen: () => this.setState(st => {
              const m = { ...(st.approvals || {}) };
              delete m[b.key];
              const patch = { approvals: m };
              if (b.isInvoice) patch.invoices = (st.invoices || []).map(x => x.id === b.invoiceId ? { ...x, status: '待审批', by: '' } : x);
              if (b.isTag && b.tagKind === 'creator') {
                const h3 = b.tagTarget;
                const tags3 = { ...(st.alTags || {}) };
                delete tags3[h3];
                patch.alTags = tags3;
                patch.coopList = (st.coopList || []).filter(x => x !== h3);
                patch.qualityAdded = (st.qualityAdded || []).filter(x => x !== h3);
                patch.blackAdded = (st.blackAdded || []).filter(x => x !== h3);
              }
              return patch;
            }),
            typeText: b.type, typeBg: b.typeBg, typeFg: b.typeFg,
            viewLabel: b.viewLabel,
            view: () => this.setState(b.goState)
          };
        });
      })(),
      apEmptyNote: (s.apType || '全部类型') === '全部类型' ? '该分组下暂无记录。' : '「' + (s.apType || '') + '」类型下暂无该状态的记录。',
      promoQueue, promoCount, promoEmpty, strategyTitle, strategyMeta, budgetTotalText,
      swQueueNote: (s.promoted || []).length > 0
        ? '产品库已勾选「推广」的 ' + (s.promoted || []).length + ' 个产品已排在最前，每个产品的输入与章节状态独立保存'
        : '在 Products 产品库勾选「推广」，产品会自动出现在这里；每个产品的输入与章节状态独立保存',
      swBenchOpen: !!s.benchOpen, swBenchClosed: !s.benchOpen,
      swDocMode: !!s.docMode, swShowRail: !s.docMode && swIsForm,
      swContentPadding: swIsGen ? '0' : '18px',
      swShowGenPanel: swIsGen && !s.docMode,
      swEditInputs: () => this.setState(st2 => ({ docMode: false, sw: { ...st2.sw, step: 1 } })),
      swCloseBench: () => this.setState({ benchOpen: false }),
      swBenchTitle: sSku.name + ' 策略',
      swBenchAsin: sSku.asin, swBenchSku: sSku.sku,
      swBenchAsinUrl: 'https://www.amazon.com/dp/' + sSku.asin,
      swVersionLabel: swCurrentVersionName + ' v' + swCurrentVersion,
      swVersionOptions,
      swVersionMenuOpen: !!s.swVersionMenu,
      swVersionBg: s.swVersionMenu ? '#EAF0FF' : '#FFFFFF',
      swVersionFg: s.swVersionMenu ? '#1D48D8' : '#334155',
      swVersionBd: s.swVersionMenu ? '#8CAFFF' : '#C8D4E8',
      swToggleVersionMenu: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st2 => ({ swVersionMenu: !st2.swVersionMenu, swSaveAsOpen: false, swSaveAsDraft: '' })); },
      swKeepVersionMenu: (e) => { if (e && e.stopPropagation) e.stopPropagation(); },
      swOpenVersionManager: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState({ swVersionMenu: false, swSaveAsOpen: false, swSaveAsDraft: '', swVersionManagerOpen: true, swVersionRenameKey: '', swVersionRenameDraft: '', swVersionDeleteKey: '' }); },
      swVersionManagerOpen: !!s.swVersionManagerOpen,
      swVersionManagerCount: swVersionManagerRows.length,
      swVersionManagerRows,
      swCloseVersionManager: () => this.setState({ swVersionManagerOpen: false, swVersionRenameKey: '', swVersionRenameDraft: '', swVersionDeleteKey: '' }),
      swKeepVersionManager: (e) => { if (e && e.stopPropagation) e.stopPropagation(); },
      swVersionRenameDraft: s.swVersionRenameDraft || '',
      swSetVersionRenameDraft: (e) => this.setState({ swVersionRenameDraft: e.target.value }),
      swUpdateVersion,
      swSaveAsOpen: !!s.swSaveAsOpen,
      swOpenSaveAs: (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        this.setState(st2 => st2.swSaveAsOpen
          ? { swSaveAsOpen: false, swSaveAsDraft: '' }
          : { swSaveAsOpen: true, swSaveAsDraft: (swCurrentVersionName + ' 副本').slice(0, 20), swVersionMenu: false });
      },
      swKeepSaveAs: (e) => { if (e && e.stopPropagation) e.stopPropagation(); },
      swSaveAsDraft: s.swSaveAsDraft || '',
      swSetSaveAsDraft: (e) => this.setState({ swSaveAsDraft: String(e.target.value || '').slice(0, 20) }),
      swSaveAsCount: String(s.swSaveAsDraft || '').length,
      swSaveAsBg: String(s.swSaveAsDraft || '').trim() ? '#4098F7' : '#E2E8F2',
      swSaveAsFg: String(s.swSaveAsDraft || '').trim() ? '#FFFFFF' : '#A2ABBA',
      swSaveAsCursor: String(s.swSaveAsDraft || '').trim() ? 'pointer' : 'default',
      swSaveAsVersion,
      swHasVersionNotice: !!s.swVersionNotice,
      swVersionNotice: s.swVersionNotice || '',
      swSteps, swInputSteps: swSteps.filter(x => x.no <= 8), swStep, swModuleName, swModuleFields, swModuleUploads, swModuleSources,
      swBenchSectionsVisible: !s.docMode,
      swBenchSections: [
        { id: 'input', label: '输入项', note: '8 组资料填写' },
        { id: 'check', label: '完整性检查', note: '证据映射 + 缺失项' },
        { id: 'result', label: '生成结果', note: '基于输入生成的策略正文' }
      ].map(t => {
        const on = t.id === 'result' ? swIsGen : (t.id === 'check' ? swIsCheck : swIsForm);
        return {
          ...t,
          bg: on ? '#2457F5' : 'transparent', bd: on ? '#2457F5' : 'transparent',
          fg: on ? '#FFFFFF' : '#647187', noteFg: on ? '#FFFFFF' : '#8792A5',
          pick: () => {
            this.setState(st2 => ({ sw: { ...st2.sw, step: t.id === 'result' ? 10 : (t.id === 'check' ? 9 : (st2.sw.step <= 8 ? st2.sw.step : 1)) } }));
            requestAnimationFrame(() => {
              const el = document.getElementById('strategy-bench-top');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
          }
        };
      }),
      swIsForm, swIsCheck, swIsGen, swScores, swRisks, swSources, swSourceCount: swSources.length,
      swEvidenceClaims, swEvidencePct, swInputPct, swAiPending, swMissing, swMissingCount: swMissing.length,
      swGateLabel, swGateColor, swGateBg, swGateNote, swHold,
      swModes, swModeName, swSections, swGenerated, swNotGenerated,
      swGroups, swToc, swConfirmedCount, swConfirmPct, swSectionTotal: swSections.length,
      swSetDraft: (e) => this.setState(st2 => ({ sw: { ...st2.sw, draft: e.target.value } })),
      swDraft: sw.draft,
      swFieldDraft: sw.fieldDraft,
      swSetFieldDraft: (e) => this.setState(st2 => ({ sw: { ...st2.sw, fieldDraft: e.target.value } })),
	      swConfirmAll: () => this.setState(st2 => ({ sw: { ...st2.sw, confirmed: swSections.map(x => x.no), savedAt: '刚刚' } })),
	      swShowHeaderConfirm: swIsGen && sw.generated,
	      swHeaderConfirmLabel: swConfirmedCount === swSections.length && swSections.length ? '✓ 已确认' : '确认',
	      swHeaderConfirmBg: swConfirmedCount === swSections.length && swSections.length ? '#E4EFE4' : '#2457F5',
	      swHeaderConfirmFg: swConfirmedCount === swSections.length && swSections.length ? '#4E7156' : '#FFFFFF',
	      swHeaderConfirmBd: swConfirmedCount === swSections.length && swSections.length ? '#CFE3D3' : '#2457F5',
	      swHeaderConfirm: () => this.setState(st2 => ({ sw: { ...st2.sw, confirmed: swSections.map(x => x.no), savedAt: '刚刚' } })),
      swStatusLabel, swStatusColor, swStatusBg, swSavedAt: sw.savedAt,
      swDrawer: sw.drawer, swUrlDraft: sw.urlDraft,
      swNoMissing: swMissing.length === 0,
      swToggleDrawer: (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        this.setState(st2 => ({ sw: { ...st2.sw, drawer: !st2.sw.drawer } }));
      },
      swCloseDrawer: () => this.setState(st2 => ({ sw: { ...st2.sw, drawer: false } })),
      swKeepDrawer: (e) => { if (e && e.stopPropagation) e.stopPropagation(); },
      swSetUrl: (e) => this.setState(st2 => ({ sw: { ...st2.sw, urlDraft: e.target.value } })),
      swAddUrl: () => { const u = (sw.urlDraft || '').trim(); if (!u) return; addSources([u]); this.setState(st2 => ({ sw: { ...st2.sw, urlDraft: '' } })); },
      swPickFiles: (e) => { const fs = Array.from(e.target.files || []); if (fs.length) addSources(fs.map(x => x.name)); e.target.value = ''; },
      swGenerate: () => this.setState(st2 => {
        const prev = st2.library.find(x => x.sku === sSku.sku);
        return {
        sw: { ...st2.sw, generated: true, step: 10, confirmed: [], regen: {}, editing: null, loadedStatus: null, verBase: prev ? prev.ver + 1 : 1 },
        library: st2.library.some(x => x.sku === sSku.sku)
          ? st2.library.map(x => x.sku === sSku.sku ? { ...x, ver: x.ver + 1, date: '2026-08-22', mode: st2.sw.mode, sections: swSectionCount, confirmed: 0, status: swGateStatus } : x)
          : [{ sku: sSku.sku, name: sSku.name, brand: sSku.brand, owner: sSku.owner, date: '2026-08-22', mode: st2.sw.mode, ver: 1, status: swGateStatus, sections: swSectionCount, confirmed: 0 }, ...st2.library]
        };
      }),
      library, libraryCount: library.length, libraryEmpty: library.length === 0,
      stFilters: (() => {
        const sf = s.stFilter || {};
        const prods = (s.library || []).map(x => skuAll.find(p => p.sku === x.sku)).filter(Boolean);
        const uq = (arr) => arr.filter((x, i) => x && arr.indexOf(x) === i);
        const defs = [
          ['country', '国家', ['US']],
          ['brand', '品牌', uq(prods.map(p => p.brand))],
          ['bu', 'BU', uq(prods.map(p => p.bu))],
          ['sku', 'SKU', uq(prods.map(p => p.sku))],
          ['mode', '模式', uq((s.library || []).map(x => ({ quick: '快速版', standard: '标准版', deep: '深度版' }[x.mode])))]
        ];
        return defs.map(([key, label, opts]) => {
          const cur2 = sf[key] || '';
          const isOpen = s.stFilterOpen === key;
          return {
            label, current: cur2 || '全部', open: isOpen,
            bg: cur2 ? '#EAF0FF' : '#F8FAFE', bd: isOpen ? '#2457F5' : (cur2 ? '#F0C9B8' : '#E2E8F2'),
            fg: cur2 ? '#2457F5' : '#1D2638',
            toggle: () => this.setState(st2 => ({ stFilterOpen: st2.stFilterOpen === key ? null : key })),
            options: [{ value: '', label: '全部' }, ...opts.map(o => ({ value: o, label: o }))].map(o => {
              const on = cur2 === o.value;
              return {
                label: o.label, bg: on ? '#EAF0FF' : 'transparent', fg: on ? '#2457F5' : '#647187',
                pick: () => this.setState(st2 => ({ stFilter: { ...(st2.stFilter || {}), [key]: o.value }, stFilterOpen: null, stVaultSel: {} }))
              };
            })
          };
        });
      })(),
      clearStFilter: () => this.setState({ stFilter: {}, stFilterOpen: null, stVaultSel: {} }),
      stVault: stVaultArr,
      stVaultEmpty: stVaultArr.length === 0,
      swProducts: (() => {
        const skus = [];
        (s.promoted || []).forEach(x => { if (skus.indexOf(x) < 0) skus.push(x); });
        (s.library || []).forEach(x => { if (skus.indexOf(x.sku) < 0) skus.push(x.sku); });
        if (skus.indexOf(sSku.sku) < 0) skus.unshift(sSku.sku);
	        return skus.map((sku, si) => {
	          const p = skuAll.find(x => x.sku === sku);
	          if (!p) return null;
	          const rec = (s.library || []).find(x => x.sku === sku);
	          const versionPanel = stVaultArr.find(x => x.sku === sku);
	          const on = sku === sSku.sku;
          const liveGate = on && sw.generated && !sw.loadedStatus;
          const meta = statusMeta(liveGate ? swGateStatus : (rec ? rec.status : 'draft'));
          const sc = skuScoreMap[sku] || 60;
	          const done = on && sw.generated ? swConfirmedCount : (rec ? rec.confirmed : 0);
	          const total = on && sw.generated ? swSections.length : (rec ? rec.sections : 0);
	          const pct = total ? Math.round(done / total * 100) : 0;
	          const fillPct = skuFillPct(sku);
	          const fillState = fillPct >= 100 ? ['资料完整', '#E4EFE4', '#4E7156', SAGE] : (fillPct >= 50 ? ['待完善', '#FBEEDA', '#A5762C', AMBER] : ['待补资料', '#FBE3E3', '#C4636D', RUST]);
	          return {
            idx: si + 1, name: p.name, sku, image: p.image, score: sc, scoreColor: this.scoreColor(sc), scoreBg: this.pillBg(sc),
            stateText: rec ? meta[0] : '未生成', stateColor: rec ? meta[1] : '#8792A5', stateBg: rec ? meta[2] : '#F5F8FE',
            bg: on ? '#F8FAFE' : '#FFFFFF', bd: on ? '#2457F5' : '#E2E8F2', fg: on ? '#1D2638' : '#1D2638',
            asinUrl: 'https://www.amazon.com/dp/' + p.asin,
            emptyIds: [],
            idFields: [
              { label: 'ASIN', value: p.asin, link: 'https://www.amazon.com/dp/' + p.asin },
              { label: 'SKU', value: p.sku }
            ].map(x => ({ ...x, plain: !x.link })),
            fields: [
              { label: '市场', value: 'US' }, { label: '品牌', value: p.brand }, { label: '店铺', value: p.shop }
            ].map(x => ({ ...x, plain: !x.link })),
            rateFields: [
              { label: '星级', value: p.stars + ' ★' }, { label: 'Review 数量', value: p.reviews + ' 条' }
            ].map(x => ({ ...x, plain: true })),
            pct, pctText: pct + '%',
	            fillPct, fillPctText: fillPct + '%', fillStateText: fillState[0], fillStateBg: fillState[1], fillStateColor: fillState[2], fillColor: fillState[3],
	            fillNote: '8 组输入项 · ' + (fillPct >= 100 ? '资料已完整' : '仍有资料待补充'),
            progText: total ? done + ' / ' + total + ' 章已确认 · 策略进度 ' + pct + '%' : '尚未生成策略',
            progColor: pct >= 100 ? SAGE : pct > 0 ? AMBER : '#8792A5',
            active: on, inactive: !on,
            fromLib: (s.promoted || []).includes(sku) && !rec,
            riskCount: swRisks.length,
            shadow: on ? '0 6px 20px rgba(242,140,107,.13)' : '0 1px 2px rgba(29,38,56,.03)',
            chips: [
              { label: 'ASIN', value: p.asin, link: 'https://www.amazon.com/dp/' + p.asin },
              { label: 'SKU', value: p.sku }, { label: '市场', value: 'US' },
              { label: '品牌', value: p.brand }, { label: '店铺', value: p.shop },
              { label: '星级', value: p.stars + ' ★' }, { label: 'Review', value: p.reviews }
            ].map(x => ({ ...x, plain: !x.link })),
            showFill: on && s.spPanel === 'fill', showAi: on && s.spPanel === 'ai',
            fillBg: on && s.spPanel === 'fill' ? '#F8FAFE' : '#FFFFFF',
            fillBd: on && s.spPanel === 'fill' ? '#C8D4E8' : '#EEF2F8',
            aiBg: on && s.spPanel === 'ai' ? '#E8EEFF' : '#FFFFFF',
            aiBd: on && s.spPanel === 'ai' ? '#B8CBFF' : '#D9E4FF',
            aiFg: '#1D48D8',
            openFill: (e) => {
              if (e && e.stopPropagation) e.stopPropagation();
              this.setState({ docMode: false });
              this.switchSku(sku);
              this.setState(st2 => ({ spPanel: st2.strategySku === sku && st2.spPanel === 'fill' ? null : 'fill' }));
            },
	            openAi: (e) => {
              if (e && e.stopPropagation) e.stopPropagation();
              this.switchSku(sku);
	              this.setState(st2 => ({ spPanel: st2.strategySku === sku && st2.spPanel === 'ai' ? null : 'ai' }));
	            },
	            versionMenuOpen: s.stVaultMenu === sku,
	            versionMenuEmpty: !versionPanel || !versionPanel.versions.length,
	            versionZ: s.stVaultMenu === sku ? 90 : 1,
	            versionBg: s.stVaultMenu === sku ? '#EAF0FF' : '#FFFFFF',
	            versionFg: s.stVaultMenu === sku ? '#1D48D8' : '#647187',
	            versionBd: s.stVaultMenu === sku ? '#8CAFFF' : '#E2E8F2',
	            versions: versionPanel ? versionPanel.versions : [],
	            toggleVersionMenu: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st2 => ({ stVaultMenu: st2.stVaultMenu === sku ? null : sku })); },
	            keepVersionMenu: (e) => { if (e && e.stopPropagation) e.stopPropagation(); },
            genLabel: !rec ? '生成策略' : (total > 0 && done >= total ? '查看策略' : '编辑策略'),
            genBg: on ? '#2457F5' : '#FFFFFF', genFg: on ? '#FFFFFF' : '#2457F5', genBd: on ? '#2457F5' : '#F0C9B8',
            hasRec: !!rec,
            regenLabel: '制作 Brief',
            regen: (e) => {
              if (e && e.stopPropagation) e.stopPropagation();
              this.setState(st2 => {
                const has = (st2.briefFromStrategy || []).some(y => y.sku === sku);
                return {
                  page: 'brief', briefView: 'list', briefPanel: null,
                  briefFromStrategy: has ? st2.briefFromStrategy : [{ sku, name: p.name, platform: 'TikTok' }, ...(st2.briefFromStrategy || [])]
                };
              });
            },
            pick: () => this.switchSku(sku),
            gen: (e) => {
              if (e && e.stopPropagation) e.stopPropagation();
              this.switchSku(sku);
              this.setState({ benchOpen: true, docMode: !!rec && total > 0 && done >= total });
              if (rec && !(total > 0 && done >= total)) { this.setState(st2 => ({ sw: { ...st2.sw, step: 1, generated: true } })); return; }
              this.setState(st2 => {
                const r = st2.library.find(y => y.sku === sku);
                if (r) return { sw: { ...st2.sw, step: 10, generated: true, editing: null } };
                return {
                  sw: { ...st2.sw, step: 10, generated: true, editing: null, confirmed: [], regen: {}, loadedStatus: null, verBase: 1 },
                  library: [{ sku, name: p.name, brand: p.brand, owner: p.owner, date: '2026-08-22', mode: st2.sw.mode, ver: 1, status: swGateStatus, sections: { quick: 8, standard: 15, deep: 19 }[st2.sw.mode], confirmed: 0 }, ...st2.library]
                };
              });
            }
          };
        }).filter(Boolean);
      })(),
	      stTabQueue: s.stTab === 'queue', stTabWork: s.stTab !== 'queue', stTabLib: false,
	      stTabs: [
	        { id: 'queue', label: '待生成', note: promoQueue.length + ' 个产品待生成' },
	        { id: 'work', label: '列表', note: '八模块输入 · 完整性检查 · 生成' }
	      ].map(t => {
	        const on = (s.stTab === 'queue' ? 'queue' : 'work') === t.id;
        return {
          label: t.label, note: t.note, pick: () => this.setState({ stTab: t.id }),
          bg: on ? '#2457F5' : 'transparent', bd: on ? '#2457F5' : 'transparent',
          fg: on ? '#FFFFFF' : '#647187', noteFg: on ? '#FFFFFF' : '#8792A5'
        };
      }),
      swRegenAll: () => this.setState(st2 => ({ sw: { ...st2.sw, regen: {} } })),
      swExport: () => {
        const lines = ['# ' + sSku.name + ' · 红人种草推广策略', '', '模式：' + swModeName + ' · 市场：US', ''];
        swSections.forEach(x => {
          lines.push('## ' + x.no + '. ' + x.title);
          lines.push(x.body + (x.src ? '  \n来源：' + x.src : '') + (x.inferred ? '  \n（含推断内容）' : ''));
          lines.push('');
        });
        const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = sSku.sku + '-strategy.md';
        a.click();
        URL.revokeObjectURL(a.href);
      },
      pipeAiOpen: !!s.pipeAiOpen,
      pipeAiToggleLabel: s.pipeAiOpen ? '收起 ↑' : '展开查看 ↓',
      pipeAiToggle: () => this.setState(st2 => ({ pipeAiOpen: !st2.pipeAiOpen })),
      pipeAiSummary: pipeDiag.summary,
      pipeAiPoints: [
        { title: '最该先做', color: AMBER, body: pipeDiag.next, go: () => this.setState({ page: pipeDiag.nextPage }) },
        { title: '风险', color: pipelineArr.filter(x => x.risk).length ? RUST : SAGE,
          body: pipelineArr.filter(x => x.risk).length
            ? pipelineArr.filter(x => x.risk).map(x => x.name + '（' + x.riskLabels + '）').join('；') + ' 需要先处理。'
            : '暂无时间或合规异常，其余节点均为正常进行中。',
          go: () => this.setState({ page: 'campaigns', cmTab: 'time' }) },
        { title: '可提前收口', color: SAGE, body: '素材回收达 30% 以上的产品可以先挑一批做白名单投放，不必等全部交付。', go: () => this.setState({ page: 'assets' }) }
      ],
      cmTabs: [
        { id: 'board', label: '推广进度看板', note: pipelineArr.length + ' 个产品在推广' },
        { id: 'list', label: 'Campaign 列表', note: '3 个进行中 · 1 个已复盘' },
        { id: 'time', label: '时间进度调整', note: timelineArr.filter(x => x.late).length + ' 个需顺延' }
      ].map(t => {
        const on = (s.cmTab || 'board') === t.id;
        return {
          label: t.label, note: t.note, pick: () => this.setState({ cmTab: t.id }),
          bg: on ? '#2457F5' : 'transparent', bd: on ? '#2457F5' : 'transparent',
          fg: on ? '#FFFFFF' : '#647187', noteFg: on ? '#FFFFFF' : '#8792A5'
        };
      }),
      cmTabBoard: (s.cmTab || 'board') === 'board',
      cmTabList: s.cmTab === 'list',
      cmTabTime: s.cmTab === 'time',
      isNewCampaign: page === 'newCampaign',
      ncOpen: () => this.setState({ page: 'newCampaign' }),
      ncClose: () => this.setState({ page: 'campaigns' }),
      ncSku: s.ncSku || '',
      ncSkuOpen: !!s.ncSkuOpen,
      ncToggleSku: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ ncSkuOpen: !st.ncSkuOpen, ncGoalOpen: false })); },
      ncSkuFg: s.ncSku ? '#1D2638' : '#A2ABBA',
      ncSkuBd: s.ncSkuOpen ? '#2457F5' : '#E2E8F2',
      ncTimeline: ncTimelinePreview,
      ncTimelineReady: ncTimelinePreview.ready,
      ncTimelineWaiting: !ncTimelinePreview.ready,
      ncProductName: (skuAll.find(x => x.sku === s.ncSku) || {}).name || '待选择产品',
      ncSkuLabel: (() => {
        const p = skuAll.find(x => x.sku === s.ncSku);
        return p ? p.name + ' · ' + p.sku : '选择已提交推广的产品';
      })(),
      ncSkuEmpty: (s.promoted || []).length === 0,
      ncSkuOptions: (() => {
        const pool = (s.promoted || []).map(sk => skuAll.find(x => x.sku === sk)).filter(Boolean);
        return pool.map(p => ({
          name: p.name, sku: p.sku,
          bg: s.ncSku === p.sku ? '#EAF0FF' : 'transparent',
          fg: s.ncSku === p.sku ? '#2457F5' : '#1D2638',
          pick: () => this.setState({ ncSku: p.sku, ncSkuOpen: false })
        }));
      })(),
      ...(() => {
        const q = String(s.ncSku || '').trim().toUpperCase();
        const p = skuAll.find(x => x.sku.toUpperCase() === q) || (q.length >= 3 ? skuAll.find(x => x.sku.toUpperCase().indexOf(q) === 0) : null);
        if (!p) return {
          ncFound: false,
          ncHint: q ? '未找到该 SKU，请检查后重试' : '从 Products 产品库已提交推广的产品中选择',
          ncHintFg: q ? '#C4636D' : '#A2ABBA',
          ncFields: [], ncInputs: [], ncSummary: '', ncBtnBg: '#F5F8FE', ncBtnFg: '#A2ABBA', ncBtnBd: '#E2E8F2', ncCreate: () => {}
        };
        const launchMap = { 'RYZ-SC-01': '2025-11', 'RYZ-SC-02': '2026-05', 'LUM-AR-02': '2025-08', 'VER-GL-04': '2024-12', 'NUV-SP-07': '2026-03' };
        const goal = s.ncGoal || '', budget = s.ncBudget || '', start = s.ncStart || '', end = s.ncEnd || '';
        const contentTarget = s.ncContentTarget || '', viewsTarget = s.ncViewsTarget || '';
        const kpi = contentTarget && viewsTarget ? contentTarget + ' 条内容 · ' + viewsTarget + ' 播放' : '';
        const ready = !!(goal && contentTarget && viewsTarget && budget && start && end && ncTimelinePreview.ready);
        return {
          ncFound: true,
          ncHint: '已匹配 ' + p.sku + ' · ' + p.name,
          ncHintFg: '#4E7156',
          ncFields: [
            { label: '品牌', value: p.brand }, { label: '市场', value: 'US' },
            { label: '产品名称', value: p.name }, { label: 'SKU', value: p.sku },
            { label: '上市时间', value: launchMap[p.sku] || '2026-01' }, { label: '运营专员', value: p.owner },
            { label: '星级', value: p.stars + ' ★' }, { label: 'Review 数量', value: p.reviews },
            { label: '客单价', value: p.price }, { label: 'RPS14', value: p.ps },
            { label: 'BSR 位置', value: '#' + p.bsr + ' · ' + p.bsrCat }, { label: '大类排名', value: '#' + p.bsrTop + ' · ' + p.bsrTopCat }
          ],
          ncInputs: ([
            {
              label: '营销目标', isSelect: true, note: '决定红人层级与内容形式',
              shown: goal || '选择营销目标', fg: goal ? '#1D2638' : '#A2ABBA',
              bd: s.ncGoalOpen ? '#2457F5' : '#E2E8F2', open: !!s.ncGoalOpen,
              toggle: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ ncGoalOpen: !st.ncGoalOpen, ncSkuOpen: false })); },
              options: ['爆品打造', '品牌打造', '新品起量', '常规走量'].map(g => ({
                label: g, bg: goal === g ? '#EAF0FF' : 'transparent', fg: goal === g ? '#2457F5' : '#1D2638',
                pick: () => this.setState({ ncGoal: g, ncGoalOpen: false })
              }))
            },
            { label: '内容数量目标', type: 'number', value: contentTarget, ph: '例：90', note: '用于计算内容产出目标达成率', set: (e) => this.setState({ ncContentTarget: e.target.value }) },
            { label: '播放量目标', type: 'text', value: viewsTarget, ph: '例：2.6M', note: '支持直接填写 2600000、2.6M 或 2600K', set: (e) => this.setState({ ncViewsTarget: e.target.value }) },
            { label: '营销预算（USD）', type: 'number', value: budget, ph: '例：42000', note: '创建后写入 Budget Mgt 预算池', set: (e) => this.setState({ ncBudget: e.target.value }) },
            { label: '开始时间', type: 'date', value: start, ph: '', note: '时间目标起点', set: (e) => this.setState({ ncStart: e.target.value, ncTimelineShift: 0, ncTimelineDates: {}, ncTimelineEdit: false, ncTimelinePhaseEdit: null }) },
            { label: '结束时间', type: 'date', value: end, ph: '', note: '时间目标终点', set: (e) => this.setState({ ncEnd: e.target.value, ncTimelineShift: 0, ncTimelineDates: {}, ncTimelineEdit: false, ncTimelinePhaseEdit: null }) }
          ]).map(x => ({ ...x, isInput: !x.isSelect })),
          ncSummary: ready
            ? '将创建：' + p.name + ' · ' + goal + ' · ' + contentTarget + ' 条内容 · ' + viewsTarget + ' 播放 · $' + Number(budget).toLocaleString('en-US') + ' · ' + start + ' 至 ' + end
            : '营销目标、内容数量、播放量、预算、开始与结束时间为必填',
          ncBtnBg: ready ? '#2457F5' : '#F5F8FE',
          ncBtnFg: ready ? '#FFFFFF' : '#A2ABBA',
          ncBtnBd: ready ? '#2457F5' : '#E2E8F2',
          ncCreate: () => {
            if (!ready) return;
            const timelineKey = 'new-' + p.sku.toLowerCase() + '-' + Date.now();
            this.setState(st => ({
              page: 'campaigns', ncSku: '', ncGoal: '', ncContentTarget: '', ncViewsTarget: '', ncBudget: '', ncStart: '', ncEnd: '', ncKpi: '', cmTab: 'list',
              ncTimelineShift: 0, ncTimelineDates: {}, ncTimelineEdit: false, ncTimelinePhaseEdit: null,
              promoted: (st.promoted || []).includes(p.sku) ? st.promoted : [...(st.promoted || []), p.sku],
              newCampaigns: [{ sku: p.sku, name: p.name, brand: p.brand, owner: p.owner, goal, kpi, contentTarget: Number(contentTarget), viewsTarget, budget: Number(budget), start: ncTimelinePreview.startIso || start, end: ncTimelinePreview.endIso || end, timelineKey, timelinePhases: ncTimelinePreview.serialized }, ...(st.newCampaigns || [])],
              budgetLines: (st.budgetLines || []).some(b => b.sku === p.sku)
                ? st.budgetLines
                : [...(st.budgetLines || []), { sku: p.sku, name: p.name, campaign: goal, pool: Number(budget), committed: 0, paid: 0 }],
              notifLog: [{ kind: 'campaign', title: '新建 Campaign · ' + p.name, note: goal + ' · $' + Number(budget).toLocaleString('en-US') + ' · ' + start + ' 至 ' + end, when: '刚刚' }, ...(st.notifLog || [])]
            }));
          }
        };
      })(),
      timeline: timelineArr,
      pipeline: pipelineArr, pipeEmpty: pipelineArr.length === 0,
      pipeNote: pipelineArr.length
        ? pipelineArr.length + ' 个产品在推广中 · ' + pipelineArr.filter(x => x.pct === 100).length + ' 个全流程完成 · ' + pipelineArr.filter(x => x.risk).length + ' 个有异常'
        : '在 Products 勾选「推广」后，这里会自动生成每个产品的推广进度',
      cp, cd, ad, campaignList, versions, briefList, reportTabs, creatorReport, assetReport, productLearning,
      showVersions: s.showVersions,
      toggleVersions: () => this.setState(st => ({ showVersions: !st.showVersions })),
	      briefViewEditor: s.briefView === 'editor', briefViewList: s.briefView !== 'editor', briefViewVault: false,
	      briefTabsVisible: false,
      briefTitleName: bProd.name + ' Brief', briefTitleAsin: bProd.asin, briefTitleSku: bProd.sku,
      briefTitleAsinUrl: 'https://www.amazon.com/dp/' + bProd.asin,
      briefTitleSavedAt: '刚刚', briefTitleCompleteness: bViewV && bViewV.status === '已通过' ? 100 : Math.min(98, 86 + (s.accepted || []).length * 2),
      briefVaultCount: briefList.length,
      vaultFilters: (() => {
        const vf = s.vaultFilter || {};
        const pool = [];
        [...bvLive.map(v => v.sku), ...(s.briefFromStrategy || []).map(x => x.sku)]
          .forEach(sk => { if (pool.indexOf(sk) < 0) pool.push(sk); });
        const prods = pool.map(sk => skuAll.find(x => x.sku === sk)).filter(Boolean);
        const uniq = (arr) => arr.filter((x, i) => x && arr.indexOf(x) === i);
        const defs = [
          ['country', '国家', ['US']],
          ['brand', '品牌', uniq(prods.map(p => p.brand))],
          ['bu', 'BU', uniq(prods.map(p => p.bu))],
          ['asin', 'ASIN', uniq(prods.map(p => p.asin))],
          ['sku', 'SKU', uniq(prods.map(p => p.sku))],
          ['channel', '渠道', uniq(bvLive.map(v => v.platform))]
        ];
        return defs.map(([key, label, opts]) => {
          const cur = vf[key] || '';
          const isOpen = s.vaultOpen === key;
          return {
            label, current: cur || '全部', open: isOpen,
            bg: cur ? '#EAF0FF' : '#F8FAFE', bd: isOpen ? '#2457F5' : (cur ? '#F0C9B8' : '#E2E8F2'),
            fg: cur ? '#2457F5' : '#1D2638',
            toggle: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ vaultOpen: st.vaultOpen === key ? null : key })); },
            options: [{ value: '', label: '全部' }, ...opts.map(o => ({ value: o, label: o }))].map(o => {
              const on = cur === o.value;
              return {
                label: o.label,
                bg: on ? '#EAF0FF' : 'transparent', fg: on ? '#2457F5' : '#647187',
                pick: () => this.setState(st => ({ vaultFilter: { ...(st.vaultFilter || {}), [key]: o.value }, vaultSel: {}, vaultOpen: null }))
              };
            })
          };
        });
      })(),
      clearVaultFilter: () => this.setState({ vaultFilter: {}, vaultSel: {}, vaultOpen: null }),
      vaultEmpty: bVaultArr.length === 0,
      briefTabs: [
        { id: 'list', label: '产品列表', note: '按产品查看与制作 Brief' },
        { id: 'vault', label: 'Brief 库', note: briefList.length + ' 份历史 Brief' }
      ].map(t => {
        const on = (s.briefView === 'vault' ? 'vault' : 'list') === t.id;
        return {
          label: t.label, note: t.note, pick: () => this.setState({ briefView: t.id }),
          bg: on ? '#2457F5' : 'transparent', bd: on ? '#2457F5' : 'transparent',
          fg: on ? '#FFFFFF' : '#647187', noteFg: on ? '#FFFFFF' : '#8792A5'
        };
      }),
      showBriefList: () => this.setState({ briefView: 'list' }),
      showBriefEditor: () => this.setState({ briefView: 'editor' }),
      briefIter, briefSavedCount: bVersions.length,
      briefSubmitLabel: !bViewV ? '先保存版本再申请' : (bViewV.status === '草稿' ? '申请审核' : (bViewV.status === '待审批' ? '审核中' : '已通过')),
      briefSubmitBg: bViewV && bViewV.status === '草稿' ? '#2457F5' : '#F7F9FC',
      briefSubmitFg: bViewV && bViewV.status === '草稿' ? '#FFFFFF' : '#A2ABBA',
      briefSubmitBd: bViewV && bViewV.status === '草稿' ? '#2457F5' : '#EAF0FF',
      briefSubmitCursor: bViewV && bViewV.status === '草稿' ? 'pointer' : 'default',
      submitViewedBrief: () => {
        if (!bViewV || bViewV.status !== '草稿') return;
        this.setState(st => ({
          briefVersions: (st.briefVersions || []).map(v =>
            (v.sku === bViewV.sku && v.platform === bViewV.platform && (v.mode || 'channel') === (bViewV.mode || 'channel') && v.ver === bViewV.ver)
              ? { ...v, status: '待审批' } : v)
        }));
      },
      briefModeCreator: bShowCreatorContext, briefModeChannel: !bShowCreatorContext,
      briefCreator: s.briefCreator || '', briefCreatorStyle: s.briefCreatorStyle || '', briefCreatorAudience: s.briefCreatorAudience || '',
      setBriefCreator: (e) => this.setState({ briefCreator: e.target.value }),
      setBriefCreatorStyle: (e) => this.setState({ briefCreatorStyle: e.target.value }),
      setBriefCreatorAudience: (e) => this.setState({ briefCreatorAudience: e.target.value }),
      briefStudioSetupOpen: s.briefStudioSetupOpen !== false,
      briefStudioSetupArrow: s.briefStudioSetupOpen !== false ? '收起 ↑' : '展开 ↓',
      briefStudioSetupToggle: () => this.setState(st => ({ briefStudioSetupOpen: st.briefStudioSetupOpen === false })),
      briefStudioModeChannel: briefEditorTab === 'channel', briefStudioModeCreator: briefEditorTab === 'creator',
      briefStudioSetupTitle: briefEditorTab === 'creator' ? '选择红人生成 Brief' : '选择渠道生成 Brief',
      briefStudioSetupSummary: briefEditorTab === 'creator' ? ('已选择 ' + bStudioSelectedCreators.length + ' 位具体红人') : ('已选择 ' + bStudioSelectedChannels.join('、')),
      briefStudioChannelOptions: ['TikTok', 'Instagram', 'YouTube'].map(label => {
        const on = bStudioSelectedChannels.includes(label);
        return {
          label, mark: on ? '✓' : '+', bg: on ? '#EAF0FF' : '#FFFFFF', bd: on ? '#2457F5' : '#E2E8F2', fg: on ? '#2457F5' : '#647187',
          toggle: () => this.setState(st => {
            const current = Array.isArray(st.briefStudioChannels) && st.briefStudioChannels.length ? st.briefStudioChannels : [st.platform || 'TikTok'];
            return { briefStudioChannels: current.includes(label) ? current.filter(x => x !== label) : [...current, label], briefStudioNotice: '' };
          })
        };
      }),
      briefStudioCreatorPickerOpen: !!s.briefStudioCreatorPickerOpen,
      briefStudioCreatorPickerBd: s.briefStudioCreatorPickerOpen ? '#B8CBFF' : '#E2E8F2',
      briefStudioCreatorPickerArrow: s.briefStudioCreatorPickerOpen ? '收起 ↑' : '选择 →',
      briefStudioCreatorPickerNote: '共 ' + bStudioCreatorMatches.length + ' 位匹配红人 · 已选择 ' + bStudioSelectedCreators.length + ' 位',
      briefStudioCreatorPickerToggle: () => this.setState(st => ({ briefStudioCreatorPickerOpen: !st.briefStudioCreatorPickerOpen })),
      briefStudioCreatorQuery: s.briefStudioCreatorQuery || '',
      briefStudioCreatorQuerySet: (e) => this.setState({ briefStudioCreatorQuery: e.target.value }),
      briefStudioCreatorClear: () => this.setState({ briefStudioCreators: [], briefStudioNotice: '' }),
      briefStudioCreatorSelectAll: () => this.setState(st => ({ briefStudioCreators: Array.from(new Set([...(st.briefStudioCreators || []), ...bStudioCreatorMatches.map(c => c.handle)])), briefStudioNotice: '' })),
      briefStudioCreatorOptions: bStudioCreatorMatches.map(c => {
        const on = bStudioSelectedCreators.includes(c.handle);
        return {
          handle: c.handle, avatar: creatorAvatarMap[c.handle] || '../avatars/mia.jpg', niche: c.niche, country: c.country, followers: c.followers, er: c.er30, fit: c.fit,
          channels: campaignBriefChannelsOf(c).join(' · '),
          mark: on ? '✓' : '', bg: on ? '#F7F9FF' : '#FFFFFF', bd: on ? '#2457F5' : '#E2E8F2', boxBg: on ? '#2457F5' : '#FFFFFF', boxBd: on ? '#2457F5' : '#C8D4E8',
          toggle: () => this.setState(st => ({ briefStudioCreators: (st.briefStudioCreators || []).includes(c.handle) ? (st.briefStudioCreators || []).filter(x => x !== c.handle) : [...(st.briefStudioCreators || []), c.handle], briefStudioNotice: '' }))
        };
      }),
      briefStudioCreatorEmpty: bStudioCreatorMatches.length === 0,
      briefStudioHasSelectedCreators: bStudioSelectedCreators.length > 0,
      briefStudioSelectedCreators: bStudioSelectedCreators.map(handle => ({ handle, avatar: creatorAvatarMap[handle] || '../avatars/mia.jpg', remove: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ briefStudioCreators: (st.briefStudioCreators || []).filter(x => x !== handle), briefStudioNotice: '' })); } })),
      briefStudioGenerateHint: briefEditorTab === 'creator' ? '每位红人生成并保存一份个性化 Brief' : '每个渠道生成并保存一份渠道 Brief',
      briefStudioGenerateLabel: '生成并保存 ' + (briefEditorTab === 'creator' ? bStudioSelectedCreators.length : bStudioSelectedChannels.length) + ' 份 Brief',
      briefStudioGenerateBg: (briefEditorTab === 'creator' ? bStudioSelectedCreators.length : bStudioSelectedChannels.length) ? '#2457F5' : '#F5F8FE',
      briefStudioGenerateFg: (briefEditorTab === 'creator' ? bStudioSelectedCreators.length : bStudioSelectedChannels.length) ? '#FFFFFF' : '#A2ABBA',
      briefStudioGenerateBd: (briefEditorTab === 'creator' ? bStudioSelectedCreators.length : bStudioSelectedChannels.length) ? '#2457F5' : '#E2E8F2',
      briefStudioGenerateCursor: (briefEditorTab === 'creator' ? bStudioSelectedCreators.length : bStudioSelectedChannels.length) ? 'pointer' : 'default',
      briefStudioNotice: s.briefStudioNotice || '', briefStudioHasNotice: !!s.briefStudioNotice,
      briefStudioNoticeBg: /^请先/.test(s.briefStudioNotice || '') ? '#FBEEDA' : '#E4EFE4',
      briefStudioNoticeBd: /^请先/.test(s.briefStudioNotice || '') ? '#F1D7AA' : '#CFE3D3',
      briefStudioNoticeFg: /^请先/.test(s.briefStudioNotice || '') ? '#A5762C' : '#4E7156',
      briefStudioNoticeMark: /^请先/.test(s.briefStudioNotice || '') ? '!' : '✓',
      briefTuneOpen: !!s.briefTuneOpen,
      briefTuneLabel: s.briefTuneOpen ? '收起' : '调优',
      briefTuneBg: s.briefTuneOpen ? '#EAF0FF' : '#FFFFFF',
      briefTuneBd: s.briefTuneOpen ? '#8CAFFF' : '#C8D4E8',
      briefTuneCols: s.briefTuneOpen ? 'minmax(0,1fr) minmax(300px,.48fr)' : 'minmax(0,1fr)',
      briefTuneToggle: () => this.setState(st => ({ briefTuneOpen: !st.briefTuneOpen })),
      briefStudioGenerate: () => {
        const targets = briefEditorTab === 'creator'
          ? bStudioSelectedCreators.map(handle => {
              const creator = creatorDefs.find(c => c.handle === handle);
              if (!creator) return null;
              const channels = campaignBriefChannelsOf(creator);
              return { channel: channels.includes(s.platform) ? s.platform : channels[0], creator };
            }).filter(Boolean)
          : bStudioSelectedChannels.map(channel => ({ channel, creator: null }));
        if (!targets.length) {
          this.setState({ briefStudioSetupOpen: true, briefStudioCreatorPickerOpen: briefEditorTab === 'creator', briefStudioNotice: briefEditorTab === 'creator' ? '请先选择至少一位具体红人。' : '请先选择至少一个渠道。' });
          return;
        }
        this.setState(st => {
          const existingSnapshot = Array.isArray(st.briefStudioExistingKeys) && st.briefStudioExistingKeys.length
            ? st.briefStudioExistingKeys
            : (st.briefVersions || []).filter(v => v.sku === bSkuId).map(v => bSkuId + '|' + v.platform + '|' + (v.mode || 'channel') + '|' + v.ver);
          const nextByChannel = {};
          const created = targets.map(pair => {
            const mode = pair.creator ? 'creator' : 'channel';
            if (!nextByChannel[pair.channel]) {
              const same = (st.briefVersions || []).filter(v => v.sku === bSkuId && v.platform === pair.channel && (v.mode || 'channel') === mode);
              nextByChannel[pair.channel] = same.reduce((max, v) => Math.max(max, parseInt(String(v.ver || '').replace(/\D/g, ''), 10) || 0), 0) + 1;
            }
            const nextNo = nextByChannel[pair.channel]++;
            return { sku: bSkuId, name: bProd.name, platform: pair.channel, ver: 'v' + nextNo, date: '2026-09-08', status: '草稿', iter: 1, prompt: pair.creator ? '基于所选红人的内容风格生成' : '基于所选渠道生成', mode, creator: pair.creator ? pair.creator.handle : '', creatorStyle: pair.creator ? pair.creator.niche : '', origin: 'brief-studio-generated' };
          });
          const first = created[0];
          const newKeys = created.map(v => v.sku + '|' + v.platform + '|' + (v.mode || 'channel') + '|' + v.ver);
          return {
            briefVersions: [...created, ...(st.briefVersions || [])], platform: first.platform, briefMode: first.mode, briefEditorTab: first.mode, briefCreator: first.creator, briefCreatorStyle: first.creatorStyle,
            viewedVersion: first.sku + '|' + first.platform + '|creator|' + first.ver,
            briefStudioNewKeys: Array.from(new Set([...(st.briefStudioNewKeys || []), ...newKeys])),
            briefStudioExistingKeys: existingSnapshot,
            briefStudioSetupOpen: false,
            briefStudioNotice: '已生成并保存 ' + created.length + ' 份' + (first.mode === 'creator' ? '红人 Brief' : '渠道 Brief') + '。'
          };
        });
      },
      briefLangs: [['zh', '中文'], ['en', 'English']].map(([id, label]) => {
        const on = (s.briefLang || 'zh') === id;
        return { label, pick: () => this.setState({ briefLang: id }), bg: on ? '#1D2638' : '#FFFFFF', fg: on ? '#F8FAFE' : '#647187', bd: on ? '#1D2638' : '#E2E8F2' };
      }),
      briefModes: [
        { id: 'channel', label: '按渠道生成' }, { id: 'creator', label: page === 'brief' ? '按内容风格生成' : '按红人风格生成' }
      ].map(m => {
        const on = (s.briefMode === 'creator' ? 'creator' : 'channel') === m.id;
        return {
          label: m.label, pick: () => this.setState({ briefMode: m.id, viewedVersion: null }),
          bg: on ? '#2457F5' : '#FFFFFF', fg: on ? '#FFFFFF' : '#647187', bd: on ? '#2457F5' : '#E2E8F2'
        };
      }),
      briefNextVer: 'v' + (bVersions.length + 1),
      briefPrompt: s.briefPrompt || '',
      setBriefPrompt: (e) => this.setState({ briefPrompt: e.target.value }),
      regenBrief: () => this.setState(st => ({
        viewedVersion: null,
        briefGen: { ...(st.briefGen || {}), [bKey]: ((st.briefGen || {})[bKey] || 0) + 1 },
        briefPromptApplied: { ...(st.briefPromptApplied || {}), [bKey]: st.briefPrompt || '' }
      })),
      saveBriefVersion: () => this.setState(st => {
        const existingSnapshot = Array.isArray(st.briefStudioExistingKeys) && st.briefStudioExistingKeys.length
          ? st.briefStudioExistingKeys
          : (st.briefVersions || []).filter(v => v.sku === bSkuId).map(v => bSkuId + '|' + v.platform + '|' + (v.mode || 'channel') + '|' + v.ver);
        const mine = (st.briefVersions || []).filter(v => v.sku === bSkuId && v.platform === st.platform && (v.mode || 'channel') === (bIsCreatorMode ? 'creator' : 'channel'));
        const nextVer = 'v' + (mine.length + 1);
        const mode = bIsCreatorMode ? 'creator' : 'channel';
        const created = {
          sku: bSkuId, name: bProd.name, platform: st.platform, ver: nextVer,
          date: '2026-09-07', status: '草稿', iter: ((st.briefGen || {})[bKey] || 0) + 1,
          prompt: (st.briefPromptApplied || {})[bKey] || '', mode,
          creator: bIsCreatorMode ? bCreatorHandle : '', creatorStyle: bIsCreatorMode ? bCreatorStyle : '', origin: 'brief-studio-generated', briefStudioSession: 'new'
        };
        const createdKey = created.sku + '|' + created.platform + '|' + created.mode + '|' + created.ver;
        return {
          briefVersions: [created, ...(st.briefVersions || []).map(v => v.sku === bSkuId ? { ...v, briefStudioSession: v.briefStudioSession === 'new' ? 'new' : 'existing' } : v)], briefView: 'editor', viewedVersion: createdKey,
          briefStudioNewKeys: Array.from(new Set([...(st.briefStudioNewKeys || []), createdKey])), briefStudioExistingKeys: existingSnapshot
        };
      }),
      briefVault: bVaultArr,
      briefEditorItems, briefEditorTabs, briefEditorVisibleItems, briefEditorEmpty: briefEditorVisibleItems.length === 0,
      briefEditorEmptyText: briefEditorTab === 'creator' ? '暂无红人 Brief，请在右侧选择具体红人生成并保存' : '暂无渠道 Brief，请在右侧选择渠道生成并保存',
      briefEditorCount: briefEditorVisibleItems.length + ' 份', briefEditorProduct: bProd.name,
      briefEditorTabNote: briefEditorTab === 'creator' ? '按具体红人查看版本' : '按渠道查看版本',
      briefListNote: '按产品查看与制作 Brief，内容与该产品的策略同步',
      briefProducts: (() => {
        const skus = [];
        (s.briefFromStrategy || []).forEach(x => { if (skus.indexOf(x.sku) < 0) skus.push(x.sku); });
        (s.library || []).forEach(x => { if (skus.indexOf(x.sku) < 0) skus.push(x.sku); });
        (s.promoted || []).forEach(x => { if (skus.indexOf(x) < 0) skus.push(x); });
        return skus.filter(x => (s.briefHidden || []).indexOf(x) < 0).map((sku, i) => {
          const p = skuAll.find(x => x.sku === sku);
          if (!p) return null;
	          const versionPanel = bVaultArr.find(x => x.sku === sku);
	          const made = (s.briefFromStrategy || []).some(x => x.sku === sku) || !!versionPanel;
          const pf = swProfiles[sku] || swGenericPf(p);
	          const sc = skuScoreMap[sku] || 60;
	          const on = s.briefPanel === sku;
	          const allBriefVersions = versionPanel ? versionPanel.versions : [];
	          const channelBriefVersions = allBriefVersions.filter(v => v.mode !== 'creator' && v.mode !== 'style');
	          const creatorBriefVersions = allBriefVersions.filter(v => v.mode === 'creator' || v.mode === 'style');
	          const channelLatest = channelBriefVersions[0] || null;
	          const creatorLatest = creatorBriefVersions[0] || null;
	          const channelMenuKey = sku + '|channel';
	          const creatorMenuKey = sku + '|creator';
          const risks = [
            { title: '禁止表达', body: '不得出现' + pf.noClaim + '。', color: RUST },
            { title: '合规要求', body: pf.sensitive + '；美区需标注 #ad 或 Paid partnership。', color: AMBER },
            { title: '必须讲到', body: pf.canClaim + '。', color: SAGE },
            { title: '内容方向', body: pf.hook, color: '#1D48D8' }
          ];
          return {
	            idx: i + 1, name: p.name, image: p.image, score: sc, scoreColor: this.scoreColor(sc), scoreBg: this.pillBg(sc),
	            bd: on ? '#B8CBFF' : '#E2E8F2', bg: on ? '#F7F9FF' : '#FFFFFF', rowAccent: on ? '#2457F5' : '#E2E8F2',
            shadow: made ? '0 6px 20px rgba(242,140,107,.10)' : '0 1px 2px rgba(29,38,56,.03)',
	            channelStateText: channelLatest ? channelLatest.status : '未生成',
	            channelStateBg: channelLatest ? channelLatest.statusBg : '#F5F8FE', channelStateFg: channelLatest ? channelLatest.statusFg : '#8792A5',
	            channelVersionCount: channelBriefVersions.length,
	            channelNote: channelLatest ? channelLatest.label : '暂无渠道 Brief',
	            channelMenuOpen: s.vaultMenu === channelMenuKey,
	            channelMenuEmpty: channelBriefVersions.length === 0,
	            channelVersions: channelBriefVersions,
	            channelBg: s.vaultMenu === channelMenuKey ? '#F3F6FF' : '#FFFFFF',
	            channelBd: s.vaultMenu === channelMenuKey ? '#8CAFFF' : '#E2E8F2',
	            toggleChannelMenu: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st2 => ({ vaultMenu: st2.vaultMenu === channelMenuKey ? null : channelMenuKey })); },
	            keepChannelMenu: (e) => { if (e && e.stopPropagation) e.stopPropagation(); },
	            creatorStateText: creatorLatest ? creatorLatest.status : '未生成',
	            creatorStateBg: creatorLatest ? creatorLatest.statusBg : '#F5F8FE', creatorStateFg: creatorLatest ? creatorLatest.statusFg : '#8792A5',
	            creatorVersionCount: creatorBriefVersions.length,
	            creatorNote: creatorLatest ? creatorLatest.label : '暂无红人 Brief',
	            creatorMenuOpen: s.vaultMenu === creatorMenuKey,
	            creatorMenuEmpty: creatorBriefVersions.length === 0,
	            creatorVersions: creatorBriefVersions,
	            creatorBg: s.vaultMenu === creatorMenuKey ? '#F3F6FF' : '#FFFFFF',
	            creatorBd: s.vaultMenu === creatorMenuKey ? '#8CAFFF' : '#E2E8F2',
	            toggleCreatorMenu: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st2 => ({ vaultMenu: st2.vaultMenu === creatorMenuKey ? null : creatorMenuKey })); },
	            keepCreatorMenu: (e) => { if (e && e.stopPropagation) e.stopPropagation(); },
            chips: [
              { label: 'ASIN', value: p.asin, link: 'https://www.amazon.com/dp/' + p.asin },
              { label: 'SKU', value: p.sku }, { label: '市场', value: 'US' },
              { label: '品牌', value: p.brand }, { label: '店铺', value: p.shop },
              { label: '星级', value: p.stars + ' ★' }, { label: 'Review', value: p.reviews }
            ].map(x => ({ ...x, plain: !x.link })),
	            risks, riskCount: risks.length, showAi: on,
	            versionZ: s.vaultMenu === channelMenuKey || s.vaultMenu === creatorMenuKey ? 90 : 1,
            aiBg: on ? '#E8EEFF' : '#FFFFFF', aiBd: on ? '#B8CBFF' : '#D9E4FF',
            viewBg: made ? '#2457F5' : '#F7F9FC', viewFg: made ? '#FFFFFF' : '#A2ABBA', viewBd: made ? '#2457F5' : '#EAF0FF',
            viewHover: made ? 'background:#2457F5;color:#fff;border-color:#2457F5' : 'background:#F7F9FC',
            viewCursor: made ? 'pointer' : 'not-allowed',
	            makeLabel: made ? '重新制作 Brief' : '制作 Brief', actionLabel: '编辑',
            viewTitle: made ? '打开该产品的 Brief' : '该产品尚无 Brief，请先制作',
	            note: versionPanel ? versionPanel.selMeta : (made ? '已由策略生成 · 可继续编辑' : '尚无 Brief，可进入编辑后生成'),
	            view: () => { if (made) this.setState(st2 => ({ briefId: 'brf-' + sku, briefView: 'editor', briefStudioNewKeys: [], briefStudioExistingKeys: (st2.briefVersions || []).filter(v => v.sku === sku).map(v => sku + '|' + v.platform + '|' + (v.mode || 'channel') + '|' + v.ver), briefVersions: (st2.briefVersions || []).map(v => v.sku === sku ? { ...v, briefStudioSession: 'existing' } : v) })); },
            openAi: () => this.setState(st2 => ({ briefPanel: st2.briefPanel === sku ? null : sku })),
            remove: () => this.setState(st2 => ({
              briefHidden: [...(st2.briefHidden || []), sku],
              briefFromStrategy: (st2.briefFromStrategy || []).filter(y => y.sku !== sku),
              briefPanel: st2.briefPanel === sku ? null : st2.briefPanel
            })),
            make: () => this.setState(st2 => ({
              briefId: 'brf-' + sku, briefView: 'editor',
              briefStudioNewKeys: [],
              briefStudioExistingKeys: (st2.briefVersions || []).filter(v => v.sku === sku).map(v => sku + '|' + v.platform + '|' + (v.mode || 'channel') + '|' + v.ver),
              briefVersions: (st2.briefVersions || []).map(v => v.sku === sku ? { ...v, briefStudioSession: 'existing' } : v),
              briefFromStrategy: (st2.briefFromStrategy || []).some(y => y.sku === sku)
                ? st2.briefFromStrategy : [{ sku, name: p.name, platform: 'TikTok' }, ...(st2.briefFromStrategy || [])]
            }))
          };
        }).filter(Boolean);
      })(),
      briefSubtitle: bViewV
        ? bViewV.name + ' · ' + bViewV.platform + (bViewV.mode === 'creator' ? ' · ' + (bViewV.creator || '红人风格') : '') + ' ' + bViewV.ver + ' · ' + bViewV.status + ' · 第 ' + bViewV.iter + ' 次生成'
        : s.briefView === 'vault'
        ? briefList.length + ' 份 Brief · ' + bvLive.length + ' 个已保存版本'
        : s.briefView === 'list'
        ? '按产品管理 Brief · ' + (s.briefFromStrategy || []).length + ' 份草稿待完善'
        : (bFrom ? bProd.name + ' · 由策略生成 · Brief v1 · 草稿' : 'Ryze 头皮按摩仪 · Q3 北美种草 · Brief v2 · 待审批'),
      isReportCampaign: s.reportTab === 'campaign', isReportCreator: s.reportTab === 'creator',
      isReportAsset: s.reportTab === 'asset', isReportProduct: s.reportTab === 'product',
      productRows, productCount, productEmpty, anomalies, anomalySummary,
      productLibraryTitle: '产品库',
      productLibraryDescription: '勾选产品后，可批量提交推广或取消推广。',
      productGridColumns: '32px 44px 86px 52px 88px 176px 60px 84px 132px 84px 152px 84px 116px 108px 76px 84px 74px 84px 84px 74px 150px 168px 104px 72px',
      productTableMinWidth: '2444px',
      productDrawerOpen: !!s.productDrawerOpen,
      closeProductDrawer: (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        this.setState({ productDrawerOpen: false });
      },
      keepProductDrawer: (e) => { if (e && e.stopPropagation) e.stopPropagation(); },
      productEmptyText: q || productPromotionFilter !== 'all'
        ? '未找到符合当前筛选条件的产品。清空筛选可查看全部产品。'
        : '暂无产品。',
      productSelectAllBg: allVisibleProductsSelected ? BLUE : '#FFFFFF',
      productSelectAllBorder: allVisibleProductsSelected ? BLUE : '#C8D4E8',
      productSelectAllCheck: allVisibleProductsSelected ? '✓' : '',
      toggleAllProducts: (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        this.setState(st => {
          const current = st.productSelection || [];
          const allOn = productVisibleSkus.length > 0 && productVisibleSkus.every(sku => current.includes(sku));
          return {
            productSelection: allOn
              ? current.filter(sku => !productVisibleSkus.includes(sku))
              : Array.from(new Set([...current, ...productVisibleSkus]))
          };
        });
      },
      productActionBg: productActionEnabled ? '#2457F5' : '#EEF2F8',
      productActionFg: productActionEnabled ? '#FFFFFF' : '#A2ABBA',
      productActionBorder: productActionEnabled ? '#2457F5' : '#E2E8F2',
      productCancelBg: productActionEnabled ? '#FFFFFF' : '#F8FAFE',
      productCancelFg: productActionEnabled ? '#C4636D' : '#B7C0CF',
      productCancelBorder: productActionEnabled ? '#F0C9C9' : '#E2E8F2',
      productActionCursor: productActionEnabled ? 'pointer' : 'default',
      submitProductPromotion: (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        if (!productActionEnabled) return;
        this.setState(st => ({
          promoted: Array.from(new Set([...(st.promoted || []), ...(st.productSelection || [])])),
          productSelection: []
        }));
      },
      cancelProductPromotion: (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        if (!productActionEnabled) return;
        this.setState(st => ({
          promoted: (st.promoted || []).filter(sku => !(st.productSelection || []).includes(sku)),
          productSelection: []
        }));
      },
      skuFields, skuSuggestions, skuQueryValue: s.skuQuery || '',
      skuHitName: skuHit ? skuHit.name : '', skuFound: !!skuHit, skuMissing: !skuHit,
      skuScore, skuScoreColor, skuDims, skuDimsOpen: !!s.skuDimsOpen,
      toggleSkuDims: () => this.setState(st => ({ skuDimsOpen: !st.skuDimsOpen })),
      productPromotionFilterValue: productPromotionFilter,
      setProductPromotionFilter: (e) => this.setState({ productPromotionFilter: e.target.value, productSelection: [] }),
      setSkuQuery: (e) => this.setState({ skuQuery: e.target.value }),
      clearSku: () => this.setState({ skuQuery: '', productPromotionFilter: 'all', productSelection: [] }),
      nextActions, campaigns, products, learnings, topCreators: topCreatorsRows, cbSortHead, tasks, pd,
      dbTabs: [
        { id: 'core', label: '核心数据', note: '目标 / 漏斗 / 质量与效率' },
        { id: 'staff', label: '人员榜单', note: '推广专员业绩达成' },
        { id: 'creator', label: '红人榜单', note: '曝光与销售额排名' }
      ].map(t => {
        const on = (s.dbTab || 'core') === t.id;
        return {
          label: t.label, note: t.note, pick: () => this.setState({ dbTab: t.id }),
          bg: on ? '#2457F5' : 'transparent', bd: on ? '#2457F5' : 'transparent',
          fg: on ? '#FFFFFF' : '#647187', noteFg: on ? '#FFFFFF' : '#8792A5'
        };
      }),
      dbCore: (s.dbTab || 'core') === 'core', dbStaff: s.dbTab === 'staff', dbCreator: s.dbTab === 'creator',
      heroKpis, heroTabs, goals, funnel, blockers, healthGroups, staff, staffTabs, staffSub, cbTabs, cbSub,
      staffAiOpen: !!s.staffAiOpen,
      staffAiToggle: s.staffAiOpen ? '收起' : '展开',
      toggleStaffAi: () => this.setState(st => ({ staffAiOpen: !st.staffAiOpen })),
      staffAiShort: (() => {
        const top = staff[0], last = staff[staff.length - 1];
        if (!top) return '暂无数据';
        return top.name + ' 领先（' + top.pct + '%）· ' + last.name + ' 需要支援（' + last.pct + '%）';
      })(),
      staffAiFull: (() => {
        if (!staff.length) return '暂无数据';
        const top = staff[0], last = staff[staff.length - 1];
        const gap = top.pct - last.pct;
        const weak = staff.filter(x => x.pct < 60);
        return top.name + ' 的曝光完成率 ' + top.pct + '%，' + (top.pct >= 100 ? '已超额完成' : '进度领先') + '；'
          + last.name + ' 仅 ' + last.pct + '%，与第一名相差 ' + gap + 'pt。'
          + (weak.length ? '当前有 ' + weak.length + ' 位低于 60%，共同特征是建联量不足或寄样后交付率偏低——建议先补建联量，而不是加预算。' : '全员进度均在 60% 以上，可维持现有节奏。')
          + '黑名单与淘汰数量偏高的专员，需要复核选人标准而非执行力。';
      })(),
      crAiOpen: !!s.crAiOpen,
      crAiToggle: s.crAiOpen ? '收起' : '展开',
      toggleCrAi: () => this.setState(st => ({ crAiOpen: !st.crAiOpen })),
      crAiShort: (() => {
        const t = topCreators[0];
        return t ? t.handle + ' 曝光第一（' + t.views + '）· 效率与曝光未必同一人' : '暂无数据';
      })(),
      crAiFull: (() => {
        if (!topCreators.length) return '暂无数据';
        const byViews = topCreators[0];
        const byGmv = topCreators.slice().sort((a, b) => this.toNumU(String(b.sales).replace(/[$,]/g, '')) - this.toNumU(String(a.sales).replace(/[$,]/g, '')))[0];
        const byEr = topCreators.slice().sort((a, b) => parseFloat(b.er) - parseFloat(a.er))[0];
        return '曝光最高的是 ' + byViews.handle + '（' + byViews.views + '），GMV 最高的是 ' + byGmv.handle + '（' + byGmv.sales + '），互动率最高的是 ' + byEr.handle + '（' + byEr.er + '）。'
          + (byViews.handle === byGmv.handle ? '曝光与成交由同一位贡献，说明这条内容的角度可以直接复制。' : '曝光与成交不是同一位——买曝光和买成交要分开配预算，不要用单一指标选人。')
          + '建议把互动率最高的红人转长期合作，并按其画像做相似度扩量。';
      })(),
      goalAiOpen: !!s.goalAiOpen,
      goalAiToggle: s.goalAiOpen ? '收起' : '展开',
      toggleGoalAi: () => this.setState(st => ({ goalAiOpen: !st.goalAiOpen })),
      funnelAiOpen: !!s.funnelAiOpen,
      funnelAiToggle: s.funnelAiOpen ? '收起' : '展开',
      toggleFunnelAi: () => this.setState(st => ({ funnelAiOpen: !st.funnelAiOpen })),
      dashLeadOpen: !!s.dashLeadOpen,
      dashLeadToggle: s.dashLeadOpen ? '收起' : '展开',
      toggleDashLead: () => this.setState(st => ({ dashLeadOpen: !st.dashLeadOpen })),
      dashLeadShort: (() => {
        const pain = [];
        if (facts.overdue.length) pain.push(facts.overdue.length + ' 个素材超期');
        if (facts.stale.length) pain.push(facts.stale.length + ' 封邮件超 48h');
        if (facts.pendingApprovals.length) pain.push(facts.pendingApprovals.length + ' 份 Brief 待审批');
        if (facts.invPending) pain.push(facts.invPending + ' 张发票待审批');
        return per.label + '完成 ' + per.overall + '% · ' + (pain.length ? '待处理：' + pain.slice(0, 2).join('、') : '暂无阻塞项');
      })(),
      dashLead: (() => {
        const gapTxt = per.overall >= per.timePct
          ? per.label + '整体目标完成 ' + per.overall + '%，领先时间进度 ' + (per.overall - per.timePct) + 'pt'
          : per.label + '整体目标完成 ' + per.overall + '%，但时间已过 ' + per.timePct + '%';
        const pain = [];
        if (facts.overdue.length) pain.push(facts.overdue.length + ' 个素材超期未回收');
        if (facts.stale.length) pain.push(facts.stale.length + ' 封邮件超 48 小时未回');
        if (facts.pendingApprovals.length) pain.push(facts.pendingApprovals.length + ' 份 Brief 待审批');
        if (facts.pendingRights) pain.push(facts.pendingRights + ' 条素材待补授权');
        if (facts.invPending) pain.push(facts.invPending + ' 张发票待审批');
        const good = facts.cpv <= 0.012 ? '成本端达标（CPV $' + facts.cpv.toFixed(3) + '）' : '成本端超基准，需先压 CPV';
        return gapTxt + '——' + good + '，当前最该处理的是' + (pain.length ? pain.slice(0, 2).join('、') + '。' : '暂无阻塞项。');
      })(),
      periodTabs, periodTimePct, periodOverall, periodLabel, periodSub, periodGapNote,
      periodAiNote: (() => {
        const lag = goals.filter(g => g.pct < per.timePct).sort((a, b) => a.pct - b.pct);
        const lead = goals.filter(g => g.pct >= per.timePct);
        if (!lag.length) return '五项目标全部不落后于时间进度，可以考虑提高下一阶段的量级目标。';
        return '最需要关注的是「' + lag[0].label + '」（' + lag[0].pct + '%），'
          + (lead.length ? '而「' + lead[0].label + '」已达标——说明瓶颈在产出速度，不在成本或质量。' : '各项均滞后，建议先排查执行节奏。');
      })(),
      rangePresets, rangeOpen: !!s.rangeOpen, rangeStart: s.rangeStart, rangeEnd: s.rangeEnd,
      rangeLabel: periodKey === 'custom' ? per.sub : per.label + ' · ' + per.sub,
      toggleRange: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ rangeOpen: !st.rangeOpen })); },
      setRangeStart: (e) => this.setState({ period: 'custom', rangeStart: e.target.value }),
      setRangeEnd: (e) => this.setState({ period: 'custom', rangeEnd: e.target.value }),
      closeRange: () => this.setState({ rangeOpen: false }),
      funnelTabs, funnelNote, funnelSub, funnelPresets,
      funnelRangeOpen: !!s.funnelRangeOpen, fStart: s.fStart, fEnd: s.fEnd,
      funnelRangeLabel: funnelKey === 'custom' ? fdef.sub : fdef.label + ' · ' + fdef.sub,
      toggleFunnelRange: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ funnelRangeOpen: !st.funnelRangeOpen })); },
      setFStart: (e) => this.setState({ funnelPeriod: 'custom', fStart: e.target.value }),
      setFEnd: (e) => this.setState({ funnelPeriod: 'custom', fEnd: e.target.value }),
      closeFunnelRange: () => this.setState({ funnelRangeOpen: false }),
      strategySummary, strategyA, strategyB, budget,
      platforms, briefBlocks: bLang === 'en' ? briefBlocksEn : briefBlocks, briefMeta: bLang === 'en' ? briefMetaEn : briefMeta, suggestions, checklist,
      briefHeader: bLang === 'en'
        ? 'STANDARD CAMPAIGN BRIEF · ' + s.platform + (bShowCreatorContext ? ' · ' + bCreatorTag + ' style' : (bIsCreatorMode ? ' · Style template' : ' · General'))
        : '标准 Campaign Brief · ' + s.platform + (bShowCreatorContext ? ' · ' + bCreatorTag + ' 风格版' : (bIsCreatorMode ? ' · 定向风格版' : ' · 通用版')),
      briefWords, suggestionCount: suggestions.length, noSuggestions: suggestions.length === 0,
      creators, campaignKpis, kanban, assets,
      cooperationStageHeaders, cooperationRows, cooperationSummary, cooperationLegend,
      cooperationEmpty: cooperationRows.length === 0,
      cooperationEmptyText: String(s.coopQuery || '').trim() ? '没有匹配该账号的合作红人，请尝试其他关键词。' : '暂无合作红人。从“邮件”模块确认达成合作后，红人会出现在这里。',
      coopQuery: s.coopQuery || '',
      coopQueryActive: !!String(s.coopQuery || '').trim(),
      coopQuerySet: (e) => this.setState({ coopQuery: e.target.value }),
      coopQueryClear: () => this.setState({ coopQuery: '' }),
      coopFilterCount: cooperationRows.length + ' 位红人',
      coopActionOpen: !!coopActionType,
      coopActionIsUpload, coopActionIsPosts, coopActionHandle, coopActionTitle, coopActionHint,
      coopActionModalWidth: coopActionIsPosts ? 'min(900px,100%)' : 'min(560px,100%)',
      coopActionFileRows, coopActionPosts, coopPostChannelOptions, coopAssetChannelOptions,
      coopSavedAssetRows, coopSavedAssetHasRows: coopActionIsPosts && coopSavedAssetRows.length > 0,
      coopSavedAssetCount: coopSavedAssetRows.length + ' 条',
      coopPostUrl: s.coopPostUrl || '',
      coopActionNotice: s.coopActionNotice || '',
      coopActionHasNotice: !!s.coopActionNotice,
      coopActionNoticeColor: /请|有效|已存在/.test(s.coopActionNotice || '') ? '#C4636D' : '#4E7156',
      coopActionClose: () => this.setState({ coopActionType: '', coopActionHandle: '', coopPostUrl: '', coopActionNotice: '' }),
      coopActionKeep: (e) => { if (e && e.stopPropagation) e.stopPropagation(); },
      coopUploadPick: (e) => {
        const picked = Array.from(e.target.files || []).map(file => ({
          name: file.name,
          size: file.size >= 1024 * 1024 ? (file.size / 1024 / 1024).toFixed(1) + ' MB' : Math.max(1, Math.round(file.size / 1024)) + ' KB',
          added: '刚刚'
        }));
        e.target.value = '';
        if (!picked.length || !coopActionHandle) return;
        const stateKey = coopActionType === 'contract' ? 'coopContractFiles' : 'coopBriefFiles';
        this.setState(st => {
          const collection = st[stateKey] || {};
          return { [stateKey]: { ...collection, [coopActionHandle]: [...(collection[coopActionHandle] || []), ...picked] }, coopActionNotice: '已上传 ' + picked.length + ' 个文件' };
        });
      },
      coopPostUrlSet: (e) => this.setState({ coopPostUrl: e.target.value, coopActionNotice: '' }),
      coopPostAdd: () => {
        const url = String(s.coopPostUrl || '').trim();
        if (!/^https?:\/\/[^\s]+$/i.test(url)) return this.setState({ coopActionNotice: '请输入以 http:// 或 https:// 开头的有效链接' });
        const existing = coopPostLinks[coopActionHandle] || [];
        if (existing.some(item => item.url === url)) return this.setState({ coopActionNotice: '该链接已存在' });
        this.setState(st => ({
          coopPostLinks: { ...(st.coopPostLinks || {}), [coopActionHandle]: [...((st.coopPostLinks || {})[coopActionHandle] || []), { channel: st.coopPostChannel || '其他', url, added: '刚刚' }] },
          coopPostUrl: '', coopActionNotice: '帖子链接已添加'
        }));
      },
      coopAssetReset: () => this.setState({
        alForm: { handle: coopActionHandle, channel: (s.alForm || {}).channel || 'TikTok', post: '2026-09-07', product: cd.product, sku: cd.sku, campaign: cd.name, brand: cd.brand || cd.product },
        alRightsOpen: false, coopActionNotice: ''
      }),
      coopAssetSubmit: () => this.setState(st => {
        const fm = st.alForm || {};
        const url = String(fm.url || '').trim();
        if (!String(fm.title || '').trim()) return { coopActionNotice: '请填写素材主题' };
        if (!/^https?:\/\/[^\s]+$/i.test(url)) return { coopActionNotice: '请输入以 http:// 或 https:// 开头的有效素材链接' };
        const entry = {
          ...fm,
          handle: coopActionHandle || fm.handle,
          channel: fm.channel || 'TikTok',
          product: cd.product,
          sku: cd.sku,
          campaign: cd.name,
          brand: cd.brand || cd.product,
          types: fm.isRights ? ['合格素材', '授权素材'] : ['合格素材']
        };
        const exists = (st.alEntries || []).some(x => String(x.url || '').trim() === url);
        if (exists) return { coopActionNotice: '该素材链接已存在' };
        return {
          alEntries: [entry, ...(st.alEntries || [])],
          alForm: { handle: coopActionHandle, channel: fm.channel || 'TikTok', post: '2026-09-07', product: cd.product, sku: cd.sku, campaign: cd.name, brand: cd.brand || cd.product },
          alRightsOpen: false,
          coopActionNotice: '素材已保存并同步入库，可继续录入其他渠道'
        };
      }),
      campaignTabs: (() => {
        const briefDrafts = campaignBriefVersions.filter(x => x.status === '草稿').length;
        const briefPending = campaignBriefVersions.filter(x => x.status === '待审批').length;
        const cooperationCount = kanban.reduce((n, x) => n + x.count, 0);
        const statusMeta = {
          complete: ['#6E9778', '#4E7156'], current: ['#2457F5', '#1D48D8'], warn: ['#D7A44B', '#A5762C'], pending: ['#C8D1DF', '#8792A5']
        };
        const defs = [
          { id: 'strategy', label: '策略', metaLabel: campaignStrategySelectedRow ? (campaignSelectedSections.length + '/' + campaignSelectedSections.length + '章') : '0/0章', status: campaignStrategySelectedRow ? '已完成' : '待开始', kind: campaignStrategySelectedRow ? 'complete' : 'pending' },
          { id: 'brief', label: 'Brief', metaLabel: campaignBriefVersions.length + ' 份模板', status: !campaignBriefVersions.length ? '待开始' : (briefDrafts ? '待提交' : (briefPending ? '待审批' : '已完成')), kind: !campaignBriefVersions.length ? 'pending' : (briefDrafts ? 'current' : (briefPending ? 'warn' : 'complete')) },
          { id: 'email', label: '邮件', metaLabel: emailSentN + ' 封已发送', status: emailSentN ? '触达中' : '待开始', kind: emailSentN ? 'current' : 'pending' },
          { id: 'cooperation', label: '合作', metaLabel: cooperationCount + ' 位红人', status: cooperationCount ? '推进中' : '待开始', kind: cooperationCount ? 'current' : 'pending' },
          { id: 'assets', label: '素材', metaLabel: campaignAssets.length + ' 条已回收', status: campaignAssets.length ? '回收中' : '待开始', kind: campaignAssets.length ? 'current' : 'pending' },
          { id: 'timeline', label: '时间进度', metaLabel: (campaignTimeline.phases || []).length + ' 个节点', status: campaignTimeline.late ? '有延期' : ((campaignTimeline.phases || []).length ? '排期中' : '待排期'), kind: campaignTimeline.late ? 'warn' : ((campaignTimeline.phases || []).length ? 'current' : 'pending') },
          { id: 'goals', label: '目标达成', metaLabel: cd.pct + '% 完成', status: cd.pct >= 100 ? '已达成' : (cd.pct > 0 ? '进行中' : '待开始'), kind: cd.pct >= 100 ? 'complete' : (cd.pct > 0 ? 'current' : 'pending') }
        ];
        return defs.map((t, i) => {
          const on = campaignTab === t.id;
          const colors = statusMeta[t.kind];
          return {
            ...t, hasNext: i < defs.length - 1, stepMark: t.kind === 'complete' ? '✓' : String(i + 1),
            pick: () => this.setState({ campaignTab: t.id, campaignAiSummaryOpen: false }), bg: on ? '#F3F6FF' : '#FFFFFF', bd: on ? '#2457F5' : '#EDF1F7', fg: on ? '#1D48D8' : '#334155', shadow: on ? '0 3px 10px rgba(36,87,245,.1)' : 'none',
            circleBg: on ? '#2457F5' : (t.kind === 'complete' ? '#E4EFE4' : '#F1F4F8'), circleFg: on ? '#FFFFFF' : (t.kind === 'complete' ? '#4E7156' : '#647187'), statusDot: colors[0], statusFg: colors[1], connector: t.kind === 'complete' ? '#8CB296' : '#DCE3EF'
          };
        });
      })(),
      campaignAiSummaryOpen: !!s.campaignAiSummaryOpen,
      campaignAiSummaryCollapsed: !s.campaignAiSummaryOpen,
      campaignAiSummaryToggle: () => this.setState(st => ({ campaignAiSummaryOpen: !st.campaignAiSummaryOpen })),
      campaignAiSummaryLabel: campaignAiSummary.label,
      campaignAiSummaryProgress: campaignAiSummary.progress,
      campaignAiSummaryIssue: campaignAiSummary.issue,
      campaignAiSummaryNext: campaignAiSummary.next,
      campaignAiSummaryBg: campaignAiSummaryPalette.bg,
      campaignAiSummaryBd: campaignAiSummaryPalette.bd,
      campaignAiSummaryFg: campaignAiSummaryPalette.fg,
      campaignAiSummaryDot: campaignAiSummaryPalette.dot,
      campaignAiSummaryAction: s.campaignAiSummaryOpen ? '收起' : '展开查看',
      campaignAiSummaryChevron: s.campaignAiSummaryOpen ? '⌃' : '⌄',
      campaignTabStrategy: campaignTab === 'strategy', campaignTabBrief: campaignTab === 'brief',
      campaignTabEmail: campaignTab === 'email', campaignTabCooperation: campaignTab === 'cooperation',
      campaignTabAssets: campaignTab === 'assets', campaignTabTimeline: campaignTab === 'timeline', campaignTabGoals: campaignTab === 'goals',
      campaignStrategySummary: cd.sku === 'NUV-SP-07'
        ? '该 Campaign 当前应继续停留在合规验证阶段。第三方检测与 claim 证据未补齐前，不建议开启红人外联或安排内容排期。'
        : cd.product + ' 当前以「' + cd.objective + '」为核心目标，预算已使用 ' + cd.spent + ' / ' + cd.budget + '。建议优先放大高完播的场景化内容，同时补足尚未覆盖的人群与渠道。',
      campaignStrategyCards: [
        { eyebrow: '核心人群', title: cd.sku === 'LUM-AR-02' ? '注重居家氛围的 25–44 岁人群' : (cd.sku === 'NUV-SP-07' ? '合规通过后再定义' : '高压、重视自我照护的 25–34 岁女性'), color: '#1D2638', body: cd.sku === 'LUM-AR-02' ? '优先覆盖租房、卧室改造与慢生活内容受众。' : '集中在夜间 routine、头皮护理和减压内容兴趣圈层。' },
        { eyebrow: '内容主轴', title: cd.sku === 'LUM-AR-02' ? '一平米氛围改造' : (cd.sku === 'NUV-SP-07' ? '先证据，后表达' : '从疲惫到放松的真实瞬间'), color: BLUE, body: cd.sku === 'NUV-SP-07' ? '所有功效表达必须先完成 claim—证据映射，再进入 Brief。' : '首秒呈现具体场景，保留红人自己的体验表达，避免统一口播模板。' },
        { eyebrow: '当前判断', title: cd.pct >= 100 ? '已完成，可沉淀复盘' : (cd.sku === 'NUV-SP-07' ? '合规阻塞，暂不扩量' : '推进中，存在明确优化空间'), color: cd.sku === 'NUV-SP-07' ? RUST : (cd.pct >= 100 ? SAGE : AMBER), body: cd.pct >= 100 ? '将高表现叙事角度写回下一轮策略与 Brief。' : '把预算集中到已验证的内容角度，并优先处理时间与授权风险。' }
      ],
      campaignStrategyOptions,
      campaignStrategyFormOpen: s.campaignStrategyMode === 'new' || s.campaignStrategyMode === 'edit',
      campaignStrategyFormTitle: s.campaignStrategyMode === 'edit' ? '基于所选版本编辑' : '新增策略',
	      campaignStrategyDraftTitle: strategyDraft.title || '',
	      campaignStrategyDraftTitleSet: (e) => { const title = e.target.value; this.setState(st2 => ({ campaignStrategyDraft: { ...(st2.campaignStrategyDraft || {}), title } })); },
	      campaignStrategyDraftModes, campaignStrategyDraftGroups, campaignStrategyDraftToc,
	      campaignStrategyDraftTabs: [
	        { id: 'input', label: '输入项', note: '8 组资料填写' },
	        { id: 'check', label: '完整性检查', note: '证据映射 + 缺失项' },
	        { id: 'result', label: '生成结果', note: '基于输入生成的策略正文' }
	      ].map(t => {
	        const on = (s.campaignStrategyDraftTab || 'input') === t.id;
	        return { ...t, bg: on ? '#EAF0FF' : 'transparent', fg: on ? '#1D48D8' : '#647187', bd: on ? '#B8CBFF' : 'transparent', noteFg: on ? '#4568C6' : '#8792A5', pick: () => this.setState({ campaignStrategyDraftTab: t.id }) };
	      }),
	      campaignStrategyDraftTabInput: (s.campaignStrategyDraftTab || 'input') === 'input',
	      campaignStrategyDraftTabCheck: s.campaignStrategyDraftTab === 'check',
	      campaignStrategyDraftTabResult: s.campaignStrategyDraftTab === 'result',
	      campaignStrategyDraftInputSteps: campaignDraftModules.map(m => ({ ...m, bg: campaignDraftActiveModule.no === m.no ? '#EAF0FF' : 'transparent', fg: campaignDraftActiveModule.no === m.no ? '#1D2638' : '#647187', fw: campaignDraftActiveModule.no === m.no ? '600' : '400', pick: () => this.setState({ campaignStrategyDraftInputStep: m.no }) })),
	      campaignStrategyDraftModuleName: campaignDraftActiveModule.name,
	      campaignStrategyDraftModuleFields: campaignDraftActiveModule.fields,
	      campaignStrategyDraftEvidence: campaignDraftEvidence,
	      campaignStrategyDraftMissing: campaignDraftMissing,
	      campaignStrategyDraftMissingCount: campaignDraftMissing.length,
	      campaignStrategyDraftNoMissing: campaignDraftMissing.length === 0,
      campaignStrategyGenerateLabel: '生成策略（' + (campaignModeName[strategyDraft.mode] || '标准版') + '）',
      campaignStrategyGenerateNotice: s.campaignStrategyDraftGenerated || '',
      campaignStrategyHasGenerateNotice: !!s.campaignStrategyDraftGenerated,
      campaignStrategyGenerate: () => {
        const mode = strategyDraft.mode || 'standard';
        this.setState(st2 => ({
          campaignStrategyDraft: { ...(st2.campaignStrategyDraft || {}), sections: makeCampaignSections(null, mode) },
          campaignStrategyDraftLocked: [], campaignStrategyDraftConfirmed: [], campaignStrategyDraftRegen: {}, campaignStrategyDraftEditing: null, campaignStrategyDraftSectionDraft: '',
	          campaignStrategyDraftGenerated: (campaignModeName[mode] || '标准版') + '策略正文已生成，共 ' + (campaignModeCount[mode] || 15) + ' 章。',
	          campaignStrategyDraftTab: 'result'
	        }));
      },
      campaignStrategyDocumentTitle: campaignStrategySelectedRow ? campaignStrategySelectedRow.title : '',
      campaignStrategyDocumentMode: campaignModeName[campaignSelectedMode] || '标准版',
      campaignStrategyDocumentCount: campaignSelectedSections.length,
      campaignStrategyConfirmed: campaignSelectedConfirmed,
      campaignStrategyConfirmPct: Math.round(campaignSelectedConfirmed / Math.max(1, campaignSelectedSections.length) * 100),
      campaignStrategySectionDraft: s.campaignStrategySectionDraft || '',
      campaignStrategySectionDraftSet: (e) => this.setState({ campaignStrategySectionDraft: e.target.value }),
      campaignStrategyDraftSectionDraft: s.campaignStrategyDraftSectionDraft || '',
      campaignStrategyDraftSectionDraftSet: (e) => this.setState({ campaignStrategyDraftSectionDraft: e.target.value }),
      campaignStrategyGroups, campaignStrategyToc,
	      campaignStrategyHasDocument: !!campaignStrategySelectedRow && s.campaignStrategyMode !== 'new' && s.campaignStrategyMode !== 'edit',
      campaignStrategyEmpty: !campaignStrategySelectedRow && s.campaignStrategyMode !== 'new' && s.campaignStrategyMode !== 'edit',
      campaignStrategyMenuOpen: !!s.campaignStrategyMenu,
      campaignStrategyMenuEmpty: campaignStrategyOptions.length === 0,
      campaignStrategyMenuToggle: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st2 => ({ campaignStrategyMenu: !st2.campaignStrategyMenu })); },
      campaignStrategyMenuKeep: (e) => { if (e && e.stopPropagation) e.stopPropagation(); },
      campaignStrategySelectLabel: campaignStrategySelectedRow ? campaignStrategySelectedRow.title : '选择策略',
      campaignStrategyJumpEdit: () => {
        window.location.href = './5-Strategy-Studio.html?sku=' + encodeURIComponent(cd.sku) + '&edit=1';
      },
      campaignStrategyNew: () => startStrategyDraft('new'),
	      campaignStrategyCancel: () => this.setState({ campaignStrategyMode: '', campaignStrategyDraftGenerated: '', campaignStrategyNotice: '', campaignStrategyDraftTab: 'input', campaignStrategyDraftInputStep: 1, campaignStrategyDraftInputs: {}, campaignStrategyDraftLocked: [], campaignStrategyDraftConfirmed: [], campaignStrategyDraftRegen: {}, campaignStrategyDraftEditing: null, campaignStrategyDraftSectionDraft: '' }),
      campaignStrategySaveBg: strategyDraftReady ? '#2457F5' : '#F5F8FE', campaignStrategySaveFg: strategyDraftReady ? '#FFFFFF' : '#A2ABBA',
      campaignStrategySaveBd: strategyDraftReady ? '#2457F5' : '#E2E8F2', campaignStrategySaveCursor: strategyDraftReady ? 'pointer' : 'default',
      campaignStrategySave: () => saveCampaignStrategyDraft(false),
      campaignStrategyConfirmModal: !!s.campaignStrategyConfirmModal,
      campaignStrategyConfirmClose: () => this.setState({ campaignStrategyConfirmModal: false }),
      campaignStrategyConfirmKeep: (e) => { if (e && e.stopPropagation) e.stopPropagation(); },
      campaignStrategyConfirmSave: () => saveCampaignStrategyDraft(true),
      campaignStrategyConfirmDirect: () => this.setState(st2 => ({
        campaignStrategyApplied: { ...(st2.campaignStrategyApplied || {}), [cd.sku]: { type: 'campaign-draft', title: strategyDraft.title, mode: strategyDraft.mode, sections: strategyDraft.sections } },
	        campaignStrategyMode: '', campaignStrategyConfirmModal: false, campaignStrategyDraftGenerated: '', campaignStrategyDraftTab: 'input', campaignStrategyDraftInputStep: 1, campaignStrategyDraftInputs: {},
        campaignStrategyDraftLocked: [], campaignStrategyDraftConfirmed: [], campaignStrategyDraftRegen: {}, campaignStrategyDraftEditing: null, campaignStrategyDraftSectionDraft: '',
        campaignStrategyNotice: '新策略已提交当前 Campaign 审核，未存入 Strategy Studio 版本库。'
      })),
      campaignStrategyHasNotice: !!s.campaignStrategyNotice, campaignStrategyNotice: s.campaignStrategyNotice || '',
      campaignBriefTabs, campaignBriefVisibleRows, campaignBriefListEmpty: campaignBriefVisibleRows.length === 0,
      campaignBriefListEmptyText: campaignBriefTab === 'creator' ? '暂无基于具体红人生成的 Brief' : '暂无基于渠道生成的 Brief',
      campaignEmails, campaignEmailKpis,
      campaignEmailSubTabs, campaignPendingEmails, campaignSentEmails,
      campaignEmailCoopCandidates,
      campaignEmailCoopCandidatesEmpty: campaignEmailCoopCandidates.length === 0,
      campaignEmailCoopPickerOpen: !!s.campaignEmailCoopPickerOpen,
      campaignEmailCoopSelectedCount: campaignEmailCoopSelected.length,
      campaignEmailCoopButtonLabel: '发送邮件',
      campaignEmailCoopButtonBg: campaignEmailCoopSelected.length ? '#2457F5' : '#F1F4F8',
      campaignEmailCoopButtonFg: campaignEmailCoopSelected.length ? '#FFFFFF' : '#A2ABBA',
      campaignEmailCoopButtonBd: campaignEmailCoopSelected.length ? '#2457F5' : '#E2E8F2',
      campaignEmailCoopButtonCursor: campaignEmailCoopSelected.length ? 'pointer' : 'default',
      campaignEmailCoopButtonShadow: campaignEmailCoopSelected.length ? '0 3px 8px rgba(36,87,245,.16)' : 'none',
      campaignEmailCoopOpen: (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        if (!campaignEmailCoopSelected.length) return;
        this.setState({ campaignEmailCoopPickerOpen: true });
      },
      campaignEmailCoopClose: () => this.setState({ campaignEmailCoopPickerOpen: false, campaignEmailCoopSelected: [] }),
      campaignEmailCoopKeep: (e) => { if (e && e.stopPropagation) e.stopPropagation(); },
      campaignEmailCoopConfirmBg: campaignEmailCoopCanConfirm ? '#2457F5' : '#F1F4F8',
      campaignEmailCoopConfirmFg: campaignEmailCoopCanConfirm ? '#FFFFFF' : '#A2ABBA',
      campaignEmailCoopConfirmBd: campaignEmailCoopCanConfirm ? '#2457F5' : '#E2E8F2',
      campaignEmailCoopConfirmCursor: campaignEmailCoopCanConfirm ? 'pointer' : 'default',
      campaignEmailCoopConfirm: () => {
        if (!campaignEmailCoopCanConfirm) return;
        this.setState(st2 => {
          const prevDeals = (st2.campaignCoopDeals || {})[cd.sku] || [];
          const nextDeals = [...campaignEmailCoopSelected.filter(handle => !prevDeals.includes(handle)), ...prevDeals];
          const prevCoopList = st2.coopList || [];
          return {
            campaignCoopDeals: { ...(st2.campaignCoopDeals || {}), [cd.sku]: nextDeals },
            coopList: [...campaignEmailCoopSelected.filter(handle => !prevCoopList.includes(handle)), ...prevCoopList],
            campaignEmailCoopPickerOpen: false,
            campaignEmailCoopSelected: [],
            campaignEmailDrawer: null,
            campaignEmailTab: 'sent',
            campaignTab: 'email'
          };
        });
      },
      campaignEmailPendingOn: campaignEmailTab === 'pending', campaignEmailSentOn: campaignEmailTab === 'sent',
      campaignPendingEmailsEmpty: campaignPendingEmails.length === 0, campaignSentEmailsEmpty: campaignSentEmails.length === 0,
      campaignEmailTabNote: campaignEmailTab === 'pending' ? '检查系统草稿，确认无误后发送' : '点击邮件即可在弹窗查看当前记录与完整往来',
      campaignEmailDrawerOpen: !!campaignEmailDrawerItem,
      campaignEmailDrawerPending: campaignEmailDrawerIsPending, campaignEmailDrawerSent: !!campaignEmailDrawerItem && !campaignEmailDrawerIsPending,
      campaignEmailDrawerInitial: campaignEmailDrawerItem ? campaignEmailDrawerItem.initial : '—',
      campaignEmailDrawerTitle: campaignEmailDrawerItem ? campaignEmailDrawerItem.handle : '',
      campaignEmailDrawerMeta: campaignEmailDrawerItem ? (campaignEmailDrawerIsPending ? '待发送 · 来自 Brief 自动起草' : '已发送 · 邮件往来') : '',
      campaignEmailDrawerTo: campaignEmailDrawerItem ? (campaignEmailDrawerItem.to || campaignEmailDrawerItem.handle) : '',
      campaignEmailDrawerCc: campaignEmailDrawerItem ? (campaignEmailDrawerItem.cc || '') : '',
      campaignEmailDrawerBcc: campaignEmailDrawerItem ? (campaignEmailDrawerItem.bcc || '') : '',
      campaignEmailDrawerSubject: campaignEmailDrawerItem ? campaignEmailDrawerItem.subject : '',
      campaignEmailDrawerBody: campaignEmailDrawerItem ? (campaignEmailDrawerItem.body || '') : '',
      campaignEmailDrawerChecks: ['收件人与红人账号匹配', '主题与 Campaign 产品一致', '正文保留红人自然表达空间', '已附上对应 Brief'],
      campaignEmailDrawerThread, campaignEmailHistoryItems, campaignEmailHistoryCount: campaignEmailHistoryItems.length + ' 封',
      campaignEmailDrawerContentTitle: campaignEmailDrawerIsPending ? '本次起草内容' : '本次已发送邮件',
      campaignEmailToolbar, campaignEmailReplyToolbar, campaignEmailInsertChips, campaignEmailAttachments, campaignEmailSendOptions,
      campaignEmailReplyTo: campaignEmailDrawerItem ? campaignEmailDrawerItem.handle : '',
      campaignEmailReplySubject: campaignEmailDrawerItem ? ('Re: ' + campaignEmailDrawerItem.subject) : '',
      campaignEmailReplyBody,
      campaignEmailContractMenuOpen: !!s.campaignEmailContractMenuOpen,
      campaignEmailContractTemplates,
      campaignEmailContractSelectLabel: campaignEmailContractSelectedTemplate ? campaignEmailContractSelectedTemplate.nameZh : '选择 Contract Mgt 合同模板',
      campaignEmailContractSelectBd: s.campaignEmailContractMenuOpen ? '#2457F5' : '#D9E1EF',
      campaignEmailContractSelectFg: campaignEmailContractSelectedTemplate ? '#1D2638' : '#8792A5',
      campaignEmailContractGenerated: !!campaignEmailContractDraft,
      campaignEmailContractFileName: campaignEmailContractDraft ? campaignEmailContractDraft.fileName : '',
      campaignEmailContractStatus: campaignEmailContractIsAttached ? '已确认并附到本次邮件' : 'AI 已生成 · 等待人工检查',
      campaignEmailContractStatusFg: campaignEmailContractIsAttached ? '#4E7156' : '#A5762C',
      campaignEmailContractCardBg: campaignEmailContractIsAttached ? '#F5FAF6' : '#FFFBF4',
      campaignEmailContractCardBd: campaignEmailContractIsAttached ? '#CFE3D3' : '#F1D7AA',
      campaignEmailContractAttachLabel: campaignEmailContractIsAttached ? '✓ 已附到邮件' : '附到邮件',
      campaignEmailContractAttachBg: campaignEmailContractIsAttached ? '#E4EFE4' : '#2457F5',
      campaignEmailContractAttachFg: campaignEmailContractIsAttached ? '#4E7156' : '#FFFFFF',
      campaignEmailContractAttachBd: campaignEmailContractIsAttached ? '#CFE3D3' : '#2457F5',
      campaignEmailContractAttachCursor: campaignEmailContractIsAttached ? 'default' : 'pointer',
      campaignEmailContractEditorOpen: !!s.campaignEmailContractEditorOpen && !!campaignEmailContractDraft,
      campaignEmailContractEditorMeta: campaignEmailContractDraft ? campaignEmailContractDraft.templateName + ' · ' + campaignEmailDrawerItem.handle + ' · ' + cd.product : '',
      campaignEmailContractEditorBody: campaignEmailContractDraft ? campaignEmailContractDraft.body : '',
      campaignEmailReplySendLabel: campaignEmailContractIsAttached ? '发送合同邮件' : '发送回复',
      campaignEmailContractToggle: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st2 => ({ campaignEmailContractMenuOpen: !st2.campaignEmailContractMenuOpen })); },
      campaignEmailContractKeep: (e) => { if (e && e.stopPropagation) e.stopPropagation(); },
      campaignEmailContractOpenEditor: () => { if (campaignEmailContractDraft) this.setState({ campaignEmailContractEditorOpen: true }); },
      campaignEmailContractEditorClose: () => this.setState({ campaignEmailContractEditorOpen: false }),
      campaignEmailContractEditorKeep: (e) => { if (e && e.stopPropagation) e.stopPropagation(); },
      campaignEmailContractEditorSetBody: (e) => {
        if (!campaignEmailContractKey || !campaignEmailContractDraft) return;
        const value = e.target.value;
        this.setState(st2 => ({ campaignEmailContractDrafts: { ...(st2.campaignEmailContractDrafts || {}), [campaignEmailContractKey]: { ...((st2.campaignEmailContractDrafts || {})[campaignEmailContractKey]), body: value } } }));
      },
      campaignEmailContractAttach: attachCampaignEmailContract,
      campaignEmailContractSaveAttach: () => { attachCampaignEmailContract(); this.setState({ campaignEmailContractEditorOpen: false }); },
      campaignEmailSetTo: (e) => updateCampaignEmailDraft('to', e.target.value),
      campaignEmailSetCc: (e) => updateCampaignEmailDraft('cc', e.target.value),
      campaignEmailSetBcc: (e) => updateCampaignEmailDraft('bcc', e.target.value),
      campaignEmailSetSubject: (e) => updateCampaignEmailDraft('subject', e.target.value),
      campaignEmailSetBody: (e) => updateCampaignEmailDraft('body', e.target.value),
      campaignEmailSetReplyBody: (e) => updateCampaignEmailReply(e.target.value),
      campaignEmailDrawerClose: () => this.setState({ campaignEmailDrawer: null, campaignEmailContractMenuOpen: false, campaignEmailContractEditorOpen: false }),
      campaignEmailDrawerKeep: (e) => { if (e && e.stopPropagation) e.stopPropagation(); },
      campaignEmailDrawerSend: () => {
        if (!campaignEmailDrawerItem || !campaignEmailDrawerIsPending) return;
        const entry = { handle: campaignEmailDrawerItem.handle, sku: cd.sku, to: campaignEmailDrawerItem.to || campaignEmailDrawerItem.handle, cc: campaignEmailDrawerItem.cc || '', bcc: campaignEmailDrawerItem.bcc || '', subject: campaignEmailDrawerItem.subject, when: '2026-08-20 现在', status: '已发送', att: 1, body: campaignEmailDrawerItem.body, briefKey: campaignEmailDrawerItem.key, attNames: ['Brief.pdf'] };
        this.setState(st2 => ({ contactLog: [entry, ...(st2.contactLog || [])], campaignEmailTab: 'sent', campaignEmailDrawer: 'sent|' + campaignEmailDrawerItem.handle + '|2026-08-20 现在' }));
      },
      campaignEmailReplySend: () => {
        if (!campaignEmailDrawerItem || campaignEmailDrawerIsPending) return;
        const entry = { handle: campaignEmailDrawerItem.handle, sku: cd.sku, to: campaignEmailDrawerItem.handle, cc: '', bcc: '', subject: 'Re: ' + campaignEmailDrawerItem.subject, when: '2026-09-07 现在', status: '已发送', att: campaignEmailContractIsAttached ? 1 : 0, attNames: campaignEmailContractIsAttached && campaignEmailContractDraft ? [campaignEmailContractDraft.fileName] : [], body: campaignEmailReplyBody || 'Thanks for your reply. Happy to discuss the collaboration details this week.' };
        this.setState(st2 => ({ contactLog: [entry, ...(st2.contactLog || [])], campaignEmailReplies: { ...(st2.campaignEmailReplies || {}), [campaignEmailReplyKey]: '' }, campaignEmailContractEditorOpen: false, campaignEmailContractMenuOpen: false, campaignEmailTab: 'sent', campaignEmailDrawer: 'sent|' + campaignEmailDrawerItem.handle + '|2026-09-07 现在' }));
      },
      campaignBriefHasDetail: !!campaignBriefSelected, campaignBriefDetailEmpty: !campaignBriefSelected,
      campaignBriefDetailChannelShort: campaignBriefSelected ? (campaignBriefSelected.platform === 'Instagram' ? 'IG' : (campaignBriefSelected.platform === 'YouTube' ? 'YT' : 'TT')) : '—',
      campaignBriefDetailTitle: campaignBriefSelected ? campaignBriefSelected.platform + ' · ' + campaignBriefDetailTarget + ' · ' + campaignBriefSelected.ver : '',
      campaignBriefDetailMeta: campaignBriefSelected ? campaignBriefSelected.date + ' · ' + (campaignBriefSelected.mode === 'style' ? '红人风格模板 · 适用 ' + campaignBriefDetailCreators.length + ' 位' : (campaignBriefSelected.segment ? '定向人群版' : (campaignBriefSelected.mode === 'creator' ? '红人个性化' : '渠道标准版'))) + ' · 已迭代 ' + campaignBriefSelected.iter + ' 次' : '',
      campaignBriefDetailStatus: campaignBriefSelected ? campaignBriefSelected.status : '',
      campaignBriefDetailStatusBg: campaignBriefSelected ? (campaignBriefSelected.status === '已通过' ? '#E4EFE4' : (campaignBriefSelected.status === '待审批' ? '#FBEEDA' : '#E4EEF7')) : '#F5F8FE',
      campaignBriefDetailStatusFg: campaignBriefSelected ? (campaignBriefSelected.status === '已通过' ? '#4E7156' : (campaignBriefSelected.status === '待审批' ? '#A5762C' : '#1D48D8')) : '#8792A5',
      campaignBriefConfigOpen: !!s.campaignBriefConfigOpen,
      campaignBriefConfigLabel: s.campaignBriefConfigOpen ? '收起' : '调优',
      campaignBriefConfigBg: s.campaignBriefConfigOpen ? '#EAF0FF' : '#FFFFFF',
      campaignBriefConfigBd: s.campaignBriefConfigOpen ? '#8CAFFF' : '#C8D4E8',
      campaignBriefConfigFg: '#2457F5',
      campaignBriefBodyCols: s.campaignBriefConfigOpen ? 'minmax(0,1fr) minmax(310px,.62fr)' : 'minmax(0,1fr)',
      campaignBriefConfigToggle: () => this.setState(st2 => {
        const opening = !st2.campaignBriefConfigOpen;
        return { campaignBriefConfigOpen: opening, campaignBriefAdjustDraft: opening && !String(st2.campaignBriefAdjustDraft || '').trim() ? String((campaignBriefSelected && campaignBriefSelected.prompt) || '') : st2.campaignBriefAdjustDraft };
      }),
      campaignBriefConfigIteration: campaignBriefSelected ? campaignBriefSelected.iter : 1,
      campaignBriefAdjustDraft: s.campaignBriefAdjustDraft || '',
      campaignBriefAdjustDraftSet: (e) => this.setState({ campaignBriefAdjustDraft: e.target.value }),
      campaignBriefSuggestions,
      campaignBriefSuggestionCount: campaignBriefSuggestions.filter(x => !String(x.actionLabel).startsWith('已') && x.ignoreLabel !== '已忽略').length,
      campaignBriefConfigChecklist,
      campaignBriefSaveLabel: '保存为 v' + campaignBriefNextNo,
      campaignBriefRegenerate: () => {
        if (!campaignBriefSelected) return;
        this.setState(st2 => ({
          briefVersions: (st2.briefVersions || []).map(b => campaignBriefConfigSourceKeys.includes(campaignBriefKeyOf(b)) ? { ...b, iter: (b.iter || 1) + 1, prompt: String(st2.campaignBriefAdjustDraft || '').trim() || b.prompt } : b),
          campaignBriefNotice: '已根据补充要求重新生成当前 Brief。', campaignBriefNoticeKind: 'success'
        }));
      },
      campaignBriefSaveVersion: () => {
        if (!campaignBriefSelected) return;
        this.setState(st2 => {
          const { sourceKeys, ...base } = campaignBriefSelected;
          const created = { ...base, ver: 'v' + campaignBriefNextNo, date: '2026-09-07', status: '草稿', prompt: String(st2.campaignBriefAdjustDraft || '').trim() || base.prompt, origin: 'campaign-generated' };
          return { briefVersions: [created, ...(st2.briefVersions || [])], campaignBriefSelectedKey: campaignBriefKeyOf(created), campaignBriefAdjustDraft: '', campaignBriefNotice: '已保存为 v' + campaignBriefNextNo + '。', campaignBriefNoticeKind: 'success' };
        });
      },
      campaignBriefDetailSections, campaignBriefDetailFoot,
      campaignBriefChannelOptions: ['TikTok', 'Instagram', 'YouTube'].map(label => {
        const on = selectedBriefChannels.includes(label);
        return { label, mark: on ? '✓' : '+', bg: on ? '#EAF0FF' : '#FFFFFF', bd: on ? '#2457F5' : '#E2E8F2', fg: on ? '#2457F5' : '#647187', toggle: () => this.setState(st2 => ({ campaignBriefChannels: (st2.campaignBriefChannels || []).includes(label) ? (st2.campaignBriefChannels || []).filter(x => x !== label) : [...(st2.campaignBriefChannels || []), label], campaignBriefNotice: '' })) };
      }),
      campaignBriefSetupOpen: s.campaignBriefSetupOpen !== false,
      campaignBriefSetupArrow: s.campaignBriefSetupOpen !== false ? '收起 ↑' : '展开 ↓',
      campaignBriefSetupToggle: () => this.setState(st2 => ({ campaignBriefSetupOpen: st2.campaignBriefSetupOpen === false })),
      campaignBriefCreatorPickerOpen: !!s.campaignBriefCreatorPickerOpen,
      campaignBriefCreatorPickerBd: s.campaignBriefCreatorPickerOpen ? '#B8CBFF' : '#E2E8F2',
      campaignBriefCreatorPickerArrow: s.campaignBriefCreatorPickerOpen ? '收起 ↑' : '选择 →',
      campaignBriefCreatorPickerNote: '共 ' + creatorDefs.length + ' 位 / ' + campaignBriefAccountCount + ' 个渠道账号 · 已选择 ' + selectedBriefCreators.length + ' 位',
      campaignBriefCreatorPickerToggle: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st2 => ({ campaignBriefCreatorPickerOpen: !st2.campaignBriefCreatorPickerOpen })); },
      campaignBriefCreatorPickerKeep: (e) => { if (e && e.stopPropagation) e.stopPropagation(); },
      campaignBriefCreatorQuery: s.campaignBriefCreatorQuery || '',
      campaignBriefCreatorQuerySet: (e) => this.setState({ campaignBriefCreatorQuery: e.target.value }),
      campaignBriefCreatorSelectAll: () => this.setState(st2 => ({ campaignBriefCreators: Array.from(new Set([...(st2.campaignBriefCreators || []), ...campaignBriefCreatorMatches.map(c => c.handle)])), campaignBriefNotice: '' })),
      campaignBriefCreatorClear: () => this.setState({ campaignBriefCreators: [], campaignBriefNotice: '' }),
      campaignBriefCreatorOptions: campaignBriefCreatorMatches.map(c => {
        const on = selectedBriefCreators.includes(c.handle);
        return {
          handle: c.handle, initial: c.initial, fit: c.fit, avatar: creatorAvatarMap[c.handle] || '../avatars/mia.jpg',
          platforms: campaignBriefChannelsOf(c).map(campaignBriefPlatformBadge), accountNote: campaignBriefChannelsOf(c).length + ' 个账号', niche: c.niche, country: c.country, followers: c.followers, er: c.er30,
          mark: on ? '✓' : '', bg: on ? '#F7F9FF' : '#FFFFFF', bd: on ? '#2457F5' : '#E2E8F2',
          avatarBd: on ? '#2457F5' : '#FFFFFF', boxBg: on ? '#2457F5' : '#FFFFFF', boxBd: on ? '#2457F5' : '#C8D4E8',
          toggle: () => this.setState(st2 => ({ campaignBriefCreators: (st2.campaignBriefCreators || []).includes(c.handle) ? (st2.campaignBriefCreators || []).filter(x => x !== c.handle) : [...(st2.campaignBriefCreators || []), c.handle], campaignBriefNotice: '' }))
        };
      }),
      campaignBriefCreatorEmpty: campaignBriefCreatorMatches.length === 0,
      campaignBriefHasSelectedCreators: selectedBriefCreators.length > 0,
      campaignBriefSelectedCreators: selectedBriefCreators.map(handle => {
        const c = creatorDefs.find(x => x.handle === handle);
        return { handle, initial: c ? c.initial : handle.replace('@', '').slice(0, 1).toUpperCase(), avatar: creatorAvatarMap[handle] || '../avatars/mia.jpg', remove: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st2 => ({ campaignBriefCreators: (st2.campaignBriefCreators || []).filter(x => x !== handle), campaignBriefNotice: '' })); } };
      }),
      campaignBriefEstimate: String(campaignBriefEstimate),
      campaignBriefGenerateBg: '#EAF0FF', campaignBriefGenerateFg: '#2457F5',
      campaignBriefGenerateBd: '#B8CBFF', campaignBriefGenerateCursor: 'pointer',
      campaignBriefGenerate: (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        if (!campaignBriefEstimate) {
          this.setState({ campaignBriefSetupOpen: true, campaignBriefCreatorPickerOpen: true, campaignBriefNotice: '请先至少选择一个渠道和一位具有对应渠道账号的红人。', campaignBriefNoticeKind: 'info' });
          return;
        }
        this.setState(st2 => {
          const created = [];
          campaignBriefTemplateDefs.forEach(template => {
            const same = campaignBriefVersions.filter(v => v.platform === template.channel && v.mode === 'style' && v.segment === template.styleType);
            const nextNo = same.reduce((max, v) => Math.max(max, parseInt(String(v.ver || '').replace(/\D/g, ''), 10) || 0), 0) + 1;
            created.push({
              sku: cd.sku, name: cd.product, platform: template.channel, ver: 'v' + nextNo, date: '2026-09-07', status: '草稿', iter: 1,
              prompt: '基于预选红人的共同内容风格生成，适用账号：' + template.creators.join('、'),
              mode: 'style', creator: '', segment: template.styleType, styleType: template.styleType, creators: template.creators,
              creatorStyle: template.styleType, origin: 'campaign-generated'
            });
          });
          return { briefVersions: [...created, ...(st2.briefVersions || [])], campaignBriefSelectedKey: created.length ? campaignBriefKeyOf(created[0]) : st2.campaignBriefSelectedKey, campaignBriefNotice: '已按渠道与红人风格生成 ' + created.length + ' 份共用 Brief 模板。', campaignBriefNoticeKind: 'success' };
        });
      },
      campaignBriefJumpEdit: (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        if (!campaignBriefSelected) return;
        const params = new URLSearchParams({
          sku: cd.sku,
          edit: '1',
          platform: campaignBriefSelected.platform || 'TikTok',
          mode: campaignBriefSelected.mode || 'channel',
          ver: campaignBriefSelected.ver || '',
          creator: campaignBriefSelected.creator || '',
          style: campaignBriefSelected.creatorStyle || campaignBriefSelected.styleType || ''
        });
        window.location.href = './6-Brief-Studio.html?' + params.toString();
      },
      campaignBriefSubmitLabel: '确认提交',
      campaignBriefSubmitBg: campaignBriefCanSubmit ? '#2457F5' : '#F5F8FE', campaignBriefSubmitFg: campaignBriefCanSubmit ? '#FFFFFF' : '#A2ABBA',
      campaignBriefSubmitBd: campaignBriefCanSubmit ? '#2457F5' : '#E2E8F2', campaignBriefSubmitCursor: campaignBriefCanSubmit ? 'pointer' : 'default',
      campaignBriefConfirmSubmit: () => {
        if (!campaignBriefCanSubmit || !campaignBriefSelected) return;
        submitCampaignBriefRecords();
      },
      campaignBriefHasNotice: !!s.campaignBriefNotice && s.campaignBriefNoticeKind === 'info', campaignBriefNotice: s.campaignBriefNotice || '',
      campaignBriefNoticeBg: s.campaignBriefNoticeKind === 'info' ? '#EEF3FF' : '#E4EFE4', campaignBriefNoticeBd: s.campaignBriefNoticeKind === 'info' ? '#C8D8FF' : '#CFE3D3',
      campaignBriefNoticeFg: s.campaignBriefNoticeKind === 'info' ? '#1D48D8' : '#4E7156', campaignBriefNoticeMark: s.campaignBriefNoticeKind === 'info' ? 'ⓘ' : '✓',
      campaignAssets,
      campaignAssetRows,
      campaignAssetCountNote: campaignAssetRows.length + ' 条素材 · 与 Asset Library 数据同步',
      campaignAssetsEmpty: campaignAssetRows.length === 0,
      campaignTimeline,
      assetQuery: s.assetQuery || '', clearAssetQuery: () => this.setState({ assetQuery: '' }),
      assetEntryOpen: !!s.assetEntryOpen,
      assetEntryCampaignOpen: !!s.assetEntryCampaignOpen,
      assetEntryCampaignLabel: s.assetEntryCampaign || '请选择具体 Campaign',
      assetEntryCampaignMeta: (() => {
        const selected = campaignList.find(c => c.name === s.assetEntryCampaign);
        return selected ? selected.product + ' · ' + selected.sku : '选择后自动关联合作产品与 SKU';
      })(),
      assetEntryCampaignBd: s.assetEntryCampaignOpen ? '#2457F5' : (s.assetEntryCampaign ? '#B8CBFF' : '#E2E8F2'),
      assetEntryCampaignFg: s.assetEntryCampaign ? '#1D2638' : '#8792A5',
      assetEntryCampaignOptions: campaignList.map(c => {
        const on = c.name === s.assetEntryCampaign;
        return {
          name: c.name, meta: c.product + ' · ' + c.sku + ' · ' + c.window,
          bg: on ? '#EAF0FF' : 'transparent', fg: on ? '#2457F5' : '#1D2638', mark: on ? '✓' : '',
          pick: (e) => {
            if (e && e.stopPropagation) e.stopPropagation();
            this.setState(st => ({
              assetEntryCampaign: c.name,
              assetEntryCampaignOpen: false,
              assetEntryNotice: '',
              alForm: { ...(st.alForm || {}), campaign: c.name, product: c.product, sku: c.sku, brand: String(c.product || '').split(' ')[0] }
            }));
          }
        };
      }),
      assetEntryOpenForm: () => this.setState({
        assetEntryOpen: true, assetEntryCampaignOpen: false, assetEntryCampaign: '', assetEntryNotice: '', alRightsOpen: false,
        alForm: { channel: 'TikTok', post: '2026-09-07' }
      }),
      assetEntryClose: () => this.setState({ assetEntryOpen: false, assetEntryCampaignOpen: false, assetEntryCampaign: '', assetEntryNotice: '', alRightsOpen: false, alForm: {} }),
      assetEntryKeep: (e) => { if (e && e.stopPropagation) e.stopPropagation(); },
      assetEntryCampaignToggle: (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        this.setState(st => ({ assetEntryCampaignOpen: !st.assetEntryCampaignOpen }));
      },
      assetEntryReset: () => this.setState(st => {
        const selected = campaignList.find(c => c.name === st.assetEntryCampaign);
        return {
          assetEntryNotice: '', alRightsOpen: false,
          alForm: selected
            ? { channel: (st.alForm || {}).channel || 'TikTok', post: '2026-09-07', campaign: selected.name, product: selected.product, sku: selected.sku, brand: String(selected.product || '').split(' ')[0] }
            : { channel: (st.alForm || {}).channel || 'TikTok', post: '2026-09-07' }
        };
      }),
      assetEntryNotice: s.assetEntryNotice || '',
      assetEntryHasNotice: !!s.assetEntryNotice,
      assetEntryNoticeColor: /请选择|请填写|有效|已存在/.test(s.assetEntryNotice || '') ? '#C4636D' : '#4E7156',
      assetEntrySubmit: () => this.setState(st => {
        const fm = st.alForm || {};
        const selected = campaignList.find(c => c.name === st.assetEntryCampaign);
        const url = String(fm.url || '').trim();
        if (!selected) return { assetEntryNotice: '请选择具体 Campaign' };
        if (!String(fm.handle || '').trim()) return { assetEntryNotice: '请填写红人账号' };
        if (!String(fm.title || '').trim()) return { assetEntryNotice: '请填写素材主题' };
        if (!/^https?:\/\/[^\s]+$/i.test(url)) return { assetEntryNotice: '请输入以 http:// 或 https:// 开头的有效素材链接' };
        if ((st.alEntries || []).some(x => String(x.url || '').trim() === url)) return { assetEntryNotice: '该素材链接已存在' };
        const entry = {
          ...fm, campaign: selected.name, product: selected.product, sku: selected.sku,
          brand: String(selected.product || '').split(' ')[0], channel: fm.channel || 'TikTok',
          types: fm.isRights ? ['合格素材', '授权素材'] : ['合格素材']
        };
        return {
          alEntries: [entry, ...(st.alEntries || [])], alRightsOpen: false,
          alForm: { channel: fm.channel || 'TikTok', post: '2026-09-07', campaign: selected.name, product: selected.product, sku: selected.sku, brand: String(selected.product || '').split(' ')[0] },
          assetEntryNotice: '素材已保存并同步到当前 Campaign，可继续录入其他渠道'
        };
      }),
      alTabs: [
        { id: 'lib', label: 'Asset Library', note: alRows.length + ' 条素材 · 含手工录入' },
        { id: 'qual', label: '合格素材', note: 'AI 总结 · 合格数与曝光拆分' },
        { id: 'rights', label: '授权素材', note: '授权类型 · 期限 · 合同' }
      ].map(t => {
        const on = (['lib', 'qual', 'rights'].includes(s.alTab) ? s.alTab : 'lib') === t.id;
        return {
          label: t.label, note: t.note, pick: () => this.setState({ alTab: t.id }),
          bg: on ? '#2457F5' : 'transparent', bd: on ? '#2457F5' : 'transparent',
          fg: on ? '#FFFFFF' : '#647187', noteFg: on ? '#FFFFFF' : '#8792A5'
        };
      }),
      alTabLib: !['qual', 'rights'].includes(s.alTab), alTabQual: s.alTab === 'qual', alTabRights: s.alTab === 'rights',
      arKpis: ar.kpis, arRows: ar.rows, arNote: ar.note, arCountNote: ar.countNote,
      arFilters: ar.filters, clearArFilter: () => this.setState({ arFilter: {}, arFilterOpen: null }),
      aqScope: aq.scopeText,
      aqSummary: aq.summary,
      aqHeadline: aq.headline,
      aqCountNote: aq.countNote,
      aqAssets: aq.assetRows,
      aqSummaryOpen: !!s.aqSummaryOpen,
      aqToggleLabel: s.aqSummaryOpen ? '收起总结' : '展开总结',
      toggleAqSummary: () => this.setState(st => ({ aqSummaryOpen: !st.aqSummaryOpen })),
      aqKpis: aq.kpis,
      aqGroupLabel: aq.groupLabel,
      aqRows: aq.rows,
      aqEmpty: aq.assetRows.length === 0, aqNoneApproved: aq.assetRows.length === 0,
      clearAqFilter: () => this.setState({ aqFilter: {}, aqFilterOpen: null }),
      aqFilters: aq.filters,
      alFilterNote: '命中 ' + alRows.length + ' 条',
      clearAlFilter: () => this.setState({ alFilter: {}, alFilterOpen: null }),
      alFilters: (() => {
        const af = s.alFilter || {};
        const defs = [
          ['time', '时间', ['2026-08', '2026-07', '2026-06']],
          ['product', '产品', ['Ryze 头皮按摩仪', 'Lumo 便携香氛机', '手工录入']],
          ['channel', '渠道', ['TikTok', 'Instagram', 'YouTube']],
          ['deal', '合作类型', ['付费合作', '产品置换', '佣金合作', '免费合作', '待确认']],
          ['views', 'Views', ['≥ 200K', '100K–200K', '< 100K']],
          ['er', 'ER', ['≥ 10%', '5%–10%', '< 5%']],
          ['cpv', 'CPV', ['≤ $0.010', '> $0.010', '寄样（无成本）']]
        ];
        return defs.map(([k, label, opts]) => {
          const cur = af[k] || '';
          const isOpen = s.alFilterOpen === k;
          return {
            label, current: cur || '全部', open: isOpen,
            bg: cur ? '#EAF0FF' : '#F8FAFE', bd: isOpen ? '#2457F5' : (cur ? '#F0C9B8' : '#E2E8F2'),
            fg: cur ? '#2457F5' : '#1D2638',
            toggle: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ alFilterOpen: st.alFilterOpen === k ? null : k })); },
            options: [{ value: '', label: '全部' }, ...opts.map(o => ({ value: o, label: o }))].map(o => {
              const on = cur === o.value;
              return {
                label: o.label, bg: on ? '#EAF0FF' : 'transparent', fg: on ? '#2457F5' : '#647187',
                pick: () => this.setState(st => ({ alFilter: { ...(st.alFilter || {}), [k]: o.value }, alFilterOpen: null }))
              };
            })
          };
        });
      })(),
      alHeadNote: alRows.length + ' 条素材 · ' + (s.alEntries || []).length + ' 条手工录入 · 按 Post 日期与最新数据统计',
      alRows,
      alFormBase: (() => {
        const fm = s.alForm || {};
        const txt = (k, label, ph) => ({
          label, ph, isText: true, value: fm[k] || '',
          set: (e) => { const v = e.target.value; this.setState(st => ({ alForm: { ...(st.alForm || {}), [k]: v } })); }
        });
        const base = [
          txt('handle', '红人账号', '@mia.selfcare'),
          txt('title', '素材主题', '夜间 routine ep.13'),
          txt('post', 'Post 日期', '2026-08-28'),
          txt('url', '素材链接', 'https://www.tiktok.com/@… /video/…'),
          txt('spend', '本条成本（USD）', '1200')
        ];
        if (!fm.isRights) return base;
        const cur = fm.rightsType || '';
        return base.concat([
          {
            label: '授权类型', isSelect: true, value: cur || '选择授权类型',
            fg: cur ? '#1D2638' : '#A2ABBA', bd: s.alRightsOpen ? '#2457F5' : '#E2E8F2', open: !!s.alRightsOpen,
            toggle: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ alRightsOpen: !st.alRightsOpen })); },
            options: ['广告投放授权', '仅社媒授权'].map(o => {
              const on = cur === o;
              return {
                label: o, bg: on ? '#EAF0FF' : 'transparent', fg: on ? '#2457F5' : '#647187',
                pick: () => this.setState(st => ({ alForm: { ...(st.alForm || {}), rightsType: o }, alRightsOpen: false }))
              };
            })
          },
          txt('rightsMonths', '授权期限（月）', '6'),
          txt('rightsScope', '授权范围', '社媒 · 白名单投放'),
          txt('contract', '合同编号', 'CT-2026-0831-XXX')
        ]);
      })(),
      alTypeChips: (() => {
        const fm = s.alForm || {};
        const rights = !!fm.isRights;
        const defs = [
          { id: 'qualified', label: '合格素材', note: 'ER ≥ 5% 计入合格数', on: true, locked: true },
          { id: 'rights', label: '授权素材', note: '需填授权类型与期限', on: rights, locked: false }
        ];
        return defs.map(d => ({
          label: d.label, note: d.note,
          check: d.on ? '✓' : '',
          boxBg: d.on ? '#2457F5' : 'transparent', boxBd: d.on ? '#2457F5' : '#C8D4E8',
          bg: d.on ? '#F8FAFE' : '#FFFFFF', bd: d.on ? '#F0C9B8' : '#E2E8F2',
          fg: d.on ? '#1D2638' : '#647187',
          pick: () => { if (d.locked) return; this.setState(st => ({ alForm: { ...(st.alForm || {}), isRights: !(st.alForm || {}).isRights } })); }
        }));
      })(),
      alTypeHint: (s.alForm || {}).isRights ? '已标为授权素材 · 授权素材默认同时进入合格素材清单' : '',
      alFormMetrics: [['m_views', 'Views', '例：412K'], ['m_er', 'ER %', '例：7.1'], ['cpv', 'CPV', '留空自动计算'], ['gmv', '红人 GMV（非必填）', '例：4300']].map(([k, label, ph]) => ({
        label, ph, value: (s.alForm || {})[k] || '',
        set: (e) => { const v = e.target.value; this.setState(st => ({ alForm: { ...(st.alForm || {}), [k]: v } })); }
      })),
      alFormNote: s.alSaved
        ? '已保存并加入 Asset Library，可切到左侧卡片查看'
        : ((s.alForm || {}).isRights
            ? 'CPV 自动计算 · 保存后同时进入合格素材与授权素材两张清单'
            : 'CPV 会按「本条成本 ÷ 最新 Views」自动计算 · 勾选「授权素材」可补授权信息'),
      alReset: () => this.setState({ alForm: {}, alSaved: false }),
      alSubmit: () => this.setState(st => {
        const fm = st.alForm || {};
        if (!fm.title && !fm.handle) return { alSaved: false };
        return {
          alSaved: true, alTab: 'lib', alForm: {},
          alEntries: [{ ...fm, types: fm.isRights ? ['合格素材', '授权素材'] : ['合格素材'] }, ...(st.alEntries || [])]
        };
      }),
      isContact: page === 'contact', contactSent: !!s.contactSent, contactForm: !s.contactSent,
      contactEmail: s.contactEmail || (contactC ? contactC.handle.slice(1).replace(/\./g, '') + '@creatormail.com' : ''),
      contactSubject: s.contactSubject || contactSubjectDefault,
      contactBody: s.contactBody || (rejectMode ? dealMeta.body : (tplCur.body || dealMeta.body)) || contactDraft(0),
      setContactEmail: (e) => this.setState({ contactEmail: e.target.value }),
      setContactSubject: (e) => this.setState({ contactSubject: e.target.value }),
      setContactBody: (e) => this.setState({ contactBody: e.target.value }),
      closeContact: () => this.setState({ page: 'creators', contactHandle: null, contactSent: false }),
      campaignMailThreadClose: () => this.setState({
        mailThreadOpen: false,
        contactHandle: null,
        mailOpenIdx: null,
        mailTargetWhen: null,
        mailTargetSubject: null
      }),
      campaignMailThreadCount: threadRealCount,
      campaignMailThreadReply: () => this.setState(st => ({
        mailThreadOpen: false,
        contactHandle: null,
        mailOpenIdx: null,
        mailTargetWhen: null,
        mailTargetSubject: null,
        campaignEmailDrawer: st.campaignMailSourceKey || null,
        campaignEmailTab: 'sent'
      })),
      regenContact: () => this.setState(st => {
        const n = ((st.contactDraftN || 0) + 1) % 4;
        return { contactDraftN: n, contactBody: contactDraft(n) };
      }),
      sendContact: () => {
        const h = s.contactHandle;
        if (!h) return;
        const bareH = h.slice(1);
        const reject = rejectMode;
        this.setState(st => {
          const already = st.shortlist.includes(bareH);
          const later = st.sendMode === 'later';
          const attLabels = { brief: '标准 Brief', sample: '寄样地址表', deck: '品牌介绍', contract: '合作协议草案' };
          const entry = {
            handle: h, sku: st.contactProduct || contactProd, subject: st.contactSubject || contactSubjectDefault,
            body: st.contactBody || dealMeta.body || '',
            isReply: !!st.replyTo, deal: dealType,
            _clearsInbox: this.INBOX_REPLIES.some(r => r.handle === h),
            attNames: (st.contactAtt || (rejectMode ? [] : ['brief', 'sample'])).map(k => (k === 'brief' && st.briefPick) ? ('Brief：' + st.briefPick) : attLabels[k]).filter(Boolean),
            when: later ? (st.sendDate || '2026-08-21') + ' ' + (st.sendTime || '09:30') : '2026-08-20 现在',
            status: later ? '待发送' : '已发送',
            att: (st.contactAtt || ['brief', 'sample']).length
          };
          if (reject) {
            return { contactLog: [entry, ...(st.contactLog || [])], contactSent: true, sentScheduled: later, crTab: 'lib',
              repliedTo: (st.repliedTo || []).includes(h) ? st.repliedTo : [...(st.repliedTo || []), h] };
          }
          return {
            contactLog: [entry, ...(st.contactLog || [])],
            contactSent: true, sentScheduled: later,
            repliedTo: (st.repliedTo || []).includes(h) ? st.repliedTo : [...(st.repliedTo || []), h],
            coopList: (st.coopList || []).includes(h) ? st.coopList : [...(st.coopList || []), h],
            shortlist: already ? st.shortlist : [...st.shortlist, bareH],
            coopAdded: already ? (st.coopAdded || []) : [...(st.coopAdded || []), bareH],
            crTab: 'coop'
          };
        });
      },
      ct: contactCtx,
      mailTabCompose: (s.mailTab || (s.mailThreadOpen ? 'history' : 'compose')) === 'compose',
      mailViewThread: (s.mailTab || (s.mailThreadOpen ? 'history' : 'compose')) !== 'compose',
      composeTag: s.replyTo ? '撰写回复' : '新邮件',
      composeTitle: s.replyTo ? String(s.replyTo).replace(/^Re:\s*/, '') : '按合作类型套用模板并发送',
      closeCompose: () => this.setState({ mailTab: 'history', replyTo: null }),
      startNewMail: () => this.setState({ mailTab: 'compose', replyTo: null, contactSubject: '', contactBody: '', subjectEdit: false, bodyEdit: false }),
      tplNote: (tplDefs[tplKey] || tplCur).note || '',
      showIntroProds: tplKey === 'intro',
      mailProdOpen: !!s.mailProdOpen,
      mailProdBd: s.mailProdOpen ? '#2457F5' : '#F0C9B8',
      toggleMailProd: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ mailProdOpen: !st.mailProdOpen })); },
      mailProdOptions: briefProdSkus.map(sku => {
        const p = skuAll.find(x => x.sku === sku);
        if (!p) return null;
        const cur = (s.mailProds && s.mailProds.length) ? s.mailProds : [contactProd];
        const on = cur.indexOf(sku) >= 0;
        return {
          name: (on ? '✓ ' : '') + p.name, sku: p.sku,
          bg: on ? '#EAF0FF' : 'transparent', fg: on ? '#2457F5' : '#1D2638',
          pick: () => this.setState(st => {
            const list = (st.mailProds && st.mailProds.length) ? st.mailProds : [contactProd];
            const next = list.indexOf(sku) >= 0 ? list.filter(x => x !== sku) : [...list, sku];
            return { mailProds: next.length ? next : [sku], mailProdOpen: false, contactSubject: '', contactBody: '' };
          })
        };
      }).filter(Boolean),
      mailProdRows: ((s.mailProds && s.mailProds.length) ? s.mailProds : [contactProd]).map(sku => {
        const p = skuAll.find(x => x.sku === sku);
        if (!p) return null;
        return {
          name: p.name, sku: p.sku, price: p.price,
          url: 'https://www.amazon.com/dp/' + p.asin,
          remove: () => this.setState(st => {
            const list = (st.mailProds && st.mailProds.length) ? st.mailProds : [contactProd];
            const next = list.filter(x => x !== sku);
            return { mailProds: next.length ? next : list, contactSubject: '', contactBody: '' };
          })
        };
      }).filter(Boolean),
      showDealTag: tplKey === 'confirm',
      mailLangs: [['zh', '中文'], ['en', 'English']].map(([id, label]) => {
        const on = mailLang === id;
        return { label, pick: () => this.setState({ mailLang: id, contactSubject: '', contactBody: '', subjectEdit: false, bodyEdit: false }), bg: on ? '#1D2638' : '#FFFFFF', fg: on ? '#F8FAFE' : '#647187', bd: on ? '#1D2638' : '#E2E8F2' };
      }),
      mailTemplates: ['intro', 'first', 'quote', 'confirm', 'sample', 'progress', 'post'].map(k => {
        const d = tplDefs[k] || { label: k };
        const on = k === tplKey;
        return {
          label: d.label, bg: on ? '#2457F5' : '#FFFFFF', fg: on ? '#FFFFFF' : '#647187', bd: on ? '#2457F5' : '#E2E8F2',
          pick: () => this.setState(st => ({
            mailTpl: k, contactSubject: '', contactBody: '', subjectEdit: false, bodyEdit: false,
            dealType: (k !== 'confirm' && st.dealType === '拒绝合作') ? null : st.dealType
          }))
        };
      }),
      dealNote: dealMeta.note,
      dealTypes: ['付费合作', '产品置换', '佣金合作', '免费合作', '拒绝合作'].map(d => {
        const on = d === dealType;
        return {
          label: d, bg: on ? '#2457F5' : '#FFFFFF', fg: on ? '#FFFFFF' : '#647187', bd: on ? '#2457F5' : '#E2E8F2',
          pick: () => this.setState({ dealType: d, contactSubject: '', contactBody: '', subjectEdit: false, bodyEdit: false })
        };
      }),
      mailThread: !!s.mailThreadOpen && !!contactC,
      threadNote: (() => {
        if (!threadRealCount) return '暂无往来记录';
        const inbound = threadArr.filter(x => x.who === '红人回复');
        const n = inbound.filter(i => !threadArr.some(o => o.who !== '红人回复' && o.key && i.key && o.key >= i.key)).length;
        return n ? n + ' 封待我回复' : '暂无待我回复';
      })(),
      threadItems: threadArr,
      threadSubject: threadArr.length ? threadArr[threadArr.length - 1].subject : '暂无邮件往来',
      threadMeta: threadRealCount
        ? threadRealCount + ' 封邮件 · ' + (contactC ? contactC.handle : '') + ' · 最近 ' + threadArr[0].date
        : '还没有邮件往来，点「写新邮件」开始',
      threadUnread: threadArr.some(i => i.who === '红人回复' && !threadArr.some(o => o.who !== '红人回复' && o.key && i.key && o.key >= i.key)),
      briefPickOpen: !!s.briefPickOpen,
      briefPickBg: s.briefPick ? '#EAF0FF' : '#FFFFFF',
      briefPickBd: s.briefPickOpen ? '#2457F5' : (s.briefPick ? '#F0C9B8' : '#E2E8F2'),
      briefPickLabel: s.briefPick ? '已选：' + s.briefPick : '选择要发送的 Brief',
      briefPickHint: s.briefPick ? '将作为附件随本封邮件发送' : '可从 Brief 库中挑选对应渠道或红人风格的版本',
      toggleBriefPick: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ briefPickOpen: !st.briefPickOpen })); },
      briefOptions: (() => {
        const opts = [];
        bvLive.forEach(v => {
          opts.push({
            key: v.name + ' · ' + v.platform + (v.mode === 'creator' ? ' · ' + (v.creator || '红人风格') : '') + ' ' + v.ver,
            sub: (v.mode === 'creator' ? '红人风格版' : '渠道版') + ' · ' + v.status + ' · 第 ' + v.iter + ' 次生成'
          });
        });
        (s.briefFromStrategy || []).forEach(x => {
          opts.push({ key: x.name + ' · ' + x.platform + ' 草稿', sub: '由策略生成 · 尚未保存版本' });
        });
        if (!opts.length) opts.push({ key: '标准 Campaign Brief', sub: '默认模板 · 可在 Brief Studio 生成正式版本' });
        return opts.map(o => {
          const on = s.briefPick === o.key;
          return {
            label: o.key, sub: o.sub,
            bg: on ? '#EAF0FF' : 'transparent', fg: on ? '#2457F5' : '#1D2638',
            pick: () => this.setState(st => ({
              briefPick: o.key, briefPickOpen: false,
              contactAtt: (st.contactAtt || (rejectMode ? [] : ['brief', 'sample'])).includes('brief')
                ? st.contactAtt
                : [...(st.contactAtt || []), 'brief']
            }))
          };
        });
      })(),
      sampleOpen: !!s.sampleOpen,
      sampleBtnLabel: s.sampleOpen ? '收起寄样表单' : '寄送样品',
      sampleBg: s.sampleOpen ? '#EAF0FF' : '#FFFFFF',
      sampleFg: s.sampleOpen ? '#2457F5' : '#2457F5',
      sampleBd: s.sampleOpen ? '#2457F5' : '#F0C9B8',
      sampleHint: contactC && (s.shipOrders || []).some(o => o.handle === contactC.handle)
        ? '该红人已有寄样单，可在合作红人 List 的「查看物流」跟踪'
        : '填写产品与收件信息，随邮件一起安排寄样',
      toggleSampleForm: () => this.setState(st => ({ sampleOpen: !st.sampleOpen })),
      sampleQty: String(s.sampleQty || 1),
      setSampleQty: (e) => { const n = parseInt(e.target.value, 10); this.setState({ sampleQty: isNaN(n) ? 1 : Math.max(1, Math.min(20, n)) }); },
      sampleQtyInc: () => this.setState(st => ({ sampleQty: Math.min(20, (st.sampleQty || 1) + 1) })),
      sampleQtyDec: () => this.setState(st => ({ sampleQty: Math.max(1, (st.sampleQty || 1) - 1) })),
      sampleQtyNote: (() => {
        const p3 = skuAll.find(p => p.sku === (s.sampleSku || contactProd)) || skuAll[0];
        const q3 = s.sampleQty || 1;
        return q3 + ' 件 · ' + p3.name + '（' + p3.sku + '）· 当前库存 ' + p3.stock + ' 件' + (q3 > 3 ? ' · 超过 3 件需负责人确认' : '');
      })(),
      sampleProdOpen: !!s.sampleProdOpen,
      sampleProdBd: s.sampleProdOpen ? '#2457F5' : '#E2E8F2',
      sampleProdLabel: (skuAll.find(p => p.sku === (s.sampleSku || contactProd)) || skuAll[0]).name,
      toggleSampleProd: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ sampleProdOpen: !st.sampleProdOpen })); },
      sampleProducts: briefProdSkus.map(sku => {
        const p = skuAll.find(x => x.sku === sku);
        if (!p) return null;
        const on = sku === (s.sampleSku || contactProd);
        return {
          label: p.name, sub: p.sku + ' · ' + p.brand + ' · 库存 ' + p.stock,
          bg: on ? '#EAF0FF' : 'transparent', fg: on ? '#2457F5' : '#1D2638',
          pick: () => this.setState({ sampleSku: sku, sampleProdOpen: false })
        };
      }).filter(Boolean),
      sampleFields: [
        ['name', '收件人姓名 (Full name)', contactC ? contactC.handle.slice(1).replace(/\./g, ' ').replace(/\b\w/g, m => m.toUpperCase()) : '', 'Mia Chen'],
        ['line1', '街道地址 (Address line 1)', '', '1847 Sunset Blvd'],
        ['line2', '门牌 / 单元 (Apt, suite)', '', 'Apt 5B'],
        ['city', '城市 (City)', '', 'Los Angeles'],
        ['state', '州 (State)', '', 'CA'],
        ['zip', '邮编 (ZIP code)', '', '90026'],
        ['country', '国家 (Country)', 'United States', 'United States'],
        ['phone', '联系电话 (Phone)', '', '+1 213 555 0134']
      ].map(([k, label, dft, ph]) => ({
        label, ph, value: ((s.sampleAddr || {})[k] !== undefined) ? s.sampleAddr[k] : dft,
        set: (e) => { const v = e.target.value; this.setState(st => ({ sampleAddr: { ...(st.sampleAddr || {}), [k]: v } })); }
      })),
      sampleFormNote: (contactC && (s.shipOrders || []).some(o => o.handle === contactC.handle && o.replyIdx === -1))
        ? '寄样单已创建，物流状态可在合作红人 List 查看'
        : '创建后会出现在该红人的「样品物流」中，并写入合作档案',
      createSample: () => {
        if (!contactC) return;
        const pn2 = (skuAll.find(p => p.sku === (s.sampleSku || contactProd)) || skuAll[0]).name;
        const resolved = sampleAddrResolved;
        this.setState(st => ({
          sampleCreated: true, sampleOpen: false,
          shipOrders: [this._makeShipOrder({ handle: contactC.handle, product: pn2, sku: (s.sampleSku || contactProd), qty: st.sampleQty || 1, date: '08/20', addr: resolved }), ...(st.shipOrders || [])]
        }));
      },
      toggleContactProd: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ contactProdOpen: !st.contactProdOpen })); },
      toggleSubjScore: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ subjScoreOpen: !st.subjScoreOpen })); },
      toggleBodyScore: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ bodyScoreOpen: !st.bodyScoreOpen })); },
      subjScoreOpen: !!s.subjScoreOpen, bodyScoreOpen: !!s.bodyScoreOpen,
      subjScore: mailScore.subj.total, subjDims: mailScore.subj.dims,
      subjScoreColor: mailScore.subj.color,
      subjScoreBg: s.subjScoreOpen ? '#E8EEFF' : '#F7F9FF', subjScoreBd: s.subjScoreOpen ? '#B8CBFF' : '#D9E4FF',
      bodyScore: mailScore.body.total, bodyDims: mailScore.body.dims,
      bodyScoreColor: mailScore.body.color,
      bodyScoreBg: s.bodyScoreOpen ? '#E8EEFF' : '#F7F9FF', bodyScoreBd: s.bodyScoreOpen ? '#B8CBFF' : '#D9E4FF',
      scheduleOn: s.sendMode === 'later', sendNowMode: s.sendMode !== 'later',
      sendModes: [['now', '立即发送'], ['later', '定时发送']].map(([id, label]) => {
        const on = (s.sendMode || 'now') === id;
        return {
          label, bg: on ? '#2457F5' : '#FFFFFF', fg: on ? '#FFFFFF' : '#647187', bd: on ? '#2457F5' : '#E2E8F2',
          pick: () => this.setState({ sendMode: id })
        };
      }),
      sendHint: s.sendMode === 'later'
        ? '将在设定时间自动发出，可在合作档案查看排期'
        : (contactC ? '建议按红人当地上午发送，打开率更高' : ''),
      sendDate: s.sendDate || '2026-08-21',
      sendTime: s.sendTime || '09:30',
      setSendDate: (e) => this.setState({ sendDate: e.target.value }),
      setSendTime: (e) => this.setState({ sendTime: e.target.value }),
      sendPresets: [
        ['明天 08-21 09:30', '2026-08-21', '09:30'],
        ['本周五 08-21 15:00', '2026-08-21', '15:00'],
        ['下周一 08-24 10:00', '2026-08-24', '10:00']
      ].map(([label, d, t]) => ({ label, pick: () => this.setState({ sendDate: d, sendTime: t }) })),
      sendBtnLabel: rejectMode
        ? (s.sendMode === 'later' ? '定时发送回复' : '发送回复')
        : (s.sendMode === 'later' ? '定时发送并加入合作' : '发送邮件并加入合作'),
      sentTitle: s.sentScheduled ? '邮件已排期' : (rejectMode ? '回复已发送' : '邮件已发送'),
      sentCta: rejectMode ? '返回红人库' : '查看合作红人 List',
      sentNote: s.sentScheduled
        ? '将于 ' + (s.sendDate || '2026-08-21') + ' ' + (s.sendTime || '09:30') + '（' + (contactCtx.tz || '红人当地时间') + '）自动发出；' + contactCtx.handle + ' 已加入合作红人 List，排期已记入合作档案。'
        : (rejectMode
            ? '已礼貌回复 ' + contactCtx.handle + '，本次沟通已记入邮件记录，未加入合作红人 List。'
            : contactCtx.handle + ' 已加入合作红人 List，本次沟通已记入合作档案。'),
      subjectEditing: !!s.subjectEdit, subjectReading: !s.subjectEdit,
      subjectEditLabel: s.subjectEdit ? '完成编辑' : '编辑',
      toggleSubjectEdit: () => this.setState(st => ({ subjectEdit: !st.subjectEdit })),
      bodyEditing: !!s.bodyEdit, bodyReading: !s.bodyEdit,
      bodyEditLabel: s.bodyEdit ? '完成编辑' : '编辑',
      toggleBodyEdit: () => this.setState(st => ({ bodyEdit: !st.bodyEdit })),
      regenSubject: () => this.setState(st => {
        const n = ((st.subjectN || 0) + 1) % 3;
        const alts = (s.mailLang || 'zh') === 'en'
          ? [
            'Collaboration invite · ' + contactProdName + ' × ' + (contactC ? contactC.handle : ''),
            contactProdName + ' — told your way, not ours',
            (contactC ? contactC.handle : '') + ', a product collab with no staged setups'
          ]
          : [
            '合作邀请 · ' + contactProdName + ' × ' + (contactC ? contactC.handle : ''),
            contactProdName + '：想请你用自己的方式讲一次',
            (contactC ? contactC.handle : '') + '，一次不摆场景的产品合作'
          ];
        return { subjectN: n, contactSubject: alts[n] };
      }),
      isContracts: page === 'contracts',
      ctmNote: ctmVisible.length + ' 个合同模板 · 按合作类型选择，可查看、编辑与删除',
      ctmNewOpen: !!s.ctmNewOpen,
      ctmDeleteOpen: !!ctmDeleteTarget,
      ctmDeleteName: ctmDeleteTarget ? ctmDeleteTarget.name : '',
      ctmDeleteNameZh: ctmDeleteTarget ? ctmDeleteTarget.nameZh : '',
      ctmDeleteClose: (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        if (Date.now() - (this._ctmDeleteOpenedAt || 0) < 400) return;
        this.setState({ ctmDeleteId: null });
      },
      ctmDeleteKeep: (e) => { if (e && e.stopPropagation) e.stopPropagation(); },
      ctmDeleteConfirm: (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        const id = s.ctmDeleteId;
        if (!id) return;
        this.setState(st => ({
          ctmRemoved: (st.ctmRemoved || []).indexOf(id) < 0 ? [...(st.ctmRemoved || []), id] : (st.ctmRemoved || []),
          ctmOpen: st.ctmOpen === id ? null : st.ctmOpen,
          ctmEdit: st.ctmEdit === id ? null : st.ctmEdit,
          ctmDeleteId: null
        }));
      },
      ctmNewDeal: ctmNewDraft.deal || '付费合作',
      ctmNewName: ctmNewDraft.name || '',
      ctmNewNameZh: ctmNewDraft.nameZh || '',
      ctmNewSeed: ctmNewDraft.seed || '',
      ctmNewBody: ctmNewLang === 'zh' ? (ctmNewDraft.zh || '') : (ctmNewDraft.en || ''),
      ctmNewBodyPh: ctmNewLang === 'zh' ? '中文可后补，保存后仍可在卡片里编辑' : '英文正文将用于 Campaigns 发邮件时生成合同',
      ctmNewLangHint: ctmNewLang === 'zh' ? '当前显示：中文译文（可空）' : '当前显示：English original（必填）',
      ctmNewLangLabel: ctmNewLang === 'zh' ? '显示英文原文' : '翻译成中文',
      ctmNewLangBg: ctmNewLang === 'zh' ? '#F1F5FF' : '#FFFFFF',
      ctmNewLangBd: ctmNewLang === 'zh' ? '#B8CBFF' : '#E2E8F2',
      ctmNewError: ctmNewDraft.error || '',
      ctmNewHasError: !!(ctmNewDraft.error || ''),
      ctmNewNoError: !(ctmNewDraft.error || ''),
      ctmNewSeedOptions: ctmAll.filter(t => (s.ctmRemoved || []).indexOf(t.id) < 0).map(t => ({
        id: t.id,
        label: t.nameZh + ' · ' + t.ver + ' · ' + t.deal
      })),
      ctmNew: () => this.setState({
        ctmNewOpen: true,
        ctmNew: { ...ctmNewBlank }
      }),
      ctmNewClose: (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        this.setState({ ctmNewOpen: false, ctmNew: { ...ctmNewBlank } });
      },
      ctmNewKeep: (e) => { if (e && e.stopPropagation) e.stopPropagation(); },
      ctmNewSetDeal: (e) => patchCtmNew({ deal: e.target.value, error: '' }),
      ctmNewSetName: (e) => patchCtmNew({ name: e.target.value, error: '' }),
      ctmNewSetNameZh: (e) => patchCtmNew({ nameZh: e.target.value, error: '' }),
      ctmNewSetBody: (e) => patchCtmNew({ [ctmNewLang === 'zh' ? 'zh' : 'en']: e.target.value, error: '' }),
      ctmNewToggleLang: (e) => { if (e && e.stopPropagation) e.stopPropagation(); patchCtmNew({ lang: ctmNewLang === 'zh' ? 'en' : 'zh' }); },
      ctmNewSetSeed: (e) => {
        const seedId = e.target.value || '';
        if (!seedId) { patchCtmNew({ seed: '', error: '' }); return; }
        const src = ctmAll.find(t => t.id === seedId);
        if (!src) { patchCtmNew({ seed: seedId, error: '' }); return; }
        const en = ((s.ctmBodies || {})[src.id + '|en'] !== undefined) ? s.ctmBodies[src.id + '|en'] : (src.en || '');
        const zh = ((s.ctmBodies || {})[src.id + '|zh'] !== undefined) ? s.ctmBodies[src.id + '|zh'] : (src.zh || '');
        patchCtmNew({
          seed: seedId, en, zh, error: '',
          deal: src.deal || ctmNewDraft.deal,
          name: ctmNewDraft.name || src.name,
          nameZh: ctmNewDraft.nameZh || src.nameZh
        });
      },
      ctmNewSave: (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        const deal = String(ctmNewDraft.deal || '').trim();
        const name = String(ctmNewDraft.name || '').trim();
        const nameZh = String(ctmNewDraft.nameZh || '').trim();
        const ver = 'v1';
        const en = String(ctmNewDraft.en || '').trim();
        const zh = String(ctmNewDraft.zh || '').trim();
        if (!deal || !name || !nameZh) { patchCtmNew({ error: '请填写合作类型、英文名称和中文名称。' }); return; }
        if (!en) { patchCtmNew({ error: '请填写英文条款正文。Campaigns 发邮件时会用英文生成合同。' }); return; }
        const id = 'custom-' + Date.now();
        const item = { id, deal, name, nameZh, ver, updated: '2026-09-14', by: 'Legal · Chen Xi', en, zh };
        this.setState(st => ({
          ctmCustom: [item, ...(st.ctmCustom || [])],
          ctmFilter: deal,
          ctmOpen: id,
          ctmEdit: null,
          ctmNewOpen: false,
          ctmNew: { ...ctmNewBlank }
        }));
      },
      ctmFilters: ['全部', '付费合作', '产品置换', '佣金合作', '免费合作', '素材授权', '长期合作'].map(d => {
        const on = d === ctmFilter;
        return {
          label: d, bg: on ? '#2457F5' : '#FFFFFF', fg: on ? '#FFFFFF' : '#647187', bd: on ? '#2457F5' : '#E2E8F2',
          pick: () => this.setState({ ctmFilter: d })
        };
      }),
      ctmList: ctmVisible.map((t, i) => {
        const lang = (s.ctmLang || {})[t.id] || 'en';
        const pal = ctmPalette[t.deal] || ['#F5F8FE', '#647187'];
        const isOpen = s.ctmOpen === t.id;
        const isEdit = s.ctmEdit === t.id;
        return {
          idx: i + 1, name: t.name, nameZh: t.nameZh, deal: t.deal,
          meta: t.ver + ' · 更新于 ' + t.updated + ' · ' + t.by,
          tagBg: pal[0], tagFg: pal[1],
          open: isOpen || isEdit, editing: isEdit, reading: !isEdit,
          body: ((s.ctmBodies || {})[t.id + '|' + lang] !== undefined) ? s.ctmBodies[t.id + '|' + lang] : (lang === 'zh' ? t.zh : t.en),
          langLabel: lang === 'zh' ? '显示英文原文' : '翻译成中文',
          langHint: lang === 'zh' ? '当前显示：中文译文（可编辑）' : '当前显示：English original（可编辑）',
          langBg: lang === 'zh' ? '#F1F5FF' : '#FFFFFF', langBd: lang === 'zh' ? '#B8CBFF' : '#E2E8F2',
          toggleLang: () => this.setState(st => ({ ctmLang: { ...(st.ctmLang || {}), [t.id]: (((st.ctmLang || {})[t.id] || 'en') === 'en' ? 'zh' : 'en') } })),
          viewLabel: isOpen && !isEdit ? '收起' : '查看',
          editLabel: isEdit ? '完成编辑' : '编辑',
          editBg: isEdit ? '#EAF0FF' : '#FFFFFF', editBd: isEdit ? '#2457F5' : '#E2E8F2',
          view: () => this.setState(st => ({ ctmOpen: (st.ctmOpen === t.id && st.ctmEdit !== t.id) ? null : t.id, ctmEdit: null })),
          edit: () => this.setState(st => ({ ctmEdit: st.ctmEdit === t.id ? null : t.id, ctmOpen: t.id })),
          download: (e) => {
            if (e && e.stopPropagation) e.stopPropagation();
            const bodies = s.ctmBodies || {};
            const en = bodies[t.id + '|en'] !== undefined ? bodies[t.id + '|en'] : (t.en || '');
            const zh = bodies[t.id + '|zh'] !== undefined ? bodies[t.id + '|zh'] : (t.zh || '');
            const paras = (text) => String(text || '').split(/\n/).map(line => line || ' ');
            const file = String(t.nameZh || t.name || '合同模板').replace(/[\\/:*?"<>|]/g, ' ').trim() + ' ' + t.ver + '.html';
            this.download(file, this.printableDoc(t.nameZh || t.name, [
              { h: t.name + ' · ' + t.deal + ' · ' + t.ver, rows: ['更新于 ' + t.updated + ' · ' + t.by] },
              { h: 'English original', rows: paras(en) },
              { h: '中文译文', rows: paras(zh).some(line => String(line).trim()) ? paras(zh) : ['（尚未填写中文译文）'] }
            ]));
          },
          setBody: (e) => { const v = e.target.value; this.setState(st => ({ ctmBodies: { ...(st.ctmBodies || {}), [t.id + '|' + lang]: v } })); },
          remove: (e) => {
            if (e && e.stopPropagation) e.stopPropagation();
            this._ctmDeleteOpenedAt = Date.now();
            this.setState({ ctmDeleteId: t.id });
          }
        };
      }),
      isSamples: page === 'samples',
      smpRangeOpen: !!s.smpRangeOpen,
      smpRangeBd: s.smpRangeOpen ? '#2457F5' : '#E2E8F2',
      smpRangeLabel: smpRangeState.label + ' · ' + smpRangeState.start.slice(5).replace('-', '/') + (smpRangeState.start === smpRangeState.end ? '' : '–' + smpRangeState.end.slice(5).replace('-', '/')),
      toggleSmpRange: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ smpRangeOpen: !st.smpRangeOpen })); },
      smpRangeApply: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState({ smpRangeOpen: false }); },
      smpPresets: [['day', '本日'], ['week', '本周'], ['month', '本月'], ['quarter', '本季度'], ['year', '本年度']].map(([k, label]) => {
        const on = (s.smpRangeMode || 'month') === k;
        return {
          label, pick: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState({ smpRangeMode: k }); },
          bg: on ? '#2457F5' : '#FFFFFF', fg: on ? '#FFFFFF' : '#647187', bd: on ? '#2457F5' : '#E2E8F2'
        };
      }),
      smpWeekLabels: ['一', '二', '三', '四', '五', '六', '日'],
      smpCalTitle: (() => { const m = (s.smpCalMonth === undefined ? 7 : s.smpCalMonth); return '2026 年 ' + (m + 1) + ' 月'; })(),
      smpCalPrev: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ smpCalMonth: Math.max(0, (st.smpCalMonth === undefined ? 7 : st.smpCalMonth) - 1) })); },
      smpCalNext: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ smpCalMonth: Math.min(11, (st.smpCalMonth === undefined ? 7 : st.smpCalMonth) + 1) })); },
      smpCalHint: smpRangeState.mode === 'day-pick' ? '已选单日 ' + smpRangeState.start : '点日期可精确筛选某一天',
      smpCalDays: (() => {
        const m = (s.smpCalMonth === undefined ? 7 : s.smpCalMonth);
        const first = new Date(2026, m, 1);
        const lead = (first.getDay() + 6) % 7;
        const days = new Date(2026, m + 1, 0).getDate();
        const out = [];
        for (let i = 0; i < lead; i++) out.push({ label: '', cursor: 'default', bg: 'transparent', fg: '#A2ABBA', fw: 400, title: '', pick: () => {} });
        for (let d = 1; d <= days; d++) {
          const iso = '2026-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
          const inSel = iso >= smpRangeState.start && iso <= smpRangeState.end;
          const isToday = iso === TODAY_ISO;
          const isPick = smpRangeState.mode === 'day-pick' && iso === smpRangeState.start;
          out.push({
            label: String(d), cursor: 'pointer', title: iso,
            bg: isPick ? '#2457F5' : (inSel ? '#EAF0FF' : 'transparent'),
            fg: isPick ? '#FFFFFF' : (isToday ? '#2457F5' : (inSel ? '#1D2638' : '#647187')),
            fw: isToday || isPick ? 600 : 400,
            pick: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState({ smpRangeMode: 'day-pick', smpPickDay: iso }); }
          });
        }
        return out;
      })(),
      openSampleCreate: (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        this.setState(st => ({
          smTab: 'new', smpRangeOpen: false, smSaved: false, smCreateError: '', smBulkError: '',
          smForm: { qty: '1', carrier: 'DHL Express', ...(st.smForm || {}) }
        }));
      },
      closeSampleCreate: (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        this.setState({ smTab: 'progress', smOpen: null, smBulkProdOpen: false, smBulkCarrierOpen: false });
      },
      sampleModalKeep: (e) => { if (e && e.stopPropagation) e.stopPropagation(); },
      smNudgeOpen: !!(s.smNudge && s.smNudge.handle),
      smNudgePending: !!(s.smNudge && s.smNudge.handle && !s.smNudge.sent),
      smNudgeSent: !!(s.smNudge && s.smNudge.sent),
      smNudgeTitle: s.smNudge && s.smNudge.sent ? '催稿邮件已发送' : '发布催稿邮件',
      smNudgeMeta: s.smNudge ? ((s.smNudge.handle || '') + ' · ' + (s.smNudge.product || '')) : '',
      smNudgeTo: (s.smNudge && s.smNudge.to) || '',
      smNudgeSubject: (s.smNudge && s.smNudge.subject) || '',
      smNudgeBody: (s.smNudge && s.smNudge.body) || '',
      smNudgeSetTo: (e) => { const v = e.target.value; this.setState(st => ({ smNudge: { ...(st.smNudge || {}), to: v } })); },
      smNudgeSetSubject: (e) => { const v = e.target.value; this.setState(st => ({ smNudge: { ...(st.smNudge || {}), subject: v } })); },
      smNudgeSetBody: (e) => { const v = e.target.value; this.setState(st => ({ smNudge: { ...(st.smNudge || {}), body: v } })); },
      smNudgeClose: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState({ smNudge: null }); },
      smNudgeSend: (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        const n = this.state.smNudge;
        if (!n || n.sent) return;
        const entry = {
          handle: n.handle, sku: n.sku || '', to: n.to || n.handle,
          subject: n.subject, body: n.body, when: '2026-08-20 现在',
          status: '已发送', att: 0, kind: 'nudge-draft', shipKey: n.key
        };
        this.setState(st => ({
          smNudge: { ...(st.smNudge || {}), sent: true },
          contactLog: [entry, ...(st.contactLog || [])],
          notifLog: [{ kind: 'mail', title: '催稿邮件已发送 · ' + n.handle, note: n.product || n.subject, when: '刚刚' }, ...(st.notifLog || [])]
        }));
      },
      smTabProgress: true, smTabNew: s.smTab === 'new',
      smModes: [['single', '单个收件人'], ['bulk', '批量填写']].map(([id, label]) => {
        const on = (s.smMode || 'single') === id;
        return {
          label, pick: () => this.setState(st => ({
            smMode: id, smCreateError: '', smBulkError: '',
            smBulkProdName: st.smBulkProdName || skuAll[0].name,
            smBulkProdSku: st.smBulkProdSku || skuAll[0].sku,
            smBulkCarrier: st.smBulkCarrier || 'DHL Express'
          })),
          bg: on ? '#2457F5' : '#FFFFFF', fg: on ? '#FFFFFF' : '#647187', bd: on ? '#2457F5' : '#E2E8F2'
        };
      }),
      smModeSingle: (s.smMode || 'single') === 'single', smModeBulk: s.smMode === 'bulk',
      smProdOptions: skuAll.slice(0, 6).map(p => {
        const on = (s.smForm || {}).product === p.name;
        return {
          label: p.name + ' · ' + p.sku,
          bg: on ? '#EAF0FF' : 'transparent', fg: on ? '#2457F5' : '#647187',
          pick: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ smForm: { ...(st.smForm || {}), product: p.name, sku: p.sku }, smOpen: null, smCreateError: '' })); },
          pickBulk: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState({ smBulkProdName: p.name, smBulkProdSku: p.sku, smBulkProdOpen: false, smBulkError: '' }); }
        };
      }),
      smForm: (() => {
        const fm = s.smForm || {};
        const txt = (k, label, ph) => ({
          label, ph, isText: true, value: fm[k] || '',
          set: (e) => { const v = e.target.value; this.setState(st => ({ smForm: { ...(st.smForm || {}), [k]: v }, smCreateError: '' })); }
        });
        const q = String(fm.handle || '').trim().toLowerCase();
        const coopHandles = [...new Set([...(s.coopList || []), ...((s.shipOrders || []).map(o => o.handle))])];
        const coopRows = coopHandles.map(h => {
          const def = creatorDefs.find(c => c.handle === h) || {};
          const addr = this._addrFromHandle(h, s.shipOrders || []);
          const name = (addr && addr.name) || this._nameFromHandle(h);
          const loc = addr ? [addr.city, addr.state].filter(Boolean).join(', ') : '';
          const hay = [h, name, loc, def.niche, def.country].filter(Boolean).join(' ').toLowerCase();
          return { handle: h, name, addr, loc, hay, niche: def.niche || '', hasAddr: !!(addr && addr.line1) };
        }).filter(r => !q || r.hay.indexOf(q) >= 0);
        return [
          {
            label: '寄送产品', isSelect: true, value: fm.product || '选择产品',
            fg: fm.product ? '#1D2638' : '#A2ABBA', bd: s.smOpen === 'product' ? '#2457F5' : '#E2E8F2',
            menuTop: 'calc(100% + 5px)', menuBottom: 'auto',
            open: s.smOpen === 'product',
            toggle: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ smOpen: st.smOpen === 'product' ? null : 'product' })); },
            options: skuAll.slice(0, 6).map(p => {
              const on = fm.product === p.name;
              return {
                label: p.name + ' · ' + p.sku,
                bg: on ? '#EAF0FF' : 'transparent', fg: on ? '#2457F5' : '#647187',
                pick: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ smForm: { ...(st.smForm || {}), product: p.name, sku: p.sku }, smOpen: null, smCreateError: '' })); }
              };
            })
          },
          {
            label: '红人账号', isSearch: true, value: fm.handle || '',
            ph: '搜索已合作红人',
            bd: s.smOpen === 'handle' ? '#2457F5' : '#E2E8F2',
            open: s.smOpen === 'handle',
            empty: coopRows.length === 0,
            emptyNote: q ? '没有匹配「' + (fm.handle || '') + '」的已合作红人' : '暂无已合作红人',
            toggle: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ smOpen: st.smOpen === 'handle' ? null : 'handle' })); },
            set: (e) => {
              if (e && e.stopPropagation) e.stopPropagation();
              const v = e.target.value;
              this.setState(st => ({ smForm: { ...(st.smForm || {}), handle: v }, smOpen: 'handle', smCreateError: '' }));
            },
            options: coopRows.map(r => {
              const on = fm.handle === r.handle;
              return {
                label: r.handle,
                sub: r.hasAddr ? (r.name + (r.loc ? ' · ' + r.loc : '') + ' · 已有地址') : (r.name + ' · 地址待补'),
                bg: on ? '#EAF0FF' : 'transparent', fg: on ? '#2457F5' : '#1D2638',
                pick: (e) => {
                  if (e && e.stopPropagation) e.stopPropagation();
                  const a = r.addr || {};
                  this.setState(st => ({
                    smOpen: null, smCreateError: '',
                    smForm: {
                      ...(st.smForm || {}),
                      handle: r.handle,
                      name: a.name || r.name,
                      line1: a.line1 || '', line2: a.line2 || '',
                      city: a.city || '', state: a.state || '', zip: a.zip || '',
                      phone: a.phone || ''
                    }
                  }));
                }
              };
            })
          },
          txt('qty', '寄送数量', '1'),
          txt('name', '收件人姓名 (Full name)', 'Kayla Reed'),
          txt('line1', '地址第一行 (Street address)', '418 W 47th St'),
          txt('line2', '地址第二行 (Apt / Suite，可空)', 'Apt 3B'),
          txt('city', '城市 (City)', 'New York'),
          txt('state', '州 (State)', 'NY'),
          txt('zip', '邮编 (ZIP code)', '10036'),
          txt('phone', '联系电话 (Phone)', '+1 646 555 0142'),
          {
            label: '承运商', isSelect: true, value: fm.carrier || 'DHL Express',
            fg: '#1D2638', bd: s.smOpen === 'carrier' ? '#2457F5' : '#E2E8F2',
            menuTop: 'auto', menuBottom: 'calc(100% + 5px)',
            open: s.smOpen === 'carrier',
            toggle: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ smOpen: st.smOpen === 'carrier' ? null : 'carrier' })); },
            options: this.SHIP_CARRIERS.map(c => {
              const on = (fm.carrier || 'DHL Express') === c;
              return {
                label: c,
                bg: on ? '#EAF0FF' : 'transparent', fg: on ? '#2457F5' : '#647187',
                pick: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ smForm: { ...(st.smForm || {}), carrier: c }, smOpen: null })); }
              };
            })
          }
        ];
      })(),
      smFormNote: s.smCreateError ? s.smCreateError : (s.smSaved ? '寄样单已创建，可切到「寄样进度」查看物流状态' : '点红人账号可搜索已合作红人；选中后地址会自动带入，仍可改'),
      smFormNoteFg: s.smCreateError ? '#C4636D' : '#A2ABBA',
      smReset: () => this.setState({ smForm: { qty: '1', carrier: 'DHL Express' }, smSaved: false, smOpen: null, smCreateError: '' }),
      smFillExample: () => this.setState({
        smForm: {
          product: skuAll[0].name, sku: skuAll[0].sku, handle: '@kaylascalp', qty: '1',
          name: 'Kayla Reed', line1: '418 W 47th St', line2: 'Apt 3B', city: 'New York', state: 'NY', zip: '10036',
          phone: '+1 646 555 0142', carrier: 'DHL Express'
        },
        smCreateError: '', smSaved: false
      }),
      smSubmit: () => this.setState(st => {
        const fm = st.smForm || {};
        const handle = String(fm.handle || '').trim();
        const name = String(fm.name || '').trim();
        const product = fm.product || '';
        if (!product) return { smCreateError: '请先选择寄送产品' };
        if (!handle || !name) return { smCreateError: '请填写红人账号和收件人姓名（灰色是示例，点「填入示例」可一键带入）' };
        return {
          smForm: { qty: '1', carrier: 'DHL Express' }, smSaved: true, smTab: 'progress', smOpen: null,
          smCreateError: '', smpFilter: '全部', smpQuery: '',
          shipOrders: [this._makeShipOrder({
            handle, product, sku: fm.sku || '', campaign: fm.campaign || '',
            qty: fm.qty || 1, date: '08/20', carrier: fm.carrier || 'DHL Express',
            addr: {
              name, line1: fm.line1 || '', line2: fm.line2 || '',
              city: fm.city || '', state: fm.state || '', zip: fm.zip || '',
              country: 'United States', phone: fm.phone || ''
            }
          }), ...(st.shipOrders || [])],
          notifLog: [{ kind: 'ship', title: '寄样单已创建 · ' + name, note: product + ' × ' + (fm.qty || 1), when: '刚刚' }, ...(st.notifLog || [])]
        };
      }),
      smBulkProd: s.smBulkProdName ? s.smBulkProdName + ' · ' + s.smBulkProdSku : '选择产品',
      smBulkProdOpen: !!s.smBulkProdOpen,
      smBulkProdToggle: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ smBulkProdOpen: !st.smBulkProdOpen, smBulkCarrierOpen: false })); },
      smBulkCarrier: s.smBulkCarrier || 'DHL Express',
      smBulkCarrierOpen: !!s.smBulkCarrierOpen,
      smBulkCarrierBd: s.smBulkCarrierOpen ? '#2457F5' : '#E2E8F2',
      smBulkCarrierToggle: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ smBulkCarrierOpen: !st.smBulkCarrierOpen, smBulkProdOpen: false })); },
      smBulkCarrierOptions: this.SHIP_CARRIERS.map(c => {
        const on = (s.smBulkCarrier || 'DHL Express') === c;
        return {
          label: c, bg: on ? '#EAF0FF' : 'transparent', fg: on ? '#2457F5' : '#647187',
          pick: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState({ smBulkCarrier: c, smBulkCarrierOpen: false }); }
        };
      }),
      smBulkText: s.smBulkText || '',
      setSmBulkText: (e) => this.setState({ smBulkText: e.target.value, smBulkError: '' }),
      smBulkNote: (() => {
        if (s.smBulkError) return s.smBulkError;
        const rows = this._parseBulkShipRows(s.smBulkText || '');
        const lines = (s.smBulkText || '').split(/\n+/).map(x => x.trim()).filter(Boolean);
        if (!lines.length) return '每行一位：账号, 姓名, 地址, 城市, 州, 邮编, 电话, 数量。支持英文/中文逗号或从 Excel 粘贴制表符。';
        const bad = lines.length - rows.length;
        return '已识别 ' + rows.length + ' 行可建单' + (bad ? ' · ' + bad + ' 行格式不足（至少 6 项）' : ' · 格式校验通过');
      })(),
      smBulkNoteFg: s.smBulkError ? '#C4636D' : '#A2ABBA',
      smBulkPreview: this._parseBulkShipRows(s.smBulkText || '').map((r, i) => ({
        idx: i + 1,
        label: r.handle + ' · ' + r.name + ' · ' + [r.line1, r.city, r.state, r.zip].filter(Boolean).join(', ') + ' × ' + r.qty
      })),
      smBulkPreviewShow: this._parseBulkShipRows(s.smBulkText || '').length > 0,
      smBulkBtn: (() => {
        const ok = this._parseBulkShipRows(s.smBulkText || '').length;
        return ok ? '批量创建 ' + ok + ' 单' : '批量创建';
      })(),
      smBulkTemplate: () => this.setState({
        smBulkText: '@kaylascalp, Kayla Reed, 418 W 47th St Apt 3B, New York, NY, 10036, +1 646 555 0142, 1\n@lena.unwinds, Lena Ortiz, 2210 Hyperion Ave, Los Angeles, CA, 90027, +1 213 555 0198, 2\n@scalp.school, Priya Shah, 77 Rowena Ave, Austin, TX, 78702, +1 512 555 0176, 1',
        smBulkProdName: s.smBulkProdName || skuAll[0].name, smBulkProdSku: s.smBulkProdSku || skuAll[0].sku,
        smBulkCarrier: s.smBulkCarrier || 'DHL Express', smBulkError: ''
      }),
      smBulkSubmit: () => this.setState(st => {
        const parsed = this._parseBulkShipRows(st.smBulkText || '');
        if (!parsed.length) return { smBulkError: '没有可创建的行。请点「填入示例」，或按「账号, 姓名, 地址, 城市, 州, 邮编, 电话, 数量」填写。' };
        const prod = st.smBulkProdName || skuAll[0].name;
        const bulkSku = st.smBulkProdSku || skuAll[0].sku;
        const created = parsed.map((row) => this._makeShipOrder({
          handle: row.handle, product: prod, sku: bulkSku, qty: row.qty, date: '08/20',
          carrier: st.smBulkCarrier || 'DHL Express',
          addr: { name: row.name, line1: row.line1 || '', line2: '', city: row.city || '', state: row.state || '', zip: row.zip || '', country: 'United States', phone: row.phone || '' }
        }));
        return {
          shipOrders: [...created, ...(st.shipOrders || [])],
          smBulkText: '', smTab: 'progress', smBulkError: '',
          smpFilter: '全部', smpQuery: '',
          notifLog: [{ kind: 'ship', title: '批量寄样单已创建 · ' + created.length + ' 单', note: prod + ' · ' + created.map(x => x.handle).join('、'), when: '刚刚' }, ...(st.notifLog || [])]
        };
      }),
      smpOrders: smpShown, smpEmpty: smpShown.length === 0,
      smpQueryValue: s.smpQuery || '',
      smpQueryActive: !!String(s.smpQuery || '').trim(),
      smpQueryBd: String(s.smpQuery || '').trim() ? '#B8CBFF' : '#E2E8F2',
      setSmpQuery: (e) => this.setState({ smpQuery: e.target.value }),
      clearSmpQuery: () => this.setState({ smpQuery: '' }),
      smpFilterOpen: !!s.smpFilterOpen,
      toggleSmpFilter: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ smpFilterOpen: !st.smpFilterOpen })); },
      smpFilterBd: s.smpFilterOpen ? '#2457F5' : ((s.smpFilter && s.smpFilter !== '全部') ? '#F0C9B8' : '#E2E8F2'),
      smpFilterBg: (s.smpFilter && s.smpFilter !== '全部') ? '#EAF0FF' : '#F8FAFE',
      smpFilterFg: (s.smpFilter && s.smpFilter !== '全部') ? '#2457F5' : '#1D2638',
      smpFilterCurrent: (s.smpFilter || '全部') + ' ' + ((s.smpFilter || '全部') === '全部' ? smpArr.length : smpArr.filter(x => x.bucket === s.smpFilter).length),
      smpFilters: ['全部', '在途', '已签收', '异常'].map(k => {
        const n = k === '全部' ? smpArr.length : smpArr.filter(x => x.bucket === k).length;
        const on = (s.smpFilter || '全部') === k;
        const dot = { '全部': '#B7C0CF', '在途': BLUE, '已签收': SAGE, '异常': RUST }[k];
        return {
          name: k, count: n, dot,
          pick: () => this.setState({ smpFilter: k, smpFilterOpen: false }),
          bg: on ? '#EAF0FF' : 'transparent', fg: on ? '#2457F5' : '#1D2638'
        };
      }),
      smpFilterNote: String(s.smpQuery || '').trim()
        ? '找到 ' + smpShown.length + ' 个寄样单'
        : ((s.smpFilter || '全部') === '异常'
            ? '超出常规物流时效'
            : ((s.smpFilter || '全部') === '全部' ? '共 ' + smpArr.length + ' 个寄样单' : '已筛选 ' + smpShown.length + ' 个')),
      smpEmptyNote: (s.smpFilter || '全部') === '全部'
        ? '还没有寄样记录 · 在 Influencer CRM 的邮件界面创建寄样单后会自动同步到这里'
        : '当前筛选「' + (s.smpFilter || '全部') + '」下没有寄样单。',
      smpNote: smpArr.length
        ? smpArr.length + ' 个寄样单 · ' + smpArr.filter(x => x.bucket === '已签收').length + ' 已签收 · ' + smpArr.filter(x => x.bucket === '在途').length + ' 在途 · ' + smpArr.filter(x => x.bucket === '异常').length + ' 异常'
        : '还没有寄样记录 · 在 Influencer CRM 的邮件界面创建寄样单后会自动同步到这里',
      smpStatusTabs: [
        { id: '全部', label: '全部', count: smpArr.length },
        { id: '在途', label: '在途', count: smpArr.filter(x => x.bucket === '在途').length },
        { id: '已签收', label: '已签收', count: smpArr.filter(x => x.bucket === '已签收').length },
        { id: '异常', label: '异常', count: smpArr.filter(x => x.bucket === '异常').length }
      ].map(t => {
        const active = (s.smpFilter || '全部') === t.id;
        return {
          ...t,
          bg: active ? '#2457F5' : 'transparent',
          fg: active ? '#FFFFFF' : '#647187',
          bd: active ? '#2457F5' : 'transparent',
          countBg: active ? 'rgba(255,255,255,.2)' : '#F1F4F9',
          countFg: active ? '#FFFFFF' : '#647187',
          pick: () => this.setState({ smpFilter: t.id, smpFilterOpen: false })
        };
      }),
      smpPieceCount: String(smpArr.reduce((t, x) => t + x.qty, 0)),
      crTabs, crTabLib: crTab === 'lib', crTabQuality: crTab === 'quality', crTabBlack: crTab === 'black',
      crTabCoop: crTab === 'coop', crTabLook: crTab === 'lookalike',
      bkAllCheck: (s.bkPicked || []).length ? '✓' : '',
      bkAllBg: (s.bkPicked || []).length ? '#2457F5' : 'transparent',
      bkAllBd: (s.bkPicked || []).length ? '#2457F5' : '#C8D4E8',
      bkAllLabel: (s.bkPicked || []).length ? '已选 ' + (s.bkPicked || []).length + ' 位' : '全选本页红人',
      bkToggleAll: () => this.setState(st => ({ bkPicked: (st.bkPicked || []).length ? [] : creators.map(c => c.handle) })),
      bkNote: (s.bkPicked || []).length ? '可为已选红人统一添加合作状态标签' : '勾选红人后可批量打标签',
      bkBtnBg: (s.bkPicked || []).length ? '#FFFFFF' : '#FFFFFF',
      bkBtnFg: (s.bkPicked || []).length ? '#1D2638' : '#A2ABBA',
      bkBtnBd: (s.bkPicked || []).length ? '#C8D4E8' : '#E2E8F2',
      bkTagOpen: !!s.bkTagOpen,
      bkToggleTag: (e) => { if (e && e.stopPropagation) e.stopPropagation(); if (!(s.bkPicked || []).length) return; this.setState(st => ({ bkTagOpen: !st.bkTagOpen })); },
      bkContact: () => {
        const picked = s.bkPicked || [];
        if (!picked.length) return;
        this.setState(st => ({
          bkPicked: [], crTab: 'coop',
          coopList: [...new Set([...(st.coopList || []), ...picked])],
          contactLog: [...picked.map(h => ({ handle: h, sku: 'RYZ-SC-01', subject: '合作邀请 · Ryze 头皮按摩仪 × ' + h, when: '2026-08-20 现在', status: '已发送 · 批量', att: 1 })), ...(st.contactLog || [])],
          notifLog: [{ kind: 'mail', title: '批量联系已发出 · ' + picked.length + ' 位红人', note: picked.join('、'), when: '刚刚' }, ...(st.notifLog || [])]
        }));
      },
      bkShip: () => {
        const picked = s.bkPicked || [];
        if (!picked.length) return;
        this.setState(st => ({
          bkPicked: [],
          shipOrders: [...picked.filter(h => !(st.shipOrders || []).some(o => o.handle === h)).map((h) => this._makeShipOrder({
            handle: h, product: 'Ryze 头皮按摩仪', sku: 'RYZ-SC-01', qty: 1, date: '08/20',
            addr: this._pendingAddr(h)
          })), ...(st.shipOrders || [])],
          notifLog: [{ kind: 'ship', title: '批量寄样单已创建 · ' + picked.length + ' 单', note: picked.join('、') + ' · 待补收件地址', when: '刚刚' }, ...(st.notifLog || [])]
        }));
      },
      bkTagOptions: [['继续合作', '加入合作红人 List', '#2457F5'], ['合格/优质红人', '加入合格/优质红人', '#4E7156'], ['淘汰/拉黑', '加入淘汰 / 黑名单', '#C4636D']].map(([t, sub, dot]) => ({
        label: t, sub, dot,
        pick: () => {
          const picked = s.bkPicked || [];
          this.setState(st => {
            const tags = { ...(st.alTags || {}) };
            picked.forEach(h => { tags[h] = t; });
            const next = { alTags: tags, bkTagOpen: false, bkPicked: [] };
            if (t === '继续合作') {
              next.coopList = [...new Set([...(st.coopList || []), ...picked])];
              next.blackAdded = (st.blackAdded || []).filter(x => picked.indexOf(x) < 0);
            } else if (t === '合格/优质红人') {
              next.qualityAdded = [...new Set([...(st.qualityAdded || []), ...picked])];
              next.blackAdded = (st.blackAdded || []).filter(x => picked.indexOf(x) < 0);
            } else {
              next.blackAdded = [...new Set([...(st.blackAdded || []), ...picked])];
              next.coopList = (st.coopList || []).filter(x => picked.indexOf(x) < 0);
              next.qualityAdded = (st.qualityAdded || []).filter(x => picked.indexOf(x) < 0);
            }
            next.notifLog = [{ kind: 'tag', title: '批量打标签 · ' + t, note: picked.join('、'), when: '刚刚' }, ...(st.notifLog || [])];
            return next;
          });
        }
      })),
      lkSeeds: (() => {
        const pool = crQuality.length ? crQuality.map(q => q.handle) : ['@kaylascalp'];
        const cur = s.lkSeed || pool[0];
        return pool.map(h => ({
          label: h, pick: () => this.setState({ lkSeed: h }),
          bg: cur === h ? '#2457F5' : '#FFFFFF', fg: cur === h ? '#FFFFFF' : '#1D48D8', bd: cur === h ? '#2457F5' : '#D9E4FF'
        }));
      })(),
      lkNote: (() => {
        const seed = s.lkSeed || (crQuality[0] ? crQuality[0].handle : '@kaylascalp');
        const d = creatorDefs.find(x => x.handle === seed) || { niche: '头皮护理', followers: '21K', er30: '12.4%', nation: '美国' };
        return '以 ' + seed + ' 为种子：' + d.nation + ' · ' + d.niche + ' · ' + d.followers + '粉 · ER ' + d.er30
          + '。AI 在候选池中按受众重合、内容形式、粉丝量级与报价区间四项加权打分，只保留相似度 ≥ 70 的候选。';
      })(),
      lkTraits: ['受众重合 ≥ 62%', '垂类相关', '2 万粉以下优先', '寄样意愿高', 'ER ≥ 6%'],
      lkCountNote: (() => {
        const n = (s.lkPicked || []).length;
        return n ? '已选 ' + n + ' 位 · 批量联系会为每位生成一封个性化开场邮件' : '勾选候选后可批量联系，或单个加入红人库';
      })(),
      lkSelectAllLabel: (s.lkPicked || []).length ? '清空选择' : '全选候选',
      lkSelectAll: () => this.setState(st => ({ lkPicked: (st.lkPicked || []).length ? [] : lkPool.map(x => x.handle) })),
      lkBulkLabel: (s.lkPicked || []).length ? '批量联系 ' + (s.lkPicked || []).length + ' 位' : '批量联系',
      lkBulkBg: (s.lkPicked || []).length ? '#2457F5' : '#FFFFFF',
      lkBulkFg: (s.lkPicked || []).length ? '#FFFFFF' : '#A2ABBA',
      lkBulkBd: (s.lkPicked || []).length ? '#2457F5' : '#E2E8F2',
      lkBulkContact: () => {
        const picked = s.lkPicked || [];
        if (!picked.length) return;
        this.setState(st => ({
          lkAdded: [...new Set([...(st.lkAdded || []), ...picked])],
          lkPicked: [],
          contactLog: [...picked.map(h => ({ handle: h, sku: 'RYZ-SC-01', subject: '合作邀请 · Ryze 头皮按摩仪 × ' + h, when: '2026-08-20 现在', status: '已发送 · 批量', att: 1 })), ...(st.contactLog || [])],
          notifLog: [{ kind: 'mail', title: '批量联系已发出 · ' + picked.length + ' 位候选', note: picked.join('、'), when: '刚刚' }, ...(st.notifLog || [])],
          crTab: 'lib'
        }));
      },
      lkRows: lkPool.map(c => {
        const on = (s.lkPicked || []).includes(c.handle);
        const added = (s.lkAdded || []).includes(c.handle);
        const bare = c.handle.slice(1);
        const urlOf = { TikTok: 'https://www.tiktok.com/' + c.handle, Instagram: 'https://www.instagram.com/' + bare, YouTube: 'https://www.youtube.com/' + c.handle };
        const second = c.platform === 'Instagram' ? 'TikTok' : 'Instagram';
        return {
          handle: c.handle, initial: c.handle.slice(1, 2).toUpperCase(), avatar: creatorAvatarMap[c.handle] || '../avatars/mia.jpg',
          platform: (c.platform || '').toUpperCase(), niche: c.niche,
          url: urlOf[c.platform] || urlOf.TikTok,
          links: [
            { label: c.platform, url: urlOf[c.platform] || urlOf.TikTok, title: c.platform + ' 主页 · 主阵地' },
            { label: second, url: urlOf[second], title: second + ' 主页' }
          ],
          chips: [
            { label: '国籍', value: c.nation }, { label: '市场', value: 'US' },
            { label: '粉丝', value: c.followers }, { label: '层级', value: this.tierOfFollowers(c.followers) },
            { label: '性别', value: c.gender || '—' }, { label: '年龄', value: c.age || '—' },
            { label: '职业', value: c.job || '—' },
            { label: '均播', value: c.avgViews }, { label: 'ER', value: c.er },
            { label: '发布频率', value: freqOf(c.handle) }, { label: '报价', value: c.quote }
          ],
          meta: c.nation + ' · ' + c.niche + ' · ' + c.followers + '粉 · 近30天均播 ' + c.avgViews + ' · ER ' + c.er + ' · 发布频率 ' + freqOf(c.handle) + ' · 报价 ' + c.quote,
          why: c.why, sim: c.sim, simBg: c.sim >= 85 ? '#E4EFE4' : '#FBEEDA', simFg: c.sim >= 85 ? '#4E7156' : '#A5762C',
          bd: on ? '#F0C9B8' : '#E2E8F2',
          check: on ? '✓' : '', boxBg: on ? '#2457F5' : 'transparent', boxBd: on ? '#2457F5' : '#C8D4E8',
          toggle: () => this.setState(st => ({ lkPicked: (st.lkPicked || []).includes(c.handle) ? (st.lkPicked || []).filter(x => x !== c.handle) : [...(st.lkPicked || []), c.handle] })),
          addLabel: added ? '✓ 已加入红人库' : '加入红人库',
          addBg: added ? '#E4EFE4' : '#FFFFFF', addFg: added ? '#4E7156' : '#647187', addBd: added ? '#CFE3D3' : '#E2E8F2',
          add: () => this.setState(st => ({ lkAdded: (st.lkAdded || []).includes(c.handle) ? st.lkAdded : [...(st.lkAdded || []), c.handle] }))
        };
      }),
      coopWaitTabs: [['all', '全部'], ['pending', '待回复'], ['warn', '超 24h'], ['stale', '超 48h']].map(([k, label]) => {
        const on = (s.coopWait || 'all') === k;
        const n = k === 'all' ? (s.coopList || []).length
          : (s.coopList || []).filter(h => {
              const mine = facts.replies.filter(x => x.handle === h);
              if (!mine.length) return false;
              const w = Math.max.apply(null, mine.map(x => x.hours));
              return k === 'pending' ? true : (k === 'warn' ? w >= 24 : w >= 48);
            }).length;
        return {
          label: label + (n ? ' ' + n : ''), pick: () => this.setState({ coopWait: k }),
          bg: on ? '#2457F5' : '#FFFFFF', fg: on ? '#FFFFFF' : '#647187', bd: on ? '#2457F5' : '#E2E8F2'
        };
      }),
      coopCreators: (s.coopList || []).filter(h => {
        const k = s.coopWait || 'all';
        if (k === 'all') return true;
        const mine = facts.replies.filter(x => x.handle === h);
        if (!mine.length) return false;
        const w = Math.max.apply(null, mine.map(x => x.hours));
        return k === 'pending' ? true : (k === 'warn' ? w >= 24 : w >= 48);
      }).map((h, i) => {
        const row = creatorsRaw.find(x => x.handle === h);
        if (!row) return null;
        const bareH = h.slice(1);
        const seedH = h.length;
        const cur = /€/.test(row.quote) ? '€' : '$';
        const quoteNum = parseFloat(String(row.quote).replace(/[^0-9.]/g, '')) || 0;
        const money = (n) => cur + Math.round(n).toLocaleString('en-US');
        const worked = row.status === '已合作' || row.status === '长期合作';
        const qd = crQualityDefs[h] || { grade: 'A 级 · 由素材标记', roas: '—', assets: [] };
        const qAssets = qd ? qd.assets : [];
        const sumViews = qAssets.reduce((t, a) => t + (a.views === '—' ? 0 : parseFloat(a.views) * (/K/i.test(a.views) ? 1000 : 1)), 0);
        const sumGmv = qAssets.reduce((t, a) => t + (parseFloat(String(a.gmv).replace(/[^0-9.]/g, '')) || 0), 0);
        const p2Name = (qAssets[0] && qAssets[0].product) || (skuAll[0] ? skuAll[0].name : '产品');
        const sentLog = (s.contactLog || []).filter(x => x.handle === h && x.status === '已发送');
        const replyRows = [];
        let pendingReplies = facts.replies.filter(x => x.handle === h).length;
        const outboundKeys = (s.contactLog || []).filter(x => x.handle === h && x.status === '已发送').map(x => x.when.split(' ')[0]);
        if (worked) {
          replyRows.push({ date: '08/12', tag: '已同意合作', text: '方向没问题，样品寄到常用地址即可，下一条内容按原节奏安排。', subject: 'Re: 合作邀请 · ' + p2Name });
          replyRows.push({ date: '08/08', tag: '询问细节', text: '想确认授权范围与是否需要挂链接。', subject: 'Re: 合作邀请 · ' + p2Name });
        }
        sentLog.forEach(x => {
          replyRows.unshift({ date: '08/20', tag: '等待对方回复', text: '（' + x.when.split(' ')[0] + ' 已发出，等待对方回复）', subject: x.subject });
        });
        const myOrders = (s.shipOrders || []).filter(o => o.handle === h);
        const shipLatest = (() => {
          if (!myOrders.length) return { text: '未寄样', bg: '#F5F8FE', fg: '#8792A5', meta: '等待安排' };
          const o0 = myOrders[0];
          const st0 = this._orderStage(o0);
          const label = ['待揽收', '已揽收', '运输中', '已签收'][Math.max(0, Math.min(3, st0))];
          return {
            text: label,
            bg: st0 >= 3 ? '#E4EFE4' : (st0 === 0 ? '#FBEEDA' : '#E4EEF7'),
            fg: st0 >= 3 ? '#4E7156' : (st0 === 0 ? '#A5762C' : '#1D48D8'),
            meta: (o0.carrier || 'DHL') + ' · ' + o0.date + (st0 >= 3 ? ' 签收' : ' 已创建单号')
          };
        })();
        const coopStepDefs = ['红人建联', '谈判', '签约付款', '寄样', '沟通 Brief', '回收素材', '合作评估'];
        const coopReached = (() => {
          const contacted = (s.contactLog || []).some(x => x.handle === h) || worked;
          const replied = worked || row.status === '沟通中';
          const signed = worked;
          const shipped = myOrders.length > 0;
          const briefed = qAssets.length > 0 || bvLive.some(v => qAssets.some(a => a.sku === v.sku));
          const collected = qAssets.length >= 1;
          const roasNum2 = qd ? parseFloat(qd.roas) : 0;
          const evaluated = collected && !!qd && /S 级|标杆/.test(qd.grade) && roasNum2 >= 3.5;
          let n = 0;
          if (contacted) n = 1; else return 0;
          if (replied) n = 2; else return n;
          if (signed) n = 3; else return n;
          if (shipped) n = 4; else return n;
          if (briefed) n = 5; else return n;
          if (collected) n = 6; else return n;
          return evaluated ? 7 : n;
        })();
        const coopStageInfo = {
          stage: coopStepDefs[Math.max(0, coopReached - 1)] || '待建联',
          pct: Math.round(coopReached / coopStepDefs.length * 100)
        };
        const negoInfo = (() => {
          const cur = /寄样/.test(row.quote);
          if (cur) {
            return {
              note: '寄样 + 佣金，无固定费',
              rows: [
                { date: '08/12', amount: '寄样 + 12% 佣金', who: '红人确认', tag: '达成', tagBg: '#E4EFE4', tagFg: '#4E7156' },
                { date: '08/10', amount: '我方提议：固定费 $300 + 10%', who: '我方报价', tag: '被拒', tagBg: '#FBE3E3', tagFg: '#C4636D' },
                { date: '08/08', amount: '红人要求：只接寄样 + 佣金', who: '红人开价', tag: '起点', tagBg: '#F5F8FE', tagFg: '#647187' }
              ],
              result: '不适用砍价 · 零固定成本达成',
              detail: '对方拒绝固定费但接受 12% 佣金，等效于把风险全部后置，单位成本优于同层级 micro。',
              bg: '#E4EFE4', fg: '#4E7156'
            };
          }
          const ask = parseFloat(String(row.quote).replace(/[^0-9.]/g, '')) || 0;
          const cUnit = /€/.test(row.quote) ? '€' : '$';
          const first = Math.round(ask * 1.25);
          const mid = Math.round(ask * 1.1);
          const saved = first - ask;
          const pct = first ? Math.round(saved / first * 100) : 0;
          return {
            note: '起始 ' + cUnit + first.toLocaleString('en-US') + ' → 成交 ' + cUnit + ask.toLocaleString('en-US'),
            rows: [
              { date: '08/14', amount: cUnit + ask.toLocaleString('en-US') + ' 成交（含 2 条静帧）', who: '双方确认', tag: '达成', tagBg: '#E4EFE4', tagFg: '#4E7156' },
              { date: '08/11', amount: '我方提议 ' + cUnit + Math.round(ask * 0.9).toLocaleString('en-US') + ' + 12% 佣金', who: '我方报价', tag: '未接受', tagBg: '#FBEEDA', tagFg: '#A5762C' },
              { date: '08/09', amount: '红人下调至 ' + cUnit + mid.toLocaleString('en-US'), who: '红人让价', tag: '让价', tagBg: '#E4EEF7', tagFg: '#1D48D8' },
              { date: '08/07', amount: '红人首次报价 ' + cUnit + first.toLocaleString('en-US'), who: '红人开价', tag: '起点', tagBg: '#F5F8FE', tagFg: '#647187' }
            ],
            result: saved > 0 ? '砍价成功 · 省下 ' + cUnit + saved.toLocaleString('en-US') + '（-' + pct + '%）' : '未砍价 · 按对方报价成交',
            detail: saved > 0
              ? '相比首次报价降低 ' + pct + '%，并额外争取到 2 条静帧交付；佣金比例维持 12%。'
              : '对方坚持原价，建议下一轮用长期合作换取折扣。',
            bg: saved > 0 ? '#E4EFE4' : '#FBEEDA',
            fg: saved > 0 ? '#4E7156' : '#A5762C'
          };
        })();
        const crmOpen = s.crmOpen === h;
        return {
          ...row, idx: i + 1,
          infoOpen: s.crInfoOpen === h,
          infoLabel: s.crInfoOpen === h ? '收起联系方式' : '联系方式',
          infoBg: s.crInfoOpen === h ? '#F8FAFE' : '#FFFFFF',
          infoBd: s.crInfoOpen === h ? '#C8D4E8' : '#E2E8F2',
          toggleInfo: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ crInfoOpen: st.crInfoOpen === h ? null : h })); },
          infoNote: myOrders.length ? '从寄样单收件信息自动抓取' : '尚无寄样记录，寄样后自动补全',
          contactRows: (() => {
            const ad = (myOrders[0] && myOrders[0].addr) || {};
            const bare2 = h.slice(1);
            return [
              { label: '邮箱', value: bare2.replace(/\./g, '') + '@creatormail.com' },
              { label: '姓名', value: ad.name || (bare2.replace(/\./g, ' ').replace(/\b\w/g, m => m.toUpperCase()) + '（未确认）') },
              { label: '电话', value: ad.phone || '未提供' },
              { label: '家庭地址', value: ad.line1
                  ? [ad.line1, ad.line2].filter(Boolean).join(', ') + '\n' + [ad.city, ad.state, ad.zip].filter(Boolean).join(' ') + '\n' + (ad.country || '')
                  : '未提供（寄样时录入）' },
              { label: '主阵地', value: row.platform + ' · ' + row.followers + ' 粉丝' }
            ];
          })(),
          crmOpen, crmLabel: crmOpen ? '收起合作档案' : '合作档案',
          crmBg: crmOpen ? '#F8FAFE' : '#FFFFFF', crmBd: crmOpen ? '#C8D4E8' : '#E2E8F2',
          toggleCrm: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ crmOpen: st.crmOpen === h ? null : h })); },
          crmComms: ((s.contactLog || []).filter(x => x.handle === h).map(x => ({
            key: x.when.split(' ')[0], date: x.when.split(' ')[0].replace(/-/g, '/'),
            text: (x.status === '待发送' ? '已排期开场邮件：' : '已发送开场邮件：') + x.subject + '（附件 ' + x.att + ' 项）',
            by: '陈曦', channel: '邮件', round: x.status === '待发送' ? '待发送 · ' + x.when.split(' ')[1] : '已发送',
            pending: x.status === '待发送',
            cancel: (e) => {
              if (e && e.stopPropagation) e.stopPropagation();
              this.setState(st => ({ contactLog: (st.contactLog || []).filter(y => !(y.handle === x.handle && y.when === x.when)) }));
            }
          }))).concat(worked
            ? (quoteNum > 0
                ? [
                    { date: '2026/08/18', text: '确认下一轮排期，可接 9 月第二周发布。', by: '陈曦', channel: '邮件', round: '第 3 次合作' },
                    { date: '2026/08/14', text: '报价 ' + row.quote + ' 已确认，走定金 + 尾款。', by: '周雅', channel: '邮件', round: '第 3 次合作' },
                    { date: '2026/05/12', text: '第二次合作初稿通过，仅补 #ad 标注。', by: '陈曦', channel: '邮件', round: '第 2 次合作' },
                    { date: '2026/05/02', text: '同意把逐字口播改为必须讲到的三件事。', by: '陈曦', channel: 'DM', round: '第 2 次合作' },
                    { date: '2026/03/06', text: '首次合作交付，反馈拍摄流程顺畅。', by: 'AI 自动记录', channel: 'DM', round: '第 1 次合作' },
                    { date: '2026/02/24', text: '首次接洽并确认寄样地址。', by: '陈曦', channel: '邮件', round: '第 1 次合作' }
                  ]
                : (qAssets.length
                    ? qAssets.slice().reverse().flatMap((a3, ri3) => {
                        const rd = a3.date.replace(/-/g, '/');
                        const rn = '第 ' + (ri3 + 1) + ' 次合作';
                        return [
                          { date: rd, text: '内容已发布：' + a3.title + '（' + a3.channel + '，播放 ' + a3.views + '）。', by: 'AI 自动记录', channel: 'DM', round: rn },
                          { date: rd, text: '寄样已签收，当周产出初稿；保留她自己的镜头结构，不照读脚本。', by: '陈曦', channel: 'DM', round: rn }
                        ];
                      }).concat([{ date: '2026/04/20', text: '首次接洽，明确只接寄样 + 佣金。', by: '陈曦', channel: 'DM', round: '第 1 次合作' }])
                    : [{ date: '2026/04/20', text: '首次接洽，明确只接寄样 + 佣金。', by: '陈曦', channel: 'DM', round: '第 1 次合作' }]))
            : (row.status === '沟通中'
                ? [
                    { date: '08/22', text: '已发报价与合作模式说明，等待回复。', by: '陈曦', channel: '邮件' },
                    { date: '08/18', text: '首次接洽，对方询问产品与寄样安排。', by: '陈曦', channel: 'DM' }
                  ]
                : (row.status === '暂停'
                    ? [{ date: '06/02', text: '因历史交付延期，暂停接洽。', by: '周雅', channel: '内部备注' }]
                    : [{ date: '—', text: '尚未接洽。加入合作后建议先发一封开场邮件。', by: '—', channel: '—' }])))
            .map(x => ({
              ...x, key: x.key || (x.date || '').replace(/\//g, '-'),
              hasMailLink: /邮件/.test(x.channel || ''),
              openMailLink: () => this.setState({
                page: 'contact', contactHandle: h, contactSent: false, mailThreadOpen: true, mailTab: 'history',
                replyTo: null, dealType: null, contactEmail: '', contactSubject: '', contactBody: '',
                contactProduct: null, contactProdOpen: false, subjectEdit: false, bodyEdit: false,
                sampleOpen: false, sampleProdOpen: false, sampleSku: null, sampleQty: 1, sampleAddr: null, sampleCreated: false
              })
            }))
            .sort((a, b) => (a.key < b.key ? 1 : (a.key > b.key ? -1 : 0))),
          crmHistory: worked && qAssets.length
            ? qAssets.map((a, ai2) => ({
                round: '第 ' + (qAssets.length - ai2) + ' 次合作', date: a.date,
                name: a.title, sub: a.campaign + ' · ' + a.product + ' · ' + a.sku + ' · ' + a.channel,
                metrics: [
                  { label: 'View', value: a.views }, { label: 'ER', value: a.er },
                  { label: 'CPV', value: a.cpv }, { label: 'GMV', value: a.gmv }, { label: 'ROAS', value: a.roas }
                ],
                action: '查看素材 →', cursor: 'pointer',
                go: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState({ page: 'assets', assetQuery: a.title }); }
              }))
            : [{ round: '—', date: '—', name: '尚无合作记录', sub: '首次合作完成后自动生成', metrics: [], action: '', cursor: 'default', go: () => {} }],
          crmContracts: (worked
            ? [
                { name: '内容合作协议 2026-Q3', signed: '2026/08/07', term: '社媒 6 个月 + 白名单 3 个月', status: '已签署', bg: '#E4EFE4', fg: '#4E7156' }
              ].concat(qAssets.length >= 2
                ? [{ name: '内容合作协议 2026-Q2', signed: '2026/04/28', term: '社媒 6 个月', status: '已到期', bg: '#F5F8FE', fg: '#647187' }]
                : []).concat([
                { name: '素材二次授权补充协议', signed: '待签署', term: '广告投放 3 个月', status: '待签署', bg: '#FBEEDA', fg: '#A5762C' }
              ])
            : [{ name: '尚无合同', signed: '—', term: '确认合作模式后由模板生成', status: '未创建', bg: '#F5F8FE', fg: '#8792A5' }]
          ).map((ctr, ci2) => {
            const ck = h + '|ct' + ci2;
            const isLic = /授权/.test(ctr.name);
            const isNone = /尚无合同/.test(ctr.name);
            const tplName = isNone ? '内容合作协议 v3（尚未填充）' : (isLic ? '素材二次授权补充协议 v2 · 已按本次合作填充' : '内容合作协议 v3 · 已按本次合作填充');
            const money2 = /寄样/.test(row.quote) ? '无固定费，按成交额 12% 计佣' : row.quote + '（定金 50% + 尾款 50%），另加 12% 佣金';
            const tplBody = isNone
              ? '甲方：灵栖出海（品牌方）\n乙方：' + h + '\n\n一、合作方式：待确认（付费 / 置换 / 佣金）\n二、交付物：待确认\n三、授权范围：待确认\n四、结算方式：待确认\n\n（确认合作模式后由系统按模板自动填充）'
              : (isLic
                  ? '甲方：灵栖出海（品牌方）\n乙方：' + h + '\n\n一、授权内容：乙方于本次合作中产出的视频与静帧素材\n二、授权用途：品牌白名单广告投放（含 Spark Ads / Partnership Ads）\n三、授权期限：自签署日起 3 个月\n四、授权地域：美国、加拿大\n五、署名与剪辑：可裁剪时长与字幕，不得改变原意与产品呈现\n六、额外费用：' + (/寄样/.test(row.quote) ? '按投放消耗的 5% 结算' : '按合作费用的 20% 一次性支付') + '\n\n签署状态：' + ctr.status
                  : '甲方：灵栖出海（品牌方）\n乙方：' + h + '（' + row.platform + '，' + row.followers + '粉丝）\n签署日期：' + ctr.signed + '\n\n一、合作产品：' + p2Name + '\n二、交付物：1 条主视频 + 3 张静帧 + 原始素材\n三、时间节点：寄样后 14 天内交初稿，修改 1 轮\n四、结算方式：' + money2 + '\n五、授权范围：' + ctr.term + '\n六、合规要求：需标注 #ad / Paid partnership，不得出现禁用词\n七、违约：逾期交付超 7 天，甲方可终止并要求退还样品\n\n签署状态：' + ctr.status);
            return {
              ...ctr, tplName, tplBody,
              open: s.ctOpen === ck,
              linkLabel: s.ctOpen === ck ? '收起合同' : '查看合同内容 →',
              toggle: () => this.setState(st => ({ ctOpen: st.ctOpen === ck ? null : ck }))
            };
          }),
          crmPayments: worked
            ? (quoteNum > 0
                ? [
                    { date: '08/07', amount: money(quoteNum * 0.5), round: '第 ' + Math.max(1, qAssets.length) + ' 次合作', stage: '定金 50%', status: '已支付', bg: '#E4EFE4', fg: '#4E7156' },
                    { date: '09/10', amount: money(quoteNum * 0.5), round: '第 ' + Math.max(1, qAssets.length) + ' 次合作', stage: '尾款 50%', status: '待支付', bg: '#FBEEDA', fg: '#A5762C' },
                    { date: '05/28', amount: money(quoteNum * 0.5), round: '第 ' + Math.max(1, qAssets.length - 1) + ' 次合作', stage: '尾款 50%', status: '已支付', bg: '#E4EFE4', fg: '#4E7156' },
                    { date: '08/18', amount: money(sumGmv * 0.12), round: '累计', stage: '佣金结算 12%', status: '已支付', bg: '#E4EFE4', fg: '#4E7156' }
                  ]
                : (Array.from({ length: Math.max(1, qAssets.length) }, (_, ri2) => {
                    const idx2 = Math.max(1, qAssets.length) - ri2;
                    const a2 = qAssets[ri2];
                    return { date: a2 ? a2.date.slice(5).replace('-', '/') : '07/30', amount: '寄样', round: '第 ' + idx2 + ' 次合作', stage: '无固定费', status: '已寄出', bg: '#E4EFE4', fg: '#4E7156' };
                  }).concat([
                    { date: '08/18', amount: money(sumGmv * 0.12), round: '累计', stage: '佣金结算 12%', status: '已支付', bg: '#E4EFE4', fg: '#4E7156' }
                  ])))
            : [{ date: '—', amount: quoteNum ? money(quoteNum) + '（报价）' : '寄样', round: '尚未合作', stage: '尚无付款', status: '未发生', bg: '#F5F8FE', fg: '#8792A5' }],
          crmCommNote: worked ? '可上下滑动查看历次合作沟通' : '加入合作后自动记录',
          ...(() => {
            const mine = facts.replies.filter(x => x.handle === row.handle);
            const wait = mine.length ? Math.max.apply(null, mine.map(x => x.hours)) : 0;
            const lvl = wait >= 48 ? 2 : (wait >= 24 ? 1 : 0);
            return {
              hasMail: pendingReplies > 0, mailCount: pendingReplies,
              mailLabel: wait ? '查看邮件 · 等待 ' + wait + 'h' : '查看邮件',
              mailTitle: wait
                ? (lvl === 2 ? '已超 48 小时未回复，可能流失' : (lvl === 1 ? '已超 24 小时未回复，建议今日处理' : '有红人来信待回复')) + ' · 等待 ' + wait + ' 小时'
                : '查看往来邮件',
              mailBg: lvl === 2 ? '#F7EDEE' : (lvl === 1 ? '#FBEEDA' : (pendingReplies > 0 ? '#E4EEF7' : '#FFFFFF')),
              mailFg: lvl === 2 ? '#C4636D' : (lvl === 1 ? '#A5762C' : (pendingReplies > 0 ? '#1D48D8' : '#647187')),
              mailBd: lvl === 2 ? '#F0C9C9' : (lvl === 1 ? '#EEDCBB' : (pendingReplies > 0 ? '#CFE0EF' : '#E2E8F2')),
              waitHours: wait
            };
          })(),
          openMail: (e) => {
            if (e && e.stopPropagation) e.stopPropagation();
            this.setState({
              page: 'creators', crTab: 'coop', contactHandle: h, contactSent: false, mailOpenIdx: 0,
              contactEmail: '', contactSubject: '', contactBody: '',
              contactProduct: null, contactProdOpen: false, subjectEdit: false, bodyEdit: false,
              mailThreadOpen: true, mailTab: 'history', dealType: null, mailTpl: 'first', replyTo: null, briefPick: null, briefPickOpen: false, sampleOpen: false, sampleProdOpen: false, sampleSku: null, sampleQty: 1, sampleAddr: null, sampleCreated: false
            });
          },
          replyNote: replyRows.length ? '共 ' + replyRows.length + ' 条 · 可直接安排寄样' : '尚无回复',
          replyEmpty: replyRows.length === 0,
          replies: replyRows.map((r, ri) => {
              const shipped = (s.shipOrders || []).some(o => o.handle === h && o.replyIdx === ri);
              const tagMap2 = { '已同意合作': ['#E4EFE4', '#4E7156'], '询问细节': ['#E4EEF7', '#1D48D8'], '等待对方回复': ['#FBEEDA', '#A5762C'], '已读未回': ['#F5F8FE', '#8792A5'] };
              const tm = tagMap2[r.tag] || tagMap2['已读未回'];
              return {
                ...r, tagBg: tm[0], tagFg: tm[1],
                shipLabel: shipped ? '✓ 已安排寄样' : '安排寄样',
                shipBg: shipped ? '#E4EFE4' : '#FFFFFF', shipFg: shipped ? '#4E7156' : '#2457F5',
                shipBd: shipped ? '#CFE3D3' : '#F0C9B8', shipCursor: shipped ? 'default' : 'pointer',
                ship: (e) => {
                  if (e && e.stopPropagation) e.stopPropagation();
                  if (shipped) return;
                  this.setState(st => ({
                    shipOrders: [this._makeShipOrder({
                      handle: h, replyIdx: ri, product: p2Name, qty: 1, date: '08/29',
                      addr: this._pendingAddr(h)
                    }), ...(st.shipOrders || [])]
                  }));
                }
              };
            }),
          shipStateText: shipLatest.text, shipBg2: shipLatest.bg, shipFg2: shipLatest.fg, shipMeta: shipLatest.meta,
          coopStage: coopStageInfo.stage, coopPct: coopStageInfo.pct, coopPctText: coopStageInfo.pct + '%',
          coopSteps: coopStepDefs.map((label, si) => {
            const done = si < coopReached;
            const current = si === coopReached;
            return {
              label, mark: done ? '✓' : '',
              bg: done ? SAGE : (current ? '#FBEEDA' : '#EEF2F8'),
              fg: '#FFFFFF',
              labelFg: done ? '#4E7156' : (current ? '#A5762C' : '#B7C0CF')
            };
          }),
          shipOpen: s.shipPanel === h,
          shipBtnLabel: s.shipPanel === h ? '收起物流' : '查看物流',
          shipBtnBg: s.shipPanel === h ? '#F8FAFE' : '#FFFFFF',
          shipBtnBd: s.shipPanel === h ? '#C8D4E8' : '#E2E8F2',
          toggleShip: (e) => { if (e && e.stopPropagation) e.stopPropagation(); this.setState(st => ({ shipPanel: st.shipPanel === h ? null : h })); },
          coopPctColor: coopStageInfo.pct >= 80 ? SAGE : coopStageInfo.pct >= 40 ? AMBER : BLUE,
          shipRecords: (s.shipOrders || []).filter(o => o.handle === h).map(o => {
            const stg = this._orderStage(o);
            const stat = ['待揽收', '已揽收', '运输中', '已签收'][Math.max(0, Math.min(3, stg))];
            return {
              product: o.product + ' × ' + (o.qty || 1), status: stat,
              meta: o.date + ' 寄出 · ' + (o.carrier || 'DHL') + ' · ' + (o.tracking || '') + ' · ' + ((o.addr && o.addr.city) ? o.addr.city + ', ' + (o.addr.state || '') : '地址待补充'),
              tagBg: stg >= 3 ? '#E4EFE4' : (stg === 0 ? '#FBEEDA' : '#E4EEF7'),
              tagFg: stg >= 3 ? '#4E7156' : (stg === 0 ? '#A5762C' : '#1D48D8')
            };
          }),
          negoNote: negoInfo.note,
          negoRows: negoInfo.rows,
          negoResult: negoInfo.result, negoDetail: negoInfo.detail,
          negoResultBg: negoInfo.bg, negoResultFg: negoInfo.fg,
          shipNote: (s.shipOrders || []).filter(o => o.handle === h).length + ' 个包裹',
          shipEmpty: (s.shipOrders || []).filter(o => o.handle === h).length === 0,
          shipments: ((s.shipOrders || []).filter(o => o.handle === h).map(o => {
            const stg = this._orderStage(o);
            const stat = ['待揽收', '已揽收', '运输中', '已签收'][Math.max(0, Math.min(3, stg))];
            return {
              product: o.product + (o.qty > 1 ? ' × ' + o.qty : ''),
              carrier: o.carrier || 'DHL Express',
              tracking: o.tracking || ('TRK' + String(100000 + (h.length * 7351 + (o.qty || 1) * 17) % 899999)),
              status: stat, stage: stg,
              latest: stg >= 3 ? o.date + ' 已签收，可催内容初稿。' : (stg === 0 ? o.date + ' 已创建寄样单，等待仓库揽收。' : o.date + ' 包裹在途，预计 3–5 个工作日送达。')
            };
          })).map(x => ({
              ...x,
              tagBg: x.status === '已签收' ? '#E4EFE4' : (x.status === '待揽收' ? '#FBEEDA' : '#E4EEF7'),
              tagFg: x.status === '已签收' ? '#4E7156' : (x.status === '待揽收' ? '#A5762C' : '#1D48D8'),
              steps: ['已创建', '已揽收', '运输中', '已签收'].map((label, si) => ({
                label, color: si <= x.stage ? SAGE : '#EAF0FF', fg: si <= x.stage ? '#4E7156' : '#A2ABBA'
              }))
            })),
          crmPaySummary: worked
            ? (quoteNum > 0
                ? money(quoteNum * 0.5 + sumGmv * 0.12) + ' 已付 · ' + money(quoteNum * 0.5) + ' 待付'
                : money(sumGmv * 0.12) + ' 已付 · ' + cur + '0 待付')
            : '—',
          crmPerf: worked && qAssets.length
            ? [
                { label: '累计内容', value: qAssets.length + ' 条', color: '#1D2638' },
                { label: '累计播放', value: sumViews >= 1000 ? Math.round(sumViews / 1000) + 'K' : String(sumViews), color: '#1D2638' },
                { label: '平均 ER', value: row.er30, color: '#1D2638' },
                { label: '平均 CPV', value: quoteNum > 0 ? (sumViews ? cur + (quoteNum / sumViews).toFixed(3) : '—') : '寄样', color: quoteNum > 0 ? '#4E7156' : '#647187' },
                { label: '累计 GMV', value: money(sumGmv), color: '#4E7156' },
                { label: '综合 ROAS', value: qd ? qd.roas : '—', color: '#4E7156' }
              ]
            : [
                { label: '累计内容', value: '—', color: '#A2ABBA' },
                { label: '累计播放', value: '—', color: '#A2ABBA' },
                { label: '平均 ER', value: row.er30, color: '#1D2638' },
                { label: '平均 CPV', value: '—', color: '#A2ABBA' },
                { label: '累计 GMV', value: '—', color: '#A2ABBA' },
                { label: '综合 ROAS', value: '—', color: '#A2ABBA' }
              ],
          removeCoop: (e) => {
            if (e && e.stopPropagation) e.stopPropagation();
            this.setState(st => {
              const mine = (st.coopAdded || []).includes(bareH);
              return {
                coopList: (st.coopList || []).filter(x => x !== h),
                shortlist: mine ? st.shortlist.filter(x => x !== bareH) : st.shortlist,
                coopAdded: (st.coopAdded || []).filter(x => x !== bareH)
              };
            });
          }
        };
      }).filter(Boolean),
      coopEmpty: (s.coopList || []).length === 0,
      coopNote: (() => {
        const waits = (s.coopList || []).map(h => {
          const mine = facts.replies.filter(x => x.handle === h);
          return mine.length ? Math.max.apply(null, mine.map(x => x.hours)) : 0;
        });
        const w24 = waits.filter(x => x >= 24).length, w48 = waits.filter(x => x >= 48).length;
        return '已加入合作的红人 · ' + (s.coopList || []).length + ' 位'
          + (w48 ? ' · ' + w48 + ' 位已超 48 小时未回复' : (w24 ? ' · ' + w24 + ' 位超 24 小时未回复' : ' · 邮件均在 24 小时内'));
      })(),
      crFilters, clearCrFilter: () => this.setState({ crFilter: {}, crOpen: null }),
      crLibNote: '筛选后 ' + creators.length + ' / ' + creatorDefs.length + ' 位红人 · 均播与 ER 取近 30 天',
      crHeadNote: creatorDefs.length + ' 位红人 · ' + s.shortlist.length + ' 位在 shortlist · 按 FIT 打分降序',
      crLibEmpty: creators.length === 0,
      crQuality, crBlacklist,
      rp: reportShell,
      reportHeadline: 'Q2 最大的发现不是哪个红人好，而是「叙事角度」比「粉丝量级」更决定结果：同一层级红人，睡前 routine 角度的 ROAS 比开箱高 41%。下一轮应该先定角度，再选人。',
      winning, weak, nextRound, settings
    };
  }
}
window.Component = Component;
};

if (window.DCLogic) defineAiosComponent();
else window.__defineAiosComponent = defineAiosComponent;
})();
