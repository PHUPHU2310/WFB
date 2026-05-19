# � WFB - Whale Finance Board

Hệ thống giám sát tài chính tiền điện tử toàn cầu — theo dõi giao dịch lớn (whale), bản đồ ví real-time, biểu đồ phân tích và tích hợp ví Web3.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![PWA](https://img.shields.io/badge/PWA-ready-brightgreen.svg)

## ✨ Tính năng

- 🐋 **Whale Tracker** - Theo dõi giao dịch lớn theo thời gian thực
- 🗺️ **Bản đồ toàn cầu** - Hiển thị ví và giao dịch trên bản đồ thế giới (Leaflet.js)
- 📊 **Biểu đồ phân tích** - Trực quan hóa dữ liệu với Chart.js
- 💼 **Kết nối MetaMask** - Tích hợp ví Web3
- 🔐 **Xác thực bảo mật** - Đăng nhập với mã hóa MD5
- 🌐 **6 Blockchain** - Ethereum, Bitcoin, BSC, Solana, Polygon, Avalanche
- 📱 **PWA** - Cài đặt như ứng dụng native trên mọi thiết bị
- 🐍 **Python CLI** - Công cụ dòng lệnh để tìm kiếm, phân tích và xuất dữ liệu ví
- 📜 **Smart Contract** - SavingWallet hỗ trợ nạp/rút ETH on-chain

## 🛠️ Công nghệ sử dụng

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Framework**: Bootstrap 5
- **Libraries**:
  - Leaflet.js - Interactive world map
  - Chart.js - Data visualization
  - Web3.js - Blockchain integration
  - CryptoJS - Encryption
- **Backend / CLI**: Python 3 (`wfb.py`)
- **Smart Contract**: Solidity ^0.8.0 (`contracts/SavingWallet.sol`)
- **PWA**: Service Worker + Web App Manifest
- **API**: CoinGecko API (miễn phí)

## 📦 Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/PHUPHU2310/WFB.git
cd WFB
```

### 2. Mở ứng dụng

Chỉ cần mở file `login.html` trong trình duyệt:

```bash
# Windows
start login.html

# macOS
open login.html

# Linux
xdg-open login.html
```

Hoặc sử dụng Live Server (VS Code):
- Cài đặt extension "Live Server"
- Right-click `login.html` → "Open with Live Server"

### 3. Sử dụng Python CLI

```bash
# Tìm kiếm ví theo tên
python wfb.py search --name "Binance"

# Lọc theo mạng và giá trị tối thiểu
python wfb.py search --network ethereum --min 1000000

# Lọc whale và sắp xếp theo giá trị
python wfb.py search --type whale --sort value

# Xem chi tiết một ví
python wfb.py detail --id 0

# Lọc giao dịch rút
python wfb.py withdraw --min 5000000 --direction out

# Xuất kết quả ra file
python wfb.py export --output results.json

# Xem trợ giúp
python wfb.py --help
```

## 📁 Cấu trúc dự án

```
WFB/
├── index.html          # Dashboard chính
├── login.html          # Trang đăng nhập
├── app.js              # Logic ứng dụng (whale tracker, map, charts)
├── style.css           # Stylesheet
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker
├── wfb.py              # Python CLI tool
├── data.json           # Dữ liệu mẫu
├── result.csv          # Kết quả xuất CSV
├── contracts/
│   └── SavingWallet.sol  # Smart contract Solidity
└── README.md
```

## 🔑 Đăng nhập

Sử dụng thông tin đăng nhập đã được cấu hình trong hệ thống.

## 📜 Giấy phép

Dự án này được cấp phép theo giấy phép MIT. Xem file [LICENSE](LICENSE) để biết chi tiết.

