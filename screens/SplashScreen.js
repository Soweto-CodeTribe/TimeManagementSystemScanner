import { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Dimensions, Easing } from "react-native";
import { Svg, Text } from "react-native-svg";

const { width } = Dimensions.get("window");
const CONTAINER_WIDTH = width * 0.9;
const LETTER_WIDTH = CONTAINER_WIDTH / 9;

const CodeTribeSplash = ({ navigation }) => {
  const letters = [
    { text: "C", color: "#8CC63F" },
    { text: "o", color: "#8CC63F" },
    { text: "d", color: "#8CC63F" },
    { text: "e", color: "#8CC63F" },
    { text: "T", color: "#808285" },
    { text: "r", color: "#808285" },
    { text: "i", color: "#808285" },
    { text: "b", color: "#808285" },
    { text: "e", color: "#808285" },
  ];

  const animValues = useRef(letters.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Start animations for each letter
    const animations = animValues.map((value, index) =>
      Animated.timing(value, {
        toValue: 1,
        duration: 1500,
        delay: index * 100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    );

    // Play all animations in sequence
    Animated.stagger(100, animations).start();

    // Transition to the main app after animations
    const timer = setTimeout(() => {
      Animated.parallel(
        animValues.map((value) =>
          Animated.timing(value, {
            toValue: 0,
            duration: 500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          })
        )
      ).start(() => navigation.replace("GetStartedScreen"));
    }, letters.length * 100 + 1500);

    return () => {
      clearTimeout(timer);
      animValues.forEach((value) => value.stopAnimation());
    };
  }, [animValues, navigation]);

  const getAnimatedStyle = (animValue) => ({
    opacity: animValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.3, 1, 0.3],
    }),
    transform: [
      {
        scale: animValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 1.1, 1],
        }),
      },
      {
        translateY: animValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, -5, 0],
        }),
      },
    ],
  });

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        {letters.map((letter, index) => (
          <Animated.View
            key={index}
            style={[styles.letterContainer, getAnimatedStyle(animValues[index])]}
          >
            <Svg
              height={LETTER_WIDTH}
              width={LETTER_WIDTH}
              viewBox={`0 0 ${LETTER_WIDTH} ${LETTER_WIDTH}`}
            >
              <Text
                fill={letter.color}
                fontSize={LETTER_WIDTH * 0.8}
                fontWeight="bold"
                x={LETTER_WIDTH / 2}
                y={LETTER_WIDTH * 0.75}
                textAnchor="middle"
              >
                {letter.text}
              </Text>
            </Svg>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: CONTAINER_WIDTH,
    justifyContent: "center",
  },
  letterContainer: {
    width: LETTER_WIDTH,
    height: LETTER_WIDTH,
    justifyContent: "center",
    paddingHorizontal: 5,
    alignItems: "center",
  },
});

export default CodeTribeSplash;
