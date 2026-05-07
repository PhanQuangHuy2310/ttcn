package com.ttcn.backend.config;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class S3Config {

    @Value("${aws.s3.endpoint:}")
    private String endpoint;

    @Value("${aws.s3.access-key:}")
    private String accessKey;

    @Value("${aws.s3.secret-key:}")
    private String secretKey;

    @Value("${aws.s3.region:ap-southeast-1}")
    private String region;

    /**
     * AmazonS3 bean is only created when aws.s3.enabled=true.
     * Set AWS_S3_ENABLED=true in environment to activate S3 storage.
     */
    @Bean
    @ConditionalOnProperty(name = "aws.s3.enabled", havingValue = "true")
    public AmazonS3 amazonS3() {
        if (endpoint == null || endpoint.isBlank()) {
            throw new IllegalStateException(
                "aws.s3.enabled=true but aws.s3.endpoint is not configured");
        }
        AWSCredentials credentials = new BasicAWSCredentials(accessKey, secretKey);
        return AmazonS3ClientBuilder
                .standard()
                .withEndpointConfiguration(
                    new AwsClientBuilder.EndpointConfiguration(endpoint, region))
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withPathStyleAccessEnabled(true)
                .build();
    }
}
