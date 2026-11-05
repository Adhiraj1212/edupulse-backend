// Student microservice: JSON API only. Sits behind nginx, which authenticates every
// request through auth-service and passes the caller's role in X-User-Role.
const express = require("express");
const studentRouter = require("./Server/server");
const events = require("./events");

const app = express();
const port = process.env.PORT || 5000;

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.get("/healthz", (req, res) => res.json({ status: "ok" }));

// Role check. The service is only reachable through nginx, which overwrites this header.
function roleGuard(req, res, next) {
  const role = req.get("X-User-Role");
  if (role === "teacher") return next();
  if (role === "student") {
    const readOnly =
      req.method === "GET" &&
      (req.path === "/studdetails" || req.path.startsWith("/student/"));
    if (readOnly) return next();
    return res.status(403).json({ message: "Students have read-only access" });
  }
  res.status(401).json({ message: "Authentication required" });
}

app.use("/api", roleGuard, studentRouter);

events.start();
app.listen(port, () => {
  console.log(`student-service is running on :${port}`);
});
