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
import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AiExamServiceImpl implements AiExamService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final ExamRepository examRepository;
    private final QuestionRepository questionRepository;
    private final CourseRepository courseRepository;
    private final ClassRepository classRepository;
    private final ObjectMapper objectMapper;

    public AiExamServiceImpl(ExamRepository examRepository, QuestionRepository questionRepository, CourseRepository courseRepository, ClassRepository classRepository) {
        this.examRepository = examRepository;
        this.questionRepository = questionRepository;
        this.courseRepository = courseRepository;
        this.classRepository = classRepository;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public List<AiQuestionDraftResponse> extractQuestionsFromPdf(MultipartFile file) throws Exception {
        String pdfText = extractTextFromPdf(file);

        String prompt = "Dựa vào nội dung tài liệu học thuật sau đây:\n\n" + pdfText +
                "\n\nHãy tạo ra bộ câu hỏi gồm 5 câu Trắc nghiệm (MCQ) và 2 câu Tự luận (ESSAY)." +
                "Yêu cầu TRẢ VỀ CHỈ MỘT MẢNG JSON thuần túy, KHÔNG chứa chữ nào khác, tuân thủ đúng cấu trúc sau:\n" +
                "[\n" +
                "  {\"content\": \"Nội dung câu hỏi?\", \"type\": \"MCQ\", \"difficulty\": \"EASY\", \"points\": 1, \"options\": [{\"id\": \"A\", \"text\": \"...\"}, {\"id\": \"B\", \"text\": \"...\"}, {\"id\": \"C\", \"text\": \"...\"}, {\"id\": \"D\", \"text\": \"...\"}], \"correctAnswer\": \"A\"},\n" +
                "  {\"content\": \"Nội dung câu tự luận?\", \"type\": \"ESSAY\", \"difficulty\": \"HARD\", \"points\": 2}\n" +
                "]";

        String jsonResponse = callGeminiApi(prompt);
        return objectMapper.readValue(jsonResponse, new TypeReference<List<AiQuestionDraftResponse>>() {});
    }

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

        Exam exam = new Exam();
        exam.setTitle(request.getExamTitle() != null && !request.getExamTitle().isEmpty() ? request.getExamTitle() : "Bài kiểm tra tự động");
        exam.setCourse(course);
        exam.setClassEntity(classEntity);
        // Default properties
        exam.setDuration(60);
        exam.setStartTime(java.time.LocalDateTime.now());
        exam = examRepository.save(exam);

        for (AiQuestionDraftResponse draft : request.getQuestions()) {
            Question question = new Question();
            question.setExam(exam);
            question.setContent(draft.getContent());
            question.setType(Question.QuestionType.valueOf(draft.getType()));
            question.setPoints(draft.getPoints());
            question.setCorrectAnswer(draft.getCorrectAnswer());

            if (draft.getOptions() != null && !draft.getOptions().isEmpty()) {
                question.setOptions(objectMapper.writeValueAsString(draft.getOptions()));
            }

            questionRepository.save(question);
        }
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "examSearch", key = "#keyword")
    public List<Exam> searchExams(String keyword) {
        return examRepository.findByTitleContainingIgnoreCase(keyword);
    }

    // Tìm kiếm ngân hàng câu hỏi có tích hợp Redis Cache
    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "questionSearch", key = "#keyword")
    public List<Question> searchQuestions(String keyword) {
        return questionRepository.findByContentContainingIgnoreCase(keyword);
    }

    private String extractTextFromPdf(MultipartFile file) throws Exception {
        try (InputStream in = file.getInputStream();
             PDDocument document = PDDocument.load(in)) {
            PDFTextStripper pdfStripper = new PDFTextStripper();
            String text = pdfStripper.getText(document);
            if (text != null && text.length() > 20000) {
                return text.substring(0, 20000); // Limit to ~20k characters to fit Gemini context limit if necessary
            }
            return text;
        }
    }

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

        return aiText.replaceAll("```json\n?", "").replaceAll("```", "").trim();
    }
    @Override
    public List<Map<String, Object>> extractQuestionsFromUrl(String pdfUrl, String title) throws Exception {
        String pdfText = extractTextFromPdfUrl(pdfUrl);
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

    private String extractTextFromPdfUrl(String pdfUrl) throws Exception {
        java.net.URL url = new java.net.URL(pdfUrl);
        try (InputStream in = url.openStream();
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
