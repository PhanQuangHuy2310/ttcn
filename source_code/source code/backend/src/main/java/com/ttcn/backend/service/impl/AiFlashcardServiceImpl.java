package com.ttcn.backend.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ttcn.backend.repository.FlashcardRepository;
import com.ttcn.backend.repository.FlashcardSetRepository;
import com.ttcn.backend.service.AiFlashcardService;
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

import java.io.InputStream;
import java.net.URL;
import java.util.*;

@Service
public class AiFlashcardServiceImpl implements AiFlashcardService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Autowired
    private FlashcardSetRepository flashcardSetRepository;

    @Autowired
    private FlashcardRepository flashcardRepository;

    @Override
    public Map<String, Object> generateAndSaveFlashcards(MultipartFile file, UUID userId) throws Exception {
        return new HashMap<>();
    }

    private String extractTextFromPdfUrl(String pdfUrl) throws Exception {
        URL url = new URL(pdfUrl);
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

    private String callGeminiApi(String prompt) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key="
                + geminiApiKey;

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

        JsonNode root = mapper.readTree(response);
        String aiText = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

        return aiText.replaceAll("```json\n?", "").replaceAll("```", "").trim();
    }

    @Override
    public List<Map<String, String>> generateFlashcardsFromUrl(String pdfUrl, String title) throws Exception {
        String pdfText = extractTextFromPdfUrl(pdfUrl);
        String prompt = "Dựa vào nội dung tài liệu học thuật sau đây (Tên tài liệu: " + title + "):\n\n" + pdfText +
                "\n\nHãy tạo ra 5 đến 10 thẻ Flashcard học thuật để học sinh ôn tập." +
                "Yêu cầu TRẢ VỀ CHỈ MỘT MẢNG JSON thuần túy, KHÔNG chứa chữ nào khác, định dạng như sau:\n" +
                "[{\"front\": \"Câu hỏi hoặc khái niệm?\", \"back\": \"Giải thích chi tiết\", \"hint\": \"Gợi ý ngắn gọn\"}]";

        String jsonResponse = callGeminiApi(prompt);
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(jsonResponse, new TypeReference<List<Map<String, String>>>() {
        });
    }

    @Override
    public List<Map<String, Object>> extractQuestionsFromUrl(String pdfUrl, String title) throws Exception {
        String pdfText = extractTextFromPdfUrl(pdfUrl);
        String prompt = "Dựa vào nội dung tài liệu học thuật sau đây (Tên tài liệu: " + title + "):\n\n" + pdfText +
                "\n\nHãy tạo ra bộ câu hỏi gồm 5 câu Trắc nghiệm (MCQ) và 2 câu Tự luận (ESSAY)." +
                "Yêu cầu TRẢ VỀ CHỈ MỘT MẢNG JSON thuần túy, KHÔNG chứa chữ nào khác, tuân thủ đúng cấu trúc sau:\n" +
                "[\n" +
                "  {\"content\": \"Nội dung câu hỏi?\", \"type\": \"MCQ\", \"difficulty\": \"EASY\", \"points\": 1, \"options\": [\"A. ...\", \"B. ...\", \"C. ...\", \"D. ...\"], \"correct_answer\": \"A. ...\"},\n"
                +
                "  {\"content\": \"Nội dung câu tự luận?\", \"type\": \"ESSAY\", \"difficulty\": \"HARD\", \"points\": 2}\n"
                +
                "]";

        String jsonResponse = callGeminiApi(prompt);
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(jsonResponse, new TypeReference<List<Map<String, Object>>>() {
        });
    }
}