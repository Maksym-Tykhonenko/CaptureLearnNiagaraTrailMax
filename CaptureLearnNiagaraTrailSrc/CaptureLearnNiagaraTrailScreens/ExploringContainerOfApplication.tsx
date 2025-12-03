import ExploreNiagaraLearnThis from './ExploreNiagaraLearnThis';
import React, { useState as useLumenState, useEffect as usePulseEffect, useRef as useKernelRef } from 'react';
type TitlesOfAssialPgs =
    | 'Explore Niagara Places With Different Types of View'
    | 'Stories and Wonders About Niagara'
    | 'Preferances of Learning Trail Niagara'
    | 'Capture Niagara from a new angle';
import {
    Image as Imaleargarage,
    TouchableWithoutFeedback as TapSilence,
    View as ExploreRootView,
    Keyboard,
    Easing as NiagEasingPulse,
    TouchableOpacity as RoundActionBtn,
    Text as Captexttra,
    SafeAreaView as NiagCaptuSafeAretrail,
    Platform,
    Animated as NiagAnimPulse,
    Dimensions as NiagDimAtlas,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CaptureNiagFfomANewAngle from './CaptureNiagFfomANewAngle';
import NiagaraTrailsPreferances from './NiagaraTrailsPreferances';
import StoriesAndWondersAboutNiagara from './StoriesAndWondersAboutNiagara';
import { traicapnafonts } from '../traicapnafonts';



const bottomolibe = [
    {
        learntraGoto: 'Explore Niagara Places With Different Types of View',
        icofcapt: require('../CaptureLearnNiagaraTrailAssets/CaptureLearnNiagaraTrailImages/mapCapture.png'),
    },
    {
        learntraGoto: 'Capture Niagara from a new angle',
        icofcapt: require('../CaptureLearnNiagaraTrailAssets/CaptureLearnNiagaraTrailImages/niagaraLearnGallery.png'),
    },
    {
        learntraGoto: 'Stories and Wonders About Niagara',
        icofcapt: require('../CaptureLearnNiagaraTrailAssets/CaptureLearnNiagaraTrailImages/trailBook.png'),
    },
    {
        learntraGoto: 'Preferances of Learning Trail Niagara',
        icofcapt: require('../CaptureLearnNiagaraTrailAssets/CaptureLearnNiagaraTrailImages/traiSetts.png'),
    },
];

const { width: trainiaWidthcapt, height: heino } = NiagDimAtlas.get('window');

// Додайте масив цікавих фактів
const funFacts = [
    "Niagara Falls moves about 1 foot closer to Lake Ontario every year due to erosion.",
    "Over 3,000 tons of water flows over Niagara Falls every second.",
    "The first person to go over Niagara Falls in a barrel and survive was a 63-year-old school teacher.",
    "Niagara Falls was formed about 12,000 years ago at the end of the last ice age.",
    "More than 12 million tourists visit Niagara Falls each year.",
];

const ExploringContainerOfApplication: React.FC = () => {
    const [asoPg, setAsoPg] = useLumenState<TitlesOfAssialPgs>('Explore Niagara Places With Different Types of View');
    const [isShowDetails, setIsShowDetails] = useLumenState<boolean>(false);

    // Додано: стан для поточного часу та інтервал оновлення
    const [now, setNow] = useLumenState<Date>(new Date());
    usePulseEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    // animated value for header/buttons crossfade
    const btnAnim = useKernelRef(new NiagAnimPulse.Value(0)).current;
    usePulseEffect(() => {
        NiagAnimPulse.timing(btnAnim, {
            toValue: isShowDetails ? 1 : 0,
            duration: 300,
            easing: NiagEasingPulse.out(NiagEasingPulse.cubic),
            useNativeDriver: true,
        }).start();
    }, [isShowDetails]);

    // REPLACED: single screenAnim -> two layered anims for smooth crossfade/slide
    const incomingAnim = useKernelRef(new NiagAnimPulse.Value(1)).current; // visible by default
    const outgoingAnim = useKernelRef(new NiagAnimPulse.Value(0)).current; // no outgoing at start
    const [prevPage, setPrevPage] = useLumenState<TitlesOfAssialPgs | null>(null);
    const [isTransitioning, setIsTransitioning] = useLumenState<boolean>(false);

    // REWRITTEN navigateToPage: parallel animation, no blinks, senior approach
    const navigateToPage = (page: TitlesOfAssialPgs) => {
        if (page === asoPg || isTransitioning) return;
        setIsTransitioning(true);

        // immediately mount both old & new pages to avoid flashing
        setPrevPage(asoPg);
        setAsoPg(page);

        // reset animation values: outgoing visible, incoming hidden
        outgoingAnim.setValue(1);
        incomingAnim.setValue(0);

        // parallel animation: outgoing fades out, incoming fades in with slight delay (cascade effect)
        NiagAnimPulse.parallel([
            // outgoing: fade + slide up
            NiagAnimPulse.timing(outgoingAnim, {
                toValue: 0,
                duration: 350,
                easing: NiagEasingPulse.in(NiagEasingPulse.ease),
                useNativeDriver: true,
            }),
            // incoming: slight delay for cascade, then smooth entrance
            NiagAnimPulse.sequence([
                NiagAnimPulse.delay(120),
                NiagAnimPulse.timing(incomingAnim, {
                    toValue: 1,
                    duration: 450,
                    easing: NiagEasingPulse.out(NiagEasingPulse.cubic),
                    useNativeDriver: true,
                }),
            ]),
        ]).start(() => {
            // cleanup after both animations complete
            setPrevPage(null);
            setIsTransitioning(false);
        });
    };

    // REPLACED renderNotoPage -> renderPage(page) щоб можна було рендерити prev/current окремо
    const renderPage = (page: TitlesOfAssialPgs | null) => {
        if (!page) return null;
        switch (page) {
            case 'Explore Niagara Places With Different Types of View':
                return <ExploreNiagaraLearnThis setAsoPg={navigateToPage} isShowDetails={isShowDetails} setIsShowDetails={setIsShowDetails} />;
            case 'Capture Niagara from a new angle':
                return <CaptureNiagFfomANewAngle isShowDetails={isShowDetails} setIsShowDetails={setIsShowDetails} />;
            case 'Stories and Wonders About Niagara':
                return <StoriesAndWondersAboutNiagara isShowDetails={isShowDetails} setIsShowDetails={setIsShowDetails} />;
            case 'Preferances of Learning Trail Niagara':
                return <NiagaraTrailsPreferances isShowDetails={isShowDetails} setIsShowDetails={setIsShowDetails} />;
            default:
                return null;
        }
    };

    usePulseEffect(() => {
        setIsShowDetails(false);
    }, [asoPg]);

    // Приховати кнопку/екран "Make Map Show All Places" на Android
    const bottomItems = Platform.OS === 'android'
        ? bottomolibe.filter(item => item.learntraGoto !== 'Make Map Show All Places')
        : bottomolibe;

    // Додайте стан для модалки фактів
    const [showFactModal, setShowFactModal] = useLumenState<boolean>(true);
    const [factText, setFactText] = useLumenState<string>(funFacts[Math.floor(Math.random() * funFacts.length)]);
    const factAnim = useKernelRef(new NiagAnimPulse.Value(0)).current;

    // Додано: анімоване закриття toast-модалки
    const handleCloseFactModal = () => {
        NiagAnimPulse.timing(factAnim, {
            toValue: 0,
            duration: 350,
            easing: NiagEasingPulse.in(NiagEasingPulse.cubic),
            useNativeDriver: true,
        }).start(() => setShowFactModal(false));
    };

    // Анімація появи toast-модалки при старті
    usePulseEffect(() => {
        if (showFactModal) {
            factAnim.setValue(0);
            NiagAnimPulse.timing(factAnim, {
                toValue: 1,
                duration: 420,
                easing: NiagEasingPulse.out(NiagEasingPulse.cubic),
                useNativeDriver: true,
            }).start();
        }
    }, [showFactModal]);

    return (
        <TapSilence onPress={() => Keyboard.dismiss()}>
            <ExploreRootView style={{ flex: 1 }}>
                {/* Toast-style Fun Fact notification */}
                {showFactModal && (
                    <NiagAnimPulse.View
                        pointerEvents="auto"
                        style={{
                            position: 'absolute',
                            top: heino * 0.08,
                            left: trainiaWidthcapt * 0.05,
                            right: trainiaWidthcapt * 0.05,
                            zIndex: 99,
                            backgroundColor: 'white',
                            borderRadius: trainiaWidthcapt * 0.045,
                            paddingVertical: trainiaWidthcapt * 0.045,
                            paddingHorizontal: trainiaWidthcapt * 0.06,
                            shadowColor: '#114837',
                            shadowOpacity: 0.18,
                            shadowRadius: 12,
                            elevation: 8,
                            alignItems: 'center',
                            opacity: factAnim,
                            transform: [
                                {
                                    translateY: factAnim.interpolate({ inputRange: [0, 1], outputRange: [-60, 0], extrapolate: 'clamp' }),
                                },
                                {
                                    scale: factAnim.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1], extrapolate: 'clamp' }),
                                },
                            ],
                        }}
                    >
                        <Captexttra style={{
                            fontFamily: traicapnafonts.capturePoppinsSemiBold,
                            fontSize: trainiaWidthcapt * 0.048,
                            color: '#114837',
                            textAlign: 'center',
                            marginBottom: trainiaWidthcapt * 0.018,
                            fontWeight: 'bold',
                        }}>
                            Fun Niagara Falls Fact
                        </Captexttra>
                        <Captexttra style={{
                            fontSize: trainiaWidthcapt * 0.038,
                            color: '#AF1E23',
                            textAlign: 'center',
                            fontFamily: traicapnafonts.capturePoppinsMedium,
                        }}>
                            {factText}
                        </Captexttra>
                        <RoundActionBtn
                            onPress={handleCloseFactModal}
                            style={{
                                marginTop: trainiaWidthcapt * 0.03,
                                backgroundColor: '#114837',
                                borderRadius: 18,
                                paddingHorizontal: trainiaWidthcapt * 0.05,
                                paddingVertical: trainiaWidthcapt * 0.014,
                                elevation: 2,
                            }}
                        >
                            <Captexttra style={{
                                color: 'white',
                                fontFamily: traicapnafonts.capturePoppinsSemiBold,
                                fontSize: trainiaWidthcapt * 0.038,
                                fontWeight: 'bold',
                            }}>
                                Got it!
                            </Captexttra>
                        </RoundActionBtn>
                    </NiagAnimPulse.View>
                )}
                {/* Клік по overlay закриває модалку анімовано */}
                {showFactModal && (
                    <ExploreRootView
                        pointerEvents="box-none"
                        style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            zIndex: 98,
                        }}
                        onStartShouldSetResponder={() => true}
                        onResponderRelease={handleCloseFactModal}
                    />
                )}
                <ExploreRootView style={{
                    width: trainiaWidthcapt,
                    flex: 1,
                    height: heino,
                }}>
                    <Imaleargarage
                        source={require('../CaptureLearnNiagaraTrailAssets/CaptureLearnNiagaraTrailImages/groundImg.png')}
                        style={{
                            resizeMode: 'cover',
                            position: 'absolute',
                            width: trainiaWidthcapt,
                            height: heino,
                        }}
                    />
                    <SafeAreaView style={{ height: heino * 0.14 }}>
                        {/* контейнер з двома шарами: заголовок і кнопки. їх opacity/translate керуються btnAnim */}
                        <NiagAnimPulse.View style={{
                            position: 'relative',
                            height: '100%',
                        }}>
                            {/* Заголовок — зникає при show details */}
                            <NiagAnimPulse.View style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                opacity: btnAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
                                bottom: 0,
                                justifyContent: 'center',
                                alignItems: 'center',
                                transform: [{ translateY: btnAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) }],
                            }}>
                                <Captexttra style={{
                                    fontFamily: traicapnafonts.capturePoppinsSemiBold,
                                    color: '#114837',
                                    fontWeight: '800',
                                    marginTop: heino * 0.01,
                                    fontSize: trainiaWidthcapt * 0.05,
                                    marginBottom: -heino * 0.014,
                                    textAlign: 'center',
                            }}>
                                {asoPg === 'Capture Niagara from a new angle' ? 'Niagara from a new angle'
                                    : asoPg === 'Stories and Wonders About Niagara' ? 'Stories & Wonders'
                                        : asoPg === 'Preferances of Learning Trail Niagara' ? 'Niagara Falls Preferences'
                                            : 'Niagara Falls Journey'}
                            </Captexttra>
                            </NiagAnimPulse.View>

                            {/* Кнопки — з'являються при show details */}
                            <NiagAnimPulse.View style={{
                                alignItems: 'center',
                                opacity: btnAnim,
                                left: 0,
                                transform: [{ translateY: btnAnim.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }],
                                top: 0,
                                bottom: 0,
                                justifyContent: 'center',
                                right: 0,
                                position: 'absolute',
                            }}>
                                <ExploreRootView style={{
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    marginBottom: -heino * 0.014,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    width: trainiaWidthcapt * 0.91043,
                                }}>
                                    {/* Ліва кнопка (зелена) */}
                                    <NiagAnimPulse.View style={{ transform: [{ scale: btnAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }] }}>
                                        <RoundActionBtn
                                            onPress={() => { setIsShowDetails(false); }}
                                            style={{
                                                elevation: 4,
                                                width: trainiaWidthcapt * 0.14,
                                                height: trainiaWidthcapt * 0.14,
                                                justifyContent: 'center',
                                                backgroundColor: '#00261A',
                                                alignItems: 'center',
                                                borderRadius: trainiaWidthcapt * 0.055,
                                            }}
                                        >
                                            <Imaleargarage
                                                source={require('../CaptureLearnNiagaraTrailAssets/CaptureLearnNiagaraTrailImages/arrowCaptureLeft.png')}
                                                style={{
                                                    tintColor: 'white',
                                                    width: trainiaWidthcapt * 0.06,
                                                    resizeMode: 'contain',
                                                    height: trainiaWidthcapt * 0.06,
                                                }}
                                            />
                                        </RoundActionBtn>
                                    </NiagAnimPulse.View>

                                    {/* Червона кнопка */}
                                    <NiagAnimPulse.View style={{ opacity: 0 }}>
                                        <RoundActionBtn
                                            disabled={true}
                                            onPress={() => { /* TODO: add share logic */ }}
                                            style={{
                                                
                                            }}
                                        >
                                            <Imaleargarage
                                                source={require('../CaptureLearnNiagaraTrailAssets/CaptureLearnNiagaraTrailImages/shareTraicon.png')}
                                                style={{
                                                    tintColor: 'white',
                                                    resizeMode: 'contain',
                                                    height: trainiaWidthcapt * 0.05,
                                                    width: trainiaWidthcapt * 0.05,
                                                }}
                                            />
                                        </RoundActionBtn>
                                    </NiagAnimPulse.View>
                                </ExploreRootView>
                            </NiagAnimPulse.View>
                        </NiagAnimPulse.View>
                    </SafeAreaView>

                    <NiagCaptuSafeAretrail />

                    {/* STATIC PANEL (фон/рамка не рухаються) */}
                    <ExploreRootView
                        style={{
                            alignSelf: 'center',
                            borderTopLeftRadius: trainiaWidthcapt * 0.08,
                            backgroundColor: '#114837',
                            width: trainiaWidthcapt,
                            borderTopRightRadius: trainiaWidthcapt * 0.08,
                            flex: 1,
                            overflow: 'hidden',
                        }}
                    >
                        {/* Layer container — обидва шари абсолютно позиціоновані */}
                        <NiagAnimPulse.View style={{ flex: 1 }}>
                            {/* OUTGOING (prevPage) */}
                            {prevPage ? (
                                <NiagAnimPulse.View
                                    pointerEvents="none"
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        paddingTop: heino * 0.02,
                                        opacity: outgoingAnim,
                                        transform: [
                                            {
                                                translateY: outgoingAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [-8, 0], // трохи піднімається при зникненні
                                                }),
                                            },
                                            {
                                                scale: outgoingAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [0.996, 1],
                                                }),
                                            },
                                        ],
                                    }}
                                >
                                    {renderPage(prevPage)}
                                </NiagAnimPulse.View>
                            ) : null}

                            {/* INCOMING / CURRENT */}
                            <NiagAnimPulse.View
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    paddingTop: heino * 0.02,
                                    opacity: incomingAnim,
                                    transform: [
                                        {
                                            translateY: incomingAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [14, 0], // плавний підйом при вході
                                            }),
                                        },
                                        {
                                            scale: incomingAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0.997, 1],
                                            }),
                                        },
                                    ],
                                }}
                            >
                                {renderPage(asoPg)}
                            </NiagAnimPulse.View>
                        </NiagAnimPulse.View>
                    </ExploreRootView>

                    {/* bottom nav */}
                    <ExploreRootView style={{
                        justifyContent: 'space-between',
                        paddingHorizontal: trainiaWidthcapt * 0.07054381,
                        flexDirection: 'row',
                        alignSelf: 'center',
                        backgroundColor: '#AF1E23',
                        bottom: heino * 0.05,
                        borderRadius: trainiaWidthcapt * 0.050532,
                        position: 'absolute',
                        height: heino * 0.0805438,
                        width: trainiaWidthcapt * 0.75,
                    }}>
                        {bottomItems.map((tile, index) => (
                            <RoundActionBtn key={index} style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }} onPress={() => { navigateToPage(tile.learntraGoto as TitlesOfAssialPgs); }}>
                                <Imaleargarage
                                    source={tile.icofcapt}
                                    style={{
                                        resizeMode: 'contain',
                                        height: trainiaWidthcapt * 0.08,
                                        width: trainiaWidthcapt * 0.08,
                                        tintColor: asoPg === tile.learntraGoto ? '#FFC20E' : 'white',
                                    }}
                                />
                            </RoundActionBtn>
                        ))}

                    </ExploreRootView>
                </ExploreRootView>
            </ExploreRootView>
        </TapSilence>
    );
};

export default ExploringContainerOfApplication;