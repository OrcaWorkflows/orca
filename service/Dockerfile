FROM openjdk:11

WORKDIR /Orca

RUN ["mkdir", "/etc/databoss"]

ADD /target/service-0.0.1.jar /Orca/

EXPOSE 8080

CMD ["java", "-jar", "service-0.0.1.jar"]

