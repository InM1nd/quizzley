import { pgTable, foreignKey, pgEnum, serial, text, timestamp, integer, boolean, unique, primaryKey } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const keyStatus = pgEnum("key_status", ['expired', 'invalid', 'valid', 'default'])
export const keyType = pgEnum("key_type", ['stream_xchacha20', 'secretstream', 'secretbox', 'kdf', 'generichash', 'shorthash', 'auth', 'hmacsha256', 'hmacsha512', 'aead-det', 'aead-ietf'])
export const aalLevel = pgEnum("aal_level", ['aal3', 'aal2', 'aal1'])
export const codeChallengeMethod = pgEnum("code_challenge_method", ['plain', 's256'])
export const factorStatus = pgEnum("factor_status", ['verified', 'unverified'])
export const factorType = pgEnum("factor_type", ['phone', 'webauthn', 'totp'])
export const oneTimeTokenType = pgEnum("one_time_token_type", ['phone_change_token', 'email_change_token_current', 'email_change_token_new', 'recovery_token', 'reauthentication_token', 'confirmation_token'])
export const quizzStatus = pgEnum("quizz_status", ['error', 'completed', 'processing'])
export const action = pgEnum("action", ['ERROR', 'TRUNCATE', 'DELETE', 'UPDATE', 'INSERT'])
export const equalityOp = pgEnum("equality_op", ['in', 'gte', 'gt', 'lte', 'lt', 'neq', 'eq'])


export const userActivityLogs = pgTable("user_activity_logs", {
	id: serial("id").primaryKey().notNull(),
	userId: text("user_id").references(() => user.id, { onDelete: "cascade" } ),
	activityType: text("activity_type").notNull(),
	description: text("description"),
	metadata: text("metadata"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const answers = pgTable("answers", {
	id: serial("id").primaryKey().notNull(),
	questionId: integer("question_id"),
	answerText: text("answer_text"),
	isCorrect: boolean("is_correct"),
});

export const feedbacks = pgTable("feedbacks", {
	id: serial("id").primaryKey().notNull(),
	userId: text("user_id").references(() => user.id),
	name: text("name").notNull(),
	email: text("email").notNull(),
	rating: text("rating"),
	feedback: text("feedback").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	premiumGranted: boolean("premium_granted").default(false),
	premiumEndDate: timestamp("premium_end_date", { mode: 'string' }),
});

export const questions = pgTable("questions", {
	id: serial("id").primaryKey().notNull(),
	questionText: text("question_text"),
	quizzId: integer("quizz_id"),
});

export const quizzSubmitions = pgTable("quizz_submitions", {
	id: serial("id").primaryKey().notNull(),
	quizzId: integer("quizz_id"),
	score: integer("score"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const quizzes = pgTable("quizzes", {
	id: serial("id").primaryKey().notNull(),
	fullName: text("full_name"),
	description: text("description"),
	userId: text("user_id").references(() => user.id),
	status: quizzStatus("status").default('completed'),
});

export const session = pgTable("session", {
	sessionToken: text("sessionToken").primaryKey().notNull(),
	userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" } ),
	expires: timestamp("expires", { mode: 'string' }).notNull(),
});

export const user = pgTable("user", {
	id: text("id").primaryKey().notNull(),
	name: text("name"),
	email: text("email"),
	emailVerified: timestamp("emailVerified", { mode: 'string' }),
	image: text("image"),
	stripeCustomerId: text("stripe_customer_id"),
	subscribed: boolean("subscribed"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	lastLoginAt: timestamp("last_login_at", { mode: 'string' }),
	loginCount: integer("login_count").default(0),
	totalQuizzesCreated: integer("total_quizzes_created").default(0),
	premiumExpiresAt: timestamp("premium_expires_at", { mode: 'string' }),
},
(table) => {
	return {
		userEmailUnique: unique("user_email_unique").on(table.email),
	}
});

export const verificationToken = pgTable("verificationToken", {
	identifier: text("identifier").notNull(),
	token: text("token").notNull(),
	expires: timestamp("expires", { mode: 'string' }).notNull(),
},
(table) => {
	return {
		verificationTokenIdentifierTokenPk: primaryKey({ columns: [table.identifier, table.token], name: "verificationToken_identifier_token_pk"})
	}
});

export const authenticator = pgTable("authenticator", {
	credentialId: text("credentialId").notNull(),
	userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" } ),
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
});

export const account = pgTable("account", {
	userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" } ),
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
		accountProviderProviderAccountIdPk: primaryKey({ columns: [table.provider, table.providerAccountId], name: "account_provider_providerAccountId_pk"})
	}
});