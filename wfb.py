#!/usr/bin/env python3
"""
WFB
Python CLI tool: nạp dữ liệu ví, tìm kiếm và trả về kết quả.

Cách dùng:
  python wfb.py --help
  python wfb.py search --name "Binance"
  python wfb.py search --network ethereum --min 1000000
  python wfb.py search --type whale --sort value
  python wfb.py detail --id 0
  python wfb.py withdraw --min 5000000 --direction out
  python wfb.py load --file wallets.json
  python wfb.py export --output results.json
"""

import argparse
import json
import csv
import random
import math
import sys
import os
from datetime import datetime, timedelta

# ─── CONFIG ────────────────────────────────────────────────────────────────────
NETWORKS   = ['ethereum', 'bitcoin', 'bsc', 'solana', 'polygon', 'avalanche']
TYPES      = ['exchange', 'whale', 'fund', 'unknown']
TOKEN_MAIN = {'ethereum':'ETH','bitcoin':'BTC','bsc':'BNB','solana':'SOL','polygon':'MATIC','avalanche':'AVAX'}
PRICES     = {'ETH':3800,'BTC':95000,'BNB':620,'SOL':195,'MATIC':0.88,'AVAX':39,'USDT':1,'USDC':1,'DAI':1,'WBTC':95000}
TOKENS_EXTRA = ['USDT','USDC','DAI','WBTC','UNI','LINK','AAVE','CRV','MKR','SNX','COMP','BAL','YFI']
KNOWN_NAMES = [
    'Binance Hot Wallet','Coinbase Custody','Kraken Exchange','Bitfinex Cold',
    'Satoshi Nakamoto','Winklevoss Capital','a16z Crypto Fund','Pantera Capital',
    'FTX Bankruptcy Estate','Jump Trading','Alameda Research','Galaxy Digital',
    'Grayscale Bitcoin Trust','MicroStrategy Treasury','Tesla Inc','Block Inc',
    'Dragonfly Capital','Multicoin Capital','Three Arrows Capital','Genesis Trading',
    'Cumberland DRW','Jane Street Crypto','Citadel Securities','Two Sigma Crypto',
    'Anonymous Whale 1','Anonymous Whale 2','Anonymous Whale 3','DeFi Degen',
    'ETH Foundation','Vitalik Buterin','Solana Foundation','Polygon Labs',
    'Uniswap Treasury','Aave Treasury','Compound Finance','MakerDAO',
]

# ─── UTILITIES ─────────────────────────────────────────────────────────────────
def fmt_usd(n):
    if n >= 1e9: return f"${n/1e9:.2f}B"
    if n >= 1e6: return f"${n/1e6:.2f}M"
    if n >= 1e3: return f"${n/1e3:.1f}K"
    return f"${n:.2f}"

def fmt_num(n):
    if n >= 1e6: return f"{n/1e6:.2f}M"
    if n >= 1e3: return f"{n/1e3:.1f}K"
    return f"{n:.4f}"

def short_addr(a):
    return a[:7] + '...' + a[-5:] if len(a) > 12 else a

def rand_addr(network='ethereum'):
    hex_chars = '0123456789abcdef'
    if network == 'bitcoin':
        return 'bc1q' + ''.join(random.choice(hex_chars) for _ in range(38))
    return '0x' + ''.join(random.choice(hex_chars) for _ in range(40))

def label_type(t):
    return {'exchange':'San giao dich','whale':'Ca voi','fund':'Quy dau tu','unknown':'An danh'}.get(t, t)

def label_risk(v):
    if v >= 10e6: return 'HIGH'
    if v >= 1e6:  return 'MED'
    return 'low'

# ─── DATA GENERATION ───────────────────────────────────────────────────────────
def generate_wallets(count=500):
    wallets = []
    for i in range(count):
        network = random.choice(NETWORKS)
        if   i < 15: wtype = 'exchange'
        elif i < 30: wtype = 'fund'
        else:        wtype = random.choice(TYPES)

        if   i == 0:   value = random.uniform(40e9, 60e9)
        elif i < 5:    value = random.uniform(5e9,  40e9)
        elif i < 20:   value = random.uniform(500e6, 5e9)
        elif i < 80:   value = random.uniform(50e6, 500e6)
        elif i < 200:  value = random.uniform(5e6,  50e6)
        else:           value = random.uniform(500e3, 5e6)

        ticker  = TOKEN_MAIN[network]
        price   = PRICES.get(ticker, 1)
        balance = (value / price) * random.uniform(0.7, 1.0)
        change  = random.uniform(-12, 18)
        tx_cnt  = random.randint(100, 500000)
        last_active = datetime.now() - timedelta(days=random.uniform(0, 30))
        name    = KNOWN_NAMES[i] if i < len(KNOWN_NAMES) else f'Wallet #{i+1:03d}'
        addr    = rand_addr(network)

        holdings = [{'token': ticker, 'amount': balance, 'value': balance * price}]
        rem = value * random.uniform(0.1, 0.4)
        for _ in range(random.randint(1, 4)):
            t  = random.choice(TOKENS_EXTRA)
            tv = rem * random.uniform(0.1, 0.5)
            rem -= tv
            if rem < 0: break
            holdings.append({'token': t, 'amount': tv, 'value': tv})

        wallets.append({
            'id': i, 'name': name, 'addr': addr, 'network': network,
            'type': wtype, 'balance': balance, 'ticker': ticker,
            'value': value, 'change24h': change, 'txCount': tx_cnt,
            'lastActive': last_active.isoformat(),
            'holdings': holdings,
        })
    return wallets


def generate_withdrawals(wallets, count=150):
    results = []
    token_list = ['ETH','BTC','USDT','USDC','BNB','SOL','WBTC','DAI','MATIC','AVAX']
    statuses = ['confirmed','confirmed','confirmed','pending','flagged']
    directions = ['out','out','out','in','in']
    now = datetime.now()
    top_wallets = wallets[:50] if wallets else []
    for i in range(count):
        src = random.choice(top_wallets) if top_wallets else None
        token  = random.choice(token_list)
        amount = random.uniform(1000, 200000)
        value  = amount * PRICES.get(token, 1)
        results.append({
            'id':        i,
            'from':      src['addr'] if src else rand_addr(),
            'fromName':  src['name'] if src else 'Unknown',
            'to':        rand_addr(),
            'token':     token,
            'amount':    amount,
            'value':     value,
            'network':   random.choice(NETWORKS),
            'txHash':    '0x' + ''.join(random.choice('0123456789abcdef') for _ in range(64)),
            'time':      (now - timedelta(seconds=random.uniform(0, 72*3600))).isoformat(),
            'direction': random.choice(directions),
            'status':    random.choice(statuses),
            'risk':      label_risk(value),
        })
    return sorted(results, key=lambda x: x['value'], reverse=True)


# ─── SEARCH ENGINE ─────────────────────────────────────────────────────────────
def search_wallets(wallets, addr=None, name=None, network=None, wtype=None,
                   min_val=None, max_val=None, token=None, dormant=None, sort='value', limit=50):
    results = []
    for w in wallets:
        if addr    and addr.lower()    not in w['addr'].lower():    continue
        if name    and name.lower()    not in w['name'].lower():    continue
        if network and w['network']   != network:                  continue
        if wtype   and w['type']      != wtype:                    continue
        if min_val and w['value']      < min_val:                  continue
        if max_val and w['value']      > max_val:                  continue
        if token:
            toks = [h['token'].upper() for h in w.get('holdings', [])]
            if token.upper() not in toks: continue
        if dormant == 'dormant':
            try:
                la = datetime.fromisoformat(w['lastActive'])
                if (datetime.now() - la).days < 30: continue
            except Exception:
                pass
        elif dormant == 'active':
            try:
                la = datetime.fromisoformat(w['lastActive'])
                if (datetime.now() - la).days >= 30: continue
            except Exception:
                pass
        results.append(w)

    key_map = {'value':'value','name':'name','balance':'balance','txcount':'txCount','tx':'txCount','change':'change24h'}
    sort_key = key_map.get(sort.lower(), 'value')
    reverse = sort_key != 'name'
    results.sort(key=lambda x: x.get(sort_key, 0), reverse=reverse)
    return results[:limit]


def search_withdrawals(wds, network=None, min_val=None, direction=None, status=None, limit=50):
    results = []
    for w in wds:
        if network   and w['network']   != network:   continue
        if min_val   and w['value']      < min_val:   continue
        if direction and w['direction'] != direction:  continue
        if status    and w['status']    != status:    continue
        results.append(w)
    return results[:limit]


# ─── DISPLAY ───────────────────────────────────────────────────────────────────
SEP  = '─' * 90
SEP2 = '═' * 90

def print_header(title):
    print(f"\n{SEP2}")
    print(f"  WFB — {title}")
    print(f"{SEP2}")

def print_wallet_row(i, w):
    change_sign = '+' if w['change24h'] >= 0 else ''
    print(f"  {i+1:>4}. [{w['network']:<9}] [{label_type(w['type']):<16}]  "
          f"{w['name']:<28}  {fmt_usd(w['value']):<12}  "
          f"{change_sign}{w['change24h']:.2f}%  TX:{w['txCount']:,}")
    print(f"        {w['addr']}")

def print_wallet_detail(w):
    print(f"\n{SEP2}")
    print(f"  WALLET DETAIL — {w['name']}")
    print(f"{SEP2}")
    print(f"  Address    : {w['addr']}")
    print(f"  Network    : {w['network']}")
    print(f"  Type       : {label_type(w['type'])}")
    print(f"  Total Value: {fmt_usd(w['value'])}")
    print(f"  Balance    : {fmt_num(w['balance'])} {w['ticker']}")
    print(f"  24h Change : {'+' if w['change24h']>=0 else ''}{w['change24h']:.2f}%")
    print(f"  Tx Count   : {w['txCount']:,}")
    print(f"  Last Active: {w['lastActive']}")
    print(f"\n  {SEP}")
    print(f"  {'Token':<8} {'Amount':>16} {'Value USD':>14} {'Pct':>8}")
    print(f"  {SEP}")
    for h in w.get('holdings', []):
        pct = (h['value'] / w['value'] * 100) if w['value'] else 0
        print(f"  {h['token']:<8} {fmt_num(h['amount']):>16} {fmt_usd(h['value']):>14} {pct:>7.1f}%")
    print(f"{SEP2}\n")

def print_withdrawal_row(i, w):
    dir_label = '↓ RUT RA' if w['direction'] == 'out' else '↑ NAP'
    flag = ' ⚑' if w['status'] == 'flagged' else ('  ⏳' if w['status'] == 'pending' else '   ')
    print(f"  {i+1:>4}. {dir_label:<9} [{w['risk']:<4}]{flag}  "
          f"{w['fromName']:<24}  {fmt_usd(w['value']):<12}  "
          f"{w['token']:<6}  [{w['network']:<9}]  {w['time'][:16]}")

def print_summary(wallets, wds):
    total = sum(w['value'] for w in wallets)
    top   = wallets[0] if wallets else None
    flagged = sum(1 for w in wds if w['status'] == 'flagged')
    out_total = sum(w['value'] for w in wds if w['direction'] == 'out')
    in_total  = sum(w['value'] for w in wds if w['direction'] == 'in')
    print(f"\n{SEP2}")
    print(f"  WFB SYSTEM SUMMARY")
    print(f"{SEP2}")
    print(f"  Tổng ví theo dõi : {len(wallets):,}")
    print(f"  Tổng tài sản USD : {fmt_usd(total)}")
    print(f"  Ví giàu nhất     : {top['name']} ({fmt_usd(top['value'])})" if top else "  --")
    print(f"  Giao dịch rút    : {len(wds)}")
    print(f"  Tổng rút ra      : {fmt_usd(out_total)}")
    print(f"  Tổng nạp vào     : {fmt_usd(in_total)}")
    print(f"  Khả nghi         : {flagged}")
    print(f"{SEP2}\n")


# ─── EXPORT ────────────────────────────────────────────────────────────────────
def export_json(data, path):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2, default=str)
    print(f"  [OK] Đã xuất JSON: {path} ({len(data)} bản ghi)")

def export_csv_wallets(wallets, path):
    fields = ['id','name','addr','network','type','balance','ticker','value','change24h','txCount','lastActive']
    with open(path, 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=fields, extrasaction='ignore')
        w.writeheader()
        w.writerows(wallets)
    print(f"  [OK] Đã xuất CSV ví: {path} ({len(wallets)} bản ghi)")

def export_csv_withdrawals(wds, path):
    fields = ['id','time','fromName','from','to','token','amount','value','direction','network','status','risk']
    with open(path, 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=fields, extrasaction='ignore')
        w.writeheader()
        w.writerows(wds)
    print(f"  [OK] Đã xuất CSV rút tiền: {path} ({len(wds)} bản ghi)")

def load_from_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"  [OK] Đã nạp dữ liệu từ: {path} ({len(data)} bản ghi)")
    return data


# ─── CLI ───────────────────────────────────────────────────────────────────────
def build_parser():
    parser = argparse.ArgumentParser(
        prog='wfb',
        description='WFB CLI',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ví dụ:
  python wfb.py search --name "Binance"
  python wfb.py search --network ethereum --min 5000000 --sort value
  python wfb.py search --type whale --token ETH --limit 10
  python wfb.py detail --id 0
  python wfb.py withdraw --min 1000000 --direction out --network bsc
  python wfb.py withdraw --status flagged
  python wfb.py export --output data.json --type wallets
  python wfb.py export --output rut.csv  --type withdrawals
  python wfb.py load --file wallets.json
  python wfb.py summary
        """
    )
    sub = parser.add_subparsers(dest='cmd', metavar='LỆNH')

    # search
    sp = sub.add_parser('search', help='Tìm kiếm ví theo điều kiện')
    sp.add_argument('--addr',    help='Địa chỉ ví (tìm một phần)')
    sp.add_argument('--name',    help='Tên nhãn ví (tìm một phần)')
    sp.add_argument('--network', choices=NETWORKS, help='Mạng cụ thể')
    sp.add_argument('--type',    choices=TYPES,    help='Loại tài khoản')
    sp.add_argument('--min',     type=float,       help='Tài sản tối thiểu USD')
    sp.add_argument('--max',     type=float,       help='Tài sản tối đa USD')
    sp.add_argument('--token',   help='Token nắm giữ (VD: ETH, BTC, USDT)')
    sp.add_argument('--dormant', choices=['active','dormant'], help='Trạng thái hoạt động')
    sp.add_argument('--sort',    default='value', help='Sắp xếp theo: value|name|txcount|change (mặc định: value)')
    sp.add_argument('--limit',   type=int, default=20, help='Số kết quả tối đa (mặc định: 20)')
    sp.add_argument('--json',    action='store_true', help='Xuất kết quả dạng JSON')
    sp.add_argument('--out',     help='Lưu kết quả ra file (JSON hoặc CSV tùy đuôi)')

    # detail
    dp = sub.add_parser('detail', help='Xem chi tiết một ví')
    dp.add_argument('--id',   type=int, help='ID ví (0-499)')
    dp.add_argument('--addr', help='Địa chỉ ví (tìm khớp chính xác đầu)')

    # withdraw
    wp = sub.add_parser('withdraw', help='Lọc giao dịch rút tiền')
    wp.add_argument('--network',   choices=NETWORKS, help='Mạng')
    wp.add_argument('--min',       type=float, help='Giá trị tối thiểu USD')
    wp.add_argument('--direction', choices=['in','out'], help='Chiều giao dịch')
    wp.add_argument('--status',    choices=['confirmed','pending','flagged'], help='Trạng thái')
    wp.add_argument('--limit',     type=int, default=20, help='Số kết quả (mặc định: 20)')
    wp.add_argument('--json',      action='store_true', help='Xuất JSON')
    wp.add_argument('--out',       help='Lưu ra file')

    # export
    ep = sub.add_parser('export', help='Xuất toàn bộ dữ liệu')
    ep.add_argument('--output', required=True, help='Đường dẫn file output (.json hoặc .csv)')
    ep.add_argument('--type',   choices=['wallets','withdrawals','all'], default='wallets', help='Loại dữ liệu')

    # load
    lp = sub.add_parser('load', help='Nạp dữ liệu từ file JSON')
    lp.add_argument('--file', required=True, help='Đường dẫn file JSON')
    lp.add_argument('--search', help='Tìm kiếm ngay sau khi nạp (từ khóa)')

    # summary
    sub.add_parser('summary', help='Hiển thị thống kê tổng quan')

    return parser


def main():
    parser = build_parser()
    args   = parser.parse_args()

    if not args.cmd:
        parser.print_help()
        sys.exit(0)

    print(f"\n  WFB v1.0  |  {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # Generate data
    wallets     = generate_wallets(500)
    withdrawals = generate_withdrawals(wallets, 150)

    # ── SEARCH ──────────────────────────────────────────────────────────────
    if args.cmd == 'search':
        results = search_wallets(
            wallets,
            addr=args.addr, name=args.name,
            network=args.network, wtype=args.type,
            min_val=args.min, max_val=args.max,
            token=args.token, dormant=args.dormant,
            sort=args.sort, limit=args.limit,
        )
        print_header(f"KẾT QUẢ TÌM KIẾM  —  {len(results)} ví tìm thấy")
        if args.json:
            print(json.dumps(results, ensure_ascii=False, indent=2, default=str))
        else:
            for i, w in enumerate(results):
                print_wallet_row(i, w)
        if args.out:
            if args.out.endswith('.csv'):
                export_csv_wallets(results, args.out)
            else:
                export_json(results, args.out)

    # ── DETAIL ──────────────────────────────────────────────────────────────
    elif args.cmd == 'detail':
        w = None
        if args.id is not None:
            matches = [x for x in wallets if x['id'] == args.id]
            w = matches[0] if matches else None
        elif args.addr:
            matches = [x for x in wallets if x['addr'].lower().startswith(args.addr.lower())]
            w = matches[0] if matches else None
        if w:
            print_wallet_detail(w)
        else:
            print(f"\n  [!] Không tìm thấy ví với tham số đã cho.")

    # ── WITHDRAW ────────────────────────────────────────────────────────────
    elif args.cmd == 'withdraw':
        results = search_withdrawals(
            withdrawals,
            network=args.network, min_val=args.min,
            direction=args.direction, status=args.status,
            limit=args.limit,
        )
        print_header(f"CHẾ ĐỘ RÚT  —  {len(results)} giao dịch")
        if args.json:
            print(json.dumps(results, ensure_ascii=False, indent=2, default=str))
        else:
            for i, w in enumerate(results):
                print_withdrawal_row(i, w)
        if args.out:
            if args.out.endswith('.csv'):
                export_csv_withdrawals(results, args.out)
            else:
                export_json(results, args.out)

    # ── EXPORT ──────────────────────────────────────────────────────────────
    elif args.cmd == 'export':
        out = args.output
        if args.type == 'wallets':
            if out.endswith('.csv'): export_csv_wallets(wallets, out)
            else: export_json(wallets, out)
        elif args.type == 'withdrawals':
            if out.endswith('.csv'): export_csv_withdrawals(withdrawals, out)
            else: export_json(withdrawals, out)
        elif args.type == 'all':
            base, ext = os.path.splitext(out)
            export_json({'wallets': wallets, 'withdrawals': withdrawals}, out)

    # ── LOAD ────────────────────────────────────────────────────────────────
    elif args.cmd == 'load':
        loaded = load_from_file(args.file)
        if not isinstance(loaded, list):
            print("  [!] File phải chứa danh sách (JSON array).")
            sys.exit(1)
        wallets = loaded
        if args.search:
            results = search_wallets(wallets, name=args.search, limit=20)
            print_header(f"TÌM '{args.search}'  —  {len(results)} kết quả")
            for i, w in enumerate(results):
                print_wallet_row(i, w)
        else:
            print_summary(wallets, [])

    # ── SUMMARY ─────────────────────────────────────────────────────────────
    elif args.cmd == 'summary':
        print_summary(wallets, withdrawals)


if __name__ == '__main__':
    main()
