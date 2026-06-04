package com.ttcn.backend.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ttcn.backend.dto.request.SaveExamDraftRequest;
import com.ttcn.backend.dto.response.AiQuestionDraftResponse;
import com.ttcn.backend.entity.ClassEntity;
import com.ttcn.backend.entity.Course;
import com.ttcn.backend.entity.Exam;
import com.ttcn.backend.entity.Question;
import com.ttcn.backend.repository.ClassRepository;
import com.ttcn.backend.repository.CourseRepository;
import com.ttcn.backend.repository.ExamRepository;
import com.ttcn.backend.repository.QuestionRepository;
import com.ttcn.backend.service.AiExamService;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.net.URLConnection;
import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Lớp triển khai dịch vụ quản lý Đề thi AI (Gemini).
 * 
 * MỤC ĐÍCH DÀNH CHO NGƯỜI MỚI HỌC:
 * - Lớp này đảm nhận việc bóc tách tài liệu bài giảng/đề kiểm tra để tạo đề kiểm tra hoàn chỉnh.
 * - Có tích hợp cơ chế Caching (Redis/In-Memory Cache) giúp nâng cao tốc độ tải và giảm số lượng truy vấn trùng lặp tới CSDL.
 */
@Service
public class AiExamServiceImpl implements AiExamService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final ExamRepository examRepository;
    private final QuestionRepository questionRepository;
    private final CourseRepository courseRepository;
    private final ClassRepository classRepository;
    private final ObjectMapper objectMapper; // Đối tượng Jackson dùng để parse chuỗi JSON thành Java Object và ngược lại

    /**
     * Constructor Injection để nhúng các Repository cần thiết.
     */
    public AiExamServiceImpl(ExamRepository examRepository, 
                              QuestionRepository questionRepository, 
                              CourseRepository courseRepository, 
                              ClassRepository classRepository) {
        this.examRepository = examRepository;
        this.questionRepository = questionRepository;
        this.courseRepository = courseRepository;
        this.classRepository = classRepository;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Bóc tách hoặc tự sinh câu hỏi từ file PDF tải lên tùy theo tham số docType.
     * 
     * @param file File PDF chứa tài liệu.
     * @param docType "QUESTIONS" (Trích xuất nguyên văn câu hỏi có sẵn) hoặc "THEORY" (Tự sinh câu hỏi từ lý thuyết).
     */
    @Override
    public List<AiQuestionDraftResponse> extractQuestionsFromPdf(MultipartFile file, String docType) throws Exception {
        String pdfText = extractTextFromPdf(file);

        // TỐI ƯU HÓA: Kiểm tra nếu PDF trống để dừng sớm và báo lỗi cho người dùng
        if (pdfText == null || pdfText.trim().isEmpty()) {
            throw new IllegalArgumentException("Không thể đọc hoặc trích xuất văn bản từ tài liệu PDF trống.");
        }

        String prompt;
        if ("QUESTIONS".equalsIgnoreCase(docType)) {
            prompt = "Dựa vào nội dung tài liệu sau đây (đây là một đề bài hoặc danh sách các câu hỏi đã có sẵn):\n\n" + pdfText +
                    "\n\nHãy quét và trích xuất nguyên văn toàn bộ các câu hỏi này ra. Đối với các câu hỏi trắc nghiệm, hãy tìm ra đáp án đúng và gán vào trường \"correctAnswer\", đồng thời chuẩn hóa chúng thành cấu trúc JSON bên dưới. Đối với câu tự luận, chỉ cần trích xuất nội dung câu hỏi." +
                    "Yêu cầu TRẢ VỀ CHỈ MỘT MẢNG JSON thuần túy, KHÔNG chứa chữ nào khác, tuân thủ đúng cấu trúc sau:\n" +
                    "[\n" +
                    "  {\"content\": \"Nội dung câu hỏi trích xuất?\", \"type\": \"MCQ\", \"difficulty\": \"EASY\", \"points\": 1.0, \"options\": [{\"id\": \"A\", \"text\": \"...\"}, {\"id\": \"B\", \"text\": \"...\"}, {\"id\": \"C\", \"text\": \"...\"}, {\"id\": \"D\", \"text\": \"...\"}], \"correctAnswer\": \"A\"},\n" +
                    "  {\"content\": \"Nội dung câu tự luận trích xuất?\", \"type\": \"ESSAY\", \"difficulty\": \"HARD\", \"points\": 2.0}\n" +
                    "]";
        } else {
            prompt = "Dựa vào nội dung tài liệu học thuật sau đây:\n\n" + pdfText +
                    "\n\nHãy sinh ra bộ câu hỏi tự tạo gồm 5 câu Trắc nghiệm (MCQ) và 2 câu Tự luận (ESSAY) dựa trên nội dung lý thuyết này." +
                    "Yêu cầu TRẢ VỀ CHỈ MỘT MẢNG JSON thuần túy, KHÔNG chứa chữ nào khác, tuân thủ đúng cấu trúc sau:\n" +
                    "[\n" +
                    "  {\"content\": \"Nội dung câu hỏi?\", \"type\": \"MCQ\", \"difficulty\": \"EASY\", \"points\": 1.0, \"options\": [{\"id\": \"A\", \"text\": \"...\"}, {\"id\": \"B\", \"text\": \"...\"}, {\"id\": \"C\", \"text\": \"...\"}, {\"id\": \"D\", \"text\": \"...\"}], \"correctAnswer\": \"A\"},\n" +
                    "  {\"content\": \"Nội dung câu tự luận?\", \"type\": \"ESSAY\", \"difficulty\": \"HARD\", \"points\": 2.0}\n" +
                    "]";
        }

        String jsonResponse = callGeminiApi(prompt);
        return objectMapper.readValue(jsonResponse, new TypeReference<List<AiQuestionDraftResponse>>() {});
    }

    /**
     * Lưu bộ đề kiểm tra nháp và các câu hỏi đi kèm vào CSDL.
     * 
     * GIẢI THÍCH CHO NGƯỜI MỚI HỌC:
     * - @Transactional: Đảm bảo tính toàn vẹn của giao dịch (Atomicity). 
     *   Nếu quá trình lưu đề kiểm tra thành công nhưng lưu một câu hỏi bị lỗi nửa chừng, toàn bộ các thay đổi
     *   trước đó sẽ được rollback (hủy bỏ hoàn toàn), giúp DB tránh được dữ liệu rác dở dang.
     * - @CacheEvict: Khi lưu một đề thi mới, ta cần xóa sạch các dữ liệu tìm kiếm cũ đang nằm trong Cache (Cache Invalidation)
     *   để các hàm tìm kiếm như searchExams tải được dữ liệu mới nhất từ CSDL.
     */
    @Override
    @Transactional
    @CacheEvict(value = {"exams", "examSearch", "questionSearch"}, allEntries = true)
    public void saveExamDraft(SaveExamDraftRequest request) throws Exception {
        Course course = null;
        if (request.getCourseId() != null) {
            course = courseRepository.findById(request.getCourseId())
                    .orElseThrow(() -> new IllegalArgumentException("Course not found"));
        }

        ClassEntity classEntity = null;
        if (request.getClassId() != null) {
            classEntity = classRepository.findById(request.getClassId())
                    .orElseThrow(() -> new IllegalArgumentException("Class not found"));
        }

        // Tạo đối tượng Exam mới
        Exam exam = new Exam();
        exam.setTitle(request.getExamTitle() != null && !request.getExamTitle().isEmpty() ? request.getExamTitle() : "Bài kiểm tra tự động");
        exam.setCourse(course);
        exam.setClassEntity(classEntity);
        // Các thuộc tính mặc định
        exam.setDuration(60); // Thời gian làm bài mặc định là 60 phút
        exam.setStartTime(java.time.LocalDateTime.now());
        
        // Lưu thực thể Exam vào CSDL
        exam = examRepository.save(exam);

        // Lưu danh sách câu hỏi đính kèm bài thi
        for (AiQuestionDraftResponse draft : request.getQuestions()) {
            Question question = new Question();
            question.setExam(exam);
            question.setContent(draft.getContent());
            question.setType(Question.QuestionType.valueOf(draft.getType()));
            question.setPoints(draft.getPoints());
            question.setCorrectAnswer(draft.getCorrectAnswer());

            // Lưu các lựa chọn trắc nghiệm dưới dạng chuỗi JSON String trong database
            if (draft.getOptions() != null && !draft.getOptions().isEmpty()) {
                question.setOptions(objectMapper.writeValueAsString(draft.getOptions()));
            }

            questionRepository.save(question);
        }
    }

    /**
     * Tìm kiếm bài thi theo từ khóa.
     * 
     * GIẢI THÍCH CHO NGƯỜI MỚI HỌC:
     * - @Cacheable: Cấu hình lưu trữ bộ nhớ đệm. 
     *   Khi hàm này được gọi với một `keyword`, Spring sẽ kiểm tra xem kết quả của từ khóa này đã nằm trong cache "examSearch" chưa.
     *   + Nếu có: Trả về luôn dữ liệu trong Cache, KHÔNG gọi câu truy vấn xuống database nữa (Nhanh và nhẹ hệ thống).
     *   + Nếu không: Chạy lệnh dưới hàm để lấy dữ liệu từ DB, sau đó tự lưu vào cache cho các lần gọi sau.
     */
    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "examSearch", key = "#keyword")
    public List<Exam> searchExams(String keyword) {
        return examRepository.findByTitleContainingIgnoreCase(keyword);
    }

    /**
     * Tìm kiếm ngân hàng câu hỏi có tích hợp Redis Cache.
     */
    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "questionSearch", key = "#keyword")
    public List<Question> searchQuestions(String keyword) {
        return questionRepository.findByContentContainingIgnoreCase(keyword);
    }

    /**
     * Đọc văn bản từ file PDF tải lên.
     */
    private String extractTextFromPdf(MultipartFile file) throws Exception {
        try (InputStream in = file.getInputStream();
             PDDocument document = PDDocument.load(in)) {
            PDFTextStripper pdfStripper = new PDFTextStripper();
            String text = pdfStripper.getText(document);
            if (text != null && text.length() > 20000) {
                return text.substring(0, 20000); // Giới hạn ký tự
            }
            return text;
        }
    }

    /**
     * Gọi API Google Gemini.
     */
    private String callGeminiApi(String prompt) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="
                + geminiApiKey;

        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        Map<String, Object> contentPart = new HashMap<>();
        contentPart.put("parts", Collections.singletonList(textPart));

        Map<String, Object> requestBodyMap = new HashMap<>();
        requestBodyMap.put("contents", Collections.singletonList(contentPart));

        String requestBody = objectMapper.writeValueAsString(requestBodyMap);

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
        String response = restTemplate.postForObject(url, entity, String.class);

        JsonNode root = objectMapper.readTree(response);
        String aiText = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

        // TỐI ƯU HÓA: Dọn dẹp markdown code block từ AI trả về để đảm bảo chỉ parse JSON thô
        return cleanJsonResponse(aiText);
    }

    /**
     * TỐI ƯU HÓA: Làm sạch chuỗi JSON từ API Gemini.
     */
    private String cleanJsonResponse(String rawResponse) {
        if (rawResponse == null) return "[]";
        
        String cleaned = rawResponse.trim();
        
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replaceAll("^```json\\s*", "").replaceAll("```$", "").trim();
        }
        
        int start = cleaned.indexOf('[');
        int end = cleaned.lastIndexOf(']');
        if (start != -1 && end != -1 && end > start) {
            return cleaned.substring(start, end + 1);
        }
        
        return cleaned;
    }

    @Override
    public List<Map<String, Object>> extractQuestionsFromUrl(String pdfUrl, String title) throws Exception {
        String pdfText = extractTextFromPdfUrl(pdfUrl);
        
        if (pdfText == null || pdfText.trim().isEmpty()) {
            throw new IllegalArgumentException("Không thể đọc được văn bản hoặc tài liệu PDF trống từ URL.");
        }

        String prompt = "Dựa vào nội dung tài liệu học thuật sau đây (Tên tài liệu: " + title + "):\n\n" + pdfText +
                "\n\nHãy tạo ra bộ câu hỏi gồm 5 câu Trắc nghiệm (MCQ) và 2 câu Tự luận (ESSAY)." +
                "Yêu cầu TRẢ VỀ CHỈ MỘT MẢNG JSON thuần túy, KHÔNG chứa chữ nào khác, tuân thủ đúng cấu trúc sau:\n" +
                "[\n" +
                "  {\"content\": \"Nội dung câu hỏi?\", \"type\": \"MCQ\", \"difficulty\": \"EASY\", \"points\": 1, \"options\": [{\"id\": \"A\", \"text\": \"...\"}, {\"id\": \"B\", \"text\": \"...\"}, {\"id\": \"C\", \"text\": \"...\"}, {\"id\": \"D\", \"text\": \"...\"}], \"correctAnswer\": \"A\"},\n" +
                "  {\"content\": \"Nội dung câu tự luận?\", \"type\": \"ESSAY\", \"difficulty\": \"HARD\", \"points\": 2}\n" +
                "]";

        String jsonResponse = callGeminiApi(prompt);
        return objectMapper.readValue(jsonResponse, new TypeReference<List<Map<String, Object>>>() {});
    }

    /**
     * TỐI ƯU HÓA: Bổ sung Connect/Read timeouts để tránh treo hệ thống khi tải file PDF từ URL.
     */
    private String extractTextFromPdfUrl(String pdfUrl) throws Exception {
        java.net.URL url = new java.net.URL(pdfUrl);
        URLConnection conn = url.openConnection();
        
        // Thiết lập thời gian chờ 10s kết nối và 15s đọc dữ liệu để nâng cao tính ổn định hệ thống
        conn.setConnectTimeout(10000);
        conn.setReadTimeout(15000);

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
}
