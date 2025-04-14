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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var generative_ai_1 = require("@google/generative-ai"); // Import Content type as well
var dotenv = require("dotenv");
// Load environment variables from .env file in the project root
dotenv.config();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var geminiApiKey, genAI, model, result, response, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("test-gemini.ts: Starting standalone Gemini image test...");
                    geminiApiKey = process.env.Gemini_API_KEY;
                    if (!geminiApiKey) {
                        console.error("test-gemini.ts: Error - Gemini_API_KEY environment variable not found. Make sure it's set in your .env file.");
                        return [2 /*return*/];
                    }
                    console.log("test-gemini.ts: Gemini_API_KEY found:", geminiApiKey.substring(0, 10) + "..."); // Log first few chars of API key
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    genAI = new generative_ai_1.GoogleGenerativeAI(geminiApiKey);
                    model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
                    console.log("test-gemini.ts: Calling Gemini API for image generation...");
                    return [4 /*yield*/, model.generateContent({
                            contents: [{
                                    role: "user", // **ADD ROLE: "user" HERE**
                                    parts: [{ text: "A vibrant watercolor painting of a sunflower field under a bright blue sky" }]
                                }], // Explicitly cast to Content type for clarity (optional)
                        })];
                case 2:
                    result = _b.sent();
                    response = result.response;
                    if ((_a = response.promptFeedback) === null || _a === void 0 ? void 0 : _a.blockReason) {
                        console.warn("test-gemini.ts: Image generation blocked:", response.promptFeedback);
                    }
                    else {
                        console.log("test-gemini.ts: Image generation successful!");
                        console.log("test-gemini.ts: Gemini API Re sponse:", response); // Log the full response
                        console.log("test-gemini.ts: response.candidates[0].content:", response.candidates[0].content); // **<--- ADDED LOGGING LINE**
                        console.log("test-gemini.ts: response.candidates[0].content.parts:", response.candidates[0].content.parts); // **<--- ADDED LOGGING LINE**
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    console.error("test-gemini.ts: Error during Gemini image generation:", error_1);
                    console.error("test-gemini.ts: Raw Error Object:", error_1);
                    return [3 /*break*/, 4];
                case 4:
                    console.log("test-gemini.ts: Test finished.");
                    return [2 /*return*/];
            }
        });
    });
}
main();
