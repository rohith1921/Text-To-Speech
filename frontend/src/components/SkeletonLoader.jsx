// client/src/components/SkeletonLoader.jsx
export const AudioListSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-700 h-16 rounded-lg" />
      ))}
    </div>
);