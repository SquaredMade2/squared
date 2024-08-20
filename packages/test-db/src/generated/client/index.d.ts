
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Commit
 * 
 */
export type Commit = $Result.DefaultSelection<Prisma.$CommitPayload>
/**
 * Model TaskEventLog
 * 
 */
export type TaskEventLog = $Result.DefaultSelection<Prisma.$TaskEventLogPayload>
/**
 * Model TaskEvent
 * 
 */
export type TaskEvent = $Result.DefaultSelection<Prisma.$TaskEventPayload>
/**
 * Model Comment
 * 
 */
export type Comment = $Result.DefaultSelection<Prisma.$CommentPayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>
/**
 * Model PageFilterModel
 * 
 */
export type PageFilterModel = $Result.DefaultSelection<Prisma.$PageFilterModelPayload>
/**
 * Model Task
 * 
 */
export type Task = $Result.DefaultSelection<Prisma.$TaskPayload>
/**
 * Model Team
 * 
 */
export type Team = $Result.DefaultSelection<Prisma.$TeamPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Workspace
 * 
 */
export type Workspace = $Result.DefaultSelection<Prisma.$WorkspacePayload>
/**
 * Model UniversalTokenLink
 * 
 */
export type UniversalTokenLink = $Result.DefaultSelection<Prisma.$UniversalTokenLinkPayload>
/**
 * Model GithubRepoInfo
 * 
 */
export type GithubRepoInfo = $Result.DefaultSelection<Prisma.$GithubRepoInfoPayload>
/**
 * Model Project
 * 
 */
export type Project = $Result.DefaultSelection<Prisma.$ProjectPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Label: {
  Bug: 'Bug',
  Feature: 'Feature',
  Improvement: 'Improvement',
  Red: 'Red',
  Test: 'Test'
};

export type Label = (typeof Label)[keyof typeof Label]


export const Status: {
  backlog: 'backlog',
  todo: 'todo',
  inProgress: 'inProgress',
  done: 'done',
  canceled: 'canceled',
  duplicate: 'duplicate'
};

export type Status = (typeof Status)[keyof typeof Status]


export const Priority: {
  noPriority: 'noPriority',
  urgent: 'urgent',
  high: 'high',
  medium: 'medium',
  low: 'low'
};

export type Priority = (typeof Priority)[keyof typeof Priority]

}

export type Label = $Enums.Label

export const Label: typeof $Enums.Label

export type Status = $Enums.Status

export const Status: typeof $Enums.Status

export type Priority = $Enums.Priority

export const Priority: typeof $Enums.Priority

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Commits
 * const commits = await prisma.commit.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Commits
   * const commits = await prisma.commit.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.commit`: Exposes CRUD operations for the **Commit** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Commits
    * const commits = await prisma.commit.findMany()
    * ```
    */
  get commit(): Prisma.CommitDelegate<ExtArgs>;

  /**
   * `prisma.taskEventLog`: Exposes CRUD operations for the **TaskEventLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TaskEventLogs
    * const taskEventLogs = await prisma.taskEventLog.findMany()
    * ```
    */
  get taskEventLog(): Prisma.TaskEventLogDelegate<ExtArgs>;

  /**
   * `prisma.taskEvent`: Exposes CRUD operations for the **TaskEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TaskEvents
    * const taskEvents = await prisma.taskEvent.findMany()
    * ```
    */
  get taskEvent(): Prisma.TaskEventDelegate<ExtArgs>;

  /**
   * `prisma.comment`: Exposes CRUD operations for the **Comment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Comments
    * const comments = await prisma.comment.findMany()
    * ```
    */
  get comment(): Prisma.CommentDelegate<ExtArgs>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs>;

  /**
   * `prisma.pageFilterModel`: Exposes CRUD operations for the **PageFilterModel** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PageFilterModels
    * const pageFilterModels = await prisma.pageFilterModel.findMany()
    * ```
    */
  get pageFilterModel(): Prisma.PageFilterModelDelegate<ExtArgs>;

  /**
   * `prisma.task`: Exposes CRUD operations for the **Task** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tasks
    * const tasks = await prisma.task.findMany()
    * ```
    */
  get task(): Prisma.TaskDelegate<ExtArgs>;

  /**
   * `prisma.team`: Exposes CRUD operations for the **Team** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Teams
    * const teams = await prisma.team.findMany()
    * ```
    */
  get team(): Prisma.TeamDelegate<ExtArgs>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.workspace`: Exposes CRUD operations for the **Workspace** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Workspaces
    * const workspaces = await prisma.workspace.findMany()
    * ```
    */
  get workspace(): Prisma.WorkspaceDelegate<ExtArgs>;

  /**
   * `prisma.universalTokenLink`: Exposes CRUD operations for the **UniversalTokenLink** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UniversalTokenLinks
    * const universalTokenLinks = await prisma.universalTokenLink.findMany()
    * ```
    */
  get universalTokenLink(): Prisma.UniversalTokenLinkDelegate<ExtArgs>;

  /**
   * `prisma.githubRepoInfo`: Exposes CRUD operations for the **GithubRepoInfo** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GithubRepoInfos
    * const githubRepoInfos = await prisma.githubRepoInfo.findMany()
    * ```
    */
  get githubRepoInfo(): Prisma.GithubRepoInfoDelegate<ExtArgs>;

  /**
   * `prisma.project`: Exposes CRUD operations for the **Project** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Projects
    * const projects = await prisma.project.findMany()
    * ```
    */
  get project(): Prisma.ProjectDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.18.0
   * Query Engine version: 4c784e32044a8a016d99474bd02a3b6123742169
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray | { toJSON(): unknown }

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Commit: 'Commit',
    TaskEventLog: 'TaskEventLog',
    TaskEvent: 'TaskEvent',
    Comment: 'Comment',
    Notification: 'Notification',
    PageFilterModel: 'PageFilterModel',
    Task: 'Task',
    Team: 'Team',
    User: 'User',
    Workspace: 'Workspace',
    UniversalTokenLink: 'UniversalTokenLink',
    GithubRepoInfo: 'GithubRepoInfo',
    Project: 'Project'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "commit" | "taskEventLog" | "taskEvent" | "comment" | "notification" | "pageFilterModel" | "task" | "team" | "user" | "workspace" | "universalTokenLink" | "githubRepoInfo" | "project"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Commit: {
        payload: Prisma.$CommitPayload<ExtArgs>
        fields: Prisma.CommitFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CommitFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommitPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CommitFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommitPayload>
          }
          findFirst: {
            args: Prisma.CommitFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommitPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CommitFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommitPayload>
          }
          findMany: {
            args: Prisma.CommitFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommitPayload>[]
          }
          create: {
            args: Prisma.CommitCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommitPayload>
          }
          createMany: {
            args: Prisma.CommitCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CommitCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommitPayload>[]
          }
          delete: {
            args: Prisma.CommitDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommitPayload>
          }
          update: {
            args: Prisma.CommitUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommitPayload>
          }
          deleteMany: {
            args: Prisma.CommitDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CommitUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CommitUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommitPayload>
          }
          aggregate: {
            args: Prisma.CommitAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCommit>
          }
          groupBy: {
            args: Prisma.CommitGroupByArgs<ExtArgs>
            result: $Utils.Optional<CommitGroupByOutputType>[]
          }
          count: {
            args: Prisma.CommitCountArgs<ExtArgs>
            result: $Utils.Optional<CommitCountAggregateOutputType> | number
          }
        }
      }
      TaskEventLog: {
        payload: Prisma.$TaskEventLogPayload<ExtArgs>
        fields: Prisma.TaskEventLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TaskEventLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TaskEventLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventLogPayload>
          }
          findFirst: {
            args: Prisma.TaskEventLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TaskEventLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventLogPayload>
          }
          findMany: {
            args: Prisma.TaskEventLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventLogPayload>[]
          }
          create: {
            args: Prisma.TaskEventLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventLogPayload>
          }
          createMany: {
            args: Prisma.TaskEventLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TaskEventLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventLogPayload>[]
          }
          delete: {
            args: Prisma.TaskEventLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventLogPayload>
          }
          update: {
            args: Prisma.TaskEventLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventLogPayload>
          }
          deleteMany: {
            args: Prisma.TaskEventLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TaskEventLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TaskEventLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventLogPayload>
          }
          aggregate: {
            args: Prisma.TaskEventLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTaskEventLog>
          }
          groupBy: {
            args: Prisma.TaskEventLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<TaskEventLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.TaskEventLogCountArgs<ExtArgs>
            result: $Utils.Optional<TaskEventLogCountAggregateOutputType> | number
          }
        }
      }
      TaskEvent: {
        payload: Prisma.$TaskEventPayload<ExtArgs>
        fields: Prisma.TaskEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TaskEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TaskEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventPayload>
          }
          findFirst: {
            args: Prisma.TaskEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TaskEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventPayload>
          }
          findMany: {
            args: Prisma.TaskEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventPayload>[]
          }
          create: {
            args: Prisma.TaskEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventPayload>
          }
          createMany: {
            args: Prisma.TaskEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TaskEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventPayload>[]
          }
          delete: {
            args: Prisma.TaskEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventPayload>
          }
          update: {
            args: Prisma.TaskEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventPayload>
          }
          deleteMany: {
            args: Prisma.TaskEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TaskEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TaskEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskEventPayload>
          }
          aggregate: {
            args: Prisma.TaskEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTaskEvent>
          }
          groupBy: {
            args: Prisma.TaskEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<TaskEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.TaskEventCountArgs<ExtArgs>
            result: $Utils.Optional<TaskEventCountAggregateOutputType> | number
          }
        }
      }
      Comment: {
        payload: Prisma.$CommentPayload<ExtArgs>
        fields: Prisma.CommentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CommentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CommentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          findFirst: {
            args: Prisma.CommentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CommentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          findMany: {
            args: Prisma.CommentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[]
          }
          create: {
            args: Prisma.CommentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          createMany: {
            args: Prisma.CommentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CommentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[]
          }
          delete: {
            args: Prisma.CommentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          update: {
            args: Prisma.CommentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          deleteMany: {
            args: Prisma.CommentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CommentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CommentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>
          }
          aggregate: {
            args: Prisma.CommentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateComment>
          }
          groupBy: {
            args: Prisma.CommentGroupByArgs<ExtArgs>
            result: $Utils.Optional<CommentGroupByOutputType>[]
          }
          count: {
            args: Prisma.CommentCountArgs<ExtArgs>
            result: $Utils.Optional<CommentCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
      PageFilterModel: {
        payload: Prisma.$PageFilterModelPayload<ExtArgs>
        fields: Prisma.PageFilterModelFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PageFilterModelFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageFilterModelPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PageFilterModelFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageFilterModelPayload>
          }
          findFirst: {
            args: Prisma.PageFilterModelFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageFilterModelPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PageFilterModelFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageFilterModelPayload>
          }
          findMany: {
            args: Prisma.PageFilterModelFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageFilterModelPayload>[]
          }
          create: {
            args: Prisma.PageFilterModelCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageFilterModelPayload>
          }
          createMany: {
            args: Prisma.PageFilterModelCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PageFilterModelCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageFilterModelPayload>[]
          }
          delete: {
            args: Prisma.PageFilterModelDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageFilterModelPayload>
          }
          update: {
            args: Prisma.PageFilterModelUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageFilterModelPayload>
          }
          deleteMany: {
            args: Prisma.PageFilterModelDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PageFilterModelUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PageFilterModelUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageFilterModelPayload>
          }
          aggregate: {
            args: Prisma.PageFilterModelAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePageFilterModel>
          }
          groupBy: {
            args: Prisma.PageFilterModelGroupByArgs<ExtArgs>
            result: $Utils.Optional<PageFilterModelGroupByOutputType>[]
          }
          count: {
            args: Prisma.PageFilterModelCountArgs<ExtArgs>
            result: $Utils.Optional<PageFilterModelCountAggregateOutputType> | number
          }
        }
      }
      Task: {
        payload: Prisma.$TaskPayload<ExtArgs>
        fields: Prisma.TaskFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TaskFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TaskFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          findFirst: {
            args: Prisma.TaskFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TaskFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          findMany: {
            args: Prisma.TaskFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          create: {
            args: Prisma.TaskCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          createMany: {
            args: Prisma.TaskCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TaskCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          delete: {
            args: Prisma.TaskDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          update: {
            args: Prisma.TaskUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          deleteMany: {
            args: Prisma.TaskDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TaskUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TaskUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          aggregate: {
            args: Prisma.TaskAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTask>
          }
          groupBy: {
            args: Prisma.TaskGroupByArgs<ExtArgs>
            result: $Utils.Optional<TaskGroupByOutputType>[]
          }
          count: {
            args: Prisma.TaskCountArgs<ExtArgs>
            result: $Utils.Optional<TaskCountAggregateOutputType> | number
          }
        }
      }
      Team: {
        payload: Prisma.$TeamPayload<ExtArgs>
        fields: Prisma.TeamFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TeamFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TeamFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          findFirst: {
            args: Prisma.TeamFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TeamFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          findMany: {
            args: Prisma.TeamFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>[]
          }
          create: {
            args: Prisma.TeamCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          createMany: {
            args: Prisma.TeamCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TeamCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>[]
          }
          delete: {
            args: Prisma.TeamDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          update: {
            args: Prisma.TeamUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          deleteMany: {
            args: Prisma.TeamDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TeamUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TeamUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          aggregate: {
            args: Prisma.TeamAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTeam>
          }
          groupBy: {
            args: Prisma.TeamGroupByArgs<ExtArgs>
            result: $Utils.Optional<TeamGroupByOutputType>[]
          }
          count: {
            args: Prisma.TeamCountArgs<ExtArgs>
            result: $Utils.Optional<TeamCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Workspace: {
        payload: Prisma.$WorkspacePayload<ExtArgs>
        fields: Prisma.WorkspaceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WorkspaceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WorkspaceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          findFirst: {
            args: Prisma.WorkspaceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WorkspaceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          findMany: {
            args: Prisma.WorkspaceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>[]
          }
          create: {
            args: Prisma.WorkspaceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          createMany: {
            args: Prisma.WorkspaceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WorkspaceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>[]
          }
          delete: {
            args: Prisma.WorkspaceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          update: {
            args: Prisma.WorkspaceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          deleteMany: {
            args: Prisma.WorkspaceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WorkspaceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.WorkspaceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkspacePayload>
          }
          aggregate: {
            args: Prisma.WorkspaceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorkspace>
          }
          groupBy: {
            args: Prisma.WorkspaceGroupByArgs<ExtArgs>
            result: $Utils.Optional<WorkspaceGroupByOutputType>[]
          }
          count: {
            args: Prisma.WorkspaceCountArgs<ExtArgs>
            result: $Utils.Optional<WorkspaceCountAggregateOutputType> | number
          }
        }
      }
      UniversalTokenLink: {
        payload: Prisma.$UniversalTokenLinkPayload<ExtArgs>
        fields: Prisma.UniversalTokenLinkFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UniversalTokenLinkFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversalTokenLinkPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UniversalTokenLinkFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversalTokenLinkPayload>
          }
          findFirst: {
            args: Prisma.UniversalTokenLinkFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversalTokenLinkPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UniversalTokenLinkFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversalTokenLinkPayload>
          }
          findMany: {
            args: Prisma.UniversalTokenLinkFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversalTokenLinkPayload>[]
          }
          create: {
            args: Prisma.UniversalTokenLinkCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversalTokenLinkPayload>
          }
          createMany: {
            args: Prisma.UniversalTokenLinkCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UniversalTokenLinkCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversalTokenLinkPayload>[]
          }
          delete: {
            args: Prisma.UniversalTokenLinkDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversalTokenLinkPayload>
          }
          update: {
            args: Prisma.UniversalTokenLinkUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversalTokenLinkPayload>
          }
          deleteMany: {
            args: Prisma.UniversalTokenLinkDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UniversalTokenLinkUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UniversalTokenLinkUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UniversalTokenLinkPayload>
          }
          aggregate: {
            args: Prisma.UniversalTokenLinkAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUniversalTokenLink>
          }
          groupBy: {
            args: Prisma.UniversalTokenLinkGroupByArgs<ExtArgs>
            result: $Utils.Optional<UniversalTokenLinkGroupByOutputType>[]
          }
          count: {
            args: Prisma.UniversalTokenLinkCountArgs<ExtArgs>
            result: $Utils.Optional<UniversalTokenLinkCountAggregateOutputType> | number
          }
        }
      }
      GithubRepoInfo: {
        payload: Prisma.$GithubRepoInfoPayload<ExtArgs>
        fields: Prisma.GithubRepoInfoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GithubRepoInfoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GithubRepoInfoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GithubRepoInfoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GithubRepoInfoPayload>
          }
          findFirst: {
            args: Prisma.GithubRepoInfoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GithubRepoInfoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GithubRepoInfoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GithubRepoInfoPayload>
          }
          findMany: {
            args: Prisma.GithubRepoInfoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GithubRepoInfoPayload>[]
          }
          create: {
            args: Prisma.GithubRepoInfoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GithubRepoInfoPayload>
          }
          createMany: {
            args: Prisma.GithubRepoInfoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GithubRepoInfoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GithubRepoInfoPayload>[]
          }
          delete: {
            args: Prisma.GithubRepoInfoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GithubRepoInfoPayload>
          }
          update: {
            args: Prisma.GithubRepoInfoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GithubRepoInfoPayload>
          }
          deleteMany: {
            args: Prisma.GithubRepoInfoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GithubRepoInfoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GithubRepoInfoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GithubRepoInfoPayload>
          }
          aggregate: {
            args: Prisma.GithubRepoInfoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGithubRepoInfo>
          }
          groupBy: {
            args: Prisma.GithubRepoInfoGroupByArgs<ExtArgs>
            result: $Utils.Optional<GithubRepoInfoGroupByOutputType>[]
          }
          count: {
            args: Prisma.GithubRepoInfoCountArgs<ExtArgs>
            result: $Utils.Optional<GithubRepoInfoCountAggregateOutputType> | number
          }
        }
      }
      Project: {
        payload: Prisma.$ProjectPayload<ExtArgs>
        fields: Prisma.ProjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findFirst: {
            args: Prisma.ProjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findMany: {
            args: Prisma.ProjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          create: {
            args: Prisma.ProjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          createMany: {
            args: Prisma.ProjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          delete: {
            args: Prisma.ProjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          update: {
            args: Prisma.ProjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          deleteMany: {
            args: Prisma.ProjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          aggregate: {
            args: Prisma.ProjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProject>
          }
          groupBy: {
            args: Prisma.ProjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type TaskEventLogCountOutputType
   */

  export type TaskEventLogCountOutputType = {
    taskEvents: number
  }

  export type TaskEventLogCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    taskEvents?: boolean | TaskEventLogCountOutputTypeCountTaskEventsArgs
  }

  // Custom InputTypes
  /**
   * TaskEventLogCountOutputType without action
   */
  export type TaskEventLogCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEventLogCountOutputType
     */
    select?: TaskEventLogCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TaskEventLogCountOutputType without action
   */
  export type TaskEventLogCountOutputTypeCountTaskEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskEventWhereInput
  }


  /**
   * Count Type TaskCountOutputType
   */

  export type TaskCountOutputType = {
    Comment: number
  }

  export type TaskCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Comment?: boolean | TaskCountOutputTypeCountCommentArgs
  }

  // Custom InputTypes
  /**
   * TaskCountOutputType without action
   */
  export type TaskCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskCountOutputType
     */
    select?: TaskCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TaskCountOutputType without action
   */
  export type TaskCountOutputTypeCountCommentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
  }


  /**
   * Count Type TeamCountOutputType
   */

  export type TeamCountOutputType = {
    Users: number
    Tasks: number
    Project: number
  }

  export type TeamCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Users?: boolean | TeamCountOutputTypeCountUsersArgs
    Tasks?: boolean | TeamCountOutputTypeCountTasksArgs
    Project?: boolean | TeamCountOutputTypeCountProjectArgs
  }

  // Custom InputTypes
  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamCountOutputType
     */
    select?: TeamCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeCountTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
  }

  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeCountProjectArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    Workspaces: number
    Teams: number
    Notification: number
    Comment: number
    Task: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Workspaces?: boolean | UserCountOutputTypeCountWorkspacesArgs
    Teams?: boolean | UserCountOutputTypeCountTeamsArgs
    Notification?: boolean | UserCountOutputTypeCountNotificationArgs
    Comment?: boolean | UserCountOutputTypeCountCommentArgs
    Task?: boolean | UserCountOutputTypeCountTaskArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountWorkspacesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkspaceWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTeamsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountNotificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCommentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTaskArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
  }


  /**
   * Count Type WorkspaceCountOutputType
   */

  export type WorkspaceCountOutputType = {
    teams: number
    projects: number
    Users: number
    User: number
  }

  export type WorkspaceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    teams?: boolean | WorkspaceCountOutputTypeCountTeamsArgs
    projects?: boolean | WorkspaceCountOutputTypeCountProjectsArgs
    Users?: boolean | WorkspaceCountOutputTypeCountUsersArgs
    User?: boolean | WorkspaceCountOutputTypeCountUserArgs
  }

  // Custom InputTypes
  /**
   * WorkspaceCountOutputType without action
   */
  export type WorkspaceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkspaceCountOutputType
     */
    select?: WorkspaceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WorkspaceCountOutputType without action
   */
  export type WorkspaceCountOutputTypeCountTeamsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamWhereInput
  }

  /**
   * WorkspaceCountOutputType without action
   */
  export type WorkspaceCountOutputTypeCountProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
  }

  /**
   * WorkspaceCountOutputType without action
   */
  export type WorkspaceCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * WorkspaceCountOutputType without action
   */
  export type WorkspaceCountOutputTypeCountUserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }


  /**
   * Count Type UniversalTokenLinkCountOutputType
   */

  export type UniversalTokenLinkCountOutputType = {
    Workspace: number
  }

  export type UniversalTokenLinkCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Workspace?: boolean | UniversalTokenLinkCountOutputTypeCountWorkspaceArgs
  }

  // Custom InputTypes
  /**
   * UniversalTokenLinkCountOutputType without action
   */
  export type UniversalTokenLinkCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UniversalTokenLinkCountOutputType
     */
    select?: UniversalTokenLinkCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UniversalTokenLinkCountOutputType without action
   */
  export type UniversalTokenLinkCountOutputTypeCountWorkspaceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkspaceWhereInput
  }


  /**
   * Count Type GithubRepoInfoCountOutputType
   */

  export type GithubRepoInfoCountOutputType = {
    Workspace: number
  }

  export type GithubRepoInfoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Workspace?: boolean | GithubRepoInfoCountOutputTypeCountWorkspaceArgs
  }

  // Custom InputTypes
  /**
   * GithubRepoInfoCountOutputType without action
   */
  export type GithubRepoInfoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GithubRepoInfoCountOutputType
     */
    select?: GithubRepoInfoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GithubRepoInfoCountOutputType without action
   */
  export type GithubRepoInfoCountOutputTypeCountWorkspaceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkspaceWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Commit
   */

  export type AggregateCommit = {
    _count: CommitCountAggregateOutputType | null
    _min: CommitMinAggregateOutputType | null
    _max: CommitMaxAggregateOutputType | null
  }

  export type CommitMinAggregateOutputType = {
    id: string | null
    tree_id: string | null
    distinct: boolean | null
    message: string | null
    timestamp: string | null
    url: string | null
    authorName: string | null
    authorEmail: string | null
    authorUsername: string | null
    committerName: string | null
    committerEmail: string | null
    committerUsername: string | null
    repoName: string | null
    owner: string | null
  }

  export type CommitMaxAggregateOutputType = {
    id: string | null
    tree_id: string | null
    distinct: boolean | null
    message: string | null
    timestamp: string | null
    url: string | null
    authorName: string | null
    authorEmail: string | null
    authorUsername: string | null
    committerName: string | null
    committerEmail: string | null
    committerUsername: string | null
    repoName: string | null
    owner: string | null
  }

  export type CommitCountAggregateOutputType = {
    id: number
    tree_id: number
    distinct: number
    message: number
    timestamp: number
    url: number
    authorName: number
    authorEmail: number
    authorUsername: number
    committerName: number
    committerEmail: number
    committerUsername: number
    added: number
    removed: number
    modified: number
    repoName: number
    owner: number
    _all: number
  }


  export type CommitMinAggregateInputType = {
    id?: true
    tree_id?: true
    distinct?: true
    message?: true
    timestamp?: true
    url?: true
    authorName?: true
    authorEmail?: true
    authorUsername?: true
    committerName?: true
    committerEmail?: true
    committerUsername?: true
    repoName?: true
    owner?: true
  }

  export type CommitMaxAggregateInputType = {
    id?: true
    tree_id?: true
    distinct?: true
    message?: true
    timestamp?: true
    url?: true
    authorName?: true
    authorEmail?: true
    authorUsername?: true
    committerName?: true
    committerEmail?: true
    committerUsername?: true
    repoName?: true
    owner?: true
  }

  export type CommitCountAggregateInputType = {
    id?: true
    tree_id?: true
    distinct?: true
    message?: true
    timestamp?: true
    url?: true
    authorName?: true
    authorEmail?: true
    authorUsername?: true
    committerName?: true
    committerEmail?: true
    committerUsername?: true
    added?: true
    removed?: true
    modified?: true
    repoName?: true
    owner?: true
    _all?: true
  }

  export type CommitAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Commit to aggregate.
     */
    where?: CommitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Commits to fetch.
     */
    orderBy?: CommitOrderByWithRelationInput | CommitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CommitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Commits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Commits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Commits
    **/
    _count?: true | CommitCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CommitMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CommitMaxAggregateInputType
  }

  export type GetCommitAggregateType<T extends CommitAggregateArgs> = {
        [P in keyof T & keyof AggregateCommit]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCommit[P]>
      : GetScalarType<T[P], AggregateCommit[P]>
  }




  export type CommitGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommitWhereInput
    orderBy?: CommitOrderByWithAggregationInput | CommitOrderByWithAggregationInput[]
    by: CommitScalarFieldEnum[] | CommitScalarFieldEnum
    having?: CommitScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CommitCountAggregateInputType | true
    _min?: CommitMinAggregateInputType
    _max?: CommitMaxAggregateInputType
  }

  export type CommitGroupByOutputType = {
    id: string
    tree_id: string | null
    distinct: boolean | null
    message: string
    timestamp: string
    url: string
    authorName: string | null
    authorEmail: string | null
    authorUsername: string | null
    committerName: string | null
    committerEmail: string | null
    committerUsername: string | null
    added: string[]
    removed: string[]
    modified: string[]
    repoName: string | null
    owner: string | null
    _count: CommitCountAggregateOutputType | null
    _min: CommitMinAggregateOutputType | null
    _max: CommitMaxAggregateOutputType | null
  }

  type GetCommitGroupByPayload<T extends CommitGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CommitGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CommitGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommitGroupByOutputType[P]>
            : GetScalarType<T[P], CommitGroupByOutputType[P]>
        }
      >
    >


  export type CommitSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tree_id?: boolean
    distinct?: boolean
    message?: boolean
    timestamp?: boolean
    url?: boolean
    authorName?: boolean
    authorEmail?: boolean
    authorUsername?: boolean
    committerName?: boolean
    committerEmail?: boolean
    committerUsername?: boolean
    added?: boolean
    removed?: boolean
    modified?: boolean
    repoName?: boolean
    owner?: boolean
  }, ExtArgs["result"]["commit"]>

  export type CommitSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tree_id?: boolean
    distinct?: boolean
    message?: boolean
    timestamp?: boolean
    url?: boolean
    authorName?: boolean
    authorEmail?: boolean
    authorUsername?: boolean
    committerName?: boolean
    committerEmail?: boolean
    committerUsername?: boolean
    added?: boolean
    removed?: boolean
    modified?: boolean
    repoName?: boolean
    owner?: boolean
  }, ExtArgs["result"]["commit"]>

  export type CommitSelectScalar = {
    id?: boolean
    tree_id?: boolean
    distinct?: boolean
    message?: boolean
    timestamp?: boolean
    url?: boolean
    authorName?: boolean
    authorEmail?: boolean
    authorUsername?: boolean
    committerName?: boolean
    committerEmail?: boolean
    committerUsername?: boolean
    added?: boolean
    removed?: boolean
    modified?: boolean
    repoName?: boolean
    owner?: boolean
  }


  export type $CommitPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Commit"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tree_id: string | null
      distinct: boolean | null
      message: string
      timestamp: string
      url: string
      authorName: string | null
      authorEmail: string | null
      authorUsername: string | null
      committerName: string | null
      committerEmail: string | null
      committerUsername: string | null
      added: string[]
      removed: string[]
      modified: string[]
      repoName: string | null
      owner: string | null
    }, ExtArgs["result"]["commit"]>
    composites: {}
  }

  type CommitGetPayload<S extends boolean | null | undefined | CommitDefaultArgs> = $Result.GetResult<Prisma.$CommitPayload, S>

  type CommitCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CommitFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CommitCountAggregateInputType | true
    }

  export interface CommitDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Commit'], meta: { name: 'Commit' } }
    /**
     * Find zero or one Commit that matches the filter.
     * @param {CommitFindUniqueArgs} args - Arguments to find a Commit
     * @example
     * // Get one Commit
     * const commit = await prisma.commit.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CommitFindUniqueArgs>(args: SelectSubset<T, CommitFindUniqueArgs<ExtArgs>>): Prisma__CommitClient<$Result.GetResult<Prisma.$CommitPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Commit that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CommitFindUniqueOrThrowArgs} args - Arguments to find a Commit
     * @example
     * // Get one Commit
     * const commit = await prisma.commit.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CommitFindUniqueOrThrowArgs>(args: SelectSubset<T, CommitFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CommitClient<$Result.GetResult<Prisma.$CommitPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Commit that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommitFindFirstArgs} args - Arguments to find a Commit
     * @example
     * // Get one Commit
     * const commit = await prisma.commit.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CommitFindFirstArgs>(args?: SelectSubset<T, CommitFindFirstArgs<ExtArgs>>): Prisma__CommitClient<$Result.GetResult<Prisma.$CommitPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Commit that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommitFindFirstOrThrowArgs} args - Arguments to find a Commit
     * @example
     * // Get one Commit
     * const commit = await prisma.commit.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CommitFindFirstOrThrowArgs>(args?: SelectSubset<T, CommitFindFirstOrThrowArgs<ExtArgs>>): Prisma__CommitClient<$Result.GetResult<Prisma.$CommitPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Commits that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommitFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Commits
     * const commits = await prisma.commit.findMany()
     * 
     * // Get first 10 Commits
     * const commits = await prisma.commit.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const commitWithIdOnly = await prisma.commit.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CommitFindManyArgs>(args?: SelectSubset<T, CommitFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommitPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Commit.
     * @param {CommitCreateArgs} args - Arguments to create a Commit.
     * @example
     * // Create one Commit
     * const Commit = await prisma.commit.create({
     *   data: {
     *     // ... data to create a Commit
     *   }
     * })
     * 
     */
    create<T extends CommitCreateArgs>(args: SelectSubset<T, CommitCreateArgs<ExtArgs>>): Prisma__CommitClient<$Result.GetResult<Prisma.$CommitPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Commits.
     * @param {CommitCreateManyArgs} args - Arguments to create many Commits.
     * @example
     * // Create many Commits
     * const commit = await prisma.commit.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CommitCreateManyArgs>(args?: SelectSubset<T, CommitCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Commits and returns the data saved in the database.
     * @param {CommitCreateManyAndReturnArgs} args - Arguments to create many Commits.
     * @example
     * // Create many Commits
     * const commit = await prisma.commit.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Commits and only return the `id`
     * const commitWithIdOnly = await prisma.commit.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CommitCreateManyAndReturnArgs>(args?: SelectSubset<T, CommitCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommitPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Commit.
     * @param {CommitDeleteArgs} args - Arguments to delete one Commit.
     * @example
     * // Delete one Commit
     * const Commit = await prisma.commit.delete({
     *   where: {
     *     // ... filter to delete one Commit
     *   }
     * })
     * 
     */
    delete<T extends CommitDeleteArgs>(args: SelectSubset<T, CommitDeleteArgs<ExtArgs>>): Prisma__CommitClient<$Result.GetResult<Prisma.$CommitPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Commit.
     * @param {CommitUpdateArgs} args - Arguments to update one Commit.
     * @example
     * // Update one Commit
     * const commit = await prisma.commit.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CommitUpdateArgs>(args: SelectSubset<T, CommitUpdateArgs<ExtArgs>>): Prisma__CommitClient<$Result.GetResult<Prisma.$CommitPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Commits.
     * @param {CommitDeleteManyArgs} args - Arguments to filter Commits to delete.
     * @example
     * // Delete a few Commits
     * const { count } = await prisma.commit.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CommitDeleteManyArgs>(args?: SelectSubset<T, CommitDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Commits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommitUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Commits
     * const commit = await prisma.commit.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CommitUpdateManyArgs>(args: SelectSubset<T, CommitUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Commit.
     * @param {CommitUpsertArgs} args - Arguments to update or create a Commit.
     * @example
     * // Update or create a Commit
     * const commit = await prisma.commit.upsert({
     *   create: {
     *     // ... data to create a Commit
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Commit we want to update
     *   }
     * })
     */
    upsert<T extends CommitUpsertArgs>(args: SelectSubset<T, CommitUpsertArgs<ExtArgs>>): Prisma__CommitClient<$Result.GetResult<Prisma.$CommitPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Commits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommitCountArgs} args - Arguments to filter Commits to count.
     * @example
     * // Count the number of Commits
     * const count = await prisma.commit.count({
     *   where: {
     *     // ... the filter for the Commits we want to count
     *   }
     * })
    **/
    count<T extends CommitCountArgs>(
      args?: Subset<T, CommitCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommitCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Commit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommitAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CommitAggregateArgs>(args: Subset<T, CommitAggregateArgs>): Prisma.PrismaPromise<GetCommitAggregateType<T>>

    /**
     * Group by Commit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommitGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CommitGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CommitGroupByArgs['orderBy'] }
        : { orderBy?: CommitGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CommitGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommitGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Commit model
   */
  readonly fields: CommitFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Commit.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CommitClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Commit model
   */ 
  interface CommitFieldRefs {
    readonly id: FieldRef<"Commit", 'String'>
    readonly tree_id: FieldRef<"Commit", 'String'>
    readonly distinct: FieldRef<"Commit", 'Boolean'>
    readonly message: FieldRef<"Commit", 'String'>
    readonly timestamp: FieldRef<"Commit", 'String'>
    readonly url: FieldRef<"Commit", 'String'>
    readonly authorName: FieldRef<"Commit", 'String'>
    readonly authorEmail: FieldRef<"Commit", 'String'>
    readonly authorUsername: FieldRef<"Commit", 'String'>
    readonly committerName: FieldRef<"Commit", 'String'>
    readonly committerEmail: FieldRef<"Commit", 'String'>
    readonly committerUsername: FieldRef<"Commit", 'String'>
    readonly added: FieldRef<"Commit", 'String[]'>
    readonly removed: FieldRef<"Commit", 'String[]'>
    readonly modified: FieldRef<"Commit", 'String[]'>
    readonly repoName: FieldRef<"Commit", 'String'>
    readonly owner: FieldRef<"Commit", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Commit findUnique
   */
  export type CommitFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commit
     */
    select?: CommitSelect<ExtArgs> | null
    /**
     * Filter, which Commit to fetch.
     */
    where: CommitWhereUniqueInput
  }

  /**
   * Commit findUniqueOrThrow
   */
  export type CommitFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commit
     */
    select?: CommitSelect<ExtArgs> | null
    /**
     * Filter, which Commit to fetch.
     */
    where: CommitWhereUniqueInput
  }

  /**
   * Commit findFirst
   */
  export type CommitFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commit
     */
    select?: CommitSelect<ExtArgs> | null
    /**
     * Filter, which Commit to fetch.
     */
    where?: CommitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Commits to fetch.
     */
    orderBy?: CommitOrderByWithRelationInput | CommitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Commits.
     */
    cursor?: CommitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Commits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Commits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Commits.
     */
    distinct?: CommitScalarFieldEnum | CommitScalarFieldEnum[]
  }

  /**
   * Commit findFirstOrThrow
   */
  export type CommitFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commit
     */
    select?: CommitSelect<ExtArgs> | null
    /**
     * Filter, which Commit to fetch.
     */
    where?: CommitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Commits to fetch.
     */
    orderBy?: CommitOrderByWithRelationInput | CommitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Commits.
     */
    cursor?: CommitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Commits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Commits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Commits.
     */
    distinct?: CommitScalarFieldEnum | CommitScalarFieldEnum[]
  }

  /**
   * Commit findMany
   */
  export type CommitFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commit
     */
    select?: CommitSelect<ExtArgs> | null
    /**
     * Filter, which Commits to fetch.
     */
    where?: CommitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Commits to fetch.
     */
    orderBy?: CommitOrderByWithRelationInput | CommitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Commits.
     */
    cursor?: CommitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Commits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Commits.
     */
    skip?: number
    distinct?: CommitScalarFieldEnum | CommitScalarFieldEnum[]
  }

  /**
   * Commit create
   */
  export type CommitCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commit
     */
    select?: CommitSelect<ExtArgs> | null
    /**
     * The data needed to create a Commit.
     */
    data: XOR<CommitCreateInput, CommitUncheckedCreateInput>
  }

  /**
   * Commit createMany
   */
  export type CommitCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Commits.
     */
    data: CommitCreateManyInput | CommitCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Commit createManyAndReturn
   */
  export type CommitCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commit
     */
    select?: CommitSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Commits.
     */
    data: CommitCreateManyInput | CommitCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Commit update
   */
  export type CommitUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commit
     */
    select?: CommitSelect<ExtArgs> | null
    /**
     * The data needed to update a Commit.
     */
    data: XOR<CommitUpdateInput, CommitUncheckedUpdateInput>
    /**
     * Choose, which Commit to update.
     */
    where: CommitWhereUniqueInput
  }

  /**
   * Commit updateMany
   */
  export type CommitUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Commits.
     */
    data: XOR<CommitUpdateManyMutationInput, CommitUncheckedUpdateManyInput>
    /**
     * Filter which Commits to update
     */
    where?: CommitWhereInput
  }

  /**
   * Commit upsert
   */
  export type CommitUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commit
     */
    select?: CommitSelect<ExtArgs> | null
    /**
     * The filter to search for the Commit to update in case it exists.
     */
    where: CommitWhereUniqueInput
    /**
     * In case the Commit found by the `where` argument doesn't exist, create a new Commit with this data.
     */
    create: XOR<CommitCreateInput, CommitUncheckedCreateInput>
    /**
     * In case the Commit was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CommitUpdateInput, CommitUncheckedUpdateInput>
  }

  /**
   * Commit delete
   */
  export type CommitDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commit
     */
    select?: CommitSelect<ExtArgs> | null
    /**
     * Filter which Commit to delete.
     */
    where: CommitWhereUniqueInput
  }

  /**
   * Commit deleteMany
   */
  export type CommitDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Commits to delete
     */
    where?: CommitWhereInput
  }

  /**
   * Commit without action
   */
  export type CommitDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Commit
     */
    select?: CommitSelect<ExtArgs> | null
  }


  /**
   * Model TaskEventLog
   */

  export type AggregateTaskEventLog = {
    _count: TaskEventLogCountAggregateOutputType | null
    _min: TaskEventLogMinAggregateOutputType | null
    _max: TaskEventLogMaxAggregateOutputType | null
  }

  export type TaskEventLogMinAggregateOutputType = {
    id: string | null
    authorId: string | null
    authorName: string | null
    createdAt: Date | null
    taskId: string | null
  }

  export type TaskEventLogMaxAggregateOutputType = {
    id: string | null
    authorId: string | null
    authorName: string | null
    createdAt: Date | null
    taskId: string | null
  }

  export type TaskEventLogCountAggregateOutputType = {
    id: number
    authorId: number
    authorName: number
    createdAt: number
    taskId: number
    _all: number
  }


  export type TaskEventLogMinAggregateInputType = {
    id?: true
    authorId?: true
    authorName?: true
    createdAt?: true
    taskId?: true
  }

  export type TaskEventLogMaxAggregateInputType = {
    id?: true
    authorId?: true
    authorName?: true
    createdAt?: true
    taskId?: true
  }

  export type TaskEventLogCountAggregateInputType = {
    id?: true
    authorId?: true
    authorName?: true
    createdAt?: true
    taskId?: true
    _all?: true
  }

  export type TaskEventLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TaskEventLog to aggregate.
     */
    where?: TaskEventLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskEventLogs to fetch.
     */
    orderBy?: TaskEventLogOrderByWithRelationInput | TaskEventLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TaskEventLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskEventLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskEventLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TaskEventLogs
    **/
    _count?: true | TaskEventLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TaskEventLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TaskEventLogMaxAggregateInputType
  }

  export type GetTaskEventLogAggregateType<T extends TaskEventLogAggregateArgs> = {
        [P in keyof T & keyof AggregateTaskEventLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTaskEventLog[P]>
      : GetScalarType<T[P], AggregateTaskEventLog[P]>
  }




  export type TaskEventLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskEventLogWhereInput
    orderBy?: TaskEventLogOrderByWithAggregationInput | TaskEventLogOrderByWithAggregationInput[]
    by: TaskEventLogScalarFieldEnum[] | TaskEventLogScalarFieldEnum
    having?: TaskEventLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TaskEventLogCountAggregateInputType | true
    _min?: TaskEventLogMinAggregateInputType
    _max?: TaskEventLogMaxAggregateInputType
  }

  export type TaskEventLogGroupByOutputType = {
    id: string
    authorId: string
    authorName: string
    createdAt: Date
    taskId: string
    _count: TaskEventLogCountAggregateOutputType | null
    _min: TaskEventLogMinAggregateOutputType | null
    _max: TaskEventLogMaxAggregateOutputType | null
  }

  type GetTaskEventLogGroupByPayload<T extends TaskEventLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TaskEventLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TaskEventLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TaskEventLogGroupByOutputType[P]>
            : GetScalarType<T[P], TaskEventLogGroupByOutputType[P]>
        }
      >
    >


  export type TaskEventLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authorId?: boolean
    authorName?: boolean
    createdAt?: boolean
    taskId?: boolean
    taskEvents?: boolean | TaskEventLog$taskEventsArgs<ExtArgs>
    _count?: boolean | TaskEventLogCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["taskEventLog"]>

  export type TaskEventLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authorId?: boolean
    authorName?: boolean
    createdAt?: boolean
    taskId?: boolean
  }, ExtArgs["result"]["taskEventLog"]>

  export type TaskEventLogSelectScalar = {
    id?: boolean
    authorId?: boolean
    authorName?: boolean
    createdAt?: boolean
    taskId?: boolean
  }

  export type TaskEventLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    taskEvents?: boolean | TaskEventLog$taskEventsArgs<ExtArgs>
    _count?: boolean | TaskEventLogCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TaskEventLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TaskEventLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TaskEventLog"
    objects: {
      taskEvents: Prisma.$TaskEventPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      authorId: string
      authorName: string
      createdAt: Date
      taskId: string
    }, ExtArgs["result"]["taskEventLog"]>
    composites: {}
  }

  type TaskEventLogGetPayload<S extends boolean | null | undefined | TaskEventLogDefaultArgs> = $Result.GetResult<Prisma.$TaskEventLogPayload, S>

  type TaskEventLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TaskEventLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TaskEventLogCountAggregateInputType | true
    }

  export interface TaskEventLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TaskEventLog'], meta: { name: 'TaskEventLog' } }
    /**
     * Find zero or one TaskEventLog that matches the filter.
     * @param {TaskEventLogFindUniqueArgs} args - Arguments to find a TaskEventLog
     * @example
     * // Get one TaskEventLog
     * const taskEventLog = await prisma.taskEventLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TaskEventLogFindUniqueArgs>(args: SelectSubset<T, TaskEventLogFindUniqueArgs<ExtArgs>>): Prisma__TaskEventLogClient<$Result.GetResult<Prisma.$TaskEventLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TaskEventLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TaskEventLogFindUniqueOrThrowArgs} args - Arguments to find a TaskEventLog
     * @example
     * // Get one TaskEventLog
     * const taskEventLog = await prisma.taskEventLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TaskEventLogFindUniqueOrThrowArgs>(args: SelectSubset<T, TaskEventLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TaskEventLogClient<$Result.GetResult<Prisma.$TaskEventLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TaskEventLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskEventLogFindFirstArgs} args - Arguments to find a TaskEventLog
     * @example
     * // Get one TaskEventLog
     * const taskEventLog = await prisma.taskEventLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TaskEventLogFindFirstArgs>(args?: SelectSubset<T, TaskEventLogFindFirstArgs<ExtArgs>>): Prisma__TaskEventLogClient<$Result.GetResult<Prisma.$TaskEventLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TaskEventLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskEventLogFindFirstOrThrowArgs} args - Arguments to find a TaskEventLog
     * @example
     * // Get one TaskEventLog
     * const taskEventLog = await prisma.taskEventLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TaskEventLogFindFirstOrThrowArgs>(args?: SelectSubset<T, TaskEventLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__TaskEventLogClient<$Result.GetResult<Prisma.$TaskEventLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TaskEventLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskEventLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TaskEventLogs
     * const taskEventLogs = await prisma.taskEventLog.findMany()
     * 
     * // Get first 10 TaskEventLogs
     * const taskEventLogs = await prisma.taskEventLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const taskEventLogWithIdOnly = await prisma.taskEventLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TaskEventLogFindManyArgs>(args?: SelectSubset<T, TaskEventLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskEventLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TaskEventLog.
     * @param {TaskEventLogCreateArgs} args - Arguments to create a TaskEventLog.
     * @example
     * // Create one TaskEventLog
     * const TaskEventLog = await prisma.taskEventLog.create({
     *   data: {
     *     // ... data to create a TaskEventLog
     *   }
     * })
     * 
     */
    create<T extends TaskEventLogCreateArgs>(args: SelectSubset<T, TaskEventLogCreateArgs<ExtArgs>>): Prisma__TaskEventLogClient<$Result.GetResult<Prisma.$TaskEventLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TaskEventLogs.
     * @param {TaskEventLogCreateManyArgs} args - Arguments to create many TaskEventLogs.
     * @example
     * // Create many TaskEventLogs
     * const taskEventLog = await prisma.taskEventLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TaskEventLogCreateManyArgs>(args?: SelectSubset<T, TaskEventLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TaskEventLogs and returns the data saved in the database.
     * @param {TaskEventLogCreateManyAndReturnArgs} args - Arguments to create many TaskEventLogs.
     * @example
     * // Create many TaskEventLogs
     * const taskEventLog = await prisma.taskEventLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TaskEventLogs and only return the `id`
     * const taskEventLogWithIdOnly = await prisma.taskEventLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TaskEventLogCreateManyAndReturnArgs>(args?: SelectSubset<T, TaskEventLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskEventLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TaskEventLog.
     * @param {TaskEventLogDeleteArgs} args - Arguments to delete one TaskEventLog.
     * @example
     * // Delete one TaskEventLog
     * const TaskEventLog = await prisma.taskEventLog.delete({
     *   where: {
     *     // ... filter to delete one TaskEventLog
     *   }
     * })
     * 
     */
    delete<T extends TaskEventLogDeleteArgs>(args: SelectSubset<T, TaskEventLogDeleteArgs<ExtArgs>>): Prisma__TaskEventLogClient<$Result.GetResult<Prisma.$TaskEventLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TaskEventLog.
     * @param {TaskEventLogUpdateArgs} args - Arguments to update one TaskEventLog.
     * @example
     * // Update one TaskEventLog
     * const taskEventLog = await prisma.taskEventLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TaskEventLogUpdateArgs>(args: SelectSubset<T, TaskEventLogUpdateArgs<ExtArgs>>): Prisma__TaskEventLogClient<$Result.GetResult<Prisma.$TaskEventLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TaskEventLogs.
     * @param {TaskEventLogDeleteManyArgs} args - Arguments to filter TaskEventLogs to delete.
     * @example
     * // Delete a few TaskEventLogs
     * const { count } = await prisma.taskEventLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TaskEventLogDeleteManyArgs>(args?: SelectSubset<T, TaskEventLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TaskEventLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskEventLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TaskEventLogs
     * const taskEventLog = await prisma.taskEventLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TaskEventLogUpdateManyArgs>(args: SelectSubset<T, TaskEventLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TaskEventLog.
     * @param {TaskEventLogUpsertArgs} args - Arguments to update or create a TaskEventLog.
     * @example
     * // Update or create a TaskEventLog
     * const taskEventLog = await prisma.taskEventLog.upsert({
     *   create: {
     *     // ... data to create a TaskEventLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TaskEventLog we want to update
     *   }
     * })
     */
    upsert<T extends TaskEventLogUpsertArgs>(args: SelectSubset<T, TaskEventLogUpsertArgs<ExtArgs>>): Prisma__TaskEventLogClient<$Result.GetResult<Prisma.$TaskEventLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TaskEventLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskEventLogCountArgs} args - Arguments to filter TaskEventLogs to count.
     * @example
     * // Count the number of TaskEventLogs
     * const count = await prisma.taskEventLog.count({
     *   where: {
     *     // ... the filter for the TaskEventLogs we want to count
     *   }
     * })
    **/
    count<T extends TaskEventLogCountArgs>(
      args?: Subset<T, TaskEventLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TaskEventLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TaskEventLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskEventLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TaskEventLogAggregateArgs>(args: Subset<T, TaskEventLogAggregateArgs>): Prisma.PrismaPromise<GetTaskEventLogAggregateType<T>>

    /**
     * Group by TaskEventLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskEventLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TaskEventLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TaskEventLogGroupByArgs['orderBy'] }
        : { orderBy?: TaskEventLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TaskEventLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskEventLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TaskEventLog model
   */
  readonly fields: TaskEventLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TaskEventLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TaskEventLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    taskEvents<T extends TaskEventLog$taskEventsArgs<ExtArgs> = {}>(args?: Subset<T, TaskEventLog$taskEventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskEventPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TaskEventLog model
   */ 
  interface TaskEventLogFieldRefs {
    readonly id: FieldRef<"TaskEventLog", 'String'>
    readonly authorId: FieldRef<"TaskEventLog", 'String'>
    readonly authorName: FieldRef<"TaskEventLog", 'String'>
    readonly createdAt: FieldRef<"TaskEventLog", 'DateTime'>
    readonly taskId: FieldRef<"TaskEventLog", 'String'>
  }
    

  // Custom InputTypes
  /**
   * TaskEventLog findUnique
   */
  export type TaskEventLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEventLog
     */
    select?: TaskEventLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventLogInclude<ExtArgs> | null
    /**
     * Filter, which TaskEventLog to fetch.
     */
    where: TaskEventLogWhereUniqueInput
  }

  /**
   * TaskEventLog findUniqueOrThrow
   */
  export type TaskEventLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEventLog
     */
    select?: TaskEventLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventLogInclude<ExtArgs> | null
    /**
     * Filter, which TaskEventLog to fetch.
     */
    where: TaskEventLogWhereUniqueInput
  }

  /**
   * TaskEventLog findFirst
   */
  export type TaskEventLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEventLog
     */
    select?: TaskEventLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventLogInclude<ExtArgs> | null
    /**
     * Filter, which TaskEventLog to fetch.
     */
    where?: TaskEventLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskEventLogs to fetch.
     */
    orderBy?: TaskEventLogOrderByWithRelationInput | TaskEventLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TaskEventLogs.
     */
    cursor?: TaskEventLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskEventLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskEventLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TaskEventLogs.
     */
    distinct?: TaskEventLogScalarFieldEnum | TaskEventLogScalarFieldEnum[]
  }

  /**
   * TaskEventLog findFirstOrThrow
   */
  export type TaskEventLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEventLog
     */
    select?: TaskEventLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventLogInclude<ExtArgs> | null
    /**
     * Filter, which TaskEventLog to fetch.
     */
    where?: TaskEventLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskEventLogs to fetch.
     */
    orderBy?: TaskEventLogOrderByWithRelationInput | TaskEventLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TaskEventLogs.
     */
    cursor?: TaskEventLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskEventLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskEventLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TaskEventLogs.
     */
    distinct?: TaskEventLogScalarFieldEnum | TaskEventLogScalarFieldEnum[]
  }

  /**
   * TaskEventLog findMany
   */
  export type TaskEventLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEventLog
     */
    select?: TaskEventLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventLogInclude<ExtArgs> | null
    /**
     * Filter, which TaskEventLogs to fetch.
     */
    where?: TaskEventLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskEventLogs to fetch.
     */
    orderBy?: TaskEventLogOrderByWithRelationInput | TaskEventLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TaskEventLogs.
     */
    cursor?: TaskEventLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskEventLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskEventLogs.
     */
    skip?: number
    distinct?: TaskEventLogScalarFieldEnum | TaskEventLogScalarFieldEnum[]
  }

  /**
   * TaskEventLog create
   */
  export type TaskEventLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEventLog
     */
    select?: TaskEventLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventLogInclude<ExtArgs> | null
    /**
     * The data needed to create a TaskEventLog.
     */
    data: XOR<TaskEventLogCreateInput, TaskEventLogUncheckedCreateInput>
  }

  /**
   * TaskEventLog createMany
   */
  export type TaskEventLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TaskEventLogs.
     */
    data: TaskEventLogCreateManyInput | TaskEventLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TaskEventLog createManyAndReturn
   */
  export type TaskEventLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEventLog
     */
    select?: TaskEventLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TaskEventLogs.
     */
    data: TaskEventLogCreateManyInput | TaskEventLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TaskEventLog update
   */
  export type TaskEventLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEventLog
     */
    select?: TaskEventLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventLogInclude<ExtArgs> | null
    /**
     * The data needed to update a TaskEventLog.
     */
    data: XOR<TaskEventLogUpdateInput, TaskEventLogUncheckedUpdateInput>
    /**
     * Choose, which TaskEventLog to update.
     */
    where: TaskEventLogWhereUniqueInput
  }

  /**
   * TaskEventLog updateMany
   */
  export type TaskEventLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TaskEventLogs.
     */
    data: XOR<TaskEventLogUpdateManyMutationInput, TaskEventLogUncheckedUpdateManyInput>
    /**
     * Filter which TaskEventLogs to update
     */
    where?: TaskEventLogWhereInput
  }

  /**
   * TaskEventLog upsert
   */
  export type TaskEventLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEventLog
     */
    select?: TaskEventLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventLogInclude<ExtArgs> | null
    /**
     * The filter to search for the TaskEventLog to update in case it exists.
     */
    where: TaskEventLogWhereUniqueInput
    /**
     * In case the TaskEventLog found by the `where` argument doesn't exist, create a new TaskEventLog with this data.
     */
    create: XOR<TaskEventLogCreateInput, TaskEventLogUncheckedCreateInput>
    /**
     * In case the TaskEventLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TaskEventLogUpdateInput, TaskEventLogUncheckedUpdateInput>
  }

  /**
   * TaskEventLog delete
   */
  export type TaskEventLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEventLog
     */
    select?: TaskEventLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventLogInclude<ExtArgs> | null
    /**
     * Filter which TaskEventLog to delete.
     */
    where: TaskEventLogWhereUniqueInput
  }

  /**
   * TaskEventLog deleteMany
   */
  export type TaskEventLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TaskEventLogs to delete
     */
    where?: TaskEventLogWhereInput
  }

  /**
   * TaskEventLog.taskEvents
   */
  export type TaskEventLog$taskEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEvent
     */
    select?: TaskEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventInclude<ExtArgs> | null
    where?: TaskEventWhereInput
    orderBy?: TaskEventOrderByWithRelationInput | TaskEventOrderByWithRelationInput[]
    cursor?: TaskEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskEventScalarFieldEnum | TaskEventScalarFieldEnum[]
  }

  /**
   * TaskEventLog without action
   */
  export type TaskEventLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEventLog
     */
    select?: TaskEventLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventLogInclude<ExtArgs> | null
  }


  /**
   * Model TaskEvent
   */

  export type AggregateTaskEvent = {
    _count: TaskEventCountAggregateOutputType | null
    _min: TaskEventMinAggregateOutputType | null
    _max: TaskEventMaxAggregateOutputType | null
  }

  export type TaskEventMinAggregateOutputType = {
    id: string | null
    type: string | null
    authorId: string | null
    authorName: string | null
    taskId: string | null
    updatedAt: Date | null
    originalValue: string | null
    updatedValue: string | null
    originalAssigneeId: string | null
    originalAssigneeName: string | null
    updatedAssigneeId: string | null
    updatedAssigneeName: string | null
  }

  export type TaskEventMaxAggregateOutputType = {
    id: string | null
    type: string | null
    authorId: string | null
    authorName: string | null
    taskId: string | null
    updatedAt: Date | null
    originalValue: string | null
    updatedValue: string | null
    originalAssigneeId: string | null
    originalAssigneeName: string | null
    updatedAssigneeId: string | null
    updatedAssigneeName: string | null
  }

  export type TaskEventCountAggregateOutputType = {
    id: number
    type: number
    authorId: number
    authorName: number
    taskId: number
    updatedAt: number
    originalLabels: number
    updatedLabels: number
    originalValue: number
    updatedValue: number
    originalAssigneeId: number
    originalAssigneeName: number
    updatedAssigneeId: number
    updatedAssigneeName: number
    _all: number
  }


  export type TaskEventMinAggregateInputType = {
    id?: true
    type?: true
    authorId?: true
    authorName?: true
    taskId?: true
    updatedAt?: true
    originalValue?: true
    updatedValue?: true
    originalAssigneeId?: true
    originalAssigneeName?: true
    updatedAssigneeId?: true
    updatedAssigneeName?: true
  }

  export type TaskEventMaxAggregateInputType = {
    id?: true
    type?: true
    authorId?: true
    authorName?: true
    taskId?: true
    updatedAt?: true
    originalValue?: true
    updatedValue?: true
    originalAssigneeId?: true
    originalAssigneeName?: true
    updatedAssigneeId?: true
    updatedAssigneeName?: true
  }

  export type TaskEventCountAggregateInputType = {
    id?: true
    type?: true
    authorId?: true
    authorName?: true
    taskId?: true
    updatedAt?: true
    originalLabels?: true
    updatedLabels?: true
    originalValue?: true
    updatedValue?: true
    originalAssigneeId?: true
    originalAssigneeName?: true
    updatedAssigneeId?: true
    updatedAssigneeName?: true
    _all?: true
  }

  export type TaskEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TaskEvent to aggregate.
     */
    where?: TaskEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskEvents to fetch.
     */
    orderBy?: TaskEventOrderByWithRelationInput | TaskEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TaskEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TaskEvents
    **/
    _count?: true | TaskEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TaskEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TaskEventMaxAggregateInputType
  }

  export type GetTaskEventAggregateType<T extends TaskEventAggregateArgs> = {
        [P in keyof T & keyof AggregateTaskEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTaskEvent[P]>
      : GetScalarType<T[P], AggregateTaskEvent[P]>
  }




  export type TaskEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskEventWhereInput
    orderBy?: TaskEventOrderByWithAggregationInput | TaskEventOrderByWithAggregationInput[]
    by: TaskEventScalarFieldEnum[] | TaskEventScalarFieldEnum
    having?: TaskEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TaskEventCountAggregateInputType | true
    _min?: TaskEventMinAggregateInputType
    _max?: TaskEventMaxAggregateInputType
  }

  export type TaskEventGroupByOutputType = {
    id: string
    type: string
    authorId: string
    authorName: string
    taskId: string
    updatedAt: Date
    originalLabels: $Enums.Label[]
    updatedLabels: $Enums.Label[]
    originalValue: string | null
    updatedValue: string | null
    originalAssigneeId: string | null
    originalAssigneeName: string | null
    updatedAssigneeId: string | null
    updatedAssigneeName: string | null
    _count: TaskEventCountAggregateOutputType | null
    _min: TaskEventMinAggregateOutputType | null
    _max: TaskEventMaxAggregateOutputType | null
  }

  type GetTaskEventGroupByPayload<T extends TaskEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TaskEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TaskEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TaskEventGroupByOutputType[P]>
            : GetScalarType<T[P], TaskEventGroupByOutputType[P]>
        }
      >
    >


  export type TaskEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    authorId?: boolean
    authorName?: boolean
    taskId?: boolean
    updatedAt?: boolean
    originalLabels?: boolean
    updatedLabels?: boolean
    originalValue?: boolean
    updatedValue?: boolean
    originalAssigneeId?: boolean
    originalAssigneeName?: boolean
    updatedAssigneeId?: boolean
    updatedAssigneeName?: boolean
    taskEventLog?: boolean | TaskEventLogDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["taskEvent"]>

  export type TaskEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    authorId?: boolean
    authorName?: boolean
    taskId?: boolean
    updatedAt?: boolean
    originalLabels?: boolean
    updatedLabels?: boolean
    originalValue?: boolean
    updatedValue?: boolean
    originalAssigneeId?: boolean
    originalAssigneeName?: boolean
    updatedAssigneeId?: boolean
    updatedAssigneeName?: boolean
    taskEventLog?: boolean | TaskEventLogDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["taskEvent"]>

  export type TaskEventSelectScalar = {
    id?: boolean
    type?: boolean
    authorId?: boolean
    authorName?: boolean
    taskId?: boolean
    updatedAt?: boolean
    originalLabels?: boolean
    updatedLabels?: boolean
    originalValue?: boolean
    updatedValue?: boolean
    originalAssigneeId?: boolean
    originalAssigneeName?: boolean
    updatedAssigneeId?: boolean
    updatedAssigneeName?: boolean
  }

  export type TaskEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    taskEventLog?: boolean | TaskEventLogDefaultArgs<ExtArgs>
  }
  export type TaskEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    taskEventLog?: boolean | TaskEventLogDefaultArgs<ExtArgs>
  }

  export type $TaskEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TaskEvent"
    objects: {
      taskEventLog: Prisma.$TaskEventLogPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: string
      authorId: string
      authorName: string
      taskId: string
      updatedAt: Date
      originalLabels: $Enums.Label[]
      updatedLabels: $Enums.Label[]
      originalValue: string | null
      updatedValue: string | null
      originalAssigneeId: string | null
      originalAssigneeName: string | null
      updatedAssigneeId: string | null
      updatedAssigneeName: string | null
    }, ExtArgs["result"]["taskEvent"]>
    composites: {}
  }

  type TaskEventGetPayload<S extends boolean | null | undefined | TaskEventDefaultArgs> = $Result.GetResult<Prisma.$TaskEventPayload, S>

  type TaskEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TaskEventFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TaskEventCountAggregateInputType | true
    }

  export interface TaskEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TaskEvent'], meta: { name: 'TaskEvent' } }
    /**
     * Find zero or one TaskEvent that matches the filter.
     * @param {TaskEventFindUniqueArgs} args - Arguments to find a TaskEvent
     * @example
     * // Get one TaskEvent
     * const taskEvent = await prisma.taskEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TaskEventFindUniqueArgs>(args: SelectSubset<T, TaskEventFindUniqueArgs<ExtArgs>>): Prisma__TaskEventClient<$Result.GetResult<Prisma.$TaskEventPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TaskEvent that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TaskEventFindUniqueOrThrowArgs} args - Arguments to find a TaskEvent
     * @example
     * // Get one TaskEvent
     * const taskEvent = await prisma.taskEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TaskEventFindUniqueOrThrowArgs>(args: SelectSubset<T, TaskEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TaskEventClient<$Result.GetResult<Prisma.$TaskEventPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TaskEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskEventFindFirstArgs} args - Arguments to find a TaskEvent
     * @example
     * // Get one TaskEvent
     * const taskEvent = await prisma.taskEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TaskEventFindFirstArgs>(args?: SelectSubset<T, TaskEventFindFirstArgs<ExtArgs>>): Prisma__TaskEventClient<$Result.GetResult<Prisma.$TaskEventPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TaskEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskEventFindFirstOrThrowArgs} args - Arguments to find a TaskEvent
     * @example
     * // Get one TaskEvent
     * const taskEvent = await prisma.taskEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TaskEventFindFirstOrThrowArgs>(args?: SelectSubset<T, TaskEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__TaskEventClient<$Result.GetResult<Prisma.$TaskEventPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TaskEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TaskEvents
     * const taskEvents = await prisma.taskEvent.findMany()
     * 
     * // Get first 10 TaskEvents
     * const taskEvents = await prisma.taskEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const taskEventWithIdOnly = await prisma.taskEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TaskEventFindManyArgs>(args?: SelectSubset<T, TaskEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskEventPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TaskEvent.
     * @param {TaskEventCreateArgs} args - Arguments to create a TaskEvent.
     * @example
     * // Create one TaskEvent
     * const TaskEvent = await prisma.taskEvent.create({
     *   data: {
     *     // ... data to create a TaskEvent
     *   }
     * })
     * 
     */
    create<T extends TaskEventCreateArgs>(args: SelectSubset<T, TaskEventCreateArgs<ExtArgs>>): Prisma__TaskEventClient<$Result.GetResult<Prisma.$TaskEventPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TaskEvents.
     * @param {TaskEventCreateManyArgs} args - Arguments to create many TaskEvents.
     * @example
     * // Create many TaskEvents
     * const taskEvent = await prisma.taskEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TaskEventCreateManyArgs>(args?: SelectSubset<T, TaskEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TaskEvents and returns the data saved in the database.
     * @param {TaskEventCreateManyAndReturnArgs} args - Arguments to create many TaskEvents.
     * @example
     * // Create many TaskEvents
     * const taskEvent = await prisma.taskEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TaskEvents and only return the `id`
     * const taskEventWithIdOnly = await prisma.taskEvent.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TaskEventCreateManyAndReturnArgs>(args?: SelectSubset<T, TaskEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskEventPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TaskEvent.
     * @param {TaskEventDeleteArgs} args - Arguments to delete one TaskEvent.
     * @example
     * // Delete one TaskEvent
     * const TaskEvent = await prisma.taskEvent.delete({
     *   where: {
     *     // ... filter to delete one TaskEvent
     *   }
     * })
     * 
     */
    delete<T extends TaskEventDeleteArgs>(args: SelectSubset<T, TaskEventDeleteArgs<ExtArgs>>): Prisma__TaskEventClient<$Result.GetResult<Prisma.$TaskEventPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TaskEvent.
     * @param {TaskEventUpdateArgs} args - Arguments to update one TaskEvent.
     * @example
     * // Update one TaskEvent
     * const taskEvent = await prisma.taskEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TaskEventUpdateArgs>(args: SelectSubset<T, TaskEventUpdateArgs<ExtArgs>>): Prisma__TaskEventClient<$Result.GetResult<Prisma.$TaskEventPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TaskEvents.
     * @param {TaskEventDeleteManyArgs} args - Arguments to filter TaskEvents to delete.
     * @example
     * // Delete a few TaskEvents
     * const { count } = await prisma.taskEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TaskEventDeleteManyArgs>(args?: SelectSubset<T, TaskEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TaskEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TaskEvents
     * const taskEvent = await prisma.taskEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TaskEventUpdateManyArgs>(args: SelectSubset<T, TaskEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TaskEvent.
     * @param {TaskEventUpsertArgs} args - Arguments to update or create a TaskEvent.
     * @example
     * // Update or create a TaskEvent
     * const taskEvent = await prisma.taskEvent.upsert({
     *   create: {
     *     // ... data to create a TaskEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TaskEvent we want to update
     *   }
     * })
     */
    upsert<T extends TaskEventUpsertArgs>(args: SelectSubset<T, TaskEventUpsertArgs<ExtArgs>>): Prisma__TaskEventClient<$Result.GetResult<Prisma.$TaskEventPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TaskEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskEventCountArgs} args - Arguments to filter TaskEvents to count.
     * @example
     * // Count the number of TaskEvents
     * const count = await prisma.taskEvent.count({
     *   where: {
     *     // ... the filter for the TaskEvents we want to count
     *   }
     * })
    **/
    count<T extends TaskEventCountArgs>(
      args?: Subset<T, TaskEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TaskEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TaskEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TaskEventAggregateArgs>(args: Subset<T, TaskEventAggregateArgs>): Prisma.PrismaPromise<GetTaskEventAggregateType<T>>

    /**
     * Group by TaskEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TaskEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TaskEventGroupByArgs['orderBy'] }
        : { orderBy?: TaskEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TaskEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TaskEvent model
   */
  readonly fields: TaskEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TaskEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TaskEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    taskEventLog<T extends TaskEventLogDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TaskEventLogDefaultArgs<ExtArgs>>): Prisma__TaskEventLogClient<$Result.GetResult<Prisma.$TaskEventLogPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TaskEvent model
   */ 
  interface TaskEventFieldRefs {
    readonly id: FieldRef<"TaskEvent", 'String'>
    readonly type: FieldRef<"TaskEvent", 'String'>
    readonly authorId: FieldRef<"TaskEvent", 'String'>
    readonly authorName: FieldRef<"TaskEvent", 'String'>
    readonly taskId: FieldRef<"TaskEvent", 'String'>
    readonly updatedAt: FieldRef<"TaskEvent", 'DateTime'>
    readonly originalLabels: FieldRef<"TaskEvent", 'Label[]'>
    readonly updatedLabels: FieldRef<"TaskEvent", 'Label[]'>
    readonly originalValue: FieldRef<"TaskEvent", 'String'>
    readonly updatedValue: FieldRef<"TaskEvent", 'String'>
    readonly originalAssigneeId: FieldRef<"TaskEvent", 'String'>
    readonly originalAssigneeName: FieldRef<"TaskEvent", 'String'>
    readonly updatedAssigneeId: FieldRef<"TaskEvent", 'String'>
    readonly updatedAssigneeName: FieldRef<"TaskEvent", 'String'>
  }
    

  // Custom InputTypes
  /**
   * TaskEvent findUnique
   */
  export type TaskEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEvent
     */
    select?: TaskEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventInclude<ExtArgs> | null
    /**
     * Filter, which TaskEvent to fetch.
     */
    where: TaskEventWhereUniqueInput
  }

  /**
   * TaskEvent findUniqueOrThrow
   */
  export type TaskEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEvent
     */
    select?: TaskEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventInclude<ExtArgs> | null
    /**
     * Filter, which TaskEvent to fetch.
     */
    where: TaskEventWhereUniqueInput
  }

  /**
   * TaskEvent findFirst
   */
  export type TaskEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEvent
     */
    select?: TaskEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventInclude<ExtArgs> | null
    /**
     * Filter, which TaskEvent to fetch.
     */
    where?: TaskEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskEvents to fetch.
     */
    orderBy?: TaskEventOrderByWithRelationInput | TaskEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TaskEvents.
     */
    cursor?: TaskEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TaskEvents.
     */
    distinct?: TaskEventScalarFieldEnum | TaskEventScalarFieldEnum[]
  }

  /**
   * TaskEvent findFirstOrThrow
   */
  export type TaskEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEvent
     */
    select?: TaskEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventInclude<ExtArgs> | null
    /**
     * Filter, which TaskEvent to fetch.
     */
    where?: TaskEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskEvents to fetch.
     */
    orderBy?: TaskEventOrderByWithRelationInput | TaskEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TaskEvents.
     */
    cursor?: TaskEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TaskEvents.
     */
    distinct?: TaskEventScalarFieldEnum | TaskEventScalarFieldEnum[]
  }

  /**
   * TaskEvent findMany
   */
  export type TaskEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEvent
     */
    select?: TaskEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventInclude<ExtArgs> | null
    /**
     * Filter, which TaskEvents to fetch.
     */
    where?: TaskEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaskEvents to fetch.
     */
    orderBy?: TaskEventOrderByWithRelationInput | TaskEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TaskEvents.
     */
    cursor?: TaskEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaskEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaskEvents.
     */
    skip?: number
    distinct?: TaskEventScalarFieldEnum | TaskEventScalarFieldEnum[]
  }

  /**
   * TaskEvent create
   */
  export type TaskEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEvent
     */
    select?: TaskEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventInclude<ExtArgs> | null
    /**
     * The data needed to create a TaskEvent.
     */
    data: XOR<TaskEventCreateInput, TaskEventUncheckedCreateInput>
  }

  /**
   * TaskEvent createMany
   */
  export type TaskEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TaskEvents.
     */
    data: TaskEventCreateManyInput | TaskEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TaskEvent createManyAndReturn
   */
  export type TaskEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEvent
     */
    select?: TaskEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TaskEvents.
     */
    data: TaskEventCreateManyInput | TaskEventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TaskEvent update
   */
  export type TaskEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEvent
     */
    select?: TaskEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventInclude<ExtArgs> | null
    /**
     * The data needed to update a TaskEvent.
     */
    data: XOR<TaskEventUpdateInput, TaskEventUncheckedUpdateInput>
    /**
     * Choose, which TaskEvent to update.
     */
    where: TaskEventWhereUniqueInput
  }

  /**
   * TaskEvent updateMany
   */
  export type TaskEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TaskEvents.
     */
    data: XOR<TaskEventUpdateManyMutationInput, TaskEventUncheckedUpdateManyInput>
    /**
     * Filter which TaskEvents to update
     */
    where?: TaskEventWhereInput
  }

  /**
   * TaskEvent upsert
   */
  export type TaskEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEvent
     */
    select?: TaskEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventInclude<ExtArgs> | null
    /**
     * The filter to search for the TaskEvent to update in case it exists.
     */
    where: TaskEventWhereUniqueInput
    /**
     * In case the TaskEvent found by the `where` argument doesn't exist, create a new TaskEvent with this data.
     */
    create: XOR<TaskEventCreateInput, TaskEventUncheckedCreateInput>
    /**
     * In case the TaskEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TaskEventUpdateInput, TaskEventUncheckedUpdateInput>
  }

  /**
   * TaskEvent delete
   */
  export type TaskEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEvent
     */
    select?: TaskEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventInclude<ExtArgs> | null
    /**
     * Filter which TaskEvent to delete.
     */
    where: TaskEventWhereUniqueInput
  }

  /**
   * TaskEvent deleteMany
   */
  export type TaskEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TaskEvents to delete
     */
    where?: TaskEventWhereInput
  }

  /**
   * TaskEvent without action
   */
  export type TaskEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskEvent
     */
    select?: TaskEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskEventInclude<ExtArgs> | null
  }


  /**
   * Model Comment
   */

  export type AggregateComment = {
    _count: CommentCountAggregateOutputType | null
    _min: CommentMinAggregateOutputType | null
    _max: CommentMaxAggregateOutputType | null
  }

  export type CommentMinAggregateOutputType = {
    id: string | null
    comment: string | null
    authorId: string | null
    date: Date | null
    taskId: string | null
  }

  export type CommentMaxAggregateOutputType = {
    id: string | null
    comment: string | null
    authorId: string | null
    date: Date | null
    taskId: string | null
  }

  export type CommentCountAggregateOutputType = {
    id: number
    comment: number
    authorId: number
    date: number
    taskId: number
    _all: number
  }


  export type CommentMinAggregateInputType = {
    id?: true
    comment?: true
    authorId?: true
    date?: true
    taskId?: true
  }

  export type CommentMaxAggregateInputType = {
    id?: true
    comment?: true
    authorId?: true
    date?: true
    taskId?: true
  }

  export type CommentCountAggregateInputType = {
    id?: true
    comment?: true
    authorId?: true
    date?: true
    taskId?: true
    _all?: true
  }

  export type CommentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Comment to aggregate.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Comments
    **/
    _count?: true | CommentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CommentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CommentMaxAggregateInputType
  }

  export type GetCommentAggregateType<T extends CommentAggregateArgs> = {
        [P in keyof T & keyof AggregateComment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateComment[P]>
      : GetScalarType<T[P], AggregateComment[P]>
  }




  export type CommentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithAggregationInput | CommentOrderByWithAggregationInput[]
    by: CommentScalarFieldEnum[] | CommentScalarFieldEnum
    having?: CommentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CommentCountAggregateInputType | true
    _min?: CommentMinAggregateInputType
    _max?: CommentMaxAggregateInputType
  }

  export type CommentGroupByOutputType = {
    id: string
    comment: string
    authorId: string
    date: Date
    taskId: string
    _count: CommentCountAggregateOutputType | null
    _min: CommentMinAggregateOutputType | null
    _max: CommentMaxAggregateOutputType | null
  }

  type GetCommentGroupByPayload<T extends CommentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CommentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CommentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommentGroupByOutputType[P]>
            : GetScalarType<T[P], CommentGroupByOutputType[P]>
        }
      >
    >


  export type CommentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    comment?: boolean
    authorId?: boolean
    date?: boolean
    taskId?: boolean
    Task?: boolean | TaskDefaultArgs<ExtArgs>
    Author?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["comment"]>

  export type CommentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    comment?: boolean
    authorId?: boolean
    date?: boolean
    taskId?: boolean
    Task?: boolean | TaskDefaultArgs<ExtArgs>
    Author?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["comment"]>

  export type CommentSelectScalar = {
    id?: boolean
    comment?: boolean
    authorId?: boolean
    date?: boolean
    taskId?: boolean
  }

  export type CommentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Task?: boolean | TaskDefaultArgs<ExtArgs>
    Author?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CommentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Task?: boolean | TaskDefaultArgs<ExtArgs>
    Author?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $CommentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Comment"
    objects: {
      Task: Prisma.$TaskPayload<ExtArgs>
      Author: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      comment: string
      authorId: string
      date: Date
      taskId: string
    }, ExtArgs["result"]["comment"]>
    composites: {}
  }

  type CommentGetPayload<S extends boolean | null | undefined | CommentDefaultArgs> = $Result.GetResult<Prisma.$CommentPayload, S>

  type CommentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CommentFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CommentCountAggregateInputType | true
    }

  export interface CommentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Comment'], meta: { name: 'Comment' } }
    /**
     * Find zero or one Comment that matches the filter.
     * @param {CommentFindUniqueArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CommentFindUniqueArgs>(args: SelectSubset<T, CommentFindUniqueArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Comment that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CommentFindUniqueOrThrowArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CommentFindUniqueOrThrowArgs>(args: SelectSubset<T, CommentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Comment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindFirstArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CommentFindFirstArgs>(args?: SelectSubset<T, CommentFindFirstArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Comment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindFirstOrThrowArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CommentFindFirstOrThrowArgs>(args?: SelectSubset<T, CommentFindFirstOrThrowArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Comments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Comments
     * const comments = await prisma.comment.findMany()
     * 
     * // Get first 10 Comments
     * const comments = await prisma.comment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const commentWithIdOnly = await prisma.comment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CommentFindManyArgs>(args?: SelectSubset<T, CommentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Comment.
     * @param {CommentCreateArgs} args - Arguments to create a Comment.
     * @example
     * // Create one Comment
     * const Comment = await prisma.comment.create({
     *   data: {
     *     // ... data to create a Comment
     *   }
     * })
     * 
     */
    create<T extends CommentCreateArgs>(args: SelectSubset<T, CommentCreateArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Comments.
     * @param {CommentCreateManyArgs} args - Arguments to create many Comments.
     * @example
     * // Create many Comments
     * const comment = await prisma.comment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CommentCreateManyArgs>(args?: SelectSubset<T, CommentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Comments and returns the data saved in the database.
     * @param {CommentCreateManyAndReturnArgs} args - Arguments to create many Comments.
     * @example
     * // Create many Comments
     * const comment = await prisma.comment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Comments and only return the `id`
     * const commentWithIdOnly = await prisma.comment.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CommentCreateManyAndReturnArgs>(args?: SelectSubset<T, CommentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Comment.
     * @param {CommentDeleteArgs} args - Arguments to delete one Comment.
     * @example
     * // Delete one Comment
     * const Comment = await prisma.comment.delete({
     *   where: {
     *     // ... filter to delete one Comment
     *   }
     * })
     * 
     */
    delete<T extends CommentDeleteArgs>(args: SelectSubset<T, CommentDeleteArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Comment.
     * @param {CommentUpdateArgs} args - Arguments to update one Comment.
     * @example
     * // Update one Comment
     * const comment = await prisma.comment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CommentUpdateArgs>(args: SelectSubset<T, CommentUpdateArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Comments.
     * @param {CommentDeleteManyArgs} args - Arguments to filter Comments to delete.
     * @example
     * // Delete a few Comments
     * const { count } = await prisma.comment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CommentDeleteManyArgs>(args?: SelectSubset<T, CommentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Comments
     * const comment = await prisma.comment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CommentUpdateManyArgs>(args: SelectSubset<T, CommentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Comment.
     * @param {CommentUpsertArgs} args - Arguments to update or create a Comment.
     * @example
     * // Update or create a Comment
     * const comment = await prisma.comment.upsert({
     *   create: {
     *     // ... data to create a Comment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Comment we want to update
     *   }
     * })
     */
    upsert<T extends CommentUpsertArgs>(args: SelectSubset<T, CommentUpsertArgs<ExtArgs>>): Prisma__CommentClient<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentCountArgs} args - Arguments to filter Comments to count.
     * @example
     * // Count the number of Comments
     * const count = await prisma.comment.count({
     *   where: {
     *     // ... the filter for the Comments we want to count
     *   }
     * })
    **/
    count<T extends CommentCountArgs>(
      args?: Subset<T, CommentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CommentAggregateArgs>(args: Subset<T, CommentAggregateArgs>): Prisma.PrismaPromise<GetCommentAggregateType<T>>

    /**
     * Group by Comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CommentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CommentGroupByArgs['orderBy'] }
        : { orderBy?: CommentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CommentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Comment model
   */
  readonly fields: CommentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Comment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CommentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Task<T extends TaskDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TaskDefaultArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    Author<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Comment model
   */ 
  interface CommentFieldRefs {
    readonly id: FieldRef<"Comment", 'String'>
    readonly comment: FieldRef<"Comment", 'String'>
    readonly authorId: FieldRef<"Comment", 'String'>
    readonly date: FieldRef<"Comment", 'DateTime'>
    readonly taskId: FieldRef<"Comment", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Comment findUnique
   */
  export type CommentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment findUniqueOrThrow
   */
  export type CommentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment findFirst
   */
  export type CommentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Comments.
     */
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment findFirstOrThrow
   */
  export type CommentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comment to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Comments.
     */
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment findMany
   */
  export type CommentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter, which Comments to fetch.
     */
    where?: CommentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Comments to fetch.
     */
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Comments.
     */
    cursor?: CommentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Comments.
     */
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Comment create
   */
  export type CommentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * The data needed to create a Comment.
     */
    data: XOR<CommentCreateInput, CommentUncheckedCreateInput>
  }

  /**
   * Comment createMany
   */
  export type CommentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Comments.
     */
    data: CommentCreateManyInput | CommentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Comment createManyAndReturn
   */
  export type CommentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Comments.
     */
    data: CommentCreateManyInput | CommentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Comment update
   */
  export type CommentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * The data needed to update a Comment.
     */
    data: XOR<CommentUpdateInput, CommentUncheckedUpdateInput>
    /**
     * Choose, which Comment to update.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment updateMany
   */
  export type CommentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Comments.
     */
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyInput>
    /**
     * Filter which Comments to update
     */
    where?: CommentWhereInput
  }

  /**
   * Comment upsert
   */
  export type CommentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * The filter to search for the Comment to update in case it exists.
     */
    where: CommentWhereUniqueInput
    /**
     * In case the Comment found by the `where` argument doesn't exist, create a new Comment with this data.
     */
    create: XOR<CommentCreateInput, CommentUncheckedCreateInput>
    /**
     * In case the Comment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CommentUpdateInput, CommentUncheckedUpdateInput>
  }

  /**
   * Comment delete
   */
  export type CommentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    /**
     * Filter which Comment to delete.
     */
    where: CommentWhereUniqueInput
  }

  /**
   * Comment deleteMany
   */
  export type CommentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Comments to delete
     */
    where?: CommentWhereInput
  }

  /**
   * Comment without action
   */
  export type CommentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    read: boolean | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    read: boolean | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    userId: number
    taskIds: number
    read: number
    description: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type NotificationMinAggregateInputType = {
    id?: true
    userId?: true
    read?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    userId?: true
    read?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    userId?: true
    taskIds?: true
    read?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: string
    userId: string
    taskIds: string[]
    read: boolean
    description: string | null
    createdAt: Date
    updatedAt: Date
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    taskIds?: boolean
    read?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    taskIds?: boolean
    read?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    User?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectScalar = {
    id?: boolean
    userId?: boolean
    taskIds?: boolean
    read?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type NotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type NotificationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    User?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {
      User: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      taskIds: string[]
      read: boolean
      description: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Notifications and returns the data saved in the database.
     * @param {NotificationCreateManyAndReturnArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    User<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Notification model
   */ 
  interface NotificationFieldRefs {
    readonly id: FieldRef<"Notification", 'String'>
    readonly userId: FieldRef<"Notification", 'String'>
    readonly taskIds: FieldRef<"Notification", 'String[]'>
    readonly read: FieldRef<"Notification", 'Boolean'>
    readonly description: FieldRef<"Notification", 'String'>
    readonly createdAt: FieldRef<"Notification", 'DateTime'>
    readonly updatedAt: FieldRef<"Notification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification createManyAndReturn
   */
  export type NotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
  }


  /**
   * Model PageFilterModel
   */

  export type AggregatePageFilterModel = {
    _count: PageFilterModelCountAggregateOutputType | null
    _min: PageFilterModelMinAggregateOutputType | null
    _max: PageFilterModelMaxAggregateOutputType | null
  }

  export type PageFilterModelMinAggregateOutputType = {
    id: string | null
    filterTitle: string | null
    filterDescription: string | null
    teamId: string | null
  }

  export type PageFilterModelMaxAggregateOutputType = {
    id: string | null
    filterTitle: string | null
    filterDescription: string | null
    teamId: string | null
  }

  export type PageFilterModelCountAggregateOutputType = {
    id: number
    filterTitle: number
    filterOption: number
    filterDescription: number
    teamId: number
    _all: number
  }


  export type PageFilterModelMinAggregateInputType = {
    id?: true
    filterTitle?: true
    filterDescription?: true
    teamId?: true
  }

  export type PageFilterModelMaxAggregateInputType = {
    id?: true
    filterTitle?: true
    filterDescription?: true
    teamId?: true
  }

  export type PageFilterModelCountAggregateInputType = {
    id?: true
    filterTitle?: true
    filterOption?: true
    filterDescription?: true
    teamId?: true
    _all?: true
  }

  export type PageFilterModelAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PageFilterModel to aggregate.
     */
    where?: PageFilterModelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PageFilterModels to fetch.
     */
    orderBy?: PageFilterModelOrderByWithRelationInput | PageFilterModelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PageFilterModelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PageFilterModels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PageFilterModels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PageFilterModels
    **/
    _count?: true | PageFilterModelCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PageFilterModelMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PageFilterModelMaxAggregateInputType
  }

  export type GetPageFilterModelAggregateType<T extends PageFilterModelAggregateArgs> = {
        [P in keyof T & keyof AggregatePageFilterModel]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePageFilterModel[P]>
      : GetScalarType<T[P], AggregatePageFilterModel[P]>
  }




  export type PageFilterModelGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PageFilterModelWhereInput
    orderBy?: PageFilterModelOrderByWithAggregationInput | PageFilterModelOrderByWithAggregationInput[]
    by: PageFilterModelScalarFieldEnum[] | PageFilterModelScalarFieldEnum
    having?: PageFilterModelScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PageFilterModelCountAggregateInputType | true
    _min?: PageFilterModelMinAggregateInputType
    _max?: PageFilterModelMaxAggregateInputType
  }

  export type PageFilterModelGroupByOutputType = {
    id: string
    filterTitle: string
    filterOption: JsonValue
    filterDescription: string | null
    teamId: string
    _count: PageFilterModelCountAggregateOutputType | null
    _min: PageFilterModelMinAggregateOutputType | null
    _max: PageFilterModelMaxAggregateOutputType | null
  }

  type GetPageFilterModelGroupByPayload<T extends PageFilterModelGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PageFilterModelGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PageFilterModelGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PageFilterModelGroupByOutputType[P]>
            : GetScalarType<T[P], PageFilterModelGroupByOutputType[P]>
        }
      >
    >


  export type PageFilterModelSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    filterTitle?: boolean
    filterOption?: boolean
    filterDescription?: boolean
    teamId?: boolean
  }, ExtArgs["result"]["pageFilterModel"]>

  export type PageFilterModelSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    filterTitle?: boolean
    filterOption?: boolean
    filterDescription?: boolean
    teamId?: boolean
  }, ExtArgs["result"]["pageFilterModel"]>

  export type PageFilterModelSelectScalar = {
    id?: boolean
    filterTitle?: boolean
    filterOption?: boolean
    filterDescription?: boolean
    teamId?: boolean
  }


  export type $PageFilterModelPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PageFilterModel"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      filterTitle: string
      filterOption: Prisma.JsonValue
      filterDescription: string | null
      teamId: string
    }, ExtArgs["result"]["pageFilterModel"]>
    composites: {}
  }

  type PageFilterModelGetPayload<S extends boolean | null | undefined | PageFilterModelDefaultArgs> = $Result.GetResult<Prisma.$PageFilterModelPayload, S>

  type PageFilterModelCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PageFilterModelFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PageFilterModelCountAggregateInputType | true
    }

  export interface PageFilterModelDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PageFilterModel'], meta: { name: 'PageFilterModel' } }
    /**
     * Find zero or one PageFilterModel that matches the filter.
     * @param {PageFilterModelFindUniqueArgs} args - Arguments to find a PageFilterModel
     * @example
     * // Get one PageFilterModel
     * const pageFilterModel = await prisma.pageFilterModel.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PageFilterModelFindUniqueArgs>(args: SelectSubset<T, PageFilterModelFindUniqueArgs<ExtArgs>>): Prisma__PageFilterModelClient<$Result.GetResult<Prisma.$PageFilterModelPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PageFilterModel that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PageFilterModelFindUniqueOrThrowArgs} args - Arguments to find a PageFilterModel
     * @example
     * // Get one PageFilterModel
     * const pageFilterModel = await prisma.pageFilterModel.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PageFilterModelFindUniqueOrThrowArgs>(args: SelectSubset<T, PageFilterModelFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PageFilterModelClient<$Result.GetResult<Prisma.$PageFilterModelPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PageFilterModel that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageFilterModelFindFirstArgs} args - Arguments to find a PageFilterModel
     * @example
     * // Get one PageFilterModel
     * const pageFilterModel = await prisma.pageFilterModel.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PageFilterModelFindFirstArgs>(args?: SelectSubset<T, PageFilterModelFindFirstArgs<ExtArgs>>): Prisma__PageFilterModelClient<$Result.GetResult<Prisma.$PageFilterModelPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PageFilterModel that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageFilterModelFindFirstOrThrowArgs} args - Arguments to find a PageFilterModel
     * @example
     * // Get one PageFilterModel
     * const pageFilterModel = await prisma.pageFilterModel.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PageFilterModelFindFirstOrThrowArgs>(args?: SelectSubset<T, PageFilterModelFindFirstOrThrowArgs<ExtArgs>>): Prisma__PageFilterModelClient<$Result.GetResult<Prisma.$PageFilterModelPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PageFilterModels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageFilterModelFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PageFilterModels
     * const pageFilterModels = await prisma.pageFilterModel.findMany()
     * 
     * // Get first 10 PageFilterModels
     * const pageFilterModels = await prisma.pageFilterModel.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pageFilterModelWithIdOnly = await prisma.pageFilterModel.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PageFilterModelFindManyArgs>(args?: SelectSubset<T, PageFilterModelFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PageFilterModelPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PageFilterModel.
     * @param {PageFilterModelCreateArgs} args - Arguments to create a PageFilterModel.
     * @example
     * // Create one PageFilterModel
     * const PageFilterModel = await prisma.pageFilterModel.create({
     *   data: {
     *     // ... data to create a PageFilterModel
     *   }
     * })
     * 
     */
    create<T extends PageFilterModelCreateArgs>(args: SelectSubset<T, PageFilterModelCreateArgs<ExtArgs>>): Prisma__PageFilterModelClient<$Result.GetResult<Prisma.$PageFilterModelPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PageFilterModels.
     * @param {PageFilterModelCreateManyArgs} args - Arguments to create many PageFilterModels.
     * @example
     * // Create many PageFilterModels
     * const pageFilterModel = await prisma.pageFilterModel.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PageFilterModelCreateManyArgs>(args?: SelectSubset<T, PageFilterModelCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PageFilterModels and returns the data saved in the database.
     * @param {PageFilterModelCreateManyAndReturnArgs} args - Arguments to create many PageFilterModels.
     * @example
     * // Create many PageFilterModels
     * const pageFilterModel = await prisma.pageFilterModel.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PageFilterModels and only return the `id`
     * const pageFilterModelWithIdOnly = await prisma.pageFilterModel.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PageFilterModelCreateManyAndReturnArgs>(args?: SelectSubset<T, PageFilterModelCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PageFilterModelPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PageFilterModel.
     * @param {PageFilterModelDeleteArgs} args - Arguments to delete one PageFilterModel.
     * @example
     * // Delete one PageFilterModel
     * const PageFilterModel = await prisma.pageFilterModel.delete({
     *   where: {
     *     // ... filter to delete one PageFilterModel
     *   }
     * })
     * 
     */
    delete<T extends PageFilterModelDeleteArgs>(args: SelectSubset<T, PageFilterModelDeleteArgs<ExtArgs>>): Prisma__PageFilterModelClient<$Result.GetResult<Prisma.$PageFilterModelPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PageFilterModel.
     * @param {PageFilterModelUpdateArgs} args - Arguments to update one PageFilterModel.
     * @example
     * // Update one PageFilterModel
     * const pageFilterModel = await prisma.pageFilterModel.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PageFilterModelUpdateArgs>(args: SelectSubset<T, PageFilterModelUpdateArgs<ExtArgs>>): Prisma__PageFilterModelClient<$Result.GetResult<Prisma.$PageFilterModelPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PageFilterModels.
     * @param {PageFilterModelDeleteManyArgs} args - Arguments to filter PageFilterModels to delete.
     * @example
     * // Delete a few PageFilterModels
     * const { count } = await prisma.pageFilterModel.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PageFilterModelDeleteManyArgs>(args?: SelectSubset<T, PageFilterModelDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PageFilterModels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageFilterModelUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PageFilterModels
     * const pageFilterModel = await prisma.pageFilterModel.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PageFilterModelUpdateManyArgs>(args: SelectSubset<T, PageFilterModelUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PageFilterModel.
     * @param {PageFilterModelUpsertArgs} args - Arguments to update or create a PageFilterModel.
     * @example
     * // Update or create a PageFilterModel
     * const pageFilterModel = await prisma.pageFilterModel.upsert({
     *   create: {
     *     // ... data to create a PageFilterModel
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PageFilterModel we want to update
     *   }
     * })
     */
    upsert<T extends PageFilterModelUpsertArgs>(args: SelectSubset<T, PageFilterModelUpsertArgs<ExtArgs>>): Prisma__PageFilterModelClient<$Result.GetResult<Prisma.$PageFilterModelPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PageFilterModels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageFilterModelCountArgs} args - Arguments to filter PageFilterModels to count.
     * @example
     * // Count the number of PageFilterModels
     * const count = await prisma.pageFilterModel.count({
     *   where: {
     *     // ... the filter for the PageFilterModels we want to count
     *   }
     * })
    **/
    count<T extends PageFilterModelCountArgs>(
      args?: Subset<T, PageFilterModelCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PageFilterModelCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PageFilterModel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageFilterModelAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PageFilterModelAggregateArgs>(args: Subset<T, PageFilterModelAggregateArgs>): Prisma.PrismaPromise<GetPageFilterModelAggregateType<T>>

    /**
     * Group by PageFilterModel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageFilterModelGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PageFilterModelGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PageFilterModelGroupByArgs['orderBy'] }
        : { orderBy?: PageFilterModelGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PageFilterModelGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPageFilterModelGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PageFilterModel model
   */
  readonly fields: PageFilterModelFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PageFilterModel.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PageFilterModelClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PageFilterModel model
   */ 
  interface PageFilterModelFieldRefs {
    readonly id: FieldRef<"PageFilterModel", 'String'>
    readonly filterTitle: FieldRef<"PageFilterModel", 'String'>
    readonly filterOption: FieldRef<"PageFilterModel", 'Json'>
    readonly filterDescription: FieldRef<"PageFilterModel", 'String'>
    readonly teamId: FieldRef<"PageFilterModel", 'String'>
  }
    

  // Custom InputTypes
  /**
   * PageFilterModel findUnique
   */
  export type PageFilterModelFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageFilterModel
     */
    select?: PageFilterModelSelect<ExtArgs> | null
    /**
     * Filter, which PageFilterModel to fetch.
     */
    where: PageFilterModelWhereUniqueInput
  }

  /**
   * PageFilterModel findUniqueOrThrow
   */
  export type PageFilterModelFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageFilterModel
     */
    select?: PageFilterModelSelect<ExtArgs> | null
    /**
     * Filter, which PageFilterModel to fetch.
     */
    where: PageFilterModelWhereUniqueInput
  }

  /**
   * PageFilterModel findFirst
   */
  export type PageFilterModelFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageFilterModel
     */
    select?: PageFilterModelSelect<ExtArgs> | null
    /**
     * Filter, which PageFilterModel to fetch.
     */
    where?: PageFilterModelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PageFilterModels to fetch.
     */
    orderBy?: PageFilterModelOrderByWithRelationInput | PageFilterModelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PageFilterModels.
     */
    cursor?: PageFilterModelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PageFilterModels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PageFilterModels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PageFilterModels.
     */
    distinct?: PageFilterModelScalarFieldEnum | PageFilterModelScalarFieldEnum[]
  }

  /**
   * PageFilterModel findFirstOrThrow
   */
  export type PageFilterModelFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageFilterModel
     */
    select?: PageFilterModelSelect<ExtArgs> | null
    /**
     * Filter, which PageFilterModel to fetch.
     */
    where?: PageFilterModelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PageFilterModels to fetch.
     */
    orderBy?: PageFilterModelOrderByWithRelationInput | PageFilterModelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PageFilterModels.
     */
    cursor?: PageFilterModelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PageFilterModels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PageFilterModels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PageFilterModels.
     */
    distinct?: PageFilterModelScalarFieldEnum | PageFilterModelScalarFieldEnum[]
  }

  /**
   * PageFilterModel findMany
   */
  export type PageFilterModelFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageFilterModel
     */
    select?: PageFilterModelSelect<ExtArgs> | null
    /**
     * Filter, which PageFilterModels to fetch.
     */
    where?: PageFilterModelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PageFilterModels to fetch.
     */
    orderBy?: PageFilterModelOrderByWithRelationInput | PageFilterModelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PageFilterModels.
     */
    cursor?: PageFilterModelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PageFilterModels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PageFilterModels.
     */
    skip?: number
    distinct?: PageFilterModelScalarFieldEnum | PageFilterModelScalarFieldEnum[]
  }

  /**
   * PageFilterModel create
   */
  export type PageFilterModelCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageFilterModel
     */
    select?: PageFilterModelSelect<ExtArgs> | null
    /**
     * The data needed to create a PageFilterModel.
     */
    data: XOR<PageFilterModelCreateInput, PageFilterModelUncheckedCreateInput>
  }

  /**
   * PageFilterModel createMany
   */
  export type PageFilterModelCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PageFilterModels.
     */
    data: PageFilterModelCreateManyInput | PageFilterModelCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PageFilterModel createManyAndReturn
   */
  export type PageFilterModelCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageFilterModel
     */
    select?: PageFilterModelSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PageFilterModels.
     */
    data: PageFilterModelCreateManyInput | PageFilterModelCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PageFilterModel update
   */
  export type PageFilterModelUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageFilterModel
     */
    select?: PageFilterModelSelect<ExtArgs> | null
    /**
     * The data needed to update a PageFilterModel.
     */
    data: XOR<PageFilterModelUpdateInput, PageFilterModelUncheckedUpdateInput>
    /**
     * Choose, which PageFilterModel to update.
     */
    where: PageFilterModelWhereUniqueInput
  }

  /**
   * PageFilterModel updateMany
   */
  export type PageFilterModelUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PageFilterModels.
     */
    data: XOR<PageFilterModelUpdateManyMutationInput, PageFilterModelUncheckedUpdateManyInput>
    /**
     * Filter which PageFilterModels to update
     */
    where?: PageFilterModelWhereInput
  }

  /**
   * PageFilterModel upsert
   */
  export type PageFilterModelUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageFilterModel
     */
    select?: PageFilterModelSelect<ExtArgs> | null
    /**
     * The filter to search for the PageFilterModel to update in case it exists.
     */
    where: PageFilterModelWhereUniqueInput
    /**
     * In case the PageFilterModel found by the `where` argument doesn't exist, create a new PageFilterModel with this data.
     */
    create: XOR<PageFilterModelCreateInput, PageFilterModelUncheckedCreateInput>
    /**
     * In case the PageFilterModel was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PageFilterModelUpdateInput, PageFilterModelUncheckedUpdateInput>
  }

  /**
   * PageFilterModel delete
   */
  export type PageFilterModelDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageFilterModel
     */
    select?: PageFilterModelSelect<ExtArgs> | null
    /**
     * Filter which PageFilterModel to delete.
     */
    where: PageFilterModelWhereUniqueInput
  }

  /**
   * PageFilterModel deleteMany
   */
  export type PageFilterModelDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PageFilterModels to delete
     */
    where?: PageFilterModelWhereInput
  }

  /**
   * PageFilterModel without action
   */
  export type PageFilterModelDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageFilterModel
     */
    select?: PageFilterModelSelect<ExtArgs> | null
  }


  /**
   * Model Task
   */

  export type AggregateTask = {
    _count: TaskCountAggregateOutputType | null
    _avg: TaskAvgAggregateOutputType | null
    _sum: TaskSumAggregateOutputType | null
    _min: TaskMinAggregateOutputType | null
    _max: TaskMaxAggregateOutputType | null
  }

  export type TaskAvgAggregateOutputType = {
    effortEstimate: number | null
  }

  export type TaskSumAggregateOutputType = {
    effortEstimate: number | null
  }

  export type TaskMinAggregateOutputType = {
    id: string | null
    authorId: string | null
    title: string | null
    description: string | null
    status: $Enums.Status | null
    identifier: string | null
    priority: $Enums.Priority | null
    dueDate: Date | null
    effortEstimate: number | null
    teamId: string | null
    dateCreated: Date | null
    assigneeId: string | null
    assigneeName: string | null
  }

  export type TaskMaxAggregateOutputType = {
    id: string | null
    authorId: string | null
    title: string | null
    description: string | null
    status: $Enums.Status | null
    identifier: string | null
    priority: $Enums.Priority | null
    dueDate: Date | null
    effortEstimate: number | null
    teamId: string | null
    dateCreated: Date | null
    assigneeId: string | null
    assigneeName: string | null
  }

  export type TaskCountAggregateOutputType = {
    id: number
    authorId: number
    title: number
    description: number
    status: number
    identifier: number
    priority: number
    labels: number
    dueDate: number
    effortEstimate: number
    teamId: number
    dateCreated: number
    assigneeId: number
    assigneeName: number
    _all: number
  }


  export type TaskAvgAggregateInputType = {
    effortEstimate?: true
  }

  export type TaskSumAggregateInputType = {
    effortEstimate?: true
  }

  export type TaskMinAggregateInputType = {
    id?: true
    authorId?: true
    title?: true
    description?: true
    status?: true
    identifier?: true
    priority?: true
    dueDate?: true
    effortEstimate?: true
    teamId?: true
    dateCreated?: true
    assigneeId?: true
    assigneeName?: true
  }

  export type TaskMaxAggregateInputType = {
    id?: true
    authorId?: true
    title?: true
    description?: true
    status?: true
    identifier?: true
    priority?: true
    dueDate?: true
    effortEstimate?: true
    teamId?: true
    dateCreated?: true
    assigneeId?: true
    assigneeName?: true
  }

  export type TaskCountAggregateInputType = {
    id?: true
    authorId?: true
    title?: true
    description?: true
    status?: true
    identifier?: true
    priority?: true
    labels?: true
    dueDate?: true
    effortEstimate?: true
    teamId?: true
    dateCreated?: true
    assigneeId?: true
    assigneeName?: true
    _all?: true
  }

  export type TaskAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Task to aggregate.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tasks
    **/
    _count?: true | TaskCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TaskAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TaskSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TaskMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TaskMaxAggregateInputType
  }

  export type GetTaskAggregateType<T extends TaskAggregateArgs> = {
        [P in keyof T & keyof AggregateTask]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTask[P]>
      : GetScalarType<T[P], AggregateTask[P]>
  }




  export type TaskGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithAggregationInput | TaskOrderByWithAggregationInput[]
    by: TaskScalarFieldEnum[] | TaskScalarFieldEnum
    having?: TaskScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TaskCountAggregateInputType | true
    _avg?: TaskAvgAggregateInputType
    _sum?: TaskSumAggregateInputType
    _min?: TaskMinAggregateInputType
    _max?: TaskMaxAggregateInputType
  }

  export type TaskGroupByOutputType = {
    id: string
    authorId: string
    title: string
    description: string | null
    status: $Enums.Status
    identifier: string
    priority: $Enums.Priority | null
    labels: $Enums.Label[]
    dueDate: Date | null
    effortEstimate: number | null
    teamId: string
    dateCreated: Date
    assigneeId: string | null
    assigneeName: string | null
    _count: TaskCountAggregateOutputType | null
    _avg: TaskAvgAggregateOutputType | null
    _sum: TaskSumAggregateOutputType | null
    _min: TaskMinAggregateOutputType | null
    _max: TaskMaxAggregateOutputType | null
  }

  type GetTaskGroupByPayload<T extends TaskGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TaskGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TaskGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TaskGroupByOutputType[P]>
            : GetScalarType<T[P], TaskGroupByOutputType[P]>
        }
      >
    >


  export type TaskSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authorId?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    identifier?: boolean
    priority?: boolean
    labels?: boolean
    dueDate?: boolean
    effortEstimate?: boolean
    teamId?: boolean
    dateCreated?: boolean
    assigneeId?: boolean
    assigneeName?: boolean
    Author?: boolean | UserDefaultArgs<ExtArgs>
    Team?: boolean | TeamDefaultArgs<ExtArgs>
    Comment?: boolean | Task$CommentArgs<ExtArgs>
    _count?: boolean | TaskCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type TaskSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    authorId?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    identifier?: boolean
    priority?: boolean
    labels?: boolean
    dueDate?: boolean
    effortEstimate?: boolean
    teamId?: boolean
    dateCreated?: boolean
    assigneeId?: boolean
    assigneeName?: boolean
    Author?: boolean | UserDefaultArgs<ExtArgs>
    Team?: boolean | TeamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type TaskSelectScalar = {
    id?: boolean
    authorId?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    identifier?: boolean
    priority?: boolean
    labels?: boolean
    dueDate?: boolean
    effortEstimate?: boolean
    teamId?: boolean
    dateCreated?: boolean
    assigneeId?: boolean
    assigneeName?: boolean
  }

  export type TaskInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Author?: boolean | UserDefaultArgs<ExtArgs>
    Team?: boolean | TeamDefaultArgs<ExtArgs>
    Comment?: boolean | Task$CommentArgs<ExtArgs>
    _count?: boolean | TaskCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TaskIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Author?: boolean | UserDefaultArgs<ExtArgs>
    Team?: boolean | TeamDefaultArgs<ExtArgs>
  }

  export type $TaskPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Task"
    objects: {
      Author: Prisma.$UserPayload<ExtArgs>
      Team: Prisma.$TeamPayload<ExtArgs>
      Comment: Prisma.$CommentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      authorId: string
      title: string
      description: string | null
      status: $Enums.Status
      identifier: string
      priority: $Enums.Priority | null
      labels: $Enums.Label[]
      dueDate: Date | null
      effortEstimate: number | null
      teamId: string
      dateCreated: Date
      assigneeId: string | null
      assigneeName: string | null
    }, ExtArgs["result"]["task"]>
    composites: {}
  }

  type TaskGetPayload<S extends boolean | null | undefined | TaskDefaultArgs> = $Result.GetResult<Prisma.$TaskPayload, S>

  type TaskCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TaskFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TaskCountAggregateInputType | true
    }

  export interface TaskDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Task'], meta: { name: 'Task' } }
    /**
     * Find zero or one Task that matches the filter.
     * @param {TaskFindUniqueArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TaskFindUniqueArgs>(args: SelectSubset<T, TaskFindUniqueArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Task that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TaskFindUniqueOrThrowArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TaskFindUniqueOrThrowArgs>(args: SelectSubset<T, TaskFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Task that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindFirstArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TaskFindFirstArgs>(args?: SelectSubset<T, TaskFindFirstArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Task that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindFirstOrThrowArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TaskFindFirstOrThrowArgs>(args?: SelectSubset<T, TaskFindFirstOrThrowArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Tasks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tasks
     * const tasks = await prisma.task.findMany()
     * 
     * // Get first 10 Tasks
     * const tasks = await prisma.task.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const taskWithIdOnly = await prisma.task.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TaskFindManyArgs>(args?: SelectSubset<T, TaskFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Task.
     * @param {TaskCreateArgs} args - Arguments to create a Task.
     * @example
     * // Create one Task
     * const Task = await prisma.task.create({
     *   data: {
     *     // ... data to create a Task
     *   }
     * })
     * 
     */
    create<T extends TaskCreateArgs>(args: SelectSubset<T, TaskCreateArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Tasks.
     * @param {TaskCreateManyArgs} args - Arguments to create many Tasks.
     * @example
     * // Create many Tasks
     * const task = await prisma.task.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TaskCreateManyArgs>(args?: SelectSubset<T, TaskCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tasks and returns the data saved in the database.
     * @param {TaskCreateManyAndReturnArgs} args - Arguments to create many Tasks.
     * @example
     * // Create many Tasks
     * const task = await prisma.task.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tasks and only return the `id`
     * const taskWithIdOnly = await prisma.task.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TaskCreateManyAndReturnArgs>(args?: SelectSubset<T, TaskCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Task.
     * @param {TaskDeleteArgs} args - Arguments to delete one Task.
     * @example
     * // Delete one Task
     * const Task = await prisma.task.delete({
     *   where: {
     *     // ... filter to delete one Task
     *   }
     * })
     * 
     */
    delete<T extends TaskDeleteArgs>(args: SelectSubset<T, TaskDeleteArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Task.
     * @param {TaskUpdateArgs} args - Arguments to update one Task.
     * @example
     * // Update one Task
     * const task = await prisma.task.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TaskUpdateArgs>(args: SelectSubset<T, TaskUpdateArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Tasks.
     * @param {TaskDeleteManyArgs} args - Arguments to filter Tasks to delete.
     * @example
     * // Delete a few Tasks
     * const { count } = await prisma.task.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TaskDeleteManyArgs>(args?: SelectSubset<T, TaskDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tasks
     * const task = await prisma.task.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TaskUpdateManyArgs>(args: SelectSubset<T, TaskUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Task.
     * @param {TaskUpsertArgs} args - Arguments to update or create a Task.
     * @example
     * // Update or create a Task
     * const task = await prisma.task.upsert({
     *   create: {
     *     // ... data to create a Task
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Task we want to update
     *   }
     * })
     */
    upsert<T extends TaskUpsertArgs>(args: SelectSubset<T, TaskUpsertArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskCountArgs} args - Arguments to filter Tasks to count.
     * @example
     * // Count the number of Tasks
     * const count = await prisma.task.count({
     *   where: {
     *     // ... the filter for the Tasks we want to count
     *   }
     * })
    **/
    count<T extends TaskCountArgs>(
      args?: Subset<T, TaskCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TaskCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Task.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TaskAggregateArgs>(args: Subset<T, TaskAggregateArgs>): Prisma.PrismaPromise<GetTaskAggregateType<T>>

    /**
     * Group by Task.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TaskGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TaskGroupByArgs['orderBy'] }
        : { orderBy?: TaskGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TaskGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Task model
   */
  readonly fields: TaskFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Task.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TaskClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Author<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    Team<T extends TeamDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TeamDefaultArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    Comment<T extends Task$CommentArgs<ExtArgs> = {}>(args?: Subset<T, Task$CommentArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Task model
   */ 
  interface TaskFieldRefs {
    readonly id: FieldRef<"Task", 'String'>
    readonly authorId: FieldRef<"Task", 'String'>
    readonly title: FieldRef<"Task", 'String'>
    readonly description: FieldRef<"Task", 'String'>
    readonly status: FieldRef<"Task", 'Status'>
    readonly identifier: FieldRef<"Task", 'String'>
    readonly priority: FieldRef<"Task", 'Priority'>
    readonly labels: FieldRef<"Task", 'Label[]'>
    readonly dueDate: FieldRef<"Task", 'DateTime'>
    readonly effortEstimate: FieldRef<"Task", 'Int'>
    readonly teamId: FieldRef<"Task", 'String'>
    readonly dateCreated: FieldRef<"Task", 'DateTime'>
    readonly assigneeId: FieldRef<"Task", 'String'>
    readonly assigneeName: FieldRef<"Task", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Task findUnique
   */
  export type TaskFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task findUniqueOrThrow
   */
  export type TaskFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task findFirst
   */
  export type TaskFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks.
     */
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task findFirstOrThrow
   */
  export type TaskFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks.
     */
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task findMany
   */
  export type TaskFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Tasks to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task create
   */
  export type TaskCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The data needed to create a Task.
     */
    data: XOR<TaskCreateInput, TaskUncheckedCreateInput>
  }

  /**
   * Task createMany
   */
  export type TaskCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tasks.
     */
    data: TaskCreateManyInput | TaskCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Task createManyAndReturn
   */
  export type TaskCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Tasks.
     */
    data: TaskCreateManyInput | TaskCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Task update
   */
  export type TaskUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The data needed to update a Task.
     */
    data: XOR<TaskUpdateInput, TaskUncheckedUpdateInput>
    /**
     * Choose, which Task to update.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task updateMany
   */
  export type TaskUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tasks.
     */
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyInput>
    /**
     * Filter which Tasks to update
     */
    where?: TaskWhereInput
  }

  /**
   * Task upsert
   */
  export type TaskUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The filter to search for the Task to update in case it exists.
     */
    where: TaskWhereUniqueInput
    /**
     * In case the Task found by the `where` argument doesn't exist, create a new Task with this data.
     */
    create: XOR<TaskCreateInput, TaskUncheckedCreateInput>
    /**
     * In case the Task was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TaskUpdateInput, TaskUncheckedUpdateInput>
  }

  /**
   * Task delete
   */
  export type TaskDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter which Task to delete.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task deleteMany
   */
  export type TaskDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tasks to delete
     */
    where?: TaskWhereInput
  }

  /**
   * Task.Comment
   */
  export type Task$CommentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    cursor?: CommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * Task without action
   */
  export type TaskDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
  }


  /**
   * Model Team
   */

  export type AggregateTeam = {
    _count: TeamCountAggregateOutputType | null
    _min: TeamMinAggregateOutputType | null
    _max: TeamMaxAggregateOutputType | null
  }

  export type TeamMinAggregateOutputType = {
    id: string | null
    name: string | null
    identifier: string | null
    workspaceId: string | null
  }

  export type TeamMaxAggregateOutputType = {
    id: string | null
    name: string | null
    identifier: string | null
    workspaceId: string | null
  }

  export type TeamCountAggregateOutputType = {
    id: number
    name: number
    identifier: number
    workspaceId: number
    _all: number
  }


  export type TeamMinAggregateInputType = {
    id?: true
    name?: true
    identifier?: true
    workspaceId?: true
  }

  export type TeamMaxAggregateInputType = {
    id?: true
    name?: true
    identifier?: true
    workspaceId?: true
  }

  export type TeamCountAggregateInputType = {
    id?: true
    name?: true
    identifier?: true
    workspaceId?: true
    _all?: true
  }

  export type TeamAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Team to aggregate.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Teams
    **/
    _count?: true | TeamCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TeamMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TeamMaxAggregateInputType
  }

  export type GetTeamAggregateType<T extends TeamAggregateArgs> = {
        [P in keyof T & keyof AggregateTeam]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTeam[P]>
      : GetScalarType<T[P], AggregateTeam[P]>
  }




  export type TeamGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamWhereInput
    orderBy?: TeamOrderByWithAggregationInput | TeamOrderByWithAggregationInput[]
    by: TeamScalarFieldEnum[] | TeamScalarFieldEnum
    having?: TeamScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TeamCountAggregateInputType | true
    _min?: TeamMinAggregateInputType
    _max?: TeamMaxAggregateInputType
  }

  export type TeamGroupByOutputType = {
    id: string
    name: string | null
    identifier: string
    workspaceId: string
    _count: TeamCountAggregateOutputType | null
    _min: TeamMinAggregateOutputType | null
    _max: TeamMaxAggregateOutputType | null
  }

  type GetTeamGroupByPayload<T extends TeamGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TeamGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TeamGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TeamGroupByOutputType[P]>
            : GetScalarType<T[P], TeamGroupByOutputType[P]>
        }
      >
    >


  export type TeamSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    identifier?: boolean
    workspaceId?: boolean
    Users?: boolean | Team$UsersArgs<ExtArgs>
    Tasks?: boolean | Team$TasksArgs<ExtArgs>
    Workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    Project?: boolean | Team$ProjectArgs<ExtArgs>
    _count?: boolean | TeamCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["team"]>

  export type TeamSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    identifier?: boolean
    workspaceId?: boolean
    Workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["team"]>

  export type TeamSelectScalar = {
    id?: boolean
    name?: boolean
    identifier?: boolean
    workspaceId?: boolean
  }

  export type TeamInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Users?: boolean | Team$UsersArgs<ExtArgs>
    Tasks?: boolean | Team$TasksArgs<ExtArgs>
    Workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
    Project?: boolean | Team$ProjectArgs<ExtArgs>
    _count?: boolean | TeamCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TeamIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Workspace?: boolean | WorkspaceDefaultArgs<ExtArgs>
  }

  export type $TeamPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Team"
    objects: {
      Users: Prisma.$UserPayload<ExtArgs>[]
      Tasks: Prisma.$TaskPayload<ExtArgs>[]
      Workspace: Prisma.$WorkspacePayload<ExtArgs>
      Project: Prisma.$ProjectPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string | null
      identifier: string
      workspaceId: string
    }, ExtArgs["result"]["team"]>
    composites: {}
  }

  type TeamGetPayload<S extends boolean | null | undefined | TeamDefaultArgs> = $Result.GetResult<Prisma.$TeamPayload, S>

  type TeamCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TeamFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TeamCountAggregateInputType | true
    }

  export interface TeamDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Team'], meta: { name: 'Team' } }
    /**
     * Find zero or one Team that matches the filter.
     * @param {TeamFindUniqueArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TeamFindUniqueArgs>(args: SelectSubset<T, TeamFindUniqueArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Team that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TeamFindUniqueOrThrowArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TeamFindUniqueOrThrowArgs>(args: SelectSubset<T, TeamFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Team that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindFirstArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TeamFindFirstArgs>(args?: SelectSubset<T, TeamFindFirstArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Team that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindFirstOrThrowArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TeamFindFirstOrThrowArgs>(args?: SelectSubset<T, TeamFindFirstOrThrowArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Teams that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Teams
     * const teams = await prisma.team.findMany()
     * 
     * // Get first 10 Teams
     * const teams = await prisma.team.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const teamWithIdOnly = await prisma.team.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TeamFindManyArgs>(args?: SelectSubset<T, TeamFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Team.
     * @param {TeamCreateArgs} args - Arguments to create a Team.
     * @example
     * // Create one Team
     * const Team = await prisma.team.create({
     *   data: {
     *     // ... data to create a Team
     *   }
     * })
     * 
     */
    create<T extends TeamCreateArgs>(args: SelectSubset<T, TeamCreateArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Teams.
     * @param {TeamCreateManyArgs} args - Arguments to create many Teams.
     * @example
     * // Create many Teams
     * const team = await prisma.team.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TeamCreateManyArgs>(args?: SelectSubset<T, TeamCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Teams and returns the data saved in the database.
     * @param {TeamCreateManyAndReturnArgs} args - Arguments to create many Teams.
     * @example
     * // Create many Teams
     * const team = await prisma.team.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Teams and only return the `id`
     * const teamWithIdOnly = await prisma.team.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TeamCreateManyAndReturnArgs>(args?: SelectSubset<T, TeamCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Team.
     * @param {TeamDeleteArgs} args - Arguments to delete one Team.
     * @example
     * // Delete one Team
     * const Team = await prisma.team.delete({
     *   where: {
     *     // ... filter to delete one Team
     *   }
     * })
     * 
     */
    delete<T extends TeamDeleteArgs>(args: SelectSubset<T, TeamDeleteArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Team.
     * @param {TeamUpdateArgs} args - Arguments to update one Team.
     * @example
     * // Update one Team
     * const team = await prisma.team.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TeamUpdateArgs>(args: SelectSubset<T, TeamUpdateArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Teams.
     * @param {TeamDeleteManyArgs} args - Arguments to filter Teams to delete.
     * @example
     * // Delete a few Teams
     * const { count } = await prisma.team.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TeamDeleteManyArgs>(args?: SelectSubset<T, TeamDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Teams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Teams
     * const team = await prisma.team.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TeamUpdateManyArgs>(args: SelectSubset<T, TeamUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Team.
     * @param {TeamUpsertArgs} args - Arguments to update or create a Team.
     * @example
     * // Update or create a Team
     * const team = await prisma.team.upsert({
     *   create: {
     *     // ... data to create a Team
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Team we want to update
     *   }
     * })
     */
    upsert<T extends TeamUpsertArgs>(args: SelectSubset<T, TeamUpsertArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Teams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamCountArgs} args - Arguments to filter Teams to count.
     * @example
     * // Count the number of Teams
     * const count = await prisma.team.count({
     *   where: {
     *     // ... the filter for the Teams we want to count
     *   }
     * })
    **/
    count<T extends TeamCountArgs>(
      args?: Subset<T, TeamCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TeamCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Team.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TeamAggregateArgs>(args: Subset<T, TeamAggregateArgs>): Prisma.PrismaPromise<GetTeamAggregateType<T>>

    /**
     * Group by Team.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TeamGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TeamGroupByArgs['orderBy'] }
        : { orderBy?: TeamGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TeamGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeamGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Team model
   */
  readonly fields: TeamFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Team.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TeamClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Users<T extends Team$UsersArgs<ExtArgs> = {}>(args?: Subset<T, Team$UsersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany"> | Null>
    Tasks<T extends Team$TasksArgs<ExtArgs> = {}>(args?: Subset<T, Team$TasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany"> | Null>
    Workspace<T extends WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WorkspaceDefaultArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    Project<T extends Team$ProjectArgs<ExtArgs> = {}>(args?: Subset<T, Team$ProjectArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Team model
   */ 
  interface TeamFieldRefs {
    readonly id: FieldRef<"Team", 'String'>
    readonly name: FieldRef<"Team", 'String'>
    readonly identifier: FieldRef<"Team", 'String'>
    readonly workspaceId: FieldRef<"Team", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Team findUnique
   */
  export type TeamFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team findUniqueOrThrow
   */
  export type TeamFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team findFirst
   */
  export type TeamFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Teams.
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Teams.
     */
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * Team findFirstOrThrow
   */
  export type TeamFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Teams.
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Teams.
     */
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * Team findMany
   */
  export type TeamFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Teams to fetch.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Teams.
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * Team create
   */
  export type TeamCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * The data needed to create a Team.
     */
    data: XOR<TeamCreateInput, TeamUncheckedCreateInput>
  }

  /**
   * Team createMany
   */
  export type TeamCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Teams.
     */
    data: TeamCreateManyInput | TeamCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Team createManyAndReturn
   */
  export type TeamCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Teams.
     */
    data: TeamCreateManyInput | TeamCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Team update
   */
  export type TeamUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * The data needed to update a Team.
     */
    data: XOR<TeamUpdateInput, TeamUncheckedUpdateInput>
    /**
     * Choose, which Team to update.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team updateMany
   */
  export type TeamUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Teams.
     */
    data: XOR<TeamUpdateManyMutationInput, TeamUncheckedUpdateManyInput>
    /**
     * Filter which Teams to update
     */
    where?: TeamWhereInput
  }

  /**
   * Team upsert
   */
  export type TeamUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * The filter to search for the Team to update in case it exists.
     */
    where: TeamWhereUniqueInput
    /**
     * In case the Team found by the `where` argument doesn't exist, create a new Team with this data.
     */
    create: XOR<TeamCreateInput, TeamUncheckedCreateInput>
    /**
     * In case the Team was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TeamUpdateInput, TeamUncheckedUpdateInput>
  }

  /**
   * Team delete
   */
  export type TeamDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter which Team to delete.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team deleteMany
   */
  export type TeamDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Teams to delete
     */
    where?: TeamWhereInput
  }

  /**
   * Team.Users
   */
  export type Team$UsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Team.Tasks
   */
  export type Team$TasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    cursor?: TaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Team.Project
   */
  export type Team$ProjectArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    cursor?: ProjectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Team without action
   */
  export type TeamDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    username: string | null
    email: string | null
    password: string | null
    verified: boolean | null
    lastLogin: Date | null
    onBoarding: boolean | null
    defaultWorkspaceId: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    username: string | null
    email: string | null
    password: string | null
    verified: boolean | null
    lastLogin: Date | null
    onBoarding: boolean | null
    defaultWorkspaceId: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    username: number
    email: number
    password: number
    verified: number
    lastLogin: number
    onBoarding: number
    defaultWorkspaceId: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    username?: true
    email?: true
    password?: true
    verified?: true
    lastLogin?: true
    onBoarding?: true
    defaultWorkspaceId?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    username?: true
    email?: true
    password?: true
    verified?: true
    lastLogin?: true
    onBoarding?: true
    defaultWorkspaceId?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    username?: true
    email?: true
    password?: true
    verified?: true
    lastLogin?: true
    onBoarding?: true
    defaultWorkspaceId?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    username: string | null
    email: string
    password: string
    verified: boolean
    lastLogin: Date
    onBoarding: boolean
    defaultWorkspaceId: string | null
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    verified?: boolean
    lastLogin?: boolean
    onBoarding?: boolean
    defaultWorkspaceId?: boolean
    DefaultWorkspace?: boolean | User$DefaultWorkspaceArgs<ExtArgs>
    Workspaces?: boolean | User$WorkspacesArgs<ExtArgs>
    Teams?: boolean | User$TeamsArgs<ExtArgs>
    Notification?: boolean | User$NotificationArgs<ExtArgs>
    Comment?: boolean | User$CommentArgs<ExtArgs>
    Task?: boolean | User$TaskArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    verified?: boolean
    lastLogin?: boolean
    onBoarding?: boolean
    defaultWorkspaceId?: boolean
    DefaultWorkspace?: boolean | User$DefaultWorkspaceArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    verified?: boolean
    lastLogin?: boolean
    onBoarding?: boolean
    defaultWorkspaceId?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    DefaultWorkspace?: boolean | User$DefaultWorkspaceArgs<ExtArgs>
    Workspaces?: boolean | User$WorkspacesArgs<ExtArgs>
    Teams?: boolean | User$TeamsArgs<ExtArgs>
    Notification?: boolean | User$NotificationArgs<ExtArgs>
    Comment?: boolean | User$CommentArgs<ExtArgs>
    Task?: boolean | User$TaskArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    DefaultWorkspace?: boolean | User$DefaultWorkspaceArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      DefaultWorkspace: Prisma.$WorkspacePayload<ExtArgs> | null
      Workspaces: Prisma.$WorkspacePayload<ExtArgs>[]
      Teams: Prisma.$TeamPayload<ExtArgs>[]
      Notification: Prisma.$NotificationPayload<ExtArgs>[]
      Comment: Prisma.$CommentPayload<ExtArgs>[]
      Task: Prisma.$TaskPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      username: string | null
      email: string
      password: string
      verified: boolean
      lastLogin: Date
      onBoarding: boolean
      defaultWorkspaceId: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    DefaultWorkspace<T extends User$DefaultWorkspaceArgs<ExtArgs> = {}>(args?: Subset<T, User$DefaultWorkspaceArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    Workspaces<T extends User$WorkspacesArgs<ExtArgs> = {}>(args?: Subset<T, User$WorkspacesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findMany"> | Null>
    Teams<T extends User$TeamsArgs<ExtArgs> = {}>(args?: Subset<T, User$TeamsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findMany"> | Null>
    Notification<T extends User$NotificationArgs<ExtArgs> = {}>(args?: Subset<T, User$NotificationArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany"> | Null>
    Comment<T extends User$CommentArgs<ExtArgs> = {}>(args?: Subset<T, User$CommentArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany"> | Null>
    Task<T extends User$TaskArgs<ExtArgs> = {}>(args?: Subset<T, User$TaskArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly verified: FieldRef<"User", 'Boolean'>
    readonly lastLogin: FieldRef<"User", 'DateTime'>
    readonly onBoarding: FieldRef<"User", 'Boolean'>
    readonly defaultWorkspaceId: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.DefaultWorkspace
   */
  export type User$DefaultWorkspaceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    where?: WorkspaceWhereInput
  }

  /**
   * User.Workspaces
   */
  export type User$WorkspacesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    where?: WorkspaceWhereInput
    orderBy?: WorkspaceOrderByWithRelationInput | WorkspaceOrderByWithRelationInput[]
    cursor?: WorkspaceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WorkspaceScalarFieldEnum | WorkspaceScalarFieldEnum[]
  }

  /**
   * User.Teams
   */
  export type User$TeamsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    where?: TeamWhereInput
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    cursor?: TeamWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * User.Notification
   */
  export type User$NotificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * User.Comment
   */
  export type User$CommentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null
    where?: CommentWhereInput
    orderBy?: CommentOrderByWithRelationInput | CommentOrderByWithRelationInput[]
    cursor?: CommentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[]
  }

  /**
   * User.Task
   */
  export type User$TaskArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    cursor?: TaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Workspace
   */

  export type AggregateWorkspace = {
    _count: WorkspaceCountAggregateOutputType | null
    _avg: WorkspaceAvgAggregateOutputType | null
    _sum: WorkspaceSumAggregateOutputType | null
    _min: WorkspaceMinAggregateOutputType | null
    _max: WorkspaceMaxAggregateOutputType | null
  }

  export type WorkspaceAvgAggregateOutputType = {
    companySize: number | null
    issuesCreated: number | null
  }

  export type WorkspaceSumAggregateOutputType = {
    companySize: number | null
    issuesCreated: number | null
  }

  export type WorkspaceMinAggregateOutputType = {
    id: string | null
    name: string | null
    url: string | null
    companySize: number | null
    issuesCreated: number | null
    universalTokenLinkId: string | null
    githubRepoInfoId: string | null
  }

  export type WorkspaceMaxAggregateOutputType = {
    id: string | null
    name: string | null
    url: string | null
    companySize: number | null
    issuesCreated: number | null
    universalTokenLinkId: string | null
    githubRepoInfoId: string | null
  }

  export type WorkspaceCountAggregateOutputType = {
    id: number
    name: number
    url: number
    companySize: number
    issuesCreated: number
    universalTokenLinkId: number
    githubRepoInfoId: number
    _all: number
  }


  export type WorkspaceAvgAggregateInputType = {
    companySize?: true
    issuesCreated?: true
  }

  export type WorkspaceSumAggregateInputType = {
    companySize?: true
    issuesCreated?: true
  }

  export type WorkspaceMinAggregateInputType = {
    id?: true
    name?: true
    url?: true
    companySize?: true
    issuesCreated?: true
    universalTokenLinkId?: true
    githubRepoInfoId?: true
  }

  export type WorkspaceMaxAggregateInputType = {
    id?: true
    name?: true
    url?: true
    companySize?: true
    issuesCreated?: true
    universalTokenLinkId?: true
    githubRepoInfoId?: true
  }

  export type WorkspaceCountAggregateInputType = {
    id?: true
    name?: true
    url?: true
    companySize?: true
    issuesCreated?: true
    universalTokenLinkId?: true
    githubRepoInfoId?: true
    _all?: true
  }

  export type WorkspaceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Workspace to aggregate.
     */
    where?: WorkspaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workspaces to fetch.
     */
    orderBy?: WorkspaceOrderByWithRelationInput | WorkspaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WorkspaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workspaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workspaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Workspaces
    **/
    _count?: true | WorkspaceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WorkspaceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WorkspaceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WorkspaceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WorkspaceMaxAggregateInputType
  }

  export type GetWorkspaceAggregateType<T extends WorkspaceAggregateArgs> = {
        [P in keyof T & keyof AggregateWorkspace]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorkspace[P]>
      : GetScalarType<T[P], AggregateWorkspace[P]>
  }




  export type WorkspaceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkspaceWhereInput
    orderBy?: WorkspaceOrderByWithAggregationInput | WorkspaceOrderByWithAggregationInput[]
    by: WorkspaceScalarFieldEnum[] | WorkspaceScalarFieldEnum
    having?: WorkspaceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WorkspaceCountAggregateInputType | true
    _avg?: WorkspaceAvgAggregateInputType
    _sum?: WorkspaceSumAggregateInputType
    _min?: WorkspaceMinAggregateInputType
    _max?: WorkspaceMaxAggregateInputType
  }

  export type WorkspaceGroupByOutputType = {
    id: string
    name: string | null
    url: string | null
    companySize: number | null
    issuesCreated: number | null
    universalTokenLinkId: string | null
    githubRepoInfoId: string | null
    _count: WorkspaceCountAggregateOutputType | null
    _avg: WorkspaceAvgAggregateOutputType | null
    _sum: WorkspaceSumAggregateOutputType | null
    _min: WorkspaceMinAggregateOutputType | null
    _max: WorkspaceMaxAggregateOutputType | null
  }

  type GetWorkspaceGroupByPayload<T extends WorkspaceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WorkspaceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WorkspaceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorkspaceGroupByOutputType[P]>
            : GetScalarType<T[P], WorkspaceGroupByOutputType[P]>
        }
      >
    >


  export type WorkspaceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    url?: boolean
    companySize?: boolean
    issuesCreated?: boolean
    universalTokenLinkId?: boolean
    githubRepoInfoId?: boolean
    universalTokenLink?: boolean | Workspace$universalTokenLinkArgs<ExtArgs>
    teams?: boolean | Workspace$teamsArgs<ExtArgs>
    projects?: boolean | Workspace$projectsArgs<ExtArgs>
    githubRepoInfo?: boolean | Workspace$githubRepoInfoArgs<ExtArgs>
    Users?: boolean | Workspace$UsersArgs<ExtArgs>
    User?: boolean | Workspace$UserArgs<ExtArgs>
    _count?: boolean | WorkspaceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workspace"]>

  export type WorkspaceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    url?: boolean
    companySize?: boolean
    issuesCreated?: boolean
    universalTokenLinkId?: boolean
    githubRepoInfoId?: boolean
    universalTokenLink?: boolean | Workspace$universalTokenLinkArgs<ExtArgs>
    githubRepoInfo?: boolean | Workspace$githubRepoInfoArgs<ExtArgs>
  }, ExtArgs["result"]["workspace"]>

  export type WorkspaceSelectScalar = {
    id?: boolean
    name?: boolean
    url?: boolean
    companySize?: boolean
    issuesCreated?: boolean
    universalTokenLinkId?: boolean
    githubRepoInfoId?: boolean
  }

  export type WorkspaceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    universalTokenLink?: boolean | Workspace$universalTokenLinkArgs<ExtArgs>
    teams?: boolean | Workspace$teamsArgs<ExtArgs>
    projects?: boolean | Workspace$projectsArgs<ExtArgs>
    githubRepoInfo?: boolean | Workspace$githubRepoInfoArgs<ExtArgs>
    Users?: boolean | Workspace$UsersArgs<ExtArgs>
    User?: boolean | Workspace$UserArgs<ExtArgs>
    _count?: boolean | WorkspaceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WorkspaceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    universalTokenLink?: boolean | Workspace$universalTokenLinkArgs<ExtArgs>
    githubRepoInfo?: boolean | Workspace$githubRepoInfoArgs<ExtArgs>
  }

  export type $WorkspacePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Workspace"
    objects: {
      universalTokenLink: Prisma.$UniversalTokenLinkPayload<ExtArgs> | null
      teams: Prisma.$TeamPayload<ExtArgs>[]
      projects: Prisma.$ProjectPayload<ExtArgs>[]
      githubRepoInfo: Prisma.$GithubRepoInfoPayload<ExtArgs> | null
      Users: Prisma.$UserPayload<ExtArgs>[]
      User: Prisma.$UserPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string | null
      url: string | null
      companySize: number | null
      issuesCreated: number | null
      universalTokenLinkId: string | null
      githubRepoInfoId: string | null
    }, ExtArgs["result"]["workspace"]>
    composites: {}
  }

  type WorkspaceGetPayload<S extends boolean | null | undefined | WorkspaceDefaultArgs> = $Result.GetResult<Prisma.$WorkspacePayload, S>

  type WorkspaceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<WorkspaceFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: WorkspaceCountAggregateInputType | true
    }

  export interface WorkspaceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Workspace'], meta: { name: 'Workspace' } }
    /**
     * Find zero or one Workspace that matches the filter.
     * @param {WorkspaceFindUniqueArgs} args - Arguments to find a Workspace
     * @example
     * // Get one Workspace
     * const workspace = await prisma.workspace.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkspaceFindUniqueArgs>(args: SelectSubset<T, WorkspaceFindUniqueArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Workspace that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {WorkspaceFindUniqueOrThrowArgs} args - Arguments to find a Workspace
     * @example
     * // Get one Workspace
     * const workspace = await prisma.workspace.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkspaceFindUniqueOrThrowArgs>(args: SelectSubset<T, WorkspaceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Workspace that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceFindFirstArgs} args - Arguments to find a Workspace
     * @example
     * // Get one Workspace
     * const workspace = await prisma.workspace.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkspaceFindFirstArgs>(args?: SelectSubset<T, WorkspaceFindFirstArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Workspace that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceFindFirstOrThrowArgs} args - Arguments to find a Workspace
     * @example
     * // Get one Workspace
     * const workspace = await prisma.workspace.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkspaceFindFirstOrThrowArgs>(args?: SelectSubset<T, WorkspaceFindFirstOrThrowArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Workspaces that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Workspaces
     * const workspaces = await prisma.workspace.findMany()
     * 
     * // Get first 10 Workspaces
     * const workspaces = await prisma.workspace.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const workspaceWithIdOnly = await prisma.workspace.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WorkspaceFindManyArgs>(args?: SelectSubset<T, WorkspaceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Workspace.
     * @param {WorkspaceCreateArgs} args - Arguments to create a Workspace.
     * @example
     * // Create one Workspace
     * const Workspace = await prisma.workspace.create({
     *   data: {
     *     // ... data to create a Workspace
     *   }
     * })
     * 
     */
    create<T extends WorkspaceCreateArgs>(args: SelectSubset<T, WorkspaceCreateArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Workspaces.
     * @param {WorkspaceCreateManyArgs} args - Arguments to create many Workspaces.
     * @example
     * // Create many Workspaces
     * const workspace = await prisma.workspace.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WorkspaceCreateManyArgs>(args?: SelectSubset<T, WorkspaceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Workspaces and returns the data saved in the database.
     * @param {WorkspaceCreateManyAndReturnArgs} args - Arguments to create many Workspaces.
     * @example
     * // Create many Workspaces
     * const workspace = await prisma.workspace.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Workspaces and only return the `id`
     * const workspaceWithIdOnly = await prisma.workspace.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WorkspaceCreateManyAndReturnArgs>(args?: SelectSubset<T, WorkspaceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Workspace.
     * @param {WorkspaceDeleteArgs} args - Arguments to delete one Workspace.
     * @example
     * // Delete one Workspace
     * const Workspace = await prisma.workspace.delete({
     *   where: {
     *     // ... filter to delete one Workspace
     *   }
     * })
     * 
     */
    delete<T extends WorkspaceDeleteArgs>(args: SelectSubset<T, WorkspaceDeleteArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Workspace.
     * @param {WorkspaceUpdateArgs} args - Arguments to update one Workspace.
     * @example
     * // Update one Workspace
     * const workspace = await prisma.workspace.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WorkspaceUpdateArgs>(args: SelectSubset<T, WorkspaceUpdateArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Workspaces.
     * @param {WorkspaceDeleteManyArgs} args - Arguments to filter Workspaces to delete.
     * @example
     * // Delete a few Workspaces
     * const { count } = await prisma.workspace.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WorkspaceDeleteManyArgs>(args?: SelectSubset<T, WorkspaceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Workspaces.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Workspaces
     * const workspace = await prisma.workspace.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WorkspaceUpdateManyArgs>(args: SelectSubset<T, WorkspaceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Workspace.
     * @param {WorkspaceUpsertArgs} args - Arguments to update or create a Workspace.
     * @example
     * // Update or create a Workspace
     * const workspace = await prisma.workspace.upsert({
     *   create: {
     *     // ... data to create a Workspace
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Workspace we want to update
     *   }
     * })
     */
    upsert<T extends WorkspaceUpsertArgs>(args: SelectSubset<T, WorkspaceUpsertArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Workspaces.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceCountArgs} args - Arguments to filter Workspaces to count.
     * @example
     * // Count the number of Workspaces
     * const count = await prisma.workspace.count({
     *   where: {
     *     // ... the filter for the Workspaces we want to count
     *   }
     * })
    **/
    count<T extends WorkspaceCountArgs>(
      args?: Subset<T, WorkspaceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorkspaceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Workspace.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WorkspaceAggregateArgs>(args: Subset<T, WorkspaceAggregateArgs>): Prisma.PrismaPromise<GetWorkspaceAggregateType<T>>

    /**
     * Group by Workspace.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkspaceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WorkspaceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WorkspaceGroupByArgs['orderBy'] }
        : { orderBy?: WorkspaceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WorkspaceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkspaceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Workspace model
   */
  readonly fields: WorkspaceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Workspace.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorkspaceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    universalTokenLink<T extends Workspace$universalTokenLinkArgs<ExtArgs> = {}>(args?: Subset<T, Workspace$universalTokenLinkArgs<ExtArgs>>): Prisma__UniversalTokenLinkClient<$Result.GetResult<Prisma.$UniversalTokenLinkPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    teams<T extends Workspace$teamsArgs<ExtArgs> = {}>(args?: Subset<T, Workspace$teamsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findMany"> | Null>
    projects<T extends Workspace$projectsArgs<ExtArgs> = {}>(args?: Subset<T, Workspace$projectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany"> | Null>
    githubRepoInfo<T extends Workspace$githubRepoInfoArgs<ExtArgs> = {}>(args?: Subset<T, Workspace$githubRepoInfoArgs<ExtArgs>>): Prisma__GithubRepoInfoClient<$Result.GetResult<Prisma.$GithubRepoInfoPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    Users<T extends Workspace$UsersArgs<ExtArgs> = {}>(args?: Subset<T, Workspace$UsersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany"> | Null>
    User<T extends Workspace$UserArgs<ExtArgs> = {}>(args?: Subset<T, Workspace$UserArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Workspace model
   */ 
  interface WorkspaceFieldRefs {
    readonly id: FieldRef<"Workspace", 'String'>
    readonly name: FieldRef<"Workspace", 'String'>
    readonly url: FieldRef<"Workspace", 'String'>
    readonly companySize: FieldRef<"Workspace", 'Int'>
    readonly issuesCreated: FieldRef<"Workspace", 'Int'>
    readonly universalTokenLinkId: FieldRef<"Workspace", 'String'>
    readonly githubRepoInfoId: FieldRef<"Workspace", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Workspace findUnique
   */
  export type WorkspaceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which Workspace to fetch.
     */
    where: WorkspaceWhereUniqueInput
  }

  /**
   * Workspace findUniqueOrThrow
   */
  export type WorkspaceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which Workspace to fetch.
     */
    where: WorkspaceWhereUniqueInput
  }

  /**
   * Workspace findFirst
   */
  export type WorkspaceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which Workspace to fetch.
     */
    where?: WorkspaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workspaces to fetch.
     */
    orderBy?: WorkspaceOrderByWithRelationInput | WorkspaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Workspaces.
     */
    cursor?: WorkspaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workspaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workspaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Workspaces.
     */
    distinct?: WorkspaceScalarFieldEnum | WorkspaceScalarFieldEnum[]
  }

  /**
   * Workspace findFirstOrThrow
   */
  export type WorkspaceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which Workspace to fetch.
     */
    where?: WorkspaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workspaces to fetch.
     */
    orderBy?: WorkspaceOrderByWithRelationInput | WorkspaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Workspaces.
     */
    cursor?: WorkspaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workspaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workspaces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Workspaces.
     */
    distinct?: WorkspaceScalarFieldEnum | WorkspaceScalarFieldEnum[]
  }

  /**
   * Workspace findMany
   */
  export type WorkspaceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter, which Workspaces to fetch.
     */
    where?: WorkspaceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Workspaces to fetch.
     */
    orderBy?: WorkspaceOrderByWithRelationInput | WorkspaceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Workspaces.
     */
    cursor?: WorkspaceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Workspaces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Workspaces.
     */
    skip?: number
    distinct?: WorkspaceScalarFieldEnum | WorkspaceScalarFieldEnum[]
  }

  /**
   * Workspace create
   */
  export type WorkspaceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * The data needed to create a Workspace.
     */
    data?: XOR<WorkspaceCreateInput, WorkspaceUncheckedCreateInput>
  }

  /**
   * Workspace createMany
   */
  export type WorkspaceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Workspaces.
     */
    data: WorkspaceCreateManyInput | WorkspaceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Workspace createManyAndReturn
   */
  export type WorkspaceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Workspaces.
     */
    data: WorkspaceCreateManyInput | WorkspaceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Workspace update
   */
  export type WorkspaceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * The data needed to update a Workspace.
     */
    data: XOR<WorkspaceUpdateInput, WorkspaceUncheckedUpdateInput>
    /**
     * Choose, which Workspace to update.
     */
    where: WorkspaceWhereUniqueInput
  }

  /**
   * Workspace updateMany
   */
  export type WorkspaceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Workspaces.
     */
    data: XOR<WorkspaceUpdateManyMutationInput, WorkspaceUncheckedUpdateManyInput>
    /**
     * Filter which Workspaces to update
     */
    where?: WorkspaceWhereInput
  }

  /**
   * Workspace upsert
   */
  export type WorkspaceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * The filter to search for the Workspace to update in case it exists.
     */
    where: WorkspaceWhereUniqueInput
    /**
     * In case the Workspace found by the `where` argument doesn't exist, create a new Workspace with this data.
     */
    create: XOR<WorkspaceCreateInput, WorkspaceUncheckedCreateInput>
    /**
     * In case the Workspace was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorkspaceUpdateInput, WorkspaceUncheckedUpdateInput>
  }

  /**
   * Workspace delete
   */
  export type WorkspaceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    /**
     * Filter which Workspace to delete.
     */
    where: WorkspaceWhereUniqueInput
  }

  /**
   * Workspace deleteMany
   */
  export type WorkspaceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Workspaces to delete
     */
    where?: WorkspaceWhereInput
  }

  /**
   * Workspace.universalTokenLink
   */
  export type Workspace$universalTokenLinkArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UniversalTokenLink
     */
    select?: UniversalTokenLinkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversalTokenLinkInclude<ExtArgs> | null
    where?: UniversalTokenLinkWhereInput
  }

  /**
   * Workspace.teams
   */
  export type Workspace$teamsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    where?: TeamWhereInput
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    cursor?: TeamWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * Workspace.projects
   */
  export type Workspace$projectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    cursor?: ProjectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Workspace.githubRepoInfo
   */
  export type Workspace$githubRepoInfoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GithubRepoInfo
     */
    select?: GithubRepoInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GithubRepoInfoInclude<ExtArgs> | null
    where?: GithubRepoInfoWhereInput
  }

  /**
   * Workspace.Users
   */
  export type Workspace$UsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Workspace.User
   */
  export type Workspace$UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Workspace without action
   */
  export type WorkspaceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
  }


  /**
   * Model UniversalTokenLink
   */

  export type AggregateUniversalTokenLink = {
    _count: UniversalTokenLinkCountAggregateOutputType | null
    _min: UniversalTokenLinkMinAggregateOutputType | null
    _max: UniversalTokenLinkMaxAggregateOutputType | null
  }

  export type UniversalTokenLinkMinAggregateOutputType = {
    id: string | null
    token: string | null
    isEnabled: boolean | null
  }

  export type UniversalTokenLinkMaxAggregateOutputType = {
    id: string | null
    token: string | null
    isEnabled: boolean | null
  }

  export type UniversalTokenLinkCountAggregateOutputType = {
    id: number
    token: number
    isEnabled: number
    _all: number
  }


  export type UniversalTokenLinkMinAggregateInputType = {
    id?: true
    token?: true
    isEnabled?: true
  }

  export type UniversalTokenLinkMaxAggregateInputType = {
    id?: true
    token?: true
    isEnabled?: true
  }

  export type UniversalTokenLinkCountAggregateInputType = {
    id?: true
    token?: true
    isEnabled?: true
    _all?: true
  }

  export type UniversalTokenLinkAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UniversalTokenLink to aggregate.
     */
    where?: UniversalTokenLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UniversalTokenLinks to fetch.
     */
    orderBy?: UniversalTokenLinkOrderByWithRelationInput | UniversalTokenLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UniversalTokenLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UniversalTokenLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UniversalTokenLinks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UniversalTokenLinks
    **/
    _count?: true | UniversalTokenLinkCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UniversalTokenLinkMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UniversalTokenLinkMaxAggregateInputType
  }

  export type GetUniversalTokenLinkAggregateType<T extends UniversalTokenLinkAggregateArgs> = {
        [P in keyof T & keyof AggregateUniversalTokenLink]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUniversalTokenLink[P]>
      : GetScalarType<T[P], AggregateUniversalTokenLink[P]>
  }




  export type UniversalTokenLinkGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UniversalTokenLinkWhereInput
    orderBy?: UniversalTokenLinkOrderByWithAggregationInput | UniversalTokenLinkOrderByWithAggregationInput[]
    by: UniversalTokenLinkScalarFieldEnum[] | UniversalTokenLinkScalarFieldEnum
    having?: UniversalTokenLinkScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UniversalTokenLinkCountAggregateInputType | true
    _min?: UniversalTokenLinkMinAggregateInputType
    _max?: UniversalTokenLinkMaxAggregateInputType
  }

  export type UniversalTokenLinkGroupByOutputType = {
    id: string
    token: string
    isEnabled: boolean
    _count: UniversalTokenLinkCountAggregateOutputType | null
    _min: UniversalTokenLinkMinAggregateOutputType | null
    _max: UniversalTokenLinkMaxAggregateOutputType | null
  }

  type GetUniversalTokenLinkGroupByPayload<T extends UniversalTokenLinkGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UniversalTokenLinkGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UniversalTokenLinkGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UniversalTokenLinkGroupByOutputType[P]>
            : GetScalarType<T[P], UniversalTokenLinkGroupByOutputType[P]>
        }
      >
    >


  export type UniversalTokenLinkSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    isEnabled?: boolean
    Workspace?: boolean | UniversalTokenLink$WorkspaceArgs<ExtArgs>
    _count?: boolean | UniversalTokenLinkCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["universalTokenLink"]>

  export type UniversalTokenLinkSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    token?: boolean
    isEnabled?: boolean
  }, ExtArgs["result"]["universalTokenLink"]>

  export type UniversalTokenLinkSelectScalar = {
    id?: boolean
    token?: boolean
    isEnabled?: boolean
  }

  export type UniversalTokenLinkInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Workspace?: boolean | UniversalTokenLink$WorkspaceArgs<ExtArgs>
    _count?: boolean | UniversalTokenLinkCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UniversalTokenLinkIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UniversalTokenLinkPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UniversalTokenLink"
    objects: {
      Workspace: Prisma.$WorkspacePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      token: string
      isEnabled: boolean
    }, ExtArgs["result"]["universalTokenLink"]>
    composites: {}
  }

  type UniversalTokenLinkGetPayload<S extends boolean | null | undefined | UniversalTokenLinkDefaultArgs> = $Result.GetResult<Prisma.$UniversalTokenLinkPayload, S>

  type UniversalTokenLinkCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UniversalTokenLinkFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UniversalTokenLinkCountAggregateInputType | true
    }

  export interface UniversalTokenLinkDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UniversalTokenLink'], meta: { name: 'UniversalTokenLink' } }
    /**
     * Find zero or one UniversalTokenLink that matches the filter.
     * @param {UniversalTokenLinkFindUniqueArgs} args - Arguments to find a UniversalTokenLink
     * @example
     * // Get one UniversalTokenLink
     * const universalTokenLink = await prisma.universalTokenLink.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UniversalTokenLinkFindUniqueArgs>(args: SelectSubset<T, UniversalTokenLinkFindUniqueArgs<ExtArgs>>): Prisma__UniversalTokenLinkClient<$Result.GetResult<Prisma.$UniversalTokenLinkPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one UniversalTokenLink that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UniversalTokenLinkFindUniqueOrThrowArgs} args - Arguments to find a UniversalTokenLink
     * @example
     * // Get one UniversalTokenLink
     * const universalTokenLink = await prisma.universalTokenLink.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UniversalTokenLinkFindUniqueOrThrowArgs>(args: SelectSubset<T, UniversalTokenLinkFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UniversalTokenLinkClient<$Result.GetResult<Prisma.$UniversalTokenLinkPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first UniversalTokenLink that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UniversalTokenLinkFindFirstArgs} args - Arguments to find a UniversalTokenLink
     * @example
     * // Get one UniversalTokenLink
     * const universalTokenLink = await prisma.universalTokenLink.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UniversalTokenLinkFindFirstArgs>(args?: SelectSubset<T, UniversalTokenLinkFindFirstArgs<ExtArgs>>): Prisma__UniversalTokenLinkClient<$Result.GetResult<Prisma.$UniversalTokenLinkPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first UniversalTokenLink that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UniversalTokenLinkFindFirstOrThrowArgs} args - Arguments to find a UniversalTokenLink
     * @example
     * // Get one UniversalTokenLink
     * const universalTokenLink = await prisma.universalTokenLink.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UniversalTokenLinkFindFirstOrThrowArgs>(args?: SelectSubset<T, UniversalTokenLinkFindFirstOrThrowArgs<ExtArgs>>): Prisma__UniversalTokenLinkClient<$Result.GetResult<Prisma.$UniversalTokenLinkPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more UniversalTokenLinks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UniversalTokenLinkFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UniversalTokenLinks
     * const universalTokenLinks = await prisma.universalTokenLink.findMany()
     * 
     * // Get first 10 UniversalTokenLinks
     * const universalTokenLinks = await prisma.universalTokenLink.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const universalTokenLinkWithIdOnly = await prisma.universalTokenLink.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UniversalTokenLinkFindManyArgs>(args?: SelectSubset<T, UniversalTokenLinkFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UniversalTokenLinkPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a UniversalTokenLink.
     * @param {UniversalTokenLinkCreateArgs} args - Arguments to create a UniversalTokenLink.
     * @example
     * // Create one UniversalTokenLink
     * const UniversalTokenLink = await prisma.universalTokenLink.create({
     *   data: {
     *     // ... data to create a UniversalTokenLink
     *   }
     * })
     * 
     */
    create<T extends UniversalTokenLinkCreateArgs>(args: SelectSubset<T, UniversalTokenLinkCreateArgs<ExtArgs>>): Prisma__UniversalTokenLinkClient<$Result.GetResult<Prisma.$UniversalTokenLinkPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many UniversalTokenLinks.
     * @param {UniversalTokenLinkCreateManyArgs} args - Arguments to create many UniversalTokenLinks.
     * @example
     * // Create many UniversalTokenLinks
     * const universalTokenLink = await prisma.universalTokenLink.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UniversalTokenLinkCreateManyArgs>(args?: SelectSubset<T, UniversalTokenLinkCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UniversalTokenLinks and returns the data saved in the database.
     * @param {UniversalTokenLinkCreateManyAndReturnArgs} args - Arguments to create many UniversalTokenLinks.
     * @example
     * // Create many UniversalTokenLinks
     * const universalTokenLink = await prisma.universalTokenLink.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UniversalTokenLinks and only return the `id`
     * const universalTokenLinkWithIdOnly = await prisma.universalTokenLink.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UniversalTokenLinkCreateManyAndReturnArgs>(args?: SelectSubset<T, UniversalTokenLinkCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UniversalTokenLinkPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a UniversalTokenLink.
     * @param {UniversalTokenLinkDeleteArgs} args - Arguments to delete one UniversalTokenLink.
     * @example
     * // Delete one UniversalTokenLink
     * const UniversalTokenLink = await prisma.universalTokenLink.delete({
     *   where: {
     *     // ... filter to delete one UniversalTokenLink
     *   }
     * })
     * 
     */
    delete<T extends UniversalTokenLinkDeleteArgs>(args: SelectSubset<T, UniversalTokenLinkDeleteArgs<ExtArgs>>): Prisma__UniversalTokenLinkClient<$Result.GetResult<Prisma.$UniversalTokenLinkPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one UniversalTokenLink.
     * @param {UniversalTokenLinkUpdateArgs} args - Arguments to update one UniversalTokenLink.
     * @example
     * // Update one UniversalTokenLink
     * const universalTokenLink = await prisma.universalTokenLink.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UniversalTokenLinkUpdateArgs>(args: SelectSubset<T, UniversalTokenLinkUpdateArgs<ExtArgs>>): Prisma__UniversalTokenLinkClient<$Result.GetResult<Prisma.$UniversalTokenLinkPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more UniversalTokenLinks.
     * @param {UniversalTokenLinkDeleteManyArgs} args - Arguments to filter UniversalTokenLinks to delete.
     * @example
     * // Delete a few UniversalTokenLinks
     * const { count } = await prisma.universalTokenLink.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UniversalTokenLinkDeleteManyArgs>(args?: SelectSubset<T, UniversalTokenLinkDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UniversalTokenLinks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UniversalTokenLinkUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UniversalTokenLinks
     * const universalTokenLink = await prisma.universalTokenLink.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UniversalTokenLinkUpdateManyArgs>(args: SelectSubset<T, UniversalTokenLinkUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UniversalTokenLink.
     * @param {UniversalTokenLinkUpsertArgs} args - Arguments to update or create a UniversalTokenLink.
     * @example
     * // Update or create a UniversalTokenLink
     * const universalTokenLink = await prisma.universalTokenLink.upsert({
     *   create: {
     *     // ... data to create a UniversalTokenLink
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UniversalTokenLink we want to update
     *   }
     * })
     */
    upsert<T extends UniversalTokenLinkUpsertArgs>(args: SelectSubset<T, UniversalTokenLinkUpsertArgs<ExtArgs>>): Prisma__UniversalTokenLinkClient<$Result.GetResult<Prisma.$UniversalTokenLinkPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of UniversalTokenLinks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UniversalTokenLinkCountArgs} args - Arguments to filter UniversalTokenLinks to count.
     * @example
     * // Count the number of UniversalTokenLinks
     * const count = await prisma.universalTokenLink.count({
     *   where: {
     *     // ... the filter for the UniversalTokenLinks we want to count
     *   }
     * })
    **/
    count<T extends UniversalTokenLinkCountArgs>(
      args?: Subset<T, UniversalTokenLinkCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UniversalTokenLinkCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UniversalTokenLink.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UniversalTokenLinkAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UniversalTokenLinkAggregateArgs>(args: Subset<T, UniversalTokenLinkAggregateArgs>): Prisma.PrismaPromise<GetUniversalTokenLinkAggregateType<T>>

    /**
     * Group by UniversalTokenLink.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UniversalTokenLinkGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UniversalTokenLinkGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UniversalTokenLinkGroupByArgs['orderBy'] }
        : { orderBy?: UniversalTokenLinkGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UniversalTokenLinkGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUniversalTokenLinkGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UniversalTokenLink model
   */
  readonly fields: UniversalTokenLinkFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UniversalTokenLink.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UniversalTokenLinkClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Workspace<T extends UniversalTokenLink$WorkspaceArgs<ExtArgs> = {}>(args?: Subset<T, UniversalTokenLink$WorkspaceArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UniversalTokenLink model
   */ 
  interface UniversalTokenLinkFieldRefs {
    readonly id: FieldRef<"UniversalTokenLink", 'String'>
    readonly token: FieldRef<"UniversalTokenLink", 'String'>
    readonly isEnabled: FieldRef<"UniversalTokenLink", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * UniversalTokenLink findUnique
   */
  export type UniversalTokenLinkFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UniversalTokenLink
     */
    select?: UniversalTokenLinkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversalTokenLinkInclude<ExtArgs> | null
    /**
     * Filter, which UniversalTokenLink to fetch.
     */
    where: UniversalTokenLinkWhereUniqueInput
  }

  /**
   * UniversalTokenLink findUniqueOrThrow
   */
  export type UniversalTokenLinkFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UniversalTokenLink
     */
    select?: UniversalTokenLinkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversalTokenLinkInclude<ExtArgs> | null
    /**
     * Filter, which UniversalTokenLink to fetch.
     */
    where: UniversalTokenLinkWhereUniqueInput
  }

  /**
   * UniversalTokenLink findFirst
   */
  export type UniversalTokenLinkFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UniversalTokenLink
     */
    select?: UniversalTokenLinkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversalTokenLinkInclude<ExtArgs> | null
    /**
     * Filter, which UniversalTokenLink to fetch.
     */
    where?: UniversalTokenLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UniversalTokenLinks to fetch.
     */
    orderBy?: UniversalTokenLinkOrderByWithRelationInput | UniversalTokenLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UniversalTokenLinks.
     */
    cursor?: UniversalTokenLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UniversalTokenLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UniversalTokenLinks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UniversalTokenLinks.
     */
    distinct?: UniversalTokenLinkScalarFieldEnum | UniversalTokenLinkScalarFieldEnum[]
  }

  /**
   * UniversalTokenLink findFirstOrThrow
   */
  export type UniversalTokenLinkFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UniversalTokenLink
     */
    select?: UniversalTokenLinkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversalTokenLinkInclude<ExtArgs> | null
    /**
     * Filter, which UniversalTokenLink to fetch.
     */
    where?: UniversalTokenLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UniversalTokenLinks to fetch.
     */
    orderBy?: UniversalTokenLinkOrderByWithRelationInput | UniversalTokenLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UniversalTokenLinks.
     */
    cursor?: UniversalTokenLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UniversalTokenLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UniversalTokenLinks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UniversalTokenLinks.
     */
    distinct?: UniversalTokenLinkScalarFieldEnum | UniversalTokenLinkScalarFieldEnum[]
  }

  /**
   * UniversalTokenLink findMany
   */
  export type UniversalTokenLinkFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UniversalTokenLink
     */
    select?: UniversalTokenLinkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversalTokenLinkInclude<ExtArgs> | null
    /**
     * Filter, which UniversalTokenLinks to fetch.
     */
    where?: UniversalTokenLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UniversalTokenLinks to fetch.
     */
    orderBy?: UniversalTokenLinkOrderByWithRelationInput | UniversalTokenLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UniversalTokenLinks.
     */
    cursor?: UniversalTokenLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UniversalTokenLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UniversalTokenLinks.
     */
    skip?: number
    distinct?: UniversalTokenLinkScalarFieldEnum | UniversalTokenLinkScalarFieldEnum[]
  }

  /**
   * UniversalTokenLink create
   */
  export type UniversalTokenLinkCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UniversalTokenLink
     */
    select?: UniversalTokenLinkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversalTokenLinkInclude<ExtArgs> | null
    /**
     * The data needed to create a UniversalTokenLink.
     */
    data?: XOR<UniversalTokenLinkCreateInput, UniversalTokenLinkUncheckedCreateInput>
  }

  /**
   * UniversalTokenLink createMany
   */
  export type UniversalTokenLinkCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UniversalTokenLinks.
     */
    data: UniversalTokenLinkCreateManyInput | UniversalTokenLinkCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UniversalTokenLink createManyAndReturn
   */
  export type UniversalTokenLinkCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UniversalTokenLink
     */
    select?: UniversalTokenLinkSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many UniversalTokenLinks.
     */
    data: UniversalTokenLinkCreateManyInput | UniversalTokenLinkCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UniversalTokenLink update
   */
  export type UniversalTokenLinkUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UniversalTokenLink
     */
    select?: UniversalTokenLinkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversalTokenLinkInclude<ExtArgs> | null
    /**
     * The data needed to update a UniversalTokenLink.
     */
    data: XOR<UniversalTokenLinkUpdateInput, UniversalTokenLinkUncheckedUpdateInput>
    /**
     * Choose, which UniversalTokenLink to update.
     */
    where: UniversalTokenLinkWhereUniqueInput
  }

  /**
   * UniversalTokenLink updateMany
   */
  export type UniversalTokenLinkUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UniversalTokenLinks.
     */
    data: XOR<UniversalTokenLinkUpdateManyMutationInput, UniversalTokenLinkUncheckedUpdateManyInput>
    /**
     * Filter which UniversalTokenLinks to update
     */
    where?: UniversalTokenLinkWhereInput
  }

  /**
   * UniversalTokenLink upsert
   */
  export type UniversalTokenLinkUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UniversalTokenLink
     */
    select?: UniversalTokenLinkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversalTokenLinkInclude<ExtArgs> | null
    /**
     * The filter to search for the UniversalTokenLink to update in case it exists.
     */
    where: UniversalTokenLinkWhereUniqueInput
    /**
     * In case the UniversalTokenLink found by the `where` argument doesn't exist, create a new UniversalTokenLink with this data.
     */
    create: XOR<UniversalTokenLinkCreateInput, UniversalTokenLinkUncheckedCreateInput>
    /**
     * In case the UniversalTokenLink was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UniversalTokenLinkUpdateInput, UniversalTokenLinkUncheckedUpdateInput>
  }

  /**
   * UniversalTokenLink delete
   */
  export type UniversalTokenLinkDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UniversalTokenLink
     */
    select?: UniversalTokenLinkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversalTokenLinkInclude<ExtArgs> | null
    /**
     * Filter which UniversalTokenLink to delete.
     */
    where: UniversalTokenLinkWhereUniqueInput
  }

  /**
   * UniversalTokenLink deleteMany
   */
  export type UniversalTokenLinkDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UniversalTokenLinks to delete
     */
    where?: UniversalTokenLinkWhereInput
  }

  /**
   * UniversalTokenLink.Workspace
   */
  export type UniversalTokenLink$WorkspaceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    where?: WorkspaceWhereInput
    orderBy?: WorkspaceOrderByWithRelationInput | WorkspaceOrderByWithRelationInput[]
    cursor?: WorkspaceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WorkspaceScalarFieldEnum | WorkspaceScalarFieldEnum[]
  }

  /**
   * UniversalTokenLink without action
   */
  export type UniversalTokenLinkDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UniversalTokenLink
     */
    select?: UniversalTokenLinkSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UniversalTokenLinkInclude<ExtArgs> | null
  }


  /**
   * Model GithubRepoInfo
   */

  export type AggregateGithubRepoInfo = {
    _count: GithubRepoInfoCountAggregateOutputType | null
    _min: GithubRepoInfoMinAggregateOutputType | null
    _max: GithubRepoInfoMaxAggregateOutputType | null
  }

  export type GithubRepoInfoMinAggregateOutputType = {
    id: string | null
    repoName: string | null
    owner: string | null
  }

  export type GithubRepoInfoMaxAggregateOutputType = {
    id: string | null
    repoName: string | null
    owner: string | null
  }

  export type GithubRepoInfoCountAggregateOutputType = {
    id: number
    repoName: number
    owner: number
    _all: number
  }


  export type GithubRepoInfoMinAggregateInputType = {
    id?: true
    repoName?: true
    owner?: true
  }

  export type GithubRepoInfoMaxAggregateInputType = {
    id?: true
    repoName?: true
    owner?: true
  }

  export type GithubRepoInfoCountAggregateInputType = {
    id?: true
    repoName?: true
    owner?: true
    _all?: true
  }

  export type GithubRepoInfoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GithubRepoInfo to aggregate.
     */
    where?: GithubRepoInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GithubRepoInfos to fetch.
     */
    orderBy?: GithubRepoInfoOrderByWithRelationInput | GithubRepoInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GithubRepoInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GithubRepoInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GithubRepoInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GithubRepoInfos
    **/
    _count?: true | GithubRepoInfoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GithubRepoInfoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GithubRepoInfoMaxAggregateInputType
  }

  export type GetGithubRepoInfoAggregateType<T extends GithubRepoInfoAggregateArgs> = {
        [P in keyof T & keyof AggregateGithubRepoInfo]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGithubRepoInfo[P]>
      : GetScalarType<T[P], AggregateGithubRepoInfo[P]>
  }




  export type GithubRepoInfoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GithubRepoInfoWhereInput
    orderBy?: GithubRepoInfoOrderByWithAggregationInput | GithubRepoInfoOrderByWithAggregationInput[]
    by: GithubRepoInfoScalarFieldEnum[] | GithubRepoInfoScalarFieldEnum
    having?: GithubRepoInfoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GithubRepoInfoCountAggregateInputType | true
    _min?: GithubRepoInfoMinAggregateInputType
    _max?: GithubRepoInfoMaxAggregateInputType
  }

  export type GithubRepoInfoGroupByOutputType = {
    id: string
    repoName: string
    owner: string
    _count: GithubRepoInfoCountAggregateOutputType | null
    _min: GithubRepoInfoMinAggregateOutputType | null
    _max: GithubRepoInfoMaxAggregateOutputType | null
  }

  type GetGithubRepoInfoGroupByPayload<T extends GithubRepoInfoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GithubRepoInfoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GithubRepoInfoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GithubRepoInfoGroupByOutputType[P]>
            : GetScalarType<T[P], GithubRepoInfoGroupByOutputType[P]>
        }
      >
    >


  export type GithubRepoInfoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    repoName?: boolean
    owner?: boolean
    Workspace?: boolean | GithubRepoInfo$WorkspaceArgs<ExtArgs>
    _count?: boolean | GithubRepoInfoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["githubRepoInfo"]>

  export type GithubRepoInfoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    repoName?: boolean
    owner?: boolean
  }, ExtArgs["result"]["githubRepoInfo"]>

  export type GithubRepoInfoSelectScalar = {
    id?: boolean
    repoName?: boolean
    owner?: boolean
  }

  export type GithubRepoInfoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Workspace?: boolean | GithubRepoInfo$WorkspaceArgs<ExtArgs>
    _count?: boolean | GithubRepoInfoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type GithubRepoInfoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $GithubRepoInfoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GithubRepoInfo"
    objects: {
      Workspace: Prisma.$WorkspacePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      repoName: string
      owner: string
    }, ExtArgs["result"]["githubRepoInfo"]>
    composites: {}
  }

  type GithubRepoInfoGetPayload<S extends boolean | null | undefined | GithubRepoInfoDefaultArgs> = $Result.GetResult<Prisma.$GithubRepoInfoPayload, S>

  type GithubRepoInfoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<GithubRepoInfoFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: GithubRepoInfoCountAggregateInputType | true
    }

  export interface GithubRepoInfoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GithubRepoInfo'], meta: { name: 'GithubRepoInfo' } }
    /**
     * Find zero or one GithubRepoInfo that matches the filter.
     * @param {GithubRepoInfoFindUniqueArgs} args - Arguments to find a GithubRepoInfo
     * @example
     * // Get one GithubRepoInfo
     * const githubRepoInfo = await prisma.githubRepoInfo.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GithubRepoInfoFindUniqueArgs>(args: SelectSubset<T, GithubRepoInfoFindUniqueArgs<ExtArgs>>): Prisma__GithubRepoInfoClient<$Result.GetResult<Prisma.$GithubRepoInfoPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one GithubRepoInfo that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {GithubRepoInfoFindUniqueOrThrowArgs} args - Arguments to find a GithubRepoInfo
     * @example
     * // Get one GithubRepoInfo
     * const githubRepoInfo = await prisma.githubRepoInfo.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GithubRepoInfoFindUniqueOrThrowArgs>(args: SelectSubset<T, GithubRepoInfoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GithubRepoInfoClient<$Result.GetResult<Prisma.$GithubRepoInfoPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first GithubRepoInfo that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GithubRepoInfoFindFirstArgs} args - Arguments to find a GithubRepoInfo
     * @example
     * // Get one GithubRepoInfo
     * const githubRepoInfo = await prisma.githubRepoInfo.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GithubRepoInfoFindFirstArgs>(args?: SelectSubset<T, GithubRepoInfoFindFirstArgs<ExtArgs>>): Prisma__GithubRepoInfoClient<$Result.GetResult<Prisma.$GithubRepoInfoPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first GithubRepoInfo that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GithubRepoInfoFindFirstOrThrowArgs} args - Arguments to find a GithubRepoInfo
     * @example
     * // Get one GithubRepoInfo
     * const githubRepoInfo = await prisma.githubRepoInfo.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GithubRepoInfoFindFirstOrThrowArgs>(args?: SelectSubset<T, GithubRepoInfoFindFirstOrThrowArgs<ExtArgs>>): Prisma__GithubRepoInfoClient<$Result.GetResult<Prisma.$GithubRepoInfoPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more GithubRepoInfos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GithubRepoInfoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GithubRepoInfos
     * const githubRepoInfos = await prisma.githubRepoInfo.findMany()
     * 
     * // Get first 10 GithubRepoInfos
     * const githubRepoInfos = await prisma.githubRepoInfo.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const githubRepoInfoWithIdOnly = await prisma.githubRepoInfo.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GithubRepoInfoFindManyArgs>(args?: SelectSubset<T, GithubRepoInfoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GithubRepoInfoPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a GithubRepoInfo.
     * @param {GithubRepoInfoCreateArgs} args - Arguments to create a GithubRepoInfo.
     * @example
     * // Create one GithubRepoInfo
     * const GithubRepoInfo = await prisma.githubRepoInfo.create({
     *   data: {
     *     // ... data to create a GithubRepoInfo
     *   }
     * })
     * 
     */
    create<T extends GithubRepoInfoCreateArgs>(args: SelectSubset<T, GithubRepoInfoCreateArgs<ExtArgs>>): Prisma__GithubRepoInfoClient<$Result.GetResult<Prisma.$GithubRepoInfoPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many GithubRepoInfos.
     * @param {GithubRepoInfoCreateManyArgs} args - Arguments to create many GithubRepoInfos.
     * @example
     * // Create many GithubRepoInfos
     * const githubRepoInfo = await prisma.githubRepoInfo.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GithubRepoInfoCreateManyArgs>(args?: SelectSubset<T, GithubRepoInfoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GithubRepoInfos and returns the data saved in the database.
     * @param {GithubRepoInfoCreateManyAndReturnArgs} args - Arguments to create many GithubRepoInfos.
     * @example
     * // Create many GithubRepoInfos
     * const githubRepoInfo = await prisma.githubRepoInfo.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GithubRepoInfos and only return the `id`
     * const githubRepoInfoWithIdOnly = await prisma.githubRepoInfo.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GithubRepoInfoCreateManyAndReturnArgs>(args?: SelectSubset<T, GithubRepoInfoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GithubRepoInfoPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a GithubRepoInfo.
     * @param {GithubRepoInfoDeleteArgs} args - Arguments to delete one GithubRepoInfo.
     * @example
     * // Delete one GithubRepoInfo
     * const GithubRepoInfo = await prisma.githubRepoInfo.delete({
     *   where: {
     *     // ... filter to delete one GithubRepoInfo
     *   }
     * })
     * 
     */
    delete<T extends GithubRepoInfoDeleteArgs>(args: SelectSubset<T, GithubRepoInfoDeleteArgs<ExtArgs>>): Prisma__GithubRepoInfoClient<$Result.GetResult<Prisma.$GithubRepoInfoPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one GithubRepoInfo.
     * @param {GithubRepoInfoUpdateArgs} args - Arguments to update one GithubRepoInfo.
     * @example
     * // Update one GithubRepoInfo
     * const githubRepoInfo = await prisma.githubRepoInfo.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GithubRepoInfoUpdateArgs>(args: SelectSubset<T, GithubRepoInfoUpdateArgs<ExtArgs>>): Prisma__GithubRepoInfoClient<$Result.GetResult<Prisma.$GithubRepoInfoPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more GithubRepoInfos.
     * @param {GithubRepoInfoDeleteManyArgs} args - Arguments to filter GithubRepoInfos to delete.
     * @example
     * // Delete a few GithubRepoInfos
     * const { count } = await prisma.githubRepoInfo.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GithubRepoInfoDeleteManyArgs>(args?: SelectSubset<T, GithubRepoInfoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GithubRepoInfos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GithubRepoInfoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GithubRepoInfos
     * const githubRepoInfo = await prisma.githubRepoInfo.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GithubRepoInfoUpdateManyArgs>(args: SelectSubset<T, GithubRepoInfoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GithubRepoInfo.
     * @param {GithubRepoInfoUpsertArgs} args - Arguments to update or create a GithubRepoInfo.
     * @example
     * // Update or create a GithubRepoInfo
     * const githubRepoInfo = await prisma.githubRepoInfo.upsert({
     *   create: {
     *     // ... data to create a GithubRepoInfo
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GithubRepoInfo we want to update
     *   }
     * })
     */
    upsert<T extends GithubRepoInfoUpsertArgs>(args: SelectSubset<T, GithubRepoInfoUpsertArgs<ExtArgs>>): Prisma__GithubRepoInfoClient<$Result.GetResult<Prisma.$GithubRepoInfoPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of GithubRepoInfos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GithubRepoInfoCountArgs} args - Arguments to filter GithubRepoInfos to count.
     * @example
     * // Count the number of GithubRepoInfos
     * const count = await prisma.githubRepoInfo.count({
     *   where: {
     *     // ... the filter for the GithubRepoInfos we want to count
     *   }
     * })
    **/
    count<T extends GithubRepoInfoCountArgs>(
      args?: Subset<T, GithubRepoInfoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GithubRepoInfoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GithubRepoInfo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GithubRepoInfoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GithubRepoInfoAggregateArgs>(args: Subset<T, GithubRepoInfoAggregateArgs>): Prisma.PrismaPromise<GetGithubRepoInfoAggregateType<T>>

    /**
     * Group by GithubRepoInfo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GithubRepoInfoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GithubRepoInfoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GithubRepoInfoGroupByArgs['orderBy'] }
        : { orderBy?: GithubRepoInfoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GithubRepoInfoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGithubRepoInfoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GithubRepoInfo model
   */
  readonly fields: GithubRepoInfoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GithubRepoInfo.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GithubRepoInfoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Workspace<T extends GithubRepoInfo$WorkspaceArgs<ExtArgs> = {}>(args?: Subset<T, GithubRepoInfo$WorkspaceArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GithubRepoInfo model
   */ 
  interface GithubRepoInfoFieldRefs {
    readonly id: FieldRef<"GithubRepoInfo", 'String'>
    readonly repoName: FieldRef<"GithubRepoInfo", 'String'>
    readonly owner: FieldRef<"GithubRepoInfo", 'String'>
  }
    

  // Custom InputTypes
  /**
   * GithubRepoInfo findUnique
   */
  export type GithubRepoInfoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GithubRepoInfo
     */
    select?: GithubRepoInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GithubRepoInfoInclude<ExtArgs> | null
    /**
     * Filter, which GithubRepoInfo to fetch.
     */
    where: GithubRepoInfoWhereUniqueInput
  }

  /**
   * GithubRepoInfo findUniqueOrThrow
   */
  export type GithubRepoInfoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GithubRepoInfo
     */
    select?: GithubRepoInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GithubRepoInfoInclude<ExtArgs> | null
    /**
     * Filter, which GithubRepoInfo to fetch.
     */
    where: GithubRepoInfoWhereUniqueInput
  }

  /**
   * GithubRepoInfo findFirst
   */
  export type GithubRepoInfoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GithubRepoInfo
     */
    select?: GithubRepoInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GithubRepoInfoInclude<ExtArgs> | null
    /**
     * Filter, which GithubRepoInfo to fetch.
     */
    where?: GithubRepoInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GithubRepoInfos to fetch.
     */
    orderBy?: GithubRepoInfoOrderByWithRelationInput | GithubRepoInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GithubRepoInfos.
     */
    cursor?: GithubRepoInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GithubRepoInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GithubRepoInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GithubRepoInfos.
     */
    distinct?: GithubRepoInfoScalarFieldEnum | GithubRepoInfoScalarFieldEnum[]
  }

  /**
   * GithubRepoInfo findFirstOrThrow
   */
  export type GithubRepoInfoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GithubRepoInfo
     */
    select?: GithubRepoInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GithubRepoInfoInclude<ExtArgs> | null
    /**
     * Filter, which GithubRepoInfo to fetch.
     */
    where?: GithubRepoInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GithubRepoInfos to fetch.
     */
    orderBy?: GithubRepoInfoOrderByWithRelationInput | GithubRepoInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GithubRepoInfos.
     */
    cursor?: GithubRepoInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GithubRepoInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GithubRepoInfos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GithubRepoInfos.
     */
    distinct?: GithubRepoInfoScalarFieldEnum | GithubRepoInfoScalarFieldEnum[]
  }

  /**
   * GithubRepoInfo findMany
   */
  export type GithubRepoInfoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GithubRepoInfo
     */
    select?: GithubRepoInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GithubRepoInfoInclude<ExtArgs> | null
    /**
     * Filter, which GithubRepoInfos to fetch.
     */
    where?: GithubRepoInfoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GithubRepoInfos to fetch.
     */
    orderBy?: GithubRepoInfoOrderByWithRelationInput | GithubRepoInfoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GithubRepoInfos.
     */
    cursor?: GithubRepoInfoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GithubRepoInfos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GithubRepoInfos.
     */
    skip?: number
    distinct?: GithubRepoInfoScalarFieldEnum | GithubRepoInfoScalarFieldEnum[]
  }

  /**
   * GithubRepoInfo create
   */
  export type GithubRepoInfoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GithubRepoInfo
     */
    select?: GithubRepoInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GithubRepoInfoInclude<ExtArgs> | null
    /**
     * The data needed to create a GithubRepoInfo.
     */
    data?: XOR<GithubRepoInfoCreateInput, GithubRepoInfoUncheckedCreateInput>
  }

  /**
   * GithubRepoInfo createMany
   */
  export type GithubRepoInfoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GithubRepoInfos.
     */
    data: GithubRepoInfoCreateManyInput | GithubRepoInfoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GithubRepoInfo createManyAndReturn
   */
  export type GithubRepoInfoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GithubRepoInfo
     */
    select?: GithubRepoInfoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many GithubRepoInfos.
     */
    data: GithubRepoInfoCreateManyInput | GithubRepoInfoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GithubRepoInfo update
   */
  export type GithubRepoInfoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GithubRepoInfo
     */
    select?: GithubRepoInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GithubRepoInfoInclude<ExtArgs> | null
    /**
     * The data needed to update a GithubRepoInfo.
     */
    data: XOR<GithubRepoInfoUpdateInput, GithubRepoInfoUncheckedUpdateInput>
    /**
     * Choose, which GithubRepoInfo to update.
     */
    where: GithubRepoInfoWhereUniqueInput
  }

  /**
   * GithubRepoInfo updateMany
   */
  export type GithubRepoInfoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GithubRepoInfos.
     */
    data: XOR<GithubRepoInfoUpdateManyMutationInput, GithubRepoInfoUncheckedUpdateManyInput>
    /**
     * Filter which GithubRepoInfos to update
     */
    where?: GithubRepoInfoWhereInput
  }

  /**
   * GithubRepoInfo upsert
   */
  export type GithubRepoInfoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GithubRepoInfo
     */
    select?: GithubRepoInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GithubRepoInfoInclude<ExtArgs> | null
    /**
     * The filter to search for the GithubRepoInfo to update in case it exists.
     */
    where: GithubRepoInfoWhereUniqueInput
    /**
     * In case the GithubRepoInfo found by the `where` argument doesn't exist, create a new GithubRepoInfo with this data.
     */
    create: XOR<GithubRepoInfoCreateInput, GithubRepoInfoUncheckedCreateInput>
    /**
     * In case the GithubRepoInfo was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GithubRepoInfoUpdateInput, GithubRepoInfoUncheckedUpdateInput>
  }

  /**
   * GithubRepoInfo delete
   */
  export type GithubRepoInfoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GithubRepoInfo
     */
    select?: GithubRepoInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GithubRepoInfoInclude<ExtArgs> | null
    /**
     * Filter which GithubRepoInfo to delete.
     */
    where: GithubRepoInfoWhereUniqueInput
  }

  /**
   * GithubRepoInfo deleteMany
   */
  export type GithubRepoInfoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GithubRepoInfos to delete
     */
    where?: GithubRepoInfoWhereInput
  }

  /**
   * GithubRepoInfo.Workspace
   */
  export type GithubRepoInfo$WorkspaceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    where?: WorkspaceWhereInput
    orderBy?: WorkspaceOrderByWithRelationInput | WorkspaceOrderByWithRelationInput[]
    cursor?: WorkspaceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WorkspaceScalarFieldEnum | WorkspaceScalarFieldEnum[]
  }

  /**
   * GithubRepoInfo without action
   */
  export type GithubRepoInfoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GithubRepoInfo
     */
    select?: GithubRepoInfoSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GithubRepoInfoInclude<ExtArgs> | null
  }


  /**
   * Model Project
   */

  export type AggregateProject = {
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  export type ProjectMinAggregateOutputType = {
    id: string | null
    name: string | null
    teamId: string | null
    workspaceId: string | null
  }

  export type ProjectMaxAggregateOutputType = {
    id: string | null
    name: string | null
    teamId: string | null
    workspaceId: string | null
  }

  export type ProjectCountAggregateOutputType = {
    id: number
    name: number
    teamId: number
    workspaceId: number
    _all: number
  }


  export type ProjectMinAggregateInputType = {
    id?: true
    name?: true
    teamId?: true
    workspaceId?: true
  }

  export type ProjectMaxAggregateInputType = {
    id?: true
    name?: true
    teamId?: true
    workspaceId?: true
  }

  export type ProjectCountAggregateInputType = {
    id?: true
    name?: true
    teamId?: true
    workspaceId?: true
    _all?: true
  }

  export type ProjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Project to aggregate.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Projects
    **/
    _count?: true | ProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectMaxAggregateInputType
  }

  export type GetProjectAggregateType<T extends ProjectAggregateArgs> = {
        [P in keyof T & keyof AggregateProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProject[P]>
      : GetScalarType<T[P], AggregateProject[P]>
  }




  export type ProjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithAggregationInput | ProjectOrderByWithAggregationInput[]
    by: ProjectScalarFieldEnum[] | ProjectScalarFieldEnum
    having?: ProjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectCountAggregateInputType | true
    _min?: ProjectMinAggregateInputType
    _max?: ProjectMaxAggregateInputType
  }

  export type ProjectGroupByOutputType = {
    id: string
    name: string
    teamId: string | null
    workspaceId: string | null
    _count: ProjectCountAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  type GetProjectGroupByPayload<T extends ProjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectGroupByOutputType[P]>
        }
      >
    >


  export type ProjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    teamId?: boolean
    workspaceId?: boolean
    Team?: boolean | Project$TeamArgs<ExtArgs>
    Workspace?: boolean | Project$WorkspaceArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    teamId?: boolean
    workspaceId?: boolean
    Team?: boolean | Project$TeamArgs<ExtArgs>
    Workspace?: boolean | Project$WorkspaceArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectScalar = {
    id?: boolean
    name?: boolean
    teamId?: boolean
    workspaceId?: boolean
  }

  export type ProjectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Team?: boolean | Project$TeamArgs<ExtArgs>
    Workspace?: boolean | Project$WorkspaceArgs<ExtArgs>
  }
  export type ProjectIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Team?: boolean | Project$TeamArgs<ExtArgs>
    Workspace?: boolean | Project$WorkspaceArgs<ExtArgs>
  }

  export type $ProjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Project"
    objects: {
      Team: Prisma.$TeamPayload<ExtArgs> | null
      Workspace: Prisma.$WorkspacePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      teamId: string | null
      workspaceId: string | null
    }, ExtArgs["result"]["project"]>
    composites: {}
  }

  type ProjectGetPayload<S extends boolean | null | undefined | ProjectDefaultArgs> = $Result.GetResult<Prisma.$ProjectPayload, S>

  type ProjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ProjectFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ProjectCountAggregateInputType | true
    }

  export interface ProjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Project'], meta: { name: 'Project' } }
    /**
     * Find zero or one Project that matches the filter.
     * @param {ProjectFindUniqueArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFindUniqueArgs>(args: SelectSubset<T, ProjectFindUniqueArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Project that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ProjectFindUniqueOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Project that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFindFirstArgs>(args?: SelectSubset<T, ProjectFindFirstArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Project that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Projects
     * const projects = await prisma.project.findMany()
     * 
     * // Get first 10 Projects
     * const projects = await prisma.project.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectWithIdOnly = await prisma.project.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectFindManyArgs>(args?: SelectSubset<T, ProjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Project.
     * @param {ProjectCreateArgs} args - Arguments to create a Project.
     * @example
     * // Create one Project
     * const Project = await prisma.project.create({
     *   data: {
     *     // ... data to create a Project
     *   }
     * })
     * 
     */
    create<T extends ProjectCreateArgs>(args: SelectSubset<T, ProjectCreateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Projects.
     * @param {ProjectCreateManyArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectCreateManyArgs>(args?: SelectSubset<T, ProjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Projects and returns the data saved in the database.
     * @param {ProjectCreateManyAndReturnArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Project.
     * @param {ProjectDeleteArgs} args - Arguments to delete one Project.
     * @example
     * // Delete one Project
     * const Project = await prisma.project.delete({
     *   where: {
     *     // ... filter to delete one Project
     *   }
     * })
     * 
     */
    delete<T extends ProjectDeleteArgs>(args: SelectSubset<T, ProjectDeleteArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Project.
     * @param {ProjectUpdateArgs} args - Arguments to update one Project.
     * @example
     * // Update one Project
     * const project = await prisma.project.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectUpdateArgs>(args: SelectSubset<T, ProjectUpdateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Projects.
     * @param {ProjectDeleteManyArgs} args - Arguments to filter Projects to delete.
     * @example
     * // Delete a few Projects
     * const { count } = await prisma.project.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectDeleteManyArgs>(args?: SelectSubset<T, ProjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectUpdateManyArgs>(args: SelectSubset<T, ProjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Project.
     * @param {ProjectUpsertArgs} args - Arguments to update or create a Project.
     * @example
     * // Update or create a Project
     * const project = await prisma.project.upsert({
     *   create: {
     *     // ... data to create a Project
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Project we want to update
     *   }
     * })
     */
    upsert<T extends ProjectUpsertArgs>(args: SelectSubset<T, ProjectUpsertArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCountArgs} args - Arguments to filter Projects to count.
     * @example
     * // Count the number of Projects
     * const count = await prisma.project.count({
     *   where: {
     *     // ... the filter for the Projects we want to count
     *   }
     * })
    **/
    count<T extends ProjectCountArgs>(
      args?: Subset<T, ProjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectAggregateArgs>(args: Subset<T, ProjectAggregateArgs>): Prisma.PrismaPromise<GetProjectAggregateType<T>>

    /**
     * Group by Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectGroupByArgs['orderBy'] }
        : { orderBy?: ProjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Project model
   */
  readonly fields: ProjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Project.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Team<T extends Project$TeamArgs<ExtArgs> = {}>(args?: Subset<T, Project$TeamArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    Workspace<T extends Project$WorkspaceArgs<ExtArgs> = {}>(args?: Subset<T, Project$WorkspaceArgs<ExtArgs>>): Prisma__WorkspaceClient<$Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Project model
   */ 
  interface ProjectFieldRefs {
    readonly id: FieldRef<"Project", 'String'>
    readonly name: FieldRef<"Project", 'String'>
    readonly teamId: FieldRef<"Project", 'String'>
    readonly workspaceId: FieldRef<"Project", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Project findUnique
   */
  export type ProjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findUniqueOrThrow
   */
  export type ProjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findFirst
   */
  export type ProjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findFirstOrThrow
   */
  export type ProjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findMany
   */
  export type ProjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Projects to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project create
   */
  export type ProjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to create a Project.
     */
    data: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
  }

  /**
   * Project createMany
   */
  export type ProjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Project createManyAndReturn
   */
  export type ProjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project update
   */
  export type ProjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to update a Project.
     */
    data: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
    /**
     * Choose, which Project to update.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project updateMany
   */
  export type ProjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
  }

  /**
   * Project upsert
   */
  export type ProjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The filter to search for the Project to update in case it exists.
     */
    where: ProjectWhereUniqueInput
    /**
     * In case the Project found by the `where` argument doesn't exist, create a new Project with this data.
     */
    create: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
    /**
     * In case the Project was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
  }

  /**
   * Project delete
   */
  export type ProjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter which Project to delete.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project deleteMany
   */
  export type ProjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Projects to delete
     */
    where?: ProjectWhereInput
  }

  /**
   * Project.Team
   */
  export type Project$TeamArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    where?: TeamWhereInput
  }

  /**
   * Project.Workspace
   */
  export type Project$WorkspaceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Workspace
     */
    select?: WorkspaceSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkspaceInclude<ExtArgs> | null
    where?: WorkspaceWhereInput
  }

  /**
   * Project without action
   */
  export type ProjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const CommitScalarFieldEnum: {
    id: 'id',
    tree_id: 'tree_id',
    distinct: 'distinct',
    message: 'message',
    timestamp: 'timestamp',
    url: 'url',
    authorName: 'authorName',
    authorEmail: 'authorEmail',
    authorUsername: 'authorUsername',
    committerName: 'committerName',
    committerEmail: 'committerEmail',
    committerUsername: 'committerUsername',
    added: 'added',
    removed: 'removed',
    modified: 'modified',
    repoName: 'repoName',
    owner: 'owner'
  };

  export type CommitScalarFieldEnum = (typeof CommitScalarFieldEnum)[keyof typeof CommitScalarFieldEnum]


  export const TaskEventLogScalarFieldEnum: {
    id: 'id',
    authorId: 'authorId',
    authorName: 'authorName',
    createdAt: 'createdAt',
    taskId: 'taskId'
  };

  export type TaskEventLogScalarFieldEnum = (typeof TaskEventLogScalarFieldEnum)[keyof typeof TaskEventLogScalarFieldEnum]


  export const TaskEventScalarFieldEnum: {
    id: 'id',
    type: 'type',
    authorId: 'authorId',
    authorName: 'authorName',
    taskId: 'taskId',
    updatedAt: 'updatedAt',
    originalLabels: 'originalLabels',
    updatedLabels: 'updatedLabels',
    originalValue: 'originalValue',
    updatedValue: 'updatedValue',
    originalAssigneeId: 'originalAssigneeId',
    originalAssigneeName: 'originalAssigneeName',
    updatedAssigneeId: 'updatedAssigneeId',
    updatedAssigneeName: 'updatedAssigneeName'
  };

  export type TaskEventScalarFieldEnum = (typeof TaskEventScalarFieldEnum)[keyof typeof TaskEventScalarFieldEnum]


  export const CommentScalarFieldEnum: {
    id: 'id',
    comment: 'comment',
    authorId: 'authorId',
    date: 'date',
    taskId: 'taskId'
  };

  export type CommentScalarFieldEnum = (typeof CommentScalarFieldEnum)[keyof typeof CommentScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    taskIds: 'taskIds',
    read: 'read',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const PageFilterModelScalarFieldEnum: {
    id: 'id',
    filterTitle: 'filterTitle',
    filterOption: 'filterOption',
    filterDescription: 'filterDescription',
    teamId: 'teamId'
  };

  export type PageFilterModelScalarFieldEnum = (typeof PageFilterModelScalarFieldEnum)[keyof typeof PageFilterModelScalarFieldEnum]


  export const TaskScalarFieldEnum: {
    id: 'id',
    authorId: 'authorId',
    title: 'title',
    description: 'description',
    status: 'status',
    identifier: 'identifier',
    priority: 'priority',
    labels: 'labels',
    dueDate: 'dueDate',
    effortEstimate: 'effortEstimate',
    teamId: 'teamId',
    dateCreated: 'dateCreated',
    assigneeId: 'assigneeId',
    assigneeName: 'assigneeName'
  };

  export type TaskScalarFieldEnum = (typeof TaskScalarFieldEnum)[keyof typeof TaskScalarFieldEnum]


  export const TeamScalarFieldEnum: {
    id: 'id',
    name: 'name',
    identifier: 'identifier',
    workspaceId: 'workspaceId'
  };

  export type TeamScalarFieldEnum = (typeof TeamScalarFieldEnum)[keyof typeof TeamScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    username: 'username',
    email: 'email',
    password: 'password',
    verified: 'verified',
    lastLogin: 'lastLogin',
    onBoarding: 'onBoarding',
    defaultWorkspaceId: 'defaultWorkspaceId'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const WorkspaceScalarFieldEnum: {
    id: 'id',
    name: 'name',
    url: 'url',
    companySize: 'companySize',
    issuesCreated: 'issuesCreated',
    universalTokenLinkId: 'universalTokenLinkId',
    githubRepoInfoId: 'githubRepoInfoId'
  };

  export type WorkspaceScalarFieldEnum = (typeof WorkspaceScalarFieldEnum)[keyof typeof WorkspaceScalarFieldEnum]


  export const UniversalTokenLinkScalarFieldEnum: {
    id: 'id',
    token: 'token',
    isEnabled: 'isEnabled'
  };

  export type UniversalTokenLinkScalarFieldEnum = (typeof UniversalTokenLinkScalarFieldEnum)[keyof typeof UniversalTokenLinkScalarFieldEnum]


  export const GithubRepoInfoScalarFieldEnum: {
    id: 'id',
    repoName: 'repoName',
    owner: 'owner'
  };

  export type GithubRepoInfoScalarFieldEnum = (typeof GithubRepoInfoScalarFieldEnum)[keyof typeof GithubRepoInfoScalarFieldEnum]


  export const ProjectScalarFieldEnum: {
    id: 'id',
    name: 'name',
    teamId: 'teamId',
    workspaceId: 'workspaceId'
  };

  export type ProjectScalarFieldEnum = (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Label[]'
   */
  export type ListEnumLabelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Label[]'>
    


  /**
   * Reference to a field of type 'Label'
   */
  export type EnumLabelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Label'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Status'
   */
  export type EnumStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Status'>
    


  /**
   * Reference to a field of type 'Status[]'
   */
  export type ListEnumStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Status[]'>
    


  /**
   * Reference to a field of type 'Priority'
   */
  export type EnumPriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Priority'>
    


  /**
   * Reference to a field of type 'Priority[]'
   */
  export type ListEnumPriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Priority[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type CommitWhereInput = {
    AND?: CommitWhereInput | CommitWhereInput[]
    OR?: CommitWhereInput[]
    NOT?: CommitWhereInput | CommitWhereInput[]
    id?: StringFilter<"Commit"> | string
    tree_id?: StringNullableFilter<"Commit"> | string | null
    distinct?: BoolNullableFilter<"Commit"> | boolean | null
    message?: StringFilter<"Commit"> | string
    timestamp?: StringFilter<"Commit"> | string
    url?: StringFilter<"Commit"> | string
    authorName?: StringNullableFilter<"Commit"> | string | null
    authorEmail?: StringNullableFilter<"Commit"> | string | null
    authorUsername?: StringNullableFilter<"Commit"> | string | null
    committerName?: StringNullableFilter<"Commit"> | string | null
    committerEmail?: StringNullableFilter<"Commit"> | string | null
    committerUsername?: StringNullableFilter<"Commit"> | string | null
    added?: StringNullableListFilter<"Commit">
    removed?: StringNullableListFilter<"Commit">
    modified?: StringNullableListFilter<"Commit">
    repoName?: StringNullableFilter<"Commit"> | string | null
    owner?: StringNullableFilter<"Commit"> | string | null
  }

  export type CommitOrderByWithRelationInput = {
    id?: SortOrder
    tree_id?: SortOrderInput | SortOrder
    distinct?: SortOrderInput | SortOrder
    message?: SortOrder
    timestamp?: SortOrder
    url?: SortOrder
    authorName?: SortOrderInput | SortOrder
    authorEmail?: SortOrderInput | SortOrder
    authorUsername?: SortOrderInput | SortOrder
    committerName?: SortOrderInput | SortOrder
    committerEmail?: SortOrderInput | SortOrder
    committerUsername?: SortOrderInput | SortOrder
    added?: SortOrder
    removed?: SortOrder
    modified?: SortOrder
    repoName?: SortOrderInput | SortOrder
    owner?: SortOrderInput | SortOrder
  }

  export type CommitWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CommitWhereInput | CommitWhereInput[]
    OR?: CommitWhereInput[]
    NOT?: CommitWhereInput | CommitWhereInput[]
    tree_id?: StringNullableFilter<"Commit"> | string | null
    distinct?: BoolNullableFilter<"Commit"> | boolean | null
    message?: StringFilter<"Commit"> | string
    timestamp?: StringFilter<"Commit"> | string
    url?: StringFilter<"Commit"> | string
    authorName?: StringNullableFilter<"Commit"> | string | null
    authorEmail?: StringNullableFilter<"Commit"> | string | null
    authorUsername?: StringNullableFilter<"Commit"> | string | null
    committerName?: StringNullableFilter<"Commit"> | string | null
    committerEmail?: StringNullableFilter<"Commit"> | string | null
    committerUsername?: StringNullableFilter<"Commit"> | string | null
    added?: StringNullableListFilter<"Commit">
    removed?: StringNullableListFilter<"Commit">
    modified?: StringNullableListFilter<"Commit">
    repoName?: StringNullableFilter<"Commit"> | string | null
    owner?: StringNullableFilter<"Commit"> | string | null
  }, "id">

  export type CommitOrderByWithAggregationInput = {
    id?: SortOrder
    tree_id?: SortOrderInput | SortOrder
    distinct?: SortOrderInput | SortOrder
    message?: SortOrder
    timestamp?: SortOrder
    url?: SortOrder
    authorName?: SortOrderInput | SortOrder
    authorEmail?: SortOrderInput | SortOrder
    authorUsername?: SortOrderInput | SortOrder
    committerName?: SortOrderInput | SortOrder
    committerEmail?: SortOrderInput | SortOrder
    committerUsername?: SortOrderInput | SortOrder
    added?: SortOrder
    removed?: SortOrder
    modified?: SortOrder
    repoName?: SortOrderInput | SortOrder
    owner?: SortOrderInput | SortOrder
    _count?: CommitCountOrderByAggregateInput
    _max?: CommitMaxOrderByAggregateInput
    _min?: CommitMinOrderByAggregateInput
  }

  export type CommitScalarWhereWithAggregatesInput = {
    AND?: CommitScalarWhereWithAggregatesInput | CommitScalarWhereWithAggregatesInput[]
    OR?: CommitScalarWhereWithAggregatesInput[]
    NOT?: CommitScalarWhereWithAggregatesInput | CommitScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Commit"> | string
    tree_id?: StringNullableWithAggregatesFilter<"Commit"> | string | null
    distinct?: BoolNullableWithAggregatesFilter<"Commit"> | boolean | null
    message?: StringWithAggregatesFilter<"Commit"> | string
    timestamp?: StringWithAggregatesFilter<"Commit"> | string
    url?: StringWithAggregatesFilter<"Commit"> | string
    authorName?: StringNullableWithAggregatesFilter<"Commit"> | string | null
    authorEmail?: StringNullableWithAggregatesFilter<"Commit"> | string | null
    authorUsername?: StringNullableWithAggregatesFilter<"Commit"> | string | null
    committerName?: StringNullableWithAggregatesFilter<"Commit"> | string | null
    committerEmail?: StringNullableWithAggregatesFilter<"Commit"> | string | null
    committerUsername?: StringNullableWithAggregatesFilter<"Commit"> | string | null
    added?: StringNullableListFilter<"Commit">
    removed?: StringNullableListFilter<"Commit">
    modified?: StringNullableListFilter<"Commit">
    repoName?: StringNullableWithAggregatesFilter<"Commit"> | string | null
    owner?: StringNullableWithAggregatesFilter<"Commit"> | string | null
  }

  export type TaskEventLogWhereInput = {
    AND?: TaskEventLogWhereInput | TaskEventLogWhereInput[]
    OR?: TaskEventLogWhereInput[]
    NOT?: TaskEventLogWhereInput | TaskEventLogWhereInput[]
    id?: StringFilter<"TaskEventLog"> | string
    authorId?: StringFilter<"TaskEventLog"> | string
    authorName?: StringFilter<"TaskEventLog"> | string
    createdAt?: DateTimeFilter<"TaskEventLog"> | Date | string
    taskId?: StringFilter<"TaskEventLog"> | string
    taskEvents?: TaskEventListRelationFilter
  }

  export type TaskEventLogOrderByWithRelationInput = {
    id?: SortOrder
    authorId?: SortOrder
    authorName?: SortOrder
    createdAt?: SortOrder
    taskId?: SortOrder
    taskEvents?: TaskEventOrderByRelationAggregateInput
  }

  export type TaskEventLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TaskEventLogWhereInput | TaskEventLogWhereInput[]
    OR?: TaskEventLogWhereInput[]
    NOT?: TaskEventLogWhereInput | TaskEventLogWhereInput[]
    authorId?: StringFilter<"TaskEventLog"> | string
    authorName?: StringFilter<"TaskEventLog"> | string
    createdAt?: DateTimeFilter<"TaskEventLog"> | Date | string
    taskId?: StringFilter<"TaskEventLog"> | string
    taskEvents?: TaskEventListRelationFilter
  }, "id">

  export type TaskEventLogOrderByWithAggregationInput = {
    id?: SortOrder
    authorId?: SortOrder
    authorName?: SortOrder
    createdAt?: SortOrder
    taskId?: SortOrder
    _count?: TaskEventLogCountOrderByAggregateInput
    _max?: TaskEventLogMaxOrderByAggregateInput
    _min?: TaskEventLogMinOrderByAggregateInput
  }

  export type TaskEventLogScalarWhereWithAggregatesInput = {
    AND?: TaskEventLogScalarWhereWithAggregatesInput | TaskEventLogScalarWhereWithAggregatesInput[]
    OR?: TaskEventLogScalarWhereWithAggregatesInput[]
    NOT?: TaskEventLogScalarWhereWithAggregatesInput | TaskEventLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TaskEventLog"> | string
    authorId?: StringWithAggregatesFilter<"TaskEventLog"> | string
    authorName?: StringWithAggregatesFilter<"TaskEventLog"> | string
    createdAt?: DateTimeWithAggregatesFilter<"TaskEventLog"> | Date | string
    taskId?: StringWithAggregatesFilter<"TaskEventLog"> | string
  }

  export type TaskEventWhereInput = {
    AND?: TaskEventWhereInput | TaskEventWhereInput[]
    OR?: TaskEventWhereInput[]
    NOT?: TaskEventWhereInput | TaskEventWhereInput[]
    id?: StringFilter<"TaskEvent"> | string
    type?: StringFilter<"TaskEvent"> | string
    authorId?: StringFilter<"TaskEvent"> | string
    authorName?: StringFilter<"TaskEvent"> | string
    taskId?: StringFilter<"TaskEvent"> | string
    updatedAt?: DateTimeFilter<"TaskEvent"> | Date | string
    originalLabels?: EnumLabelNullableListFilter<"TaskEvent">
    updatedLabels?: EnumLabelNullableListFilter<"TaskEvent">
    originalValue?: StringNullableFilter<"TaskEvent"> | string | null
    updatedValue?: StringNullableFilter<"TaskEvent"> | string | null
    originalAssigneeId?: StringNullableFilter<"TaskEvent"> | string | null
    originalAssigneeName?: StringNullableFilter<"TaskEvent"> | string | null
    updatedAssigneeId?: StringNullableFilter<"TaskEvent"> | string | null
    updatedAssigneeName?: StringNullableFilter<"TaskEvent"> | string | null
    taskEventLog?: XOR<TaskEventLogRelationFilter, TaskEventLogWhereInput>
  }

  export type TaskEventOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    authorId?: SortOrder
    authorName?: SortOrder
    taskId?: SortOrder
    updatedAt?: SortOrder
    originalLabels?: SortOrder
    updatedLabels?: SortOrder
    originalValue?: SortOrderInput | SortOrder
    updatedValue?: SortOrderInput | SortOrder
    originalAssigneeId?: SortOrderInput | SortOrder
    originalAssigneeName?: SortOrderInput | SortOrder
    updatedAssigneeId?: SortOrderInput | SortOrder
    updatedAssigneeName?: SortOrderInput | SortOrder
    taskEventLog?: TaskEventLogOrderByWithRelationInput
  }

  export type TaskEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TaskEventWhereInput | TaskEventWhereInput[]
    OR?: TaskEventWhereInput[]
    NOT?: TaskEventWhereInput | TaskEventWhereInput[]
    type?: StringFilter<"TaskEvent"> | string
    authorId?: StringFilter<"TaskEvent"> | string
    authorName?: StringFilter<"TaskEvent"> | string
    taskId?: StringFilter<"TaskEvent"> | string
    updatedAt?: DateTimeFilter<"TaskEvent"> | Date | string
    originalLabels?: EnumLabelNullableListFilter<"TaskEvent">
    updatedLabels?: EnumLabelNullableListFilter<"TaskEvent">
    originalValue?: StringNullableFilter<"TaskEvent"> | string | null
    updatedValue?: StringNullableFilter<"TaskEvent"> | string | null
    originalAssigneeId?: StringNullableFilter<"TaskEvent"> | string | null
    originalAssigneeName?: StringNullableFilter<"TaskEvent"> | string | null
    updatedAssigneeId?: StringNullableFilter<"TaskEvent"> | string | null
    updatedAssigneeName?: StringNullableFilter<"TaskEvent"> | string | null
    taskEventLog?: XOR<TaskEventLogRelationFilter, TaskEventLogWhereInput>
  }, "id">

  export type TaskEventOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    authorId?: SortOrder
    authorName?: SortOrder
    taskId?: SortOrder
    updatedAt?: SortOrder
    originalLabels?: SortOrder
    updatedLabels?: SortOrder
    originalValue?: SortOrderInput | SortOrder
    updatedValue?: SortOrderInput | SortOrder
    originalAssigneeId?: SortOrderInput | SortOrder
    originalAssigneeName?: SortOrderInput | SortOrder
    updatedAssigneeId?: SortOrderInput | SortOrder
    updatedAssigneeName?: SortOrderInput | SortOrder
    _count?: TaskEventCountOrderByAggregateInput
    _max?: TaskEventMaxOrderByAggregateInput
    _min?: TaskEventMinOrderByAggregateInput
  }

  export type TaskEventScalarWhereWithAggregatesInput = {
    AND?: TaskEventScalarWhereWithAggregatesInput | TaskEventScalarWhereWithAggregatesInput[]
    OR?: TaskEventScalarWhereWithAggregatesInput[]
    NOT?: TaskEventScalarWhereWithAggregatesInput | TaskEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TaskEvent"> | string
    type?: StringWithAggregatesFilter<"TaskEvent"> | string
    authorId?: StringWithAggregatesFilter<"TaskEvent"> | string
    authorName?: StringWithAggregatesFilter<"TaskEvent"> | string
    taskId?: StringWithAggregatesFilter<"TaskEvent"> | string
    updatedAt?: DateTimeWithAggregatesFilter<"TaskEvent"> | Date | string
    originalLabels?: EnumLabelNullableListFilter<"TaskEvent">
    updatedLabels?: EnumLabelNullableListFilter<"TaskEvent">
    originalValue?: StringNullableWithAggregatesFilter<"TaskEvent"> | string | null
    updatedValue?: StringNullableWithAggregatesFilter<"TaskEvent"> | string | null
    originalAssigneeId?: StringNullableWithAggregatesFilter<"TaskEvent"> | string | null
    originalAssigneeName?: StringNullableWithAggregatesFilter<"TaskEvent"> | string | null
    updatedAssigneeId?: StringNullableWithAggregatesFilter<"TaskEvent"> | string | null
    updatedAssigneeName?: StringNullableWithAggregatesFilter<"TaskEvent"> | string | null
  }

  export type CommentWhereInput = {
    AND?: CommentWhereInput | CommentWhereInput[]
    OR?: CommentWhereInput[]
    NOT?: CommentWhereInput | CommentWhereInput[]
    id?: StringFilter<"Comment"> | string
    comment?: StringFilter<"Comment"> | string
    authorId?: StringFilter<"Comment"> | string
    date?: DateTimeFilter<"Comment"> | Date | string
    taskId?: StringFilter<"Comment"> | string
    Task?: XOR<TaskRelationFilter, TaskWhereInput>
    Author?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type CommentOrderByWithRelationInput = {
    id?: SortOrder
    comment?: SortOrder
    authorId?: SortOrder
    date?: SortOrder
    taskId?: SortOrder
    Task?: TaskOrderByWithRelationInput
    Author?: UserOrderByWithRelationInput
  }

  export type CommentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CommentWhereInput | CommentWhereInput[]
    OR?: CommentWhereInput[]
    NOT?: CommentWhereInput | CommentWhereInput[]
    comment?: StringFilter<"Comment"> | string
    authorId?: StringFilter<"Comment"> | string
    date?: DateTimeFilter<"Comment"> | Date | string
    taskId?: StringFilter<"Comment"> | string
    Task?: XOR<TaskRelationFilter, TaskWhereInput>
    Author?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type CommentOrderByWithAggregationInput = {
    id?: SortOrder
    comment?: SortOrder
    authorId?: SortOrder
    date?: SortOrder
    taskId?: SortOrder
    _count?: CommentCountOrderByAggregateInput
    _max?: CommentMaxOrderByAggregateInput
    _min?: CommentMinOrderByAggregateInput
  }

  export type CommentScalarWhereWithAggregatesInput = {
    AND?: CommentScalarWhereWithAggregatesInput | CommentScalarWhereWithAggregatesInput[]
    OR?: CommentScalarWhereWithAggregatesInput[]
    NOT?: CommentScalarWhereWithAggregatesInput | CommentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Comment"> | string
    comment?: StringWithAggregatesFilter<"Comment"> | string
    authorId?: StringWithAggregatesFilter<"Comment"> | string
    date?: DateTimeWithAggregatesFilter<"Comment"> | Date | string
    taskId?: StringWithAggregatesFilter<"Comment"> | string
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: StringFilter<"Notification"> | string
    userId?: StringFilter<"Notification"> | string
    taskIds?: StringNullableListFilter<"Notification">
    read?: BoolFilter<"Notification"> | boolean
    description?: StringNullableFilter<"Notification"> | string | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    updatedAt?: DateTimeFilter<"Notification"> | Date | string
    User?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    taskIds?: SortOrder
    read?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    User?: UserOrderByWithRelationInput
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    userId?: StringFilter<"Notification"> | string
    taskIds?: StringNullableListFilter<"Notification">
    read?: BoolFilter<"Notification"> | boolean
    description?: StringNullableFilter<"Notification"> | string | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    updatedAt?: DateTimeFilter<"Notification"> | Date | string
    User?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    taskIds?: SortOrder
    read?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Notification"> | string
    userId?: StringWithAggregatesFilter<"Notification"> | string
    taskIds?: StringNullableListFilter<"Notification">
    read?: BoolWithAggregatesFilter<"Notification"> | boolean
    description?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
  }

  export type PageFilterModelWhereInput = {
    AND?: PageFilterModelWhereInput | PageFilterModelWhereInput[]
    OR?: PageFilterModelWhereInput[]
    NOT?: PageFilterModelWhereInput | PageFilterModelWhereInput[]
    id?: StringFilter<"PageFilterModel"> | string
    filterTitle?: StringFilter<"PageFilterModel"> | string
    filterOption?: JsonFilter<"PageFilterModel">
    filterDescription?: StringNullableFilter<"PageFilterModel"> | string | null
    teamId?: StringFilter<"PageFilterModel"> | string
  }

  export type PageFilterModelOrderByWithRelationInput = {
    id?: SortOrder
    filterTitle?: SortOrder
    filterOption?: SortOrder
    filterDescription?: SortOrderInput | SortOrder
    teamId?: SortOrder
  }

  export type PageFilterModelWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PageFilterModelWhereInput | PageFilterModelWhereInput[]
    OR?: PageFilterModelWhereInput[]
    NOT?: PageFilterModelWhereInput | PageFilterModelWhereInput[]
    filterTitle?: StringFilter<"PageFilterModel"> | string
    filterOption?: JsonFilter<"PageFilterModel">
    filterDescription?: StringNullableFilter<"PageFilterModel"> | string | null
    teamId?: StringFilter<"PageFilterModel"> | string
  }, "id">

  export type PageFilterModelOrderByWithAggregationInput = {
    id?: SortOrder
    filterTitle?: SortOrder
    filterOption?: SortOrder
    filterDescription?: SortOrderInput | SortOrder
    teamId?: SortOrder
    _count?: PageFilterModelCountOrderByAggregateInput
    _max?: PageFilterModelMaxOrderByAggregateInput
    _min?: PageFilterModelMinOrderByAggregateInput
  }

  export type PageFilterModelScalarWhereWithAggregatesInput = {
    AND?: PageFilterModelScalarWhereWithAggregatesInput | PageFilterModelScalarWhereWithAggregatesInput[]
    OR?: PageFilterModelScalarWhereWithAggregatesInput[]
    NOT?: PageFilterModelScalarWhereWithAggregatesInput | PageFilterModelScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PageFilterModel"> | string
    filterTitle?: StringWithAggregatesFilter<"PageFilterModel"> | string
    filterOption?: JsonWithAggregatesFilter<"PageFilterModel">
    filterDescription?: StringNullableWithAggregatesFilter<"PageFilterModel"> | string | null
    teamId?: StringWithAggregatesFilter<"PageFilterModel"> | string
  }

  export type TaskWhereInput = {
    AND?: TaskWhereInput | TaskWhereInput[]
    OR?: TaskWhereInput[]
    NOT?: TaskWhereInput | TaskWhereInput[]
    id?: StringFilter<"Task"> | string
    authorId?: StringFilter<"Task"> | string
    title?: StringFilter<"Task"> | string
    description?: StringNullableFilter<"Task"> | string | null
    status?: EnumStatusFilter<"Task"> | $Enums.Status
    identifier?: StringFilter<"Task"> | string
    priority?: EnumPriorityNullableFilter<"Task"> | $Enums.Priority | null
    labels?: EnumLabelNullableListFilter<"Task">
    dueDate?: DateTimeNullableFilter<"Task"> | Date | string | null
    effortEstimate?: IntNullableFilter<"Task"> | number | null
    teamId?: StringFilter<"Task"> | string
    dateCreated?: DateTimeFilter<"Task"> | Date | string
    assigneeId?: StringNullableFilter<"Task"> | string | null
    assigneeName?: StringNullableFilter<"Task"> | string | null
    Author?: XOR<UserRelationFilter, UserWhereInput>
    Team?: XOR<TeamRelationFilter, TeamWhereInput>
    Comment?: CommentListRelationFilter
  }

  export type TaskOrderByWithRelationInput = {
    id?: SortOrder
    authorId?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    identifier?: SortOrder
    priority?: SortOrderInput | SortOrder
    labels?: SortOrder
    dueDate?: SortOrderInput | SortOrder
    effortEstimate?: SortOrderInput | SortOrder
    teamId?: SortOrder
    dateCreated?: SortOrder
    assigneeId?: SortOrderInput | SortOrder
    assigneeName?: SortOrderInput | SortOrder
    Author?: UserOrderByWithRelationInput
    Team?: TeamOrderByWithRelationInput
    Comment?: CommentOrderByRelationAggregateInput
  }

  export type TaskWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TaskWhereInput | TaskWhereInput[]
    OR?: TaskWhereInput[]
    NOT?: TaskWhereInput | TaskWhereInput[]
    authorId?: StringFilter<"Task"> | string
    title?: StringFilter<"Task"> | string
    description?: StringNullableFilter<"Task"> | string | null
    status?: EnumStatusFilter<"Task"> | $Enums.Status
    identifier?: StringFilter<"Task"> | string
    priority?: EnumPriorityNullableFilter<"Task"> | $Enums.Priority | null
    labels?: EnumLabelNullableListFilter<"Task">
    dueDate?: DateTimeNullableFilter<"Task"> | Date | string | null
    effortEstimate?: IntNullableFilter<"Task"> | number | null
    teamId?: StringFilter<"Task"> | string
    dateCreated?: DateTimeFilter<"Task"> | Date | string
    assigneeId?: StringNullableFilter<"Task"> | string | null
    assigneeName?: StringNullableFilter<"Task"> | string | null
    Author?: XOR<UserRelationFilter, UserWhereInput>
    Team?: XOR<TeamRelationFilter, TeamWhereInput>
    Comment?: CommentListRelationFilter
  }, "id">

  export type TaskOrderByWithAggregationInput = {
    id?: SortOrder
    authorId?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    identifier?: SortOrder
    priority?: SortOrderInput | SortOrder
    labels?: SortOrder
    dueDate?: SortOrderInput | SortOrder
    effortEstimate?: SortOrderInput | SortOrder
    teamId?: SortOrder
    dateCreated?: SortOrder
    assigneeId?: SortOrderInput | SortOrder
    assigneeName?: SortOrderInput | SortOrder
    _count?: TaskCountOrderByAggregateInput
    _avg?: TaskAvgOrderByAggregateInput
    _max?: TaskMaxOrderByAggregateInput
    _min?: TaskMinOrderByAggregateInput
    _sum?: TaskSumOrderByAggregateInput
  }

  export type TaskScalarWhereWithAggregatesInput = {
    AND?: TaskScalarWhereWithAggregatesInput | TaskScalarWhereWithAggregatesInput[]
    OR?: TaskScalarWhereWithAggregatesInput[]
    NOT?: TaskScalarWhereWithAggregatesInput | TaskScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Task"> | string
    authorId?: StringWithAggregatesFilter<"Task"> | string
    title?: StringWithAggregatesFilter<"Task"> | string
    description?: StringNullableWithAggregatesFilter<"Task"> | string | null
    status?: EnumStatusWithAggregatesFilter<"Task"> | $Enums.Status
    identifier?: StringWithAggregatesFilter<"Task"> | string
    priority?: EnumPriorityNullableWithAggregatesFilter<"Task"> | $Enums.Priority | null
    labels?: EnumLabelNullableListFilter<"Task">
    dueDate?: DateTimeNullableWithAggregatesFilter<"Task"> | Date | string | null
    effortEstimate?: IntNullableWithAggregatesFilter<"Task"> | number | null
    teamId?: StringWithAggregatesFilter<"Task"> | string
    dateCreated?: DateTimeWithAggregatesFilter<"Task"> | Date | string
    assigneeId?: StringNullableWithAggregatesFilter<"Task"> | string | null
    assigneeName?: StringNullableWithAggregatesFilter<"Task"> | string | null
  }

  export type TeamWhereInput = {
    AND?: TeamWhereInput | TeamWhereInput[]
    OR?: TeamWhereInput[]
    NOT?: TeamWhereInput | TeamWhereInput[]
    id?: StringFilter<"Team"> | string
    name?: StringNullableFilter<"Team"> | string | null
    identifier?: StringFilter<"Team"> | string
    workspaceId?: StringFilter<"Team"> | string
    Users?: UserListRelationFilter
    Tasks?: TaskListRelationFilter
    Workspace?: XOR<WorkspaceRelationFilter, WorkspaceWhereInput>
    Project?: ProjectListRelationFilter
  }

  export type TeamOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    identifier?: SortOrder
    workspaceId?: SortOrder
    Users?: UserOrderByRelationAggregateInput
    Tasks?: TaskOrderByRelationAggregateInput
    Workspace?: WorkspaceOrderByWithRelationInput
    Project?: ProjectOrderByRelationAggregateInput
  }

  export type TeamWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TeamWhereInput | TeamWhereInput[]
    OR?: TeamWhereInput[]
    NOT?: TeamWhereInput | TeamWhereInput[]
    name?: StringNullableFilter<"Team"> | string | null
    identifier?: StringFilter<"Team"> | string
    workspaceId?: StringFilter<"Team"> | string
    Users?: UserListRelationFilter
    Tasks?: TaskListRelationFilter
    Workspace?: XOR<WorkspaceRelationFilter, WorkspaceWhereInput>
    Project?: ProjectListRelationFilter
  }, "id">

  export type TeamOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    identifier?: SortOrder
    workspaceId?: SortOrder
    _count?: TeamCountOrderByAggregateInput
    _max?: TeamMaxOrderByAggregateInput
    _min?: TeamMinOrderByAggregateInput
  }

  export type TeamScalarWhereWithAggregatesInput = {
    AND?: TeamScalarWhereWithAggregatesInput | TeamScalarWhereWithAggregatesInput[]
    OR?: TeamScalarWhereWithAggregatesInput[]
    NOT?: TeamScalarWhereWithAggregatesInput | TeamScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Team"> | string
    name?: StringNullableWithAggregatesFilter<"Team"> | string | null
    identifier?: StringWithAggregatesFilter<"Team"> | string
    workspaceId?: StringWithAggregatesFilter<"Team"> | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    username?: StringNullableFilter<"User"> | string | null
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    verified?: BoolFilter<"User"> | boolean
    lastLogin?: DateTimeFilter<"User"> | Date | string
    onBoarding?: BoolFilter<"User"> | boolean
    defaultWorkspaceId?: StringNullableFilter<"User"> | string | null
    DefaultWorkspace?: XOR<WorkspaceNullableRelationFilter, WorkspaceWhereInput> | null
    Workspaces?: WorkspaceListRelationFilter
    Teams?: TeamListRelationFilter
    Notification?: NotificationListRelationFilter
    Comment?: CommentListRelationFilter
    Task?: TaskListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    username?: SortOrderInput | SortOrder
    email?: SortOrder
    password?: SortOrder
    verified?: SortOrder
    lastLogin?: SortOrder
    onBoarding?: SortOrder
    defaultWorkspaceId?: SortOrderInput | SortOrder
    DefaultWorkspace?: WorkspaceOrderByWithRelationInput
    Workspaces?: WorkspaceOrderByRelationAggregateInput
    Teams?: TeamOrderByRelationAggregateInput
    Notification?: NotificationOrderByRelationAggregateInput
    Comment?: CommentOrderByRelationAggregateInput
    Task?: TaskOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    username?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    verified?: BoolFilter<"User"> | boolean
    lastLogin?: DateTimeFilter<"User"> | Date | string
    onBoarding?: BoolFilter<"User"> | boolean
    defaultWorkspaceId?: StringNullableFilter<"User"> | string | null
    DefaultWorkspace?: XOR<WorkspaceNullableRelationFilter, WorkspaceWhereInput> | null
    Workspaces?: WorkspaceListRelationFilter
    Teams?: TeamListRelationFilter
    Notification?: NotificationListRelationFilter
    Comment?: CommentListRelationFilter
    Task?: TaskListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    username?: SortOrderInput | SortOrder
    email?: SortOrder
    password?: SortOrder
    verified?: SortOrder
    lastLogin?: SortOrder
    onBoarding?: SortOrder
    defaultWorkspaceId?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    username?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    verified?: BoolWithAggregatesFilter<"User"> | boolean
    lastLogin?: DateTimeWithAggregatesFilter<"User"> | Date | string
    onBoarding?: BoolWithAggregatesFilter<"User"> | boolean
    defaultWorkspaceId?: StringNullableWithAggregatesFilter<"User"> | string | null
  }

  export type WorkspaceWhereInput = {
    AND?: WorkspaceWhereInput | WorkspaceWhereInput[]
    OR?: WorkspaceWhereInput[]
    NOT?: WorkspaceWhereInput | WorkspaceWhereInput[]
    id?: StringFilter<"Workspace"> | string
    name?: StringNullableFilter<"Workspace"> | string | null
    url?: StringNullableFilter<"Workspace"> | string | null
    companySize?: IntNullableFilter<"Workspace"> | number | null
    issuesCreated?: IntNullableFilter<"Workspace"> | number | null
    universalTokenLinkId?: StringNullableFilter<"Workspace"> | string | null
    githubRepoInfoId?: StringNullableFilter<"Workspace"> | string | null
    universalTokenLink?: XOR<UniversalTokenLinkNullableRelationFilter, UniversalTokenLinkWhereInput> | null
    teams?: TeamListRelationFilter
    projects?: ProjectListRelationFilter
    githubRepoInfo?: XOR<GithubRepoInfoNullableRelationFilter, GithubRepoInfoWhereInput> | null
    Users?: UserListRelationFilter
    User?: UserListRelationFilter
  }

  export type WorkspaceOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
    companySize?: SortOrderInput | SortOrder
    issuesCreated?: SortOrderInput | SortOrder
    universalTokenLinkId?: SortOrderInput | SortOrder
    githubRepoInfoId?: SortOrderInput | SortOrder
    universalTokenLink?: UniversalTokenLinkOrderByWithRelationInput
    teams?: TeamOrderByRelationAggregateInput
    projects?: ProjectOrderByRelationAggregateInput
    githubRepoInfo?: GithubRepoInfoOrderByWithRelationInput
    Users?: UserOrderByRelationAggregateInput
    User?: UserOrderByRelationAggregateInput
  }

  export type WorkspaceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WorkspaceWhereInput | WorkspaceWhereInput[]
    OR?: WorkspaceWhereInput[]
    NOT?: WorkspaceWhereInput | WorkspaceWhereInput[]
    name?: StringNullableFilter<"Workspace"> | string | null
    url?: StringNullableFilter<"Workspace"> | string | null
    companySize?: IntNullableFilter<"Workspace"> | number | null
    issuesCreated?: IntNullableFilter<"Workspace"> | number | null
    universalTokenLinkId?: StringNullableFilter<"Workspace"> | string | null
    githubRepoInfoId?: StringNullableFilter<"Workspace"> | string | null
    universalTokenLink?: XOR<UniversalTokenLinkNullableRelationFilter, UniversalTokenLinkWhereInput> | null
    teams?: TeamListRelationFilter
    projects?: ProjectListRelationFilter
    githubRepoInfo?: XOR<GithubRepoInfoNullableRelationFilter, GithubRepoInfoWhereInput> | null
    Users?: UserListRelationFilter
    User?: UserListRelationFilter
  }, "id">

  export type WorkspaceOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
    companySize?: SortOrderInput | SortOrder
    issuesCreated?: SortOrderInput | SortOrder
    universalTokenLinkId?: SortOrderInput | SortOrder
    githubRepoInfoId?: SortOrderInput | SortOrder
    _count?: WorkspaceCountOrderByAggregateInput
    _avg?: WorkspaceAvgOrderByAggregateInput
    _max?: WorkspaceMaxOrderByAggregateInput
    _min?: WorkspaceMinOrderByAggregateInput
    _sum?: WorkspaceSumOrderByAggregateInput
  }

  export type WorkspaceScalarWhereWithAggregatesInput = {
    AND?: WorkspaceScalarWhereWithAggregatesInput | WorkspaceScalarWhereWithAggregatesInput[]
    OR?: WorkspaceScalarWhereWithAggregatesInput[]
    NOT?: WorkspaceScalarWhereWithAggregatesInput | WorkspaceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Workspace"> | string
    name?: StringNullableWithAggregatesFilter<"Workspace"> | string | null
    url?: StringNullableWithAggregatesFilter<"Workspace"> | string | null
    companySize?: IntNullableWithAggregatesFilter<"Workspace"> | number | null
    issuesCreated?: IntNullableWithAggregatesFilter<"Workspace"> | number | null
    universalTokenLinkId?: StringNullableWithAggregatesFilter<"Workspace"> | string | null
    githubRepoInfoId?: StringNullableWithAggregatesFilter<"Workspace"> | string | null
  }

  export type UniversalTokenLinkWhereInput = {
    AND?: UniversalTokenLinkWhereInput | UniversalTokenLinkWhereInput[]
    OR?: UniversalTokenLinkWhereInput[]
    NOT?: UniversalTokenLinkWhereInput | UniversalTokenLinkWhereInput[]
    id?: StringFilter<"UniversalTokenLink"> | string
    token?: StringFilter<"UniversalTokenLink"> | string
    isEnabled?: BoolFilter<"UniversalTokenLink"> | boolean
    Workspace?: WorkspaceListRelationFilter
  }

  export type UniversalTokenLinkOrderByWithRelationInput = {
    id?: SortOrder
    token?: SortOrder
    isEnabled?: SortOrder
    Workspace?: WorkspaceOrderByRelationAggregateInput
  }

  export type UniversalTokenLinkWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: UniversalTokenLinkWhereInput | UniversalTokenLinkWhereInput[]
    OR?: UniversalTokenLinkWhereInput[]
    NOT?: UniversalTokenLinkWhereInput | UniversalTokenLinkWhereInput[]
    token?: StringFilter<"UniversalTokenLink"> | string
    isEnabled?: BoolFilter<"UniversalTokenLink"> | boolean
    Workspace?: WorkspaceListRelationFilter
  }, "id">

  export type UniversalTokenLinkOrderByWithAggregationInput = {
    id?: SortOrder
    token?: SortOrder
    isEnabled?: SortOrder
    _count?: UniversalTokenLinkCountOrderByAggregateInput
    _max?: UniversalTokenLinkMaxOrderByAggregateInput
    _min?: UniversalTokenLinkMinOrderByAggregateInput
  }

  export type UniversalTokenLinkScalarWhereWithAggregatesInput = {
    AND?: UniversalTokenLinkScalarWhereWithAggregatesInput | UniversalTokenLinkScalarWhereWithAggregatesInput[]
    OR?: UniversalTokenLinkScalarWhereWithAggregatesInput[]
    NOT?: UniversalTokenLinkScalarWhereWithAggregatesInput | UniversalTokenLinkScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UniversalTokenLink"> | string
    token?: StringWithAggregatesFilter<"UniversalTokenLink"> | string
    isEnabled?: BoolWithAggregatesFilter<"UniversalTokenLink"> | boolean
  }

  export type GithubRepoInfoWhereInput = {
    AND?: GithubRepoInfoWhereInput | GithubRepoInfoWhereInput[]
    OR?: GithubRepoInfoWhereInput[]
    NOT?: GithubRepoInfoWhereInput | GithubRepoInfoWhereInput[]
    id?: StringFilter<"GithubRepoInfo"> | string
    repoName?: StringFilter<"GithubRepoInfo"> | string
    owner?: StringFilter<"GithubRepoInfo"> | string
    Workspace?: WorkspaceListRelationFilter
  }

  export type GithubRepoInfoOrderByWithRelationInput = {
    id?: SortOrder
    repoName?: SortOrder
    owner?: SortOrder
    Workspace?: WorkspaceOrderByRelationAggregateInput
  }

  export type GithubRepoInfoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GithubRepoInfoWhereInput | GithubRepoInfoWhereInput[]
    OR?: GithubRepoInfoWhereInput[]
    NOT?: GithubRepoInfoWhereInput | GithubRepoInfoWhereInput[]
    repoName?: StringFilter<"GithubRepoInfo"> | string
    owner?: StringFilter<"GithubRepoInfo"> | string
    Workspace?: WorkspaceListRelationFilter
  }, "id">

  export type GithubRepoInfoOrderByWithAggregationInput = {
    id?: SortOrder
    repoName?: SortOrder
    owner?: SortOrder
    _count?: GithubRepoInfoCountOrderByAggregateInput
    _max?: GithubRepoInfoMaxOrderByAggregateInput
    _min?: GithubRepoInfoMinOrderByAggregateInput
  }

  export type GithubRepoInfoScalarWhereWithAggregatesInput = {
    AND?: GithubRepoInfoScalarWhereWithAggregatesInput | GithubRepoInfoScalarWhereWithAggregatesInput[]
    OR?: GithubRepoInfoScalarWhereWithAggregatesInput[]
    NOT?: GithubRepoInfoScalarWhereWithAggregatesInput | GithubRepoInfoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GithubRepoInfo"> | string
    repoName?: StringWithAggregatesFilter<"GithubRepoInfo"> | string
    owner?: StringWithAggregatesFilter<"GithubRepoInfo"> | string
  }

  export type ProjectWhereInput = {
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    id?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    teamId?: StringNullableFilter<"Project"> | string | null
    workspaceId?: StringNullableFilter<"Project"> | string | null
    Team?: XOR<TeamNullableRelationFilter, TeamWhereInput> | null
    Workspace?: XOR<WorkspaceNullableRelationFilter, WorkspaceWhereInput> | null
  }

  export type ProjectOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    teamId?: SortOrderInput | SortOrder
    workspaceId?: SortOrderInput | SortOrder
    Team?: TeamOrderByWithRelationInput
    Workspace?: WorkspaceOrderByWithRelationInput
  }

  export type ProjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    name?: StringFilter<"Project"> | string
    teamId?: StringNullableFilter<"Project"> | string | null
    workspaceId?: StringNullableFilter<"Project"> | string | null
    Team?: XOR<TeamNullableRelationFilter, TeamWhereInput> | null
    Workspace?: XOR<WorkspaceNullableRelationFilter, WorkspaceWhereInput> | null
  }, "id">

  export type ProjectOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    teamId?: SortOrderInput | SortOrder
    workspaceId?: SortOrderInput | SortOrder
    _count?: ProjectCountOrderByAggregateInput
    _max?: ProjectMaxOrderByAggregateInput
    _min?: ProjectMinOrderByAggregateInput
  }

  export type ProjectScalarWhereWithAggregatesInput = {
    AND?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    OR?: ProjectScalarWhereWithAggregatesInput[]
    NOT?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Project"> | string
    name?: StringWithAggregatesFilter<"Project"> | string
    teamId?: StringNullableWithAggregatesFilter<"Project"> | string | null
    workspaceId?: StringNullableWithAggregatesFilter<"Project"> | string | null
  }

  export type CommitCreateInput = {
    id: string
    tree_id?: string | null
    distinct?: boolean | null
    message: string
    timestamp: string
    url: string
    authorName?: string | null
    authorEmail?: string | null
    authorUsername?: string | null
    committerName?: string | null
    committerEmail?: string | null
    committerUsername?: string | null
    added?: CommitCreateaddedInput | string[]
    removed?: CommitCreateremovedInput | string[]
    modified?: CommitCreatemodifiedInput | string[]
    repoName?: string | null
    owner?: string | null
  }

  export type CommitUncheckedCreateInput = {
    id: string
    tree_id?: string | null
    distinct?: boolean | null
    message: string
    timestamp: string
    url: string
    authorName?: string | null
    authorEmail?: string | null
    authorUsername?: string | null
    committerName?: string | null
    committerEmail?: string | null
    committerUsername?: string | null
    added?: CommitCreateaddedInput | string[]
    removed?: CommitCreateremovedInput | string[]
    modified?: CommitCreatemodifiedInput | string[]
    repoName?: string | null
    owner?: string | null
  }

  export type CommitUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tree_id?: NullableStringFieldUpdateOperationsInput | string | null
    distinct?: NullableBoolFieldUpdateOperationsInput | boolean | null
    message?: StringFieldUpdateOperationsInput | string
    timestamp?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    authorName?: NullableStringFieldUpdateOperationsInput | string | null
    authorEmail?: NullableStringFieldUpdateOperationsInput | string | null
    authorUsername?: NullableStringFieldUpdateOperationsInput | string | null
    committerName?: NullableStringFieldUpdateOperationsInput | string | null
    committerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    committerUsername?: NullableStringFieldUpdateOperationsInput | string | null
    added?: CommitUpdateaddedInput | string[]
    removed?: CommitUpdateremovedInput | string[]
    modified?: CommitUpdatemodifiedInput | string[]
    repoName?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CommitUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tree_id?: NullableStringFieldUpdateOperationsInput | string | null
    distinct?: NullableBoolFieldUpdateOperationsInput | boolean | null
    message?: StringFieldUpdateOperationsInput | string
    timestamp?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    authorName?: NullableStringFieldUpdateOperationsInput | string | null
    authorEmail?: NullableStringFieldUpdateOperationsInput | string | null
    authorUsername?: NullableStringFieldUpdateOperationsInput | string | null
    committerName?: NullableStringFieldUpdateOperationsInput | string | null
    committerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    committerUsername?: NullableStringFieldUpdateOperationsInput | string | null
    added?: CommitUpdateaddedInput | string[]
    removed?: CommitUpdateremovedInput | string[]
    modified?: CommitUpdatemodifiedInput | string[]
    repoName?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CommitCreateManyInput = {
    id: string
    tree_id?: string | null
    distinct?: boolean | null
    message: string
    timestamp: string
    url: string
    authorName?: string | null
    authorEmail?: string | null
    authorUsername?: string | null
    committerName?: string | null
    committerEmail?: string | null
    committerUsername?: string | null
    added?: CommitCreateaddedInput | string[]
    removed?: CommitCreateremovedInput | string[]
    modified?: CommitCreatemodifiedInput | string[]
    repoName?: string | null
    owner?: string | null
  }

  export type CommitUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tree_id?: NullableStringFieldUpdateOperationsInput | string | null
    distinct?: NullableBoolFieldUpdateOperationsInput | boolean | null
    message?: StringFieldUpdateOperationsInput | string
    timestamp?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    authorName?: NullableStringFieldUpdateOperationsInput | string | null
    authorEmail?: NullableStringFieldUpdateOperationsInput | string | null
    authorUsername?: NullableStringFieldUpdateOperationsInput | string | null
    committerName?: NullableStringFieldUpdateOperationsInput | string | null
    committerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    committerUsername?: NullableStringFieldUpdateOperationsInput | string | null
    added?: CommitUpdateaddedInput | string[]
    removed?: CommitUpdateremovedInput | string[]
    modified?: CommitUpdatemodifiedInput | string[]
    repoName?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CommitUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tree_id?: NullableStringFieldUpdateOperationsInput | string | null
    distinct?: NullableBoolFieldUpdateOperationsInput | boolean | null
    message?: StringFieldUpdateOperationsInput | string
    timestamp?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    authorName?: NullableStringFieldUpdateOperationsInput | string | null
    authorEmail?: NullableStringFieldUpdateOperationsInput | string | null
    authorUsername?: NullableStringFieldUpdateOperationsInput | string | null
    committerName?: NullableStringFieldUpdateOperationsInput | string | null
    committerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    committerUsername?: NullableStringFieldUpdateOperationsInput | string | null
    added?: CommitUpdateaddedInput | string[]
    removed?: CommitUpdateremovedInput | string[]
    modified?: CommitUpdatemodifiedInput | string[]
    repoName?: NullableStringFieldUpdateOperationsInput | string | null
    owner?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TaskEventLogCreateInput = {
    id?: string
    authorId: string
    authorName: string
    createdAt?: Date | string
    taskId: string
    taskEvents?: TaskEventCreateNestedManyWithoutTaskEventLogInput
  }

  export type TaskEventLogUncheckedCreateInput = {
    id?: string
    authorId: string
    authorName: string
    createdAt?: Date | string
    taskId: string
    taskEvents?: TaskEventUncheckedCreateNestedManyWithoutTaskEventLogInput
  }

  export type TaskEventLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    taskId?: StringFieldUpdateOperationsInput | string
    taskEvents?: TaskEventUpdateManyWithoutTaskEventLogNestedInput
  }

  export type TaskEventLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    taskId?: StringFieldUpdateOperationsInput | string
    taskEvents?: TaskEventUncheckedUpdateManyWithoutTaskEventLogNestedInput
  }

  export type TaskEventLogCreateManyInput = {
    id?: string
    authorId: string
    authorName: string
    createdAt?: Date | string
    taskId: string
  }

  export type TaskEventLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    taskId?: StringFieldUpdateOperationsInput | string
  }

  export type TaskEventLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    taskId?: StringFieldUpdateOperationsInput | string
  }

  export type TaskEventCreateInput = {
    id?: string
    type: string
    authorId: string
    authorName: string
    updatedAt?: Date | string
    originalLabels?: TaskEventCreateoriginalLabelsInput | $Enums.Label[]
    updatedLabels?: TaskEventCreateupdatedLabelsInput | $Enums.Label[]
    originalValue?: string | null
    updatedValue?: string | null
    originalAssigneeId?: string | null
    originalAssigneeName?: string | null
    updatedAssigneeId?: string | null
    updatedAssigneeName?: string | null
    taskEventLog: TaskEventLogCreateNestedOneWithoutTaskEventsInput
  }

  export type TaskEventUncheckedCreateInput = {
    id?: string
    type: string
    authorId: string
    authorName: string
    taskId: string
    updatedAt?: Date | string
    originalLabels?: TaskEventCreateoriginalLabelsInput | $Enums.Label[]
    updatedLabels?: TaskEventCreateupdatedLabelsInput | $Enums.Label[]
    originalValue?: string | null
    updatedValue?: string | null
    originalAssigneeId?: string | null
    originalAssigneeName?: string | null
    updatedAssigneeId?: string | null
    updatedAssigneeName?: string | null
  }

  export type TaskEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    originalLabels?: TaskEventUpdateoriginalLabelsInput | $Enums.Label[]
    updatedLabels?: TaskEventUpdateupdatedLabelsInput | $Enums.Label[]
    originalValue?: NullableStringFieldUpdateOperationsInput | string | null
    updatedValue?: NullableStringFieldUpdateOperationsInput | string | null
    originalAssigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    originalAssigneeName?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAssigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAssigneeName?: NullableStringFieldUpdateOperationsInput | string | null
    taskEventLog?: TaskEventLogUpdateOneRequiredWithoutTaskEventsNestedInput
  }

  export type TaskEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    taskId?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    originalLabels?: TaskEventUpdateoriginalLabelsInput | $Enums.Label[]
    updatedLabels?: TaskEventUpdateupdatedLabelsInput | $Enums.Label[]
    originalValue?: NullableStringFieldUpdateOperationsInput | string | null
    updatedValue?: NullableStringFieldUpdateOperationsInput | string | null
    originalAssigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    originalAssigneeName?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAssigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAssigneeName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TaskEventCreateManyInput = {
    id?: string
    type: string
    authorId: string
    authorName: string
    taskId: string
    updatedAt?: Date | string
    originalLabels?: TaskEventCreateoriginalLabelsInput | $Enums.Label[]
    updatedLabels?: TaskEventCreateupdatedLabelsInput | $Enums.Label[]
    originalValue?: string | null
    updatedValue?: string | null
    originalAssigneeId?: string | null
    originalAssigneeName?: string | null
    updatedAssigneeId?: string | null
    updatedAssigneeName?: string | null
  }

  export type TaskEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    originalLabels?: TaskEventUpdateoriginalLabelsInput | $Enums.Label[]
    updatedLabels?: TaskEventUpdateupdatedLabelsInput | $Enums.Label[]
    originalValue?: NullableStringFieldUpdateOperationsInput | string | null
    updatedValue?: NullableStringFieldUpdateOperationsInput | string | null
    originalAssigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    originalAssigneeName?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAssigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAssigneeName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TaskEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    taskId?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    originalLabels?: TaskEventUpdateoriginalLabelsInput | $Enums.Label[]
    updatedLabels?: TaskEventUpdateupdatedLabelsInput | $Enums.Label[]
    originalValue?: NullableStringFieldUpdateOperationsInput | string | null
    updatedValue?: NullableStringFieldUpdateOperationsInput | string | null
    originalAssigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    originalAssigneeName?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAssigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAssigneeName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CommentCreateInput = {
    id?: string
    comment: string
    date?: Date | string
    Task: TaskCreateNestedOneWithoutCommentInput
    Author: UserCreateNestedOneWithoutCommentInput
  }

  export type CommentUncheckedCreateInput = {
    id?: string
    comment: string
    authorId: string
    date?: Date | string
    taskId: string
  }

  export type CommentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    comment?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    Task?: TaskUpdateOneRequiredWithoutCommentNestedInput
    Author?: UserUpdateOneRequiredWithoutCommentNestedInput
  }

  export type CommentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    comment?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    taskId?: StringFieldUpdateOperationsInput | string
  }

  export type CommentCreateManyInput = {
    id?: string
    comment: string
    authorId: string
    date?: Date | string
    taskId: string
  }

  export type CommentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    comment?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    comment?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    taskId?: StringFieldUpdateOperationsInput | string
  }

  export type NotificationCreateInput = {
    id?: string
    taskIds?: NotificationCreatetaskIdsInput | string[]
    read?: boolean
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    User: UserCreateNestedOneWithoutNotificationInput
  }

  export type NotificationUncheckedCreateInput = {
    id?: string
    userId: string
    taskIds?: NotificationCreatetaskIdsInput | string[]
    read?: boolean
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskIds?: NotificationUpdatetaskIdsInput | string[]
    read?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    User?: UserUpdateOneRequiredWithoutNotificationNestedInput
  }

  export type NotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    taskIds?: NotificationUpdatetaskIdsInput | string[]
    read?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateManyInput = {
    id?: string
    userId: string
    taskIds?: NotificationCreatetaskIdsInput | string[]
    read?: boolean
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskIds?: NotificationUpdatetaskIdsInput | string[]
    read?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    taskIds?: NotificationUpdatetaskIdsInput | string[]
    read?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PageFilterModelCreateInput = {
    id?: string
    filterTitle: string
    filterOption: JsonNullValueInput | InputJsonValue
    filterDescription?: string | null
    teamId: string
  }

  export type PageFilterModelUncheckedCreateInput = {
    id?: string
    filterTitle: string
    filterOption: JsonNullValueInput | InputJsonValue
    filterDescription?: string | null
    teamId: string
  }

  export type PageFilterModelUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    filterTitle?: StringFieldUpdateOperationsInput | string
    filterOption?: JsonNullValueInput | InputJsonValue
    filterDescription?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: StringFieldUpdateOperationsInput | string
  }

  export type PageFilterModelUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    filterTitle?: StringFieldUpdateOperationsInput | string
    filterOption?: JsonNullValueInput | InputJsonValue
    filterDescription?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: StringFieldUpdateOperationsInput | string
  }

  export type PageFilterModelCreateManyInput = {
    id?: string
    filterTitle: string
    filterOption: JsonNullValueInput | InputJsonValue
    filterDescription?: string | null
    teamId: string
  }

  export type PageFilterModelUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    filterTitle?: StringFieldUpdateOperationsInput | string
    filterOption?: JsonNullValueInput | InputJsonValue
    filterDescription?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: StringFieldUpdateOperationsInput | string
  }

  export type PageFilterModelUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    filterTitle?: StringFieldUpdateOperationsInput | string
    filterOption?: JsonNullValueInput | InputJsonValue
    filterDescription?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: StringFieldUpdateOperationsInput | string
  }

  export type TaskCreateInput = {
    id?: string
    title: string
    description?: string | null
    status: $Enums.Status
    identifier: string
    priority?: $Enums.Priority | null
    labels?: TaskCreatelabelsInput | $Enums.Label[]
    dueDate?: Date | string | null
    effortEstimate?: number | null
    dateCreated?: Date | string
    assigneeId?: string | null
    assigneeName?: string | null
    Author: UserCreateNestedOneWithoutTaskInput
    Team: TeamCreateNestedOneWithoutTasksInput
    Comment?: CommentCreateNestedManyWithoutTaskInput
  }

  export type TaskUncheckedCreateInput = {
    id?: string
    authorId: string
    title: string
    description?: string | null
    status: $Enums.Status
    identifier: string
    priority?: $Enums.Priority | null
    labels?: TaskCreatelabelsInput | $Enums.Label[]
    dueDate?: Date | string | null
    effortEstimate?: number | null
    teamId: string
    dateCreated?: Date | string
    assigneeId?: string | null
    assigneeName?: string | null
    Comment?: CommentUncheckedCreateNestedManyWithoutTaskInput
  }

  export type TaskUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    identifier?: StringFieldUpdateOperationsInput | string
    priority?: NullableEnumPriorityFieldUpdateOperationsInput | $Enums.Priority | null
    labels?: TaskUpdatelabelsInput | $Enums.Label[]
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    effortEstimate?: NullableIntFieldUpdateOperationsInput | number | null
    dateCreated?: DateTimeFieldUpdateOperationsInput | Date | string
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    assigneeName?: NullableStringFieldUpdateOperationsInput | string | null
    Author?: UserUpdateOneRequiredWithoutTaskNestedInput
    Team?: TeamUpdateOneRequiredWithoutTasksNestedInput
    Comment?: CommentUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    identifier?: StringFieldUpdateOperationsInput | string
    priority?: NullableEnumPriorityFieldUpdateOperationsInput | $Enums.Priority | null
    labels?: TaskUpdatelabelsInput | $Enums.Label[]
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    effortEstimate?: NullableIntFieldUpdateOperationsInput | number | null
    teamId?: StringFieldUpdateOperationsInput | string
    dateCreated?: DateTimeFieldUpdateOperationsInput | Date | string
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    assigneeName?: NullableStringFieldUpdateOperationsInput | string | null
    Comment?: CommentUncheckedUpdateManyWithoutTaskNestedInput
  }

  export type TaskCreateManyInput = {
    id?: string
    authorId: string
    title: string
    description?: string | null
    status: $Enums.Status
    identifier: string
    priority?: $Enums.Priority | null
    labels?: TaskCreatelabelsInput | $Enums.Label[]
    dueDate?: Date | string | null
    effortEstimate?: number | null
    teamId: string
    dateCreated?: Date | string
    assigneeId?: string | null
    assigneeName?: string | null
  }

  export type TaskUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    identifier?: StringFieldUpdateOperationsInput | string
    priority?: NullableEnumPriorityFieldUpdateOperationsInput | $Enums.Priority | null
    labels?: TaskUpdatelabelsInput | $Enums.Label[]
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    effortEstimate?: NullableIntFieldUpdateOperationsInput | number | null
    dateCreated?: DateTimeFieldUpdateOperationsInput | Date | string
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    assigneeName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TaskUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    identifier?: StringFieldUpdateOperationsInput | string
    priority?: NullableEnumPriorityFieldUpdateOperationsInput | $Enums.Priority | null
    labels?: TaskUpdatelabelsInput | $Enums.Label[]
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    effortEstimate?: NullableIntFieldUpdateOperationsInput | number | null
    teamId?: StringFieldUpdateOperationsInput | string
    dateCreated?: DateTimeFieldUpdateOperationsInput | Date | string
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    assigneeName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TeamCreateInput = {
    id?: string
    name?: string | null
    identifier: string
    Users?: UserCreateNestedManyWithoutTeamsInput
    Tasks?: TaskCreateNestedManyWithoutTeamInput
    Workspace: WorkspaceCreateNestedOneWithoutTeamsInput
    Project?: ProjectCreateNestedManyWithoutTeamInput
  }

  export type TeamUncheckedCreateInput = {
    id?: string
    name?: string | null
    identifier: string
    workspaceId: string
    Users?: UserUncheckedCreateNestedManyWithoutTeamsInput
    Tasks?: TaskUncheckedCreateNestedManyWithoutTeamInput
    Project?: ProjectUncheckedCreateNestedManyWithoutTeamInput
  }

  export type TeamUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    identifier?: StringFieldUpdateOperationsInput | string
    Users?: UserUpdateManyWithoutTeamsNestedInput
    Tasks?: TaskUpdateManyWithoutTeamNestedInput
    Workspace?: WorkspaceUpdateOneRequiredWithoutTeamsNestedInput
    Project?: ProjectUpdateManyWithoutTeamNestedInput
  }

  export type TeamUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    identifier?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    Users?: UserUncheckedUpdateManyWithoutTeamsNestedInput
    Tasks?: TaskUncheckedUpdateManyWithoutTeamNestedInput
    Project?: ProjectUncheckedUpdateManyWithoutTeamNestedInput
  }

  export type TeamCreateManyInput = {
    id?: string
    name?: string | null
    identifier: string
    workspaceId: string
  }

  export type TeamUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    identifier?: StringFieldUpdateOperationsInput | string
  }

  export type TeamUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    identifier?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
  }

  export type UserCreateInput = {
    id?: string
    name: string
    username?: string | null
    email: string
    password: string
    verified?: boolean
    lastLogin?: Date | string
    onBoarding?: boolean
    DefaultWorkspace?: WorkspaceCreateNestedOneWithoutUserInput
    Workspaces?: WorkspaceCreateNestedManyWithoutUsersInput
    Teams?: TeamCreateNestedManyWithoutUsersInput
    Notification?: NotificationCreateNestedManyWithoutUserInput
    Comment?: CommentCreateNestedManyWithoutAuthorInput
    Task?: TaskCreateNestedManyWithoutAuthorInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    username?: string | null
    email: string
    password: string
    verified?: boolean
    lastLogin?: Date | string
    onBoarding?: boolean
    defaultWorkspaceId?: string | null
    Workspaces?: WorkspaceUncheckedCreateNestedManyWithoutUsersInput
    Teams?: TeamUncheckedCreateNestedManyWithoutUsersInput
    Notification?: NotificationUncheckedCreateNestedManyWithoutUserInput
    Comment?: CommentUncheckedCreateNestedManyWithoutAuthorInput
    Task?: TaskUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: DateTimeFieldUpdateOperationsInput | Date | string
    onBoarding?: BoolFieldUpdateOperationsInput | boolean
    DefaultWorkspace?: WorkspaceUpdateOneWithoutUserNestedInput
    Workspaces?: WorkspaceUpdateManyWithoutUsersNestedInput
    Teams?: TeamUpdateManyWithoutUsersNestedInput
    Notification?: NotificationUpdateManyWithoutUserNestedInput
    Comment?: CommentUpdateManyWithoutAuthorNestedInput
    Task?: TaskUpdateManyWithoutAuthorNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: DateTimeFieldUpdateOperationsInput | Date | string
    onBoarding?: BoolFieldUpdateOperationsInput | boolean
    defaultWorkspaceId?: NullableStringFieldUpdateOperationsInput | string | null
    Workspaces?: WorkspaceUncheckedUpdateManyWithoutUsersNestedInput
    Teams?: TeamUncheckedUpdateManyWithoutUsersNestedInput
    Notification?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    Comment?: CommentUncheckedUpdateManyWithoutAuthorNestedInput
    Task?: TaskUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    username?: string | null
    email: string
    password: string
    verified?: boolean
    lastLogin?: Date | string
    onBoarding?: boolean
    defaultWorkspaceId?: string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: DateTimeFieldUpdateOperationsInput | Date | string
    onBoarding?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: DateTimeFieldUpdateOperationsInput | Date | string
    onBoarding?: BoolFieldUpdateOperationsInput | boolean
    defaultWorkspaceId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type WorkspaceCreateInput = {
    id?: string
    name?: string | null
    url?: string | null
    companySize?: number | null
    issuesCreated?: number | null
    universalTokenLink?: UniversalTokenLinkCreateNestedOneWithoutWorkspaceInput
    teams?: TeamCreateNestedManyWithoutWorkspaceInput
    projects?: ProjectCreateNestedManyWithoutWorkspaceInput
    githubRepoInfo?: GithubRepoInfoCreateNestedOneWithoutWorkspaceInput
    Users?: UserCreateNestedManyWithoutWorkspacesInput
    User?: UserCreateNestedManyWithoutDefaultWorkspaceInput
  }

  export type WorkspaceUncheckedCreateInput = {
    id?: string
    name?: string | null
    url?: string | null
    companySize?: number | null
    issuesCreated?: number | null
    universalTokenLinkId?: string | null
    githubRepoInfoId?: string | null
    teams?: TeamUncheckedCreateNestedManyWithoutWorkspaceInput
    projects?: ProjectUncheckedCreateNestedManyWithoutWorkspaceInput
    Users?: UserUncheckedCreateNestedManyWithoutWorkspacesInput
    User?: UserUncheckedCreateNestedManyWithoutDefaultWorkspaceInput
  }

  export type WorkspaceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableIntFieldUpdateOperationsInput | number | null
    issuesCreated?: NullableIntFieldUpdateOperationsInput | number | null
    universalTokenLink?: UniversalTokenLinkUpdateOneWithoutWorkspaceNestedInput
    teams?: TeamUpdateManyWithoutWorkspaceNestedInput
    projects?: ProjectUpdateManyWithoutWorkspaceNestedInput
    githubRepoInfo?: GithubRepoInfoUpdateOneWithoutWorkspaceNestedInput
    Users?: UserUpdateManyWithoutWorkspacesNestedInput
    User?: UserUpdateManyWithoutDefaultWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableIntFieldUpdateOperationsInput | number | null
    issuesCreated?: NullableIntFieldUpdateOperationsInput | number | null
    universalTokenLinkId?: NullableStringFieldUpdateOperationsInput | string | null
    githubRepoInfoId?: NullableStringFieldUpdateOperationsInput | string | null
    teams?: TeamUncheckedUpdateManyWithoutWorkspaceNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutWorkspaceNestedInput
    Users?: UserUncheckedUpdateManyWithoutWorkspacesNestedInput
    User?: UserUncheckedUpdateManyWithoutDefaultWorkspaceNestedInput
  }

  export type WorkspaceCreateManyInput = {
    id?: string
    name?: string | null
    url?: string | null
    companySize?: number | null
    issuesCreated?: number | null
    universalTokenLinkId?: string | null
    githubRepoInfoId?: string | null
  }

  export type WorkspaceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableIntFieldUpdateOperationsInput | number | null
    issuesCreated?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type WorkspaceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableIntFieldUpdateOperationsInput | number | null
    issuesCreated?: NullableIntFieldUpdateOperationsInput | number | null
    universalTokenLinkId?: NullableStringFieldUpdateOperationsInput | string | null
    githubRepoInfoId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UniversalTokenLinkCreateInput = {
    id?: string
    token?: string
    isEnabled?: boolean
    Workspace?: WorkspaceCreateNestedManyWithoutUniversalTokenLinkInput
  }

  export type UniversalTokenLinkUncheckedCreateInput = {
    id?: string
    token?: string
    isEnabled?: boolean
    Workspace?: WorkspaceUncheckedCreateNestedManyWithoutUniversalTokenLinkInput
  }

  export type UniversalTokenLinkUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    Workspace?: WorkspaceUpdateManyWithoutUniversalTokenLinkNestedInput
  }

  export type UniversalTokenLinkUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    Workspace?: WorkspaceUncheckedUpdateManyWithoutUniversalTokenLinkNestedInput
  }

  export type UniversalTokenLinkCreateManyInput = {
    id?: string
    token?: string
    isEnabled?: boolean
  }

  export type UniversalTokenLinkUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UniversalTokenLinkUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type GithubRepoInfoCreateInput = {
    id?: string
    repoName?: string
    owner?: string
    Workspace?: WorkspaceCreateNestedManyWithoutGithubRepoInfoInput
  }

  export type GithubRepoInfoUncheckedCreateInput = {
    id?: string
    repoName?: string
    owner?: string
    Workspace?: WorkspaceUncheckedCreateNestedManyWithoutGithubRepoInfoInput
  }

  export type GithubRepoInfoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    repoName?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    Workspace?: WorkspaceUpdateManyWithoutGithubRepoInfoNestedInput
  }

  export type GithubRepoInfoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    repoName?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
    Workspace?: WorkspaceUncheckedUpdateManyWithoutGithubRepoInfoNestedInput
  }

  export type GithubRepoInfoCreateManyInput = {
    id?: string
    repoName?: string
    owner?: string
  }

  export type GithubRepoInfoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    repoName?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
  }

  export type GithubRepoInfoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    repoName?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
  }

  export type ProjectCreateInput = {
    id?: string
    name: string
    Team?: TeamCreateNestedOneWithoutProjectInput
    Workspace?: WorkspaceCreateNestedOneWithoutProjectsInput
  }

  export type ProjectUncheckedCreateInput = {
    id?: string
    name: string
    teamId?: string | null
    workspaceId?: string | null
  }

  export type ProjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    Team?: TeamUpdateOneWithoutProjectNestedInput
    Workspace?: WorkspaceUpdateOneWithoutProjectsNestedInput
  }

  export type ProjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    workspaceId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProjectCreateManyInput = {
    id?: string
    name: string
    teamId?: string | null
    workspaceId?: string | null
  }

  export type ProjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type ProjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    workspaceId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CommitCountOrderByAggregateInput = {
    id?: SortOrder
    tree_id?: SortOrder
    distinct?: SortOrder
    message?: SortOrder
    timestamp?: SortOrder
    url?: SortOrder
    authorName?: SortOrder
    authorEmail?: SortOrder
    authorUsername?: SortOrder
    committerName?: SortOrder
    committerEmail?: SortOrder
    committerUsername?: SortOrder
    added?: SortOrder
    removed?: SortOrder
    modified?: SortOrder
    repoName?: SortOrder
    owner?: SortOrder
  }

  export type CommitMaxOrderByAggregateInput = {
    id?: SortOrder
    tree_id?: SortOrder
    distinct?: SortOrder
    message?: SortOrder
    timestamp?: SortOrder
    url?: SortOrder
    authorName?: SortOrder
    authorEmail?: SortOrder
    authorUsername?: SortOrder
    committerName?: SortOrder
    committerEmail?: SortOrder
    committerUsername?: SortOrder
    repoName?: SortOrder
    owner?: SortOrder
  }

  export type CommitMinOrderByAggregateInput = {
    id?: SortOrder
    tree_id?: SortOrder
    distinct?: SortOrder
    message?: SortOrder
    timestamp?: SortOrder
    url?: SortOrder
    authorName?: SortOrder
    authorEmail?: SortOrder
    authorUsername?: SortOrder
    committerName?: SortOrder
    committerEmail?: SortOrder
    committerUsername?: SortOrder
    repoName?: SortOrder
    owner?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type TaskEventListRelationFilter = {
    every?: TaskEventWhereInput
    some?: TaskEventWhereInput
    none?: TaskEventWhereInput
  }

  export type TaskEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TaskEventLogCountOrderByAggregateInput = {
    id?: SortOrder
    authorId?: SortOrder
    authorName?: SortOrder
    createdAt?: SortOrder
    taskId?: SortOrder
  }

  export type TaskEventLogMaxOrderByAggregateInput = {
    id?: SortOrder
    authorId?: SortOrder
    authorName?: SortOrder
    createdAt?: SortOrder
    taskId?: SortOrder
  }

  export type TaskEventLogMinOrderByAggregateInput = {
    id?: SortOrder
    authorId?: SortOrder
    authorName?: SortOrder
    createdAt?: SortOrder
    taskId?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumLabelNullableListFilter<$PrismaModel = never> = {
    equals?: $Enums.Label[] | ListEnumLabelFieldRefInput<$PrismaModel> | null
    has?: $Enums.Label | EnumLabelFieldRefInput<$PrismaModel> | null
    hasEvery?: $Enums.Label[] | ListEnumLabelFieldRefInput<$PrismaModel>
    hasSome?: $Enums.Label[] | ListEnumLabelFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type TaskEventLogRelationFilter = {
    is?: TaskEventLogWhereInput
    isNot?: TaskEventLogWhereInput
  }

  export type TaskEventCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    authorId?: SortOrder
    authorName?: SortOrder
    taskId?: SortOrder
    updatedAt?: SortOrder
    originalLabels?: SortOrder
    updatedLabels?: SortOrder
    originalValue?: SortOrder
    updatedValue?: SortOrder
    originalAssigneeId?: SortOrder
    originalAssigneeName?: SortOrder
    updatedAssigneeId?: SortOrder
    updatedAssigneeName?: SortOrder
  }

  export type TaskEventMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    authorId?: SortOrder
    authorName?: SortOrder
    taskId?: SortOrder
    updatedAt?: SortOrder
    originalValue?: SortOrder
    updatedValue?: SortOrder
    originalAssigneeId?: SortOrder
    originalAssigneeName?: SortOrder
    updatedAssigneeId?: SortOrder
    updatedAssigneeName?: SortOrder
  }

  export type TaskEventMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    authorId?: SortOrder
    authorName?: SortOrder
    taskId?: SortOrder
    updatedAt?: SortOrder
    originalValue?: SortOrder
    updatedValue?: SortOrder
    originalAssigneeId?: SortOrder
    originalAssigneeName?: SortOrder
    updatedAssigneeId?: SortOrder
    updatedAssigneeName?: SortOrder
  }

  export type TaskRelationFilter = {
    is?: TaskWhereInput
    isNot?: TaskWhereInput
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type CommentCountOrderByAggregateInput = {
    id?: SortOrder
    comment?: SortOrder
    authorId?: SortOrder
    date?: SortOrder
    taskId?: SortOrder
  }

  export type CommentMaxOrderByAggregateInput = {
    id?: SortOrder
    comment?: SortOrder
    authorId?: SortOrder
    date?: SortOrder
    taskId?: SortOrder
  }

  export type CommentMinOrderByAggregateInput = {
    id?: SortOrder
    comment?: SortOrder
    authorId?: SortOrder
    date?: SortOrder
    taskId?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    taskIds?: SortOrder
    read?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    read?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    read?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type PageFilterModelCountOrderByAggregateInput = {
    id?: SortOrder
    filterTitle?: SortOrder
    filterOption?: SortOrder
    filterDescription?: SortOrder
    teamId?: SortOrder
  }

  export type PageFilterModelMaxOrderByAggregateInput = {
    id?: SortOrder
    filterTitle?: SortOrder
    filterDescription?: SortOrder
    teamId?: SortOrder
  }

  export type PageFilterModelMinOrderByAggregateInput = {
    id?: SortOrder
    filterTitle?: SortOrder
    filterDescription?: SortOrder
    teamId?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type EnumStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.Status | EnumStatusFieldRefInput<$PrismaModel>
    in?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusFilter<$PrismaModel> | $Enums.Status
  }

  export type EnumPriorityNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.Priority | EnumPriorityFieldRefInput<$PrismaModel> | null
    in?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPriorityNullableFilter<$PrismaModel> | $Enums.Priority | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type TeamRelationFilter = {
    is?: TeamWhereInput
    isNot?: TeamWhereInput
  }

  export type CommentListRelationFilter = {
    every?: CommentWhereInput
    some?: CommentWhereInput
    none?: CommentWhereInput
  }

  export type CommentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TaskCountOrderByAggregateInput = {
    id?: SortOrder
    authorId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    identifier?: SortOrder
    priority?: SortOrder
    labels?: SortOrder
    dueDate?: SortOrder
    effortEstimate?: SortOrder
    teamId?: SortOrder
    dateCreated?: SortOrder
    assigneeId?: SortOrder
    assigneeName?: SortOrder
  }

  export type TaskAvgOrderByAggregateInput = {
    effortEstimate?: SortOrder
  }

  export type TaskMaxOrderByAggregateInput = {
    id?: SortOrder
    authorId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    identifier?: SortOrder
    priority?: SortOrder
    dueDate?: SortOrder
    effortEstimate?: SortOrder
    teamId?: SortOrder
    dateCreated?: SortOrder
    assigneeId?: SortOrder
    assigneeName?: SortOrder
  }

  export type TaskMinOrderByAggregateInput = {
    id?: SortOrder
    authorId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    identifier?: SortOrder
    priority?: SortOrder
    dueDate?: SortOrder
    effortEstimate?: SortOrder
    teamId?: SortOrder
    dateCreated?: SortOrder
    assigneeId?: SortOrder
    assigneeName?: SortOrder
  }

  export type TaskSumOrderByAggregateInput = {
    effortEstimate?: SortOrder
  }

  export type EnumStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Status | EnumStatusFieldRefInput<$PrismaModel>
    in?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusWithAggregatesFilter<$PrismaModel> | $Enums.Status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusFilter<$PrismaModel>
    _max?: NestedEnumStatusFilter<$PrismaModel>
  }

  export type EnumPriorityNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Priority | EnumPriorityFieldRefInput<$PrismaModel> | null
    in?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPriorityNullableWithAggregatesFilter<$PrismaModel> | $Enums.Priority | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPriorityNullableFilter<$PrismaModel>
    _max?: NestedEnumPriorityNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type TaskListRelationFilter = {
    every?: TaskWhereInput
    some?: TaskWhereInput
    none?: TaskWhereInput
  }

  export type WorkspaceRelationFilter = {
    is?: WorkspaceWhereInput
    isNot?: WorkspaceWhereInput
  }

  export type ProjectListRelationFilter = {
    every?: ProjectWhereInput
    some?: ProjectWhereInput
    none?: ProjectWhereInput
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TaskOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TeamCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    identifier?: SortOrder
    workspaceId?: SortOrder
  }

  export type TeamMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    identifier?: SortOrder
    workspaceId?: SortOrder
  }

  export type TeamMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    identifier?: SortOrder
    workspaceId?: SortOrder
  }

  export type WorkspaceNullableRelationFilter = {
    is?: WorkspaceWhereInput | null
    isNot?: WorkspaceWhereInput | null
  }

  export type WorkspaceListRelationFilter = {
    every?: WorkspaceWhereInput
    some?: WorkspaceWhereInput
    none?: WorkspaceWhereInput
  }

  export type TeamListRelationFilter = {
    every?: TeamWhereInput
    some?: TeamWhereInput
    none?: TeamWhereInput
  }

  export type NotificationListRelationFilter = {
    every?: NotificationWhereInput
    some?: NotificationWhereInput
    none?: NotificationWhereInput
  }

  export type WorkspaceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TeamOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    verified?: SortOrder
    lastLogin?: SortOrder
    onBoarding?: SortOrder
    defaultWorkspaceId?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    verified?: SortOrder
    lastLogin?: SortOrder
    onBoarding?: SortOrder
    defaultWorkspaceId?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    verified?: SortOrder
    lastLogin?: SortOrder
    onBoarding?: SortOrder
    defaultWorkspaceId?: SortOrder
  }

  export type UniversalTokenLinkNullableRelationFilter = {
    is?: UniversalTokenLinkWhereInput | null
    isNot?: UniversalTokenLinkWhereInput | null
  }

  export type GithubRepoInfoNullableRelationFilter = {
    is?: GithubRepoInfoWhereInput | null
    isNot?: GithubRepoInfoWhereInput | null
  }

  export type WorkspaceCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    companySize?: SortOrder
    issuesCreated?: SortOrder
    universalTokenLinkId?: SortOrder
    githubRepoInfoId?: SortOrder
  }

  export type WorkspaceAvgOrderByAggregateInput = {
    companySize?: SortOrder
    issuesCreated?: SortOrder
  }

  export type WorkspaceMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    companySize?: SortOrder
    issuesCreated?: SortOrder
    universalTokenLinkId?: SortOrder
    githubRepoInfoId?: SortOrder
  }

  export type WorkspaceMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    url?: SortOrder
    companySize?: SortOrder
    issuesCreated?: SortOrder
    universalTokenLinkId?: SortOrder
    githubRepoInfoId?: SortOrder
  }

  export type WorkspaceSumOrderByAggregateInput = {
    companySize?: SortOrder
    issuesCreated?: SortOrder
  }

  export type UniversalTokenLinkCountOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    isEnabled?: SortOrder
  }

  export type UniversalTokenLinkMaxOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    isEnabled?: SortOrder
  }

  export type UniversalTokenLinkMinOrderByAggregateInput = {
    id?: SortOrder
    token?: SortOrder
    isEnabled?: SortOrder
  }

  export type GithubRepoInfoCountOrderByAggregateInput = {
    id?: SortOrder
    repoName?: SortOrder
    owner?: SortOrder
  }

  export type GithubRepoInfoMaxOrderByAggregateInput = {
    id?: SortOrder
    repoName?: SortOrder
    owner?: SortOrder
  }

  export type GithubRepoInfoMinOrderByAggregateInput = {
    id?: SortOrder
    repoName?: SortOrder
    owner?: SortOrder
  }

  export type TeamNullableRelationFilter = {
    is?: TeamWhereInput | null
    isNot?: TeamWhereInput | null
  }

  export type ProjectCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    teamId?: SortOrder
    workspaceId?: SortOrder
  }

  export type ProjectMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    teamId?: SortOrder
    workspaceId?: SortOrder
  }

  export type ProjectMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    teamId?: SortOrder
    workspaceId?: SortOrder
  }

  export type CommitCreateaddedInput = {
    set: string[]
  }

  export type CommitCreateremovedInput = {
    set: string[]
  }

  export type CommitCreatemodifiedInput = {
    set: string[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type CommitUpdateaddedInput = {
    set?: string[]
    push?: string | string[]
  }

  export type CommitUpdateremovedInput = {
    set?: string[]
    push?: string | string[]
  }

  export type CommitUpdatemodifiedInput = {
    set?: string[]
    push?: string | string[]
  }

  export type TaskEventCreateNestedManyWithoutTaskEventLogInput = {
    create?: XOR<TaskEventCreateWithoutTaskEventLogInput, TaskEventUncheckedCreateWithoutTaskEventLogInput> | TaskEventCreateWithoutTaskEventLogInput[] | TaskEventUncheckedCreateWithoutTaskEventLogInput[]
    connectOrCreate?: TaskEventCreateOrConnectWithoutTaskEventLogInput | TaskEventCreateOrConnectWithoutTaskEventLogInput[]
    createMany?: TaskEventCreateManyTaskEventLogInputEnvelope
    connect?: TaskEventWhereUniqueInput | TaskEventWhereUniqueInput[]
  }

  export type TaskEventUncheckedCreateNestedManyWithoutTaskEventLogInput = {
    create?: XOR<TaskEventCreateWithoutTaskEventLogInput, TaskEventUncheckedCreateWithoutTaskEventLogInput> | TaskEventCreateWithoutTaskEventLogInput[] | TaskEventUncheckedCreateWithoutTaskEventLogInput[]
    connectOrCreate?: TaskEventCreateOrConnectWithoutTaskEventLogInput | TaskEventCreateOrConnectWithoutTaskEventLogInput[]
    createMany?: TaskEventCreateManyTaskEventLogInputEnvelope
    connect?: TaskEventWhereUniqueInput | TaskEventWhereUniqueInput[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TaskEventUpdateManyWithoutTaskEventLogNestedInput = {
    create?: XOR<TaskEventCreateWithoutTaskEventLogInput, TaskEventUncheckedCreateWithoutTaskEventLogInput> | TaskEventCreateWithoutTaskEventLogInput[] | TaskEventUncheckedCreateWithoutTaskEventLogInput[]
    connectOrCreate?: TaskEventCreateOrConnectWithoutTaskEventLogInput | TaskEventCreateOrConnectWithoutTaskEventLogInput[]
    upsert?: TaskEventUpsertWithWhereUniqueWithoutTaskEventLogInput | TaskEventUpsertWithWhereUniqueWithoutTaskEventLogInput[]
    createMany?: TaskEventCreateManyTaskEventLogInputEnvelope
    set?: TaskEventWhereUniqueInput | TaskEventWhereUniqueInput[]
    disconnect?: TaskEventWhereUniqueInput | TaskEventWhereUniqueInput[]
    delete?: TaskEventWhereUniqueInput | TaskEventWhereUniqueInput[]
    connect?: TaskEventWhereUniqueInput | TaskEventWhereUniqueInput[]
    update?: TaskEventUpdateWithWhereUniqueWithoutTaskEventLogInput | TaskEventUpdateWithWhereUniqueWithoutTaskEventLogInput[]
    updateMany?: TaskEventUpdateManyWithWhereWithoutTaskEventLogInput | TaskEventUpdateManyWithWhereWithoutTaskEventLogInput[]
    deleteMany?: TaskEventScalarWhereInput | TaskEventScalarWhereInput[]
  }

  export type TaskEventUncheckedUpdateManyWithoutTaskEventLogNestedInput = {
    create?: XOR<TaskEventCreateWithoutTaskEventLogInput, TaskEventUncheckedCreateWithoutTaskEventLogInput> | TaskEventCreateWithoutTaskEventLogInput[] | TaskEventUncheckedCreateWithoutTaskEventLogInput[]
    connectOrCreate?: TaskEventCreateOrConnectWithoutTaskEventLogInput | TaskEventCreateOrConnectWithoutTaskEventLogInput[]
    upsert?: TaskEventUpsertWithWhereUniqueWithoutTaskEventLogInput | TaskEventUpsertWithWhereUniqueWithoutTaskEventLogInput[]
    createMany?: TaskEventCreateManyTaskEventLogInputEnvelope
    set?: TaskEventWhereUniqueInput | TaskEventWhereUniqueInput[]
    disconnect?: TaskEventWhereUniqueInput | TaskEventWhereUniqueInput[]
    delete?: TaskEventWhereUniqueInput | TaskEventWhereUniqueInput[]
    connect?: TaskEventWhereUniqueInput | TaskEventWhereUniqueInput[]
    update?: TaskEventUpdateWithWhereUniqueWithoutTaskEventLogInput | TaskEventUpdateWithWhereUniqueWithoutTaskEventLogInput[]
    updateMany?: TaskEventUpdateManyWithWhereWithoutTaskEventLogInput | TaskEventUpdateManyWithWhereWithoutTaskEventLogInput[]
    deleteMany?: TaskEventScalarWhereInput | TaskEventScalarWhereInput[]
  }

  export type TaskEventCreateoriginalLabelsInput = {
    set: $Enums.Label[]
  }

  export type TaskEventCreateupdatedLabelsInput = {
    set: $Enums.Label[]
  }

  export type TaskEventLogCreateNestedOneWithoutTaskEventsInput = {
    create?: XOR<TaskEventLogCreateWithoutTaskEventsInput, TaskEventLogUncheckedCreateWithoutTaskEventsInput>
    connectOrCreate?: TaskEventLogCreateOrConnectWithoutTaskEventsInput
    connect?: TaskEventLogWhereUniqueInput
  }

  export type TaskEventUpdateoriginalLabelsInput = {
    set?: $Enums.Label[]
    push?: $Enums.Label | $Enums.Label[]
  }

  export type TaskEventUpdateupdatedLabelsInput = {
    set?: $Enums.Label[]
    push?: $Enums.Label | $Enums.Label[]
  }

  export type TaskEventLogUpdateOneRequiredWithoutTaskEventsNestedInput = {
    create?: XOR<TaskEventLogCreateWithoutTaskEventsInput, TaskEventLogUncheckedCreateWithoutTaskEventsInput>
    connectOrCreate?: TaskEventLogCreateOrConnectWithoutTaskEventsInput
    upsert?: TaskEventLogUpsertWithoutTaskEventsInput
    connect?: TaskEventLogWhereUniqueInput
    update?: XOR<XOR<TaskEventLogUpdateToOneWithWhereWithoutTaskEventsInput, TaskEventLogUpdateWithoutTaskEventsInput>, TaskEventLogUncheckedUpdateWithoutTaskEventsInput>
  }

  export type TaskCreateNestedOneWithoutCommentInput = {
    create?: XOR<TaskCreateWithoutCommentInput, TaskUncheckedCreateWithoutCommentInput>
    connectOrCreate?: TaskCreateOrConnectWithoutCommentInput
    connect?: TaskWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutCommentInput = {
    create?: XOR<UserCreateWithoutCommentInput, UserUncheckedCreateWithoutCommentInput>
    connectOrCreate?: UserCreateOrConnectWithoutCommentInput
    connect?: UserWhereUniqueInput
  }

  export type TaskUpdateOneRequiredWithoutCommentNestedInput = {
    create?: XOR<TaskCreateWithoutCommentInput, TaskUncheckedCreateWithoutCommentInput>
    connectOrCreate?: TaskCreateOrConnectWithoutCommentInput
    upsert?: TaskUpsertWithoutCommentInput
    connect?: TaskWhereUniqueInput
    update?: XOR<XOR<TaskUpdateToOneWithWhereWithoutCommentInput, TaskUpdateWithoutCommentInput>, TaskUncheckedUpdateWithoutCommentInput>
  }

  export type UserUpdateOneRequiredWithoutCommentNestedInput = {
    create?: XOR<UserCreateWithoutCommentInput, UserUncheckedCreateWithoutCommentInput>
    connectOrCreate?: UserCreateOrConnectWithoutCommentInput
    upsert?: UserUpsertWithoutCommentInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCommentInput, UserUpdateWithoutCommentInput>, UserUncheckedUpdateWithoutCommentInput>
  }

  export type NotificationCreatetaskIdsInput = {
    set: string[]
  }

  export type UserCreateNestedOneWithoutNotificationInput = {
    create?: XOR<UserCreateWithoutNotificationInput, UserUncheckedCreateWithoutNotificationInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationInput
    connect?: UserWhereUniqueInput
  }

  export type NotificationUpdatetaskIdsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateOneRequiredWithoutNotificationNestedInput = {
    create?: XOR<UserCreateWithoutNotificationInput, UserUncheckedCreateWithoutNotificationInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationInput
    upsert?: UserUpsertWithoutNotificationInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutNotificationInput, UserUpdateWithoutNotificationInput>, UserUncheckedUpdateWithoutNotificationInput>
  }

  export type TaskCreatelabelsInput = {
    set: $Enums.Label[]
  }

  export type UserCreateNestedOneWithoutTaskInput = {
    create?: XOR<UserCreateWithoutTaskInput, UserUncheckedCreateWithoutTaskInput>
    connectOrCreate?: UserCreateOrConnectWithoutTaskInput
    connect?: UserWhereUniqueInput
  }

  export type TeamCreateNestedOneWithoutTasksInput = {
    create?: XOR<TeamCreateWithoutTasksInput, TeamUncheckedCreateWithoutTasksInput>
    connectOrCreate?: TeamCreateOrConnectWithoutTasksInput
    connect?: TeamWhereUniqueInput
  }

  export type CommentCreateNestedManyWithoutTaskInput = {
    create?: XOR<CommentCreateWithoutTaskInput, CommentUncheckedCreateWithoutTaskInput> | CommentCreateWithoutTaskInput[] | CommentUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutTaskInput | CommentCreateOrConnectWithoutTaskInput[]
    createMany?: CommentCreateManyTaskInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type CommentUncheckedCreateNestedManyWithoutTaskInput = {
    create?: XOR<CommentCreateWithoutTaskInput, CommentUncheckedCreateWithoutTaskInput> | CommentCreateWithoutTaskInput[] | CommentUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutTaskInput | CommentCreateOrConnectWithoutTaskInput[]
    createMany?: CommentCreateManyTaskInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type EnumStatusFieldUpdateOperationsInput = {
    set?: $Enums.Status
  }

  export type NullableEnumPriorityFieldUpdateOperationsInput = {
    set?: $Enums.Priority | null
  }

  export type TaskUpdatelabelsInput = {
    set?: $Enums.Label[]
    push?: $Enums.Label | $Enums.Label[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutTaskNestedInput = {
    create?: XOR<UserCreateWithoutTaskInput, UserUncheckedCreateWithoutTaskInput>
    connectOrCreate?: UserCreateOrConnectWithoutTaskInput
    upsert?: UserUpsertWithoutTaskInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTaskInput, UserUpdateWithoutTaskInput>, UserUncheckedUpdateWithoutTaskInput>
  }

  export type TeamUpdateOneRequiredWithoutTasksNestedInput = {
    create?: XOR<TeamCreateWithoutTasksInput, TeamUncheckedCreateWithoutTasksInput>
    connectOrCreate?: TeamCreateOrConnectWithoutTasksInput
    upsert?: TeamUpsertWithoutTasksInput
    connect?: TeamWhereUniqueInput
    update?: XOR<XOR<TeamUpdateToOneWithWhereWithoutTasksInput, TeamUpdateWithoutTasksInput>, TeamUncheckedUpdateWithoutTasksInput>
  }

  export type CommentUpdateManyWithoutTaskNestedInput = {
    create?: XOR<CommentCreateWithoutTaskInput, CommentUncheckedCreateWithoutTaskInput> | CommentCreateWithoutTaskInput[] | CommentUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutTaskInput | CommentCreateOrConnectWithoutTaskInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutTaskInput | CommentUpsertWithWhereUniqueWithoutTaskInput[]
    createMany?: CommentCreateManyTaskInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutTaskInput | CommentUpdateWithWhereUniqueWithoutTaskInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutTaskInput | CommentUpdateManyWithWhereWithoutTaskInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type CommentUncheckedUpdateManyWithoutTaskNestedInput = {
    create?: XOR<CommentCreateWithoutTaskInput, CommentUncheckedCreateWithoutTaskInput> | CommentCreateWithoutTaskInput[] | CommentUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutTaskInput | CommentCreateOrConnectWithoutTaskInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutTaskInput | CommentUpsertWithWhereUniqueWithoutTaskInput[]
    createMany?: CommentCreateManyTaskInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutTaskInput | CommentUpdateWithWhereUniqueWithoutTaskInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutTaskInput | CommentUpdateManyWithWhereWithoutTaskInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type UserCreateNestedManyWithoutTeamsInput = {
    create?: XOR<UserCreateWithoutTeamsInput, UserUncheckedCreateWithoutTeamsInput> | UserCreateWithoutTeamsInput[] | UserUncheckedCreateWithoutTeamsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTeamsInput | UserCreateOrConnectWithoutTeamsInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type TaskCreateNestedManyWithoutTeamInput = {
    create?: XOR<TaskCreateWithoutTeamInput, TaskUncheckedCreateWithoutTeamInput> | TaskCreateWithoutTeamInput[] | TaskUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutTeamInput | TaskCreateOrConnectWithoutTeamInput[]
    createMany?: TaskCreateManyTeamInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type WorkspaceCreateNestedOneWithoutTeamsInput = {
    create?: XOR<WorkspaceCreateWithoutTeamsInput, WorkspaceUncheckedCreateWithoutTeamsInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutTeamsInput
    connect?: WorkspaceWhereUniqueInput
  }

  export type ProjectCreateNestedManyWithoutTeamInput = {
    create?: XOR<ProjectCreateWithoutTeamInput, ProjectUncheckedCreateWithoutTeamInput> | ProjectCreateWithoutTeamInput[] | ProjectUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutTeamInput | ProjectCreateOrConnectWithoutTeamInput[]
    createMany?: ProjectCreateManyTeamInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutTeamsInput = {
    create?: XOR<UserCreateWithoutTeamsInput, UserUncheckedCreateWithoutTeamsInput> | UserCreateWithoutTeamsInput[] | UserUncheckedCreateWithoutTeamsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTeamsInput | UserCreateOrConnectWithoutTeamsInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type TaskUncheckedCreateNestedManyWithoutTeamInput = {
    create?: XOR<TaskCreateWithoutTeamInput, TaskUncheckedCreateWithoutTeamInput> | TaskCreateWithoutTeamInput[] | TaskUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutTeamInput | TaskCreateOrConnectWithoutTeamInput[]
    createMany?: TaskCreateManyTeamInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type ProjectUncheckedCreateNestedManyWithoutTeamInput = {
    create?: XOR<ProjectCreateWithoutTeamInput, ProjectUncheckedCreateWithoutTeamInput> | ProjectCreateWithoutTeamInput[] | ProjectUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutTeamInput | ProjectCreateOrConnectWithoutTeamInput[]
    createMany?: ProjectCreateManyTeamInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type UserUpdateManyWithoutTeamsNestedInput = {
    create?: XOR<UserCreateWithoutTeamsInput, UserUncheckedCreateWithoutTeamsInput> | UserCreateWithoutTeamsInput[] | UserUncheckedCreateWithoutTeamsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTeamsInput | UserCreateOrConnectWithoutTeamsInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutTeamsInput | UserUpsertWithWhereUniqueWithoutTeamsInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutTeamsInput | UserUpdateWithWhereUniqueWithoutTeamsInput[]
    updateMany?: UserUpdateManyWithWhereWithoutTeamsInput | UserUpdateManyWithWhereWithoutTeamsInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type TaskUpdateManyWithoutTeamNestedInput = {
    create?: XOR<TaskCreateWithoutTeamInput, TaskUncheckedCreateWithoutTeamInput> | TaskCreateWithoutTeamInput[] | TaskUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutTeamInput | TaskCreateOrConnectWithoutTeamInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutTeamInput | TaskUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: TaskCreateManyTeamInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutTeamInput | TaskUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutTeamInput | TaskUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type WorkspaceUpdateOneRequiredWithoutTeamsNestedInput = {
    create?: XOR<WorkspaceCreateWithoutTeamsInput, WorkspaceUncheckedCreateWithoutTeamsInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutTeamsInput
    upsert?: WorkspaceUpsertWithoutTeamsInput
    connect?: WorkspaceWhereUniqueInput
    update?: XOR<XOR<WorkspaceUpdateToOneWithWhereWithoutTeamsInput, WorkspaceUpdateWithoutTeamsInput>, WorkspaceUncheckedUpdateWithoutTeamsInput>
  }

  export type ProjectUpdateManyWithoutTeamNestedInput = {
    create?: XOR<ProjectCreateWithoutTeamInput, ProjectUncheckedCreateWithoutTeamInput> | ProjectCreateWithoutTeamInput[] | ProjectUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutTeamInput | ProjectCreateOrConnectWithoutTeamInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutTeamInput | ProjectUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: ProjectCreateManyTeamInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutTeamInput | ProjectUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutTeamInput | ProjectUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutTeamsNestedInput = {
    create?: XOR<UserCreateWithoutTeamsInput, UserUncheckedCreateWithoutTeamsInput> | UserCreateWithoutTeamsInput[] | UserUncheckedCreateWithoutTeamsInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTeamsInput | UserCreateOrConnectWithoutTeamsInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutTeamsInput | UserUpsertWithWhereUniqueWithoutTeamsInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutTeamsInput | UserUpdateWithWhereUniqueWithoutTeamsInput[]
    updateMany?: UserUpdateManyWithWhereWithoutTeamsInput | UserUpdateManyWithWhereWithoutTeamsInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type TaskUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: XOR<TaskCreateWithoutTeamInput, TaskUncheckedCreateWithoutTeamInput> | TaskCreateWithoutTeamInput[] | TaskUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutTeamInput | TaskCreateOrConnectWithoutTeamInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutTeamInput | TaskUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: TaskCreateManyTeamInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutTeamInput | TaskUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutTeamInput | TaskUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type ProjectUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: XOR<ProjectCreateWithoutTeamInput, ProjectUncheckedCreateWithoutTeamInput> | ProjectCreateWithoutTeamInput[] | ProjectUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutTeamInput | ProjectCreateOrConnectWithoutTeamInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutTeamInput | ProjectUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: ProjectCreateManyTeamInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutTeamInput | ProjectUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutTeamInput | ProjectUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type WorkspaceCreateNestedOneWithoutUserInput = {
    create?: XOR<WorkspaceCreateWithoutUserInput, WorkspaceUncheckedCreateWithoutUserInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutUserInput
    connect?: WorkspaceWhereUniqueInput
  }

  export type WorkspaceCreateNestedManyWithoutUsersInput = {
    create?: XOR<WorkspaceCreateWithoutUsersInput, WorkspaceUncheckedCreateWithoutUsersInput> | WorkspaceCreateWithoutUsersInput[] | WorkspaceUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: WorkspaceCreateOrConnectWithoutUsersInput | WorkspaceCreateOrConnectWithoutUsersInput[]
    connect?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
  }

  export type TeamCreateNestedManyWithoutUsersInput = {
    create?: XOR<TeamCreateWithoutUsersInput, TeamUncheckedCreateWithoutUsersInput> | TeamCreateWithoutUsersInput[] | TeamUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: TeamCreateOrConnectWithoutUsersInput | TeamCreateOrConnectWithoutUsersInput[]
    connect?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type CommentCreateNestedManyWithoutAuthorInput = {
    create?: XOR<CommentCreateWithoutAuthorInput, CommentUncheckedCreateWithoutAuthorInput> | CommentCreateWithoutAuthorInput[] | CommentUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutAuthorInput | CommentCreateOrConnectWithoutAuthorInput[]
    createMany?: CommentCreateManyAuthorInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type TaskCreateNestedManyWithoutAuthorInput = {
    create?: XOR<TaskCreateWithoutAuthorInput, TaskUncheckedCreateWithoutAuthorInput> | TaskCreateWithoutAuthorInput[] | TaskUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAuthorInput | TaskCreateOrConnectWithoutAuthorInput[]
    createMany?: TaskCreateManyAuthorInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type WorkspaceUncheckedCreateNestedManyWithoutUsersInput = {
    create?: XOR<WorkspaceCreateWithoutUsersInput, WorkspaceUncheckedCreateWithoutUsersInput> | WorkspaceCreateWithoutUsersInput[] | WorkspaceUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: WorkspaceCreateOrConnectWithoutUsersInput | WorkspaceCreateOrConnectWithoutUsersInput[]
    connect?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
  }

  export type TeamUncheckedCreateNestedManyWithoutUsersInput = {
    create?: XOR<TeamCreateWithoutUsersInput, TeamUncheckedCreateWithoutUsersInput> | TeamCreateWithoutUsersInput[] | TeamUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: TeamCreateOrConnectWithoutUsersInput | TeamCreateOrConnectWithoutUsersInput[]
    connect?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type CommentUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: XOR<CommentCreateWithoutAuthorInput, CommentUncheckedCreateWithoutAuthorInput> | CommentCreateWithoutAuthorInput[] | CommentUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutAuthorInput | CommentCreateOrConnectWithoutAuthorInput[]
    createMany?: CommentCreateManyAuthorInputEnvelope
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
  }

  export type TaskUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: XOR<TaskCreateWithoutAuthorInput, TaskUncheckedCreateWithoutAuthorInput> | TaskCreateWithoutAuthorInput[] | TaskUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAuthorInput | TaskCreateOrConnectWithoutAuthorInput[]
    createMany?: TaskCreateManyAuthorInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type WorkspaceUpdateOneWithoutUserNestedInput = {
    create?: XOR<WorkspaceCreateWithoutUserInput, WorkspaceUncheckedCreateWithoutUserInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutUserInput
    upsert?: WorkspaceUpsertWithoutUserInput
    disconnect?: WorkspaceWhereInput | boolean
    delete?: WorkspaceWhereInput | boolean
    connect?: WorkspaceWhereUniqueInput
    update?: XOR<XOR<WorkspaceUpdateToOneWithWhereWithoutUserInput, WorkspaceUpdateWithoutUserInput>, WorkspaceUncheckedUpdateWithoutUserInput>
  }

  export type WorkspaceUpdateManyWithoutUsersNestedInput = {
    create?: XOR<WorkspaceCreateWithoutUsersInput, WorkspaceUncheckedCreateWithoutUsersInput> | WorkspaceCreateWithoutUsersInput[] | WorkspaceUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: WorkspaceCreateOrConnectWithoutUsersInput | WorkspaceCreateOrConnectWithoutUsersInput[]
    upsert?: WorkspaceUpsertWithWhereUniqueWithoutUsersInput | WorkspaceUpsertWithWhereUniqueWithoutUsersInput[]
    set?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    disconnect?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    delete?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    connect?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    update?: WorkspaceUpdateWithWhereUniqueWithoutUsersInput | WorkspaceUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: WorkspaceUpdateManyWithWhereWithoutUsersInput | WorkspaceUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: WorkspaceScalarWhereInput | WorkspaceScalarWhereInput[]
  }

  export type TeamUpdateManyWithoutUsersNestedInput = {
    create?: XOR<TeamCreateWithoutUsersInput, TeamUncheckedCreateWithoutUsersInput> | TeamCreateWithoutUsersInput[] | TeamUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: TeamCreateOrConnectWithoutUsersInput | TeamCreateOrConnectWithoutUsersInput[]
    upsert?: TeamUpsertWithWhereUniqueWithoutUsersInput | TeamUpsertWithWhereUniqueWithoutUsersInput[]
    set?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    disconnect?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    delete?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    connect?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    update?: TeamUpdateWithWhereUniqueWithoutUsersInput | TeamUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: TeamUpdateManyWithWhereWithoutUsersInput | TeamUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: TeamScalarWhereInput | TeamScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type CommentUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<CommentCreateWithoutAuthorInput, CommentUncheckedCreateWithoutAuthorInput> | CommentCreateWithoutAuthorInput[] | CommentUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutAuthorInput | CommentCreateOrConnectWithoutAuthorInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutAuthorInput | CommentUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: CommentCreateManyAuthorInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutAuthorInput | CommentUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutAuthorInput | CommentUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type TaskUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<TaskCreateWithoutAuthorInput, TaskUncheckedCreateWithoutAuthorInput> | TaskCreateWithoutAuthorInput[] | TaskUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAuthorInput | TaskCreateOrConnectWithoutAuthorInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutAuthorInput | TaskUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: TaskCreateManyAuthorInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutAuthorInput | TaskUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutAuthorInput | TaskUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type WorkspaceUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: XOR<WorkspaceCreateWithoutUsersInput, WorkspaceUncheckedCreateWithoutUsersInput> | WorkspaceCreateWithoutUsersInput[] | WorkspaceUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: WorkspaceCreateOrConnectWithoutUsersInput | WorkspaceCreateOrConnectWithoutUsersInput[]
    upsert?: WorkspaceUpsertWithWhereUniqueWithoutUsersInput | WorkspaceUpsertWithWhereUniqueWithoutUsersInput[]
    set?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    disconnect?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    delete?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    connect?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    update?: WorkspaceUpdateWithWhereUniqueWithoutUsersInput | WorkspaceUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: WorkspaceUpdateManyWithWhereWithoutUsersInput | WorkspaceUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: WorkspaceScalarWhereInput | WorkspaceScalarWhereInput[]
  }

  export type TeamUncheckedUpdateManyWithoutUsersNestedInput = {
    create?: XOR<TeamCreateWithoutUsersInput, TeamUncheckedCreateWithoutUsersInput> | TeamCreateWithoutUsersInput[] | TeamUncheckedCreateWithoutUsersInput[]
    connectOrCreate?: TeamCreateOrConnectWithoutUsersInput | TeamCreateOrConnectWithoutUsersInput[]
    upsert?: TeamUpsertWithWhereUniqueWithoutUsersInput | TeamUpsertWithWhereUniqueWithoutUsersInput[]
    set?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    disconnect?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    delete?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    connect?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    update?: TeamUpdateWithWhereUniqueWithoutUsersInput | TeamUpdateWithWhereUniqueWithoutUsersInput[]
    updateMany?: TeamUpdateManyWithWhereWithoutUsersInput | TeamUpdateManyWithWhereWithoutUsersInput[]
    deleteMany?: TeamScalarWhereInput | TeamScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type CommentUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<CommentCreateWithoutAuthorInput, CommentUncheckedCreateWithoutAuthorInput> | CommentCreateWithoutAuthorInput[] | CommentUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: CommentCreateOrConnectWithoutAuthorInput | CommentCreateOrConnectWithoutAuthorInput[]
    upsert?: CommentUpsertWithWhereUniqueWithoutAuthorInput | CommentUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: CommentCreateManyAuthorInputEnvelope
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[]
    update?: CommentUpdateWithWhereUniqueWithoutAuthorInput | CommentUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: CommentUpdateManyWithWhereWithoutAuthorInput | CommentUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[]
  }

  export type TaskUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<TaskCreateWithoutAuthorInput, TaskUncheckedCreateWithoutAuthorInput> | TaskCreateWithoutAuthorInput[] | TaskUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutAuthorInput | TaskCreateOrConnectWithoutAuthorInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutAuthorInput | TaskUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: TaskCreateManyAuthorInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutAuthorInput | TaskUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutAuthorInput | TaskUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type UniversalTokenLinkCreateNestedOneWithoutWorkspaceInput = {
    create?: XOR<UniversalTokenLinkCreateWithoutWorkspaceInput, UniversalTokenLinkUncheckedCreateWithoutWorkspaceInput>
    connectOrCreate?: UniversalTokenLinkCreateOrConnectWithoutWorkspaceInput
    connect?: UniversalTokenLinkWhereUniqueInput
  }

  export type TeamCreateNestedManyWithoutWorkspaceInput = {
    create?: XOR<TeamCreateWithoutWorkspaceInput, TeamUncheckedCreateWithoutWorkspaceInput> | TeamCreateWithoutWorkspaceInput[] | TeamUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: TeamCreateOrConnectWithoutWorkspaceInput | TeamCreateOrConnectWithoutWorkspaceInput[]
    createMany?: TeamCreateManyWorkspaceInputEnvelope
    connect?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
  }

  export type ProjectCreateNestedManyWithoutWorkspaceInput = {
    create?: XOR<ProjectCreateWithoutWorkspaceInput, ProjectUncheckedCreateWithoutWorkspaceInput> | ProjectCreateWithoutWorkspaceInput[] | ProjectUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutWorkspaceInput | ProjectCreateOrConnectWithoutWorkspaceInput[]
    createMany?: ProjectCreateManyWorkspaceInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type GithubRepoInfoCreateNestedOneWithoutWorkspaceInput = {
    create?: XOR<GithubRepoInfoCreateWithoutWorkspaceInput, GithubRepoInfoUncheckedCreateWithoutWorkspaceInput>
    connectOrCreate?: GithubRepoInfoCreateOrConnectWithoutWorkspaceInput
    connect?: GithubRepoInfoWhereUniqueInput
  }

  export type UserCreateNestedManyWithoutWorkspacesInput = {
    create?: XOR<UserCreateWithoutWorkspacesInput, UserUncheckedCreateWithoutWorkspacesInput> | UserCreateWithoutWorkspacesInput[] | UserUncheckedCreateWithoutWorkspacesInput[]
    connectOrCreate?: UserCreateOrConnectWithoutWorkspacesInput | UserCreateOrConnectWithoutWorkspacesInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserCreateNestedManyWithoutDefaultWorkspaceInput = {
    create?: XOR<UserCreateWithoutDefaultWorkspaceInput, UserUncheckedCreateWithoutDefaultWorkspaceInput> | UserCreateWithoutDefaultWorkspaceInput[] | UserUncheckedCreateWithoutDefaultWorkspaceInput[]
    connectOrCreate?: UserCreateOrConnectWithoutDefaultWorkspaceInput | UserCreateOrConnectWithoutDefaultWorkspaceInput[]
    createMany?: UserCreateManyDefaultWorkspaceInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type TeamUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: XOR<TeamCreateWithoutWorkspaceInput, TeamUncheckedCreateWithoutWorkspaceInput> | TeamCreateWithoutWorkspaceInput[] | TeamUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: TeamCreateOrConnectWithoutWorkspaceInput | TeamCreateOrConnectWithoutWorkspaceInput[]
    createMany?: TeamCreateManyWorkspaceInputEnvelope
    connect?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
  }

  export type ProjectUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: XOR<ProjectCreateWithoutWorkspaceInput, ProjectUncheckedCreateWithoutWorkspaceInput> | ProjectCreateWithoutWorkspaceInput[] | ProjectUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutWorkspaceInput | ProjectCreateOrConnectWithoutWorkspaceInput[]
    createMany?: ProjectCreateManyWorkspaceInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutWorkspacesInput = {
    create?: XOR<UserCreateWithoutWorkspacesInput, UserUncheckedCreateWithoutWorkspacesInput> | UserCreateWithoutWorkspacesInput[] | UserUncheckedCreateWithoutWorkspacesInput[]
    connectOrCreate?: UserCreateOrConnectWithoutWorkspacesInput | UserCreateOrConnectWithoutWorkspacesInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutDefaultWorkspaceInput = {
    create?: XOR<UserCreateWithoutDefaultWorkspaceInput, UserUncheckedCreateWithoutDefaultWorkspaceInput> | UserCreateWithoutDefaultWorkspaceInput[] | UserUncheckedCreateWithoutDefaultWorkspaceInput[]
    connectOrCreate?: UserCreateOrConnectWithoutDefaultWorkspaceInput | UserCreateOrConnectWithoutDefaultWorkspaceInput[]
    createMany?: UserCreateManyDefaultWorkspaceInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UniversalTokenLinkUpdateOneWithoutWorkspaceNestedInput = {
    create?: XOR<UniversalTokenLinkCreateWithoutWorkspaceInput, UniversalTokenLinkUncheckedCreateWithoutWorkspaceInput>
    connectOrCreate?: UniversalTokenLinkCreateOrConnectWithoutWorkspaceInput
    upsert?: UniversalTokenLinkUpsertWithoutWorkspaceInput
    disconnect?: UniversalTokenLinkWhereInput | boolean
    delete?: UniversalTokenLinkWhereInput | boolean
    connect?: UniversalTokenLinkWhereUniqueInput
    update?: XOR<XOR<UniversalTokenLinkUpdateToOneWithWhereWithoutWorkspaceInput, UniversalTokenLinkUpdateWithoutWorkspaceInput>, UniversalTokenLinkUncheckedUpdateWithoutWorkspaceInput>
  }

  export type TeamUpdateManyWithoutWorkspaceNestedInput = {
    create?: XOR<TeamCreateWithoutWorkspaceInput, TeamUncheckedCreateWithoutWorkspaceInput> | TeamCreateWithoutWorkspaceInput[] | TeamUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: TeamCreateOrConnectWithoutWorkspaceInput | TeamCreateOrConnectWithoutWorkspaceInput[]
    upsert?: TeamUpsertWithWhereUniqueWithoutWorkspaceInput | TeamUpsertWithWhereUniqueWithoutWorkspaceInput[]
    createMany?: TeamCreateManyWorkspaceInputEnvelope
    set?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    disconnect?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    delete?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    connect?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    update?: TeamUpdateWithWhereUniqueWithoutWorkspaceInput | TeamUpdateWithWhereUniqueWithoutWorkspaceInput[]
    updateMany?: TeamUpdateManyWithWhereWithoutWorkspaceInput | TeamUpdateManyWithWhereWithoutWorkspaceInput[]
    deleteMany?: TeamScalarWhereInput | TeamScalarWhereInput[]
  }

  export type ProjectUpdateManyWithoutWorkspaceNestedInput = {
    create?: XOR<ProjectCreateWithoutWorkspaceInput, ProjectUncheckedCreateWithoutWorkspaceInput> | ProjectCreateWithoutWorkspaceInput[] | ProjectUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutWorkspaceInput | ProjectCreateOrConnectWithoutWorkspaceInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutWorkspaceInput | ProjectUpsertWithWhereUniqueWithoutWorkspaceInput[]
    createMany?: ProjectCreateManyWorkspaceInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutWorkspaceInput | ProjectUpdateWithWhereUniqueWithoutWorkspaceInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutWorkspaceInput | ProjectUpdateManyWithWhereWithoutWorkspaceInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type GithubRepoInfoUpdateOneWithoutWorkspaceNestedInput = {
    create?: XOR<GithubRepoInfoCreateWithoutWorkspaceInput, GithubRepoInfoUncheckedCreateWithoutWorkspaceInput>
    connectOrCreate?: GithubRepoInfoCreateOrConnectWithoutWorkspaceInput
    upsert?: GithubRepoInfoUpsertWithoutWorkspaceInput
    disconnect?: GithubRepoInfoWhereInput | boolean
    delete?: GithubRepoInfoWhereInput | boolean
    connect?: GithubRepoInfoWhereUniqueInput
    update?: XOR<XOR<GithubRepoInfoUpdateToOneWithWhereWithoutWorkspaceInput, GithubRepoInfoUpdateWithoutWorkspaceInput>, GithubRepoInfoUncheckedUpdateWithoutWorkspaceInput>
  }

  export type UserUpdateManyWithoutWorkspacesNestedInput = {
    create?: XOR<UserCreateWithoutWorkspacesInput, UserUncheckedCreateWithoutWorkspacesInput> | UserCreateWithoutWorkspacesInput[] | UserUncheckedCreateWithoutWorkspacesInput[]
    connectOrCreate?: UserCreateOrConnectWithoutWorkspacesInput | UserCreateOrConnectWithoutWorkspacesInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutWorkspacesInput | UserUpsertWithWhereUniqueWithoutWorkspacesInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutWorkspacesInput | UserUpdateWithWhereUniqueWithoutWorkspacesInput[]
    updateMany?: UserUpdateManyWithWhereWithoutWorkspacesInput | UserUpdateManyWithWhereWithoutWorkspacesInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserUpdateManyWithoutDefaultWorkspaceNestedInput = {
    create?: XOR<UserCreateWithoutDefaultWorkspaceInput, UserUncheckedCreateWithoutDefaultWorkspaceInput> | UserCreateWithoutDefaultWorkspaceInput[] | UserUncheckedCreateWithoutDefaultWorkspaceInput[]
    connectOrCreate?: UserCreateOrConnectWithoutDefaultWorkspaceInput | UserCreateOrConnectWithoutDefaultWorkspaceInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutDefaultWorkspaceInput | UserUpsertWithWhereUniqueWithoutDefaultWorkspaceInput[]
    createMany?: UserCreateManyDefaultWorkspaceInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutDefaultWorkspaceInput | UserUpdateWithWhereUniqueWithoutDefaultWorkspaceInput[]
    updateMany?: UserUpdateManyWithWhereWithoutDefaultWorkspaceInput | UserUpdateManyWithWhereWithoutDefaultWorkspaceInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type TeamUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: XOR<TeamCreateWithoutWorkspaceInput, TeamUncheckedCreateWithoutWorkspaceInput> | TeamCreateWithoutWorkspaceInput[] | TeamUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: TeamCreateOrConnectWithoutWorkspaceInput | TeamCreateOrConnectWithoutWorkspaceInput[]
    upsert?: TeamUpsertWithWhereUniqueWithoutWorkspaceInput | TeamUpsertWithWhereUniqueWithoutWorkspaceInput[]
    createMany?: TeamCreateManyWorkspaceInputEnvelope
    set?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    disconnect?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    delete?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    connect?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    update?: TeamUpdateWithWhereUniqueWithoutWorkspaceInput | TeamUpdateWithWhereUniqueWithoutWorkspaceInput[]
    updateMany?: TeamUpdateManyWithWhereWithoutWorkspaceInput | TeamUpdateManyWithWhereWithoutWorkspaceInput[]
    deleteMany?: TeamScalarWhereInput | TeamScalarWhereInput[]
  }

  export type ProjectUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: XOR<ProjectCreateWithoutWorkspaceInput, ProjectUncheckedCreateWithoutWorkspaceInput> | ProjectCreateWithoutWorkspaceInput[] | ProjectUncheckedCreateWithoutWorkspaceInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutWorkspaceInput | ProjectCreateOrConnectWithoutWorkspaceInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutWorkspaceInput | ProjectUpsertWithWhereUniqueWithoutWorkspaceInput[]
    createMany?: ProjectCreateManyWorkspaceInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutWorkspaceInput | ProjectUpdateWithWhereUniqueWithoutWorkspaceInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutWorkspaceInput | ProjectUpdateManyWithWhereWithoutWorkspaceInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutWorkspacesNestedInput = {
    create?: XOR<UserCreateWithoutWorkspacesInput, UserUncheckedCreateWithoutWorkspacesInput> | UserCreateWithoutWorkspacesInput[] | UserUncheckedCreateWithoutWorkspacesInput[]
    connectOrCreate?: UserCreateOrConnectWithoutWorkspacesInput | UserCreateOrConnectWithoutWorkspacesInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutWorkspacesInput | UserUpsertWithWhereUniqueWithoutWorkspacesInput[]
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutWorkspacesInput | UserUpdateWithWhereUniqueWithoutWorkspacesInput[]
    updateMany?: UserUpdateManyWithWhereWithoutWorkspacesInput | UserUpdateManyWithWhereWithoutWorkspacesInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutDefaultWorkspaceNestedInput = {
    create?: XOR<UserCreateWithoutDefaultWorkspaceInput, UserUncheckedCreateWithoutDefaultWorkspaceInput> | UserCreateWithoutDefaultWorkspaceInput[] | UserUncheckedCreateWithoutDefaultWorkspaceInput[]
    connectOrCreate?: UserCreateOrConnectWithoutDefaultWorkspaceInput | UserCreateOrConnectWithoutDefaultWorkspaceInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutDefaultWorkspaceInput | UserUpsertWithWhereUniqueWithoutDefaultWorkspaceInput[]
    createMany?: UserCreateManyDefaultWorkspaceInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutDefaultWorkspaceInput | UserUpdateWithWhereUniqueWithoutDefaultWorkspaceInput[]
    updateMany?: UserUpdateManyWithWhereWithoutDefaultWorkspaceInput | UserUpdateManyWithWhereWithoutDefaultWorkspaceInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type WorkspaceCreateNestedManyWithoutUniversalTokenLinkInput = {
    create?: XOR<WorkspaceCreateWithoutUniversalTokenLinkInput, WorkspaceUncheckedCreateWithoutUniversalTokenLinkInput> | WorkspaceCreateWithoutUniversalTokenLinkInput[] | WorkspaceUncheckedCreateWithoutUniversalTokenLinkInput[]
    connectOrCreate?: WorkspaceCreateOrConnectWithoutUniversalTokenLinkInput | WorkspaceCreateOrConnectWithoutUniversalTokenLinkInput[]
    createMany?: WorkspaceCreateManyUniversalTokenLinkInputEnvelope
    connect?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
  }

  export type WorkspaceUncheckedCreateNestedManyWithoutUniversalTokenLinkInput = {
    create?: XOR<WorkspaceCreateWithoutUniversalTokenLinkInput, WorkspaceUncheckedCreateWithoutUniversalTokenLinkInput> | WorkspaceCreateWithoutUniversalTokenLinkInput[] | WorkspaceUncheckedCreateWithoutUniversalTokenLinkInput[]
    connectOrCreate?: WorkspaceCreateOrConnectWithoutUniversalTokenLinkInput | WorkspaceCreateOrConnectWithoutUniversalTokenLinkInput[]
    createMany?: WorkspaceCreateManyUniversalTokenLinkInputEnvelope
    connect?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
  }

  export type WorkspaceUpdateManyWithoutUniversalTokenLinkNestedInput = {
    create?: XOR<WorkspaceCreateWithoutUniversalTokenLinkInput, WorkspaceUncheckedCreateWithoutUniversalTokenLinkInput> | WorkspaceCreateWithoutUniversalTokenLinkInput[] | WorkspaceUncheckedCreateWithoutUniversalTokenLinkInput[]
    connectOrCreate?: WorkspaceCreateOrConnectWithoutUniversalTokenLinkInput | WorkspaceCreateOrConnectWithoutUniversalTokenLinkInput[]
    upsert?: WorkspaceUpsertWithWhereUniqueWithoutUniversalTokenLinkInput | WorkspaceUpsertWithWhereUniqueWithoutUniversalTokenLinkInput[]
    createMany?: WorkspaceCreateManyUniversalTokenLinkInputEnvelope
    set?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    disconnect?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    delete?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    connect?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    update?: WorkspaceUpdateWithWhereUniqueWithoutUniversalTokenLinkInput | WorkspaceUpdateWithWhereUniqueWithoutUniversalTokenLinkInput[]
    updateMany?: WorkspaceUpdateManyWithWhereWithoutUniversalTokenLinkInput | WorkspaceUpdateManyWithWhereWithoutUniversalTokenLinkInput[]
    deleteMany?: WorkspaceScalarWhereInput | WorkspaceScalarWhereInput[]
  }

  export type WorkspaceUncheckedUpdateManyWithoutUniversalTokenLinkNestedInput = {
    create?: XOR<WorkspaceCreateWithoutUniversalTokenLinkInput, WorkspaceUncheckedCreateWithoutUniversalTokenLinkInput> | WorkspaceCreateWithoutUniversalTokenLinkInput[] | WorkspaceUncheckedCreateWithoutUniversalTokenLinkInput[]
    connectOrCreate?: WorkspaceCreateOrConnectWithoutUniversalTokenLinkInput | WorkspaceCreateOrConnectWithoutUniversalTokenLinkInput[]
    upsert?: WorkspaceUpsertWithWhereUniqueWithoutUniversalTokenLinkInput | WorkspaceUpsertWithWhereUniqueWithoutUniversalTokenLinkInput[]
    createMany?: WorkspaceCreateManyUniversalTokenLinkInputEnvelope
    set?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    disconnect?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    delete?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    connect?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    update?: WorkspaceUpdateWithWhereUniqueWithoutUniversalTokenLinkInput | WorkspaceUpdateWithWhereUniqueWithoutUniversalTokenLinkInput[]
    updateMany?: WorkspaceUpdateManyWithWhereWithoutUniversalTokenLinkInput | WorkspaceUpdateManyWithWhereWithoutUniversalTokenLinkInput[]
    deleteMany?: WorkspaceScalarWhereInput | WorkspaceScalarWhereInput[]
  }

  export type WorkspaceCreateNestedManyWithoutGithubRepoInfoInput = {
    create?: XOR<WorkspaceCreateWithoutGithubRepoInfoInput, WorkspaceUncheckedCreateWithoutGithubRepoInfoInput> | WorkspaceCreateWithoutGithubRepoInfoInput[] | WorkspaceUncheckedCreateWithoutGithubRepoInfoInput[]
    connectOrCreate?: WorkspaceCreateOrConnectWithoutGithubRepoInfoInput | WorkspaceCreateOrConnectWithoutGithubRepoInfoInput[]
    createMany?: WorkspaceCreateManyGithubRepoInfoInputEnvelope
    connect?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
  }

  export type WorkspaceUncheckedCreateNestedManyWithoutGithubRepoInfoInput = {
    create?: XOR<WorkspaceCreateWithoutGithubRepoInfoInput, WorkspaceUncheckedCreateWithoutGithubRepoInfoInput> | WorkspaceCreateWithoutGithubRepoInfoInput[] | WorkspaceUncheckedCreateWithoutGithubRepoInfoInput[]
    connectOrCreate?: WorkspaceCreateOrConnectWithoutGithubRepoInfoInput | WorkspaceCreateOrConnectWithoutGithubRepoInfoInput[]
    createMany?: WorkspaceCreateManyGithubRepoInfoInputEnvelope
    connect?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
  }

  export type WorkspaceUpdateManyWithoutGithubRepoInfoNestedInput = {
    create?: XOR<WorkspaceCreateWithoutGithubRepoInfoInput, WorkspaceUncheckedCreateWithoutGithubRepoInfoInput> | WorkspaceCreateWithoutGithubRepoInfoInput[] | WorkspaceUncheckedCreateWithoutGithubRepoInfoInput[]
    connectOrCreate?: WorkspaceCreateOrConnectWithoutGithubRepoInfoInput | WorkspaceCreateOrConnectWithoutGithubRepoInfoInput[]
    upsert?: WorkspaceUpsertWithWhereUniqueWithoutGithubRepoInfoInput | WorkspaceUpsertWithWhereUniqueWithoutGithubRepoInfoInput[]
    createMany?: WorkspaceCreateManyGithubRepoInfoInputEnvelope
    set?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    disconnect?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    delete?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    connect?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    update?: WorkspaceUpdateWithWhereUniqueWithoutGithubRepoInfoInput | WorkspaceUpdateWithWhereUniqueWithoutGithubRepoInfoInput[]
    updateMany?: WorkspaceUpdateManyWithWhereWithoutGithubRepoInfoInput | WorkspaceUpdateManyWithWhereWithoutGithubRepoInfoInput[]
    deleteMany?: WorkspaceScalarWhereInput | WorkspaceScalarWhereInput[]
  }

  export type WorkspaceUncheckedUpdateManyWithoutGithubRepoInfoNestedInput = {
    create?: XOR<WorkspaceCreateWithoutGithubRepoInfoInput, WorkspaceUncheckedCreateWithoutGithubRepoInfoInput> | WorkspaceCreateWithoutGithubRepoInfoInput[] | WorkspaceUncheckedCreateWithoutGithubRepoInfoInput[]
    connectOrCreate?: WorkspaceCreateOrConnectWithoutGithubRepoInfoInput | WorkspaceCreateOrConnectWithoutGithubRepoInfoInput[]
    upsert?: WorkspaceUpsertWithWhereUniqueWithoutGithubRepoInfoInput | WorkspaceUpsertWithWhereUniqueWithoutGithubRepoInfoInput[]
    createMany?: WorkspaceCreateManyGithubRepoInfoInputEnvelope
    set?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    disconnect?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    delete?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    connect?: WorkspaceWhereUniqueInput | WorkspaceWhereUniqueInput[]
    update?: WorkspaceUpdateWithWhereUniqueWithoutGithubRepoInfoInput | WorkspaceUpdateWithWhereUniqueWithoutGithubRepoInfoInput[]
    updateMany?: WorkspaceUpdateManyWithWhereWithoutGithubRepoInfoInput | WorkspaceUpdateManyWithWhereWithoutGithubRepoInfoInput[]
    deleteMany?: WorkspaceScalarWhereInput | WorkspaceScalarWhereInput[]
  }

  export type TeamCreateNestedOneWithoutProjectInput = {
    create?: XOR<TeamCreateWithoutProjectInput, TeamUncheckedCreateWithoutProjectInput>
    connectOrCreate?: TeamCreateOrConnectWithoutProjectInput
    connect?: TeamWhereUniqueInput
  }

  export type WorkspaceCreateNestedOneWithoutProjectsInput = {
    create?: XOR<WorkspaceCreateWithoutProjectsInput, WorkspaceUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutProjectsInput
    connect?: WorkspaceWhereUniqueInput
  }

  export type TeamUpdateOneWithoutProjectNestedInput = {
    create?: XOR<TeamCreateWithoutProjectInput, TeamUncheckedCreateWithoutProjectInput>
    connectOrCreate?: TeamCreateOrConnectWithoutProjectInput
    upsert?: TeamUpsertWithoutProjectInput
    disconnect?: TeamWhereInput | boolean
    delete?: TeamWhereInput | boolean
    connect?: TeamWhereUniqueInput
    update?: XOR<XOR<TeamUpdateToOneWithWhereWithoutProjectInput, TeamUpdateWithoutProjectInput>, TeamUncheckedUpdateWithoutProjectInput>
  }

  export type WorkspaceUpdateOneWithoutProjectsNestedInput = {
    create?: XOR<WorkspaceCreateWithoutProjectsInput, WorkspaceUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: WorkspaceCreateOrConnectWithoutProjectsInput
    upsert?: WorkspaceUpsertWithoutProjectsInput
    disconnect?: WorkspaceWhereInput | boolean
    delete?: WorkspaceWhereInput | boolean
    connect?: WorkspaceWhereUniqueInput
    update?: XOR<XOR<WorkspaceUpdateToOneWithWhereWithoutProjectsInput, WorkspaceUpdateWithoutProjectsInput>, WorkspaceUncheckedUpdateWithoutProjectsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.Status | EnumStatusFieldRefInput<$PrismaModel>
    in?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusFilter<$PrismaModel> | $Enums.Status
  }

  export type NestedEnumPriorityNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.Priority | EnumPriorityFieldRefInput<$PrismaModel> | null
    in?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPriorityNullableFilter<$PrismaModel> | $Enums.Priority | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Status | EnumStatusFieldRefInput<$PrismaModel>
    in?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.Status[] | ListEnumStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumStatusWithAggregatesFilter<$PrismaModel> | $Enums.Status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusFilter<$PrismaModel>
    _max?: NestedEnumStatusFilter<$PrismaModel>
  }

  export type NestedEnumPriorityNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Priority | EnumPriorityFieldRefInput<$PrismaModel> | null
    in?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.Priority[] | ListEnumPriorityFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPriorityNullableWithAggregatesFilter<$PrismaModel> | $Enums.Priority | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPriorityNullableFilter<$PrismaModel>
    _max?: NestedEnumPriorityNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type TaskEventCreateWithoutTaskEventLogInput = {
    id?: string
    type: string
    authorId: string
    authorName: string
    updatedAt?: Date | string
    originalLabels?: TaskEventCreateoriginalLabelsInput | $Enums.Label[]
    updatedLabels?: TaskEventCreateupdatedLabelsInput | $Enums.Label[]
    originalValue?: string | null
    updatedValue?: string | null
    originalAssigneeId?: string | null
    originalAssigneeName?: string | null
    updatedAssigneeId?: string | null
    updatedAssigneeName?: string | null
  }

  export type TaskEventUncheckedCreateWithoutTaskEventLogInput = {
    id?: string
    type: string
    authorId: string
    authorName: string
    updatedAt?: Date | string
    originalLabels?: TaskEventCreateoriginalLabelsInput | $Enums.Label[]
    updatedLabels?: TaskEventCreateupdatedLabelsInput | $Enums.Label[]
    originalValue?: string | null
    updatedValue?: string | null
    originalAssigneeId?: string | null
    originalAssigneeName?: string | null
    updatedAssigneeId?: string | null
    updatedAssigneeName?: string | null
  }

  export type TaskEventCreateOrConnectWithoutTaskEventLogInput = {
    where: TaskEventWhereUniqueInput
    create: XOR<TaskEventCreateWithoutTaskEventLogInput, TaskEventUncheckedCreateWithoutTaskEventLogInput>
  }

  export type TaskEventCreateManyTaskEventLogInputEnvelope = {
    data: TaskEventCreateManyTaskEventLogInput | TaskEventCreateManyTaskEventLogInput[]
    skipDuplicates?: boolean
  }

  export type TaskEventUpsertWithWhereUniqueWithoutTaskEventLogInput = {
    where: TaskEventWhereUniqueInput
    update: XOR<TaskEventUpdateWithoutTaskEventLogInput, TaskEventUncheckedUpdateWithoutTaskEventLogInput>
    create: XOR<TaskEventCreateWithoutTaskEventLogInput, TaskEventUncheckedCreateWithoutTaskEventLogInput>
  }

  export type TaskEventUpdateWithWhereUniqueWithoutTaskEventLogInput = {
    where: TaskEventWhereUniqueInput
    data: XOR<TaskEventUpdateWithoutTaskEventLogInput, TaskEventUncheckedUpdateWithoutTaskEventLogInput>
  }

  export type TaskEventUpdateManyWithWhereWithoutTaskEventLogInput = {
    where: TaskEventScalarWhereInput
    data: XOR<TaskEventUpdateManyMutationInput, TaskEventUncheckedUpdateManyWithoutTaskEventLogInput>
  }

  export type TaskEventScalarWhereInput = {
    AND?: TaskEventScalarWhereInput | TaskEventScalarWhereInput[]
    OR?: TaskEventScalarWhereInput[]
    NOT?: TaskEventScalarWhereInput | TaskEventScalarWhereInput[]
    id?: StringFilter<"TaskEvent"> | string
    type?: StringFilter<"TaskEvent"> | string
    authorId?: StringFilter<"TaskEvent"> | string
    authorName?: StringFilter<"TaskEvent"> | string
    taskId?: StringFilter<"TaskEvent"> | string
    updatedAt?: DateTimeFilter<"TaskEvent"> | Date | string
    originalLabels?: EnumLabelNullableListFilter<"TaskEvent">
    updatedLabels?: EnumLabelNullableListFilter<"TaskEvent">
    originalValue?: StringNullableFilter<"TaskEvent"> | string | null
    updatedValue?: StringNullableFilter<"TaskEvent"> | string | null
    originalAssigneeId?: StringNullableFilter<"TaskEvent"> | string | null
    originalAssigneeName?: StringNullableFilter<"TaskEvent"> | string | null
    updatedAssigneeId?: StringNullableFilter<"TaskEvent"> | string | null
    updatedAssigneeName?: StringNullableFilter<"TaskEvent"> | string | null
  }

  export type TaskEventLogCreateWithoutTaskEventsInput = {
    id?: string
    authorId: string
    authorName: string
    createdAt?: Date | string
    taskId: string
  }

  export type TaskEventLogUncheckedCreateWithoutTaskEventsInput = {
    id?: string
    authorId: string
    authorName: string
    createdAt?: Date | string
    taskId: string
  }

  export type TaskEventLogCreateOrConnectWithoutTaskEventsInput = {
    where: TaskEventLogWhereUniqueInput
    create: XOR<TaskEventLogCreateWithoutTaskEventsInput, TaskEventLogUncheckedCreateWithoutTaskEventsInput>
  }

  export type TaskEventLogUpsertWithoutTaskEventsInput = {
    update: XOR<TaskEventLogUpdateWithoutTaskEventsInput, TaskEventLogUncheckedUpdateWithoutTaskEventsInput>
    create: XOR<TaskEventLogCreateWithoutTaskEventsInput, TaskEventLogUncheckedCreateWithoutTaskEventsInput>
    where?: TaskEventLogWhereInput
  }

  export type TaskEventLogUpdateToOneWithWhereWithoutTaskEventsInput = {
    where?: TaskEventLogWhereInput
    data: XOR<TaskEventLogUpdateWithoutTaskEventsInput, TaskEventLogUncheckedUpdateWithoutTaskEventsInput>
  }

  export type TaskEventLogUpdateWithoutTaskEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    taskId?: StringFieldUpdateOperationsInput | string
  }

  export type TaskEventLogUncheckedUpdateWithoutTaskEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    taskId?: StringFieldUpdateOperationsInput | string
  }

  export type TaskCreateWithoutCommentInput = {
    id?: string
    title: string
    description?: string | null
    status: $Enums.Status
    identifier: string
    priority?: $Enums.Priority | null
    labels?: TaskCreatelabelsInput | $Enums.Label[]
    dueDate?: Date | string | null
    effortEstimate?: number | null
    dateCreated?: Date | string
    assigneeId?: string | null
    assigneeName?: string | null
    Author: UserCreateNestedOneWithoutTaskInput
    Team: TeamCreateNestedOneWithoutTasksInput
  }

  export type TaskUncheckedCreateWithoutCommentInput = {
    id?: string
    authorId: string
    title: string
    description?: string | null
    status: $Enums.Status
    identifier: string
    priority?: $Enums.Priority | null
    labels?: TaskCreatelabelsInput | $Enums.Label[]
    dueDate?: Date | string | null
    effortEstimate?: number | null
    teamId: string
    dateCreated?: Date | string
    assigneeId?: string | null
    assigneeName?: string | null
  }

  export type TaskCreateOrConnectWithoutCommentInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutCommentInput, TaskUncheckedCreateWithoutCommentInput>
  }

  export type UserCreateWithoutCommentInput = {
    id?: string
    name: string
    username?: string | null
    email: string
    password: string
    verified?: boolean
    lastLogin?: Date | string
    onBoarding?: boolean
    DefaultWorkspace?: WorkspaceCreateNestedOneWithoutUserInput
    Workspaces?: WorkspaceCreateNestedManyWithoutUsersInput
    Teams?: TeamCreateNestedManyWithoutUsersInput
    Notification?: NotificationCreateNestedManyWithoutUserInput
    Task?: TaskCreateNestedManyWithoutAuthorInput
  }

  export type UserUncheckedCreateWithoutCommentInput = {
    id?: string
    name: string
    username?: string | null
    email: string
    password: string
    verified?: boolean
    lastLogin?: Date | string
    onBoarding?: boolean
    defaultWorkspaceId?: string | null
    Workspaces?: WorkspaceUncheckedCreateNestedManyWithoutUsersInput
    Teams?: TeamUncheckedCreateNestedManyWithoutUsersInput
    Notification?: NotificationUncheckedCreateNestedManyWithoutUserInput
    Task?: TaskUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type UserCreateOrConnectWithoutCommentInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCommentInput, UserUncheckedCreateWithoutCommentInput>
  }

  export type TaskUpsertWithoutCommentInput = {
    update: XOR<TaskUpdateWithoutCommentInput, TaskUncheckedUpdateWithoutCommentInput>
    create: XOR<TaskCreateWithoutCommentInput, TaskUncheckedCreateWithoutCommentInput>
    where?: TaskWhereInput
  }

  export type TaskUpdateToOneWithWhereWithoutCommentInput = {
    where?: TaskWhereInput
    data: XOR<TaskUpdateWithoutCommentInput, TaskUncheckedUpdateWithoutCommentInput>
  }

  export type TaskUpdateWithoutCommentInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    identifier?: StringFieldUpdateOperationsInput | string
    priority?: NullableEnumPriorityFieldUpdateOperationsInput | $Enums.Priority | null
    labels?: TaskUpdatelabelsInput | $Enums.Label[]
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    effortEstimate?: NullableIntFieldUpdateOperationsInput | number | null
    dateCreated?: DateTimeFieldUpdateOperationsInput | Date | string
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    assigneeName?: NullableStringFieldUpdateOperationsInput | string | null
    Author?: UserUpdateOneRequiredWithoutTaskNestedInput
    Team?: TeamUpdateOneRequiredWithoutTasksNestedInput
  }

  export type TaskUncheckedUpdateWithoutCommentInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    identifier?: StringFieldUpdateOperationsInput | string
    priority?: NullableEnumPriorityFieldUpdateOperationsInput | $Enums.Priority | null
    labels?: TaskUpdatelabelsInput | $Enums.Label[]
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    effortEstimate?: NullableIntFieldUpdateOperationsInput | number | null
    teamId?: StringFieldUpdateOperationsInput | string
    dateCreated?: DateTimeFieldUpdateOperationsInput | Date | string
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    assigneeName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUpsertWithoutCommentInput = {
    update: XOR<UserUpdateWithoutCommentInput, UserUncheckedUpdateWithoutCommentInput>
    create: XOR<UserCreateWithoutCommentInput, UserUncheckedCreateWithoutCommentInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCommentInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCommentInput, UserUncheckedUpdateWithoutCommentInput>
  }

  export type UserUpdateWithoutCommentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: DateTimeFieldUpdateOperationsInput | Date | string
    onBoarding?: BoolFieldUpdateOperationsInput | boolean
    DefaultWorkspace?: WorkspaceUpdateOneWithoutUserNestedInput
    Workspaces?: WorkspaceUpdateManyWithoutUsersNestedInput
    Teams?: TeamUpdateManyWithoutUsersNestedInput
    Notification?: NotificationUpdateManyWithoutUserNestedInput
    Task?: TaskUpdateManyWithoutAuthorNestedInput
  }

  export type UserUncheckedUpdateWithoutCommentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: DateTimeFieldUpdateOperationsInput | Date | string
    onBoarding?: BoolFieldUpdateOperationsInput | boolean
    defaultWorkspaceId?: NullableStringFieldUpdateOperationsInput | string | null
    Workspaces?: WorkspaceUncheckedUpdateManyWithoutUsersNestedInput
    Teams?: TeamUncheckedUpdateManyWithoutUsersNestedInput
    Notification?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    Task?: TaskUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type UserCreateWithoutNotificationInput = {
    id?: string
    name: string
    username?: string | null
    email: string
    password: string
    verified?: boolean
    lastLogin?: Date | string
    onBoarding?: boolean
    DefaultWorkspace?: WorkspaceCreateNestedOneWithoutUserInput
    Workspaces?: WorkspaceCreateNestedManyWithoutUsersInput
    Teams?: TeamCreateNestedManyWithoutUsersInput
    Comment?: CommentCreateNestedManyWithoutAuthorInput
    Task?: TaskCreateNestedManyWithoutAuthorInput
  }

  export type UserUncheckedCreateWithoutNotificationInput = {
    id?: string
    name: string
    username?: string | null
    email: string
    password: string
    verified?: boolean
    lastLogin?: Date | string
    onBoarding?: boolean
    defaultWorkspaceId?: string | null
    Workspaces?: WorkspaceUncheckedCreateNestedManyWithoutUsersInput
    Teams?: TeamUncheckedCreateNestedManyWithoutUsersInput
    Comment?: CommentUncheckedCreateNestedManyWithoutAuthorInput
    Task?: TaskUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type UserCreateOrConnectWithoutNotificationInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutNotificationInput, UserUncheckedCreateWithoutNotificationInput>
  }

  export type UserUpsertWithoutNotificationInput = {
    update: XOR<UserUpdateWithoutNotificationInput, UserUncheckedUpdateWithoutNotificationInput>
    create: XOR<UserCreateWithoutNotificationInput, UserUncheckedCreateWithoutNotificationInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutNotificationInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutNotificationInput, UserUncheckedUpdateWithoutNotificationInput>
  }

  export type UserUpdateWithoutNotificationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: DateTimeFieldUpdateOperationsInput | Date | string
    onBoarding?: BoolFieldUpdateOperationsInput | boolean
    DefaultWorkspace?: WorkspaceUpdateOneWithoutUserNestedInput
    Workspaces?: WorkspaceUpdateManyWithoutUsersNestedInput
    Teams?: TeamUpdateManyWithoutUsersNestedInput
    Comment?: CommentUpdateManyWithoutAuthorNestedInput
    Task?: TaskUpdateManyWithoutAuthorNestedInput
  }

  export type UserUncheckedUpdateWithoutNotificationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: DateTimeFieldUpdateOperationsInput | Date | string
    onBoarding?: BoolFieldUpdateOperationsInput | boolean
    defaultWorkspaceId?: NullableStringFieldUpdateOperationsInput | string | null
    Workspaces?: WorkspaceUncheckedUpdateManyWithoutUsersNestedInput
    Teams?: TeamUncheckedUpdateManyWithoutUsersNestedInput
    Comment?: CommentUncheckedUpdateManyWithoutAuthorNestedInput
    Task?: TaskUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type UserCreateWithoutTaskInput = {
    id?: string
    name: string
    username?: string | null
    email: string
    password: string
    verified?: boolean
    lastLogin?: Date | string
    onBoarding?: boolean
    DefaultWorkspace?: WorkspaceCreateNestedOneWithoutUserInput
    Workspaces?: WorkspaceCreateNestedManyWithoutUsersInput
    Teams?: TeamCreateNestedManyWithoutUsersInput
    Notification?: NotificationCreateNestedManyWithoutUserInput
    Comment?: CommentCreateNestedManyWithoutAuthorInput
  }

  export type UserUncheckedCreateWithoutTaskInput = {
    id?: string
    name: string
    username?: string | null
    email: string
    password: string
    verified?: boolean
    lastLogin?: Date | string
    onBoarding?: boolean
    defaultWorkspaceId?: string | null
    Workspaces?: WorkspaceUncheckedCreateNestedManyWithoutUsersInput
    Teams?: TeamUncheckedCreateNestedManyWithoutUsersInput
    Notification?: NotificationUncheckedCreateNestedManyWithoutUserInput
    Comment?: CommentUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type UserCreateOrConnectWithoutTaskInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTaskInput, UserUncheckedCreateWithoutTaskInput>
  }

  export type TeamCreateWithoutTasksInput = {
    id?: string
    name?: string | null
    identifier: string
    Users?: UserCreateNestedManyWithoutTeamsInput
    Workspace: WorkspaceCreateNestedOneWithoutTeamsInput
    Project?: ProjectCreateNestedManyWithoutTeamInput
  }

  export type TeamUncheckedCreateWithoutTasksInput = {
    id?: string
    name?: string | null
    identifier: string
    workspaceId: string
    Users?: UserUncheckedCreateNestedManyWithoutTeamsInput
    Project?: ProjectUncheckedCreateNestedManyWithoutTeamInput
  }

  export type TeamCreateOrConnectWithoutTasksInput = {
    where: TeamWhereUniqueInput
    create: XOR<TeamCreateWithoutTasksInput, TeamUncheckedCreateWithoutTasksInput>
  }

  export type CommentCreateWithoutTaskInput = {
    id?: string
    comment: string
    date?: Date | string
    Author: UserCreateNestedOneWithoutCommentInput
  }

  export type CommentUncheckedCreateWithoutTaskInput = {
    id?: string
    comment: string
    authorId: string
    date?: Date | string
  }

  export type CommentCreateOrConnectWithoutTaskInput = {
    where: CommentWhereUniqueInput
    create: XOR<CommentCreateWithoutTaskInput, CommentUncheckedCreateWithoutTaskInput>
  }

  export type CommentCreateManyTaskInputEnvelope = {
    data: CommentCreateManyTaskInput | CommentCreateManyTaskInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutTaskInput = {
    update: XOR<UserUpdateWithoutTaskInput, UserUncheckedUpdateWithoutTaskInput>
    create: XOR<UserCreateWithoutTaskInput, UserUncheckedCreateWithoutTaskInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTaskInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTaskInput, UserUncheckedUpdateWithoutTaskInput>
  }

  export type UserUpdateWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: DateTimeFieldUpdateOperationsInput | Date | string
    onBoarding?: BoolFieldUpdateOperationsInput | boolean
    DefaultWorkspace?: WorkspaceUpdateOneWithoutUserNestedInput
    Workspaces?: WorkspaceUpdateManyWithoutUsersNestedInput
    Teams?: TeamUpdateManyWithoutUsersNestedInput
    Notification?: NotificationUpdateManyWithoutUserNestedInput
    Comment?: CommentUpdateManyWithoutAuthorNestedInput
  }

  export type UserUncheckedUpdateWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: DateTimeFieldUpdateOperationsInput | Date | string
    onBoarding?: BoolFieldUpdateOperationsInput | boolean
    defaultWorkspaceId?: NullableStringFieldUpdateOperationsInput | string | null
    Workspaces?: WorkspaceUncheckedUpdateManyWithoutUsersNestedInput
    Teams?: TeamUncheckedUpdateManyWithoutUsersNestedInput
    Notification?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    Comment?: CommentUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type TeamUpsertWithoutTasksInput = {
    update: XOR<TeamUpdateWithoutTasksInput, TeamUncheckedUpdateWithoutTasksInput>
    create: XOR<TeamCreateWithoutTasksInput, TeamUncheckedCreateWithoutTasksInput>
    where?: TeamWhereInput
  }

  export type TeamUpdateToOneWithWhereWithoutTasksInput = {
    where?: TeamWhereInput
    data: XOR<TeamUpdateWithoutTasksInput, TeamUncheckedUpdateWithoutTasksInput>
  }

  export type TeamUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    identifier?: StringFieldUpdateOperationsInput | string
    Users?: UserUpdateManyWithoutTeamsNestedInput
    Workspace?: WorkspaceUpdateOneRequiredWithoutTeamsNestedInput
    Project?: ProjectUpdateManyWithoutTeamNestedInput
  }

  export type TeamUncheckedUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    identifier?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    Users?: UserUncheckedUpdateManyWithoutTeamsNestedInput
    Project?: ProjectUncheckedUpdateManyWithoutTeamNestedInput
  }

  export type CommentUpsertWithWhereUniqueWithoutTaskInput = {
    where: CommentWhereUniqueInput
    update: XOR<CommentUpdateWithoutTaskInput, CommentUncheckedUpdateWithoutTaskInput>
    create: XOR<CommentCreateWithoutTaskInput, CommentUncheckedCreateWithoutTaskInput>
  }

  export type CommentUpdateWithWhereUniqueWithoutTaskInput = {
    where: CommentWhereUniqueInput
    data: XOR<CommentUpdateWithoutTaskInput, CommentUncheckedUpdateWithoutTaskInput>
  }

  export type CommentUpdateManyWithWhereWithoutTaskInput = {
    where: CommentScalarWhereInput
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyWithoutTaskInput>
  }

  export type CommentScalarWhereInput = {
    AND?: CommentScalarWhereInput | CommentScalarWhereInput[]
    OR?: CommentScalarWhereInput[]
    NOT?: CommentScalarWhereInput | CommentScalarWhereInput[]
    id?: StringFilter<"Comment"> | string
    comment?: StringFilter<"Comment"> | string
    authorId?: StringFilter<"Comment"> | string
    date?: DateTimeFilter<"Comment"> | Date | string
    taskId?: StringFilter<"Comment"> | string
  }

  export type UserCreateWithoutTeamsInput = {
    id?: string
    name: string
    username?: string | null
    email: string
    password: string
    verified?: boolean
    lastLogin?: Date | string
    onBoarding?: boolean
    DefaultWorkspace?: WorkspaceCreateNestedOneWithoutUserInput
    Workspaces?: WorkspaceCreateNestedManyWithoutUsersInput
    Notification?: NotificationCreateNestedManyWithoutUserInput
    Comment?: CommentCreateNestedManyWithoutAuthorInput
    Task?: TaskCreateNestedManyWithoutAuthorInput
  }

  export type UserUncheckedCreateWithoutTeamsInput = {
    id?: string
    name: string
    username?: string | null
    email: string
    password: string
    verified?: boolean
    lastLogin?: Date | string
    onBoarding?: boolean
    defaultWorkspaceId?: string | null
    Workspaces?: WorkspaceUncheckedCreateNestedManyWithoutUsersInput
    Notification?: NotificationUncheckedCreateNestedManyWithoutUserInput
    Comment?: CommentUncheckedCreateNestedManyWithoutAuthorInput
    Task?: TaskUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type UserCreateOrConnectWithoutTeamsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTeamsInput, UserUncheckedCreateWithoutTeamsInput>
  }

  export type TaskCreateWithoutTeamInput = {
    id?: string
    title: string
    description?: string | null
    status: $Enums.Status
    identifier: string
    priority?: $Enums.Priority | null
    labels?: TaskCreatelabelsInput | $Enums.Label[]
    dueDate?: Date | string | null
    effortEstimate?: number | null
    dateCreated?: Date | string
    assigneeId?: string | null
    assigneeName?: string | null
    Author: UserCreateNestedOneWithoutTaskInput
    Comment?: CommentCreateNestedManyWithoutTaskInput
  }

  export type TaskUncheckedCreateWithoutTeamInput = {
    id?: string
    authorId: string
    title: string
    description?: string | null
    status: $Enums.Status
    identifier: string
    priority?: $Enums.Priority | null
    labels?: TaskCreatelabelsInput | $Enums.Label[]
    dueDate?: Date | string | null
    effortEstimate?: number | null
    dateCreated?: Date | string
    assigneeId?: string | null
    assigneeName?: string | null
    Comment?: CommentUncheckedCreateNestedManyWithoutTaskInput
  }

  export type TaskCreateOrConnectWithoutTeamInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutTeamInput, TaskUncheckedCreateWithoutTeamInput>
  }

  export type TaskCreateManyTeamInputEnvelope = {
    data: TaskCreateManyTeamInput | TaskCreateManyTeamInput[]
    skipDuplicates?: boolean
  }

  export type WorkspaceCreateWithoutTeamsInput = {
    id?: string
    name?: string | null
    url?: string | null
    companySize?: number | null
    issuesCreated?: number | null
    universalTokenLink?: UniversalTokenLinkCreateNestedOneWithoutWorkspaceInput
    projects?: ProjectCreateNestedManyWithoutWorkspaceInput
    githubRepoInfo?: GithubRepoInfoCreateNestedOneWithoutWorkspaceInput
    Users?: UserCreateNestedManyWithoutWorkspacesInput
    User?: UserCreateNestedManyWithoutDefaultWorkspaceInput
  }

  export type WorkspaceUncheckedCreateWithoutTeamsInput = {
    id?: string
    name?: string | null
    url?: string | null
    companySize?: number | null
    issuesCreated?: number | null
    universalTokenLinkId?: string | null
    githubRepoInfoId?: string | null
    projects?: ProjectUncheckedCreateNestedManyWithoutWorkspaceInput
    Users?: UserUncheckedCreateNestedManyWithoutWorkspacesInput
    User?: UserUncheckedCreateNestedManyWithoutDefaultWorkspaceInput
  }

  export type WorkspaceCreateOrConnectWithoutTeamsInput = {
    where: WorkspaceWhereUniqueInput
    create: XOR<WorkspaceCreateWithoutTeamsInput, WorkspaceUncheckedCreateWithoutTeamsInput>
  }

  export type ProjectCreateWithoutTeamInput = {
    id?: string
    name: string
    Workspace?: WorkspaceCreateNestedOneWithoutProjectsInput
  }

  export type ProjectUncheckedCreateWithoutTeamInput = {
    id?: string
    name: string
    workspaceId?: string | null
  }

  export type ProjectCreateOrConnectWithoutTeamInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutTeamInput, ProjectUncheckedCreateWithoutTeamInput>
  }

  export type ProjectCreateManyTeamInputEnvelope = {
    data: ProjectCreateManyTeamInput | ProjectCreateManyTeamInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithWhereUniqueWithoutTeamsInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutTeamsInput, UserUncheckedUpdateWithoutTeamsInput>
    create: XOR<UserCreateWithoutTeamsInput, UserUncheckedCreateWithoutTeamsInput>
  }

  export type UserUpdateWithWhereUniqueWithoutTeamsInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutTeamsInput, UserUncheckedUpdateWithoutTeamsInput>
  }

  export type UserUpdateManyWithWhereWithoutTeamsInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutTeamsInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    username?: StringNullableFilter<"User"> | string | null
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    verified?: BoolFilter<"User"> | boolean
    lastLogin?: DateTimeFilter<"User"> | Date | string
    onBoarding?: BoolFilter<"User"> | boolean
    defaultWorkspaceId?: StringNullableFilter<"User"> | string | null
  }

  export type TaskUpsertWithWhereUniqueWithoutTeamInput = {
    where: TaskWhereUniqueInput
    update: XOR<TaskUpdateWithoutTeamInput, TaskUncheckedUpdateWithoutTeamInput>
    create: XOR<TaskCreateWithoutTeamInput, TaskUncheckedCreateWithoutTeamInput>
  }

  export type TaskUpdateWithWhereUniqueWithoutTeamInput = {
    where: TaskWhereUniqueInput
    data: XOR<TaskUpdateWithoutTeamInput, TaskUncheckedUpdateWithoutTeamInput>
  }

  export type TaskUpdateManyWithWhereWithoutTeamInput = {
    where: TaskScalarWhereInput
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyWithoutTeamInput>
  }

  export type TaskScalarWhereInput = {
    AND?: TaskScalarWhereInput | TaskScalarWhereInput[]
    OR?: TaskScalarWhereInput[]
    NOT?: TaskScalarWhereInput | TaskScalarWhereInput[]
    id?: StringFilter<"Task"> | string
    authorId?: StringFilter<"Task"> | string
    title?: StringFilter<"Task"> | string
    description?: StringNullableFilter<"Task"> | string | null
    status?: EnumStatusFilter<"Task"> | $Enums.Status
    identifier?: StringFilter<"Task"> | string
    priority?: EnumPriorityNullableFilter<"Task"> | $Enums.Priority | null
    labels?: EnumLabelNullableListFilter<"Task">
    dueDate?: DateTimeNullableFilter<"Task"> | Date | string | null
    effortEstimate?: IntNullableFilter<"Task"> | number | null
    teamId?: StringFilter<"Task"> | string
    dateCreated?: DateTimeFilter<"Task"> | Date | string
    assigneeId?: StringNullableFilter<"Task"> | string | null
    assigneeName?: StringNullableFilter<"Task"> | string | null
  }

  export type WorkspaceUpsertWithoutTeamsInput = {
    update: XOR<WorkspaceUpdateWithoutTeamsInput, WorkspaceUncheckedUpdateWithoutTeamsInput>
    create: XOR<WorkspaceCreateWithoutTeamsInput, WorkspaceUncheckedCreateWithoutTeamsInput>
    where?: WorkspaceWhereInput
  }

  export type WorkspaceUpdateToOneWithWhereWithoutTeamsInput = {
    where?: WorkspaceWhereInput
    data: XOR<WorkspaceUpdateWithoutTeamsInput, WorkspaceUncheckedUpdateWithoutTeamsInput>
  }

  export type WorkspaceUpdateWithoutTeamsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableIntFieldUpdateOperationsInput | number | null
    issuesCreated?: NullableIntFieldUpdateOperationsInput | number | null
    universalTokenLink?: UniversalTokenLinkUpdateOneWithoutWorkspaceNestedInput
    projects?: ProjectUpdateManyWithoutWorkspaceNestedInput
    githubRepoInfo?: GithubRepoInfoUpdateOneWithoutWorkspaceNestedInput
    Users?: UserUpdateManyWithoutWorkspacesNestedInput
    User?: UserUpdateManyWithoutDefaultWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateWithoutTeamsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableIntFieldUpdateOperationsInput | number | null
    issuesCreated?: NullableIntFieldUpdateOperationsInput | number | null
    universalTokenLinkId?: NullableStringFieldUpdateOperationsInput | string | null
    githubRepoInfoId?: NullableStringFieldUpdateOperationsInput | string | null
    projects?: ProjectUncheckedUpdateManyWithoutWorkspaceNestedInput
    Users?: UserUncheckedUpdateManyWithoutWorkspacesNestedInput
    User?: UserUncheckedUpdateManyWithoutDefaultWorkspaceNestedInput
  }

  export type ProjectUpsertWithWhereUniqueWithoutTeamInput = {
    where: ProjectWhereUniqueInput
    update: XOR<ProjectUpdateWithoutTeamInput, ProjectUncheckedUpdateWithoutTeamInput>
    create: XOR<ProjectCreateWithoutTeamInput, ProjectUncheckedCreateWithoutTeamInput>
  }

  export type ProjectUpdateWithWhereUniqueWithoutTeamInput = {
    where: ProjectWhereUniqueInput
    data: XOR<ProjectUpdateWithoutTeamInput, ProjectUncheckedUpdateWithoutTeamInput>
  }

  export type ProjectUpdateManyWithWhereWithoutTeamInput = {
    where: ProjectScalarWhereInput
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyWithoutTeamInput>
  }

  export type ProjectScalarWhereInput = {
    AND?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    OR?: ProjectScalarWhereInput[]
    NOT?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    id?: StringFilter<"Project"> | string
    name?: StringFilter<"Project"> | string
    teamId?: StringNullableFilter<"Project"> | string | null
    workspaceId?: StringNullableFilter<"Project"> | string | null
  }

  export type WorkspaceCreateWithoutUserInput = {
    id?: string
    name?: string | null
    url?: string | null
    companySize?: number | null
    issuesCreated?: number | null
    universalTokenLink?: UniversalTokenLinkCreateNestedOneWithoutWorkspaceInput
    teams?: TeamCreateNestedManyWithoutWorkspaceInput
    projects?: ProjectCreateNestedManyWithoutWorkspaceInput
    githubRepoInfo?: GithubRepoInfoCreateNestedOneWithoutWorkspaceInput
    Users?: UserCreateNestedManyWithoutWorkspacesInput
  }

  export type WorkspaceUncheckedCreateWithoutUserInput = {
    id?: string
    name?: string | null
    url?: string | null
    companySize?: number | null
    issuesCreated?: number | null
    universalTokenLinkId?: string | null
    githubRepoInfoId?: string | null
    teams?: TeamUncheckedCreateNestedManyWithoutWorkspaceInput
    projects?: ProjectUncheckedCreateNestedManyWithoutWorkspaceInput
    Users?: UserUncheckedCreateNestedManyWithoutWorkspacesInput
  }

  export type WorkspaceCreateOrConnectWithoutUserInput = {
    where: WorkspaceWhereUniqueInput
    create: XOR<WorkspaceCreateWithoutUserInput, WorkspaceUncheckedCreateWithoutUserInput>
  }

  export type WorkspaceCreateWithoutUsersInput = {
    id?: string
    name?: string | null
    url?: string | null
    companySize?: number | null
    issuesCreated?: number | null
    universalTokenLink?: UniversalTokenLinkCreateNestedOneWithoutWorkspaceInput
    teams?: TeamCreateNestedManyWithoutWorkspaceInput
    projects?: ProjectCreateNestedManyWithoutWorkspaceInput
    githubRepoInfo?: GithubRepoInfoCreateNestedOneWithoutWorkspaceInput
    User?: UserCreateNestedManyWithoutDefaultWorkspaceInput
  }

  export type WorkspaceUncheckedCreateWithoutUsersInput = {
    id?: string
    name?: string | null
    url?: string | null
    companySize?: number | null
    issuesCreated?: number | null
    universalTokenLinkId?: string | null
    githubRepoInfoId?: string | null
    teams?: TeamUncheckedCreateNestedManyWithoutWorkspaceInput
    projects?: ProjectUncheckedCreateNestedManyWithoutWorkspaceInput
    User?: UserUncheckedCreateNestedManyWithoutDefaultWorkspaceInput
  }

  export type WorkspaceCreateOrConnectWithoutUsersInput = {
    where: WorkspaceWhereUniqueInput
    create: XOR<WorkspaceCreateWithoutUsersInput, WorkspaceUncheckedCreateWithoutUsersInput>
  }

  export type TeamCreateWithoutUsersInput = {
    id?: string
    name?: string | null
    identifier: string
    Tasks?: TaskCreateNestedManyWithoutTeamInput
    Workspace: WorkspaceCreateNestedOneWithoutTeamsInput
    Project?: ProjectCreateNestedManyWithoutTeamInput
  }

  export type TeamUncheckedCreateWithoutUsersInput = {
    id?: string
    name?: string | null
    identifier: string
    workspaceId: string
    Tasks?: TaskUncheckedCreateNestedManyWithoutTeamInput
    Project?: ProjectUncheckedCreateNestedManyWithoutTeamInput
  }

  export type TeamCreateOrConnectWithoutUsersInput = {
    where: TeamWhereUniqueInput
    create: XOR<TeamCreateWithoutUsersInput, TeamUncheckedCreateWithoutUsersInput>
  }

  export type NotificationCreateWithoutUserInput = {
    id?: string
    taskIds?: NotificationCreatetaskIdsInput | string[]
    read?: boolean
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationUncheckedCreateWithoutUserInput = {
    id?: string
    taskIds?: NotificationCreatetaskIdsInput | string[]
    read?: boolean
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NotificationCreateOrConnectWithoutUserInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationCreateManyUserInputEnvelope = {
    data: NotificationCreateManyUserInput | NotificationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CommentCreateWithoutAuthorInput = {
    id?: string
    comment: string
    date?: Date | string
    Task: TaskCreateNestedOneWithoutCommentInput
  }

  export type CommentUncheckedCreateWithoutAuthorInput = {
    id?: string
    comment: string
    date?: Date | string
    taskId: string
  }

  export type CommentCreateOrConnectWithoutAuthorInput = {
    where: CommentWhereUniqueInput
    create: XOR<CommentCreateWithoutAuthorInput, CommentUncheckedCreateWithoutAuthorInput>
  }

  export type CommentCreateManyAuthorInputEnvelope = {
    data: CommentCreateManyAuthorInput | CommentCreateManyAuthorInput[]
    skipDuplicates?: boolean
  }

  export type TaskCreateWithoutAuthorInput = {
    id?: string
    title: string
    description?: string | null
    status: $Enums.Status
    identifier: string
    priority?: $Enums.Priority | null
    labels?: TaskCreatelabelsInput | $Enums.Label[]
    dueDate?: Date | string | null
    effortEstimate?: number | null
    dateCreated?: Date | string
    assigneeId?: string | null
    assigneeName?: string | null
    Team: TeamCreateNestedOneWithoutTasksInput
    Comment?: CommentCreateNestedManyWithoutTaskInput
  }

  export type TaskUncheckedCreateWithoutAuthorInput = {
    id?: string
    title: string
    description?: string | null
    status: $Enums.Status
    identifier: string
    priority?: $Enums.Priority | null
    labels?: TaskCreatelabelsInput | $Enums.Label[]
    dueDate?: Date | string | null
    effortEstimate?: number | null
    teamId: string
    dateCreated?: Date | string
    assigneeId?: string | null
    assigneeName?: string | null
    Comment?: CommentUncheckedCreateNestedManyWithoutTaskInput
  }

  export type TaskCreateOrConnectWithoutAuthorInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutAuthorInput, TaskUncheckedCreateWithoutAuthorInput>
  }

  export type TaskCreateManyAuthorInputEnvelope = {
    data: TaskCreateManyAuthorInput | TaskCreateManyAuthorInput[]
    skipDuplicates?: boolean
  }

  export type WorkspaceUpsertWithoutUserInput = {
    update: XOR<WorkspaceUpdateWithoutUserInput, WorkspaceUncheckedUpdateWithoutUserInput>
    create: XOR<WorkspaceCreateWithoutUserInput, WorkspaceUncheckedCreateWithoutUserInput>
    where?: WorkspaceWhereInput
  }

  export type WorkspaceUpdateToOneWithWhereWithoutUserInput = {
    where?: WorkspaceWhereInput
    data: XOR<WorkspaceUpdateWithoutUserInput, WorkspaceUncheckedUpdateWithoutUserInput>
  }

  export type WorkspaceUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableIntFieldUpdateOperationsInput | number | null
    issuesCreated?: NullableIntFieldUpdateOperationsInput | number | null
    universalTokenLink?: UniversalTokenLinkUpdateOneWithoutWorkspaceNestedInput
    teams?: TeamUpdateManyWithoutWorkspaceNestedInput
    projects?: ProjectUpdateManyWithoutWorkspaceNestedInput
    githubRepoInfo?: GithubRepoInfoUpdateOneWithoutWorkspaceNestedInput
    Users?: UserUpdateManyWithoutWorkspacesNestedInput
  }

  export type WorkspaceUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableIntFieldUpdateOperationsInput | number | null
    issuesCreated?: NullableIntFieldUpdateOperationsInput | number | null
    universalTokenLinkId?: NullableStringFieldUpdateOperationsInput | string | null
    githubRepoInfoId?: NullableStringFieldUpdateOperationsInput | string | null
    teams?: TeamUncheckedUpdateManyWithoutWorkspaceNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutWorkspaceNestedInput
    Users?: UserUncheckedUpdateManyWithoutWorkspacesNestedInput
  }

  export type WorkspaceUpsertWithWhereUniqueWithoutUsersInput = {
    where: WorkspaceWhereUniqueInput
    update: XOR<WorkspaceUpdateWithoutUsersInput, WorkspaceUncheckedUpdateWithoutUsersInput>
    create: XOR<WorkspaceCreateWithoutUsersInput, WorkspaceUncheckedCreateWithoutUsersInput>
  }

  export type WorkspaceUpdateWithWhereUniqueWithoutUsersInput = {
    where: WorkspaceWhereUniqueInput
    data: XOR<WorkspaceUpdateWithoutUsersInput, WorkspaceUncheckedUpdateWithoutUsersInput>
  }

  export type WorkspaceUpdateManyWithWhereWithoutUsersInput = {
    where: WorkspaceScalarWhereInput
    data: XOR<WorkspaceUpdateManyMutationInput, WorkspaceUncheckedUpdateManyWithoutUsersInput>
  }

  export type WorkspaceScalarWhereInput = {
    AND?: WorkspaceScalarWhereInput | WorkspaceScalarWhereInput[]
    OR?: WorkspaceScalarWhereInput[]
    NOT?: WorkspaceScalarWhereInput | WorkspaceScalarWhereInput[]
    id?: StringFilter<"Workspace"> | string
    name?: StringNullableFilter<"Workspace"> | string | null
    url?: StringNullableFilter<"Workspace"> | string | null
    companySize?: IntNullableFilter<"Workspace"> | number | null
    issuesCreated?: IntNullableFilter<"Workspace"> | number | null
    universalTokenLinkId?: StringNullableFilter<"Workspace"> | string | null
    githubRepoInfoId?: StringNullableFilter<"Workspace"> | string | null
  }

  export type TeamUpsertWithWhereUniqueWithoutUsersInput = {
    where: TeamWhereUniqueInput
    update: XOR<TeamUpdateWithoutUsersInput, TeamUncheckedUpdateWithoutUsersInput>
    create: XOR<TeamCreateWithoutUsersInput, TeamUncheckedCreateWithoutUsersInput>
  }

  export type TeamUpdateWithWhereUniqueWithoutUsersInput = {
    where: TeamWhereUniqueInput
    data: XOR<TeamUpdateWithoutUsersInput, TeamUncheckedUpdateWithoutUsersInput>
  }

  export type TeamUpdateManyWithWhereWithoutUsersInput = {
    where: TeamScalarWhereInput
    data: XOR<TeamUpdateManyMutationInput, TeamUncheckedUpdateManyWithoutUsersInput>
  }

  export type TeamScalarWhereInput = {
    AND?: TeamScalarWhereInput | TeamScalarWhereInput[]
    OR?: TeamScalarWhereInput[]
    NOT?: TeamScalarWhereInput | TeamScalarWhereInput[]
    id?: StringFilter<"Team"> | string
    name?: StringNullableFilter<"Team"> | string | null
    identifier?: StringFilter<"Team"> | string
    workspaceId?: StringFilter<"Team"> | string
  }

  export type NotificationUpsertWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
  }

  export type NotificationUpdateManyWithWhereWithoutUserInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutUserInput>
  }

  export type NotificationScalarWhereInput = {
    AND?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    OR?: NotificationScalarWhereInput[]
    NOT?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    id?: StringFilter<"Notification"> | string
    userId?: StringFilter<"Notification"> | string
    taskIds?: StringNullableListFilter<"Notification">
    read?: BoolFilter<"Notification"> | boolean
    description?: StringNullableFilter<"Notification"> | string | null
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    updatedAt?: DateTimeFilter<"Notification"> | Date | string
  }

  export type CommentUpsertWithWhereUniqueWithoutAuthorInput = {
    where: CommentWhereUniqueInput
    update: XOR<CommentUpdateWithoutAuthorInput, CommentUncheckedUpdateWithoutAuthorInput>
    create: XOR<CommentCreateWithoutAuthorInput, CommentUncheckedCreateWithoutAuthorInput>
  }

  export type CommentUpdateWithWhereUniqueWithoutAuthorInput = {
    where: CommentWhereUniqueInput
    data: XOR<CommentUpdateWithoutAuthorInput, CommentUncheckedUpdateWithoutAuthorInput>
  }

  export type CommentUpdateManyWithWhereWithoutAuthorInput = {
    where: CommentScalarWhereInput
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyWithoutAuthorInput>
  }

  export type TaskUpsertWithWhereUniqueWithoutAuthorInput = {
    where: TaskWhereUniqueInput
    update: XOR<TaskUpdateWithoutAuthorInput, TaskUncheckedUpdateWithoutAuthorInput>
    create: XOR<TaskCreateWithoutAuthorInput, TaskUncheckedCreateWithoutAuthorInput>
  }

  export type TaskUpdateWithWhereUniqueWithoutAuthorInput = {
    where: TaskWhereUniqueInput
    data: XOR<TaskUpdateWithoutAuthorInput, TaskUncheckedUpdateWithoutAuthorInput>
  }

  export type TaskUpdateManyWithWhereWithoutAuthorInput = {
    where: TaskScalarWhereInput
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyWithoutAuthorInput>
  }

  export type UniversalTokenLinkCreateWithoutWorkspaceInput = {
    id?: string
    token?: string
    isEnabled?: boolean
  }

  export type UniversalTokenLinkUncheckedCreateWithoutWorkspaceInput = {
    id?: string
    token?: string
    isEnabled?: boolean
  }

  export type UniversalTokenLinkCreateOrConnectWithoutWorkspaceInput = {
    where: UniversalTokenLinkWhereUniqueInput
    create: XOR<UniversalTokenLinkCreateWithoutWorkspaceInput, UniversalTokenLinkUncheckedCreateWithoutWorkspaceInput>
  }

  export type TeamCreateWithoutWorkspaceInput = {
    id?: string
    name?: string | null
    identifier: string
    Users?: UserCreateNestedManyWithoutTeamsInput
    Tasks?: TaskCreateNestedManyWithoutTeamInput
    Project?: ProjectCreateNestedManyWithoutTeamInput
  }

  export type TeamUncheckedCreateWithoutWorkspaceInput = {
    id?: string
    name?: string | null
    identifier: string
    Users?: UserUncheckedCreateNestedManyWithoutTeamsInput
    Tasks?: TaskUncheckedCreateNestedManyWithoutTeamInput
    Project?: ProjectUncheckedCreateNestedManyWithoutTeamInput
  }

  export type TeamCreateOrConnectWithoutWorkspaceInput = {
    where: TeamWhereUniqueInput
    create: XOR<TeamCreateWithoutWorkspaceInput, TeamUncheckedCreateWithoutWorkspaceInput>
  }

  export type TeamCreateManyWorkspaceInputEnvelope = {
    data: TeamCreateManyWorkspaceInput | TeamCreateManyWorkspaceInput[]
    skipDuplicates?: boolean
  }

  export type ProjectCreateWithoutWorkspaceInput = {
    id?: string
    name: string
    Team?: TeamCreateNestedOneWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutWorkspaceInput = {
    id?: string
    name: string
    teamId?: string | null
  }

  export type ProjectCreateOrConnectWithoutWorkspaceInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutWorkspaceInput, ProjectUncheckedCreateWithoutWorkspaceInput>
  }

  export type ProjectCreateManyWorkspaceInputEnvelope = {
    data: ProjectCreateManyWorkspaceInput | ProjectCreateManyWorkspaceInput[]
    skipDuplicates?: boolean
  }

  export type GithubRepoInfoCreateWithoutWorkspaceInput = {
    id?: string
    repoName?: string
    owner?: string
  }

  export type GithubRepoInfoUncheckedCreateWithoutWorkspaceInput = {
    id?: string
    repoName?: string
    owner?: string
  }

  export type GithubRepoInfoCreateOrConnectWithoutWorkspaceInput = {
    where: GithubRepoInfoWhereUniqueInput
    create: XOR<GithubRepoInfoCreateWithoutWorkspaceInput, GithubRepoInfoUncheckedCreateWithoutWorkspaceInput>
  }

  export type UserCreateWithoutWorkspacesInput = {
    id?: string
    name: string
    username?: string | null
    email: string
    password: string
    verified?: boolean
    lastLogin?: Date | string
    onBoarding?: boolean
    DefaultWorkspace?: WorkspaceCreateNestedOneWithoutUserInput
    Teams?: TeamCreateNestedManyWithoutUsersInput
    Notification?: NotificationCreateNestedManyWithoutUserInput
    Comment?: CommentCreateNestedManyWithoutAuthorInput
    Task?: TaskCreateNestedManyWithoutAuthorInput
  }

  export type UserUncheckedCreateWithoutWorkspacesInput = {
    id?: string
    name: string
    username?: string | null
    email: string
    password: string
    verified?: boolean
    lastLogin?: Date | string
    onBoarding?: boolean
    defaultWorkspaceId?: string | null
    Teams?: TeamUncheckedCreateNestedManyWithoutUsersInput
    Notification?: NotificationUncheckedCreateNestedManyWithoutUserInput
    Comment?: CommentUncheckedCreateNestedManyWithoutAuthorInput
    Task?: TaskUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type UserCreateOrConnectWithoutWorkspacesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutWorkspacesInput, UserUncheckedCreateWithoutWorkspacesInput>
  }

  export type UserCreateWithoutDefaultWorkspaceInput = {
    id?: string
    name: string
    username?: string | null
    email: string
    password: string
    verified?: boolean
    lastLogin?: Date | string
    onBoarding?: boolean
    Workspaces?: WorkspaceCreateNestedManyWithoutUsersInput
    Teams?: TeamCreateNestedManyWithoutUsersInput
    Notification?: NotificationCreateNestedManyWithoutUserInput
    Comment?: CommentCreateNestedManyWithoutAuthorInput
    Task?: TaskCreateNestedManyWithoutAuthorInput
  }

  export type UserUncheckedCreateWithoutDefaultWorkspaceInput = {
    id?: string
    name: string
    username?: string | null
    email: string
    password: string
    verified?: boolean
    lastLogin?: Date | string
    onBoarding?: boolean
    Workspaces?: WorkspaceUncheckedCreateNestedManyWithoutUsersInput
    Teams?: TeamUncheckedCreateNestedManyWithoutUsersInput
    Notification?: NotificationUncheckedCreateNestedManyWithoutUserInput
    Comment?: CommentUncheckedCreateNestedManyWithoutAuthorInput
    Task?: TaskUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type UserCreateOrConnectWithoutDefaultWorkspaceInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDefaultWorkspaceInput, UserUncheckedCreateWithoutDefaultWorkspaceInput>
  }

  export type UserCreateManyDefaultWorkspaceInputEnvelope = {
    data: UserCreateManyDefaultWorkspaceInput | UserCreateManyDefaultWorkspaceInput[]
    skipDuplicates?: boolean
  }

  export type UniversalTokenLinkUpsertWithoutWorkspaceInput = {
    update: XOR<UniversalTokenLinkUpdateWithoutWorkspaceInput, UniversalTokenLinkUncheckedUpdateWithoutWorkspaceInput>
    create: XOR<UniversalTokenLinkCreateWithoutWorkspaceInput, UniversalTokenLinkUncheckedCreateWithoutWorkspaceInput>
    where?: UniversalTokenLinkWhereInput
  }

  export type UniversalTokenLinkUpdateToOneWithWhereWithoutWorkspaceInput = {
    where?: UniversalTokenLinkWhereInput
    data: XOR<UniversalTokenLinkUpdateWithoutWorkspaceInput, UniversalTokenLinkUncheckedUpdateWithoutWorkspaceInput>
  }

  export type UniversalTokenLinkUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UniversalTokenLinkUncheckedUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
  }

  export type TeamUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: TeamWhereUniqueInput
    update: XOR<TeamUpdateWithoutWorkspaceInput, TeamUncheckedUpdateWithoutWorkspaceInput>
    create: XOR<TeamCreateWithoutWorkspaceInput, TeamUncheckedCreateWithoutWorkspaceInput>
  }

  export type TeamUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: TeamWhereUniqueInput
    data: XOR<TeamUpdateWithoutWorkspaceInput, TeamUncheckedUpdateWithoutWorkspaceInput>
  }

  export type TeamUpdateManyWithWhereWithoutWorkspaceInput = {
    where: TeamScalarWhereInput
    data: XOR<TeamUpdateManyMutationInput, TeamUncheckedUpdateManyWithoutWorkspaceInput>
  }

  export type ProjectUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: ProjectWhereUniqueInput
    update: XOR<ProjectUpdateWithoutWorkspaceInput, ProjectUncheckedUpdateWithoutWorkspaceInput>
    create: XOR<ProjectCreateWithoutWorkspaceInput, ProjectUncheckedCreateWithoutWorkspaceInput>
  }

  export type ProjectUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: ProjectWhereUniqueInput
    data: XOR<ProjectUpdateWithoutWorkspaceInput, ProjectUncheckedUpdateWithoutWorkspaceInput>
  }

  export type ProjectUpdateManyWithWhereWithoutWorkspaceInput = {
    where: ProjectScalarWhereInput
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyWithoutWorkspaceInput>
  }

  export type GithubRepoInfoUpsertWithoutWorkspaceInput = {
    update: XOR<GithubRepoInfoUpdateWithoutWorkspaceInput, GithubRepoInfoUncheckedUpdateWithoutWorkspaceInput>
    create: XOR<GithubRepoInfoCreateWithoutWorkspaceInput, GithubRepoInfoUncheckedCreateWithoutWorkspaceInput>
    where?: GithubRepoInfoWhereInput
  }

  export type GithubRepoInfoUpdateToOneWithWhereWithoutWorkspaceInput = {
    where?: GithubRepoInfoWhereInput
    data: XOR<GithubRepoInfoUpdateWithoutWorkspaceInput, GithubRepoInfoUncheckedUpdateWithoutWorkspaceInput>
  }

  export type GithubRepoInfoUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    repoName?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
  }

  export type GithubRepoInfoUncheckedUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    repoName?: StringFieldUpdateOperationsInput | string
    owner?: StringFieldUpdateOperationsInput | string
  }

  export type UserUpsertWithWhereUniqueWithoutWorkspacesInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutWorkspacesInput, UserUncheckedUpdateWithoutWorkspacesInput>
    create: XOR<UserCreateWithoutWorkspacesInput, UserUncheckedCreateWithoutWorkspacesInput>
  }

  export type UserUpdateWithWhereUniqueWithoutWorkspacesInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutWorkspacesInput, UserUncheckedUpdateWithoutWorkspacesInput>
  }

  export type UserUpdateManyWithWhereWithoutWorkspacesInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutWorkspacesInput>
  }

  export type UserUpsertWithWhereUniqueWithoutDefaultWorkspaceInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutDefaultWorkspaceInput, UserUncheckedUpdateWithoutDefaultWorkspaceInput>
    create: XOR<UserCreateWithoutDefaultWorkspaceInput, UserUncheckedCreateWithoutDefaultWorkspaceInput>
  }

  export type UserUpdateWithWhereUniqueWithoutDefaultWorkspaceInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutDefaultWorkspaceInput, UserUncheckedUpdateWithoutDefaultWorkspaceInput>
  }

  export type UserUpdateManyWithWhereWithoutDefaultWorkspaceInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutDefaultWorkspaceInput>
  }

  export type WorkspaceCreateWithoutUniversalTokenLinkInput = {
    id?: string
    name?: string | null
    url?: string | null
    companySize?: number | null
    issuesCreated?: number | null
    teams?: TeamCreateNestedManyWithoutWorkspaceInput
    projects?: ProjectCreateNestedManyWithoutWorkspaceInput
    githubRepoInfo?: GithubRepoInfoCreateNestedOneWithoutWorkspaceInput
    Users?: UserCreateNestedManyWithoutWorkspacesInput
    User?: UserCreateNestedManyWithoutDefaultWorkspaceInput
  }

  export type WorkspaceUncheckedCreateWithoutUniversalTokenLinkInput = {
    id?: string
    name?: string | null
    url?: string | null
    companySize?: number | null
    issuesCreated?: number | null
    githubRepoInfoId?: string | null
    teams?: TeamUncheckedCreateNestedManyWithoutWorkspaceInput
    projects?: ProjectUncheckedCreateNestedManyWithoutWorkspaceInput
    Users?: UserUncheckedCreateNestedManyWithoutWorkspacesInput
    User?: UserUncheckedCreateNestedManyWithoutDefaultWorkspaceInput
  }

  export type WorkspaceCreateOrConnectWithoutUniversalTokenLinkInput = {
    where: WorkspaceWhereUniqueInput
    create: XOR<WorkspaceCreateWithoutUniversalTokenLinkInput, WorkspaceUncheckedCreateWithoutUniversalTokenLinkInput>
  }

  export type WorkspaceCreateManyUniversalTokenLinkInputEnvelope = {
    data: WorkspaceCreateManyUniversalTokenLinkInput | WorkspaceCreateManyUniversalTokenLinkInput[]
    skipDuplicates?: boolean
  }

  export type WorkspaceUpsertWithWhereUniqueWithoutUniversalTokenLinkInput = {
    where: WorkspaceWhereUniqueInput
    update: XOR<WorkspaceUpdateWithoutUniversalTokenLinkInput, WorkspaceUncheckedUpdateWithoutUniversalTokenLinkInput>
    create: XOR<WorkspaceCreateWithoutUniversalTokenLinkInput, WorkspaceUncheckedCreateWithoutUniversalTokenLinkInput>
  }

  export type WorkspaceUpdateWithWhereUniqueWithoutUniversalTokenLinkInput = {
    where: WorkspaceWhereUniqueInput
    data: XOR<WorkspaceUpdateWithoutUniversalTokenLinkInput, WorkspaceUncheckedUpdateWithoutUniversalTokenLinkInput>
  }

  export type WorkspaceUpdateManyWithWhereWithoutUniversalTokenLinkInput = {
    where: WorkspaceScalarWhereInput
    data: XOR<WorkspaceUpdateManyMutationInput, WorkspaceUncheckedUpdateManyWithoutUniversalTokenLinkInput>
  }

  export type WorkspaceCreateWithoutGithubRepoInfoInput = {
    id?: string
    name?: string | null
    url?: string | null
    companySize?: number | null
    issuesCreated?: number | null
    universalTokenLink?: UniversalTokenLinkCreateNestedOneWithoutWorkspaceInput
    teams?: TeamCreateNestedManyWithoutWorkspaceInput
    projects?: ProjectCreateNestedManyWithoutWorkspaceInput
    Users?: UserCreateNestedManyWithoutWorkspacesInput
    User?: UserCreateNestedManyWithoutDefaultWorkspaceInput
  }

  export type WorkspaceUncheckedCreateWithoutGithubRepoInfoInput = {
    id?: string
    name?: string | null
    url?: string | null
    companySize?: number | null
    issuesCreated?: number | null
    universalTokenLinkId?: string | null
    teams?: TeamUncheckedCreateNestedManyWithoutWorkspaceInput
    projects?: ProjectUncheckedCreateNestedManyWithoutWorkspaceInput
    Users?: UserUncheckedCreateNestedManyWithoutWorkspacesInput
    User?: UserUncheckedCreateNestedManyWithoutDefaultWorkspaceInput
  }

  export type WorkspaceCreateOrConnectWithoutGithubRepoInfoInput = {
    where: WorkspaceWhereUniqueInput
    create: XOR<WorkspaceCreateWithoutGithubRepoInfoInput, WorkspaceUncheckedCreateWithoutGithubRepoInfoInput>
  }

  export type WorkspaceCreateManyGithubRepoInfoInputEnvelope = {
    data: WorkspaceCreateManyGithubRepoInfoInput | WorkspaceCreateManyGithubRepoInfoInput[]
    skipDuplicates?: boolean
  }

  export type WorkspaceUpsertWithWhereUniqueWithoutGithubRepoInfoInput = {
    where: WorkspaceWhereUniqueInput
    update: XOR<WorkspaceUpdateWithoutGithubRepoInfoInput, WorkspaceUncheckedUpdateWithoutGithubRepoInfoInput>
    create: XOR<WorkspaceCreateWithoutGithubRepoInfoInput, WorkspaceUncheckedCreateWithoutGithubRepoInfoInput>
  }

  export type WorkspaceUpdateWithWhereUniqueWithoutGithubRepoInfoInput = {
    where: WorkspaceWhereUniqueInput
    data: XOR<WorkspaceUpdateWithoutGithubRepoInfoInput, WorkspaceUncheckedUpdateWithoutGithubRepoInfoInput>
  }

  export type WorkspaceUpdateManyWithWhereWithoutGithubRepoInfoInput = {
    where: WorkspaceScalarWhereInput
    data: XOR<WorkspaceUpdateManyMutationInput, WorkspaceUncheckedUpdateManyWithoutGithubRepoInfoInput>
  }

  export type TeamCreateWithoutProjectInput = {
    id?: string
    name?: string | null
    identifier: string
    Users?: UserCreateNestedManyWithoutTeamsInput
    Tasks?: TaskCreateNestedManyWithoutTeamInput
    Workspace: WorkspaceCreateNestedOneWithoutTeamsInput
  }

  export type TeamUncheckedCreateWithoutProjectInput = {
    id?: string
    name?: string | null
    identifier: string
    workspaceId: string
    Users?: UserUncheckedCreateNestedManyWithoutTeamsInput
    Tasks?: TaskUncheckedCreateNestedManyWithoutTeamInput
  }

  export type TeamCreateOrConnectWithoutProjectInput = {
    where: TeamWhereUniqueInput
    create: XOR<TeamCreateWithoutProjectInput, TeamUncheckedCreateWithoutProjectInput>
  }

  export type WorkspaceCreateWithoutProjectsInput = {
    id?: string
    name?: string | null
    url?: string | null
    companySize?: number | null
    issuesCreated?: number | null
    universalTokenLink?: UniversalTokenLinkCreateNestedOneWithoutWorkspaceInput
    teams?: TeamCreateNestedManyWithoutWorkspaceInput
    githubRepoInfo?: GithubRepoInfoCreateNestedOneWithoutWorkspaceInput
    Users?: UserCreateNestedManyWithoutWorkspacesInput
    User?: UserCreateNestedManyWithoutDefaultWorkspaceInput
  }

  export type WorkspaceUncheckedCreateWithoutProjectsInput = {
    id?: string
    name?: string | null
    url?: string | null
    companySize?: number | null
    issuesCreated?: number | null
    universalTokenLinkId?: string | null
    githubRepoInfoId?: string | null
    teams?: TeamUncheckedCreateNestedManyWithoutWorkspaceInput
    Users?: UserUncheckedCreateNestedManyWithoutWorkspacesInput
    User?: UserUncheckedCreateNestedManyWithoutDefaultWorkspaceInput
  }

  export type WorkspaceCreateOrConnectWithoutProjectsInput = {
    where: WorkspaceWhereUniqueInput
    create: XOR<WorkspaceCreateWithoutProjectsInput, WorkspaceUncheckedCreateWithoutProjectsInput>
  }

  export type TeamUpsertWithoutProjectInput = {
    update: XOR<TeamUpdateWithoutProjectInput, TeamUncheckedUpdateWithoutProjectInput>
    create: XOR<TeamCreateWithoutProjectInput, TeamUncheckedCreateWithoutProjectInput>
    where?: TeamWhereInput
  }

  export type TeamUpdateToOneWithWhereWithoutProjectInput = {
    where?: TeamWhereInput
    data: XOR<TeamUpdateWithoutProjectInput, TeamUncheckedUpdateWithoutProjectInput>
  }

  export type TeamUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    identifier?: StringFieldUpdateOperationsInput | string
    Users?: UserUpdateManyWithoutTeamsNestedInput
    Tasks?: TaskUpdateManyWithoutTeamNestedInput
    Workspace?: WorkspaceUpdateOneRequiredWithoutTeamsNestedInput
  }

  export type TeamUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    identifier?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    Users?: UserUncheckedUpdateManyWithoutTeamsNestedInput
    Tasks?: TaskUncheckedUpdateManyWithoutTeamNestedInput
  }

  export type WorkspaceUpsertWithoutProjectsInput = {
    update: XOR<WorkspaceUpdateWithoutProjectsInput, WorkspaceUncheckedUpdateWithoutProjectsInput>
    create: XOR<WorkspaceCreateWithoutProjectsInput, WorkspaceUncheckedCreateWithoutProjectsInput>
    where?: WorkspaceWhereInput
  }

  export type WorkspaceUpdateToOneWithWhereWithoutProjectsInput = {
    where?: WorkspaceWhereInput
    data: XOR<WorkspaceUpdateWithoutProjectsInput, WorkspaceUncheckedUpdateWithoutProjectsInput>
  }

  export type WorkspaceUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableIntFieldUpdateOperationsInput | number | null
    issuesCreated?: NullableIntFieldUpdateOperationsInput | number | null
    universalTokenLink?: UniversalTokenLinkUpdateOneWithoutWorkspaceNestedInput
    teams?: TeamUpdateManyWithoutWorkspaceNestedInput
    githubRepoInfo?: GithubRepoInfoUpdateOneWithoutWorkspaceNestedInput
    Users?: UserUpdateManyWithoutWorkspacesNestedInput
    User?: UserUpdateManyWithoutDefaultWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableIntFieldUpdateOperationsInput | number | null
    issuesCreated?: NullableIntFieldUpdateOperationsInput | number | null
    universalTokenLinkId?: NullableStringFieldUpdateOperationsInput | string | null
    githubRepoInfoId?: NullableStringFieldUpdateOperationsInput | string | null
    teams?: TeamUncheckedUpdateManyWithoutWorkspaceNestedInput
    Users?: UserUncheckedUpdateManyWithoutWorkspacesNestedInput
    User?: UserUncheckedUpdateManyWithoutDefaultWorkspaceNestedInput
  }

  export type TaskEventCreateManyTaskEventLogInput = {
    id?: string
    type: string
    authorId: string
    authorName: string
    updatedAt?: Date | string
    originalLabels?: TaskEventCreateoriginalLabelsInput | $Enums.Label[]
    updatedLabels?: TaskEventCreateupdatedLabelsInput | $Enums.Label[]
    originalValue?: string | null
    updatedValue?: string | null
    originalAssigneeId?: string | null
    originalAssigneeName?: string | null
    updatedAssigneeId?: string | null
    updatedAssigneeName?: string | null
  }

  export type TaskEventUpdateWithoutTaskEventLogInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    originalLabels?: TaskEventUpdateoriginalLabelsInput | $Enums.Label[]
    updatedLabels?: TaskEventUpdateupdatedLabelsInput | $Enums.Label[]
    originalValue?: NullableStringFieldUpdateOperationsInput | string | null
    updatedValue?: NullableStringFieldUpdateOperationsInput | string | null
    originalAssigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    originalAssigneeName?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAssigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAssigneeName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TaskEventUncheckedUpdateWithoutTaskEventLogInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    originalLabels?: TaskEventUpdateoriginalLabelsInput | $Enums.Label[]
    updatedLabels?: TaskEventUpdateupdatedLabelsInput | $Enums.Label[]
    originalValue?: NullableStringFieldUpdateOperationsInput | string | null
    updatedValue?: NullableStringFieldUpdateOperationsInput | string | null
    originalAssigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    originalAssigneeName?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAssigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAssigneeName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TaskEventUncheckedUpdateManyWithoutTaskEventLogInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    originalLabels?: TaskEventUpdateoriginalLabelsInput | $Enums.Label[]
    updatedLabels?: TaskEventUpdateupdatedLabelsInput | $Enums.Label[]
    originalValue?: NullableStringFieldUpdateOperationsInput | string | null
    updatedValue?: NullableStringFieldUpdateOperationsInput | string | null
    originalAssigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    originalAssigneeName?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAssigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAssigneeName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CommentCreateManyTaskInput = {
    id?: string
    comment: string
    authorId: string
    date?: Date | string
  }

  export type CommentUpdateWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    comment?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    Author?: UserUpdateOneRequiredWithoutCommentNestedInput
  }

  export type CommentUncheckedUpdateWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    comment?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentUncheckedUpdateManyWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    comment?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskCreateManyTeamInput = {
    id?: string
    authorId: string
    title: string
    description?: string | null
    status: $Enums.Status
    identifier: string
    priority?: $Enums.Priority | null
    labels?: TaskCreatelabelsInput | $Enums.Label[]
    dueDate?: Date | string | null
    effortEstimate?: number | null
    dateCreated?: Date | string
    assigneeId?: string | null
    assigneeName?: string | null
  }

  export type ProjectCreateManyTeamInput = {
    id?: string
    name: string
    workspaceId?: string | null
  }

  export type UserUpdateWithoutTeamsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: DateTimeFieldUpdateOperationsInput | Date | string
    onBoarding?: BoolFieldUpdateOperationsInput | boolean
    DefaultWorkspace?: WorkspaceUpdateOneWithoutUserNestedInput
    Workspaces?: WorkspaceUpdateManyWithoutUsersNestedInput
    Notification?: NotificationUpdateManyWithoutUserNestedInput
    Comment?: CommentUpdateManyWithoutAuthorNestedInput
    Task?: TaskUpdateManyWithoutAuthorNestedInput
  }

  export type UserUncheckedUpdateWithoutTeamsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: DateTimeFieldUpdateOperationsInput | Date | string
    onBoarding?: BoolFieldUpdateOperationsInput | boolean
    defaultWorkspaceId?: NullableStringFieldUpdateOperationsInput | string | null
    Workspaces?: WorkspaceUncheckedUpdateManyWithoutUsersNestedInput
    Notification?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    Comment?: CommentUncheckedUpdateManyWithoutAuthorNestedInput
    Task?: TaskUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type UserUncheckedUpdateManyWithoutTeamsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: DateTimeFieldUpdateOperationsInput | Date | string
    onBoarding?: BoolFieldUpdateOperationsInput | boolean
    defaultWorkspaceId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TaskUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    identifier?: StringFieldUpdateOperationsInput | string
    priority?: NullableEnumPriorityFieldUpdateOperationsInput | $Enums.Priority | null
    labels?: TaskUpdatelabelsInput | $Enums.Label[]
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    effortEstimate?: NullableIntFieldUpdateOperationsInput | number | null
    dateCreated?: DateTimeFieldUpdateOperationsInput | Date | string
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    assigneeName?: NullableStringFieldUpdateOperationsInput | string | null
    Author?: UserUpdateOneRequiredWithoutTaskNestedInput
    Comment?: CommentUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    identifier?: StringFieldUpdateOperationsInput | string
    priority?: NullableEnumPriorityFieldUpdateOperationsInput | $Enums.Priority | null
    labels?: TaskUpdatelabelsInput | $Enums.Label[]
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    effortEstimate?: NullableIntFieldUpdateOperationsInput | number | null
    dateCreated?: DateTimeFieldUpdateOperationsInput | Date | string
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    assigneeName?: NullableStringFieldUpdateOperationsInput | string | null
    Comment?: CommentUncheckedUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateManyWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    identifier?: StringFieldUpdateOperationsInput | string
    priority?: NullableEnumPriorityFieldUpdateOperationsInput | $Enums.Priority | null
    labels?: TaskUpdatelabelsInput | $Enums.Label[]
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    effortEstimate?: NullableIntFieldUpdateOperationsInput | number | null
    dateCreated?: DateTimeFieldUpdateOperationsInput | Date | string
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    assigneeName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProjectUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    Workspace?: WorkspaceUpdateOneWithoutProjectsNestedInput
  }

  export type ProjectUncheckedUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    workspaceId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProjectUncheckedUpdateManyWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    workspaceId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type NotificationCreateManyUserInput = {
    id?: string
    taskIds?: NotificationCreatetaskIdsInput | string[]
    read?: boolean
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CommentCreateManyAuthorInput = {
    id?: string
    comment: string
    date?: Date | string
    taskId: string
  }

  export type TaskCreateManyAuthorInput = {
    id?: string
    title: string
    description?: string | null
    status: $Enums.Status
    identifier: string
    priority?: $Enums.Priority | null
    labels?: TaskCreatelabelsInput | $Enums.Label[]
    dueDate?: Date | string | null
    effortEstimate?: number | null
    teamId: string
    dateCreated?: Date | string
    assigneeId?: string | null
    assigneeName?: string | null
  }

  export type WorkspaceUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableIntFieldUpdateOperationsInput | number | null
    issuesCreated?: NullableIntFieldUpdateOperationsInput | number | null
    universalTokenLink?: UniversalTokenLinkUpdateOneWithoutWorkspaceNestedInput
    teams?: TeamUpdateManyWithoutWorkspaceNestedInput
    projects?: ProjectUpdateManyWithoutWorkspaceNestedInput
    githubRepoInfo?: GithubRepoInfoUpdateOneWithoutWorkspaceNestedInput
    User?: UserUpdateManyWithoutDefaultWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableIntFieldUpdateOperationsInput | number | null
    issuesCreated?: NullableIntFieldUpdateOperationsInput | number | null
    universalTokenLinkId?: NullableStringFieldUpdateOperationsInput | string | null
    githubRepoInfoId?: NullableStringFieldUpdateOperationsInput | string | null
    teams?: TeamUncheckedUpdateManyWithoutWorkspaceNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutWorkspaceNestedInput
    User?: UserUncheckedUpdateManyWithoutDefaultWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateManyWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableIntFieldUpdateOperationsInput | number | null
    issuesCreated?: NullableIntFieldUpdateOperationsInput | number | null
    universalTokenLinkId?: NullableStringFieldUpdateOperationsInput | string | null
    githubRepoInfoId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TeamUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    identifier?: StringFieldUpdateOperationsInput | string
    Tasks?: TaskUpdateManyWithoutTeamNestedInput
    Workspace?: WorkspaceUpdateOneRequiredWithoutTeamsNestedInput
    Project?: ProjectUpdateManyWithoutTeamNestedInput
  }

  export type TeamUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    identifier?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
    Tasks?: TaskUncheckedUpdateManyWithoutTeamNestedInput
    Project?: ProjectUncheckedUpdateManyWithoutTeamNestedInput
  }

  export type TeamUncheckedUpdateManyWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    identifier?: StringFieldUpdateOperationsInput | string
    workspaceId?: StringFieldUpdateOperationsInput | string
  }

  export type NotificationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskIds?: NotificationUpdatetaskIdsInput | string[]
    read?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskIds?: NotificationUpdatetaskIdsInput | string[]
    read?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    taskIds?: NotificationUpdatetaskIdsInput | string[]
    read?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CommentUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    comment?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    Task?: TaskUpdateOneRequiredWithoutCommentNestedInput
  }

  export type CommentUncheckedUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    comment?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    taskId?: StringFieldUpdateOperationsInput | string
  }

  export type CommentUncheckedUpdateManyWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    comment?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    taskId?: StringFieldUpdateOperationsInput | string
  }

  export type TaskUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    identifier?: StringFieldUpdateOperationsInput | string
    priority?: NullableEnumPriorityFieldUpdateOperationsInput | $Enums.Priority | null
    labels?: TaskUpdatelabelsInput | $Enums.Label[]
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    effortEstimate?: NullableIntFieldUpdateOperationsInput | number | null
    dateCreated?: DateTimeFieldUpdateOperationsInput | Date | string
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    assigneeName?: NullableStringFieldUpdateOperationsInput | string | null
    Team?: TeamUpdateOneRequiredWithoutTasksNestedInput
    Comment?: CommentUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    identifier?: StringFieldUpdateOperationsInput | string
    priority?: NullableEnumPriorityFieldUpdateOperationsInput | $Enums.Priority | null
    labels?: TaskUpdatelabelsInput | $Enums.Label[]
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    effortEstimate?: NullableIntFieldUpdateOperationsInput | number | null
    teamId?: StringFieldUpdateOperationsInput | string
    dateCreated?: DateTimeFieldUpdateOperationsInput | Date | string
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    assigneeName?: NullableStringFieldUpdateOperationsInput | string | null
    Comment?: CommentUncheckedUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateManyWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    identifier?: StringFieldUpdateOperationsInput | string
    priority?: NullableEnumPriorityFieldUpdateOperationsInput | $Enums.Priority | null
    labels?: TaskUpdatelabelsInput | $Enums.Label[]
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    effortEstimate?: NullableIntFieldUpdateOperationsInput | number | null
    teamId?: StringFieldUpdateOperationsInput | string
    dateCreated?: DateTimeFieldUpdateOperationsInput | Date | string
    assigneeId?: NullableStringFieldUpdateOperationsInput | string | null
    assigneeName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TeamCreateManyWorkspaceInput = {
    id?: string
    name?: string | null
    identifier: string
  }

  export type ProjectCreateManyWorkspaceInput = {
    id?: string
    name: string
    teamId?: string | null
  }

  export type UserCreateManyDefaultWorkspaceInput = {
    id?: string
    name: string
    username?: string | null
    email: string
    password: string
    verified?: boolean
    lastLogin?: Date | string
    onBoarding?: boolean
  }

  export type TeamUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    identifier?: StringFieldUpdateOperationsInput | string
    Users?: UserUpdateManyWithoutTeamsNestedInput
    Tasks?: TaskUpdateManyWithoutTeamNestedInput
    Project?: ProjectUpdateManyWithoutTeamNestedInput
  }

  export type TeamUncheckedUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    identifier?: StringFieldUpdateOperationsInput | string
    Users?: UserUncheckedUpdateManyWithoutTeamsNestedInput
    Tasks?: TaskUncheckedUpdateManyWithoutTeamNestedInput
    Project?: ProjectUncheckedUpdateManyWithoutTeamNestedInput
  }

  export type TeamUncheckedUpdateManyWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    identifier?: StringFieldUpdateOperationsInput | string
  }

  export type ProjectUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    Team?: TeamUpdateOneWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProjectUncheckedUpdateManyWithoutWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUpdateWithoutWorkspacesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: DateTimeFieldUpdateOperationsInput | Date | string
    onBoarding?: BoolFieldUpdateOperationsInput | boolean
    DefaultWorkspace?: WorkspaceUpdateOneWithoutUserNestedInput
    Teams?: TeamUpdateManyWithoutUsersNestedInput
    Notification?: NotificationUpdateManyWithoutUserNestedInput
    Comment?: CommentUpdateManyWithoutAuthorNestedInput
    Task?: TaskUpdateManyWithoutAuthorNestedInput
  }

  export type UserUncheckedUpdateWithoutWorkspacesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: DateTimeFieldUpdateOperationsInput | Date | string
    onBoarding?: BoolFieldUpdateOperationsInput | boolean
    defaultWorkspaceId?: NullableStringFieldUpdateOperationsInput | string | null
    Teams?: TeamUncheckedUpdateManyWithoutUsersNestedInput
    Notification?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    Comment?: CommentUncheckedUpdateManyWithoutAuthorNestedInput
    Task?: TaskUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type UserUncheckedUpdateManyWithoutWorkspacesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: DateTimeFieldUpdateOperationsInput | Date | string
    onBoarding?: BoolFieldUpdateOperationsInput | boolean
    defaultWorkspaceId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUpdateWithoutDefaultWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: DateTimeFieldUpdateOperationsInput | Date | string
    onBoarding?: BoolFieldUpdateOperationsInput | boolean
    Workspaces?: WorkspaceUpdateManyWithoutUsersNestedInput
    Teams?: TeamUpdateManyWithoutUsersNestedInput
    Notification?: NotificationUpdateManyWithoutUserNestedInput
    Comment?: CommentUpdateManyWithoutAuthorNestedInput
    Task?: TaskUpdateManyWithoutAuthorNestedInput
  }

  export type UserUncheckedUpdateWithoutDefaultWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: DateTimeFieldUpdateOperationsInput | Date | string
    onBoarding?: BoolFieldUpdateOperationsInput | boolean
    Workspaces?: WorkspaceUncheckedUpdateManyWithoutUsersNestedInput
    Teams?: TeamUncheckedUpdateManyWithoutUsersNestedInput
    Notification?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    Comment?: CommentUncheckedUpdateManyWithoutAuthorNestedInput
    Task?: TaskUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type UserUncheckedUpdateManyWithoutDefaultWorkspaceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    username?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    verified?: BoolFieldUpdateOperationsInput | boolean
    lastLogin?: DateTimeFieldUpdateOperationsInput | Date | string
    onBoarding?: BoolFieldUpdateOperationsInput | boolean
  }

  export type WorkspaceCreateManyUniversalTokenLinkInput = {
    id?: string
    name?: string | null
    url?: string | null
    companySize?: number | null
    issuesCreated?: number | null
    githubRepoInfoId?: string | null
  }

  export type WorkspaceUpdateWithoutUniversalTokenLinkInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableIntFieldUpdateOperationsInput | number | null
    issuesCreated?: NullableIntFieldUpdateOperationsInput | number | null
    teams?: TeamUpdateManyWithoutWorkspaceNestedInput
    projects?: ProjectUpdateManyWithoutWorkspaceNestedInput
    githubRepoInfo?: GithubRepoInfoUpdateOneWithoutWorkspaceNestedInput
    Users?: UserUpdateManyWithoutWorkspacesNestedInput
    User?: UserUpdateManyWithoutDefaultWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateWithoutUniversalTokenLinkInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableIntFieldUpdateOperationsInput | number | null
    issuesCreated?: NullableIntFieldUpdateOperationsInput | number | null
    githubRepoInfoId?: NullableStringFieldUpdateOperationsInput | string | null
    teams?: TeamUncheckedUpdateManyWithoutWorkspaceNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutWorkspaceNestedInput
    Users?: UserUncheckedUpdateManyWithoutWorkspacesNestedInput
    User?: UserUncheckedUpdateManyWithoutDefaultWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateManyWithoutUniversalTokenLinkInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableIntFieldUpdateOperationsInput | number | null
    issuesCreated?: NullableIntFieldUpdateOperationsInput | number | null
    githubRepoInfoId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type WorkspaceCreateManyGithubRepoInfoInput = {
    id?: string
    name?: string | null
    url?: string | null
    companySize?: number | null
    issuesCreated?: number | null
    universalTokenLinkId?: string | null
  }

  export type WorkspaceUpdateWithoutGithubRepoInfoInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableIntFieldUpdateOperationsInput | number | null
    issuesCreated?: NullableIntFieldUpdateOperationsInput | number | null
    universalTokenLink?: UniversalTokenLinkUpdateOneWithoutWorkspaceNestedInput
    teams?: TeamUpdateManyWithoutWorkspaceNestedInput
    projects?: ProjectUpdateManyWithoutWorkspaceNestedInput
    Users?: UserUpdateManyWithoutWorkspacesNestedInput
    User?: UserUpdateManyWithoutDefaultWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateWithoutGithubRepoInfoInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableIntFieldUpdateOperationsInput | number | null
    issuesCreated?: NullableIntFieldUpdateOperationsInput | number | null
    universalTokenLinkId?: NullableStringFieldUpdateOperationsInput | string | null
    teams?: TeamUncheckedUpdateManyWithoutWorkspaceNestedInput
    projects?: ProjectUncheckedUpdateManyWithoutWorkspaceNestedInput
    Users?: UserUncheckedUpdateManyWithoutWorkspacesNestedInput
    User?: UserUncheckedUpdateManyWithoutDefaultWorkspaceNestedInput
  }

  export type WorkspaceUncheckedUpdateManyWithoutGithubRepoInfoInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableIntFieldUpdateOperationsInput | number | null
    issuesCreated?: NullableIntFieldUpdateOperationsInput | number | null
    universalTokenLinkId?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use TaskEventLogCountOutputTypeDefaultArgs instead
     */
    export type TaskEventLogCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TaskEventLogCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TaskCountOutputTypeDefaultArgs instead
     */
    export type TaskCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TaskCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TeamCountOutputTypeDefaultArgs instead
     */
    export type TeamCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TeamCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use WorkspaceCountOutputTypeDefaultArgs instead
     */
    export type WorkspaceCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = WorkspaceCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UniversalTokenLinkCountOutputTypeDefaultArgs instead
     */
    export type UniversalTokenLinkCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UniversalTokenLinkCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GithubRepoInfoCountOutputTypeDefaultArgs instead
     */
    export type GithubRepoInfoCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GithubRepoInfoCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CommitDefaultArgs instead
     */
    export type CommitArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CommitDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TaskEventLogDefaultArgs instead
     */
    export type TaskEventLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TaskEventLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TaskEventDefaultArgs instead
     */
    export type TaskEventArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TaskEventDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CommentDefaultArgs instead
     */
    export type CommentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CommentDefaultArgs<ExtArgs>
    /**
     * @deprecated Use NotificationDefaultArgs instead
     */
    export type NotificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = NotificationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PageFilterModelDefaultArgs instead
     */
    export type PageFilterModelArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PageFilterModelDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TaskDefaultArgs instead
     */
    export type TaskArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TaskDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TeamDefaultArgs instead
     */
    export type TeamArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TeamDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use WorkspaceDefaultArgs instead
     */
    export type WorkspaceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = WorkspaceDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UniversalTokenLinkDefaultArgs instead
     */
    export type UniversalTokenLinkArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UniversalTokenLinkDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GithubRepoInfoDefaultArgs instead
     */
    export type GithubRepoInfoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GithubRepoInfoDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ProjectDefaultArgs instead
     */
    export type ProjectArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ProjectDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}