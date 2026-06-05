/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Copy, Printer, CheckCircle, Mail, Globe, MapPin, Landmark, Sparkles } from "lucide-react";

interface ProposalMakerProps {
  clearanceScore: number;
}

export default function ProposalMaker({ clearanceScore }: ProposalMakerProps) {
  const [copied, setCopied] = useState(false);
  const [proposingPartnerName, setProposingPartnerName] = useState("Ban Giám Đốc Dans la Peau");
  const [signeeName, setSigneeName] = useState("Hồ Văn An");

  const todayStr = new Date().toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const rawMemoText = `
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
----------------------------
BẢN ĐỀ XUẤT HỢP TÁC VÀ PHÁT TRIỂN THƯƠNG HIỆU LIÊN DOANH
(STRATEGIC PARTNERSHIP MEMORANDUM)

Kính gửi: ${proposingPartnerName}
Đại diện đề xuất: Ông/Bà ${signeeName} - Ban Thẩm định Chiến lược Fugalo (Email: anhovan.fu@gmail.com)
Ngày lập đề xuất: ${todayStr}

Căn cứ vào thế mạnh cốt lõi và tệp khách hàng cao cấp hiện hữu của cả hai thương hiệu, Fugalo đề xuất mô hình hợp tác đa phương diện theo lộ trình tối ưu 4 bước để đảm bảo tính an toàn pháp lý, kiểm chứng năng lực vận hành và tối đa hóa biên lợi nhuận thương mại.

1. ĐỊNH HƯỚNG MÔ HÌNH "CO-FOUNDER" THỰC TẾ:
Fugalo đề xuất KHÔNG bước vào ngay với tư cách đồng sáng lập pháp nhân gốc của Dans la Peau. Hai bên sẽ hướng tới đồng sáng lập một nhánh chuyên biệt / dòng sản phẩm liên doanh mới:
"Fugalo x Dans la Peau – Luxury Leather Care, Bespoke & Circular Craft".

2. LỘ TRÌNH 4 GIAI ĐOẠN KHÔNG RỦI RO:
- Giao đoạn 1 (Ngày 1 - 90): Ký kết MOU thử nghiệm thương mại dài hạn 90 ngày tại showroom Fugalo (Dĩ An, Bình Dương). Test 4 nhóm sản phẩm: Watch straps, Hộp đồng hồ da, Khay đa năng, và gói Spa Refresh.
- Giai đoạn 2 (Tháng 4 - 5): Ra mắt bộ sưu tập capsule "Fugalo x Dans la Peau" với concept bền vững "Crafted for the Second Life of Luxury".
- Giai đoạn 3 (Tháng 6 - 9): Nhận quyền đại lý phân phối độc quyền có điều kiện liên quan đến dòng capsule, cam kết doanh thu tối thiểu mỗi quý.
- Giai đoạn 4 (Tháng 10 trở đi): Đàm phán thành lập công ty liên doanh độc lập hoặc mua 20% - 35% cổ phần chiến lược của Dans la Peau sau khi hoàn thiện kiểm toán.

3. TIÊU CHUẨN THẨM ĐỊNH (DUE DILIGENCE MẮT XÍCH CƠ BẢN):
Fugalo sẽ tiến hành thanh tra thực địa các thủ tục sau trước khi giải ngân dòng vốn:
- Kiểm tra quyền sở hữu thực, pháp nhân đứng sau thương hiệu Dans la Peau.
- Rà soát báo cáo doanh thu 24 tháng gần nhất và biên lợi nhuận gộp danh mục sản phẩm.
- Tra cứu tranh chấp nhãn hiệu "DANS LA PEAU" (Vấn đề bảo hộ của Louis Vuitton Malletier tại Mỹ/WIPO).
- Xác minh thực tế xưởng sản xuất 10.000 m² và số lượng thợ cả lành nghề.

4. CHỈ SỐ KPI CAM KẾT (BENCHMARKS):
- Tỷ lệ bán chéo khách VIP Fugalo mua DLP: Đạt từ 10% - 15%.
- Biên lợi nhuận gộp dòng Capsule: Đạt trên 40%.
- Tỷ lệ giao hàng đúng hạn (Bespoke/Lẻ): Trên 90%.
- Tỷ lệ bảo hành lỗi sản phẩm: Dưới 5%.

Trân trọng gửi đến đối tác Dans la Peau bản đề án chuẩn mực để cùng bàn thảo chi tiết các bước đi tiếp theo.

ĐẠI DIỆN BAN GIÁM ĐỐC FUGALO
Ông ${signeeName} (đã ký)
`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(rawMemoText.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in" id="proposal-maker-section">
      
      {/* INTRO GRID */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-mono text-amber-600 uppercase tracking-widest font-bold">Xuất hồ sơ chuyên nghiệp</span>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900">Xuất Bản Đề Xuất Hợp Tác Gửi Đối Tác</h3>
            <p className="text-xs text-stone-600 font-semibold">
              Cấu hình thông tin người nhận và ký tên để tự động soạn thảo Biên bản ghi nhớ nhắm tiếp cận tinh tế, tối đa hợp tác.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs cursor-pointer select-none transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? "Đã sao chép!" : "Sao chép biên bản"}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 bg-stone-50 hover:bg-stone-100 text-stone-750 border border-stone-200 rounded-lg text-xs cursor-pointer select-none transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In bản đề án</span>
            </button>
          </div>
        </div>

        {/* Dynamic fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-stone-100 font-sans">
          <div className="space-y-1">
            <label className="text-xs text-stone-500 font-bold block">Kính gửi Đối tác (Người nhận):</label>
            <input 
              type="text" 
              value={proposingPartnerName}
              onChange={(e) => setProposingPartnerName(e.target.value)}
              className="w-full text-xs text-stone-800 bg-stone-50 border border-stone-200 rounded p-2 focus:outline-none focus:border-amber-600 font-semibold"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-stone-500 font-bold block">Đại diện ký phát (Fugalo):</label>
            <input 
              type="text" 
              value={signeeName}
              onChange={(e) => setSigneeName(e.target.value)}
              className="w-full text-xs text-stone-800 bg-stone-50 border border-stone-200 rounded p-2 focus:outline-none focus:border-amber-600 font-semibold"
            />
          </div>
        </div>
      </div>

      {/* RENDERED PRINT EMBED */}
      <div className="bg-[#FAF8F5] border-2 border-stone-200 rounded-xl p-8 sm:p-12 text-stone-850 font-serif relative shadow-xl max-w-3xl mx-auto overflow-hidden">
        {/* Visual watermark of premium luxury quality */}
        <div className="absolute inset-0 border border-stone-300 m-4 pointer-events-none" />
        <div className="absolute top-8 right-8 border border-stone-300/40 opacity-5 w-44 h-44 rounded-full flex items-center justify-center font-bold tracking-widest text-8xl font-serif">
          F×D
        </div>

        {/* Document header styling */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-block px-3 py-1 bg-stone-900 text-[#FAF8F5] text-[10px] font-sans font-bold uppercase tracking-widest rounded">
            Fugalo Executive Memorandum
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-sans font-semibold tracking-widest uppercase text-stone-500">
              Cộng hòa Xã hội Chủ nghĩa Việt Nam
            </h2>
            <p className="text-xs font-sans tracking-wide text-stone-500">Độc lập - Tự do - Hạnh phúc</p>
            <div className="w-24 h-[1px] bg-stone-400 mx-auto mt-2" />
          </div>
          
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 pt-3">
            BẢN ĐỀ XUẤT HỢP TÁC CHIẾN LƯỢC VÀ PHÁT TRIỂN
          </h1>
          <p className="text-xs italic text-stone-500 font-sans">
            Mã hiệu tài liệu: FGL-DLP-JV-2026-REV1
          </p>
        </div>

        {/* Metadata info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans border-b border-stone-300 pb-5 mb-6 text-stone-600">
          <div className="space-y-1">
            <div><strong className="text-stone-900">Kính gửi:</strong> {proposingPartnerName}</div>
            <div><strong className="text-stone-900">Người thực hiện:</strong> {signeeName} (BOD Fugalo)</div>
          </div>
          <div className="space-y-1 sm:text-right">
            <div><strong className="text-stone-900">Thời gian đề xuất:</strong> {todayStr}</div>
            <div><strong className="text-stone-900">Thẩm định ban đầu:</strong> {clearanceScore}% Clearance rate</div>
          </div>
        </div>

        {/* Body markup */}
        <div className="space-y-5 text-sm leading-relaxed text-stone-800 font-serif">
          <p>
            Căn cứ vào dữ liệu khảo sát và tệp khách hàng sở hữu hàng hiệu của <strong className="text-stone-950">Công ty TNHH Fugalo</strong> cùng tay nghề đồ da thủ công truyền bản của <strong className="text-stone-950">Dans la Peau</strong>, chúng tôi kính gửi Giám đốc và Nhà sáng lập Dans la Peau dự thảo cơ hội thiết lập mối liên kết thương mại tối ưu như sau:
          </p>

          <div className="space-y-2">
            <h4 className="font-sans font-semibold text-stone-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-stone-800 rounded-full" />
              #1. Định vị thương hiệu liên thông mới
            </h4>
            <p className="text-xs italic pl-4 text-stone-600">
              Hai bên sẽ không sáp nhập thương hiệu Dans la Peau gốc ngay từ đầu. Thay vào đó đề xuất thành lập một nhánh kinh doanh đồng sở hữu chuyên trách: <strong>"Fugalo x Dans la Peau – Luxury Leather Care, Bespoke & Circular Craft"</strong>. Điều này vừa bảo toàn tính thuần khiết thủ công lịch sử của Dans la Peau vừa tích hợp được sức tiếp cận hiện đại của hệ sinh thái resale tuần hoàn của Fugalo.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-sans font-semibold text-stone-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-stone-800 rounded-full" />
              #2. Thử thách Thương mại & Lộ trình 90 ngày Pilot
            </h4>
            <p className="text-xs pl-4 text-stone-600">
              Nhằm kiểm định chính xác sức mua của tệp khách VIP trước khi giải ngân dòng tiền, hai bên cùng ký kết Biên bản ghi nhớ (MOU) hợp tác 90 ngày. Fugalo tiến hành trưng bày 10-15 dòng sản phẩm bán chạy nhất tại Showroom Bình Dương và mở rộng các dịch vụ: dập thẻ tên dán túi dán va li, dây đồng hồ bespoke và các phụ kiện sỉ cho hộp đồng hồ/khay đĩa đa năng.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-sans font-semibold text-stone-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-stone-800 rounded-full" />
              #3. Thủ tục Thẩm định Pháp lý và Tài chính (Mở rộng)
            </h4>
            <p className="text-xs pl-4 text-stone-600">
              Đồng thời trong 90 ngày thử nghiệm, Fugalo cử pháp lý sấn sâu khảo sát hồ sơ của Dans la Peau, đặc biệt kiểm tra tranh chấp thương hiệu nhãn hiệu Dans la Peau đã đăng ký diện rộng bởi Louis Vuitton ở phía quốc tế, cũng như thực tế văn phòng xưởng chế tạo 10.000 m² và chi tiết công nợ trưng dụng cũ trước khi bàn ký góp vốn dài hạn.
            </p>
          </div>

          <p className="text-xs text-stone-500 font-sans italic pt-4">
            *Biên bản mang tính chất đề thảo đàm phán sơ bộ, bảo mật thông tin nội bộ giữa Fugalo Co., Ltd và Dans la Peau. Mọi chi tiết sao chép, chỉnh lý đều được hệ thống ghi nhận.
          </p>
        </div>

        {/* Signature block */}
        <div className="mt-12 pt-6 border-t border-stone-300 flex justify-between text-xs font-sans text-stone-600 relative z-10">
          <div>
            <div className="font-bold text-stone-800 uppercase">Đối tác Dans la Peau</div>
            <div className="text-[10px] mt-1 text-stone-400">Đề xuất xem xét chuẩn hóa</div>
            <div className="h-12" />
            <div className="italic text-stone-400">Chưa ký nhận</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-stone-800 uppercase">Thẩm Định Viên Chiến Lược Fugalo</div>
            <div className="text-[10px] mt-1 text-stone-400">Xác thực hệ thống</div>
            <div className="h-12" />
            <div className="italic font-serif text-stone-900 font-bold">{signeeName}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
