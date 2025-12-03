import React, { useEffect as useLearnEffect, useRef as useLearnRef, useState as useLearnState, } from 'react';
import {
    TouchableOpacity as NiarailPressBox,
    Animated as RNAnimated,
    Dimensions,
    View as IagarailBview,
    Text as TraitureText,
    ScrollView as LearnNiagScrollTrail,
    FlatList as PrulearFlat,
} from 'react-native';
import { PanGestureHandler, State as GestureState, ScrollView } from 'react-native-gesture-handler';
import { traicapnafonts } from '../traicapnafonts';
import wondersStrories from '../LearnDataTrail/wondersStrories';

export default function StoriesAndWondersAboutNiagara({ isShowDetails, setIsShowDetails }: { isShowDetails: boolean, setIsShowDetails: (value: boolean) => void }) {
    const { width, height } = Dimensions.get('window');

    const horizontalPadding = 16;
    const containerPaddingTop = 24;
    const cardWidth = width - horizontalPadding * 2;
    const cardHeight = Math.round(height * 0.22);
    const cardRadius = Math.round(width * 0.05);
    const previewFontSize = Math.round(width * 0.042);
    const buttonHeight = Math.round(height * 0.06);
    const buttonRadius = Math.round(buttonHeight / 2);

    const [expandedId, setExpandedId] = useLearnState<number | null>(null);

    // NEW: anim controlling list <-> detail swap (0 = list visible, 1 = detail visible)
    const anim = useLearnRef(new RNAnimated.Value(0)).current;
    // drag value from pan gesture (positive = pulled down)
    const dragY = useLearnRef(new RNAnimated.Value(0)).current;
    const [detailMounted, setDetailMounted] = useLearnState<boolean>(false);
    const [showOnlyDetail, setShowOnlyDetail] = useLearnState<boolean>(false);

    // Open detail: mount and animate in, show top buttons
    const openDetails = (id: number) => {
        if (expandedId === id && detailMounted) return;
        // reset drag before opening
        dragY.setValue(0);
        setExpandedId(id);
        setDetailMounted(true);
        RNAnimated.timing(anim, {
            toValue: 1,
            duration: 320,
            useNativeDriver: true,
        }).start(() => {
            setShowOnlyDetail(true);
            setIsShowDetails(true);
        });
    };

    // Close detail: animate out then unmount and clear expandedId
    const closeDetails = () => {
        // also reset drag for next open
        dragY.setValue(0);
        setShowOnlyDetail(false);
        RNAnimated.timing(anim, {
            toValue: 0,
            duration: 260,
            useNativeDriver: true,
        }).start(() => {
            setDetailMounted(false);
            setExpandedId(null);
            setIsShowDetails(false);
        });
    };

    // If parent requests to hide details while detail is mounted -> close here
    useLearnEffect(() => {
        if (!isShowDetails && detailMounted) {
            closeDetails();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isShowDetails]);

    const renderItem = ({ item }: { item: any }) => {
        // collapsed preview only; pressing Read opens detail via openDetails()
        const lineHeight = Math.round(previewFontSize * 1.6);

        return (
            <IagarailBview style={{ marginBottom: Math.round(height * 0.03) }}>
                <IagarailBview
                    style={{
                        shadowRadius: 4,
                        width: cardWidth,
                        elevation: 3,
                        shadowOffset: { width: 0, height: 2 },
                        backgroundColor: '#00261A',
                        padding: Math.round(width * 0.045),
                        shadowColor: '#000',
                        shadowOpacity: 0.2,
                        minHeight: cardHeight,
                        borderRadius: cardRadius,
                    }}
                >
                    <TraitureText
                        style={{
                            color: '#ffffff',
                            fontSize: width * 0.05,
                            fontFamily: traicapnafonts?.capturePoppinsSemiBold,
                            marginBottom: Math.round(height * 0.01),
                        }}
                    >
                        {item.title}
                    </TraitureText>

                    <TraitureText
                        style={{
                            lineHeight,
                            fontSize: width * 0.04,
                            marginBottom: Math.round(height * 0.02),
                            fontFamily: traicapnafonts?.capturePoppinsMedium,
                            color: '#ffffffc5',
                        }}
                        numberOfLines={2}
                    >
                        {item.content}
                    </TraitureText>

                    <NiarailPressBox
                        onPress={() => openDetails(item.id)}
                        style={{
                            justifyContent: 'center',
                            height: buttonHeight,
                            alignItems: 'center',
                            borderRadius: buttonRadius,
                            backgroundColor: '#f0b236',
                            width: width * 0.28,
                        }}
                    >
                        <TraitureText style={{ color: '#10261c', fontSize: Math.round(previewFontSize * 0.95), fontFamily: traicapnafonts?.capturePoppinsMedium }}>
                            Read
                        </TraitureText>
                    </NiarailPressBox>
                </IagarailBview>
            </IagarailBview>
        );
    };

    // If an item is opened and detailMounted -> show detail overlay; otherwise show list
    const openedItem = expandedId !== null ? wondersStrories.find((w) => w.id === expandedId) : null;

    return (
        <IagarailBview style={{ flex: 1, paddingTop: containerPaddingTop, paddingHorizontal: horizontalPadding, position: 'relative' }}>
            {/* List view: fades/slides away when detail opens */}
            <RNAnimated.View
                pointerEvents={showOnlyDetail ? 'none' : 'auto'}
                style={{
                    flex: 1,
                    opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
                    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -16] }) }],
                }}
            >
                <PrulearFlat
                    data={wondersStrories}
                    renderItem={renderItem}
                    keyExtractor={(item) => String(item.id)}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: Math.round(height * 0.08) }}
                />
            </RNAnimated.View>

            {/* Detail block: mounted when detailMounted and animated in/out */}
            {detailMounted && openedItem && (
                // wrap overlay in PanGestureHandler so it can be dragged to dismiss
                <RNAnimated.View
                    pointerEvents={showOnlyDetail ? 'auto' : 'none'}
                    style={{
                        top: 0,
                        transform: [{ translateY: RNAnimated.add(anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }), dragY) }],
                        left: 0,
                        position: 'absolute',
                        bottom: 0,
                        paddingTop: containerPaddingTop,
                        paddingHorizontal: horizontalPadding,
                        backgroundColor: 'transparent',
                        right: 0,
                        opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
                        // combine the open/close animation with the drag translation
                    }}
                >
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: height * 0.16 }}>
                        <IagarailBview style={{ flex: 1 }}>
                            <LearnNiagScrollTrail showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: height * 0.12 }}>
                                <TraitureText
                                    style={{
                                        fontFamily: traicapnafonts?.capturePoppinsMedium,
                                        fontSize: width * 0.044,
                                        color: '#ffffff',
                                    }}
                                >
                                    {openedItem.content}
                                </TraitureText>
                            </LearnNiagScrollTrail>
                        </IagarailBview>
                    </ScrollView>
                </RNAnimated.View>
            )}
        </IagarailBview>
    );
}