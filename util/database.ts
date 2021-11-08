import camelcaseKeys from 'camelcase-keys';
import dotenvSafe from 'dotenv-safe';
import postgres from 'postgres';
import {
  BreakType,
  CreateUserType,
  DayType,
  IncentiveType,
  IncentiveTypeType,
  ProfileType,
  SessionType,
  SubtaskType,
  TaskType,
  UserType,
  UserWithPasswordHashType,
  WarmupType,
  WinddownType,
} from './types';

dotenvSafe.config();

declare module globalThis {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  let __postgresSqlClient: ReturnType<typeof postgres> | undefined;
}

function connectOneTimeToDatabase() {
  let sql;
  if (process.env.NODE_ENV === 'production') {
    sql = postgres({ ssl: { rejectUnauthorized: false } });
  } else {
    if (!globalThis.__postgresSqlClient) {
      globalThis.__postgresSqlClient = postgres();
    }
    sql = globalThis.__postgresSqlClient;
  }
  return sql;
}

const sql = connectOneTimeToDatabase();

// USER
export async function getUsers() {
  const users = await sql<UserType[]>`
    SELECT * FROM users;
  `;
  return users.map((user) => {
    return camelcaseKeys(user);
  });
}

export async function getUser(id: number) {
  const users = await sql<[UserType]>`
    SELECT
      *
    FROM
      users
    WHERE
      id = ${id};
  `;
  return camelcaseKeys(users[0]);
}

export async function getUserWithPasswordHashByUsername(username: string) {
  const [user] = await sql<[UserWithPasswordHashType | undefined]>`
    SELECT
      id,
      username,
      password_hash
    FROM
      users
    WHERE
      username = ${username};
  `;
  return user && camelcaseKeys(user);
}

export async function createUser(userToCreate: CreateUserType) {
  const [user] = await sql<[UserType | undefined]>`
    INSERT INTO users
      (username, password_hash)
    VALUES
      (${userToCreate.username}, ${userToCreate.passwordHash})
    RETURNING
      id,
      username,
      password_hash;
  `;
  return user && camelcaseKeys(user);
}

export async function updateUserById(id: number, userToUpdate: UserType) {
  const [user] = await sql<[UserType | undefined]>`
    UPDATE
      users
    SET
      username = ${userToUpdate.username}
    WHERE
      id = ${id}
    RETURNING
      id,
      username;
  `;
  return user && camelcaseKeys(user);
}

export async function deleteUserById(id: number) {
  const [user] = await sql<[UserType | undefined]>`
    DELETE FROM
      users
    WHERE
      id = ${id}
    RETURNING
      id,
      username;
  `;
  return user && camelcaseKeys(user);
}

// SESSION
export async function createSession(userId: number, token: string) {
  const [session] = await sql<[SessionType]>`
    INSERT INTO sessions
      (user_id, token)
    VALUES
      (${userId}, ${token})
    RETURNING
      *
  `;
  return camelcaseKeys(session);
}

export async function getValidSessionByToken(token: string) {
  if (!token) {
    return undefined;
  }
  const [session] = await sql<[SessionType | undefined]>`
    SELECT
      *
    FROM
      sessions
    WHERE
      token = ${token} AND
      expires > NOW()
  `;
  return session && camelcaseKeys(session);
}

export async function deleteSessionByToken(token: string) {
  const sessions = await sql<SessionType[]>`
    DELETE FROM
      sessions
    WHERE
      token = ${token}
    RETURNING *
  `;

  return sessions.map((session) => camelcaseKeys(session))[0];
}

export async function deleteExpiredSessions() {
  const sessions = await sql<SessionType[]>`
  DELETE FROM
    sessions
  WHERE
    expires < NOW()
  RETURNING *
`;

  return sessions.map((session) => camelcaseKeys(session));
}

// PROFILE
export async function getProfile(userId: number) {
  const profiles = await sql<[ProfileType]>`
    SELECT
      *
    FROM
      profiles
    WHERE
      user_id = ${userId};
  `;
  return camelcaseKeys(profiles[0]);
}

// DAY
export async function getDay(id: number) {
  const days = await sql<[DayType]>`
    SELECT
      *
    FROM
      days
    WHERE
      id = ${id};
  `;
  return camelcaseKeys(days[0]);
}

// WARMUP
export async function getWarmup(id: number) {
  const warmups = await sql<[WarmupType]>`
    SELECT
      *
    FROM
      warmups
    WHERE
      id = ${id};
  `;
  return camelcaseKeys(warmups[0]);
}

// WINDDOWN
export async function getWinddown(id: number) {
  const winddowns = await sql<[WinddownType]>`
    SELECT
      *
    FROM
      winddowns
    WHERE
      id = ${id};
  `;
  return camelcaseKeys(winddowns[0]);
}

// TASK
export async function getTasks(profileId: number) {
  const tasks = await sql<[TaskType]>`
    SELECT
      *
    FROM
      tasks
    WHERE
      profile_id = ${profileId};
  `;
  return camelcaseKeys(tasks[0]);
}

// SUBTASK
export async function getSubtasks(taskId: number) {
  const subtasks = await sql<[SubtaskType]>`
    SELECT
      *
    FROM
      subtasks
    WHERE
      task_id = ${taskId};
  `;
  return camelcaseKeys(subtasks[0]);
}

// INCENTIVE TYPE
export async function getIncentiveTypes() {
  const incentiveTypes = await sql<[IncentiveTypeType]>`
    SELECT
      *
    FROM
      incentive_types;
  `;
  return camelcaseKeys(incentiveTypes[0]);
}

export async function getIncentiveType(id: number) {
  const incentiveTypes = await sql<[IncentiveTypeType]>`
    SELECT
      *
    FROM
      incentive_types
    WHERE
      id = ${id};
  `;
  return camelcaseKeys(incentiveTypes[0]);
}

// INCENTIVE
export async function getIncentives() {
  const incentives = await sql<[IncentiveType]>`
    SELECT
      *
    FROM
      incentives;
  `;
  return camelcaseKeys(incentives[0]);
}

export async function getIncentive(id: number) {
  const incentives = await sql<[IncentiveType]>`
    SELECT
      *
    FROM
      incentives
    WHERE
      id = ${id};
  `;
  return camelcaseKeys(incentives[0]);
}

// BREAK
export async function getBreaks(id: number) {
  const breaks = await sql<[BreakType]>`
    SELECT
      *
    FROM
      breaks
    WHERE
      id = ${id};
  `;
  return camelcaseKeys(breaks[0]);
}

export async function getBreak(id: number) {
  const breaks = await sql<[BreakType]>`
    SELECT
      *
    FROM
      breaks
    WHERE
      id = ${id};
  `;
  return camelcaseKeys(breaks[0]);
}
