/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var CardModel = Backbone.Model.extend({

        initialize: function() {
        },

        defaults: {
            suit: "",
            rank: "",
            type: ""
        }
    });

    return CardModel;
});
