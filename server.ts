import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI library with server-only key and a build User-Agent header for telemetry.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API routes go first
app.post("/api/ai-risk-insight", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: "Dữ liệu danh sách thẩm định không hợp lệ." });
    }

    // Filter items that aren't 'passed' yet or are high risk
    const actionNeededItems = items.filter(
      (item: any) => item.status !== "passed" || item.riskLevel === "high"
    );

    if (actionNeededItems.length === 0) {
      return res.json({
        insight: "### 🎉 Trạng thái tuyệt hảo!\n\nToàn bộ các hạng mục rà soát và kiểm định hiện trường đều đã **Đạt chuẩn (Passed)**. Không phát hiện rủi ro khẩn cấp hoặc điểm đỏ nào tồn đọng. Dự án hiện đạt mức an toàn tối đa để chuẩn bị xúc tiến việc ký kết hợp đồng sáp nhập chính thức giữa Fugalo và Dans la Peau.",
      });
    }

    // Format action points for the model
    const itemsSummary = actionNeededItems
      .map((item: any) => {
        const itemStatus =
          item.status === "passed"
            ? "Đạt chuẩn"
            : item.status === "failed"
            ? "Bất thường (Cần Hành Động)"
            : "Chưa rõ (Chưa Hoàn Thành)";
        return `- **[${item.id}] ${item.vietnameseQuestion}**: Mức rủi ro: ${item.riskLevel.toUpperCase()}, Trạng thái hiện tại: ${itemStatus}.\n  *Chi tiết rà duyệt:* ${item.details}\n  *Ghi chú hiện trường:* ${item.notes || "Chưa ghi nhận"}`;
      })
      .join("\n");

    const prompt = `Bạn là Giám đốc Quản trị Rủi ro và M&A Kỹ thuật của tổ chức đầu tư Fugalo, chịu trách nhiệm rà soát thương vụ sáp nhập và hợp tác thí điểm với nhãn hàng đồ da thủ công "Dans la Peau" (vận hành từ 2017 tại Thảo Điền TP.HCM & Hội An).

Dưới đây là danh sách tổng hợp các điểm đỏ chưa khớp hoặc các hạng mục "Cần hành động" đang được thẩm định thực tế (Due Diligence Checklist):

${itemsSummary}

Nhiệm vụ của bạn:
1. Đọc và phân loại các mối hiểm họa nghiêm trọng nhất (như nguy cơ tranh chấp nhãn hiệu quốc tế với LVMH, rào cản pháp lý upcycling vải bạt cũ Hermès/LV, hạn thuê showroom Thảo Điền sắp tới hạn, dòng tiền âm so với sổ sách kinh doanh hoặc năng lực xưởng 10.000m² cần thẩm định thực tế...).
2. Đưa ra đề xuất giải pháp cụ thể, thực tế và có tính pháp lý/vận hành phù hợp với môi trường kinh doanh tại Việt Nam (VD: Yêu cầu thêm giấy tờ gì, thiết lập điều khoản MOU thế nào, giải pháp thay thế là gì...).
3. Đề xuất phương án thương thảo trực tiếp để Fugalo (đại diện bởi Hồ Văn An) bảo toàn tài sản, tránh gánh nợ liên đới ẩn trước khi chính thức giải ngân đầu tư.

Yêu cầu định dạng phản hồi:
- Sử dụng tiếng Việt, phong cách hành văn kỹ trị, sắc bén, chuyên nghiệp, khách quan.
- Trả về dưới dạng Markdown chuẩn với các tiêu đề chính rõ ràng (### Phân Tích Điểm Đỏ, ### Đề Xuất Giải Pháp Ưu Việt, ### Lời Khuyên Đàm Phán MOU).
- Tránh viết lý thuyết suông chiêm nghiệm chung. Hãy đi thẳng vào các rủi ro đã nêu ở trên và đưa ra lời giải sắc nét nhất. Hãy giữ câu trả lời súc tích tầm 250 - 450 từ để thuận tiện đọc nhanh trên màn hình di động.`;

    // We use gemini-3.5-flash as the highly performant and economical default text generator
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const resultText = response.text || "Không có câu trả lời nào được tự động tạo từ mô hình AI.";
    res.json({ insight: resultText });
  } catch (error: any) {
    console.error("Gemini AI API Error inside Express Proxy:", error);
    res.status(500).json({
      error: error.message || "Xảy ra lỗi nghiêm trọng trong quá trình xử lý AI Risk Insights.",
    });
  }
});

async function bootstrap() {
  // Vite middleware development check
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running in container egress mode on http://0.0.0.0:${PORT}`);
  });
}

bootstrap();
