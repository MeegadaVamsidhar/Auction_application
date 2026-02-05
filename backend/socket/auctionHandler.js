const Player = require('../models/Player');
const Team = require('../models/Team');

module.exports = (io) => {
    const getAutoIncrement = (currentBid) => {
        if (currentBid < 100) return 5; // 5L increment up to 1Cr
        return 20; // 20L increment from 1Cr onwards
    };

    let auctionState = {
        currentPlayer: null,
        highestBid: 0,
        highestBidder: null, // Team ID
        timer: 30,
        isActive: false,
        bidIncreaseAmount: 5
    };

    let timerInterval = null;

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.emit('auctionUpdate', auctionState);

        socket.on('startAuction', async (data) => {
            const { player, bidIncreaseAmount } = data;
            auctionState = {
                currentPlayer: player,
                highestBid: 0,
                highestBidder: null,
                highestBidderName: null,
                timer: 30,
                isActive: true,
                bidIncreaseAmount: getAutoIncrement(player.basePrice || 0),
                bidHistory: []
            };

            if (timerInterval) clearInterval(timerInterval);

            // Timer reduces but DOES NOT SELL automatically. Admin must click "Sold".
            timerInterval = setInterval(() => {
                if (auctionState.timer > 0) {
                    auctionState.timer--;
                    io.emit('auctionUpdate', auctionState);
                } else {
                    clearInterval(timerInterval);
                }
            }, 1000);

            io.emit('auctionUpdate', auctionState);
        });

        socket.on('placeBid', async ({ teamId, bidAmount }) => {
            if (!auctionState.isActive) return;

            const team = await Team.findById(teamId);
            if (!team) {
                socket.emit('error', 'Team not found');
                return;
            }

            if (team.status !== 'approved') {
                socket.emit('error', 'Team not approved by Admin');
                return;
            }

            if (team.remainingPurse < bidAmount) {
                socket.emit('error', 'Insufficient purse');
                return;
            }

            if (bidAmount % 1 !== 0) {
                socket.emit('error', 'Bids must be in whole Lakhs only');
                return;
            }

            if (bidAmount > auctionState.highestBid) {
                auctionState.highestBid = bidAmount;
                auctionState.highestBidder = teamId;
                auctionState.highestBidderName = team.name;
                auctionState.bidIncreaseAmount = getAutoIncrement(bidAmount);

                // Add to history
                auctionState.bidHistory.unshift({
                    teamName: team.name, // Send name directly for UI
                    amount: bidAmount,
                    timestamp: new Date()
                });

                auctionState.timer = 15; // Reset timer on new bid (Visual urgency)
                io.emit('auctionUpdate', auctionState);
            }
        });

        // New Manual Sell Event triggered by Admin
        socket.on('sellPlayer', async () => {
            if (!auctionState.isActive || !auctionState.currentPlayer) return;
            await finalizeBid(true);
        });

        // Manual Unsold Event
        socket.on('markUnsold', async () => {
            if (!auctionState.isActive || !auctionState.currentPlayer) return;
            await finalizeBid(false);
        });

        const finalizeBid = async (isSold) => {
            auctionState.isActive = false;
            if (timerInterval) clearInterval(timerInterval);

            if (isSold && auctionState.highestBidder) {
                // Update player and team in DB
                const player = await Player.findByIdAndUpdate(auctionState.currentPlayer._id, {
                    status: 'sold',
                    soldPrice: auctionState.highestBid,
                    team: auctionState.highestBidder,
                    $push: { bidHistory: auctionState.bidHistory } // Save history to DB
                }, { new: true });

                const team = await Team.findById(auctionState.highestBidder);
                team.remainingPurse -= auctionState.highestBid;
                team.players.push(player._id);
                await team.save();

                io.emit('playerSold', { player, teamName: team.name });
            } else {
                await Player.findByIdAndUpdate(auctionState.currentPlayer._id, { status: 'unsold' });
                io.emit('playerUnsold', auctionState.currentPlayer);
            }
            // Clear current player from state
            auctionState.currentPlayer = null;
            io.emit('auctionUpdate', auctionState);
        };
    });
};
