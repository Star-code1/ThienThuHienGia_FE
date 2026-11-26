// Diff / áp dụng thao tác đồng bộ sơ đồ đội hình. Logic applyOp phải khớp với
// ThienThuHienGia_BE/services/lineupRealtime.js.
// isCollapsed là trạng thái giao diện riêng từng người nên không đồng bộ.

const rid = (p) => `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
const J = (v) => JSON.stringify(v);
export const clone = (v) => JSON.parse(JSON.stringify(v));
const stripUi = (o) => { const { isCollapsed, ...rest } = o; return rest; };

export function ensureIds(divisions) {
  divisions.forEach((d) => {
    if (!d.id) d.id = rid('div');
    (d.teams || []).forEach((t) => { if (!t.id) t.id = rid('team'); });
  });
}

const hasAllIds = (divs) => divs.every((d) => d.id && (d.teams || []).every((t) => t.id));
const ids = (arr) => arr.map((x) => x.id).join('|');

/** So sánh 2 snapshot {title, divisions} -> danh sách op nhỏ nhất có thể. */
export function diffLineup(prev, next) {
  const ops = [];
  if (prev.title !== next.title) ops.push({ t: 'title', v: next.title });

  const pd = prev.divisions;
  const nd = next.divisions;
  if (!hasAllIds(nd) || !hasAllIds(pd) || ids(pd) !== ids(nd)) {
    if (J(pd.map(stripUi)) !== J(nd.map(stripUi))) ops.push({ t: 'divisions', v: nd.map(stripUi) });
    return ops;
  }

  nd.forEach((d, i) => {
    const p = pd[i];
    const { teams: nTeams, ...nRest } = stripUi(d);
    const { teams: pTeams, ...pRest } = stripUi(p);
    if (J(nRest) !== J(pRest)) ops.push({ t: 'div', div: d.id, v: nRest });

    if (ids(pTeams || []) !== ids(nTeams || [])) {
      if (J(pTeams) !== J(nTeams)) ops.push({ t: 'teams', div: d.id, v: nTeams });
      return;
    }
    (nTeams || []).forEach((t, ti) => {
      const pt = pTeams[ti];
      const { slots: nSlots, ...tRest } = t;
      const { slots: pSlots, ...ptRest } = pt;
      if ((nSlots || []).length !== (pSlots || []).length) {
        ops.push({ t: 'teams', div: d.id, v: nTeams });
        return;
      }
      if (J(tRest) !== J(ptRest)) ops.push({ t: 'team', div: d.id, team: t.id, v: tRest });
      (nSlots || []).forEach((s, si) => {
        if (J(s) !== J(pSlots[si])) ops.push({ t: 'slot', div: d.id, team: t.id, si, v: s });
      });
    });
  });
  return ops;
}

/** Áp dụng 1 op lên doc {title, divisions}. Trả về true nếu thành công. */
export function applyOp(doc, op) {
  const divs = doc.divisions;
  switch (op.t) {
    case 'title':
      doc.title = op.v;
      return true;
    case 'divisions': {
      const collapsed = new Map(divs.map((d) => [d.id, d.isCollapsed]));
      doc.divisions = clone(op.v).map((d) => ({ ...d, isCollapsed: collapsed.get(d.id) ?? false }));
      return true;
    }
    case 'div': {
      const d = divs.find((x) => x.id === op.div);
      if (!d) return false;
      Object.keys(d).forEach((k) => { if (k !== 'teams' && k !== 'isCollapsed' && k !== 'id') delete d[k]; });
      Object.assign(d, clone(op.v));
      return true;
    }
    case 'teams': {
      const d = divs.find((x) => x.id === op.div);
      if (!d) return false;
      d.teams = clone(op.v);
      return true;
    }
    case 'team': {
      const d = divs.find((x) => x.id === op.div);
      const t = d && d.teams.find((x) => x.id === op.team);
      if (!t) return false;
      Object.keys(t).forEach((k) => { if (k !== 'slots' && k !== 'id') delete t[k]; });
      Object.assign(t, clone(op.v));
      return true;
    }
    case 'slot': {
      const d = divs.find((x) => x.id === op.div);
      const t = d && d.teams.find((x) => x.id === op.team);
      if (!t || !t.slots || op.si >= t.slots.length) return false;
      t.slots[op.si] = clone(op.v);
      return true;
    }
    default:
      return false;
  }
}
