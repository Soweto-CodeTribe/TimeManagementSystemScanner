"use client"

import { useEffect, useRef } from "react"
import { View, Animated, StyleSheet, Dimensions, Easing } from "react-native"
import { Svg, Text, Defs, RadialGradient, Stop, Circle } from "react-native-svg"

const { width, height } = Dimensions.get("window")
const CONTAINER_WIDTH = width * 0.9
const LETTER_WIDTH = CONTAINER_WIDTH / 9

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
    { text: "e", color: "#808285" }
  ]

  const animValues = useRef(
    letters.map(() => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      rotate: new Animated.Value(0),
      scale: new Animated.Value(0),
      opacity: new Animated.Value(0),
    })),
  ).current

  const particleAnimValues = useRef(
    Array(20).fill().map(() => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      scale: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current

  const glowAnim = useRef(new Animated.Value(0)).current
  const glowSizeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Initial setup - random positions outside the screen
    const randomPositions = letters.map(() => ({
      x: (Math.random() > 0.5 ? 1 : -1) * (width * 0.5 + Math.random() * width * 0.5),
      y: (Math.random() > 0.5 ? 1 : -1) * (height * 0.5 + Math.random() * height * 0.5),
      rotate: Math.random() * 720 - 360,
    }))

    animValues.forEach((anim, i) => {
      anim.x.setValue(randomPositions[i].x)
      anim.y.setValue(randomPositions[i].y)
      anim.rotate.setValue(randomPositions[i].rotate)
      anim.scale.setValue(0.2)
      anim.opacity.setValue(0)
    })

    // Create particle initial states
    particleAnimValues.forEach((particle) => {
      particle.x.setValue((Math.random() * 2 - 1) * width * 0.8)
      particle.y.setValue((Math.random() * 2 - 1) * height * 0.8)
      particle.scale.setValue(0)
      particle.opacity.setValue(0)
    })

    const animations = []

    // Glow animation
    animations.push(
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.sin),
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 2000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.sin),
          }),
        ]),
      ),
    )
    
    animations.push(
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowSizeAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.sin),
          }),
          Animated.timing(glowSizeAnim, {
            toValue: 0.85,
            duration: 3000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.sin),
          }),
        ]),
      ),
    )

    // Letter animations with smoother easing
    animValues.forEach((anim, index) => {
      animations.push(
        Animated.sequence([
          Animated.delay(index * 100),
          Animated.parallel([
            Animated.timing(anim.opacity, {
              toValue: 1,
              duration: 1200,
              useNativeDriver: true,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
            Animated.spring(anim.x, {
              toValue: 0,
              friction: 6.5,
              tension: 45,
              useNativeDriver: true,
            }),
            Animated.spring(anim.y, {
              toValue: 0,
              friction: 6.5,
              tension: 45,
              useNativeDriver: true,
            }),
            Animated.timing(anim.rotate, {
              toValue: 0,
              duration: 1800,
              useNativeDriver: true,
              easing: Easing.bezier(0.215, 0.61, 0.355, 1),
            }),
            Animated.spring(anim.scale, {
              toValue: 1,
              friction: 6,
              tension: 60,
              useNativeDriver: true,
            }),
          ]),
        ]),
      )
    })

    // Particle animations
    particleAnimValues.forEach((particle, i) => {
      const delay = 1500 + Math.random() * 1000
      const duration = 3000 + Math.random() * 2000
      
      animations.push(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(particle.opacity, {
              toValue: 0.7,
              duration: duration / 4,
              useNativeDriver: true,
              easing: Easing.bezier(0.4, 0, 0.2, 1),
            }),
            Animated.timing(particle.scale, {
              toValue: 0.3 + Math.random() * 0.7,
              duration: duration / 3,
              useNativeDriver: true,
              easing: Easing.bezier(0.4, 0, 0.2, 1),
            }),
            Animated.timing(particle.x, {
              toValue: particle.x._value + (Math.random() * 2 - 1) * width * 0.3,
              duration: duration,
              useNativeDriver: true,
              easing: Easing.bezier(0.4, 0, 0.2, 1),
            }),
            Animated.timing(particle.y, {
              toValue: particle.y._value + (Math.random() * 2 - 1) * height * 0.3,
              duration: duration,
              useNativeDriver: true,
              easing: Easing.bezier(0.4, 0, 0.2, 1),
            }),
          ]),
          Animated.parallel([
            Animated.timing(particle.opacity, {
              toValue: 0,
              duration: duration / 4,
              useNativeDriver: true,
            }),
            Animated.timing(particle.scale, {
              toValue: 0,
              duration: duration / 4,
              useNativeDriver: true,
            }),
          ]),
        ])
      )
    })

    // Pulse effect with better timing and smoother animation
    const pulseAnimation = Animated.sequence([
      Animated.delay(2200),
      Animated.stagger(60, 
        animValues.map((anim) =>
          Animated.sequence([
            Animated.spring(anim.scale, {
              toValue: 1.15,
              friction: 8,
              tension: 100,
              useNativeDriver: true,
            }),
            Animated.spring(anim.scale, {
              toValue: 1,
              friction: 8,
              tension: 100,
              useNativeDriver: true,
            }),
          ]),
        )
      ),
    ])

    animations.push(pulseAnimation)

    // Final scale-up animation with smoother transition
    const finalScaleUp = Animated.sequence([
      Animated.delay(3800),
      Animated.stagger(40,
        animValues.map((anim) =>
          Animated.timing(anim.scale, {
            toValue: 1.5,
            duration: 600,
            useNativeDriver: true,
            easing: Easing.bezier(0.215, 0.61, 0.355, 1),
          }),
        ),
      ),
    ])

    animations.push(finalScaleUp)

    // Start all animations
    Animated.parallel(animations).start()

    // Transition to the main app after animations with fade out
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        }),
        ...animValues.map((anim, i) =>
          Animated.timing(anim.opacity, {
            toValue: 0,
            duration: 800,
            delay: i * 50,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true,
          }),
        ),
        ...particleAnimValues.map((particle) =>
          Animated.timing(particle.opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ),
      ]).start(() => navigation.replace("GetStartedScreen"));
    }, 5200)

    return () => {
      clearTimeout(timer)
    }
  }, [animValues, navigation, glowAnim, glowSizeAnim, particleAnimValues])

  return (
    <View style={styles.container}>
      {/* Animated background glow circles */}
      <Animated.View
        style={[
          styles.glowContainer,
          {
            opacity: glowAnim,
            transform: [{ scale: glowSizeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.85, 1]
            }) }]
          },
        ]}
      >
        <View style={styles.glowCircle1} />
        <View style={styles.glowCircle2} />
      </Animated.View>

      {/* Particle effects */}
      {particleAnimValues.map((particle, index) => (
        <Animated.View
          key={`particle-${index}`}
          style={[
            styles.particle,
            {
              opacity: particle.opacity,
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { scale: particle.scale },
              ],
              backgroundColor: index % 2 === 0 ? '#8CC63F' : '#808285',
            },
          ]}
        />
      ))}

      <View style={styles.textContainer}>
        {letters.map((letter, index) => {
          const anim = animValues[index]

          return (
            <Animated.View
              key={index}
              style={[
                styles.letterContainer,
                {
                  opacity: anim.opacity,
                  transform: [
                    { translateX: anim.x },
                    { translateY: anim.y },
                    {
                      rotate: anim.rotate.interpolate({
                        inputRange: [-360, 360],
                        outputRange: ["-360deg", "360deg"],
                      }),
                    },
                    { scale: anim.scale },
                  ],
                },
              ]}
            >
              <Svg height={LETTER_WIDTH} width={LETTER_WIDTH} viewBox={`0 0 ${LETTER_WIDTH} ${LETTER_WIDTH}`}>
                <Defs>
                  <RadialGradient
                    id={`letterGrad${index}`}
                    cx="50%"
                    cy="50%"
                    rx="70%"
                    ry="70%"
                    gradientUnits="userSpaceOnUse"
                  >
                    <Stop offset="0%" stopColor={letter.color} stopOpacity="1" />
                    <Stop offset="70%" stopColor={letter.color} stopOpacity="0.9" />
                    <Stop offset="100%" stopColor={letter.color} stopOpacity="0.7" />
                  </RadialGradient>
                </Defs>
                <Circle 
                  cx={LETTER_WIDTH / 2} 
                  cy={LETTER_WIDTH / 2} 
                  r={LETTER_WIDTH * 0.35} 
                  opacity={0.15} 
                  fill={letter.color} 
                />
                <Text
                  fill={`url(#letterGrad${index})`}
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
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#000000",
    overflow: "hidden",
  },
  glowContainer: {
    position: "absolute",
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  glowCircle1: {
    position: "absolute",
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(140, 198, 63, 0.15)",
  },
  glowCircle2: {
    position: "absolute",
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    backgroundColor: "rgba(140, 198, 63, 0.08)",
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: CONTAINER_WIDTH,
    justifyContent: "center",
    position: "relative",
    height: LETTER_WIDTH * 1.5,
  },
  letterContainer: {
    width: LETTER_WIDTH,
    height: LETTER_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  particle: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 3,
  },
})

export default CodeTribeSplash