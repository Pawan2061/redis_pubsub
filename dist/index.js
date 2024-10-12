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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subClient = exports.pubClient = void 0;
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const pub_1 = require("./pub");
const sub_1 = require("./sub");
const app = (0, express_1.default)();
exports.pubClient = (0, redis_1.createClient)({
    url: "redis://localhost:6379",
});
exports.subClient = (0, redis_1.createClient)({
    url: "redis://localhost:6379",
});
app.post("/message", (req, res) => {
    try {
        const message = req.body;
        exports.pubClient.publish("message", message);
    }
    catch (error) {
        console.log(error);
    }
});
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, pub_1.pubConnect)();
            yield (0, sub_1.subConnect)();
            yield exports.subClient.subscribe("message", (message) => {
                console.log(message, "here");
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
startServer();
