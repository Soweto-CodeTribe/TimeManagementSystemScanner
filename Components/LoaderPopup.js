import React, { useEffect, useRef } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import Svg, { Circle, Text, Defs, LinearGradient, Stop, G } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.5;
const CIRCLE_LENGTH = CIRCLE_SIZE * Math.PI;
const PARTICLE_COUNT = 24;

const LoaderPopup = ({ visible = false }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const particleAnims = useRef(
    [...Array(PARTICLE_COUNT)].map(() => ({
      scale: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    if (visible) {
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();

      // Circular progress animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(progressAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(progressAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Rotation animation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 8000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Particle animations
      particleAnims.forEach((anim, index) => {
        const startParticleAnimation = () => {
          Animated.sequence([
            Animated.delay(index * (2000 / PARTICLE_COUNT)),
            Animated.parallel([
              Animated.timing(anim.scale, {
                toValue: 1,
                duration: 1500,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
              }),
              Animated.timing(anim.opacity, {
                toValue: 1,
                duration: 800,
                easing: Easing.inOut(Easing.cubic),
                useNativeDriver: true,
              }),
            ]),
            Animated.parallel([
              Animated.timing(anim.scale, {
                toValue: 0,
                duration: 1500,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
              }),
              Animated.timing(anim.opacity, {
                toValue: 0,
                duration: 800,
                easing: Easing.inOut(Easing.cubic),
                useNativeDriver: true,
              }),
            ]),
          ]).start(() => {
            if (visible) {
              startParticleAnimation();
            }
          });
        };
        startParticleAnimation();
      });
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }

    return () => {
      progressAnim.stopAnimation();
      rotateAnim.stopAnimation();
      particleAnims.forEach(anim => {
        anim.scale.stopAnimation();
        anim.opacity.stopAnimation();
      });
    };
  }, [visible]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.loaderContainer}>
          {/* Floating particles */}
          {particleAnims.map((anim, index) => {
            const angle = (index * 360) / PARTICLE_COUNT;
            const radius = CIRCLE_SIZE * 0.6;
            return (
              <Animated.View
                key={index}
                style={[
                  styles.particle,
                  {
                    transform: [
                      { translateX: radius * Math.cos((angle * Math.PI) / 180) },
                      { translateY: radius * Math.sin((angle * Math.PI) / 180) },
                      { scale: anim.scale },
                    ],
                    opacity: anim.opacity,
                  },
                ]}
              />
            );
          })}

          {/* Main circular loader */}
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Svg height={CIRCLE_SIZE} width={CIRCLE_SIZE} viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}>
              <Defs>
                <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#8CC63F" stopOpacity="1" />
                  <Stop offset="100%" stopColor="#69A41D" stopOpacity="1" />
                </LinearGradient>
              </Defs>
              <G rotation="-90" origin={`${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2}`}>
                {/* Background circle */}
                <Circle
                  cx={CIRCLE_SIZE / 2}
                  cy={CIRCLE_SIZE / 2}
                  r={CIRCLE_SIZE * 0.4}
                  strokeWidth={4}
                  stroke="rgba(255, 255, 255, 0.1)"
                  fill="none"
                />
                {/* Animated progress circle */}
                <AnimatedCircle
                  cx={CIRCLE_SIZE / 2}
                  cy={CIRCLE_SIZE / 2}
                  r={CIRCLE_SIZE * 0.4}
                  strokeWidth={4}
                  stroke="url(#gradient)"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={[CIRCLE_LENGTH, CIRCLE_LENGTH]}
                  strokeDashoffset={progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [CIRCLE_LENGTH, 0],
                  })}
                />
              </G>
            </Svg>
          </Animated.View>

          {/* Inner content */}
          <View style={styles.innerContent}>
            <Animated.Text style={[styles.loadingText, { opacity: fadeAnim }]}>
              Loading
            </Animated.Text>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

// Create animated circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#8CC63F',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
    textShadowColor: 'rgba(140, 198, 63, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    backgroundColor: '#8CC63F',
    borderRadius: 3,
    shadowColor: '#8CC63F',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default LoaderPopup;