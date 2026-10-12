# ---- Stage 1: build the JAR (Maven + Java 17) ----
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /build
COPY pom.xml .
COPY src ./src
# application.properties is gitignored (holds local secrets); fall back to the
# sanitized template so the image builds from a fresh clone (e.g. Render).
RUN if [ ! -f src/main/resources/application.properties ]; then \
      cp src/main/resources/application.properties.example \
         src/main/resources/application.properties; \
    fi && \
    mvn -B clean package -DskipTests

# ---- Stage 2: run (Java 17 runtime) ----
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /build/target/backend-java-1.0.0.jar app.jar

# Render injects PORT (default 10000). application.properties reads
# server.port=${PORT:5000}, so the container listens on $PORT — 10000 by
# default here — instead of assuming the local dev port 5000.
ENV PORT=10000
EXPOSE 10000

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
