var Helper = require("./Helper.js");

exports.Decoder = function (id) {
    this.id = id;
    this.talker_type_id = "AUX";
    this.talker_type_desc = "AUX for navicom units";

    this.parse = function (tokens) {
        if(tokens[1] === 'BAT') {
            return {
                id: tokens[0].substr(1),
                talker_type_id: this.talker_type_id,
                talker_type_desc: this.talker_type_desc,
                battery: Helper.parseIntX(tokens[2]),
                dunno: Helper.parseFloatX(tokens[3])
            }
        }
        return {};
    };
};
