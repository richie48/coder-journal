# 📝 Coder Journal API
A secure note-taking RESTful API built with Node.js and Express. Includes user authentication, authorization, and note management — ideal for developers who want to manage their coding thoughts, snippets, or journal entries.   
   
# 🔐 Features
User registration and login with JWT-based authentication   

Create, read, update, and delete (CRUD) notes   

Role-based access control   

Secure endpoints using middleware   

### 🛠 Tech Stack
Node.js   

Express   

MongoDB + Mongoose   

JWT for authentication   

dotenv for environment management   

### Installation
```
git clone https://github.com/richie48/coder-journal.git
cd coder-journal
npm install
```  
Configuration
Create a .env file in the root:   
```
env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
```   

Run the Server
```
npm run dev
```

### 📬 API Endpoints
POST /api/auth/register – Register a new user   

POST /api/auth/login – Login and receive token   

GET /api/notes – Get all notes (authenticated)   

POST /api/notes – Create a new note   

PUT /api/notes/:id – Update a note   

DELETE /api/notes/:id – Delete a note   
