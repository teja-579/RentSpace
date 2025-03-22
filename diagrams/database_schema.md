erDiagram
    USER ||--o{ PROPERTY : owns
    USER ||--o{ BOOKING : makes
    PROPERTY ||--o{ BOOKING : has
    
    USER {
        string id
        string name
        string email
        string password
        string role
    }
    
    PROPERTY {
        string id
        string title
        string description
        string location
        number price
        string ownerId
    }
    
    BOOKING {
        string id
        string propertyId
        string userId
        date startDate
        date endDate
        number totalPrice
        string status
    }
