import camelcaseKeys from 'camelcase-keys';
import dotenvSafe from 'dotenv-safe';
import postgres from 'postgres';
import setPostgresDefaultsOnHeroku from './heroku-postgres';
import {
  BreakType,
  CreateProfileType,
  CreateSubtaskType,
  CreateTaskType,
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

setPostgresDefaultsOnHeroku();
dotenvSafe.config();

declare module globalThis {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  let __postgresSqlClient: ReturnType<typeof postgres> | undefined;
}

export function connectOneTimeToDatabase() {
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
  const [user] = await sql<[UserType]>`
    SELECT
      *
    FROM
      users
    WHERE
      id = ${id};
  `;
  return camelcaseKeys(user);
}

export async function getUserWithPasswordHashByUsername(username: string) {
  const [user] = await sql<[UserWithPasswordHashType | undefined]>`
    SELECT
      id, username, password_hash
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
      id, username, password_hash;
  `;
  return user && camelcaseKeys(user);
}

export async function updateUser(id: number, userToUpdate: UserType) {
  const [user] = await sql<[UserType | undefined]>`
    UPDATE
      users
    SET
      username = ${userToUpdate.username}
    WHERE
      id = ${id}
    RETURNING
      id, username;
  `;
  return user && camelcaseKeys(user);
}

export async function deleteUser(id: number) {
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
export async function getProfileByUserId(userId: number) {
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

export async function getProfileByProfileId(profileId: number) {
  const profiles = await sql<[ProfileType]>`
    SELECT
      *
    FROM
      profiles
    WHERE
      id = ${profileId};
  `;
  return camelcaseKeys(profiles[0]);
}

export async function createProfile(profileToCreate: CreateProfileType) {
  const [profile] = await sql<[ProfileType | undefined]>`
    INSERT INTO profiles
      (user_id, first_name, last_name, location, time_start, time_end)
    VALUES
      (
        ${profileToCreate.userId},
        ${profileToCreate.firstName},
        ${profileToCreate.lastName},
        ${profileToCreate.location},
        ${profileToCreate.timeStart},
        ${profileToCreate.timeEnd}
      )
    RETURNING
      id, user_id, first_name, last_name, location, time_start, time_end;
  `;
  return profile && camelcaseKeys(profile);
}

export async function updateProfile(
  id: number,
  profileToUpdate: CreateProfileType,
) {
  const [profile] = await sql<[ProfileType | undefined]>`
    UPDATE
      profiles
    SET
      user_id = ${profileToUpdate.userId},
      first_name = ${profileToUpdate.firstName},
      last_name = ${profileToUpdate.lastName},
      location = ${profileToUpdate.location},
      time_start = ${profileToUpdate.timeStart},
      time_end = ${profileToUpdate.timeEnd}
    WHERE
      id = ${id}
    RETURNING
      id, user_id, first_name, last_name, location, time_start, time_end;
  `;
  return profile && camelcaseKeys(profile);
}

export async function deleteProfile(id: number) {
  const [profile] = await sql<[ProfileType | undefined]>`
    DELETE FROM
      profiles
    WHERE
      id = ${id}
    RETURNING
      id, user_id, first_name, last_name, location, time_start, time_end;
  `;
  return profile && camelcaseKeys(profile);
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
export async function getTasksByProfileId(profileId: number) {
  const tasks = await sql<TaskType[]>`
    SELECT
      *
    FROM
      tasks
    WHERE
      profile_id = ${profileId};
  `;
  return tasks.map((task) => {
    return camelcaseKeys(task);
  });
}

export async function getTaskByTaskId(taskId: number) {
  const [task] = await sql<[TaskType]>`
    SELECT
      *
    FROM
      tasks
    WHERE
      id = ${taskId};
  `;
  return camelcaseKeys(task);
}

export async function createTask(taskToCreate: CreateTaskType) {
  const [task] = await sql<[TaskType | undefined]>`
    INSERT INTO tasks
      (profile_id, name, is_done, is_today)
    VALUES
      (${taskToCreate.profileId}, ${taskToCreate.name}, ${taskToCreate.isDone}, ${taskToCreate.isToday})
    RETURNING
      id, profile_id, name, is_done, is_today;
  `;
  return task && camelcaseKeys(task);
}

export async function updateTask(id: number, taskToUpdate: CreateTaskType) {
  const [task] = await sql<[TaskType | undefined]>`
    UPDATE
      tasks
    SET
      profile_id = ${taskToUpdate.profileId}, name = ${taskToUpdate.name}, is_done = ${taskToUpdate.isDone}, is_today = ${taskToUpdate.isToday}
    WHERE
      id = ${id}
    RETURNING
      id, profile_id, name, is_done, is_today;
  `;
  return task && camelcaseKeys(task);
}

export async function deleteTask(id: number) {
  const [task] = await sql<[TaskType | undefined]>`
    DELETE FROM
      tasks
    WHERE
      id = ${id}
    RETURNING
      id,
      name;
  `;
  return task && camelcaseKeys(task);
}

// SUBTASK
export async function getSubtasksByTaskId(taskId: number) {
  const subtasks = await sql<SubtaskType[]>`
    SELECT
      *
    FROM
      subtasks
    WHERE
      task_id = ${taskId};
  `;
  return subtasks.map((subtask) => {
    return camelcaseKeys(subtask);
  });
}

export async function getSubtaskBySubtaskId(taskId: number) {
  const [subtask] = await sql<[SubtaskType]>`
    SELECT
      *
    FROM
      subtasks
    WHERE
      id = ${taskId};
  `;
  return camelcaseKeys(subtask);
}

export async function createSubtask(subtaskToCreate: CreateSubtaskType) {
  const [subtask] = await sql<[SubtaskType | undefined]>`
    INSERT INTO subtasks
      (task_id, name, is_done)
    VALUES
      (${subtaskToCreate.taskId}, ${subtaskToCreate.name}, ${subtaskToCreate.isDone})
    RETURNING
      id, task_id, name, is_done;
  `;
  return subtask && camelcaseKeys(subtask);
}

export async function updateSubtask(
  id: number,
  subtaskToUpdate: CreateSubtaskType,
) {
  const [subtask] = await sql<[SubtaskType | undefined]>`
    UPDATE
      subtasks
    SET
      name = ${subtaskToUpdate.name}, is_done = ${subtaskToUpdate.isDone}
    WHERE
      id = ${id}
    RETURNING
      id, task_id, name, is_done;
  `;
  return subtask && camelcaseKeys(subtask);
}

export async function deleteSubtask(id: number) {
  const [subtask] = await sql<[SubtaskType | undefined]>`
    DELETE FROM
      subtasks
    WHERE
      id = ${id}
    RETURNING
      id,
      name;
  `;
  return subtask && camelcaseKeys(subtask);
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
