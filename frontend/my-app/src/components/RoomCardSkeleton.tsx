import { Card, CardContent, Skeleton, Box } from "@mui/material";

export default function RoomCardSkeleton() {
  return (
    <Card
      sx={{
        backgroundColor: "#2e2e45",
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Skeleton variant="text" width="60%" height={30} />
          <Skeleton variant="circular" width={10} height={10} />
        </Box>

        <Skeleton variant="text" width="50%" />
        <Skeleton variant="text" width="40%" />

        <Box mt={2} display="flex" gap={2}>
          <Skeleton variant="rectangular" width={110} height={35} />
          <Skeleton variant="rectangular" width={110} height={35} />
        </Box>
      </CardContent>
    </Card>
  );
}
