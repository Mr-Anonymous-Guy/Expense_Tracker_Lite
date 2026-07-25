from contextlib import contextmanager

import psycopg
from psycopg.rows import dict_row

from .config import Config


@contextmanager
def get_connection():
    connection = psycopg.connect(Config.DATABASE_URL, row_factory=dict_row)
    try:
        yield connection
        connection.commit()
    except Exception:
      connection.rollback()
      raise
    finally:
      connection.close()


def fetch_all(query: str, params: tuple = ()):
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(query, params)
            return cursor.fetchall()


def fetch_one(query: str, params: tuple = ()):
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(query, params)
            return cursor.fetchone()


def execute_one(query: str, params: tuple = ()):
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(query, params)
            return cursor.fetchone()
