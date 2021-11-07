exports.up = async function (sql) {
  console.log("Creating table 'day_task'...");
  await sql`
	CREATE TABLE day_task (
		day_id integer NOT NULL,
		task_id integer NOT NULL,
		is_done boolean,
		CONSTRAINT fk_days
		FOREIGN KEY (day_id)
		REFERENCES days(id),
		CONSTRAINT fk_tasks
		FOREIGN KEY (task_id)
		REFERENCES tasks(id)
	);`;
};

exports.down = async function (sql) {
  console.log("Deleting table 'day_task'...");
  await sql`
		DROP TABLE day_task;
	`;
};
