/** @jsxImportSource frog/jsx */
import { createSystem, colors } from "frog/ui";

export const {
  Box,
  Columns,
  Column,
  Heading,
  HStack,
  Rows,
  Row,
  Spacer,
  Text,
  VStack,
  vars,
} = createSystem({
  colors: {
    black: "#000000",
    white: "#FFFFFF",
    purple: '#6826F6',
    darkPurple: colors.dark.purple1000,
  },
  fonts: {
    default: [
      {
        name: 'Poppins',
        source: 'google',
        weight: 700,
      },
      {
        name: 'Poppins',
        source: 'google',
        weight: 500,
      },
    ]
  },
})
