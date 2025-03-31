import {
  pgTable,
  pgEnum,
  serial,
  integer,
  timestamp,
  foreignKey,
  text,
  boolean,
  unique,
  primaryKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const keyStatus = pgEnum("key_status", [
  "default",
  "valid",
  "invalid",
  "expired",
]);
export const keyType = pgEnum("key_type", [
  "aead-ietf",
  "aead-det",
  "hmacsha512",
  "hmacsha256",
  "auth",
  "shorthash",
  "generichash",
  "kdf",
  "secretbox",
  "secretstream",
  "stream_xchacha20",
]);
export const aalLevel = pgEnum("aal_level", ["aal1", "aal2", "aal3"]);
export const codeChallengeMethod = pgEnum("code_challenge_method", [
  "s256",
  "plain",
]);
export const factorStatus = pgEnum("factor_status", ["unverified", "verified"]);
export const factorType = pgEnum("factor_type", ["totp", "webauthn", "phone"]);
export const oneTimeTokenType = pgEnum("one_time_token_type", [
  "confirmation_token",
  "reauthentication_token",
  "recovery_token",
  "email_change_token_new",
  "email_change_token_current",
  "phone_change_token",
]);
export const action = pgEnum("action", [
  "INSERT",
  "UPDATE",
  "DELETE",
  "TRUNCATE",
  "ERROR",
]);
export const equalityOp = pgEnum("equality_op", [
  "eq",
  "neq",
  "lt",
  "lte",
  "gt",
  "gte",
  "in",
]);

export const quizzSubmitions = pgTable("quizz_submitions", {
  id: serial("id").primaryKey().notNull(),
  quizzId: integer("quizz_id"),
  score: integer("score"),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
});

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey().notNull(),
  fullName: text("full_name"),
  description: text("description"),
  userId: text("user_id").references(() => user.id),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey().notNull(),
  questionText: text("question_text"),
  quizzId: integer("quizz_id"),
});

export const answers = pgTable("answers", {
  id: serial("id").primaryKey().notNull(),
  questionId: integer("question_id"),
  answerText: text("answer_text"),
  isCorrect: boolean("is_correct"),
});

export const session = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey().notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "string" }).notNull(),
});

export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name"),
    email: text("email"),
    emailVerified: timestamp("emailVerified", { mode: "string" }),
    image: text("image"),
    stripeCustomerId: text("stripe_customer_id"),
    subscribed: boolean("subscribed"),
  },
  (table) => {
    return {
      userEmailUnique: unique("user_email_unique").on(table.email),
    };
  }
);

export const verificationToken = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "string" }).notNull(),
  },
  (table) => {
    return {
      verificationTokenIdentifierTokenPk: primaryKey({
        columns: [table.identifier, table.token],
        name: "verificationToken_identifier_token_pk",
      }),
    };
  }
);

export const authenticator = pgTable(
  "authenticator",
  {
    credentialId: text("credentialId").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (table) => {
    return {
      authenticatorUseridCredentialidPk: primaryKey({
        columns: [table.credentialId, table.userId],
        name: "authenticator_userid_credentialid_pk",
      }),
      authenticatorCredentialIdUnique: unique(
        "authenticator_credentialId_unique"
      ).on(table.credentialId),
    };
  }
);

export const account = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: text("token_type"),
    scope: text("scope"),
    idToken: text("id_token"),
    sessionState: text("session_state"),
  },
  (table) => {
    return {
      accountProviderProviderAccountIdPk: primaryKey({
        columns: [table.provider, table.providerAccountId],
        name: "account_provider_providerAccountId_pk",
      }),
    };
  }
);
