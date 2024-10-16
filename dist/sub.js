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
exports.subConnect = subConnect;
const redis_1 = require("redis");
const subClient = (0, redis_1.createClient)({
    url: "redis://localhost:6379",
});
function subConnect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!subClient.isOpen) {
                // Connect only if not already connected
                console.log("Connecting sub client to Redis...");
                yield subClient.connect();
            }
        }
        catch (error) {
            console.error("Failed to connect to Redis:", error);
            throw error;
        }
    });
}
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield subConnect();
        }
        catch (error) {
            console.log(error);
        }
    });
}
startServer();
