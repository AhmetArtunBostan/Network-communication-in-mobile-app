# Currency Exchange App - Database Design

## Collections

### Users Collection
```json
{
  "_id": ObjectId,
  "name": String,
  "email": String,
  "password": String (hashed),
  "balance": {
    "PLN": Number,
    "EUR": Number,
    "USD": Number,
    "GBP": Number
  },
  "createdAt": Date
}

Indexes:
- email (unique)
```

### Transactions Collection
```json
{
  "_id": ObjectId,
  "userId": ObjectId,
  "type": String (enum: ["exchange", "deposit"]),
  "fromCurrency": String,
  "toCurrency": String,
  "amount": Number,
  "rate": Number,
  "createdAt": Date
}

Indexes:
- userId
- createdAt
```

## Relationships
- One-to-Many: User -> Transactions
- Embedded Document: User -> Balance

## Data Types
- ObjectId: MongoDB unique identifier
- String: UTF-8 string
- Number: 64-bit floating-point
- Date: ISODate
- Boolean: true/false

## Constraints
- User email must be unique
- Balance amounts cannot be negative
- Currency codes must be valid (PLN, EUR, USD, GBP)
- Transaction amounts must be positive
