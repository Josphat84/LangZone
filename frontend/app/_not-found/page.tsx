// frontend/app/_not-found.tsx
import ClientLayout from "@/components/ClientLayout";

export default function NotFound() {
  return (
    <ClientLayout>
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "70vh",
        textAlign: "center",
        padding: "2rem"
      }}>
        <h1 style={{ fontSize: "4rem", marginBottom: "1rem" }}>404</h1>
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Page Not Found</h2>
        <p style={{ maxWidth: "400px", marginBottom: "2rem" }}>
          Sorry, the page you are looking for doesn’t exist or has been moved.
        </p>
        <a
          href="/"
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#4F46E5",
            color: "white",
            borderRadius: "0.5rem",
            textDecoration: "none",
            fontWeight: "bold"
          }}
        >
          Go Back Home
        </a>
      </div>
    </ClientLayout>
  );
}
