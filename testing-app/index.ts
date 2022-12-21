import { createSocketConnection } from '../packages/socket/src';
import { ENV, EVENTS } from '../packages/socket/src/lib/constants';

const main = async () => {
    const pushSocket = createSocketConnection({ user: '0x012D969CCCc07030f1dAad6f68dA3e23F4EB5bA4', env: ENV.STAGING, socketType: 'chat', apiKey: 'F0pedGUxgf.W1CCfCI7Vy2iMq0WtheBXSNYcmxfoNqOpQqr4OWni4uzgjpJ6cu5yS6H3hHT07ol' })
    console.log("sleeping")
    await sleep(4000)
    console.log("awake")
    pushSocket?.emit("CREATE_INTENT", { hi: "abc" }, (message: any) => {
        console.log(message)
    })
}

main().catch(err => console.error(err))

function sleep(ms: any) {
    return new Promise(resolve => setTimeout(resolve, ms));
}