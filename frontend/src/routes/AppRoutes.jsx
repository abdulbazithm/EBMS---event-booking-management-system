import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

import Events from "../pages/Events";
import EventDetail from "../pages/EventDetail";
import MyBookings from "../pages/MyBookings";

import OrganizerEvents from "../pages/OrganizerEvents";
import OrganizerEventBookings from "../pages/OrganizerEventBookings";
import CreateEvent from "../pages/CreateEvent";
import OrganizerDashboard from "../pages/OrganizerDashboard";

import Navbar from "../components/Navbar";
import PrivateRoute from "../utils/PrivateRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* 🔓 PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔐 PROTECTED ROUTES */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/events"
          element={
            <PrivateRoute>
              <Events />
            </PrivateRoute>
          }
        />

        <Route
          path="/events/:id"
          element={
            <PrivateRoute>
              <EventDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <PrivateRoute>
              <MyBookings />
            </PrivateRoute>
          }
        />

        <Route
          path="/organizer/events"
          element={
            <PrivateRoute>
              <OrganizerEvents />
            </PrivateRoute>
          }
        />

        <Route
          path="/organizer/events/:id"
          element={
            <PrivateRoute>
              <OrganizerEventBookings />
            </PrivateRoute>
          }
        />

        <Route
          path="/organizer/create-event"
          element={
            <PrivateRoute>
              <CreateEvent />
            </PrivateRoute>
          }
        />

        <Route
          path="/organizer/dashboard"
          element={
            <PrivateRoute>
              <OrganizerDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
