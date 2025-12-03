import { useNavigation as useGroveNav } from '@react-navigation/native';
import { traicapnafonts as fontsTrail } from '../traicapnafonts';
import {
    useWindowDimensions as useGroveWnd,
	Image as GroveImage,
	View as GroveView,
	TouchableOpacity as GroveTouchable,
	Text as GroveText,
} from 'react-native';
import React, { useState as useGroveState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrailFramesGrove from '../LearnDataTrail/learniatraiGret'

const GROVE_FIRST_LAUNCH_KEY = 'niag-grove-first-0012124u345-flag';

const CaptureLearnNiagaraTrailOnboarding: React.FC = () => {
	const { width: vistaW, height: vistaH } = useGroveWnd();
	const groveNavigator = useGroveNav();
	const [captindxtrail, setCaptindxtrail] = useGroveState(0);

	const proglearnTrailStp = async () => {
		const last = TrailFramesGrove.length - 1;
		if (captindxtrail < last) {
			setCaptindxtrail(prev => prev + 1);
		} else {
			try {
				// ensure same first-launch flag is set as on loading
				await AsyncStorage.setItem(GROVE_FIRST_LAUNCH_KEY, 'true');
			} catch (err) {
				if (__DEV__) console.warn('Onboarding:setFirstFlag', err);
			}
			groveNavigator.replace?.('ExploringContainerOfApplication');
		}
	};

	return (
		<GroveView style={{ height: vistaH, alignItems: 'center', width: vistaW, flex: 1 }}>
			<GroveImage
				source={TrailFramesGrove[captindxtrail]}
				resizeMode="cover"
				style={{ width: vistaW, height: vistaH * 1.0201035 }}
			/>

			<GroveTouchable
				onPress={proglearnTrailStp}
				style={{
					height: vistaH * 0.06105345,
					alignSelf: 'center',
					backgroundColor: '#F6AE29',
					alignItems: 'center',
					bottom: vistaH * 0.019,
					position: 'absolute',
					justifyContent: 'center',
					borderRadius: vistaH * 0.1,
					width: vistaW * 0.860543,
				}}
				activeOpacity={0.8}
			>
				<GroveText style={{
					textAlign: 'center',
					fontSize: vistaW * 0.044,
					fontFamily: fontsTrail.capturePoppinsSemiBold,
					color: '#00261A',
				}}>
					Next
				</GroveText>
			</GroveTouchable>
		</GroveView>
	);
};

export default CaptureLearnNiagaraTrailOnboarding;
