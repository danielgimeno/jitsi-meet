// @flow
import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import { JitsiRecordingConstants } from '../../base/lib-jitsi-meet';
import {
    isNarrowAspectRatio,
    makeAspectRatioAware
} from '../../base/responsive-ui';

import AbstractLabels, {
    _abstractMapStateToProps,
    type Props
} from './AbstractLabels';
import styles from './styles';

/**
 * A container that renders the conference indicators, if any.
 */
class Labels extends AbstractLabels<Props, *> {
    /**
     * Implements React {@code Component}'s render.
     *
     * @inheritdoc
     */
    render() {
        const _wide = !isNarrowAspectRatio(this);
        const { _filmstripVisible } = this.props;

        return (
            <View
                pointerEvents = 'box-none'
                style = { [
                    styles.indicatorContainer,
                    _wide && _filmstripVisible && styles.indicatorContainerWide
                ] }>
                {
                    this._renderRecordingLabel(
                        JitsiRecordingConstants.mode.FILE)
                }
                {
                    this._renderRecordingLabel(
                        JitsiRecordingConstants.mode.STREAM)
                }
                {
                    this._renderTranscribingLabel()
                }
                {
                    this._renderVideoQualityLabel()
                }
            </View>
        );
    }

    _renderRecordingLabel: string => React$Element<*>

    _renderTranscribingLabel: () => React$Element<*>

    _renderVideoQualityLabel: () => React$Element<*>

}

export default connect(_abstractMapStateToProps)(
    makeAspectRatioAware(Labels)
);
