package com.ttcn.backend.service.impl;

import com.ttcn.backend.dto.request.SaveFlashcardDraftRequest;
import com.ttcn.backend.dto.response.AiFlashcardDraftResponse;
import com.ttcn.backend.entity.Course;
import com.ttcn.backend.entity.Flashcard;
import com.ttcn.backend.entity.FlashcardSet;
import com.ttcn.backend.entity.User;
import com.ttcn.backend.repository.ClassRepository;
import com.ttcn.backend.repository.CourseRepository;
import com.ttcn.backend.repository.FlashcardRepository;
import com.ttcn.backend.repository.FlashcardSetRepository;
import com.ttcn.backend.repository.NotificationRepository;
import com.ttcn.backend.service.DraftStorage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AiFlashcardServiceImplTest {

    @Mock
    private FlashcardSetRepository flashcardSetRepository;

    @Mock
    private FlashcardRepository flashcardRepository;

    @Mock
    private DraftStorage draftStorage;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private ClassRepository classRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private AiFlashcardServiceImpl aiFlashcardService;

    private SaveFlashcardDraftRequest request;
    private UUID teacherId;
    private Course course;

    @BeforeEach
    void setUp() {
        teacherId = UUID.randomUUID();
        course = Course.builder().id(UUID.randomUUID()).name("Java").build();

        SaveFlashcardDraftRequest.FlashcardDraft draft = new SaveFlashcardDraftRequest.FlashcardDraft();
        draft.setFrontText("OOP");
        draft.setBackText("Object Oriented");
        draft.setHint("O");

        request = new SaveFlashcardDraftRequest();
        request.setDraftId("draft-123");
        request.setCourseId(course.getId());
        request.setTitle("Java Basics");
        request.setFlashcards(Arrays.asList(draft));
    }

    @Test
    void saveFlashcardDraft_shouldSaveFlashcardsAndNotify_whenValidRequest() throws Exception {
        // Arrange
        when(draftStorage.getDraft(request.getDraftId())).thenReturn(new AiFlashcardDraftResponse());
        when(courseRepository.findById(course.getId())).thenReturn(Optional.of(course));
        
        FlashcardSet savedSet = new FlashcardSet();
        savedSet.setId(UUID.randomUUID());
        when(flashcardSetRepository.save(any(FlashcardSet.class))).thenReturn(savedSet);

        User student = User.builder().userId(UUID.randomUUID()).build();
        when(classRepository.findStudentsByCourseId(course.getId())).thenReturn(Collections.singletonList(student));

        // Act
        aiFlashcardService.saveFlashcardDraft(request, teacherId);

        // Assert
        verify(flashcardSetRepository, times(1)).save(any(FlashcardSet.class));
        
        ArgumentCaptor<Flashcard> flashcardCaptor = ArgumentCaptor.forClass(Flashcard.class);
        verify(flashcardRepository, times(1)).save(flashcardCaptor.capture());
        assertEquals("OOP (Gợi ý: O)", flashcardCaptor.getValue().getFrontText());
        
        verify(notificationRepository, times(1)).save(any());
        verify(draftStorage, times(1)).clearDraft(request.getDraftId());
    }

    @Test
    void saveFlashcardDraft_shouldThrowException_whenDraftNotFound() {
        // Arrange
        when(draftStorage.getDraft(request.getDraftId())).thenReturn(null);

        // Act & Assert
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            aiFlashcardService.saveFlashcardDraft(request, teacherId);
        });

        assertEquals("Bản nháp không tồn tại hoặc đã hết hạn (Cache Timeout).", ex.getMessage());
        verify(flashcardSetRepository, never()).save(any());
    }

    @Test
    void saveFlashcardDraft_shouldThrowException_whenCourseNotFound() {
        // Arrange
        when(draftStorage.getDraft(request.getDraftId())).thenReturn(new AiFlashcardDraftResponse());
        when(courseRepository.findById(course.getId())).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            aiFlashcardService.saveFlashcardDraft(request, teacherId);
        });

        assertEquals("Khóa học không tồn tại", ex.getMessage());
        verify(flashcardSetRepository, never()).save(any());
    }
}
