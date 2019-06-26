var Marionette = require('backbone.marionette')
var ScoreBoardTemplate = require('./ScoreBoardView.html')

module.exports = Marionette.LayoutView.extend({
	
	template : _.template('<div type="template" style="margin-left: 100px;" class="card shadow-lg p-3 mb-5 bg-white rounded col-md-3"> <div class="card-body"><h2 id="playerTurn">Player 1 turn</h2><div><h1>Player 1 walls:<span id="player1">10</span></h1></div><br><div><h1>Player 2 walls:<span id="player2">10</span></h1></div></div></div>'),

	// regions : {
	// 	scoreBoardRegion : '.scoreboard-region'
	// },
	onBeforeShow : function() {
		console.log(regions)	
	}
})