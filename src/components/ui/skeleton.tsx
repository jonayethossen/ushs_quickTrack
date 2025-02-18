import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted bg-opacity-50 bg-black', className)}
      {...props}
    />
  )
}

export { Skeleton }
