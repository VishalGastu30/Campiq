import Skeleton, { SkeletonProps, SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function SkeletonLoader(props: SkeletonProps) {
  return (
    <SkeletonTheme baseColor="var(--bg-raised)" highlightColor="var(--bg-surface)">
      <Skeleton {...props} />
    </SkeletonTheme>
  );
}
