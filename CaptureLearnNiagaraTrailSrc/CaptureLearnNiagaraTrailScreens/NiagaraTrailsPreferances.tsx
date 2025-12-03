import React, { useState as useTrailState, useEffect as useTrailEffect, useRef as useTrailRef } from 'react';
import {
	TouchableOpacity as LearnBtnNiatrail,
	Dimensions as DimLearnNiatrail,
	Text as NiatextGaracaptu,
	Image as LearnImageNiatrail,
	View as AilBoxcaptuna,
	ScrollView as LearnScrollNiatrail,
	Share as CaptShareTraiNa,
	Linking as EarntraLinkcaping,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { traicapnafonts } from '../traicapnafonts';

export default function NiagaraTrailsPreferances({ isShowDetails, setIsShowDetails }: { isShowDetails: boolean, setIsShowDetails: (value: boolean) => void }) {
	const { width, height } = DimLearnNiatrail.get('window');

	const [notifications, setNotifications] = useTrailState<boolean>(false);

	// items rendered via map for optimization; icon assumes file at ../assets/learnshare.png
	const items: { key: string; title: string; type: 'switch' | 'action'; icon?: any; onPress?: () => void }[] = [
		{ key: 'share', title: 'Share the app', type: 'action', icon: require('../CaptureLearnNiagaraTrailAssets/CaptureLearnNiagaraTrailImages/learnshare.png') },
		{ key: 'terms', title: 'Privacy Policy', type: 'action' },
		{ key: 'notifications', title: 'Notifications', type: 'switch' },
	];

	useTrailEffect(() => {
		(async () => {
			try {
				const val = await AsyncStorage.getItem('capleartrailNotifilearn');
				if (val !== null) {
					setNotifications(val === 'true');
				}
			} catch (e) {
				// ignore load errors
			}
		})();
	}, []);

	const toggleNotifications = async () => {
		try {
			const next = !notifications;
			setNotifications(next);
			await AsyncStorage.setItem('capleartrailNotifilearn', next ? 'true' : 'false');
		} catch (e) {
			// ignore save errors
		}
	};

	const onShare = async () => {
		try {
			await CaptShareTraiNa.share({ message: `Niagara hides many wonders. Discover them with our Niagara Falls Journey app!` });
		} catch (e) {
			// ignore
		}
	};

	const onPressItem = (key: string) => {
		if (key === 'notifications') {
			toggleNotifications();
		} else if (key === 'share') {
			onShare();
		} else if (key === 'terms') {
			EarntraLinkcaping.openURL('https://www.termsfeed.com/live/4d369955-1ac8-419e-ac2d-014c14f87f52');
		}
	};

	return (
		<AilBoxcaptuna style={{ flex: 1, paddingTop: height * 0.03, paddingHorizontal: width * 0.04, position: 'relative' }}>
			<LearnScrollNiatrail contentContainerStyle={{ paddingBottom: height * 0.1 }}>
				{items.map(item => (
					<LearnBtnNiatrail
						key={item.key}
						activeOpacity={0.8}
						onPress={() => onPressItem(item.key)}
						style={{
							justifyContent: 'center',
							height: height * 0.07,
							backgroundColor: '#00261A', // dark inner card color
							marginBottom: height * 0.0160354,
							borderRadius: width * 0.06,
							paddingHorizontal: width * 0.05,
							width: width - width * 0.08,
						}}
					>
						<AilBoxcaptuna style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
							<NiatextGaracaptu style={{ color: '#ffffff', fontSize: width * 0.05, fontFamily: traicapnafonts?.regular || undefined }}>
								{item.title}
							</NiatextGaracaptu>

							{item.type === 'switch' ? (
								<LearnBtnNiatrail onPress={toggleNotifications} activeOpacity={0.8} style={{
									padding: width * 0.015,
									height: height * 0.04,
									borderRadius: height * 0.04,
									backgroundColor: notifications ? '#a82b2b' : '#2b2b2b',
									width: width * 0.14,
									justifyContent: 'center',
								}}>
									<AilBoxcaptuna style={{
										transform: [{ translateX: notifications ? width * 0.05 : 0 }],
										height: height * 0.041 - width * 0.03,
										backgroundColor: notifications ? '#ffffff' : '#ffffff',
										borderRadius: (height * 0.04 - width * 0.03) / 2,
										width: height * 0.041 - width * 0.03,
									}} />
								</LearnBtnNiatrail>
							) : item.key === 'share' && item.icon ? (
								<LearnImageNiatrail source={item.icon} style={{ width: width * 0.07, height: width * 0.07, tintColor: '#b22b2b', resizeMode: 'contain' }} />
							) : (
								<AilBoxcaptuna style={{ width: width * 0.07, height: width * 0.07 }} />
							)}
						</AilBoxcaptuna>
					</LearnBtnNiatrail>
				))}
			</LearnScrollNiatrail>
		</AilBoxcaptuna>
	);
}