export type UserType = {
  id: number;
  username: string;
};

export type CreateUserType = {
  username: string;
  passwordHash: string;
};

export type UserWithPasswordHashType = CreateUserType & {
  id: number;
};

export type SessionType = {
  id: number;
  userId: number;
  token: string;
  expires: Date;
};

export type CreateProfileType = {
  userId: number;
  firstName: string;
  lastName: string;
  location: string;
  timeStart: Date;
  timeEnd: Date;
};

export type ProfileType = CreateProfileType & {
  id: number;
};

export type DayType = {
  id: number;
  profileId: number;
  date: Date;
};

export type WarmupType = {
  id: number;
  dateId: number;
  planning: string;
  review: string;
  blockers: string;
  isRealistic: boolean;
};

export type WinddownType = {
  id: number;
  dateId: number;
  review: string;
  planning: string;
  grateful: string;
  keep: string;
  improve: string;
};

export type CreateTaskType = {
  profileId: number;
  name: string;
  isDone: boolean;
  isToday: boolean;
};

export type TaskType = CreateTaskType & {
  id: number;
};

export type CreateSubtaskType = {
  taskId: number;
  name: string;
  isDone: boolean;
};

export type SubtaskType = CreateSubtaskType & {
  id: number;
};

export type IncentiveTypeType = {
  id: number;
  name: string;
};

export type IncentiveType = {
  id: number;
  incentiveTypeId: number;
  name: string;
};

export type CreateBreakType = {
  profileId: number;
  incentiveTypeId: number | null;
  incentiveId: number | null;
  timeStart: Date;
  timeEnd: Date;
};

export type BreakType = CreateBreakType & {
  id: number;
};

export type Errors = {
  message: string;
}[];
