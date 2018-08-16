// @flow

import React, { Component } from 'react';
import { translate } from '../../base/i18n/index';

import { CircularLabel } from '../../base/label/index';
import Tooltip from '@atlaskit/tooltip';

import { type AbstractProps } from './AbstractTranscribingLabel';

/**
 * React Component for displaying a label when a transcriber is in the
 * conference.
 *
 * @extends Component
 */
class TranscribingLabel extends Component<AbstractProps> {

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <Tooltip
                content = { this.props.t('transcribing.labelToolTip') }
                position = { 'left' }>
                <CircularLabel
                    className = 'recording-label'
                    label = { this.props.t('transcribing.tr') } />
            </Tooltip>
        );
    }

}

export default translate(TranscribingLabel);
