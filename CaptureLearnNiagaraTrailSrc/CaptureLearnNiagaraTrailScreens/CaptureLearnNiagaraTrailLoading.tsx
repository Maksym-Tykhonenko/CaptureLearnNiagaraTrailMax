import JumpyTickerDots from '../CaptureLearnNiagaraTrailComponents/AmazingRoundedAnimation';
import { useNavigation as useGroveNav } from '@react-navigation/native';
import React, { useEffect as useGroveEffect } from 'react';
import {
	Dimensions as GroveDimensions,
	View as RootViewGrove,
	Image as GroveImage,
	Alert,
} from 'react-native';
const GROVE_PERSIST_KEY = 'niag-grove-5543-omega-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
const GROVE_FIRST_LAUNCH_KEY = 'niag-grove-first-0012124u345-flag';

const CaptureLearnNiagaraTrailLoading: React.FC = () => {
	const { width: vistaWidth, height: vistaHeight } = GroveDimensions.get('window');
	const groveNavigator = useGroveNav();

	useGroveEffect(() => {
		let shouldShowOnboarding = false;
		const initBootFlow = async () => {
			try {
				const [firstRunValue, storedProfile] = await Promise.all([
					AsyncStorage.getItem(GROVE_FIRST_LAUNCH_KEY),
					AsyncStorage.getItem(GROVE_PERSIST_KEY),
				]);

				if (!firstRunValue && !storedProfile) {
					shouldShowOnboarding = true;
					await AsyncStorage.setItem(GROVE_FIRST_LAUNCH_KEY, 'true');
				}
			} catch (err) {
				if (__DEV__) console.warn('CaptureLearnNiagaraTrailLoading:init', err);
			}

			setTimeout(() => {
				groveNavigator.replace(
					shouldShowOnboarding
						? 'CaptureLearnNiagaraTrailOnboarding'
						: 'ExploringContainerOfApplication'
				);
			}, 8888);
		};

		initBootFlow();
	}, [groveNavigator, vistaWidth]);

	return (
		<RootViewGrove style={{
			flex: 1,
			height: vistaHeight,
			backgroundColor: '#005c2e',
			width: vistaWidth,
			justifyContent: 'center',
			alignItems: 'center',
		}}>
			<GroveImage
				style={{
					width: vistaWidth * 0.8,
					resizeMode: 'contain',
					height: vistaWidth * 0.8,
					borderRadius: Math.round(vistaWidth * 0.1),
				}}
				source={require('../CaptureLearnNiagaraTrailAssets/CaptureLearnNiagaraTrailImages/niagaraFallsIcon.png')}
			/>

			<RootViewGrove style={{
				bottom: vistaHeight * 0.04,
				position: 'absolute',
				alignSelf: 'center',
				zIndex: 10,
			}}>
				<JumpyTickerDots />
			</RootViewGrove>
		</RootViewGrove>
	);
};
export default CaptureLearnNiagaraTrailLoading;