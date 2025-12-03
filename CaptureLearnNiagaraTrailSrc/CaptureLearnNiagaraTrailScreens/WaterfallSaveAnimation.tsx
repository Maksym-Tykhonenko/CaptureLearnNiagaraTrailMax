import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

interface Particle {
	x: Animated.Value;
	y: Animated.Value;
	opacity: Animated.Value;
	scale: Animated.Value;
	delay: number;
	duration: number;
	initialX: number;
}

export default function WaterfallSaveAnimation({ 
	visible, 
	onComplete,
	startX,
	startY 
}: { 
	visible: boolean; 
	onComplete: () => void;
	startX: number;
	startY: number;
}) {
	const particlesRef = useRef<Particle[]>([]);

	useEffect(() => {
		if (!visible) return;

		const dropletSize = 6; // smaller droplets
		const particles: Particle[] = Array.from({ length: 24 }, (_, i) => {
			const spread = 38; // tighter spread
			const initialX = startX - dropletSize / 2 + (Math.random() - 0.5) * spread;
			const initialY = startY - dropletSize / 2;
			return {
				x: new Animated.Value(initialX),
				y: new Animated.Value(initialY),
				opacity: new Animated.Value(0),
				scale: new Animated.Value(0.3),
				delay: i * 55,
				duration: 1700 + Math.random() * 500,
				initialX,
			};
		});

		particlesRef.current = particles;

		const animations = particles.map((particle) => {
			const wave = Math.sin(particle.delay * 0.013) * 32;
			return Animated.sequence([
				Animated.delay(particle.delay),
				Animated.parallel([
					Animated.timing(particle.opacity, {
						toValue: 1,
						duration: 220,
						useNativeDriver: true,
					}),
					Animated.timing(particle.scale, {
						toValue: 0.7 + Math.random() * 0.3,
						duration: 220,
						useNativeDriver: true,
					}),
					Animated.timing(particle.y, {
						toValue: height * 0.7,
						duration: particle.duration,
						useNativeDriver: true,
					}),
					Animated.timing(particle.x, {
						toValue: particle.initialX + wave,
						duration: particle.duration,
						useNativeDriver: true,
					}),
				]),
				Animated.timing(particle.opacity, {
					toValue: 0,
					duration: 650,
					useNativeDriver: true,
				}),
			]);
		});

		Animated.parallel(animations).start(() => {
			onComplete();
		});
	}, [visible, onComplete, startX, startY]);

	if (!visible) return null;

	return (
		<View style={StyleSheet.absoluteFill} pointerEvents="none">
			{particlesRef.current.map((particle, index) => (
				<Animated.View
					key={index}
					style={[
						styles.particle,
						{
							transform: [
								{ translateX: particle.x },
								{ translateY: particle.y },
								{ scale: particle.scale },
							],
							opacity: particle.opacity,
						},
					]}
				>
					<View style={[
						styles.droplet,
						{ 
							backgroundColor: index % 3 === 0 ? '#4A90E2' : index % 3 === 1 ? '#5BA3E8' : '#7AB8F0',
							width: 6,
							height: 8,
							borderRadius: 6,
						}
					]} />
				</Animated.View>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	particle: {
		position: 'absolute',
		top: 0,
		left: 0,
	},
	droplet: {
		shadowColor: '#4A90E2',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.6,
		shadowRadius: 4,
	},
});
