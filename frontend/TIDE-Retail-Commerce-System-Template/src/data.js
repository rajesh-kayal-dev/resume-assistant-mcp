export const NAV = [
  { label: "MODULES", href: "#modules" },
  { label: "WHY", href: "#why" },
  { label: "SYSTEM", href: "#system" },
  { label: "PLATFORM", href: "#platform" },
  { label: "PROGRAM", href: "#program" },
];

export const TYPE_PHRASES = [
  "ORDERING / PAYMENT / INVOICE / KITCHEN — ONE PIPELINE",
  "CASHLESS-FIRST RETAIL COMMERCE SYSTEM",
  "ENGINEERED AS ONE. NOT ASSEMBLED FROM PARTS.",
  "LIVE SHOWROOM — Q4 2026, XIMENDING",
];

export const MARQUEE = [
  "CASHLESS-FIRST", "EMBEDDED PAYMENT", "ANDROID 13+ GMS", "ZERO EXTERNAL READERS",
  "E-INVOICE NATIVE", "REAL-TIME KITCHEN", "ONE ORDER PIPELINE", "LIVE Q4 2026",
];

export const STATS = [
  { value: 0, suffix: "", label: "CASH REGISTERS", zh: "收銀機" },
  { value: 0, suffix: "", label: "EXTERNAL READERS", zh: "外掛讀卡機" },
  { value: 100, suffix: "%", label: "DIGITAL RAILS", zh: "數位收款" },
];

export const MODULES = [
  { icon: "solar:monitor-smartphone-linear", en: "KIOSK", zh: "自助點餐" },
  { icon: "solar:smartphone-linear", en: "MOBILE POS", zh: "手持服務" },
  { icon: "solar:card-linear", en: "PAYMENT", zh: "多軌收款" },
  { icon: "solar:document-text-linear", en: "E-INVOICE", zh: "電子發票" },
  { icon: "solar:display-linear", en: "KITCHEN", zh: "廚房看板" },
  { icon: "solar:box-linear", en: "INVENTORY", zh: "即時庫存" },
  { icon: "solar:chart-2-linear", en: "REPORTING", zh: "統一報表" },
  { icon: "solar:server-square-linear", en: "FLEET MGMT", zh: "裝置管理" },
];

export const WHY = [
  {
    icon: "solar:card-transfer-linear",
    en: "Payment, built in",
    zh: "支付內建,非外掛",
    body: "Contactless acceptance is embedded in certified hardware — no external terminals, no payment integration project. The merchant never has to think about it.",
  },
  {
    icon: "solar:database-linear",
    en: "One source of record",
    zh: "單一資料核心",
    body: "Orders, inventory, invoicing and reporting run on one core, one dataset. No middleware, no nightly sync, no reconciling three vendors' numbers.",
  },
  {
    icon: "solar:shield-check-linear",
    en: "Proven in production",
    zh: "真實營運驗證",
    body: "Before TIDE ships to any merchant, it runs a live store — real transactions, real volume, real uptime — at our Ximending showroom. We sell what we operate.",
  },
];

export const NODES = [
  {
    id: "01", icon: "solar:monitor-smartphone-linear", en: "KIOSK", zh: "自助點餐",
    body: "自助點餐工作站:選品、客製、感應支付於同一機身完成。支付模組原廠內建於認證硬體,正面零外掛裝置。",
  },
  {
    id: "02", icon: "solar:smartphone-linear", en: "MOBILE POS", zh: "手持服務",
    body: "行動服務終端:點餐、客製與收款於單一手持裝置完成,服務人員於現場直接成交,無需固定收銀點。",
  },
  {
    id: "03", icon: "solar:card-linear", en: "PAYMENT", zh: "多軌收款",
    body: "多軌收款架構:感應卡、行動裝置支付、QR 行動支付並行。授權於認證環境內執行,系統僅管理訂單與交易狀態。",
  },
  {
    id: "04", icon: "solar:document-text-linear", en: "E-INVOICE", zh: "電子發票",
    body: "電子發票引擎:付款授權完成即雲端開立,非同步處理、不阻塞結帳流程,紙本證明聯依需求於出餐端列印。",
  },
  {
    id: "05", icon: "solar:display-linear", en: "KITCHEN", zh: "廚房看板",
    body: "廚房作業看板:付款確認即時亮單,品項、客製與取件資訊同步顯示;完成狀態回傳前場,全程無紙本傳遞。",
  },
];

export const PIPELINE_DEFAULT =
  "付款授權完成的同一秒:發票雲端開立、庫存即時扣減、廚房看板亮單。三項作業並行觸發,無中介軟體、無批次同步——這是單一系統架構的直接結果。";

export const PLATFORM = [
  {
    key: "RUNTIME", spec: "Android 13+ · GMS-certified commercial devices",
    zh: "單一 Android 應用層,跨自助機、手持與廚房顯示部署",
  },
  {
    key: "PAYMENT", spec: "Embedded contactless acceptance · certified execution environment · multi-rail",
    zh: "感應收款內建機身,授權於認證環境內完成;系統管理訂單與交易狀態,不經手卡號",
  },
  {
    key: "FLEET MGMT", spec: "Zero-touch provisioning · kiosk lockdown · silent OTA updates",
    zh: "裝置出廠配置、營業模式鎖定與靜默遠端更新",
  },
  {
    key: "E-INVOICE", spec: "Cloud issuance, MOF-compliant · asynchronous, non-blocking",
    zh: "符合財政部電子發票規範,雲端開立、非同步處理、不阻塞結帳",
  },
  {
    key: "KITCHEN", spec: "IP65-rated display class · PoE-powered · real-time order push",
    zh: "不鏽鋼防水等級顯示設備、網路線供電、付款即時亮單",
  },
  {
    key: "CORE", spec: "Single order pipeline · real-time inventory · unified reporting",
    zh: "單一訂單管線:庫存、發票、報表同源,無批次同步",
  },
];

export const TIMELINE = [
  {
    period: "H1 2026", title: "System architecture finalized", status: "COMPLETE",
    zh: "端到端系統架構、金流模型與硬體規格定案。",
  },
  {
    period: "H2 2026", title: "Hardware integration & certification", status: "IN PROGRESS",
    zh: "實機整合、支付認證流程與全交易劇本驗證。",
  },
  {
    period: "Q4 2026", title: "Showroom opening, live operation", status: "SCHEDULED",
    zh: "西門町示範店啟用,進入真實營運與量測階段。",
  },
  {
    period: "2027", title: "General availability", status: "PLANNED",
    zh: "營運驗證完成後,以完整方案對外交付。",
  },
];