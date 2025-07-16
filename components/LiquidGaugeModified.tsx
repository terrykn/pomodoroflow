import React from 'react';
import {
    Canvas,
    Group,
    Rect,
    Skia,
    Text,
    useFont,
    LinearGradient,
    vec,
} from '@shopify/react-native-skia';
import { area, scaleLinear } from 'd3';
import { useEffect } from 'react';
import { View } from 'react-native';
import {
    Easing,
    useDerivedValue,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

export type GaugeConfig = {
    minValue: number;
    maxValue: number;
    circleThickness: number;
    circleFillGap: number;
    circleColor: string;
    waveHeight: number;
    waveCount: number;
    waveRiseTime: number;
    waveAnimateTime: number;
    waveRise: boolean;
    waveHeightScaling: boolean;
    waveAnimate: boolean;
    waveColor: string;
    waveOffset: number;
    textVertPosition: number;
    textSize: number;
    valueCountUp: boolean;
    textSuffix: string;
    textColor: string;
    waveTextColor: string;
    toFixed: number;
};

function liquidFillGaugeDefaultSettings(): GaugeConfig {
    return {
        minValue: 0,
        maxValue: 100,
        circleThickness: 0.05,
        circleFillGap: 0.05,
        circleColor: '#178BCA',
        waveHeight: 0.05,
        waveCount: 1,
        waveRiseTime: 1000,
        waveAnimateTime: 18000,
        waveRise: true,
        waveHeightScaling: true,
        waveAnimate: true,
        waveColor: '#178BCA',
        waveOffset: 0,
        textVertPosition: 0.5,
        textSize: 1,
        valueCountUp: true,
        textSuffix: '%',
        textColor: '#045681',
        waveTextColor: '#A4DBf8',
        toFixed: 0,
    };
}

type Props = {
    config?: Partial<GaugeConfig>;
    width?: number;
    height?: number;
    value?: number;
};

export const LiquidGaugeModified = ({
    config,
    width = 150,
    height = 150,
    value = 50,
}: Props) => {
    const defaultConfig = liquidFillGaugeDefaultSettings();
    const mergedConfig = { ...defaultConfig, ...config };

    const fillPercent =
        Math.max(mergedConfig.minValue, Math.min(mergedConfig.maxValue, value)) /
        mergedConfig.maxValue;

    const waveHeightScale = mergedConfig.waveHeightScaling
        ? scaleLinear().range([0, mergedConfig.waveHeight, 0]).domain([0, 50, 100])
        : scaleLinear().range([mergedConfig.waveHeight]).domain([0, 100]);

    const waveHeight = height * waveHeightScale(fillPercent * 100);
    const waveLength = width / mergedConfig.waveCount;
    const waveClipCount = 1 + mergedConfig.waveCount;
    const waveClipWidth = waveLength * waveClipCount;

    const textPixels = (mergedConfig.textSize * height) / 2;
    const textFinalValue = Number(value.toFixed(mergedConfig.toFixed));
    const textStartValue = mergedConfig.valueCountUp
        ? mergedConfig.minValue
        : textFinalValue;

    const textRiseScaleY = scaleLinear()
        .range([height, textPixels * 0.7])
        .domain([0, 1]);

    const data: Array<[number, number]> = [];
    for (let i = 0; i <= 40 * waveClipCount; i++) {
        data.push([i / (40 * waveClipCount), i / 40]);
    }

    const waveScaleX = scaleLinear().range([0, waveClipWidth]).domain([0, 1]);
    const waveScaleY = scaleLinear().range([0, waveHeight]).domain([0, 1]);

    const clipArea = area()
        .x((d) => waveScaleX(d[0]))
        .y0((d) =>
            waveScaleY(
                Math.sin(
                    Math.PI * 2 * mergedConfig.waveOffset * -1 +
                    Math.PI * 2 * (1 - mergedConfig.waveCount) +
                    d[1] * 2 * Math.PI
                )
            )
        )
        .y1(() => height + waveHeight * 5);

    const font = useFont(require('../assets/fonts/Jersey_15/Jersey15-Regular.ttf'), textPixels);

    const textValue = useSharedValue(textStartValue);
    const translateYPercent = useSharedValue(0);
    const translateXProgress = useSharedValue(0);

    useEffect(() => {
        translateYPercent.value = withTiming(fillPercent, {
            duration: mergedConfig.waveRiseTime,
        });
    }, [fillPercent]);

    useEffect(() => {
        textValue.value = withTiming(textFinalValue, {
            duration: mergedConfig.valueCountUp ? mergedConfig.waveRiseTime : 0,
        });
    }, [textFinalValue]);

    useEffect(() => {
        if (mergedConfig.waveAnimate) {
            translateXProgress.value = withRepeat(
                withTiming(1, {
                    duration: mergedConfig.waveAnimateTime,
                    easing: Easing.linear,
                }),
                -1
            );
        }
    }, [mergedConfig.waveAnimate]);

    const text = useDerivedValue(() => {
        return `${textValue.value.toFixed(mergedConfig.toFixed)}${mergedConfig.textSuffix
            }`;
    });

    const textTranslateX = useDerivedValue(() => {
        const textWidth = font?.getTextWidth(text.value) ?? 0;
        return width / 2 - textWidth / 2;
    });

    const clipSVGString = clipArea(data)!;
    const path = useDerivedValue(() => {
        const p = Skia.Path.MakeFromSVGString(clipSVGString)!;
        const m = Skia.Matrix();
        m.translate(
            width - waveClipWidth + waveLength * translateXProgress.value,
            (1 - translateYPercent.value) * height
        );
        p.transform(m);
        return p;
    });

    const textTransform = [
        { translateY: textRiseScaleY(mergedConfig.textVertPosition) - textPixels },
    ];

    return (
        <View>
            <Canvas style={{ width, height }}>
                <Group>
                    {/* Border rectangle with gradient stroke */}
                    <Rect
                        x={0}
                        y={0}
                        width={width}
                        height={height}
                        style="stroke"
                        strokeWidth={mergedConfig.circleThickness * Math.min(width, height)}
                    >
                        <LinearGradient
                            start={vec(0, 0)}
                            end={vec(width, height)}
                            colors={[
                                mergedConfig.circleColor,
                                `${mergedConfig.circleColor}BB`, 
                            ]}
                        />
                    </Rect>

                    <Text
                        x={textTranslateX}
                        y={textPixels}
                        text={text}
                        font={font}
                        color={mergedConfig.textColor}
                        transform={textTransform}
                    />

                    <Group clip={path}>
                        {/* Fill wave as gradient */}
                        <Rect x={0} y={0} width={width} height={height}>
                            <LinearGradient
                                start={vec(0, 0)}
                                end={vec(0, height)}
                                colors={[
                                    'rgba(19, 94, 255, 1)',
                                    'rgba(27, 73, 255, 1)',
                                    'rgba(0, 28, 214, 1)',
                                    'rgba(0, 23, 170, 1)',
                                    'rgba(0, 18, 135, 1)',
                                ]}
                            />
                        </Rect>

                        <Text
                            x={textTranslateX}
                            y={textPixels}
                            text={text}
                            font={font}
                            color={mergedConfig.waveTextColor}
                            transform={textTransform}
                        />
                    </Group>
                </Group>
            </Canvas>
        </View>
    );
};
