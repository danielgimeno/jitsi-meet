/* @flow */
import { getShareInfoText } from '../invite';

import {
    SET_GOOGLE_API_PROFILE,
    SET_GOOGLE_API_STATE
} from './actionTypes';
import { GOOGLE_API_STATES } from './constants';
import googleApi from './googleApi';

/**
 * Retrieves the current calendar events.
 *
 * @param {number} fetchStartDays - The number of days to go back when fetching.
 * @param {number} fetchEndDays - The number of days to fetch.
 * @returns {function(Dispatch<*>): Promise<CalendarEntries>}
 */
export function getCalendarEntries(
        fetchStartDays: ?number, fetchEndDays: ?number) {
    return () =>
        googleApi.get()
        .then(() =>
            googleApi._getCalendarEntries(fetchStartDays, fetchEndDays));
}

/**
 * Loads Google API.
 *
 * @param {string} clientId - The client ID to be used with the API library.
 * @returns {Function}
 */
export function loadGoogleAPI(clientId: string) {
    return (dispatch: Dispatch<*>, getState: Function) =>
        googleApi.get()
        .then(() => {
            if (getState()['features/google-api'].googleAPIState
                    === GOOGLE_API_STATES.NEEDS_LOADING) {
                return googleApi.initializeClient(clientId);
            }

            return Promise.resolve();
        })
        .then(() => dispatch({
            type: SET_GOOGLE_API_STATE,
            googleAPIState: GOOGLE_API_STATES.LOADED }))
        .then(() => googleApi.isSignedIn())
        .then(isSignedIn => {
            if (isSignedIn) {
                dispatch({
                    type: SET_GOOGLE_API_STATE,
                    googleAPIState: GOOGLE_API_STATES.SIGNED_IN });
            }
        });
}

/**
 * Executes a request for a list of all YouTube broadcasts associated with
 * user currently signed in to the Google API Client Library.
 *
 * @returns {function(): (Promise<*>|Promise<any[] | never>)}
 */
export function requestAvailableYouTubeBroadcasts() {
    return () =>
        googleApi.requestAvailableYouTubeBroadcasts()
        .then(response => {
            // Takes in a list of broadcasts from the YouTube API,
            // removes dupes, removes broadcasts that cannot get a stream key,
            // and parses the broadcasts into flat objects.
            const broadcasts = response.result.items;

            const parsedBroadcasts = {};

            for (let i = 0; i < broadcasts.length; i++) {
                const broadcast = broadcasts[i];
                const boundStreamID = broadcast.contentDetails.boundStreamId;

                if (boundStreamID && !parsedBroadcasts[boundStreamID]) {
                    parsedBroadcasts[boundStreamID] = {
                        boundStreamID,
                        id: broadcast.id,
                        status: broadcast.status.lifeCycleStatus,
                        title: broadcast.snippet.title
                    };
                }
            }

            return Object.values(parsedBroadcasts);
        });
}

/**
 * Fetches the stream key for a YouTube broadcast and updates the internal
 * state to display the associated stream key as being entered.
 *
 * @param {string} boundStreamID - The bound stream ID associated with the
 * broadcast from which to get the stream key.
 * @returns {function(): (Promise<*>|Promise<{
 *  streamKey: (*|string),
 *  selectedBoundStreamID: *} | never>)}
 */
export function requestLiveStreamsForYouTubeBroadcast(boundStreamID: string) {
    return () =>
        googleApi.requestLiveStreamsForYouTubeBroadcast(boundStreamID)
            .then(response => {
                const broadcasts = response.result.items;
                const streamName = broadcasts
                    && broadcasts[0]
                    && broadcasts[0].cdn.ingestionInfo.streamName;
                const streamKey = streamName || '';

                return {
                    streamKey,
                    selectedBoundStreamID: boundStreamID
                };
            });
}

/**
 * Forces the Google web client application to prompt for a sign in, such as
 * when changing account, and will then fetch available YouTube broadcasts.
 *
 * @returns {function(): (Promise<*>|Promise<{
 *  streamKey: (*|string),
 *  selectedBoundStreamID: *} | never>)}
 */
export function showAccountSelection() {
    return () =>
        googleApi.showAccountSelection();
}

/**
 * Prompts the participant to sign in to the Google API Client Library.
 *
 * @returns {function(Dispatch<*>): Promise<string | never>}
 */
export function signIn() {
    return (dispatch: Dispatch<*>) => googleApi.get()
            .then(() => googleApi.signInIfNotSignedIn())
            .then(() => dispatch({
                type: SET_GOOGLE_API_STATE,
                googleAPIState: GOOGLE_API_STATES.SIGNED_IN
            }));
}

/**
 * Logs out the user.
 *
 * @returns {function(Dispatch<*>): Promise<string | never>}
 */
export function signOut() {
    return (dispatch: Dispatch<*>) =>
        googleApi.get()
            .then(() => googleApi.signOut())
            .then(() => {
                dispatch({
                    type: SET_GOOGLE_API_STATE,
                    googleAPIState: GOOGLE_API_STATES.LOADED
                });
                dispatch({
                    type: SET_GOOGLE_API_PROFILE,
                    profileEmail: ''
                });
            });
}

/**
 * Updates the profile data that is currently used.
 *
 * @returns {function(Dispatch<*>): Promise<string | never>}
 */
export function updateProfile() {
    return (dispatch: Dispatch<*>) => googleApi.get()
        .then(() => googleApi.signInIfNotSignedIn())
        .then(() => dispatch({
            type: SET_GOOGLE_API_STATE,
            googleAPIState: GOOGLE_API_STATES.SIGNED_IN
        }))
        .then(() => googleApi.getCurrentUserProfile())
        .then(profile => {
            dispatch({
                type: SET_GOOGLE_API_PROFILE,
                profileEmail: profile.getEmail()
            });

            return profile.getEmail();
        });
}

/**
 * Updates the calendar event and adds a location and text.
 *
 * @param {string} id - The event id to update.
 * @param {string} calendarId - The calendar id to use.
 * @param {string} location - The location to add to the event.
 * @returns {function(Dispatch<*>): Promise<string | never>}
 */
export function updateCalendarEvent(
        id: string, calendarId: string, location: string) {
    return (dispatch: Dispatch<*>, getState: Function) => {

        const { dialInNumbersUrl } = getState()['features/base/config'];
        const text = getShareInfoText(location, dialInNumbersUrl !== undefined);

        return googleApi.get()
            .then(() =>
                googleApi._updateCalendarEntry(id, calendarId, location, text));
    };
}
