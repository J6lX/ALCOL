FROM openjdk:8
ARG JAR_FILE_PATH=build/libs/discovery-service-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE_PATH} app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "/app.jar"]