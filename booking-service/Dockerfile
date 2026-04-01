# BUILD stage
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

# Set BUILD stage workdir to app folder
WORKDIR /app

# Copy root pom.xml file to workdir folder
COPY pom.xml .

# Copy microservice pom.xml file to corresponding image folder
COPY booking-service/pom.xml booking-service/

# Download dependencies as listed in booking-service/pom.xml file before compilation of the module
RUN mvn -f booking-service/pom.xml dependency:go-offline -B

# Copy the source code
COPY booking-service/src booking-service/src

# Build Booking-service module using mvn
RUN mvn -f booking-service/pom.xml package -DskipTests -B

# RUN stage
FROM eclipse-temurin:21-jre-alpine AS runner

LABEL maintainer="themarcos" \
      description="MedApp - Booking Service" \
      version="1.0.0"

# First one tells Java that it runs inside container
# Second one tells Java that it can use up to 75% of assigned container memory
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

# Set RUN stage workdir to app folder
WORKDIR /app

# Create both group and user without root privileges
RUN addgroup -S medapp && adduser -S medapp -G medapp

# Copy JAR file from the BUILD stage 
COPY --from=builder /app/booking-service/target/*.jar app.jar

# Change medapp file ownership to medapp
RUN chown medapp:medapp app.jar

# Switch to user medapp
USER medapp

# EXPOSE port 8083 outside the container
EXPOSE 8083

# Use Spring Boot Actuator to check app status
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider \
    http://localhost:8083/actuator/health || exit 1

# Run app with JAVA_OPTS parameter
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]