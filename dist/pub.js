"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pubConnect = pubConnect;
const _1 = require(".");
function pubConnect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!_1.pubClient.isOpen) {
                // Ensure we connect if not already connected
                console.log("Connecting sub client to Redis...");
                yield _1.pubClient.connect();
            }
        }
        catch (error) {
            console.error("Failed to connect to Redis:", error);
            throw error;
        }
    });
}
