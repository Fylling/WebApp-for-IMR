/**
 * Created by sebastian on 17.07.17.
 */
import SimpleSchema from 'simpl-schema';



export const Schemas = {};


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
        type: Array,
        label: 'photo',
        optional: false,
        max: 10
    },
        'photo.$': {
            type: String
        },

    reportFeedback: {
        type: String,
        label: 'reportFeedback',
        optional: false
    },

    scientist: {
        type: String,
        label: 'scientist',
        optional: true
    },

    taken: {
        type: Date,
        label: 'taken',
        optional: false,
        index: -1
    },

    text: {
        type: String,
        label: "title",
        max: 30,
        index: 1
    },

    user: {
        type: String,
        label: 'user',
        optional: false
    },

    createdAt: {
        type: Date,
        label: 'createdAt',
        optional: false
    },

    checkedOut: {
        type: Boolean,
        label: 'checkedOut',
        optional: false
    },

    category: {
        type: String,
        label: 'category',
        optional: false
    },

    owner: {
        type: String,
        label: 'owner',
        optional: false
    },
    validSpecie: {
        type: String,
        label: "validSpecie",
        optional: true
    },
});