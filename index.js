const express = require("express");
const axios = require("axios");
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const mongoose = require('mongoose'); // Import Mongoose

const app = express();
app.use(express.json({
  limit: "500mb"
}));

const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://usmanhasan619:pdRTGbtSUAPZHwCz@cluster0.g8htb67.mongodb.net/Task-management?retryWrites=true&w=majority&appName=Cluster0', { // Replace 'yourdbname' with your actual database name
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
}).then(() => {

}).catch(err => {

});

// Define a Mongoose schema and model
const matchSchema = new mongoose.Schema({
  matchId: String,
  type: String, // 'live' or 'upcoming'
}, { timestamps: true });

const Match = mongoose.model('Match', matchSchema);

// WebSocket connection
io.on("connection", (socket) => {
  socket.on("skill", (data) => {

    socket.emit("skill", {
      back: "Testing websocket",
    });
  });
  socket.emit("skill", { back: "Testing websocket" });
});

const apiKey = "43526faba31aea44d5da1e6a9c7fac66"


// Function to fetch match data
const fetchMatchData = async (type) => {
  try {
    const response = await axios.get(`https://api.mglionnews.com/app/api/v1/matches/list?type=${type}`, {

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
    const response = await axios.get(`https://api.mglionnews.com/app/api/v1/schedules/list?type=${type}`, {
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
    const response = await axios.get(`https://api.mglionnews.com/app/api/v1/matches/get-scorecard?matchId=${matchId}`, {
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
    const response = await axios.get(`https://api.mglionnews.com/app/api/v1/matches/get-info?id=${matchId}`, {
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
    const response = await axios.get(`https://api.mglionnews.com/app/api/v1/matches/get-commentaries?matchId=${matchId}`, {
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
    const response = await axios.get(`https://api.mglionnews.com/app/api/v1/series/list?type=${type}`, {
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
    const response = await axios.get(`https://api.mglionnews.com/app/api/v1/matches/get-team?matchId=${matchId}&teamId=${teamId}`, {
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
    const response = await axios.get(`https://api.mglionnews.com/app/api/v1/teams/get-players?teamId=${teamId}`, {
      headers: {
        "Authtokens": apiKey
      }
    });
    return response?.data;
  } catch (error) {

    return [];
  }
};







// API endpoint to get both live and upcoming matches
app.get('/api/matches', async (req, res) => {
  try {
    // Function to extract match IDs and fetch live match scores
    const extractMatchData = async (matches, type) => {
      const matchIds = [];
      const matchDataLive = [];


      for (const matchType of matches) {
        if (matchType.seriesMatches) {
          for (const series of matchType.seriesMatches) {
            if (series.seriesAdWrapper && series.seriesAdWrapper.matches) {
              for (const match of series.seriesAdWrapper.matches) {
                const matchId = match.matchInfo?.matchId;
                if (matchId) {
                  matchIds.push(matchId);
                  try {
                    const singleData = await fetchMatchScoreById(matchId);

                    matchDataLive.push(singleData);

                    // Save match data to MongoDB
                    const matchData = new Match({ matchId, type });
                    await matchData.save();

                  } catch (err) {

                  }
                }
              }
            }
          }
        }
      }
      return { matchIds, matchDataLive };
    };

    // Fetch live matches and process them
    const liveMatches = await fetchMatchData('live');


    const { matchIds, matchDataLive } = await extractMatchData(liveMatches, 'live');

    // Log extracted match IDs


    // Respond with match data
    res.json({ matchDataLive });
  } catch (error) {

    res.status(500).json({ error: 'Internal Server Error' });
  }
});






app.get('/api/matches/info', async (req, res) => {
  try {

    if (!req?.query?.matchId) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }
    const matchData = await fetchMatchInfoById(req?.query?.matchId);


    res.json({ data: matchData });
  } catch (error) {
    console.log('error: ', error);

    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/matches/commentaries', async (req, res) => {
  try {

    if (!req?.query?.matchId) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }
    const matchData = await fetchMatchCommentariesById(req?.query?.matchId);
    res.json({ data: matchData });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/api/matches/schedules', async (req, res) => {
  try {

    // /api/matches/schedules?type=
    // international
    // league
    // women
    // domestic
    if (!req?.query?.type) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }
    const matchData = await fetchSchedulesMatchData(req?.query?.type);
    res.json({ data: matchData });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/api/matches/series', async (req, res) => {
  try {

    // /api/matches/schedules?type=
    // international
    // league
    // women
    // domestic
    if (!req?.query?.type) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }
    const matchData = await fetchMatchSeries(req?.query?.type);

    res.json({ data: matchData });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/api/matches/teamByIds', async (req, res) => {
  try {
    const { matchId, teamId } = req?.query;

    if (!matchId || !teamId) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const matchData = await fetchTeamByIds(matchId, teamId);

    if (!matchData?.players) {
      return res.status(404).json({ message: "Match or team data not found" });
    }

    const fetchPlayerDetails = async (players) => {
      const detailsPromises = players.map(async (player) => {
        const image = await fetchImageById(player?.faceImageId);
        return { image, fullName: player?.fullName };
      });
      return Promise.all(detailsPromises);
    };

    const benchPlayers = await fetchPlayerDetails(matchData.players.bench || []);

    const playingXIPlayers = await fetchPlayerDetails(matchData.players["playing XI"] || []);

    const responseData = {
      matchData,
      benchPlayers,
      playingXIPlayers,
    };

    res.json({ data: responseData });
  } catch (error) {
    console.error("Error fetching match data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});





app.get('/api/matches/getTeamsById', async (req, res) => {
  try {
    const { teamId } = req?.query;

    if (!teamId) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const playersData = await fetchPlayersByTeamId(teamId);
    console.log('playersData: ', playersData);




    if (!playersData?.player) {
      return res.status(404).json({ message: "Match or team data not found" });
    }

    // Helper function to fetch player details
    const fetchPlayerDetails = async (players) => {
      const detailsPromises = players.map(async (player) => {
        const image = await fetchImageById(player?.imageId);
        return {
          ...player,
          image, // Add image to the player details
        };
      });
      return Promise.all(detailsPromises);
    };

    const players = await fetchPlayerDetails(playersData?.player || []);



    res.json({ data: players });
  } catch (error) {
    console.error("Error fetching match data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }

});


app.get('/api/matches/getScore', async (req, res) => {
  try {

    if (!req?.query?.matchId) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }
    const matchData = await fetchMatchScoreById(req?.query?.matchId);

    res.json({ data: matchData });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Start the server
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {



});
server.listen(7006, () => { });
