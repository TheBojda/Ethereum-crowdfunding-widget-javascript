import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { createCanvas, Image } from 'canvas'
import QRCode from 'qrcode'
import Web3 from 'web3';
import config from './config.json'
// import { AbiItem } from 'web3-utils'
// import erc20_abi from './erc20_abi.json'

export const lambdaHandler = async (event?: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const web3 = new Web3(config.PROVIDER_URL)
    const balance = parseInt(await web3.eth.getBalance(config.ETH_ADDRESS))

    // const contract = new web3.eth.Contract(erc20_abi as AbiItem[], config.CONTRACT_ADDRESS)
    // const balance = await contract.methods.balanceOf(config.ETH_ADDRESS).call()

    const canvas = createCanvas(200, 270)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = "#aaaaaa"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    let qrcode = new Image()
    qrcode.src = await QRCode.toDataURL(config.ETH_ADDRESS)
    ctx.drawImage(qrcode, 10, 10, 180, 180)

    ctx.fillStyle = '#000000'
    ctx.font = '12px Impact'
    ctx.fillText(config.TEXT, 10, 210)
    ctx.fillText(`${(balance / 10 ** 18).toFixed(2).toString()} ${config.SYMBOL} / ${config.TARGET_VALUE.toFixed(2).toString()} ${config.SYMBOL}`, 10, 230)

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(10, 240, 180, 10)

    let percent = balance / (config.TARGET_VALUE * 10 ** 18);
    if (percent > 1)
        percent = 1;

    ctx.fillStyle = '#037362'
    ctx.fillRect(10, 240, Math.round(180 * percent), 10)

    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 1
    ctx.strokeRect(10, 240, 180, 10)

    const base64data = canvas.toDataURL().substr('data:image/png;base64,'.length)

    return {
        statusCode: 200,
        headers: { "Content-Type": "image/png" },
        body: base64data,
        isBase64Encoded: true
    }
}

