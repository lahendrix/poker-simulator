/*global define*/

define([
    'underscore',
    'backbone',
    'models/card',
    'models/hand'
], function (_, Backbone, CardModel, HandModel) {
    'use strict';

    var DeckCollection = Backbone.Collection.extend({
        model: CardModel,

        initialize: function(models, options) {
            this.CARD_SUITS = ["clubs", "hearts", "spades", "diamonds"];
            this.NUM_OF_SUITS = 4;
            this.CARDS_PER_SUIT = 13;
            this.CARD_RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
            this.POKER_HAND_SIZE = 5;

            for (var i = 0; i < this.NUM_OF_SUITS; i++) {
                var suit = this.CARD_SUITS[i];
                for (var j = 0; j < this.CARDS_PER_SUIT; j++) {
                    var card = new CardModel({
                        suit: suit,
                        rank: j,
                        type: this.CARD_RANKS[j]
                    });
                    this.add(card);
                }
            }

        },

        shuffleDeck: function() {
            this.models = this.shuffle();
        },

        dealHand: function() {
            var cardIndices = [],
                cards = [],
                hand, i;

            // Randomly select 5 card models from this collection without reuse
            while (cardIndices.length < this.POKER_HAND_SIZE) {
               cardIndices.push(this._getRandomIndex());
               cardIndices = _.uniq(cardIndices);
            }

            for (i = 0; i < this.POKER_HAND_SIZE; i++) {
                var cardData = this.at(cardIndices[i]).toJSON();
                cards.push(cardData);
            }

            // Sort hands
            cards = _.sortBy(cards, "rank");

            return new HandModel({
                cards: cards
            });

        },

        _getRandomIndex: function() {
            var min = 0,
                max = 51,
                index = Math.floor(Math.random() * (max - min + 1)) + min;

            return index;
        }

    });

    return DeckCollection;
});
