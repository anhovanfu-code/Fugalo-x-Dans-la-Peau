/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  DueDiligenceItem, TimelinePhase, KPITargetItem,
  AdvisorItem, DataRoomFolder, WeeklyMilestone, PresetSKU 
} from "./types";

export const BRAND_PROFILES = {
  fugalo: {
    name: "Fugalo Co., Ltd",
    established: "June 2024 (MST: 3703215910)",
    showroom: "Dĩ An, Bình Dương",
    positioning: "Luxury Resale, Consignment & Authentication Hub",
    coreStrengths: [
      "Sở hữu tệp khách hàng VIP / High-net-worth individuals chuộng hàng hiệu",
      "Uy tín về kiểm định hàng hiệu, spa cao cấp, kéo dài vòng đời sản phẩm",
      "Tư duy kể chuyện 'Tái sinh giá trị' (Circular Luxury) hiện đại",
      "Bộ máy tiếp thị & khả năng xúc tiến thương mại nhanh bén"
    ],
    roleInPartnership: "Cung cấp tệp khách hàng, năng lực tiếp thị, kênh bán hàng và câu chuyện thương hiệu 'Circular luxury'"
  },
  dansLaPeau: {
    name: "Dans la Peau",
    established: "2017 (Thảo Điền, Quận 2, TP.HCM)",
    showroom: "TP.HCM & Hội An (boutiques)",
    positioning: "Premium Handcrafted Leather Goods & Bespoke Craftsmanship",
    coreStrengths: [
      "Lịch sử vận hành từ 2017 với thợ thủ công lành nghề, sản phẩm tinh xảo",
      "Năng lực Bespoke và Cá nhân hóa (Personalization) vượt trội",
      "Danh mục sản phẩm phong phú (bags, wallets, hand-carved, thổ cẩm...)",
      "Tuyên bố năng lực sản xuất B2B lớn (Wholesale/Corporate Gifts)"
    ],
    roleInPartnership: "Cung cấp kỹ thuật chế tác đồ da thủ công, thiết kế sản phẩm, năng lực vận chuyển/fulfillment và xưởng sản xuất"
  }
};

export const SYNERGY_AXES = [
  {
    axis: "Luxury Resale & Consignment",
    fugaloContrib: "Khách mua/ký gửi túi, đồng hồ hiệu",
    dlpContrib: "Phụ kiện da tinh xảo cho hàng hiệu",
    opportunity: "Tăng giá trị đơn hàng trung bình (AOV), phụ kiện đi kèm tôn vinh túi hiệu chính hãng.",
    score: 85
  },
  {
    axis: "Luxury Spa, Repair & Care",
    fugaloContrib: "Niềm tin kiểm định, dịch vụ phục chế túi hiệu",
    dlpContrib: "Kỹ thuật đồ da, phục hồi sơn cạnh, thay lót",
    opportunity: "Tạo gói chăm sóc toàn diện túi/đồng hồ, cá nhân hóa chi tiết nhỏ cho khách VIP.",
    score: 90
  },
  {
    axis: "Bespoke & On-Demand Craft",
    fugaloContrib: "Tệp khách VIP muốn độc bản, siêu sang",
    dlpContrib: "Phác thảo, chế tác độc xảo theo yêu cầu",
    opportunity: "Sản xuất dây đồng hồ da cá sấu/patina, khay đa năng hộp đồng hồ, ruột túi chống mất form.",
    score: 95
  },
  {
    axis: "Premium Corporate Gifting",
    fugaloContrib: "Mối quan hệ doanh nghiệp & tệp đối tác lớn",
    dlpContrib: "Quà tặng da cao cấp dập logo riêng biệt",
    opportunity: "Gói quà da thiết kế riêng (ví card, passport) cho khách doanh nghiệp nhân dịp lễ Tết.",
    score: 80
  },
  {
    axis: "Storytelling & Brand Power",
    fugaloContrib: "Concept 'Tái sinh giá trị' (Resale/Second Life)",
    dlpContrib: "Câu chuyện di sản, thủ công Việt Nam đương đại",
    opportunity: "Ra mắt bộ sưu tập capsule 'Crafted for the Second Life of Luxury' đầy tính phát triển bền vững.",
    score: 88
  }
];

export const DUE_DILIGENCE_DB: DueDiligenceItem[] = [
  // Legal
  {
    id: "leg-01",
    category: "legal",
    question: "Who is the ultimate beneficial owner of the brand and assets?",
    vietnameseQuestion: "Ai là chủ sở hữu thực của Dans la Peau?",
    details: "Phải xác định rõ chủ thể đại diện ký dòng đời thương hiệu, tránh các đồng sáng lập cũ hoặc thành viên ẩn có quyền phủ quyết.",
    status: "pending",
    riskLevel: "high"
  },
  {
    id: "leg-02",
    category: "legal",
    question: "Is there a registered corporate entity behind Dans la Peau?",
    vietnameseQuestion: "Có pháp nhân chính thức nào đứng sau thương hiệu không?",
    details: "Xác minh mối liên hệ giữa pháp nhân ký hợp đồng với thương hiệu thực tế và quyền sử dụng nhãn hiệu.",
    status: "pending",
    riskLevel: "medium"
  },
  {
    id: "leg-03",
    category: "legal",
    question: "Trademark ownership in local and target markets?",
    vietnameseQuestion: "Nhãn hiệu 'Dans la Peau' đã đăng ký bảo hộ độc quyền chưa?",
    details: "Tra cứu Cục Sở hữu trí tuệ Việt Nam. Đặc biệt lưu ý nhãn hiệu này đã được sở hữu bởi Louis Vuitton Malletier trong nhóm nước hoa/phát triển mỹ phẩm tại Mỹ.",
    status: "pending",
    riskLevel: "high"
  },
  {
    id: "leg-04",
    category: "legal",
    question: "Ownership of digital assets (domains, social media accounts)?",
    vietnameseQuestion: "Domain, website, fanpage, Instagram, Etsy do ai sở hữu?",
    details: "Đảm bảo mọi tài khoản mạng xã hội và tên miền đều do pháp nhân chung hoặc người đại diện ủy quyền sở hữu rõ ràng bằng văn bản.",
    status: "pending",
    riskLevel: "medium"
  },
  
  // Financial
  {
    id: "fin-01",
    category: "financial",
    question: "What are the audited revenues of the last 24 months?",
    vietnameseQuestion: "Doanh thu thực tế trong 24 tháng gần nhất?",
    details: "Yêu cầu cung cấp báo cáo kết quả hoạt động kinh doanh (P&L), hóa đơn mua nguyên liệu để kiểm chứng năng lực vận hành thật.",
    status: "pending",
    riskLevel: "high"
  },
  {
    id: "fin-02",
    category: "financial",
    question: "Gross and Net Margins by product category?",
    vietnameseQuestion: "Biên lợi nhuận gộp theo từng dòng sản phẩm?",
    details: "Xác định rõ biên lợi nhuận của: sản phẩm sẵn có, bespoke, dây đồng hồ, mảng wholesale quà tặng doanh nghiệp.",
    status: "pending",
    riskLevel: "high"
  },
  {
    id: "fin-03",
    category: "financial",
    question: "Outstanding debts, taxes, and rental labilities?",
    vietnameseQuestion: "Các khoản nợ, nghĩa vụ thuế và chi phí mặt bằng?",
    details: "Rà soát nợ nhà cung cấp da, các cam kết thuê cửa hàng tại Hội An, Thảo Điền để tránh gánh nợ liên đới.",
    status: "pending",
    riskLevel: "medium"
  },
  {
    id: "fin-04",
    category: "financial",
    question: "Current inventory valuation and defect write-offs?",
    vietnameseQuestion: "Trị giá hàng tồn kho thực và tỷ lệ hao hụt / sản phẩm lỗi?",
    details: "Đánh giá chất lượng da tồn kho, hàng lỗi mốt, khấu hao sản phẩm trưng bày.",
    status: "pending",
    riskLevel: "low"
  },

  // Production
  {
    id: "prod-01",
    category: "production",
    question: "Does the 10,000 m² workshop exist and under what ownership?",
    vietnameseQuestion: "Nhà xưởng 10.000 m² là sở hữu hay thuê/gia công bên ngoài?",
    details: "Tham quan trực tiếp, kiểm tra giấy tờ thuê đất/xưởng. Điều này ảnh hưởng trực tiếp đến năng lực đáp ứng đơn hàng wholesale lớn.",
    status: "pending",
    riskLevel: "high"
  },
  {
    id: "prod-02",
    category: "production",
    question: "How many active artisans and what is their monthly capacity?",
    vietnameseQuestion: "Số lượng thợ thủ công lành nghề và công suất thực tế/tháng?",
    details: "Đo lường thời gian sản xuất (Lead Time) trung bình cho đơn lẻ, đơn 100 sản phẩm và đơn 1000 sản phẩm.",
    status: "pending",
    riskLevel: "medium"
  },
  {
    id: "prod-03",
    category: "production",
    question: "Provenance and certification of imported leathers?",
    vietnameseQuestion: "Nguồn gốc da nhập khẩu có chứng từ hải quan/C/O rõ ràng?",
    details: "Đồ da cao cấp đòi hỏi nguồn da (Epsom, Togo, Patina...) rõ xuất xứ dán mác bền vững hoặc tiêu chuẩn quốc tế để có thể xuất khẩu.",
    status: "pending",
    riskLevel: "high"
  },

  // Brand
  {
    id: "brand-01",
    category: "brand",
    question: "Actual customer breakdown and repeat purchase rate?",
    vietnameseQuestion: "Hồ sơ thực của tệp khách hiện tại là ai?",
    details: "Xác định tỷ lệ khách du lịch vãng lai (Hội An), khách trung thành nội địa hay nhóm khách sỉ từ trước đến nay.",
    status: "pending",
    riskLevel: "medium"
  },
  {
    id: "brand-02",
    category: "brand",
    question: "Why is the global Etsy store currently inactive?",
    vietnameseQuestion: "Vì sao gian hàng quốc tế Etsy hiện ngừng bán?",
    details: "Tìm hiểu rào cản vận chuyển quốc tế, cổng thanh toán hoặc khiếu nại chất lượng từ khách nước ngoài trước đây.",
    status: "pending",
    riskLevel: "medium"
  },

  // IP Risk
  {
    id: "ip-01",
    category: "ip",
    question: "Legal risks of upcycling/reconstruction of luxury fabrics?",
    vietnameseQuestion: "Rủi ro pháp lý khi cắt ghép vải/da hàng hiệu làm sản phẩm phụ?",
    details: "Fugalo tuyệt đối không tự ý cắt ghép monogram cũ (LV, Chanel) để dán sang ví mới nếu không có luật sư tư vấn, vì lỗi này vi phạm bản quyền gốc cực nặng và làm ảnh hưởng uy tín kiểm định chính hãng của Fugalo.",
    status: "pending",
    riskLevel: "high"
  }
];

export const COOPERATION_TIMELINE: TimelinePhase[] = [
  {
    phaseNumber: 1,
    title: "MOU & 90-Day Pilot",
    vietnameseTitle: "Giai đoạn 1: MOU & 90 Ngày Pilot",
    duration: "Ngày 1 - Thay đổi ngày 90",
    objective: "Thẩm định toàn diện kết hợp chạy thử thực nghiệm 90 ngày để đánh giá khả năng bán và vận hành chung mà chưa ràng buộc góp vốn.",
    tasks: [
      { id: "p1-t1", text: "Ký kết thỏa thuận bảo mật (NDA) và Biên bản ghi nhớ (MOU) 90 ngày.", completed: false },
      { id: "p1-t2", text: "Thu thập tài liệu thẩm định (Due Diligence): Pháp lý, tài chính, kiểm chứng showroom, tham quan xưởng sản xuất.", completed: false },
      { id: "p1-t3", text: "Trưng bày thử nghiệm 10-15 SKU bán chạy nhất của Dans la Peau tại showroom Fugalo.", completed: false },
      { id: "p1-t4", text: "Thử nghiệm 4 nhóm sản phẩm/dịch vụ mẫu tại kênh bán: Dây đồng hồ, khay/hộp da, quà cá nhân hoá dập chữ.", completed: false },
      { id: "p1-t5", text: "Thực hiện ngày hội VIP personal leather stamping tại showroom Fugalo.", completed: false }
    ],
    status: "active"
  },
  {
    phaseNumber: 2,
    title: "Capsule 'Fugalo x DLP'",
    vietnameseTitle: "Giai đoạn 2: Bộ sưu tập Capsule 'Fugalo x DLP'",
    duration: "Tháng thứ 4 - Tháng thứ 5",
    objective: "Ra mắt dòng sản phẩm chung có dấu ấn bền vững 'Crafted for the Second Life of Luxury' sử dụng da cao cấp đạt tiêu chuẩn.",
    tasks: [
      { id: "p2-t1", text: "Chốt danh sách sản phẩm capsule (Watch-roll, Strap dập chữ, Card-holder, Organizers cao cấp).", completed: false },
      { id: "p2-t2", text: "Hoàn thiện thiết kế đồng thương hiệu biểu trưng cho tính Circular Luxury.", completed: false },
      { id: "p2-t3", text: "Truyền thông kể câu chuyện thủ công di sản Việt Nam kết hợp phong thái Luxury Resale.", completed: false },
      { id: "p2-t4", text: "Sản xuất mẻ thử đầu tiên (30-50 bộ mỗi SKU), giám sát chất lượng sườn cạnh và sơn.", completed: false }
    ],
    status: "upcoming"
  },
  {
    phaseNumber: 3,
    title: "Conditional Exclusivity",
    vietnameseTitle: "Giai đoạn 3: Độc quyền phân phối có điều kiện",
    duration: "Tháng thứ 6 - Tháng thứ 9",
    objective: "Fugalo bảo vệ độc quyền phân phối nhóm capsule hoặc phân khúc luxury resale, bù lại cam kết lượng bán bao tiêu doanh thu cụ thể.",
    tasks: [
      { id: "p3-t1", text: "Thống nhất KPI doanh số tối thiểu từng quý để duy trì quyền độc quyền dòng.", completed: false },
      { id: "p3-t2", text: "Xây dựng quy trình hỗ trợ đổi trả, bảo hành nhanh chóng (7-10 ngày làm việc).", completed: false },
      { id: "p3-t3", text: "Tích hợp dịch vụ dập tên cá nhân hóa cho mọi sản phẩm ký gửi/nhâp môn.", completed: false }
    ],
    status: "upcoming"
  },
  {
    phaseNumber: 4,
    title: "Joint Venture & Corporate Equity",
    vietnameseTitle: "Giai đoạn 4: Liên doanh hoặc Góp vốn",
    duration: "Từ tháng thứ 10 trở đi",
    objective: "Lập công ty liên doanh mới đồng sở hữu hoặc Fugalo chính thức đầu tư mua cổ phần thiểu số (20-35%) trong thương hiệu Dans la Peau gốc.",
    tasks: [
      { id: "p4-t1", text: "Đánh giá toàn diện kết quả kinh doanh 9 tháng hợp tác.", completed: false },
      { id: "p4-t2", text: "Lựa chọn cấu trúc: Thành lập liên doanh mới độc lập hay mua cổ phần trực tiếp thương hiệu chính.", completed: false },
      { id: "p4-t3", text: "Ký kết văn bản pháp lý cổ đông, định giá giá trị thương mại, hoàn thành quá trình góp vốn hợp pháp.", completed: false }
    ],
    status: "upcoming"
  }
];

export const KPI_BENCHMARKS: KPITargetItem[] = [
  {
    id: "kpi-01",
    metric: "Customer Cross-Sell Rate",
    description: "Percentage of Fugalo clients purchasing a DLP accessory or service add-on.",
    vietnameseMetric: "Tỷ lệ chéo khách hàng",
    vietnameseDescription: "Tỷ lệ khách hàng mua/ký gửi tại Fugalo mua thêm gói chăm sóc hoặc phụ kiện Dans la Peau.",
    targetValue: "10% - 15%",
    currentValue: 12,
    unit: "%",
    status: "achieved",
    scoreMultiplier: 0.25
  },
  {
    id: "kpi-02",
    metric: "Gross Margin (Co-Branded Line)",
    description: "Calculated margin after deducting production, material, and initial delivery costs.",
    vietnameseMetric: "Biên lợi nhuận gộp danh mục",
    vietnameseDescription: "Biên lợi nhuận gộp sau khi chiết khấu, đo lường trên các dòng sản phẩm bespoke và capsule.",
    targetValue: ">= 40%",
    currentValue: 43,
    unit: "%",
    status: "achieved",
    scoreMultiplier: 0.25
  },
  {
    id: "kpi-03",
    metric: "On-Time Fulfillment Rate",
    description: "Artisanal orders delivered on or before the committed date.",
    vietnameseMetric: "Tỷ lệ giao hàng đúng tiến độ",
    vietnameseDescription: "Khả năng đáp ứng thời gian chế tác (chậm nhất 10 ngày cho các đơn hàng bespoke lẻ).",
    targetValue: ">= 90%",
    currentValue: 88,
    unit: "%",
    status: "warning",
    scoreMultiplier: 0.2
  },
  {
    id: "kpi-04",
    metric: "Product Quality Defect Rate",
    description: "Quality control failures, customer returns, or active service warranty requests.",
    vietnameseMetric: "Tỷ lệ hàng lỗi bảo hành",
    vietnameseDescription: "Tỷ lệ phản hồi bảo hành lỗi bung chỉ, hỏng sơn cạnh, sần sùi khóa kim loại trong vòng 1 năm.",
    targetValue: "< 5%",
    currentValue: 3.2,
    unit: "%",
    status: "achieved",
    scoreMultiplier: 0.2
  },
  {
    id: "kpi-05",
    metric: "B2B Corporate Account Success",
    description: "Securing at least one scalable recurring corporate gift client.",
    vietnameseMetric: "Doanh thu sỉ doanh nghiệp",
    vietnameseDescription: "Ký kết và hoàn thiện thành công ít nhất một tệp đơn quà tặng sỉ lớn cho VIP doanh nghiệp.",
    targetValue: ">= 1 đơn hợp đồng",
    currentValue: 1.0,
    unit: "hợp đồng",
    status: "achieved",
    scoreMultiplier: 0.1
  }
];

export const ADVISORY_TEAM: AdvisorItem[] = [
  {
    role: "IP Lawyer / Đại diện SHTT được cấp phép",
    timeline: "Ngày 1",
    scope: "Clearance search Việt Nam + quốc tế, opinion memo, chiến lược nhãn hiệu và brand-usage",
    budget: "8 – 15 triệu VND"
  },
  {
    role: "Corporate/M&A Lawyer",
    timeline: "Ngày 1",
    scope: "NDA, MOU, Pilot Master Terms, exclusivity, option/equity/JV",
    budget: "8 – 20 triệu VND"
  },
  {
    role: "Forensic Accountant / Soát xét kế toán",
    timeline: "Ngày 3",
    scope: "Soát doanh thu thật, VAT, dòng tiền, inventory, công nợ, margin theo SKU",
    budget: "6 – 15 triệu VND"
  },
  {
    role: "Production Auditor / Tư vấn QC sản phẩm da",
    timeline: "Ngày 5",
    scope: "Audit xưởng, capacity, bộ định mức nguyên liệu (BOM), tỷ lệ phế, subcontractor map",
    budget: "5 – 12 triệu VND"
  },
  {
    role: "Brand/Compliance Advisor",
    timeline: "Khi chốt capsule",
    scope: "Rà soát hình ảnh, đặt tên, tránh gây nhầm lẫn với các nhà mốt xa xỉ (Hermès, Chanel...)",
    budget: "4 – 8 triệu VND"
  }
];

export const DATA_ROOM_FOLDERS: DataRoomFolder[] = [
  {
    id: "dr-corporate",
    name: "Corporate Documents",
    vietnameseName: "Hồ sơ Pháp nhân & Cửa hàng",
    requiredDocuments: [
      "Giấy CNĐKDN/đăng ký hộ kinh doanh",
      "Điều lệ công ty hiện hành",
      "Danh sách cổ đông / thành viên góp vốn",
      "Hợp đồng thuê cửa hàng (Thảo Điền, Hội An) và xưởng sản xuất",
      "Giấy tờ tùy thân đại diện pháp luật"
    ],
    whatToCheck: "Pháp nhân nào thực sự sở hữu thương hiệu và có quyền ký hợp đồng; thời hạn và điều kiện thuê cửa hàng/xưởng.",
    redFlags: "Thương hiệu do cá nhân khác sở hữu; người ký không có thẩm quyền hợp pháp; hợp đồng thuê sắp hết hạn hoặc không cho phép chuyển nhượng."
  },
  {
    id: "dr-finance",
    name: "Tax & Financial Documents",
    vietnameseName: "Tài chính & Thuế khóa",
    requiredDocuments: [
      "Báo cáo quản trị P&L/BS/CF 24 tháng gần nhất",
      "Tờ khai thuế GTGT (VAT returns) 12 tháng",
      "Sao kê tài khoản ngân hàng hoạt động 12 tháng",
      "Bảng phân tích tuổi nợ (AP/AR aging) và nợ vay",
      "Biên bản kiểm kê hàng tồn kho thực tế và giá trị khống"
    ],
    whatToCheck: "Tính xác thực của doanh thu công bố, biên lợi nhuận gộp thực tế của từng SKU, các rủi ro nợ thuế hay nợ nhà cung cấp da.",
    redFlags: "Doanh thu báo cáo không khớp sao kê ngân hàng; hàng tồn già cỗi khó bán; biên lợi nhuận gộp âm ở các sản phẩm trụ cột; nợ thuế quá hạn."
  },
  {
    id: "dr-ip",
    name: "IP & Intellectual Property",
    vietnameseName: "Sở hữu trí tuệ & Tài sản số",
    requiredDocuments: [
      "Bằng chứng nhận/đơn đăng ký nhãn hiệu, logo tại Cục SHTT",
      "Hợp đồng chuyển nhượng quyền sử dụng hình ảnh/logo từ designer",
      "Quyền sở hữu tên miền (domain) danslapeau.com.vn",
      "Quyền quản trị (Admin proof) Haravan, Meta Business, Instagram, Zalo, Etsy"
    ],
    whatToCheck: "Xác minh ai đứng tên nhãn hiệu và tài khoản số; chuỗi chuyển nhượng quyền sở hữu hình ảnh thiết kế đã khép chặt chưa.",
    redFlags: "Nhãn hiệu chưa nộp bảo hộ hoặc đứng tên cá nhân riêng; các kênh mạng xã hội do nhân viên cũ nắm giữ; sử dụng tài sản trí tuệ của thương hiệu xa xỉ khác."
  },
  {
    id: "dr-channels",
    name: "Commercial & Channels",
    vietnameseName: "Kênh phân phối & Doanh số",
    requiredDocuments: [
      "Báo cáo doanh số 12 tháng theo từng kênh (boutique, website, B2B)",
      "Báo cáo tỷ lệ hoàn/đổi và CSAT",
      "Funnel website, GA4, Haravan admin export",
      "Danh sách khách hàng doanh nghiệp sỉ (Corporate gifts)"
    ],
    whatToCheck: "Xác minh kênh nào tạo ra dòng tiền chính; tệp khách hàng có thực sự ổn định hay phụ thuộc nhiều vào khách du lịch vãng lai.",
    redFlags: "Phụ thuộc vào 1-2 khách hàng sỉ duy nhất; chi phí quảng cáo (CAC) tăng vọt; danh mục wholesales trống trơn trên thực tế."
  },
  {
    id: "dr-production",
    name: "Production & Supply Chain",
    vietnameseName: "Năng lực Chế tác & Cung ứng",
    requiredDocuments: [
      "Danh sách nhà cung cấp da hạt, chỉ khâu, keo, khóa kim loại",
      "Định mức nguyên vật liệu (BOM) chi tiết của các SKU dòng pilot",
      "Hồ sơ năng lực máy móc thiết bị và mặt bằng xưởng 10.000 m²",
      "Nhật ký lỗi (defect log) và bảo hành sản phẩm"
    ],
    whatToCheck: "Xác minh xưởng 10.000 m² thực tế hoạt động thế nào, nguồn da nhập khẩu có nguồn gốc an toàn và ổn định không.",
    redFlags: "Không có bảng BOM chi tiết cho từng sản phẩm; xưởng quảng cáo khống (thực chất là đi gia công bên ngoài); tỷ lệ hàng lỗi/rework vượt mức 5%."
  }
];

export const WEEKLY_MILESTONES: WeeklyMilestone[] = [
  {
    week: 1,
    focus: "Ký NDA, thiết lập ban chỉ đạo chung, đại diện Fugalo gửi danh sách yêu cầu Data Room, bàn giao yêu cầu nghiên cứu thương hiệu độc quyền cho IP Counsel.",
    output: "Thỏa thuận NDA được ký bởi đại diện pháp luật đầy đủ thẩm quyền; cấu trúc Folder lưu trữ tài liệu chung được xác lập.",
    stopCondition: "Đối tác trì hoãn hoặc từ chối ký NDA; không chỉ định được đầu mối chịu trách nhiệm làm việc chính."
  },
  {
    week: 2,
    focus: "Rà soát sơ bộ pháp lý pháp nhân, thuế khóa & nhãn hiệu; cử nhân sự tham khảo/site visit thực tế cửa hàng Thảo Điền; chốt danh sách sơ bộ các mẫu SKU muốn thí điểm.",
    output: "Biên bản khảo sát thực tế cửa hàng (foot-traffic, bày trí); danh sách Long-list 15+ SKU tiềm năng cho pilot.",
    stopCondition: "Phát hiện nhãn hiệu có mâu thuẫn lớn chưa có hướng giải quyết; đối tác không mở truy cập danh mục Data Room cơ bản."
  },
  {
    week: 3,
    focus: "Cố vấn sản xuất tiến hành audit thực tế xưởng chế tác; kiểm nghiệm bảng định mức nguyên vật liệu (BOM); xây dựng bảng Unit Economics chi tiết cho từng mẫu.",
    output: "Báo cáo Audit xưởng chế tác (mặt bằng, máy móc, thợ lành nghề); bảng toán chi phí gốc (COGS) và mức chiết khấu mục tiêu.",
    stopCondition: "Thực tế xưởng chênh lệch quá lớn so với giới thiệu (không có xưởng hoặc xưởng hưu trí); đối tác không cung cấp được BOM đầy đủ."
  },
  {
    week: 4,
    focus: "Mẫu thử đầu tiên (Golden Samples) hoàn thiện để Fugalo kiểm nghiệm đường kim mũi chỉ, sơn cạnh; thống nhất danh mục SKU chính thức và cơ sở dữ liệu đối soát KPI.",
    output: "Bộ Golden Samples được ký duyệt chất lượng bởi Fugalo; khuôn mẫu POS & Dashboard báo cáo kinh doanh chung hoàn chỉnh.",
    stopCondition: "Mẫu thử bị lỗi quá tỷ lệ cho phép (>5%); không chốt được SLA tiến độ giao hàng dưới 10 ngày."
  },
  {
    week: 5,
    focus: "Ký kết MOU Hợp tác thí điểm 90 ngày và Pilot Master Terms chính thức; thiết lập không gian 'Fugalo x DLP Corner' tại showroom; preload tệp CRM chăm sóc khách VIP.",
    output: "Bộ hợp đồng Pilot đầy đủ chữ ký; góc trưng bày hoàn thiện tinh tế; chiến dịch thông báo tới khách hàng VIP của Fugalo sẵn sàng kích hoạt.",
    stopCondition: "Hai bên không đồng thuận được các điều khoản ràng buộc cốt lõi (Exclusivity, Rev-share, Quyền kiểm toán doanh số)."
  },
  {
    week: 6,
    focus: "Kích hoạt Soft Launch: Giới thiệu kín tới các khách hàng VIP đang ký gửi/kiểm định túi hiệu/đồng hồ tại showroom và gửi thư một-một.",
    output: "Giao dịch bán thử nghiệm đầu tiên phát sinh thành công; ghi nhận 20-30 khách hàng tiềm năng đưa vào phễu tư vấn.",
    stopCondition: "Phản hồi thử nghiệm từ khách hàng VIP cực đoan về chất lượng hoặc mức định giá."
  },
  {
    week: 7,
    focus: "Chính thức công bố online: Ra mắt Landing Page co-brand; xuất bản chuỗi video kể chuyện thủ công, chế tác dây đồng hồ tại xưởng truyền thống.",
    output: "Trang đích (Landing Page) chính thức hoạt động; tối thiểu 6-8 ấn phẩm media (reels / bài viết) được phân phối đa kênh.",
    stopCondition: "Phát sinh khiếu nại bản quyền hình ảnh hoặc tranh chấp truyền thông với các nhà mốt xa xỉ."
  },
  {
    week: 8,
    focus: "Tổ chức ngày hội trải nghiệm showroom đợt một: 'Watch Strap Fitting Day' - Đo đạc dây đồng hồ da bespoke trực tiếp cho khách hàng thượng lưu.",
    output: "Báo cáo ngày hội (đại diện tham dự, số lượng đặt cọc dây MTO, attach-rate mua chéo đạt chỉ tiêu).",
    stopCondition: "Năng lực biểu diễn và đo vẽ thực tế của thợ chế tác tại showroom không đáp ứng trải nghiệm luxury."
  },
  {
    week: 9,
    focus: "Đánh giá tỷ lệ tiêu thụ hàng tồn (sell-through); rà soát chất lượng thành phẩm thực tế và thời gian hoàn thiện; tiến hành loại bỏ SKU chậm, reorder mẻ SKU nhanh.",
    output: "Dữ liệu phân tích hiệu suất SKU giữa kỳ; phân loại tinh lọc danh mục mẫu cho 30 ngày cuối.",
    stopCondition: "Thời gian giao hàng trung bình bị trễ kế hoạch (>3 ngày); tỷ lệ khách hàng yêu cầu bảo hành/đổi trả vượt 4%."
  },
  {
    week: 10,
    focus: "Tổ chức ngày hội showroom đợt hai: 'Leather Personalization Weekend' - dập chữ khắc tên lá vàng cho ví card/travel tags; đẩy mạnh chào giá sỉ quà tặng Corporate.",
    output: "Báo cáo sự kiện dập chữ; danh sách 5-10 đầu mối doanh nghiệp đang gửi báo giá quà tặng sỉ.",
    stopCondition: "Không phát sinh được leads B2B triển vọng sau khi chào sỉ."
  },
  {
    week: 11,
    focus: "Kích hoạt đợt tiếp cận CRM đợt hai dành cho tập khách mua túi xách; ra mắt dòng phụ kiện 'Bag Organizer' theo mẫu túi Hermès/Chanel phổ biến để tăng attach-rate.",
    output: "Doanh thu tăng trưởng mạnh từ mảng Bag Organizer; tỷ lệ đính kèm (attach-rate) dịch vụ/sản phẩm đạt mốc tối thiểu.",
    stopCondition: "Tôn phom bên trong của Bag Organizer gây xước xé lót da nguyên bản của túi hiệu khách hàng (Fatal Quality Error)."
  },
  {
    week: 12,
    focus: "Tổng hợp hồ sơ thẩm định tài chính, xưởng, IP đầy đủ; họp ban điều phối hai bên để rà soát tiến độ hoàn thành KPI mục tiêu.",
    output: "Bản thảo báo cáo đóng gói kết quả thẩm định toàn diện (Final DD Report & KPI Checklist); dán tag trạng thái các Gate.",
    stopCondition: "Còn các khoản nợ thuế lớn hoặc tranh chấp pháp lý tiềm ẩn của đối tác chưa được làm sạch."
  },
  {
    week: 13,
    focus: "Đánh giá ngày thứ 90: Chốt quyết định tiếp xúc Capsule dài hạn và Exclusivity; hoặc ký Term Sheet liên doanh NewCo/Equity góp vốn nếu vượt KPI xuất sắc.",
    output: "Văn bản quyết định chính thức (Decision Memo); dự thảo điều khoản thương lượng Term Sheet dài hạn hoặc Biên bản đóng thí điểm an toàn.",
    stopCondition: "Tổng kết 90 ngày không đạt ngưỡng doanh thu tối thiểu (85 triệu VND) hoặc biên gộp trượt dưới 40%."
  }
];

export const PRESET_SKUS: PresetSKU[] = [
  {
    id: "sku-strap-std",
    name: "Dây đồng hồ Personalised (Standard)",
    targetRetail: 850000,
    costEstimate: 380000,
    marginTarget: 55,
    leadTime: "5 - 7 ngày",
    role: "Entry SKU - Đi kèm phân khúc khách đồng hồ tầm trung"
  },
  {
    id: "sku-strap-prem",
    name: "Dây đồng hồ Personalised (Premium/Unique)",
    targetRetail: 1250000,
    costEstimate: 560000,
    marginTarget: 55,
    leadTime: "7 - 10 ngày",
    role: "Upsell cá nhân hóa chuyên sâu, biên lợi nhuận cao"
  },
  {
    id: "sku-card-2",
    name: "Bóp đựng thẻ (Card Holder - 2 Slots)",
    targetRetail: 680000,
    costEstimate: 300000,
    marginTarget: 56,
    leadTime: "3 - 5 ngày",
    role: "Entry quà tặng, dễ bọc quà đính kèm"
  },
  {
    id: "sku-card-3",
    name: "Mini Zipper / Card Holder 3 Slots",
    targetRetail: 1250000,
    costEstimate: 560000,
    marginTarget: 55,
    leadTime: "5 - 7 ngày",
    role: "Mid-ticket, dễ khắc trực tiếp tên khách VIP"
  },
  {
    id: "sku-tag",
    name: "Thẻ hành lý da (Travel Tag)",
    targetRetail: 850000,
    costEstimate: 360000,
    marginTarget: 58,
    leadTime: "3 - 5 ngày",
    role: "Quà tặng đính kèm đơn hàng lớn, tỷ lệ attach rất tốt"
  },
  {
    id: "sku-passport",
    name: "Bao hộ chiếu (Passport Cover)",
    targetRetail: 980000,
    costEstimate: 430000,
    marginTarget: 56,
    leadTime: "5 - 7 ngày",
    role: "Sản phẩm du lịch bán kèm đồng bộ với Travel Tag"
  },
  {
    id: "sku-money",
    name: "Ví kẹp tiền (Money Clip Wallet)",
    targetRetail: 1650000,
    costEstimate: 760000,
    marginTarget: 54,
    leadTime: "5 - 7 ngày",
    role: "Ví quà tặng VIP nam, thiết kế thanh mảnh cuốn hút"
  },
  {
    id: "sku-box-1",
    name: "Hộp đồng hồ du lịch đơn (Luxury Watch Box 1 Slot)",
    targetRetail: 2250000,
    costEstimate: 1150000,
    marginTarget: 49,
    leadTime: "10 - 14 ngày",
    role: "Phụ kiện đi kèm cho khách ký gửi sỉ đồng hồ cao cấp"
  },
  {
    id: "sku-organizer",
    name: "Bag Organizer (Tấm lót định phom túi xách hiệu)",
    targetRetail: 1450000,
    costEstimate: 800000,
    marginTarget: 45,
    leadTime: "7 - 10 ngày",
    role: "SKU mới đề xuất phù hợp tuyệt đối cho tệp khách túi hiệu"
  }
];

