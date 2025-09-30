
'use client';

export default function NotFoundPage() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      textAlign: "center",
      padding: "2rem"
    }}>
      <h1 style={{ fontSize: "4rem", marginBottom: "1rem" }}>404</h1>
      <p style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>
        Oops! The page you’re looking for does not exist.
      </p>
      <a href="/" style={{
        padding: "0.75rem 1.5rem",
        fontSize: "1rem",
        borderRadius: "8px",
        backgroundColor: "#4f46e5",
        color: "#fff",
        textDecoration: "none"
      }}>
        Go Home
      </a>
    </div>
  );
}
