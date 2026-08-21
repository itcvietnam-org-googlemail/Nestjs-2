import { Module, DynamicModule } from '@nestjs/common';
import {
    ConfigModule as NestConfigModule,
    ConfigModuleOptions as NestConfigModuleOptions,
    ConfigFactory as NestConfigFactory,
    ConfigObject as NestConfigObject
} from '@nestjs/config';

import Joi from 'joi';

import { CONFIG_VALIDATION_SCHEMA } from './config.token.js';

@Module({
    imports: [],
    exports: [],
    providers: []
})

export class ConfigModule {
    static forRoot<ValidationOptions extends Record<string, any>>(options: NestConfigModuleOptions<ValidationOptions> = {}): Promise<DynamicModule> {
        return NestConfigModule.forRoot(options);
    }

    static forFeature(options: {
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