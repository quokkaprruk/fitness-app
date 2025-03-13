Signup body:
```json
{
    "email": "luis@test.com",
    "username": "adminLuisMario",
    "password": "password1234"
}
```

Signup route response
```json
{
    "message": "User registered successfully",
    "username": "adminLuisMario",
    "role": "member",
    "profileId": "cde57597-d784-44c0-9eae-793e23bca4af"
}
```

Login body:
```json
{
    "username": "adminLuisMario",
    "password": "password1234"
}
```

Login route response
```json
{
    "message": "Login successful. Redirecting to login page.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YjM5NzJkZTk0ZWMxMWJmYzYyYjI2NyIsInVzZXJuYW1lIjoiYWRtaW5MdWlzTWFyaW8iLCJyb2xlIjoibWVtYmVyIiwicHJvZmlsZUlkIjoiY2RlNTc1OTctZDc4NC00NGMwLTllYWUtNzkzZTIzYmNhNGFmIiwiaWF0IjoxNzM5ODIyOTg0LCJleHAiOjE3Mzk4MjMyODR9.-4TxTdXT_OnXtdtSQrcRZxwupLiLUaETpq6HwtXAY1A",
    "username": "adminLuisMario",
    "role": "member"
}
```


Role is member, I should have added when signing up a new arg, which would look like
```json
{
    "email": "luis@test.com",
    "username": "adminLuisMario",
    "password": "password1234",
    "role": "admin",
    "firstName": "Luis",
    "lastName": "Mario",
}
```

Signup for trainer:
```json
{
  "email": "luismariotrainer@test.com",
  "username": "trainerLuisMario",
  "password": "password1234",
  "role": "trainer",
  "firstName": "Luis",
  "lastName": "Mario",
  "specialty": ["Weight Training", "Cardio Fitness"],
  "teachingMode": ["online", "on-site"]
}
```

response
```json
{
    "message": "User registered successfully",
    "username": "trainerLuisMario",
    "role": "trainer",
    "profileId": "384e2929-16cd-4fbb-979d-ac707ae2f093"
}
```

regular member

```json
{
    "email": "luis23@test.com",
    "username": "LuisMarioMember",
    "password": "password1234"
}
```
