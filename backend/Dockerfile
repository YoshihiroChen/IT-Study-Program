FROM python:3.11-slim

# 系统依赖
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential curl && rm -rf /var/lib/apt/lists/*

# 安装 Poetry（不创建虚拟环境）
ENV POETRY_VERSION=1.8.3 POETRY_VIRTUALENVS_CREATE=false
RUN curl -sSL https://install.python-poetry.org | python3 - \
    && ln -s /root/.local/bin/poetry /usr/local/bin/poetry

WORKDIR /app

# 先拷贝依赖清单以利用缓存
COPY pyproject.toml poetry.lock* /app/

# 安装依赖
RUN poetry install --no-interaction --no-ansi

# 拷贝代码
COPY app /app/app

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
