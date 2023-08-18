const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;
const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        default: ""
    },
    lastName: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isApprovedByAdmin: {
        type: Boolean,
        default: false
    },
    location: {
        type: {
            type: String,
            default: 'Point',
        },
        coordinates: {
            type:[Number],
            default:[0, 0]
        }, // [22.2475, 14.2547]  [longitude, latitude]
    },
    organisationId: {
        type: Schema.Types.ObjectId,
        ref: "organisations",
    }
},
    {
        timestamps: true
    });

UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 5, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});
UserSchema.methods.comparePassword = function (userPassword, callback) {
    bcrypt.compare(userPassword, this.password, function (err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

UserSchema.index({location:"2dsphere"})

module.exports = mongoose.model("users", UserSchema);