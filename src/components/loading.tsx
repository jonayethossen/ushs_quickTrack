import { Card } from './ui/card'
import { Skeleton } from './ui/skeleton'

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Skeleton className="h-10 w-72 mx-auto mb-6" />
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-24" />
        ))}
      </div>
      <Card className="p-4">
        <Skeleton className="h-[400px] w-full" />
      </Card>
    </div>
  )
}
