// @flow

import { BoxModel, ColorPalette, createStyleSheet } from '../../base/styles';

/**
 * The styles of the React {@code Components} of the feature subtitles.
 */
export default createStyleSheet({

    /**
     * Style for the subtitles container.
     */
    subtitlesContainer: {
        alignItems: 'center',
        flexGrow: 0,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        margin: BoxModel.margin
    },

    /**
     * Style for subtitle paragraph.
     */
    subtitle: {
        borderRadius: BoxModel.margin / 4,
        backgroundColor: ColorPalette.black,
        color: ColorPalette.white,
        marginBottom: BoxModel.margin,
        padding: BoxModel.padding / 2
    }
});
