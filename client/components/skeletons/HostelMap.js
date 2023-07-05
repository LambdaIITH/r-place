import { Skeleton, Grid, Box } from "@mantine/core";

export default function HostelMapSkeleton({loading}){
    return (
        <>
            <Skeleton height={40} radius="sm" mt={15} width="40%" sx={{margin:"auto"}} visible={loading}/>
            <Box sx={{width:"800px", margin:"auto"}}>
                <Grid columns={4} >
                <Grid.Col span={1}>
                    <Skeleton height={170} radius="sm" mt={15} width="100%" sx={{margin:"auto"}} visible={loading}/>
                </Grid.Col>
                <Grid.Col span={1}>
                    <Skeleton height={170} radius="sm" mt={15} width="100%" sx={{margin:"auto"}} visible={loading}/>
                </Grid.Col>
                <Grid.Col span={1}>
                    <Skeleton height={170} radius="sm" mt={15} width="100%" sx={{margin:"auto"}} visible={loading}/>
                </Grid.Col>
                <Grid.Col span={1}>
                    <Skeleton height={170} radius="sm" mt={15} width="100%" sx={{margin:"auto"}} visible={loading}/>
                </Grid.Col>
                <Grid.Col span={1}>
                    <Skeleton height={170} radius="sm" mt={15} width="100%" sx={{margin:"auto"}} visible={loading}/>
                </Grid.Col>
                <Grid.Col span={1}>
                    <Skeleton height={170} radius="sm" mt={15} width="100%" sx={{margin:"auto"}} visible={loading}/>
                </Grid.Col>
                <Grid.Col span={1}>
                    <Skeleton height={170} radius="sm" mt={15} width="100%" sx={{margin:"auto"}} visible={loading}/>
                </Grid.Col>
                <Grid.Col span={1}>
                    <Skeleton height={170} radius="sm" mt={15} width="100%" sx={{margin:"auto"}} visible={loading}/>
                </Grid.Col>
                </Grid>
            </Box>
        </>
    )
}