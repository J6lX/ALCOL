FROM openjdk:8
ARG JAR_FILE_PATH=build/libs/match-service-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE_PATH} app.jar
EXPOSE 9004
ENTRYPOINT ["java", "-jar", "/app.jar"]