import React from 'react';
import { Text as ReactNativeText } from 'react-native';
import { presets } from './text.preset'
import { mergeAll, flatten } from 'ramda';
import { useTheme } from '../../context/theme-context';

export default function Text(props) {
    const {
        preset = 'default',
        children,
        style: styleOverride,
        textColor,
        centered,
        ...rest
    } = props;

    const {colors, isDark} = useTheme()

    const style = mergeAll(flatten([presets[preset] || presets.default, styleOverride]));

    return (
        <ReactNativeText
            {...rest}
            style={[ style, {color: textColor ?? colors.text}, centered && { textAlign: 'center' }]}>
            {children}
        </ReactNativeText>
    );
}
