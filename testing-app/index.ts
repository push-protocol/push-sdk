import { Http2ServerRequest } from 'http2';
import { createSocketConnection } from '../packages/socket/src';
import { ENV, EVENTS } from '../packages/socket/src/lib/constants';

const pushSocket = createSocketConnection({ user: '0x012D969CCCc07030f1dAad6f68dA3e23F4EB5bA4', env: ENV.STAGING, socketType: 'chat', apiKey: 'F0pedGUxgf.W1CCfCI7Vy2iMq0WtheBXSNYcmxfoNqOpQqr4OWni4uzgjpJ6cu5yS6H3hHT07ol' })

pushSocket?.emit("ChatCreateIntent", { hi: "abc" }, (message: any) => {
    console.log(message)
})
