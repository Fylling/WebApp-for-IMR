/**
 * Created by sebastian on 17.07.17.
 */
import SimpleSchema from 'simpl-schema';



export const Schemas = {};


const SchemasImg = new SimpleSchema({
    img: {
        type: String,
        label: 'img'
    }
});

Schemas.Reports = new SimpleSchema({
    amount: {
        type: Number,
        label: 'amount',
        max: 99,
        optional: true
    },

    depth: {
        type: Number,
        label: 'depth',
        max: 999,
        optional: true
    },

    isValidated: {
        type: Boolean,
        label: 'isValidated',
        optional: false
    },

    latitude: {
        type: Number,
        label: 'latitude',
        optional: false
    },

    length: {
        type: Number,
        label: 'length',
        max: 99,
        optional: true
    },

    longitude: {
        type: Number,
        label: 'longitude',
        optional: false
    },

    photo: {
        type: {SchemasImg},
        label: 'photo',
        optional: false
    },

    reportFeedback: {
        type: String,
        label: 'reportFeedback',
        optional: false
    },

    scientist: {
        type: String,
        label: 'scientist',
        optional: false
    },

    taken: {
        type: Date,
        label: 'taken',
        optional: false
    },

    text: {
        type: String,
        label: "title",
        max: 30
    },

    user: {
        type: String,
        label: 'user',
        optional: false
    }

});

Schemas.Images = {
    Images: {
        type: String,
        label: 'images'
    }
};