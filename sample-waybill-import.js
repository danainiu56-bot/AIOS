/* Local-only shipment manifest reader and matching rules. */
(function (root) {
  const clean = v => String(v == null ? '' : v).replace(/^\uFEFF/, '').trim();
  const columns = rows => {
    if (!rows.length) throw new Error('清单为空');
    const headers = rows[0].map(clean);
    const id = headers.indexOf('寄样单编号');
    const tracking = headers.findIndex(h => ['外部运单号', '运单号', 'Tracking Number'].includes(h));
    if (id < 0 || tracking < 0) throw new Error('缺少「寄样单编号」或「外部运单号」列，请重新下载最新清单。');
    if (headers.filter(h => h === '寄样单编号').length !== 1 || headers.filter(h => ['外部运单号','运单号','Tracking Number'].includes(h)).length !== 1) throw new Error('清单包含重复的编号或运单号列');
    if (rows.length > 5001) throw new Error('每次最多导入 5000 行');
    return rows.slice(1).map((r, i) => ({ line: i + 2, id: clean(r[id]), tracking: clean(r[tracking]), name: clean(r[headers.indexOf('姓名')]), sku: clean(r[headers.indexOf('MSKU')]) })).filter(r => r.id || r.tracking || r.name || r.sku);
  };
  function csv(text) {
    text = text.replace(/^\uFEFF/, '');
    const rows = []; let row = [], field = '', quoted = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch === '"') { if (quoted && text[i + 1] === '"') { field += '"'; i++; } else if (quoted || !field) quoted = !quoted; else field += ch; }
      else if (ch === ',' && !quoted) { row.push(field); field = ''; }
      else if ((ch === '\n' || ch === '\r') && !quoted) { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(field); rows.push(row); row = []; field = ''; }
      else field += ch;
    }
    if (quoted) throw new Error('CSV 引号未闭合，请检查文件格式');
    if (field || row.length) { row.push(field); rows.push(row); }
    return rows.filter(r => r.some(v => clean(v)));
  }
  async function xlsx(buffer) {
    const bytes = new Uint8Array(buffer), view = new DataView(buffer), decoder = new TextDecoder();
    let end = -1;
    for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) if (view.getUint32(i, true) === 0x06054b50) { end = i; break; }
    if (end < 0) throw new Error('无法读取 Excel，请上传未加密的 .xlsx 文件');
    const files = new Map(); let pos = view.getUint32(end + 16, true), total = 0;
    const count = view.getUint16(end + 10, true);
    if (count > 2000) throw new Error('Excel 文件过于复杂，请只保留寄样清单');
    for (let i = 0; i < count; i++) {
      if (view.getUint32(pos, true) !== 0x02014b50) throw new Error('Excel 文件结构不完整');
      const flags = view.getUint16(pos + 8, true), method = view.getUint16(pos + 10, true), compressed = view.getUint32(pos + 20, true), size = view.getUint32(pos + 24, true);
      const nameLen = view.getUint16(pos + 28, true), extra = view.getUint16(pos + 30, true), comment = view.getUint16(pos + 32, true), offset = view.getUint32(pos + 42, true);
      const name = decoder.decode(bytes.slice(pos + 46, pos + 46 + nameLen));
      total += size;
      if (flags & 1) throw new Error('暂不支持加密文件');
      if (total > 40 * 1024 * 1024) throw new Error('解压后的文件过大，请精简清单');
      files.set(name, { method, compressed, size, offset }); pos += 46 + nameLen + extra + comment;
    }
    async function xml(name) {
      const f = files.get(name); if (!f) return null;
      const at = f.offset;
      if (view.getUint32(at, true) !== 0x04034b50) throw new Error('Excel 文件损坏');
      const start = at + 30 + view.getUint16(at + 26, true) + view.getUint16(at + 28, true);
      let data = bytes.slice(start, start + f.compressed);
      if (f.method === 8) {
        const reader = new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw')).getReader();
        const parts = []; let length = 0;
        while (true) { const part = await reader.read(); if (part.done) break; length += part.value.length; if (length > f.size || length > 40 * 1024 * 1024) { await reader.cancel(); throw new Error('Excel 解压大小异常'); } parts.push(part.value); }
        data = new Uint8Array(length); let n = 0; for (const p of parts) { data.set(p, n); n += p.length; }
      } else if (f.method !== 0) throw new Error('不支持此 Excel 压缩格式');
      if (data.length !== f.size) throw new Error('Excel 文件内容不完整');
      const doc = new DOMParser().parseFromString(decoder.decode(data), 'application/xml');
      if (doc.getElementsByTagName('parsererror').length) throw new Error('Excel XML 格式异常');
      return doc;
    }
    const tags = (el, name) => Array.from(el.getElementsByTagNameNS('*', name));
    const stringsDoc = await xml('xl/sharedStrings.xml');
    const strings = stringsDoc ? tags(stringsDoc, 'si').map(si => tags(si, 't').map(t => t.textContent).join('')) : [];
    const workbook = await xml('xl/workbook.xml'), rels = await xml('xl/_rels/workbook.xml.rels');
    if (!workbook || !rels) throw new Error('未找到 Excel 工作表');
    const candidates = [];
    for (const sheet of tags(workbook, 'sheet')) {
      const id = sheet.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id');
      const rel = tags(rels, 'Relationship').find(r => r.getAttribute('Id') === id);
      if (!rel || rel.getAttribute('TargetMode') === 'External') continue;
      const target = rel.getAttribute('Target'); const path = target.startsWith('/') ? target.slice(1) : 'xl/' + target.replace(/^\.\//, '');
      const doc = await xml(path); if (!doc) continue;
      const rows = tags(doc, 'row').map(row => {
        const result = [];
        for (const cell of tags(row, 'c')) {
          const ref = (cell.getAttribute('r') || '').match(/^[A-Z]+/); if (!ref) continue;
          let col = 0; for (const ch of ref[0]) col = col * 26 + ch.charCodeAt(0) - 64;
          const type = cell.getAttribute('t'), value = tags(cell, 'v')[0]?.textContent || '';
          result[col - 1] = tags(cell, 'f').length ? '[公式不支持]' : type === 's' ? (strings[Number(value)] || '') : type === 'inlineStr' ? tags(cell, 't').map(t => t.textContent).join('') : (!type || type === 'n') && /^\d{16,}$/.test(value) ? '[数字精度丢失，请使用文本格式]' : value;
        }
        return result;
      }).filter(r => r.some(v => clean(v)));
      if (rows[0]?.some(v => clean(v) === '寄样单编号')) candidates.push(rows);
    }
    if (candidates.length !== 1) throw new Error(candidates.length ? '有多个寄样清单工作表，请只保留需要导入的一张' : '未找到寄样单编号列，请下载最新清单');
    return candidates[0];
  }
  async function read(file) {
    if (!file || !/\.(xlsx|csv)$/i.test(file.name)) throw new Error('请选择 .xlsx 或 .csv 文件');
    if (file.size > 10 * 1024 * 1024) throw new Error('文件不能超过 10 MB');
    const buffer = await file.arrayBuffer();
    const table = /\.csv$/i.test(file.name) ? csv(new TextDecoder('utf-8', { fatal: true }).decode(buffer)) : await xlsx(buffer);
    return columns(table);
  }
  function preview(rows, orders) {
    const counts = new Map(); rows.filter(r => r.id && r.tracking).forEach(r => counts.set(r.id, (counts.get(r.id) || 0) + 1));
    return rows.map(row => {
      const matches = orders.filter(o => o.shipmentId === row.id), order = matches.length === 1 ? matches[0] : null;
      let status = '可回填', kind = 'ready';
      if (!row.tracking) { status = '运单号为空，跳过'; kind = 'skip'; }
      else if (!row.id || !matches.length) { status = '未匹配到寄样单'; kind = 'error'; }
      else if (matches.length !== 1 || counts.get(row.id) > 1) { status = '寄样单编号重复，请核对'; kind = 'error'; }
      else if ((row.sku && row.sku !== order.sku) || (row.name && row.name !== clean(order.addr?.name))) { status = '姓名或 MSKU 与寄样单不符'; kind = 'error'; }
      else if (!/^[A-Za-z0-9][A-Za-z0-9 -]{2,99}$/.test(row.tracking) || /^\d+(?:\.\d+)?e[+-]?\d+$/i.test(row.tracking)) { status = '运单号格式异常，请使用文本格式'; kind = 'error'; }
      else if (clean(order.tracking)) { status = clean(order.tracking) === row.tracking ? '相同运单已回填，跳过' : '已有不同运单号，需人工核对'; kind = clean(order.tracking) === row.tracking ? 'skip' : 'error'; }
      else if (order.trackingBound || Number(order.stage) > 0) { status = '寄样单状态已变更，请核对'; kind = 'error'; }
      return { ...row, handle: order?.handle || '—', product: order?.product || row.sku || '—', status, kind, color: kind === 'ready' ? '#4E7156' : kind === 'error' ? '#C4636D' : '#8792A5' };
    });
  }
  const api = { read, preview, csv, columns };
  if (typeof module !== 'undefined') module.exports = api;
  else root.AIOSWaybillImport = api;
})(typeof window === 'undefined' ? globalThis : window);
