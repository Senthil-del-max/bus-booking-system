FROM openjdk:17
WORKDIR /app

COPY . .

RUN ls target

ENTRYPOINT ["java","-jar","target/busbooking-0.0.1-SNAPSHOT.jar"]