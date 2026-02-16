const DATA_FILES = [
  { name: 'Bid Optimization Agent', file: 'deep_dive_synthetic_data/bid_optimization_agent_metrics.csv' },
  { name: 'Budget Pacing Agent', file: 'deep_dive_synthetic_data/budget_pacing_agent_metrics.csv' },
  { name: 'Creative Intelligence Agent', file: 'deep_dive_synthetic_data/creative_intelligence_agent_metrics.csv' },
  { name: 'Audience Discovery Agent', file: 'deep_dive_synthetic_data/audience_discovery_agent_metrics.csv' },
  { name: 'Inventory Quality Agent', file: 'deep_dive_synthetic_data/inventory_quality_agent_metrics.csv' },
];

function parseCsv(text) {
  const [header, ...lines] = text.trim().split('\n');
  const columns = header.split(',');
  return lines.map((line) => {
    const values = line.split(',');
    return Object.fromEntries(columns.map((key, i) => [key, values[i]]));
  });
}

function sum(rows, field) {
  return rows.reduce((acc, row) => acc + Number(row[field] || 0), 0);
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

async function loadAllData() {
  const entries = await Promise.all(
    DATA_FILES.map(async (dataFile) => {
      const response = await fetch(`../${dataFile.file}`);
      const text = await response.text();
      return [dataFile.name, parseCsv(text)];
    })
  );
  return Object.fromEntries(entries);
}

function buildSummaryCards(dataset) {
  const container = document.getElementById('summary-grid');
  container.innerHTML = '';

  Object.entries(dataset).forEach(([agent, rows]) => {
    const spend = sum(rows, 'spend');
    const revenue = sum(rows, 'revenue');
    const orders = sum(rows, 'orders');
    const roas = spend ? (revenue / spend).toFixed(2) : '0.00';

    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <h3>${agent}</h3>
      <div class="metric">ROAS ${roas}x</div>
      <div class="sub">Spend ${formatCurrency(spend)} · Revenue ${formatCurrency(revenue)}</div>
      <div class="sub">Orders ${orders.toLocaleString()}</div>
    `;
    container.appendChild(card);
  });
}

function buildSignalBreakdown(dataset) {
  const signalCounts = {};
  Object.values(dataset).flat().forEach((row) => {
    signalCounts[row.insight_signal] = (signalCounts[row.insight_signal] || 0) + 1;
  });

  const container = document.getElementById('signal-breakdown');
  container.innerHTML = '';

  Object.entries(signalCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([signal, count]) => {
      const chip = document.createElement('span');
      chip.className = `chip signal-${signal}`;
      chip.textContent = `${signal}: ${count}`;
      container.appendChild(chip);
    });
}

function buildTopActions(dataset) {
  const actionCounts = {};
  Object.values(dataset).flat().forEach((row) => {
    actionCounts[row.recommended_action] = (actionCounts[row.recommended_action] || 0) + 1;
  });

  const list = document.getElementById('action-list');
  list.innerHTML = '';

  Object.entries(actionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .forEach(([action, count]) => {
      const li = document.createElement('li');
      li.textContent = `${action} (${count} rows)`;
      list.appendChild(li);
    });
}

function renderAgentTable(agentName, dataset) {
  const rows = dataset[agentName] || [];
  const tbody = document.getElementById('agent-table-body');
  tbody.innerHTML = '';

  rows.forEach((row) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.date}</td>
      <td>${row.campaign_id}</td>
      <td>${Number(row.spend || 0).toFixed(1)}</td>
      <td>${Number(row.revenue || 0).toFixed(1)}</td>
      <td>${row.orders || '-'}</td>
      <td>${Number(row.roas || 0).toFixed(2)}</td>
      <td>${row.insight_signal}</td>
      <td>${row.recommended_action}</td>
    `;
    tbody.appendChild(tr);
  });
}

function initAgentSelector(dataset) {
  const select = document.getElementById('agent-select');
  select.innerHTML = '';

  Object.keys(dataset).forEach((agentName) => {
    const option = document.createElement('option');
    option.value = agentName;
    option.textContent = agentName;
    select.appendChild(option);
  });

  renderAgentTable(select.value, dataset);
  select.addEventListener('change', () => renderAgentTable(select.value, dataset));
}

(async function init() {
  const dataset = await loadAllData();
  buildSummaryCards(dataset);
  buildSignalBreakdown(dataset);
  buildTopActions(dataset);
  initAgentSelector(dataset);
})();
