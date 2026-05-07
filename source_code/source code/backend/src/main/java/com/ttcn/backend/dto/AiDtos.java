package com.ttcn.backend.dto;

import java.util.List;

public class AiDtos {

    // 1. DTO để hứng Request từ React gửi lên
    public static class AiRequest {
        private String pdfUrl;
        private String title;
        private String userId; // có thể null nếu là trích xuất câu hỏi

        // Getters and Setters
        public String getPdfUrl() {
            return pdfUrl;
        }

        public void setPdfUrl(String pdfUrl) {
            this.pdfUrl = pdfUrl;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }
    }

    // 2. DTO trả về danh sách Flashcard
    public static class FlashcardResponse {
        private String front;
        private String back;
        private String hint;

        public FlashcardResponse(String front, String back, String hint) {
            this.front = front;
            this.back = back;
            this.hint = hint;
        }

        // Getters
        public String getFront() {
            return front;
        }

        public String getBack() {
            return back;
        }

        public String getHint() {
            return hint;
        }
    }

    // 3. DTO trả về danh sách Câu hỏi
    public static class QuestionResponse {
        private String content;
        private String type;
        private String difficulty;
        private Integer points;
        private List<String> options;
        private String correct_answer;

        // Constructor cho MCQ
        public QuestionResponse(String content, String difficulty, List<String> options, String correct_answer) {
            this.content = content;
            this.type = "MCQ";
            this.difficulty = difficulty;
            this.points = 1;
            this.options = options;
            this.correct_answer = correct_answer;
        }

        // Constructor cho ESSAY
        public QuestionResponse(String content, String difficulty, Integer points) {
            this.content = content;
            this.type = "ESSAY";
            this.difficulty = difficulty;
            this.points = points;
        }

        // Getters
        public String getContent() {
            return content;
        }

        public String getType() {
            return type;
        }

        public String getDifficulty() {
            return difficulty;
        }

        public Integer getPoints() {
            return points;
        }

        public List<String> getOptions() {
            return options;
        }

        public String getCorrect_answer() {
            return correct_answer;
        }
    }
}
