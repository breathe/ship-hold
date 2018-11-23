import * as QueryStream from 'pg-query-stream';
import {
    Builder,
    ConditionsBuilder, DeleteBuilder, InsertBuilder,
    NodeParam,
    SelectBuilder,
    SQLComparisonOperator, SQLQuery,
    UpdateBuilder
} from 'ship-hold-querybuilder';
import {InclusionInput, WithRelations} from './relations';

export interface WithQueryRunner {
    stream: (sink: GeneratorFunction, params?: object, offset?: number) => void;
    _stream: (params ?: object, offset?: number) => QueryStream;
    run: <T>(params ?: object, offset?: number) => Promise<T[]>;
    debug: <T>(params ?: object, offset?: number) => Promise<T[]>;
}

export interface ConditionsBuilderFactory {
    (leftOperand: NodeParam<any>,
     operator?: SQLComparisonOperator | NodeParam<any>,
     rightOperand?: NodeParam<any>): ConditionsBuilder<{}>;
}

export interface WithConditionsBuilderFactory {
    if: ConditionsBuilderFactory
}

export interface EntityDefinition {
    table: string;
    name: string;
    primaryKey?: string;
}

export interface EntityBuilder {
    readonly service: EntityService
    readonly cte: string; // Common Table Expression (default to actual table name)
    readonly primaryKey?: string;
    parentBuilder?: EntityBuilder;
}

export interface SelectServiceBuilder extends SelectBuilder, WithQueryRunner, EntityBuilder {
}

export interface UpdateServiceBuilder extends UpdateBuilder, WithQueryRunner, EntityBuilder {
}

export interface DeleteServiceBuilder extends DeleteBuilder, WithQueryRunner, EntityBuilder {
}

export interface InsertServiceBuilder extends InsertBuilder, WithQueryRunner, EntityBuilder {
}

export interface EntityService extends WithConditionsBuilderFactory, WithRelations<EntityService> {
    readonly definition: EntityDefinition;
    select: (...args: NodeParam<any>[]) => SelectServiceBuilder;
    update: (map ?: object) => UpdateServiceBuilder;
    delete: () => DeleteServiceBuilder;
    insert: (map ?: object) => InsertServiceBuilder;
}

export interface WithInclusion<T> {
    readonly inclusions: InclusionInput[];

    include(...relations: any[]): WithInclusion<T> & T;

    clone(): WithInclusion<T> & T;

    toBuilder(): WithInclusion<T> & T;
}

export interface ShipHoldBuilders extends WithConditionsBuilderFactory {
    select: (...args: NodeParam<any>[]) => SelectBuilder & WithQueryRunner;
    update: (tableName: string) => UpdateBuilder & WithQueryRunner;
    insert: (map ?: object) => InsertBuilder & WithQueryRunner;
    delete: (tableName: string) => DeleteBuilder & WithQueryRunner;
}

export type RunnableQueryBuilder = Builder & WithQueryRunner;