from sqlalchemy import create_engine

engine = create_engine("postgres://postgres@/postgres")
conn = engine.connect()
conn.execute("commit")
conn.execute("create database acguide")
conn.execute("create user \"ac\"")
conn.commit()


