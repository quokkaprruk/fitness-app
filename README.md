## Steps to install dependencies:

### Backend Routes

| Base Route    | Sub Route                | Method | Usage                                       |
| ------------- | ------------------------ | ------ | ------------------------------------------- |
| /api/trainers | /                        | GET    | get all trainers                            |
| /api/admin    | /add-schedule            | POST   | manually add a schedule to db               |
| /api/schedule | /                        | GET    | get all schedules                           |
|               | /online                  | GET    | get all online schedules                    |
|               | /onsite                  | GET    | get all on-site schedules                   |
|               | /generate-schedule       | POST   | auto generate a monthly schedule            |
|               | /save-generated-schedule | POST   | confirm saving the generated schedule to db |
|               | /reserve                 | POST   | reserve a class and save to db              |
|               | /member/:profileId       | GET    | get all schedules from member               |
|               | /instructorId            | GET    | get all schedules for specific trainer      |
| /api/         | /login                   | POST   | login with user information stored in db    |
|               | /register                | POST   | signup with info that are stored in db      |

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
