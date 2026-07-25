from datetime import date
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, field_validator


class RegisterInput(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginInput(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class ExpenseInput(BaseModel):
    merchant: str = Field(min_length=1, max_length=160)
    category: str = Field(min_length=1, max_length=80)
    amount: Decimal = Field(gt=0)
    spentAt: date
    note: str | None = Field(default=None, max_length=300)


class BudgetInput(BaseModel):
    category: str = Field(min_length=1, max_length=80)
    monthlyLimit: Decimal = Field(gt=0)


class InvestmentInput(BaseModel):
    asset: str = Field(min_length=1, max_length=160)
    kind: Literal["Mutual Fund", "ETF", "Stock", "Crypto", "Fixed Income"]
    units: Decimal = Field(ge=0)
    currentValue: Decimal = Field(ge=0)
    monthlySip: Decimal = Field(ge=0)
    goal: str = Field(min_length=1, max_length=180)

    @field_validator("asset", "goal")
    @classmethod
    def strip_text(cls, value: str) -> str:
        return value.strip()


class GoalInput(BaseModel):
    title: str = Field(min_length=1, max_length=160)
    targetAmount: Decimal = Field(gt=0)
    currentAmount: Decimal = Field(ge=0)
    deadline: date
    priority: Literal["High", "Medium", "Low"] = "Medium"

    @field_validator("title")
    @classmethod
    def strip_title(cls, value: str) -> str:
        return value.strip()


def validation_error(error):
    return {"error": "Validation failed", "details": error.errors()}
