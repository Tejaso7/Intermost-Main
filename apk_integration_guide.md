# Intermost APK Integration Guide (v1)

This document describes the API endpoints exposed by the Intermost platform for integration with the mobile auto-dialer application (APK).

## Base URL
* **Development / Test:** `http://localhost:8000/api/v1/inquiries/apk/v1/`
* **Production:** `https://intermost.in/api/v1/inquiries/apk/v1/`

---

## 1. Agent Login
Authenticate the mobile application using the agent's credentials and receive an API access token.

* **Endpoint:** `POST /login/`
* **Content-Type:** `application/json`

### Request Payload
```json
{
  "username": "rahul_caller",
  "password": "agent_password_here"
}
```

### Response (Success - 200 OK)
```json
{
  "message": "Login successful",
  "token": "79b88efbc8fa77611ab9c02d96c81fae4bb8d30e42d76811",
  "user": {
    "username": "rahul_caller",
    "name": "Rahul Sharma"
  }
}
```

### Response (Error - 401 Unauthorized)
```json
{
  "error": "Invalid credentials"
}
```

---

## 2. Fetch Assigned Leads
Retrieve the list of pending cold calling leads assigned to the logged-in agent.

* **Endpoint:** `GET /leads/`
* **Headers:** `Authorization: Bearer <your_token_from_login_response>`

### Response (Success - 200 OK)
```json
{
  "leads": [
    {
      "_id": "64bf2109cf8b1a201bfde872",
      "name": "Amit Kumar",
      "phone": "+919876543210",
      "email": "amit.kumar@gmail.com",
      "status": "pending",
      "assigned_to": "rahul_caller",
      "assigned_at": "2026-07-15T02:10:00.000Z",
      "duration": 0,
      "notes": "",
      "call_logs": [],
      "imported_at": "2026-07-15T02:00:00.000Z"
    }
  ]
}
```

---

## 3. Submit Call Log
Upload call log logs back to the platform once a call is completed or attempted. This updates the lead's status and records the duration/notes.

* **Endpoint:** `POST /call-log/`
* **Headers:** `Authorization: Bearer <your_token_from_login_response>`
* **Content-Type:** `application/json`

### Request Payload
```json
{
  "lead_id": "64bf2109cf8b1a201bfde872",
  "status": "picked",
  "duration": 45,
  "notes": "Interested in MBBS Russia, requested catalog over WhatsApp"
}
```

#### Supported Status Values:
* `picked` (Call connected and user responded)
* `not_picked` (Ringing, but no response)
* `busy` (User was busy / line engaged)
* `failed` (Switched off / Network error / Invalid number)

### Response (Success - 200 OK)
```json
{
  "message": "Call log saved successfully"
}
```

### Response (Error - 403 Forbidden / Not Assigned to You)
```json
{
  "error": "Forbidden: Lead is assigned to another user"
}
```
