import { Skeleton } from '@mantine/core'

export default function PlaceCanvas({loading}) {
    return (
        <>
        <Skeleton height="600px" mt={10} width="600px" radius="sm" sx={{margin:"auto"}} visible={loading}/>
        <Skeleton height="30px" mt={10} width="600px" radius="sm" sx={{margin:"auto"}} visible={loading}/>
        </>
    )
}