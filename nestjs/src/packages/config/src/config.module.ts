/*
* Import
*/
import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { registerAs as nestRegisterAs } from '@nestjs/config';
import { CONFIG_VALIDATION_SCHEMA } from './config.token.js';

import type {
    ConfigModuleOptions as NestConfigModuleOptions,
    ConfigFactory as NestConfigFactory,
    ConfigObject as NestConfigObject
} from '@nestjs/config';

/*
* Type
*/
type ConfigModuleOptions<ValidationOptions extends Record<string, any>> = Omit<NestConfigModuleOptions<ValidationOptions>, 'load'> & {
    load?: (NestConfigFactory | Promise<NestConfigFactory>)[] | Record<string, object>;
};

/*
* Export
*/
@Module({
    imports: [],
    exports: [],
    providers: []
})
export class ConfigModule {
    public static forRoot<ValidationOptions extends Record<string, any>>(options: ConfigModuleOptions<ValidationOptions> = {}): Promise<DynamicModule> {
        const {
            load,
            ...moduleOptions
        } = options;

        if (load === undefined) {
            return NestConfigModule.forRoot(moduleOptions);
        } else {
            if (Array.isArray(load)) {
                return NestConfigModule.forRoot({
                    ...moduleOptions,
                    load
                });
            }
        }

        const configFactories = Object.entries(load).map(
            ([key, value]) => nestRegisterAs(
                key,
                () => value
            )
        );

        return NestConfigModule.forRoot({
            ...moduleOptions,
            load: configFactories
        });
    }

    public static forFeature(options: {
        config?: NestConfigFactory<NestConfigObject>;
        environmentSchema?: Record<string, Joi.Schema>;
    }): DynamicModule {
        return {
            module: ConfigModule,
            imports: options.config ? [
                NestConfigModule.forFeature(options.config)
            ] : [],
            providers: options.environmentSchema ? [
                {
                    provide: CONFIG_VALIDATION_SCHEMA,
                    useFactory: () => {
                        const result = Joi.object(options.environmentSchema).unknown(true)
                                                                            .validate(process.env);

                        if (result.error) {
                            throw result.error;
                        }
                    }
                }
            ] : []
        };
    }
}