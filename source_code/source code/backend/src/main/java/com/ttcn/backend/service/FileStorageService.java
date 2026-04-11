package com.ttcn.backend.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class FileStorageService {

    /** Injected only when the AmazonS3 bean exists (aws.s3.enabled=true). */
    @Autowired(required = false)
    private AmazonS3 amazonS3;

    @Value("${aws.s3.bucket-name:default-bucket}")
    private String bucketName;

    @Value("${aws.s3.endpoint:}")
    private String endpoint;

    public boolean isS3Configured() {
        return amazonS3 != null && endpoint != null && !endpoint.isBlank();
    }

    public String uploadFile(MultipartFile file) {
        if (!isS3Configured()) {
            throw new RuntimeException(
                "S3 storage is not configured. Set AWS_S3_ENABLED=true and provide credentials.");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String fileName = UUID.randomUUID().toString() + extension;

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType());

        try {
            PutObjectRequest putObjectRequest =
                new PutObjectRequest(bucketName, fileName, file.getInputStream(), metadata)
                    .withCannedAcl(CannedAccessControlList.PublicRead);
            amazonS3.putObject(putObjectRequest);
            return endpoint + "/" + bucketName + "/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi upload file lên S3: " + e.getMessage());
        }
    }
}
