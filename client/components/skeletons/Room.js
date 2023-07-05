import { Skeleton } from '@mantine/core'

export default function RoomSkeleton({loading}) {
    return (
        <>
        <Skeleton height={30} mt={10} width="50%" radius="sm" sx={{margin:"auto"}} visible={loading}/>
        <Skeleton height={200} mt={20} width="20%" radius="sm" sx={{margin:"auto"}} visible={loading}/>
        <Skeleton height={20} mt={15} width="60%" radius="xl" sx={{margin:"auto"}} visible={loading}/>
        <Skeleton height={20} mt={15} width="60%" radius="xl" sx={{margin:"auto"}} visible={loading}/>
        <Skeleton height={20} mt={15} width="60%" radius="xl" sx={{margin:"auto"}} visible={loading}/>
        <Skeleton height={20} mt={15} width="60%" radius="xl" sx={{margin:"auto"}} visible={loading}/>
        <Skeleton height={20} mt={15} width="60%" radius="xl" sx={{margin:"auto"}} visible={loading}/>
        </>
    )
}