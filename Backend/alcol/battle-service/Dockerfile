FROM openjdk:8
ARG JAR_FILE_PATH=build/libs/battle-service-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE_PATH} app.jar
EXPOSE 9002
ENTRYPOINT ["java", "-jar", "/app.jar"]