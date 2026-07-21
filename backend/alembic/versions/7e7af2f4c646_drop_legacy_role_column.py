"""drop legacy role column

Revision ID: 7e7af2f4c646
Revises: 0983986b3ee1
Create Date: 2026-07-21 14:26:16.628235

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7e7af2f4c646'
down_revision: Union[str, Sequence[str], None] = '0983986b3ee1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.drop_column(
        "users",
        "role"
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.add_column(
        "users",
        sa.Column(
            "role",
            sa.String(),
            nullable=True
        )
    )
