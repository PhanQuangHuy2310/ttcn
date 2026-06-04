# Root Dockerfile for Backend service
# Stage 1: Build the backend application
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /app

# Copy pom.xml from backend folder and download dependencies
COPY source_code/backend/pom.xml .
RUN mvn dependency:go-offline -B

# Copy the rest of the backend source code and build
COPY source_code/backend/src ./src
RUN mvn clean package -DskipTests

# Stage 2: Run JRE Image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the compiled jar from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose standard Spring Boot port
EXPOSE 8085

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]
