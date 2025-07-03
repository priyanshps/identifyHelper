# 🔗 Identity Reconciliation Backend

This project implements a solution for **customer identity reconciliation** using `email` and `phoneNumber`. It ensures that different combinations of contact details (used by the same person) are correctly linked under a single identity.

---

## 🚀 Tech Stack

- **Backend**: Node.js + Express
- **Language**: TypeScript
- **ORM**: Prisma

---

## 📦 Project Structure

```
.
├── prisma/
│   └── schema.prisma          # Prisma schema definition
├── src/
│   ├── controllers/
│   │   └── contactController.ts
│   ├── routes/
│   │   └── contactRoutes.ts
│   ├── services/
│   │   └── contactService.ts
│   ├── app.ts                 # Express app config
│   └── server.ts              # App entry point
├── package.json
├── tsconfig.json
└── README.md
```

---

## ✅ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/bitespeed-identity.git
cd bitespeed-identity
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up the Database
```bash
npx prisma generate
npx prisma migrate dev --name init
```



### 4. Run the Server
```bash
npm run dev
```

Server will start at: `http://localhost:3000`

---

## 📌 API Endpoint

### `POST /identify`

#### 🧾 Request Body
```json
{
  "email": "mcfly@hillvalley.edu",
  "phoneNumber": "123456"
}
```
- You must send at least `email` or `phoneNumber`.

#### ✅ Sample Response
```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [23]
  }
}
```

---

## 🧪 Testing with curl
```bash
curl --request POST http://localhost:3000/identify \
  --header 'Content-Type: application/json' \
  --data-raw '{"email": "mcfly@hillvalley.edu", "phoneNumber": "123456"}'
```

---




## 📄 License

MIT License © 2025 [Your Name]

---

## 👤 Contact

- Email: priyanshshukla.ps@gmail.com


