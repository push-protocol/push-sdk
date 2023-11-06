import { BigInt } from "@graphprotocol/graph-ts"
import { PushToken, Transfer, Approval } from "../generated/PushToken/PushToken"
import { User, UserCounter, TransferCounter } from "../generated/schema"
import { sendPushNotification } from "./PushNotification"
export const subgraphID = "aiswaryawalter/push-protocol-goerli"

let ZERO_BI = BigInt.fromI32(0)
let ONE_BI = BigInt.fromI32(1)

export function handleTransfer(event: Transfer): void {
  let contract = PushToken.bind(event.address)
  let decimals = BigInt.fromString(contract.decimals().toString())
  let power = exponentToBigInt(decimals)
  let day = (event.block.timestamp.div(BigInt.fromI32(60 * 60 * 24)))

  let userFrom = User.load(event.params.from.toHex())
  if (userFrom == null) {
    userFrom = newUser(event.params.from.toHex(), event.params.from.toHex());
  }
  userFrom.balance = (userFrom.balance).minus(event.params.tokens)
  userFrom.transactionCount = userFrom.transactionCount + 1
  userFrom.save()

  let userTo = User.load(event.params.to.toHex())
  if (userTo == null) {
    userTo = newUser(event.params.to.toHex(), event.params.to.toHex());

    // UserCounter
    let userCounter = UserCounter.load('singleton')
    if (userCounter == null) {
      userCounter = new UserCounter('singleton')
      userCounter.count = 1
    } else {
      userCounter.count = userCounter.count + 1
    }
    userCounter.save()
    userCounter.id = day.toString()
    userCounter.save()
  }
  userTo.balance = (userTo.balance).plus(event.params.tokens)
  userTo.transactionCount = userTo.transactionCount + 1
  userTo.save()

  // Transfer counter total and historical
  let transferCounter = TransferCounter.load('singleton')
  if (transferCounter == null) {
    transferCounter = new TransferCounter('singleton')
    transferCounter.count = 0
    transferCounter.totalTransferred = BigInt.fromI32(0)
  }
  transferCounter.count = transferCounter.count + 1
  transferCounter.totalTransferred = transferCounter.totalTransferred.plus(event.params.tokens)
  transferCounter.save()
  transferCounter.id = day.toString()
  transferCounter.save()

  let recipient = event.params.to.toHexString(),
  type = "3",
  title = "PUSH Received",
  body = `Received ${event.params.tokens.div(power)} PUSH from ${event.params.from.toHexString()}`,
  subject = "PUSH Received",
  message = `Received ${event.params.tokens.div(power)} PUSH from ${event.params.from.toHexString()}`,
  image = "https://play-lh.googleusercontent.com/i911_wMmFilaAAOTLvlQJZMXoxBF34BMSzRmascHezvurtslYUgOHamxgEnMXTklsF-S",
  secret = "null",
  cta = "https://epns.io/",

  notification = `{\"type\": \"${type}\", \"title\": \"${title}\", \"body\": \"${body}\", \"subject\": \"${subject}\", \"message\": \"${message}\", \"image\": \"${image}\", \"secret\": \"${secret}\", \"cta\": \"${cta}\"}`
 
  sendPushNotification(
  recipient, 
  notification
  )
}

function newUser(id: string, address: string): User {
  let user = new User(id);
  user.address = address
  user.balance = BigInt.fromI32(0)
  user.transactionCount = 0
  return user
}
function exponentToBigInt(decimals: BigInt): BigInt {
  let bd = BigInt.fromString('1')
  for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
    bd = bd.times(BigInt.fromString('10'))
  }
  return bd
}

// export function handleApproval(event: Approval): void {}
