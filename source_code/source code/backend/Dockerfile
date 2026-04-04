# Stage 1: Build Image
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /app

# Copy the pom.xml and download dependencies first to utilize Docker layer caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code and build the application JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Production JRE Image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built JAR from builder
COPY --from=builder /app/target/*.jar app.jar

# Expose the standard backend port
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
