    -Notifications(Secondary):
        -Search what packages to use for email notifs only;
        -Implement them for each notification created on the DB;
        -Remove notifications from the DB(????);

    <!-- -Isolate the different microsservices: -->
        <!-- -Identify at least 2 microsservices for the work; -->
        <!-- -Create different folders for each microsservice(route, model and controller together); -->

    -Make them communicate between each other:
        -Search what packages to use for communication between microsservices(coax was a example that appeared);
        -Implement it;

    <!-- -Make them independent with each other: -->
        <!-- -Create a database for each microservice to eliminate interdependency; -->


    Extra:
        -API Gateway/Service Orchestration:
            -How requests route between services and handle cross-cutting concerns (logging, auth, rate limiting)

        -Service Discovery:
            -How microservices find each other (especially important if scaling)

        -Data Consistency Strategy:
            -How to handle transactions across multiple databases (saga pattern, eventual consistency, etc.)

        -Testing Strategy:
            -Unit tests, integration tests between services, contract testing

        -Deployment & Docker:
            -You have Docker files but no task for containerizing each microservice separately

        -Logging & Monitoring:
            -Distributed logging to track requests across services (especially important for debugging)

        -Authentication/Authorization Review:
            -With separate services, ensure JWT/token strategy works across boundaries

        -Error Handling & Resilience:
            -Circuit breakers, retries, timeouts for service-to-service calls

        -Documentation:
            -Update API docs to reflect microservices architecture (you have Swagger started)

    How to make it work:
        -Initialize/Open Docker;
        -Compose Docs microservices:
            -docker compose -p docs -f docker/docs/compose.yaml --env-file .env up --build
        -Compose Tasks microservices:
            -docker compose -p tasks -f docker/tasks/compose.yaml --env-file .env up --build
        -Compose User microservice:
            -docker compose -p users -f docker/users/compose.yaml --env-file .env up --build
        -Compose Gateway microservice:
            -docker compose -p  gateway -f docker/gateway/compose.yaml --env-file .env up --build

    -Enjoy!
