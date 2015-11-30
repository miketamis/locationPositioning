var Helper = require("./Helper.js");
/*
=== ROT - Rate Of Turn ===
------------------------------------------------------------------------------
 1   2 3
 |   | |
$--ROT,x.x,A*hh<CR><LF>
 ------------------------------------------------------------------------------

Field Number:

1. Rate Of Turn, degrees per minute, "-" means bow turns to port
2. Status, A means data is valid
3. Checksum
*/


exports.Decoder = function (id) {
    this.id = id;
    this.talker_type_id = "ROT";
    this.talker_type_desc = "Rate of Turn";

    this.parse = function (tokens) {
        if (tokens.length < 3) {
            throw new Error('ROT : not enough tokens');
        }
        return {
            id: tokens[0].substr(1),
            talker_type_id: this.talker_type_id,
            talker_type_desc: this.talker_type_desc,
            rot: Helper.parseFloatX(tokens[1]),
            valid: tokens[2] === 'A'
        }
    };
};
