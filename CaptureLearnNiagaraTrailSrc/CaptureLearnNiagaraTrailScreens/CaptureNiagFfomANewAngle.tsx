import React, { useEffect as useSprigEffect, useState as useSprigState } from 'react';
import {
	FlatList as NiagFlatArchive,
	View as LearnViewCapt,
	TouchableOpacity as NiagTapTrail,
	Text as NiagTextNiagara,
	Image as NiagImageTrailview,
	Share as NiagShareBeacon,
	ScrollView as LearnScrollVista,
	Dimensions as NiagDimVoyage,
} from 'react-native';
import { traicapnafonts as niagFonts } from '../traicapnafonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';

export default function CaptureNiagFfomANewAngle({ isShowDetails, setIsShowDetails }: { isShowDetails: boolean, setIsShowDetails: (value: boolean) => void }) {
	const { width, height: niaghei } = NiagDimVoyage.get('window');
	const scale = width / 390;
	const horizontalPadding = 20 * scale;
	const pillHeight = 44 * scale;
	const pillRadius = pillHeight / 2;
	const gap = 12 * scale;
	const tileSize = Math.floor((width - horizontalPadding * 2 - 3 * gap) / 3);
	const tileRadius = 24 * scale;
	const titleFont = 16 * scale;
	const smallIconSize = 28 * scale;

	const placeholderIcon = require('../CaptureLearnNiagaraTrailAssets/CaptureLearnNiagaraTrailImages/niagaraLearnGallery.png');

	const categories = [
		{
			id: 'misty',
			emoji: '🩵',
			title: 'Misty Views',
			tasks: [
				'A reflection of the falls in water',
				'Mist covering half your frame',
				'Droplets on your camera lens',
				'Someone looking through fog',
				'A rainbow fragment',
				'Your shadow in the mist',
				'Light breaking through spray',
				'A color that feels “wet”',
				'Something vanishing into white',
			],
		},
		{
			id: 'motion',
			emoji: '💚',
			title: 'Nature in Motion',
			tasks: [
				'Flowing leaves near the rapids',
				'Bird in flight with water below',
				'Ripples made by wind',
				'Moving crowd at a lookout',
				'Splash frozen mid-air',
				'Water surface that looks like silk',
				'Blurry hand gesture or movement',
				'Flags or clothes blown by wind',
				'Reflection distorted by waves',
			],
		},
		{
			id: 'hidden',
			emoji: '💜',
			title: 'Hidden Details',
			tasks: [
				'Water drops on stone texture',
				'Moss or plant near the railing',
				'Cracks in old rock by the falls',
				'Small insect on wet surface',
				'Color you almost missed',
				'Reflection inside a puddle',
				'Pattern in flowing foam',
				'Close-up of carved sign or mark',
				'Small rainbow on a glass surface',
			],
		},
	];

	// state
	const [activeTab, setActiveTab] = useSprigState<'board' | 'archive'>('board');
	const [openCategoryIndex, setOpenCategoryIndex] = useSprigState<number>(0);
	const [categoryDropdownOpen, setCategoryDropdownOpen] = useSprigState<boolean>(false);
	const arrowDownIcon = require('../CaptureLearnNiagaraTrailAssets/CaptureLearnNiagaraTrailImages/triangleDown.png');

	const initialImages: Record<string, (string | null)[]> = {};
	categories.forEach(cat => { initialImages[cat.id] = Array(cat.tasks.length).fill(null); });
	const [taskImages, setTaskImages] = useSprigState<Record<string, (string | null)[]>>(initialImages);

	const [archives, setArchives] = useSprigState<any[]>([]);
	const [archiveIndex, setArchiveIndex] = useSprigState<number>(0);

	const currentCatId = categories[openCategoryIndex].id;
	const currentImages = taskImages[currentCatId] || [];
	const allFilled = currentImages.length === categories[openCategoryIndex].tasks.length && currentImages.every((u) => !!u);

	const ARCHIVE_KEY = 'niag_grove_archive_5543';

	// load archives from storage
	const loadArchives = async () => {
		try {
			const raw = await AsyncStorage.getItem(ARCHIVE_KEY);
			const arr = raw ? JSON.parse(raw) : [];
			setArchives(Array.isArray(arr) ? arr : []);
		} catch (e) {
			setArchives([]);
		}
	};

	// load on mount and when user opens archive tab
	useSprigEffect(() => {
		loadArchives();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useSprigEffect(() => {
		if (activeTab === 'archive') {
			loadArchives();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeTab]);

	// save current category set to archive (unshift with time-based id)
	const saveCurrentCategoryToArchive = async () => {
		try {
			const raw = await AsyncStorage.getItem(ARCHIVE_KEY);
			let arr: any[] = raw ? JSON.parse(raw) : [];
			// create item with unique id based on time
			const id = Date.now().toString();
			const newItem = {
				id,
				categoryId: categories[openCategoryIndex].id,
				categoryTitle: categories[openCategoryIndex].title,
				images: taskImages[categories[openCategoryIndex].id],
				createdAt: new Date().toISOString(),
			};
			// add to front
			arr.unshift(newItem);
			await AsyncStorage.setItem(ARCHIVE_KEY, JSON.stringify(arr));
			// navigate to archive tab after save and reload archives
			setActiveTab('archive');
			await loadArchives();
		} catch (e) {
			// fail silently
		}
	};

	// share archive item (simple text share referencing the archive)
	const shareArchive = async (item: any) => {
		try {
			await NiagShareBeacon.share({
				message: `My Capture - ${item.categoryTitle}\nSaved at ${new Date(item.createdAt).toLocaleString()}`,
			});
		} catch (e) {
			// ignore
		}
	};

	// delete archive item by id
	const deleteArchiveItem = async (id: string) => {
		try {
			const raw = await AsyncStorage.getItem(ARCHIVE_KEY);
			let arr: any[] = raw ? JSON.parse(raw) : [];
			arr = arr.filter(i => i.id !== id);
			await AsyncStorage.setItem(ARCHIVE_KEY, JSON.stringify(arr));
			setArchives(arr);
			// reset index if needed
			if (archiveIndex >= arr.length) setArchiveIndex(Math.max(0, arr.length - 1));
		} catch (e) {
			// ignore
		}
	};

	// pick image for specific task (categoryId + taskIndex)
	const pickImageForTask = (categoryId: string, taskIndex: number) => {
		launchImageLibrary(
			{
				mediaType: 'photo',
				selectionLimit: 1,
			},
			(response) => {
				if (response.didCancel) return;
				if (response.errorCode) return;
				const asset = response.assets && response.assets[0];
				if (asset && asset.uri) {
					setTaskImages(prev => {
						const next = { ...prev };
						const arr = [...(next[categoryId] || [])];
						arr[taskIndex] = asset.uri;
						next[categoryId] = arr;
						return next;
					});
				}
			}
		);
	};

	return (
		<LearnViewCapt style={{ flex: 1, paddingTop: 24 * scale, paddingHorizontal: horizontalPadding }}>
			{/* Top pills: Board / My Archive */}
			<LearnViewCapt style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 * scale }}>
				<NiagTapTrail
					onPress={() => setActiveTab('board')}
					style={{
						alignItems: 'center',
						paddingHorizontal: 18 * scale,
						height: pillHeight,
						width: '49.1%',
						borderRadius: pillRadius,
						justifyContent: 'center',
						backgroundColor: activeTab === 'board' ? '#F6AE29' : '#6b704f',
					}}
				>
					<NiagTextNiagara style={{ fontSize: 14 * scale, fontWeight: '700', color: activeTab === 'board' ? '#000' : '#2f3a2e' }}>
						Board
					</NiagTextNiagara>
				</NiagTapTrail>

				<NiagTapTrail
					onPress={() => setActiveTab('archive')}
					style={{
						width: '49.1%',
						paddingHorizontal: 18 * scale,
						height: pillHeight,
						alignItems: 'center',
						borderRadius: pillRadius,
						justifyContent: 'center',
						backgroundColor: activeTab === 'archive' ? '#F6AE29' : '#6b704f',
					}}
				>
					<NiagTextNiagara style={{ fontSize: 14 * scale, fontWeight: '700', color: activeTab === 'archive' ? '#000' : '#2f3a2e' }}>
						My Archive
					</NiagTextNiagara>
				</NiagTapTrail>
			</LearnViewCapt>

			{/* Category header + absolute dropdown */}
			{/* show category header + dropdown only on Board tab */}
			{activeTab === 'board' && (
				<LearnViewCapt style={{ position: 'relative', marginBottom: 12 * scale }}>
					{/* Header button (shows current category and arrow) */}
					<NiagTapTrail
						onPress={() => setCategoryDropdownOpen(prev => !prev)}
						style={{
							flexDirection: 'row',
							borderRadius: 18 * scale,
							paddingVertical: 12 * scale,
							paddingHorizontal: 16 * scale,
							alignItems: 'center',
							justifyContent: 'space-between',
							backgroundColor: '#05291F',
						}}
					>
						<LearnViewCapt style={{ flexDirection: 'row', alignItems: 'center' }}>
							<NiagTextNiagara style={{ fontSize: 20 * scale, marginRight: 8 * scale }}>{categories[openCategoryIndex].emoji}</NiagTextNiagara>
							<NiagTextNiagara style={{ fontSize: 16 * scale, color: '#DFF3EA', fontFamily: niagFonts.capturePoppinsRegular }}>{categories[openCategoryIndex].title}</NiagTextNiagara>
						</LearnViewCapt>

						<NiagImageTrailview source={arrowDownIcon} style={{ width: 18 * scale, height: 12 * scale, tintColor: '#fff', opacity: 0.9 }} />
					</NiagTapTrail>

					{/* Absolute dropdown list */}
					{categoryDropdownOpen && (
						<LearnViewCapt
							style={{
								paddingVertical: 8 * scale,
								position: 'absolute',
								paddingHorizontal: 8 * scale,
								left: 0,
								shadowRadius: 6 * scale,
								backgroundColor: '#042622',
								borderRadius: 14 * scale,
								zIndex: 50,
								top: (pillHeight + 12 * scale),
								elevation: 8,
								shadowColor: '#000',
								shadowOffset: { width: 0, height: 4 },
								shadowOpacity: 0.3,
								right: 0,
							}}
						>
							{/* small triangle indicator centered at top of dropdown */}
							<NiagImageTrailview
								source={arrowDownIcon}
								style={{
									tintColor: '#042622',
									height: 12 * scale,
									marginBottom: 6 * scale,
									alignSelf: 'center',
									width: 18 * scale,
									transform: [{ rotate: '180deg' }], // flip so it points up to header
								}}
							/>

							{categories.map((cat, idx) => (
								<NiagTapTrail
									key={cat.id}
									onPress={() => {
										setOpenCategoryIndex(idx);
										setCategoryDropdownOpen(false);
									}}
									style={{
										marginBottom: 6 * scale,
										paddingVertical: 10 * scale,
										borderRadius: 10 * scale,
										backgroundColor: openCategoryIndex === idx ? '#0A4A37' : 'transparent',
										paddingHorizontal: 12 * scale,
									}}
								>
									<NiagTextNiagara style={{ color: openCategoryIndex === idx ? '#fff' : '#9fbfaf', fontWeight: '700' }}>
										{cat.emoji} {cat.title}
									</NiagTextNiagara>
								</NiagTapTrail>
							))}
						</LearnViewCapt>
					)}
				</LearnViewCapt>
			)}

			{/* Board (grid + save) - render only on Board tab */}
			{activeTab === 'board' && (
				<>
					{/* Grid of 9 tasks */}
					<LearnScrollVista contentContainerStyle={{ paddingBottom: Math.max(niaghei * 0.12, 90 * scale) }} showsVerticalScrollIndicator={false}>
						<LearnViewCapt style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
							{categories[openCategoryIndex].tasks.map((task, index) => {
								const imgUri = taskImages[categories[openCategoryIndex].id][index];
								return (
									<LearnViewCapt key={index} style={{ width: tileSize, marginBottom: 18 * scale, marginHorizontal: gap / 2 }}>
										<NiagTapTrail
											onPress={() => pickImageForTask(categories[openCategoryIndex].id, index)}
											style={{
												alignItems: 'center',
												height: tileSize,
												borderRadius: tileRadius,
												backgroundColor: '#042622',
												padding: imgUri ? 0 : 12 * scale,
												justifyContent: 'center',
												width: tileSize,
											}}
										>
											{imgUri ? (
												<NiagImageTrailview source={{ uri: imgUri }} style={{ width: '100%', height: '100%', borderRadius: tileRadius }} />
											) : (
												<LearnViewCapt style={{ justifyContent: 'center', alignItems: 'center' }}>
													<NiagTextNiagara style={{ color: '#E6F6EC', fontSize: titleFont * 0.7, textAlign: 'center', fontFamily: niagFonts.capturePoppinsRegular }}>{task}</NiagTextNiagara>
													<NiagImageTrailview source={placeholderIcon} style={{ width: smallIconSize, height: smallIconSize, marginBottom: 10 * scale, resizeMode: 'contain' }} />
												</LearnViewCapt>
											)}
										</NiagTapTrail>
									</LearnViewCapt>
								);
							})}
						</LearnViewCapt>
					</LearnScrollVista>

					{/* Save button appears when all 9 images in current category are filled */}
					{allFilled && (
						<NiagTapTrail
							onPress={saveCurrentCategoryToArchive}
							style={{
								alignSelf: 'center',
								backgroundColor: '#F6AE29',
								width: width - horizontalPadding * 2,
								borderRadius: width * 0.059,
								// marginBottom: niaghei * 0.03,
								justifyContent: 'center',
								alignItems: 'center',
								top: -niaghei * 0.17,
								height: 53 * scale,
							}}
						>
							<NiagTextNiagara style={{ fontSize: 16 * scale, color: '#00261A', fontFamily: niagFonts.capturePoppinsSemiBold }}>
								Save to Archive
							</NiagTextNiagara>
						</NiagTapTrail>
					)}
				</>
			)}

			{/* Archive view: when activeTab === 'archive' render horizontal swipeable pages */}
			{activeTab === 'archive' && (
				<LearnViewCapt style={{ flex: 1, marginHorizontal: -horizontalPadding }}>
					{archives.length === 0 ? (
						<LearnViewCapt style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							<LearnViewCapt
								style={{
									shadowColor: '#000',
									// subtle shadow
									borderRadius: 22 * scale,
									paddingVertical: 22 * scale,
									paddingHorizontal: 18 * scale,
									shadowOpacity: 0.18,
									top: -niaghei * 0.1,
									width: width - horizontalPadding * 3,
									shadowOffset: { width: 0, height: 6 },
									shadowRadius: 8 * scale,
									elevation: 6,
									backgroundColor: '#00261A', // dark card
								}}
							>
								<NiagTextNiagara style={{ color: '#FFFFFF', fontSize: 19 * scale, fontFamily: niagFonts.capturePoppinsSemiBold, textAlign: 'center', marginBottom: 10 * scale }}>
									Your Archive Is Still Empty
								</NiagTextNiagara>

								<NiagTextNiagara style={{ color: '#ffffffbd', fontFamily: niagFonts.capturePoppinsMedium, fontSize: 14 * scale, textAlign: 'center', lineHeight: 20 * scale }}>
									Start a new Photo Bingo, capture the mist, and turn your discoveries into art. When you save your first collage, it will appear here as a memory of your trail
								</NiagTextNiagara>
							</LearnViewCapt>
						</LearnViewCapt>
					) : (
						<LearnViewCapt style={{ flex: 1 }}>
							{/* title for current page (emoji + title) */}
							<LearnViewCapt style={{ alignItems: 'center', marginBottom: 20 * scale, paddingHorizontal: horizontalPadding }}>
								<NiagTextNiagara style={{ fontSize: 26 * scale, fontWeight: '700', color: '#FFFFFF', fontFamily: niagFonts.capturePoppinsSemiBold }}>
									{(() => {
										const it = archives[archiveIndex];
										if (!it) return '';
										const cat = categories.find(c => c.id === it.categoryId);
										return `${cat?.emoji ?? ''} ${it.categoryTitle ?? ''}`;
									})()}
								</NiagTextNiagara>
							</LearnViewCapt>

							{/* FlatList horizontal paging — proper snap and center */}
							<NiagFlatArchive
								decelerationRate="fast"
								horizontal
								pagingEnabled
								showsHorizontalScrollIndicator={false}
								snapToInterval={width}
								data={archives}
								onMomentumScrollEnd={(e) => {
									const ix = Math.round(e.nativeEvent.contentOffset.x / width);
									setArchiveIndex(ix);
								}}
								keyExtractor={(item) => item.id}
								renderItem={({ item }) => (
									<LearnViewCapt style={{ width, alignItems: 'center', justifyContent: 'flex-start' }}>
										{/* grid container — exact width for 3 tiles + 2 gaps */}
										<LearnViewCapt style={{ width: tileSize * 3 + gap * 2, flexDirection: 'row', flexWrap: 'wrap' }}>
											{(item.images || []).map((uri: string | null, i: number) => {
												const isLastRow = i >= 6;
												return (
													<LearnViewCapt
														key={i}
														style={{
															width: tileSize,
															height: tileSize,
															marginBottom: isLastRow ? 0 : 18 * scale,
															marginRight: (i % 3 === 2) ? 0 : gap,
														}}
													>
														<LearnViewCapt style={{
															alignItems: 'center',
															backgroundColor: '#042622',
															height: '100%',
															borderRadius: tileRadius,
															overflow: 'hidden',
															width: '100%',
															justifyContent: 'center',
														}}>
															{uri ? (
																<NiagImageTrailview source={{ uri }} style={{ width: '100%', height: '100%' }} />
															) : (
																<NiagImageTrailview source={placeholderIcon} style={{ width: smallIconSize, height: smallIconSize, resizeMode: 'contain' }} />
															)}
														</LearnViewCapt>
													</LearnViewCapt>
												);
											})}
										</LearnViewCapt>
									</LearnViewCapt>
								)}
								style={{ flexGrow: 0 }}
								contentContainerStyle={{ paddingHorizontal: 0 }}
							/>

							{/* Share button + Delete trash INLINE */}
							<LearnViewCapt style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: horizontalPadding, marginTop: 24 * scale, marginBottom: 16 * scale }}>
								<NiagTapTrail
									onPress={() => shareArchive(archives[archiveIndex])}
									style={{
										borderRadius: 28 * scale,
										marginRight: 12 * scale,
										flex: 1,
										flexDirection: 'row',
										backgroundColor: '#F6AE29',
										justifyContent: 'center',
										alignItems: 'center',
										height: 56 * scale,
									}}
								>
									<NiagImageTrailview
										resizeMode='contain'
										source={require('../CaptureLearnNiagaraTrailAssets/CaptureLearnNiagaraTrailImages/learnshare.png')}
										style={{ width: 22 * scale, height: 22 * scale, marginRight: 8 * scale, tintColor: '#00261A' }}
									/>
									<NiagTextNiagara style={{ fontSize: 18 * scale, fontWeight: '700', color: '#00261A', fontFamily: niagFonts.capturePoppinsSemiBold }}>
										Share
									</NiagTextNiagara>
								</NiagTapTrail>

								<NiagTapTrail
									onPress={() => deleteArchiveItem(archives[archiveIndex]?.id)}
									style={{
										alignItems: 'center',
										height: 56 * scale,
										borderRadius: 28 * scale,
										justifyContent: 'center',
										backgroundColor: '#1C3A2E',
										width: 56 * scale,
									}}
								>
									<NiagImageTrailview
										resizeMode='contain'
										source={require('../CaptureLearnNiagaraTrailAssets/CaptureLearnNiagaraTrailImages/niagTrash.png')}
										style={{ width: 24 * scale, height: 24 * scale, tintColor: '#fff' }}
									/>
								</NiagTapTrail>
							</LearnViewCapt>

							{/* Paginator at the bottom */}
							<LearnViewCapt style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 24 * scale }}>
								{archives.map((_, i) => (
									<LearnViewCapt
										key={i}
										style={{
											marginHorizontal: 4 * scale,
											height: 8 * scale,
											backgroundColor: i === archiveIndex ? '#F6AE29' : '#5A6B5A',
											borderRadius: 4 * scale,
											width: i === archiveIndex ? 36 * scale : 10 * scale,
										}}
									/>
								))}
							</LearnViewCapt>
						</LearnViewCapt>
					)}
				</LearnViewCapt>
			)}
		</LearnViewCapt>
	);
}