exports.up = async function (sql) {
  console.log("Creating table 'users'...");
  await sql`
	CREATE TABLE users (
		id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
		username varchar(40) UNIQUE NOT NULL,
    password_hash varchar(60) NOT NULL
	);`;
};

exports.down = async function (sql) {
  console.log("Deleting table 'users'...");
  await sql`
		DROP TABLE users;
	`;
};