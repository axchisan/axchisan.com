export default function AdminLoading() {
  return (
    <div>
      <div className="h-7 w-40 animate-pulse rounded-md bg-raised" />
      <div className="mt-2 h-4 w-64 animate-pulse rounded-md bg-raised" />
      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-[12px] border border-line bg-raised p-5">
            <div className="h-4 w-32 animate-pulse rounded-md bg-raised" />
            <div className="mt-2 h-8 w-16 animate-pulse rounded-md bg-raised" />
            <div className="mt-3 h-12 w-full animate-pulse rounded-md bg-raised" />
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-[12px] border border-line bg-raised p-5">
            <div className="h-10 w-10 animate-pulse rounded-[8px] bg-raised" />
            <div className="mt-4 h-8 w-16 animate-pulse rounded-md bg-raised" />
            <div className="mt-2 h-3 w-20 animate-pulse rounded-md bg-raised" />
          </div>
        ))}
      </div>
    </div>
  )
}
