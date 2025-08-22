import Loading from "@/components/shared/Loading";

export default function LoadingPage() {
  // Or a custom loading skeleton component
  return (
    <div className="flex flex-col items-center justify-center flex-grow h-full">
      <Loading height="100%" maxHeight="100%" scale={4} />
    </div>
  );
}
