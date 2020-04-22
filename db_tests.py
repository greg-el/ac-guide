import unittest
from psycopg2 import sql
from psycopg2.extensions import AsIs
import testing.postgresql
import json
from db import *


class TestDatabaseMethods(unittest.TestCase):
    def test_get_data(self):
        with testing.postgresql.Postgresql() as postgresql:
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


            with open("test_data.json", "r") as f:
                json_data = json.loads(f.readline())

            db_data = get_from_db(cur, "yfgCi6FUA0b0i26rWLEXUSuV7cu1")
            self.assertEqual(json_data['fish']['frog'], db_data[0]['fish']['frog'])
            self.assertEqual(json_data['fish']['anchovy'], db_data[0]['fish']['anchovy'])
            self.assertEqual(json_data['bugs']['brown cicada'], db_data[0]['bugs']['brown cicada'])
            self.assertEqual(json_data['bugs']['ant'], db_data[0]['bugs']['ant'])
            cur.close()

    def test_update_data(self):
         with testing.postgresql.Postgresql() as postgresql:
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
            db_data = get_from_db(cur, "yfgCi6FUA0b0i26rWLEXUSuV7cu1")
            self.assertEqual(db_data[0]['bugs']['ant'], "1")
            cur.execute("UPDATE inventory SET pocket = jsonb_set(pocket, '{%s, %s}', '%s', FALSE);", (AsIs('bugs'), AsIs('ant'), 0))
            after_db_data = get_from_db(cur, "yfgCi6FUA0b0i26rWLEXUSuV7cu1")
            self.assertEqual(after_db_data[0]['bugs']['ant'], 0)
            


if __name__ == "__main__":
    unittest.main()
