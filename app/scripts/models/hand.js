/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var HandModel = Backbone.Model.extend({

        initialize: function() {
            this._setCardCounts();
            this._setSuiteCount();
        },

        defaults: {
            cards: [] // Array of card objects
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        },

        getPokerHandType: function() {
            var handType = "",
                onePair = false,
                twoPair = false,
                threeOfKind = false,
                straight = false,
                flush = false,
                fullHouse = false,
                fourOfKind = false,
                straightFlush = false;

            if (this._isOnePair()) {
                onePair = true;
                handType = "onepair";
            }

            if (onePair && this._isTwoPair()) {
                twoPair = true;
                handType = "twopair";
            }

            if (onePair && this._isThreeOfAKind()) {
                threeOfKind = true;
                handType = "threeofkind";
            }

            if (this._isStraight()) {
                straight = true;
                handType = "straight";
            }

            if (this._isFlush()) {
                flush = true;
                handType = "flush";
            }

            if (threeOfKind && this._isFullHouse()) {
                fullHouse = true;
                handType = "fullhouse";
            }

            if (threeOfKind && this._isFourOfAKind()) {
                fourOfKind = true;
                handType = "fourofkind";
            }

            if (flush && straight) {
                straightFlush = true;
                handType = "straightflush";
            }
            if (handType == "") {
                handType = "highcard";
            }

            return handType;
        },

        _setCardCounts: function() {
            var cards = this.get("cards") || [],
                numOfCards = cards.length,
                cardCounts = {};

            for (var i = 0; i < numOfCards; i++) {
                var card = cards[i];
                if (cardCounts.hasOwnProperty(card.rank)) {
                    cardCounts[card.rank] = cardCounts[card.rank] + 1;
                } else {
                    cardCounts[card.rank] = 1
                }
            }

            this.set("cardCounts", cardCounts)

        },

        _setSuiteCount: function() {
            var cards = this.get("cards") || [],
                numOfCards = cards.length,
                suitCount = {};

            for (var i = 0; i < numOfCards; i++) {
                var card = cards[i];
                if (suitCount.hasOwnProperty(card.suit)) {
                    suitCount[card.suit] = suitCount[card.suit] + 1;
                } else {
                    suitCount[card.suit] = 1
                }
            }

            this.set("suitCount", suitCount)
        },

        _isOnePair: function() {

            var cardCounts = this.get("cardCounts");

            for (var cardType in cardCounts) {
                if (cardCounts[cardType] > 1) {
                    return true;
                }
            }

            return false;
        },

        _isTwoPair: function() {
            var cardCounts = this.get("cardCounts");
            var pairs = 0;
            for (var cardType in cardCounts) {
                if (cardCounts[cardType] == 2) {
                    pairs++;
                }
            }

            return pairs > 1;
        },

        _isThreeOfAKind: function() {
            var cardCounts = this.get("cardCounts");

            for (var cardType in cardCounts) {
                if (cardCounts[cardType] > 2) {
                    return true;
                }
            }

            return false;
        },

        _isStraight: function() {
            var cards = this.get("cards") || [],
                numOfCards = cards.length,
                suitCount = this.get("suitCount"),
                startingRank = cards[0].rank,
                isStraight = true;

            // Check for sequential hand
            for (var i = 0; i < numOfCards; i++) {
                var card = cards[i];
                var expectedRank = startingRank + i;
                var hasCorrectRank = card.rank == expectedRank;
                if (!hasCorrectRank) {
                    isStraight = false;
                    break;
                }
            }

            // Check for at least two different suits
            if (_.keys(suitCount).length < 2) {
                isStraight = false;
            }

            return isStraight;
        },

        _isFlush: function() {
            var suitCount = this.get("suitCount");

            // All cards are of the same suit
            return _.keys(suitCount).length == 1;
        },

        _isFullHouse: function() {
            var cardCounts = this.get("cardCounts"),
                hasPair = false,
                hasThreeOfKind = false;


            for (var cardType in cardCounts) {
                if (cardCounts[cardType] == 2) {
                    hasPair = true;
                }

                if (cardCounts[cardType] == 3) {
                    hasThreeOfKind = true;
                }
            }

            return hasPair && hasThreeOfKind;
        },

        _isFourOfAKind: function() {
            var cardCounts = this.get("cardCounts");

            for (var cardType in cardCounts) {
                if (cardCounts[cardType] > 3) {
                    return true;
                }
            }

            return false;

        },

        _isStraightFlush: function() {
            var cardCounts = this.get("cardCounts"),
                hasFlush = this._isFlush(),
                suitCount = this.get("suitCount"),
                isStraightFlush = false;

            return hasFlush && _.keys(suitCount).length == 1;

        }
    });

    return HandModel;
});
