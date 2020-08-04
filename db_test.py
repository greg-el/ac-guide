from flask import Flask
import unittest

from webapp.ac import db as database
from webapp.db import *


class TestDatabaseMethods(unittest.TestCase):


    def setUp(self):
        self.app = Flask(__name__)
        database.init_app(self.app)
        with self.app.app_context():
            database.create_all()



    def test_get(self):
        with self.app.app_context():
            psycopg2.extras.register_uuid()
            db_data = get_from_db(conn, self.test_uid, "fish")
            update_fish(conn, self.test_uid, "test_fish", 1)
            self.assertEqual(get_from_db(conn, self.test_uid, "fish"), db_data)


    def test_add_fish(self):
        conn = psycopg2.connect(**self.postgres.dsn())
        psycopg2.extras.register_uuid()
        update_fish(conn, self.test_uid, "test_fish", 1)
        self.assertEqual(get_from_db(conn, self.test_uid, "fish"), "test")

    def test_update_create(self):
        conn = psycopg2.connect(**self.postgres.dsn())
        psycopg2.extras.register_uuid()
        update_inventory(conn, self.test_uid, "bugs", "ant", 1)
        self.assertEqual(get_from_db(conn, self.test_uid)['bugs']['ant'], 1)

        update_inventory(conn, self.test_uid, "bugs", "ant", 0)
        self.assertEqual(get_from_db(conn, self.test_uid)['bugs']['ant'], 0)

        update_inventory(conn, self.test_uid, "bugs", "bar", 0)
        self.assertEqual(get_from_db(conn, self.test_uid)['bugs']['bar'], 0)


    def test_update(self):
        conn = psycopg2.connect(**self.postgres.dsn())
        psycopg2.extras.register_uuid()
        update_inventory(conn, self.test_uid, 'bugs', 'ant', 0)
        db_data = get_from_db(conn, self.test_uid)
        self.assertEqual(db_data['bugs']['ant'], 0)

        update_inventory(conn, self.test_uid, "bugs", "ant", 1)
        set_to_1_test = get_from_db(conn, self.test_uid)
        self.assertEqual(set_to_1_test['bugs']['ant'], 1)

        update_inventory(conn, self.test_uid, "bugs", "ant", 0)
        set_to_0_test = get_from_db(conn, self.test_uid)
        self.assertEqual(set_to_0_test['bugs']['ant'], 0)

        conn.commit()
        conn.close()

    def test_remove_user(self):
        conn = psycopg2.connect(**self.postgres.dsn())
        psycopg2.extras.register_uuid()
        remove_from_db(conn, self.test_uid)
        self.assertRaises(TypeError, get_from_db, conn, self.test_uid)

    def tearDown(self):
        self.postgres.stop()


if __name__ == "__main__":
    unittest.main()

