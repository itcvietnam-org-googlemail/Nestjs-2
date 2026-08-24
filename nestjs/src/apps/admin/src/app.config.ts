import { registerAs } from '@package/config';
import { UserConfig } from '@package/user';

export const userConfig: Partial<UserConfig> = {
    itemLimit: 700
};

export const appConfig = [
    registerAs('user', () => userConfig)
];

export const appPlainConfig = {
    user: userConfig
};