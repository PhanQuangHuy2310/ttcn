package com.ttcn.backend.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ttcn.backend.dto.request.SaveFlashcardDraftRequest;
import com.ttcn.backend.dto.response.AiFlashcardDraftResponse;
import com.ttcn.backend.entity.*;
import com.ttcn.backend.repository.*;
import com.ttcn.backend.service.AiFlashcardService;
import com.ttcn.backend.service.DraftStorage;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.*;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

/**
 * Lớp triển khai dịch vụ sinh thẻ Flashcard tự động bằng AI (Gemini).
 * 
 * MỤC ĐÍCH DÀNH CHO NGƯỜI MỚI HỌC:
 * - @Service đánh dấu đây là lớp nghiệp vụ (Business Logic Service) được Spring quản lý tự động (Spring Bean).
 * - Lớp này thực hiện:
 *   1. Đọc nội dung file PDF từ Client tải lên hoặc từ URL lưu trữ của Supabase.
 *   2. Gửi văn bản trích xuất được lên API Gemini của Google để sinh Flashcards.
 *   3. Phản hồi thời gian thực qua Server-Sent Events (SSE) để client hiển thị thanh tiến độ.
 *   4. Lưu bản nháp vào cache và ghi nhận vào Database khi người dùng xác nhận lưu.
 */
@Service
public class AiFlashcardServiceImpl implements AiFlashcardService {

    // Lấy API Key của Gemini từ file cấu hình application.yml / .env
    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @jakarta.persistence.PersistenceContext
    private jakarta.persistence.EntityManager entityManager;

    // Tiêm các Repository để thao tác với cơ sở dữ liệu thông qua Spring Data JPA
    @Autowired
    private FlashcardSetRepository flashcardSetRepository;

    @Autowired
    private FlashcardRepository flashcardRepository;

    @Autowired
    private DraftStorage draftStorage; // Dịch vụ lưu trữ tạm thời các bản nháp (cache)

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    /**
     * Khởi tạo Executor Service để thực hiện các luồng công việc chạy ngầm (Asynchronous thread execution).
     * - Cached Thread Pool sẽ tự động tạo luồng mới khi cần và tái sử dụng lại các luồng cũ đã hoàn thành công việc.
     * - Giúp xử lý các tiến trình gọi API AI nặng nề chạy ngầm, tránh làm tắc nghẽn (hang/block) luồng chính (Main Request Thread) của web server.
     */
    private final Executor executor = Executors.newCachedThreadPool();

    /**
     * Hàm bóc tách văn bản từ đường dẫn URL của file PDF.
     * 
     * TỐI ƯU HÓA:
     * - Bổ sung Connection/Read Timeout để tránh luồng bị treo vĩnh viễn khi mạng hoặc server lưu trữ PDF bị lỗi.
     * - Giới hạn kích thước văn bản gửi lên AI ở mức 20.000 ký tự để vừa tối ưu hóa tốc độ xử lý, vừa tránh lỗi giới hạn Token của API Gemini.
     */
    private String extractTextFromPdfUrl(String pdfUrl) throws Exception {
        URL url = new URL(pdfUrl);
        URLConnection conn = url.openConnection();
        
        // Thiết lập giới hạn thời gian chờ kết nối (10 giây) và thời gian chờ đọc dữ liệu (15 giây)
        conn.setConnectTimeout(10000);
        conn.setReadTimeout(15000);

        // Try-with-resources để tự động đóng InputStream và tài liệu PDF sau khi xử lý xong (Tránh rò rỉ bộ nhớ/file handle)
        try (InputStream in = conn.getInputStream();
             PDDocument document = PDDocument.load(in)) {
            PDFTextStripper pdfStripper = new PDFTextStripper();
            String text = pdfStripper.getText(document);
            
            if (text != null && text.length() > 20000) {
                return text.substring(0, 20000);
            }
            return text;
        }
    }

    /**
     * Hàm gọi API của Google Gemini để xử lý nội dung.
     * 
     * GIẢI THÍCH CHO NGƯỜI MỚI HỌC:
     * - Sử dụng RestTemplate của Spring để thực hiện gửi request POST kiểu HTTP JSON lên API Google.
     * - Cần định nghĩa đúng định dạng dữ liệu (Payload) mà Google Gemini quy định.
     */
    /**
     * Hàm gọi API của Google Gemini để xử lý nội dung với cơ chế tự động thử lại (Retry) và chuyển đổi mô hình dự phòng (Fallback).
     */
    private String callGeminiApi(String prompt) throws Exception {
        String[] models = {"gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"};
        Exception lastException = null;
        ObjectMapper mapper = new ObjectMapper();

        for (String model : models) {
            int retries = 3;
            long delay = 1000; // Khởi đầu chờ 1 giây

            for (int attempt = 1; attempt <= retries; attempt++) {
                try {
                    String url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + geminiApiKey;

                    Map<String, Object> textPart = new HashMap<>();
                    textPart.put("text", prompt);

                    Map<String, Object> contentPart = new HashMap<>();
                    contentPart.put("parts", Collections.singletonList(textPart));

                    Map<String, Object> requestBodyMap = new HashMap<>();
                    requestBodyMap.put("contents", Collections.singletonList(contentPart));

                    String requestBody = mapper.writeValueAsString(requestBodyMap);

                    RestTemplate restTemplate = new RestTemplate();
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.APPLICATION_JSON);

                    HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
                    String response = restTemplate.postForObject(url, entity, String.class);

                    JsonNode root = mapper.readTree(response);
                    String aiText = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

                    return cleanJsonResponse(aiText);
                } catch (org.springframework.web.client.HttpStatusCodeException e) {
                    lastException = e;
                    int statusCode = e.getStatusCode().value();
                    // Thử lại khi gặp lỗi tạm thời: 503 (Service Unavailable), 504 (Gateway Timeout), 429 (Too Many Requests), 500 (Internal Server Error)
                    if (statusCode == 503 || statusCode == 504 || statusCode == 429 || statusCode == 500) {
                        if (attempt < retries) {
                            Thread.sleep(delay);
                            delay *= 2; // Tăng gấp đôi thời gian chờ
                            continue;
                        }
                    }
                    break; // Gặp lỗi không phục hồi được hoặc hết lượt thử lại -> Chuyển mô hình khác
                } catch (Exception e) {
                    lastException = e;
                    if (attempt < retries) {
                        Thread.sleep(delay);
                        delay *= 2;
                        continue;
                    }
                    break;
                }
            }
        }
        throw new RuntimeException("Tất cả các mô hình AI của Gemini đều không khả dụng. Lỗi cuối cùng: " + (lastException != null ? lastException.getMessage() : "Unknown"), lastException);
    }

    /**
     * TỐI ƯU HÓA: Hàm làm sạch chuỗi JSON nhận được từ AI.
     * Loại bỏ các ký tự bọc markdown như ```json ... ``` hoặc các ký tự thừa trước/sau mảng JSON.
     */
    private String cleanJsonResponse(String rawResponse) {
        if (rawResponse == null) return "[]";
        
        String cleaned = rawResponse.trim();
        
        // Loại bỏ thẻ ```json ở đầu và ``` ở cuối nếu có
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replaceAll("^```json\\s*", "").replaceAll("```$", "").trim();
        }
        
        // Đề phòng trường hợp AI thêm văn bản mô tả xung quanh mảng JSON, tìm vị trí mảng [...]
        int start = cleaned.indexOf('[');
        int end = cleaned.lastIndexOf(']');
        if (start != -1 && end != -1 && end > start) {
            return cleaned.substring(start, end + 1);
        }
        
        return cleaned;
    }

    @Override
    public List<Map<String, String>> generateFlashcardsFromUrl(String pdfUrl, String title) throws Exception {
        String pdfText = extractTextFromPdfUrl(pdfUrl);
        
        // TỐI ƯU HÓA: Kiểm tra nếu nội dung PDF rỗng trước khi gửi lên AI để tiết kiệm API quota
        if (pdfText == null || pdfText.trim().isEmpty()) {
            throw new IllegalArgumentException("Không thể đọc được văn bản hoặc tài liệu PDF trống.");
        }

        String prompt = "Dựa vào nội dung tài liệu học thuật sau đây (Tên tài liệu: " + title + "):\n\n" + pdfText +
                "\n\nHãy tạo ra 5 đến 10 thẻ Flashcard học thuật để học sinh ôn tập." +
                "Yêu cầu TRẢ VỀ CHỈ MỘT MẢNG JSON thuần túy, KHÔNG chứa chữ nào khác, định dạng như sau:\n" +
                "[{\"frontText\": \"Câu hỏi hoặc khái niệm?\", \"backText\": \"Giải thích chi tiết\", \"hint\": \"Gợi ý ngắn gọn\"}]";

        String jsonResponse = callGeminiApi(prompt);
        ObjectMapper mapper = new ObjectMapper();
        
        // Chuyển đổi JSON dạng mảng thành cấu trúc danh sách List<Map> trong Java
        return mapper.readValue(jsonResponse, new TypeReference<List<Map<String, String>>>() {
        });
    }

    /**
     * Tính năng nâng cao: Trích xuất Flashcard từ PDF sử dụng Stream dữ liệu SSE (Server-Sent Events).
     * 
     * GIẢI THÍCH CHO NGƯỜI MỚI HỌC:
     * - Bình thường khi gọi API, client phải chờ server xử lý xong 100% rồi mới nhận phản hồi (gây treo UI ở giao diện).
     * - SSE cho phép Server liên tục "bắn" các sự kiện về Client (Ví dụ: "Đang đọc file...", "Đang phân tích...", "Đã xong").
     * - Giúp giao diện hiển thị phần trăm tiến trình (%) sinh động và tương tác mượt mà hơn.
     */
    @Override
    public SseEmitter extractFlashcardsStream(MultipartFile file) {
        // Tạo Emitter (Đối tượng phát sự kiện) với thời gian chờ tối đa 2 phút (120000 ms)
        SseEmitter emitter = new SseEmitter(120000L);

        // Chạy công việc bóc tách trong luồng ngầm chạy bất đồng bộ (Background Thread)
        executor.execute(() -> {
            try {
                // Bước 1: Đọc nội dung văn bản từ PDF
                emitter.send(SseEmitter.event().name("progress")
                        .data("{\"step\": 1, \"message\": \"Đang đọc file PDF...\", \"percent\": 20}"));

                String pdfText;
                // Try-with-resources đóng InputStream của file tải lên an toàn
                try (InputStream in = file.getInputStream();
                        PDDocument document = PDDocument.load(in)) {
                    PDFTextStripper pdfStripper = new PDFTextStripper();
                    pdfText = pdfStripper.getText(document);
                    if (pdfText != null && pdfText.length() > 20000) {
                        pdfText = pdfText.substring(0, 20000);
                    }
                }

                // TỐI ƯU HÓA: Kiểm tra dữ liệu trống trước khi gửi lên AI
                if (pdfText == null || pdfText.trim().isEmpty()) {
                    throw new IllegalArgumentException("Văn bản trong file PDF trống hoặc không thể giải mã.");
                }

                // Bước 2: Gửi nội dung lên AI phân tích và tạo Flashcards
                emitter.send(SseEmitter.event().name("progress")
                        .data("{\"step\": 2, \"message\": \"Đang gửi dữ liệu lên AI phân tích...\", \"percent\": 50}"));

                String prompt = "Dựa vào nội dung tài liệu sau:\n\n" + pdfText +
                        "\n\nHãy tạo ra bộ thẻ Flashcard (từ 5 đến 15 thẻ)." +
                        "Yêu cầu TRẢ VỀ CHỈ MỘT MẢNG JSON thuần túy, KHÔNG chứa markdown, đúng định dạng:\n" +
                        "[\n" +
                        "  {\"frontText\": \"Khái niệm A\", \"backText\": \"Định nghĩa của A\", \"hint\": \"Gợi ý nhỏ\"}\n" +
                        "]";

                String jsonResponse = callGeminiApi(prompt);

                // Bước 3: Chuyển đổi chuỗi JSON của AI thành Object và lưu tạm vào Cache bản nháp
                emitter.send(SseEmitter.event().name("progress")
                        .data("{\"step\": 3, \"message\": \"Đang hoàn thiện bản nháp...\", \"percent\": 90}"));

                ObjectMapper mapper = new ObjectMapper();
                List<Flashcard> flashcards = mapper.readValue(jsonResponse,
                        new TypeReference<List<Flashcard>>() {
                        });

                // Sinh ID ngẫu nhiên duy nhất cho bản nháp này bằng UUID
                String draftId = UUID.randomUUID().toString();
                
                // Bao bọc dữ liệu nháp vào DTO phản hồi
                AiFlashcardDraftResponse draftResponse = AiFlashcardDraftResponse.builder()
                        .draftId(draftId)
                        .flashcards(flashcards)
                        .build();

                // Lưu vào vùng nhớ tạm lưu trữ nháp
                draftStorage.saveDraft(draftId, draftResponse);

                // Gửi sự kiện hoàn tất "complete" kèm dữ liệu nháp về cho Frontend
                emitter.send(SseEmitter.event().name("complete")
                        .data(mapper.writeValueAsString(draftResponse)));
                
                // Đánh dấu hoàn tất việc phát sự kiện thành công
                emitter.complete();
            } catch (Exception e) {
                try {
                    // Nếu có bất kỳ lỗi nào xảy ra, gửi thông báo lỗi "error" về Client để hiển thị Toast thông báo lỗi
                    emitter.send(SseEmitter.event().name("error").data("{\"message\": \"" + e.getMessage() + "\"}"));
                    // Đóng luồng phát sự kiện kèm theo thông báo lỗi
                    emitter.completeWithError(e);
                } catch (Exception ex) {
                    // Bỏ qua lỗi phụ nếu luồng emitter đã bị ngắt kết nối trước đó
                }
            }
        });

        // Trả về emitter ngay lập tức cho Controller, trong khi luồng phụ bên trên vẫn tiếp tục chạy ngầm
        return emitter;
    }

    /**
     * Lưu dữ liệu Flashcard chính thức vào cơ sở dữ liệu sau khi giáo viên đã xem và chỉnh sửa bản nháp.
     */
    @Override
    public void saveFlashcardDraft(SaveFlashcardDraftRequest request, UUID teacherId) throws Exception {
        // 1. Kiểm tra xem bản nháp còn tồn tại trong cache không (Tránh trường hợp hết hạn bộ nhớ đệm cache)
        AiFlashcardDraftResponse cachedDraft = draftStorage.getDraft(request.getDraftId());
        if (cachedDraft == null) {
            throw new IllegalArgumentException("Bản nháp không tồn tại hoặc đã hết hạn (Cache Timeout).");
        }

        // 2. Tìm khóa học liên kết trong database, ném lỗi nếu không tìm thấy
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new IllegalArgumentException("Khóa học không tồn tại"));

        // 3. Tạo mới bộ thực thể Flashcard Set
        FlashcardSet set = new FlashcardSet();
        set.setTitle(request.getTitle());
        set.setDescription(request.getDescription());
        set.setCourse(course);
        set.setCreatedBy(teacherId);
        
        // Lưu bộ thẻ vào DB để nhận ID tự tăng của thực thể cha
        set = flashcardSetRepository.save(set);

        // 4. Duyệt qua từng thẻ flashcard trong yêu cầu gửi lên và lưu vào DB
        int order = 1;
        for (SaveFlashcardDraftRequest.FlashcardDraft fReq : request.getFlashcards()) {
            Flashcard f = new Flashcard();
            f.setFlashcardSet(set);
            // Ghép gợi ý (hint) trực tiếp vào nội dung câu hỏi mặt trước
            f.setFrontText(fReq.getFrontText() + (fReq.getHint() != null && !fReq.getHint().isEmpty() ? " (Gợi ý: " + fReq.getHint() + ")" : ""));
            f.setBackText(fReq.getBackText());
            f.setOrder(order++); // Thiết lập thứ tự sắp xếp của thẻ
            
            flashcardRepository.save(f); // Lưu thẻ vào DB
        }

        // 5. TỐI ƯU HÓA NÂNG CAO: Tự động tạo thông báo (Notification) cho tất cả học sinh đã đăng ký khóa học này
        List<User> students = classRepository.findStudentsByCourseId(course.getId());
        for (User student : students) {
            Notification notif = new Notification();
            notif.setUser(student);
            notif.setTitle("Nội dung mới từ lớp " + course.getName());
            notif.setContent("Giáo viên vừa tạo bộ Flashcard mới: " + set.getTitle() + ". Hãy vào ôn tập ngay nhé!");
            notificationRepository.save(notif);
        }

        // 6. Xóa bản nháp khỏi cache sau khi đã lưu thành công vào cơ sở dữ liệu để giải phóng bộ nhớ RAM
        draftStorage.clearDraft(request.getDraftId());
    }

    @Override
    public List<Map<String, String>> extractFlashcards(MultipartFile file) throws Exception {
        String pdfText;
        try (InputStream in = file.getInputStream();
             PDDocument document = PDDocument.load(in)) {
            PDFTextStripper pdfStripper = new PDFTextStripper();
            pdfText = pdfStripper.getText(document);
            if (pdfText != null && pdfText.length() > 20000) {
                pdfText = pdfText.substring(0, 20000);
            }
        }

        if (pdfText == null || pdfText.trim().isEmpty()) {
            throw new IllegalArgumentException("Không thể trích xuất văn bản hoặc file PDF rỗng.");
        }

        String prompt = "Dựa vào nội dung tài liệu sau:\n\n" + pdfText +
                "\n\nHãy tạo ra bộ thẻ Flashcard từ các khái niệm và nội dung chính (từ 5 đến 15 thẻ)." +
                "Yêu cầu TRẢ VỀ CHỈ MỘT MẢNG JSON thuần túy, KHÔNG chứa markdown, đúng định dạng:\n" +
                "[\n" +
                "  {\"frontText\": \"Khái niệm A\", \"backText\": \"Định nghĩa của A\", \"hint\": \"Gợi ý nhỏ\"}\n" +
                "]";

        String jsonResponse = callGeminiApi(prompt);
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(jsonResponse, new TypeReference<List<Map<String, String>>>() {});
    }
}