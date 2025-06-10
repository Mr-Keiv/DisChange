import LottieView from "lottie-react-native";

import cocoa from "@/assets/animation/animation.json";

export default function SplashScreen({ onFinish = (isCancelled) => {} } : { onFinish?: (isCancelled: boolean) => void }) {
  return (
    <LottieView
      source={cocoa}
      onAnimationFinish={onFinish}
      autoPlay
      resizeMode="cover"
      loop={false}
      speed={3} // Increased animation speed by 3x
      style={{
        flex: 1,
        width: "100%"
      }}
    />   
  )
}          