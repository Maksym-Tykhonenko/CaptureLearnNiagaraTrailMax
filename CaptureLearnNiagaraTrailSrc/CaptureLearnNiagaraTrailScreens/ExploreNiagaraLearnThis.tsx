import { ScrollView as NiagGestureScrollKeel } from 'react-native-gesture-handler';
import locations from '../LearnDataTrail/captniatralocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useRef as useCoveRef, useState as useCoveState, useEffect as useCoveEffect, } from 'react';
import {
	Easing as NiagEasingTide,
	Dimensions as NiagDimFjord,
	Text as NiagTextQuill,
	Animated as NiagAnimatedTide,
	Image as NiagImageGlen,
	View as NiagViewRift,
	TouchableOpacity as NiagTapCairn,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import WaterfallSaveAnimation from './WaterfallSaveAnimation';
import { traicapnafonts } from '../traicapnafonts';

export default function ExploreNiagaraLearnThis({ isShowDetails, setIsShowDetails }: { isShowDetails: boolean, setIsShowDetails: (value: boolean) => void }) {
	const { width, height: niaghei } = NiagDimFjord.get('window');
	const scale = width / 390; // base scale (design ~390)
	const horizontalPadding = 20 * scale;
	const pillHeight = 44 * scale;
	const pillRadius = pillHeight / 2;
	const cardWidth = width - horizontalPadding * 2;
	const cardHeight = cardWidth * 0.58;
	const cardRadius = 20 * scale;
	const badgeHeight = 30 * scale;
	const bookmarkSize = width * 0.129;
	const arrowSize = 52 * scale;

	const bookmarkImg = require('../CaptureLearnNiagaraTrailAssets/CaptureLearnNiagaraTrailImages/bookNiamarkFull.png');
	const arrowImg = require('../CaptureLearnNiagaraTrailAssets/CaptureLearnNiagaraTrailImages/arrowWithAngle.png');

	const STORAGE_KEY = 'captsavedLearnNiatrailgara';
	const [savedArr, setSavedArr] = useCoveState<any[]>([]);
	const [savedIds, setSavedIds] = useCoveState<Set<string>>(new Set());
	const [showSaved, setShowSaved] = useCoveState<boolean>(false);

	// NEW: selected item for details view
	const [selectedItem, setSelectedItem] = useCoveState<any | null>(null);


	// NEW: animation value and mount flags (replace overlay behavior)
	const anim = useCoveRef(new NiagAnimatedTide.Value(0)).current; // 0 = list visible, 1 = detail visible
	const [detailMounted, setDetailMounted] = useCoveState<boolean>(false);
	const [showOnlyDetail, setShowOnlyDetail] = useCoveState<boolean>(false);

	// NEW: waterfall animation state
	const [showWaterfallAnim, setShowWaterfallAnim] = useCoveState<boolean>(false);
	const [waterfallStartPos, setWaterfallStartPos] = useCoveState<{ x: number; y: number }>({ x: width / 2, y: 50 });

	// load saved on mount
	useCoveEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const raw = await AsyncStorage.getItem(STORAGE_KEY);
				if (!mounted) return;
				if (raw) {
					const arr = JSON.parse(raw);
					setSavedArr(arr || []);
					const ids = new Set((arr || []).map((it: any) => it.id));
					setSavedIds(ids);
				} else {
					setSavedArr([]);
					setSavedIds(new Set());
				}
			} catch (e) {
				// fail silently
				setSavedArr([]);
				setSavedIds(new Set());
			}
		})();
		return () => { mounted = false; };
	}, []);

	// toggle save: if exists remove, else unshift item
	const toggleSave = async (item: any, buttonLayout?: { x: number; y: number }) => {
		try {
			const raw = await AsyncStorage.getItem(STORAGE_KEY);
			let arr: any[] = raw ? JSON.parse(raw) : [];
			const idx = arr.findIndex(x => x.id === item.id);
			if (idx >= 0) {
				// remove
				arr.splice(idx, 1);
			} else {
				// add to front
				arr.unshift(item);
				// Trigger waterfall animation when saving
				if (buttonLayout) {
					setWaterfallStartPos(buttonLayout);
				}
				setShowWaterfallAnim(true);
			}
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
			setSavedArr(arr);
			setSavedIds(new Set(arr.map((it: any) => it.id)));
		} catch (e) {
			// ignore errors
		}
	};

	// open and close with replace-style animation
	const openDetails = (item: any) => {
		setSelectedItem(item);
		// mount detail so it can animate in
		setDetailMounted(true);
		// start animation
		NiagAnimatedTide.timing(anim, {
			toValue: 1,
			duration: 320,
			easing: NiagEasingTide.out(NiagEasingTide.cubic),
			useNativeDriver: true,
		}).start(() => {
			// after animation finish, mark that only detail should be interactive/visible
			setShowOnlyDetail(true);
			setIsShowDetails(true);
		});
	};

	const closeDetails = () => {
		// make sure detail is interactive during close (if needed)
		setShowOnlyDetail(false);
		NiagAnimatedTide.timing(anim, {
			toValue: 0,
			duration: 260,
			easing: NiagEasingTide.in(NiagEasingTide.cubic),
			useNativeDriver: true,
		}).start(() => {
			// after hide animation unmount detail and clear
			setDetailMounted(false);
			setSelectedItem(null);
			setIsShowDetails(false);
		});
	};

	// NEW: if parent toggles isShowDetails to false while detail is mounted,
	// close the detail from here so the header button can fully control closing.
	useCoveEffect(() => {
		if (!isShowDetails && detailMounted) {
			// parent requested close — run close animation here
			closeDetails();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isShowDetails]);

	// determine which list to show
	const displayed = showSaved ? savedArr : locations;

	// Array of refs for bookmarks (one per displayed item)
	const bookmarkRefs = React.useRef<any[]>([]);
	// Update refs array length when displayed changes
	useCoveEffect(() => {
		bookmarkRefs.current = displayed.map((_, i) => bookmarkRefs.current[i] || React.createRef());
	}, [displayed]);

	// renderCard updated: arrow opens detail (use openDetails)
	const renderCard = ({ item, index }: { item: any, index: number }) => {
		const isSaved = savedIds.has(item.id);
		const bookmarkRef = bookmarkRefs.current[index];

		return (
			<NiagViewRift
				style={{
					width: cardWidth,
					height: cardHeight,
					borderRadius: cardRadius,
					overflow: 'hidden',
					marginBottom: 20 * scale,
					backgroundColor: '#000',
				}}
			>
				<NiagImageGlen
					source={item.image}
					style={{
						width: '101%',
						height: '100%',
						resizeMode: 'cover',
					}}
				/>
				{/* Bookmark in top-left (Touchable) */}
				<NiagTapCairn
					ref={bookmarkRef}
					onPress={() => {
						bookmarkRef.current?.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
							toggleSave(item, { x: pageX + width / 2, y: pageY + height / 2 });
						});
					}}
					style={{
						backgroundColor: isSaved ? '#AF1E23' : '#00261A',
						top: 12 * scale,
						alignItems: 'center',
						width: bookmarkSize,
						height: bookmarkSize,
						borderRadius: width * 0.057,
						left: 12 * scale,
						justifyContent: 'center',
						position: 'absolute',
					}}
				>
					<NiagImageGlen source={bookmarkImg} style={{ width: bookmarkSize * 0.4, height: bookmarkSize * 0.4, resizeMode: 'contain' }} />
				</NiagTapCairn>

				{/* Circular Arrow - opens details */}
				<NiagTapCairn
					onPress={() => {
						// open with animation
						openDetails(item);
					}}
					style={{
						marginLeft: 12 * scale,
						alignItems: 'center',
						height: arrowSize,
						borderRadius: width * 0.05,
						backgroundColor: '#F6AE29',
						justifyContent: 'center',
						width: arrowSize,
						top: 12 * scale,
						bottom: 12 * scale,
						position: 'absolute',
						right: 12 * scale,
					}}
				>
					<NiagImageGlen source={arrowImg} style={{ width: arrowSize * 0.3, height: arrowSize * 0.3, resizeMode: 'contain' }} />
				</NiagTapCairn>

				{/* Bottom overlay with text and arrow */}
				<NiagViewRift style={{
					justifyContent: 'space-between',
					bottom: 12 * scale,
					alignItems: 'center',
					left: 12 * scale,
					right: 12 * scale,
					flexDirection: 'row',
					position: 'absolute',
				}}>
					<NiagViewRift style={{  }}>
						{/* Tag badge */}
						{/* <NiagViewRift style={{
							justifyContent: 'center',
							height: badgeHeight,
							paddingHorizontal: 10 * scale,
							alignSelf: 'flex-start',
							borderRadius: badgeHeight / 2,
							backgroundColor: '#004F2F',
						}}>
							<NiagTextQuill style={{ color: '#fff', fontSize: 14 * scale }}>{item.tag}</NiagTextQuill>
						</NiagViewRift> */}

						{/* Title */}
						<NiagTextQuill style={{
							color: '#fff',
							fontSize: 22 * scale,
							fontWeight: '700',
							marginTop: 8 * scale,
							backgroundColor: 'rgba(0, 92, 46, 0.7)',
							paddingHorizontal: 6 * scale,
							paddingVertical: 2 * scale,
							borderRadius: 10 * scale,
						}} numberOfLines={2}>
							{item.name}
						</NiagTextQuill>
					</NiagViewRift>
				</NiagViewRift>
			</NiagViewRift>
		);
	};

	// default list view + animated replace of content
	return (
		<NiagViewRift style={{ flex: 1, paddingTop: 24 * scale, paddingHorizontal: horizontalPadding, position: 'relative' }}>
			{/* top pills — анімовано ховаються/показуються разом із anim */}
			<NiagAnimatedTide.View
				pointerEvents={showOnlyDetail ? 'none' : 'auto'}
				style={{
					opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
					transform: [{
						translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -10 * scale] })
					}],
					marginBottom: 18 * scale,
				}}
			>
				<NiagViewRift style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
					<NiagTapCairn
						onPress={() => setShowSaved(false)}
						style={{
							alignItems: 'center',
							paddingHorizontal: 22 * scale,
							height: pillHeight,
							width: '49.1%',
							borderRadius: pillRadius,
							justifyContent: 'center',
							backgroundColor: showSaved ? '#63784f' : '#F6AE29',
						}}
					>
						<NiagTextQuill style={{ fontSize: 14 * scale, fontWeight: '700', color: showSaved ? '#394b36' : undefined }}>Locations</NiagTextQuill>
					</NiagTapCairn>

					<NiagTapCairn
						onPress={() => setShowSaved(true)}
						style={{
							alignItems: 'center',
							backgroundColor: showSaved ? '#F6AE29' : '#63784f',
							justifyContent: 'center',
							borderRadius: pillRadius,
							paddingHorizontal: 22 * scale,
							width: '49.1%',
							height: pillHeight,
						}}
					>
						<NiagTextQuill style={{ fontSize: 14 * scale, fontWeight: '700', color: showSaved ? undefined : '#394b36' }}>Saved</NiagTextQuill>
					</NiagTapCairn>
				</NiagViewRift>
			</NiagAnimatedTide.View>

			{/* якщо переглядаємо Saved і масив порожній — показати повідомлення */}
			{showSaved && savedArr.length === 0 ? (
				<NiagViewRift
					style={{
						marginTop: niaghei * 0.23,
						justifyContent: 'center',
						paddingVertical: 18 * scale,
						paddingHorizontal: 20 * scale,
						marginBottom: 20 * scale,
						alignItems: 'center',
						backgroundColor: '#00261A',
						borderRadius: 18 * scale,
					}}
				>
					<NiagTextQuill style={{ color: '#FFFFFF', fontSize: 16 * scale, textAlign: 'center', fontWeight: '700', marginBottom: 8 * scale }}>
						No Saved Niagara Falls Locations Yet
					</NiagTextQuill>
					<NiagTextQuill style={{ color: '#BFD7CA', fontSize: 14 * scale, textAlign: 'center', lineHeight: 20 * scale }}>
						You haven’t marked any spots on your trail.
					</NiagTextQuill>
				</NiagViewRift>
			) : (
				<NiagAnimatedTide.View
					pointerEvents={showOnlyDetail ? 'none' : 'auto'}
					style={{
						opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
						transform: [{
							translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -20 * scale] })
						}],
					}}
				>
					<NiagGestureScrollKeel
						contentContainerStyle={{ paddingBottom: niaghei * 0.25 }}
						showsVerticalScrollIndicator={false}
					>
						{displayed.map((item: any, index: number) => (
							<React.Fragment key={item.id}>
								{renderCard({ item, index })}
							</React.Fragment>
						))}
						{!showSaved && (
							<NiagTextQuill style={{
								fontSize: width * 0.04,
								color: '#DFF3EA',
								textAlign: 'center',
								marginTop: 12 * scale,
								marginBottom: niaghei * 0.1,
								fontFamily: traicapnafonts.capturePoppinsMedium
							}}>
								More Niagara{'\n'}locations coming soon...
							</NiagTextQuill>
						)}
					</NiagGestureScrollKeel>
				</NiagAnimatedTide.View>
			)}

			{/* Detail block — монтується/демонтується по detailMounted та анімується навпаки */}
			{detailMounted && (
				<NiagAnimatedTide.View
					pointerEvents={showOnlyDetail ? 'auto' : 'none'}
					style={{
						bottom: 0,
						top: 0,
						position: 'absolute',
						left: 0,
						right: 0,
						opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
						transform: [{
							translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20 * scale, 0] })
						}],
					}}
				>
					{selectedItem && (
						<NiagGestureScrollKeel contentContainerStyle={{ padding: horizontalPadding }}>
							{/* Top image with rounded corners */}
							<NiagViewRift style={{ marginTop: 12 * scale, borderRadius: 18 * scale, overflow: 'hidden' }}>
								<NiagImageGlen source={selectedItem.image} style={{ width: '100%', height: width * 0.55, resizeMode: 'cover' }} />
								{/* Tag badge on image bottom-left */}
								<NiagViewRift style={{
									justifyContent: 'center',
									bottom: 14 * scale,
									borderRadius: badgeHeight / 2,
									left: 14 * scale,
									backgroundColor: '#F6AE29',
									paddingHorizontal: 12 * scale,
									height: badgeHeight,
									position: 'absolute',
								}}>
									<NiagTextQuill style={{ color: '#000', fontWeight: '700', fontSize: 14 * scale }}>{selectedItem.tag}</NiagTextQuill>
								</NiagViewRift>
							</NiagViewRift>

							{/* Title */}
							<NiagTextQuill style={{ marginTop: 18 * scale, fontSize: 22 * scale, fontWeight: '700', color: '#fff' }}>
								{selectedItem.name}
							</NiagTextQuill>

							{/* Description */}
							<NiagTextQuill style={{ marginTop: 12 * scale, color: '#DFF3EA', fontSize: 14 * scale, lineHeight: 22 * scale }}>
								{selectedItem.description}
							</NiagTextQuill>

							{/* Map preview */}
							<NiagViewRift style={{ marginTop: 20 * scale, borderRadius: 14 * scale, overflow: 'hidden' }}>
								<MapView
									style={{ width: '100%', height: 120 * scale }}
									initialRegion={{
										latitudeDelta: 0.01,
										longitude: selectedItem.coordinates?.longitude ?? 0,
										longitudeDelta: 0.01,
										latitude: selectedItem.coordinates?.latitude ?? 0,
									}}
								>
									{selectedItem.coordinates && (
										<Marker
											coordinate={{
												latitude: selectedItem.coordinates.latitude,
												longitude: selectedItem.coordinates.longitude,
											}}
										/>
									)}
								</MapView>
							</NiagViewRift>

							{/* padding bottom */}
							<NiagViewRift style={{ height: niaghei * 0.129 }} />
						</NiagGestureScrollKeel>
					)}
				</NiagAnimatedTide.View>
			)}

			{/* Waterfall animation overlay */}
			{showWaterfallAnim && (
				<WaterfallSaveAnimation
					visible={showWaterfallAnim}
					onComplete={() => setShowWaterfallAnim(false)}
					startX={waterfallStartPos.x}
					startY={waterfallStartPos.y - niaghei * 0.16}
				/>
			)}
		</NiagViewRift>
	);
}