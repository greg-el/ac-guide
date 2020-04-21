import unittest
import testing.postgresql
import json
from db import *

def handler(postgresql):
        conn = psycopg2.connect(**postgresql.dsn())
        cur = conn.cursor()
        cur.execute("""
        CREATE TABLE inventory (
            uid varchar(28) PRIMARY KEY,
            pocket jsonb
        );
        """)
        test_uid = "yfgCi6FUA0b0i26rWLEXUSuV7cu1"
        with open("test_data.json", "r") as f:
            json_data = json.dumps(json.load(f))

        cur.execute("INSERT INTO inventory (uid, pocket) VALUES(%s, %s)", (test_uid, json_data))
        cur.close()
        conn.commit()
        conn.close()

Postgresql = testing.postgresql.PostgresqlFactory(cache_initialized_db=True, on_initialized=handler)

def tearDownModule(self):
    Postgresql.clear_cache()

class TestDatabaseMethods(unittest.TestCase):
    def setUp(self):
        self.postgresql = Postgresql()

    def get_data_test(self):
        conn = psycopg2.connect(**postgresql.dsn())
        cur = conn.cursor()
        test = get_from_db(cur, "yfgCi6FUA0b0i26rWLEXUSuV7cu1")
        self.assertEqual(test.fetchone(), '{"fish":{"anchovy":"0","frog":"1"},"bugs":{"ant":"1","brown cicada":"0"}}')

    def tearDown(self):
        self.postgresql.stop()



if __name__ == "__main__":
    unittest.main()
