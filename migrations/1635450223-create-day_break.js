exports.up = async function (sql) {
  console.log("Creating table 'day_break'...");
  await sql`
	CREATE TABLE day_break (
		id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
		day_id integer NOT NULL,
		break_id integer NOT NULL,
		CONSTRAINT fk_day
		FOREIGN KEY (day_id)
		REFERENCES day(id),
		CONSTRAINT fk_break
		FOREIGN KEY (break_id)
		REFERENCES break(id)
	);`;
};

exports.down = async function (sql) {
  console.log("Deleting table 'day_break'...");
  await sql`
		DROP TABLE day_break;
	`;
};
