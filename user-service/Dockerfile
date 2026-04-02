FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder

WORKDIR /app

COPY pom.xml .
COPY ../pom.xml ../pom.xml

RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests -B

FROM eclipse-temurin:17-jdk-jammy AS runner

LABEL maintainer="themarcos"
LABEL description="MedApp - User Service"
LABEL version="1.0.0"

WORKDIR /app

RUN addgroup -S medapp && adduser -S medapp -G medapp

COPY --from=builder /app/target/*.jar app.jar

RUN chown medapp:medapp app.jar

USER medapp

EXPOSE 8081

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider \
    http://localhost:8081/api/auth/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]