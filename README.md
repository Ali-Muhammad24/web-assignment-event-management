# 🎟️ Event Management System

A React web app for exploring real events from the **Ticketmaster Discovery API**. Users can create an account, search and filter upcoming events, view full event details, register for events, and manage their registrations on a personal **My Events** page.

Built for **Web Programming – Assignment 2** using React, Redux Toolkit, and React Router.

---

## ✨ Features

### 🔐 Authentication
- **Register:** create an account with Name, Email, and Password.
- **Login / Logout:** log in with the registered email and password; log out from the navbar.
- **Form validation:** required fields, valid email format, name of at least 2 characters, password of at least 6 characters, and clear error messages.
- **Duplicate check:** an email can only be registered once.
- **Persistent session:** you stay logged in after refreshing the page.

### 🔎 Event Exploration
- **Upcoming events:** shows events from today onward, sorted by date.
- **Search:** find events by keyword.
- **Category filter:** Music, Sports, Arts & Theatre, Film, Miscellaneous.
- **City filter:** show events in a specific city.
- **Event cards:** image, name, category, date, and venue at a glance.

### 📄 Event Details
- **Core info:** event name, image, category, date and time, venue, and city.
- **Extra info:** price range (when available), an "About this event" section, and a **Buy tickets** link to Ticketmaster.

### ✅ Event Registration
- **Logged-in users only:** visitors who click register are sent to Login and brought back to the event afterwards.
- **No duplicates:** a user can register for an event only once.
- **Feedback:** a confirmation message appears after registering or cancelling.
- **Cancel:** registrations can be cancelled from the details page or My Events.
- **Per-user:** every registration is linked to the logged-in user.

### 📅 My Events
- **Protected page:** only available when logged in.
- **Upcoming vs Completed:** registered events are split into two sections based on their date.
- **Cancel where appropriate:** upcoming registrations can be cancelled; completed ones are kept as history.

### 🎨 User Interface
- **Responsive:** works on mobile, tablet, and desktop.
- **Loading and error states:** a loader while data is fetched, and friendly error messages with a **Retry** button.
- **Reusable components:** Navbar, Footer, EventCard, Loader, ErrorMessage, ProtectedRoute.

---

## 🛠️ Tech Stack

- **React 19:** UI built with function components and hooks.
- **Vite:** development server and build tool.
- **Redux Toolkit:** global state with `configureStore`, `createSlice`, and `createAsyncThunk`, split into three slices:
  - **`auth`:** registered users and the logged-in user.
  - **`events`:** event list and selected event fetched from the API.
  - **`registrations`:** which user is registered for which event.
- **React Redux:** `useSelector` and `useDispatch` in components.
- **React Router 7:** page navigation and protected routes.
- **Ticketmaster Discovery API:** source of all event data.
- **Local Storage:** keeps users, the session, and registrations after a refresh.
- **Plain CSS:** custom styling, one stylesheet per component or page.

---

## 📋 Prerequisites

- **Node.js:** version 20.19+ or 22.12+, as required by Vite (includes npm). Download from [nodejs.org](https://nodejs.org/).
- **Ticketmaster API key:** free, see the next section.

---

## 🔑 Getting a Ticketmaster API Key

1. Go to the [Ticketmaster Developer Portal](https://developer.ticketmaster.com/) and create a free account.
2. Open **My Apps** in your account; a default app is created for you.
3. Copy the **Consumer Key**. This is your API key.

> ℹ️ The free plan allows **5,000 requests per day** and **2 requests per second**, which is plenty for this app.

---

## ⚙️ Installation & Setup

**1. Clone the repository**

```bash
git clone <repository-url>
cd <repository-folder>
```

**2. Install dependencies**

```bash
npm install
```

**3. Create the `.env` file**

Copy the example file:

```bash
# macOS / Linux / Git Bash
cp .env.example .env
```

```powershell
# Windows PowerShell
Copy-Item .env.example .env
```

Then open `.env` and replace the placeholder with your own key:

```env
VITE_TICKETMASTER_API_KEY=your_api_key_here
```

> ⚠️ The `.env` file is listed in `.gitignore` and must **never** be committed. Only `.env.example` (with the placeholder) belongs in the repository.

---

## ▶️ Running the App

**Start the development server:**

```bash
npm run dev
```

Then open **http://localhost:5173** in your browser.

> 💡 If you create or change `.env` while the server is running, stop it (`Ctrl + C`) and run `npm run dev` again so Vite picks up the new key.

**Other scripts:**

```bash
npm run build     # Create a production build in the dist/ folder
npm run preview   # Preview the production build locally
npm run lint      # Check the code with Oxlint
```

---

## 🧭 Usage

| Page | Route | Access |
| --- | --- | --- |
| **Events** (home) | `/events` | Everyone |
| **Event Details** | `/events/:id` | Everyone (registering requires login) |
| **Login** | `/login` | Everyone |
| **Register** | `/register` | Everyone |
| **My Events** | `/my-events` | Logged-in users only |

**Typical flow:**

1. **Register** a new account (you are logged in automatically).
2. **Browse** upcoming events, or search by keyword, category, and city.
3. **Open** an event to see its details.
4. **Register** for the event and see the confirmation message.
5. **Visit My Events** to see your upcoming and completed events, and cancel if needed.

Unknown URLs redirect to the Events page.

---

## 🗂️ Project Structure

```
├── public/                    # Static files
├── src/
│   ├── assets/                # Images
│   ├── components/            # Reusable components
│   │   ├── EventCard.jsx      # Event preview card
│   │   ├── ErrorMessage.jsx   # Error box with Retry button
│   │   ├── Footer.jsx         # Site footer
│   │   ├── Loader.jsx         # Loading spinner
│   │   ├── Navbar.jsx         # Navigation bar with login/logout
│   │   └── ProtectedRoute.jsx # Redirects to Login when not logged in
│   ├── pages/                 # One component per route
│   │   ├── Events.jsx         # Event list, search, and filters
│   │   ├── EventDetails.jsx   # Single event, register / cancel
│   │   ├── Login.jsx          # Login form
│   │   ├── MyEvents.jsx       # Upcoming and completed registrations
│   │   └── Register.jsx       # Registration form
│   ├── store/                 # Redux Toolkit
│   │   ├── store.js           # configureStore + Local Storage sync
│   │   ├── authSlice.js       # Users and current session
│   │   ├── eventsSlice.js     # Ticketmaster API calls
│   │   └── registrationsSlice.js # Event registrations
│   ├── utils/
│   │   └── formatDate.js      # Date and time formatting
│   ├── App.jsx                # Routes and layout
│   ├── main.jsx               # Entry point (Redux Provider + Router)
│   └── index.css              # Global styles and color theme
├── .env.example               # API key template
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

Each component and page has a matching `.css` file next to it.

---

## 📝 Notes

- **Simulated authentication:** there is no backend. Users, the logged-in session, and registrations are stored in the browser's **Local Storage**, as allowed by the assignment. Passwords are not encrypted, so do not use a real password. Data is per browser, so clearing site data removes all accounts and registrations.
- **Prices:** the price range depends entirely on what the Ticketmaster API returns. Many events do not include price data; in that case the page shows **"See Ticketmaster for prices"**, and the **Buy tickets** link opens the official event page.
- **Event data:** events come live from Ticketmaster, so results change over time and depend on what is available in the chosen category or city.
- **API errors:** an invalid or missing key, too many requests, or a network problem shows a clear error message with a Retry button.
- **API key security:** the key is read from `VITE_TICKETMASTER_API_KEY` in `.env` and is never committed to the repository.

---

## 👤 Author

Developed by **Muhammad Ali**
