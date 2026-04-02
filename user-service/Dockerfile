# BUILD stage
FROM maven:3.9.6-eclipse-temurin-21 AS builder

# Set BUILD stage workdir to app folder
WORKDIR /app

# Copy package files to workdir
COPY user-service/pom.xml .
COPY pom.xml ../pom.xml

# Install exact dependencies from lockfile
RUN mvn dependency:go-offline -B

# Copy the source code
COPY user-service/src ./src
RUN mvn clean package -DskipTests -B

# RUN stage
FROM eclipse-temurin:21-jdk-jammy AS runner

LABEL maintainer="themarcos"
LABEL description="MedApp - User Service"
LABEL version="1.0.0"

# Set RUN stage workdir to app folder
WORKDIR /app

RUN groupadd -r medapp && useradd -r -g medapp medapp

# Copy build artifacts from the BUILD stage
COPY --from=builder /app/target/*.jar app.jar

RUN chown medapp:medapp app.jar

# Switch to medapp user
USER medapp

# EXPOSE port 8081 outside the container
EXPOSE 8081

# Use wget to check if the web server is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider \
    http://localhost:8081/api/auth/health || exit 1

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]