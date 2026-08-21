import { registerAs } from '@package/config';
import { UserConfig } from '@package/user';

export const userConfig: Partial<UserConfig> = {
    itemLimit: 600
};

export const appConfig = [
    registerAs('user', () => userConfig)
];