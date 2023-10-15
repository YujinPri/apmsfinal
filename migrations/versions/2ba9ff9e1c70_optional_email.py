"""optional email

Revision ID: 2ba9ff9e1c70
Revises: e5e3e363860b
Create Date: 2023-10-15 17:10:31.848873

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2ba9ff9e1c70'
down_revision: Union[str, None] = 'e5e3e363860b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
