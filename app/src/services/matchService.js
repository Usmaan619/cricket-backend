const axios = require("axios");
const Match = require("../models/matchModel");

const apiKey = process.env.API_KEY;
const apiBaseUrl = "https://api.mglionnews.com/app/api/v1";

module.exports(() => {
    const fetchLiveMatches = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/matches/list?type=live`, {
                headers: { Authtokens: apiKey },
            });
            const matchData = response.data.typeMatches;
            // Save match data to database
            await Promise.all(
                matchData.map(async (match) => {
                    const matchId = match.matchInfo?.matchId;
                    if (matchId) {
                        await Match.updateOne(
                            { matchId },
                            { $set: { type: "live" } },
                            { upsert: true }
                        );
                    }
                })
            );
            return matchData;
        } catch (error) {
            throw new Error("Error fetching live matches");
        }
    };

    const fetchMatchInfoByIds = async (matchId) => {
        try {
            const response = await axios.get(`${apiBaseUrl}/matches/get-info?id=${matchId}`, {
                headers: { Authtokens: apiKey },
            });
            return response.data;
        } catch (error) {
            throw new Error("Error fetching match info");
        }
    };



    // Function to fetch match data
    const fetchMatchData = async (type) => {
        try {
            const response = await axios.get(`${apiBaseUrl}/matches/list?type=${type}`, {

                headers: {
                    "Authtokens": apiKey
                }
            });
            return response.data.typeMatches;
        } catch (error) {

            return [];
        }
    };
    const fetchSchedulesMatchData = async (type) => {
        try {
            const response = await axios.get(`${apiBaseUrl}/schedules/list?type=${type}`, {
                headers: {
                    "Authtokens": apiKey
                }
            });
            return response.data;
        } catch (error) {

            return [];
        }
    };



    const fetchMatchScoreById = async (matchId) => {
        try {
            const response = await axios.get(`${apiBaseUrl}/matches/get-scorecard?matchId=${matchId}`, {
                headers: {
                    "Authtokens": apiKey
                }
            });
            return response?.data;
        } catch (error) {

            return [];
        }
    };


    // Function to fetch match data
    const fetchMatchInfoById = async (matchId) => {
        try {
            const response = await axios.get(`${apiBaseUrl}/matches/get-info?id=${matchId}`, {
                headers: {
                    "Authtokens": apiKey
                }
            });
            return response?.data;
        } catch (error) {

            return [];
        }
    };


    const fetchMatchCommentariesById = async (matchId) => {
        try {
            const response = await axios.get(`${apiBaseUrl}/matches/get-commentaries?matchId=${matchId}`, {
                headers: {
                    "Authtokens": apiKey
                }
            });
            return response?.data;
        } catch (error) {

            return [];
        }
    };


    const fetchMatchSeries = async (type) => {
        try {
            const response = await axios.get(`${apiBaseUrl}/series/list?type=${type}`, {
                headers: {
                    "Authtokens": apiKey
                }
            });
            return response?.data;
        } catch (error) {

            return [];
        }
    };

    const fetchTeamByIds = async (matchId, teamId) => {
        try {
            const response = await axios.get(`${apiBaseUrl}/matches/get-team?matchId=${matchId}&teamId=${teamId}`, {
                headers: {
                    "Authtokens": apiKey
                }
            });
            return response?.data;
        } catch (error) {

            return [];
        }
    };

    const fetchImageById = async (imageId) => {
        try {
            const response = await axios.get(`https://mglionnews.com/get-image/${imageId}`, {
                headers: {
                    "Authtokens": apiKey
                }
            });
            return response?.data;
        } catch (error) {

            return [];
        }
    };

    const fetchPlayersByTeamId = async (teamId) => {
        try {
            const response = await axios.get(`${apiBaseUrl}/teams/get-players?teamId=${teamId}`, {
                headers: {
                    "Authtokens": apiKey
                }
            });
            return response?.data;
        } catch (error) {

            return [];
        }
    };


});
