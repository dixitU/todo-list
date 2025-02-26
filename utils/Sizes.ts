/* eslint-disable @typescript-eslint/naming-convention */
import { Dimensions, Platform } from "react-native"
const { width, height } = Dimensions.get("window")
const FindSize = (size:number, viewPort = 414) :number=> {
  let widthSample = width
  if (Platform.OS === "ios") {
    widthSample = width / 1.5
  }
  return parseFloat((size * widthSample / viewPort).toString())
}

export const Size = {
  // Font Sizes
  _18: FindSize(18),
  _16: FindSize(16),
  _14: FindSize(14),
  _12: FindSize(12),
  _10: FindSize(10),

  // Other Sizes
  _15: FindSize(15),
  _20: FindSize(20),
  _24: FindSize(24),
  _28: FindSize(28),
  _32: FindSize(32),
  _40: FindSize(40),
  _50: FindSize(50),
  FindSize,
  width,
  height
}

export const Size_428 = {
  // Font Sizes
  _18: FindSize(18, 428),
  _16: FindSize(16, 428),
  _14: FindSize(14, 428),
  _12: FindSize(12, 428),
  _10: FindSize(10, 428),

  // Other Sizes
  _15: FindSize(15, 428),
  _20: FindSize(20, 428),
  _24: FindSize(24, 428),
  _28: FindSize(28, 428),
  _32: FindSize(32, 428),
  _40: FindSize(40, 428),
  _50: FindSize(50, 428),
  FindSize: (value:number) => FindSize(value, 428),
  width,
  height
}

export const Size_495 = {
  // Font Sizes
  _18: FindSize(18, 495),
  _16: FindSize(16, 495),
  _14: FindSize(14, 495),
  _12: FindSize(12, 495),
  _10: FindSize(10, 495),

  // Other Sizes
  _15: FindSize(15, 495),
  _20: FindSize(20, 495),
  _24: FindSize(24, 495),
  _28: FindSize(28, 495),
  _32: FindSize(32, 495),
  _40: FindSize(40, 495),
  _50: FindSize(50, 495),
  FindSize: (value:number) => FindSize(value, 495),
  width,
  height
}