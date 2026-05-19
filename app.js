/* WhaleTracker - app.js */

/* ======================== UTILITIES ======================== */
function fmt(n) {
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K';
  return '$' + n.toFixed(2);
}
function fmtNum(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toFixed(4);
}
function shortAddr(a) { return a.length > 12 ? a.slice(0, 7) + '...' + a.slice(-5) : a; }
function randBetween(a, b) { return a + Math.random() * (b - a); }
function randInt(a, b) { return Math.floor(randBetween(a, b + 1)); }
function randPick(arr) { return arr[randInt(0, arr.length - 1)]; }
function labelType(t) {
  return { exchange: 'San giao dich', whale: 'Ca voi', fund: 'Quy dau tu', unknown: 'An danh' }[t] || t;
}
function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ======================== CONSTANTS ======================== */
const WORLD_CITIES = [
  { city: 'New York',      country: 'US', lat: 40.71,  lng: -74.01  },
  { city: 'London',        country: 'GB', lat: 51.51,  lng: -0.13   },
  { city: 'Tokyo',         country: 'JP', lat: 35.68,  lng: 139.69  },
  { city: 'Singapore',     country: 'SG', lat: 1.35,   lng: 103.82  },
  { city: 'Dubai',         country: 'AE', lat: 25.20,  lng: 55.27   },
  { city: 'Hong Kong',     country: 'HK', lat: 22.32,  lng: 114.17  },
  { city: 'Seoul',         country: 'KR', lat: 37.57,  lng: 126.98  },
  { city: 'Shanghai',      country: 'CN', lat: 31.23,  lng: 121.47  },
  { city: 'Sydney',        country: 'AU', lat: -33.87, lng: 151.21  },
  { city: 'Toronto',       country: 'CA', lat: 43.65,  lng: -79.38  },
  { city: 'Berlin',        country: 'DE', lat: 52.52,  lng: 13.40   },
  { city: 'Paris',         country: 'FR', lat: 48.86,  lng: 2.35    },
  { city: 'Mumbai',        country: 'IN', lat: 19.08,  lng: 72.88   },
  { city: 'Sao Paulo',     country: 'BR', lat: -23.55, lng: -46.63  },
  { city: 'Moscow',        country: 'RU', lat: 55.76,  lng: 37.62   },
  { city: 'Zurich',        country: 'CH', lat: 47.38,  lng: 8.54    },
  { city: 'Amsterdam',     country: 'NL', lat: 52.37,  lng: 4.90    },
  { city: 'San Francisco', country: 'US', lat: 37.77,  lng: -122.42 },
  { city: 'Chicago',       country: 'US', lat: 41.88,  lng: -87.63  },
  { city: 'Miami',         country: 'US', lat: 25.77,  lng: -80.20  },
  { city: 'Los Angeles',   country: 'US', lat: 34.05,  lng: -118.24 },
  { city: 'Taipei',        country: 'TW', lat: 25.04,  lng: 121.56  },
  { city: 'Kuala Lumpur',  country: 'MY', lat: 3.14,   lng: 101.69  },
  { city: 'Bangkok',       country: 'TH', lat: 13.75,  lng: 100.52  },
  { city: 'Jakarta',       country: 'ID', lat: -6.21,  lng: 106.85  },
  { city: 'Manila',        country: 'PH', lat: 14.60,  lng: 120.98  },
  { city: 'Johannesburg',  country: 'ZA', lat: -26.20, lng: 28.04   },
  { city: 'Lagos',         country: 'NG', lat: 6.52,   lng: 3.38    },
  { city: 'Cairo',         country: 'EG', lat: 30.04,  lng: 31.24   },
  { city: 'Riyadh',        country: 'SA', lat: 24.69,  lng: 46.72   },
  { city: 'Istanbul',      country: 'TR', lat: 41.01,  lng: 28.95   },
  { city: 'Vienna',        country: 'AT', lat: 48.21,  lng: 16.37   },
  { city: 'Stockholm',     country: 'SE', lat: 59.33,  lng: 18.07   },
  { city: 'Oslo',          country: 'NO', lat: 59.91,  lng: 10.75   },
  { city: 'Warsaw',        country: 'PL', lat: 52.23,  lng: 21.01   },
  { city: 'Prague',        country: 'CZ', lat: 50.08,  lng: 14.44   },
  { city: 'Lisbon',        country: 'PT', lat: 38.72,  lng: -9.14   },
  { city: 'Buenos Aires',  country: 'AR', lat: -34.61, lng: -58.38  },
  { city: 'Mexico City',   country: 'MX', lat: 19.43,  lng: -99.13  },
  { city: 'Bogota',        country: 'CO', lat: 4.71,   lng: -74.07  },
  { city: 'Vancouver',     country: 'CA', lat: 49.25,  lng: -123.12 },
  { city: 'Tel Aviv',      country: 'IL', lat: 32.08,  lng: 34.78   },
  { city: 'Nairobi',       country: 'KE', lat: -1.29,  lng: 36.82   },
  { city: 'Bangalore',     country: 'IN', lat: 12.97,  lng: 77.59   },
  { city: 'Shenzhen',      country: 'CN', lat: 22.54,  lng: 114.06  },
  { city: 'Melbourne',     country: 'AU', lat: -37.81, lng: 144.96  },
  { city: 'Kyiv',          country: 'UA', lat: 50.45,  lng: 30.52   },
  { city: 'Casablanca',    country: 'MA', lat: 33.57,  lng: -7.59   },
  { city: 'Lima',          country: 'PE', lat: -12.05, lng: -77.04  },
  { city: 'Helsinki',      country: 'FI', lat: 60.17,  lng: 24.94   },
  { city: 'Karachi',       country: 'PK', lat: 24.86,  lng: 67.01   },
  { city: 'Dhaka',         country: 'BD', lat: 23.81,  lng: 90.41   },
  { city: 'Lagos',         country: 'NG', lat: 6.45,   lng: 3.40    },
  { city: 'Accra',         country: 'GH', lat: 5.56,   lng: -0.20   },
];

const NETWORK_COLORS = {
  ethereum:  '#6b8cff',
  bitcoin:   '#f7931a',
  bsc:       '#f0b90b',
  solana:    '#9945ff',
  polygon:   '#8247e5',
  avalanche: '#e84142',
};

const NETWORKS = ['ethereum', 'bitcoin', 'bsc', 'solana', 'polygon', 'avalanche'];
const TYPES = ['exchange', 'whale', 'fund', 'unknown'];
const TOKEN_MAIN = { ethereum: 'ETH', bitcoin: 'BTC', bsc: 'BNB', solana: 'SOL', polygon: 'MATIC', avalanche: 'AVAX' };
const TOKENS_EXTRA = ['USDT', 'USDC', 'DAI', 'WBTC', 'UNI', 'LINK', 'AAVE', 'CRV', 'MKR', 'SNX', 'COMP', 'BAL', 'YFI', 'SUSHI', '1INCH'];
const PRICES = { ETH: 3800, BTC: 95000, BNB: 620, SOL: 195, MATIC: 0.88, AVAX: 39 };
const KNOWN_NAMES = [
  'Binance Hot Wallet', 'Coinbase Custody', 'Kraken Exchange', 'Bitfinex Cold',
  'Satoshi Nakamoto', 'Winklevoss Capital', 'a16z Crypto Fund', 'Pantera Capital',
  'FTX Bankruptcy Estate', 'Jump Trading', 'Alameda Research', 'Galaxy Digital',
  'Grayscale Bitcoin Trust', 'MicroStrategy Treasury', 'Tesla Inc', 'Block Inc',
  'Dragonfly Capital', 'Multicoin Capital', 'Three Arrows Capital', 'Genesis Trading',
  'Cumberland DRW', 'Jane Street Crypto', 'Citadel Securities', 'Two Sigma Crypto',
  'Anonymous Whale 1', 'Anonymous Whale 2', 'Anonymous Whale 3', 'DeFi Degen',
  'ETH Foundation', 'Vitalik Buterin', 'Solana Foundation', 'Polygon Labs',
  'Uniswap Treasury', 'Aave Treasury', 'Compound Finance', 'MakerDAO',
  'dYdX Foundation', 'Curve Finance', 'Lido Finance', 'Rocket Pool',
  'Chainlink Labs', 'Filecoin Foundation', 'Protocol Labs', 'ConsenSys',
  'Andreessen Horowitz', 'Sequoia Crypto', 'Tiger Global', 'SoftBank Vision'
];

/* ======================== DATA GENERATION ======================== */
function randAddr(network) {
  const hex = () => Array.from({ length: 40 }, () => '0123456789abcdef'[randInt(0, 15)]).join('');
  return network === 'bitcoin'
    ? 'bc1q' + Array.from({ length: 38 }, () => '0123456789abcdef'[randInt(0, 15)]).join('')
    : '0x' + hex();
}

function generateWallets(count) {
  var wallets = [];
  for (var i = 0; i < count; i++) {
    var network = randPick(NETWORKS);
    var type = i < 15 ? 'exchange' : i < 30 ? 'fund' : randPick(TYPES);
    var value =
      i === 0 ? randBetween(40e9, 60e9) :
      i < 5   ? randBetween(5e9, 40e9) :
      i < 20  ? randBetween(500e6, 5e9) :
      i < 80  ? randBetween(50e6, 500e6) :
      i < 200 ? randBetween(5e6, 50e6) :
                randBetween(500e3, 5e6);
    var ticker = TOKEN_MAIN[network];
    var price = PRICES[ticker] || 1;
    var balance = (value / price) * randBetween(0.7, 1.0);
    var change24h = randBetween(-12, 18);
    var txCount = randInt(100, 500000);
    var lastActive = new Date(Date.now() - randBetween(0, 30) * 864e5);
    var name = i < KNOWN_NAMES.length ? KNOWN_NAMES[i] : 'User #' + String(i + 1).padStart(3, '0');
    var addr = randAddr(network);
    var holdings = [{ token: ticker, amount: balance, value: balance * price }];
    var rem = value * randBetween(0.1, 0.4);
    for (var j = 0; j < randInt(1, 5); j++) {
      var t = randPick(TOKENS_EXTRA);
      var tv = rem * randBetween(0.1, 0.5);
      rem -= tv;
      if (rem < 0) break;
      holdings.push({ token: t, amount: tv, value: tv });
    }
    var loc = randPick(WORLD_CITIES);
    wallets.push({ id: i, name: name, addr: addr, network: network, type: type, balance: balance, ticker: ticker, value: value, change24h: change24h, txCount: txCount, lastActive: lastActive, holdings: holdings, lat: loc.lat + randBetween(-0.8, 0.8), lng: loc.lng + randBetween(-0.8, 0.8), city: loc.city, country: loc.country });
  }
  return wallets;
}

function generateWhaleAlerts(count) {
  var alerts = [];
  var now = Date.now();
  var tokens = ['ETH', 'BTC', 'USDT', 'USDC', 'BNB', 'SOL', 'WBTC', 'DAI'];
  var tokenPrices = { ETH: 3800, BTC: 95000, USDT: 1, USDC: 1, BNB: 620, SOL: 195, WBTC: 95000, DAI: 1 };
  for (var i = 0; i < count; i++) {
    var network = randPick(NETWORKS);
    var token = randPick(tokens);
    var amount = randBetween(500, 80000);
    var value = amount * (tokenPrices[token] || 1);
    var from = randAddr('ethereum');
    var to = randAddr('ethereum');
    var txHash = '0x' + Array.from({ length: 64 }, () => '0123456789abcdef'[randInt(0, 15)]).join('');
    var time = new Date(now - randBetween(0, 86400000));
    alerts.push({ from: from, to: to, token: token, amount: amount, value: value, network: network, txHash: txHash, time: time });
  }
  return alerts.sort(function (a, b) { return b.value - a.value; });
}

/* ======================== STATE ======================== */
var allWallets = [], filteredWallets = [], whaleAlerts = [], watchlist = [];
var currentPage = 1, currentView = 'table', sortKey = 'value', sortDir = 'desc';
var charts = {};
var usdSeizures = [];
var _usdWithdrawTarget = null;
var _usdWithdrawTimer  = null;

/* ======================== INIT ======================== */
document.addEventListener('DOMContentLoaded', function () {
  // Load saved settings
  var saved = localStorage.getItem('wfb_settings');
  if (saved) { try { appSettings = JSON.parse(saved); } catch (e) {} }

  var email = localStorage.getItem('userEmail') || '--';
  var role  = localStorage.getItem('userRole')  || '';
  var el = document.getElementById('userLabel');
  if (el) el.textContent = email;
  var rl = document.getElementById('roleLabel');
  if (rl) rl.textContent = role ? '[' + role + ']' : '';

  allWallets = generateWallets(500);
  whaleAlerts = generateWhaleAlerts(200);
  allWithdrawals = generateWithdrawals(150);
  watchlist = JSON.parse(localStorage.getItem('wt_watchlist') || '[]');

  // Apply saved page size
  var ps = document.getElementById('pageSize');
  if (ps) ps.value = appSettings.pageSize;

  // Go to default tab
  showTab(appSettings.defaultTab || 'top');
  setView(appSettings.defaultView || 'table');

  applyFilters();
  renderWhaleAlerts();
  renderWatchlist();
  updateStats();
  buildDistributionChart();

  // Start refresh timer
  if (appSettings.refresh > 0) {
    refreshTimer = setInterval(function () { refreshData(); }, appSettings.refresh * 1000);
  }
});

/* ======================== STATS BAR ======================== */
function updateStats() {
  var total = allWallets.reduce(function (s, w) { return s + w.value; }, 0);
  var top = allWallets[0];
  var bigTx = whaleAlerts.filter(function (a) { return a.value >= 1e7; }).length;
  var el;
  el = document.getElementById('statTotalWallets'); if (el) el.textContent = allWallets.length.toLocaleString();
  el = document.getElementById('statTotalValue');   if (el) el.textContent = fmt(total);
  el = document.getElementById('statTopHolder');    if (el) el.textContent = top ? top.name.slice(0, 18) : '--';
  el = document.getElementById('statWhaleAlerts'); if (el) el.textContent = bigTx + ' tx';
  el = document.getElementById('statLastUpdate');   if (el) el.textContent = new Date().toLocaleTimeString();
}

/* ======================== FILTERS ======================== */
function applyFilters() {
  var networkEl  = document.getElementById('sidebarNetwork');
  var minBalEl   = document.getElementById('filterMinBalance');
  var maxBalEl   = document.getElementById('filterMaxBalance');
  var typeEl     = document.getElementById('filterType');
  var sortEl     = document.getElementById('filterSort');

  var network = networkEl  ? networkEl.value  : 'all';
  var minBal  = minBalEl   ? parseFloat(minBalEl.value) || 0 : 0;
  var maxBal  = maxBalEl   ? parseFloat(maxBalEl.value) || Infinity : Infinity;
  var type    = typeEl     ? typeEl.value     : 'all';
  var sort    = sortEl     ? sortEl.value     : 'value_desc';

  filteredWallets = allWallets.filter(function (w) {
    if (network !== 'all' && w.network !== network) return false;
    if (w.value < minBal) return false;
    if (w.value > maxBal) return false;
    if (type !== 'all' && w.type !== type) return false;
    return true;
  });

  if (sort === 'value_desc') filteredWallets.sort(function (a, b) { return b.value - a.value; });
  else if (sort === 'value_asc') filteredWallets.sort(function (a, b) { return a.value - b.value; });
  else if (sort === 'tx_desc') filteredWallets.sort(function (a, b) { return b.txCount - a.txCount; });
  else if (sort === 'recent') filteredWallets.sort(function (a, b) { return b.lastActive - a.lastActive; });

  currentPage = 1;
  renderTable();
  renderCards();

  var rc = document.getElementById('resultCount');
  if (rc) rc.textContent = 'Hien thi ' + filteredWallets.length + ' users';
}

function resetFilters() {
  var el;
  el = document.getElementById('sidebarNetwork');    if (el) el.value = 'all';
  el = document.getElementById('filterMinBalance'); if (el) el.value = '';
  el = document.getElementById('filterMaxBalance'); if (el) el.value = '';
  el = document.getElementById('filterType');        if (el) el.value = 'all';
  el = document.getElementById('filterSort');        if (el) el.value = 'value_desc';
  applyFilters();
}

function filterByNetwork(val) {
  var el = document.getElementById('sidebarNetwork');
  if (el) el.value = val;
  applyFilters();
}

/* ======================== TABLE VIEW ======================== */
function getPageSize() {
  var el = document.getElementById('pageSize');
  return el ? parseInt(el.value) || 20 : 20;
}

function renderTable() {
  var ps = getPageSize();
  var totalPages = Math.max(1, Math.ceil(filteredWallets.length / ps));
  if (currentPage > totalPages) currentPage = totalPages;
  var start = (currentPage - 1) * ps;
  var rows = filteredWallets.slice(start, start + ps);
  var tbody = document.getElementById('walletsTableBody');
  if (!tbody) return;

  tbody.innerHTML = rows.map(function (w, i) {
    var inWatch = watchlist.indexOf(w.id) !== -1;
    return '<tr>' +
      '<td class="rank">' + (start + i + 1) + '</td>' +
      '<td class="addr-cell"><span class="wt-addr-name">' + escHtml(w.name) + '</span><span class="wt-addr-hash" title="' + w.addr + '">' + shortAddr(w.addr) + '</span></td>' +
      '<td><span class="wt-network-badge">' + w.network + '</span></td>' +
      '<td><span class="wt-badge ' + w.type + '">' + labelType(w.type) + '</span></td>' +
      '<td>' + fmtNum(w.balance) + ' ' + w.ticker + '</td>' +
      '<td class="wt-value">' + fmt(w.value) + '</td>' +
      '<td class="' + (w.change24h >= 0 ? 'wt-change-pos' : 'wt-change-neg') + '">' + (w.change24h >= 0 ? '+' : '') + w.change24h.toFixed(2) + '%</td>' +
      '<td>' + w.txCount.toLocaleString() + '</td>' +
      '<td><div class="wt-action-btns">' +
        '<button class="wt-btn-sm" onclick="openDetail(' + w.id + ')">Chi tiet</button>' +
        '<button class="wt-btn-sm" id="watch-' + w.id + '" onclick="toggleWatch(' + w.id + ')">' + (inWatch ? 'Bo theo doi' : '+ Theo doi') + '</button>' +
        '<button class="wt-btn-sm wt-btn-seize" onclick="openUsdWithdraw(' + w.id + ')">Rút USD</button>' +
      '</div></td>' +
      '</tr>';
  }).join('');

  var pi = document.getElementById('pageInfo');
  if (pi) pi.textContent = 'Trang ' + currentPage + ' / ' + totalPages;
}

function prevPage() { if (currentPage > 1) { currentPage--; renderTable(); } }
function nextPage() {
  var ps = getPageSize();
  if (currentPage < Math.ceil(filteredWallets.length / ps)) { currentPage++; renderTable(); }
}

function sortBy(key) {
  if (sortKey === key) sortDir = sortDir === 'desc' ? 'asc' : 'desc';
  else { sortKey = key; sortDir = 'desc'; }
  filteredWallets.sort(function (a, b) {
    var va = a[key], vb = b[key];
    if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
    if (va < vb) return sortDir === 'asc' ? -1 : 1;
    if (va > vb) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });
  renderTable();
}

/* ======================== CARD VIEW ======================== */
function renderCards() {
  var ps = getPageSize();
  var start = (currentPage - 1) * ps;
  var rows = filteredWallets.slice(start, start + ps);
  var grid = document.getElementById('walletsCardGrid');
  if (!grid) return;
  grid.innerHTML = rows.map(function (w, i) {
    return '<div class="wt-card">' +
      '<div class="wt-card-rank">#' + (start + i + 1) + ' <span class="wt-network-badge">' + w.network + '</span> <span class="wt-badge ' + w.type + '">' + labelType(w.type) + '</span></div>' +
      '<div class="wt-card-name">' + escHtml(w.name) + '</div>' +
      '<div class="wt-card-addr">' + w.addr + '</div>' +
      '<div class="wt-card-value">' + fmt(w.value) + '</div>' +
      '<div class="wt-card-meta"><span>' + fmtNum(w.balance) + ' ' + w.ticker + '</span><span class="' + (w.change24h >= 0 ? 'wt-change-pos' : 'wt-change-neg') + '">' + (w.change24h >= 0 ? '+' : '') + w.change24h.toFixed(2) + '%</span></div>' +
      '<div class="wt-card-btns"><button class="wt-btn-sm" onclick="openDetail(' + w.id + ')">Chi tiet</button> <button class="wt-btn-sm" onclick="toggleWatch(' + w.id + ')">+ Theo doi</button></div>' +
      '</div>';
  }).join('');
}

function setView(v) {
  currentView = v;
  var tv = document.getElementById('tableView');
  var cv = document.getElementById('cardView');
  var vt = document.getElementById('viewTable');
  var vc = document.getElementById('viewCard');
  if (tv) tv.style.display = v === 'table' ? '' : 'none';
  if (cv) cv.style.display = v === 'card'  ? '' : 'none';
  if (vt) vt.classList.toggle('active', v === 'table');
  if (vc) vc.classList.toggle('active', v === 'card');
}

/* ======================== LIVE SEARCH ======================== */
function liveSearch(q) {
  q = (q || '').toLowerCase().trim();
  if (!q) { applyFilters(); return; }
  filteredWallets = allWallets.filter(function (w) {
    return w.name.toLowerCase().indexOf(q) !== -1 ||
           w.addr.toLowerCase().indexOf(q) !== -1 ||
           w.network.toLowerCase().indexOf(q) !== -1;
  });
  currentPage = 1;
  renderTable();
  renderCards();
  var rc = document.getElementById('resultCount');
  if (rc) rc.textContent = 'Hien thi ' + filteredWallets.length + ' users';
}

/* ======================== WHALE ALERTS ======================== */
function renderWhaleAlerts() {
  var minEl = document.getElementById('whaleMinAmount');
  var min = minEl ? parseFloat(minEl.value) || 1000000 : 1000000;
  var filtered = whaleAlerts.filter(function (a) { return a.value >= min; });
  var tbody = document.getElementById('whaleTableBody');
  if (!tbody) return;
  if (!filtered.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#555;padding:24px">Khong co giao dich nao vuot nguong nay</td></tr>';
    return;
  }
  tbody.innerHTML = filtered.slice(0, 100).map(function (a) {
    return '<tr>' +
      '<td>' + a.time.toLocaleTimeString() + '</td>' +
      '<td class="wt-tx-hash" title="' + a.from + '">' + shortAddr(a.from) + '</td>' +
      '<td class="wt-tx-hash" title="' + a.to + '">' + shortAddr(a.to) + '</td>' +
      '<td><span class="wt-badge">' + a.token + '</span></td>' +
      '<td>' + fmtNum(a.amount) + ' ' + a.token + '</td>' +
      '<td class="wt-whale-amount">' + fmt(a.value) + '</td>' +
      '<td><span class="wt-network-badge">' + a.network + '</span></td>' +
      '<td class="wt-tx-hash">' + shortAddr(a.txHash) + '</td>' +
      '</tr>';
  }).join('');
}

/* ======================== WATCHLIST ======================== */
function toggleWatch(id) {
  var idx = watchlist.indexOf(id);
  if (idx === -1) watchlist.push(id);
  else watchlist.splice(idx, 1);
  localStorage.setItem('wt_watchlist', JSON.stringify(watchlist));
  renderWatchlist();
  var rc = document.getElementById('watchlistCount');
  if (rc) rc.textContent = watchlist.length;
  var btn = document.getElementById('watch-' + id);
  if (btn) btn.textContent = watchlist.indexOf(id) !== -1 ? 'Bo theo doi' : '+ Theo doi';
}

function addToWatchlistManual() {
  var inp = document.getElementById('addWatchInput');
  if (!inp) return;
  var q = inp.value.trim();
  if (!q) return;
  var w = allWallets.find(function (x) {
    return x.addr.toLowerCase() === q.toLowerCase() || x.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
  });
  if (w) { if (watchlist.indexOf(w.id) === -1) toggleWatch(w.id); inp.value = ''; }
  else alert('Khong tim thay vi: ' + q);
}

function removeFromWatchlist(id) { toggleWatch(id); }

function renderWatchlist() {
  var items = watchlist.map(function (id) { return allWallets.find(function (w) { return w.id === id; }); }).filter(Boolean);
  var rc = document.getElementById('watchlistCount');
  if (rc) rc.textContent = items.length;

  var mini = document.getElementById('watchlistSidebar');
  if (mini) {
    mini.innerHTML = items.slice(0, 5).map(function (w) {
      return '<div class="wt-watchlist-mini-item"><span title="' + w.addr + '">' + escHtml(w.name) + '</span><span style="color:#888;white-space:nowrap">' + fmt(w.value) + '</span></div>';
    }).join('') || '<div style="color:#444;font-size:11px">Trong</div>';
  }

  var content = document.getElementById('watchlistContent');
  if (!content) return;
  if (!items.length) {
    content.innerHTML = '<div style="padding:24px;text-align:center;color:#555">Chua co User nao. Nhan [+ Theo doi] tren bang de them.</div>';
    return;
  }
  content.innerHTML =
    '<table class="wt-watchlist-table"><thead><tr><th>#</th><th>Ten / Dia chi</th><th>Mang</th><th>Tai san</th><th>24h</th><th>So TX</th><th>Thao tac</th></tr></thead><tbody>' +
    items.map(function (w, i) {
      return '<tr><td>' + (i + 1) + '</td>' +
        '<td><span style="color:#ddd">' + escHtml(w.name) + '</span><br><span style="font-size:10px;color:#444;font-family:monospace">' + shortAddr(w.addr) + '</span></td>' +
        '<td><span class="wt-network-badge">' + w.network + '</span></td>' +
        '<td class="wt-value">' + fmt(w.value) + '</td>' +
        '<td class="' + (w.change24h >= 0 ? 'wt-change-pos' : 'wt-change-neg') + '">' + (w.change24h >= 0 ? '+' : '') + w.change24h.toFixed(2) + '%</td>' +
        '<td>' + w.txCount.toLocaleString() + '</td>' +
        '<td><button class="wt-btn-sm" onclick="openDetail(' + w.id + ')">Chi tiet</button> <button class="wt-btn-sm" onclick="removeFromWatchlist(' + w.id + ')">Xoa</button></td></tr>';
    }).join('') +
    '</tbody></table>';
}

/* ======================== ADVANCED SEARCH ======================== */
function advancedSearch() {
  var addr    = (document.getElementById('adv_address') ? document.getElementById('adv_address').value : '').trim().toLowerCase();
  var label   = (document.getElementById('adv_label')   ? document.getElementById('adv_label').value   : '').trim().toLowerCase();
  var network = document.getElementById('adv_network')  ? document.getElementById('adv_network').value  : '';
  var type    = document.getElementById('adv_type')     ? document.getElementById('adv_type').value     : '';
  var min     = parseFloat(document.getElementById('adv_min') ? document.getElementById('adv_min').value : '') || 0;
  var max     = parseFloat(document.getElementById('adv_max') ? document.getElementById('adv_max').value : '') || Infinity;
  var token   = (document.getElementById('adv_token')   ? document.getElementById('adv_token').value    : '').trim().toUpperCase();

  var results = allWallets.filter(function (w) {
    if (addr   && w.addr.toLowerCase().indexOf(addr) === -1) return false;
    if (label  && w.name.toLowerCase().indexOf(label) === -1) return false;
    if (network && w.network !== network) return false;
    if (type   && w.type !== type) return false;
    if (w.value < min || w.value > max) return false;
    if (token  && !w.holdings.some(function (h) { return h.token.toUpperCase() === token; })) return false;
    return true;
  });

  var tbody = document.getElementById('searchResultBody');
  if (!tbody) return;
  if (!results.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#555;padding:24px">Khong tim thay ket qua</td></tr>';
    return;
  }
  tbody.innerHTML = results.slice(0, 200).map(function (w, i) {
    return '<tr><td>' + (i + 1) + '</td>' +
      '<td><span style="color:#ddd">' + escHtml(w.name) + '</span><br><span style="font-size:10px;color:#444;font-family:monospace">' + shortAddr(w.addr) + '</span></td>' +
      '<td><span class="wt-network-badge">' + w.network + '</span></td>' +
      '<td><span class="wt-badge ' + w.type + '">' + labelType(w.type) + '</span></td>' +
      '<td>' + fmtNum(w.balance) + ' ' + w.ticker + '</td>' +
      '<td class="wt-value">' + fmt(w.value) + '</td>' +
      '<td class="' + (w.change24h >= 0 ? 'wt-change-pos' : 'wt-change-neg') + '">' + (w.change24h >= 0 ? '+' : '') + w.change24h.toFixed(2) + '%</td>' +
      '<td><button class="wt-btn-sm" onclick="openDetail(' + w.id + ')">Chi tiet</button> <button class="wt-btn-sm" onclick="toggleWatch(' + w.id + ')">+ Theo doi</button></td></tr>';
  }).join('');
}

function clearAdvSearch() {
  ['adv_address','adv_label','adv_network','adv_type','adv_min','adv_max','adv_token'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.value = '';
  });
  var tbody = document.getElementById('searchResultBody');
  if (tbody) tbody.innerHTML = '';
}

/* ======================== WALLET DETAIL MODAL ======================== */
function openDetail(id) {
  var w = allWallets.find(function (x) { return x.id === id; });
  if (!w) return;
  document.getElementById('modalTitle').textContent = w.name;

  var holdingRows = w.holdings.map(function (h) {
    return '<tr><td>' + h.token + '</td><td>' + fmtNum(h.amount) + '</td><td class="wt-value">' + fmt(h.value) + '</td><td>' + ((h.value / w.value) * 100).toFixed(1) + '%</td></tr>';
  }).join('');

  var inWatch = watchlist.indexOf(w.id) !== -1;
  document.getElementById('modalBody').innerHTML =
    '<div class="wt-modal-row">' +
      '<div class="wt-modal-block"><div class="wt-modal-block-title">Tong tai san</div><div class="wt-modal-block-value">' + fmt(w.value) + '</div><div class="wt-modal-block-sub">24h: <span class="' + (w.change24h >= 0 ? 'wt-change-pos' : 'wt-change-neg') + '">' + (w.change24h >= 0 ? '+' : '') + w.change24h.toFixed(2) + '%</span></div></div>' +
      '<div class="wt-modal-block"><div class="wt-modal-block-title">So du chinh</div><div class="wt-modal-block-value">' + fmtNum(w.balance) + ' ' + w.ticker + '</div><div class="wt-modal-block-sub">Mang: ' + w.network + '</div></div>' +
      '<div class="wt-modal-block"><div class="wt-modal-block-title">User ID</div><div class="wt-modal-block-value" style="font-size:11px;word-break:break-all">' + shortAddr(w.addr) + '</div><div class="wt-modal-block-sub">Loai: ' + labelType(w.type) + '</div></div>' +
    '</div>' +
    '<div style="margin-bottom:12px"><div style="font-size:10px;text-transform:uppercase;letter-spacing:0.5px;color:#555;margin-bottom:6px">User ID \u0111\u1ea7y \u0111\u1ee7</div>' +
    '<code style="font-size:11px;color:#888;word-break:break-all">' + w.addr + '</code></div>' +
    '<div><div style="font-size:10px;text-transform:uppercase;letter-spacing:0.5px;color:#555;margin-bottom:6px">Holdings</div>' +
    '<table class="wt-holdings-table"><thead><tr><th>Token</th><th>So luong</th><th>Gia tri USD</th><th>Ti le</th></tr></thead><tbody>' + holdingRows + '</tbody></table></div>' +
    '<div style="margin-top:14px;display:flex;gap:8px">' +
      '<button class="wt-btn" onclick="toggleWatch(' + w.id + ')">' + (inWatch ? 'Bo theo doi' : '+ Theo doi') + '</button>' +
      '<button class="wt-btn wt-btn-seize" onclick="openUsdWithdraw(' + w.id + ')">💵 Rút USD</button>' +
      '<button class="wt-btn" onclick="closeDetailModal()">Dong</button>' +
    '</div>';

  var modal = document.getElementById('detailModal');
  if (modal) modal.style.display = 'flex';
}

function closeDetailModal() {
  var modal = document.getElementById('detailModal');
  if (modal) modal.style.display = 'none';
}

function closeModal(e) {
  if (e.target && e.target.id === 'detailModal') closeDetailModal();
}

/* ======================== TABS ======================== */
function showTab(name) {
  var tabs = ['top', 'whale', 'withdraw', 'watchlist', 'search', 'stats', 'map'];
  tabs.forEach(function (t) {
    var panel = document.getElementById('panel-' + t);
    var tab   = document.getElementById('tab-' + t);
    if (panel) panel.style.display = t === name ? '' : 'none';
    if (tab)   tab.classList.toggle('active', t === name);
  });
  if (name === 'stats') buildStatsCharts();
  if (name === 'withdraw') renderWithdrawals();
  if (name === 'map') buildUserMap();
}

/* ======================== MAP ======================== */
var _leafletMap = null;
var _mapMarkers = [];
var _mapTileLayer = null;

function buildUserMap() {
  var container = document.getElementById('userMap');
  if (!container) return;

  // Invalidate size in case panel was hidden when Leaflet initialized
  if (_leafletMap) {
    _leafletMap.invalidateSize();
    updateMapMarkers();
    return;
  }

  _leafletMap = L.map('userMap', { zoomControl: true, attributionControl: true }).setView([20, 0], 2);

  _mapTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 18,
  }).addTo(_leafletMap);

  updateMapMarkers();
}

function updateMapMarkers() {
  if (!_leafletMap) return;

  // Remove existing markers
  _mapMarkers.forEach(function (m) { _leafletMap.removeLayer(m); });
  _mapMarkers = [];

  var net   = (document.getElementById('mapNetworkFilter') || {}).value || 'all';
  var typeF = (document.getElementById('mapTypeFilter')   || {}).value || 'all';
  var minV  = parseFloat((document.getElementById('mapValueFilter') || {}).value || '0');

  var data = allWallets.filter(function (w) {
    if (net   !== 'all' && w.network !== net)   return false;
    if (typeF !== 'all' && w.type    !== typeF) return false;
    if (w.value < minV)                          return false;
    return true;
  });

  // Update stats
  var totalV = data.reduce(function (s, w) { return s + w.value; }, 0);
  var cnt = document.getElementById('mapUserCount');
  if (cnt) cnt.textContent = data.length + ' users';
  var tv = document.getElementById('mapTotalValue');
  if (tv) tv.textContent = fmt(totalV);

  // Plot markers
  data.forEach(function (w) {
    var color  = NETWORK_COLORS[w.network] || '#888';
    // Radius: small for low value, bigger for whale
    var radius = Math.max(4, Math.min(20, 2.5 * Math.log10(w.value / 1e5 + 1)));

    var marker = L.circleMarker([w.lat, w.lng], {
      radius:      radius,
      fillColor:   color,
      color:       '#000',
      weight:      1,
      opacity:     0.9,
      fillOpacity: 0.72,
    });

    marker.bindPopup(
      '<div style="font-family:monospace;min-width:190px;font-size:12px">' +
      '<div style="font-weight:bold;font-size:13px;margin-bottom:3px;color:#ddd">' + escHtml(w.name) + '</div>' +
      '<div style="color:#666;font-size:10px;margin-bottom:6px">' + shortAddr(w.addr) + '</div>' +
      '<div style="border-top:1px solid #2a2a2a;padding-top:6px">' +
      '<div><span style="color:#555">📍 Vị trí:</span> <strong style="color:#ccc">' + escHtml(w.city) + ', ' + escHtml(w.country) + '</strong></div>' +
      '<div><span style="color:#555">🌐 Mạng:</span> <span style="color:' + color + '">' + w.network + '</span></div>' +
      '<div><span style="color:#555">🏷️ Loại:</span> ' + labelType(w.type) + '</div>' +
      '<div><span style="color:#555">💰 Tài sản:</span> <strong style="color:#0f0">' + fmt(w.value) + '</strong></div>' +
      '<div><span style="color:#555">📊 24h:</span> <span style="color:' + (w.change24h >= 0 ? '#0f0' : '#f44') + '">' + (w.change24h >= 0 ? '+' : '') + w.change24h.toFixed(2) + '%</span></div>' +
      '</div>' +
      '<div style="margin-top:8px">' +
      '<button onclick="openDetail(' + w.id + ')" style="background:#1a1a1a;border:1px solid #333;color:#aaa;padding:3px 10px;font-size:10px;cursor:pointer;border-radius:2px">Xem chi tiết</button>' +
      '</div></div>',
      { maxWidth: 240 }
    );

    marker.addTo(_leafletMap);
    _mapMarkers.push(marker);
  });
}

/* ======================== CHARTS ======================== */
function buildDistributionChart() {
  var ctx = document.getElementById('distributionChart');
  if (!ctx) return;
  var byNetwork = {};
  allWallets.forEach(function (w) { byNetwork[w.network] = (byNetwork[w.network] || 0) + w.value; });
  var labels = Object.keys(byNetwork);
  var data = labels.map(function (k) { return byNetwork[k]; });
  if (charts.dist) charts.dist.destroy();
  charts.dist = new Chart(ctx, {
    type: 'doughnut',
    data: { labels: labels, datasets: [{ data: data, backgroundColor: ['#333','#444','#555','#3a3a3a','#4a4a4a','#2a2a2a'], borderColor: '#111', borderWidth: 1 }] },
    options: { plugins: { legend: { labels: { color: '#666', font: { size: 10 } } } } }
  });
}

function buildStatsCharts() {
  buildNetworkChart();
  buildTop10Chart();
  buildTypeChart();
  buildChangeChart();
}

function buildNetworkChart() {
  var ctx = document.getElementById('networkChart');
  if (!ctx) return;
  var byNet = {};
  allWallets.forEach(function (w) { byNet[w.network] = (byNet[w.network] || 0) + w.value; });
  if (charts.network) charts.network.destroy();
  charts.network = new Chart(ctx, {
    type: 'bar',
    data: { labels: Object.keys(byNet), datasets: [{ label: 'Tong tai san (USD)', data: Object.values(byNet), backgroundColor: '#2a2a2a', borderColor: '#444', borderWidth: 1 }] },
    options: {
      plugins: { legend: { labels: { color: '#666' } } },
      scales: {
        x: { ticks: { color: '#555' }, grid: { color: '#1a1a1a' } },
        y: { ticks: { color: '#555', callback: function (v) { return fmt(v); } }, grid: { color: '#1a1a1a' } }
      }
    }
  });
}

function buildTop10Chart() {
  var ctx = document.getElementById('top10Chart');
  if (!ctx) return;
  var top10 = allWallets.slice(0, 10);
  if (charts.top10) charts.top10.destroy();
  charts.top10 = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: top10.map(function (w) { return w.name.slice(0, 14); }),
      datasets: [{ label: 'Tong tai san (USD)', data: top10.map(function (w) { return w.value; }), backgroundColor: '#333', borderColor: '#555', borderWidth: 1 }]
    },
    options: {
      indexAxis: 'y',
      plugins: { legend: { labels: { color: '#666' } } },
      scales: {
        x: { ticks: { color: '#555', callback: function (v) { return fmt(v); } }, grid: { color: '#1a1a1a' } },
        y: { ticks: { color: '#888' }, grid: { color: '#111' } }
      }
    }
  });
}

function buildTypeChart() {
  var ctx = document.getElementById('typeChart');
  if (!ctx) return;
  var byType = {};
  allWallets.forEach(function (w) { byType[w.type] = (byType[w.type] || 0) + 1; });
  if (charts.type) charts.type.destroy();
  charts.type = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(byType).map(labelType),
      datasets: [{ data: Object.values(byType), backgroundColor: ['#333','#444','#555','#3a3a3a'], borderColor: '#111', borderWidth: 1 }]
    },
    options: { plugins: { legend: { labels: { color: '#666' } } } }
  });
}

function buildChangeChart() {
  var ctx = document.getElementById('changeChart');
  if (!ctx) return;
  var buckets = { '<-5%': 0, '-5%~0%': 0, '0%~5%': 0, '>5%': 0 };
  allWallets.forEach(function (w) {
    if      (w.change24h < -5) buckets['<-5%']++;
    else if (w.change24h < 0)  buckets['-5%~0%']++;
    else if (w.change24h < 5)  buckets['0%~5%']++;
    else                        buckets['>5%']++;
  });
  if (charts.change) charts.change.destroy();
  charts.change = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(buckets),
      datasets: [{
        label: 'So vi',
        data: Object.values(buckets),
        backgroundColor: ['#3a2a2a','#2a2a3a','#2a3a2a','#2a3a2a'],
        borderColor: ['#553333','#333355','#335533','#336633'],
        borderWidth: 1
      }]
    },
    options: {
      plugins: { legend: { labels: { color: '#666' } } },
      scales: {
        x: { ticks: { color: '#555' }, grid: { color: '#1a1a1a' } },
        y: { ticks: { color: '#555' }, grid: { color: '#1a1a1a' } }
      }
    }
  });
}

/* ======================== EXPORT CSV ======================== */
function exportCSV() {
  var header = ['Rank','Name','Address','Network','Type','Balance','Ticker','Value_USD','Change_24h_%','TX_Count'];
  var rows = filteredWallets.map(function (w, i) {
    return [i + 1, '"' + w.name + '"', w.addr, w.network, w.type, w.balance.toFixed(4), w.ticker, w.value.toFixed(2), w.change24h.toFixed(2), w.txCount].join(',');
  });
  var csv = [header.join(',')].concat(rows).join('\n');
  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'whale_tracker_' + new Date().toISOString().slice(0, 10) + '.csv';
  a.click();
  URL.revokeObjectURL(url);
}

/* ======================== REFRESH ======================== */
function refreshData() {
  allWallets.forEach(function (w) {
    var delta = randBetween(-0.02, 0.02);
    w.value *= (1 + delta);
    w.change24h = randBetween(-12, 18);
    w.balance = w.value / (PRICES[w.ticker] || 1);
  });
  allWallets.sort(function (a, b) { return b.value - a.value; });
  allWallets.forEach(function (w, i) { w.id = i; });
  // Add a few new withdrawal events
  var newWd = generateWithdrawals(5);
  allWithdrawals = newWd.concat(allWithdrawals).slice(0, 300);
  applyFilters();
  updateStats();
  renderWhaleAlerts();
  renderWatchlist();
  buildDistributionChart();
  // Re-render withdraw tab if active
  var panel = document.getElementById('panel-withdraw');
  if (panel && panel.style.display !== 'none') renderWithdrawals();
}

/* ======================== LOGOUT ======================== */
function logout() {
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('passwordHash');
  window.location.href = 'login.html';
}

/* ======================== WITHDRAWAL MODE ======================== */
var allWithdrawals = [], filteredWithdrawals = [], withdrawPage = 1;

function generateWithdrawals(count) {
  var list = [];
  var now = Date.now();
  var tokens = ['ETH', 'BTC', 'USDT', 'USDC', 'BNB', 'SOL', 'WBTC', 'DAI', 'MATIC', 'AVAX'];
  var tokenPrices = { ETH: 3800, BTC: 95000, USDT: 1, USDC: 1, BNB: 620, SOL: 195, WBTC: 95000, DAI: 1, MATIC: 0.88, AVAX: 39 };
  var statuses = ['confirmed', 'confirmed', 'confirmed', 'pending', 'flagged'];
  var directions = ['out', 'out', 'out', 'in', 'in'];
  for (var i = 0; i < count; i++) {
    var network = randPick(NETWORKS);
    var token = randPick(tokens);
    var amount = randBetween(1000, 200000);
    var value = amount * (tokenPrices[token] || 1);
    var from = allWallets.length > 0 ? allWallets[randInt(0, Math.min(50, allWallets.length - 1))].addr : randAddr('ethereum');
    var to = randAddr('ethereum');
    var fromName = allWallets.length > 0 ? allWallets[randInt(0, Math.min(50, allWallets.length - 1))].name : 'Unknown';
    var txHash = '0x' + Array.from({ length: 64 }, function () { return '0123456789abcdef'[randInt(0, 15)]; }).join('');
    var time = new Date(now - randBetween(0, 72 * 3600000));
    var dir = randPick(directions);
    var status = randPick(statuses);
    var risk = value > 10e6 ? 'high' : value > 1e6 ? 'medium' : 'low';
    list.push({ id: i, from: from, fromName: fromName, to: to, token: token, amount: amount, value: value, network: network, txHash: txHash, time: time, direction: dir, status: status, risk: risk });
  }
  return list.sort(function (a, b) { return b.value - a.value; });
}

function renderWithdrawals() {
  var networkEl  = document.getElementById('withdrawNetwork');
  var minEl      = document.getElementById('withdrawMin');
  var dirEl      = document.getElementById('withdrawDirection');
  var network    = networkEl ? networkEl.value : 'all';
  var min        = minEl ? parseFloat(minEl.value) || 500000 : 500000;
  var dir        = dirEl ? dirEl.value : 'all';

  filteredWithdrawals = allWithdrawals.filter(function (w) {
    if (network !== 'all' && w.network !== network) return false;
    if (w.value < min) return false;
    if (dir !== 'all' && w.direction !== dir) return false;
    return true;
  });

  var pageSize = 20;
  var totalPages = Math.max(1, Math.ceil(filteredWithdrawals.length / pageSize));
  if (withdrawPage > totalPages) withdrawPage = totalPages;
  var start = (withdrawPage - 1) * pageSize;
  var rows = filteredWithdrawals.slice(start, start + pageSize);

  // Summary stats
  var totalOut = filteredWithdrawals.filter(function (w) { return w.direction === 'out'; }).reduce(function (s, w) { return s + w.value; }, 0);
  var totalIn  = filteredWithdrawals.filter(function (w) { return w.direction === 'in';  }).reduce(function (s, w) { return s + w.value; }, 0);
  var flagged  = filteredWithdrawals.filter(function (w) { return w.status === 'flagged'; }).length;
  var statsEl = document.getElementById('withdrawStats');
  if (statsEl) {
    statsEl.innerHTML =
      '<div class="wt-withdraw-stat"><span class="wt-withdraw-stat-label">Tổng rút ra</span><span class="wt-withdraw-stat-value wt-change-neg">' + fmt(totalOut) + '</span></div>' +
      '<div class="wt-withdraw-stat"><span class="wt-withdraw-stat-label">Tổng nạp vào</span><span class="wt-withdraw-stat-value wt-change-pos">' + fmt(totalIn) + '</span></div>' +
      '<div class="wt-withdraw-stat"><span class="wt-withdraw-stat-label">Giao dịch khả nghi</span><span class="wt-withdraw-stat-value" style="color:#ff6b35">' + flagged + '</span></div>' +
      '<div class="wt-withdraw-stat"><span class="wt-withdraw-stat-label">Tổng GD lọc được</span><span class="wt-withdraw-stat-value">' + filteredWithdrawals.length + '</span></div>';
  }

  var tbody = document.getElementById('withdrawTableBody');
  if (!tbody) return;
  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;color:#555;padding:24px">Không có giao dịch nào phù hợp</td></tr>';
  } else {
    tbody.innerHTML = rows.map(function (w, i) {
      var dirLabel = w.direction === 'out' ? '<span class="wt-badge" style="background:#1a0a0a;color:#ff6b6b">RÚT RA</span>' : '<span class="wt-badge" style="background:#0a1a0a;color:#6bff6b">NẠP VÀO</span>';
      var statusLabel = w.status === 'flagged' ? '<span style="color:#ff4444">⚑ Khả nghi</span>' : w.status === 'pending' ? '<span style="color:#ffaa00">⏳ Đang xử lý</span>' : '<span style="color:#444">✓ Xác nhận</span>';
      var riskClass = w.risk === 'high' ? 'wt-risk-high' : w.risk === 'medium' ? 'wt-risk-med' : 'wt-risk-low';
      return '<tr class="' + riskClass + '">' +
        '<td>' + (start + i + 1) + '</td>' +
        '<td style="white-space:nowrap">' + w.time.toLocaleDateString() + ' ' + w.time.toLocaleTimeString() + '</td>' +
        '<td><span class="wt-addr-name">' + escHtml(w.fromName) + '</span><br><span class="wt-addr-hash" title="' + w.from + '">' + shortAddr(w.from) + '</span></td>' +
        '<td class="wt-tx-hash" title="' + w.to + '">' + shortAddr(w.to) + '</td>' +
        '<td><span class="wt-badge">' + w.token + '</span></td>' +
        '<td>' + fmtNum(w.amount) + ' ' + w.token + '</td>' +
        '<td class="wt-whale-amount">' + fmt(w.value) + '</td>' +
        '<td>' + dirLabel + '</td>' +
        '<td><span class="wt-network-badge">' + w.network + '</span></td>' +
        '<td>' + statusLabel + '</td>' +
        '</tr>';
    }).join('');
  }

  var pi = document.getElementById('withdrawPageInfo');
  if (pi) pi.textContent = 'Trang ' + withdrawPage + ' / ' + totalPages;
}

function prevWithdrawPage() { if (withdrawPage > 1) { withdrawPage--; renderWithdrawals(); } }
function nextWithdrawPage() {
  var pageSize = 20;
  if (withdrawPage < Math.ceil(filteredWithdrawals.length / pageSize)) { withdrawPage++; renderWithdrawals(); }
}

function exportWithdrawCSV() {
  var header = ['#','Time','From_Name','From_Addr','To_Addr','Token','Amount','Value_USD','Direction','Network','Status','Risk'];
  var rows = filteredWithdrawals.map(function (w, i) {
    return [i+1, w.time.toISOString(), '"'+w.fromName+'"', w.from, w.to, w.token, w.amount.toFixed(4), w.value.toFixed(2), w.direction, w.network, w.status, w.risk].join(',');
  });
  var csv = [header.join(',')].concat(rows).join('\n');
  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  var a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = 'wfb_withdrawals_' + new Date().toISOString().slice(0, 10) + '.csv'; a.click();
}

/* ======================== USD SEIZURE ======================== */
function openUsdWithdraw(id) {
  var w = allWallets.find(function (x) { return x.id === id; });
  if (!w) return;
  _usdWithdrawTarget = w;
  var tgt = document.getElementById('usdWithdrawTarget');
  if (tgt) {
    var color = NETWORK_COLORS[w.network] || '#888';
    tgt.innerHTML =
      '<div style="font-weight:bold;color:#ddd;font-size:14px;margin-bottom:4px">' + escHtml(w.name) + '</div>' +
      '<div style="font-size:10px;color:#444;word-break:break-all;margin-bottom:8px">' + w.addr + '</div>' +
      '<div style="font-size:12px;display:flex;gap:16px">' +
        '<span>Tổng tài sản: <strong style="color:#0f0">' + fmt(w.value) + '</strong></span>' +
        '<span>Mạng: <span style="color:' + color + '">' + w.network + '</span></span>' +
        '<span>Loại: ' + labelType(w.type) + '</span>' +
      '</div>' +
      '<div style="font-size:10px;color:#555;margin-top:6px">📍 ' + escHtml(w.city) + ', ' + escHtml(w.country) + '</div>';
  }
  var amtEl = document.getElementById('usdWithdrawAmount');
  var noteEl = document.getElementById('usdWithdrawNote');
  var msgEl  = document.getElementById('usdWithdrawMsg');
  if (amtEl)  amtEl.value = '';
  if (noteEl) noteEl.value = '';
  if (msgEl)  msgEl.textContent = '';
  // Reset modal panels to initial state
  var formEl    = document.getElementById('usdWithdrawForm');
  var loadEl    = document.getElementById('usdWithdrawLoading');
  var successEl = document.getElementById('usdWithdrawSuccessPanel');
  if (formEl)    formEl.style.display    = '';
  if (loadEl)    loadEl.style.display    = 'none';
  if (successEl) successEl.style.display = 'none';
  var closeBtn = document.querySelector('#usdWithdrawModal .wt-modal-close');
  if (closeBtn) closeBtn.style.pointerEvents = '';
  // Reset bar animation
  var barReset = document.getElementById('usdLoadBar');
  if (barReset) { barReset.style.animation = 'none'; barReset.style.width = '0%'; }
  var pctReset = document.getElementById('usdLoadPct');
  if (pctReset) pctReset.textContent = '0%';
  var modal = document.getElementById('usdWithdrawModal');
  if (modal) modal.style.display = 'flex';
  // Close detail modal if open
  var dm = document.getElementById('detailModal');
  if (dm) dm.style.display = 'none';
}

function closeUsdWithdraw() {
  if (_usdWithdrawTimer) { clearInterval(_usdWithdrawTimer); _usdWithdrawTimer = null; }
  var modal     = document.getElementById('usdWithdrawModal');
  var formEl    = document.getElementById('usdWithdrawForm');
  var loadEl    = document.getElementById('usdWithdrawLoading');
  var successEl = document.getElementById('usdWithdrawSuccessPanel');
  if (modal)     modal.style.display     = 'none';
  if (formEl)    formEl.style.display    = 'block';
  if (loadEl)    loadEl.style.display    = 'none';
  if (successEl) successEl.style.display = 'none';
  _usdWithdrawTarget = null;
}

function closeUsdWithdrawModal(e) {
  if (e.target === e.currentTarget) closeUsdWithdraw();
}

function confirmUsdWithdraw() {
  if (!_usdWithdrawTarget) return;
  var amtEl  = document.getElementById('usdWithdrawAmount');
  var noteEl = document.getElementById('usdWithdrawNote');
  var msgEl  = document.getElementById('usdWithdrawMsg');
  var amount = parseFloat(amtEl ? amtEl.value : '');
  if (!amount || amount <= 0) {
    if (msgEl) msgEl.textContent = '⚠ Nhập số tiền hợp lệ (> 0)';
    return;
  }
  if (amount > _usdWithdrawTarget.value) {
    if (msgEl) msgEl.textContent = '⚠ Vượt quá tài sản hiện có (' + fmt(_usdWithdrawTarget.value) + ')';
    return;
  }
  var note     = (noteEl && noteEl.value.trim()) ? noteEl.value.trim() : 'Không có ghi chú';
  var operator = localStorage.getItem('userEmail') || 'unknown';
  var target   = _usdWithdrawTarget;

  // Phase 1: show loading panel
  var formEl    = document.getElementById('usdWithdrawForm');
  var loadEl    = document.getElementById('usdWithdrawLoading');
  var successEl = document.getElementById('usdWithdrawSuccessPanel');
  var closeBtn  = document.querySelector('#usdWithdrawModal .wt-modal-close');
  var bar       = document.getElementById('usdLoadBar');
  var shimmer   = document.getElementById('usdScanShimmer');
  var pctEl     = document.getElementById('usdLoadPct');

  if (formEl)    formEl.style.display    = 'none';
  if (successEl) successEl.style.display = 'none';
  if (loadEl)    loadEl.style.display    = 'block';
  if (closeBtn)  closeBtn.style.pointerEvents = 'none';
  if (bar)       bar.style.width              = '0%';
  if (pctEl)     pctEl.textContent            = '0%';
  if (shimmer)   shimmer.style.left           = '-60%';

  // Reset step labels
  var stepCfg = [
    '● Xác minh danh tính User...',
    '● Kiểm tra số dư tài sản...',
    '● Phát lệnh thu hồi WFB...',
    '● Ghi nhật ký hệ thống...',
  ];
  ['usdStep0','usdStep1','usdStep2','usdStep3'].forEach(function(id, i) {
    var el = document.getElementById(id);
    if (el) { el.textContent = '○ ' + stepCfg[i].slice(2); el.style.color = '#333'; }
  });

  // Phase 2: animate with setInterval (reliable, no CSS dependency)
  var DURATION = 2000;
  var elapsed  = 0;
  var TICK     = 40;
  var lastStep = -1;
  if (_usdWithdrawTimer) clearInterval(_usdWithdrawTimer);
  _usdWithdrawTimer = setInterval(function () {
    elapsed += TICK;
    var progress = Math.min(1, elapsed / DURATION);

    if (bar)   bar.style.width      = (progress * 100).toFixed(1) + '%';
    if (pctEl) pctEl.textContent    = Math.floor(progress * 100) + '%';
    if (shimmer) {
      var cycle = (elapsed % 800) / 800;
      shimmer.style.left = (cycle * 180 - 60).toFixed(1) + '%';
    }

    var stepIdx = elapsed < 500 ? 0 : elapsed < 1000 ? 1 : elapsed < 1500 ? 2 : 3;
    if (stepIdx !== lastStep) {
      if (lastStep >= 0) {
        var prevEl = document.getElementById('usdStep' + lastStep);
        if (prevEl) { prevEl.textContent = '✓ ' + stepCfg[lastStep].slice(2); prevEl.style.color = '#0a0'; }
      }
      var curEl = document.getElementById('usdStep' + stepIdx);
      if (curEl) { curEl.textContent = stepCfg[stepIdx]; curEl.style.color = '#ff6b35'; }
      lastStep = stepIdx;
    }

    if (progress >= 1) {
      clearInterval(_usdWithdrawTimer);
      _usdWithdrawTimer = null;
      if (pctEl) pctEl.textContent = '100%';
      if (bar)   bar.style.width   = '100%';
      var finalEl = document.getElementById('usdStep3');
      if (finalEl) { finalEl.textContent = '✓ ' + stepCfg[3].slice(2); finalEl.style.color = '#0a0'; }

      // Phase 3: show success panel after 500ms
      setTimeout(function () {
        var w = allWallets.find(function (x) { return x.id === target.id; });
        if (w) w.value = Math.max(0, w.value - amount);
        usdSeizures.unshift({
          id:          Date.now(),
          userId:      target.id,
          userName:    target.name,
          userAddr:    target.addr,
          userCity:    target.city,
          userCountry: target.country,
          network:     target.network,
          amount:      amount,
          note:        note,
          timestamp:   new Date(),
          operator:    operator,
          status:      'executed',
        });
        if (loadEl)    loadEl.style.display    = 'none';
        if (successEl) successEl.style.display = 'block';
        var checkEl  = document.getElementById('usdSuccessCheck');
        var amtDisp  = document.getElementById('usdSuccessAmt');
        var fromDisp = document.getElementById('usdSuccessFrom');
        var tsDisp   = document.getElementById('usdSuccessTs');
        if (checkEl) {
          checkEl.style.animation = 'none';
          requestAnimationFrame(function () {
            checkEl.style.animation = 'wfbBounceIn2 0.5s cubic-bezier(.36,.07,.19,.97) both';
          });
        }
        if (amtDisp)  amtDisp.textContent  = '-' + fmt(amount);
        if (fromDisp) fromDisp.textContent = 'Từ: ' + target.name + ' (' + target.city + ', ' + target.country + ')';
        if (tsDisp)   tsDisp.textContent   = 'Operator: ' + operator + '  |  ' + new Date().toLocaleString();

        // Phase 4: auto-close after 2s
        setTimeout(function () {
          if (closeBtn) closeBtn.style.pointerEvents = '';
          closeUsdWithdraw();
          applyFilters();
          updateStats();
          renderUsdSeizures();
          showTab('withdraw');
          showWfbToast('✓ Đã rút ' + fmt(amount) + ' từ ' + target.name);
        }, 2000);
      }, 500);
    }
  }, TICK);
}

function renderUsdSeizures() {
  var tbody = document.getElementById('seizureTableBody');
  if (!tbody) return;
  var totalEl = document.getElementById('seizureTotal');
  var countEl = document.getElementById('seizureCount');
  if (!usdSeizures.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#444;padding:20px">Chưa có lệnh rút nào được ban hành</td></tr>';
    if (totalEl) totalEl.textContent = '$0';
    if (countEl) countEl.textContent = '0 lệnh';
    return;
  }
  tbody.innerHTML = usdSeizures.map(function (s, i) {
    return '<tr>' +
      '<td>' + (i + 1) + '</td>' +
      '<td style="white-space:nowrap;font-size:10px">' + s.timestamp.toLocaleString() + '</td>' +
      '<td><span class="wt-addr-name">' + escHtml(s.userName) + '</span><br>' +
        '<span class="wt-addr-hash">' + shortAddr(s.userAddr) + '</span><br>' +
        '<span style="font-size:10px;color:#444">📍 ' + escHtml(s.userCity || '') + ', ' + escHtml(s.userCountry || '') + '</span></td>' +
      '<td class="wt-whale-amount" style="color:#ff6b35;font-size:14px">-' + fmt(s.amount) + '</td>' +
      '<td style="color:#555;font-size:11px">' + escHtml(s.note) + '</td>' +
      '<td style="color:#444;font-size:11px">' + escHtml(s.operator) + '</td>' +
      '<td><span style="color:#0a0;font-size:11px">✓ Đã thực hiện</span></td>' +
      '<td><button class="wt-btn-sm" style="color:#333;border-color:#1e1e1e;font-size:10px" onclick="undoSeizure(' + i + ')">Hoàn tác</button></td>' +
      '</tr>';
  }).join('');
  var total = usdSeizures.reduce(function (s, x) { return s + x.amount; }, 0);
  if (totalEl) totalEl.textContent = fmt(total);
  if (countEl) countEl.textContent = usdSeizures.length + ' lệnh';
}

function undoSeizure(i) {
  var s = usdSeizures[i];
  if (!s) return;
  var w = allWallets.find(function (x) { return x.id === s.userId; });
  if (w) w.value += s.amount;
  usdSeizures.splice(i, 1);
  applyFilters();
  updateStats();
  renderUsdSeizures();
  showWfbToast('Đã hoàn tác lệnh rút của ' + s.userName);
}

function showWfbToast(msg) {
  var t = document.getElementById('wfbToast');
  if (!t) return;
  t.textContent = msg;
  t.style.opacity = '1';
  t.style.transform = 'translateY(0)';
  clearTimeout(t._timer);
  t._timer = setTimeout(function () {
    t.style.opacity = '0';
    t.style.transform = 'translateY(12px)';
  }, 3000);
}

function exportSeizureCSV() {
  if (!usdSeizures.length) { showWfbToast('Chưa có lệnh rút nào'); return; }
  var header = ['#','Timestamp','UserName','UserAddr','Network','Amount_USD','Note','Operator','Status'];
  var rows = usdSeizures.map(function (s, i) {
    return [i+1, s.timestamp.toISOString(), '"'+s.userName+'"', s.userAddr, s.network, s.amount.toFixed(2), '"'+s.note+'"', s.operator, s.status].join(',');
  });
  var csv = [header.join(',')].concat(rows).join('\n');
  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  var a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = 'wfb_seizures_' + new Date().toISOString().slice(0, 10) + '.csv'; a.click();
}

function exportSearchCSV() {
  var header = ['Rank','Name','Address','Network','Type','Balance','Ticker','Value_USD','Change_24h_%','TX_Count'];
  var src = document.getElementById('searchResultBody');
  if (!src) return;
  var lastResults = allWallets.filter(function (w) {
    var addr  = (document.getElementById('adv_address') ? document.getElementById('adv_address').value : '').trim().toLowerCase();
    var label = (document.getElementById('adv_label')   ? document.getElementById('adv_label').value   : '').trim().toLowerCase();
    var net   = document.getElementById('adv_network')  ? document.getElementById('adv_network').value  : '';
    var type  = document.getElementById('adv_type')     ? document.getElementById('adv_type').value     : '';
    var min   = parseFloat(document.getElementById('adv_min') ? document.getElementById('adv_min').value : '') || 0;
    var max   = parseFloat(document.getElementById('adv_max') ? document.getElementById('adv_max').value : '') || Infinity;
    if (addr  && w.addr.toLowerCase().indexOf(addr)  === -1) return false;
    if (label && w.name.toLowerCase().indexOf(label) === -1) return false;
    if (net   && w.network !== net)  return false;
    if (type  && w.type    !== type) return false;
    if (w.value < min || w.value > max) return false;
    return true;
  });
  var rows = lastResults.map(function (w, i) {
    return [i+1, '"'+w.name+'"', w.addr, w.network, w.type, w.balance.toFixed(4), w.ticker, w.value.toFixed(2), w.change24h.toFixed(2), w.txCount].join(',');
  });
  var csv = [header.join(',')].concat(rows).join('\n');
  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  var a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = 'wfb_search_' + new Date().toISOString().slice(0, 10) + '.csv'; a.click();
}

/* ======================== SETTINGS ======================== */
var appSettings = {
  pageSize: 20, defaultTab: 'top', defaultView: 'table',
  refresh: 60, whaleThreshold: 1000000, withdrawThreshold: 500000, trackMode: 'all'
};
var refreshTimer = null;

function openSettings() {
  var s = appSettings;
  var setVal = function (id, val) { var el = document.getElementById(id); if (el) el.value = val; };
  setVal('cfg_pageSize', s.pageSize);
  setVal('cfg_defaultTab', s.defaultTab);
  setVal('cfg_defaultView', s.defaultView);
  setVal('cfg_refresh', s.refresh);
  setVal('cfg_whaleThreshold', s.whaleThreshold);
  setVal('cfg_withdrawThreshold', s.withdrawThreshold);
  setVal('cfg_trackMode', s.trackMode);
  var em = document.getElementById('cfg_email'); if (em) em.textContent = localStorage.getItem('userEmail') || '--';
  var se = document.getElementById('cfg_session'); if (se) se.textContent = new Date().toLocaleString();
  var modal = document.getElementById('settingsModal'); if (modal) modal.style.display = 'flex';
}

function closeSettings() {
  var modal = document.getElementById('settingsModal'); if (modal) modal.style.display = 'none';
}

function closeSettingsModal(e) { if (e.target && e.target.id === 'settingsModal') closeSettings(); }

function saveSettings() {
  var getVal = function (id) { var el = document.getElementById(id); return el ? el.value : null; };
  appSettings.pageSize         = parseInt(getVal('cfg_pageSize'))      || 20;
  appSettings.defaultTab       = getVal('cfg_defaultTab')              || 'top';
  appSettings.defaultView      = getVal('cfg_defaultView')             || 'table';
  appSettings.refresh          = parseInt(getVal('cfg_refresh'))        || 60;
  appSettings.whaleThreshold   = parseInt(getVal('cfg_whaleThreshold')) || 1000000;
  appSettings.withdrawThreshold= parseInt(getVal('cfg_withdrawThreshold'))||500000;
  appSettings.trackMode        = getVal('cfg_trackMode')               || 'all';

  // Apply page size
  var ps = document.getElementById('pageSize'); if (ps) ps.value = appSettings.pageSize;

  // Restart refresh timer
  if (refreshTimer) clearInterval(refreshTimer);
  if (appSettings.refresh > 0) {
    refreshTimer = setInterval(function () { refreshData(); }, appSettings.refresh * 1000);
  }

  localStorage.setItem('wfb_settings', JSON.stringify(appSettings));
  closeSettings();
  applyFilters();
}

function resetAllData() {
  if (!confirm('Reset toàn bộ dữ liệu và watchlist?')) return;
  localStorage.removeItem('wt_watchlist');
  localStorage.removeItem('wfb_settings');
  allWallets = generateWallets(500);
  whaleAlerts = generateWhaleAlerts(200);
  allWithdrawals = generateWithdrawals(150);
  watchlist = [];
  applyFilters(); renderWhaleAlerts(); renderWatchlist(); renderWithdrawals(); updateStats(); buildDistributionChart();
  closeSettings();
}
