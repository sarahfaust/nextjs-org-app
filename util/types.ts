export type UserType = {
  id: number;
  username: string;
};

export type CreateUserType = {
  username: string;
  passwordHash: string;
};

export type UserWithPasswordHashType = {
  id: number;
  username: string;
  passwordHash: string;
};

export type SessionType = {
  id: number;
  userId: number;
  token: string;
  expires: Date;
};

export type ProfileType = {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  location: string;
  timeStart: TimeRanges;
  timeEnd: TimeRanges;
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

export type TaskType = {
  id: number;
  profileId: number;
  name: string;
  isDone: boolean;
  isToday: boolean;
};

export type SubtaskType = {
  id: number;
  taskId: number;
  name: string;
  isDone: boolean;
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

export type BreakType = {
  id: number;
  profileId: number;
  incentiveTypeId: number;
  incentiveId: number;
  timeStart: TimeRanges;
  timeEnd: TimeRanges;
};

export type Errors = {
  message: string;
}[];
