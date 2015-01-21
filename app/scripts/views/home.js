/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'collections/deck',
    'models/hand'
], function ($, _, Backbone, JST, DeckCollection, HandModel) {
    'use strict';

    var HomeView = Backbone.View.extend({
        template: JST['app/scripts/templates/home.ejs'],

        events: {
            'click .start-simulation': '_startSimulation',
            'click .start-head-to-head': '_startHeadToHead',
            'shown.bs.tab a[data-toggle="tab"]': 'setActiveTab'
        },

        initialize: function () {
            this.activeTab = "simulation";
            this.model = new Backbone.Model({
                counts: {
                    onepair: 0,
                    twopair: 0,
                    threeofkind: 0,
                    straight: 0,
                    flush: 0,
                    fullhouse: 0,
                    fourofkind: 0,
                    straightflush: 0,
                    highcard: 0
                },
                numHands: 1,
                cardDeck: new DeckCollection(),
                player1: {hand:"flush", winner: true},
                player2: {hand:"onepair", winner: false}
            });
            this.listenTo(this.model, 'change', this.render);
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.$('a[data-tab="' + this.activeTab + '"]').tab('show');
            return this;
        },

        _setActiveTab: function(e) {
            this.activeTab = $(e.currentTarget).data("tab");
        },

        _getCounts: function() {
            return {
                onepair: 0,
                twopair: 0,
                threeofkind: 0,
                straight: 0,
                flush: 0,
                fullhouse: 0,
                fourofkind: 0,
                straightflush: 0,
                highcard: 0
            };
        },

        _startSimulation: function() {
            // $("#main-progress-bar-modal").modal("show");
            var cardDeck = this.model.get("cardDeck");
            var counts = this._getCounts();
            var numHands = 1000;


            for (var i = 1; i <= numHands; i++) {
                var pokerHand = cardDeck.dealHand(),
                    type = pokerHand.getPokerHandType();

                counts[type] = counts[type] + 1;
                cardDeck.shuffleDeck();
            }

            // $("#main-progress-bar-modal").modal("hide");

            this.model.set({
                counts: counts,
                numHands: numHands
            });
        },

        _startHeadToHead: function() {
            var cardDeck = this.model.get("cardDeck"),
                handRanks = {
                    highcard: 1,
                    onepair: 2,
                    twopair: 3,
                    threeofkind: 4,
                    straight: 5,
                    flush: 6,
                    fullhouse: 7,
                    fourofkind: 8,
                    straightflush: 8
                },
                player1Hand = cardDeck.dealHand(),
                player1HandType = player1Hand.getPokerHandType(),
                player2Hand = cardDeck.dealHand(),
                player2HandType = player2Hand.getPokerHandType();

            this.model.set({
                player1: {
                    hand: player1HandType,
                    winner: handRanks[player1HandType] >= handRanks[player2HandType]
                },
                player2: {
                    hand: player1HandType,
                    winner: handRanks[player1HandType] >= handRanks[player2HandType]
                }
            });


        }
    });

    return HomeView;
});
