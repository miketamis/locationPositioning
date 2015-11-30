var Helper = require("./Helper.js");
/*
=== HDT - Heading - True ===

Actual vessel heading in degrees true produced by any device or system producing true heading.
------------------------------------------------------------------------------
        1   2 3
        |   | |
 $--HDT,x.x,T*hh<CR><LF>
 ------------------------------------------------------------------------------

Field Number:

1. Heading Degrees, true
2. T = True
3. Checksum
*/


exports.Decoder = function (id) {
    this.id = id;
    this.talker_type_id = "HDT";
    this.talker_type_desc = "Heading";

    this.parse = function (tokens) {
        if (tokens.length < 3) {
            throw new Error('HDT : not enough tokens');
        }
        return {
            id: tokens[0].substr(1),
            talker_type_id: this.talker_type_id,
            talker_type_desc: this.talker_type_desc,
            heading: Helper.parseFloatX(tokens[1]),
            true: tokens[2] === 'T'
        }
    };
};
