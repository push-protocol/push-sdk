import * as PushAPI from '@pushprotocol/restapi';

export function fetchNotifications(user: string, size: number) {
    return PushAPI.user.getFeeds({
        user: '',
        env: 'staging'
    });
}

