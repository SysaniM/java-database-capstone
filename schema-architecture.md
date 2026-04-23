This Spring Boot application uses both MVC and REST controllers. Thymeleaf templates are used to control Admin and Doctor dashboards, while REST APIs make all other modules functionable. The application interacts with two databases—MySQL (for structured data like doctors, admins and appointments) and MongoDB (for prescriptions). All controllers route requests through a common service layer, which in turn delegates to the appropriate repositories. MySQL uses JPA entities while MongoDB uses document models.

1. User get access to interfaces like dashboards or appointments
2. Thymeleaf templates or REST API used according to chosen action
3. Service layer provides business logic for chosen action
4. Service layer communicates with repository layer to perform data access operations
5. Databases are accessed and it's data retrieved
6. Retrieved data from databases mapped to java model classes (JPA entities for MYSQL database and document objects for MongoDB)
7. Bound models are used on response layer to be rendered as html or send back as json
