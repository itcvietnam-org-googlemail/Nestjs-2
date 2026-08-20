import { registerAs } from '@nestjs/config';
import { UserConfig } from '@package/user';

export const userConfig: Partial<UserConfig> = {
    itemLimit: 100000
};

export const appConfig = [
    registerAs('user', () => userConfig)
];