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
import java.net.URL;
import java.util.*;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

@Service
public class AiFlashcardServiceImpl implements AiFlashcardService {

    // Lấy API Key của Gemini từ file cấu hình application.yml
    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @jakarta.persistence.PersistenceContext
    private jakarta.persistence.EntityManager entityManager;

    @Autowired
    private FlashcardSetRepository flashcardSetRepository;

    @Autowired
    private FlashcardRepository flashcardRepository;

    @Autowired
    private DraftStorage draftStorage;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    // Luồng xử lý bất đồng bộ để không làm treo ứng dụng khi gọi AI
    private final Executor executor = Executors.newCachedThreadPool();

    // Hàm bóc tách văn bản từ đường dẫn URL của file PDF
    private String extractTextFromPdfUrl(String pdfUrl) throws Exception {
        URL url = new URL(pdfUrl);
        try (InputStream in = url.openStream();
                PDDocument document = PDDocument.load(in)) {
            PDFTextStripper pdfStripper = new PDFTextStripper();
            String text = pdfStripper.getText(document);
            // Giới hạn độ dài văn bản gửi lên AI để tránh lỗi token
            if (text != null && text.length() > 20000) {
                return text.substring(0, 20000);
            }
            return text;
        }
    }

    // Hàm gọi API của Google Gemini để xử lý nội dung
    private String callGeminiApi(String prompt) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="
                + geminiApiKey;

        // Cấu trúc payload theo yêu cầu của Google Gemini API
        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        Map<String, Object> contentPart = new HashMap<>();
        contentPart.put("parts", Collections.singletonList(textPart));

        Map<String, Object> requestBodyMap = new HashMap<>();
        requestBodyMap.put("contents", Collections.singletonList(contentPart));

        ObjectMapper mapper = new ObjectMapper();
        String requestBody = mapper.writeValueAsString(requestBodyMap);

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
        String response = restTemplate.postForObject(url, entity, String.class);

        // Trích xuất phần nội dung văn bản (text) từ kết quả trả về của AI
        JsonNode root = mapper.readTree(response);
        String aiText = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

        // Loại bỏ các thẻ markdown của JSON nếu AI trả về để lấy chuỗi JSON thuần
        return aiText.replaceAll("```json\n?", "").replaceAll("```", "").trim();
    }

    @Override
    public List<Map<String, String>> generateFlashcardsFromUrl(String pdfUrl, String title) throws Exception {
        String pdfText = extractTextFromPdfUrl(pdfUrl);
        String prompt = "Dựa vào nội dung tài liệu học thuật sau đây (Tên tài liệu: " + title + "):\n\n" + pdfText +
                "\n\nHãy tạo ra 5 đến 10 thẻ Flashcard học thuật để học sinh ôn tập." +
                "Yêu cầu TRẢ VỀ CHỈ MỘT MẢNG JSON thuần túy, KHÔNG chứa chữ nào khác, định dạng như sau:\n" +
                "[{\"frontText\": \"Câu hỏi hoặc khái niệm?\", \"backText\": \"Giải thích chi tiết\", \"hint\": \"Gợi ý ngắn gọn\"}]";

        String jsonResponse = callGeminiApi(prompt);
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(jsonResponse, new TypeReference<List<Map<String, String>>>() {
        });
    }

    // Tính năng nâng cao: Trả về luồng tiến độ (SSE) khi bóc tách Flashcards từ PDF
    @Override
    public SseEmitter extractFlashcardsStream(MultipartFile file) {
        // Tạo Emitter với thời gian chờ 2 phút
        SseEmitter emitter = new SseEmitter(120000L);

        executor.execute(() -> {
            try {
                // Bước 1: Đọc nội dung văn bản từ PDF
                emitter.send(SseEmitter.event().name("progress")
                        .data("{\"step\": 1, \"message\": \"Đang đọc file PDF...\", \"percent\": 20}"));

                String pdfText;
                try (InputStream in = file.getInputStream();
                        PDDocument document = PDDocument.load(in)) {
                    PDFTextStripper pdfStripper = new PDFTextStripper();
                    pdfText = pdfStripper.getText(document);
                    if (pdfText != null && pdfText.length() > 20000) {
                        pdfText = pdfText.substring(0, 20000);
                    }
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

                // Bước 3: Chuyển đổi chuỗi JSON của AI thành Object và lưu tạm vào Cache
                emitter.send(SseEmitter.event().name("progress")
                        .data("{\"step\": 3, \"message\": \"Đang hoàn thiện bản nháp...\", \"percent\": 90}"));

                ObjectMapper mapper = new ObjectMapper();
                // AI trả về danh sách các Flashcard thô
                List<Flashcard> flashcards = mapper.readValue(jsonResponse,
                        new TypeReference<List<Flashcard>>() {
                        });

                // Tạo ID bản nháp duy nhất
                String draftId = UUID.randomUUID().toString();
                
                // Bao bọc vào DTO phản hồi
                AiFlashcardDraftResponse draftResponse = AiFlashcardDraftResponse.builder()
                        .draftId(draftId)
                        .flashcards(flashcards)
                        .build();

                // Lưu vào DraftStorage
                draftStorage.saveDraft(draftId, draftResponse);

                // Gửi sự kiện hoàn tất về Frontend
                emitter.send(SseEmitter.event().name("complete")
                        .data(mapper.writeValueAsString(draftResponse)));
                emitter.complete();
            } catch (Exception e) {
                try {
                    // Nếu có lỗi, thông báo về Frontend để hiển thị Toast
                    emitter.send(SseEmitter.event().name("error").data("{\"message\": \"" + e.getMessage() + "\"}"));
                    emitter.completeWithError(e);
                } catch (Exception ex) {
                }
            }
        });

        return emitter;
    }

    // Lưu dữ liệu Flashcard sau khi giáo viên đã chỉnh sửa xong
    @Override
    public void saveFlashcardDraft(SaveFlashcardDraftRequest request, UUID teacherId) throws Exception {
        // Kiểm tra xem bản nháp còn tồn tại trong cache không
        AiFlashcardDraftResponse cachedDraft = draftStorage.getDraft(request.getDraftId());
        if (cachedDraft == null) {
            throw new IllegalArgumentException("Bản nháp không tồn tại hoặc đã hết hạn (Cache Timeout).");
        }

        // Tìm khóa học liên kết
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new IllegalArgumentException("Khóa học không tồn tại"));

        // Tạo mới bộ Flashcard Set
        FlashcardSet set = new FlashcardSet();
        set.setTitle(request.getTitle());
        set.setDescription(request.getDescription());
        set.setCourse(course);
        set.setCreatedBy(teacherId);
        set = flashcardSetRepository.save(set);

        // Lưu từng thẻ Flashcard vào database từ danh sách đã chỉnh sửa trong Request
        int order = 1;
        for (SaveFlashcardDraftRequest.FlashcardDraft fReq : request.getFlashcards()) {
            Flashcard f = new Flashcard();
            f.setFlashcardSet(set);
            f.setFrontText(fReq.getFrontText() + (fReq.getHint() != null && !fReq.getHint().isEmpty() ? " (Gợi ý: " + fReq.getHint() + ")" : ""));
            f.setBackText(fReq.getBackText());
            f.setOrder(order++);
            flashcardRepository.save(f);
        }

        // Tự động gửi thông báo cho tất cả học sinh đã đăng ký khóa học này
        List<User> students = classRepository.findStudentsByCourseId(course.getId());
        for (User student : students) {
            Notification notif = new Notification();
            notif.setUser(student);
            notif.setTitle("Nội dung mới từ lớp " + course.getName());
            notif.setContent("Giáo viên vừa tạo bộ Flashcard mới: " + set.getTitle() + ". Hãy vào ôn tập ngay nhé!");
            notificationRepository.save(notif);
        }

        // Xóa bản nháp khỏi cache sau khi đã lưu thành công
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