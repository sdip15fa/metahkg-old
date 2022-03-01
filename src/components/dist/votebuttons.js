"use strict";
exports.__esModule = true;
require("./css/votebuttons.css");
var react_1 = require("react");
var icons_material_1 = require("@mui/icons-material");
var material_1 = require("@mui/material");
var axios_1 = require("axios");
var react_2 = require("react");
var ContextProvider_1 = require("./ContextProvider");
/*
 * Buttons for voting
 * Disabled if user is not signed in
 * If upvote is clicked or has been previously clicked using a same account,
 * upvote button text color changes to green and downvote button disables.
 * For downvote, the same but color is red
 * Generates a notification in case of errors
 */
function VoteButtons(props) {
    var _a = react_2.useState(props.vote), vote = _a[0], setVote = _a[1];
    var _b = react_2.useState(props.up), up = _b[0], setUp = _b[1];
    var _c = react_2.useState(props.down), down = _c[0], setDown = _c[1];
    var _d = ContextProvider_1.useNotification(), setNotification = _d[1];
    var sendvote = function (v) {
        v === "U" ? setUp(up + 1) : setDown(down + 1);
        setVote(v);
        axios_1["default"]
            .post("/api/vote", {
            id: Number(props.id),
            cid: Number(props.cid),
            vote: v
        })["catch"](function (err) {
            var _a, _b, _c;
            v === "U" ? setUp(up) : setDown(down);
            setVote(undefined);
            setNotification({
                open: true,
                text: ((_b = (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) || ((_c = err === null || err === void 0 ? void 0 : err.response) === null || _c === void 0 ? void 0 : _c.data) || ""
            });
        });
    };
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement(material_1.ButtonGroup, { variant: "text", className: "vb-btn-group" },
            react_1["default"].createElement(material_1.Button, { className: "nopadding vb-btn", disabled: !localStorage.user || !!vote, onClick: function () {
                    sendvote("U");
                } },
                react_1["default"].createElement(material_1.Typography, { className: "flex", sx: {
                        color: vote === "U" ? "green" : "#aaa"
                    } },
                    react_1["default"].createElement(icons_material_1.ArrowDropUp, { className: "icon-white-onhover" }),
                    up)),
            react_1["default"].createElement(material_1.Button, { className: "nopadding mr5 vb-btn", disabled: !localStorage.user || !!vote, onClick: function () {
                    sendvote("D");
                } },
                react_1["default"].createElement(material_1.Typography, { className: "flex", sx: {
                        color: vote === "D" ? "red" : "#aaa"
                    } },
                    react_1["default"].createElement(icons_material_1.ArrowDropDown, { className: "icon-white-onhover" }),
                    down)))));
}
exports["default"] = VoteButtons;
