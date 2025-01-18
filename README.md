## Steps to install dependencies:

### Backend Routes

| Base Route     | Sub Route                | Method     | Usage                                       |
| -------------- | ------------------------ | ---------- | ------------------------------------------- |
| /api/trainers  | /                        | GET        | get all trainers                            |
| /api/admin     | /add-schedule            | POST       | manually save a schedule to db              |
| /api/schedules | /                        | GET        | get all schedules                           |
|                | /generate-schedule       | POST       | auto generate schedule button               |
|                | /save-generated-schedule | POST       | confirm saving the generated schedule to db |
| Row 5, C1      | Row 5, C2                | Row 5, C3  | Row 5, C4                                   |
| Row 6, C1      | Row 6, C2                | Row 6, C3  | Row 6, C4                                   |
| Row 7, C1      | Row 7, C2                | Row 7, C3  | Row 7, C4                                   |
| Row 8, C1      | Row 8, C2                | Row 8, C3  | Row 8, C4                                   |
| Row 9, C1      | Row 9, C2                | Row 9, C3  | Row 9, C4                                   |
| Row 10, C1     | Row 10, C2               | Row 10, C3 | Row 10, C4                                  |

### Install Dependencies for the Server (Backend)

1 Navigate to the server folder (assume that you at the project root folder)

```
cd server
```

2 Install the backend dependencies

```
npm install
```

### Install Dependencies for the Client (Frontend)

1 Go to the client folder (assume that you at the project root folder)

```
cd client
```

2 Install the frontend dependencies

```
npm install
```

## To run the project:

1. To run the frontend and backend manually.
2. Open 2 terminal windows.
3. Terminal 1: For the backend (Node.js server)

```
cd server
npm run dev
```

4. Terminal 2: For the frontend (React app)

```
cd client
npm run dev
```
