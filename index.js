"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lambdaHandler = void 0;
const canvas_1 = require("canvas");
const qrcode_1 = __importDefault(require("qrcode"));
const web3_1 = __importDefault(require("web3"));
const config_json_1 = __importDefault(require("./config.json"));
const lambdaHandler = async (event) => {
    const web3 = new web3_1.default(config_json_1.default.PROVIDER_URL);
    const balance = parseInt(await web3.eth.getBalance(config_json_1.default.ETH_ADDRESS));
    const canvas = (0, canvas_1.createCanvas)(200, 270);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#aaaaaa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let qrcode = new canvas_1.Image();
    qrcode.src = await qrcode_1.default.toDataURL(config_json_1.default.ETH_ADDRESS);
    ctx.drawImage(qrcode, 10, 10, 180, 180);
    ctx.fillStyle = '#000000';
    ctx.font = '12px Impact';
    ctx.fillText(config_json_1.default.TEXT, 10, 210);
    ctx.fillText(`${(balance / 10 ** 18).toFixed(2).toString()} ${config_json_1.default.SYMBOL} / ${config_json_1.default.TARGET_VALUE.toFixed(2).toString()} ${config_json_1.default.SYMBOL}`, 10, 230);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(10, 240, 180, 10);
    let percent = balance / (config_json_1.default.TARGET_VALUE * 10 ** 18);
    if (percent > 1)
        percent = 1;
    ctx.fillStyle = '#037362';
    ctx.fillRect(10, 240, Math.round(180 * percent), 10);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 240, 180, 10);
    const base64data = canvas.toDataURL().substr('data:image/png;base64,'.length);
    return {
        statusCode: 200,
        headers: { "Content-Type": "image/png" },
        body: base64data,
        isBase64Encoded: true
    };
};
exports.lambdaHandler = lambdaHandler;
