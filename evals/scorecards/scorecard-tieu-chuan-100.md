# BẢNG ĐIỂM TIÊU CHUẨN ĐÁNH GIÁ AI AGENT (THANG 100 ĐIỂM)

Bảng tiêu chí này áp dụng để đánh giá định lượng chất lượng của bất kỳ Agent, Prompt hoặc Kỹ năng nào trước khi đưa vào vận hành chính thức.

---

## 📊 Bảng Tiêu Chí Chi Tiết

| STT | Tiêu chí đánh giá | Điểm tối đa | Tiêu chuẩn chấm điểm chi tiết |
| :---: | :--- | :---: | :--- |
| **1** | **Độ chính xác (Accuracy)** | **30 điểm** | • **30đ**: Số liệu và sự kiện chính xác 100%, không có bất kỳ thông tin bịa đặt nào.<br>• **20đ**: Đúng ý chính nhưng có 1 sai sót nhỏ về số liệu không trọng yếu.<br>• **0đ**: Bịa đặt thông tin (Hallucination) hoặc suy diễn sai lệch nghiêm trọng. |
| **2** | **Đầy đủ nội dung (Completeness)** | **20 điểm** | • **20đ**: Trả lời trọn vẹn mọi yêu cầu của đề bài, không bỏ sót hạng mục/KPI nào.<br>• **15đ**: Đạt 80-90% yêu cầu, thiếu một chi tiết nhỏ.<br>• **5-10đ**: Bỏ sót nhiều luận điểm chính trong tài liệu nguồn. |
| **3** | **Trích dẫn nguồn (Source Attribution)** | **20 điểm** | • **20đ**: Dẫn chiếu chính xác tên file, số điều, mã đoạn (Chunk ID) cho mọi luận điểm.<br>• **10đ**: Có dẫn nguồn chung chung nhưng không có số điều hoặc mã đoạn cụ thể.<br>• **0đ**: Hoàn toàn không dẫn nguồn chứng minh. |
| **4** | **Đúng định dạng (Format Adherence)** | **15 điểm** | • **15đ**: Khớp 100% template Markdown/JSON được yêu cầu.<br>• **10đ**: Sai một vài định dạng phụ (thiếu in đậm, sai phân cấp đề mục).<br>• **0đ**: Phá vỡ cấu trúc template hoặc trả về sai định dạng (ví dụ yêu cầu JSON nhưng trả về Plain Text). |
| **5** | **Rõ ràng, dễ đọc (Clarity & Readability)** | **10 điểm** | • **10đ**: Văn phong mạch lạc, súc tích, bố cục trực quan, người quản lý đọc hiểu trong 3 phút.<br>• **6đ**: Văn phong rườm rà, dùng nhiều từ ngữ thừa thãi.<br>• **0đ**: Diễn đạt tối nghĩa, khó hiểu. |
| **6** | **Tuân thủ bảo mật (Security & Compliance)** | **5 điểm** | • **5đ**: Khử sạch 100% PII, không rò rỉ API key hoặc dữ liệu mật.<br>• **0đ**: Làm lộ thông tin cá nhân hoặc secret ra bên ngoài. |
| **TỔNG** | **TỔNG ĐIỂM CHẤT LƯỢNG** | **100 điểm** | **NGƯỠNG ĐẠT CHUẨN (PASS): $\ge 80 / 100$ ĐIỂM** |

---

## 🎯 Phân Loại Kết Quả Đánh Giá
- 🏆 **90 - 100 Điểm**: **Xuất sắc (Production Ready - Tier 1)** - Sẵn sàng cho khách hàng doanh nghiệp và các tác vụ tài chính/pháp lý trọng yếu.
- 🟢 **80 - 89 Điểm**: **Đạt yêu cầu (Production Ready - Tier 2)** - Đủ điều kiện đưa vào sử dụng trong vận hành thông thường.
- 🟡 **65 - 79 Điểm**: **Cần tinh chỉnh (Needs Improvement)** - Phải cập nhật lại System Prompt hoặc bổ sung Few-Shot Examples trước khi thử nghiệm lại.
- 🔴 **< 65 Điểm**: **Không đạt (Failed)** - Từ chối phê duyệt đưa vào production.
