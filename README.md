## 1. System Architecture

- **Frontend:** React.js  
- **Backend:** Node.js with Express  
- **Database:** MongoDB  
- **Authentication:** JSON Web Tokens (JWT)  
- **Hosting:** Vercel  


## 2. Technologies Used

| Component     | Technology              |
|---------------|--------------------------|
| **Frontend**  | React.js                 |
| **Backend**   | Node.js + Express        |
| **Database**  | MongoDB                  |
| **Auth**      | JSON Web Tokens (JWT)    |
| **Hosting**   | Vercel (Frontend & Backend) |


## Frontend Routes

| Path     | Component   | Purpose                   |
| -------- | ----------- | ------------------------- |
| /        | NewUser     | Homepage for new users.   |
| /member  | MemberHome  | Homepage for members.     |
| /trainer | TrainerHome | Homepage for trainers.    |
| /admin   | AdminHome   | Homepage for admin.       |
| /login   | Login       | Login page.               |
| /classes | ClassList   | List of available classes |
| /signup  | Signup      | Signup page for new users |

## Backend Routes

| Base Route    | Sub Route                | Method | Usage                                       
| ------------- | ------------------------ | ------ | ------------------------------------------- 
| /api/trainers | /                        | GET    | get all trainers                            
|               | /                        | POST   | Creates a trainer account                   
| /api/classes  | /                        | GET    | retrieve schedule for current user          
| /api/admin    | /add-schedule            | POST   | manually add a schedule to db               
| /api/schedule | /                        | GET    | get all schedules                           
|               | /online                  | GET    | get all online schedules                    
|               | /onsite                  | GET    | get all on-site schedules                   
|               | /generate-schedule       | POST   | auto generate a monthly schedule            
|               | /save-generated-schedule | POST   | confirm saving the generated schedule to db 
|               | /reserve                 | POST   | reserve a class and save to db              
|               | /member/:profileId       | GET    | get all schedules from member               
|               | /:instructorId           | GET    | get all schedules for specific trainer     
| /api/users    | /login                   | POST   | login with user information stored in db   
|               | /signup                  | POST   | signup with info that are stored in db      
|               | /profile/:profileId      | GET    | return the { user, profile }               
|               | /profile/:profileId      | POST   | updates and return an existing profile      
|               | /goals                   | GET    | get member's current and achieved goals     
|               | /goals                   | POST   | add a new goal                              
|               | /goals/achieve           | PUT    | mark a goal as achieved                     
|               | /goals/revert            | PUT    | revert an achieved goal back to current     
|               | /forgot-password         | POST   | sends a request to reset password           
|               | /verify-email            | POST   | checks if email is valid                    
|               | /reset-password/:token   | POST   | verifies password reset link                
| /api/goals    | /                        | GET    | Retrieves list of all goals                 
|               | /                        | POST   | Adds a goal                                 
|               | /achieve                 | PUT    | Updates a goal as achieved                  
|               | /revert                  | PUT    | Reverts a goal to not achieved              
|               | /log-workout             | POST   | Logs a workout in goals page                
|               | /log-workout/status      | GET    | Retrieve current status of logged workout   
| /api/schedule | /                        | GET    | Retrieve all schedules                      
|               | /add-schedule            | POST   | Create a new schedule
|               | /generate-schedule       | POST   | Generates a schedule
|               | /save-generated-schedule | POST   | Saves the generated schedules to database
|               | /online                  | GET    | Retrieve all schedules that are online
|               | /onsite                  | GET    | Retrieves all schedules that are onsite
|               | /reserve/:classId        | POST   | Create a schedule reservation based on classId
|               | /member/:profileId       | GET    | Retrieve all schedules based on profileId
|               | /:instructorId           | GET    | Retrieve all schedules base on instructorId
|               | /:scheduleId             | GET    | Retrieve schedule based on scheduleId
|               | /:scheduleId             | DELETE | Delete schedule based on scheduleId
|/api/upcoming  | /                        | GET    | Retrieve all upcoming schedules
|               | /cancel/:classId         | POST   | Cancel schedule based on classId
|/api/announce  | /                        | POST   | Create new announcement post
|ments          |                          |        |
|               | /                        | GET    | Retrieve all announcements
|               | /:id                     | PUT    | Update announcement by id
|               | /:id                     | DELETE | Delete announcement by id
|/api/community | /                        | GET    | Retrieve all community posts
|               | /                        | POST   | Create new community post
|               | /:id                     | PUT    | Update community post
|               | /:id                     | DELETE | Delete community post
|/api/events    | /                        | POST   | Create new event
|               | /                        | GET    | Retrieve all events
|               | /range                   | GET    | Retrieve all events based on date range
|/api/payment   | /checkout                | POST   | Create stripe payment details

Updates an existing profile and returns the updated profile.

## Steps to install dependencies:

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
