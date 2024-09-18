/** @jsxImportSource frog/jsx */
import { Box } from "../api/[[...routes]]/ui";

export function getShareImage(displayName?: string, pfpUrl?: string) {
  console.log(displayName);
  return (
    <Box
      grow
      alignVertical="center"
      padding="10"
      paddingBottom="26"
      marginTop="2"
      marginBottom="2"
      fontWeight="700"
      position="relative"
    >
      <div
        style={{
          position: "absolute",
          display: "flex",
          top: 0,
          left: 0,
          width: "100%",
        }}
      >
        <img src="/Share.png" />
      </div>
      <div
        style={{
          position: "absolute",
          display: "flex",
          top: 600,
          left: 350,
          width: 500,
          height: 45,
          color: "white",
          fontSize: 44,
          fontFamily: "coinbase",
        }}
      >
        {`${displayName}`}
      </div>
      <div
        style={{
          position: "absolute",
          display: "flex",
          top: 180,
          left: 200,
          width: "28%",
          fontFamily: "Poppins",
        }}
      >
        <img
          src={pfpUrl}
          width={400}
          height={400}
          style={{
            borderRadius: "60%",
          }}
        />
      </div>
    </Box>
  );
}
