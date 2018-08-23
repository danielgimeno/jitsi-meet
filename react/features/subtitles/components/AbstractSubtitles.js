// @flow

import { Component } from 'react';

/**
 * {@code AbstractSubtitles} properties.
 */
export type AbstractSubtitlesProps = {

    /**
     * Transcript texts formatted with participant's name and final content.
     * Mapped by id just to have the keys for convenience during the rendering
     * process.
     */
    _transcripts: Map<string, string>,

    /**
     * Whether local participant is requesting to see subtitles.
     */
    _requestingSubtitles: boolean
};

/**
 * Abstract React {@code Component} which can display speech-to-text results
 * from Jigasi as subtitles.
 */
export class AbstractSubtitles<P: AbstractSubtitlesProps> extends Component<P> {

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        if (!this.props._requestingSubtitles
                || !this.props._transcripts.size) {
            return null;
        }

        const paragraphs = [];

        for (const [ id, text ] of this.props._transcripts) {
            paragraphs.push(
                this._renderParagraph(id, text)
            );
        }

        return this._renderSubtitlesContainer(paragraphs);
    }

    /* eslint-disable no-unused-vars */
    /**
     * Renders the transcription text.
     *
     * @param {string} id - The ID of the transcript message from which the
     * {@code text} has been created.
     * @param {string} text - Subtitles text formatted with the participant's
     * name.
     * @returns {React$Element} - The React element which displays the text.
     * @protected
     * @abstract
     */
    _renderParagraph: (id: string, text: string) => React$Element<*>;

    /**
     * Renders the subtitles container.
     *
     * @param {Array<React$Element>} paragraphs - An array of elements created
     * for each subtitle using the {@link _renderParagraph} method.
     * @returns {React$Element} - The subtitles container.
     * @protected
     * @abstract
     */
    _renderSubtitlesContainer: (Array<React$Element<*>>) => React$Element<*>;

    /* eslint-enable no-unused-vars */
}

/**
 * Formats the transcript messages into text by prefixing participant's name to
 * avoid duplicating the effort on platform specific component.
 *
 * @param {Object} state - The Redux state.
 * @returns {Map<string, string>} - Formatted transcript subtitles mapped by
 * transcript message IDs.
 * @private
 */
function _constructTranscripts(state: Object): Map<string, string> {
    const { _transcriptMessages } = state['features/subtitles'];
    const transcripts = new Map();

    for (const [ id, transcriptMessage ] of _transcriptMessages) {
        let text;

        if (transcriptMessage) {
            text = `${transcriptMessage.participantName}: `;

            if (transcriptMessage.final) {
                text += transcriptMessage.final;
            } else {
                const stable = transcriptMessage.stable || '';
                const unstable = transcriptMessage.unstable || '';

                text += stable + unstable;
            }

            transcripts.set(id, text);
        }
    }

    return transcripts;
}

/**
 * Maps the transcriptionSubtitles in the Redux state to the associated
 * props of {@code AbstractSubtitles}.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _transcripts: Map<string, string>
 * }}
 */
export function _abstractMapStateToProps(state: Object) {
    const { _requestingSubtitles } = state['features/subtitles'];

    return {
        _transcripts: _constructTranscripts(state),
        _requestingSubtitles
    };
}
