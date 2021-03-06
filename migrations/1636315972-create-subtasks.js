exports.up = async function (sql) {
  console.log("Creating table 'subtasks'...");
  await sql`
	CREATE TABLE subtasks (
		id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
		task_id integer NOT NULL,
		name VARCHAR(100) NOT NULL,
		is_done boolean,
		CONSTRAINT fk_tasks
		FOREIGN KEY (task_id)
		REFERENCES tasks(id)
	);`;
};

exports.down = async function (sql) {
  console.log("Deleting table 'subtasks'...");
  await sql`
		DROP TABLE subtasks;
	`;
};
