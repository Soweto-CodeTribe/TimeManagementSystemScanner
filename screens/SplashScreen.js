"use client"

import { useEffect, useRef, useState } from "react"
import { View, Animated, StyleSheet, Dimensions, Easing } from "react-native"
import { Svg, Text, Defs, RadialGradient, Stop, Circle } from "react-native-svg"

const { width, height } = Dimensions.get("window")
const CONTAINER_WIDTH = width * 0.9
const LETTER_WIDTH = CONTAINER_WIDTH / 9

const SplashScreen = ({ navigation }) => {
  const [isInitialized, setIsInitialized] = useState(false)
  
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

  // Create animated values only once
  const animValues = useRef(
    letters.map(() => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      rotate: new Animated.Value(0),
      scale: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current

  const particleAnimValues = useRef(
    Array(15).fill().map(() => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      scale: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current

  const glowAnim = useRef(new Animated.Value(0)).current
  const glowSizeAnim = useRef(new Animated.Value(0)).current

  // Initialize animation values before starting animations
  useEffect(() => {
    if (isInitialized) return

    // Initialize letter animations with more consistent starting positions
    const randomPositions = letters.map(() => ({
      x: (Math.random() > 0.5 ? 1 : -1) * (width * 0.5 + Math.random() * width * 0.3),
      y: (Math.random() > 0.5 ? 1 : -1) * (height * 0.5 + Math.random() * height * 0.3),
      rotate: Math.random() * 360 - 180, // Reduced rotation range for smoother animation
    }))

    animValues.forEach((anim, i) => {
      anim.x.setValue(randomPositions[i].x)
      anim.y.setValue(randomPositions[i].y)
      anim.rotate.setValue(randomPositions[i].rotate)
      anim.scale.setValue(0.2)
      anim.opacity.setValue(0)
    })

    // Initialize particle animations with better distribution
    particleAnimValues.forEach((particle, i) => {
      // Distribute particles more evenly
      const angle = (i / particleAnimValues.length) * Math.PI * 2
      const distance = Math.random() * width * 0.4
      particle.x.setValue(Math.cos(angle) * distance)
      particle.y.setValue(Math.sin(angle) * distance)
      particle.scale.setValue(0)
      particle.opacity.setValue(0)
    })

    setIsInitialized(true)
  }, [animValues, particleAnimValues, width, height, letters.length, isInitialized])

  // Run animations after initialization
  useEffect(() => {
    if (!isInitialized) return

    const animations = []

    // Glow animation with improved timing
    const glowSequence = Animated.loop(
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
      ])
    )
    
    const glowSizeSequence = Animated.loop(
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
      ])
    )

    animations.push(glowSequence)
    animations.push(glowSizeSequence)

    // Letter animations with improved staggered start
    const letterAnimations = []
    
    animValues.forEach((anim, index) => {
      letterAnimations.push(
        Animated.sequence([
          Animated.delay(index * 80), // Slightly faster stagger for smoother appearance
          Animated.parallel([
            Animated.timing(anim.opacity, {
              toValue: 1,
              duration: 1000, // Slightly faster for smoother appearance
              useNativeDriver: true,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }),
            Animated.spring(anim.x, {
              toValue: 0,
              friction: 7, // Increased friction for less bouncing
              tension: 50, // Adjusted tension for smoother movement
              useNativeDriver: true,
            }),
            Animated.spring(anim.y, {
              toValue: 0,
              friction: 7, // Increased friction for less bouncing
              tension: 50, // Adjusted tension for smoother movement
              useNativeDriver: true,
            }),
            Animated.timing(anim.rotate, {
              toValue: 0,
              duration: 1500, // Slightly faster rotation
              useNativeDriver: true,
              easing: Easing.bezier(0.215, 0.61, 0.355, 1),
            }),
            Animated.spring(anim.scale, {
              toValue: 1,
              friction: 7, // Increased friction for less bouncing
              tension: 60,
              useNativeDriver: true,
            }),
          ]),
        ])
      )
    })
    
    animations.push(Animated.parallel(letterAnimations))

    // Particle animations with improved timing and reduced simultaneous animations
    const particleAnimations = particleAnimValues.map((particle, i) => {
      // More consistent timing with less randomness to avoid glitches
      const delay = 1200 + (i % 5) * 200
      const duration = 2500 + (i % 3) * 500
      
      // More controlled movement paths
      const angle = Math.random() * Math.PI * 2
      const distance = width * 0.2 + Math.random() * width * 0.1
      const randomXDest = Math.cos(angle) * distance
      const randomYDest = Math.sin(angle) * distance
      
      return Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(particle.opacity, {
            toValue: 0.7,
            duration: duration / 4,
            useNativeDriver: true,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          }),
          Animated.timing(particle.scale, {
            toValue: 0.3 + (i % 5) * 0.1, // More consistent sizes
            duration: duration / 3,
            useNativeDriver: true,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          }),
          Animated.timing(particle.x, {
            toValue: randomXDest,
            duration: duration,
            useNativeDriver: true,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          }),
          Animated.timing(particle.y, {
            toValue: randomYDest,
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
    })
    
    // Group particles in smaller batches (3 at a time) to avoid performance issues
    const particleBatches = []
    for (let i = 0; i < particleAnimValues.length; i += 3) {
      particleBatches.push(
        Animated.stagger(25, particleAnimations.slice(i, i + 3))
      )
    }
    animations.push(...particleBatches)

    // Pulse effect with smoother timing
    const pulseAnimation = Animated.sequence([
      Animated.delay(2200),
      Animated.stagger(35, 
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

    // Final scale-up animation
    const finalScaleUp = Animated.sequence([
      Animated.delay(3800),
      Animated.stagger(35, // Slightly faster stagger
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
    const masterAnimation = Animated.parallel(animations)
    masterAnimation.start()

    // Handle navigation with fade out
    const timer = setTimeout(() => {
      const fadeOutAnims = [
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
            delay: i * 40, // Slightly faster stagger for smoother fade out
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
      ]
      
      Animated.parallel(fadeOutAnims).start(() => {
        if (navigation && navigation.replace) {
          navigation.replace("GetStartedScreen")
        }
      })
    }, 5200)

    // Cleanup function
    return () => {
      masterAnimation.stop()
      glowSequence.stop()
      glowSizeSequence.stop()
      clearTimeout(timer)
    }
  }, [
    animValues, 
    particleAnimValues, 
    glowAnim, 
    glowSizeAnim, 
    navigation, 
    isInitialized, 
    width, 
    height
  ])

  return (
    <View style={styles.container}>
      {/* Animated background glow circles */}
      <Animated.View
        style={[
          styles.glowContainer,
          {
            opacity: glowAnim,
            transform: [{ 
              scale: glowSizeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.85, 1]
              }) 
            }]
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
              key={`letter-${index}`}
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
    backgroundColor: "#fff",
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

export default SplashScreen