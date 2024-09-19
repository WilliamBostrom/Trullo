"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Typa asyncHandler-funktionen för att acceptera en asynkron middleware-funktion
const asyncHandler = (fn) => {
    return (req, res, next) => {
        // Anropa den asynkrona funktionen och fånga eventuella fel
        fn(req, res, next).catch(next);
    };
};
exports.default = asyncHandler;
