// @flow

import React from 'react';
import { connect } from 'react-redux';

import {
    _abstractMapStateToProps,
    AbstractSubtitles,
    type AbstractSubtitlesProps as Props
} from './AbstractSubtitles';

/**
 * React {@code Component} which can display speech-to-text results from
 * Jigasi as subtitles.
 */
class TranscriptionSubtitles extends AbstractSubtitles<Props> {

    /**
     * Renders the transcription text.
     *
     * @param {string} id - The ID of the transcript message from which the
     * {@code text} has been created.
     * @param {string} text - Subtitles text formatted with the participant's
     * name.
     * @returns {React$Element} - The React element which displays the text.
     * @protected
     */
    _renderParagraph(id: string, text: string): React$Element<*> {
        return (
            <p key = { id }>
                <span>{ text }</span>
            </p>
        );
    }

    /**
     * Renders the subtitles container.
     *
     * @param {Array<React$Element>} paragraphs - An array of elements created
     * for each subtitle using the {@link _renderParagraph} method.
     * @returns {React$Element} - The subtitles container.
     * @protected
     */
    _renderSubtitlesContainer(
            paragraphs: Array<React$Element<*>>): React$Element<*> {
        return (
            <div className = 'transcription-subtitles' >
                { paragraphs }
            </div>
        );
    }
}

export default connect(_abstractMapStateToProps)(TranscriptionSubtitles);
