FROM openjdk:8
ARG JAR_FILE_PATH=build/libs/apigateway-service-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE_PATH} app.jar
EXPOSE 8000
ENTRYPOINT ["java", "-jar", "/app.jar"]
