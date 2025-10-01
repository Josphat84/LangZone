// app/not-found.tsx
export const dynamic = "force-dynamic"; // prevents prerender issues

export default function NotFound() {
  return (
    <div className="text-center mt-20 text-gray-700">
      Page was not found
    </div>
  );
}
