FROM openjdk:8
ARG JAR_FILE_PATH=/var/jenkins_home/workspace/user-service/Backend/alcol/user-service/build/libs/user-service-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE_PATH} app.jar
EXPOSE 8000
ENTRYPOINT ["java", "-jar", "/app.jar"]
#COPY gradlew .
#COPY gradle gradle
#COPY build.gradle .
#COPY settings.gradle .
#COPY src src
#RUN chmod +x ./gradlew
#RUN ./gradlew bootJAR
#
#COPY ./build/libs/jenkinstest-0.0.1-SNAPSHOT.jar app.jar
#EXPOSE 8081
#ENTRYPOINT ["java", "-jar", "/app.jar"]