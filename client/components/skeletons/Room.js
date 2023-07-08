import { Box, Group, Skeleton } from '@mantine/core'

export default function RoomSkeleton({loading}) {
    return (
        <>
        <Skeleton height={30} mt={10} width="50%" radius="sm" sx={{margin:"auto"}} visible={loading}/>
        <Box sx={{flexDirection:'row', justifyContent:'center'}} display={'flex'}>
            <Skeleton height={200} mt={20} mr={30} width="25%" radius="sm" visible={loading}/>
            <Skeleton height={200} mt={20} width="25%" radius="sm"  visible={loading}/>
        </Box>
        <Skeleton height={20} mt={15} width="60%" radius="xl" sx={{margin:"auto"}} visible={loading}/>
        <Skeleton height={20} mt={15} width="60%" radius="xl" sx={{margin:"auto"}} visible={loading}/>
        <Skeleton height={20} mt={15} width="60%" radius="xl" sx={{margin:"auto"}} visible={loading}/>
        <Skeleton height={20} mt={15} width="60%" radius="xl" sx={{margin:"auto"}} visible={loading}/>
        <Skeleton height={20} mt={15} width="60%" radius="xl" sx={{margin:"auto"}} visible={loading}/>
        </>
    )
}