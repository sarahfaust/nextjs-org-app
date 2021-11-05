exports.up = async function (sql) {
  console.log("Creating table 'warmup'...");
  await sql`
	CREATE TABLE warmup (
		id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
		day_id integer NOT NULL,
		review varchar(500),
		planning varchar(500),
		blockers varchar(500),
		is_realistic boolean,
		CONSTRAINT fk_day
		FOREIGN KEY (day_id)
		REFERENCES day(id)
	);`;
};

exports.down = async function (sql) {
  console.log("Deleting table 'warmup'...");
  await sql`
		DROP TABLE warmup;
	`;
};
