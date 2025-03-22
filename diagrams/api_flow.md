sequenceDiagram
    participant Frontend
    participant Backend
    participant Database
    
    Frontend->>Backend: POST /api/auth/register
    Backend->>Database: Create new user
    Database-->>Backend: User created
    Backend-->>Frontend: Registration success
    
    Frontend->>Backend: POST /api/auth/login
    Backend->>Database: Verify credentials
    Database-->>Backend: User verified
    Backend-->>Frontend: JWT token
    
    Frontend->>Backend: GET /api/properties
    Backend->>Database: Query properties
    Database-->>Backend: Properties data
    Backend-->>Frontend: Properties list
    
    Frontend->>Backend: POST /api/bookings
    Backend->>Database: Create booking
    Database-->>Backend: Booking created
    Backend-->>Frontend: Booking confirmation
